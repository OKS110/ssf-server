import express from 'express';
import * as controller from '../controller/loginController.js';
import {checkGuestLogin} from '../controller/guestLoginController.js';

const router = express.Router();

router.post('/login', controller.checkUserLogin)
    .post('/guestLogin', checkGuestLogin);


export default router;