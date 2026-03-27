const express = require('express');
const router = express.Router();
const { getPartnerRequests, createPartnerRequest, joinPartnerRequest } = require('../controllers/partnerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPartnerRequests)
  .post(protect, createPartnerRequest);

router.route('/:id/join').put(protect, joinPartnerRequest);

module.exports = router;
