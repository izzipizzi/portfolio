const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");

require("dotenv").config();

const secret = {
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ['HS256']

};

exports.requireSignin = expressJWT(secret);

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            err: "Доступ закритий",
        });
    }
    next();
};
exports.userByToken = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Будь-ласка уввійдіть",
            });
        }

        //генерую вебтокен з юзер_ід
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //надсилаю токен в куки
        res.cookie("token", token, { expire: new Date() + 1000 });
        //деструктурую юзера якого знайшло в бд
        const { _id, name, email, role } = user;
        //надсилаю респонс на фронт
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0 && req.profile.role === 2) {
        return res.status(403).json({
            err: "Admin resourse Доступ тільки для адміністратора",
        });
    }
    next();
};