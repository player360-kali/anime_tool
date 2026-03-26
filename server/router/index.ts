import { Router } from "express";
import categoryController from "../controller/category.controller.js";
import sliderController from "../controller/slider.controller.js";
import seasonController from "../controller/season.controller.js";

const router = Router();

router.use("/category", categoryController);
router.use("/slider", sliderController);
router.use("/season", seasonController);

export default router;
