import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./router/index.js";
import morgan from "morgan";
import proxyController from "./controller/proxy.controller.js";
import { streamController } from "./controller/stream.controller.js";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:5173",
        "https://anime-tool-xl3i.vercel.app",
      ];

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.get("/check", (_, res) => res.send("OK"));
app.use("/api/", router);
app.use("/api/proxy", proxyController);
app.get("/api/stream", streamController);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;
