const express = require("express");
const multer = require("multer");

const BetController = require("../controllers/bets");
const extractFile = require("../middleware/file")
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, extractFile, BetController.createBet);

router.put("/:id", checkAuth, extractFile, BetController.updateBet);

router.get('', BetController.getBets);

router.get("/:id", BetController.getBet);

router.delete("/:id", checkAuth, BetController.deleteBet);

module.exports = router;
