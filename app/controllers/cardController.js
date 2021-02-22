const { Card, Label } = require("../models");

const cardController = {
    getAllCardsInList: async (req, res) => {
        try {
            const listId = req.params.id;

            const cards = await Card.findAll({
                where: {
                    list_id: listId,
                },
                include: ['labels'],
                order: [
                    ['position', 'ASC'],
                ],
            });

            if (cards.length) {
                res.json(cards);
            } else {
                res.status(404).json('Can\'t find any cards with this list id.');
            }
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    getCard: async (req, res) => {
        try {
            const id = req.params.id;

            const card = await Card.findByPk(id, {
                include: ['labels'],
            });

            if (card) {
                res.json(card);
            } else {
                res.status(404).json('Can\'t find any card with this id.');
            }
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    createCard: async (req, res) => {
        try {
            const { content, color, list_id, position } = req.body;
            const bodyErrors = [];

            if (!content) {
                bodyErrors.push('Card.content must be provided.');
            }

            if (!list_id) {
                bodyErrors.push('Card.list_id must be provided.');
            }

            if (bodyErrors.length) {
                return res.status(400).json(bodyErrors);
            }

            const newCard = new Card({
                content,
                color,
                list_id,
                position,
            });

            await newCard.save();
            res.json(newCard);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    updateCard: async (req, res) => {
        try {
            const id = req.params.id;
            const { content, position, list_id, color } = req.body;

            const card = await Card.findByPk(id, {
                include: ['labels'],
            });

            if (!card) {
                return res.status(404).json('Can\'t find any card with this id.');
            }

            if (content) {
                card.content = content;
            }

            if (position) {
                card.position = position;
            }

            if (list_id) {
                card.list_id = list_id;
            }

            if (color) {
                card.color = color;
            }

            await card.save();
            res.json(card);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    deleteCard: async (req, res) => {
        try {
            const id = req.params.id;

            const card = await Card.findByPk(id);

            if (!card) {
                return res.status(404).json('Can\'t find any card with this id.');
            }

            await card.destroy();
            res.json('OK');
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    associateLabelToCard: async (req, res) => {
        try {
            const { cardId, labelId } = req.params;

            let card = await Card.findByPk(cardId, {
                include: ['labels'],
            });
            if (!card) {
                return res.status(404).json('Can\'t find any card with this id.');
            }

            const label = await Label.findByPk(labelId);
            if (!label) {
                return res.status(404).json('Can\'t find any label with this id.');
            }

            await card.addLabel(label);
            card = await Card.findByPk(cardId, {
                include: ['labels'],
            });

            res.json(card);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    deleteLabelFromCard: async (req, res) => {
        try {
            const { cardId, labelId } = req.params;

            let card = await Card.findByPk(cardId, {
                include: ['labels'],
            });
            if (!card) {
                return res.status(404).json('Can\'t find any card with this id.');
            }

            const label = await Label.findByPk(labelId);
            if (!label) {
                return res.status(404).json('Can\'t find any label with this id.');
            }

            await card.removeLabel(label);
            card = await Card.findByPk(cardId, {
                include: ['labels'],
            });

            res.json(card);
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    },

    createOrUpdateCard: async (req, res) => {
        try {
            const id = req.params.id;
            let card = null;

            if (id) {
                card = Card.findByPk(id);
            }

            if (card) {
                await cardController.updateCard(req, res);
            } else {
                await cardController.createCard(req, res);
            }
        } catch (err) {
            console.trace(err);
            res.status(500).json(err.toString());
        }
    }
};

module.exports = cardController;