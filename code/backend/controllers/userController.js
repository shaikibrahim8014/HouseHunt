const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const propertySchema = require("../schemas/propertyModel");
const bookingSchema = require("../schemas/bookingModel");

////////// Register /////////////////////////////
const registerController = async (req, res) => {
  try {
    const { email, password, type, name } = req.body;

    if (!email || !password || !type || !name) {
      return res.status(400).send({ message: "Missing required fields", success: false });
    }

    const existsUser = await userSchema.findOne({ email });
    if (existsUser) {
      return res.status(409).send({ message: "User already exists", success: false });
    }

    let granted = type === "Owner" ? "ungranted" : undefined;

    const newUser = new userSchema({
      email,
      password, // schema will hash this automatically
      type,
      name,
      ...(granted && { granted }),
    });

    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

////////// Login /////////////////////////////
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required", success: false });
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password", success: false });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).send({ message: "JWT secret not configured", success: false });
    }

    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};
  const getAllBookingsForAdminController = async (req, res) => {
    try {
      const bookings = await bookingSchema.find({});
      return res.status(200).send({ success: true, data: bookings });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: "Internal server error" });
    }
  };


////////// Forgot Password /////////////////////////////
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Email and new password are required", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await userSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    return res.status(200).send({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

////////// Auth /////////////////////////////
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Auth error", success: false, error });
  }
};

////////// Get All Properties /////////////////////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties || allProperties.length === 0) {
      return res.status(404).send({ success: false, message: "No properties available" });
    }
    res.status(200).send({ success: true, data: allProperties });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error fetching properties", success: false });
  }
};

////////// Booking Handle /////////////////////////////
const bookingHandleController = async (req, res) => {
  const { propertyid } = req.params;
  const { userDetails, status, userId, ownerId } = req.body;

  try {
    if (!userDetails || !userDetails.fullName || !userDetails.phone) {
      return res.status(400).send({ success: false, message: "Missing user details" });
    }

    const booking = new bookingSchema({
      propertyId: propertyid,
      userID: userId,
      ownerID: ownerId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: status,
    });

    await booking.save();

    return res.status(200).send({ success: true, message: "Booking status updated" });
  } catch (error) {
    console.error("Error handling booking:", error);
    return res.status(500).send({ success: false, message: "Error handling booking" });
  }
};

////////// Get All Bookings for Single Tenant /////////////////////////////
const getAllBookingsController = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).send({ success: false, message: "User ID is required" });
    }
    const getAllBookings = await bookingSchema.find({ userID: userId });
    return res.status(200).send({ success: true, data: getAllBookings });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
  getAllBookingsForAdminController
};