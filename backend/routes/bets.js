const express = require("express");

const router = express.Router();
const Bet = require('../models/bet');

router.post("", (req, res, next) => {
  const bet = new Bet({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    private: req.body.private,
    comments: req.body.comments,
    prize: req.body.prize,
    participants: req.body.participants
  });
  // When saving the Bet is is required to update the ID cause it was created as null
  bet.save().then(createdBet => {
    res.status(201).json({
      message: "Bet added successfully",
      betId: createdBet._id
    });
  });
});

router.put("/:id", (req, res, next) => {
  const bet = new Bet({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    private: req.body.private,
    comments: req.body.comments,
    prize: req.body.prize,
    participants: req.body.participants
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
