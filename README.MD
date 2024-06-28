# Guest Room Booking Application

## Project Overview

This guest room booking application is designed for house owners to manage their property listings and bookings, while customers can browse available rooms and make reservations. The application supports short-term stays of less than 30 days.

## Key Features

### House Owners
- Register an account with an email address and a mobile number.
- Create, edit, and delete rooms and their details.
- Set minimum and maximum booking periods and rent amounts per day.

### Customers
- Register an account with an email address and a mobile number.
- Browse available rooms for booking.
- View details and photos of each room.
- Check availability via a calendar.
- Choose dates and book rooms.

## Technologies and Packages Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Bootstrap**: CSS framework for responsive web design.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Axios Instance**: Implemented proper header token for API's in common function.
- **React Router**: For routing and navigation in React applications.
- **Rolebased Authorisation**: Implemented prodected routes with Guest Guard & Auth Guard.
- **UTILS**: Implemented JWT Decode functionality.

### Sample Frontend Routing:
```
//AppRoutes.js
const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  ROOMS: "/rooms"
};

export const Paths = {
  // Authentication routes
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },
  // Dashboard routes
  dashboard: {
    root: ROOTS.DASHBOARD,
    dashboard: `${ROOTS.DASHBOARD}/users`,
    manageRooms: `${ROOTS.DASHBOARD}/manageRooms`,
    userAddEdit: `${ROOTS.DASHBOARD}/userAddEdit`,
    addEditRooms: `${ROOTS.DASHBOARD}/addEditRooms`,
  },
  rooms: {
    bookRoom: `${ROOTS.ROOMS}/bookRoom`,
  },
};
```


### Backend
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Web application framework for Node.js.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **JWT (jsonwebtoken)**: For user authentication.
- **bcryptjs**: For hashing passwords.
- **dotenv**: For managing environment variables.
- **cors**: Middleware for enabling CORS.
- **morgan**: HTTP request logger middleware for Node.js.
- **joi**: For schema validation.

### Sample Backend Routing:

```

router.post('/register', validate(userValidation.register), authController.registerUser);
router.post('/login', validate(userValidation.login), authController.login);

// create User
router.post('/create',authenticate, validate(userValidation.create), userController.createUser);

// get all users
router.get('/details',authenticate, userController.getUsers);

// get user by id
router.post('/detailById',authenticate, userController.getUserById);

// update user by id
router.put('/update',authenticate, validate(userValidation.update), userController.updateUser);

// delete user by id
router.delete('/delete',authenticate, validate(userValidation.delete), userController.deleteUser);

// Create a new room
router.post('/create',authenticate, validate(roomController.createRoom), roomController.createRoom);

// Get all rooms
router.post('/details', roomController.getAllRooms);

// Get room by ID
router.post('/detailById',validate(roomValidation.getById), roomController.getRoomById);

// Update room by ID
router.put('/update',  validate(roomValidation.update), roomController.updateRoom);
router.post('/createBooking', roomController.createBooking);

// Delete room by ID
router.delete('/delete', authenticate, validate(roomValidation.delete), roomController.deleteRoom);

// App.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes')
const app = express();

require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/room', roomRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

### Database
- **MongoDB**: NoSQL database for storing user, room, and booking data.

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### Backaned project setup & installation
# Navigate to the backend directory
- cd /backend

# Install dependencies
- node version - v20.15.0
- npm install

### Frontend project setup & installation
# Navigate to the frontend directory
- cd /frontend

# Install dependencies

- npm install --legacy-peer-deps

