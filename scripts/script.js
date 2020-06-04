$(document).ready(() => {
    const btnStart = $('#btn-start');
    const btnOpen = $('#btn-open');
    const inputFile = $('#input-file');
    const btnReset = $('#btn-reset');

    showElems('stopped'); // Hide table ...
    btnOpen.click(() => {
        inputFile.click();
    });
    inputFile.change(() => {
    });

    btnStart.click(() => {
        readData();
    });
    btnReset.click(() => {
        $('#table-moves tbody tr').remove();
        clearTimeout(timeout);
        showElems('stopped');
        $('#span-message').hide();
    });
});

async function readData() {
    const moves = parsedSeperateMoves();
    const valid = isValid();
    const tempo = getTempo();

    $('#table-moves tbody tr').remove();

    if (valid === true) {
        showElems('started');
        for (let i = 0; i < moves.length; i++) {
            $('#tbody-moves').append(`<tr><td>${i + 1}</td><td>${getFull(moves[i])}</td></tr>`);
            await delay(tempo);
        }
    } else {
        showElems('stopped');
        $('#span-message').text('Something went wrong, check input please.');
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
    const moves = parsedSeperateMoves();
    let valid;
    let validOutcome;
    let validMove;

    // Test moves.
    const regMove = /^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[NBRQK])?(\+|#)?$|^O-O(-O)?$/;
    for (let i = 0; i < moves.length - 1; i++) {
        if (regMove.test(moves[i])) validMove = true;
        else return false;
    }

    // Test outcome.
    const regOutcome = /^1-0$|^0-1$|^1\/2-1\/2$/;
    if (regOutcome.test(moves[moves.length - 1])) validOutcome = true;
    else return false;

    // Combine.
    if (validMove === true && validOutcome === true) valid = true;
    else return false;
    return valid;
}


// Parse PGN text to array of moves.
function parsedFullMoves() {
    const full = $('#input-pgn').val();

    const firstMove = /1\.([a-h]|[NBRQK])/ // Search first move.
    const moves = full.substring(full.search(firstMove));

    const reg = /[0-9]+\./; // Numbering regex.
    const splitted = moves.split(reg); // Split per move.

    const filtered = splitted.filter((x) => {
        return x; // Filter out empty strings.
    });

    return filtered;
}

function parsedSeperateMoves() {
    const fullMoves = parsedFullMoves();

    // Split array further.
    let tempMoves = [];
    for (let i = 0; i < fullMoves.length; i++) {
        tempMoves.push(fullMoves[i].split(/\s/));
    }

    // Store each element in new array.
    let seperate = [];
    for (let i = 0; i < tempMoves.length; i++) {
        for (let j = 0; j < tempMoves[i].length; j++) {
            seperate.push(tempMoves[i][j]);
        }
    }

    let filtered = seperate.filter((x) => {
        return x;  // Filter out empty strings.
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
function showElems(action) {
    const spanMessage = $('#span-message');
    const tableMoves = $('#table-moves');
    const divLabels = $('#div-labels');
    const divInput = $('#div-input');
    const btnReset = $('#btn-reset');
    if (action === 'started') {
        divLabels.hide();
        divInput.hide();
        spanMessage.hide();
        tableMoves.show();
        btnReset.show();
    } else if (action === 'stopped') {
        divLabels.show();
        divInput.show();
        spanMessage.show();
        tableMoves.hide();
        btnReset.hide();
    }
}
