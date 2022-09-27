const { Order, OrderHeader, User, Store, Shipping, Product, Profile, sequelize } = require("../models/index");
const { Op } = require("sequelize");
const { snapRequest, fillParameter } = require("../helpers/midtrans");
const midtransClient = require('midtrans-client');

class OrderHeaderController {
  static async viewAllStoreOrderHeader(req, res, next) {
    try {
      const order = await OrderHeader.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Order,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Store,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
          {
            model: Shipping,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        // where: {
        //   StoreId: req.user.Store.id
        // }
      });
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async viewAllOrderHeader(req, res, next) {
    try {
      const order = await OrderHeader.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Order,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Store,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
          {
            model: Shipping,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        where: {
          UserId: req.user.id
        }
      });
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async postOrderHeader(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { address, ShippingId } = req.body;

      const orderHeaderCheck = await OrderHeader.findOne({
        where: {
          OrderId: id
        }
      });

      if (orderHeaderCheck) throw ({ name: "OrderHeaderFound" })

      const order = await Order.findOne({
        where: {
          [Op.and]: {
            id: id,
            UserId: req.user.id,
            status: 'Open'
          },
        },
        include: Product,
      });

      if (!order) throw { name: "OrderNotFound" };

      const shipping = await Shipping.findByPk(ShippingId);

      if (!shipping) throw { name: "ShippingNotFound" };

      const product = await Product.findOne({
        where: {
          id: order.Product.id
        }
      })

      const productUpdate = await Product.update({
        stock: product.stock - 1
      }, {
        where: {
          id: product.id
        }
      }, { transaction: t })

      const orderHeader = await OrderHeader.create({
        status: "Waiting for payment",
        date: new Date(),
        weight: order.Product.weight * order.quantity,
        costShippings: shipping.price * (order.Product.weight * order.quantity),
        address,
        OrderId: id,
        StoreId: +order.Product.StoreId,
        UserId: req.user.id,
        ShippingId,
      }, { transaction: t });

      const orderUpdate = await Order.update(
        {
          status: "Closed",
        },
        {
          where: {
            id: id,
          },
        }, { transaction: t }
      );
      
      const user = await User.findOne({
        where: {
          id: req.user.id
        },
        include: Profile
      });

      const parameter = fillParameter({
        orderId: `${orderHeader.id}`,
        grossAmount: order.totalPrice + orderHeader.costShippings,
        firstName: user.email,
        lastName: user.email,
        email: user.email,
        phoneNumber: user.email
      });

      const midreq = await snapRequest(parameter)
      
      await t.commit();
      res.status(201).json(midreq);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async handleResponse(req, res, next) {
    try {
      let apiClient = new midtransClient.Snap({
        isProduction : false,
        serverKey : process.env.MIDTRANS_SERVER_KEY,
        clientKey : process.env.MIDTRANS_CLIENT_KEY
      });
  
      apiClient.transaction.notification(req.body)
        .then(async (statusResponse)=>{
          let orderId = statusResponse.order_id;
          let transactionStatus = statusResponse.transaction_status;
          let fraudStatus = statusResponse.fraud_status;
  
          console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);
  
          if (transactionStatus == 'capture'){
              if (fraudStatus == 'challenge'){
                const orderHeader = await OrderHeader.update({
                  status: "Success"
                },{
                  where: {
                    id: orderId
                  }
                });
                  // TODO set transaction status on your database to 'challenge'
                  // and response with 200 OK
                  res.status(200).json();
              } else if (fraudStatus == 'accept'){
                const orderHeader = await OrderHeader.update({
                  status: "Success"
                },{
                  where: {
                    id: orderId
                  }
                });
                  // TODO set transaction status on your database to 'success'
                  // and response with 200 OK
                  res.status(200).json();
              }
          } else if (transactionStatus == 'settlement'){
              // TODO set transaction status on your database to 'success'
              // and response with 200 OK
              const orderHeader = await OrderHeader.update({
                status: "Success"
              },{
                where: {
                  id: orderId
                }
              });
              res.status(200).json();
          } else if (transactionStatus == 'cancel' ||
            transactionStatus == 'deny' ||
            transactionStatus == 'expire'){
              const orderHeader = await OrderHeader.update({
                status: "Failure"
              },{
                where: {
                  id: orderId
                }
              });
              res.status(200).json();
            // TODO set transaction status on your database to 'failure'
            // and response with 200 OK
          } else if (transactionStatus == 'pending'){
            const orderHeader = await OrderHeader.update({
              status: "Pending"
            },{
              where: {
                id: orderId
              }
            });
            res.status(200).json();
            // TODO set transaction status on your database to 'pending' / waiting payment
            // and response with 200 OK
          }
      });
    } catch (error) {
      next(error)
    }
  }

  static async deleteOrderHeader(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const orderHeader = await OrderHeader.findOne({
        where: {
          [Op.and]: {
            id: id,
            UserId: req.user.id,
          },
        },
        include: {
          model: Order,
          include: Product,
        }
      });

      if (!orderHeader) throw { name: "OrderHeaderNotFound" };

      const orderHeaderUpdate = await OrderHeader.update(
        {
          status: "Cancelled",
        },
        {
          where: {
            id: id,
          },
        }, { transaction: t }
      );

      const productUpdate = await Product.update({
        stock: orderHeader.Product.stock - 1
      }, {
        where: {
          id: orderHeader.Product.id
        }
      }, { transaction: t })

      await t.commit();
      res.status(200).json({ message: "Order has been cancelled" });
    } catch (error) {
      await t.rollback();
      next(error);
    };
  };

  static async setStatusOrderHeader (req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { status } = req.body;
      const orderHeader = await OrderHeader.findOne({
        where: {
          id: id
        }
      });

      if (!orderHeader) throw { name: "OrderHeaderNotFound" };

      const orderHeaderUpdate = await OrderHeader.update(
        {
          status: status,
        },
        {
          where: {
            id: id,
          },
        }, { transaction: t }
      );
      
      await t.commit();
      res.status(200).json({ message: "Status has been changed" })
    } catch (error) {
      await t.rollback();
      next(error)
    }
  }
}

module.exports = OrderHeaderController;
