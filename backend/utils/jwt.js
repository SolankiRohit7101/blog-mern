import jwt from "jsonwebtoken";
const jwtToken = (res, user, message, next = () => console.log("testing")) => {
  const { password: pass, ...userData } = user._doc;
  const { email, name, _id, profile_image, bio } = userData;
  const accessToken = jwt.sign(
    { email, name, _id, profile_image ,bio },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const decode = jwt.verify(accessToken, process.env.JWT_SECRET);
  return res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      path: "/",
      // domain: process.env.MY_URL,
    })
    .json({ success: true, message, decode })
    .status(200);
};

export default jwtToken;
