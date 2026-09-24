import { siteConfig } from "@/lib/seo/site";

type AppBrandNameProps = {
  className?: string;
};

export function AppBrandName({ className = "" }: AppBrandNameProps) {
  const name = siteConfig.name;
  const accent = name.slice(0, 2);
  const rest = name.slice(2);

  return (
    <span className={`font-[family-name:var(--font-comfortaa)] font-black tracking-tight ${className}`}>
      <span className="text-[#ff6633]">{accent}</span>
      <span className="text-slate-900">{rest}</span>
    </span>
  );
}
