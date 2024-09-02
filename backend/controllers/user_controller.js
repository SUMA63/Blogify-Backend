import User from "../models/user.js";
import bcrypt from "bcrypt";

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No User Found" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existingUser) {
    return res
      .status(404)
      .json({ message: "User Already Exists! Login Instead" });
  }
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password , saltRounds);

  const newUser = new User({
    name,
    email,
    password : hashedPassword,
    blogs : [],
  });

  try {
    await newUser.save(); // Save the new user instance
  } catch (err) {
    return console.log(err);
  }

  return res.status(201).json({ user: newUser }); 

 
};

export const login = async(req, res, next) => {
    const {email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Could not find User" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password , existingUser.password);
  if(!isPasswordCorrect) {
    return res.status(404).json({message: "Incorrect Password"})
  }
  return res.status(200).json({message: "Login Successful"})
};

