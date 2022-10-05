const bcrypt = require("bcrypt");
const { User, Class } = require("../models/Models");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const data = await User.findAll({});
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

const getProfile = (req, res) => {
  return res.status(200).json({
    status: 200,
    data: {
      nama: "Alwan",
    },
  });
};

module.exports = {
  getUser,
  getProfile,
};
