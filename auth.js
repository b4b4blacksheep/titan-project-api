const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const secret = process.env.JWT_SECRET || 'api_actual_secret_key_is_007';

// For creating a token out of the user's details and the secret key
module.exports.createAccessToken = (user) => {
  try {
    const data = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };

    const token = jwt.sign(data, secret, {});

    return token;
  } catch (error) {
    console.error(error);
    throw new Error('Error while creating the access token.');
  }
};

// For verifying if the token from the user is valid based on the secret key
module.exports.verify = (request, response, next) => {
  const token = request.headers.authorization;

  // If token is received and not undefined
  if (typeof token !== "undefined") {
    const tokenString = token.slice(7); // Remove "Bearer " prefix

    jwt.verify(tokenString, secret, (error, data) => {
      if (error) {
        return response.status(401).json({ error: "Unauthorized" });
      } else {
        next();
      }
    });
  } else {
    return response.status(401).json({ error: "Unauthorized" });
  }
};

// For extracting the user data from the token
module.exports.decode = (token) => {
  if (typeof token !== "undefined") {
    token = token.slice(7); // Remove "Bearer " prefix

    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      console.error("JWT verification error:", error);
      return null;
    }
  } else {
    return null;
  }
};