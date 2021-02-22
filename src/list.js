const util = require("./util");
const card = require("./card");
const label = require("./label");
const Sortable = require("sortablejs");

const list = {
  init: function () {
    list.listFormElement = document.querySelector("#addListForm");
    list.listModalElement = document.querySelector("#addListModal");
    list.buttonElement = document.querySelector("#addListButton");
    list.confirmDeleteList = document.querySelector("#confirmDeleteList");
    list.confirmFormList = document.querySelector("#confirmModalList");
    list.buttonElement.addEventListener("click", list.showAddListModal);
    list.listFormElement.addEventListener("submit", list.handleAddListForm);
    list.confirmDeleteList.addEventListener("click", list.removeList);
    list.getListsFromAPI();
    list.initSortable();
  },

  // Drag&Drop list

  initSortable: function () {
    const parent = document.querySelector(".columns");
    new Sortable(parent, {
      animation: 250,
      group: "list",
      onEnd: list.handleDragEnd,
      draggable: ".panel",
    });
  },

  handleDragEnd: function () {
    const lists = document.querySelectorAll(".panel");
    let position = 1;
    for (const listItem of lists) {
      const id = listItem.getAttribute("data-list-id");
      const data = new FormData();
      data.append("position", position);
      fetch(`${util.base_url}/lists/${id}`, {
        method: "PATCH",
        body: data,
      });
      position++;
    }
  },

  // Toutes les listes

  getListsFromAPI: async function () {
    try {
      const response = await fetch(`${util.base_url}/lists`);
      const body = await response.json();

      if (response.status === 200) {
        body.forEach((listItem) => {
          list.makeListInDOM(listItem.name, listItem.id);
          for (const cardItem of listItem.cards) {
            card.makeCardInDOM(
              cardItem.content,
              cardItem.list_id,
              cardItem.id,
              cardItem.color,
              cardItem.labels
            );
            for (const labelItem of cardItem.labels) {
              label.makeLabelCard(
                labelItem.id,
                labelItem.name,
                labelItem.color,
                cardItem.id
              );
            }
          }
        });
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Erreur lors de la récupération des listes");
      console.error(error);
    }
  },

  // Ajouter une liste

  handleAddListForm: async function (event) {
    event.preventDefault();

    const data = new FormData(list.listFormElement);
    data.append("position", document.querySelectorAll(".panel").length + 1);
    try {
      const response = await fetch(`${util.base_url}/lists`, {
        method: "POST",
        body: data,
      });
      const body = await response.json();
      if (response.status === 200) {
        list.makeListInDOM(body.name, body.id, body.position);

        list.listModalElement.querySelector("input").value = "";

        util.hideModals();
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la sauvegarde la liste");
      console.error(error);
    }
  },

  // List dans le DOM

  makeListInDOM: function (listName, listId, listPosition) {
    const template = document.querySelector("#listTemplate");
    const clone = template.content.cloneNode(true);
    const title = clone.querySelector(".list-title");
    title.textContent = listName;
    title.addEventListener("dblclick", list.showEditListForm);
    const form = clone.querySelector("form");
    form.addEventListener("submit", list.handleEditListForm);
    const panel = clone.querySelector(".panel");
    panel.setAttribute("data-list-id", listId);
    panel.setAttribute("position", listPosition);

    const input = form.querySelector('input[name="list-id"]');
    input.setAttribute("value", listId);
    clone
      .querySelector("#deleteList")
      .addEventListener("click", list.showConfirmListModal);
    clone
      .querySelector("#addCard")
      .addEventListener("click", card.showAddCardModal);
    const cardParent = clone.querySelector(".panel-block");
    new Sortable(cardParent, {
      animation: 250,
      group: "card",
      onEnd: card.handleDragEnd,
    });

    document.querySelector(".columns").appendChild(clone);
  },

  // Afficher la modale création liste

  showAddListModal: function () {
    list.listModalElement.classList.add("is-active");
  },

  // Afficher formulaire d'édition d'une liste

  showEditListForm: function (event) {
    event.preventDefault();
    const titleElement = event.target;
    const formElement = titleElement.nextElementSibling;
    titleElement.classList.add("is-hidden");
    formElement.classList.remove("is-hidden");
  },

  // Editer une liste

  handleEditListForm: async function (event) {
    event.preventDefault();

    const formElement = event.target;
    const titleElement = formElement.previousElementSibling;

    const data = new FormData(formElement);

    const listId = data.get("list-id");

    try {
      const response = await fetch(`${util.base_url}/lists/${listId}`, {
        method: "PATCH",
        body: data,
      });
      const body = await response.json();

      if (response.status === 200) {
        titleElement.textContent = body.name;
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la mise à jour de la liste");
      console.error(error);
    }

    titleElement.classList.remove("is-hidden");
    formElement.classList.add("is-hidden");
  },

  // Afficher la modale list confirm suppression

  showConfirmListModal: function (event) {
    event.preventDefault();
    const btn = event.target;
    const listItem = btn.closest(".panel");
    const id = listItem.getAttribute("data-list-id");
    const contentName = listItem.querySelector("h2").textContent;
    const modalContent = document.querySelector("#confirmContentList");
    modalContent.textContent = `Souhaitez-vous supprimer la liste ${contentName} ?`;
    const elementInput = document.querySelector(
      '#confirmList input[name="id"]'
    );
    elementInput.setAttribute("value", id);
    list.confirmFormList.classList.add("is-active");
  },

  // Suppression d'une liste OK

  removeList: async function (event) {
    event.preventDefault();
    const listItem = document.querySelector(".panel");
    const deleteForm = list.confirmFormList.querySelector("form");
    const data = new FormData(deleteForm);
    listId = data.get("id");
    try {
      const response = await fetch(`${util.base_url}/lists/${listId}`, {
        method: "DELETE",
      });
      const body = await response.json();
      if (response.status === 200) {
        const confirm = document.getElementById("confirmation");
        confirm.classList.remove("hidden");
        confirm.textContent = "Votre liste a bien été supprimée";
        util.hideModals();
        setTimeout(() => {
          confirm.textContent = "";
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la suppression de la liste");
      console.error(error);
    }
  },
};

module.exports = list;
