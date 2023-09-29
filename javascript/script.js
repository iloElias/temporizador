let timeLeft = document.getElementById("time-left")

let startTime = 600;
let timeToWait = startTime;
let timeRunning = false;
let clock = document.getElementById("outer-circle")


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
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    }
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}

const date = new Date()

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
            timeComponents.push(`${minutes} mim`);
        }
    }

    if (seconds > 0) {
        timeComponents.push(`${seconds} s`);
    }

    const formattedTime = timeComponents.join(' ');

    return formattedTime;
}


function updateClock(startTime, timeToWait) {
    clock.style.background = `conic-gradient(aqua ${percentFormula(360, circleDeg(startTime, timeToWait))}deg, transparent 0deg)`
}

function formateEndDate(seconds) {
    const newDate = new Date();

    newDate.setSeconds(newDate.getSeconds() + seconds);

    return newDate.toLocaleTimeString('pt-BR', {
        hour: 'numeric',
        minute: 'numeric',
    });;
}

function startTimer() {
    let timerValue = document.getElementById("time-left").value

    if (timerValue.includes(":")) {
        let splitTimer = timerValue.split(":")
        let seconds = 0

        if (splitTimer.length == 3) {
            seconds += parseInt(splitTimer[0]) * 3600
            seconds += parseInt(splitTimer[1]) * 60
            seconds += parseInt(splitTimer[2])
        } else if (splitTimer.length == 2) {
            seconds += parseInt(splitTimer[0]) * 60
            seconds += parseInt(splitTimer[1])
        }
        startTime = parseInt(seconds)
    } else {
        startTime = parseInt(timerValue)
    }

    timeToWait = startTime
    timeRunning = true

    document.getElementById("time-left").setAttribute("readonly", "")
    document.getElementById("set-time").innerText = legibleTime(startTime)
    document.getElementById("end-time").innerText = formateEndDate(startTime)
}

timeLeft.value = secondsToTime(startTime)

clock.style.transition = "1s cubic-bezier(.23,1,.32,1)"

document.getElementById("set-time").innerText = legibleTime(startTime)
document.getElementById("end-time").innerText = formateEndDate(startTime)

setInterval(function () {
    if (timeRunning && timeToWait >= 0) {
        timeToWait--;
        timeLeft.value = secondsToTime(timeToWait)

        updateClock(startTime, timeToWait)
    }
    if (!timeRunning) {
        document.getElementById("end-time").innerText = formateEndDate(startTime)
    }
}, 1000);

document.getElementById("timer-form").addEventListener("submit", function () {
    console.log(document.getElementById("time-left").value)
    startTimer()
})