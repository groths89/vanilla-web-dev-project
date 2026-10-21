let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let lapList = [];
let timerInterval = null;

function updateDOMDisplay(formattedTimeString) {
    let parts = formattedTimeString?.split(".");
    let mainTime = parts?.[0];
    let milliTime = parts?.[1];

    let timeDigitsElements = document.querySelector(".digits");
    let milliDigitsElement = document.querySelector(".millis-digit");

    timeDigitsElements.textContent = mainTime;
    milliDigitsElement.textContent = milliTime;
}

function updateCurrentLapPill(currentLapNumber, activeLapTime) {
    let lapNumberLabel = document.querySelectorAll(".current-lap-pill > span").item(1);
    let lapTimeMini = document.querySelector(".lap-time-mini");

    lapNumberLabel.textContent = "CURRENT LAP " + currentLapNumber.toFixed().toString();
    lapTimeMini.textContent = formatTime(activeLapTime);
}

function formatTime(totalMilliseconds){
    let minutes = Math.floor(totalMilliseconds / 60000);
    let seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    let milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

    return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0') + "." + milliseconds.toString().padStart(2, '0');
}

function updateTimer(){
    if (isRunning) {
        let currentElapsedTime = elapsedTime + (performance.now() - startTime);
        console.log(formatTime(currentElapsedTime));

        updateDOMDisplay();
    }
}

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        startTime = performance.now();

        timerInterval = setInterval(updateTimer, 10);
    }
}

function pauseStopwatch() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval)

        elapsedTime = elapsedTime + (performance.now() - startTime);
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    lapList = [];

    updateDOMDisplay();
}

function recordLap() {
    if (isRunning) {
        let currentLapTime = elapsedTime + (performance.now() - startTime);
        let lastIndex = lapList.length - 1;
        let splitTime;

        if (lapList.length > 0) {
            let previousTotalTime = lapList[lastIndex].totalTime;

            splitTime = currentLapTime - previousTotalTime;
        } else {
            splitTime = currentLapTime;
        }

        const lapObject = {
            lapNumber: lapList.length + 1,
            splitTime: formatTime(splitTime),
            totalTime: currentLapTime
        }

        lapList.push(lapObject);
        console.log("Recorded Lap:", lapObject);

        //DOM manipulation here
    }
}