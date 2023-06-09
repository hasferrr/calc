// @ts-check
const container = document.createElement('div');
const SCALE = 1.15;
const WIDTH = 290 * SCALE;
const HEIGHT = 560 * SCALE;

let operator;
let operandLeft;
let operandRight;

document.querySelector('#main')?.appendChild(container);
container.classList.add('container');
container.style.width = WIDTH + 'px';
container.style.height = HEIGHT + 'px';

displayCalculatorScreen();
displayButton();
roundButton();
displayButtonText();
displayCalculationText();
addClassButton();

enableClickToAssignNumber();
enableClickToAssignOperator();
enableEvaluate();
enableDeleteButton();
enableClearButton();


function displayCalculatorScreen() {
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
    button.style.width = WIDTH / 4 + 'px';
    button.style.height = HEIGHT * 0.625 / 5 + 'px';

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

function displayButtonText() {
    const symbol = [
        'AC', '/', 'x', 'DEL',
        '7', '8', '9', '%',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '', '0', '.', '='];
    const buttons = container.querySelectorAll('.button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].textContent = symbol[i];
    }
}

function displayCalculationText() {
    const display = document.querySelector('.display');
    const calculations = document.createElement('div');
    const result = document.createElement('div');
    const box = document.createElement('div');

    //@ts-ignore
    const DISPLAY_HEIGHT = Number(display.style.height.slice(0, -2)); //remove 'px'

    calculations.classList.add('calculations');
    result.classList.add('result');

    let height = 80;
    let width = WIDTH / SCALE - 35;

    box.style.height = `${20 * SCALE}px`;
    calculations.style.height = `${DISPLAY_HEIGHT - height * SCALE}px`;
    result.style.height = `${height * SCALE}px`;

    calculations.style.width = `${width * SCALE}px`;
    result.style.width = `${width * SCALE}px`;

    calculations.style.fontSize = `${18 * SCALE}px`;
    result.style.fontSize = `${42 * SCALE}px`;

    calculations.textContent = '13 x 15';
    result.textContent = '650';

    // Append to .display
    display?.appendChild(box);
    display?.appendChild(calculations);
    display?.appendChild(result);
    display?.appendChild(box.cloneNode(true));
}


function addClassButton() {
    const classWishList = [
        ['btn-ac', 'btn-div', 'btn-mult', 'btn-del'],
        ['btn-7', 'btn-8', 'btn-9', 'btn-percent'],
        ['btn-4', 'btn-5', 'btn-6', 'btn-sub'],
        ['btn-1', 'btn-2', 'btn-3', 'btn-add'],
        ['', 'btn-0', 'btn-dot', 'btn-equal']
    ];

    const rows = container.querySelectorAll('.row');

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let buttons = row.querySelectorAll('.button');

        for (let j = 0; j < buttons.length; j++) {
            let button = buttons[j];
            button.classList.add(classWishList[i][j]);
        }
    }
}

function enableClickToAssignNumber() { }
function enableClickToAssignOperator() { }
function enableEvaluate() { }
function enableDeleteButton() { }
function enableClearButton() { }


/**
 * @param {(arg0: number, arg1: number) => number} operator
 * @param {number} a
 * @param {number} b
 */
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