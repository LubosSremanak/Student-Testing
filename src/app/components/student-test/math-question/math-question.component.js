import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";
import {MQ} from "../../../app.module.js";
import {snackbarService} from "../../../shared/services/snackbar.service.js";


const component = {
    selector: 'app-math-question',
    templatePath: 'student-test/math-question/math-question.component.html',
    stylePaths: ['student-test/math-question/math-question.component.css',
        '../../app/shared/library/mathquill/mathquill.css'],
};

export class MathQuestionComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
    }

    onInit() {
        this.eventsInitializer();
        this.attributesInitializer();
    }

    attributesInitializer() {
        const question = domService.getAttribute(this, "questionInfo");

        this.loadQuestionWording(question);
        this.loadQuestionBody(question);
    }

    eventsInitializer() {
        const math_panel = this.dom.getElementById("math-panel");
        this.dom.getElementById("scan").addEventListener("click", this.openUploader);
        this.dom.getElementById("image-upload").addEventListener("change", this.uploadFile);
        math_panel.addEventListener("mathSymbolAppear", (e) => {
            let answerSpan = this.dom.getElementById("answer");
            MQ(answerSpan).cmd(e.detail);
        });
    }

    loadQuestionWording(question) {
        const textMath = question.questionText.split("\\MATH");

        const questionWordingElement = this.dom.getElementById("question-wording-element");
        const questionWording = {
            text: textMath[0], //question.questionText,
            points: question.points
        }

        let newText = document.createElement("p");
        newText.innerHTML = textMath[1];
        MQ.StaticMath(newText);
        this.dom.getElementById("math-exp").appendChild(newText);

        domService.setAttribute(questionWordingElement, "questionWording", questionWording);
    }

    loadQuestionBody(question) {
        let answerSpan = this.dom.getElementById('answer');
        let answerMathField = MQ.MathField(answerSpan, {
            handlers: {
                edit: function () {
                    let enteredMath = answerMathField.latex();
                }
            }
        });
    }

    getAnswer() {
        if (this.imgUrl) {
            return this.imgUrl;
        } else {
            const studentAnswer = MQ(this.dom.getElementById("answer")).latex();
            return studentAnswer;
        }


    }

    openUploader = () => {
        this.dom.getElementById("image-upload").click();
    };

    uploadFile = async (e) => {
        await this.toBase64(e.target.files[0]).then((file) => {
            this.imgUrl = '\\picture' + file;
            snackbarService.open(this.dom, {
                message: 'Súbor uploadovaný',
                type: 'success', duration: 3
            });
        });
    };

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
