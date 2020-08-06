const mongoose = require('mongoose')


//при ств схем в бд не юзти стрілкові функціїї
const themeSchema = new mongoose.Schema({
        name :{
            type: String,
            trim: true,
            required : true,
            maxLength :32,
            unique :true

        }


    },
    {timestamps:true}
)


module.exports = mongoose.model('Theme',themeSchema)