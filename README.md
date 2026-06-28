# Model Arena

A prompt-first blind comparison app for judging two AI model responses at a time.

Open `index.html` in a browser, paste an OpenRouter API key, type a prompt, and run a battle. The app sends the same prompt to two randomly selected models, hides the model names, lets you vote, then reveals who wrote each result.

## Model Pool

The model pool is informed by public arenas and leaderboards, including:

- Arena.ai / LMArena text leaderboard: https://arena.ai/leaderboard/text
- Artificial Analysis coding capabilities: https://artificialanalysis.ai/models/capabilities/coding
- LiveBench: https://livebench.ai/

This static version does not include a shared server key. The OpenRouter key is stored only in your browser local storage and is used directly from the page to call OpenRouter's chat completions endpoint.

Because this is a public GitHub Pages site, do not hard-code a private API key into the repository.

## Results

The app tracks total votes, the current leading model, models voted for, prompt battles, and the size of the model pool.
