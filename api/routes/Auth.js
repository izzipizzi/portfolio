const express = require("express");
const router = express.Router();

const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");

const User = require('../models/user')
const { errorHandler } = require("../helpers/dbErrorHandler");



router.post("/signup", [
    check('name', 'Ім\'я повинно бути вказане').notEmpty(),
    check('surname', 'Прізвище повинно бути вказане').notEmpty(),
    check('email', ' Email має бути довжиною до 32 символів')
        .matches(/.+@.+\..+/)
        .withMessage('Введіть будь-ласка правильну пошту')
        .isLength({
            min: 4,
            max: 32
        }),
    check('password', 'Пароль потрібно ввести').notEmpty(),
    check('password')
        .isLength({
            min: 6,
            max: 32
        }).withMessage('Пароль повинний бути довжиною як мінімум 6 символів максимум 32')
        .matches(/\d/).withMessage('Пароль має містити як мінімум 1 цифру'),
    check('phone', 'Телефон потрібно ввести').notEmpty(),

], (req, res) => {
    const errors = validationResult(req).array()
    if (errors.length) {
        // console.log(...errors)
        const firstError = errors.map(error => error.msg)[0]


        return res.status(400).json({errors})
    } else {
        const user = new User(req.body);
        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                    err
                });
            }
            //щоб надіслати безпечні данні
            user.salt = undefined;
            user.hashed_password = undefined;

            res.json({
                user,
                successMsg: "Успішно створенно новий профіль",
            });
        });


    }

});
router.post("/signin", (req,res)=>{

    //шукаю юзера по Email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Користувача з таким email не існує.Будь-ласка зареєструйтесь",
            });
        }
        //перевірка мейла і пароля
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Пошта і пароль не співпадають",
            });
        }

        //генерую вебтокен з юзер_ід
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //надсилаю токен в куки
        res.cookie("token", token, { expire: new Date() + 1000 });
        //деструктурую юзера якого знайшло в бд
        const { _id, email, name,surname,phone, role } = user;
        //надсилаю респонс на фронт
        return res.json({ token, user: { _id, email, name,surname,phone, role } });
    });
});


router.get("/signout", (req,res)=>{
    res.clearCookie("token");
    res.json({ msg: "Успішно деавторизовано" });
});




module.exports = router;


