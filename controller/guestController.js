import * as repository from '../repository/guestRepository.js';

//  비회원 정보 추가 (중복 검사 후 저장)
export const addGuest = async (req, res) => {
    try {
        const guestData = req.body;
        console.log(" [DEBUG] 비회원 데이터 요청:", guestData);

        const newGuest = await repository.addGuest(guestData);
        console.log(" [DEBUG] 비회원 정보 저장 완료:", newGuest);

        res.json(newGuest); //  비회원 ID 반환
    } catch (error) {
        console.error("ERROR 비회원 추가 오류:", error);
        res.status(500).json({ error: "비회원 추가 실패" });
    }
};

//  비회원 주문 추가 (비회원 ID를 이용해 주문 저장)
export const addGuestOrder = async (req, res) => {
    try {
        const guest_id = req.body.guest_id;
        const orders = Object.values(req.body).filter(order => typeof order === 'object');  //  숫자 키 제거 후 배열 변환
        if (!guest_id) {
            throw new Error("guest_id가 없습니다.");
        }
        if (!orders || orders.length === 0) {
            throw new Error("주문 데이터가 없습니다.");
        }
        let savedOrders = [];
        for (const order of orders) {
            const guestOrderData = { ...order, guest_id };
            const newGuestOrder = await repository.addGuestOrder(guestOrderData);
            savedOrders.push(newGuestOrder);
        }
        // console.log(" 모든 주문 저장 완료:", savedOrders);
        res.json({ success: true, orders: savedOrders });
    } catch (error) {
        console.error("ERROR guest_orders 저장 오류:", error);
        res.status(500).json({ error: "guest_orders 저장 실패" });
    }
};

export const getGuestOrders = async (req, res) => {
    try {
        const { guest_id } = req.body;
        const orders = await repository.getGuestOrders(guest_id);
        res.json(orders);
    } catch (error) {
        console.error("ERROR 비회원 주문 조회 오류:", error);
        res.status(500).json({ error: "비회원 주문 조회 실패" });
    }
};
