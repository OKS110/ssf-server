import express from 'express';
import cors from 'cors';

//  라우터 모듈 가져오기
import loginRouter from './router/loginRouter.js';
import productRouter from './router/productRouter.js';
import signupRouter from './router/signupRouter.js';
import orderRouter from './router/orderRouter.js';
import paymentRouter from './router/paymentRouter.js';
import customerRouter from './router/customerRouter.js';
import guestRouter from './router/guestRouter.js';
import cartRouter from './router/cartRouter.js';
import reviewRouter from './router/reviewRouter.js';

//  서버 설정
const server = express();
const port = 9000;

//  CORS 설정 (클라이언트 도메인 허용)
server.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true
}));

server.use(express.json()); // JSON 요청 처리
server.use(express.urlencoded({ extended: true })); // URL-encoded 데이터 파싱

//  라우터 연결
server.use('/user', loginRouter);          // 로그인
server.use('/member', signupRouter);       // 회원가입
server.use('/product', productRouter);     // 상품 관련
server.use('/customers', customerRouter);  // 고객 관련
server.use('/guest', guestRouter);         // 비회원 관련
server.use('/order', orderRouter);         // 주문 관련
server.use('/payment', paymentRouter);     // 결제 관련
server.use('/cart', cartRouter);           // 장바구니
server.use('/review', reviewRouter);       // 리뷰

//  상품 데이터 업데이트 요청 처리 (GET, POST 지원)
server.route('/product/update')
    .get((req, res) => {
        console.log(" 상품 데이터 업데이트 요청 (GET)");
        res.json({ message: "상품 데이터 업데이트 요청 수신 (GET)" });
    })
    .post((req, res) => {
        console.log(" 상품 데이터 업데이트 요청 (POST)");
        res.json({ message: "상품 데이터 업데이트 요청 수신 (POST)" });
    });

//  WebSocket 설정 (고객 서버 → 관리자 서버)
const wss = new WebSocket('ws://localhost:9002');

wss.onopen = () => console.log(' 고객 서버 → 관리자 서버 WebSocket 연결됨');
wss.onerror = (error) => console.error('ERROR WebSocket 오류:', error);

//  회원가입 후 관리자에게 실시간 알림 전송
export const notifyAdminNewCustomer = () => {
    if (wss.readyState === WebSocket.OPEN) {
        console.log(" 고객 페이지 → 관리자 페이지 WebSocket 메시지 전송 중...");
        wss.send(JSON.stringify({ type: "new_customer" }));
    } else {
        console.log("ERROR WebSocket이 아직 연결되지 않음 (고객 페이지)");
    }
};

//  서버 실행
server.listen(port, () => {
    console.log(` 고객 서버 실행 중: http://localhost:${port}`);
});
