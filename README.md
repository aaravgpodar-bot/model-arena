# Model Arena

A local blind-comparison app for judging two AI model responses at a time.

Open `index.html` in a browser. Pick a category, type your own prompt, compare Model A and Model B, vote, then see which model wrote each answer.

The app is prompt-first: it waits for the user to provide the prompt. The sample prompt button only fills the text box; it does not auto-start a battle.

Each category rotates through a larger model pool so the same section does not always compare the same two competitors.

## Arena-Informed Data

The category names and model pools are informed by public arenas and leaderboards, including:

- Arena.ai / LMArena text leaderboard: https://arena.ai/leaderboard/text
- Artificial Analysis coding capabilities: https://artificialanalysis.ai/models/capabilities/coding
- LiveBench: https://livebench.ai/

This static version does not include a shared server key. To make the models actually answer prompts, paste your own OpenRouter API key into the app. The key is stored only in your browser local storage and is used directly from the page to call OpenRouter's chat completions endpoint.

Because this is a public GitHub Pages site, do not hard-code a private API key into the repository.

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
