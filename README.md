# RepoLens AI

AI-powered GitHub repository analyzer. Paste any public repo URL and get a professional engineering review — architecture scores, tech stack detection, and senior-level recommendations.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 15, TypeScript, Tailwind CSS |
| Backend   | FastAPI, Python 3.11+               |
| AI        | OpenAI GPT-4o                       |
| Git       | System `git` (no GitPython required) |

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git** installed and on PATH
- **OpenAI API key** — get one at https://platform.openai.com/api-keys

---

## Setup

### 1. Clone / unzip this project

```bash
cd repolens
```

### 2. Backend setup

```bash
cd backend

# Copy and fill in your OpenAI key
cp .env.example .env
# Edit .env: OPENAI_API_KEY=sk-...

# Create virtualenv
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000
API docs (Swagger): http://localhost:8000/docs

### 3. Frontend setup

```bash
cd frontend

# Copy env file
cp .env.local.example .env.local

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Usage

1. Open http://localhost:3000
2. Paste a public GitHub repo URL (e.g. `https://github.com/vercel/next.js`)
3. Click **Analyze**
4. Wait ~15–30s for the report to generate
5. View scores, insights, and recommendations on the dashboard

---

## API Reference

### `POST /analyze`
Analyzes a GitHub repository.

**Request body:**
```json
{ "repo_url": "https://github.com/owner/repo" }
```

**Response:** Full analysis JSON including scores, strengths, weaknesses, recommendations.

### `GET /health`
Returns service health status.

---

## Project Structure

```
repolens/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── routers/
│   │   └── analyze.py           # POST /analyze route
│   ├── services/
│   │   ├── repo_service.py      # Git clone + file extraction
│   │   └── ai_service.py        # OpenAI analysis
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx          # Landing page
    │   │   ├── analyze/page.tsx  # Loading/progress page
    │   │   └── dashboard/page.tsx # Results dashboard
    │   ├── components/
    │   │   ├── ScoreCard.tsx
    │   │   └── InsightCard.tsx
    │   └── lib/
    │       ├── api.ts            # API client
    │       └── types.ts          # TypeScript types
    ├── package.json
    ├── tailwind.config.ts
    └── next.config.mjs
```

---

## Notes

- Only **public** repositories are supported
- Large repos (>1000 files) are analyzed using a smart subset of priority files
- Analysis costs ~$0.01–0.05 per repo with GPT-4o depending on repo size
- Results are stored in `sessionStorage` — no database needed for MVP

---

## License

MIT
