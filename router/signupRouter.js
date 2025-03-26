import express from 'express';
import * as controller from '../controller/signupController.js';

const router = express.Router();

router.post('/idCheck',controller.getId);    // 아이디중복확인
router.post('/signup',controller.registCustomer);  // 회원가입폼 디비연동

export default router;