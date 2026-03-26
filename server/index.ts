import "dotenv/config";
import express from "express";
import cors from "cors";
// import swaggerUi from "swagger-ui-express";
// import swaggerJSDoc from "swagger-jsdoc";
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

// const specs = swaggerJSDoc({
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "API",
//       version: "1.0.0",
//     },
//     servers: [
//       {
//         url: `http://localhost:${PORT}/api`,
//       },
//     ],
//   },
//   apis: ["./routes/*.ts"],
// });

app.get("/check", (_, res) => res.send("OK"));
app.use("/api/", router);
app.use("/api/proxy", proxyController);
app.get("/api/stream", streamController);
// app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;
