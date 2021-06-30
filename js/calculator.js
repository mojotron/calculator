"use strict";
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
    return this.stack[this.stack.length - 1];
  },
};
//10 + 3 * 5 / (16 - 4)
//-(3+5)-(1+2)
//-(-(3+5)-(1+2))
let temp = [
  { value: "-", type: "unaryOpe" },
  { value: "(", type: "openPara" },
  { value: "-", type: "unaryOpe" },
  { value: "(", type: "openPara" },
  { value: "3", type: "number" },
  { value: "+", type: "operator" },
  { value: "5", type: "number" },
  { value: ")", type: "closePara" },
  { value: "-", type: "operator" },
  { value: "(", type: "openPara" },
  { value: "1", type: "number" },
  { value: "+", type: "operator" },
  { value: "2", type: "number" },
  { value: ")", type: "closePara" },
  { value: ")", type: "closePara" },
  // { value: "/", type: "operator" },
  // { value: "5", type: "number" },
];

function operatorPrecedence(operator) {
  if (operator.value === "+" || operator.value === "-") return 1;
  if (operator.value === "x" || operator.value === "/") return 2;
  if (operator.type === "unaryOpe") return 3;
}

function comparePrecedence(a, b) {
  return operatorPrecedence(a) >= operatorPrecedence(b);
}
// Shunting-yard algorithm
function infixToPostfix(expression) {
  expression.forEach(function (element) {
    //Number and open para goes directly to queue
    if (element.type === "number") {
      queueDS.enqueue(element);
      //Open para goes directly to stack
    } else if (element.type === "openPara") {
      stackDS.push(element);
      //Close para - enqueue all from stack until you reach open para
    } else if (element.type === "closePara") {
      while (stackDS.top().type !== "openPara") {
        queueDS.enqueue(stackDS.pop());
      }
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
}
infixToPostfix(temp);
//unary opr if in evaulation 1 operand and 1 operator make calculation
