import {Component} from "../../../../shared/model/component/component.js";
import {domService} from "../../../../shared/services/dom.service.js";


const component = {
    selector: 'app-one-answer-question-view',
    templatePath: 'lecturer-test/edit-test/one-answer-question-view/one-answer-question-view.component.html',
    stylePaths: ['lecturer-test/edit-test/one-answer-question-view/one-answer-question-view.component.css',
        'student-test/one-answer-question/one-answer-question.component.css'],
};

export class OneAnswerQuestionViewComponent extends Component {
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
        const test = domService.getAttribute(this, "test");
        this.questionId = test.question.id;
        this.preloadPoints(test.question.points, test.question.answer);
        this.loadQuestionWording(test.question);
    }

    eventsInitializer() {
    }

    preloadPoints(points, answer) {
        const pointsEdit = this.dom.getElementById("points-edit");
        domService.setAttribute(pointsEdit, "points", points);
        const answerBox = this.dom.getElementById("student-answer");
        answerBox.value = answer;

    }


    loadQuestionWording(question) {
        const questionWordingElement = this.dom.getElementById("question-wording-element");
        const questionWording = {
            text: question.text,
            points: question.maxPoints
        }
        domService.setAttribute(questionWordingElement, "questionWording", questionWording);
    }

    getInfo() {
        const pointsEdit = this.dom.getElementById("points-edit");
        return {points: pointsEdit.getPoints(), questionId: this.questionId};
    }
}
