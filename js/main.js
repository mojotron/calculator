"use strict";
//DOM Selectors
const buttons = document.querySelectorAll(".btn");
const display = document.querySelector(".display");

//EVENT Handlers
for (let btn of buttons) {
  btn.addEventListener("click", function (e) {
    display.textContent += e.target.textContent;
  });
}

//MATH FUNCTIONS
function findInnerParentheses() {}
