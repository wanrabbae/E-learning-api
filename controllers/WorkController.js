const { Works, Assignment } = require("../models/Models");

const getWorksWithAssignmentId = async (req, res) => {
  try {
    const data = await Works.findAll({
      where: {
        assignment_id: req.query.id,
      },
      include: { model: Assignment },
    });
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
  getWorksWithAssignmentId,
};
