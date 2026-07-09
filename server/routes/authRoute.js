const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect")


router.get("/me", protect,  (req, res) => {
    console.log(req.user)
    res.json({
        id: req.user.id,
        role: req.user.role,
        email: req.user.email
    });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;