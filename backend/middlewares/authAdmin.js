import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(400).json({ message: "Invalid Authentication" });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid Authentication" });
    }

    next()
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export default authAdmin;
