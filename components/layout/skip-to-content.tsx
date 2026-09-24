export function SkipToContent({ label }: { label: string }) {
  return (
    <a
      href="#contenu"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-[#0b1f33] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white"
    >
      {label}
    </a>
  );
}
