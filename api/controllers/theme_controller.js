const Theme = require('../models/theme')
const {errorHandler} = require('../helpers/dbErrorHandler')
exports.create = (req,res)=>{
    const theme = new Theme(req.body)

    theme.save((err,data)=>{
        if(err){
            return res.status(400).json({
                err : errorHandler(err) + "Не може бути 2 однакові теми"
            })
        }
        res.json({data,msg:'Успішно добавлено тему'})
    })

}
exports.themeById = (req,res,next,id)=>{
    Theme.findById(id).exec((err, theme)=>{
        if(err|| !theme){
            return res.status(400).json({
                err : "Такої теми не існує"
            })
        }
        req.theme = theme
        next();
    })
}
exports.read =(req,res)=>{
    return res.json(req.theme)
}
exports.remove = (req,res)=>{
    const theme = req.theme
    theme.remove((err,data)=>{
        if (err) {
            return res.status(400).json({
                err : errorHandler(err)
            })
        }
        res.json({"msg":"Успішно видалено тему"})
    })

}
exports.update = (req,res)=>{
    const theme = req.theme
    theme.name = req.body.name
    theme.save((err,data)=>{
        if (err) {
            return res.status(400).json({
                err : errorHandler(err)
            })
        }
        res.json(data)
    })
}
exports.list=(req,res)=>{
    Theme.find().exec((err, data)=>{
        if (err) {
            return res.status(400).json({
                err : errorHandler(err)
            })
        }

        res.json(data)
    })

}

