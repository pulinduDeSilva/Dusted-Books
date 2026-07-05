const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect")


router.get("/me", protect, (req, res) => {
    res.json({
        id: req.user.id,
        role: req.user.role,
        email: req.user.email
    });
});

module.exports = router;