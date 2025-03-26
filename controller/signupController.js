import * as repository from '../repository/signupRepository.js';
import { notifyAdminNewCustomer } from '../server.js';  // WebSocket 알림 추가

// 아이디 중복 체크
export const getId = async (req, res) => {
    const result = await repository.getId(req.body);
    res.json(result);
};

// 회원 등록
export const registCustomer = async (req, res) => {
    try {
        let ph = req.body.data.phone.substring(0, 3)
            .concat('-', req.body.data.phone.substring(3, 7), '-', req.body.data.phone.substring(7, 11));

        const data = {
            'id': req.body.data.id,
            'pwd': req.body.data.pwd,
            'username': req.body.data.username,
            'phone': ph,
            'address': req.body.adata?.address || '',
            'email': req.body.data.email.concat('@', req.body.data.emailDomain),
            'zoneCode': req.body.adata?.zoneCode || '',
            'addressDetail': req.body.data.addressDetail
        };

        //  회원가입 요청 실행
        const result = await repository.registCustomer(data);
        console.log(" DB Insert 결과:", result);

        //  `affectedRows` 값을 정확히 참조하도록 수정
        const affectedRows = result.affectedRows || result[0]?.affectedRows || result.result;

        if (affectedRows === 1) {
            console.log(" 회원가입 성공! 관리자에게 알림 전송...");
            notifyAdminNewCustomer();  //  WebSocket 알림 전송
        } else {
            console.log("ERROR 회원가입 실패: affectedRows = ", affectedRows);
        }
        //  응답을 보내고 종료
        res.json(result);
    } catch (error) {
        console.error("ERROR 회원가입 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
};
