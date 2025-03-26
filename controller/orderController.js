import * as repository from '../repository/orderRepository.js';

export const addOrderItem = async(req, res) => {
    const result = await repository.addOrderItem(req.body);
    res.json(result);
    res.end();
}

export const pullOrderList = async(req, res) => {
    const result = await repository.pullOrderList(req.body.id);
    res.json(result);
    res.end();
}

export const getCartOrderItems = async (req, res) => {
    const { cids } = req.body;
    if (!cids || cids.length === 0) {
        return res.status(400).json({ message: "선택된 상품이 없습니다." });
    }
    const result = await repository.getCartOrderItems(cids);
    res.json(result);
};

//  주문된 상품을 cart 테이블에서 삭제하는 함수
export const deleteOrderedCartItems = async (req, res) => {
    try {
        const { customer_id, orderedItems } = req.body;
        console.log(" [DEBUG] 장바구니에서 삭제할 상품:", orderedItems);

        const result = await repository.deleteOrderedCartItems(customer_id, orderedItems);
        res.json(result);
    } catch (error) {
        console.error("ERROR 장바구니에서 주문된 상품 삭제 실패:", error);
        res.status(500).json({ error: "장바구니에서 주문된 상품 삭제 실패" });
    }
};

export const cancelOrder = async (req, res) => {
    const { oid } = req.params; //  URL에서 `oid` 추출

    try {
        console.log(`주문 취소 요청: oid=${oid}`);
        const result = await repository.deleteOrder(oid);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "해당 주문을 찾을 수 없습니다." });
        }

        res.json({ success: true, message: "주문이 취소되었습니다." });
    } catch (error) {
        console.error("ERROR 주문 취소 오류:", error);
        res.status(500).json({ error: "서버 오류로 인해 주문을 취소할 수 없습니다." });
    }
};

export const updateOrderStatus = async (req, res) => {
    console.log(" [DEBUG] 고객 서버: 주문 상태 업데이트 요청 수신:", req.body);

    const { oid, status, isGuest } = req.body;
    if (!oid || !status) {
        return res.status(400).json({ error: "주문 ID와 상태 값이 필요합니다." });
    }

    try {
        let updated;
        if (isGuest) {
            updated = await repository.updateGuestOrderStatusDB(oid, status);
        } else {
            updated = await repository.updateOrderStatusDB(oid, status);
        }

        if (updated) {
            //  주문 상태 변경 후 WebSocket 메시지 전송
            notifyOrderUpdate(oid, status);

            res.json({ success: true, message: "주문 상태가 업데이트되었습니다." });
        } else {
            res.status(404).json({ error: "주문을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("ERROR 고객 서버 주문 상태 업데이트 오류:", error);
        res.status(500).json({ error: "주문 상태 변경 실패" });
    }
};
