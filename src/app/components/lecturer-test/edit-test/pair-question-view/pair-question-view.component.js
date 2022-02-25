import {Component} from "../../../../shared/model/component/component.js";
import {domService} from "../../../../shared/services/dom.service.js";

const component = {
    selector: 'app-pair-question-view',
    templatePath: 'lecturer-test/edit-test/pair-question-view/pair-question-view.component.html',
    stylePaths: ['lecturer-test/edit-test/pair-question-view/pair-question-view.component.css',
        'student-test/pair-question/pair-question.component.css'],
};

export class PairQuestionViewComponent extends Component {
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
        const test = domService.getAttribute(this, "test");
        this.questionId = test.question.id;
        this.preloadPoints(test.question.points);
        this.loadQuestionWording(test.question);
        this.showPairs(test.question.answer.answers);
    }

    eventsInitializer() {
    }

    preloadPoints(points) {
        const pointsEdit = this.dom.getElementById("points-edit");
        domService.setAttribute(pointsEdit, "points", points);
    }


    loadQuestionWording(question) {
        const questionWordingElement = this.dom.getElementById("question-wording-element");
        const questionWording = {
            text: question.text,
            points: question.maxPoints
        }
        domService.setAttribute(questionWordingElement, "questionWording", questionWording);
    }

    showPairs(pairs) {
        let questionPairs = this.dom.getElementById("question-pairs");

        pairs.forEach(pair => {
            questionPairs.append(this.createPairLine(pair));
        })
    }

    createPairLine(pair) {
        let pairLine = this.createPairLineDiv();

        pairLine.append(this.createQuestionPlace(pair.question));
        pairLine.append(this.createAnswerPlace(pair.correctAnswer, pair.studentAnswer));

        return pairLine;
    }

    createPairLineDiv() {
        let pairLine = document.createElement("div");
        pairLine.classList.add("pair");

        return pairLine;
    }

    createQuestionPlace(question) {
        let questionPlace = document.createElement("div");
        questionPlace.classList.add("pair-value-box");
        questionPlace.classList.add("question-place");
        questionPlace.append(this.createValueText(question));

        return questionPlace;
    }

    createAnswerPlace(correctAnswer, studentAnswer) {
        let answerPlace = document.createElement("div");
        answerPlace.classList.add("pair-value-box");
        answerPlace.classList.add("answer-place");
        answerPlace.append(this.createValueText(studentAnswer));

        if (correctAnswer === studentAnswer)
            answerPlace.classList.add("correct-border");
        else
            answerPlace.classList.add("incorrect-border");

        return answerPlace;
    }

    createValueText(value) {
        let text = document.createElement("p");
        text.classList.add("value-text");
        text.innerHTML = value;

        return text;
    }

    getInfo() {
        const pointsEdit = this.dom.getElementById("points-edit");
        return {points: pointsEdit.getPoints(), questionId: this.questionId};
    }
}
