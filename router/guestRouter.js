import express from 'express';
import * as guestController from '../controller/guestController.js'; // 여기서 문제가 발생할 수 있음

const router = express.Router();

router.post('/add', guestController.addGuest); 
router.post('/addOrder', guestController.addGuestOrder)
    .post("/orders", guestController.getGuestOrders);

export default router;
