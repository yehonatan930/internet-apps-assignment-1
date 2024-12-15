import request from 'supertest';
import {app} from '../main'; // Path to your Express app
import mongoose from 'mongoose';

const userApiBase = '/api/users';

beforeAll(async () => {
    // Connect to a test database (use a testing MongoDB URI)
    await mongoose.connect('mongodb://localhost:27017/testdb');
});

afterAll(async () => {
    // Disconnect from the database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('User API Endpoints', () => {
    let token: string;

    test('POST /register - Create a new user', async () => {
        const response = await request(app).post(`${userApiBase}/register`).send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully.');
    });

    test('POST /login - Login a user and get a token', async () => {
        const response = await request(app).post(`${userApiBase}/login`).send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');

        token = response.body.accessToken; // Save the token for authenticated tests
    });

    test('GET /me - Get the logged-in user profile', async () => {
        const response = await request(app)
            .get(`${userApiBase}/me`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', 'testuser');
        expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('PUT /:id - Update a user profile', async () => {
        const response = await request(app)
            .put(`${userApiBase}/testuser`) // Replace with actual user ID if your app uses MongoDB IDs
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'updateduser',
                email: 'updateduser@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User updated successfully.');
    });

    test('DELETE /:id - Delete a user', async () => {
        const response = await request(app)
            .delete(`${userApiBase}/testuser`) // Replace with actual user ID
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully.');
    });

    test('POST /logout - Logout the user', async () => {
        const response = await request(app)
            .post(`${userApiBase}/logout`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Logout successful.');
    });
});
