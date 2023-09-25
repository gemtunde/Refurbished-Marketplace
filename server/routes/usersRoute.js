const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

//new user registration
router.post("/register", async (req, res) => {
  try {
    //check if user exist
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("user already exists");
    }

    //hash paasword
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    //save user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "User created Sucessfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//user login
router.post("/login", async (req, res) => {
  try {
    //check if user exist
    const user = await User.findOne({ email: req.body.email });

    //user not found
    if (!user) {
      throw new Error("User not found");
      //res.send({ message: "User not found" });
    }
    //user not found
    if (user.status !== "active") {
      throw new Error("User account is blocked. Pls contact admin");
      //res.send({ message: "User not found" });
    }
    //compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("invalid password");
      //res.send({ message: "invalid password" });
    }

    //encrypt token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });

    //user success
    res.send({
      success: true,
      message: "User login Suceesful",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
//get all user
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//update user status

router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await User.findByIdAndUpdate(req.params.id, { status });

    res.send({
      success: true,
      message: "Product Status Updated Successful",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
