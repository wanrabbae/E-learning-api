const { Material } = require("../models/Models");
const path = require("path");
const fs = require("fs");
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

    data.map((dt) => {
      dt.file =
        dt.file != "" || dt.file != null
          ? `${req.protocol}://${req.get("host")}/assets/${dt.file}`
          : null;
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

const createMaterial = async (req, res) => {
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

    const create = await Material.create({
      class_id: req.body.classId,
      title: req.body.title,
      description: req.body.description,
      file: file,
    });

    res.status(201).json({
      status: 201,
      message: "Berhasil membuat materi!",
      data: create,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const data = await Material.findOne({
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

    await Material.destroy({
      where: {
        id: req.query.id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Berhasil menghapus materi!",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const updateMaterial = async (req, res) => {
  try {
    let file = "";

    const data = await Material.findOne({
      where: {
        id: req.body.id,
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

      await Material.update(
        {
          title: req.body.title,
          description: req.body.description,
          file: file,
        },
        { where: { id: req.body.id } }
      );
    } else {
      await Material.update(
        {
          title: req.body.title,
          description: req.body.description,
        },
        { where: { id: req.body.id } }
      );
    }

    res.status(201).json({
      status: 201,
      message: "Berhasil mengedit materi!",
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
  createMaterial,
  deleteMaterial,
  updateMaterial,
};
