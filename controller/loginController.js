import * as repository from '../repository/loginRepository.js';
import jwt from 'jsonwebtoken'; //jsonwebtoken 모듈을 사용하여 로그인 성공 시 JWT 토큰을 생성.

/** 관리자 페이지 로그인 - checkAdminLogin **/
export const checkUserLogin = async(req, res) => {
    let result = await repository.checkUserLogin(req.body);

    if(result.result_rows === 1) {
        const token = jwt.sign({"userId": req.body.username}, '7mPjPeZ7Ul');
        // jwt.sign(payload, secretKey)를 사용하여 토큰을 생성.
        result = {...result, "token": token};
    }

    res.json(result);
    res.end();
}