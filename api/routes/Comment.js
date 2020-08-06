
const {errorHandler} =require ("../helpers/dbErrorHandler");

const express = require('express')

const router = express.Router()
const {projectById} = require ("../controllers/project_controller")
const {userById} = require ("../controllers/user_controller")
const {isAuth,requireSignin} = require ("../controllers/auth_controller")

const Comment = require('../models/comment')

router.post('/project/add_comment/:userId/:projectId',requireSignin,isAuth,(req,res)=>{

    const project = req.project
    const userId = req.profile._id
    const comment_text =req.body.comment
    // const comment = new Comment(user._id,req.body.comment)
    const comment = {user:userId, comment_text}
    project.comments.push(comment)

    project.save((err,data)=>{
        if(err){
            return res.status(400).json({
                // err : errorHandler(err)
                err
            })
        }
        res.json({data,msg:'Успішно добавлено коментар'})
    })

})
router.get('/project/comments/:projectId',(req,res,next)=>{

    if (req.project.comments) {

        return res.json(req.product.comments)
    }
    next();

})


router.param('projectId',projectById)
router.param('userId',userById)


module.exports = router
