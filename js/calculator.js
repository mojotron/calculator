"use strict";
// Shunting-yard algorithm
//Make Stack
//Make Queue
const queueDS = {
  queue: [],
  isEmpty: function () {
    return this.queue.length === 0;
  },
  enqueue: function (value) {
    this.queue.push(value);
    return this.queue.length;
  },
  dequeue: function () {
    return this.queue.shift();
  },
};

const stackDS = {
  stack: [],
  isEmpty: function () {
    return this.stack.length === 0;
  },
  push: function (value) {
    this.stack.push(value);
    return this.stack.length;
  },
  pop: function () {
    return this.stack.pop();
  },
  top: function () {
    if (this.isEmpty()) return null;
    return this.stack[this.stack.length - 1];
  },
};

let temp = [
  { value: "3", type: "number" },
  { value: "+", type: "operator" },
  { value: "5", type: "number" },
  { value: "-", type: "operator" },
  { value: "6", type: "number" },
  { value: "x", type: "operator" },
  { value: "9", type: "number" },
  { value: "/", type: "operator" },
  { value: "5", type: "number" },
];

function operatorPrecedence(operator) {
  if (operator.value === "+" || operator.value === "-") return 1;
  if (operator.value === "x" || operator.value === "/") return 2;
  // if (operator.type === "unaryOpe") return 3;
  // if (operator.type === "openPara" || operator.type === "closePare") return 4;
}

function comparePrecedence(a, b) {
  return operatorPrecedence(a) > operatorPrecedence(b);
}

function infixToPostfix(expression) {
  expression.forEach(function (element) {
    //Number to queue
    if (element.type === "number") {
      queueDS.enqueue(element);
    } else if (element.type === "openPara") {
      stackDS.push(element);
    } else if (element.type === "closePara") {
      while (stackDS.pop().type !== "openPara") {
        queueDS.enqueue(stackDS.pop());
      }
    } else if (element.type === "unaryOpe") {
      queueDS.enqueue(element);
    } else if (element.type === "operator") {
      if (stackDS.isEmpty()) {
        stackDS.push(element);
        console.log(stackDS.stack);
      } else {
        console.log(stackDS.top(), element);
        if (comparePrecedence(stackDS.top(), element)) {
          console.log(`ITS GREATER`);
          queueDS.enqueue(stackDS.pop());
          stackDS.push(element);
        } else {
          stackDS.push(element);
        }
      }
    }
    //Open para to stack
    //Close para move all operators to queue until open para
    //Operator - check precedence if higher in stack move higher to queue and put current to stack
    //Unary operator directly to stack
    //Put all ramaing stack element to queue
  });
  while (!stackDS.isEmpty()) {
    queueDS.enqueue(stackDS.pop());
  }
}
infixToPostfix(temp);
