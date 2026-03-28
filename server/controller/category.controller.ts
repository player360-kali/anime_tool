import { Router } from "express";
import { getCategories, getJanr } from "../services/category.service.js";

const categoryController = Router();

categoryController.get("/", (_, res) => getCategories(_, res));
categoryController.get("/janr", (_, res) => getJanr(_, res));

export default categoryController;
