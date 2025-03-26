import { db } from "./db.js";

/**  리뷰 저장 + 주문 상태 업데이트 */
export const addReview = async (customer_id, product_id, order_id, rating, review_text, status) => {
    const connection = await db.getConnection(); //  트랜잭션 시작
    await connection.beginTransaction();

    try {
        //  리뷰 저장
        const reviewSql = `
            INSERT INTO reviews (customer_id, product_id, order_id, rating, review_text, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const [reviewResult] = await connection.execute(reviewSql, [
            Number(customer_id),
            Number(product_id),
            Number(order_id),
            Number(rating),
            review_text || "",
            status || "Pending"
        ]);

        //  주문 테이블 `status` 업데이트
        const orderSql = `UPDATE orders SET status = 'Reviewed' WHERE oid = ?`;
        const [orderUpdateResult] = await connection.execute(orderSql, [Number(order_id)]);

        await connection.commit(); //  트랜잭션 커밋
        connection.release();

        return { reviewInserted: reviewResult.affectedRows > 0, orderUpdated: orderUpdateResult.affectedRows > 0 };
    } catch (error) {
        await connection.rollback(); // ERROR 오류 발생 시 롤백
        connection.release();
        console.error("ERROR 리뷰 저장 및 주문 상태 업데이트 오류:", error);
        throw error;
    }
};


/**  특정 product_id에 해당하는 리뷰 조회 */
export const getReviewsByProduct = async (product_id) => {
    try {
        const sql = `
            SELECT r.rid, r.product_id, r.customer_id, r.rating, r.review_text, r.created_at,
                   c.name, c.email
            FROM reviews r
            JOIN customers c ON r.customer_id = c.customer_id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `;

        const [reviews] = await db.execute(sql, [Number(product_id)]);
        return reviews;
    } catch (error) {
        console.error("ERROR 리뷰 데이터 조회 오류:", error);
        throw error;
    }
};