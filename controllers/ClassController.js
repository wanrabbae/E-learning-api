const { Class, User, Assignment, Material } = require("../models/Models");
const path = require("path");
const fs = require("fs");

const getClass = async (req, res) => {
  try {
    let data;

    if (req.query.id) {
      data = await Class.findOne({
        where: { id: req.query.id },
        include: [
          { model: User, attributes: { exclude: ["password"] } },
          { model: Material },
          { model: Assignment },
        ],
      });
    } else {
      data = await Class.findAll({
        include: { model: User, attributes: { exclude: ["password"] } },
      });
    }

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        data[i]["banner"] =
          data[i]["banner"] != "" || data[i]["banner"] != null
            ? `${req.protocol}://${req.get("host")}/assets/${data[i]["banner"]}`
            : null;
      }
    } else {
      data.banner =
        data.banner != "" || data.banner != null
          ? `${req.protocol}://${req.get("host")}/assets/${data.banner}`
          : null;
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

const createCalss = async (req, res) => {
  try {
    let banner = "";

    const data = await Class.findOne({
      where: {
        title: req.body.title,
      },
    });

    if (data) {
      return res.status(400).json({
        status: 400,
        message: "Nama kelas sudah digunakan!",
      });
    }

    if (req.file) {
      const tempPath = req.file.path;
      banner = req.file.filename + "." + req.file.mimetype.split("/")[1];
      const targetPath = path.join(`assets/${banner}`);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
      });
    }

    const create = await Class.create({
      banner: banner,
      title: req.body.title,
      teacher_id: req.user.id,
    });

    res.status(201).json({
      status: 201,
      message: "Berhasil membuat kelas!",
      data: create,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const deleteClass = async (req, res) => {
  try {
    const data = await Class.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (data.banner != null || data.banner != "") {
      fs.unlink(`assets/${data.banner}`, (err) => {
        if (err) throw err;
        console.log("path/file.png/jpg/jpeg was deleted");
      });
    }

    await Class.destroy({
      where: {
        id: req.query.id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Berhasil menghapus kelas!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const updateCalss = async (req, res) => {
  try {
    let banner = "";

    const data = await Class.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (req.file) {
      fs.unlink(`assets/${data.banner}`, (err) => {
        if (err) throw err;
        console.log("path/file.png/jpg/jpeg was deleted");
      });

      const tempPath = req.file.path;
      banner = req.file.filename + "." + req.file.mimetype.split("/")[1];
      const targetPath = path.join(`assets/${banner}`);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
      });

      await Class.update(
        {
          banner: banner,
          title: req.body.title,
        },
        { where: { id: req.body.id } }
      );
    } else {
      await Class.update(
        {
          title: req.body.title,
        },
        { where: { id: req.body.id } }
      );
    }

    res.status(201).json({
      status: 201,
      message: "Berhasil mengedit kelas!",
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
  getClass,
  createCalss,
  deleteClass,
  updateCalss,
};
