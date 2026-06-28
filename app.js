const categories = [
  { id: "design", label: "Design" },
  { id: "terminal", label: "Terminal" },
  { id: "coding", label: "Coding" },
  { id: "reasoning", label: "Reasoning" },
  { id: "writing", label: "Writing" },
  { id: "teaching", label: "Teaching" },
];
const arenaSources = [
  {
    name: "Arena.ai / LMArena",
    url: "https://arena.ai/leaderboard/text",
    note: "broad public arena model coverage",
  },
  {
    name: "Artificial Analysis",
    url: "https://artificialanalysis.ai/models/capabilities/coding",
    note: "coding and tool-style comparison signals",
  },
  {
    name: "LiveBench",
    url: "https://livebench.ai/",
    note: "independent live model benchmark coverage",
  },
];

const rounds = [
  {
    category: "design",
    title: "Dashboard redesign",
    prompt:
      "Design a compact home screen for a classroom AI app where teachers can see today's lesson, student progress, and pending questions.",
    a: {
      model: "Claude 3.5 Sonnet",
      text:
        "Use a quiet, work-focused layout with a left lesson rail and a dense progress table.\n\nTop band: Today's lesson, active class, and start button.\nMiddle: three scan-friendly metrics: attendance, completion, questions.\nMain area: student table with status chips, last activity, and one-click follow-up.\nRight rail: unanswered questions grouped by urgency.\n\nAvoid a marketing-style hero. Teachers need speed, not decoration.",
    },
    b: {
      model: "GPT-4o",
      text:
        "Create a warm dashboard with a large welcome banner, illustrated classroom background, and cards for every feature.\n\nSections:\n- Welcome back, Teacher!\n- Lesson of the day\n- Student progress cards\n- AI helper suggestions\n- Recent activity\n\nUse colorful rounded cards and friendly icons to make the app feel approachable.",
    },
  },
  {
    category: "terminal",
    title: "Find the largest log files",
    prompt:
      "Give a Windows PowerShell command to list the 10 largest .log files under the current folder.",
    a: {
      model: "Gemini 1.5 Pro",
      text:
        "Get-ChildItem -Recurse -Filter *.log -File |\n  Sort-Object Length -Descending |\n  Select-Object -First 10 FullName, @{Name='MB';Expression={[math]::Round($_.Length/1MB,2)}}",
    },
    b: {
      model: "Llama 3.1 70B",
      text:
        "dir /s *.log | sort length | select -last 10\n\nThis searches all folders and sorts by file length.",
    },
  },
  {
    category: "coding",
    title: "Debounce a search box",
    prompt:
      "Write a small JavaScript debounce helper and show how to use it for a search input.",
    a: {
      model: "DeepSeek Coder",
      text:
        "function debounce(fn, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\nconst search = debounce((event) => {\n  fetch(`/api/search?q=${encodeURIComponent(event.target.value)}`);\n}, 250);\n\ndocument.querySelector('#search').addEventListener('input', search);",
    },
    b: {
      model: "Mistral Large",
      text:
        "function debounce(callback) {\n  setTimeout(callback, 300);\n}\n\ninput.onchange = function() {\n  debounce(function() {\n    search(input.value);\n  });\n};",
    },
  },
  {
    category: "reasoning",
    title: "Two switches puzzle",
    prompt:
      "A room has two switches outside and one lamp inside. You can enter the room once. Explain how to determine which switch controls the lamp.",
    a: {
      model: "GPT-4.1",
      text:
        "Turn switch 1 on for several minutes, then turn it off. Turn switch 2 on and enter the room.\n\nIf the lamp is on, switch 2 controls it. If it is off but warm, switch 1 controls it. If it is off and cool, neither of those would control it, but with only two switches and one lamp this means the puzzle statement needs a third switch or different wording.",
    },
    b: {
      model: "Claude 3 Opus",
      text:
        "Turn both switches on, enter the room, and see whether the lamp is on. If it is on, one of the two switches controls it. Then leave and test the other switch.",
    },
  },
  {
    category: "writing",
    title: "Parent update",
    prompt:
      "Write a short parent-friendly update about students learning to evaluate AI responses critically.",
    a: {
      model: "Claude 3.5 Sonnet",
      text:
        "This week, students practiced comparing AI answers instead of accepting the first response they saw. They looked for clarity, accuracy, missing assumptions, and whether an answer actually solved the task. The goal is not just to use AI, but to build judgment around it.",
    },
    b: {
      model: "Grok 2",
      text:
        "Students used AI in class and learned many things about technology. AI is very powerful and will be important in the future, so we are helping them be ready. Please encourage your child to keep exploring AI tools at home.",
    },
  },
  {
    category: "teaching",
    title: "Explain variables",
    prompt:
      "Explain programming variables to 11-year-olds using a quick classroom analogy.",
    a: {
      model: "GPT-4o mini",
      text:
        "A variable is like a labeled box on your desk. If the box says score, you can put 10 inside it now and 15 later. The label stays the same, but the value inside can change while your program runs.",
    },
    b: {
      model: "Qwen2.5 72B",
      text:
        "Variables are symbolic names associated with memory locations that store values during execution. They allow abstraction over literal data and can be reassigned depending on type constraints.",
    },
  },
  {
    category: "design",
    title: "Landing page hero",
    prompt:
      "Suggest a first screen for an AI music guessing game where players decide whether a song is human-made or AI-made.",
    a: {
      model: "Gemini 2.0 Flash",
      text:
        "Make the first screen the actual game: waveform, play button, two large choices, and current streak. Use album-art style backgrounds that change per track. Keep explanation secondary so the first action is listening.",
    },
    b: {
      model: "GPT-3.5 Turbo",
      text:
        "Create a hero section with a headline, subheading, three feature cards, testimonials, and a call-to-action button. Use a gradient background and icons for AI, music, and fun.",
    },
  },
  {
    category: "terminal",
    title: "Check what uses a port",
    prompt:
      "Give a Windows command to find what process is using port 5000.",
    a: {
      model: "Mistral Small",
      text:
        "netstat -ano | findstr :5000\n\nThen use the PID in the last column:\n\ntasklist /FI \"PID eq <PID>\"",
    },
    b: {
      model: "Claude Haiku",
      text:
        "ps aux | grep 5000\n\nThis will show the process that is using the port.",
    },
  },
];

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
  categoryGrid: document.querySelector("#categoryGrid"),
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
  samplePrompt: document.querySelector("#samplePrompt"),
  apiKey: document.querySelector("#apiKey"),
  apiStatus: document.querySelector("#apiStatus"),
  overallLine: document.querySelector("#overallLine"),
  overallResults: document.querySelector("#overallResults"),
  sourceText: document.querySelector("#sourceText"),
};

els.apiKey.value = localStorage.getItem("openRouterKey") || "";

function apiKeyValue() {
  return els.apiKey.value.trim();
}

function setApiStatus(message = "", isError = false) {
  els.apiStatus.textContent = message;
  els.apiStatus.classList.toggle("error", isError);
}

function filteredRounds() {
  return rounds.filter((round) => round.category === state.category);
}

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

function randomizeRoundModels(round) {
  const [modelA, modelB] = pickTwoModels(round.category);
  return {
    ...round,
    a: { ...round.a, model: modelA },
    b: { ...round.b, model: modelB },
  };
}

function titleFromPrompt(prompt) {
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Custom prompt";
  return trimmed.length > 54 ? `${trimmed.slice(0, 54)}...` : trimmed;
}

function systemPrompt() {
  return [
    "You are an assistant.",
    "Perform the user's requested task directly.",
    "Do not write about the topic in general.",
    "Do not summarize, analyze, restate, or critique the prompt unless the user explicitly asks for that.",
    "Do not say what you would do. Do it.",
    "If the user asks for code, write code. If they ask for a command, give the command. If they ask for a design, give the design. If they ask a question, answer it.",
    "Start immediately with the answer.",
  ].join(" ");
}

function buildUserMessage(prompt) {
  return [
    "Complete this task exactly as written. Do not respond with background information about the topic.",
    "",
    "TASK:",
    prompt,
  ].join("\n");
}

async function callOpenRouter(model, prompt, apiKey) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.href,
      "X-Title": "Model Arena",
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: buildUserMessage(prompt) },
      ],
      temperature: 0.25,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${model.name} failed: ${response.status} ${errorText.slice(0, 180)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "(No response text returned.)";
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

async function buildCustomRound(prompt) {
  const pair = pickTwoModels();
  const apiKey = apiKeyValue();
  if (!apiKey) {
    throw new Error("Add an OpenRouter API key first.");
  }
  localStorage.setItem("openRouterKey", apiKey);

  state.customRound = loadingRound(prompt, pair);
  renderRound();

  const [answerA, answerB] = await Promise.all([
    callOpenRouter(pair[0], prompt, apiKey),
    callOpenRouter(pair[1], prompt, apiKey),
  ]);

  return {
    category: "prompt",
    custom: true,
    title: titleFromPrompt(prompt),
    prompt,
    a: {
      model: pair[0].name,
      text: answerA,
    },
    b: {
      model: pair[1].name,
      text: answerB,
    },
  };
}

function renderCategories() {
}

function samplePrompt() {
  return "Write a clear 5-step plan for launching a student AI club at school, including one activity for the first meeting.";
}

function renderSourceText() {
  els.sourceText.innerHTML = arenaSources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.name}</a>: ${source.note}`)
    .join(" · ");
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
  if (!apiKeyValue()) {
    setApiStatus("Paste an OpenRouter API key before running a real matchup.", true);
    els.apiKey.focus();
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
    setApiStatus("Model call failed. Check the key, credits, and model access.", true);
    state.customRound = {
      category: "prompt",
      custom: true,
      failed: true,
      title: "Model call failed",
      prompt: state.lastPrompt,
      a: { model: "Model A", text: error.message },
      b: { model: "Model B", text: "Check your API key, credits, network access, or selected provider models." },
    };
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  renderCategories();
  renderScoreboard();
  renderOverallResults();
  renderSourceText();
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
  if (!apiKeyValue()) {
    setApiStatus("Paste an OpenRouter API key before running a real matchup.", true);
    els.apiKey.focus();
    state.customRound = null;
    state.revealed = false;
    render();
    return;
  }
  setApiStatus("Running both models...", false);
  state.lastPrompt = prompt;
  state.activeRound = null;
  state.revealed = false;
  state.loading = true;
  try {
    state.customRound = await buildCustomRound(prompt);
  } catch (error) {
    setApiStatus("Model call failed. Check the key, credits, and model access.", true);
    state.customRound = {
      category: "prompt",
      custom: true,
      failed: true,
      title: "Model call failed",
      prompt,
      a: { model: "Model A", text: error.message },
      b: { model: "Model B", text: "Add a valid OpenRouter key and try again." },
    };
  } finally {
    state.loading = false;
    if (!state.customRound?.failed) {
      setApiStatus("Model responses loaded.", false);
    }
    render();
  }
});

els.samplePrompt.addEventListener("click", () => {
  els.customPrompt.value = samplePrompt();
  els.customPrompt.focus();
});

els.apiKey.addEventListener("input", () => {
  localStorage.setItem("openRouterKey", apiKeyValue());
  setApiStatus(apiKeyValue() ? "API key saved in this browser." : "", false);
});

render();



