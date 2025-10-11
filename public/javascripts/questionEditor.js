import { getApi } from './api.js';



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("newQuestion").addEventListener("click", () => {
        const questionModal = document.querySelector("dialog");
        questionModal.showModal();
        
        const newQuestion = document.createElement("tr");
        newQuestion.innerHTML = document.getElementById("add-question").innerHTML;
        questionList.appendChild(newQuestion);
    })
    
    document.querySelector(".question").addEventListener("submit", () => {
        event.preventDefault();
        const questionList = document.getElementById("question-maker");
        history.replaceState({ query: questionList.value }, '');
        performSearch();
    });
});