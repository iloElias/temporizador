let setTime = document.getElementById("set-time")
let timeLeft = document.getElementById("time-left")
let endTime = document.getElementById("end-time")

let startButton = document.getElementById("start-btn")
let deleteButton = document.getElementById("del-btn")
let pauseButton = document.getElementById("pause-btn")
let continueButton = document.getElementById("continue-btn")

let startTime = 120;
let timeToWait = startTime;
let timeRunning = false;
let isPaused = false
let clock = document.getElementById("outer-circle")
const date = new Date()

let color = "#8389F9"
let inactiveColor = "#35376A"

function percentFormula(total, percentage) {
    return (total * (percentage / 100)).toFixed(1);
}

function circleDeg(total, fraction) {
    return (100 * fraction) / total
}

function secondsToTime(seconds) {
    if (seconds < 0) {
        return "0:00";
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    if (hours > 0) {
        return `${hours} : ${minutes < 10 ? '0 ' : ''}${minutes} : ${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    }
    return `${minutes  > 0 ? `${minutes} : ` : ``}${secondsLeft < 10 ? `${minutes > 0 ? '0':''}` : ''}${secondsLeft}`;
}


function legibleTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    seconds = seconds % 60;

    let timeComponents = [];

    if (hours > 0) {
        timeComponents.push(`${hours} h`);
    }

    if (minutes > 0) {
        if (seconds > 0 || hours > 0) {
            timeComponents.push(`${minutes} m`);
        } else {
            timeComponents.push(`${minutes} min`);
        }
    }

    if (seconds > 0) {
        timeComponents.push(`${seconds} s`);
    }

    return timeComponents.join(' ');
}


function updateClock(startTime, timeToWait) {
    clock.style.background = `conic-gradient(${color} ${percentFormula(360, circleDeg(startTime, timeToWait))}deg, transparent 0deg)`
}

function formateEndDate(seconds) {
    const newDate = new Date();

    newDate.setSeconds(newDate.getSeconds() + seconds);

    let formatedDate = newDate.toLocaleTimeString('pt-BR', {
        hour: 'numeric',
        minute: 'numeric',
    });

    if (formatedDate != "Invalid Date") {
        return formatedDate;
    }
}

function formateToSeconds(time) {
    if (typeof time == "string" && time.includes(":")) {
        let splitTimer = time.split(":");
        let seconds = 0;

        if (splitTimer.length == 3) {
            seconds += parseInt(splitTimer[0]) * 3600;
            seconds += parseInt(splitTimer[1]) * 60;
            seconds += parseInt(splitTimer[2]);
        } else if (splitTimer.length == 2) {
            seconds += parseInt(splitTimer[0]) * 60;
            seconds += parseInt(splitTimer[1]);
        }
        return parseInt(seconds);
    } else {
        return parseInt(time);
    }


}

function startTimer() {
    startTime = formateToSeconds(timeLeft.value)
    timeToWait = startTime

    timeRunning = true
    isPaused = false

    color = "#8389F9"

    timeLeft.setAttribute("readonly", "")
    updateClock(startTime, timeToWait)
    formateTimes()
}

function stoptimer(){
    timeRunning = false
    isPaused = true
    color = inactiveColor

    document.getElementById("opacity").style.opacity = "0.65"

    updateClock(startTime, timeToWait)
}


function formateTimes() {
    startTime = formateToSeconds(timeLeft.value)
    timeToWait = startTime

    if (isNaN(legibleTime(startTime))) {
        setTime.innerText = legibleTime(startTime)
    } else {
        setTime.innerText = "Tempo não definido ou invalido"
    }

    if (formateEndDate(startTime) == undefined) {
        const newDate = new Date();
        endTime.innerText = newDate.toLocaleTimeString('pt-BR', {
            hour: 'numeric',
            minute: 'numeric',
        });
    } else {
        endTime.innerText = formateEndDate(startTime)
    }
}


timeLeft.value = secondsToTime(startTime)
clock.style.transition = "1s cubic-bezier(.23,1,.32,1)"
formateTimes()

setInterval(function () {
    if (timeRunning && timeToWait >= 0) {
        timeToWait--;
        timeLeft.value = secondsToTime(timeToWait)
        updateClock(startTime, timeToWait)
    }
    if (timeToWait == 0) {
        color = inactiveColor
        timeRunning = false
        timeLeft.removeAttribute("readonly")
        stoptimer()
        updateClock(startTime, timeToWait)
        
        deleteButton.style.display = "none"
        pauseButton.style.display = "none"
        continueButton.style.display = "none"
    
        startButton.style.display = "block"
    }
    if (!timeRunning && !isPaused) {
        color = inactiveColor
        formateTimes()
        updateClock(startTime, timeToWait)
        timeLeft.removeAttribute("readonly")
    }
}, 1000);

document.getElementById("timer-form").addEventListener("submit", function () {
    updateClock(startTime, timeToWait)
    startButton.style.display = "none"
    if (timeLeft.value) {
        startTimer()
        deleteButton.style.display = "block"
        pauseButton.style.display = "block"
    }
})

timeLeft.addEventListener("input", function () {
    timeLeft.value = timeLeft.value.replace(/[^0-9:]/g, "");
    formateTimes();
})

startButton.addEventListener("click", function () {
    updateClock(startTime, timeToWait)

    document.getElementById("opacity").style.opacity = "0.9"

    startButton.style.display = "none"
    if (timeLeft.value) {
        startTimer()
        deleteButton.style.display = "block"
        pauseButton.style.display = "block"
    }
})

deleteButton.addEventListener("click", function () {
    timeLeft.value = secondsToTime(startTime)
    timeToWait = startTime

    formateTimes();
    stoptimer()
    timeLeft.removeAttribute("readonly")

    document.getElementById("opacity").style.opacity = "0.65"

    deleteButton.style.display = "none"
    pauseButton.style.display = "none"
    continueButton.style.display = "none"

    startButton.style.display = "block"
})

pauseButton.addEventListener("click", function () {
    isPaused = true
    timeRunning = false

    stoptimer()

    document.getElementById("opacity").style.opacity = "0.65"

    pauseButton.style.display = "none"
    continueButton.style.display = "block"
})

continueButton.addEventListener("click", function () {
    isPaused = false
    timeRunning = true

    document.getElementById("opacity").style.opacity = "0.9 "

    color = "#8389F9"
    updateClock(startTime, timeToWait)

    continueButton.style.display = "none"
    pauseButton.style.display = "block"
    continueButton.style.display = "none"
})