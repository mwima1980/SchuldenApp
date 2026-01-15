"use strict";

let creditoren = [];

// ===== Klasse =====
class Creditor {
  constructor(aktenzeichen, debitor, pay, date, state) {
    this.aktenzeichen = aktenzeichen;
    this.debitor = debitor;
    this.pay = pay;
    this.date = date;
    this.state = state;
  }
}

// ===== DOM Elemente =====
const az = document.getElementById("aktenzeichen");
const creditor = document.getElementById("creditor");
const pay = document.getElementById("pay");
const date = document.getElementById("date");
const state = document.getElementById("state");
const inputSearch = document.getElementById("input-search");

const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");
const btnReset = document.getElementById("btn-reset");
const btnSearch = document.getElementById("btn-search");

const tbodyElement = document.getElementById("tbody");
const form = document.getElementById("creditor-form");

// ===== Start =====
document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  renderTable();
  loadCreditor();

  btnSave.addEventListener("click", handleSave);
  btnReset.addEventListener("click", resetInput);
  btnDelete.addEventListener("click", handleDelete);
  btnSearch.addEventListener("click", handleSearch);
});

// ===== Funktionen =====

// --- Save ---
function handleSave(e) {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const newCreditor = new Creditor(
    az.value.trim(),
    creditor.value.trim(),
    pay.value.trim(),
    new Date(date.value).toLocaleDateString("de-DE"),
    state.value
  );

  // Prüfen, ob Aktenzeichen schon existiert
  const exists = creditoren.some(
    (c) => c.aktenzeichen === newCreditor.aktenzeichen
  );
  if (exists) {
    alert("Aktenzeichen existiert bereits!");
    return;
  }

  creditoren.push(newCreditor);
  syncLocalStorage();
  renderTable();
  resetInput();
}

// --- Delete ---
function handleDelete() {
  const index = creditoren.findIndex((c) => c.aktenzeichen === az.value);
  if (index === -1) {
    alert("Kein Eintrag ausgewählt oder Aktenzeichen unbekannt.");
    return;
  }

  if (!confirm("Diesen Eintrag wirklich löschen?")) return;

  creditoren.splice(index, 1);
  syncLocalStorage();
  renderTable();
  resetInput();
}

// --- Search ---
function handleSearch(e) {
  e.preventDefault();
  const searchValue = inputSearch.value.trim();
  if (!searchValue) return alert("Bitte ein Aktenzeichen eingeben!");

  const result = creditoren.find((c) => c.aktenzeichen === searchValue);
  tbodyElement.innerHTML = "";

  if (result) {
    tbodyElement.appendChild(createRow(result));
    fillInputs(result);
  } else {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "Kein Eintrag gefunden.";
    tr.appendChild(td);
    tbodyElement.appendChild(tr);
  }
}

// --- LocalStorage laden ---
function loadLocalStorage() {
  creditoren = [];
  const keys = Object.keys(localStorage).sort();

  for (const key of keys) {
    const obj = JSON.parse(localStorage.getItem(key));
    creditoren.push(obj);
  }
}

// --- LocalStorage speichern ---
function syncLocalStorage() {
  localStorage.clear();
  creditoren.forEach((c) => {
    localStorage.setItem(c.aktenzeichen, JSON.stringify(c));
  });
}

// --- Tabelle rendern ---
function renderTable() {
  tbodyElement.innerHTML = "";
  creditoren.forEach((item) => {
    tbodyElement.appendChild(createRow(item));
  });
}

// --- Tabellenzeile erstellen ---
function createRow(item) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${item.aktenzeichen}</td>
    <td>${item.debitor}</td>
    <td>${item.pay}</td>
    <td>${item.date}</td>
    <td>${item.state}</td>
  `;
  checkState(tr.lastElementChild, item.state);
  return tr;
}

// --- Zeile anklicken -> Input befüllen ---
function loadCreditor() {
  tbodyElement.addEventListener("click", (e) => {
    const trElement = e.target.closest("tr");
    if (!trElement) return;
    const td = trElement.querySelectorAll("td");
    if (!td.length) return;

    const [azVal, creditorVal, payVal, dateVal, stateVal] = [...td].map(
      (cell) => cell.textContent.trim()
    );

    az.value = azVal;
    creditor.value = creditorVal;
    pay.value = payVal;

    let d = dateVal;
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(d)) {
      const [day, month, year] = d.split(".");
      d = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    date.value = new Date(d).toISOString().split("T")[0];
    state.value = stateVal;
  });
}

// --- Inputfelder befüllen ---
function fillInputs(item) {
  az.value = item.aktenzeichen;
  creditor.value = item.debitor;
  pay.value = item.pay;

  let d = item.date;
  if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(d)) {
    const [day, month, year] = d.split(".");
    d = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  date.value = new Date(d).toISOString().split("T")[0];
  state.value = item.state;
}

// --- Eingaben zurücksetzen ---
function resetInput() {
  az.value = "";
  creditor.value = "";
  pay.value = "";
  date.value = "";
  state.value = "";
  inputSearch.value = "";
}

// --- Status-Klasse setzen ---
function checkState(tdStateElement, state) {
  const value = typeof state === "object" ? state.value : state;
  tdStateElement.classList.remove("state-pay", "state-open", "state-overdue");

  if (value === "bezahlt") {
    tdStateElement.classList.add("state-pay");
  } else if (value === "offen") {
    tdStateElement.classList.add("state-open");
  } else if (value === "überfällig") {
    tdStateElement.classList.add("state-overdue");
  }
}
