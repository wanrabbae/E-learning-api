const { Material } = require("../models/Models");

const getMaterialWithClassId = async (req, res) => {
  try {
    const data = await Material.findAll({
      where: {
        class_id: req.query.id,
      },
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
  getMaterialWithClassId,
};
