// @ts-check
const container = document.createElement('div');
document.body.appendChild(container);
console.log(document)

const WIDTH = 280;
const HEIGHT = 560;

let operator;
let operandLeft;
let operandRight;

container.id = 'container';
container.style.width = WIDTH + 'px';
container.style.height = HEIGHT + 'px';

displayCalculatorDisplay();
displayButton();

function displayCalculatorDisplay() {
    const display = document.createElement('div');
    display.classList.add('display');
    display.style.width = WIDTH + 'px';
    display.style.height = HEIGHT * (1 - 0.625) + 'px';

    container.appendChild(display.cloneNode(true));
}

function displayButton() {
    const row = document.createElement('div');
    row.classList.add('row');
    row.style.width = WIDTH + 'px';
    row.style.height = HEIGHT * 0.625 / 5 + 'px';

    const button = document.createElement('div')
    button.classList.add('button');
    button.style.width = WIDTH + 'px';
    button.style.height = HEIGHT * 0.625 / 5 + 'px';

    for (let i = 0; i < 4; i++) {
        row.appendChild(button.cloneNode(true));
    }

    for (let i = 0; i < 5; i++) {
        container.appendChild(row.cloneNode(true));
    }
}

function operate(operator, a, b) {
    return operator(a, b)
}

function add(a, b) {
    return a + b
}


function subtract(a, b) {
    return a - b
}


function multiply(a, b) {
    return a * b
}


function divide(a, b) {
    return a / b
}