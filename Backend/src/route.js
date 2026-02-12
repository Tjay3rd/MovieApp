import { Router } from "express";
import { updateSearchCount, trendingMovies } from "./controller.js";

const router = Router();

router.post("/searchcount", updateSearchCount);
router.get("/trending", trendingMovies);

export default router;
