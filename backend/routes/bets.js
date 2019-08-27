const express = require("express");
const multer = require("multer");

const router = express.Router();
const Bet = require('../models/bet');

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
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const bet = new Bet({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    private: req.body.private,
    prize: req.body.prize,
    participants: req.body.participants,
    imagePath: url + "/images/" + req.file.filename
  });
  // When saving the Bet is is required to update the ID cause it was created as null
  bet.save().then(createdBet => {
    res.status(201).json({
      message: "Bet added successfully",
      bet: {
        ...createdBet,
        id: createdBet._id
      }
    });
  });
});

router.put("/:id", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const bet = new Bet({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    private: req.body.private,
    prize: req.body.prize,
    participants: req.body.participants,
    imagePath: imagePath
  })
  Bet.updateOne({
    _id: req.params.id
  }, bet).then(result => {
    res.status(200).json({
      message: "Update successful!"
    })
  });
});

router.get('', (req, res, next) => {
  Bet.find()
    .then(documents => {
      res.status(200).json({
        message: 'Bets fetched successfully',
        bets: documents
      });
    });
});

router.get("/:id", (req, res, next) => {
  Bet.findById(req.params.id).then(bet => {
    if (bet) {
      res.status(200).json(bet);
    } else {
      res.status(404).json({
        message: "Bet not found!"
      });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Bet.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Bet deleted!"
    });
  })
})

module.exports = router;
