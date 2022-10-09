const express = require("express");
const router = express.Router();
const Multer = require("multer");

const AuthCtrl = require("../controllers/AuthController");
const UserCtrl = require("../controllers/UserController");
const ClassCtrl = require("../controllers/ClassController");
const MaterialCtrl = require("../controllers/MaterialController");
const AssignCtrl = require("../controllers/AssignController");
const WorkCtrl = require("../controllers/WorkController");
const { isAuth, isTeacher, isStudent } = require("../middleware/auth");

const Upload = Multer({ dest: "assets/" });

// USERS / AUTH
router.post("/register", AuthCtrl.register);
router.post("/login", AuthCtrl.login);
router.post("/logout", isAuth, AuthCtrl.logout);
router.get("/profile", isAuth, UserCtrl.getProfile);

// CLASS
router.get("/class", isAuth, ClassCtrl.getClass);
router.post(
  "/class",
  isAuth,
  isTeacher,
  Upload.single("banner"),
  ClassCtrl.createCalss
);
router.delete("/class", isAuth, isTeacher, ClassCtrl.deleteClass);
router.put(
  "/class",
  isAuth,
  isTeacher,
  Upload.single("banner"),
  ClassCtrl.updateCalss
);

// MATERIAL
router.get("/materials", isAuth, MaterialCtrl.getMaterialWithClassId);
router.post(
  "/materials",
  isAuth,
  isTeacher,
  Upload.single("file"),
  MaterialCtrl.createMaterial
);
router.delete("/materials", isAuth, isTeacher, MaterialCtrl.deleteMaterial);
router.put(
  "/materials",
  isAuth,
  isTeacher,
  Upload.single("file"),
  MaterialCtrl.updateMaterial
);

// ASSIGNMENT
router.get("/assignments", isAuth, AssignCtrl.getAssignmentWithClassId);
router.post(
  "/assignments",
  isAuth,
  isTeacher,
  Upload.single("file"),
  AssignCtrl.createAssignment
);
router.delete("/assignments", isAuth, isTeacher, AssignCtrl.deleteAssignment);
router.put(
  "/assignments",
  isAuth,
  isTeacher,
  Upload.single("file"),
  AssignCtrl.updateAssignment
);

// WORKS
router.get("/works", isAuth, isTeacher, WorkCtrl.getWorksWithAssignmentId);
router.post(
  "/works",
  isAuth,
  isStudent,
  Upload.single("file"),
  WorkCtrl.createWork
);
router.delete("/works", isAuth, isStudent, WorkCtrl.deleteWork);

module.exports = router;
