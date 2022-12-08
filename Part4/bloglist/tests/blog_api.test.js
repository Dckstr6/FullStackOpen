const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const api = supertest(app);

const initialBlogs = [
    {
        title: "title1",
        author:"author1",
        url: "url1",
        likes:1
    },
    {
        title: "title2",
        author:"author2",
        url: "url2",
        likes:1
    },
]
  
beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs
    .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},1000000)


test('correct number of blogs are returned', async () => {
    let res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(initialBlogs.length);
})

test('data contains id attribute', async () => {
    let res = await api.get('/api/blogs');
    expect(res.body[0].id).toBeDefined();
})

test('data is correctly posted to db', async() => {
    let data = {
        title: "post_blog",
        author: "post_author",
        url: "post_url",
        likes: 10
    }
    await api.post('/api/blogs').send(data).expect(201).expect('Content-Type', /application\/json/);
    let res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(initialBlogs.length+1);
})

test('likes property default is 0 when posting', async() => {
    let data = {
        title: "post_blog",
        author: "post_author",
        url: "post_url"
    }
    await api.post('/api/blogs').send(data).expect(201).expect('Content-Type', /application\/json/);
    let res = await api.get('/api/blogs');
    let newBlog = res.body.filter((a) => a.title==="post_blog");
    expect(newBlog[0].likes).toBe(0);

})

test('check for bad request', async () => {
    let data = {
        url: "post_url",
        likes: 10
    }
    await api.post('/api/blogs').send(data).expect(400);
})

test('check deletion', async () =>{
    let res = await api.get('/api/blogs');
    const id = res.body[0].id;
    await api.delete(`/api/blogs/${id}`).expect(204);
    let response = await api.get('/api/blogs');
    if(response.body){
        expect(response.body).toHaveLength(initialBlogs.length - 1);
    }
})



afterAll(() => {
  mongoose.connection.close()
})

