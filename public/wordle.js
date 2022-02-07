// Load words

const WORD_LENGTH = 5
const MAX_WORDS = 6;
const ENTER_KEY = 13;
const BACKSPACE = 8;


const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz';

let words = []
let guesses = ['', '', '', '', '', '']
let guess = 0;
let objective = ''

// Init the program
async function init(){
    let response = await fetch('words.json');
    words = await response.json();
    // objective = _.sample(words);
    objective = 'clone'
    
    await renderBoard();
}

async function renderBoard(){
    let board = $('.board')
    
    // Clear the board
    await $('.board').empty();
    
    // Add rows
    await addRows(board)

    // Add tiles
    $('.row').each(function(i, obj) {
        addTiles(i, obj)
    });

    await addKeyboard(board);
    
}


async function addRows(board){

    for( let i = 0; i < 6; i++){
        var $row = await $("<div>", {"class": "row"});
        board.append($row);
    }    

}


function addTiles(row, obj){
    for( let column = 0; column < 5; column++){
        let text = guesses[row].charAt(column)

        let color = getColor(row, column);


        let $div = $("<div>", {"class": `tile ${color}`, text});
        $div.click(function(){ /* ... */ });
        $(obj).append($div);
    }
}

function addKeyboard(board){

    let rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

    let $keyboard = $("<div>", {"class": `keyboard`,});
    rows.forEach(row =>{
        $row = $('<div>', {'class' : 'keyboard-row'})
        let letters = row.split('')
        letters.forEach(letter =>{
            let $rune = $("<div>", {"class": `keyboard-letter`, text: letter});
            $($row).append($rune)
        })
        $($keyboard).append($row)
    })

    $(board).append($keyboard)

}

function getColor(row, column){

    let color = 'default'

    let text = guesses[row].charAt(column)

    if (guess <= row ){
        color = 'default'
    }
    else if ( _.isEmpty(text) ){
        color = 'default'
    }
    else if (text == objective[column]){
        color = 'green'
    }
    else if (text && _.includes(objective, text)){
        accuracy = 'yellow'
    }
     
    return color;
}



init();

$( 'body').keydown( event => {
    let keycode = event.keyCode;
    let key = String.fromCharCode(keycode).toLowerCase();

    let active_guess = guesses[guess];
    let complete_word = active_guess.length == WORD_LENGTH

    // Update word on screen
    if (_.includes(VALID_CHARS, key) && !complete_word   ){
        guesses[guess] = active_guess + key;
    }

    // Submit word
    if ( keycode == ENTER_KEY && guess < MAX_WORDS && complete_word && _.includes(words, active_guess) ){
        guess = guess + 1;
    }

    // Backspace
    if (keycode == BACKSPACE && !_.isEmpty(active_guess)){
        guesses[guess] = active_guess.slice(0, -1)
    }



    renderBoard();

    console.log( key );
});