import os


# Unit tests use the deterministic mock AI provider.
# Live Gemini testing is done separately.
os.environ["AI_PROVIDER"] = "mock"  