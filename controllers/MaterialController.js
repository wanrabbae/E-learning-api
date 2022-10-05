const { Material } = require("../models/Models");

const getMaterialWithClassId = async (req, res) => {
  try {
    let data;

    if (req.query.id) {
      data = await Material.findOne({
        where: {
          class_id: req.query.id,
        },
      });
    } else {
      data = await Material.findAll({});
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
  getMaterialWithClassId,
};
