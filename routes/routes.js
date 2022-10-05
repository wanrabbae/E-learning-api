const express = require("express");
const router = express.Router();
const Multer = require("multer");

const AuthCtrl = require("../controllers/AuthController");
const UserCtrl = require("../controllers/UserController");
const ClassCtrl = require("../controllers/ClassController");
const MaterialCtrl = require("../controllers/MaterialController");
const AssignCtrl = require("../controllers/AssignController");
const WorkCtrl = require("../controllers/WorkController");
const { isAuth } = require("../middleware/auth");

const Upload = Multer({ dest: "assets/" });

// USERS / AUTH
router.post("/register", AuthCtrl.register);
router.post("/login", AuthCtrl.login);
router.post("/logout", isAuth, AuthCtrl.logout);
router.get("/profile", isAuth, UserCtrl.getProfile);

// CLASS
router.get("/class", ClassCtrl.getClass);

// MATERIAL
router.get("/materials", MaterialCtrl.getMaterialWithClassId);

// ASSIGNMENT
router.get("/assignments", AssignCtrl.getAssignmentWithClassId);

// WORKS
router.get("/works", WorkCtrl.getWorksWithAssignmentId);

module.exports = router;
