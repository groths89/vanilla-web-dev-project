let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let lapList = [];
let timerInterval = null;

let timeDigitsElements = document.querySelector(".digits");
let milliDigitsElement = document.querySelector(".millis-digit");

let tableContainer = document.querySelector('.telemetry-table');

function updateDOMDisplay(formattedTimeString) {
    let parts = formattedTimeString?.split(".");
    let mainTime = parts?.[0];
    let milliTime = parts?.[1];

    timeDigitsElements.textContent = mainTime;
    milliDigitsElement.textContent = milliTime;
}

function updateCurrentLapPill(currentLapNumber, activeLapTime) {
    let lapNumberLabel = document.querySelectorAll(".current-lap-pill > span").item(1);
    let lapTimeMini = document.querySelector(".lap-time-mini");

    lapNumberLabel.textContent = "CURRENT LAP " + currentLapNumber.toFixed().toString();
    lapTimeMini.textContent = formatTime(activeLapTime);
}

function renderNewLapToLedger(lapObject, allLaps) {
    const dynamicRows = tableContainer.querySelectorAll(".table-row:not(.header-row)");
    dynamicRows.forEach(row => row.remove());

    let splitTimesArray = allLaps.map(lap => lap.splitTime);
    let minimum = Math.min(...splitTimesArray);
    let maximum = Math.max(...splitTimesArray);

    allLaps.forEach((lap, index) => {
        const newRow = document.createElement("div");
        newRow.classList.add("table-row");

        let statusBadgeHtml = "";

        if (index === 0) {
            statusBadgeHtml = 'INIT';
        } else if (lap.splitTime === minimum) {
            newRow.classList.add("row-fastest");
            statusBadgeHtml = '<span class="badge fastest">FASTEST</span>';
        } else if (lap.splitTime === maximum) {
            newRow.classList.add("row-slowest");
            statusBadgeHtml = '<span class="badge slowest">SLOWEST</span>';
        } else {
            let previousLapSplit = allLaps[index - 1].splitTime;
            let deltaMs = lap.splitTime - previousLapSplit;
            let sign = deltaMs >= 0 ? '+' : '';
            statusBadgeHtml = sign + (deltaMs / 1000).toFixed(2) + 's';
        }

        newRow.innerHTML = 
            '<div class="col-lap">' + lap.lapNumber + '</div>' +
            '<div class="col-split">' + formatTime(lap.splitTime) + '</div>' +
            '<div class="col-total">' + formatTime(lap.totalTime) + '</div>' +
            '<div class="col-status">' + statusBadgeHtml + '</div>';

        tableContainer.firstElementChild.after(newRow);
    });

    const liveRow = document.createElement("div");
    liveRow.classList.add("table-row", "row-current");
    
    let nextLapNumber = allLaps.length + 1;
    let lapDisplayPrefix = '• ';
    
    liveRow.innerHTML = 
        '<div class="col-lap">' + lapDisplayPrefix + nextLapNumber + '</div>' +
        '<div class="col-split">00:00.00</div>' +
        '<div class="col-total">00:00.00</div>' +
        '<div class="col-status"><span class="badge current">CURRENT</span></div>';

    tableContainer.firstElementChild.after(liveRow);
}

function resetDOMUI() {
    timeDigitsElements.textContent = "00:00";
    milliDigitsElement.textContent = "00";

    const dynamicRows = tableContainer.querySelectorAll(".table-row:not(.header-row)");
    dynamicRows.forEach(row => row.remove());
}

function formatTime(totalMilliseconds){
    let minutes = Math.floor(totalMilliseconds / 60000);
    let seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    let milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

    return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0') + "." + milliseconds.toString().padStart(2, '0');
}

function updateTimer(){
    if (isRunning) {
        let currentSplitTime;
        let currentElapsedTime = Math.floor(elapsedTime + (performance.now() - startTime));

        updateDOMDisplay(formatTime(currentElapsedTime));
        updateCurrentLapPill(lapList.length + 1, currentElapsedTime);

        if (lapList.length > 0) {
            let lastIndex = lapList.length - 1;
            let previousTotalTime = lapList[lastIndex].totalTime;
            currentSplitTime = currentElapsedTime - previousTotalTime;
        } else {
            currentSplitTime = currentElapsedTime;
        }

        let liveRow = document.querySelector(".table-row.row-current");

        if (liveRow) {
            liveRow.querySelector(".col-split").textContent = formatTime(currentSplitTime);
            liveRow.querySelector(".col-total").textContent = formatTime(currentElapsedTime);
        }
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

    resetDOMUI();
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
            splitTime: splitTime,
            totalTime: currentLapTime
        }

        lapList.push(lapObject);
        console.log("Recorded Lap:", lapObject);

        renderNewLapToLedger(lapObject, lapList);
    }
}