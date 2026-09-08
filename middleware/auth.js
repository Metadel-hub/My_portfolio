const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'መግባት አልተቻለም፡ ፍቃድ የሎትም።' });
  }

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'supersecretkey');
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: 'የተሳሳተ ወይም ጊዜው ያለፈበት Token።' });
  }
};

module.exports = verifyAdmin;