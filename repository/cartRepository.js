import { db } from "./db.js";

// 아이디 번호 호출
export const getCustomerId = async ({ id }) => {
    const sql = `
        SELECT customer_id
        FROM customers
        WHERE username = ?
    `;

    const [result] = await db.execute(sql, [id]);

    // result가 없거나 배열이 비어있으면 함수 종료
    if (!result || result.length === 0) {
        console.log("respository :: No customer found.");
        return; // 아무 값도 반환하지 않고 종료
    }

    // console.log("respository :: result --> ", result[0].customer_id);
    return result[0].customer_id;
};

export const saveToCart = async (formData) => {
    // console.log(" 장바구니 추가 요청 데이터:", formData);
    const formSize = formData.size.toString().trim();
    const formColor = formData.color.toString().trim();
    //  기존에 동일한 상품이 있는지 확인
    const checkSql = `
        SELECT cid, quantity, total_price FROM cart
        WHERE customer_id = ? AND product_id = ? 
        AND size = ? AND color = ?
    `;
    const [existingItems] = await db.execute(checkSql, [formData.id, formData.pid, formSize, formColor]);
    if (existingItems.length > 0) {
        console.log(` 기존 상품 발견: CID ${existingItems[0].cid} → 수량 증가`);
        //  수량 증가된 총 가격 계산
        const updatedQuantity = existingItems[0].quantity + formData.count;
        const updatedTotalPrice = existingItems[0].total_price + (formData.count * formData.discounted_price);
        const updateSql = `
            UPDATE cart
            SET quantity = ?, total_price = ?
            WHERE cid = ?
        `;
        const [updateResult] = await db.execute(updateSql, [updatedQuantity, updatedTotalPrice, existingItems[0].cid]);
        console.log(` 수량 증가 완료: CID ${existingItems[0].cid}, 총 가격: ${updatedTotalPrice}`);
        return { "result_row": updateResult.affectedRows, "cid": existingItems[0].cid };
    } else {
        console.log(` 새로운 상품 추가: PID ${formData.pid}, SIZE ${formSize}, COLOR ${formColor}`);
        //  새로 추가할 상품의 총 가격 계산
        const totalPrice = formData.count * formData.discounted_price;
        const insertSql = `
            INSERT INTO cart(customer_id, product_id, quantity, size, color, total_price, added_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const insertValues = [formData.id, formData.pid, formData.count, formSize, formColor, totalPrice];
        const [insertResult] = await db.execute(insertSql, insertValues);
        console.log(` 새 상품 추가 완료: CID ${insertResult.insertId}, 총 가격: ${totalPrice}`);
        return { "result_row": insertResult.affectedRows, "cid": insertResult.insertId };
    }
};




// 아이디별 카트 상품 호출
export const getCartItems = async({id}) => {
    const sql = `
        select c.cid,
                c.customer_id,
                c.product_id,
                c.quantity,
                c.size,
                c.color,
                p.brand,
                p.name,
                format(p.original_price, 0) as original_price,
                p.discount_rate,
                format(p.discounted_price, 0) as discounted_price,
                p.image ->> '$[0]' as image,
                p.delivery_fee  --  배송비 추가
        from cart c, products p
        where c.product_id = p.pid
            and c.customer_id = ?
    `;
    const [result] = await db.execute(sql, [id]);
    return result;
};


// 상품 상세 페이지 옵션 업데이트
export const updateDetailQty = async ({ cid, size, color, quantity }) => {
    // console.log(` DB 업데이트 요청: CID ${cid}, Size: ${size}, Color: ${color}, Quantity: ${quantity}`);
    const sql = `
        UPDATE cart
        SET size = ?, color = ?, quantity = ?
        WHERE cid = ?
    `;
    try {
        const [result] = await db.execute(sql, [size, color, quantity, cid]);
        if (result.affectedRows === 0) {
            console.warn(` 업데이트 실패: CID ${cid}가 존재하지 않음`);
        } else {
            console.log(` 업데이트 성공: CID ${cid}, 변경된 행 수: ${result.affectedRows}`);
        }
        return { result_row: result.affectedRows };
    } catch (error) {
        console.error("ERROR DB 업데이트 중 오류 발생:", error);
        return { result_row: 0 };
    }
};

// 장바구니 페이지 상품 수량 변경
export const changeQty = async({cid, count}) => {
    const sql = `
        update cart
            set quantity = ${count}
        where cid = ?
    `;
    const [result] = await db.execute(sql, [cid]);
    return result; 
}

// 장바구니 페이지 - 아이템 개별 삭제
export const cartDeleteItem = async({cid}) => {
    const sql = `
        delete from cart where cid = ?
    `;
    const [result] = await db.execute(sql, [cid]);
    return {"result_row": result.affectedRows}
}

// 비회원일 때 장바구니 상품 데이터 호출
export const getGuestCartItems = async({pid}) => {
    const pids = pid.join(",");

    const sql = `
        select 
            pid,
            name,
            brand,
            color,
            size,
            image ->> '$[0]' as image,
            original_price,
            discount_rate,
            discounted_price
        from products
        where pid in (${pids})
    `;
    const [result] = await db.execute(sql);
    return result;
}