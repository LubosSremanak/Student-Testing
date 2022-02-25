import {Component} from "../../../../shared/model/component/component.js";
import {MQ} from "../../../../app.module.js";
import {domService} from "../../../../shared/services/dom.service.js";


const component = {
    selector: 'app-math-question-creator',
    templatePath: 'lecturer-test/test-maker/math-question-creator/math-question-creator.component.html',
    stylePaths: ['lecturer-test/test-maker/math-question-creator/math-question-creator.component.css',
        '../../app/shared/library/mathquill/mathquill.css'],
};

export class MathQuestionCreatorComponent extends Component {
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
        let answerSpan = this.dom.getElementById('answer');

        let answerMathField = MQ.MathField(answerSpan, {
            handlers: {
                edit: function() {
                    let enteredMath = answerMathField.latex();
                }
            }
        });
    }

    eventsInitializer() {
        const mathPanel = this.dom.getElementById("math-panel");

        mathPanel.addEventListener("mathSymbolAppear", (e) =>{
            let answerSpan = this.dom.getElementById("answer");
            MQ(answerSpan).cmd(e.detail);
        });
    }

    getInfo() {
        const question = this.dom.getElementById("question").value + "\\MATH" + MQ( this.dom.getElementById("answer") ).latex() + "\\MATH";
        const points = this.dom.getElementById("points").value;
        return {question, points};
    }
}