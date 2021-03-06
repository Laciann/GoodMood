

const mongoose = require('mongoose');
const user = mongoose.model('User');
const store = mongoose.model('Store');
const review = mongoose.model('Review');
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const {
  catchErrors
} = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);



// load all users
router.get('/users', function (req, res) {
  user.find({}, function (err, users) {
    res.render('users', { users: users });
  });
});

//grant
router.get('/users/:id/grant', function (req, res) {
  let id = req.params.id;
  user.findById(id, function (err, user) {
    if (err) return handleError(err);

    user.set({ isAdmin: 1 });
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect("/users");
    });
  });
});

//revoke
router.get('/users/:id/revoke', function (req, res) {
  let id = req.params.id;
  user.findById(id, function (err, user) {
    if (err) return handleError(err);

    user.set({ isAdmin: 0 });
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect("/users");
    });
  });
});
//  admin page ko  lagi lyang lyang
router.get('/admin', function (req, res) {
  if (req.user.isAdmin === true) 
    res.render('adminHome');
  else
    res.redirect('/404');
});
// users

// request object bata admin route handle gareko
router.get('/LoginRole', authController.isLoggedIn, function(req,res) {
  if (req.user.isAdmin === true) 
    res.redirect('/admin');
  else
    res.redirect('/');
 });





router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);
router.get('/map', storeController.mapPage);
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id',
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);

router.get('/top', catchErrors(storeController.getTopStores));

/*
  API
*/

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
