import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";


const component = {
    selector: 'app-one-answer-question',
    templatePath: 'student-test/one-answer-question/one-answer-question.component.html',
    stylePaths: ['student-test/one-answer-question/one-answer-question.component.css'],
};

export class OneAnswerQuestionComponent extends Component {
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
        const question = domService.getAttribute(this, "questionInfo");

        this.loadQuestionWording(question);
        this.loadQuestionBody(question);
    }

    eventsInitializer() {

    }

    loadQuestionWording(question) {
        const questionWordingElement = this.dom.getElementById("question-wording-element");
        const questionWording = {
            text: question.questionText,
            points: question.points
        }
        domService.setAttribute(questionWordingElement, "questionWording", questionWording);
    }

    loadQuestionBody(question) {
    }

    getAnswer() {
        const studentAnswer = this.dom.getElementById("student-answer");
        return studentAnswer.value;
    }

}
