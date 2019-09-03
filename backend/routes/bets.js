const express = require("express");
const multer = require("multer");

const BetController = require("../controllers/bets");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/bets");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", checkAuth, multer({
  storage: storage
}).single("image"), BetController.createBet);

router.put("/:id", checkAuth, multer({
  storage: storage
}).single("image"), BetController.updateBet);

router.get('', BetController.getBets);

router.get("/:id", BetController.getBet);

router.delete("/:id", checkAuth, BetController.deleteBet);

module.exports = router;
