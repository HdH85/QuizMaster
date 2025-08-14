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