import { Router } from "express";
import categoryController from "../controller/category.controller.ts";
import sliderController from "../controller/slider.controller.ts";
import seasonController from "../controller/season.controller.ts";

const router = Router();

router.use("/category", categoryController);
router.use("/slider", sliderController);
router.use("/season", seasonController);

export default router;
