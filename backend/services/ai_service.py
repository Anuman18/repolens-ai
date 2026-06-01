
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """You are a senior software architect performing a professional code review.
Analyze the provided repository content and return ONLY valid JSON — no markdown fences, no preamble."""


def build_prompt(repo_data: dict) -> str:
    stack_str = ", ".join(repo_data["detected_stack"]) or "Unknown"
    file_tree = "\n".join(repo_data["file_tree"][:40])

    return f"""Repository: {repo_data["repo_name"]}
URL: {repo_data["repo_url"]}
Detected stack (preliminary): {stack_str}
File count analyzed: {repo_data["file_count"]}

File tree:
{file_tree}

Repository content:
{repo_data["content"][:70000]}

Analyze this repository and return this exact JSON structure:
{{
  "repo_name": "{repo_data["repo_name"]}",
  "repo_url": "{repo_data["repo_url"]}",
  "description": "one sentence description of what this project does",
  "detected_stack": ["refined", "list", "of", "technologies"],
  "scores": {{
    "architecture": <0-100>,
    "readability": <0-100>,
    "scalability": <0-100>,
    "documentation": <0-100>,
    "security": <0-100>,
    "overall": <0-100>
  }},
  "strengths": ["3-5 specific strengths with concrete examples from the code"],
  "weaknesses": ["3-5 specific weaknesses or gaps observed"],
  "senior_recommendations": ["5-7 actionable senior engineer recommendations"],
  "production_improvements": ["3-5 things to fix before production"],
  "verdict": "2-3 sentence overall engineering verdict"
}}"""


async def analyze_with_ai(repo_data: dict) -> dict:
    prompt = build_prompt(repo_data)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
        temperature=0.3,
    )

    raw = response.choices[0].message.content

    try:
        result = json.loads(raw)
    except:
        return {
            "error": "AI returned invalid JSON",
            "raw_response": raw
        }

    merged_stack = list(
        set(repo_data["detected_stack"]) |
        set(result.get("detected_stack", []))
    )

    result["detected_stack"] = sorted(merged_stack)

    return result
