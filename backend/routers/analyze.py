from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.repo_service import clone_and_extract
from services.ai_service import analyze_with_ai
import re

router = APIRouter()


class AnalyzeRequest(BaseModel):
    repo_url: str


def is_valid_github_url(url: str) -> bool:
    pattern = r"^https?://github\.com/[\w\-\.]+/[\w\-\.]+(\.git)?(/.*)?$"
    return bool(re.match(pattern, url.strip()))


@router.post("/analyze")
async def analyze_repo(request: AnalyzeRequest):
    url = request.repo_url.strip().rstrip("/")

    if not is_valid_github_url(url):
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL.")

    repo_data = await clone_and_extract(url)
    analysis = await analyze_with_ai(repo_data)
    return analysis
