const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema


//при ств схем в бд не юзти стрілкові функціїї
const commentSchema = new mongoose.Schema({
        user : {
            type:ObjectId,
            ref : "User",
            required : true
        },
        comment :{
            type: String,
            trim: true,
            required : true,
            maxLength :32,
            unique :true

        }


    },
    {timestamps:true}
)


module.exports = mongoose.model('Comment',commentSchema)