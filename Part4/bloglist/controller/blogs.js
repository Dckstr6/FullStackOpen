const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
    const authorization = String(request.headers.authorization).split(' ')[1];
    if (authorization){
        return authorization.slice(0,-1);
    }
    return null;
}

blogRouter.get('/', async (request,response) => {
    const blogs = await Blog.find({}).populate('user',{username:1,name:1});
    response.json(blogs);
})

blogRouter.get('/:id', async (request,response) => {
    const id = String(request.params.id);
    const blogs = await Blog.findById(id);
    response.json(blogs);
})


blogRouter.post('/', async (request,response) => {
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token,process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if(!request.body.title || !request.body.url){
        return response.status(400).json({error: "Title and/or Author missing"});
    }
    else if(!request.body.likes){
        request.body.likes = 0;
    }
    const blog = new Blog({...request.body,user:user.id});
    const result = await blog.save();
    user.blogs = user.blogs.concat(result.id);
    await user.save();
    response.status(201).json(result);
})

blogRouter.delete('/:id', async (request,response) => {
    const blogId = String(request.params.id);
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token,process.env.SECRET);
    if(!decodedToken.id){
        return response.status(400).json({error: 'token missing or invalid'});
    }
    const reqUser = await User.findById(decodedToken.id);
    const blog = await Blog.findById(blogId)
    if(reqUser.id.toString()===blog.user.toString()){
        await Blog.findByIdAndDelete(blogId);
        response.status(204).end();
    }
    else{
        return response.status(401).json({error: 'no access for deleting blog'});
    }
})

blogRouter.put('/:id', async (request,response) => {
    const body = request.body;
    const id = request.params.id;
    if(!body.title || !body.author){
        return response.status(400).json({
            error:'title and/or author missing'
        })
    }
    if(!id){
        return response.status(400).json({
            error: 'blog id not found'
        })
    }
    else{
        const blogObj = {title: body.title, author: body.author, url: body.url,
        likes: body.likes};
        await Blog.findByIdAndUpdate(id,blogObj);
        response.json(blogObj);
    }
})

module.exports = blogRouter;
