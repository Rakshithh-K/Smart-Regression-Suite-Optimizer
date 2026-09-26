import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import OpenAI


load_dotenv()


class GeminiResponse:
    """
    Small wrapper so Gemini responses expose the same
    output_text attribute used by the existing matcher
    and explainer.
    """

    def __init__(self, text: str):
        self.output_text = text


class GeminiResponses:
    """
    Adapter around Gemini generate_content.

    The configured primary model is tried first.
    If Gemini returns a temporary availability or
    rate-limit error, fallback Gemini models are tried
    one by one.
    """

    def __init__(self, client):
        self.client = client

    def _generate(
        self,
        model: str,
        input: str,
    ) -> GeminiResponse:

        response = self.client.models.generate_content(
            model=model,
            contents=input,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )

        if response.text is None:
            raise ValueError(
                f"Gemini model '{model}' returned an empty response."
            )

        return GeminiResponse(response.text)

    def create(
        self,
        model: str,
        input: str,
    ) -> GeminiResponse:

        fallback_models = os.getenv(
            "GEMINI_FALLBACK_MODELS",
            "gemini-3.7-flash,gemini-3.6-flash,gemini-3.5-flash-lite",
        )

        models_to_try = [model]

        for fallback_model in fallback_models.split(","):
            fallback_model = fallback_model.strip()

            if (
                fallback_model
                and fallback_model not in models_to_try
            ):
                models_to_try.append(fallback_model)

        last_error = None

        for current_model in models_to_try:

            try:
                response = self._generate(
                    model=current_model,
                    input=input,
                )

                if current_model != model:
                    print(
                        f"Gemini primary model '{model}' "
                        f"was unavailable. "
                        f"Using fallback model "
                        f"'{current_model}'."
                    )

                return response

            except Exception as error:
                last_error = error

                error_code = getattr(
                    error,
                    "code",
                    None,
                )

                temporary_error_codes = {
                    429,
                    500,
                    502,
                    503,
                    504,
                }

                if error_code in temporary_error_codes:
                    print(
                        f"Gemini model '{current_model}' "
                        f"returned error {error_code}. "
                        f"Trying next available model."
                    )

                    continue

                raise

        raise RuntimeError(
            "All configured Gemini models are currently "
            "unavailable."
        ) from last_error


class GeminiProvider:
    """
    Gemini AI provider used by SRSO.
    """

    def __init__(self, api_key: str):
        client = genai.Client(
            api_key=api_key
        )

        self.responses = GeminiResponses(client)


def get_ai_provider():
    """
    Return the AI provider configured in .env.

    Supported providers:
    - mock
    - openai
    - gemini
    """

    provider = os.getenv(
        "AI_PROVIDER",
        "mock",
    ).lower()

    if provider == "mock":
        return "mock"

    if provider == "openai":
        api_key = os.getenv(
            "OPENAI_API_KEY"
        )

        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is not configured."
            )

        return OpenAI(
            api_key=api_key
        )

    if provider == "gemini":
        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured."
            )

        return GeminiProvider(
            api_key
        )

    raise ValueError(
        f"Unsupported AI provider: {provider}"
    )