const { User, Class } = require("../models/Models");
const path = require("path");
const fs = require("fs");

const getProfile = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
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

const updateUser = async (req, res) => {
  try {
    let image = "";

    const data = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (req.file) {
      if (data.image != null || data.image != "") {
        fs.unlink(`assets/${data.image}`, (err) => {
          if (err) throw err;
          console.log("path/file.png/jpg/jpeg was deleted");
        });
      }

      const tempPath = req.file.path;
      image = req.file.filename + "." + req.file.mimetype.split("/")[1];
      const targetPath = path.join(`assets/${image}`);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
      });

      await User.update(
        {
          photo: image,
          nama: req.body.nama,
          email: req.body.email,
        },
        { where: { id: req.body.id } }
      );
    } else {
      await User.update(
        {
          nama: req.body.nama,
          email: req.body.email,
        },
        { where: { id: req.body.id } }
      );
    }

    res.status(200).json({
      status: 200,
      message: "Berhasil mengedit user!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.query.id,
      },
    });

    res.status(200).json({
      status: 200,
      message: "Berhasil menghapus user!",
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
  getProfile,
  deleteUser,
  updateUser,
};
