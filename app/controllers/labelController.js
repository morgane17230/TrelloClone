const { Label } = require('../models');

const labelController = {
    getLabels: async (req, res) => {
        try {
            const labels = await Label.findAll();
            res.json(labels);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    createLabel: async (req, res) => {
        try {
            const { name, color } = req.body;
            const bodyErrors = [];

            if (!name) {
                bodyErrors.push('Label.name must be provided.');
            }

            if (!color) {
                bodyErrors.push('Label.color must be provided');
            }

            if (bodyErrors.length) {
                return res.status(400).json(bodyErrors);
            }

            const label = new Label({
                name,
                color,
            });

            await label.save();
            res.json(label);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    updateLabel: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, color } = req.body;

            const label = await Label.findByPk(id);
            if (!label) {
                return res.status(400).json('Can\'t find any label with this id.');
            }

            if (name) {
                label.name = name;
            }

            if (color) {
                label.color = color;
            }

            await label.save();
            res.json(label);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    deleteLabel: async (req, res) => {
        try {
            const id = req.params.id;

            const label = await Label.findByPk(id);

            if (!label) {
                return res.status(404).json('Can\'t find any card with this id.');
            }

            await label.destroy();
            res.json('OK');
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },
};

module.exports = labelController;