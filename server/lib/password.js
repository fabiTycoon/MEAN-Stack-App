var PasswordGenerator = {}

PasswordGenerator.newPassword = function (length) {
  var tempPassword = '';
  
  var randomString = function (stringLength, chars) {
    var result = '';
    
    for (var i = stringLength; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.stringLength)];
      }
    return result;
  }

  tempPassword = randomString(length, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  return tempPassword;
}


module.exports = PasswordGenerator;