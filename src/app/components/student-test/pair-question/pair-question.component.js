import {Component} from "../../../shared/model/component/component.js";
import {domService} from "../../../shared/services/dom.service.js";


const component = {
    selector: 'app-pair-question',
    templatePath: 'student-test/pair-question/pair-question.component.html',
    stylePaths: ['student-test/pair-question/pair-question.component.css'],
};

export class PairQuestionComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());

        this.baseOfPairId = "pair-";
        this.baseOfQuestionPlacePairId = "question-place-pair-";
        this.baseOfCorrectPlacePairId = "correct-place-pair-";
        this.baseOfAnswerPlacePairId = "answer-place-pair-";
        this.baseOfAnswerPairId = "answer-pair-";
        this.countPairs = 0;
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

        let values1 = this.changeItemsInArray(question.otherInfo.values1);
        let values2 = this.changeItemsInArray(question.otherInfo.values2);

        let questionPairs = this.dom.getElementById("question-pairs");

        for (let i = 0; i < values1.length; i++) {
            questionPairs.append(this.createPairLine(i + 1, values1[i], values2[i]));
            this.countPairs++;
        }
    }


    createPairLine(order, question, answer) {
        let pairLine = this.createPairLineDiv(order);

        pairLine.append(this.createQuestionPlace(order, question));
        pairLine.append(this.createCorrectPlace(order));
        pairLine.append(this.createAnswerPlace(order, answer));

        return pairLine;
    }

    createPairLineDiv(order) {
        let pairLine = document.createElement("div");
        pairLine.setAttribute("id", this.baseOfPairId + order.toString());
        pairLine.classList.add("pair");

        return pairLine;
    }

    createQuestionPlace(order, question) {
        let questionPlace = document.createElement("div");
        questionPlace.setAttribute("id", this.baseOfQuestionPlacePairId + order.toString());
        questionPlace.classList.add("pair-value-box");
        questionPlace.classList.add("question-place");
        questionPlace.append(this.createValueText(question));

        return questionPlace;
    }

    createCorrectPlace(order) {
        let correctPlace = document.createElement("div");
        correctPlace.setAttribute("id", this.baseOfCorrectPlacePairId + order.toString());
        correctPlace.classList.add("pair-value-box", "correct-place");

        correctPlace.addEventListener("drop", ev => this.drop(ev));
        correctPlace.addEventListener("dragover", ev => this.allowDrop(ev));

        return correctPlace;
    }

    createAnswerPlace(order, answer) {
        let answerPlace = document.createElement("div");
        answerPlace.setAttribute("id", this.baseOfAnswerPlacePairId + order.toString());
        answerPlace.classList.add("pair-value-box");
        answerPlace.classList.add("answer-place");
        answerPlace.addEventListener("drop", ev => this.drop(ev));
        answerPlace.addEventListener("dragover", ev => this.allowDrop(ev));

        answerPlace.append(this.createAnswerDiv(order, answer));

        return answerPlace;
    }


    createAnswerDiv(order, answer) {
        let answerDiv = document.createElement("div");
        answerDiv.setAttribute("id", this.baseOfAnswerPairId + order.toString());
        answerDiv.classList.add("answer-div");
        answerDiv.setAttribute("draggable", "true");

        answerDiv.addEventListener("dragstart", ev => this.drag(ev));

        answerDiv.append(this.createValueText(answer));

        return answerDiv;

    }


    createValueText(value) {
        let text = document.createElement("p");
        text.classList.add("value-text");
        text.innerHTML = value;

        return text;
    }


    changeItemsInArray(values) {
        let lengthOfValues = values.length;

        let newArray = [];

        for (let i = 0; i < lengthOfValues; i++) {
            let randomIndex = Math.floor(Math.random() * values.length);
            newArray[i] = values[randomIndex];
            values.splice(randomIndex, 1);
        }

        return newArray;
    }


    drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");

        if (ev.target.childElementCount === 0 && ev.target.nodeName === "DIV")
            ev.target.appendChild(this.dom.getElementById(data));
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }


    getPairs() {
        let pairs = [];

        for (let i = 1; i <= this.countPairs; i++) {
            let pair = {};
            pair["question"] = this.getValueOfQuestion(this.baseOfQuestionPlacePairId + i.toString());
            pair["answer"] = this.getAnswerToQuestion(this.baseOfCorrectPlacePairId + i.toString());
            pairs.push(pair);
        }
        return pairs;
    }

    getValueOfQuestion(id) {
        return this.dom.getElementById(id).firstElementChild.innerHTML;
    }

    getCorrectPlace(id) {
        return this.dom.getElementById(id);
    }

    getAnswerToQuestion(id) {
        let correctPlace = this.getCorrectPlace(id);

        let isAnswerPresent = correctPlace.childElementCount;

        if (isAnswerPresent === 1) {
            return correctPlace.firstElementChild.firstElementChild.innerHTML;
        }

        return "";
    }


    createAnswer() {
        let answer = {};

        answer["pairs"] = this.getPairs();

        return answer;
    }

    getAnswer() {
        return this.createAnswer();
    }


}
