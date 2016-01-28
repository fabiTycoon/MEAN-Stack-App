var api_key = process.env.MAILGUN_API_KEY;
var domain = process.env.EMAIL_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var Email = {};

Email.sendMessage = function (email, password) {

  var data = {
    from: 'info@hollistonmeadows.com',
    to: email,
    subject: 'Welcome to Holliston Meadows',
    text: 'Thanks for booking a stay with us! Your temporary password for your account is ' + password +
      '.  Please <a href="http://www.hollistonmeadows.com/api/resetPass">sign in</a> to set your password.'
  };
   
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = Email;
