import path from "path";

// Hard-code some dummy values for the environment variables so that we can run the tests without needing to set them up
// If the CLI ever evolves to run the tests itself, we can rely on it to give us these values
process.env.SHOPIFY_API_KEY = "93cebd74018652c42e83f6f0af9d016c";
process.env.SHOPIFY_API_SECRET = "5cedb7cf3ccf9bca708017db1a9ce2c1";
process.env.HOST = "TEST_TUNNEL_URL";
process.env.SCOPES = "TEST_SCOPES";
process.env.BACKEND_PORT = 9528;
process.env.FRONTEND_PORT = 9529;

/**
 * @param {string} root
 * @param {boolean} isProd
 */
export async function serve(root, isProd, billingSettings) {
  if (isProd) {
    // build first
    const { build } = await import("vite");
    await build({
      root: path.join(root, "frontend"),
      logLevel: "silent",
      build: {
        target: "esnext",
        minify: false,
        ssrManifest: true,
        outDir: "dist",
      },
    });
  }

  const { createServer } = await import(path.resolve(root, "index.js"));

  return await createServer(root, isProd, billingSettings);
}
