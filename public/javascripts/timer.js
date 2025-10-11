function startTimer(timeInSeconds, onTimeUp, onTick) {
    let timeRemaining = timeInSeconds;
    
    const timer = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds}`;

        if (onTick) {
            onTick(formattedTime, timeRemaining);
        }
        if (timeRemaining <= 0) {
            clearInterval(timer);
            if (onTimeUp) onTimeUp();
        }
    });
    
    return timer;
}

function stopTimer(timer) {
    if (timer) {
        clearInterval(timer);   
    }
}

export { startTimer, stopTimer };