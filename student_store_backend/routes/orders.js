const Order = require('../models/order');
const express = require('express');
const router = express.Router();
const security = require('../middleware/security')

router.get("/", security.requireAuthenicatedUser, async (req, res, next) => {
    try {
        const results = await Order.listOrdersForUsers();
        return res.status(200).json({results})
    }
    catch(err) {
        next(err);
    }
})

router.post("/", security.requireAuthenicatedUser, async (req, res, next) => {
    try {
        const results = await Order.createOrder(req.body.order);
        return res.status(201).json({results})
    }
    catch(err) {
        next(err);
    }
})

module.exports = router;