const express = require("express");
const router = express.Router();
const Multer = require("multer");

const UserCtrl = require("../controllers/UserController");
const ClassCtrl = require("../controllers/ClassController");
const MaterialCtrl = require("../controllers/MaterialController");
const AssignCtrl = require("../controllers/AssignController");
const WorkCtrl = require("../controllers/WorkController");

const Upload = Multer({ dest: "assets/" });

// USERS
router.get("/users", UserCtrl.getUser);

// CLASS
router.get("/class", ClassCtrl.getClass);

// MATERIAL
router.get("/materials", MaterialCtrl.getMaterialWithClassId);

// ASSIGNMENT
router.get("/assignments", AssignCtrl.getAssignmentWithClassId);

// WORKS
router.get("/works", WorkCtrl.getWorksWithAssignmentId);

module.exports = router;
