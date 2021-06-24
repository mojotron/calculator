"use strict";
//DOM Selectors
const numbers = document.querySelectorAll(".btn-number");
const operators = document.querySelectorAll(".btn-operator");
const floatPoint = document.querySelector(".btn-dot");
const openPara = document.querySelector(".btn-open-parentheses");
const closePara = document.querySelector(".btn-close-parentheses");
const changeSign = document.querySelector(".btn-change-sign");
const display = document.querySelector(".display");
const equal = document.querySelector(".btn-equal");

function updateDisplay(event) {
  display.textContent += event.target.textContent;
}
function removeDot() {
  if (display.textContent.slice(-1) === ".") {
    display.textContent = display.textContent.slice(0, -1);
  }
}
//Global Variables
//numberFlag and dotFlag are used for creating float point number
let numberFlag = false;
let dotFlag = true;
let negationFlag = false;
//As inserting math formula chop it and insert elements to inputs array
//there are 4 types: number, operator, openPara, closePara
let inputs = [];
let paraCounter = 0;
//Global currentType and current Value are used for logic when to insert input to inputs
let currentType = "";
let currentValue = "";
for (let num of numbers) {
  num.addEventListener("click", function (e) {
    if (currentType !== "number" && !numberFlag && currentValue !== "")
      inputs.push(currentValue);
    if (
      currentType === "" ||
      currentType === "operator" ||
      currentType === "openPara" ||
      currentType === "number"
    ) {
      if (currentType !== "number") currentValue = "";
      if (negationFlag) {
        currentValue = "-";
        negationFlag = false;
      }
      numberFlag = true;
      currentType = "number";
      currentValue += e.target.textContent;
      updateDisplay(e);
    }
  });
}
floatPoint.addEventListener("click", function (e) {
  if (numberFlag && dotFlag) {
    currentValue += e.target.textContent;
    updateDisplay(e);
    dotFlag = false;
  }
});

for (let ope of operators) {
  ope.addEventListener("click", function (e) {
    if (currentValue !== "" && currentType !== "operator")
      inputs.push(currentValue);
    numberFlag = false;
    dotFlag = true;

    if (e.target.textContent === "-") {
      if (currentValue === "" || currentType === "openPara") {
        negationFlag = true;
        updateDisplay(e);
        currentValue = ""; //For bug with inputing double open para in -(-num) then currentValue !== "" in num check
      }
    }
    if (currentType === "number" || currentType === "closePara") {
      currentType = "operator";
      currentValue = e.target.textContent;
      removeDot();
      updateDisplay(e);
      return;
    }
  });
}

openPara.addEventListener("click", function (e) {
  if (currentValue !== "") inputs.push(currentValue);
  if (negationFlag) {
    inputs.push("-");
    negationFlag = false;
  }
  numberFlag = false;
  dotFlag = true;
  if (
    currentType === "" ||
    currentType === "operator" ||
    currentType === "openPara" ||
    display.textContent === "-"
  ) {
    paraCounter += 1;
    currentType = "openPara";
    currentValue = e.target.textContent;
    updateDisplay(e);
    return;
  }
});

closePara.addEventListener("click", function (e) {
  if (paraCounter === 0) return;
  if (currentValue !== "") inputs.push(currentValue);
  numberFlag = false;
  dotFlag = true;

  if (currentType === "number" || currentType === "closePara") {
    paraCounter -= 1;

    currentType = "closePara";
    currentValue = e.target.textContent;
    updateDisplay(e);
    return;
  }
});

equal.addEventListener("click", function () {
  if (currentValue !== "") inputs.push(currentValue);
  alert(display.textContent);
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
