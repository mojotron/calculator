# Simple Calculator

Goal of this project was to build simple calculator without using eval method.
Calculator must have structure that give user possibility to enter input by mouse and keyboard.
Instead of making calculator that evaluates expression after every entered operator,
I decided to make expression calculator. User inputs full expression and calculate
it. After realaising that user can input invalid syntax I wanted to limit user for
inputting invalid syntax. Entering input this way was biggest problem from this project. After making table what expression elements can go after or before one another. It was easy to program logic. Making it this way it simplifidy using calculate algoritham by a lot.

Until using object for storing elements of expression I had a lot of bug and problems using string to store expression. Expression object is formatted and can go diractly to
Shunting-yard algorithm (infix to postfix notation) this way.
This project was at times hard but gave me lot oportunities for research and learn.

This project is part of [The Odin Project](https://www.theodinproject.com) Curriculum. This was a challenging project, but fun with a lot of parts and opportunities for learning.

View live preview of [Simple Expression Calculator](https://mojotron.github.io/calculator/index.html) project via GitHub pages!

## What I have learned:

- Body background - background-image() and linear-gradient() functions combo for beautiful visual effect.
- Css Grid - custom display with grid-column and grid-row starting/ending points. minmax() function.
- JS Object - after using string for handling data input, and countless bugs it produced.
  After several times refactoring code js object was easiest way to work with input.
- JS Class - in couple of places there was need for stacks and queues so making instances
  of thouse classes was perfect way to go.
- Stack and Queue data structures - simple implementation of stack and queue data structure
  with arrays. Making methods like stack.top() and queue.enqueue(value) it was much
  easier to work with input data.
- Shunting-yard algorithm - math expression is written in infix notation, and
  with research how to evaluate math expression i found that postfix expression is one of best ways to go. First version was to handle only numbers and operators. After that
  I made implementation for handling parentheses. Finally implementation of unary minus operator. This at the and was very easy because there was only one condition to evaluate unary minus, before open parentheses at the beginning of the input. Other condition are handled as user inputs data.
- Postfix evaluation - using stack data structure. Every time you reach operator.
  Pop two numbers from stack and calculate them based on operator, then result return to stack. In operator is unary pop one number, apply operator and return it to stack. Repeat until no
  operators are left in expression.
- User input
- Recursion - in deleteLastChar() function I found out that is perfect to use recursion.
  When number is stored in expression object and user what to delete that number. First
  pop it from number and store it back to global current value and call method recursivly to remove last character form number.
- Keyboard event listeners- how to input data using keyboard. Entering parentheses
  was trickiest. Before learning about event.shiftKey property, I made global variable
  with boolean value for tracking is the shift key pressed down and then used two event
  listeners onkeydown and onkeyup that changed variable to true/false value.
