import {Component} from "../../../../shared/model/component/component.js";
import {domService} from "../../../../shared/services/dom.service.js";

const component = {
    selector: 'app-draw-question-view',
    templatePath: 'lecturer-test/edit-test/draw-question-view/draw-question-view.component.html',
    stylePaths: ['lecturer-test/edit-test/draw-question-view/draw-question-view.component.css',
        'student-test/draw-question/draw-question.component.css'],
};

export class DrawQuestionViewComponent extends Component {
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
        this.questionId =  this.test.question.id;
        this.preloadPoints(this.test.question.points);
        this.loadQuestionWording(this.test.question);

    }

    eventsInitializer() {
        this.dom.getElementById("open-picture").addEventListener("click", this.openPicture);
    }

    openPicture = () => {
        const container = document.createElement('div');
        container.id = "modal-image-container";
        if(this.test.question.answer) {
            const image = document.createElement('img');
            image.setAttribute("src", this.test.question.answer);
            image.id = "modal-image";
            container.appendChild(image);
        }else{
            const div = document.createElement("div");
            div.id = "modal-image";
            const span = document.createElement("span");
            span.innerText = "Nenakreslil obrázok";
            div.appendChild(span);
            container.appendChild(div);
        }
        container.addEventListener("click", this.closeImageView)
        this.dom.appendChild(container);
    };

    loadQuestionWording(question) {
        const questionWordingElement = this.dom.getElementById("question-wording-element");
        const questionWording = {
            text: question.text,
            points: question.maxPoints
        }
        domService.setAttribute(questionWordingElement, "questionWording", questionWording);
    }

    preloadPoints(points) {
        const pointsEdit = this.dom.getElementById("points-edit");
        domService.setAttribute(pointsEdit, "points", points);

    }

    closeImageView = () => {
        this.dom.getElementById('modal-image-container').remove();
    };

    getInfo() {
        const pointsEdit = this.dom.getElementById("points-edit");
        return {points: pointsEdit.getPoints(), questionId: this.questionId};
    }
}
