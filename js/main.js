"use strict";
//DOM Selectors
const buttons = document.querySelectorAll(".btn");
const display = document.querySelector(".display");
const equal = document.querySelector(".btn-equal");

//EVENT Handlers
for (let btn of buttons) {
  btn.addEventListener("click", function (e) {
    //format spaces for easier splitting
    const temp = display.textContent;
    if (e.target.textContent === "-" && temp === "") {
      display.textContent += e.target.textContent;
    } else if (e.target.classList.contains("btn-number")) {
      display.textContent += e.target.textContent;
    } else if (e.target.textContent === "-" && temp.slice(-2) === "( ") {
      display.textContent += e.target.textContent;
    } else if (e.target.textContent === ")") {
      display.textContent += " " + e.target.textContent;
    } else if (e.target.textContent === "(") {
      display.textContent += e.target.textContent + " ";
    } else {
      display.textContent += ` ${e.target.textContent} `;
    }
  });
}

equal.addEventListener("click", function () {
  console.log(display.textContent);
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

const ex1 = "2 + 3 / 5";
const operands = new Stack();
const operators = new Stack();
for (let i = 0; i < ex1.length; i++) {}
