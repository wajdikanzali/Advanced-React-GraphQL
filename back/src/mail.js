const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const makeANiceEmail = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>

    <p>😘, Wajdi kanzali</p>
  </div>
`;

const promisifyEmailSender = (transporterMail, mailOptions) => new Promise((resolve, reject) => {
    transporterMail.sendMail(mailOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

async function sendEmailSMTP(receiver, resetToken) {
    try {
        const transporterMail = transport;
        const mailOptions = {
          from: 'kanzali.wajdi@gmail.com',
          to: receiver,
          subject: 'Reset Your Password',
          html: makeANiceEmail(`Your Password Reset Token is here! \n\n 
          <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>
          Click Here to Reset
          </a>`),
        };
    
        const emailSent = await promisifyEmailSender(transporterMail, mailOptions);
        return emailSent;
      } catch (error) {
        console.error(`[Error SMTP sending mail] : ${error}`);
        throw new Error(`[Error SMTP sending mail] : ${error}`);
      }
};

exports.sendEmailSMTP = sendEmailSMTP;
