"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, ExternalLink } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { ScoreCard } from "@/components/ScoreCard";
import { InsightCard } from "@/components/InsightCard";
import { getScoreColor } from "@/lib/api";

const SCORE_CARDS = [
  { label: "Architecture", icon: "⚙️", key: "architecture" },
  { label: "Readability", icon: "📖", key: "readability" },
  { label: "Scalability", icon: "📈", key: "scalability" },
  { label: "Documentation", icon: "📄", key: "documentation" },
  { label: "Security", icon: "🔒", key: "security" },
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("repolens_result");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setAnalysis(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!analysis) return null;

  const overallColor = getScoreColor(analysis.scores.overall);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 accent-gradient rounded-lg flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold tracking-tight">
            Repo<span className="text-accent">Lens</span> AI
          </span>
        </div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs text-gray-500 bg-bg-3 border border-white/8 rounded-lg px-3 py-2 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> New analysis
        </button>
      </div>

      {/* Repo overview card */}
      <div className="bg-bg-2 border border-white/8 rounded-2xl p-6 mb-4 flex gap-4 flex-wrap">
        <div className="text-4xl">📦</div>
        <div className="flex-1 min-w-48">
          <h1 className="text-xl font-bold font-mono mb-1">{analysis.repo_name}</h1>
          <a
            href={analysis.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-gray-500 hover:text-accent flex items-center gap-1 mb-3 w-fit transition-colors"
          >
            {analysis.repo_url} <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{analysis.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.detected_stack.map((tech) => (
              <span
                key={tech}
                className="bg-accent/10 border border-accent/20 text-accent text-xs font-mono rounded-md px-2.5 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="text-center bg-gradient-to-br from-accent/8 to-purple-500/8 border border-accent/15 rounded-xl px-6 py-4 self-start">
          <p className="text-5xl font-bold font-mono score-gradient leading-none mb-1">
            {analysis.scores.overall}
          </p>
          <p className="text-xs text-gray-500">overall score</p>
        </div>
      </div>

      {/* Score cards */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
        Engineering Scores
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {SCORE_CARDS.map(({ label, icon, key }) => (
          <ScoreCard
            key={key}
            label={label}
            icon={icon}
            value={analysis.scores[key]}
          />
        ))}
      </div>

      {/* Strengths + Weaknesses */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
        AI Insights
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <InsightCard
          title="Strengths"
          icon="✅"
          items={analysis.strengths}
          accentColor="#22d3a0"
        />
        <InsightCard
          title="Weaknesses"
          icon="⚠️"
          items={analysis.weaknesses}
          accentColor="#f87171"
        />
      </div>

      {/* Senior recommendations */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
        Senior Recommendations
      </p>
      <div className="bg-bg-2 border border-white/8 rounded-xl p-5 mb-4">
        {analysis.senior_recommendations.map((rec, i) => (
          <div
            key={i}
            className={`flex gap-3 py-3.5 ${i < analysis.senior_recommendations.length - 1 ? "border-b border-white/6" : ""}`}
          >
            <div className="w-6 h-6 flex-shrink-0 bg-accent/10 border border-accent/20 rounded-md flex items-center justify-center text-accent text-xs font-mono font-semibold mt-px">
              {String(i + 1).padStart(2, "0")}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>

      {/* Before production */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
        Before Production
      </p>
      <InsightCard
        title="Production improvements"
        icon="🚀"
        items={analysis.production_improvements}
        accentColor="#fbbf24"
      />

      {/* Verdict */}
      <div className="mt-4 bg-gradient-to-br from-accent/6 to-c-green/6 border border-accent/15 rounded-xl p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Engineering Verdict</p>
        <p className="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">{analysis.verdict}</p>
      </div>
    </main>
  );
}
