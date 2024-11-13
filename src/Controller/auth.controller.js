const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const {
  mailChecker,
  passwordChecker,
  numberChecker,
} = require("../Helpers/validator.js");
const userModel = require("../Model/user.model.js");
const { makeHashPassword, comparePassword } = require("../Helpers/bcrypt.js");
const { sendMail } = require("../Helpers/nodeMailer.js");
const { numberGenerate } = require("../Helpers/numberGenerator.js");
const { makeJWTToken } = require("../Helpers/jwtToken.js");

const Registration = async (req, res) => {
  try {
    const { firstName, email, mobile, adress1, password } = req.body;

    // ============== check if all inforation is inputed

    if (!firstName || !email || !mobile || !adress1 || !password) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "user credential missing", true));
    }

    // ============== check if email or password format is valid

    if (!mailChecker(email) || !passwordChecker(password)) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "user email or password format is invalid",
            true
          )
        );
    }

    // =========== now encrypt the password

    const hashPassword = await makeHashPassword(password);

    // ======= generate otp
    const otp = await numberGenerate();

    // ========== send verification mail

    const isEmailSent = await sendMail(email, otp);

    if (!isEmailSent?.response) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            501,
            null,
            "mail was not sent, internal server error",
            true
          )
        );
    }

    // ======== save data in database
    const saveUserData = await new userModel({
      firstName,
      email,
      mobile,
      adress1,
      password: hashPassword,
      OTP: otp,
    }).save();

    return res
      .status(200)
      .json(
        new apiResponce(true, saveUserData, "Registration successfull", false)
      );
  } catch (error) {
    console.log(error);

    return res
      .status(501)
      .json(new apiError(false, 501, null, "api responce error", true));
  }
};

// ========== verify otp route =============

const verifyOtp = async (req, res) => {
  try {
    const { emailormobile, otp } = req.body;

    // =========== check email or otp

    if (!emailormobile || !otp) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "otp credential missing", true));
    }

    // ============ verify user with otp==================

    const isExistUser = await userModel
      .findOne({
        $and: [{ email: emailormobile }, { OTP: otp }],
      })
      .select("-password ");

    if (!isExistUser) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "invaid otp or email", true));
    }

    isExistUser.userVerified = true;
    isExistUser.OTP = null;
    isExistUser.save();
    // ===========

    return res
      .status(200)
      .json(
        new apiResponce(true, isExistUser, "otp verify successfull", false)
      );
  } catch (error) {
    console.log(`${error}`);

    return res
      .status(501)
      .json(new apiError(false, 501, null, "vrify-oto responce error", true));
  }
};

// ============= login route ================

const login = async (req, res) => {
  try {
    const { emailormobile, password } = req.body;
    if (!emailormobile || !password) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Login credential missing", true));
    }

    // ======== check the info in database

    const loggedUser = await userModel.findOne({
      $or: [{ email: emailormobile }, { mobile: emailormobile }],
    });

    // ========= decrypt password ==============

    const isCorrectPassword = await comparePassword(
      password,
      loggedUser?.password
    );

    if (!isCorrectPassword) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, "Password credenrial invalid", true)
        );
    }

    // ============ generate token ============

    const tokenCredential = {
      id: loggedUser._id,
      email: loggedUser.email,
    };

    const token = await makeJWTToken(tokenCredential);

    if (token) {
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true, secure: true })
        .json(
          new apiResponce(
            true,
            200,
            {
              token: `Bearer ${token}`,
              userEmail: loggedUser.email,
              userId: loggedUser._id,
            },
            "Login successfull",
            false
          )
        );
    }

    // =========
  } catch (error) {
    console.log(`${error}`);

    return res
      .status(501)
      .json(new apiError(false, 501, null, "login route responce error", true));
  }
};

// ================ logout route ======================
const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json(new apiResponce(true, 200, null, "Logout successfull", false));
  } catch (error) {
    console.log(`${error}`);

    return res
      .status(501)
      .json(new apiError(false, 501, null, "logout coltroller error", true));
  }
};

// ================== reset password ===================

const resetPassword = async (req, res) => {
  try {
    for (let key in req.body) {
      if (!req.body[key]) {
        return res
          .status(401)
          .json(new apiError(false, 401, null, `${key} is missing !!`, true));
      }
    }

    // ============== email or phone validate===

    if (
      mailChecker(req.body.emailormobile) ||
      numberChecker(req.body.emailormobile)
    ) {
    } else {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "Email/Mobile format invalid", true)
        );
    }

    // ======================== password validate =============

    if (!passwordChecker(req.body.newPassword)) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "New password format invalid", true)
        );
    }

    // ====== search email or phone number in database =============

    const CheckUser = await userModel.findOne({
      $or: [
        { email: req.body.emailormobile },
        { mobile: req.body.emailormobile },
      ],
    });

    if (!CheckUser) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "invalid Email or phone", true));
    }
    // ======= compare password =================

    const isCorrectPassword = await comparePassword(
      req.body.oldPassword,
      CheckUser?.password
    );

    if (!isCorrectPassword) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "password credential invalid", true)
        );
    }
    // ======== encrypt new password =================

    const newHashPassword = await makeHashPassword(req.body.newPassword);

    if (newHashPassword) {
      CheckUser.password = newHashPassword;
      await CheckUser.save();
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            CheckUser,
            "reset password successfull",
            false
          )
        );
    }
    return res
      .status(401)
      .json(new apiError(false, 401, null, "User not found", true));
  } catch (error) {
    console.log(`${error}`);

    return res
      .status(501)
      .json(
        new apiError(false, 501, null, "reset password coltroller error", true)
      );
  }
};

// ================== reset email ======================

const resetEmail = async (req, res) => {
  try {
    for (let key in req.body) {
      console.log(key);
      if (!req.body[key]) {
        return res
          .status(401)
          .json(new apiError(false, 401, null, `${key} is missing !!`, true));
      }
    }
    // =========== email validate ==================
    if (!mailChecker(req.body.oldEmail) || !mailChecker(req.body.newEmail)) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "old Email / new Email format invalid",
            true
          )
        );
    }
    // ======= check user in database ============

    const checkUser = await userModel.findOne({
      $or: [{ email: req.body.oldEmail }],
    });

    if (!checkUser) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "invalid Email user not found", true)
        );
    }

    // ================ check to see if password is correct =============

    const isCorrectPassword = await comparePassword(
      req.body.password,
      checkUser?.password
    );

    if (isCorrectPassword) {
      checkUser.email = req.body.newEmail;
      checkUser.save();
      return res
        .status(200)
        .json(
          new apiResponce(true, 200, checkUser, "email reset successful", false)
        );
    }
    return res
      .status(401)
      .json(
        new apiError(false, 401, null, "Password credential invalid", true)
      );

    // =====================================
  } catch (error) {
    console.log(`${error}`);

    return res
      .status(501)
      .json(
        new apiError(false, 501, null, "reset email coltroller error", true)
      );
  }
};

// ================== recovery email =================

const recoveryEmail = async (req, res) => {
  try {
    const { userId } = req.user;

    const { recoveryEmail } = req.body;
    if (!recoveryEmail || !mailChecker(recoveryEmail)) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "recovery email format invalid", true)
        );
    }

    const recovery = await userModel.findByIdAndUpdate({ _id: userId });

    if (recovery.recoveryEmail === recoveryEmail) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "recovery email already in use", true)
        );
    }

    recovery.recoveryEmail = recoveryEmail;
    await recovery.save();

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          recovery,
          "recovery email set successfully",
          false
        )
      );

    // =====================
  } catch (error) {
    console.log(error.code);

    return res
      .status(501)
      .json(
        new apiError(false, 501, null, "recovery email coltroller error", true)
      );
  }
};

module.exports = {
  Registration,
  verifyOtp,
  login,
  logout,
  resetPassword,
  resetEmail,
  recoveryEmail,
};
