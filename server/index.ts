import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import router from "./router/index.ts";
import morgan from "morgan";
import proxyController from "./controller/proxy.controller.ts";
import { streamController } from "./controller/stream.controller.ts";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://172.22.200.2:5173"],
    methods: ["GET", "PUT", "PATCH", "POST"],
    credentials: true,
  }),
);

app.use(morgan("dev"));

const specs = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
      },
    ],
  },
  apis: ["./routes/*.ts"],
});

app.use("/api/", router);
app.use("/api/proxy", proxyController);
app.use("/api/stream", streamController);
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(specs));

// app.listen(PORT, () => {
//   console.log(`API running on http://localhost:${PORT}`);
// });

export default app;
