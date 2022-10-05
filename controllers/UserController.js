const { User, Class } = require("../models/Models");
const fs = require("fs");

const getProfile = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getProfile,
};
