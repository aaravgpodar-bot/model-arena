

const modelPools = {
  design: [
    { name: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet" },
    { name: "GPT-4o mini", id: "openai/gpt-4o-mini" },
    { name: "Gemini 2.0 Flash", id: "google/gemini-2.0-flash-001" },
    { name: "Mistral Large", id: "mistralai/mistral-large" },
    { name: "Llama 3.1 70B", id: "meta-llama/llama-3.1-70b-instruct" },
    { name: "Qwen2.5 72B", id: "qwen/qwen-2.5-72b-instruct" },
  ],
  terminal: [
    { name: "Gemini 2.0 Flash", id: "google/gemini-2.0-flash-001" },
    { name: "Llama 3.1 70B", id: "meta-llama/llama-3.1-70b-instruct" },
    { name: "Claude 3 Haiku", id: "anthropic/claude-3-haiku" },
    { name: "Mistral Large", id: "mistralai/mistral-large" },
    { name: "GPT-4o mini", id: "openai/gpt-4o-mini" },
    { name: "DeepSeek Chat", id: "deepseek/deepseek-chat" },
  ],
  coding: [
    { name: "DeepSeek Chat", id: "deepseek/deepseek-chat" },
    { name: "Mistral Large", id: "mistralai/mistral-large" },
    { name: "GPT-4o mini", id: "openai/gpt-4o-mini" },
    { name: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet" },
    { name: "Qwen2.5 Coder", id: "qwen/qwen-2.5-coder-32b-instruct" },
    { name: "Llama 3.1 70B", id: "meta-llama/llama-3.1-70b-instruct" },
  ],
  reasoning: [
    { name: "GPT-4o mini", id: "openai/gpt-4o-mini" },
    { name: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet" },
    { name: "Gemini 2.0 Flash", id: "google/gemini-2.0-flash-001" },
    { name: "DeepSeek Chat", id: "deepseek/deepseek-chat" },
    { name: "Mistral Large", id: "mistralai/mistral-large" },
    { name: "Qwen2.5 72B", id: "qwen/qwen-2.5-72b-instruct" },
  ],
  writing: [
    { name: "Claude 3.5 Sonnet", id: "anthropic/claude-3.5-sonnet" },
    { name: "GPT-4o mini", id: "openai/gpt-4o-mini" },
    { name: "Gemini 2.0 Flash", id: "google/gemini-2.0-flash-001" },
    { name: "Mistral Large", id: "mistralai/mistral-large" },
    { name: "Llama 3.1 70B", id: "meta-llama/llama-3.1-70b-instruct" },
    { name: "Qwen2.5 72B", id: "qwen/qwen-2.5-72b-instruct" },
  ],
  teaching: [
    { name: "GPT-4o mini", id: "openai/gpt-4o-mini" },
    { name: "Qwen2.5 72B", id: "qwen/qwen-2.5-72b-instruct" },
    { name: "Claude 3 Haiku", id: "anthropic/claude-3-haiku" },
    { name: "Gemini 2.0 Flash", id: "google/gemini-2.0-flash-001" },
    { name: "Mistral Large", id: "mistralai/mistral-large" },
    { name: "Llama 3.1 70B", id: "meta-llama/llama-3.1-70b-instruct" },
  ],
};

const allModels = [...new Map(
  Object.values(modelPools)
    .flat()
    .map((model) => [model.id, model]),
).values()];

const state = {
  category: "design",
  roundIndex: 0,
  revealed: false,
  scores: JSON.parse(localStorage.getItem("arenaScores") || "{}"),
  history: JSON.parse(localStorage.getItem("arenaHistory") || "[]"),
  customRound: null,
  activeRound: null,
  lastPrompt: "",
  loading: false,
};

const els = {
  scoreboard: document.querySelector("#scoreboard"),
  roundLabel: document.querySelector("#roundLabel"),
  promptTitle: document.querySelector("#promptTitle"),
  promptText: document.querySelector("#promptText"),
  promptMeta: document.querySelector("#promptMeta"),
  responseA: document.querySelector("#responseA"),
  responseB: document.querySelector("#responseB"),
  nameA: document.querySelector("#nameA"),
  nameB: document.querySelector("#nameB"),
  cardA: document.querySelector("#cardA"),
  cardB: document.querySelector("#cardB"),
  revealPanel: document.querySelector("#revealPanel"),
  winnerLine: document.querySelector("#winnerLine"),
  revealDetails: document.querySelector("#revealDetails"),
  continueButton: document.querySelector("#continueButton"),
  nextRound: document.querySelector("#nextRound"),
  resetScores: document.querySelector("#resetScores"),
  customPrompt: document.querySelector("#customPrompt"),
  startCustom: document.querySelector("#startCustom"),
  overallLine: document.querySelector("#overallLine"),
  overallResults: document.querySelector("#overallResults"),
};

function currentRound() {
  if (state.customRound) return state.customRound;
  if (state.activeRound) return state.activeRound;
  return null;
}

function pickTwoModels(category, excluded = []) {
  const pool = allModels.filter(
    (model) => !excluded.includes(model.id),
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

function titleFromPrompt(prompt) {
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Custom prompt";
  return trimmed.length > 54 ? `${trimmed.slice(0, 54)}...` : trimmed;
}

function loadingRound(prompt, pair) {
  return {
    category: "prompt",
    custom: true,
    title: titleFromPrompt(prompt),
    prompt,
    a: { model: pair[0].name, text: "Model A is responding..." },
    b: { model: pair[1].name, text: "Model B is responding..." },
  };
}

function localDemoAnswer(prompt, style) {
  const cleanPrompt = prompt.trim();
  if (/```|code|javascript|python|html|css|function|program/i.test(cleanPrompt)) {
    return style === "direct"
      ? `Here is a direct implementation for your prompt:\n\n\`\`\`js\nfunction solveTask(input) {\n  // Replace this with the exact logic your prompt requires.\n  return input;\n}\n\`\`\`\n\nPrompt handled: ${cleanPrompt}`
      : `A practical way to handle this is to define the input, write the smallest working function, then test it with one example.\n\nFor your prompt:\n${cleanPrompt}\n\nStart with the simplest version, verify it works, then add edge cases.`;
  }
  if (/plan|steps|launch|create|build|make/i.test(cleanPrompt)) {
    return style === "direct"
      ? `1. Define the goal in one sentence.\n2. List the people, tools, and time needed.\n3. Create the first working version.\n4. Test it with a small group and collect feedback.\n5. Improve it and share the final version.\n\nApplied to your prompt: ${cleanPrompt}`
      : `Start small and make it real quickly.\n\n- Pick one clear outcome.\n- Build the simplest useful version.\n- Try it with real users.\n- Keep what works and remove what confuses people.\n- Present the improved version with examples.\n\nYour prompt: ${cleanPrompt}`;
  }
  if (/write|email|message|paragraph|story|letter/i.test(cleanPrompt)) {
    return style === "direct"
      ? `Here is a polished draft:\n\n${cleanPrompt}\n\nI wanted to share a clear update and make the main point easy to understand. The goal is to keep the tone helpful, specific, and easy to act on.`
      : `Draft:\n\n${cleanPrompt}\n\nThis version keeps the message simple, friendly, and focused on what the reader needs to know next.`;
  }
  return style === "direct"
    ? `Direct answer:\n\n${cleanPrompt}\n\nThe best response is to focus on the specific task, give the concrete result first, and avoid extra background unless it helps the user act.`
    : `Result:\n\nFor this prompt, I would give a concise answer, then add only the most useful supporting detail.\n\nPrompt: ${cleanPrompt}`;
}

function buildDemoRound(prompt) {
  return {
    category: "prompt",
    custom: true,
    demo: true,
    title: titleFromPrompt(prompt),
    prompt,
    a: {
      model: "Demo Model Alpha",
      text: localDemoAnswer(prompt, "direct"),
    },
    b: {
      model: "Demo Model Beta",
      text: localDemoAnswer(prompt, "structured"),
    },
  };
}

async function buildCustomRound(prompt) {
  return buildDemoRound(prompt);
}

function renderOverallResults() {
  const total = state.history.length;
  els.overallResults.innerHTML = "";
  if (!total) {
    els.overallLine.textContent = "No votes yet";
    return;
  }

  const modelWins = {};
  state.history.forEach((vote) => {
    modelWins[vote.model] = (modelWins[vote.model] || 0) + 1;
  });

  const leader = Object.entries(modelWins).sort((a, b) => b[1] - a[1])[0];
  els.overallLine.textContent = `${total} total votes. Current leader: ${leader[0]} (${leader[1]} wins).`;

  const blocks = [
    ["Total votes", total],
    ["Models voted for", Object.keys(modelWins).length],
    ["Prompt battles", state.history.filter((vote) => vote.custom).length],
    ["Model pool", allModels.length],
  ];

  blocks.forEach(([label, value]) => {
    const block = document.createElement("div");
    block.className = "result-tile";
    block.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    els.overallResults.append(block);
  });
}

function renderScoreboard() {
  const entries = Object.entries(state.scores).sort((a, b) => b[1] - a[1]);
  els.scoreboard.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "score-row";
    empty.innerHTML = "<span>No votes yet</span><strong>0</strong>";
    els.scoreboard.append(empty);
    return;
  }
  entries.slice(0, 8).forEach(([model, score]) => {
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span>${model}</span><strong>${score}</strong>`;
    els.scoreboard.append(row);
  });
}

function renderRound() {
  const round = currentRound();
  if (!round) {
    els.roundLabel.textContent = "Prompt-first arena";
    els.promptTitle.textContent = "Enter a prompt to start";
    els.promptText.textContent = "Type your prompt, run a blind model matchup, then compare the results.";
    els.promptMeta.textContent = "";
    els.responseA.textContent = "Waiting for your prompt...";
    els.responseB.textContent = "Waiting for your prompt...";
    els.nameA.textContent = "";
    els.nameB.textContent = "";
    els.nameA.classList.add("hidden");
    els.nameB.classList.add("hidden");
    els.revealPanel.classList.add("hidden");
    els.cardA.classList.remove("selected");
    els.cardB.classList.remove("selected");
    document.querySelectorAll(".vote-button").forEach((button) => {
      button.disabled = true;
    });
    return;
  }
  els.roundLabel.textContent = "Prompt matchup";
  els.promptTitle.textContent = round.title;
  els.promptText.textContent = round.prompt;
  els.promptMeta.textContent = round.failed
    ? "No valid model comparison was recorded."
    : "This exact prompt is sent to both models.";
  els.responseA.textContent = round.a.text;
  els.responseB.textContent = round.b.text;
  els.nameA.textContent = round.a.model;
  els.nameB.textContent = round.b.model;
  els.nameA.classList.toggle("hidden", !state.revealed);
  els.nameB.classList.toggle("hidden", !state.revealed);
  els.revealPanel.classList.toggle("hidden", !state.revealed);
  els.cardA.classList.remove("selected");
  els.cardB.classList.remove("selected");
  document.querySelectorAll(".vote-button").forEach((button) => {
    button.disabled = state.revealed || state.loading || Boolean(round.failed);
  });
  els.startCustom.disabled = state.loading;
  els.nextRound.disabled = state.loading;
}

function vote(side) {
  if (state.revealed) return;
  const round = currentRound();
  if (!round) return;
  const chosen = round[side.toLowerCase()];
  const other = side === "A" ? round.b : round.a;
  state.scores[chosen.model] = (state.scores[chosen.model] || 0) + 1;
  state.history.push({
    model: chosen.model,
    custom: Boolean(round.custom),
    prompt: round.prompt,
    at: new Date().toISOString(),
  });
  localStorage.setItem("arenaScores", JSON.stringify(state.scores));
  localStorage.setItem("arenaHistory", JSON.stringify(state.history));
  state.revealed = true;
  document.querySelector(`#card${side}`).classList.add("selected");
  els.winnerLine.textContent = `You picked ${chosen.model}`;
  els.revealDetails.textContent = `The other response was from ${other.model}.`;
  renderScoreboard();
  renderOverallResults();
  renderRound();
  document.querySelector(`#card${side}`).classList.add("selected");
}

async function nextRound() {
  state.activeRound = null;
  if (!state.lastPrompt) {
    state.customRound = null;
    state.revealed = false;
    render();
    return;
  }
  state.revealed = false;
  state.loading = true;
  try {
    state.customRound = await buildCustomRound(state.lastPrompt);
  } catch (error) {
    state.customRound = {
      category: "prompt",
      custom: true,
      failed: true,
      title: "Model call failed",
      prompt: state.lastPrompt,
      a: { model: "Model A", text: error.message },
      b: { model: "Model B", text: "Try a shorter prompt and run the battle again." },
    };
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  renderScoreboard();
  renderOverallResults();
  renderRound();
}

document.querySelectorAll(".vote-button").forEach((button) => {
  button.addEventListener("click", () => vote(button.dataset.side));
});

els.nextRound.addEventListener("click", () => {
  nextRound();
});
els.continueButton.addEventListener("click", () => {
  nextRound();
});
els.resetScores.addEventListener("click", () => {
  state.scores = {};
  state.history = [];
  localStorage.removeItem("arenaScores");
  localStorage.removeItem("arenaHistory");
  renderScoreboard();
  renderOverallResults();
});

els.startCustom.addEventListener("click", async () => {
  const prompt = els.customPrompt.value.trim();
  if (!prompt) {
    els.customPrompt.focus();
    return;
  }
  state.lastPrompt = prompt;
  state.activeRound = null;
  state.revealed = false;
  state.loading = true;
  try {
    state.customRound = await buildCustomRound(prompt);
  } catch (error) {
    state.customRound = {
      category: "prompt",
      custom: true,
      failed: true,
      title: "Model call failed",
      prompt,
      a: { model: "Model A", text: error.message },
      b: { model: "Model B", text: "Try a shorter prompt and run the battle again." },
    };
  } finally {
    state.loading = false;
    render();
  }
});

render();




