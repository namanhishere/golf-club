const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ message: 'Registration successful. Membership is pending approval.' });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body; 

  try {
    // 1. Find User
    const user = await User.findByEmail(email);
    
    // 2. Validate Credentials (Plain text for demo as per your code)
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Determine Role
    const role = await User.findRoleById(user.user_id);

    // 4. Generate Token
    const token = jwt.sign(
      { id: user.user_id, role: role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Send Response
    res.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: role,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_pic: user.profile_pic_url
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};