
const content = document.getElementById("content");

const button = document.getElementById("GetButton");
const answerbutton = document.getElementById("ClickCorrectButton");

button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "QUESTIONS", data: "", pass: true});
    });
})
answerbutton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "ANSWER", data: "", pass: true});
    });
})




chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    
    
    if (message.type === "RES_QUESTIONS") {

        const questions = message.data;


        const currentQuestion = questions.questions[questions.currentQuestion];

        let currentCorrectOption = null

        for (const option of currentQuestion.options) {
            if (option.id === currentQuestion.correctid){
                currentCorrectOption = option;
                console.log("Correct option is")
                console.log(option)
            }
        }

        if (currentCorrectOption){
            button.textContent = "Correct Answer is: " + currentCorrectOption.displayname;
        }

        console.log(currentQuestion)

    }


  });
