"use strict";
const creditoren = [];

class Creditor {
  constructor(aktenzeichen, debitor, pay, date, state, id) {
    this.aktenzeichen = aktenzeichen;
    this.debitor = debitor;
    this.pay = pay;
    this.date = date;
    this.state = state;
    this.id = id;
  }
}

// Case Input
const az = document.getElementById("aktenzeichen");
const creditor = document.getElementById("creditor");
const pay = document.getElementById("pay");
const date = document.getElementById("date");
const state = document.getElementById("state");

// Buttons
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");
const btnReset = document.getElementById("btn-reset");
const btnSearch = document.getElementById("btn-search");

// Debitor List
const tbodyElement = document.getElementById("tbody");

// Form
const form = document.getElementById("creditor-form");

document.addEventListener("DOMContentLoaded", () => {
  console.log(creditoren);
  loadLocalStorage();
  loadCreditor();
  btnSave.addEventListener("click", (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    createdebitorList();

    saveCreditor();
  });

  btnReset.addEventListener("click", () => {
    resetInput();
  });

  btnDelete.addEventListener("click", () => {
    const index = creditoren.findIndex((c) => c.aktenzeichen === az.value);

    if (index !== -1) {
      // 1. Aus dem Array löschen
      creditoren.splice(index, 1);

      // 2. Den passenden LocalStorage-Key suchen und löschen
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = JSON.parse(localStorage.getItem(key));

        if (item && item.aktenzeichen === az.value) {
          localStorage.removeItem(key);
          break;
        }
      }

      // 2. LocalStorage komplett leeren
      localStorage.clear();

      // 3. Alles aus creditoren neu speichern (mit neuer Nummerierung)
      creditoren.forEach((c, i) => {
        const newIndex = i + 1;
        c.id = newIndex;
        localStorage.setItem(newIndex, JSON.stringify(c));
      });

      // 3. Tabelle neu aufbauen
      tbodyElement.innerHTML = "";
      loadLocalStorage();
    }

    console.log(creditoren);
  });
});
function loadLocalStorage() {
  creditoren.length = 0;
  tbodyElement.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    const obj = JSON.parse(value);
    creditoren.push(obj);

    const tdAzElement = document.createElement("td");
    tdAzElement.appendChild(document.createTextNode(obj.aktenzeichen));

    const tdCreditorElement = document.createElement("td");
    tdCreditorElement.appendChild(document.createTextNode(obj.debitor));

    const tdPayElement = document.createElement("td");
    tdPayElement.appendChild(document.createTextNode(obj.pay));

    const tdDateElement = document.createElement("td");
    tdDateElement.appendChild(document.createTextNode(obj.date));

    const tdStateElement = document.createElement("td");
    const spanStateElement = document.createElement("span");

    tdStateElement.appendChild(spanStateElement);
    spanStateElement.appendChild(document.createTextNode(obj.state));

    checkState(tdStateElement, obj.state);

    const trElement = document.createElement("tr");
    trElement.appendChild(tdAzElement);
    trElement.appendChild(tdCreditorElement);
    trElement.appendChild(tdPayElement);
    trElement.appendChild(tdDateElement);
    trElement.appendChild(tdStateElement);
    trElement.dataset.id = i + 1;
    tbodyElement.appendChild(trElement);
  }
}

function createdebitorList() {
  const counter = tbodyElement.querySelectorAll("tr").length + 1;
  const tdAzElement = document.createElement("td");
  tdAzElement.appendChild(document.createTextNode(az.value));

  const tdCreditorElement = document.createElement("td");
  tdCreditorElement.appendChild(document.createTextNode(creditor.value));

  const tdPayElement = document.createElement("td");
  tdPayElement.appendChild(document.createTextNode(pay.value));

  const tdDateElement = document.createElement("td");
  tdDateElement.appendChild(document.createTextNode(date.value));

  const tdStateElement = document.createElement("td");
  const spanStateElement = document.createElement("span");

  checkState(tdStateElement, state.value);

  tdStateElement.appendChild(spanStateElement);
  spanStateElement.appendChild(document.createTextNode(state.value));

  const trElement = document.createElement("tr");
  trElement.dataset.id = counter;
  trElement.appendChild(tdAzElement);
  trElement.appendChild(tdCreditorElement);
  trElement.appendChild(tdPayElement);
  trElement.appendChild(tdDateElement);
  trElement.appendChild(tdStateElement);

  tbodyElement.appendChild(trElement);
}

function saveCreditor() {
  const counter = tbodyElement.querySelectorAll("tr").length;
  const newCreditor = new Creditor(
    az.value,
    creditor.value,
    pay.value,
    new Date(date.value).toLocaleDateString("de-DE"),
    state.value,
    counter
  );

  localStorage.setItem(counter, JSON.stringify(newCreditor));
  creditoren.push(newCreditor);
  console.log(creditoren);
  resetInput();
}

function resetInput() {
  (az.value = ""), (creditor.value = ""), (pay.value = ""), (date.value = null);
  state.value = "";
}

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

function loadCreditor() {
  tbodyElement.addEventListener("click", (e) => {
    const trElement = e.target.closest("tr");
    const tdElement = trElement.querySelectorAll("td");

    if (!tdElement) return;
    let value = [];
    for (let i = 0; i < tdElement.length; i++) {
      value.push(tdElement[i].innerText);
    }

    az.value = value[0];
    creditor.value = value[1];
    pay.value = value[2];

    // deutsches Datum in ISO umwandeln, damit new Date() funktioniert
    let d = value[3].trim();
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(d)) {
      const [day, month, year] = d.split(".");
      d = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // jetzt sicher:
    date.value = new Date(d).toISOString().split("T")[0];
    state.value = value[4];
  });
}
