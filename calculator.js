const operations = {
    "add": (a, b) => Number(a) + Number(b),
    "subtract": (a, b) => a - b,
    "multiply": (a, b) => a * b,
    "divide": function divide(a, b) {
        if (a === undefined) a = 0;
        if (Number(b) === 0) {
            alert("Dividing by zero is banned");
            calculator.zeroDivision = true;
            clear();
            return;
        } else {
            return a / b;
        }
    },
    "backspace": backspace,
    "clear": clear,
};

const calculator = {
    zeroDivision : false,
    newEntry : true,
    firstNumber : null,
    secondNumber : null,
    currentOperator : null,
    lastClick : null,
    repeatCalculation : [],
    actions : [],
    display : document.querySelector('.display'),
}

function operate(operator, first, second) {
    let result = operations[operator](first, second);
    if (calculator.zeroDivision) {
        calculator.zeroDivision = false;
        updateDisplay(0);
        return;
    } 
    updateDisplay(result);
    calculator.firstNumber = result;
    calculator.secondNumber = null;
    calculator.repeatCalculation[0] = operator;
    calculator.repeatCalculation[1] = result;
    calculator.repeatCalculation[2] = second;
}

function backspace() {
    let str = String(getDisplayText());
    if (str.length === 1) str = 0;
    else str = str.substring(0, str.length - 1);
    setDisplayText(str);
}

function clear() {
    setDisplayText(0);
    calculator.firstNumber = null;
    calculator.secondNumber = null;
    calculator.currentOperator = null;
    calculator.lastClick = null;
    calculator.newEntry = true;
    calculator.repeatCalculation = [];
    calculator.actions = [];
}

function getDisplayText() {
    return calculator.display.textContent;
}

function setDisplayText(text) {
    calculator.display.textContent = text;
}

function updateDisplay(value) {
    if (calculator.newEntry === false) {
        setDisplayText(`${getDisplayText()}${value}`);
    }
    else {
        setDisplayText(Number(Number(value).toFixed(15)));
    }
}

function setupNumberBtnListeners() {
    let elementsArr = document.querySelectorAll('.btn.number');
    elementsArr.forEach(function(element) {
    element.addEventListener('click', (event) => {
        updateDisplay(element.textContent)
        calculator.newEntry = false;
        calculator.lastClick = element.id;
        })
    })
}

function setupDecimalListener() {
    let element = document.querySelector('.btn.decimal');
    element.addEventListener('click', (event) => {
        let temp = Array.from(getDisplayText());
        if (temp.includes('.')) {
            return;
        }
        if (getDisplayText() === '0') {
            updateDisplay(`.`)
            return;
        }
        updateDisplay(element.textContent);
    })
}

function setupOperationBtnListeners() {
    let elementsArr = document.querySelectorAll('.btn.operation');
    elementsArr.forEach(function(element) {
        element.addEventListener('click', (event) => {
            calculator.newEntry = true;
            switch (element.id) {
                case 'clear':
                case 'backspace':
                    operations[element.id]();
                    break;
                case 'squared':
                    calculator.firstNumber = getDisplayText();
                    operate('multiply', calculator.firstNumber, calculator.firstNumber);
                    calculator.lastClick = element.id;
                    break;
                case 'equal':
                    // Consecutive equals are pressed
                    if (calculator.actions[calculator.actions.length - 1] === 'equal') {
                        operate(calculator.repeatCalculation[0], calculator.repeatCalculation[1], calculator.repeatCalculation[2]);
                        calculator.actions.push(element.id);
                        calculator.lastClick = element.id;
                        break;
                    }
                    
                    if (calculator.firstNumber === null) {
                        getDisplayText();
                        if (!calculator.currentOperator) {
                            // Do nothing if no number or operator entered
                            return;
                        }
                    } else {
                        // If a single number and operator are pressed (e.g. 3 +) - use first as second
                        calculator.secondNumber = getDisplayText();
                        operate(calculator.currentOperator, calculator.firstNumber, calculator.secondNumber);
                    }
                    calculator.actions.push(element.id);
                    calculator.lastClick = element.id;
                    break;
                default:
                    calculator.currentOperator = element.id;
                    // Chain operations
                    if (calculator.firstNumber && 
                        calculator.actions[calculator.actions.length - 1] !== 'equal' && 
                        !isNaN(calculator.lastClick)
                    ) {
                        calculator.secondNumber = getDisplayText();
                        operate(calculator.actions[calculator.actions.length - 1], calculator.firstNumber, calculator.secondNumber);
                        calculator.actions.push(element.id);
                        calculator.lastClick = element.id;
                        break;
                    }
                    // Consecutive operations pressed
                    if (
                        calculator.secondNumber === null &&
                        calculator.actions[calculator.actions.length - 1] !== 'equal' &&
                        calculator.actions[calculator.actions.length - 1] !== undefined
                    ) {
                        calculator.actions[calculator.actions.length - 1] = element.id;
                        calculator.actions.push(element.id);
                        calculator.lastClick = element.id;
                        break;
                    }
                    // Handles if an operator is pressed first
                    if (calculator.firstNumber === null) {
                        calculator.firstNumber = getDisplayText();
                    }    
                    calculator.actions.push(element.id);
                    calculator.lastClick = element.id;
            }
        })
    })
}

function addBtnListeners() {
    setupNumberBtnListeners();
    setupDecimalListener();
    setupOperationBtnListeners();
}

addBtnListeners();