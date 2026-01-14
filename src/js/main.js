"use strict";
const creditoren = [];

class Creditor {
  constructor(aktenzeichen, debitor, pay, date, state) {
    this.aktenzeichen = aktenzeichen;
    this.debitor = debitor;
    this.pay = pay;
    this.date = date;
    this.state = state;
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

// Debitor List
const tbodyElement = document.getElementById("tbody");

// Form
const form = document.getElementById("creditor-form");

document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();

  btnSave.addEventListener("click", (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    createdebitorList();

    saveCreditor();
  });
});

function loadLocalStorage() {
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

    tbodyElement.appendChild(trElement);
  }
}

function createdebitorList() {
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
  trElement.appendChild(tdAzElement);
  trElement.appendChild(tdCreditorElement);
  trElement.appendChild(tdPayElement);
  trElement.appendChild(tdDateElement);
  trElement.appendChild(tdStateElement);

  tbodyElement.appendChild(trElement);
}

function saveCreditor() {
  const newCreditor = new Creditor(
    az.value,
    creditor.value,
    pay.value,
    new Date(date.value).toLocaleDateString("de-DE"),
    state.value
  );
  const rndNumber = Math.floor(Math.random() * 100 + 1);
  localStorage.setItem(rndNumber, JSON.stringify(newCreditor));
  creditoren.push(newCreditor);

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
