import { getApi } from "./api.js";

let inBrowserQuestions = [];

function addQuiz(quizData) {
  return getApi("quiz", "POST", quizData).then((res) => {
    if (res.success) {
      return res.data.result;
    } else {
      throw new Error(res.data.message);
    }
  });
}

// function getQuiz(id) {
//   return getApi(`quiz/${id}`, "GET", id).then((res) => {
//     if (res.success) {
//       return res.data.result;
//     } else {
//       throw new Error(res.data.message);
//     }
//   });
// }

// function deleteQuiz(id) {
//   return getApi(`quiz/${id}`, "DELETE", null, true).then((res) => {
//     if (res.success) {
//       return res.data.result;
//     } else {
//       throw new Error(res.data.message);
//     }
//   });
// }

// function addQuestion(questionData) {
//   return getApi("quiz/question", "POST", questionData).then((res) => {
//     if (res.success) {
//       return res.data.result;
//     } else {
//       throw new Error(res.data.message);
//     }
//   });
// }

// function getQuestion(id) {
//   return getApi(`quiz/question/${id}`, "GET", id).then((res) => {
//     if (res.success) {
//       return res.data.result;
//     } else {
//       throw new Error(res.data.message);
//     }
//   });
// }

// function updateQuestion(id) {
//   return getApi(`quiz/question/${id}`, "PUT", id).then((res) => {
//     if (res.success) {
//       return res.data.result;
//     } else {
//       throw new Error(res.data.message);
//     }
//   });
// }

// function deleteQuestion(id) {
//   return getApi(`quiz/question/${id}`, "DELETE", null, true).then((res) => {
//     if (res.success) {
//       return res.data.result;
//     } else {
//       throw new Error(res.data.message);
//     }
//   });
// }

// function renderQuestionList(questions) {
//   window.questionList = questions;
//   const questionList = document.querySelector("#questionTable tbody");
//   if (!questionList) {
//     console.error("Question list not found");
//     return;
//   }
//   questionList.innerHTML = "";

//   questions.forEach((question) => {
//     const row = document.createElement("tr");
//     const questionId = question._id || question.id;
//     row.innerHTML = `
//             <td>${question.question}</td>
//             <td>${question.answer}</td>
//             <td>${question.time}</td>
//             <td><button class="edit-question" data-id="${questionId}" data-question="${question.question}" data-answer="${question.answer}" data-time="${question.time}">Edit</button></td>
//             <td><button class="delete-question" data-id="${questionId}">Delete</button></td>
//         `;
//     questionList.appendChild(row);
//   });
// }

function clearQuestionForm() {
  document.getElementById("question").value = "";
  document.getElementById("answer").value = "";
  document.getElementById("time").value = "";
}

function saveNewQuestion() {
  const question = document.getElementById("question").value;
  const answer = document.getElementById("answer").value;
  const time = document.getElementById("time").value;

  if (!question || !answer || !time) {
    alert("Please fill in all fields");
    return;
  }

  const questionData = {
    question: question,
    answer: answer,
    time: time,
  };

  inBrowserQuestions.push(questionData);
  console.log("Question added locally:", questionData);

  const tbody = document.querySelector("#questionTable tbody");
  const row = document.createElement("tr");
  const localIndex = inBrowserQuestions.length - 1;
  row.innerHTML = `
        <td>${question}</td>
        <td>${answer}</td>
        <td>${time}</td>
        <td><button class="edit-question" data-index="${localIndex}" data-question="${question}" data-answer="${answer}" data-time="${time}" data-bs-toggle="modal" data-bs-target="#questionModal">Edit</button></td>
        <td><button class="delete-question" data-index="${localIndex}">Delete</button></td>
    `;
  tbody.appendChild(row);

  document.querySelector("dialog").close();
  clearQuestionForm();
}

document.addEventListener("DOMContentLoaded", () => {
  const newQuizBtn = document.getElementById("newQuiz");
  const questionContainer = document.getElementById("questionContainer");

  if (newQuizBtn) {
    newQuizBtn.addEventListener("click", () => {
      const quizName = document.getElementById("quizName").value;
      if (!quizName) {
        alert("Please enter a quiz name");
        return;
      } else {
        inBrowserQuestions = [];
        const quizNameContainer = document.getElementById("quizNameContainer");
        quizNameContainer.innerHTML = `<h3 id="theQuizName">${quizName}</h3>`;
        questionContainer.innerHTML = `
                            <p>
                                <button id="newQuestion" data-bs-toggle="modal" data-bs-target="#questionModal">Add question</button>
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
      }
    });
  }

  function getQuestionModal(mode, questionIndex = null) {
    const questionModal = document.getElementById("questionModal");
    if (mode === 'new') {
      clearQuestionForm();
    } else if (mode === 'edit') {
      const questionData = inBrowserQuestions[questionIndex];
      document.getElementById("question").value = questionData.question;
      document.getElementById("answer").value = questionData.answer;
      document.getElementById("time").value = questionData.time;
    }
    questionModal.showModal();
  }

  function eventListeners() {
    const newQuestionBtn = document.getElementById("newQuestion");
    const saveQuestionBtn = document.getElementById("saveNewQuestion");
    const saveQuizBtn = document.getElementById("saveQuiz");
    const questionTable = document.getElementById("questionTable");

    if (newQuestionBtn) {
      newQuestionBtn.addEventListener("click", () => {
        if (questionModal) {
          getQuestionModal('new');
        } else {
          console.error("Question modal not found");
        }
      });
    }

    // if (saveQuestionBtn) {
    //   saveQuestionBtn.addEventListener("click", () => {
    //     if (!questionModal) {
    //       console.error("Question modal not found");
    //       return;
    //     }
    //     saveNewQuestion();
    //   });
    // }

    if (questionTable) {
      questionTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-question")) {
          const question = event.target.getAttribute("data-question");
          const answer = event.target.getAttribute("data-answer");
          const time = event.target.getAttribute("data-time");

          document.getElementById("question").value = question;
          document.getElementById("answer").value = answer;
          document.getElementById("time").value = time;
          getQuestionModal('edit', parseInt(event.target.getAttribute("data-index")));
          if (saveQuestionBtn) {
            saveQuestionBtn.onclick = () => {
              const updatedQuestion = document.getElementById("question").value;
              const updatedAnswer = document.getElementById("answer").value;
              const updatedTime = document.getElementById("time").value;
              const index = parseInt(event.target.getAttribute("data-index"));

              if (!updatedQuestion || !updatedAnswer || !updatedTime) {
                alert("Please fill in all fields");
                return;
              }
              inBrowserQuestions[index] = {
                question: updatedQuestion,
                answer: updatedAnswer,
                time: updatedTime,
              };
              console.log("Question updated locally at index:", index);
              const row = event.target.closest("tr");
              row.innerHTML = `
                    <td>${updatedQuestion}</td>
                    <td>${updatedAnswer}</td>
                    <td>${updatedTime}</td>
                    <td><button class="edit-question" data-index="${index}" data-question="${updatedQuestion}" data-answer="${updatedAnswer}" data-time="${updatedTime}" data-bs-toggle="modal" data-bs-target="#questionModal">Edit</button></td>
                    <td><button class="delete-question" data-index="${index}">Delete</button></td>
                `;
              document.querySelector("dialog").close();
              clearQuestionForm();
            }
          }
        } else if (event.target.classList.contains("delete-question")) {
            const index = parseInt(event.target.getAttribute("data-index"));
            inBrowserQuestions.splice(index, 1);
            console.log("Question deleted locally at index:", index);
            event.target.closest("tr").remove();

            const rows = questionTable.querySelectorAll("tbody tr");
            rows.forEach((row, i) => {
              const editBtn = row.querySelector(".edit-question");
              const deleteBtn = row.querySelector(".delete-question");
              if (editBtn) {
                editBtn.setAttribute("data-index", i);
              }
              if (deleteBtn) {
                deleteBtn.setAttribute("data-index", i);
              }
            });
          }
      });
    }

    if (saveQuizBtn) {
      saveQuizBtn.addEventListener("click", () => {
        const quizName = document.getElementById("theQuizName").innerText;
        if (!quizName) {
          alert("Please enter a quiz name");
          return;
        }

        if (!inBrowserQuestions || inBrowserQuestions.length === 0) {
          alert("Please add at least one question before saving the quiz");
          return;
        }

        const quizData = {
          name: quizName,
          questions: inBrowserQuestions,
        };

        addQuiz(quizData)
          .then((res) => {
            console.log("Quiz saved:", res);
            alert("Quiz saved successfully!");

            const quizId = res.id;
            window.location.href = `/quiz/${quizId}`;
            console.log("Redirecting to quiz page with ID:", quizId);
          })
          .catch((err) => {
            console.error("Error saving quiz", err.message || err);
            alert("Error saving quiz: " + (err.message || err));
          });
      });
    }
  }
});
