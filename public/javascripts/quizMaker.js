import { addQuiz } from "./quizData.js";

document.addEventListener("DOMContentLoaded", () => {

  let inBrowserQuestions = [];

  function clearQuestionForm() {
    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";
    document.getElementById("time").value = "";
  }

  function saveState() {
    const quizName = document.getElementById('theQuizName').value;
    const quizData = {
      name: quizName,
      questions: inBrowserQuestions,
      timeStamp: Date.now()
    };

    sessionStorage.setItem('unsavedQuiz', JSON.stringify(quizData));
    console.log('Quiz state saved to sessionStorage:', quizData);
  }

  function getSavedState() {
    const savedQuiz = sessionStorage.getItem('unsavedQuiz');
    const parsedQuiz = JSON.parse(savedQuiz);
    if (!parsedQuiz) {
      return null;
    } else if (Date.now() - parsedQuiz.timeStamp > 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem('unsavedQuiz');
      return null;
    } else {
      return parsedQuiz;
    }
  }

  function clearState() {
    sessionStorage.removeItem('unsavedQuiz');
    console.log('Quiz state cleared from sessionStorage');
  }

  const newQuizBtn = document.getElementById("newQuiz");
  const savedQuiz = getSavedState();
  const quizNameContainer = document.getElementById("quizNameContainer");
  const questionContainer = document.getElementById("questionContainer");

  if (savedQuiz && savedQuiz.questions && savedQuiz.questions.length > 0) {
    const restore = confirm("You have an unsaved quiz. Would you like to restore it?");
    if (restore) {
      document.getElementById("theQuizName").value = savedQuiz.name;
      inBrowserQuestions = savedQuiz.questions;
      quizNameContainer.innerHTML = `<h3 id="theQuizName">${savedQuiz.name}</h3>`;
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

      const tbody = document.querySelector("#questionTable tbody");
      savedQuiz.questions.forEach((q, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${q.question}</td>
                <td>${q.answer}</td>
                <td>${q.time}</td>
                <td><button class="edit-question" data-index="${index}" data-question="${q.question}" data-answer="${q.answer}" data-time="${q.time}" data-bs-toggle="modal" data-bs-target="#questionModal">Edit</button></td>
                <td><button class="delete-question" data-index="${index}">Delete</button></td>
            `;
        tbody.appendChild(row);
      });

      eventListeners();
    } else {
      clearState();
    }
  }

  if (newQuizBtn) {
    newQuizBtn.addEventListener("click", () => {
      const quizName = document.getElementById("quizName").value;
      if (!quizName) {
        alert("Please enter a quiz name");
        return;
      } else {
        inBrowserQuestions = [];
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

  function eventListeners() {
    const newQuestionBtn = document.getElementById("newQuestion");
    const saveQuestionBtn = document.getElementById("saveNewQuestion");
    const saveQuizBtn = document.getElementById("saveQuiz");
    const questionTable = document.getElementById("questionTable");
    const deleteQuestionBtn = document.getElementById("delete-question");
    const editQuestionBtn = document.getElementById("edit-question");
    const questionModal = document.getElementById("add-question");
    const playBtn = document.getElementById("playQuiz");

    if (newQuestionBtn) {
      newQuestionBtn.addEventListener("click", (e) => {
        if (questionModal) {
           e.preventDefault();
          questionModal.showModal();
        } else {
          console.error("Question modal not found");
        }
      });
    }

    if (saveQuestionBtn) {
        saveQuestionBtn.addEventListener("click", (e) => {
          e.preventDefault();

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
          saveState();
          console.log("Question added/edited locally:", inBrowserQuestions);

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
          questionModal.close();
          clearQuestionForm();
        });
    }

    if (deleteQuestionBtn) {
      deleteQuestionBtn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        inBrowserQuestions.splice(index, 1);
        console.log("Question deleted locally at index:", index);
        e.target.closest("tr").remove();
        saveState();
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
      });
    }

    if (editQuestionBtn) {
      editQuestionBtn.addEventListener("click", (e) => {
        const questionIndex = parseInt(e.target.getAttribute("data-index"));
        getQuestionModal('edit', questionIndex);
      });
    }

    if (questionTable) {
      questionTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-question")) {
          const index = parseInt(e.target.getAttribute("data-index"));
          inBrowserQuestions.splice(index, 1);
          console.log("Question deleted locally at index:", index);
          saveState();
          e.target.closest("tr").remove();
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
            clearState();
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

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        const quizId = playBtn.getAttribute("data-quiz-id");
        window.location.href = `/playQuiz/${quizId}`;
      });
    }
  }
});
