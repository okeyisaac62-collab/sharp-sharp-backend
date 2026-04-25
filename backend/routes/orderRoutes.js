const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Save new order
router.post("/create-order", async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.json(order);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all orders
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;