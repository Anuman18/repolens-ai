import os
import shutil
import tempfile
import asyncio
from pathlib import Path

PRIORITY_FILES = [
    "README.md", "readme.md", "README.mdx",
    "package.json", "requirements.txt", "pyproject.toml",
    "tsconfig.json", "tsconfig.base.json",
    "Dockerfile", "docker-compose.yml", "docker-compose.yaml",
    ".env.example", "next.config.js", "next.config.ts",
    "vite.config.ts", "vite.config.js",
    "tailwind.config.ts", "tailwind.config.js",
    "prisma/schema.prisma",
]

PRIORITY_DIRS = ["src", "app", "api", "routes", "services", "models", "lib", "utils", "components"]

SKIP_DIRS = {
    "node_modules", ".git", ".next", "__pycache__", ".venv",
    "venv", "dist", "build", ".turbo", "coverage", ".cache",
    "out", ".vercel", ".netlify",
}

BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".zip", ".tar", ".gz", ".rar",
    ".mp4", ".mp3", ".wav", ".ogg",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".lock", ".bin", ".exe", ".dll", ".so",
}

MAX_FILE_SIZE = 50_000  # 50kb per file
MAX_TOTAL_CHARS = 80_000


def should_skip(path: Path) -> bool:
    return any(part in SKIP_DIRS for part in path.parts)


def is_binary(path: Path) -> bool:
    return path.suffix.lower() in BINARY_EXTENSIONS


def read_file_safe(path: Path) -> str | None:
    if path.stat().st_size > MAX_FILE_SIZE:
        return None
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return None


def collect_files(root: Path) -> dict[str, str]:
    files = {}

    # Priority files first
    for pf in PRIORITY_FILES:
        fp = root / pf
        if fp.exists() and fp.is_file() and not is_binary(fp):
            content = read_file_safe(fp)
            if content:
                files[pf] = content[:MAX_FILE_SIZE]

    # Priority directories
    for pd in PRIORITY_DIRS:
        dp = root / pd
        if not dp.exists():
            continue
        for path in sorted(dp.rglob("*"))[:60]:
            if path.is_file() and not should_skip(path.relative_to(root)) and not is_binary(path):
                rel = str(path.relative_to(root))
                if rel not in files:
                    content = read_file_safe(path)
                    if content:
                        files[rel] = content[:MAX_FILE_SIZE]

    return files


def detect_stack(files: dict[str, str]) -> list[str]:
    stack = set()
    all_content = " ".join(files.values()).lower()
    file_names = " ".join(files.keys()).lower()

    checks = {
        "Next.js": ["next.config", "\"next\"", "'next'"],
        "React": ["react", "jsx", "tsx"],
        "TypeScript": ["tsconfig.json", ".tsx", ".ts"],
        "Tailwind CSS": ["tailwindcss", "tailwind.config"],
        "Node.js": ["package.json", "node_modules"],
        "Express": ["express", "app.use(", "app.get("],
        "FastAPI": ["fastapi", "from fastapi"],
        "Flask": ["from flask", "import flask"],
        "Django": ["django", "from django"],
        "PostgreSQL": ["postgresql", "psycopg", "pg_"],
        "MongoDB": ["mongodb", "mongoose", "pymongo"],
        "Redis": ["redis", "ioredis"],
        "Prisma": ["prisma", "@prisma/client"],
        "Docker": ["dockerfile", "docker-compose"],
        "Python": ["requirements.txt", "pyproject.toml", ".py"],
        "Supabase": ["supabase", "@supabase"],
        "GraphQL": ["graphql", "apollo"],
        "tRPC": ["trpc", "@trpc"],
    }

    for tech, patterns in checks.items():
        if any(p in all_content or p in file_names for p in patterns):
            stack.add(tech)

    return sorted(stack)


async def clone_and_extract(repo_url: str) -> dict:
    tmpdir = tempfile.mkdtemp(prefix="repolens_")
    try:
        clean_url = repo_url.rstrip("/")
        if not clean_url.endswith(".git"):
            clean_url += ".git"

        proc = await asyncio.create_subprocess_exec(
            "git", "clone", "--depth=1", "--single-branch", clean_url, tmpdir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await asyncio.wait_for(proc.communicate(), timeout=60)

        if proc.returncode != 0:
            err = stderr.decode()
            if "Repository not found" in err or "does not exist" in err:
                raise ValueError("Repository not found or is private.")
            raise ValueError(f"Failed to clone repository: {err[:200]}")

        root = Path(tmpdir)
        files = collect_files(root)
        stack = detect_stack(files)

        # Build structured content string
        parts = []
        total = 0
        for name, content in files.items():
            chunk = f"\n--- FILE: {name} ---\n{content}"
            if total + len(chunk) > MAX_TOTAL_CHARS:
                break
            parts.append(chunk)
            total += len(chunk)

        parts_of_url = repo_url.replace("https://github.com/", "").rstrip("/").split("/")
        owner = parts_of_url[0] if len(parts_of_url) > 0 else "unknown"
        repo_name = parts_of_url[1] if len(parts_of_url) > 1 else "unknown"

        return {
            "repo_url": repo_url,
            "repo_name": f"{owner}/{repo_name}",
            "file_count": len(files),
            "detected_stack": stack,
            "file_tree": list(files.keys()),
            "content": "".join(parts),
        }

    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
