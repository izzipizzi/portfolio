const User = require("../models/user");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "Користувача не знайдено",
            });
        }
        req.profile = user;
        next();
    });
};
exports.update = (req, res) => {
    User.findByIdAndUpdate(
        {
            _id: req.profile._id,
        },
        {
            $set: req.body,
        },
        {
            new: true,
        },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    err: "Ви не авторизовані для такої дії",
                });
            }

            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
};

exports.read = (req, res) => {
    //не передаю на фронт хеш пароль і сіль
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    const { _id, name, email, role } = req.profile;
    return res.json({
        _id,
        name,
        email,
        role,
    });
};

exports.userInfo = (req, res) => {
    //не передаю на фронт хеш пароль і сіль
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    const { _id, name, surname, about, email } = req.profile;
    return res.json({
        _id,
        name,
        surname,
        about,
        email,
    });
};
