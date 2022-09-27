// Setup for testing
const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../models/index');
const { encrypt } = require('../../helpers/bcrypt');
const { sign } = require('../../helpers/jwt');
const { queryInterface } = sequelize;

// Endpoint test
let endpoint = "/shipping";
let accessTokenAdmin = sign({ id: 1, email: "adm_1@mail.com", role: 'admin' });
let accessTokenCustomer = sign({ id: 2, email: "cust_1@mail.com", role: 'customer' });

beforeAll(async () => {
  // Query Bulk Delete to Database
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Shippings', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  // Query Bulk Insert to Database
  await queryInterface.bulkInsert('Users', [
    {
      username: "admin1",
      email: "adm_1@mail.com",
      password: encrypt("password"),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "customer1",
      email: "cust_1@mail.com",
      password: encrypt("password"),
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});

  await queryInterface.bulkInsert('Shippings', [
    {
      name: "Si Cepat",
      type: "Standard Shipping",
      price: 5000,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "JNT",
      type: "Standard Shipping",
      price: 6000,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
});

describe('TEST ENDPOINT /shipping Feature', () => {
  // -- Start of GET -- 
  test('GET /shipping should return 200 and all shipping options', (done) => {
    request(app)
      .get(`${endpoint}`)
      .expect(200)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body.length).toBe(2)
        expect(body[0]).toMatchObject({
          name: "Si Cepat",
          type: "Standard Shipping",
          price: 5000,
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('GET /shipping/:id should return 200 and the chosen shipping options', (done) => {
    request(app)
      .get(`${endpoint}/2`)
      .expect(200)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          id: expect.any(Number),
          name: "JNT",
          type: "Standard Shipping",
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('GET /shipping without access_token should return 401', (done) => {
    request(app)
      .get(`${endpoint}`)
      .expect(401)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Missing Access Token"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('GET /shipping/:id without access_token should return 401', (done) => {
    request(app)
      .get(`${endpoint}/1`)
      .expect(401)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Missing Access Token"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  // -- End of GET -- 

  // -- Start of POST --
  test('POST /shipping should return 201 ', (done) => {
    const testData = {
      name: 'Si Cepat',
      type: 'One Day Service',
      price: 15000
    }
    
    request(app)
      .post(`${endpoint}`)
      .expect(201)
      .send(testData)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "New Shipping has been created"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /shipping with empty string on one of the required parameters (name) should return 400 ', (done) => {
    const testData = {
      name: '',
      type: 'One Day Service',
      price: 15000
    }
    
    request(app)
      .post(`${endpoint}`)
      .expect(400)
      .send(testData)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: [ "Name cannot be empty" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /shipping without one of the required parameters (name) should return 400 ', (done) => {
    const testData = {
      type: 'One Day Service',
      price: 15000
    }
    
    request(app)
      .post(`${endpoint}`)
      .expect(400)
      .send(testData)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: [ "Name is required" ]
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /shipping without access_token should return 401', (done) => {
    const testData = {
      name: 'Si Cepat',
      type: 'One Day Service',
      price: 15000
    }
    
    request(app)
      .post(`${endpoint}`)
      .expect(401)
      .send(testData)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Missing Access Token"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  // -- End of POST -- 

  // -- Start of DELETE -- 
  test('DELETE /shipping/:id should return 200', (done) => {
    request(app)
      .delete(`${endpoint}/3`)
      .expect(200)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "Shipping option has been deleted"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('DELETE /shipping/:id with invalid id should return 404', (done) => {
    request(app)
      .delete(`${endpoint}/99`)
      .expect(404)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Shipping Not Found"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('DELETE /shipping/:id without access_token should return 401', (done) => {
    request(app)
      .delete(`${endpoint}/2`)
      .expect(401)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Missing Access Token"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  // -- End of DELETE --

  // -- Start of PUT --
  test('PUT /shipping without access_token should return 400', (done) => {
    const testData = {
      name: 'Si Cepat',
      type: 'One Day Service',
      price: 15000
    }
    
    request(app)
      .put(`${endpoint}/1`)
      .expect(200)
      .send(testData)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "Shipping option has been edited"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  // -- End of PUT --
})
