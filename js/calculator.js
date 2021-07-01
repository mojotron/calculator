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
//10 + 3 * 5 / (16 - 4)
//-(3+5)-(1+2)
//-(-(3+5)-(1+2))
//-(-(3+5)/2-(4-(9/6+3)))
let temp = [
  { value: "-", type: "unaryOpe" },
  { value: "(", type: "openPara" },
  { value: "-", type: "unaryOpe" },
  { value: "(", type: "openPara" },
  { value: "3", type: "number" },
  { value: "+", type: "operator" },
  { value: "5", type: "number" },
  { value: ")", type: "closePara" },
  { value: "/", type: "operator" },
  { value: "2", type: "number" },
  { value: "-", type: "operator" },
  { value: "(", type: "openPara" },
  { value: "4", type: "number" },
  { value: "-", type: "operator" },
  { value: "(", type: "openPara" },
  { value: "9", type: "number" },
  { value: "/", type: "operator" },
  { value: "6", type: "number" },
  { value: "+", type: "operator" },
  { value: "3", type: "number" },
  { value: ")", type: "closePara" },
  { value: ")", type: "closePara" },
  { value: ")", type: "closePara" },
];

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
const test = infixToPostfix(temp);
console.log(test.queue);
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
console.log(evaluatePostfix(test.queue));
