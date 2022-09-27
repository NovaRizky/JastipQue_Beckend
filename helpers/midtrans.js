
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction : false,
  serverKey : 'SB-Mid-server-o3giYRu4s32D2brLtgUO6_tt'
});
 
let parameter = {
  transaction_details: {
    order_id: "",
    gross_amount: 0
  },
  credit_card:{
    secure : true
  },
  customer_details: {
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  }
};

function fillParameter (data) {
  const { orderId, grossAmount, firstName, lastName, email, phoneNumber } = data;

  return parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount
    },
    credit_card:{
      secure : true
    },
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phoneNumber
    }
  };
};

async function snapRequest (parameter) {
  return snap.createTransaction(parameter)
    .then((transaction) => {
      let transactionToken = transaction.token;
      let url = transaction.redirect_url
      return ({ transactionToken, url });
    })
    .catch((error) => {
      return error
    })
};

module.exports = {
  fillParameter,
  snapRequest
};
