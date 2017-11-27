const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.locals.msg = '';
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send', (req, res) => {
  let output = `
    <h1>New Email!</h1>
     <ul>
       <li>Name: ${req.body.name}</li>
       <li>Email: ${req.body.email}</li>
       <li>Subject: ${req.body.subject}</li>
       <li>Message: ${req.body.message}</li>
     </ul>
  `;

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.YOURDOMAIN.com',
    port: 587,
    secure: false,
    auth: {
        user: 'YOUREMAIL',
        pass: 'YOURPASSWORD'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <your@email.com>', // sender address
      to: 'RECEIVEREMAILS', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
});

server.listen(port, () => console.log(`App running on port ${port}`));
