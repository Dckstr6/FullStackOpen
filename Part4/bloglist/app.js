const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URI} = require('./utils/config');
const {info,error} = require('./utils/logger');
const blogRouter = require('./controller/blogs');
const userRouter = require('./controller/users');
const loginRouter = require('./controller/login')
const morgan = require('morgan');
const middleware = require('./utils/middleware');

info("Connecting to MongoDB");

mongoose.connect(MONGODB_URI).then(
    () => info("Connected to MongoDB")
).catch(
    (res) => error(res)
)

app.use(cors());
app.use(express.json());
app.use('/api/blogs',blogRouter);
app.use('/api/users',userRouter);
app.use('/api/login',loginRouter);
// app.use(middleware.requestLogger);
app.use(morgan((tokens,request,response)=>{
    const res = [
        tokens.method(request,response),
        tokens.url(request,response),
        tokens.status(request,response),
        tokens['response-time'](request,response),'ms'
    ];
    if(res[0]=='POST'){
        res.push(JSON.stringify(request.body));
    }
    return res.join(' ');
}));


module.exports = app;