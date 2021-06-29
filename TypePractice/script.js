const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
var button = document.getElementById("newQuote");


let wrong = false

button.onclick = function() {
  renderNewQuote()
  wrong = false
}

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  wrong = false
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
    if (characterSpan.className === 'incorrect') {
      wrong = true
    }
  })
  if (correct) renderNewQuote()
})

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
      .then(res => res.json())
      .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerText = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    if (characterSpan.innerText === '’') {
      characterSpan.innerText = '\''
    } else if (characterSpan.innerText === '…') {
      renderNewQuote()
      return
    }
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
  
  startTimer()
  startWPM()
}

let startTime
function startTimer() {
  timerElement.innerText = 0
  startTime = new Date()
  setInterval(() => {
    timer.innerText = getTimerTime()
  }, 1000)
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

function startWPM() {
  wpmElement.innerText = '0 WPM'
  setInterval(() => {
    var numWords = quoteDisplayElement.innerText.split(' ').length
    var correctWords = quoteInputElement.value.split(' ').length - 1
    if (getTimerTime() >= 1) {
      var wpm = Math.round(correctWords*1.0 / (getTimerTime()*1.0 / 60))
    } else {
      wpm = 0
    }
    if (!wrong) {
      wpmElement.innerText = wpm + ' WPM'
    } else {
      wpmElement.innerText = 'Incorrect character(s)'
    }
  }, 250)
}

renderNewQuote()
