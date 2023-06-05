const Request = require("../model/requestion")

// Create new request
exports.createRequest = async (req, res) => {
    try {
        const request = new Request(req.body);
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get requests
exports.getRequest = async (req, res) => {
   
    try {
        if (req.query.id) {
            const request = await Request.findById(req.query.id);
            res.status(200).json(request);
        }
        else if (req.query.userid) {
            const userid  = req.query.userid;
            const request = await Request.find({userid});
            res.status(200).json(request);
        }
        
        else if (!req.query.all) {
            const requests = await Request.find({}).sort({updatedAt:-1});
            res.status(200).json(requests);
        } else {
            res.status(400).json({ error: 'Invalid request. Please provide an id or all.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update a specific request
exports.updateRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.cardReq) {
            request.markModified('cardReq');
        }
        await request.save();
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a specific request
exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        res.status(200).json(request);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
