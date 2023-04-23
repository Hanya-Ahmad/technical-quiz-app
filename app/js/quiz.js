
//Retrieve the questions from local storage
let chosenCategory = localStorage.getItem("questions");
let questionsJson= JSON.parse(chosenCategory);

//Delete the questions which have multiple correct answers from the JSON object
for (let i in questionsJson){
        
    if(questionsJson[i]['multiple_correct_answers']==='true'){
        //Change the configurable property to true to edit the JSON object
        Object.defineProperty(
            questionsJson,
            questionsJson[i],
            {
            configurable: true, 
            
            }
        );
    
        delete questionsJson[i];

    }

}

let q=[];
let stopIndex = 10;
let correctAnswer;
//Append 10 questions from the retrieved JSON object to the letiable 'q'

for (let i = 0; i<stopIndex; i++){
    //If the question is not deleted from the previous steps, add it to 'q'
    if(questionsJson[i]){
        if(questionsJson[i]['question']){
        if(questionsJson[i]['correct_answers']['answer_a_correct']==='true'){
            correctAnswer = 1;
        }
        if(questionsJson[i]['correct_answers']['answer_b_correct']==='true'){
            correctAnswer = 2;
        }
        if(questionsJson[i]['correct_answers']['answer_c_correct']==='true'){
            correctAnswer = 3;
        }
        if(questionsJson[i]['correct_answers']['answer_d_correct']==='true'){
            correctAnswer = 4;
        }
       
        
        q.push({'question':questionsJson[i]['question'], 'correctAnswer':correctAnswer, 'answers':[questionsJson[i]['answers']['answer_a'],questionsJson[i]['answers']['answer_b'],questionsJson[i]['answers']['answer_c'],questionsJson[i]['answers']['answer_d']]   })
        }
    }
    //If the question is deleted then skip this iteration and add another iteration to complete the needed 10 questions
    else{
        stopIndex++;       
    }
}
console.log(questionsJson)

//Timer functions
$(function () {
    timer();
    function timer() {
        const FULL_DASH_ARRAY = 283;
        const WARNING_THRESHOLD = 10;
        const ALERT_THRESHOLD = 5;
        const COLOR_CODES = {
            info: {
                color: "green"
            },
            warning: {
                color: "orange",
                threshold: WARNING_THRESHOLD
            },
            alert: {
                color: "red",
                threshold: ALERT_THRESHOLD
            }
        };
        const TIME_LIMIT = 20;
        let timePassed = 0;
        let timeLeft = TIME_LIMIT;
        let timerInterval = null;
        let remainingPathColor = COLOR_CODES.info.color;
        document.getElementById("app").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            ></path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
                        timeLeft
                        )}</span>
        </div>
        `;
        startTimer();
        function onTimesUp() {
            clearInterval(timerInterval);
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                timePassed = timePassed += 1;
                timeLeft = TIME_LIMIT - timePassed;
                document.getElementById("base-timer-label").innerHTML = formatTime(
                        timeLeft
                        );
                setCircleDasharray();
                setRemainingPathColor(timeLeft);
                //When the question changes, the timer resets
                if (check_click == 1) {
                    setTimeout(function () {

                        onTimesUp();
                        timer();

                        $('#quiz').show();
                        $('#loadbar').fadeOut();
                    }, 1500);

                    check_click = 0;
                    return check_click;
                }

                if (timeLeft === 0) {
                    //When the timer is over, the next question comes and the timer reset
                    onTimesUp();
                    questionNo++;
					updateProgress();
                    if ((questionNo + 1) > q.length) {
						document.getElementById('quiz_web').innerHTML = "";
                        $('label.element-animation').unbind('click');
                        setTimeout(function () {
                            let toAppend = '';
                            $.each(q, function (i, a) {
                                toAppend += '<tr>'
                                toAppend += '<td>' + (i + 1) + '</td>';
                                toAppend += '<td>' + a.A + '</td>';
                                toAppend += '<td>' + a.UC + '</td>';
                                toAppend += '<td>' + a.result + '</td>';
                                toAppend += '</tr>'
                            });
                            $('#scoreModal').modal('show');
                            $('#quizResult').text(toAppend);
                            $('#totalCorrect').text(correctCount * 10);
                            $('#quizResult').show();
                            $('#loadbar').fadeOut();
                            $('#result-of-question').show();
                            $('#graph-result').show();
                            chartMake();
                        }, 1000);
                    } else {
                        //reset timer
                        timer();
                        
                        $('#qid').text(questionNo + 1);
                        $('input:radio').prop('checked', false);
                        setTimeout(function () {

                            $('#quiz').show();
                            $('#loadbar').fadeOut();
                        }, 1500);
                        //Update the UI with the question
                        if(q[questionNo]['answers'][2] === null){
                            document.getElementById('third-choice').style.visibility='hidden';
                        }
                        else{
                            document.getElementById('third-choice').style.visibility='visible';
                
                        }
                        if(q[questionNo]['answers'][3] === null){
                            document.getElementById('fourth-choice').style.visibility='hidden';
                        }
                        else{
                            document.getElementById('fourth-choice').style.visibility='visible';
                
                        }
                        $('#question').text(q[questionNo]['question']);
                        $($('#f-option').parent().find('label')).text(q[questionNo]['answers'][0]);
                        $($('#s-option').parent().find('label')).text(q[questionNo]['answers'][1]);
                        $($('#t-option').parent().find('label')).text(q[questionNo]['answers'][2]);
                        $($('#x-option').parent().find('label')).text(q[questionNo]['answers'][3]);
                    }
                }

            }, 1000);
        }

        
        function formatTime(time) {

            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }

            return `${seconds}`;
        }

        function setRemainingPathColor(timeLeft) {
            const {alert, warning, info} = COLOR_CODES;
            if (timeLeft <= alert.threshold) {
                document
                        .getElementById("base-timer-path-remaining")
                        .classList.remove(warning.color);
                document
                        .getElementById("base-timer-path-remaining")
                        .classList.add(alert.color);
            } else if (timeLeft <= warning.threshold) {
                document
                        .getElementById("base-timer-path-remaining")
                        .classList.remove(info.color);
                document
                        .getElementById("base-timer-path-remaining")
                        .classList.add(warning.color);
            }
        }

        function calculateTimeFraction() {
            const rawTimeFraction = timeLeft / TIME_LIMIT;
            return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        }

        function setCircleDasharray() {
            const circleDasharray = `${(
                    calculateTimeFraction() * FULL_DASH_ARRAY
                    ).toFixed(0)} 283`;
            document
                    .getElementById("base-timer-path-remaining")
                    .setAttribute("stroke-dasharray", circleDasharray);
        }
    }
    ;

    let loading = $('#loadbar').hide();
    $(document)
            .ajaxStart(function () {
                loading.show();
            }).ajaxStop(function () {
        loading.hide();
    });
    let questionNo = 0;
    let correctCount = 0;
    let check_click = 0;
   
	//Progress Bar
	let progress, progressPercentage;

    progress = document.getElementsByClassName('progress-bar')[0];

    function updateProgress() {
        // progress bar will be updated as count goes up
        progressPercentage = Math.round((questionNo / 10) * 100);
        progress.style.width = progressPercentage + '%';
    }

    //Load the first question upon page loading
    $(window).on('load',function(){
        check_click = 1;
        setTimeout(function(){$('#qid').text(questionNo + 1);
        $('input:radio').prop('checked', false);
        setTimeout(function () {

            $('#quiz').show();
            $('#loadbar').fadeOut();
        }, 1000);
        $('#question').text(q[questionNo]['question']);
        if(q[questionNo]['answers'][2] === null){
            document.getElementById('third-choice').style.visibility='hidden';
        }
        else{
            document.getElementById('third-choice').style.visibility='visible';

        }
        if(q[questionNo]['answers'][3] === null){
            document.getElementById('fourth-choice').style.visibility='hidden';
        }
        else{
            document.getElementById('fourth-choice').style.visibility='visible';

        }
        $($('#f-option').parent().find('label')).text(q[questionNo]['answers'][0]);
        $($('#s-option').parent().find('label')).text(q[questionNo]['answers'][1]);
        $($('#t-option').parent().find('label')).text(q[questionNo]['answers'][2]);
        $($('#x-option').parent().find('label')).text(q[questionNo]['answers'][3]);},300);
        check_click = 0;
    });



//Button ripple effect
$('.element-animation').on('click',(function(e){
    // Get the position of the click event
    let posX = $(this).offset().left,
        posY = $(this).offset().top;
    
    // Create a new ripple element
    let ripple = $('<span class="ripple"></span>').appendTo(this);
    
    // Set the position of the ripple element
    ripple.css({
        top: posY - ripple.height()/2,
        left: posX - ripple.width()/2
    });

    // Animate the ripple element
    ripple.animate({
        width: $(this).outerWidth()*2,
        height: $(this).outerHeight()*2,
        opacity: 0
    }, 500, function(){
        $(this).remove();
    });
    }));
 
    
$(document.body).on('click', "label.element-animation", function (e) {

    check_click = 1;
    let choice = $(this).parent().find('input:radio').val();

    let anscheck = $(this).checking(questionNo, choice); //$( "#answer" ).text(  );      
    q[questionNo].UC = choice;
    if (anscheck) {
        correctCount++;
        q[questionNo].result = "Correct";
    } else {
        q[questionNo].result = "Incorrect";
    }

    setTimeout(function () {

        $('#loadbar').show();
        $('#quiz').fadeOut();
        questionNo++;
        updateProgress();
        // stop timer here
        if ((questionNo + 1) > q.length) {
            document.getElementById('quiz_web').innerHTML = "";
            $('label.element-animation').unbind('click');
            setTimeout(function () {
                let toAppend = '';
                $.each(q, function (i, a) {
                    toAppend += '<tr>'
                    toAppend += '<td>' + (i + 1) + '</td>';
                    toAppend += '<td>' + a.A + '</td>';
                    toAppend += '<td>' + a.UC + '</td>';
                    toAppend += '<td>' + a.result + '</td>';
                    toAppend += '</tr>'
                });
                $('#scoreModal').modal('show');
                $('#quizResult').text(toAppend);
                $('#totalCorrect').text(correctCount * 10);
                $('#quizResult').show();
                $('#loadbar').fadeOut();
                $('#result-of-question').show();
                $('#graph-result').show();
                chartMake();
            }, 1000);
        } else {
            $('#qid').text(questionNo + 1);
            $('input:radio').prop('checked', false);
            setTimeout(function () {
                $('#quiz').show();
                $('#loadbar').fadeOut();
            }, 1000);
            
            if(q[questionNo]['answers'][2] === null){
                document.getElementById('third-choice').style.visibility='hidden';
            }
            else{
                document.getElementById('third-choice').style.visibility='visible';
    
            }
            if(q[questionNo]['answers'][3] === null){
                document.getElementById('fourth-choice').style.visibility='hidden';
            }
            else{
                document.getElementById('fourth-choice').style.visibility='visible';
    
            }
            $('#question').text(q[questionNo]['question']);
            $($('#f-option').parent().find('label')).text(q[questionNo]['answers'][0]);
            $($('#s-option').parent().find('label')).text(q[questionNo]['answers'][1]);
            $($('#t-option').parent().find('label')).text(q[questionNo]['answers'][2]);
            $($('#x-option').parent().find('label')).text(q[questionNo]['answers'][3]);
        }
    }, 1000);
});
    $.fn.checking = function (qstn, ck) {
        let ans = q[questionNo]['correctAnswer'];
        if (ck != ans)
            return false;
        else
            return true;
    };

//Show results function
    function chartMake() {

        let chart = AmCharts.makeChart("chartdiv",
                {
                    "type": "serial",
                    "theme": "dark",
                    "dataProvider": [{
                            "name": "Correct",
                            "points": correctCount,
                            "color": "#00FF00",
                            "bullet": "http://i2.wp.com/img2.wikia.nocookie.net/__cb20131006005440/strategy-empires/images/8/8e/Check_mark_green.png?w=250"
                        }, {
                            "name": "Incorrect",
                            "points": q.length - correctCount,
                            "color": "red",
                            "bullet": "http://4vector.com/i/free-vector-x-wrong-cross-no-clip-art_103115_X_Wrong_Cross_No_clip_art_medium.png"
                        }],
                    "valueAxes": [{
                            "maximum": q.length,
                            "minimum": 0,
                            "axisAlpha": 0,
                            "dashLength": 4,
                            "position": "left"
                        }],
                    "startDuration": 1,
                    "graphs": [{
                            "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
                            "bulletOffset": 10,
                            "bulletSize": 52,
                            "colorField": "color",
                            "cornerRadiusTop": 8,
                            "customBulletField": "bullet",
                            "fillAlphas": 0.8,
                            "lineAlpha": 0,
                            "type": "column",
                            "valueField": "points"
                        }],
                    "marginTop": 0,
                    "marginRight": 0,
                    "marginLeft": 0,
                    "marginBottom": 0,
                    "autoMargins": false,
                    "categoryField": "name",
                    "categoryAxis": {
                        "axisAlpha": 0,
                        "gridAlpha": 0,
                        "inside": true,
                        "tickLength": 0
                    }
                });
    }
});