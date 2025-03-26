import { db } from './db.js';

//  비회원 정보 추가 또는 기존 ID 반환
export const addGuest = async (guestData) => {
    try {
        //  기존 비회원 확인
        const checkSql = `SELECT gid FROM guests WHERE name = ? AND email = ? AND phone = ?;`;
        const [existingGuest] = await db.execute(checkSql, [
            guestData.name, guestData.email || null, guestData.phone
        ]);
        if (existingGuest.length > 0) {
            console.log(" 기존 비회원 존재:", existingGuest[0]);
            return { gid: existingGuest[0].gid }; // 기존 `gid` 반환
        }
        //  새로운 비회원 추가
        const insertSql = `
            INSERT INTO guests (name, phone, email, address, zipcode, detail_address)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [result] = await db.execute(insertSql, [
            guestData.name, guestData.phone, guestData.email || null,
            guestData.address || null, guestData.zipcode || null, guestData.detail_address || null
        ]);
        // console.log(" 신규 비회원 추가 완료:", result);
        return { gid: result.insertId }; // 신규 `gid` 반환
    } catch (error) {
        console.error("ERROR 비회원 추가 오류:", error);
        throw error;
    }
};

//  비회원 주문 추가 중복처리 필요
export const addGuestOrder = async (guestOrderData) => {
    try {
        if (!guestOrderData.guest_id) {
            throw new Error("guest_id가 없습니다.");
        }
        const orderNumber = `G_ORD-${Date.now()}-${guestOrderData.guest_id}`;
        const sql = `
            INSERT INTO guest_orders (
                guest_id, order_number, brand, title, total_price, 
                size, color, quantity, zipcode, shipping_address, 
                delivery_message, detail_address, status, refund_amount, 
                order_date, payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?);
        `;
        const [result] = await db.execute(sql, [
            guestOrderData.guest_id, orderNumber, guestOrderData.brand, guestOrderData.title, 
            guestOrderData.total_price ?? 0, guestOrderData.size, guestOrderData.color, 
            guestOrderData.quantity, guestOrderData.zipcode || null, 
            guestOrderData.shipping_address || null, guestOrderData.delivery_message || null, 
            guestOrderData.detail_address || null, guestOrderData.status || "Pending", 
            guestOrderData.refund_amount ?? 0, guestOrderData.payment_method || null,
        ]);
        // console.log(" guest_orders 저장 완료:", result);
        return { order_id: result.insertId, order_number: orderNumber, guest_id: guestOrderData.guest_id };
    } catch (error) {
        console.error("ERROR guest_orders 저장 오류:", error);
        throw error;
    }
};

export const pullOrderList = async (user_id) => {
    const sql = `
        SELECT o.*, p.image 
        FROM orders o
        LEFT JOIN products p ON o.title = p.name
        WHERE o.customer_id = ?
        ORDER BY o.order_date DESC;
    `;
    const [orders] = await db.execute(sql, [user_id]);
    return orders;
};


export const getGuestOrders = async (guest_id) => {
    const sql = `
        SELECT g.*, p.image 
        FROM guest_orders g
        LEFT JOIN products p ON g.title = p.name
        WHERE g.guest_id = ?
        ORDER BY g.order_date DESC;
    `;
    const [orders] = await db.execute(sql, [guest_id]);
    return orders;
};