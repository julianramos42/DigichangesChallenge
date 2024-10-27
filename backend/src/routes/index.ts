import express from 'express';

let router = express.Router();

router.get('/', function(_req, _res, _next) {
  _res.send('Funcionando');
});

export default router;