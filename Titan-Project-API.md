This is API request is a project made for the Titan-Project-App, this is written by Sir Carlo Corcuera intended for the Titan Project App. This is a guide sheet for this API project. The API Project is developed September 06, 2023. 

1. Getting Started
2. Prerequisites
3. Installation
4. Usage
5. Testing

**Getting Started**
	These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

**Prerequisites**
	- Node.js
	- MongoDB
	- Bcrypt
	- Cors
	- Dotenv
	- Express
	- JSONWebToken
	- Mongoose

**Installation**
	- [a] Clone the repository:
	- [b] Navigate through the project directory
	- [c] Install the required dependencies
	- [d] Start the development server
	
**## Usage**

	API Endpoints
		POST /users/register - Register New User
		POST /users/login - Login a User
		POST /users/check-email - Check if the email is already existing
		PATCH /users/admin-update - Update the users 'isAdmin' [ admin only ]
		DEL /users/update-user - Update the users 'isActive' [ admin only ]
		GET /users/users - Check all active users [ admin only ]
		GET /users/ - Check all users [ admin only ]
		GET /users/details - Check users details [ using-token ]

		POST /products/create-product - Create product [ admin only ]
		GET /products/ - Show active products 
		GET /products/:productId - Show product details
		GET /products/all-products - Show all products [ admin only ]
		PATCH /products/:productId/update-product - Update product details [ admin only ]
		DEL /products/:productId/archive-product - Archieve & activate product [ admin only ]

		POST /orders/create-order - Create order [ user only ]
		GET /orders/active-orders - Show all orders [ admin only ]
		GET /orders/ - Show all orders [ user only ]


