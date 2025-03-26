import { db } from './db.js';

// 고객 테이블 전체
export const getCustomers = async() => { 
    const sql = `
        select 
            customer_id, username,
            email, phone, name, password, address, detail_address,
            additional_address, birth_date, status, gender, membership_level,
            loyalty_points, last_login, created_at, updated_at 
        from customers;
    `;

    const [result] = await db.execute(sql);
    
    return result;
}
//  고객 테이블에서 한 명 가져오기
export const getCustomer = async(username) => {
    const sql = `
        select 
            customer_id, username,
            email, phone, name, password, zipcode, address, detail_address,
            additional_address, birth_date, status, gender, membership_level,
            loyalty_points, last_login, created_at, updated_at 
        from customers
        where binary username = ? ;
    `;
    // binary 대소문자 구분 X
    const [result] = await db.execute(sql, [username]);

    return result[0];
}