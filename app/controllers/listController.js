const { List } = require("../models");

const listController = {
  getAllLists: async (_, res) => {
    try {
      const lists = await List.findAll({
        include: [
          {
            association: "cards",
            include: "labels",
          },
        ],
        order: [
          ["position", "ASC"],
          ["cards", "position", "ASC"],
        ],
      });

      res.json(lists);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  createList: async (req, res) => {
    try {
      const { name, position } = req.body;

  
      if (!name) {
        return res.status(400).json("Name must be provided.");
      }

      const newList = new List({
        name,
        position,
      });
      await newList.save();
      res.json(newList);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  getList: async (req, res) => {
    try {
      const id = req.params.id;

      const list = await List.findByPk(id, {
        include: [
          {
            association: "cards",
            include: ["labels"],
          },
        ],
        order: [["cards", "position", "ASC"]],
      });

      if (list) {
        res.json(list);
      } else {
        res.status(404).json("Can't find any list with this ID.");
      }
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  updateList: async (req, res) => {
    try {
      const id = req.params.id;
      const list = await List.findByPk(id);

      if (!list) {
        return res.status(404).json("Can\t find any list with this ID.");
      }

      const { name, position } = req.body;

      if (name) {
        list.name = name;
      }

      if (position) {
        list.position = position;
      }

      await list.save();
      res.json(list);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  createOrUpdateList: async (req, res) => {
    try {
      // optionnel
      const id = req.params.id;
      let list = null;

      if (id) {
        list = await List.findByPk(id);
      }

      if (list) {
        await listController.updateList(req, res);
      } else {
        await listController.createList(req, res);
      }
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  deleteList: async (req, res) => {
    try {
      const id = req.params.id;

      const list = await List.findByPk(id);

      if (list) {
        await list.destroy();
        res.json("OK");
      } else {
        res.status(404).json("Can\t find any list with this ID.");
      }
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
};

module.exports = listController;
