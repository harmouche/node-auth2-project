const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const { isValid } = require("../users/users-service.js");


router.post("/register", (req, res) => {
    const credentials = req.body;
  
    if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;
      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;
  
      Users.add(credentials)
        .then(user => {
          const token = genToken(saved);
          res.status(201).json({ data: user, token });
        })
        .catch(error => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({
        message: "please provide username and password and the password shoud be alphanumeric",
      });
    }
  });

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: "Welcome to our API",
            token
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
          console.log(error)
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role: user.role
  };
  const options = {
    expiresIn: "2h"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}


router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'error logging out:', error: err });
            } else {
                res.json({ message: 'logged out' });
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;