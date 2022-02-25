import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";


const component = {
    selector: 'app-multiple-answer-question',
    templatePath: 'student-test/multiple-answer-question/multiple-answer-question.component.html',
    stylePaths: ['student-test/multiple-answer-question/multiple-answer-question.component.css'],
};

export class MultipleAnswerQuestionComponent extends Component {
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
        const allOptions = question.otherInfo.options;
        const optionsContainer = this.dom.getElementById("options-container");
        for (let option of allOptions) {
            const optionElement = document.createElement("APP-MULTICHOICE-OPTION");
            domService.setAttribute(optionElement, "option", option);
            optionsContainer.appendChild(optionElement);
        }
    }


    getAnswer() {
        const answersId = []
        const optionsContainer = this.dom.getElementById("options-container");
        for (let optionElement of optionsContainer.getElementsByTagName("*")) {
            if (optionElement.isChecked()) {
                const optionInfo = domService.getAttribute(optionElement, "option");
                const optionId = optionInfo.id;
                answersId.push(optionId);
            }
        }

        return answersId;
    }

}
