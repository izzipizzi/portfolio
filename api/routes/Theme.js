
const express = require('express')
const router = express.Router()

const {create,themeById,read,update,remove,list} = require('../controllers/theme_controller')
const{requireSignin,isAdmin,isAuth} = require('../controllers/auth_controller')
const{userById} = require('../controllers/user_controller')

router.put('/theme/:themeId/:authorId',requireSignin,isAdmin,isAuth,update)
router.post('/theme/create/:authorId',requireSignin,isAdmin,isAuth,create)
router.delete('/theme/:themeId/:userId',requireSignin,isAdmin,isAuth,remove)
router.get('/theme/:themeId',read)
router.get('/themes',list)

router.param('authorId',userById)
router.param('themeId',themeById)

module.exports = router