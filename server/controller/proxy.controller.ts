import { Router } from "express";
import { proxySegment, proxyStream } from "../services/proxy.service";

const proxyController = Router();

proxyController.get("/", (req, res) => proxyStream(req, res));
proxyController.get("/segment", (req, res) => proxySegment(req, res));

export default proxyController;
