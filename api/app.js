const express = require('express')
const mongoose = require('mongoose')

const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/Auth')
const commentRoutes = require('./routes/Comment')
const projectRoutes = require('./routes/Project')
const themeRoutes = require('./routes/Theme')
const userRoutes = require('./routes/User')

const app = express()

// пдключа. конфіг з бд

require('dotenv').config()

mongoose.connect(
    process.env.MONGODB_URI,{
        useNewUrlParser : true,
        useCreateIndex : true,
        useUnifiedTopology : true
    }
)
    .then(()=>{
        console.log('connected to DB')
    })

app.use(cors())

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/api", authRoutes);
app.use("/api", commentRoutes);
app.use("/api", projectRoutes);
app.use("/api", themeRoutes);
app.use("/api", userRoutes);

const PORT  = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(' server started')
})