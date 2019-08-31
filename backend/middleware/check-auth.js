const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // The convection is to use Bearer token
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "+HoF+Sj+lmRCo@ODssWDNlauB4SRkLl1dvooYCg8dslLlNlZfVnVFVoro2wGeIiZF38GBnJ5D8CdlTH02tIRCig==");
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth failed!"
    });
  }
}
