import {domService} from "../../shared/services/dom.service.js";
import {Component} from "../../shared/model/component/component.js";

const component = {
    selector: 'app-math-panel',
    templatePath: 'math-panel/math-panel.component.html',
    stylePaths: ['math-panel/math-panel.component.css'],
};

export class MathPanelComponent extends Component {
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
        this.generateButtons("Operácie");
    }

    eventsInitializer() {
    }

    generateButtons(cat)
    {
        let panel = this.dom.getElementById("math-panel");

        let panelContent = document.createElement("div");
        panelContent.id = "panelContent";
        panel.appendChild(panelContent);

        let panelContentSymbols = document.createElement("div");
        panelContentSymbols.id = "panelContentSymbols";
        panel.appendChild(panelContentSymbols);

        let parentheses = {
            "{": "{",
            "}": "}",
            "[": "[",
            "]": "]",
            "(": "(",
            ")": ")"
        }
        let functions = {
            "log": "\\log",
            "ln": "\\ln",
            "sin": "\\sin",
            "cos": "\\cos",
            "tan": "\\tan",
            "cot": "\\cot",
            "arcsin": "\\arcsin",
            "arccos": "\\arccos",
        }
        let operations = {
            "≠": "\\ne",
            "=": "=",
            "+": "+",
            "-": "-",
            "*": "*",
            "/": "/",
            "^": "^",
            "√": "\\sqrt",
            "∫": "\\int",
            "∮": "\\oint",
            "∑": "\\sum",
            "∏": "\\prod",
            "lim": "\\lim",
        }
        let constants = {
            "π": "\\pi",
            "e": "e",
            "λ": "\\lambda",
        }

        let map = new Map();
        map.set("Operácie", operations);
        map.set("Funkcie", functions);
        map.set("Konštanty", constants);
        map.set("Zátvorky", parentheses);

        for (let e of map)
        {
            let btn = document.createElement("button");
            btn.innerText = e[0];
            btn.addEventListener('click', (e) => {
                panelContent.remove();
                panelContentSymbols.remove();
                this.generateButtons(e.target.innerText);
            }, false);
            panelContent.appendChild(btn);
        }

        for(let key in map.get(cat))
        {
            let newbtn = document.createElement("button");
            newbtn.innerHTML = key;

            newbtn.addEventListener("click",
                (e) => {
                    domService.createAndEmitEvent(this, "mathSymbolAppear", map.get(cat)[e.target.innerText]);
                });

            panelContentSymbols.appendChild(newbtn);
        }
    }
}