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
    "squared": (a) => a * a,
    "backspace": backspace,
    "clear": clear,
    "equal": equal,
};


const calculator = {
    currentCalculation : [],
    currentNumber : 0,
    repeatCalculation : [],
    zeroDivision : false,
    'display' : document.querySelector('.display'),
    'currentOperator' : null,
    'lastPressed' : null, // Use to track if a number or operation was pressed
}

function operate(operator, first, second) {
    let result = operations[operator](first, second);
    if (calculator.zeroDivision) {
        calculator.zeroDivision = false;
        updateDisplay(0);
        return;
    } 
    updateDisplay(result);
    return result;
}

function equal(arr) {
    calculator.currentNumber = operate(arr[1], arr[0], arr[2]);
    // Store the last calculation details with the current number as the first operand so we can use in case user presses equals multiple times
    if (calculator.currentCalculation.length !== 0) calculator.repeatCalculation = calculator.currentCalculation.slice();
    calculator.repeatCalculation[0] = calculator.currentNumber;
    calculator.currentCalculation = [];
}

function backspace() {
    let str = calculator.display.textContent;
    if (str.length === 1) str = 0;
    else str = str.substring(0, str.length - 1);
    calculator.display.textContent = str;
    calculator.currentNumber = +str;
}

function clear() {
    calculator.display.textContent = 0;
    calculator.currentCalculation = [];
    calculator.repeatCalculation = [];
    calculator.currentNumber = 0;
}

function updateDisplay(value) {
    // When we have part of a number, allow this number to be built up into a multi-digit number
    // If the last pressed button was an operator, we skip and build a new value
    if (calculator.display.textContent != 0 && !isNaN(calculator.lastPressed)) {
        calculator.display.textContent += value;
    }
    else {
        calculator.display.textContent = Number(Number(value).toFixed(30));
    }
    calculator.currentNumber = +calculator.display.textContent;
}

function addBtnListeners() {
    setupNumberBtnListeners();
    setupOperationBtnListeners();
}

function setupNumberBtnListeners() {
    let elementsArr = document.querySelectorAll('.btn.number');
    elementsArr.forEach(function(element) {
    element.addEventListener('click', (event) => {
        updateDisplay(element.textContent)
        calculator.lastPressed = element.textContent;
        })
    })
}

function setupOperationBtnListeners() {
    let elementsArr = document.querySelectorAll('.btn.operation');
    elementsArr.forEach(function(element) {
        element.addEventListener('click', (event) => {

            calculator.lastPressed = element.id;

            switch (element.id) {
                case 'clear':
                case 'backspace':
                    operations[element.id]();
                    break;
                case 'squared':
                    calculator.display.textContent = operations[element.id](calculator.currentNumber);
                    calculator.currentNumber = +calculator.display.textContent;
                    break;
                case 'equal':
                    if (calculator.currentOperator === 'equal') {
                        equal(calculator.repeatCalculation);
                        break;
                    }
                    calculator.currentCalculation.push(calculator.currentNumber);
                    equal(calculator.currentCalculation);
                    calculator.currentOperator = element.id;
                    break;
                default:
                    // Account for cases where multiple operations might be pressed in a row
                    if (calculator.currentCalculation.length === 2) {
                        calculator.currentCalculation[1] = element.id;
                        break;
                    }
                    calculator.currentCalculation.push(calculator.currentNumber);
                    calculator.currentOperator = element.id;
                    calculator.currentCalculation.push(element.id);
            }
        })
    })
}


addBtnListeners();