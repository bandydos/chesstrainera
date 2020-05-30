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

});

