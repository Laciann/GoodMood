const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  // const abhi = {
  //   name: 'Abhi',
  //   age: 100,
  //   cool: true
  // };
  // res.json(abhi);

  //  res.send('Hey! It works!');
  // res.json(req.query);
  res.render('hello');
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});
module.exports = router;
