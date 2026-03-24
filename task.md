# Frontend Task

use data / UI Wireframes from ./task-data dir

## Introduction

This is a simple task to create a suitable single page application front-end incorporating:

- user interaction
- interrogating an API - namely the **Deck of Cards API** (https://deckofcardsapi.com)
- logic
- displaying text and images

The solution **must** use HTML, CSS and JavaScript. You can use whatever framework or dependencies you require - e.g. React, Vue.js, Bootstrap, Tailwind CSS. You could even use no external dependencies - it's up to you.

## Minimum Requirements

**TIP:** Read the documentation for the Deck of Cards API carefully

- Initialise a shuffled single deck of cards
- Provide a button that will 'draw' a card from that deck
- Display an image of the newly drawn card, with an image of the previous card to its left (if there is no previous card, display a placeholder)
- If the _value_ of the newly drawn card matches the previous one, display the message `SNAP VALUE!`
- If the _suit_ of the newly drawn card matches the previous one, display the message `SNAP SUIT!`
- If neither the value nor suit match, display no message
- Once all 52 cards have been drawn, remove the button and instead display the total number of value matches and the total number of suit matches
