const nodeMailer = require('nodemailer');
const reminder = require('./templates/reminder.ejs');
const ejs = require('ejs');
require('dotenv').config();

nodeMailer.use('compile', ejs)

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

const mailOptions = {
  from: process.env.APP_EMAIL,
  to: process.env.APP_EMAIL,
  subject: 'Test Email',
  html: ejs.renderFile(__dirname + 'templates/reminder.ejs', (templ)=> {
    console.log(templ);
  })
};

// transporter.sendMail(mailOptions, (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info);
//   }
// });

const something = ejs.render(__dirname + 'templates/reminder.ejs');

console.log(something)
