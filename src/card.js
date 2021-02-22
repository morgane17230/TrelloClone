const util = require("./util");
const label = require("./label");
const Sortable = require("sortablejs");

const card = {
  init: function () {
    card.confirmDeleteCard = document.querySelector("#confirmDeleteCard");
    card.cardFormElement = document.querySelector("#addCardForm");
    card.cardModalElement = document.querySelector("#addCardModal");
    card.confirmFormCard = document.querySelector("#confirmModalCard");
    card.cardFormElement.addEventListener("submit", card.handleAddCardForm);
    card.confirmDeleteCard.addEventListener("click", card.removeCard);
  },

  // Drag&Drop card

  handleDragEnd: function (event) {
    const cardsParent1 = event.from.querySelectorAll(".box");
    const cardsParent2 = event.to.querySelectorAll(".box");

    const arrayOfCards1 = Array.from(cardsParent1);
    const arrayOfCards2 = Array.from(cardsParent2);

    const allCards = [...arrayOfCards1, ...arrayOfCards2];

    for (const index in allCards) {
      const currentCard = allCards[index];
      const cardId = currentCard.getAttribute("data-card-id");
      const position = parseInt(index, 10) + 1;
      const listParent = currentCard.closest(".panel");
      const listId = listParent.getAttribute("data-list-id");
      const data = new FormData();
      data.append("list_id", listId);
      data.append("position", position);
      fetch(`${util.base_url}/cards/${cardId}`, {
        method: "PATCH",
        body: data,
      });
    }
  },

  // Créer une carte

  handleAddCardForm: async function (event) {
    event.preventDefault();

    const data = new FormData(card.cardFormElement);
    const boxes = document.querySelectorAll(".box");
    data.append("position", boxes.length + 1);
    try {
      const response = await fetch(`${util.base_url}/cards`, {
        method: "POST",
        body: data,
      });
      const body = await response.json();
      if (response.status === 200) {
        card.makeCardInDOM(body.content, body.list_id, body.id, body.color);

        card.cardModalElement.querySelector("input").value = "";
        util.hideModals();
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert("Problème lors de la création de la carte");
      console.error(error);
    }
  },

  // Carte dans le DOM

  makeCardInDOM: function (cardName, parentId, cardId, cardColor) {
    const template = document.querySelector("#cardTemplate");
    const clone = template.content.cloneNode(true);
    const box = clone.querySelector(".box");
    clone.querySelector(".card-title").textContent = cardName;
    box.setAttribute("data-list-id", parentId);
    box.setAttribute("data-card-id", cardId);

    clone
      .querySelector(".input[name='color']")
      .setAttribute("value", cardColor);
    box.setAttribute("style", `border-color: ${cardColor};`);
    clone
      .querySelector("#cardFooter")
      .setAttribute("style", `background-color: ${cardColor};`);

    clone
      .querySelector("#editCard")
      .addEventListener("click", card.showEditCardForm);
    clone
      .querySelector("#deleteCard")
      .addEventListener("click", card.showConfirmCardModal);
    const form = clone.querySelector("form");
    form.addEventListener("submit", card.handleEditCardForm);

    // Drag&Drop Label

    const labelList = document.querySelector("#labelList");
    const labelCard = clone.querySelector("#labelCard");
    new Sortable(labelList, {
      group: {
        name: "labels",
        pull: "clone",
      },
      animation: 250,
      onEnd: label.handleDragEnd,
    });
    new Sortable(labelCard, {
      group: {
        name: "labels",
        pull: "false",
      },
    });
    document
      .querySelector(`div[data-list-id="${parentId}"] .panel-block`)
      .appendChild(clone);
  },

  // Afficher modale création carte

  showAddCardModal: function (event) {
    card.cardModalElement.classList.add("is-active");
    const btn = event.target;
    const parent = btn.closest(".panel");
    const id = parent.getAttribute("data-list-id");
    card.cardModalElement.querySelector('input[name="list_id"]').value = id;
  },

  // Afficher la modale carte confirm suppression

  showConfirmCardModal: function (event) {
    event.preventDefault();
    const btn = event.target;
    const cardItem = btn.closest(".box");
    const id = cardItem.getAttribute("data-card-id");
    const contentName = cardItem.querySelector("h2").textContent;
    const modalContent = document.querySelector("#confirmContentCard");
    const elementInput = document.querySelector(
      '#confirmCard input[name="id"]'
    );
    elementInput.setAttribute("value", id);
    modalContent.textContent = `Souhaitez-vous supprimer la carte ${contentName} ?`;
    card.confirmFormCard.classList.add("is-active");
  },

  // Formulaire d'édition d'une carte

  showEditCardForm: function (event) {
    event.preventDefault();
    const btn = event.target;
    const cardItem = btn.closest(".box");
    titleCard = cardItem.querySelector("h2");
    formCard = cardItem.querySelector("form");
    formCard.classList.remove("is-hidden");
  },

  // Editer une carte

  handleEditCardForm: async function (event) {
    event.preventDefault();
    const formCard = event.target;
    const titleCard = formCard.previousElementSibling;
    const parentCard = formCard.closest(".box");
    const cardId = parentCard.getAttribute("data-card-id");

    const data = new FormData(formCard);
    try {
      const response = await fetch(`${util.base_url}/cards/${cardId}`, {
        method: "PATCH",
        body: data,
      });
      const body = await response.json();

      if (response.status === 200) {
        titleCard.textContent = body.content;
        const cardContainer = titleCard.closest(".box");
        cardContainer.setAttribute("style", `border-color: ${body.color};`);
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la mise à jour de la liste");
      console.error(error);
    }
    titleCard.classList.remove("is-hidden");
    formCard.classList.add("is-hidden");
  },

  //Suppression d'une carte

  removeCard: async function (event) {
    event.preventDefault();
    const deleteForm = card.confirmFormCard.querySelector("form");
    const data = new FormData(deleteForm);
    cardId = data.get("id");
    try {
      const response = await fetch(`${util.base_url}/cards/${cardId}`, {
        method: "DELETE",
      });
      const body = await response.json();
      if (response.status === 200) {
        const confirm = document.getElementById("confirmation");
        confirm.classList.remove("hidden");
        confirm.textContent = "Votre carte a bien été supprimée";
        util.hideModals();
        setTimeout(() => {
          confirm.textContent = "";
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la suppression de la carte");
      console.error(error);
    }
  },
};

module.exports = card;
