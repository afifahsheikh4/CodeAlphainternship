const display = document.getElementById("display");
const historyEl = document.getElementById("history");
const calc = document.getElementById("calc");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateScreen() {
  display.textContent = formatNumber(current);
  historyEl.textContent = previous !== null && operator
    ? `${formatNumber(previous)} ${operator}`
    : "";
  // shrink font for long numbers
  const len = display.textContent.length;
  display.style.fontSize = len > 9 ? "1.7rem" : len > 6 ? "2.1rem" : "2.6rem";
}

function formatNumber(numStr) {
  if (numStr === "Error") return numStr;
  const num = parseFloat(numStr);
  if (isNaN(num)) return "0";
  if (Math.abs(num) >= 1e12) return num.toExponential(4);
  const parts = numStr.split(".");
  const intPart = parts[0].replace("-", "");
  const sign = parts[0].startsWith("-") ? "-" : "";
  const withCommas = sign + intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${withCommas}.${parts[1]}` : withCommas;
}

function inputDigit(d) {
  if (justEvaluated) {
    current = d;
    justEvaluated = false;
  } else {
    current = current === "0" ? d : current + d;
  }
  updateScreen();
}

function inputDecimal() {
  if (justEvaluated) {
    current = "0.";
    justEvaluated = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateScreen();
}

function setOperator(op) {
  if (operator && previous !== null && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  justEvaluated = true; // next digit starts fresh
  updateScreen();
  highlightOp(op);
}

function highlightOp(op) {
  document.querySelectorAll(".key-op").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.op === op);
  });
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷": result = b === 0 ? NaN : a / b; break;
    default: return;
  }
  current = isNaN(result) ? "Error" : trimFloat(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  highlightOp(null);
  updateScreen();
}

function trimFloat(n) {
  return parseFloat(n.toFixed(10)).toString();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
  highlightOp(null);
  updateScreen();
}

function toggleSign() {
  if (current === "0" || current === "Error") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  updateScreen();
}

function percent() {
  current = trimFloat(parseFloat(current) / 100);
  updateScreen();
}

function backspace() {
  if (justEvaluated || current === "Error") { current = "0"; justEvaluated = false; }
  else if (current.length > 1) current = current.slice(0, -1);
  else current = "0";
  updateScreen();
}

// Button clicks
document.querySelector(".pad").addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;
  const { num, op, action } = btn.dataset;
  if (num !== undefined) inputDigit(num);
  else if (op !== undefined) setOperator(op);
  else if (action === "decimal") inputDecimal();
  else if (action === "equals") evaluate();
  else if (action === "clear") clearAll();
  else if (action === "sign") toggleSign();
  else if (action === "percent") percent();
  flashKey(btn);
});

function flashKey(btn) {
  btn.style.transform = "translateY(2px)";
  setTimeout(() => (btn.style.transform = ""), 90);
}

// Keyboard support
const opMap = { "+": "+", "-": "−", "*": "×", "/": "÷" };
document.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
  else if (e.key === ".") inputDecimal();
  else if (opMap[e.key]) setOperator(opMap[e.key]);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(); }
  else if (e.key === "Escape") clearAll();
  else if (e.key === "Backspace") backspace();
  else if (e.key === "%") percent();
  else return;
});

updateScreen();
