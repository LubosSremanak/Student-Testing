import {Component} from "../../../../shared/model/component/component.js";


const component = {
    selector: 'app-one-answer-question-creator',
    templatePath: 'lecturer-test/test-maker/one-answer-question-creator/one-answer-question-creator.component.html',
    stylePaths: ['lecturer-test/test-maker/one-answer-question-creator/one-answer-question-creator.component.css'],
};

export class OneAnswerQuestionCreatorComponent extends Component {
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

    }

    eventsInitializer() {

    }

    getInfo() {
        const question = this.dom.getElementById("question").value;
        const points = this.dom.getElementById("points").value;
        const correctAnswer = this.dom.getElementById("correct-answer").value;
        return {question, points, correctAnswer};
    }
}
