var buffer = 0
var lastOperator = null
const display = document.querySelector("#display")
let isOperator = false
let isRunning = false
//functions related to display

function insert(input) {
  clearPressedButton()
  if (isOperator) display.innerText = 0
  isOperator = false
  let text = display.innerText
  text = text.replaceAll(",", "")

  if (text.length < 9 || (text.charAt(0) == "-" && text.length < 10)) {
    if (input == ".") {
      if (!text.includes(".")) text += input
    } else if (input == 0) {
      if (text != "0") text += input
    } else if (text == "0") {
      if (input == ".") text += input
      else text = input
    } else text += input
  }

  if (text.match(/[0-9]\.$/) != null) display.innerText = text
  else
    display.innerText = new Intl.NumberFormat("en", {
      maximumSignificantDigits: 9,
    }).format(text)
  updateClearButton()
}

function updateDisplay(inputText) {
  let number = Number(inputText)
  if (inputText.length > 9) {
    number = number.toExponential(4)
    display.innerText = number
    console.log("inside" + inputText)
  } else {
    display.innerText = new Intl.NumberFormat("en", {
      maximumSignificantDigits: 9,
    }).format(number)
    updateClearButton()
  }
}
function clear() {
  display.innerText = 0
  updateClearButton()
  turnOnActiveButton(lastOperator)
}
function updateClearButton() {
  const clearButton = document.querySelector("#clear")

  if (display.innerText == "0" || display.innerText == "-0")
    clearButton.innerText = "AC"
  else clearButton.innerText = "C"
}
function clearAll() {
  buffer = 0
  lastOperator = null
  isRunning = false
  isOperator = false
  clearPressedButton()
  clear()
}
//**************functions related to operators********************
const getEntry = function (event) {
  let text = display.innerText
  text = text.replaceAll(",", "")
  number = parseFloat(text)
  return number
}

function doOperation(operator, firstNumber, secondNumber) {
  if (operator == "+") return firstNumber + secondNumber
  else if (operator == "-") return firstNumber - secondNumber
  else if (operator == "×") return firstNumber * secondNumber
  else if (operator == "÷") return firstNumber / secondNumber
}
function clearPressedButton() {
  const button = document.querySelector(`.button[data-pressed= 
		'on']`)
  if (button != null) button.setAttribute("data-pressed", "off")
}
function turnOnActiveButton(op) {
  if (op != null) {
    const button = document.querySelector(`.button[data-op= 
		'${op}']`)
    button.setAttribute("data-pressed", "on")
  }
}
function buttonPress(button) {
  if (isOperator) {
    lastOperator = button.innerText
    isRunning = true
  } else {
    if (button.innerText == "=") {
      if (isRunning) {
        const secondNumber = getEntry()
        buffer = doOperation(lastOperator, buffer, secondNumber)
        updateDisplay(String(buffer))
        buffer = 0
        lastOperator = null
        isRunning = false
      }
    } else if (lastOperator == null) {
      buffer = getEntry()
      lastOperator = button.innerText
      isRunning = true
    } else if (lastOperator != null && isRunning) {
      const secondNumber = getEntry()
      buffer = doOperation(lastOperator, buffer, secondNumber)
      updateDisplay(String(buffer))
      lastOperator = button.innerText
    }
  }
  isOperator = true
  clearPressedButton()
  if (isRunning) turnOnActiveButton(lastOperator)
}

//***********functions related to modifiers*************
function toggleSign() {
  let text = display.innerText
  if (text.charAt(0) == "-") {
    text = text.replace("-", "")
    console.log(text)
    updateDisplay(text)
  } else {
    text = "-" + text
    updateDisplay(text)
  }
}
function percent() {
  let displayText = display.innerText
  let displayNumber = parseFloat(displayText.replaceAll(",", ""))
  displayNumber /= 100
  updateDisplay(String(displayNumber))
}

function doModify(element) {
  const modifier = element.innerText
  if (modifier == "±") toggleSign()
  if (modifier == "%") percent()
  if (modifier == "C") clear()
  if (modifier == "AC") clearAll()
}
/*=====================================*/
const appendEvent = (e) => insert(e.target.innerText)

const numberButtons = document.querySelectorAll(".button[data-type='number']")
numberButtons.forEach((but) => but.addEventListener("click", appendEvent))
const modifiers = document.querySelectorAll(".button[data-type='modifier']")
console.log(modifiers)
modifiers.forEach((mod) =>
  mod.addEventListener("click", (e) => doModify(e.target))
)
const operators = document.querySelectorAll(".button[data-type='operator']")
operators.forEach((op) =>
  op.addEventListener("click", (e) => buttonPress(e.target))
)
