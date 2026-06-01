"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, Zap, ShieldCheck, GitBranch } from "lucide-react";
import { isValidGithubUrl } from "@/lib/api";

const EXAMPLES = [
  "https://github.com/vercel/next.js",
  "https://github.com/fastapi/fastapi",
  "https://github.com/shadcn-ui/ui",
  "https://github.com/supabase/supabase",
];

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    if (!url.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }
    if (!isValidGithubUrl(url)) {
      setError("Invalid URL. Use format: https://github.com/owner/repo");
      return;
    }
    setError("");
    router.push(`/analyze?url=${encodeURIComponent(url.trim())}`);
  };

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center accent-gradient">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Repo<span className="text-accent">Lens</span> AI
          </span>
        </div>

        {/* Hero */}
        <h1 className="text-5xl font-bold leading-[1.12] tracking-tight mb-5">
          AI-powered<br />
          <span className="text-gradient">code review</span><br />
          in seconds
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
          Paste any public GitHub repo URL and get a professional engineering analysis — architecture scores, stack detection, and senior-level recommendations.
        </p>

        {/* Input */}
        <div
          className={`flex gap-2 bg-bg-3 rounded-2xl p-2 mb-3 border transition-all
            ${error ? "border-red-500/50" : "border-white/10 focus-within:border-accent/60 focus-within:shadow-[0_0_0_3px_rgba(79,142,247,0.1)]"}`}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="https://github.com/owner/repository"
            className="flex-1 bg-transparent outline-none text-white font-mono text-sm px-3 py-2 min-w-0 placeholder:text-gray-600"
          />
          <button
            onClick={handleAnalyze}
            className="accent-gradient text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            Analyze <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs font-mono text-left px-2 mb-3">{error}</p>
        )}

        {/* Examples */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {EXAMPLES.map((ex) => {
            const label = ex.replace("https://github.com/", "");
            return (
              <button
                key={ex}
                onClick={() => { setUrl(ex); setError(""); }}
                className="bg-bg-3 border border-white/8 rounded-full px-3.5 py-1.5 text-xs font-mono text-gray-500 hover:border-accent/40 hover:text-accent transition-all"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: GitBranch, title: "Architecture Review", desc: "Scores for structure, scalability, and code organization" },
            { icon: Zap, title: "Stack Detection", desc: "Auto-detects frameworks, databases, and tooling" },
            { icon: ShieldCheck, title: "Senior Insights", desc: "Production-ready recommendations from an AI engineer" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-bg-2 border border-white/8 rounded-xl p-4 text-left">
              <Icon className="w-5 h-5 text-accent mb-2.5" />
              <p className="text-sm font-semibold mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
