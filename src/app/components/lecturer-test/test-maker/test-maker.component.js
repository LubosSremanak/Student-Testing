import {Component} from "../../../shared/model/component/component.js";
import {keyGeneratorService} from "../../../api/key-generator/services/key-generator.service.js";
import {testsService} from "../../../api/tests/services/tests.service.js";
import {domService} from "../../../shared/services/dom.service.js";
import {snackbarService} from "../../../shared/services/snackbar.service.js";


const component = {
    selector: 'app-test-maker',
    templatePath: 'lecturer-test/test-maker/test-maker.component.html',
    stylePaths: ['lecturer-test/test-maker/test-maker.component.css'],
};

export class TestMakerComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
    }

    onInit() {
        this.questionsContainer = this.dom.getElementById("question-creator-container");
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {


    }

    eventsInitializer() {
        this.initButtons();
        const submitButton = this.dom.getElementById("submit");
        submitButton.addEventListener("click", this.sendTest);
    }

    initButtons() {
        const addMultiChoiceButton = this.dom.getElementById("add-multichoice-button");
        addMultiChoiceButton.addEventListener("click", this.createMultiChoiceQuestion);
        const addOpenAnswerQuestionButton = this.dom.getElementById("add-open-answer-button");
        addOpenAnswerQuestionButton.addEventListener("click", this.createOpenAnswerQuestion);
        const addPairQuestionButton = this.dom.getElementById("add-pair-question-button");
        addPairQuestionButton.addEventListener("click", this.createPairQuestion);
        const addDrawQuestionButton = this.dom.getElementById("add-draw-question-button");
        addDrawQuestionButton.addEventListener("click", this.createDrawQuestion);
        const addMathQuestionButton = this.dom.getElementById("add-math-question-button");
        addMathQuestionButton.addEventListener("click", this.createMathQuestion);
    }

    createMultiChoiceQuestion = () => {
        const question = document.createElement("APP-MULTIPLE-ANSWER-QUESTION-CREATOR");
        this.appendQuestionAndScroll(question);
    }

    createOpenAnswerQuestion = () => {
        const question = document.createElement("APP-ONE-ANSWER-QUESTION-CREATOR");
        this.appendQuestionAndScroll(question);
    };

    createPairQuestion = () => {
        const question = document.createElement("APP-PAIR-QUESTION-CREATOR");
        this.appendQuestionAndScroll(question);
    };

    createDrawQuestion = () => {
        const question = document.createElement("APP-DRAW-QUESTION-CREATOR");
        this.appendQuestionAndScroll(question);
    };

    createMathQuestion = () => {
        const question = document.createElement("APP-MATH-QUESTION-CREATOR");
        this.appendQuestionAndScroll(question);
    };

    appendQuestionAndScroll(question) {
        this.questionsContainer.appendChild(question);
        question.scrollIntoView();
    }

    sendTest = () => {


        if(this.isFilledInformationAboutTest() && this.isCreatedSomeQuestion() && this.isCorrectAllQuestion())
        {
            keyGeneratorService.readGeneratedKey()
                .then(this.sendTestWithKey)
        }

    }

    sendTestWithKey = (json) => {
        const testName = this.dom.getElementById("test-name").value;
        const timeLimit = this.dom.getElementById("time-limit").value;
        const questions = this.getAllQuestions();
        const key = json.response.key;

        const test = {
            name: testName,
            timeLimit: timeLimit,
            questions: questions
        }

        testsService.createTest(key, test)
            .then(this.updateTable);
    }

    updateTable = () => {
        domService.createAndEmitEvent(document, 'updateAllTests', true);
    };

    getAllQuestions() {
        const allQuestions = [];
        const allCreators = this.questionsContainer.getElementsByTagName("*");
        for (let question of allCreators) {
            const questionInfo = this.getQuestionInfo(question);
            allQuestions.push(questionInfo);
        }

        return allQuestions;
    }

    getQuestionInfo(question) {
        let questionInfo;

        if (question.tagName === 'APP-MULTIPLE-ANSWER-QUESTION-CREATOR') {
            questionInfo = this.getMultiChoiceQuestionInfo(question);
        } else if (question.tagName === 'APP-MATH-QUESTION-CREATOR') {
            questionInfo = this.getMathQuestionInfo(question);
        } else if (question.tagName === 'APP-ONE-ANSWER-QUESTION-CREATOR') {
            questionInfo = this.getOneAnswerQuestionInfo(question);
        } else if (question.tagName === 'APP-PAIR-QUESTION-CREATOR') {
            questionInfo = this.getPairQuestionInfo(question);
        } else if (question.tagName === 'APP-DRAW-QUESTION-CREATOR') {
            questionInfo = this.getDrawQuestionInfo(question);
        }
        return questionInfo;
    }

    getMultiChoiceQuestionInfo(question) {
        const data = question.getInfo();
        return {type: "multiChoice", data: data};
    }

    getMathQuestionInfo(question) {
        const data = question.getInfo();
        return {type: "math", data: data};
    }

    getOneAnswerQuestionInfo(question) {
        const data = question.getInfo();
        return {type: "oneAnswerQuestion", data: data};
    }

    getPairQuestionInfo(question) {
        const data = question.getInfo();
        return {type: "pairQuestion", data: data};
    }

    getDrawQuestionInfo(question) {
        const data = question.getInfo();
        return {type: "draw", data: data};
    }


    isCreatedSomeQuestion()
    {
        const allCreators = this.questionsContainer.getElementsByTagName("*");

        if(allCreators.length === 0)
        {
            this.showWarningMessage("Nebola vytvorená žiadna otázka",3);
            return false;
        }

        return true;
    }

    isCorrectAllQuestion()
    {
        const allCreators = this.questionsContainer.getElementsByTagName("*");
        for (let question of allCreators) {
            if(!this.checkQuestionInfo(question))
                return false;
        }

        return true;
    }


    checkQuestionInfo(question)
    {
        if (question.tagName === 'APP-MULTIPLE-ANSWER-QUESTION-CREATOR') {
            return this.checkMultiChoiceQuestionInfo(question);
        } else if (question.tagName === 'APP-MATH-QUESTION-CREATOR') {
            return this.checkMathQuestionInfo(question);
        } else if (question.tagName === 'APP-ONE-ANSWER-QUESTION-CREATOR') {
            return this.checkOneAnswerQuestionInfo(question);
        } else if (question.tagName === 'APP-PAIR-QUESTION-CREATOR') {
            return this.checkPairQuestionInfo(question);
        } else if (question.tagName === 'APP-DRAW-QUESTION-CREATOR') {
            return this.checkDrawQuestionInfo(question);
        }

    }


    checkMultiChoiceQuestionInfo(question) {
        const data = question.getInfo();

        if(typeof data.question === 'undefined' || data.question === null || data.question.trim() === "")
        {
            this.wrongQuestionText("Výber správnej odpovede");
            return false;
        }

        if(typeof data.points === 'undefined' || data.points === null || data.points.trim() === "")
        {
            this.wrongQuestionPoints("Výber správnej odpovede");
            return false;
        }

        if(typeof data.answers === 'undefined' || data.answers === null || data.answers.length < 1)
        {
            this.showWarningMessage("Neboli zadané žiadne možnosti (Výber správnej odpovede)",3);
            return false;
        }

        if(!this.checkChoices(data.answers))
        {
            this.showWarningMessage("Pole možnosti odpovede je prázdne (Výber správnej odpovede)",3);
            return false;
        }

        if(!this.checkMinimumOneCorrectAnswer(data.answers))
        {
            this.showWarningMessage("Žiadna z možnosti nebola označená ako správna (Výber správnej odpovede)",3);
            return false;
        }

        return true;
    }

    checkChoices(choices)
    {
        for(let i = 0; i < choices.length;i++)
        {
            if(typeof choices[i].answerText === 'undefined' || choices[i].answerText === null || choices[i].answerText.trim() === "")
            {
                return false;
            }
        }

        return true;
    }

    checkMinimumOneCorrectAnswer(choices)
    {
        for(let i = 0; i < choices.length;i++)
        {
            if(choices[i].checked)
            {
                return true;
            }
        }

        return false;
    }

    checkMathQuestionInfo(question) {
        const data = question.getInfo();

        if(typeof data.question === 'undefined' || data.question === null || data.question.trim() === "")
        {
            this.wrongQuestionText("Odpoveď pomocou matematického výrazu");
            return false;
        }

        if(typeof data.points === 'undefined' || data.points === null || data.points.trim() === "")
        {
            this.wrongQuestionPoints("Odpoveď pomocou matematického výrazu");
            return false;
        }

        return true;
    }

    checkOneAnswerQuestionInfo(question) {
        const data = question.getInfo();

        if(typeof data.question === 'undefined' || data.question === null || data.question.trim() === "")
        {
            this.wrongQuestionText("Otvorená krátka odpoveď");
            return false;
        }

        if(typeof data.points === 'undefined' || data.points === null || data.points.trim() === "")
        {
            this.wrongQuestionPoints("Otvorená krátka odpoveď");
            return false;
        }

        if(typeof data.correctAnswer === 'undefined' || data.correctAnswer === null || data.correctAnswer.trim() === "")
        {
            this.showWarningMessage("Nebola zadaná správna odpoveď (Otvorená krátka odpoveď)",3);
            return false;
        }

        return true;
    }

    checkPairQuestionInfo(question) {
        const data = question.getInfo();

        if(typeof data.questionText === 'undefined' || data.questionText === null || data.questionText.trim() === "")
        {
            this.wrongQuestionText("Párovanie správnych odpovedí");
            return false;
        }


        if(typeof data.questionPoints === 'undefined' || data.questionPoints === null || data.questionPoints === "" || isNaN(data.questionPoints))
        {
            this.wrongQuestionPoints("Párovanie správnych odpovedí");
            return false;
        }


        if(typeof data.questionPairs === 'undefined' || data.questionPairs === null || data.questionPairs.length < 1)
        {
            this.showWarningMessage("Nebol zadaný žiaden pár (Párovanie správnych odpovedí)",3);
            return false;
        }

        if(!this.checkCompletePair(data.questionPairs))
        {
            this.showWarningMessage("Nebola zadana hodnota páru (Párovanie správnych odpovedí)",3);
            return false;
        }

        return true;
    }

    checkCompletePair(pairs)
    {
        for(let i = 0; i < pairs.length;i++)
        {
            if(typeof pairs[i].question === 'undefined' || pairs[i].question === null || pairs[i].question.trim() === "")
            {
                return false;
            }

            if(typeof pairs[i].answer === 'undefined' || pairs[i].answer === null || pairs[i].answer.trim() === "")
            {
                return false;
            }
        }

        return true;
    }

    checkDrawQuestionInfo(question) {
        const data = question.getInfo();

        if(typeof data.question === 'undefined' || data.question === null || data.question.trim() === "")
        {
            this.wrongQuestionText("Odpoveď pomocou kreslenia");
            return false;
        }

        if(typeof data.points === 'undefined' || data.points === null || data.points.trim() === "")
        {
            this.wrongQuestionPoints("Odpoveď pomocou kreslenia");
            return false;
        }

        return true;
    }


    isFilledInformationAboutTest()
    {
        const testName = this.dom.getElementById("test-name").value.trim();
        const timeLimit = this.dom.getElementById("time-limit").value.trim();

        if(typeof testName === 'undefined' || testName === null || testName === "")
        {
            this.showWarningMessage("Názov testu nie je zadaný",3);
            return false;
        }

        if(typeof timeLimit === 'undefined' || timeLimit === null || timeLimit === "")
        {
            this.showWarningMessage("Časový limit testu nie je zadaný",3);
            return false;
        }

        return true;
    }



    wrongQuestionText(question)
    {
        this.showWarningMessage("Pole otázky je prázdne " + "(" + question + ")",3);
    }

    wrongQuestionPoints(question)
    {
        this.showWarningMessage("Pole pre body je prázdne " + "(" + question + ")",3);
    }


    showDangerMessage(message, duration)
    {
        snackbarService.open(this.dom,{type: "danger", message: message, duration: duration});
    }

    showWarningMessage(message, duration)
    {
        snackbarService.open(this.dom,{type: "warning", message: message, duration: duration});
    }

    showSuccessMessage(message, duration)
    {
        snackbarService.open(this.dom,{type: "success", message: message, duration: duration});
    }

}
