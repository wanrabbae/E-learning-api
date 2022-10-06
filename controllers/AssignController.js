const { Op } = require("sequelize");
const { Assignment, Works } = require("../models/Models");

const getAssignmentWithClassId = async (req, res) => {
  try {
    let data;

    if (req.query.id) {
      if (req.user.role == "siswa") {
        data = await Assignment.findOne({
          where: {
            class_id: req.query.id,
          },
          raw: true,
          nest: true,
        });

        const findWork = await Works.findAll({
          where: { user_id: req.user.id },
          raw: true,
          nest: true,
        });

        data.works = findWork;
      } else {
        data = await Assignment.findOne({
          where: {
            class_id: req.query.id,
          },
        });
      }
    } else {
      data = await Assignment.findAll({});
    }

    return res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAssignmentWithClassId,
};
