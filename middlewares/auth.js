// var jwt = require('jsonwebtoken');
const { User, Profile, Store, Product } = require("../models/index.js");
const { decode } = require("../helpers/jwt");

const authentication = (req, res, next) => {
  try {
    // Require access_token from req.headers;
    const { access_token } = req.headers;
    if (!access_token) throw { name: "MissingAccessToken" };

    // Decode access_token
    const { id, role } = decode(access_token);
    console.log(id, role, decode(access_token));
    req.userId = id;
    req.userRole = role;
    // Find User from Database
    User.findByPk(req.userId, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [Store],
    })
      .then((user) => {
        if (user) {
          req.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            Store: user.Store,
          };
          next();
        } else {
          throw { name: "NOT_AUTHORIZED" };
        }
      })
      .catch((err) => {
        throw { err };
      });
  } catch (err) {
    next(err);
  }
};

const authenticationAdmin = (req, res, next) => {
  const id = req.params.id;
  User.findOne(id)
    .then((user) => {
      if (!user) {
        next({ status: 404, message: `User with id ${id} not found` });
      } else {
        if (req.userRole === "admin") {
          if (user.id !== req.userId) {
            return next({ status: 403, message: `Banned` });
          } else {
            return next();
          }
        } else {
          return next();
        }
      }
    })
    .catch((err) => {
      next(err);
    });
};
const authorizationProfile = (req, res, next) => {
  const id = req.params.id;
  Profile.findByPk(id)
    .then((data) => {
      if (!data) {
        next({ status: 404, message: `Profile dengan ${id} tidak ditemukan` });
      } else {
        if (data.UserId !== req.userId) {
          return next({ status: 403, message: `Forbidden!` });
        } else {
          return next();
        }
      }
    })
    .catch((err) => {
      next(err);
    });
};
const authorizationStore = (req, res, next) => {
  const id = req.params.id;
  Store.findByPk(id, { include: [User] })
    .then((data) => {
      if (!data) {
        return next({ status: 404, message: `Not Found!` });
      } else {
        if (data.UserId !== req.userId) {
          return next({ status: 403, message: `Forbidden!` });
        } else {
          return next();
        }
      }
    })
    .catch((err) => {
      next(err);
    });
};

const authorizationProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findByPk(id)
    .then((data) => {
      if (!data) {
        return next({ status: 404, message: `Not Found!` });
      } else {
        return next();
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  authentication,
  authenticationAdmin,
  authorizationProfile,
  authorizationStore,
  authorizationProduct,
};
