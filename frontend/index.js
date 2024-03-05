async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear - 1}`;
  let cardsDiv = document.querySelector(".cards");
  let infoP = document.querySelector(".info");
  function selectedCard() {return document.querySelector(".selected")};

  function cardMaker(name, id, email, mentors) {
    //make card
    let newCard = document.createElement("div");
    let newName = document.createElement("h3");
    let newEmail = document.createElement("div");
    let newMentors = document.createElement("h4");
    let newList = document.createElement("ul");
    let elementsArray = [newName, newEmail, newMentors, newList]
    elementsArray.forEach(element => {
      newCard.appendChild(element);
    });
    for (let i in mentors) {
      let newMentor = document.createElement("li");
      newMentor.textContent = mentors[i];
      newList.appendChild(newMentor);
    };
    // add classes, listeners, and content
    newCard.classList.add("card");
    newMentors.classList.add("closed");
     newCard.addEventListener("click", (event) =>{
       let deselect = event.currentTarget.classList.contains("selected")
        && !event.target.classList.contains("open")
        && !event.target.classList.contains("closed");
       if (selectedCard()) {
         selectedCard().classList.remove("selected")
       };
       event.currentTarget.classList.add("selected");
       if (deselect) {event.currentTarget.classList.remove("selected")};
     });
    newMentors.addEventListener("click", (event) => {
      event.target.classList.toggle("open");
      event.target.classList.toggle("closed");
    });
    newName.textContent = `${name}, ID ${id}`;
    newEmail.textContent = email;
    newMentors.textContent = "Mentors";
    return newCard;
  }

  let learnerInfo = axios.get("http://localhost:3003/api/learners")
    .catch(error => console.log(error.message));
  let mentorInfo = axios.get("http://localhost:3003/api/mentors")
    .catch(error => console.log(error.message));
  Promise.all([learnerInfo, mentorInfo])
    .then(infoArray => {
      let learnersArray = infoArray[0].data;
      let mentorsArray = infoArray[1].data;
      let mentorNames = mentorsArray.map(mentor => {
        return {id: mentor.id, name: `${mentor.firstName} ${mentor.lastName}`}
      });
      let learnersWithMentors = learnersArray.map(learner => {
        let learnerMentors = [];
        learner.mentors.forEach(teacherId => {
          mentorNames.forEach(mentor => {
            if (teacherId === mentor.id) {
              learnerMentors.push(mentor.name);
            };
          });
        });
        learner.mentors = learnerMentors;
        return learner;
      });
      let learnerCards = learnersWithMentors.map(learner => {
        return cardMaker(learner.fullName, learner.id, learner.email, learner.mentors);
      });
      learnerCards.forEach(card => cardsDiv.appendChild(card));

      function infoPText() {
        if (selectedCard()) {
          let selectedTitle = selectedCard().children[0].textContent
          let selectedName = selectedTitle.slice(0, selectedTitle.indexOf(","))
          infoP.textContent = `The selected learner is ${selectedName}`
        }
        else {
          infoP.textContent = "No learner is selected"
        }
      };
      infoP.textContent = "No learner is selected"
      cardsDiv.addEventListener("click", ()=> infoPText())
    })


  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
