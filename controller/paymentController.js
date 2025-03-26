import axios from 'axios';

export const paymentKakaopay = async(req, res) => {
    try {
        console.log(req.body);
        const {id, item_name, total_amount} = req.body;
        const KAKAO_ADMIN_KEY = "bb96eb0771fed829c0d688a64cea8262";
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const response = await axios.post(
            "https://kapi.kakao.com/v1/payment/ready", //  카카오페이 결제 요청 API
            {
                cid: "TC0ONETIME", //  테스트용 CID
                partner_order_id: `order_${uniqueSuffix}`,
                partner_user_id: id,
                item_name,
                quantity: 1,
                total_amount,
                tax_free_amount: 0,
                approval_url: "http://localhost:3001/payment/success", //  결제 성공 시 이동할 URL
                cancel_url: "http://localhost:3001/payment/cancel",   //  결제 취소 시 이동할 URL
                fail_url: "http://localhost:3001/payment/fail",       //  결제 실패 시 이동할 URL
            },
            {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`, //  카카오페이 Admin Key
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log('qr-->', response.data);

        res.json(response.data); //  클라이언트에 카카오페이 응답 전송
    } catch (error) {
        console.error("QR 결제 요청 실패:", error);
        res.status(500).json(error.response.data);
    }
};
