$(document).ready(() => {
    const btnOpen = $('#btn-open');
    const inputFile = $('#input-file');
    const pgnfile = inputFile[0].files[0];
    btnOpen.click(() => {
        inputFile.click();
    })
    inputFile.change(() => {
        console.log(pgnfile)
    })


    $('#btn-start').click(() => {
        readData();
        splitMoves();
    })
});

const readData = () => {
    const spanMoves = document.getElementById('span-moves');
    if (isValid() == true ) {
        spanMoves.textContent = "true";
    } else {
        spanMoves.textContent = "false"
    }
}

const isValid = () => {
    const move = splitMoves();
    // Start from move 1 (because of splitting by dots).
    for(let i = 1; i < move.length; i++){
        let onemove = move[i].split(' ');
        onemove.pop();
        console.log(onemove.join(' '));

    }
    if(/^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[NBRQK])?(\+|#)?$|^O-O(-O)?$/.test(move)){
        return true;
    } else {
        return false;
    }
}

const splitMoves = () => {
    const inputMoves = document.getElementById('input-moves').value;
    const splittedMoves = inputMoves.split('\.'); // Splitting by dots.
    return splittedMoves;
}

