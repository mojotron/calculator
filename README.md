# Simple Calculator

The goal of this project was to build a simple calculator without using eval() method.
The calculator must have a classic structure with display and input buttons. User has
the possibility to enter input by mouse and/or keyboard.
Instead of making a calculator that evaluates expression after every entered
operator, I decided to make an expression calculator. User enters full expression
and calculate it. After realizing that user can input any expression, I wanted to
limit user for inputting invalid syntax. Entering input this way was the biggest
problem from this project. After making a table with what expression elements can go
after or before one another, it was easy to program the logic. Making it this way, it
simplified using calculate algorithm by a lot.

Until using object for storing elements of expression, I had a lot of bugs and
problems using string to store expression. Expression object is formatted and
can go directly to Shunting-yard algorithm (infix to postfix notation) this way.
This project was at times hard but gave me lot of opportunities to research and
learn.

This project is part of [The Odin Project](https://www.theodinproject.com)
Curriculum. This was a challenging project, but fun with a lot of parts and
opportunities for learning.

View live preview of [Simple Expression Calculator](https://mojotron.github.io/calculator/index.html) project via GitHub pages!

## What I have learned:

- Body background - background-image() and linear-gradient() functions combo for
  beautiful visual effect.
- Css Grid - custom display with grid-column and grid-row starting/ending
  points and minmax() function.
- JS Object - after using string for handling data input, and countless bugs it
  produced, making object with helper methods made formatting user input much
  easier to handle.
- JS Class - in couple of places there was need for stacks and queues so making
  instances of these data structures was a perfect way to go.
- Stack and Queue data structures - simple implementation of stack and queue
  data structure with arrays.
- Shunting-yard algorithm - math expression is written in infix notation, and
  with research how to evaluate math expression I found that postfix expression
  is one of the best ways to go. The first version was to handle only numbers and
  operators. After that I made an implementation for handling parentheses. Finally,
  an implementation of unary minus operator. This at the end was very easy because
  there was only one condition to evaluate unary minus, before open parentheses
  at the beginning of the input. Other condition are handled as user inputs data.
- Postfix evaluation - using stack data structure. Every time you reach the operator,
  two numbers pop from stack and are calculated based on the operator, then result
  returns to stack. If operator is unary, one number pops, the operator applies and
  returns it to stack. Repeat until no operators are left in expression.
- Recursion - in deleteLastChar() function I found out that it is great to use
  recursion. When number is stored in expression object and user wants to delete
  that number, first it pops from number and stores it back to global current value
  and calls method recursively to remove last character from number.
- Keyboard event listeners- how to input data using keyboard. Entering
  parentheses was the trickiest. Before learning about event.shiftKey property, I
  made global variable with boolean value for tracking if the shift key is pressed
  down and then used two event listeners onkeydown and onkeyup that changed
  variable to true/false value.
