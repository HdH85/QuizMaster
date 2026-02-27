function startTimer(timeInSeconds, onTick) {
    let timeRemaining = timeInSeconds;
    
    const timer = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        onTick(formattedTime, timeRemaining);
        if (timeRemaining <= 0) {
            clearInterval(timer);
        }
    }, 1000);
    
    return timer;
}

function stopTimer(timer) {
    if (timer) {
        clearInterval(timer);   
    }
}

export { startTimer, stopTimer };