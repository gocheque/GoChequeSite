import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description.fr,
    start_url: "/fr",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff6633",
    lang: "fr-CA",
    icons: [
      {
        src: "/logo.png",
        sizes: "851x488",
        type: "image/png",
      },
    ],
  };
}
