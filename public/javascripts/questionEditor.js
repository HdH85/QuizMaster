document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add").addEventListener("click", () => {
        const questionList = document.getElementById("question-maker");
        const newQuestion = document.createElement("div");
        newQuestion.className= "question";
        newQuestion.innerHTML = `
        <input type="text" name="question" placeholder="Question">
        <input type="text" name="answer" placeholder="Answer">
        <input type="number" name="time" placeholder="Time (min.)">
        <p></p>`
        
        questionList.appendChild(newQuestion);
    })
    
    document.querySelector(".question").addEventListener("submit", () => {
        event.preventDefault();
        const questionList = document.getElementById("question-maker");
        history.replaceState({ query: questionList.value }, '');
        performSearch();
    });
});