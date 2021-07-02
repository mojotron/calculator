"use strict";
class Queue {
  constructor() {
    this.queue = [];
  }
  isEmpty() {
    return this.queue.length === 0;
  }
  enqueue(value) {
    this.queue.push(value);
    return this.queue.length;
  }
  dequeue() {
    return this.queue.shift();
  }
}
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
    return this.stack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
}

function operatorPrecedence(operator) {
  if (operator.value === "x" || operator.value === "/") return 2;
  if (operator.value === "+" || operator.value === "-") return 1;
}

function comparePrecedence(a, b) {
  return operatorPrecedence(a) >= operatorPrecedence(b);
}
// Shunting-yard algorithm
function infixToPostfix(expression) {
  const queueDS = new Queue();
  const stackDS = new Stack();
  expression.forEach(function (element) {
    //Number and open para goes directly to queue
    if (element.type === "number") {
      queueDS.enqueue(element);
      //Open para goes directly to stack
    } else if (element.type === "openPara") {
      stackDS.push(element);
      //Close para - enqueue all from stack until you reach open para
    } else if (element.type === "closePara") {
      while (stackDS.top().type !== "openPara") queueDS.enqueue(stackDS.pop());
      stackDS.pop(); //Remove open para from stack
      //Unary - has higher precedence then other operators, directly psh to stack
    } else if (element.type === "unaryOpe") {
      stackDS.push(element);
      //Operator if stack is empty push directly to stack else compare precedence
    } else if (element.type === "operator") {
      //if stack is empty push directly to stack
      if (stackDS.isEmpty()) stackDS.push(element);
      //if stack is not empty, compare top op the stack and current operator
      //for all operator that have higher or equal precedence on the top, move
      //them to queue and after that push current operator to stack, including
      //unary -
      else {
        //If precedence higher or equal pop and enqueue
        while (
          !stackDS.isEmpty() &&
          comparePrecedence(stackDS.top(), element)
        ) {
          queueDS.enqueue(stackDS.pop());
        }
        stackDS.push(element);
      }
    }
  });
  //Enqueue leftover operators from stack
  while (!stackDS.isEmpty()) queueDS.enqueue(stackDS.pop());
  return queueDS;
}

function doMath(a, b, operator) {
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "x") return a * b;
  if (operator === "/") return a / b;
}

function evaluatePostfix(expression) {
  const numbers = new Stack();
  expression.forEach(function (element) {
    //If element is number push value converted from string to number
    if (element.type === "number") numbers.push(+element.value);
    //If element is operator pop last 2 numbers do operation with
    //them end add result to stack
    if (element.type === "operator") {
      const num2 = numbers.pop();
      const num1 = numbers.pop();
      numbers.push(doMath(num1, num2, element.value));
    }
    //if element is unary operator multiply top with -1
    if (element.type === "unaryOpe") numbers.push(numbers.pop() * -1);
  });
  return numbers;
}
////////////////////////////////
const numbers = document.querySelectorAll(".btn-number");
const operators = document.querySelectorAll(".btn-operator");
const display = document.querySelector(".display");
const floatPoint = document.querySelector(".btn-dot");
const openPara = document.querySelector(".btn-open-parentheses");
const closePara = document.querySelector(".btn-close-parentheses");
const equal = document.querySelector(".btn-equal");
const deleteChar = document.querySelector(".btn-del-one");
const reset = document.querySelector(".btn-del-all");
//Alert box
const alertBox = document.querySelector(".alert-box");
const alertBtn = document.querySelector(".btn-close-alert");
const alertMsg = document.querySelector(".alert-msg");

alertBtn.addEventListener("click", () => alertBox.classList.add("hidden"));

function creatAlertMsg(msg) {
  alertMsg.textContent = msg;
  alertBox.classList.remove("hidden");
}
/////////////////

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
    return;
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

  const result = evaluatePostfix(temp.queue).top();
  if (result === Infinity || result === -Infinity) {
    creatAlertMsg("Zero Division Error");
    resetCalculator();
  }
  expression.elements = [];
  value = result;
  type = "number";
  addElementAndDisplay();
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
  display.textContent = "0";
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
