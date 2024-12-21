const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

//image upload
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");

//insert a user to the database
router.post("/add", upload, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });

    await user.save();
    req.session.message = {
      type: "success",
      message: "User added successfully",
    };
    res.redirect("/");
  } catch (error) {
    res.json({ message: err.message, type: "danger" });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { title: "Users", users: users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

module.exports = router;
