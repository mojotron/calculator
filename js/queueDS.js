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
