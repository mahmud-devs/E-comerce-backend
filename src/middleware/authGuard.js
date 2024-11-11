const jwt = require("jsonwebtoken");
const authGuard = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (token || req.headers.authorization) {
      const decoded = await jwt.verify(
        token || req.headers.authorization,
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
