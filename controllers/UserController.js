const User = require('../models/User')
const bcrypt = require('bcrypt')
const auth = require('../auth')

// register
module.exports.register = async (data) => {
  try {
    // Validate data (e.g., email format, password strength)
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        message: 'Email is already registered'
      };
    }

    // Hash the password
    const encrypted_password = bcrypt.hashSync(data.password, 10);

    // Create a new user
    const newUser = new User({
      email: data.email,
      password: encrypted_password,
    });

    // Save the user to the database
    const created_user = await newUser.save();

    return {
      message: 'User successfully registered!',
      userId: created_user._id
    };
  } catch (error) {
    console.error('Error in register:', error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// login
module.exports.login = async (data) => {
  try {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return {
        message: "Authentication failed"
      };
    }

    const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

    if (isPasswordCorrect) {
      return {
        accessToken: auth.createAccessToken(user)
      };
    }

    return {
      message: "Authentication failed"
    };
  } catch (error) {
    console.error('Error in login:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// check-if-email-exist
module.exports.checkIfEmailExists = async (data) => {
  try {
    const emailToCheck = data.email;
    
    const result = await User.findOne(
      { email: emailToCheck },
      { _id: 0, email: 1 } // Projection, it guarantees that the found document will only return email only.
    );

    return !!result; // Convert the result to a boolean

  } catch (error) {
    console.error('Error in checkIfEmailExists:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// admin-update [ admin-only ]
module.exports.updateAdmin = (email, isAdmin) => {
  // Validate input data (isAdmin is assumed to be a boolean)
  if (typeof isAdmin !== 'boolean') {
    throw new Error('Invalid isAdmin value');
  }

  return User.findOneAndUpdate(
    { email: email },
    { isAdmin: isAdmin },
    { new: true } // To get the updated document
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new Error('Admin status update failed: User not found');
      }

      // Return the updated user
      return {
        message: 'Admin status has been updated successfully!',
        updatedAdmin: { email: updatedUser.email, isAdmin: updatedUser.isAdmin },
      };
    })
    .catch((error) => {
      console.error('Error in updateAdmin:', error);
      throw error; // Rethrow the error to be handled by the caller
    });
};

// delete-user [ admin-only ]
module.exports.updateActive = (email, isActive) => {
  // Validate input data (isActive is assumed to be a boolean)
  if (typeof isActive !== 'boolean') {
    throw new Error('Invalid isActive value');
  }

  return User.findOneAndUpdate(
    { email: email },
    { isActive: isActive },
    { new: true } // To get the updated document
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new Error('Admin status update failed: User not found');
      }

      // Return the updated user
      return {
        message: 'Account status has been updated successfully!',
        updatedAdmin: { email: updatedUser.email, isActive: updatedUser.isActive },
      };
    })
    .catch((error) => {
      console.error('Error in isActive:', error);
      throw error; // Rethrow the error to be handled by the caller
    });
};

// active-users [ admin-only ]
module.exports.retrieveAllActiveUser = () => {
  return User.find({ isAdmin: false })
    .select('-__v -isAdmin -password') // Exclude __v, isAdmin, and password fields
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error; // Rethrow the error to be handled by the caller
    });
};

// all-users [ admin-only ] 
module.exports.retrieveAllUser = () => {
  return User.find({ }).select('-__v') // Exclude __v fields
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw error; // Rethrow the error to be handled by the caller
    });
};

// user-details [ using-token ]
module.exports.getProfile = (data) => {
  // Use a projection to exclude the password field
  return User.findById(data.userId, { password: 0 })
    .then((result) => {
      if (!result) {
        throw new Error('User not found');
      }

      // Create a new object without the password field
      const profileData = { ...result.toObject() };
      delete profileData.password;
      delete profileData.__v;
      delete profileData.isAdmin;

      return profileData;
    });
};