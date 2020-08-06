const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

const Project = require("../models/project");
const User = require("../models/user");

const { errorHandler } = require("../helpers/dbErrorHandler");
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Ця картинка не може бути загружена",
            });
        }
        // check fields
        const { title, text, theme, user } = fields;
        if (!title || !text || !theme || !user) {
            return res.status(400).json({
                error: "Всі поля мають бути заповнені",
            });
        }

        let project = new Project(fields);

        project.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err.message,
                });
            }
            User.findById(result.user, (err, user) => {
                if (err) {
                    return res.status(400).json({
                        error: err.message,
                    });
                }
                let userProjects = user.projects;
                userProjects.push(result._id);
                User.findByIdAndUpdate(
                    result.user,
                    { projects: userProjects },
                    (err, updateResult) => {
                        if (err) {
                            return res.status(400).json({
                                error: err.message,
                            });
                        }
                    }
                );
            });

            res.json({ result, msg: "Успішно добавленно" });
        });
    });
};
exports.projectById = (req, res, next, id) => {
    Project.findById(id).exec((err, project) => {
        if (err || !project) {
            return res.status(400).json({
                error: "Пост  не знайдено",
            });
        }
        req.project = project;
        next();
    });
};
exports.randomProject = (req, res) => {
    Project.countDocuments().exec((err, count) => {
        let random = Math.floor(Math.random() * count);

        Project.findOne()
            .skip(random)
            .exec((err, project) => {
                if (err || !project) {
                    return res.status(400).json({
                        error: "Проект  знайдено",
                    });
                }
                return res.json(project);
            });
    });
};

//--------------------------------------

exports.read = (req, res) => {
    return res.json(req.project);
};
exports.remove = (req, res) => {
    let project = req.project;
    project.remove((err, deletedProject) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({
            msg: "Успішно видалено",
        });
    });
};
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Неможливо оновити",
            });
        }
        // check fields
        const { title, text, theme, user } = fields;

        // if(!name || !description || !price || !theme ||! quantity ||! shipping){
        //     return res.status(400).json({
        //         error: 'Всі поля мають бути заповнені'
        //     })
        // }

        let project = req.project;
        project = _.extend(project, fields);
        // console.log(project)

        Project.findByIdAndUpdate(project._id, project, (err, result) => {
            if (err) {
                console.log(err);

                return res.status(400).json({
                    err: errorHandler(err),
                });
            }
            res.json({ result, msg: "Проект успішно оновлено" });
        });
    });
};

exports.list = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let page = parseInt(req.body.page, 10) || 0;
    page === 0 ? (page = 0) : (page = page - 1);

    Project.countDocuments((err, result) => {
        Project.find()
            .populate("theme")
            .populate({ path: "user", select: ["_id", "name", "surname"] })
            .sort([[sortBy, order]])
            .skip(page * limit)
            .limit(limit)
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: "Пости не знайдено",
                    });
                }

                res.json({
                    totalSize: result,
                    size: data.length,
                    data,
                });
            });
    });
};
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;

    Project.find({ _id: { $ne: req.project }, theme: req.project.theme })
        .limit(limit)
        .select("-photo")
        .populate("theme", "_id  name")
        .exec((err, projects) => {
            if (err) {
                return res.status(400).json({
                    msg: "Не знайдено постів",
                });
            }
            res.json(projects);
        });
};
exports.listThemes = (req, res) => {
    Project.distinct("theme", {}, (err, themes) => {
        if (err) {
            return res.status(400).json({
                msg: "Не знайдено продуктів",
            });
        }
        res.json(themes);
    });
};


exports.photo = (req, res, next) => {

    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}