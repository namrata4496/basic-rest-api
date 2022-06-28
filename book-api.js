const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require('dotenv');
dotenv.config()

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(cors());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3dgot.mongodb.net/test?retryWrites=true&w=majority`,
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("library-books");
    const booksCollection = db.collection("books");

    app.post("/book", (req, res) => {
      booksCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.get("/books", (req, res) => {
      db.collection("books")
        .find()
        .toArray()
        .then((results) => {
          res.render("book-list.ejs", { books: results });
        })
        .catch((error) => console.error(error));
    });

    app.delete("/books/:isbn", (req, res) => {
      const isbno = req.params.isbn;
      booksCollection
        .deleteOne({ isbn: isbno })
        .then((result) => {
          res.json(`Deleted`);
        })
        .catch((error) => console.error(error));
    });

    app.get("/books/:isbn", (req, res) => {
      const isbno = req.params.isbn;
      booksCollection
        .find({ isbn: isbno })
        .toArray()
        .then((result) => {
          console.log(result);
          res.json(result);
        })
        .catch((error) => console.error(error));
    });

    app.post("/books/:isbn", (req, res) => {
      const isbno = req.params.isbn;
      const newBook = req.body;
      booksCollection
        .findOneAndUpdate(
          { isbn: isbno },
          {
            $set: {
              isbn: newBook.isbn,
              title: newBook.title,
              author: newBook.author,
              publisher: newBook.publisher,
              publish_date: newBook.publish_date,
              numOfPages: newBook.numOfPages,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
       //   res.json("Success");
          res.redirect('/books')
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));

app.listen(port, () => {
  console.log(`Hello world app listening on port ${port}!`);
});
