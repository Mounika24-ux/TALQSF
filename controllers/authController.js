const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    res.status(200).json({ message: "Login successful", username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { username, newPassword, phone } = req.body;

  try {
    // Find user by username or phone
    const user = await User.findOne({ 
      $or: [
        { username: username },
        { phone: phone }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};