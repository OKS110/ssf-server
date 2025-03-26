import { db } from './db.js';

/** 상품 데이터 전체 호출 **/
export const getProductAll = async() => {
    const sql = `select pid,
                        category,
                        sub_category,
                        name as title,
                        image,
                        image->>'$[0]' as img,
                        likes,
                        star,
                        stock as reviewCount,
                        format(original_price, 0) as costprice,
                        discount_rate as discount,
                        format(discounted_price, 0) as saleprice,
                        brand
                from products
                ORDER BY star DESC`;;

    const [result] = await db.execute(sql);

    return result;
}

/** 상품 아이디별 데이터 호출 **/
export const getItem = async({pid}) => {
    if (!pid) {
        console.error("getItem 호출 시 pid 값이 없습니다.");
        return null;
    }

    // console.log("getItem 실행됨 - pid:", pid);
    const sql = `
        select pid,
                category,
                sub_category,
                name as title,
                image,
                image->>'$[0]' as img,
                likes,
                star,
                stock as reviewCount,
                format(original_price, 0) as costprice,
                discount_rate as discount,
                format(discounted_price, 0) as saleprice,
                brand,
                size,
                color,
                delivery_fee as deliveryFee,
                description
        from products
        where pid = ?
    `;

    const [result] = await db.execute(sql, [pid]);
    return result[0];
}