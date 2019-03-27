var express = require('express');
var router = express.Router();
const app = require("express")();
const stripe = require("stripe")("sk_test_pL746YFLARIUreXxyyHk8oxH");
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.use(require("body-parser").text());

app.post("/charge", async (req, res) => {
  let body = req.body.split('/')
  let realAmount = parseInt(body[0]) * 100
  console.log(req.body);
  try {
    let {status} = await stripe.charges.create({
      amount: realAmount,
      currency: "eur",
      description: "An example charge",
      source: body[1]
    });

    var mailAccountUser = 'twksender@gmail.com'
      var mailAccountPassword = 'the-web-kitchenSender'

      var fromEmailAddress = 'twksender@gmail.com'
      var toEmailAddress = body[2]

      var transport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
          user: mailAccountUser,
          pass: mailAccountPassword
        },
        tls: {
          rejectUnauthorized: false
        }
      }))

      var mail = {
        from: fromEmailAddress,
        to: toEmailAddress,
        subject: "Fausse facture pour votre faux achat dans ma fausse boutique",
        text: "Merci pour votre faux achat d'un montant de "+body[0]+"€ dans notre super boutique !",
        html: ""
      }

      transport.sendMail(mail, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + response.message);
        }
        transport.close();
      });

    res.json({status});
  } catch (err) {
    res.status(500).end();
  }
});

app.listen(9000, () => console.log("Listening on port 9000"));

module.exports = router;
