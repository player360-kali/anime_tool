import { Router } from "express";
import categoryController from "../controller/category.controller";
import sliderController from "../controller/slider.controller";
import seasonController from "../controller/season.controller";

const router = Router();

router.use("/category", categoryController);
router.use("/slider", sliderController);
router.use("/season", seasonController);

export default router;
