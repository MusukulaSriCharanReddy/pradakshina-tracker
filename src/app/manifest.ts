import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pradakshina Tracker — Devotional Counter",
    short_name: "Pradakshina",
    description: "A calm, mobile-first devotional companion for temple circumambulations.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F1E6",
    theme_color: "#F7F1E6",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

