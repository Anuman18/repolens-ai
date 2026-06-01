import { getScoreColor } from "@/lib/api";

interface ScoreCardProps {
  label: string;
  icon: string;
  value: number;
}

export function ScoreCard({ label, icon, value }: ScoreCardProps) {
  const color = getScoreColor(value);
  return (
    <div className="bg-bg-2 border border-white/8 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-2">
        {icon} {label}
      </p>
      <p className="text-3xl font-bold font-mono mb-2 leading-none" style={{ color }}>
        {value}
      </p>
      <div className="h-1 bg-bg-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
