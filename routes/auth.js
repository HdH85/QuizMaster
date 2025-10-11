var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var UserService = require('../services/UserService');
var userService = new UserService();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
const { isAuth, isAdmin } = require('../middleware/authMiddleware');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get('/', async(req, res, next)=> {
  res.render('user', { title: 'Sign in' });
});

router.post('/register', jsonParser, async(req, res, next)=> {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        data: {
          message: 'Username and password are required'
        }
      });
    }
    
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        data: {
          message: 'Username already exists'
        }
      });   
    }
    
    const user = await userService.register(username, password);
    if (!user) {
      return res.status(500).json({
        success: false,
        statuscode: 500,
        data: {
          message: 'Error creating user'
        }
      })
    }
    return res.status(200).json({
      success: true,
      statuscode: 200,
      data: {
        message: `User account created successfully! Welcome ${user.username}!`
      }
    })
  } catch (error) {
    console.error('Error creating user: ', error);
    return res.status(500).json({
      success: false,
      statuscode: 500,
      data: {
        message: error.message
      }
    })
  }
})

router.post('/login', jsonParser, async(req, res, next)=> {
  try {
    const {username, password} = req.body;
    const user = await userService.login(username, password);
    
    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(400).json({
          success: false,
          statuscode: 400,
          data: {
            message: 'Invalid credentials'
          }
        });
      } else {
        const token = jwt.sign({
          userId: user.id,
          username: user.username,
          userType: user.userType
        }, process.env.TOKEN_SECRET, {
          expiresIn: '1h'
        });
        return res.status(200).json({
          success: true,
          statuscode: 200,
          data: {
            message: `Welcome ${user.username}!`,
            token: token
          }       
        })
      }
    }
  } catch (error) {
    console.error('Error logging in: ', error);
    return res.status(500).json({
      success: false,
      statuscode: 500,
      data: {
        message: error.message
      }
    });
  }
})

module.exports = router;
