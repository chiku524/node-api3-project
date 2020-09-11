const express = require('express');

const users = require('./userDb');
const posts = require("../posts/postDb");
//const {post} = require("../posts/postRouter");

const router = express.Router();

router.post('/users/', validateUser, (req, res) => {
  // do your magic!
  users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({message: "could not add user to the database"});
    })
});

router.post('/users/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  let post = {
    text: req.body.text, 
    user_id: req.params.id
  };

  posts.insert(post)
    .then(comment => {
      res.status(201).json(comment);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: "could not post the comment"});
    })
});

router.get('/users/', (req, res) => {
  // do your magic!
  users.get().then(user => {
    res.status(200).json(user);
  })
});

router.get('/users/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/users/:id/posts', (req, res) => {
  // do your magic!
  users.getUserPosts(req.params.id).then(posts => {
    res.status(200).json(posts)
  })
});

router.delete('/users/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  users.remove(req.params.id).then(user => {
    res.status(200).json(user);
  })
});

router.put('/users/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  users.update(req.params.id, req.body).then(newUser => {
    res.status(201).json(newUser);
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  users.getById(id).then(user => {
    if(user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({message: "ID does not exist"});
    }
  })
}

function validateUser(req, res, next) {
  // do your magic!
  if(!req.body) {
    res.status(400).json({message: "user data not valid"});
  }
  next();
}

function validatePost(req, res, next) {
  // do your magic!
  if(!req.body) {
    res.status(400).json({message: "Post data not found"});
  } else {
    next();
  }
}

module.exports = router;
