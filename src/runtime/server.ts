import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMockApiRouter } from "./httpApi";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number.parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "32kb" }));
app.use(createMockApiRouter());

async function startServer() {
  if (process.env.NODE_ENV === "production") {
    const distributionDirectory = path.resolve(currentDirectory, "../../dist");
    app.use(express.static(distributionDirectory));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distributionDirectory, "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Sentinel mock runtime listening on http://0.0.0.0:${port}`);
  });
}

startServer();
