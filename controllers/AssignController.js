const { Assignment } = require("../models/Models");

const getAssignmentWithClassId = async (req, res) => {
  try {
    let data;

    if (req.query.id) {
      data = await Assignment.findOne({
        where: {
          class_id: req.query.id,
        },
      });
    } else {
      data = await Assignment.findAll({});
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
  getAssignmentWithClassId,
};
