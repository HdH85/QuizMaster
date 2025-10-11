import { getApi } from './api.js';

function addQuiz(quizData) {
    return getApi('/quiz', 'POST', quizData, true)
    .then(res => {
        if (res.success) {
            return res.data.result;
        } else {
            throw new Error(res.data.message);       
        }
    });
}

function addQuestion(questionData) {
    return getApi('/question', 'POST', questionData, true)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);       
            }
        })
}

function getQuiz(id) {
    return getApi('/quiz' + id, 'GET', null, true)
    .then(res => {
        if (res.success) {
            return res.data.result;
        } else {
            throw new Error(res.data.message);       
        }
    });   
}

function deleteQuiz(id) {
    return getApi('/quiz' + id, 'DELETE', null, true)
    .then(res => {
        if (res.success) {
            return res.data.result;
        } else {
            throw new Error(res.data.message);       
        }
    });   
}

function renderQuestionList(questions) {
    window.questionList = questions;
    const questionList = document.querySelector('#questionTable tbody');
    if (!questionList) {
        console.error('Question list not found');
        return;
    }
    questionList.innerHTML = '';
    
    questions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${question.question}</td>
            <td>${question.answer}</td>
            <td>${question.time}</td>
            <td><button class="edit-question">Edit</button></td>
            <td><button class="delete-question">Delete</button></td>
        `;
        questionList.appendChild(row);
    });
}

function newQuestion() {
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
    document.getElementById('time').value = '';
    
    const questionTable = document.getElementById('questionTable');
    if (!questionTable) {
        const tableContainer = document.getElementById('tableContainer');
        tablecontainer.innerHTML = `
            <table id="questionTable">
                <thead>
                <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Time</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            `;
    }
}

function editQuestion(question) {
    document.querySelector('.edit-question').forEach(button => {
        button.addEventListener('click', () => {
            const question = this.getAttribute('data-question');
            const answer = this.getAttribute('data-answer');
            const time = this.getAttribute('data-time');
            
            document.getElementById('question').value = question;
            document.getElementById('answer').value = answer;
            document.getElementById('time').value = time;
        });
    });
}

function saveNewQuestion() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const time = document.getElementById('time').value;
    
    const questionData = {
        id: id,
        question: question,
        answer: answer,
        time: time
    };
    
    addQuestion(questionData)
        .then(res => {
            window.location.reload();
            console.log('New question added' + res);
        })
        .catch(err => {
            console.error(err.message);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const questionModal = document.querySelector("dialog");
    const newQuestion = document.getElementById("newQuestion");
    const saveNewQuestionBtn = document.getElementById("saveNewQuestion");
    const closeModalBtn = document.getElementById("close");
    
    if (newQuestion) {
        newQuestion.addEventListener('click', () => {
            questionModal.showModal();
        });
    }
    
    if (saveNewQuestionBtn) {
        saveNewQuestionBtn.addEventListener('click', () => {
            saveNewQuestion();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            questionModal.close();
        });
    }
});