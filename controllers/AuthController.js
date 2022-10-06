const bcrypt = require("bcrypt");
const { User } = require("../models/Models");
const jwt = require("jsonwebtoken");

const tokens = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "365d" });
};

const register = async (req, res) => {
  try {
    if (req.body.password !== req.body.password_confirmed) {
      return res.status(400).json({
        status: 400,
        message: "Password confirmation doesn't match!",
      });
    }

    const salt = await bcrypt.genSalt(20);
    const hashPassword = await bcrypt
      .hash(req.body.password, salt)
      .then((hash) => {
        return hash;
      });

    const createUser = await User.create({
      nama: req.body.nama,
      email: req.body.email,
      role: req.body.role,
      password: hashPassword,
    });

    res.status(201).json({
      status: 201,
      message: "success register user",
      token: tokens({ id: createUser.id }),
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user == null) {
      return res.status(400).json({
        status: 400,
        message: "Email tidak terdaftar!",
      });
    }
    const hash = password;
    const check = await bcrypt
      .compare(hash, user.password)
      .then(function (result) {
        return result;
      });
    if (check == false) {
      return res.status(400).json({
        status: 400,
        message: "Password salah!",
      });
    }

    const token = tokens({ id: user.id });

    return res.json({
      status: 200,
      message: "login berhasil",
      token: token,
      data: {
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  return res.json({
    status: 200,
    message: "Berhasil log out",
  });
};

module.exports = {
  register,
  login,
  logout,
};
