import {Component} from "../../../../shared/model/component/component.js";


const component = {
    selector: 'app-pair-question-creator',
    templatePath: 'lecturer-test/test-maker/pair-question-creator/pair-question-creator.component.html',
    stylePaths: ['lecturer-test/test-maker/pair-question-creator/pair-question-creator.component.css'],
};

export class PairQuestionCreatorComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
        this.countPair = 0;
        this.questionType = "PAIR";

        this.baseQuestionPairId = "question-pair-";
        this.baseAnswerPairId = "answer-pair-";
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {

    }

    eventsInitializer() {
        let pairsDiv = this.dom.getElementById("question-pairs");
        this.addFirstPair(pairsDiv);
        const pairButton = this.dom.getElementById("add-pair-button");
        pairButton.addEventListener("click", () => this.addPair(pairsDiv));

    }

    addFirstPair(pairsDiv) {
        this.addPair(pairsDiv);
    }

    addPair(pairsDiv) {
        this.countPair++;
        pairsDiv.append(this.createPair(this.countPair))
    }

    createPair(orderPair) {
        let baseId = "pair-";
        let fullId = baseId + orderPair.toString();

        let pairDiv = document.createElement("div");
        pairDiv.setAttribute("id", fullId);
        pairDiv.classList.add("pair");

        pairDiv.append(this.createQuestionPair(orderPair));
        pairDiv.append(this.createAnswerPair(orderPair));

        return pairDiv;
    }

    createQuestionPair(orderPair) {
        let placeholder = "Otázka";

        let fullId = this.baseQuestionPairId + orderPair.toString();

        let textarea = document.createElement("textarea");
        textarea.setAttribute("id", fullId);
        textarea.setAttribute("placeholder", placeholder);
        textarea.classList.add("input-pair-value", "input-bottom-margin", "input-pair-left-value");

        return textarea;
    }

    createAnswerPair(orderPair) {
        let placeholder = "Odpoveď";

        let fullId = this.baseAnswerPairId + orderPair.toString();

        let textarea = document.createElement("textarea");
        textarea.setAttribute("id", fullId);
        textarea.setAttribute("placeholder", placeholder);
        textarea.classList.add("input-pair-value", "input-bottom-margin");

        return textarea;
    }


    getQuestionText() {
        let questionText = this.dom.getElementById("question-text");
        return questionText.value;
    }

    getQuestionPoints() {
        let questionPoints = this.dom.getElementById("question-points")
        return parseFloat(questionPoints.value);
    }

    getPairs() {
        let pairs = [];

        for (let i = 1; i <= this.countPair; i++) {
            let pair = {};
            pair["question"] = this.getQuestionPairValue(i);
            pair["answer"] = this.getAnswerPairValue(i);
            pairs.push(pair);
        }
        return pairs;
    }

    getQuestionPairValue(orderPair) {
        let fullId = this.baseQuestionPairId + orderPair.toString();

        let questionValue = this.dom.getElementById(fullId);
        return questionValue.value.toString();
    }

    getAnswerPairValue(orderPair) {
        let fullId = this.baseAnswerPairId + orderPair.toString();

        let questionValue = this.dom.getElementById(fullId);
        return questionValue.value.toString();
    }

    createInfo() {
        let info = {};

        info["type"] = this.questionType;
        info["questionText"] = this.getQuestionText();
        info["questionPoints"] = this.getQuestionPoints();
        info["questionPairs"] = this.getPairs();


        return info;
    }


    getInfo() {
        return this.createInfo();
    }

}
