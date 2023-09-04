const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const auth = require('../auth')

// register
router.post('/register', async (request, response) => {
  try {
    const registrationResult = await UserController.register(request.body);
    response.json(registrationResult);
  } catch (error) {
    console.error('Error in /register route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// login
router.post("/login", (request, response) => {
  UserController.login(request.body).then((result) => {
      response.send(result);
    })
  .catch((error) => {
      console.error("Error in /login route:", error);
      response.status(500).send("Internal Server Error");
    });
});

// check-if-email-exist
router.post("/check-email", (request, response) => {
  UserController.checkIfEmailExists(request.body).then((result) => {
      response.send(result);
    })
    .catch((error) => {
      console.error("Error in /check-email route:", error);
      response.status(500).send("Internal Server Error");
    });
});

// admin-update
router.patch('/admin-update', auth.verify, async (request, response) => {
  try {
    const { email, isAdmin } = request.body;

    // Validate input data (isAdmin is assumed to be a boolean)
    if (typeof isAdmin !== 'boolean' || !email) {
      return response.status(400).json({ error: 'Invalid data provided' });
    }

    const result = await UserController.updateAdmin(email, isAdmin);
    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /admin-update route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// delete-user [ admin-only ]
router.delete('/delete-user', auth.verify, async (request, response) => {
  try {
    const { email, isActive } = request.body;

    // Validate input data (isActive is assumed to be a boolean)
    if (typeof isActive !== 'boolean' || !email) {
      return response.status(400).json({ error: 'Invalid data provided' });
    }

    const result = await UserController.updateActive(email, isActive);
    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /admin-update route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// active-users [ admin-only ]
router.get('/active-users', auth.verify, (request, response) => {
  UserController.retrieveAllActiveUser().then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error in /active-users route:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// all-users [ admin-only ]
router.get('/all-users', auth.verify, (request, response) => {
  UserController.retrieveAllUser().then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error in /active-users route:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// user-details [ using-token ]
router.get("/details", auth.verify, async (request, response) => {
  try {
    // Decoding the token securely
    const token = request.headers.authorization;
    const user_data = auth.decode(token);

    if (!user_data || !user_data.id) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    // Perform authorization checks if needed

    // Fetch user profile based on the user's ID
    const result = await UserController.getProfile({ userId: user_data.id });

    // Respond with the user's profile data
    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /details route:', error);

    // Handle and respond to errors
    if (error.name === 'UnauthorizedError') {
      response.status(401).json({ error: "Unauthorized" });
    } else {
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = router