"use strict";
//DOM Selectors
const numbers = document.querySelectorAll(".btn-number");
const operators = document.querySelectorAll(".btn-operator");
const display = document.querySelector(".display");
const floatPoint = document.querySelector(".btn-dot");
const openPara = document.querySelector(".btn-open-parentheses");
const closePara = document.querySelector(".btn-close-parentheses");
const equal = document.querySelector(".btn-equal");
// INPUT LOGIC - goal of this code is to stop user for
// inputting badly formatted math, by not allowing inputs
//(Example cant start with close para or multiple dots in float number )

let numberFlag = false;
let dotFlag = true;
let negationFlag = false;
let inputs = [];
let paraCounter = 0;
let currType = "";
let currValue = "";

const addInput = (value) => inputs.push(value);

function resetNumberAndDotFlag() {
  numberFlag = false;
  dotFlag = true;
}

function updateNumber(e) {
  currValue += e.target.textContent;
  updateDisplay(e);
}

function updateDisplay(event) {
  display.textContent += event.target.textContent;
}
function removeDot() {
  //When user enters . but no numbers after it, remove it from display
  if (display.textContent.slice(-1) === ".") {
    display.textContent = display.textContent.slice(0, -1);
  }
}

for (let num of numbers) {
  //Number is possible to enter if it is first char,after operator or open parentheses
  num.addEventListener("click", function (e) {
    if (["", "operator", "openPara", "number"].includes(currType)) {
      if (currType !== "number" && currValue !== "") addInput(currValue);
      if (currType !== "number") currValue = "";
      //For negative numbers
      if (negationFlag) {
        currValue = "-";
        negationFlag = false;
      }
      numberFlag = true;
      currType = "number";
      updateNumber(e);
    }
  });
}
floatPoint.addEventListener("click", function (e) {
  if (numberFlag && dotFlag) {
    updateNumber(e);
    dotFlag = false;
  }
});

for (let ope of operators) {
  // Operator is possible if after number or close parentheses
  ope.addEventListener("click", function (e) {
    if (currValue !== "" && currType !== "operator") addInput(currValue);
    resetNumberAndDotFlag();
    // Minus operator is used for indicating negative number or negating next parentheses
    if (e.target.textContent === "-") {
      if (currValue === "" || currType === "openPara") {
        if (!negationFlag) updateDisplay(e);
        negationFlag = true;
        currValue = ""; //For bug with inputing double open para in -(-num) then currValue !== "" in num check
        return;
      }
    }
    if (currType === "number" || currType === "closePara") {
      currType = "operator";
      currValue = e.target.textContent;
      removeDot();
      updateDisplay(e);
      return;
    }
  });
}

openPara.addEventListener("click", function (e) {
  //Open parentheses only if first char on screen, if it is after operator
  //or after another open parentheses
  if (negationFlag) {
    //two edge cases if minus is before or after
    addInput("-");
    negationFlag = false;
  }
  resetNumberAndDotFlag();
  if (
    ["", "operator", "openPara"].includes(currType) ||
    display.textContent === "-"
  ) {
    if (currValue !== "") addInput(currValue);
    paraCounter += 1;
    currType = "openPara";
    currValue = e.target.textContent;
    updateDisplay(e);
    return;
  }
});

closePara.addEventListener("click", function (e) {
  //Close parentheses is possible after the number or another close parentheses
  if (paraCounter === 0) return;
  if (currType === "number" || currType === "closePara") {
    if (currValue !== "") addInput(currValue);
    paraCounter -= 1;
    currType = "closePara";
    currValue = e.target.textContent;
    updateDisplay(e);
    return;
  }
});

equal.addEventListener("click", function () {
  if (currValue !== "") addInput(currValue);
  const result = eval(display.textContent);
  display.textContent = result;
  currType = "number";
  currValue = result;
  inputs = [];
});

//Solve math with infix expression
class Stack {
  constructor() {
    this.stack = [];
  }
  isEmpty() {
    return this.stack.length === 0;
  }
  push(value) {
    this.stack.push(value);
    return this.stack.length;
  }
  pop() {
    if (this.isEmpty()) return null;
    return this.stack.pop();
  }
  top() {
    if (this.isEmpty()) return null;
    return this.stack[this.stack.length - 1];
  }
}

/////const
expression = {
  elements: [],
  countParas: 0,
  insert: function (value, type) {
    this.elements.push({ value, type });
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
};

let value = "";
let type = "";

function addElementToExpression() {
  expression.insert(value, type);
  value = "";
  type = "";
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
  }
}

function enterFloat(char) {
  //only if current type is number and if is negative must be numbers after -
  if (type === "number" && value !== "-") {
    if (value.includes(".")) return; //Gourd clause if number is already float
    value += ".";
  }
}

function enterOperator(char) {
  //Special case for making negative number
  if (char === "-" && value === "") {
    if (expression.isEmpty() || expression.lastType() === "openPara") {
      if (value[0] === "-" && type === "number") return; //Gourd clause if number is already negative
      value += "-";
      type = "number";
      return;
    }
  }
  //Special case of inserting because of possibility of crating negative numbers
  if (type === "number") addElementToExpression();
  if (
    expression.lastType() === "number" ||
    expression.lastType() === "closePara"
  ) {
    value = char;
    type = "operator";
    addElementToExpression();
  }
}
function enterOpenPara(char) {
  //Special case current value "-" and type "number" add it ass operator to expression
  if (value === "-" && type === "number") {
    type = "operator";
    addElementToExpression();
  }
  //
  if (
    expression.isEmpty() ||
    expression.lastType() === "operator" ||
    expression.lastType() === "openPara"
  ) {
    value = char;
    type = "openPara";
    expression.countParas++;
    addElementToExpression();
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
    addElementToExpression();
  }
}

function calcMathExpression() {}
function deleteLastChar() {}
function resetMathExpression() {}

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
