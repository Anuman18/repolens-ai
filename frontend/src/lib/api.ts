import type { AnalysisResult } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeRepository(repoUrl: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

export function isValidGithubUrl(url: string): boolean {
  return /^https?:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(\.git)?(\/.*)?$/.test(url.trim());
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22d3a0";
  if (score >= 60) return "#4f8ef7";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}
