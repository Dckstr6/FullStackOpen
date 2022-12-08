const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const api = supertest(app);

describe('testing user actions', () => {
    test('adding new user functioning', async () => {
        const newUser = {
            "username": "testUser",
            "name": "tester",
            "passwordHash": "test"
        }
        const res = api.post('/api/users/').send(newUser);
        expect(res.body).toBe(newUser);
    })
})