const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

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

//get a single user
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

//edit a user
router.get("/edit/:id", async (req, res) => {
  try {
    //extract id from route parameter
    const id = req.params.id;
    console.log("ID received:", id);

    if (mongoose.isValidObjectId(id)) {
      const user = await User.findById(id);

      if (user) {
        res.render("edit_users", {
          title: "Edit User",
          user: user,
        });
      } else {
        res.status(404).send("User not found");
      }
    } else {
      console.error("Invalid ID format:", id);
      res.status(404).send("Invalid ID format");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//update a user
router.post("/update/:id", upload, async (req, res) => {
  //get user id
  const id = req.params.id;
  //get new image
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    const oldImagePath = "./uploads/" + req.body.old_image;
    try {
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } else {
        console.warn("Old image not found:", oldImagePath);
      }
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  } else {
    new_image = req.body.old_image;
  }

  //update user with new data
  await User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  });

  req.session.message = {
    type: "success",
    message: "User updated successfully",
  };

  res.redirect("/");
});

//delete a user
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find and remove the user by ID
    const result = await User.findByIdAndDelete(id);

    if (result) {
      // If the user has an associated image, delete it
      if (result.image !== '') {
        try {
          fs.unlinkSync(`./uploads/${result.image}`);
        } catch (error) {
          console.error("Error deleting image file:", error);
        }
      }

      // Set a success message and redirect
      req.session.message = {
        type: "info",
        message: "User deleted successfully",
      };
      res.redirect("/");
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
