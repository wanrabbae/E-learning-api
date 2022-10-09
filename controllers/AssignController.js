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

const createAssignment = async (req, res) => {
  try {
    let file = "";

    if (req.file) {
      const tempPath = req.file.path;
      file = req.file.filename + "." + req.file.mimetype.split("/")[1];
      const targetPath = path.join(`assets/${file}`);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
      });
    }

    const create = await Assignment.create({
      class_id: req.body.classId,
      title: req.body.title,
      description: req.body.description,
      expired: new Date(req.body.expired),
      file: file,
    });

    res.status(201).json({
      status: 201,
      message: "Berhasil membuat tugas!",
      data: create,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const data = await Assignment.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (data.file != null || data.file != "") {
      fs.unlink(`assets/${data.file}`, (err) => {
        if (err) throw err;
        console.log("path/file.png/jpg/jpeg was deleted");
      });
    }

    await Assignment.destroy({
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

const updateAssignment = async (req, res) => {
  try {
    let file = "";

    const data = await Assignment.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (req.file) {
      fs.unlink(`assets/${data.file}`, (err) => {
        if (err) throw err;
        console.log("path/file.png/jpg/jpeg was deleted");
      });

      const tempPath = req.file.path;
      file = req.file.filename + "." + req.file.mimetype.split("/")[1];
      const targetPath = path.join(`assets/${file}`);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
      });

      await Assignment.update(
        {
          title: req.body.title,
          description: req.body.description,
          expired: new Date(req.body.expired),
          file: file,
        },
        { where: { id: req.body.id } }
      );
    } else {
      await Assignment.update(
        {
          title: req.body.title,
          description: req.body.description,
          expired: new Date(req.body.expired),
        },
        { where: { id: req.body.id } }
      );
    }

    res.status(201).json({
      status: 201,
      message: "Berhasil mengedit tugas!",
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
  createAssignment,
  deleteAssignment,
  updateAssignment,
};
