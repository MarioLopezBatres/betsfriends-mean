const Bet = require('../models/bet');

exports.createBet = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const bet = new Bet({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    private: req.body.private,
    prize: req.body.prize,
    participants: req.body.participants,
    imagePath: url + "/images/bets/" + req.file.filename,
    // Added in check-auth.js
    creator: req.userData.userId
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a bet failed"
      });
    });
};

exports.updateBet = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/bets/" + req.file.filename;
  }
  const bet = new Bet({
    _id: req.body.id,
    creator: req.userData.creator,
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
      _id: req.params.id,
      creator: req.userData.userId
    }, bet).then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Update successful!"
        })
      } else res.status(401).json({
        message: "Not authorized!"
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update bet!"
      });
    });
};


exports.getBets = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = req.query.page;
  const betMode = req.query.mode;
  betQuery = Bet.find();
  let fetchedBets;
  if (pageSize && currentPage) {
    betQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  betQuery.find()
    .then(documents => {
      fetchedBets = documents;
      return Bet.count();
    }).then(count => {
      res.status(200).json({
        message: 'Bets fetched successfully',
        bets: fetchedBets,
        maxBets: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching bets failed"
      });
    });
};

exports.getBet = (req, res, next) => {
  Bet.findById(req.params.id).then(bet => {
    if (bet) {
      res.status(200).json(bet);
    } else {
      res.status(404).json({
        message: "Bet not found!"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching bet failed"
    });
  });
};

exports.deleteBet = (req, res, next) => {
  Bet.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    if (result.n > 0)
      res.status(200).json({
        message: "Deletion successful!"
      })
    else res.status(401).json({
      message: "Not authorized!"
    })
  }).catch(error => {
    res.status(500).json({
      message: "Removing bet failed"
    });
  });
};
