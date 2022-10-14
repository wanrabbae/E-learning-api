const { Works, Assignment } = require("../models/Models");
const path = require("path");
const fs = require("fs");

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

const createWork = async (req, res) => {
  try {
    let file = "";

    const tempPath = req.file.path;
    file = req.file.filename + "." + req.file.mimetype.split("/")[1];
    const targetPath = path.join(`assets/${file}`);
    fs.rename(tempPath, targetPath, (err) => {
      if (err) return handleError(err, res);
    });

    const create = await Work.create({
      assignment_id: req.body.assignmentId,
      user_id: req.user.id,
      file: file,
      status: "success",
    });

    res.status(201).json({
      status: 201,
      message: "Berhasil mengumpulkan tugas!",
      data: create,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const deleteWork = async (req, res) => {
  try {
    const data = await Work.findOne({
      where: {
        id: req.query.id,
      },
    });

    fs.unlink(`assets/${data.file}`, (err) => {
      if (err) throw err;
      console.log("path/file.png/jpg/jpeg was deleted");
    });

    await Work.destroy({
      where: {
        id: req.query.id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Berhasil menghapus tugas!",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const updateStatusWork = async (req, res) => {
  try {
    const edit = await Work.update(
      {
        status: req.body.status,
      },
      { where: { id: req.body.id } }
    );

    res.status(201).json({
      status: 201,
      message: "Berhasil mengumpulkan tugas!",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getWorksWithAssignmentId,
  createWork,
  deleteWork,
  updateStatusWork,
};
