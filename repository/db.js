import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'ssf-react-db.c70maeu0qcke.ap-northeast-2.rds.amazonaws.com', //localhost
    port: 3306,
    user: 'ohkwangseok', //root
    password: 'mysql1234',
    database: 'shopping_mall'
});

export const db = pool.promise();