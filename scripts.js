// @ts-check
class Calculator {
    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        this.container = container;

        /** @type {string | undefined} */
        this.operator = undefined;

        /** @type {string | undefined}*/
        this.result = undefined;

        this.operandLeft = 0;
        this.operandRight = 0;
        this.reset = false;
    }
}

class DisplayCalculator extends Calculator {
    static SCALE = 1.15;
    static WIDTH = 290 * DisplayCalculator.SCALE;
    static HEIGHT = 560 * DisplayCalculator.SCALE;
    static buttonClass = [
        ['btn-tool', 'AC'],
        ['btn-operator', '/'],
        ['btn-operator', 'x'],
        ['btn-tool', 'DEL'],
        ['btn-num', '7'],
        ['btn-num', '8'],
        ['btn-num', '9'],
        ['btn-changenum', '%'],
        ['btn-num', '4'],
        ['btn-num', '5'],
        ['btn-num', '6'],
        ['btn-operator', '-'],
        ['btn-num', '1'],
        ['btn-num', '2'],
        ['btn-num', '3'],
        ['btn-operator', '+'],
        ['btn-empty', ''],
        ['btn-num', '0'],
        ['btn-changenum', '.'],
        ['btn-equal', '=']
    ];

    constructor(container) {
        super(container);
        container.style.width = DisplayCalculator.WIDTH + 'px';
        container.style.height = DisplayCalculator.HEIGHT + 'px';
    }

    displayCalculatorScreen() {
        const display = document.createElement('div');
        display.classList.add('display');
        display.style.width = DisplayCalculator.WIDTH + 'px';
        display.style.height = DisplayCalculator.HEIGHT * (1 - 0.625) + 'px';

        this.container.appendChild(display.cloneNode(true));
    }

    displayButton() {
        const row = document.createElement('div');
        row.classList.add('row');
        row.style.width = DisplayCalculator.WIDTH + 'px';
        row.style.height = DisplayCalculator.HEIGHT * 0.625 / 5 + 'px';

        const button = document.createElement('button')
        button.style.width = DisplayCalculator.WIDTH / 4 + 'px';
        button.style.height = DisplayCalculator.HEIGHT * 0.625 / 5 + 'px';

        for (let i = 0; i < 4; i++) {
            row.appendChild(button.cloneNode(true));
        }

        for (let i = 0; i < 5; i++) {
            this.container.appendChild(row.cloneNode(true));
        }

        this.#addClassAndDataAttrButton();
        this.#roundButton();
    }

    #addClassAndDataAttrButton() {
        const buttons = this.container.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            button.classList.add(DisplayCalculator.buttonClass[i][0]);
            button.dataset.value = DisplayCalculator.buttonClass[i][1];
        }
    }

    #roundButton() {
        const lastRow = this.container.lastElementChild;
        // @ts-ignore
        lastRow.firstElementChild.style.borderBottomLeftRadius = '30px';
        // @ts-ignore
        lastRow.lastElementChild.style.borderBottomRightRadius = '30px';
    }

    displayButtonText() {
        const buttons = this.container.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            button.textContent = DisplayCalculator.buttonClass[i][1];
        }
    }

    displayCalculationText() {
        const display = document.querySelector('.display');
        const calculations = document.createElement('div');
        const result = document.createElement('div');
        const box = document.createElement('div');

        //@ts-ignore
        const DISPLAY_HEIGHT = Number(display.style.height.slice(0, -2)); //remove 'px'

        calculations.classList.add('calculations');
        result.classList.add('result');

        let height = 80;
        let width = DisplayCalculator.WIDTH / DisplayCalculator.SCALE - 30;

        box.style.height = 20 * DisplayCalculator.SCALE + 'px';
        calculations.style.height = DISPLAY_HEIGHT - height * DisplayCalculator.SCALE + 'px';
        result.style.height = height * DisplayCalculator.SCALE + 'px';

        calculations.style.width = width * DisplayCalculator.SCALE + 'px';
        result.style.width = width * DisplayCalculator.SCALE + 'px';

        calculations.style.fontSize = 18 * DisplayCalculator.SCALE + 'px';
        result.style.fontSize = 42 * DisplayCalculator.SCALE + 'px';

        result.textContent = '0';

        // Append to .display
        display?.appendChild(box);
        display?.appendChild(calculations);
        display?.appendChild(result);
        display?.appendChild(box.cloneNode(true));
    }
}

class Functionality extends Calculator {
    constructor(container) {
        super(container);
        this.buttons = this.container.querySelectorAll('button');
    }

    enableClickToAssign() {
        this.buttons.forEach(button => {
            let value = button.dataset.value;
            let calculationField = this.container.querySelector('.calculations');
            let resultField = this.container.querySelector('.result');

            if (button.classList.contains('btn-num')) {
                button.addEventListener('click', () => {
                    this.#handleAssignNumber(value, resultField)
                })

            } else if (button.classList.contains('btn-operator')) {
                button.addEventListener('click', () => {
                    this.#handleAssignOperator(value, calculationField)
                })

            } else if (button.classList.contains('btn-equal')) {
                button.addEventListener('click', () => {
                    this.#handleEqualButton(resultField, calculationField)
                })

            } else if (button.classList.contains('btn-tool')) {

            } else if (button.classList.contains('btn-changenum')) {

            }

        })
    }

    #handleAssignNumber(value, resultField) {
        if (!Number(this.result) || this.reset) {
            this.result = value;
            this.reset = false;
        } else {
            this.result = this.result + value; //append string
            this.reset = false;
        }

        resultField.textContent = this.result;
    }

    #handleAssignOperator(value, calculationField) {
        this.operandLeft = Number(this.result);
        this.operator = value;
        this.reset = true;

        calculationField.textContent = `${this.operandLeft} ${this.operator}`;
    }

    #handleEqualButton(resultField, calculationField) {
        if (this.result, this.operator, this.operandLeft !== undefined) {
            this.operandRight = Number(this.result);

            if (this.operator === '+') {
                this.#operate(Operator.add);
            } else if (this.operator === '-') {
                this.#operate(Operator.subtract);
            } else if (this.operator === 'x') {
                this.#operate(Operator.multiply);
            } else if (this.operator === '/') {
                this.#operate(Operator.divide);
            }

            calculationField.textContent = `${this.operandLeft} ${this.operator} ${this.operandRight}`;
            resultField.textContent = this.result;
        }
    }

    #operate(func) {
        this.result = String(func(this.operandLeft, this.operandRight));
    }
}

class Operator {
    static add(a, b) {
        return a + b
    }

    static subtract(a, b) {
        return a - b
    }

    static multiply(a, b) {
        return a * b
    }

    static divide(a, b) {
        return a / b
    }
}


let calc;
calc = new DisplayCalculator(document.querySelector('.container'));

calc.displayCalculatorScreen();
calc.displayButton();
calc.displayButtonText();
calc.displayCalculationText();

calc = new Functionality(calc.container);
calc.enableClickToAssign();