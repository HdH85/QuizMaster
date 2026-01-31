import { getApi } from './api.js';

function addQuiz(quizData) {
  return getApi("quiz", "POST", quizData).then((res) => {
    if (res.success) {
      return res.data.result;
    } else {
      throw new Error(res.data.message);
    }
  });
}

function getQuizData(Id) {
    return getApi(`/quiz/${Id}`, 'GET', Id, true)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);       
            }
        }) 
}

function deleteQuiz(id) {
  return getApi(`quiz/${id}`, "DELETE", null, true).then((res) => {
    if (res.success) {
      return res.data.result;
    } else {
      throw new Error(res.data.message);
    }
  });
}

function getQuestion(Id) {
    return getApi(`/questions/${Id}`, 'GET', Id, true)
        .then(res => {
            if (res.success) {
                return res.data.result;
            } else {
                throw new Error(res.data.message);       
            }
        })  
}

function updateQuestion(id) {
  return getApi(`quiz/question/${id}`, "PUT", id).then((res) => {
    if (res.success) {
      return res.data.result;
    } else {
      throw new Error(res.data.message);
    }
  });
}

function deleteQuestion(id) {
  return getApi(`quiz/question/${id}`, "DELETE", null, true).then((res) => {
    if (res.success) {
      return res.data.result;
    } else {
      throw new Error(res.data.message);
    }
  });
}

function getAnswer(Id) {
    return getApi(`/question/${Id}`, 'GET', Id, true)
        .then(res => {
            if (res.success) {
                return res.data.result.answers;
            } else {
                throw new Error(res.data.message);       
            }
        }) 
}

function quizAllQuestions(quizId) {
    return getApi(`/quiz/${quizId}/questions`, 'GET', null, true)
        .then(res => {
            if (res.success) {
                return res.data.result.questions;
            } else {
                throw new Error(res.data.message);       
            }
        }) 
}

export { addQuiz,getQuizData, deleteQuiz, getQuestion, updateQuestion, deleteQuestion, getAnswer, quizAllQuestions };