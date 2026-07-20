import Image from "next/image";

/** Dimensions réelles de public/logo.png */
export const LOGO_WIDTH = 851;
export const LOGO_HEIGHT = 488;

type AppLogoProps = {
  alt: string;
  className?: string;
  priority?: boolean;
};

export function AppLogo({
  alt,
  className = "h-8 w-auto max-w-none object-contain",
  priority,
}: AppLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className}
      priority={priority}
    />
  );
}
