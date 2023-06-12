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
    static CALCULATION_FONT_SIZE = 18 * DisplayCalculator.SCALE;
    static RESULT_FONT_SIZE = 38 * DisplayCalculator.SCALE;

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

        //@ts-ignore
        const DISPLAY_HEIGHT = Number(display.style.height.slice(0, -2)); //remove 'px'

        calculations.classList.add('calculations');
        result.classList.add('result');

        // Styling: height, width, font-size
        let height = 80;
        let width = DisplayCalculator.WIDTH / DisplayCalculator.SCALE - 30;

        calculations.style.height = DISPLAY_HEIGHT - height * DisplayCalculator.SCALE + 'px';
        result.style.height = height * DisplayCalculator.SCALE + 'px';

        calculations.style.width = width * DisplayCalculator.SCALE + 'px';
        result.style.width = width * DisplayCalculator.SCALE + 'px';

        calculations.style.fontSize = DisplayCalculator.CALCULATION_FONT_SIZE + 'px';
        result.style.fontSize = DisplayCalculator.RESULT_FONT_SIZE + 'px';

        calculations.style.marginTop = 20 * DisplayCalculator.SCALE + 'px';
        result.style.marginBottom = 20 * DisplayCalculator.SCALE + 'px';

        result.textContent = '0';

        // Append to .display
        display?.appendChild(calculations);
        display?.appendChild(result);
    }

    /**
     * @param {string | undefined} text
     */
    static displayNumber(text, resultField) {
        if (!text) {
            text = '0';
        }
        if (text.length > 15) {
            resultField.style.fontSize = DisplayCalculator.RESULT_FONT_SIZE * 0.5 + 'px'
        } else if (text.length > 9) {
            resultField.style.fontSize = DisplayCalculator.RESULT_FONT_SIZE * 0.7 + 'px'
        } else {
            resultField.style.fontSize = DisplayCalculator.RESULT_FONT_SIZE + 'px'
        }
        resultField.textContent = text;
    }

    static displayCalculation(a, b, operator, calculationField) {
        calculationField.textContent = `${a} ${operator} ${b}`;
    }

    static displayClear(calculationField, resultField) {
        resultField.style.fontSize = DisplayCalculator.RESULT_FONT_SIZE + 'px'
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

    /**
     * @param {number} a
     * @param {number} b
     */
    calculate(a, b) {
        if (this.operator === '+') this.result = a + b
        else if (this.operator === '-') this.result = a - b
        else if (this.operator === 'x' || this.operator === '*') this.result = a * b
        else if (this.operator === '/') {
            if (b === 0) {
                this.result = undefined;
                return;
            }
            this.result = a / b
        }
    }
}

class EventHandler extends Functionality {
    constructor(container) {
        super(container)
        this.calculationField = this.container.querySelector('.calculations');
        this.resultField = this.container.querySelector('.result');
    }
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
        DisplayCalculator.displayNumber(this.typedNumber, this.resultField);
    }

    /**
     * @param {string} value
     */
    _handleOperator(value) {
        if (this.operandLeft !== undefined && this.typedNumber !== '' && this.justClickOperate) {
            /**
             * Sometimes user want to calculate without clicking '=' button
             * and directly press another operator button.
             * In that case, we will calculate first before jump into the new operator state
             */
            this.calculate(Number(this.operandLeft), Number(this.typedNumber))
            if (this.isInfinity()) {
                return;
            }
            this.operator = value;
            this.operandLeft = this.result;
            this.operandRight = undefined;
            this.resetTyping = true;
            this.typedNumber = '';
            this.result = 0;
        } else {
            this.operator = value;
            if (!this.justClickOperate) {
                this.operandLeft = Number(this.typedNumber);
                this.operandRight = undefined;
                this.resetTyping = true;
                this.typedNumber = '';
                this.justClickOperate = true;
            }
        }
        DisplayCalculator.displayNumber(this.typedNumber, this.resultField);
        DisplayCalculator.displayCalculation(this.operandLeft, '',
            this.operator, this.calculationField);
    }

    _handleEqualButton() {
        if (this.typedNumber !== '' && this.operator !== '' && this.operandLeft !== undefined) {

            if (this.operandRight === undefined) {
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
            if (this.isInfinity()) {
                return;
            }

            DisplayCalculator.displayCalculation(this.operandLeft, this.operandRight,
                this.operator, this.calculationField);
            DisplayCalculator.displayNumber(String(this.result), this.resultField);

            this.typedNumber = String(this.result);

            this.justClickOperate = false;
        }
    }

    isInfinity() {
        // Any Infinity (i mean undefined) value (including Zero Division)
        if (this.result === undefined) {
            this._handleAC();
            DisplayCalculator.displayCalculation('', '', '', this.calculationField);
            DisplayCalculator.displayNumber('Boom.', this.resultField);
            return 1;
        }
        return 0;
    }

    _handleAC() {
        this.typedNumber = '';
        this.operator = '';
        this.operandLeft = undefined;
        this.operandRight = undefined;
        this.result = 0;
        this.resetTyping = false;
        this.justClickOperate = false;
        DisplayCalculator.displayClear(this.calculationField, this.resultField);
    }

    _handleDEL() {
        this.typedNumber = this.typedNumber.slice(0, -1);
        if (this.typedNumber === '') {
            this.typedNumber = '0';
        }
        DisplayCalculator.displayNumber(this.typedNumber, this.resultField);
    }

    _handlePercentage() {
        this.typedNumber = String(Number(this.typedNumber) / 100);
        DisplayCalculator.displayNumber(this.typedNumber, this.resultField);
    }

    _handleDot() {
        if (!this.typedNumber.includes('.')) {
            this.typedNumber = this.typedNumber + '.';
        }
        DisplayCalculator.displayNumber(this.typedNumber, this.resultField);
    }
}

class EventListener extends EventHandler {
    enableClickButton() {
        this.buttons.forEach(button => {

            /** @type {string} */
            let value = '';
            if (button.dataset.value !== undefined) {
                value = button.dataset.value;
            }

            if (button.classList.contains('btn-num')) {
                button.addEventListener('click', () => this._handleAssignNumber(value))

            } else if (button.classList.contains('btn-operator')) {
                button.addEventListener('click', () => this._handleOperator(value))

            } else if (button.classList.contains('btn-equal')) {
                button.addEventListener('click', () => this._handleEqualButton())

            } else if (button.classList.contains('btn-ac')) {
                button.addEventListener('click', () => this._handleAC())

            } else if (button.classList.contains('btn-del')) {
                button.addEventListener('click', () => this._handleDEL())

            } else if (button.classList.contains('btn-percentage')) {
                button.addEventListener('click', () => this._handlePercentage())

            } else if (button.classList.contains('btn-dot')) {
                button.addEventListener('click', () => this._handleDot())
            }
        })
    }

    enableKeyboardListener() {
        window.addEventListener('keydown', keydown => {
            if (!Number.isNaN(Number(keydown.key))) this._handleAssignNumber(keydown.key)
            else if (keydown.key === '.') this._handleDot()
            else if (keydown.key === '=' || keydown.key === 'Enter') this._handleEqualButton()
            else if (keydown.key === 'Backspace') this._handleDEL()
            else if (keydown.key === 'Escape') this._handleAC()
            else if (keydown.key === '+'
                || keydown.key === '-'
                || keydown.key === '*'
                || keydown.key === 'x'
                || keydown.key === '/') {
                this._handleOperator(keydown.key)
            }
        })
    }
}

let calculator; //@ts-ignore
calculator = new DisplayCalculator(document.querySelector('.container'));
calculator.displayCalculatorScreen();
calculator.displayButton();
calculator.displayButtonText();
calculator.displayCalculationText();

calculator = new EventListener(calculator.container);
calculator.enableClickButton();
calculator.enableKeyboardListener();
