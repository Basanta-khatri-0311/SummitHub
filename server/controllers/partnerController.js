const PartnerRequest = require('../models/PartnerRequest');

// @desc    Get all open partner requests
// @route   GET /api/partners
// @access  Public
const getPartnerRequests = async (req, res) => {
  try {
    const requests = await PartnerRequest.find({ status: 'OPEN' })
      .populate('user', 'name avatar')
      .populate('joinedPartners', 'name avatar')
      .sort({ date: 1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a partner request
// @route   POST /api/partners
// @access  Private
const createPartnerRequest = async (req, res) => {
  try {
    const { location, date, description, experienceLevel, partnersNeeded } = req.body;

    const request = new PartnerRequest({
      user: req.user._id,
      location,
      date,
      description,
      experienceLevel,
      partnersNeeded,
    });

    const createdRequest = await request.save();
    const populatedRequest = await createdRequest.populate('user', 'name avatar');
    
    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a partner request
// @route   PUT /api/partners/:id/join
// @access  Private
const joinPartnerRequest = async (req, res) => {
  try {
    const request = await PartnerRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot join your own request' });
    }

    if (request.joinedPartners.includes(req.user._id)) {
      // Unjoin
      request.joinedPartners = request.joinedPartners.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Join
      if (request.joinedPartners.length >= request.partnersNeeded) {
        return res.status(400).json({ message: 'Request is already full' });
      }
      request.joinedPartners.push(req.user._id);
    }

    await request.save();
    const populated = await PartnerRequest.findById(request._id)
        .populate('user', 'name')
        .populate('joinedPartners', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPartnerRequests,
  createPartnerRequest,
  joinPartnerRequest
};
