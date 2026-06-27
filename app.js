const categories = [
  { id: "design", label: "Design" },
  { id: "terminal", label: "Terminal" },
  { id: "coding", label: "Coding" },
  { id: "reasoning", label: "Reasoning" },
  { id: "writing", label: "Writing" },
  { id: "teaching", label: "Teaching" },
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

const state = {
  category: "design",
  roundIndex: 0,
  revealed: false,
  scores: JSON.parse(localStorage.getItem("arenaScores") || "{}"),
};

const els = {
  categoryGrid: document.querySelector("#categoryGrid"),
  scoreboard: document.querySelector("#scoreboard"),
  roundLabel: document.querySelector("#roundLabel"),
  promptTitle: document.querySelector("#promptTitle"),
  promptText: document.querySelector("#promptText"),
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
};

function filteredRounds() {
  return rounds.filter((round) => round.category === state.category);
}

function currentRound() {
  const list = filteredRounds();
  return list[state.roundIndex % list.length];
}

function renderCategories() {
  els.categoryGrid.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `category-button${category.id === state.category ? " active" : ""}`;
    button.type = "button";
    button.textContent = category.label;
    button.addEventListener("click", () => {
      state.category = category.id;
      state.roundIndex = 0;
      state.revealed = false;
      render();
    });
    els.categoryGrid.append(button);
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
  const list = filteredRounds();
  const categoryLabel = categories.find((item) => item.id === state.category).label;
  els.roundLabel.textContent = `${categoryLabel} round ${state.roundIndex + 1} of ${list.length}`;
  els.promptTitle.textContent = round.title;
  els.promptText.textContent = round.prompt;
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
    button.disabled = state.revealed;
  });
}

function vote(side) {
  if (state.revealed) return;
  const round = currentRound();
  const chosen = round[side.toLowerCase()];
  const other = side === "A" ? round.b : round.a;
  state.scores[chosen.model] = (state.scores[chosen.model] || 0) + 1;
  localStorage.setItem("arenaScores", JSON.stringify(state.scores));
  state.revealed = true;
  document.querySelector(`#card${side}`).classList.add("selected");
  els.winnerLine.textContent = `You picked ${chosen.model}`;
  els.revealDetails.textContent = `The other response was from ${other.model}.`;
  renderScoreboard();
  renderRound();
  document.querySelector(`#card${side}`).classList.add("selected");
}

function nextRound() {
  state.roundIndex = (state.roundIndex + 1) % filteredRounds().length;
  state.revealed = false;
  render();
}

function render() {
  renderCategories();
  renderScoreboard();
  renderRound();
}

document.querySelectorAll(".vote-button").forEach((button) => {
  button.addEventListener("click", () => vote(button.dataset.side));
});

els.nextRound.addEventListener("click", nextRound);
els.continueButton.addEventListener("click", nextRound);
els.resetScores.addEventListener("click", () => {
  state.scores = {};
  localStorage.removeItem("arenaScores");
  renderScoreboard();
});

render();

