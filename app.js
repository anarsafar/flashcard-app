//Flashcard costructor
function Flashcard(question, answer, flashcardId) {
  (this.question = question),
    (this.answer = answer),
    (this.flashcardId = Math.floor(Math.random() * 10000));
}

//UI consturctor
function UI() {}

//add flashcard to list
UI.prototype.addFlashcardToList = function (flashcard) {
  const list = document.getElementById("questions-list");

  var html = ` <div class="col-md-4">
                  <div class="card card-body flashcard my-3">
                    <h4 class="text-capitalize question">${flashcard.question}</h4>
                    <a href="#" class="text-capitalize my-3 show-answer">show/hide answer</a>
                    <h5 class="mb-3 answer" id="answer">${flashcard.answer}</h5>
                     <div class="flashcard-btn d-flex justify-content-between">
                       <a
                          href="#"
                          id="edit-flashcard"
                          class="btn btn-outline-primary my-1 edit-flashcard delete-flashcard text-uppercase"
                          data-id=""
                          >edit</a>
                      <a
                          href="#"
                          id="delete-flashcard"
                          data-id =${flashcard.flashcardId}
                          class="btn btn-outline-danger my-1 delete-flashcard text-uppercase"
                          >delete</a>
                  </div>
                </div>
               </div>`;

  list.innerHTML += html;
};

//open and close question form container
const open_form = document.getElementById("show_question");
const close_form = document.getElementById("close");
open_form.addEventListener("click", open);
close_form.addEventListener("click", close);

function open() {
  document.getElementById("show_div").style.display = "block";
}
function close() {
  document.getElementById("show_div").style.display = "none";
}

//hide and show
UI.prototype.showAndHide = function (element) {
  const answerQuestion = element.parentElement.children[2];
  if (answerQuestion.classList.contains("hide")) {
    answerQuestion.classList.remove("hide");
  } else {
    answerQuestion.classList.add("hide");
  }
};

//clear controls from textarea
UI.prototype.clearControls = function () {
  const text1 = (document.getElementById("Textarea1").value = "");
  const text2 = (document.getElementById("Textarea2").value = "");
};

//delete
UI.prototype.deleteFlasCard = function (element) {
  if (element.classList.contains("delete-flashcard")) {
    element.parentElement.parentElement.parentElement.remove();
    return true;
  }
};

//edit
UI.prototype.editFlashcard = function (element) {
  let question = element.parentElement.parentElement.children[0].innerHTML;
  let answer = element.parentElement.parentElement.children[2].innerHTML;
  const text1 = (document.getElementById("Textarea1").value = question);
  const text2 = (document.getElementById("Textarea2").value = answer);
};

//show alert prototype
UI.prototype.showAlert = function (message, className) {
  var alert = `
    <div class=" col-11 col-lg-6 mt-3 alert alert-${className}">
        ${message}
    </div> 
    `;

  const feedback = document.getElementById("Feedback");
  feedback.insertAdjacentHTML("afterBegin", alert);

  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
};

//main save function
document.getElementById("save").addEventListener("click", (e) => {
  const text1 = document.getElementById("Textarea1").value;
  const text2 = document.getElementById("Textarea2").value;

  //create flashcard object
  const flashcard = new Flashcard(text1, text2);

  //create UI
  const ui = new UI();

  if (text1 == "" || text2 == "") {
    ui.showAlert("Please complete the blank area", "warning");
  } else {
    //add flashcard to list
    ui.addFlashcardToList(flashcard);

    //add to LS
    Storage.addFlashcard(flashcard);
    //clear controls
    ui.clearControls();

    ui.showAlert("The item has been added", "success");
  }
  e.preventDefault();
});

document.getElementById("questions-list").addEventListener("click", (e) => {
  const ui = new UI();

  // ui.deleteFlasCard(e.target);
  if (ui.deleteFlasCard(e.target) == true) {
    // delete from LS
    Storage.deleteFlasCard(e.target);
    ui.showAlert("The flashcard has been deleted", "danger");
  }
  if (e.target.classList.contains("show-answer")) {
    ui.showAndHide(e.target);
  }
  if (
    e.target.classList.contains("edit-flashcard") &&
    e.target.classList.contains("delete-flashcard")
  ) {
    ui.editFlashcard(e.target);
    ui.deleteFlasCard(e.target);
  }
  e.preventDefault();
});

//LS storage
class Storage {
  static getFlashcards() {
    let flashcards;
    if (localStorage.getItem("flashcards") === null) {
      flashcards = [];
    } else {
      flashcards = JSON.parse(localStorage.getItem("flashcards"));
    }
    return flashcards;
  }

  static displayFlashcards() {
    const flashcards = Storage.getFlashcards();

    flashcards.forEach((flashcard) => {
      const ui = new UI();
      ui.addFlashcardToList(flashcard);
    });
  }

  static addFlashcard(flashcard) {
    const flashcards = Storage.getFlashcards();
    flashcards.push(flashcard);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }

  static deleteFlasCard(element) {
    if (element.classList.contains("delete-flashcard")) {
      const id = element.getAttribute("data-id");

      const flashcards = Storage.getFlashcards();

      flashcards.forEach((flashcard, index) => {
        if (flashcard.flashcardId == id) {
          flashcards.splice(index, 1);
        }
      });

      localStorage.setItem("flashcards", JSON.stringify(flashcards));
    }
  }
}

document.addEventListener("DOMContentLoaded", Storage.displayFlashcards);
