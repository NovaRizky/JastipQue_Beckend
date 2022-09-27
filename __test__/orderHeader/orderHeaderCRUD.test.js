// Setup for testing
const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../models/index');
const { encrypt } = require('../../helpers/bcrypt');
const { sign } = require('../../helpers/jwt');
const { queryInterface } = sequelize;

// Endpoint test
let endpoint = "/order-header";
let accessTokenCustomer = sign({ id: 1, email: "cust_1@mail.com", role: 'customer' });

beforeAll(async () => {
  // Query Bulk Insert to Database
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Events', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Products', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Stores', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Categories', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Orders', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('OrderHeaders', null, {
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
      username: "customer1",
      email: "cust_1@mail.com",
      password: encrypt("password"),
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});

  await queryInterface.bulkInsert('Categories', [
    {
      name: "Hardware",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "PC Gaming",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Laptop Gaming",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});

  await queryInterface.bulkInsert('Events', [
    {
      name: "TechComp Fest",
      start: new Date(),
      finish: new Date(),
      address: "Tanah Abang, Jakarta, Indonesia",
      mapsUrl: "https://tomwoolley.com/v2/wp-content/uploads/2020/02/BDF-Venue-Map.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "ELCCO: Electrical and Computer Competition",
      start: new Date(),
      finish: new Date(),
      address: "Kompleks Taman Lumbini, Kawasan Candi Borobudur, Kabupaten Magelang, Jawa Tengah",
      mapsUrl: "https://awsimages.detik.net.id/community/media/visual/2020/08/26/tangkap-layar-google-maps-usulan-jalur-sepeda-di-tol-cawang-tanjung-priok_43.jpeg?w=700&q=90",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});

  await queryInterface.bulkInsert('Stores', [
    {
      name: "Dx Computer Shop",
      statusStore: "active",
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  await queryInterface.bulkInsert('Products', [
    {
      name: "PC Gaming Core I5 9400/RX 570 4 GB/DDR4 16 GB/Samsung 24 Curved",
      description: "PC gaming rakitan keluaran terbaru",
      imageUrl: "https://br.atsit.in/id/wp-content/uploads/2022/01/npd-group-pengeluaran-konsumen-untuk-perangkat-keras-dan-aksesori-pc-gaming-meningkat-25-pada-tahun-2021.jpg",
      status: "Active",
      price: 10000000,
      weight: 30,
      stock: 10,
      CategoryId: 2,
      EventId: 1,
      StoreId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "ROG Zephyrus Duo 15 SE",
      description: "Laptop Gaming Dua Layar Paling Berharga",
      imageUrl: "https://pict-c.sindonews.net/dyn/620/pena/news/2021/04/28/123/411468/rog-zephyrus-duo-15-se-laptop-gaming-dua-layar-paling-bertenaga-ksg.jpg",
      status: "Active",
      price: 15000000,
      weight: 15,
      stock: 5,
      CategoryId: 3,
      EventId: 1,
      StoreId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Motherboard Socket 1700 MSI Z690 Godlike",
      description: "Rekomendasi motherboard bertenaga super",
      imageUrl: "https://i0.wp.com/www.murdockcruz.com/wp-content/uploads/2019/06/MSI-MEG-X570-Godlike-Feat.jpg?fit=650%2C420&ssl=1",
      status: "Active",
      price: 12500000,
      weight: 10,
      stock: 7,
      CategoryId: 1,
      EventId: 2,
      StoreId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Motherboard Socket 1700 MSI Z90 Godlike",
      description: "Rekomendasi motherboard bertenaga super",
      imageUrl: "https://i0.wp.com/www.murdockcruz.com/wp-content/uploads/2019/06/MSI-MEG-X570-Godlike-Feat.jpg?fit=650%2C420&ssl=1",
      status: "Inactive",
      price: 12500000,
      weight: 10,
      stock: 0,
      CategoryId: 1,
      EventId: 1,
      StoreId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
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


describe('TEST ENDPOINT /order-header Feature', () => {
  // -- Start of POST --
  test('POST /orders should return 201', (done) => {
    const testData = {
      quantity: 2,
      note: "Packing yang rapi ya...",
      ProductId: 1
    };
    
    request(app)
      .post(`/orders`)
      .expect(201)
      .send(testData)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "Order has been successfully created!"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /order-header/:id should return 201', (done) => {
    const testData = {
      ShippingId: 2,
      ProductId: 1,
      address: "Sumbawa"
    };
    
    request(app)
      .post(`${endpoint}/1`)
      .expect(201)
      .send(testData)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          id: expect.any(Number),
          status: "Waiting for payment",
          date: expect.anything(),
          weight: 60,
          costShippings: 360000,
          address: "Sumbawa",
          OrderId: 1,
          StoreId: 1,
          UserId: 1,
          ShippingId: 2,
          updatedAt: expect.anything(),
          createdAt: expect.anything()
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /order-header/:id without valid OrderId should return 400', (done) => {
    const testData = {
      ShippingId: 2,
      ProductId: 1,
      address: "Sumbawa"
    };
    
    request(app)
      .post(`${endpoint}/99`)
      .expect(404)
      .send(testData)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Order Not Found"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /order-header/:id without valid ShippingId should return 400', (done) => {
    const testData = {
      ShippingId: 20,
      ProductId: 1,
      address: "Sumbawa"
    };
    
    request(app)
      .post(`${endpoint}/1`)
      .expect(404)
      .send(testData)
      .set('access_token', accessTokenCustomer)
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

  test('POST /order-header/:id without access_token should return 401', (done) => {
    const testData = {
      ShippingId: 2,
      ProductId: 100,
      address: "Sumbawa"
    };
    
    request(app)
      .post(`${endpoint}/1`)
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

  // -- Start of GET -- 
  test('GET /order-header should return 200 and all order-header', (done) => {
    request(app)
      .get(`${endpoint}`)
      .expect(200)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body.length).toBe(1)
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('GET /order-header without access_token should return 401', (done) => {
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
  // -- End of GET -- 

  // -- Start of DELETE --
  test('DELETE /order-header /:id should return 200', (done) => {
    request(app)
      .delete(`${endpoint}/1`)
      .expect(200)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          message: "Order has been cancelled"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('DELETE /order-header/:id without valid id should return 404', (done) => {
    request(app)
      .delete(`${endpoint}/99`)
      .expect(404)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Order Header Not Found"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  // -- End of DELETE --
})
