const modalOverlay = document.getElementById("modalOverlay");

if (modalOverlay) {
  const modalTitle = modalOverlay.querySelector("#modalTitle");
  const modalRole = modalOverlay.querySelector(".modal-role");
  const modalPeriod = modalOverlay.querySelector(".modal-period");
  const modalLocation = modalOverlay.querySelector(".modal-location");
  const modalList = modalOverlay.querySelector(".modal-list");
  const closeButton = modalOverlay.querySelector(".modal-close");
  const cards = document.querySelectorAll(".cv-card");
  let lastActive = null;

  const fillModal = (card) => {
    modalTitle.textContent = card.dataset.company || "";
    modalRole.textContent = card.dataset.role || "";
    modalPeriod.textContent = card.dataset.period || "";
    modalLocation.textContent = card.dataset.location || "";
    modalList.innerHTML = "";

    const details = card.dataset.details || "";
    details
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        modalList.appendChild(li);
      });
  };

  const lockScroll = () => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.classList.add("modal-open");
  };

  const unlockScroll = () => {
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
  };

  const openModal = (card) => {
    lastActive = card;
    card.setAttribute("aria-expanded", "true");
    fillModal(card);
    modalOverlay.setAttribute("aria-hidden", "false");
    lockScroll();
    closeButton.focus();
  };

  const closeModal = () => {
    if (!document.body.classList.contains("modal-open")) {
      return;
    }

    unlockScroll();
    modalOverlay.setAttribute("aria-hidden", "true");
    if (lastActive) {
      lastActive.setAttribute("aria-expanded", "false");
      lastActive.focus();
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  closeButton.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
