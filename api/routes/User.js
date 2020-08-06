const express = require("express");
const router = express.Router();

const { userById, update, read, userInfo } = require("../controllers/user_controller.js");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth_controller");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});
router.get("/user_info/:userId", userInfo);
router.get("/user/:userId", requireSignin, isAuth, read);

router.put("/user/:userId", requireSignin, isAuth, update);

router.param("userId", userById);

module.exports = router;
