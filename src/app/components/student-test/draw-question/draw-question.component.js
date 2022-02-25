import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";
import {CanvasComponent} from "./canvas/canvas.component.js";
import {snackbarService} from "../../../shared/services/snackbar.service.js";


const component = {
    selector: 'app-draw-question',
    templatePath: 'student-test/draw-question/draw-question.component.html',
    stylePaths: ['student-test/draw-question/draw-question.component.css'],
};

export class DrawQuestionComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
        this.imgUrl = null;
        this.canvas = null;
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {
        const question = domService.getAttribute(this, "questionInfo");
        document.addEventListener("saveCanvasImage", this.setImage);
        this.loadQuestionWording(question);
        this.loadQuestionBody(question);

    }

    eventsInitializer() {
        this.dom.getElementById("draw").addEventListener("click", this.openCanvas);
        this.dom.getElementById("scan").addEventListener("click", this.openUploader);
        this.dom.getElementById("image-upload").addEventListener("change", this.uploadFile);
    }


    loadQuestionWording(question) {
        const questionWordingElement = this.dom.getElementById("question-wording-element");
        this.questionWording = {
            text: question.questionText,
            points: question.points
        }
        domService.setAttribute(questionWordingElement, "questionWording", this.questionWording);
    }

    loadQuestionBody(question) {
        //TODO: dorobit zobrazenie otazky (okrem samotneho textu otazky/zadania jej bodov)
    }

    getAnswer() {
        return this.imgUrl;
    }


    setImage = (event) => {
        this.imgUrl = event.detail;
    };

    openCanvas = () => {
        const attribute = {
            name: "question-wording",
            data: this.questionWording
        };


        domService.appendDomAndSetAttribute(this.dom, CanvasComponent, attribute);


    };

    openUploader = () => {
        this.dom.getElementById("image-upload").click();
    };

    uploadFile = async (e) => {
        await this.toBase64(e.target.files[0]).then((file) => {
            this.imgUrl = file;
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
