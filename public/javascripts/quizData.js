import { getApi } from './api.js';


async function getQuizData(quizId) {
    return getApi(`/quiz/${quizId}`, 'GET', null, true)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);       
            }
        }) 
}

async function getQuestionData(questionId) {
    return getApi(`/questions/${questionId}`, 'GET', null, true)
        .then(res => {
            if (res.success) {
                return res.data.result.questions;
            } else {
                throw new Error(res.data.message);       
            }
        })  
}

async function getAnswerData(answerId) {
    return getApi(`/answers/${answerId}`, 'GET', null, true)
        .then(res => {
            if (res.success) {
                return res.data.result.answers;
            } else {
                throw new Error(res.data.message);       
            }
        }) 
}

async function quizAllQuestions(quizId) {
    return getApi(`/quiz/${quizId}/questions`, 'GET', null, true)
        .then(res => {
            if (res.success) {
                return res.data.result.questions;
            } else {
                throw new Error(res.data.message);       
            }
        }) 
}

export { getQuizData, getQuestionData, getAnswerData, quizAllQuestions };