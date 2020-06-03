$(document).ready(() => {
    const btnStart = $('#btn-start');
    const btnOpen = $('#btn-open');
    const inputFile = $('#input-file');
    const tableMoves = $('#table-moves');
    const btnReset = $('#btn-reset');

    //const pgnfile = inputFile[0].files[0];
    tableMoves.hide();
    btnReset.hide();

    btnOpen.click(() => {
        inputFile.click();
    })
    inputFile.change(() => {
        console.log(pgnfile)
    })
    btnStart.click(() => {
        console.log(parsedMoves())
        readData();
    })
    btnReset.click(() => {
        $('#table-moves tbody tr').remove();
        while (timers.length) clearTimeout(timers.shift())
        showElems(false);
    })
});


const readData = () => {
    const spanMessage = $('#span-message');
    const moves = parsedMoves();
    const valid = isValid();
    const intervalSpeed = getIntervalSpeed();
    showElems(valid);
    $('#table-moves tbody tr').remove();
    if (valid === true) {
        for (let i = 0; i < moves.length; i++) {
            iterationLevel(i, intervalSpeed);
        }
    } else {
        spanMessage.text('Something went wrong, check input please.');
    }
}

// const speech = () => {
//     let text = 'hello';
//     let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-TR&client=tw-ob&q=${text}`;
// }

var timers = [];

// Iterate over moves with delay.
const iterationLevel = (i, interval) => {
    const moves = parsedMoves();
    timers.push(setTimeout(() => {
        $('#tbody-moves').append(`<tr><td>${i + 1}</td><td>${getFull(moves[i])}</td></tr>`);
    }, interval * i));
    if (i >= moves.length) {
        clearTimeout(timers.pop());
        i = 0;
    }
}

// Validate.
const isValid = () => {
    const moves = parsedMoves();
    let valid;
    const regmove = /^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[NBRQK])?(\+|#)?$|^O-O(-O)?$/;
    const regscore = /^1-0$|^0-1$|^1\/2-1\/2$/;
    for (let i = 0; i < moves.length; i++) {
        if (regmove.test(moves[i]) || regscore.test(moves[i])) {
            valid = true;
        } else {
            return false;
        }
    }
    return valid;
}

// Parse PGN file to array of moves.
function parsedMoves() {
    const full = $('#input-pgn').val();
    const moves = full.substring(full.lastIndexOf(']') + 1);
    const splitted = moves.split(/\s/);
    const reg = /[0-9]+\./;
    const filtered = splitted.filter((x) => {
        return !reg.test(x) && x; // Filter out by regex + empty strings.
    });
    return filtered;
}

// Get interval speed.
const getIntervalSpeed = () => {
    const selectedVal = $('#select-level').val();
    let interval;
    if (selectedVal === 's') interval = 6000;
    if (selectedVal === 'm') interval = 4000;
    if (selectedVal === 'f') interval = 250;
    return interval;
}

// Get full name.
// Needs work => fix spaces befor words & double spaces.
const getFull = (move) => {
    return move.replace('N', ' knight ').replace('B', ' bishop ')
        .replace('R', ' rook ').replace('Q', ' queen ').replace('K', ' king ')
        .replace('x', ' takes ').replace('+', ' check ').replace('#', ' checkmate ');
}

// Specify elements to display when valid or invalid.
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