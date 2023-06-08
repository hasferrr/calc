// @ts-check
const container = document.createElement('div');
document.querySelector('#main')?.appendChild(container);

const WIDTH = 280 * 1.1;
const HEIGHT = 560 * 1.1;

let operator;
let operandLeft;
let operandRight;

container.className = 'container';
container.style.width = WIDTH + 'px';
container.style.height = HEIGHT + 'px';

displayCalculatorDisplay();
displayButton();
roundButton();

function displayCalculatorDisplay() {
    const display = document.createElement('div');
    display.className = 'display';
    display.style.width = WIDTH + 'px';
    display.style.height = HEIGHT * (1 - 0.625) + 'px';

    container.appendChild(display.cloneNode(true));
}

function displayButton() {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.width = WIDTH + 'px';
    row.style.height = HEIGHT * 0.625 / 5 + 'px';

    const button = document.createElement('div')
    button.className = 'button';
    button.style.width = WIDTH / 4 - 2 + 'px';
    button.style.height = HEIGHT * 0.625 / 5 - 2 + 'px';

    for (let i = 0; i < 4; i++) {
        row.appendChild(button.cloneNode(true));
    }

    for (let i = 0; i < 5; i++) {
        container.appendChild(row.cloneNode(true));
    }
}

function roundButton() {
    const lastRow = container.lastElementChild;
    // @ts-ignore
    lastRow.firstElementChild.style.borderBottomLeftRadius = '30px';
    // @ts-ignore
    lastRow.lastElementChild.style.borderBottomRightRadius = '30px';
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