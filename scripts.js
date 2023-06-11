// @ts-check

class Calculator {
    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        this.container = container;

        /** @type {string} */
        this.operator = '';
        /** @type {string} */
        this.typedNumber = '';

        /** @type {number | undefined} */
        this.operandLeft;
        /** @type {number | undefined} */
        this.operandRight;
        /** @type {number | undefined} */
        this.result;
    }

    static buttonClass = [
        ['btn-ac', 'AC'],
        ['btn-operator', '/'],
        ['btn-operator', 'x'],
        ['btn-del', 'DEL'],
        ['btn-num', '7'],
        ['btn-num', '8'],
        ['btn-num', '9'],
        ['btn-percentage', '%'],
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
        ['btn-dot', '.'],
        ['btn-equal', '=']
    ];
}

class DisplayCalculator extends Calculator {
    static SCALE = 1.15;
    static WIDTH = 290 * DisplayCalculator.SCALE;
    static HEIGHT = 560 * DisplayCalculator.SCALE;

    /**
     * @param {HTMLElement} container
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
            button.classList.add(Calculator.buttonClass[i][0]);
            button.dataset.value = Calculator.buttonClass[i][1];
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
            button.textContent = Calculator.buttonClass[i][1];
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

        // Styling: height, width, font-size
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

    static displayNumber(text, resultField) {
        if (text === '') {
            text = '0';
        }
        resultField.textContent = text;
    }

    static displayCalculation(a, b, operator, calculationField) {
        calculationField.textContent = `${a} ${operator} ${b}`;
    }

    static displayClear(calculationField, resultField) {
        calculationField.textContent = '';
        resultField.textContent = '0';
    }
}

class Functionality extends Calculator {
    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        super(container);
        this.buttons = this.container.querySelectorAll('button');
        this.resetTyping = false;
        this.justClickOperate = false;
    }

    calculate(a, b) {
        if (this.operator === '+') {
            this.result = a + b;
        } else if (this.operator === '-') {
            this.result = a - b;
        } else if (this.operator === 'x') {
            this.result = a * b;
        } else if (this.operator === '/') {
            if (b === 0) {
                this.result = undefined;
                return;
            }
            this.result = a / b;
        }
    }
}

class EventHandler extends Functionality {
    /**
     * @param {string} value
     */
    _handleAssignNumber(value) {
        if ((!Number(this.typedNumber) || this.resetTyping) && this.typedNumber !== '0.') {
            this.typedNumber = value;
            this.resetTyping = false;
        } else {
            this.typedNumber = this.typedNumber + value; //append string
            this.resetTyping = false;
        }
    }

    /**
     * @param {string} value
     */
    _handleOperator(value, calculationField, resultField) {
        if (!this.justClickOperate) {
            this.operandLeft = Number(this.typedNumber);
            this.operandRight = undefined;
            this.operator = value;
            this.resetTyping = true;
            this.typedNumber = '';
            this.justClickOperate = true;
        }
    }

    _handleEqualButton(calculationField, resultField) {
        if (this.typedNumber !== '' && this.operator !== '' && this.operandLeft !== undefined) {

            if (this.operandRight === undefined) {
                /**
                 * copy typedNumber to operandRight
                 */
                this.operandRight = Number(this.typedNumber);

            } else if (this.operandRight !== undefined) {
                /**
                 * this case is used when user click '=' for the second or more times
                 * it will calculate the previous result to the previous operandRight
                 *
                 * take the previous result (which is typeNumber)
                 * copy it to operandLeft
                 */
                this.operandLeft = Number(this.typedNumber);
            }
            /**
             * calculate operator(this.operandLeft, this.operandRight)
             * store the result into this.result
             * copy this.result to this.typedNumber
             */
            this.calculate(this.operandLeft, this.operandRight);

            if (this.result === undefined) {
                DisplayCalculator.displayCalculation('', '', '', calculationField);
                DisplayCalculator.displayNumber('Boom.', resultField);
                this._handleAC();
                return;
            }

            DisplayCalculator.displayCalculation(this.operandLeft, this.operandRight,
                this.operator, calculationField);
            DisplayCalculator.displayNumber(this.result, resultField);

            this.typedNumber = String(this.result);

            this.justClickOperate = false;
        }
    }

    _handleAC() {
        this.typedNumber = '';
        this.operator = '';
        this.operandLeft = undefined;
        this.operandRight = undefined;
        this.result = 0;
        this.resetTyping = false;
        this.justClickOperate = false;
    }

    _handleDEL() {
        this.typedNumber = this.typedNumber.slice(0, -1);
        if (this.typedNumber === '') {
            this.typedNumber = '0';
        }
    }

    _handlePercentage() {
        this.typedNumber = String(Number(this.typedNumber) / 100);
    }

    _handleDot() {
        if (!this.typedNumber.includes('.')) {
            this.typedNumber = this.typedNumber + '.';
        }
    }
}

class AbstractEventWrapper extends EventHandler { }

class OnClickEvents extends AbstractEventWrapper {
    enableClickButton() {
        this.buttons.forEach(button => {

            /** @type {string} */
            let value = '';
            if (button.dataset.value !== undefined) {
                value = button.dataset.value;
            }

            let calculationField = this.container.querySelector('.calculations');
            let resultField = this.container.querySelector('.result');

            if (button.classList.contains('btn-num')) {
                button.addEventListener('click', () => {
                    this._handleAssignNumber(value)
                    DisplayCalculator.displayNumber(this.typedNumber, resultField);
                })

            } else if (button.classList.contains('btn-operator')) {
                button.addEventListener('click', () => {
                    this._handleOperator(value, calculationField, resultField)
                    DisplayCalculator.displayNumber(this.typedNumber, resultField);
                    DisplayCalculator.displayCalculation(this.operandLeft, '',
                        this.operator, calculationField);
                })

            } else if (button.classList.contains('btn-equal')) {
                button.addEventListener('click', () => {
                    this._handleEqualButton(calculationField, resultField);
                })

            } else if (button.classList.contains('btn-ac')) {
                button.addEventListener('click', () => {
                    this._handleAC();
                    DisplayCalculator.displayClear(calculationField, resultField);
                })

            } else if (button.classList.contains('btn-del')) {
                button.addEventListener('click', () => {
                    this._handleDEL();
                    DisplayCalculator.displayNumber(this.typedNumber, resultField);
                })

            } else if (button.classList.contains('btn-percentage')) {
                button.addEventListener('click', () => {
                    this._handlePercentage();
                    DisplayCalculator.displayNumber(this.typedNumber, resultField);
                })

            } else if (button.classList.contains('btn-dot')) {
                button.addEventListener('click', () => {
                    this._handleDot();
                    DisplayCalculator.displayNumber(this.typedNumber, resultField);
                })
            }
        })
    }
}

class KeyboardEvents extends AbstractEventWrapper { }

let calculator; //@ts-ignore
calculator = new DisplayCalculator(document.querySelector('.container'));
calculator.displayCalculatorScreen();
calculator.displayButton();
calculator.displayButtonText();
calculator.displayCalculationText();

calculator = new OnClickEvents(calculator.container);
calculator.enableClickButton();