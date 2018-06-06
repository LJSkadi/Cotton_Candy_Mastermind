$(document).ready(function () {

    var guess = 0;
    var selectedColor = '';
    var bGround = 'rgb(0, 128, 0) linear-gradient(grey, darkgreen) repeat scroll 0% 0% / auto padding-box border-box';
    $('.submit-btn').hide();
    var clickCount = 0;
    var isSelected = false;
    var answerRay = makeAnswer();
    // console.log(answerRay);
    var tempRay = $('.guess-pegs');
    var guessBoxArray = [];
    var nextGrade = $($('.first-grade')[0]).parent()[0];

    for (var i = 9; i >= 0; i--) {
        guessBoxArray.push(tempRay[i]);
    }

    // Creates an Array with all possible guesses
    // and separates them by giving them a new attribute
    for (var i = 0; i < 10; i++) {
        var guessArray =
            guessBoxArray[i].getElementsByClassName("guess-peg");
        //console.log(guessArray);
        for (var j = 0; j < 4; j++) {
            $(guessArray[j]).attr('id', `g-${i}-${j}`);
        }
    }

    // var nextGrade1 = $($('.first-grade')[0]).parent().prev();
    // var nextGrade = $($('.first-grade')[0]).parent().prev()[0];
    // var activeGrade =  nextGrade.getElementsByClassName("grad-pegs")[0];
    // console.log(activeGrade);

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
    $('.submit-btn').click(function () {
        $('.active').removeClass('active');
        var gradeRay = getGrade();
        console.log(gradeRay); //This array is evaluation of the guess
        // console.log(answerRay); //This array is the solution code
        var gradeBox = getGradeBox ();
        placePegs(gradeRay, gradeBox);
        //console.log(gradeBox);
        guess++;
        for (var i = 0; i < 4; i++) {
            $(`#g-${guess}-${i}`).addClass('active');
        }
        $('.submit-btn').hide();
    })
    //console.log(tempRay)
    //console.log(guessBoxArray)
    // console.log($('.guess-pegs'));


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
    $('.guess-peg').click(function () {
        if (isSelected) {
            if ($(this).hasClass('active')) {
                var number = parseInt($(this).css('border'));
                if (number === 1) { //insert a digit
                    $(this).css('background', 'none');
                    $(this).css('background-color', selectedColor);
                    $(this).css('border', '2px solid white');
                    // Increases the number of clicks, so that we know, when to stop listening to the clicks
                    var coord = $(this).attr('id');
                    updateMasterArray(selectedColor, coord);
                    clickCount++;
                    if (clickCount === 4) {
                        $('.submit-btn').show();
                        clickCount = 0;
                    }
                } else { //digit removed
                    $(this).css('background', bGround);
                    $(this).css('border', '1px solid white');
                    // Decreases the number of clicks, when it is removed
                    //updateMasterArray(selectedColor, coord);
                    clickCount--;
                }
            }
        }
    });

    function makeAnswer() {
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
        if (col === 'rgb(255, 0, 0)') return 0;
        if (col === 'rgb(0, 128, 0)') return 1;
        if (col === 'rgb(255, 255, 0)') return 2;
        if (col === 'rgb(0, 0, 0)') return 3;
        if (col === 'rgb(255, 255, 255)') return 4;
        if (col === 'rgb(165, 42, 42)') return 5;
    }

    function getGrade() {
        var gradRay = [];
        // console.log(masterGuessArray[guess])
        // console.log(answerRay);
        var aRay = [];
        for (var i = 0; i < 4; i++) {
            // console.log("I'm fillin up aRay");
            aRay.push(answerRay[i]);
        }
        // Right Position Check
        for (var i = 0; i < 4; i++) {
            if (masterGuessArray[guess][i] === aRay[i]) {
                gradRay.push('black-peg');    // 1 means that there is a color at the right position; GradRay can be pushed up to a length of NumberOf Digits length
                aRay[i] = -1;       // If the position is correct this will replace that color with -1 in the copy of the answer array, so that it cannot match with other colors
                masterGuessArray[guess][i] = -2; // If the position of the guess is correct, it will replace that number in the guess array with a -2 so that it cannot match with another color anymore
            }
            //console.log("This is aRay: " + aRay);
            //console.log("This is masterGuessArray[guess]: " + masterGuessArray[guess]);
            //console.log("This is answerRay: " + answerRay);
            //console.log("This is gradRay: " + gradRay);
        }


        //Right Color Check
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (masterGuessArray[guess][i] === aRay[j]) {
                    gradRay.push('white-peg');   // Means that, if a color is correct, that is displayed by 2 in the GradArray
                    aRay[j] = -1;
                    masterGuessArray[guess][i] = -2;
                }
            }
        }
        return gradRay;
    }


    //var nextGrade = $($('.first-grade')[0]).parent().prev()[0];
    //console.log(activeGrade);
    
    function getGradeBox(){ // This function traverse through the GradeBox
    // var nextGrade1 = $($('.first-grade')[0]).parent().prev();
    //var firstGrade = $($('.first-grade')[0]).parent().prev()[0];
   // console.log(nextGrade);
    var activeGrade =  nextGrade.getElementsByClassName("grade-pegs")[0];
    //console.log(activeGrade);
    nextGrade = $(nextGrade).prev()[0];
    // console.log(activeGrade);
    return activeGrade;
    }

    function placePegs(ray, box){
        var pegRay = box.getElementsByClassName("grade-peg");
        console.log(pegRay);
        for (var i = 0; i < ray.length; i++){
            // Take an element of the pegRay and add a class
            $(pegRay[i]).addClass(`${ray[i]}`);
        }
        $('.white-peg').css('background-color', 'none').css('background-color', 'green');
        $('.black-peg').css('background-color', 'none').css('background-color', 'red');
    }
});
