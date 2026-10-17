import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");

function renderHomeView() {
  homeSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = document.querySelector(".decks__list");
  deckContainerEl.innerHTML = "";

  function createDeckEl(item) {
    const cloneEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

    const deckTitleEl = cloneEl.querySelector(".deck__title");
    deckTitleEl.textContent = item.name;

    removeColorClasses(cloneEl);

    const deckColorEl = hexToString(item.color);
    cloneEl.classList.add(`deck_color_${deckColorEl}`);

    const deckCountEl = cloneEl.querySelector(".deck__count");
    deckCountEl.textContent = `${item.cards.length} cards`;

    const deckLinkEl = cloneEl.querySelector(".deck__link");
    deckLinkEl.addEventListener("click", () => {
      deckLinkEl.href = `#carousel/${item.id}`;
    });

    const deleteDeck = cloneEl.querySelector(".deck__delete-btn");
    deleteDeck.addEventListener("click", () => {
      cloneEl.remove();
    });

    return cloneEl;
  }

  function renderDeckEl(item) {
    const cloneEl = createDeckEl(item);
    deckContainerEl.prepend(cloneEl);
  }

  decks.forEach(renderDeckEl);
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
}

function router() {
  const hash = window.location.hash.slice(1) || "home";
  const page = document.querySelector(".page__main-content");

  if (hash === "home" || hash === "") {
    page.classList.remove(".page__main-content_location_carousel");
    renderHomeView();
  } else if (hash.startsWith("carousel/")) {
    // get deck ID after 'carousel/'
    const deckID = hash.split("/")[1];

    // add carousel class when rendering view, remove when on other views
    page.classList.add(".page__main-content_location_carousel");

    homeSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";

    renderCarouselView(getDeckByID(deckID));
  } else {
    page.classList.remove(".page__main-content_location_carousel");
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
