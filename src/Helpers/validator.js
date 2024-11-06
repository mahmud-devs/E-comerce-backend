const mailChecker = (email) => {
  const mailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{3})$/i;
  return mailRegex.test(email);
};

const passwordChecker = (password) => {
  const passwordRegex =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
  return passwordRegex.test(password);
};

const numberChecker = (number) => {
  const numberRegex = /^(?:\+8801|01)[1-9][0-9]{8}$/;
  return numberRegex.test(number);
};

module.exports = { mailChecker, passwordChecker, numberChecker };
