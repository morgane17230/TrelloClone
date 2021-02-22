const util = require("./util");

const label = {
  init: function () {
    label.buttonLabel = document.querySelector("#addLabelButton");
    label.labelModalElement = document.querySelector("#addLabelModal");
    label.labelFormElement = document.querySelector("#addLabelForm");
    label.buttonLabel.addEventListener("click", label.showAddLabelModal);
    label.labelFormElement.addEventListener("submit", label.handleAddLabelForm);
    label.getLabelFromAPI();
  },

  // Drag&Drop labels

  handleDragEnd: function (event) {
    const labelCard = event.to;
    const cardId = labelCard.closest(".box").getAttribute("data-card-id");
    const labelItem = event.clone;
    const labelId = labelItem.getAttribute("data-label-id");
    const data = new FormData();
    data.append("card_id", cardId);
    data.append("label_id", labelId);
    fetch(`${util.base_url}/cards/${cardId}/labels/${labelId}`, {
      method: "POST",
      body: data,
    });
  },

  // Tous les labels

  getLabelFromAPI: async function () {
    try {
      const response = await fetch(`${util.base_url}/labels`);

      const body = await response.json();
      if (response.status === 200) {
        body.forEach((labelItem) => {
          label.makeLabelList(labelItem.id, labelItem.name, labelItem.color);
        });
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Erreur lors de la récupération des labels");
      console.error(error);
    }
  },

  // Créer un label

  handleAddLabelForm: async function (event) {
    event.preventDefault();

    const data = new FormData(label.labelFormElement);
    try {
      const response = await fetch(`${util.base_url}/labels`, {
        method: "POST",
        body: data,
      });
      const body = await response.json();
      if (response.status === 200) {
        label.makeLabelList(body.id, body.name, body.color);
        util.hideModals();
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la création de la carte");
      console.error(error);
    }
  },

  // Labels par carte dans le DOM

  makeLabelCard: function (labelId, labelName, labelColor, cardId) {
    const template = document.querySelector("#labelTemplate");
    const clone = template.content.cloneNode(true);
    const cardOfLabel = document.querySelector(
      `.box[data-card-id='${cardId}']`
    );
    clone.querySelector(".is-link").textContent = labelName;
    clone.querySelector(".control").setAttribute("data-label-id", labelId);
    clone
      .querySelector(".is-link")
      .setAttribute("style", `background-color: ${labelColor};`);
    clone
      .querySelector(".is-delete")
      .addEventListener("click", label.removeLabelCard);

    const labelCard = cardOfLabel.querySelector("#labelCard");
    labelCard.appendChild(clone);
  },

  // Labels liste dans le DOM

  makeLabelList: function (labelId, labelName, labelColor) {
    const template = document.querySelector("#labelTemplate");
    const clone = template.content.cloneNode(true);
    clone.querySelector(".is-link").textContent = labelName;
    clone.querySelector(".control").setAttribute("data-label-id", labelId);
    clone
      .querySelector(".is-link")
      .setAttribute("style", `background-color: ${labelColor};`);
    clone
      .querySelector(".is-delete")
      .addEventListener("click", label.deleteLabel);
    document.querySelector(`#labelList`).appendChild(clone);
  },

  // Afficher modale création label

  showAddLabelModal: function () {
    label.labelModalElement.classList.add("is-active");
  },

  // Formulaire d'édition d'un label

  // showEditLabelForm: function (event) {
  //   event.preventDefault();
  //   const btn = event.target;
  //   const labelItem = btn.closest(".control");
  //   titleLabel = labelItem.querySelector(".is-link");
  //   formLabel = labelItem.querySelector("form");
  //   titleLabel.classList.add("is-hidden");
  //   formLabel.classList.remove("is-hidden");
  // },

  //Editer un label

  handleEditLabelForm: async function (event) {
    event.preventDefault();
    const formLabel = event.target;
    const titleLabel = formLabel.previousElementSibling;

    const data = new FormData(formLabel);
    const labelId = data.get("label-id");

    try {
      const response = await fetch(`${util.base_url}/labels/${labelId}`, {
        method: "PATCH",
        body: data,
      });
      const body = await response.json();

      if (response.status === 200) {
        titleLabel.textContent = body.name;
        const labelContainer = titleLabel.closest(".control .is-link");
        labelContainer.setAttribute(
          "style",
          `background-color: ${body.color};`
        );
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la mise à jour de la liste");
      console.error(error);
    }
    titleLabel.classList.remove("is-hidden");
    formLabel.classList.add("is-hidden");
  },

  // Attacher les labels aux cartes

  addCardLabel: async function (event) {
    event.preventDefault();
    const btn = event.target;
    const cardItem = btn.closest(".box");
    const cardId = cardItem.getAttribute("data-card-id");
    const formCard = cardItem.closest(".box form");

    const data = new FormData(formCard);
    labelId = data.get("label-id");

    try {
      const response = await fetch(
        `${util.base_url}/cards/${cardId}/labels/${labelId}`,
        {
          method: "POST",
          body: data,
        }
      );
      const body = await response.json();
      if (response.status === 200) {
        label.cardModalElement.querySelector("input").value = "";
        util.hideModals();
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la création de la carte");
      console.error(error);
    }
  },

  // Détacher les labels des cartes

  removeLabelCard: async function (event) {
    event.preventDefault();
    const btn = event.target;
    const labelItem = btn.closest(".control");
    const labelId = labelItem.getAttribute("data-label-id");
    const cardItem = btn.closest(".box");
    const cardId = cardItem.getAttribute("data-card-id");

    try {
      const response = await fetch(
        `${util.base_url}/cards/${cardId}/labels/${labelId}`,
        {
          method: "DELETE",
        }
      );
      const body = await response.json();
      if (response.status === 200) {
        const confirm = document.getElementById("confirmation");
        confirm.classList.remove("hidden");
        confirm.textContent = "Votre label a bien été détaché";
        util.hideModals();
        labelItem.remove();
        setTimeout(() => {
          confirm.textContent = "";
        }, 1000);
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la suppression de la carte");
      console.error(error);
    }
  },

  // Supprimer un label

  deleteLabel: async function (event) {
    event.preventDefault();
    const btn = event.target;
    const labelItem = btn.closest(".control");
    const labelId = labelItem.getAttribute("data-label-id");

    try {
      const response = await fetch(`${util.base_url}/labels/${labelId}`, {
        method: "DELETE",
      });
      const body = await response.json();
      if (response.status === 200) {
        const confirm = document.getElementById("confirmation");
        confirm.classList.remove("hidden");
        confirm.textContent = "Votre label a bien été supprimé";
        setTimeout(() => {
          confirm.textContent = "";
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(body);
      }
    } catch (error) {
      alert("Problème lors de la suppression de la carte");
      console.error(error);
    }
  },
};

module.exports = label;
