// Linked List
function Node(data) {
    this.data = data;
    this.next = null;
}

// Stack implemented using LinkedList
function Stack() {
    this.top = null;
}

Stack.prototype.push = function (data) {
    var newNode = new Node(data);

    newNode.next = this.top; //Special attention
    this.top = newNode;
}

Stack.prototype.pop = function () {
    if (this.top !== null) {
        var topItem = this.top.data;
        this.top = this.top.next;
        return topItem;
    }
    return null;
}

Stack.prototype.print = function () {
    var curr = this.top;
    while (curr) {
        console.log(curr.data);
        curr = curr.next;
    }
}

// var stack = new Stack();
// stack.push(3);
// stack.push(5);
// stack.push(7);
// stack.print();

// Queue implemented using LinkedList
function Queue() {
    this.head = null;
    this.tail = null;
    this.eleCount = 0;
    this.maxCount = 16
}

Queue.prototype.enqueue = function (data) {
    var newNode = new Node(data);

    if (this.eleCount >= this.maxCount) {
        this.dequeue()
    }

    if (this.head === null) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        this.tail.next = newNode;
        this.tail = newNode;
    }
    this.eleCount++;
}

Queue.prototype.dequeue = function () {
    var newNode;
    if (this.head !== null) {
        newNode = this.head.data;
        this.head = this.head.next;
    }
    return newNode;
}

Queue.prototype.print = function () {
    var curr = this.head;
    while (curr) {
        console.log(curr.data);
        curr = curr.next;
    }
}

Queue.prototype.iterate = function (fn) {
    var curr = this.head;
    while (curr) {
        fn(curr.data)
        curr = curr.next;
    }
}

