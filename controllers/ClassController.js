const { Class, User, Assignment, Material } = require("../models/Models");

const getClass = async (req, res) => {
  try {
    let data;

    if (req.query.id) {
      data = await Class.findOne({
        where: { id: req.query.id },
        include: [{ model: User }, { model: Material }, { model: Assignment }],
      });
    } else {
      data = await Class.findAll({
        include: { model: User, attributes: { exclude: ["password"] } },
      });
    }

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
