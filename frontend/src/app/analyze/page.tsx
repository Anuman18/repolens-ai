"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { analyzeRepository } from "@/lib/api";
import { Suspense } from "react";

const STEPS = [
  "Cloning repository",
  "Detecting tech stack",
  "Scanning project structure",
  "Running AI analysis",
  "Generating engineering report",
];

function AnalyzeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const repoUrl = params.get("url") || "";
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!repoUrl || hasStarted.current) return;
    hasStarted.current = true;

    const stepInterval = setInterval(() => {
      setCurrentStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1200);

    analyzeRepository(repoUrl)
      .then((result) => {
        clearInterval(stepInterval);
        setCurrentStep(STEPS.length);
        sessionStorage.setItem("repolens_result", JSON.stringify(result));
        setTimeout(() => router.push("/dashboard"), 400);
      })
      .catch((err) => {
        clearInterval(stepInterval);
        setErrorMsg(err.message || "Analysis failed. Please try again.");
      });

    return () => clearInterval(stepInterval);
  }, [repoUrl, router]);

  if (!repoUrl) {
    router.replace("/");
    return null;
  }

  return (
    <main className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 text-center">
      {/* Pulse icon */}
      <div className="w-20 h-20 rounded-full accent-gradient flex items-center justify-center text-3xl mb-8
        [animation:pulse_2s_ease-in-out_infinite]
        [@keyframes_pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:0.85}}]">
        🔍
      </div>

      <h1 className="text-2xl font-bold mb-2">Analyzing repository</h1>
      <p className="font-mono text-sm text-gray-500 mb-10 break-all max-w-sm">{repoUrl}</p>

      {errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 max-w-sm">
          <p className="text-red-400 text-sm mb-3">{errorMsg}</p>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-gray-400 hover:text-white underline"
          >
            ← Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300
                  ${i < currentStep ? "bg-c-green" : ""}
                  ${i === currentStep ? "bg-accent animate-pulse" : ""}
                  ${i > currentStep ? "bg-white/15" : ""}`}
              />
              <span
                className={`transition-colors duration-300
                  ${i < currentStep ? "text-c-green" : ""}
                  ${i === currentStep ? "text-white" : ""}
                  ${i > currentStep ? "text-gray-600" : ""}`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid-bg flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
