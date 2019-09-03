const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // The convection is to use Bearer token
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "+HoF+Sj+lmRCo@ODssWDNlauB4SRkLl1dvooYCg8dslLlNlZfVnVFVoro2wGeIiZF38GBnJ5D8CdlTH02tIRCig==");
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "You are not authenticated!"
    });
  }
}
