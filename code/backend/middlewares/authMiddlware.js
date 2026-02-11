const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(401).send({ message: "Authorization header missing", success: false });
    }

    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Token is not valid", success: false });
      }
      req.body.userId = decode.id;
      req.body.userType = decode.type; // optional: store type for role checks
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};