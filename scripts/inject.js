
window.addEventListener('message', function(event) {
   
    if (event.data.type && event.data.type == 'QUESTIONS') {
        window.postMessage({ type: 'QUESTIONS_RESPONSE', text: GetQuestions() }, '*');
    }
    if (event.data.type && event.data.type == 'ANSWER') {
        AnswerCorrect();
    }
    
});

var MacroRunning = false

document.addEventListener("keydown", (e) => {
    console.log(e.key)
    if (e.key == "Enter"){
        AnswerCorrect();
    }

    if (e.key == "A" && e.shiftKey){
        console.log("Toggling Macro")
        MacroRunning = !MacroRunning
    }
})

setInterval(() => {
    if (MacroRunning){
        try {
            AnswerCorrect();
        } catch (error) {
            
        }
        try {
            PressContinue();
        } catch (error) {
            
        }
        try {
            PressPlayAgain();
        } catch (error) {
            
        }
    }
}, 100);

document.addEventListener("keypress", (e) => {
    console.log(e.key)
    if (e.key == "Enter"){
        try {
            AnswerCorrect();
        } catch (error) {
            
        }
    }
})

function deleteObj(obj){
    for (const child of obj.children) {
        deleteObj(child)
    }
    renderer.destroyObject(obj)
}

function PressContinue() {
    console.log("ASJFHaksdhfahsdjfhasdfjhasdfkhaskdjhfashdfhasdhfhkajsdhfhk")
    for (let obj of renderer.baseGraphicObjectsList) {
        if (obj.text === "Continua" || obj.text === "Continue") { 
            obj.graphicsObject.parent.click()
            
            deleteObj(obj.graphicsObject.parent)
        }
    }
}

function PressPlayAgain() {for (let obj of renderer.baseGraphicObjectsList) {
    if (obj.text === "Play again" || obj.text === "Gioca ancora") { obj.graphicsObject.parent.click(); deleteObj(obj.graphicsObject.parent)}
}}

function GetQuestions(){

    const languagenutControllerObject = window.languagenutControllerObject;


    var response = {
        currentQuestion: languagenutControllerObject.currentQuestionIndex,
        questions: []
    }
    
    for (const question of languagenutControllerObject.questions) {
        let _question = {
            
            correctid: question.correctVocab.contentUid,
            options: []
        }

        for (const option of question.options) {
            _question.options.push({
                isCorrect: option.option.contentUid === question.correctVocab.contentUid,
                id: option.option.contentUid,
                name: option.option.learningWord,
                displayname: option.option.interfaceWord
            });
        }

        response.questions.push(_question)
    }

    return response;
}

renderer.olddraw = renderer.drawScreen;

renderer.drawScreen = function(){
    try {
        HighlightCorrect()
    } catch (error) {
        
    }
    renderer.olddraw()
    console.log("Drawing hook")
    
    
}

setInterval(() => {
    try {
        HighlightCorrect()
    } catch (error) {
        
    }
}, 100);

function HighlightCorrect(){
    if (languagenutControllerObject.questions != null){
        HighlightMultiChoice();
    }
    
    if (languagenutControllerObject.bubbles.length > 0){
        HighlightBubble();
    }

    if (languagenutControllerObject.cardDisplay != null){
        HighlightWriting();
    }
}

function AnswerCorrect(){

    if (languagenutControllerObject.questions != null){
        AnswerMultiChoice();
    }

    if (languagenutControllerObject.bubbles){
        AnswerBubble();
    }
    
    if (languagenutControllerObject.cardDisplay != null){
        AnswerWriting();
    }
    renderer.drawScreen();
}

function HighlightWriting(){
    languagenutControllerObject.cardDisplay.graphicsObjects[languagenutControllerObject.cardDisplay.graphicsObjects.length-1].children[3].setText(languagenutControllerObject.currentContent.learningWord);
}

function AnswerWriting(){

    console.log(languagenutControllerObject.currentContent.learningWord);

    
    languagenutControllerObject.wordPodInput.graphicsObject.value = languagenutControllerObject.currentContent.learningWord;
}

function HighlightBubble(){
    for (const bubble of languagenutControllerObject.bubbles) {
        if (bubble.vocab.contentUid === languagenutControllerObject.answer.contentUid){
            bubble.compObject.children[1].setStyle({
                "font": "Poppins",
                "fontSize": 32,
                "fill": "black",
                "strokeThickness": 0,
                "variant": 600,
                "align": "center"
            });
        }
    }
}

function AnswerBubble(){
    for (const bubble of languagenutControllerObject.bubbles) {
        if (bubble.vocab.contentUid === languagenutControllerObject.answer.contentUid){
            bubble.compObject.clickEvent();
        }
    }
}

function AnswerMatching(){
    for (const match of languagenutControllerObject.matchObjects){
        match.setMode("correct");
    }

    languagenutControllerObject.gameData.callback()

    
}

function HighlightMultiChoice(){
    const questions = GetQuestions();

    let correctLabel = ""

    for (const option of questions.questions[questions.currentQuestion].options) {
            
        if (option.isCorrect){
            correctLabel = option.displayname;
        }
    }
    
    for (const obj of renderer.baseGraphicObjectsList){
         
        if (obj.text === correctLabel){
            console.log(obj)
            obj.graphicsObject.alpha = 0.75
            
        }
        
        
    }
}

function AnswerMultiChoice(){
    const questions = GetQuestions();

    let correctLabel = ""

    for (const option of questions.questions[questions.currentQuestion].options) {
            
        if (option.isCorrect){
            correctLabel = option.displayname;
        }
    }
    
    for (const obj of renderer.baseGraphicObjectsList){
         
        if (obj.text === correctLabel){
            console.log(obj)
            obj.graphicsObject.click()
        }
        
        
    }
}
