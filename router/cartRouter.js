import express from 'express';
import * as controller from '../controller/cartController.js';

const router = express.Router();

router
    .post('/add', controller.saveToCart)
    .post('/getId', controller.getCustomerId)
    .post('/items', controller.getCartItems)
    .post('/updateOptions', controller.updateDetailQty)
    .post('/changeQty', controller.changeQty)
    .post('/deleteItem', controller.cartDeleteItem)
    .post('/guestItems', controller.getGuestCartItems);

export default router;