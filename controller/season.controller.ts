import { Router } from "express";
import {
  filterCards,
  getSingle,
  getStream,
  searchSeason,
} from "../services/season.service.js";

const seasonController = Router();

seasonController.get("/", (req, res) => searchSeason(req, res));
seasonController.post("/filter", (req, res) => filterCards(req, res));
seasonController.get("/single/stream/:id", (req, res) => getStream(req, res));
seasonController.get("/single/:id", (req, res) => getSingle(req, res));

export default seasonController;
