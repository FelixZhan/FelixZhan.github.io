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

const researchOverlay = document.getElementById("researchModalOverlay");

if (researchOverlay) {
  const modalTitle = researchOverlay.querySelector("#researchModalTitle");
  const modalSubtitle = researchOverlay.querySelector("#researchModalSubtitle");
  const modalContent = researchOverlay.querySelector("#researchModalContent");
  const toggleButtons = researchOverlay.querySelectorAll("[data-level]");
  const closeButton = researchOverlay.querySelector(".modal-close");
  const firstToggle = researchOverlay.querySelector(".toggle-btn");
  const cards = document.querySelectorAll(".research-card");
  let lastActive = null;
  let currentCard = null;
  let activeLevel = "browse";
  let swapTimer = null;

  const renderContent = (text) => {
    modalContent.innerHTML = "";
    const parts = (text || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      const fallback = document.createElement("p");
      fallback.textContent = "Add detail text here.";
      modalContent.appendChild(fallback);
      return;
    }

    parts.forEach((item) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = item;
      modalContent.appendChild(paragraph);
    });
  };

  const setActiveToggle = (level) => {
    toggleButtons.forEach((button) => {
      const isActive = button.dataset.level === level;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const updateContent = (level, animate = true) => {
    if (!currentCard) {
      return;
    }

    const nextText = currentCard.dataset[level] || "";
    activeLevel = level;
    setActiveToggle(level);

    if (!animate) {
      renderContent(nextText);
      return;
    }

    modalContent.classList.add("is-fading");
    window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      renderContent(nextText);
      modalContent.classList.remove("is-fading");
    }, 160);
  };

  const openModal = (card) => {
    currentCard = card;
    lastActive = card;
    card.setAttribute("aria-expanded", "true");
    modalTitle.textContent =
      card.dataset.title ||
      card.querySelector(".card-company")?.textContent ||
      "Current work";

    const subtitle =
      card.dataset.subtitle ||
      card.querySelector(".card-description")?.textContent ||
      "";

    if (subtitle) {
      modalSubtitle.textContent = subtitle;
      modalSubtitle.hidden = false;
    } else {
      modalSubtitle.textContent = "";
      modalSubtitle.hidden = true;
    }

    researchOverlay.setAttribute("aria-hidden", "false");
    lockScroll();
    activeLevel = "browse";
    updateContent(activeLevel, false);
    if (closeButton) {
      closeButton.focus();
    } else if (firstToggle) {
      firstToggle.focus();
    }
  };

  const closeModal = () => {
    if (!document.body.classList.contains("modal-open")) {
      return;
    }

    unlockScroll();
    researchOverlay.setAttribute("aria-hidden", "true");
    if (lastActive) {
      lastActive.setAttribute("aria-expanded", "false");
      lastActive.focus();
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const level = button.dataset.level;
      if (!level || level === activeLevel) {
        return;
      }

      updateContent(level, true);
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  researchOverlay.addEventListener("click", (event) => {
    if (event.target === researchOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
