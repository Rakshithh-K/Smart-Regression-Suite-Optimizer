import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def get_ai_provider():
    provider = os.getenv("AI_PROVIDER", "mock").lower()

    if provider == "mock":
        return "mock"

    if provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is not configured."
            )

        return OpenAI(api_key=api_key)

    raise ValueError(
        f"Unsupported AI provider: {provider}"
    )