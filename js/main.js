"use strict";
//Calculator DOM selectors
const numbers = document.querySelectorAll(".btn-number");
const operators = document.querySelectorAll(".btn-operator");
const display = document.querySelector(".display");
const floatPoint = document.querySelector(".btn-dot");
const openPara = document.querySelector(".btn-open-parentheses");
const closePara = document.querySelector(".btn-close-parentheses");
const equal = document.querySelector(".btn-equal");
const deleteChar = document.querySelector(".btn-del-one");
const reset = document.querySelector(".btn-del-all");
//Alert box DOM selectors
const alertBox = document.querySelector(".alert-box");
const alertBtn = document.querySelector(".btn-close-alert");
const alertMsg = document.querySelector(".alert-msg");
//Alert box logic
const removeAlert = () => alertBox.classList.add("hidden");
alertBtn.addEventListener("click", removeAlert);

function creatAlertMsg(msg) {
  alertMsg.textContent = msg;
  alertBox.classList.remove("hidden");
}
//Math expression Object, insert input element in format {value, type} where
//value is user input and type can be number, operator, unaryOpe, openPara and closePara
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
//Global variables for current input, depending on user logic will determine and
//split input to different types, goal is to make valid math expression and don't let user to
//input invalid math syntax
let value = "";
let type = "";
//Display current elements in expression object, number is spacial case. It can be
//multi more then 1 character log. So we input it to expression only if other types
//are pressed.
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
    if (value === "-" && char === "0") value = ""; //Edge case for -0
    //Number.MAX_SAFE_INTEGER is better way but for siplicity
    if (value.length >= 15) return creatAlertMsg("To big number");
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
  //Guard clause between number and open para must be operator
  //Number is not yet added to expression object
  if (type === "number") return;
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
    return;
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
  display.textContent = `0`;
  removeAlert();
}

function calcMathExpression() {
  //Special case if last input is number
  if (type === "number") addElementToExpression();
  //Check is paras close and is last element number and last para
  if (expression.countParas !== 0)
    return creatAlertMsg("unbalance parentheses");
  if (expression.lastType() === "operator")
    return creatAlertMsg("expression ending with operator");
  //Calculate expression
  const temp = infixToPostfix(expression.elements);
  const result = evaluatePostfix(temp.queue);
  if (result === Infinity || result === -Infinity) {
    creatAlertMsg("Zero Division Error");
    display.textContent = result;
    return;
  }
  expression.elements = [];
  value = `${result}`; //Transform to string, numbers are only needed in postfix evaluation
  type = "number";
  addElementAndDisplay();
  //Display result
  //Prepare state for new input
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
//Keyboard input
window.addEventListener("keydown", function (e) {
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
    enterNumber(e.key);
  }
  if (["+", "-", "*", "/"].includes(e.key)) {
    e.key === "*" ? enterOperator("x") : enterOperator(e.key);
  }
  if (e.key === ".") enterFloat(e.key);
  if (e.key === "Enter") calcMathExpression();
  if (e.key === "Backspace") deleteChar();
  if (e.key === "Delete") resetCalculator();
  if (e.keyCode === 56 && e.shiftKey) enterOpenPara("(");
  if (e.keyCode === 57 && e.shiftKey) enterClosePara(")");
  if (e.key === "Escape") removeAlert();
});
