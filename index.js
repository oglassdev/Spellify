let wordCount = 1;
let words = [];
let ttsSupported = false;
if ('speechSynthesis' in window) ttsSupported = true;
else console.log("Your browser does not support text to speech :(");

function newTextbox() {
    let main = document.getElementById("main-screen");
    if (wordCount == 10) {
        playShakeAnimation(document.getElementById("newWordButton"));
        return;
    }
    let button = null;
    for (const element of main.elements) {
        if (element.tagName == "BUTTON") {
            button = element;
            break;
        }
    }
    const input = document.createElement("input");
    input.classList.add("textbox");
    input.type = "text";
    
    insertBefore(button,input);
    insertBefore(button,document.createElement("br"));
    insertBefore(button,document.createElement("br"));
    wordCount++;
    return input;
}
function newAnimatedTextbox() {
    const animation = [
        { transform: 'translateX(-50px)', opacity: 0 },
        { transform: 'translateX(0px)', opacity: 1 }
    ];
    const timing = {
        easing: 'cubic-bezier(.05,.63,.46,1)',
        duration: 750,
        iterations: 1,
    }
    newTextbox().animate(animation, timing);
}
function clearTextboxes() {
    const main = document.getElementById("main-screen");
    words = [];
    if (wordCount == 1) {
        playShakeAnimation(document.getElementById("clearButton"));
        return;
    }
    var inputs = main.getElementsByTagName('input');
    while (inputs.length) {
        inputs[0].parentNode.removeChild(inputs[0]);
    }
    var brs = main.getElementsByTagName('br');
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }
    words = [];
    wordCount = 0;
    newTextbox();
}
function submitWords() {
    const main = document.getElementById("main-screen");
    words = [];
    for (const element of main.elements) {
        if (element.tagName == "INPUT" && element.value.length > 0) {
            words.push(element.value);
        }
    }
    if (words.length == 0) {
        playShakeAnimation(document.getElementById("submitButton"));
        return;
    }
    changeWindow(main,document.getElementById("spell-screen"),600,40);
}
function newSpellbox(word) {
    let main = document.getElementById("spell-screen");
    let placeBefore = null;
    for (const element of main.elements) {
        if (element.tagName == "BUTTON" || !element.hasChildNodes()) {
            placeBefore = element;
            break;
        }
    }
    const input = document.createElement("input");
    input.classList.add("spellbox");
    input.spellcheck = false;
    input.type = "text";
    insertBefore(placeBefore,input);
    if (ttsSupported) {
        const button = document.createElement("button");
        button.classList.add("button");
        button.setAttribute("word",word);
        button.type = "button";
        const icon = document.createElement("i");
        button.classList.add("fa-solid");
        button.classList.add("fa-volume-high");
        button.onclick = () => {
            sayWord(word);
        };
        button.append(icon);
        insertBefore(placeBefore,button);
    }
    insertBefore(placeBefore,document.createElement("br"));
    insertBefore(placeBefore,document.createElement("br"));
}
function clearSpellboxes() {
    let main = document.getElementById("spell-screen");
    var brs = main.getElementsByTagName('input');
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }
    var buttons = main.getElementsByTagName('button');
    while (buttons.length > 2) {
        buttons[0].parentNode.removeChild(buttons[0]);
    }
    var brs = main.getElementsByTagName('br');
    while (brs.length) {
        brs[0].parentNode.removeChild(brs[0]);
    }
}
function checkSpelling() {
    const main = document.getElementById("spell-screen");
    var inputs = main.getElementsByTagName('input');
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        if (element.value == words[index]) element.style.backgroundColor = "#aaffaa";
        else element.style.backgroundColor = "#ffaaaa";
    }
}
function backToMain() {
    const spell = document.getElementById("spell-screen");
    wordCount = 2;
    clearTextboxes();
    words = [];
    changeWindow(spell,document.getElementById("main-screen"),600,-40);
}
function insertBefore(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
function playShakeAnimation(element) {
    const animation = [
        { transform: 'translateX(0)'},
        { transform: 'translateX(5px)'},
        { transform: 'translateX(-5px)'},
        { transform: 'translateX(5px)'},
        { transform: 'translateX(-5px)'},
        { transform: 'translateX(0)'},
        { transform: 'translateX(0)'},
    ];
    const timing = {
        easing: 'cubic-bezier(.05,.63,.46,1)',
        duration: 750,
        iterations: 1,
    }
    element.animate(animation,timing);
}
function sayWord(word) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = word;
    window.speechSynthesis.speak(msg);
}
function changeWindow(startElement,endElement,duration,translate) {
    const animation = [
        { transform: 'translateX(0)' },
        { transform: `translateX(${translate}px)` }
    ];
    const timing = {
        easing: 'cubic-bezier(.05,.63,.46,1)',
        duration: duration,
        iterations: 1,
    }
    startElement.animate(animation, timing);
    setTimeout(() => {
        clearSpellboxes();
        for (let index = 0; index < words.length; index++) {
            newSpellbox(words[index]);
        }
        startElement.style.display = "none";
        endElement.style.display = "block";
        const animation = [
            { transform: `translateX(${-1 * translate}px)` },
            { transform: 'translateX(0)' }
        ];
        endElement.animate(animation, timing);
    },duration/8);
}