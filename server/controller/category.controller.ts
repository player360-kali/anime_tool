import { Router } from "express";
import { getCategories } from "../services/category.service.ts";

const categoryController = Router();

categoryController.get("/", (_, res) => getCategories(_, res));

export default categoryController;
