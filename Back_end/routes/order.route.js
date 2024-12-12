const express = require('express');
const {CashOnDeliveryOrderController,getOrderDetailsController} = require('../controller/order.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.post("/cod", auth, CashOnDeliveryOrderController);
router.get("/details", auth, getOrderDetailsController);

module.exports = router;