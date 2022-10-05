const { Class, User } = require("../models/Models");

const getClass = async (req, res) => {
  try {
    const data = await Class.findAll({
      include: { model: User },
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
  getClass,
};
