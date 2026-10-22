import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cloudflareConfig = defineCloudflareConfig();

const openNextConfig = {
  ...cloudflareConfig,
  // OpenNext's default is `pnpm build`. That script is this adapter, so it
  // has to invoke `next build` directly or the build recurses.
  buildCommand: "pnpm exec next build",
};

export default openNextConfig;
