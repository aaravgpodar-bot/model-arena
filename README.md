# Model Arena

A local blind-comparison app for judging two AI model responses at a time.

Open `index.html` in a browser. Pick a category, compare Model A and Model B, vote, then see which model wrote each answer.

You can either use the built-in sample rounds or type your own prompt. Custom prompt battles keep the model names hidden until after voting, just like the sample rounds.

Each category rotates through a larger model pool so the same section does not always compare the same two competitors.

## Categories

- Design
- Terminal
- Coding
- Reasoning
- Writing
- Teaching

The app uses local sample rounds and stores vote totals in browser local storage.

## Results

The app tracks:

- total votes
- current leading model
- number of models voted for
- custom prompt rounds
- most-used category
