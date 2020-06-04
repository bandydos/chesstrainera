$(document).ready(() => {
    const btnStart = $('#btn-start');
    const btnPause = $('#btn-pause');
    const btnRestart = $('#btn-restart');
    const btnReset = $('#btn-reset');
    const btnOpen = $('#btn-open');
    const inputFile = $('#input-file');

    showElems('stopped'); // Hide table ...
    btnOpen.click(() => {
        inputFile.click();
    });
    inputFile.change(() => {
    });
    btnStart.click(() => {
        readData();
    });
    btnPause.click(() => {
        clearTimeout(timer);
        showElems('paused');
    });
    btnRestart.click(() => {
        readData();
        showElems('restarted')
    });
    btnReset.click(() => {
        $('#table-moves tbody tr').remove();
        clearTimeout(timer);
        done = [];
        showElems('stopped');
        $('#span-message').hide();
    });
});

var done = [];
var timer;

async function readData() {
    const moves = parsedSeperateMoves();
    const valid = isValid();
    const tempo = getTempo();

    if (valid === true) {
        showElems('started');
        for (let i = done.length; i < moves.length; i++) {
            await delay(tempo); // Some delay before.
            done.push(moves[i]);
            $('#tbody-moves').append(`<tr><td>${i + 1}</td><td>${getFull(moves[i])}</td></tr>`);
            await delay(tempo); // Some delay after.
        }
    } else {
        showElems('stopped');
        $('#span-message').text('Something went wrong, check input please.');
    }
}

function delay(ms) {
    return new Promise((x) => {
        timer = setTimeout(x, ms)
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

    const firstMove = /1\.\s?([a-h]|[NBRQK])/ // Search first move.
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
    if (selectedVal === 's') interval = 2000; // Slow
    if (selectedVal === 'm') interval = 1500; // ...
    if (selectedVal === 'f') interval = 1000;
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
    const btnPause = $('#btn-pause');
    const btnRestart = $('#btn-restart');
    if (action === 'started') {
        divLabels.hide();
        divInput.hide();
        spanMessage.hide();
        tableMoves.show();
        btnReset.show();
        btnPause.show();
        btnRestart.hide();
    } else if (action === 'stopped') {
        divLabels.show();
        divInput.show();
        spanMessage.show();
        tableMoves.hide();
        btnReset.hide();
        btnPause.hide();
        btnRestart.hide();
    } else if (action === 'paused') {
        btnPause.hide();
        btnRestart.show();
    } else if (action === 'restarted') {
        btnPause.show();
        btnRestart.hide();
    }
}
