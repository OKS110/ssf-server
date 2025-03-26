import express from "express";
import * as reviewController from "../controller/reviewController.js";

const router = express.Router();

//  리뷰 저장 API
router.post("/add", reviewController.addReview);

//  특정 상품의 리뷰 조회 API 추가
router.post("/list", reviewController.getReviewsByProduct);

export default router;
