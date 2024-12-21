//imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

//database connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Database connection error:", error));


//middlewares - processing the incoming request before it reaches the route handler
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use( session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.sessionStore.message;
  next();
});

//static files
app.use(express.static("uploads"));


//set the view engine to ejs
app.set("view engine", "ejs");


//router prefix
app.use("", require("./routes/routes"));

//start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
