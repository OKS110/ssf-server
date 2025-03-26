import { db } from './db.js';

/** 로그인 **/
export const checkUserLogin = async({id, pwd}) => {
    const sql = `
        select count(*) as result_rows
        from customers
        where username = ? and password = ?
    `;

    const [result] = await db.execute(sql, [id, pwd]);

    return result[0];
}