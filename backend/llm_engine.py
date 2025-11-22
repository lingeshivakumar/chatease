from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "microsoft/phi-1_5"

print("🔄 Loading Phi-1.5… ⏳")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    device_map="auto"
)

print("✅ Phi-1.5 Loaded!")


SYSTEM_PROMPT = (
    "You are a friendly and concise AI assistant. "
    "Keep replies short, clear, and directly relevant to the user's message."
)


def format_chat(user_msg: str) -> str:
    """
    Phi-1.5 expects: <|system|> ... <|user|> ... <|assistant|>
    These tags avoid prompt bleed and irrelevant continuations.
    """
    return (
        f"<|system|>\n{SYSTEM_PROMPT}\n"
        f"<|user|>\n{user_msg}\n"
        f"<|assistant|>\n"
    )


def get_llm_response(user_message):
    prompt = format_chat(user_message)

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=80,
        do_sample=False,               # deterministic = no nonsense
        temperature=0.3,               # crisp replies
        repetition_penalty=1.1,
        eos_token_id=tokenizer.eos_token_id,
    )

    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract only the assistant part
    if "<|assistant|>" in decoded:
        decoded = decoded.split("<|assistant|>")[-1].strip()

    return decoded