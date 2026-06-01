interface InsightCardProps {
  title: string;
  items: string[];
  accentColor: string;
  icon: string;
}

export function InsightCard({ title, items, accentColor, icon }: InsightCardProps) {
  return (
    <div className="bg-bg-2 border border-white/8 rounded-xl p-5">
      <p className="text-sm font-semibold mb-4" style={{ color: accentColor }}>
        {icon} {title}
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 leading-relaxed pl-3.5 relative">
            <span
              className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full"
              style={{ background: accentColor }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
