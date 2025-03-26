import express from 'express';
import * as controller from '../controller/customerController.js';

const router = express.Router();

router.post('/all', controller.getCustomers)
    .post('/member', controller.getCustomer);


export default router;