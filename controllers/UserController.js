const { User, Class } = require("../models/Models");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const getProfile = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });

    if (data.photo == null || data.photo == "") {
      data.photo = null;
    } else {
      data.photo = `${req.protocol}://${req.get("host")}/assets/${data.photo}`;
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

const updateUser = async (req, res) => {
  try {
    let image = "";
    let hashPassword;

    if (req.body.password) {
      if (req.body.password !== req.body.password_confirmed) {
        return res.status(400).json({
          status: 400,
          message: "Password confirmation doesn't match!",
        });
      }

      const salt = await bcrypt.genSalt(20);
      hashPassword = await bcrypt.hash(req.body.password, salt).then((hash) => {
        return hash;
      });
    }

    const data = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (req.file) {
      if (data.photo != null || data.photo != "") {
        if (data.photo == null || data.photo == "") {
        } else {
          fs.unlink(`assets/${data.photo}`, (err) => {
            if (err) throw err;
            console.log("path/file.png/jpg/jpeg was deleted");
          });
        }
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
          password: req.body.password ? hashPassword : data.password,
        },
        { where: { id: req.user.id } }
      );
    } else {
      await User.update(
        {
          nama: req.body.nama,
          email: req.body.email,
          password: req.body.password ? hashPassword : data.password,
        },
        { where: { id: req.user.id } }
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
