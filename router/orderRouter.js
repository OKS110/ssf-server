import express from 'express';
import * as controller from '../controller/orderController.js';

const router = express.Router();

router
    .post('/add', controller.addOrderItem)        // 개별 상품 주문
    .post('/all', controller.pullOrderList)       // 특정 회원의 주문 목록 조회
    .post('/cartOrderItems', controller.getCartOrderItems) // 선택한 장바구니 상품 가져오기
    .post("/deleteOrderedItems", controller.deleteOrderedCartItems)
    .delete('/cancel/:oid', controller.cancelOrder) // 주문 취소 기능 추가;
    .post("/updateOrderStatus", controller.updateOrderStatus);
    
export default router;
