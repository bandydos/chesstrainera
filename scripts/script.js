$(document).ready(() => {
    const btnStart = $('#btn-start');
    const btnOpen = $('#btn-open');
    const inputFile = $('#input-file');
    const tableMoves = $('#table-moves');
    const btnReset = $('#btn-reset');

    const pgnfile = inputFile[0].files[0];
    tableMoves.hide();
    btnReset.hide();

    btnOpen.click(() => {
        inputFile.click();
    })
    inputFile.change(() => {
        console.log(pgnfile)
    })
    btnStart.click(() => {
        readData();
    })
    btnReset.click(() => {
        clearTimeout(timer);
        $('#table-moves tbody tr').remove();
        showElems(false);
    })
});
// let timer;

const readData = () => {
    const spanMessage = $('#span-message');
    const tableMoves = $('#table-moves');
    const moves = seperateMoves();
    const valid = isValid();
    const intervalSpeed = getIntervalSpeed();
    showElems(valid);
    clearTimeout(timer);
    $('#table-moves tbody tr').remove();
    if (valid === true) {
        for (let i = 0; i < moves.length; i++) {
            iterationLevel(i, intervalSpeed);
        }
    } else {
        clearTimeout(timer);
        spanMessage.text('Something went wrong, check input please.');
    }
}

const speech = () => {

    let text = 'hello';
    let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-TR&client=tw-ob&q=${text}`;
}

var timer;
var iterator = 0;
// Iterate over moves with delay.
const iterationLevel = (i, interval) => {
    const moves = seperateMoves();
    timer = setTimeout(() => {
        $('#tbody-moves').append(`<tr><td>${i + 1}</td><td>${getFull(moves[i])}</td></tr>`);

        

    }, interval * i);
    if (i >= moves.length) {
        clearTimeout(timer);
        i = 0;
    }
}

const isValid = () => {
    const moves = seperateMoves();
    let valid;
    for (let i = 0; i < moves.length; i++) {
        if (/^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[NBRQK])?(\+|#)?$|^O-O(-O)?$/.test(moves[i])) {
            valid = true;
        } else {
            return false;
        }
    }
    return valid;
}

const showElems = (valid) => {
    const spanMessage = $('#span-message');
    const tableMoves = $('#table-moves');
    //const tableRows = $('#table-moves tbody tr'); 
    const divLabels = $('#div-labels');
    const divInput = $('#div-input');
    const btnReset = $('#btn-reset');
    if (valid === true) {
        divLabels.hide();
        divInput.hide();
        spanMessage.hide();
        tableMoves.show();
        btnReset.show();
    } else {
        divLabels.show();
        divInput.show();
        spanMessage.show();
        tableMoves.hide();
        btnReset.hide();
    }
}

// Get moves per number e.g. 1.d4 d5 2.nf3 nc6
// => [["d4", "d5"]["nf3", "nc6"]].
const splittedPerMove = () => {
    const inputMoves = document.getElementById('input-moves').value;
    const splittedMoves = inputMoves.split('\.'); // Splitting by dots.
    let allmoves = [];
    // Start from pos 1 (because of splitting by dots).
    for (let i = 1; i < splittedMoves.length; i++) {
        let onemove = splittedMoves[i].split(' ');
        onemove.pop();
        onemove.join(' ');
        allmoves.push(onemove);
    }
    return allmoves;
}

// Get seperate moves e.g. 1.d4 d5 2.nf3 nc6
// => ["d4", "d5", "nf3", "nc6"].
const seperateMoves = () => {
    const movesnr = splittedPerMove();
    const seperateMoves = [];
    for (let i = 0; i < movesnr.length; i++) {
        for (let j = 0; j < movesnr[i].length; j++) {
            seperateMoves.push(movesnr[i][j]);
        }
    }
    return seperateMoves;
}

// Get interval speed.
const getIntervalSpeed = () => {
    const selectedVal = $('#select-level').val();
    let interval;
    if (selectedVal === 's') interval = 6000;
    if (selectedVal === 'm') interval = 4000;
    if (selectedVal === 'f') interval = 1000;
    return interval;
}

const getFull = (move) => {
    return move.replace('N', ' knight ').replace('B', ' bishop ')
    .replace('R', ' rook ').replace('Q', ' queen ').replace('K', ' king ')
    .replace('x', ' takes ').replace('+', ' check ');
}
