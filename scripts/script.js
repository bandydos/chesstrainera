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
        clearTimeout(timeout);
        showElems(false);
    })
});


async function readData() {
    const spanMessage = $('#span-message');
    const moves = parsedMoves();
    const valid = isValid();
    const tempo = getTempo();
    showElems(valid);
    $('#table-moves tbody tr').remove();
    if (valid === true) {
        for (let i = 0; i < moves.length; i++) {
            $('#tbody-moves').append(`<tr><td>${i + 1}</td><td>${getFull(moves[i])}</td></tr>`);
            await delay(tempo);
        }
    } else {
        spanMessage.text('Something went wrong, check input please.');
    }
}

var timeout;
function delay(ms) {
    return new Promise((x) => {
        timeout = setTimeout(x, ms)
    });
}

// Validate.
function isValid() {
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

// Parse PGN text to array of moves.
function parsedMoves() {
    const full = $('#input-pgn').val();
    const moves = full.substring(full.lastIndexOf(']') + 1);
    const splitted = moves.split(/\s/); // Split per space.
    const reg = /[0-9]+\./; // Numbering regex.
    const filtered = splitted.filter((x) => {
        return !reg.test(x) && x; // Filter out numbering + empty strings.
    });
    return filtered;
}

// Get interval speed.
function getTempo() {
    const selectedVal = $('#select-level').val();
    let interval;
    if (selectedVal === 's') interval = 6000; // Slow
    if (selectedVal === 'm') interval = 4000; // ...
    if (selectedVal === 'f') interval = 250;
    return interval;
}

// Get full name.
function getFull(move) {
    return move.replace('N', ' knight ').replace('B', ' bishop ')
    .replace('R', ' rook ').replace('Q', ' queen ').replace('K', ' king ')
    .replace('x', ' takes ').replace('+', ' check ').replace('#', ' checkmate ')
    .replace(/\s+/g, ' '); // Single spaces.
}

// Specify elements to display when valid or invalid.
function showElems(valid) {
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