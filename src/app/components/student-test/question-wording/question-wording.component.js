import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";


const component = {
    selector: 'app-question-wording',
    templatePath: 'student-test/question-wording/question-wording.component.html',
    stylePaths: ['student-test/question-wording/question-wording.component.css'],
};

export class QuestionWordingComponent extends Component {
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
        this.setQuestion();
    }

    eventsInitializer() {

    }

    setQuestion() {
        const questionContainer = this.dom.getElementById("question-wording-text");
        const pointsContainer = this.dom.getElementById("points");
        const questionWording = domService.getAttribute(this, "questionWording");
        const text = questionWording.text;
        const points = questionWording.points;
        questionContainer.innerText = text;
        pointsContainer.innerText = this.correctDeclension(points);

        try {
            domService.getInlineAttribute(this, "titleHidden");
            this.dom.getElementById("answer-title").innerText = "";
        } catch (e) {

        }
    }

    correctDeclension(points) {
        if (points === 1) {
            return points + " bod";
        }
        if (points <= 4 && points > 1) {
            return points + " body";
        }
        return points + " bodov";
    }

}
