// @ts-check
class Calculator {
    /**
     * @param {Element} container
     */
    constructor(container) {
        this.container = container;
    }
}

class DisplayCalculator extends Calculator {
    static SCALE = 1.15;
    static WIDTH = 290 * DisplayCalculator.SCALE;
    static HEIGHT = 560 * DisplayCalculator.SCALE;

    /**
     * @param {HTMLDivElement} container
     */
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

        const button = document.createElement('div')
        button.classList.add('button');
        button.style.width = DisplayCalculator.WIDTH / 4 + 'px';
        button.style.height = DisplayCalculator.HEIGHT * 0.625 / 5 + 'px';

        for (let i = 0; i < 4; i++) {
            row.appendChild(button.cloneNode(true));
        }

        for (let i = 0; i < 5; i++) {
            this.container.appendChild(row.cloneNode(true));
        }

        this.#addClassButton();
        this.#roundButton();
    }

    #addClassButton() {
        const classWishList = [
            ['btn-ac', 'btn-div', 'btn-mult', 'btn-del'],
            ['btn-7', 'btn-8', 'btn-9', 'btn-percent'],
            ['btn-4', 'btn-5', 'btn-6', 'btn-sub'],
            ['btn-1', 'btn-2', 'btn-3', 'btn-add'],
            ['btn-empty', 'btn-0', 'btn-dot', 'btn-equal']
        ];

        const rows = this.container.querySelectorAll('.row');

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let buttons = row.querySelectorAll('.button');

            for (let j = 0; j < buttons.length; j++) {
                let button = buttons[j];
                button.classList.add(classWishList[i][j]);
            }
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
        const symbol = [
            'AC', '/', 'x', 'DEL',
            '7', '8', '9', '%',
            '4', '5', '6', '-',
            '1', '2', '3', '+',
            '', '0', '.', '='];
        const buttons = this.container.querySelectorAll('.button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].textContent = symbol[i];
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
        let width = DisplayCalculator.WIDTH / DisplayCalculator.SCALE - 35;

        box.style.height = 20 * DisplayCalculator.SCALE + 'px';
        calculations.style.height = DISPLAY_HEIGHT - height * DisplayCalculator.SCALE + 'px';
        result.style.height = height * DisplayCalculator.SCALE + 'px';

        calculations.style.width = width * DisplayCalculator.SCALE + 'px';
        result.style.width = width * DisplayCalculator.SCALE + 'px';

        calculations.style.fontSize = 18 * DisplayCalculator.SCALE + 'px';
        result.style.fontSize = 42 * DisplayCalculator.SCALE + 'px';

        calculations.textContent = '13 x 15';
        result.textContent = '650';

        // Append to .display
        display?.appendChild(box);
        display?.appendChild(calculations);
        display?.appendChild(result);
        display?.appendChild(box.cloneNode(true));
    }
}

class Functionality extends Calculator {
    enableClickToAssignNumber() { }
    enableClickToAssignOperator() { }
    enableEvaluate() { }
    enableDeleteButton() { }
    enableClearButton() { }
}

class Operator extends Calculator {
    /**
     * @param {(arg0: number, arg1: number) => number} operator
     * @param {number} a
     * @param {number} b
     */
    operate(operator, a, b) {
        return operator(a, b)
    }

    add(a, b) {
        return a + b
    }

    subtract(a, b) {
        return a - b
    }

    multiply(a, b) {
        return a * b
    }

    divide(a, b) {
        return a / b
    }
}

//@ts-ignore
const calc = new DisplayCalculator(document.querySelector('.container'));

calc.displayCalculatorScreen();
calc.displayButton();
calc.displayButtonText();
calc.displayCalculationText();
