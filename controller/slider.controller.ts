import { Router } from "express";
import { getSlider } from "../services/slider.service.js";

const sliderController = Router();

sliderController.get("/", (_, res) => getSlider(_, res));

export default sliderController;
