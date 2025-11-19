const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addResource = async (req, res) => {
    try {
        const { title, link } = req.body;
        const resource = new Resource({ title, link });
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
