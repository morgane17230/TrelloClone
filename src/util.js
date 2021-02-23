const util = {
  base_url: "http://localhost:3000",

  // Fermer les modales OK

  hideModals: function () {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },

  addListenerToActions: function () {
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", util.hideModals);
    });
  },
};

module.exports = util;