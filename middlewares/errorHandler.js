function errorHandler(err, req, res, next) {
  let status = null;
  let errMessage = null;

  switch (err.name) {
    case "SequelizeValidationError":
      status = 400;
      errMessage = err.errors.map((el) => {
        return el.message;
      });
      break;
      case "SequelizeUniqueConstraintError":
        if (err.original.constraint === "Users_username_key") {
            status = 409;
            errMessage = ["Username is already used by other users"];
            break;
        } else if (err.original.constraint === "Users_email_key") {
            status = 409;
            errMessage = ["Email is already used by other users"];
            break;
        }  
    case "ERROR_ID_NOT_FOUND":
      status = 404;
      errMessage = `data with id ${err.id} not found`;
      break;
    case "LOGIN_BAD_REQUEST":
      status = 400;
      errMessage = "Email/Password is required";
      break;
    case "WRONG_EMAIL_AND_PW":
      status = 401;
      errMessage = "Email or password not found!";
      break;
    case "EMAIL_INVALID":
      status = 401;
      errMessage = "Invalid email or password"
      break;
    case "ProfileAlreadyExists":
      status = 401;
      errMessage = "Profile Already Exists"
       break;
    case "JsonWebTokenError":
      status = 401;
      errMessage = "error token";
      break;
    case "NOT_AUTHORIZED":
      status = 401;
      errMessage = "not authorized";
      break;
    case "OrderNotFound":
      status = 404;
      errMessage = "Order Not Found";
      break;
    case "MissingAccessToken":
      status = 401;
      errMessage = "Missing Access Token";
      break;
    case "OrderHeaderFound":
      status = 409;
      errMessage = "This order has checked out"
      break;
    case "ShippingNotFound":
      status = 404;
      errMessage = "Shipping Not Found";
      break;
    case "ProductNotAvailable":
      status = 400;
      errMessage = "Product is unavailable/sold out"
      break;
    case "ProductNotFound":
      status = 404;
      errMessage = "Product Not Found";
      break;
    case "OrderHeaderNotFound":
      status = 404;
      errMessage = "Order Header Not Found";
      break;
    default:
      status = 500;
      errMessage = "Internal Server Error";
      break;
  }
  console.log(err);

  res.status(status).json({
    success: false,
    err: errMessage,
  });
}

module.exports = errorHandler;
