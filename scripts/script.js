$(document).ready(() => {
    const btnStart = $('#btn-start');
    const btnOpen = $('#btn-open');
    const inputFile = $('#input-file');
    const tableMoves = $('#table-moves');
    const pgnfile = inputFile[0].files[0];
    tableMoves.hide();
    btnOpen.click(() => {
        inputFile.click();
    })
    inputFile.change(() => {
        console.log(pgnfile)
    })
    btnStart.click(() => {
        readData();
    })
});

const readData = () => {
    const spanMessage = $('#span-message');
    const tableMoves = $('#table-moves');
    const moves = seperateMoves();
    const valid = isValid();
    if (valid == true) {
        tableMoves.show();
        spanMessage.hide();
        for (let i = 0; i < moves.length; i++) {
            let timeout = setTimeout(() => {
                let counter = 0;
                $('#tbody-moves').append(`<tr><td>${i + 1}</td><td>${moves[i]}</td></tr>`);

                if (counter === moves.length) {
                    clearTimeout(timeout);
                }
            }, 2000);
            
            
        }


    } else {
        tableMoves.hide();
        spanMessage.show();
        spanMoves.textContent = 'Something went wrong, check input please.';
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


