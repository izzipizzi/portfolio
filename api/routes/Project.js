const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth_controller");
const { userById } = require("../controllers/user_controller");
const {
    projectById,
    read,
    remove,
    create,
    update,
    randomProject,
    list,
    listRelated,
    themeRelated,
    listThemes,
} = require("../controllers/project_controller");

// const { projectFormValidator } = require("../validator/index");

router.post("/project/create/:userId", requireSignin, isAuth, create);
router.get("/project/:projectId", read);

router.get("/random/project", randomProject);

router.post("/projects", list);

router.delete("/project/:projectId/:userId", requireSignin, isAuth, remove);
router.put("/project/:projectId/:userId", requireSignin, isAuth, update);

router.get("/projects/related/:projectId", listRelated);

router.get("/projects/themes", listThemes);

router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
