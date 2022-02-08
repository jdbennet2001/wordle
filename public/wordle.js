// Load words

const WORD_LENGTH = 5
const MAX_WORDS = 6;

const ENTER_KEY = 13;
const UNICODE_ENTER = 9094

const BACKSPACE = 8;
const UNICODE_BACKSPACE = 9003

const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz';

let words = []
let valid = [] 
let guesses = ['', '', '', '', '', '']
let guess = 0;
let objective = ''
let popup_msg = ''

// Init the program
async function init(){
    if ( _.isEmpty(words) ){
        let wordTokens = await fetch('words.json');
        words = await wordTokens.json();

        let validTokens = await fetch('valid.json')
        let tokens  = await validTokens.json();
        valid = _.concat( tokens, words )
    }

    objective = _.sample(words);
    guesses = ['', '', '', '', '', '']
    guess = 0;
    popup_msg = ''

    console.log( objective )
    // objective = 'clone'
    
    await renderBoard();
}

async function renderBoard(){
    let board = $('.board')
    
    // Clear the board
    await $('.board').empty();

    await addTitle(board)

    await addStatus(board)
    
    // Add rows
    await addRows(board)

    // Add tiles
    $('.row').each(function(i, obj) {
        addTiles(i, obj)
    });

    await addKeyboard(board);

    popup_msg = ''
    
}

async function addTitle(board){
    var $row = await $("<div>", {"class": "title", text: 'Wordle'});

    // Clicking on the title resets the app...
    $row.click( () => {
       init()
    })
    board.append($row);
}

async function addStatus(board){
    let visbility = _.isEmpty(popup_msg) ? 'hidden' : 'visible'
    var $row = await $("<div>", {"class": `status ${visbility}`, text: popup_msg});
    board.append($row);
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


        let $div = $("<div>", {"class": `tile ${color} ${text}`, text});
        $div.click(function(){ /* ... */ });
        $(obj).append($div);
    }
}

function addKeyboard(board){

    let charset = ''
    for ( let i = 0; i < guess; i++){
        charset += guesses[i]
    }

    let rows = [ ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['⎆', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']]

    let $keyboard = $("<div>", {"class": `keyboard`,});
    rows.forEach(letters =>{
        $row = $('<div>', {'class' : 'keyboard-row'})
        letters.forEach(letter =>{

            let used = "free"
            if ( $(`.${letter}.green`).length )
                used = 'green'
            else if ( $(`.${letter}.yellow`).length )
                used = 'yellow'
            else if ( $(`.${letter}.default`).length )
                used = 'used'

            let $rune = $("<div>", {"class": `keyboard-letter ${used}`, text: letter});
            $rune.click(() =>{
                handleKey(letter.charCodeAt(0));
            })
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
        color = 'yellow'
    }
     
    return color;
}



init();

$( 'body').keydown( event => {
    let keycode = event.keyCode;
    handleKey(keycode)
});

function handleKey(keycode){

    let key = String.fromCharCode(keycode).toLowerCase();

    let active_guess = guesses[guess];
    let complete_word = active_guess.length == WORD_LENGTH

    // Update word on screen
    if (_.includes(VALID_CHARS, key) && !complete_word   ){
        guesses[guess] = active_guess + key;
    }

    if ( (keycode == ENTER_KEY || keycode == UNICODE_ENTER) && complete_word ){

        // Submit word
        if ( guess < MAX_WORDS && _.includes(valid, active_guess) ){
            guess = guess + 1;
        }

        if ( guess < MAX_WORDS &&  !_.includes(valid, active_guess) ){
            popup_msg = 'Not a word'
         }

        if (guess == MAX_WORDS && active_guess == objective){
            popup_msg = 'Right!'
        }

        if (guess == MAX_WORDS && active_guess != objective){
            popup_msg = objective
        }
    }

    // Backspace
    if ((keycode == BACKSPACE || keycode == UNICODE_BACKSPACE) && !_.isEmpty(active_guess)){
        guesses[guess] = active_guess.slice(0, -1)
    }

    renderBoard();

}