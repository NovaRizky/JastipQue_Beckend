// Setup for testing
const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../models/index');
const { queryInterface } = sequelize;

// Endpoint test
let endpoint = "/users";

beforeAll(async () => {
  // Query Bulk Delete to Database
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Profiles', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
});

describe('TEST ENDPOINT /users/register Feature', () => {
  // -- Start of POST -- 
  test('POST /users/register should return 201', (done) => {
    const testData = { 
      username: "admin2",
      email: "adm_2@mail.com",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(201)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "Register Success"
        })
        done();
      })
      .catch((error) => {
        done(error);
      })
  });

  test('POST /customer/register should return 201', (done) => {
    const testData = { 
      username: "customer2",
      email: "cust_2@mail.com",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(201)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "Register Success"
        })
        done();
      })
      .catch((error) => {
        done(error);
      })
  });

  test('POST /users/register without email should return 400', (done) => {
    const testData = {
      username: "admin3",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ 'Email Not Null' ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      })
  })

  test('POST /users/register without password should return 400', (done) => {
    const testData = {
      username: "admin4",
      email: "adm_4@mail.com"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "password not Null" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/register with empty string on email should return 400', (done) => {
    const testData = {
      username: "admin5",
      email: "",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "Validation isEmail on email failed" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/register with empty string on password or with string length less than 5 character should return 400', (done) => {
    const testData = {
      username: "admin6",
      email: "adm_6@mail.com",
      password: "pass"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "password minimal 5 character" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      })
  })

  test('POST /users/register  with registered or used email should return 409', (done) => {
    const testData = {
      username: "admin99",
      email: "adm_2@mail.com",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(409)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "Email is already used by other users" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/register with registered or taken username should return 409', (done) => {
    const testData = {
      username: "admin2",
      email: "adm_99@mail.com",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(409)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "Username is already used by other users" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/register with invalid email format should return 400 ', (done) => {
    const testData = {
      username: "admin7",
      email: "adm_7",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "Validation isEmail on email failed" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/register without username should return 400', (done) => {
    const testData = {
      email: "adm_8@mail.com",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "Username Not Null" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /public/register with empty string on username should return 400', (done) => {
    const testData = {
      email: "adm_9@mail.com",
      username: "",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/register`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.any(Boolean),
          err: [ "Username cannot be empty" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  // -- End of POST -- 
})