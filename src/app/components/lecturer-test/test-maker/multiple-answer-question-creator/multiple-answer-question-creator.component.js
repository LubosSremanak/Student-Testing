import {Component} from "../../../../shared/model/component/component.js";
import {domService} from "../../../../shared/services/dom.service.js";
import "https://use.fontawesome.com/releases/v5.15.3/js/all.js";

const component = {
    selector: 'app-multiple-answer-question-creator',
    templatePath: 'lecturer-test/test-maker/multiple-answer-question-creator/multiple-answer-question-creator.component.html',
    stylePaths: ['lecturer-test/test-maker/multiple-answer-question-creator/multiple-answer-question-creator.component.css'],
};

export class MultipleAnswerQuestionCreatorComponent extends Component {
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
        const addAnswerButton = this.dom.getElementById("add-answer-button");
        addAnswerButton.addEventListener("click", this.addAnswer);
    }

    addAnswer = () => {
        const newAnswer = document.createElement("APP-CHECK-ANSWER");
        domService.setAttribute(newAnswer, "defaultChecked", false);

        const allAnswersContainer = this.dom.getElementById("all-answers-container");
        allAnswersContainer.appendChild(newAnswer);
    }

    getInfo() {
        const allAnswers = this.getAllAnswers();
        const question = this.dom.getElementById("question").value;
        const points = this.dom.getElementById("points").value;

        return {
            question: question,
            points: points,
            answers: allAnswers
        };
    }

    getAllAnswers() {
        const allAnswers = [];

        const allAnswerElements = this.dom.getElementById("all-answers-container").getElementsByTagName("*");
        for (let answer of allAnswerElements) {
            allAnswers.push(answer.getInfo());
        }

        return allAnswers;
    }
}
