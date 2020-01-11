const db = require("../models");

// Defining methods for the booksController
module.exports = {
  findAll: function(req, res) {
    db.Book
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Book
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    // console.log("CONTROLLER = "+JSON.stringify(req.body));
    // console.log("CONTROLLER = "+req.body.bookId);
    db.Book.find({"bookId": req.body.bookId})
    .then(function(doc){
      if(doc.length > 0)
      {
        // console.log("book already in db");
      }
      else{
        //console.log("book NOT already in db");
        db.Book
          .create(req.body)
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      }//else
    })//then
    .catch(function(error){
      //console.log(error);
    })
  },
  update: function(req, res) {
    db.Book
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Book
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
