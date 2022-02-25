import {Component} from "../../shared/model/component/component.js";
import {domService} from "../../shared/services/dom.service.js";
import {testsService} from "../../api/tests/services/tests.service.js";
import {serverSentEventsService} from "../../api/server-sent-events/services/server-sent-events.service.js";
import {studentService} from "../../api/student/services/student.service.js";


const component = {
    selector: 'app-student-test',
    templatePath: 'student-test/student-test.component.html',
    stylePaths: ['student-test/student-test.component.css'],
};

export class StudentTestComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.wantSendTest = false;
        this.checkUnauthorized().then(() => {
            this.isSetParam();
            this.load().then(() => this.onInit());
        });
    }

    async checkUnauthorized() {
        const testKey = this.getTestKey();
        this.preResponse = await testsService.readQuestions(testKey);

        if (this.preResponse.responseErrorMessage) {
            this.handleErrorResponseMessage(this.preResponse.responseErrorMessage);
        }
        else{
            this.studentId = this.preResponse.response.studentId;
            this.name = this.preResponse.response.studentName;
        }
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
        this.loadTest();
    }


    attributesInitializer() {
        this.setName();
    }

    eventsInitializer() {
        document.addEventListener("sendTest", this.sendTest);
        const sideMenu = this.dom.getElementById("side-menu");
        sideMenu.addEventListener("menuSwap", this.menuSwapped);

        window.addEventListener("beforeunload",(event) =>{
            event.preventDefault();
            if(!this.wantSendTest) {
                this.sendTest()
            }
        });

        window.addEventListener("focus", this.updateInTestStatus);
        window.addEventListener("blur", this.updateOutTestStatus);
    }

    updateInTestStatus = () =>{
        const testKey = this.getTestKey();
        const studentId = this.getStudentId();
        studentService.updateInTestStatus(testKey, studentId)
            .then();
    }

    updateOutTestStatus = () =>{
        const testKey = this.getTestKey();
        const studentId = this.getStudentId();
        studentService.updateOutTestStatus(testKey, studentId)
            .then();
    }


    sendTest = () => {
        const testKey = this.getTestKey();
        const studentId = this.getStudentId();
        const allAnswers = this.getAllAnswers();

        testsService.createStudentTestAnswers(studentId, testKey, allAnswers)
            .then(this.unsetUnloadEvents)
            .then(this.redirectToLoginPage);
    };

    unsetUnloadEvents = () =>{
        this.wantSendTest = true;
    }

    redirectToLoginPage = () => {
        location.replace("../../../index.html");
    }

    getStudentId() {
       /* let queryParams = window.location.search;
        let params = new URLSearchParams(queryParams);

        return params.get("studentId");*/

        return this.studentId;
    }

    getAllAnswers() {
        const allAnswers = [];
        const paper = this.dom.getElementById("paper");

        for (let answerElement of paper.getElementsByTagName("*")) {
            const answer = this.getAnswer(answerElement);
            allAnswers.push(answer);
        }

        return {
            answers: allAnswers
        };
    }

    getAnswer(answerElement) {
        const questionInfo = domService.getAttribute(answerElement, "questionInfo");
        const questionAnswer = answerElement.getAnswer();
        return {
            questionInfo: questionInfo,
            answer: questionAnswer
        }
    }

    menuSwapped = (e) => {

    }

    setName() {
        const actualName = this.name.name + " " +  this.name.surname;
        const sideMenu = this.dom.getElementById("side-menu");
        domService.setAttribute(sideMenu, "headerName", actualName);
    }

    loadTest() {
        this.showAllQuestions(this.preResponse.response.test);
    }

    getTestKey() {

        let queryParams = window.location.search;
        let params = new URLSearchParams(queryParams);

        return params.get("codeTest");
    }

    showAllQuestions(test) {
        this.dom.getElementById("paper").innerHTML = "";

        if (!test.exists) {
            return;
        } else if (test.exists && !test.activated) {
            return;
        }

        let questionCount = 1;
        for (let question of test.questions) {
            question.questionText = questionCount + ". " + question.questionText;
            this.showQuestion(question);
            questionCount++;
        }
        this.startTimer();
    }


    showQuestion(question) {
        if (question.type === "CHOICE") {
            this.showMultiChoiceQuestion(question);
        } else if (question.type === "SHORT_ANSWER") {
            this.showOneAnswerQuestion(question);
        } else if (question.type === "PAIR") {
            this.showPairQuestion(question);
        } else if (question.type === "DRAW") {
            this.showDrawQuestion(question);
        } else if (question.type === "MATH") {
            this.showMathQuestion(question)
        }
    }

    showMultiChoiceQuestion(question) {
        const paper = this.dom.getElementById("paper");
        const appQuestion = document.createElement("APP-MULTIPLE-ANSWER-QUESTION");
        domService.setAttribute(appQuestion, "questionInfo", question);
        paper.appendChild(appQuestion);
    }

    showOneAnswerQuestion(question) {
        const paper = this.dom.getElementById("paper");
        const appQuestion = document.createElement("APP-ONE-ANSWER-QUESTION");
        domService.setAttribute(appQuestion, "questionInfo", question);
        paper.appendChild(appQuestion);
    }

    showPairQuestion(question) {
        const paper = this.dom.getElementById("paper");
        const appQuestion = document.createElement("APP-PAIR-QUESTION");
        domService.setAttribute(appQuestion, "questionInfo", question);
        paper.appendChild(appQuestion);
    }

    showDrawQuestion(question) {
        const paper = this.dom.getElementById("paper");
        const appQuestion = document.createElement("APP-DRAW-QUESTION");
        domService.setAttribute(appQuestion, "questionInfo", question);
        paper.appendChild(appQuestion);
    }

    showMathQuestion(question) {
        const paper = this.dom.getElementById("paper");
        const appQuestion = document.createElement("APP-MATH-QUESTION");
        domService.setAttribute(appQuestion, "questionInfo", question);
        paper.appendChild(appQuestion);
    }

    startTimer = () => {
        const testKey = this.getTestKey();
        const studentId = this.getStudentId();
        this.timeSource = serverSentEventsService.readTestTimer(testKey, studentId);
    }


    isSetParam() {
        if (this.getTestKey() === null || this.getStudentId() === null) {
            this.redirectToLoginPage();
        }
    }

    handleErrorResponseMessage(errorMessage) {
        if (errorMessage.responseCode === 401) {
            this.redirectToLoginPage();
        }
    }


}
