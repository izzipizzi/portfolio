const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

//при ств схем в бд не юзти стрілкові функціїї
const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
        },
        text: {
            type: String,
            required: true,
        },
        theme: {
            type: ObjectId,
            ref: "Theme",
            required: true,
        },
        user: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        photo:{
            data : Buffer,
            contentType : String
        },
        comments: [
            {
                user: {
                    type: ObjectId,
                    ref: "User",
                    required: true,
                },
                comment_text: {
                    type: String,
                    trim: true,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
