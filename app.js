$(document).ready(function () {

    var guess = 0;
    var selectedColor = '';
    var bGround = 'rgb(0, 128, 0) linear-gradient(#484848, #333333) repeat scroll 0% 0% / auto padding-box border-box';
    $('.submit-displayEvaluation').hide();
    var clickCount = 0;
    var isSelected = false;
    var solutionArray = pickACode();
    // console.log(solutionArray);
    var tempRay = $('.guess-history');
    var guessBoxArray = [];
    var nextFeedback = $($('.first-grade')[0]).parent()[0];
    var prompt = $('.prompt');
    prompt.hide();
    for (var i = 9; i >= 0; i--) {
        guessBoxArray.push(tempRay[i]);
    }

    // Creates an Array with all possible guesses
    // and separates them by giving them a new attribute
    for (var i = 0; i < 10; i++) {
        var guessArray =
            guessBoxArray[i].getElementsByClassName("guess-index");
        //console.log(guessArray);
        for (var j = 0; j < 4; j++) {
            $(guessArray[j]).attr('id', `g-${i}-${j}`);
        }
    }

    // var nextFeedback1 = $($('.first-grade')[0]).parent().prev();
    // var nextFeedback = $($('.first-grade')[0]).parent().prev()[0];
    // var activeFeedback =  nextFeedback.getElementsByClassName("grad-pegs")[0];
    // console.log(activeFeedback);

    var masterGuessArray = [[-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1],
                            [-1, -1, -1, -1]];


    // Inactivates the keypad for the acual guessing round
    $('.submit-area').click(function () {
        $('.active').removeClass('active');
        var feedbackArray = getGrade();
        checkWin(feedbackArray);
        //console.log(feedbackArray); //This array is evaluation of the guess
        // console.log(solutionArray); //This array is the solution code
        var feedbackBox = getfeedbackBox ();
        displayEvaluation(feedbackArray, feedbackBox);
        //console.log(feedbackBox);
        guess++;
        for (var i = 0; i < 4; i++) {
            $(`#g-${guess}-${i}`).addClass('active');
        }
        $('.submit-area').hide();
    })
    //console.log(tempRay)
    //console.log(guessBoxArray)
    // console.log($('.guess-history'));


    // Says that you mark your selected color, so that you know what you put in your guess
    $('.selector-inner').click(function () {
        isSelected = true;
        $('.selector-outer').css('background-color', "grey");
        var peg = ($(this).parent())[0];
        selectedColor =
            $(this).css('background-color');
        $(peg).css('background-color', selectedColor);
    });

    // Organize that you can choose your color in the active guessing round
    $('.guess-index').click(function () {
        if (isSelected) {
            if ($(this).hasClass('active')) {
                var number = parseInt($(this).css('border'));
                if (number === 1) { //insert a digit
                    $(this).css('background', 'none');
                    $(this).css('background-color', selectedColor);
                    $(this).css('border', '2px solid #A8A8A8');
                    // Increases the number of clicks, so that we know, when to stop listening to the clicks
                    var coord = $(this).attr('id');
                    updateMasterArray(selectedColor, coord);
                    clickCount++;
                    if (clickCount === 4) {
                        $('.submit-area').show();
                        clickCount = 0;
                    }
                } else { //digit removed
                    $(this).css('background', bGround);
                    $(this).css('border', '1px solid #787878');
                    // Decreases the number of clicks, when it is removed
                    //updateMasterArray(selectedColor, coord);
                    clickCount--;
                }
            }
        }
    });

    function pickACode() {
        var ray = [];
        for (var i = 0; i < 4; i++) {
            ray.push(Math.floor(Math.random() * 6) );
        }
        return ray;
    }

    function updateMasterArray(col, xy) {
        //console.log(col,xy);
        // g-10-1
        var ray = xy.split('-');
        //console.log(ray);
        var x = ray[1];
        var y = ray[2];
        masterGuessArray[x][y] = makeColorANumber(col);
        //console.log(masterGuessArray);
    };

    function makeColorANumber(col) {
        if (col === 'rgb(128, 147, 241)') return 0;
        if (col === 'rgb(158, 120, 143)') return 1;
        if (col === 'rgb(114, 221, 247)') return 2;
        if (col === 'rgb(245, 156, 169)') return 3;
        if (col === 'rgb(179, 136, 235)') return 4;
        if (col === 'rgb(244, 244, 237)') return 5;
    }

    function getGrade() {
        var feedbackRay = [];
        // console.log(masterGuessArray[guess])
        // console.log(solutionArray);
        var aRay = [];
        for (var i = 0; i < 4; i++) {
            // console.log("I'm fillin up aRay");
            aRay.push(solutionArray[i]);
        }
        // Right Position Check
        for (var i = 0; i < 4; i++) {
            if (masterGuessArray[guess][i] === aRay[i]) {
                feedbackRay.push('position');    // 1 means that there is a color at the right position; feedbackRay can be pushed up to a length of NumberOf Digits length
                aRay[i] = -1;       // If the position is correct this will replace that color with -1 in the copy of the answer array, so that it cannot match with other colors
                masterGuessArray[guess][i] = -2; // If the position of the guess is correct, it will replace that number in the guess array with a -2 so that it cannot match with another color anymore
            }
            //console.log("This is aRay: " + aRay);
            //console.log("This is masterGuessArray[guess]: " + masterGuessArray[guess]);
            //console.log("This is solutionArray: " + solutionArray);
            //console.log("This is feedbackRay: " + feedbackRay);
        }


        //Right Color Check
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (masterGuessArray[guess][i] === aRay[j]) {
                    feedbackRay.push('color');   // Means that, if a color is correct, that is displayed by 2 in the GradArray
                    aRay[j] = -1;
                    masterGuessArray[guess][i] = -2;
                }
            }
        }
        return feedbackRay;
    }


    //var nextFeedback = $($('.first-grade')[0]).parent().prev()[0];
    //console.log(activeFeedback);
    
    function getfeedbackBox(){ // This function traverse through the feedbackBox
    // var nextFeedback1 = $($('.first-grade')[0]).parent().prev();
    //var firstGrade = $($('.first-grade')[0]).parent().prev()[0];
   // console.log(nextFeedback);
    var activeFeedback =  nextFeedback.getElementsByClassName("feedback-history")[0];
    //console.log(activeFeedback);
    nextFeedback = $(nextFeedback).prev()[0];
    // console.log(activeFeedback);
    return activeFeedback;
    }

    function displayEvaluation(ray, box){
        var pegRay = box.getElementsByClassName("feedback-index");
        console.log(pegRay);
        for (var i = 0; i < ray.length; i++){
            // Take an element of the pegRay and add a class
            $(pegRay[i]).addClass(`${ray[i]}`);
        }
        $('.position').css('background-color', 'none').css('background-color', '#00ccff'); //turquise is right position
        $('.color').css('background-color', 'none').css('background-color', '#ff66ff'); //pink is right color
    }
    function checkWin(array){
        //console.log(array);
        var arrayToString = array.join();
        if (arrayToString === "position, position, position, position"){
        //console.log("You win");
        prompt.show;
        }
    }

});
