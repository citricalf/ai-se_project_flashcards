import { fetchedDecks, getDeckByID, removeDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn, showError } from "./new-deck-view.js";
import { getDecks, deleteDeck, addDeck } from "./api.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const newDeckSection = document.querySelector("#new-deck-view");
const notFoundSection = document.querySelector("#not-found");
const aboutSection = document.querySelector("#about");

const pageElement = document.querySelector(".page");
const mainContent = document.querySelector(".page__main-content");
const newDeckButton = document.querySelector("#home .gallery__new-card-btn");
const practiceButton = deckViewSection.querySelector(".gallery__practice-btn");

let currentDeck = null;

/**
 * Hides all app sections and displays the selected section.
 *
 * @param {HTMLElement} currentSection - The section to display
 * @param {string} display - The CSS display value to apply
 * @returns {void}
 */
function showView(currentSection, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  newDeckSection.style.display = "none";
  notFoundSection.style.display = "none";
  aboutSection.style.display = "none";

  currentSection.style.display = display;
}

practiceButton.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck._id}`;
  }
});

newDeckButton.addEventListener("click", () => {
  window.location.hash = "#new-deck";
});

/**
 * Creates the deck-rendering callback used to populate the home view.
 *
 * @returns {function(Object): void} A function that adds a deck to the home view
 */
function renderHomeView() {
  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = homeSection.querySelector(".gallery__list");
  deckContainerEl.innerHTML = "";

  /**
   * Creates a deck list item with its title, color, and actions.
   *
   * @param {{name: string, color: string, cards: Object[], _id: string}} item - The deck to render
   * @returns {HTMLLIElement} The populated deck list item
   */
  function createDeckEl(item) {
    const cloneEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

    const deckTitleEl = cloneEl.querySelector(".card__title");
    deckTitleEl.textContent = item.name;

    removeColorClasses(cloneEl);

    const deckColorEl = hexToString(item.color);
    cloneEl.classList.add(`card_color_${deckColorEl}`);

    const deckCountEl = cloneEl.querySelector(".card__count");
    deckCountEl.textContent = `${item.cards.length} cards`;

    const deckLinkEl = cloneEl.querySelector(".card__link");
    deckLinkEl.href = `#deck/${item._id}`;
    deckLinkEl.addEventListener("click", () => {
      currentDeck = item;
    });

    const deleteDeckButton = cloneEl.querySelector(".card__delete-btn");
    deleteDeckButton.addEventListener("click", () => {
      deleteDeck(item._id)
        .then(() => {
          removeDeckByID(item._id);
          cloneEl.remove();
        })
        .catch(() => showError("Can't delete deck"));
    });

    return cloneEl;
  }

  /**
   * Adds a deck list item to the beginning of the home view.
   *
   * @param {Object} item - The deck to add
   * @returns {void}
   */
  function renderDeckEl(item) {
    const cloneEl = createDeckEl(item);
    deckContainerEl.prepend(cloneEl);
  }

  return renderDeckEl;
}

/**
 * Displays the not-found view and applies its page layout.
 *
 * @returns {void}
 */
function renderNotFoundView() {
  pageElement.classList.add("page_no-mobile-bar");
  showView(notFoundSection, "flex");
}

/**
 * Displays the view associated with the current URL hash.
 *
 * @returns {void}
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";
  const routeMatch = hash.match(/^(deck|carousel)\/([^/]+)$/);

  if (hash === "home" || hash === "") {
    pageElement.classList.remove("page_about-view");
    pageElement.classList.remove("page_no-mobile-bar");
    pageElement.classList.remove("page_new-deck-view");
    mainContent.classList.remove("page__main-content_location_carousel");

    fetchedDecks.forEach(renderHomeView());

    showView(homeSection, "block");
  } else if (hash === "about") {
    pageElement.classList.add("page_about-view");
    pageElement.classList.remove("page_new-deck-view");
    mainContent.classList.remove("page__main-content_location_carousel");

    showView(aboutSection, "block");
  } else if (hash === "new-deck") {
    pageElement.classList.remove("page_about-view");
    pageElement.classList.add("page_new-deck-view");
    mainContent.classList.remove("page__main-content_location_carousel");

    showView(newDeckSection, "block");
    disableSubmitBtn();
  } else if (routeMatch) {
    const [, route, deckID] = routeMatch;
    const deck = getDeckByID(deckID);

    if (!deck) {
      pageElement.classList.remove("page_about-view");
      pageElement.classList.remove("page_new-deck-view");
      mainContent.classList.remove("page__main-content_location_carousel");

      renderNotFoundView();

      return;
    }

    currentDeck = deck;

    if (route === "deck") {
      pageElement.classList.remove("page_about-view");
      pageElement.classList.remove("page_no-mobile-bar");
      pageElement.classList.remove("page_new-deck-view");
      mainContent.classList.remove("page__main-content_location_carousel");

      showView(deckViewSection, "block");
      renderDeckView(deck);
    } else {
      pageElement.classList.remove("page_about-view");
      pageElement.classList.add("page_no-mobile-bar");
      pageElement.classList.remove("page_new-deck-view");
      mainContent.classList.add("page__main-content_location_carousel");

      showView(carouselSection, "flex");
      renderCarouselView(deck);
    }
  } else {
    pageElement.classList.remove("page_about-view");
    pageElement.classList.remove("page_new-deck-view");
    mainContent.classList.remove("page__main-content_location_carousel");

    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      router();
    });
});
window.addEventListener("hashchange", router);
