var nodemailer = require("nodemailer");

function sendMail(email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9f5e207f04135f", // replace with your Mailtrap credentials
      pass: "039d6e778b0420",
    },
  });

  var mailOptions = {
    from: "flowartta@gmail.com",
    to: `${email}`,
    subject: `${subject}`,
    text: `${text}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
  });
}

module.exports = sendMail;
