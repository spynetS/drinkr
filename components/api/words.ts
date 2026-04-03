type Word = {
  word: string;
  hint: string;
};

export type WordData = {
  [category: string]: Word[];
};

export const words: WordData = {
  "food_and_drink": [
    { "word": "Espresso", "hint": "A caffeinated beverage" },
    { "word": "Sushi", "hint": "A dish from Japan" },
    { "word": "Pizza", "hint": "A popular Italian export" },
    { "word": "Taco", "hint": "A handheld Mexican meal" }
  ],
  "famous_places": [
    { "word": "Eiffel Tower", "hint": "A famous European landmark" },
    { "word": "Mount Everest", "hint": "A very high elevation" },
    { "word": "Hollywood", "hint": "Associated with the film industry" },
    { "word": "The Colosseum", "hint": "An ancient sports arena" }
  ],
  "occupations": [
    { "word": "Surgeon", "hint": "Someone who works in a hospital" },
    { "word": "Astronaut", "hint": "A person who travels very far" },
    { "word": "Chef", "hint": "A professional who prepares food" },
    { "word": "Librarian", "hint": "Someone who works with books" }
  ],
  "objects": [
    { "word": "Smartphone", "hint": "A common handheld electronic" },
    { "word": "Umbrella", "hint": "Used for protection from weather" },
    { "word": "Telescope", "hint": "Used to see things far away" },
    { "word": "Piano", "hint": "A large musical instrument" }
  ],
  "animals": [
    { "word": "Penguin", "hint": "A bird that cannot fly" },
    { "word": "Chameleon", "hint": "An animal known for blending in" },
    { "word": "Elephant", "hint": "A very large land mammal" },
    { "word": "Shark", "hint": "A dangerous underwater predator" }
  ]
};
