import {Component} from "../../../../../shared/model/component/component.js";
import {domService} from "../../../../../shared/services/dom.service.js";


const component = {
    selector: 'app-check-answer',
    templatePath: 'lecturer-test/test-maker/multiple-answer-question-creator/check-answer/check-answer.component.html',
    stylePaths: ['lecturer-test/test-maker/multiple-answer-question-creator/check-answer/check-answer.component.css'],
};

export class CheckAnswerComponent extends Component {
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
        this.dom.getElementById("truth-box").checked = domService.getAttribute(this, "defaultChecked");
    }

    eventsInitializer() {

    }

    getInfo() {
        const checked = this.dom.getElementById("truth-box").checked;
        const answerText = this.dom.getElementById("answer").value;

        return {
            checked: checked,
            answerText: answerText
        };
    }
}
