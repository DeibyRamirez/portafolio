import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/portafoliodeibyramirez.firebasestorage.app/o/**",
      },
    ],
  },
};

export default nextConfig;

// Bindings locales solo durante `next dev`. El build de producción no debe
// levantar el proxy de Wrangler. Omite con SKIP_OPENNEXT_DEV=1 si no usas
// getCloudflareContext en local (arranque más rápido).
if (
  process.env.NODE_ENV === "development" &&
  process.env.SKIP_OPENNEXT_DEV !== "1"
) {
  void import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) =>
    initOpenNextCloudflareForDev(),
  );
}
