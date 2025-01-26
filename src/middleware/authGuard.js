const jwt = require("jsonwebtoken");
const authGuard = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    let authToken = "";
    if (req.headers.authorization) {
      authToken = req.headers.authorization.replace("Bearer", "").trim();
    }
    if (token || authToken) {
      const decoded = await jwt.verify(
        token || authToken,
        process.env.TOKEN_SECRET
      );

      if (decoded) {
        const user = {
          userEmail: decoded.email,
          userId: decoded.id,
        };

        req.user = user;

        next();
      }
    } else {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Token invalid", true));
    }
  } catch (error) {
    console.log("error from auth guard middleware ", error);
  }
};

module.exports = { authGuard };
