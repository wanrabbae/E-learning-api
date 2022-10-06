const jwt = require("jsonwebtoken");
const { User } = require("../models/Models");

exports.isAuth = (req, res, next) => {
  const tokenBearer = req.header("Authorization");

  if (!tokenBearer) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }

  const token = tokenBearer.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized. silahkan login terlebih dahulu",
      });
    }
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] },
    });
    req.user = user;
    next();
  });
};
