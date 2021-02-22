const list = require("./list");
const card = require("./card");
const util = require("./util");
const label = require("./label");

const app = {
  init: function () {
    list.init();
    card.init();
    label.init();
    util.addListenerToActions();
  },
};

document.addEventListener("DOMContentLoaded", app.init);
