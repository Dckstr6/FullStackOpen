const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');



userRouter.get('/', async (request,response) => {
    const res = await User.find({}).populate('blogs',{title:1,url:1,author:1});
    response.json(res);
})

userRouter.post('/', async (request,response) => {
    const {username,name,password} = request.body;
    if(!username || !password){
        return response.status(400).json({
            error: 'username and/or password missing'
        })
    }
    if(username.length < 3){
        return response.status(400).json({
            error: 'username must be atleast 3 characters long'
        })
    }
    if(password.length < 3){
        return response.status(400).json({
            error: 'password must be atleast 3 characters long'
        })
    }
    const existingUser = await User.findOne({username});
    if(existingUser){
        return response.status(400).json({
            error: 'username already taken'
        })
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password,saltRounds);
    const user = new User({username,name,passwordHash});
    const savedUser = await user.save();
    response.status(201).json(savedUser);
})

module.exports = userRouter;