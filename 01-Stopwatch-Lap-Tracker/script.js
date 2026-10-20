let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let lapList = [];
let timerInterval = null;

function formatTime(totalMilliseconds){
    let minutes = Math.floor(totalMilliseconds / 60000);
    let seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    let milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

    return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0') + "." + milliseconds.toString().padStart(2, '0');
}

function updateTimer(){
    if (isRunning) {
        let currentElapsedTime = elapsedTime + (performance.now() - startTime);
        console.log(formatTime(currentElapsedTime))
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

    
}