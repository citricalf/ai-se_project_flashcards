# Flashcard App

My first project in TripleTen's AI-Assisted Software Engineering program. It includes decks of flashcards, each of which can be viewed in a carousel.

## Features

The home view displays decks of flashcards, each of which shows the total amount of cards in the deck and delete feature (trashbin icon) to remove
the deck. At the end of the displayed decks, there is a button to create a new deck (WIP) with options to choose its color, name, and contents.
The top of the page has clickable sections that will redirect to their respective parts of the app.

- 'Flash Cards' / 'My Decks' both show the home page, but 'My Decks' will focus on the portion of the page with all the decks displayed.
- 'About' describes the general overview of the app, as well as its various sections (currently shows a 404 page).

The open deck view (after clicking on a given deck on the home page) displays all the flashcards of a given deck and an option to add a new card.
There are buttons on each card that flip the card to show a question/answer and a delete button to remove the card from the deck. There is also
a 'Practice' button that will redirect to a carousel view of the deck. The flashcards' color matches the deck's color on the home page.

The Carousel view displays a single card from a chosen deck with left/right buttons to cycle which card is displayed and a flip button to show
either the question or answer. Cycling to another card always shows the question first. When the start or end of the deck is reached, the respective
button is grayed out and not able to be clicked on. The title of the deck is always displayed above the card alongside the current card's number in the
deck over the total deck size.

The app's design changes based on the size of the viewport to account for desktop and mobile views. When the mobile view is rendered, the contents of the
app will adjust size and the location of various buttons will change. The '+ New Deck', '+ New Card', and 'Practice' buttons are fixed to the bottom of
the page in the mobile view. In addition, the left/right buttons in the carousel view will move to the bottom of the flashcard to accommodate for a
smaller viewport.

## Technologies Used

- HTML
- CSS
- JavaScript

## Deployed Site

Check out [this site](https://citricalf.github.io/ai-se_project_flashcards) on GitHub Pages.

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1fTA2_46ByhC9EKLvKekpl_wVW0lEJrgB/view?usp=sharing), where I describe my project and some challenges
I faced while building it.
