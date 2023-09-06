const UserController = require('../controllers/UserController')

const express = require('express')
const router = express.Router()
const auth = require('../auth')

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const minPasswordLength = 8;

const isValidInput = (body) => {
    if (!body.email || !emailRegex.test(body.email)) {
        return false;
    }
    if (!body.password || body.password.length < minPasswordLength) {
        return false;
    }
    return true;
};

// register
router.post('/register', async (request, response) => {
    try {
        if (!isValidInput(request.body)) {
            return response.status(400).json({ error: "Invalid email or password" });
        }

        const result = await UserController.register(request.body);

        response.status(201).json(result); 
    } catch (error) {
        console.error('Registration error:', error);
        
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

// login
router.post("/login", (request, response) => {

  if (!request.body || !request.body.email || !request.body.password) {
    return response.status(400).send("Missing required fields.");
  }

  UserController.login(request.body)
    .then((result) => {
      response.send(result);
    })
    .catch((error) => {
      console.error("Error in /login route.");

      response.status(500).send("An error occurred. Please try again.");
    });
});

// check-if-email-exist
router.post("/check-email", (request, response) => {

  if (!request.body.email || !emailRegex.test(request.body.email)) {
    return response.status(400).json('Invalid email format');
  }

  UserController.checkIfEmailExists(request.body).then((result) => {
      response.json(result);
    })
    .catch((error) => {

      console.error("Error in /check-email route:", error);
      response.status(500).send("Internal Server Error");
    });
});

// admin-update [ admin-only ]
router.patch('/admin-update', auth.verify, async (request, response) => {
  try {
    const data = {
      isAdmin: auth.decode(request.headers.authorization).isAdmin,
      email: request.body.email
    };

    const result = await UserController.updateAdmin(data);
    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /admin-update route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// update-user [ admin-only ]
router.delete('/update-user', auth.verify, async (request, response) => {
  try {
    const { email, isActive } = request.body;
    const isAdmin = auth.decode(request.headers.authorization).isAdmin;

    // Check if the user is an admin (if that's the requirement)
    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await UserController.updateActive(email, isActive);
    response.status(200).json(result);
  } catch (error) {
    handleError(error, response);
  }
});

// active-users [ admin-only ]
router.get('/users', auth.verify, async (request, response) => {
  try {
    const isAdmin = auth.decode(request.headers.authorization).isAdmin;

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can access this.' });
    }

    const result = await UserController.retrieveAllActiveUser();
    response.status(200).json(result);

  } catch (error) {
    console.error('Error in /active-users route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// all-users [ admin-only ]
router.get('/', auth.verify, async (request, response) => {
  try {
    const isAdmin = auth.decode(request.headers.authorization).isAdmin;

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can access this.' });
    }

    const result = await UserController.retrieveAllUser();
    response.status(200).json(result);

  } catch (error) {
    console.error('Error in /all-users route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
})

// user-details [ using-token ]
router.get("/details", auth.verify, (request, response) => {
  const user_data = auth.decode(request.headers.authorization);
  
  UserController.getProfile({ userId: user_data.id })
    .then(result => {
      if (!result) {
        return response.status(404).json({ message: "User profile not found." });
      }
      response.status(200).send(result);
    })
    .catch(error => {
      console.error('Error in /details route:', error);
      response.status(500).json({ message: 'Internal Server Error' });
    });
});

module.exports = router