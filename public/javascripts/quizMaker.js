import { getApi } from './api.js';

function addQuiz(quizData) {
    return getApi('quiz', 'POST', quizData)
    .then(res => {
        if (res.success) {
            return res.data.result;
        } else {
            throw new Error(res.data.message);       
        }
    });
}

function getQuiz(id) {
    return getApi(`quiz/${id}`, 'GET', id)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);
            }
        });
}

function deleteQuiz(id) {
    return getApi(`quiz/${id}`, 'DELETE', null, true)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);
            }
        });
}

function addQuestion(questionData) {
    return getApi('quiz/question', 'POST', questionData)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);       
            }
        })
}

function getQuestion(id) {
    return getApi(`quiz/question/${id}`, 'GET', id)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);
            }
        })
}

function updateQuestion(id) {
    return getApi(`quiz/question/${id}`, 'PUT', id)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);
            }
        })
}

function deleteQuestion(id) {
    return getApi(`quiz/question/${id}`, 'DELETE', null, true)
    .then(res => {
        if (res.success) {
            return res.data.result;
        } else {
            throw new Error(res.data.message);
        }
    })
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
        const questionId = question._id || question.id;
        row.innerHTML = `
            <td>${question.question}</td>
            <td>${question.answer}</td>
            <td>${question.time}</td>
            <td><button class="edit-question" data-id="${questionId}" data-question="${question.question}" data-answer="${question.answer}" data-time="${question.time}">Edit</button></td>
            <td><button class="delete-question" data-id="${questionId}">Delet   e</button></td>
        `;
        questionList.appendChild(row);
    });
}

function clearQuestionForm() {
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
    document.getElementById('time').value = '';
}

function newQuestion() {
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
    document.getElementById('time').value = '';
    
    
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
        question: question,
        answer: answer,
        time: time
    };

    addQuestion(questionData)
        .then(res => {
            console.log('New question added:' + res);

            const tbody = document.querySelector('#questionTable tbody');
            const row = document.createElement('tr');
            const questionId = res._id || res.id;
            row.innerHTML = `
            <td>${question}</td>
            <td>${answer}</td>
            <td>${time}</td>
            <td><button class="edit-question" data-id="${questionId}" data-question="${question}" data-answer="${answer}" data-time="${time}">Edit</button></td>
            <td><button class="delete-question" data-id="${questionId}">Delete</button></td>
            `;
            tbody.appendChild(row);

            document.querySelector('dialog').close();
            clearQuestionForm();
        })
        .catch(err => {
            console.error('Error saving question', err.message || err);
        });
    }

document.addEventListener('DOMContentLoaded', () => {
    const newQuizBtn = document.getElementById('newQuiz');
    const questionContainer = document.getElementById('questionContainer');

    if (newQuizBtn) {
        newQuizBtn.addEventListener('click', () => {
            const quizName = document.getElementById('quizName').value;
            if (!quizName) {
                alert('Please enter a quiz name');
                return;
            } else {
                const name = {
                    name: quizName
                };
                addQuiz(name)
                    .then(res => {
                        console.log('Quiz added:' + res);
                        const quizNameContainer = document.getElementById('quizNameContainer');
                        quizNameContainer.innerHTML = `<h3>${quizName}</h3>`;
                        questionContainer.innerHTML = `
                            <p>
                                <button id="newQuestion">Add question</button>
                            </p>
                            <p>
                            <div id="tableContainer">
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
                            </div>
                            </p>
                            <p></p>
                            <a>
                                <button id="saveQuiz">Save quiz</button>
                            </a>
                        `;
                        quizNameContainer.appendChild(questionContainer);

                        eventListeners();
                    })
                    .catch(err => {
                        console.error('Error adding quiz', err.message || err);
                    });
                }
        });
    }

    function eventListeners() {
        const newQuestionBtn = document.getElementById('newQuestion');
        const saveQuestionBtn = document.getElementById('saveNewQuestion');
        const saveQuizBtn = document.getElementById('saveQuiz');
        const questionModal = document.querySelector("dialog");
        const questionTable = document.getElementById('questionTable');

        if (newQuestionBtn) {
            newQuestionBtn.addEventListener('click', () => {
                if (questionModal) {
                    questionModal.showModal();
                } else {
                    console.error('Question modal not found');
                }
            });
        }

        if (saveQuestionBtn) {
            saveQuestionBtn.addEventListener('click', () => {
                if (!questionModal) {
                    console.error('Question modal not found');
                    return;
                }
                saveNewQuestion();
            });
        }

        if (questionTable) {
            questionTable.addEventListener('click', (event) => {
                if (event.target.classList.contains('edit-question')) {
                    const question = event.target.getAttribute('data-question');
                    const answer = event.target.getAttribute('data-answer');
                    const time = event.target.getAttribute('data-time');

                    document.getElementById('question').value = question;
                    document.getElementById('answer').value = answer;
                    document.getElementById('time').value = time;
                } else if (event.target.classList.contains('delete-question')) {
                    const questionId = event.target.getAttribute('data-id');
                    deleteQuestion(questionId)
                        .then(res => {
                            console.log('Question deleted: ' + res);
                            event.target.closest('tr').remove();
                        })
                        .catch(err => {
                            console.error('Error deleting question', err.message || err);
                        });
                }
            });
        }
    
        if (saveQuizBtn) {
            saveQuizBtn.addEventListener('click', () => {
                const quizName = document.getElementById('quizName').value;
                if (!quizName) {
                    alert('Please enter a quiz name');
                    return;
                }
                const questions = [];
                const questionRows = document.querySelectorAll('#questionTable tbody tr');
                questionRows.forEach(row => {
                    const question = row.querySelector('td:nth-child(1)').innerText;
                    const answer = row.querySelector('td:nth-child(2)').innerText;
                    const time = row.querySelector('td:nth-child(3)').innerText;
                    questions.push({ question, answer, time });
                });
                const quizData = { name: quizName, questions };
                addQuiz(quizData)
                    .then(res => {
                        console.log('Quiz saved:', res);
                        alert('Quiz saved successfully!');
                    })
                    .catch(err => {
                        console.error('Error saving quiz', err.message || err);
                    });
            });
        }
    }
});