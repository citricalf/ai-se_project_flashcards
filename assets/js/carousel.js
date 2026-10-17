import { hexToString, removeColorClasses } from "./colors.js";

function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector(".carousel");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const sectionTitle = document.querySelector(".carousel__title");
  const carouselCardText = document.querySelector(".carousel__card-text");

  // remove color modifiers before setting current card's color
  removeColorClasses(carouselCardText);
  const cardColor = hexToString(deck.color);
  carouselCardText.classList.add(`card__carousel_color_${cardColor}`);

  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];
    carouselCardText.textContent = currentCard.question;
    updateArrows();

    sectionTitle.textContent = `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;

    if (showingQuestion === true) {
      carouselCardText.textContent = currentCard.question;
      carouselCardText.classList.remove("card__carousel_color_white");
    } else {
      carouselCardText.textContent = currentCard.answer;
      carouselCardText.classList.add("card__carousel_color_white");
    }
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  updateDisplay();
}

export { renderCarouselView };
