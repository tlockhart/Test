const express = require('express');

// Conveniently handles routes with different endpoints
const router = express.Router();

// Import to direct to controller
const UserController = require('../../controllers/user');

//Import check Auth MiddleWare
const checkAuth = require('./authenticators/check-auth');

// localhost:3000/user/informatin/:userEmail
router.get('/information/:userEmail', UserController.users_get_user); // post

// localhost:3000/user/register
router.post('/register', UserController.user_register); // post

// localhost:3000//user/login/refresh
router.post('/login/refresh', checkAuth, UserController.user_refreshTokens);

// create a token
// localhost:3000/user/login
router.post('/login', UserController.user_login);

// localhost:3000/user/5d75802fa50af037b063668d
router.delete('/:userId', checkAuth, UserController.user_delete); // delete

module.exports = router;