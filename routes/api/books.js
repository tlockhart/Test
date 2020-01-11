const router = require("express").Router();
const booksController = require("../../controllers/booksController");

// Matches with "/api/books", when params are passed through the body or none passed.
router.route("/")
  .get(booksController.findAll)
  .post(booksController.create);

// Matches with "/api/books/:id", when params are passed in the URL
router
  .route("/:id")
  .get(booksController.findById)
  .put(booksController.update)
  .delete(booksController.remove);

module.exports = router;
