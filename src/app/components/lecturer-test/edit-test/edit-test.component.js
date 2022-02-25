import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";
import {testsService} from "../../../api/tests/services/tests.service.js";
import {MultipleAnswerQuestionViewComponent} from "./multiple-answer-question-view/multiple-answer-question-view.component.js";
import {OneAnswerQuestionViewComponent} from "./one-answer-question-view/one-answer-question-view.component.js";
import {PairQuestionViewComponent} from "./pair-question-view/pair-question-view.component.js";
import {DrawQuestionViewComponent} from "./draw-question-view/draw-question-view.component.js";
import {snackbarService} from "../../../shared/services/snackbar.service.js";
import {MathQuestionViewComponent} from "./math-question-view/math-question-view.component.js";

const component = {
    selector: 'app-edit-test',
    templatePath: 'lecturer-test/edit-test/edit-test.component.html',
    stylePaths: ['lecturer-test/edit-test/edit-test.component.css', '' +
    'student-test/student-test.component.css'],
};

export class EditTestComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {
        const submitButton = this.dom.getElementById("submit");
        submitButton.addEventListener("click", this.editTest);
        this.studentTestId = domService.getAttribute(this, "studentTestId");
        testsService.readStudentTestAnswers(this.studentTestId.studentId, this.studentTestId.testCode).then(this.setTest);

    }

    appendQuestion(test) {
        const attribute = {name: "test", data: test};
        const question = test.question;
        const paper = this.dom.getElementById("paper");
        if (question.type === "CHOICE") {
            domService.appendDomAndSetAttribute(paper, MultipleAnswerQuestionViewComponent, attribute);
        } else if (question.type === "SHORT_ANSWER") {
            domService.appendDomAndSetAttribute(paper, OneAnswerQuestionViewComponent, attribute);
        } else if (question.type === "PAIR") {
            domService.appendDomAndSetAttribute(paper, PairQuestionViewComponent, attribute);
        } else if (question.type === "DRAW") {
            domService.appendDomAndSetAttribute(paper, DrawQuestionViewComponent, attribute);
        } else if (question.type === "MATH") {
            domService.appendDomAndSetAttribute(paper, MathQuestionViewComponent, attribute);
        }
    }


    eventsInitializer() {
    }

    setTest = (test) => {
        test.response.questions.forEach((questionWithAnswer, index) => {
            const question = questionWithAnswer.studentQuestionAnswer.question;
            question.text = (index + 1) + '.' + question.text;
            const answers = questionWithAnswer.studentQuestionAnswer.answers;
            this.appendQuestion({question, answers});
        })
    };

    editTest = () => {
        const studentId = this.studentTestId.studentId;
        const testCode = this.studentTestId.testCode;
        this.saveEditedTest(studentId,testCode);
    };

    saveEditedTest(studentId, testCode) {
        const paper = this.dom.getElementById("paper");
        const allQuestions = paper.getElementsByTagName("*");
        const allQuestionPoints = [];
        for (let question of allQuestions) {
            const questionInfo = question.getInfo();
            allQuestionPoints.push(questionInfo);
        }
        testsService.updateStudentTestAnswers(studentId, testCode, allQuestionPoints).then((response) => {
            const message = 'Test uložený';
            snackbarService.open(this.dom, {message, type: 'success', duration: 3})
        });

    }
}

