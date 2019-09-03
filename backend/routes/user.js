const express = require("express");
const UserController = require("../controllers/user");
const extractFile = require("../middleware/file")
const router = express.Router();

/**
 * Store a new user within an encypted password
 */
router.post("/signup", extractFile, UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
