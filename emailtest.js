const nodeMailer = require('nodemailer');
const Email = require('email-templates');
require('dotenv').config();
const path = require('path');
const ejs = require('ejs');
const emailPath = path.join(`${__dirname}/emails/test/subject.ejs`);

const transport = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

const testData = {
  name: 'Joey'
}

ejs.renderFile(emailPath, testData, (err, html) => {

  const mailOpts = {
    from: 'footballpick.app@gmail.com',
    to: 'footballpick.app@gmail.com',
    subject: 'EJS Test File',
    html
  };

  transport.sendMail(mailOpts, (err, info) => {
    if (err) console.log(err); // Handle Error

    console.log(info);
  });

});


// const templates = path.join('templates');
//
// const transporter = nodeMailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.APP_EMAIL,
//     pass: process.env.APP_PASSWORD
//   }
// });

// const sendTemplate = transporter.templateSender(
//   new Email({
//     views: { root: templates }
//   })
// );

// const email = new Email({
//   message: {
//     from: 'footballpick.app@gmail.com'
//   },
//   // uncomment below to send emails in development/test env:
//   send: true,
//   transport: {
//     jsonTransport: true
//   }
// });
//
// email.send({
//   template: 'test',
//   message: {
//     to: 'footballpick.app@gmail.com'
//   },
//   locals: {
//     name: 'Elon'
//   }
// }).then(console.log).catch(console.error);

// const mailOptions = {
//   from: process.env.APP_EMAIL,
//   to: process.env.APP_EMAIL,
//   subject: 'Test Email',
//   html: sendTemplate
// };

// transporter.sendMail(mailOptions, (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info);
//   }
// });
