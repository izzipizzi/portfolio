const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { ObjectId } = mongoose.Schema;

//при ств схем в бд не юзти стрілкові функціїї
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
        },
        surname: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            maxLength: 32,
        },
        phone:{
            type: String,
            trim : true,
            required : true,
            unique : true,

        },
        hashed_password: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            trim: true,
        },
        projects: [
            {
                ref: "Project",
                type: ObjectId,
            },
        ],
        salt: String,
        role: {
            type: Number,
            default: 0,
        },
        history: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

//Віртуальне поле?
userSchema
    .virtual("password")
    .get(function () {
        return this._password;
    })
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    });

userSchema.methods.encryptPassword = function (password) {
    if (!password) return "";
    try {
        return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
    } catch (error) {
        return "";
    }
};
userSchema.methods.authenticate = function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
};

module.exports = mongoose.model("User", userSchema);
