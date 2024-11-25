const express = require('express');
const router = express.Router();
const numParteController = require('../controllers/num-partes.controller.js');

router.post('/api/new-num', numParteController.saveNumPart);
router.get('/api/num-parts', numParteController.getNumPart);
router.get('/api/get-num-part/:id', numParteController.getNumPartById)
router.put('/api/disable-num-part/:id', numParteController.disableNumPart);
router.put('/api/enable-num-part/:id', numParteController.enableNumPart);
router.put('/api/edit-num-part/:id', numParteController.editNumPart);
router.get('/api/get-disabled-num-parts', numParteController.getNumPartDisabled)

module.exports = router;