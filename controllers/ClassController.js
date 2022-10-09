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
        id: req.query.id,
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
