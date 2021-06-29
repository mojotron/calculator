"use strict";
const numbers = document.querySelectorAll(".btn-number");
const operators = document.querySelectorAll(".btn-operator");
const display = document.querySelector(".display");
const floatPoint = document.querySelector(".btn-dot");
const openPara = document.querySelector(".btn-open-parentheses");
const closePara = document.querySelector(".btn-close-parentheses");
const equal = document.querySelector(".btn-equal");
const deleteChar = document.querySelector(".btn-del-one");
const reset = document.querySelector(".btn-del-all");

const expression = {
  elements: [],
  countParas: 0,
  insert: function (value, type) {
    this.elements.push({ value, type });
  },
  removeLast: function () {
    if (this.isEmpty()) return null;
    return this.elements.pop();
  },
  isEmpty: function () {
    return this.elements.length === 0;
  },
  lastElement: function () {
    if (!this.isEmpty) return null;
    return this.elements[this.elements.length - 1];
  },
  lastValue: function () {
    return this.lastElement().value;
  },
  lastType: function () {
    return this.lastElement().type;
  },
  printExpression: function () {
    return this.elements.map((ele) => ele.value).join(" ");
  },
  resetExpression: function () {
    this.elements = [];
    this.countParas = 0;
  },
};

let value = "";
let type = "";

function displayExpression() {
  display.textContent = expression.printExpression();
  if (type === "number") display.textContent += ` ${value}`;
}

function addElementToExpression() {
  expression.insert(value, type);
  value = "";
  type = "";
}

function addElementAndDisplay() {
  addElementToExpression();
  displayExpression();
}

function enterNumber(char) {
  //Check is it possible to enter number
  if (
    type === "number" ||
    expression.isEmpty() ||
    expression.lastType() === "operator" ||
    expression.lastType() === "openPara"
  ) {
    value += char;
    type = "number";
    displayExpression();
  }
}

function enterFloat() {
  //only if current type is number and if is negative must be numbers after -
  if (type === "number" && value !== "-") {
    if (value.includes(".")) return; //Gourd clause if number is already float
    value += ".";
    displayExpression();
  }
}

function removeFloatDot() {
  // In case there is dot last char before inserting in expression, remove dot
  if (value.slice(-1) === ".") value = value.slice(0, -1);
}

function enterOperator(char) {
  //Special case for making negative number
  if (char === "-" && value === "") {
    if (expression.isEmpty() || expression.lastType() === "openPara") {
      if (value[0] === "-" && type === "number") return; //Gourd clause if number is already negative
      value += "-";
      type = "number";
      displayExpression();
      return;
    }
  }
  //Special case of inserting because of possibility of crating negative numbers
  if (type === "number") {
    removeFloatDot();
    addElementToExpression();
  }
  if (
    expression.lastType() === "number" ||
    expression.lastType() === "closePara"
  ) {
    value = char;
    type = "operator";
    addElementAndDisplay();
  }
}
function enterOpenPara(char) {
  //Special case current value "-" and type "number" add it ass operator to expression
  if (value === "-" && type === "number") {
    type = "unaryOpe";
    addElementAndDisplay();
  }
  //
  if (
    expression.isEmpty() ||
    expression.lastType() === "operator" ||
    expression.lastType() === "openPara" ||
    expression.lastType() === "unaryOpe"
  ) {
    value = char;
    type = "openPara";
    expression.countParas++;
    addElementAndDisplay();
  }
}
function enterClosePara(char) {
  if (expression.countParas === 0) return; //Gourd clause cant be more closed then opened paras
  //Special case for numbers
  if (type === "number") addElementToExpression();
  if (
    expression.lastType() === "number" ||
    expression.lastType() === "closePara"
  ) {
    value = char;
    type = "closePara";
    expression.countParas--;
    addElementAndDisplay();
  }
}

function calcMathExpression() {
  //Special case if last input is number
  if (type === "number") addElementToExpression();
  //Check is paras close and is last element number and last para
  // give friendly msg"
  //Calculate expression
  //Display result
  //Prepare state for new input
}

function deleteLastChar() {
  if (type === "number" && value !== "") {
    value = value.slice(0, -1);
    if (value === "") type = "";
    displayExpression();
    return;
  }
  if (type === "" && expression.lastType() === "number") {
    ({ value, type } = expression.removeLast());
    deleteLastChar();
    displayExpression();
    return;
  }
  if (!expression.isEmpty() && type === "") {
    //Update disbalance of paras count
    let { _, type } = expression.removeLast();
    if (type === "openPara") expression.countParas--;
    if (type === "closePara") expression.countParas++;
    displayExpression();
    return;
  }
}

function resetCalculator() {
  value = "";
  type = "";
  expression.resetExpression();
  displayExpression();
}

for (let operator of operators) {
  operator.addEventListener("click", (e) =>
    enterOperator(e.target.textContent)
  );
}
for (let number of numbers) {
  number.addEventListener("click", (e) => enterNumber(e.target.textContent));
}
floatPoint.addEventListener("click", enterFloat);
openPara.addEventListener("click", (e) => enterOpenPara(e.target.textContent));
closePara.addEventListener("click", (e) =>
  enterClosePara(e.target.textContent)
);
equal.addEventListener("click", calcMathExpression);
deleteChar.addEventListener("click", deleteLastChar);
reset.addEventListener("click", resetCalculator);
