import * as repository from "../repository/reviewRepository.js";

/**  리뷰 저장 */
export const addReview = async (req, res) => {
    const { customer_id, product_id, order_id, rating, review_text, status } = req.body;

    if (!customer_id || !product_id || !order_id || rating === undefined) {
        return res.status(400).json({ error: "필수 값이 누락되었습니다." });
    }

    try {
        //  리뷰 저장 실행
        const result = await repository.addReview(customer_id, product_id, order_id, rating, review_text, status);
        if (!result.reviewInserted || !result.orderUpdated) {
            return res.status(500).json({ error: "리뷰 저장 또는 주문 상태 업데이트 실패" });
        }

        res.json({ success: true, message: "리뷰가 등록되었습니다." });
    } catch (error) {
        console.error("ERROR 리뷰 저장 오류:", error);
        res.status(500).json({ error: "리뷰 저장에 실패했습니다." });
    }
};


/**  특정 상품의 리뷰 가져오기 */
export const getReviewsByProduct = async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: "상품 ID가 필요합니다." });
    }

    try {
        const reviews = await repository.getReviewsByProduct(product_id);
        res.json({ success: true, reviews });
    } catch (error) {
        console.error("ERROR 리뷰 조회 오류:", error);
        res.status(500).json({ error: "리뷰 데이터를 불러오지 못했습니다." });
    }
};