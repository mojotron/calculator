"use strict";
//DOM Selectors
const numbers = document.querySelectorAll(".btn-number");
const operators = document.querySelectorAll(".btn-operator");
const floatPoint = document.querySelector(".btn-dot");
const openPara = document.querySelector(".btn-open-parentheses");
const closePara = document.querySelector(".btn-close-parentheses");
const display = document.querySelector(".display");
const equal = document.querySelector(".btn-equal");
//GET NUMBER INPUT
function updateDisplay(event) {
  display.textContent += event.target.textContent;
}
function removeDot() {
  if (display.textContent.slice(-1) === ".") {
    display.textContent = display.textContent.slice(0, -1);
  }
}
//HELPER FUNCTIONS
let numberFlag = false;
let dotFlag = true;
let inputs = [];
let paraCounter = 0;
let currentType = "";
let currentValue = "";
for (let num of numbers) {
  num.addEventListener("click", function (e) {
    if (currentType !== "number") inputs.push(currentValue);
    if (
      currentType === "" ||
      currentType === "operator" ||
      currentType === "openPara" ||
      currentType === "number"
    ) {
      if (currentType !== "number") currentValue = "";
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
    inputs.push(currentValue);
    numberFlag = false;
    dotFlag = true;
    if (currentType === "number" || currentType === "closePara") {
      currentType = "operator";
      currentValue = e.target.textContent;
      removeDot();
      updateDisplay(e);
      return;
    }
    if (
      e.target.textContent === "-" &&
      (currentType === "" || currentType === "openPara")
    ) {
      currentType = "operator";
      currentValue = e.target.textContent;
      updateDisplay(e);
      return;
    }
  });
}

openPara.addEventListener("click", function (e) {
  inputs.push(currentValue);
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
  inputs.push(currentValue);
  numberFlag = false;
  dotFlag = true;
  if (paraCounter === 0) return;
  if (currentType === "number" || currentType === "closePara") {
    paraCounter -= 1;
    currentType = "closePara";
    currentValue = e.target.textContent;
    updateDisplay(e);
    return;
  }
});

equal.addEventListener("click", function () {
  if (currentType !== "") inputs.push(currentValue);
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
