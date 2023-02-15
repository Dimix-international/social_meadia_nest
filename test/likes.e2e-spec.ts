import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { createApp } from '../src/helpers/create-app';
import { User } from '../src/users/dto';
import { UserLoginModel } from '../src/models/auth/UserLoginModel';

const endpoints = {
  testing: { allData: '/testing/all-data' },
  users: { createUser: '/users' },
  auth: { login: '/auth/login' },
  blogs: { createBlog: '/blogs' },
};

const superUser = {
  login: 'admin',
  password: 'qwerty',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = createApp(app);
    await app.init();
    server = app.getHttpServer();
  });

  describe('wipe all data before test', () => {
    it('should return 204 status code', async () => {
      const response = await request(server).delete(endpoints.testing.allData);

      expect(response.status).toBe(204);
    });
  });

  describe('prepare data for test (users, blog, post, comment)', () => {
    const countOfUsers = 2;
    it('should return 401 status code because it not SA user', async () => {
      const newUserData: User = new User(
        'userLogin',
        'userPass',
        'userEmail@gmail.com',
      );

      const response = await request(server)
        .post(endpoints.users.createUser)
        .send(newUserData);

      expect(response.status).toBe(401);
    });
    it('should create user', async () => {
      const users = [];
      const usersWithTokens = [];

      for (let i = 0; i < countOfUsers; i++) {
        const newUserData: User = new User(
          `userLogin${i}`,
          'userPass',
          `userEmail${i}@gmail.com`,
        );
        const response = await request(server)
          .post(endpoints.users.createUser)
          .auth(superUser.login, superUser.password, { type: 'basic' })
          .send(newUserData);

        expect(response.status).toBe(201);
        users.push({ ...response.body, password: newUserData.password });
      }

      for (const u of users) {
        const loginData: UserLoginModel = {
          loginOrEmail: u.login,
          password: u.password,
        };
        const response = await request(server)
          .post(endpoints.auth.login)
          .set('User-Agent', 'uaString')
          .send(loginData);

        expect(response.status).toBe(200);
        usersWithTokens.push({ ...u, accessToken: response.body.accessToken });
      }

      expect(usersWithTokens).toHaveLength(countOfUsers);
    });
  });
});
