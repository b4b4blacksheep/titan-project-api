const User = require('../models/User')
const bcrypt = require('bcrypt')
const auth = require('../auth')

// register
module.exports.register = async (data) => {
  try {

    // Using asynchronous bcrypt.hash instead of hashSync
    const encrypted_password = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      email: data.email,
      password: encrypted_password,
      mobileNumber: data.mobileNumber,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const created_user = await newUser.save();

    return {
      message: 'User successfully registered!',
      // Decide if you want to return userId based on your use case
      userId: created_user._id 
    };

  } catch (error) {
    console.error('Error in register:', error);
    throw error;
  }
};

// login
module.exports.login = async (data) => {
  try {
    console.log(data)
    const user = await User.findOne({ email: data.email });


    if (!user) {
      return {
        message: "Invalid email!"
      };
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

    if (!isPasswordCorrect) {
      return {
        message: "Please provide the correct password!"
      }
    }

    return {
      accessToken: auth.createAccessToken(user)    
    };

  } catch (error) {
    console.error('Error in login.');
    throw error; // Rethrow the error to be handled by the caller
  }
};

// check-if-email-exist
module.exports.checkIfEmailExists = async (data) => {
  try {

    const emailToCheck = data.email;

    const result = await User.findOne(
      { email: emailToCheck },
      { _id: 0, email: 1 }
    );

    return !!result;

  } catch (error) {
    console.error('Error in checkIfEmailExists:', error);
    throw error;
  }
};

// admin-update [ admin-only ]
module.exports.updateAdmin = async (data) => {
  // Validate input data
  if (!data.email) {
    throw new Error('Email is required');
  }

  // Check if the user making the request is an admin
  if (!data.isAdmin) {
    throw new Error('Permission denied: Only admins can update this status');
  }

  try {
    // Fetch the current user's data
    const currentUser = await User.findOne({ email: data.email });

    // If the user is not found, throw an error
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Toggle the isAdmin value
    const newIsAdminStatus = !currentUser.isAdmin;

    // Update the user's isAdmin status in the database
    const updatedUser = await User.findOneAndUpdate(
      { email: data.email },
      { isAdmin: newIsAdminStatus },
      { new: true } // To get the updated document
    );

    // Return the updated user
    return {
      message: 'Admin status has been updated successfully!',
      updatedAdmin: { email: updatedUser.email, isAdmin: updatedUser.isAdmin },
    };
  } catch (error) {
    console.error('Error in updateAdmin:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// update-user [ admin-only ]
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
  return User.find({ isActive: true })
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
  return User.findById(data.userId)
    // .select('-__v -password -isActive') 
    .then(user => {
      if (!user) {
        throw new Error("User not found.");
      }
      return user;
    })
    .catch(error => {
      console.error('Error in getProfile:', error);
      throw error;  
    });
};

// add-address [users-only]
module.exports.addAddress = async (userId, newAddress) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return { status: 'error', message: 'User not found' };
    }

    // Iterate through existing addresses and set isPrimary to false
    user.addresses.forEach(address => {
      address.isPrimary = false;
    });

    // Add the new address and set its isPrimary to true
    newAddress.isPrimary = true;
    user.addresses.push(newAddress);

    // Validate only the modified paths
    await user.validate(user.modifiedPaths());

    // Save without running validation again
    await user.save({ validateBeforeSave: false });

    return { status: 'success', message: 'Address added successfully', data: user };
  } catch (error) {
    console.error('Error in addAddress:', error);
    return { status: 'error', message: 'Internal Server Error' };
  }
};

// removing-address [ users-only ]
module.exports.removeAddress = async (userId, addressId) => {
  try {
    // Find the user first
    const user = await User.findById(userId);

    if (!user) {
      return { status: 'error', message: 'User not found' };
    }

    // Remove the address with the given ID
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

    // Validate only the modified paths
    await user.validate(user.modifiedPaths());

    // Save without running validation again
    await user.save({ validateBeforeSave: false });
    
    return { status: 'success', message: 'Address removed successfully', data: user };
  } catch (error) {
    console.error('Error in removeAddress:', error);
    return { status: 'error', message: 'Internal Server Error' };
  }
};

// user-adressess [ users-only | using-token ]
module.exports.getAddress = async (data) => {
  try {
    const user = await User.findById(data.userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.addresses && user.addresses.length > 0) {
      // Sort addresses so that primary addresses come first
      const sortedAddresses = user.addresses.sort((a, b) => b.isPrimary - a.isPrimary);
      return sortedAddresses;
    } else {
      // Return an empty array or some default value if no addresses are found
      return [];
    }
  } catch (error) {
    console.error('Error in getAddress:', error);
    throw error;
  }
};

