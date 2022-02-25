import {Component} from "../../../../shared/model/component/component.js";
import {domService} from "../../../../shared/services/dom.service.js";
import {MQ} from "../../../../app.module.js";


const component = {
    selector: 'app-math-question-view',
    templatePath: 'lecturer-test/edit-test/math-question-view/math-question-view.component.html',
    stylePaths: ['lecturer-test/edit-test/math-question-view/math-question-view.component.css',
        '../../app/shared/library/mathquill/mathquill.css', 'student-test/draw-question/draw-question.component.css',
        'lecturer-test/edit-test/draw-question-view/draw-question-view.component.css'],
};

export class MathQuestionViewComponent extends Component {
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

        this.test = domService.getAttribute(this, "test");
        this.questionId = this.test.question.id;
        this.dom.getElementById("open-picture").addEventListener("click", this.openPicture);
        this.preloadPoints(this.test.question.points, this.test.question.answer);
        this.loadQuestionWording(this.test.question);
    }

    eventsInitializer() {
    }

    preloadPoints(points, answer) {

        const pointsEdit = this.dom.getElementById("points-edit");
        domService.setAttribute(pointsEdit, "points", points);

        if (answer.split("\picture").length < 2) {
            const answerBox = this.dom.getElementById("student-answer");
            answerBox.innerText = answer;
            MQ.StaticMath(answerBox);
        }
    }

    loadQuestionWording(question) {
        const questionWordingElement = this.dom.getElementById("question-wording-element");
        const textMath = question.text.split("\\MATH");

        const questionWording = {
            text: textMath[0],
            points: question.maxPoints
        }

        let newText = document.createElement("p");
        newText.innerText = textMath[1];
        MQ.StaticMath(newText);
        this.dom.getElementById("math-exp").appendChild(newText);
        domService.setAttribute(questionWordingElement, "questionWording", questionWording);
    }

    getInfo() {
        const pointsEdit = this.dom.getElementById("points-edit");
        return {points: pointsEdit.getPoints(), questionId: this.questionId};
    }

    openPicture = () => {
        const container = document.createElement('div');
        container.id = "modal-image-container";
        const apiUrl = "https://latex.codecogs.com/png.download?%5Cdpi%7B300%7D%20%5Cfn_phv%20%5Chuge";
        const image = document.createElement('img');
        const answerType = this.test.question.answer.split("\picture");
        if (answerType.length < 2) {
            image.setAttribute("src", apiUrl + encodeURI(this.test.question.answer));

        } else {
            image.setAttribute("src", answerType[1]);
        }
        image.id = "modal-image";
        container.appendChild(image);
        container.addEventListener("click", this.closeImageView);
        this.dom.appendChild(container);
    }

    closeImageView = () => {
        this.dom.getElementById('modal-image-container').remove();
    };

}
