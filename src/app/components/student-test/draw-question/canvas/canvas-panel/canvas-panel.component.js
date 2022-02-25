import {Component} from "../../../../../shared/model/component/component.js";
import {domService} from "../../../../../shared/services/dom.service.js";


const component = {
    selector: 'app-canvas-panel',
    templatePath: '/student-test/draw-question/canvas/canvas-panel/canvas-panel.component.html',
    stylePaths: ['/student-test/draw-question/canvas/canvas-panel/canvas-panel.component.css'],
};

export class CanvasPanelComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
        this.selectedButtons = new Set();
        this.selectedStroke = new Set();
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {

    }

    eventsInitializer() {
        const colorPicker = this.dom.getElementById("color-picker-hidden");
        const colorPickerVisible = this.dom.getElementById("color-picker-visible");
        const brush = this.dom.getElementById("brush");
        const rubber = this.dom.getElementById("rubber");
        const fill = this.dom.getElementById("fill");
        const deleteAll = this.dom.getElementById("delete-all");
        const strokeThin = this.dom.getElementById("stroke1");
        const strokeHuge = this.dom.getElementById("stroke2");
        colorPicker.addEventListener("click", this.chooseColor);
        colorPicker.addEventListener("input", this.getColor);
        colorPickerVisible.addEventListener("click", () => colorPicker.click());
        brush.addEventListener("click", this.brushClick)
        rubber.addEventListener("click", this.rubberClick);
        fill.addEventListener("click", this.fillClick)
        deleteAll.addEventListener("click", this.deleteAllClick);
        strokeThin.addEventListener("click", this.strokeThin);
        strokeHuge.addEventListener("click", this.strokeHuge);
        this.selectedButtons.add(brush);
        brush.style.backgroundColor = "#DE354CFF"
    }

    chooseColor = (e) => {


    };

    getColor = (e) => {
        const color = e.target.value;
        this.dom.getElementById("color-picker-visible").style.backgroundColor
            = color;
        this.canvas.canvasProperties.actualColor = color;
    };

    brushClick = (e) => {
        this.canvas.setMode();
        this.clearAllSelectedButtons();
        this.selectedButtons.add(e.target);
        e.target.style.backgroundColor = "#DE354CFF";
    };

    rubberClick = (e) => {
        this.canvas.setMode(true);
        this.clearAllSelectedButtons();
        this.selectedButtons.add(e.target);
        e.target.style.backgroundColor = "#DE354CFF";
    };

    deleteAllClick = () => {
        this.canvas.deleteCanvas();
    };

    fillClick = (e) => {
        this.clearAllSelectedButtons();
        this.selectedButtons.add(e.target);
        e.target.style.backgroundColor = "#DE354CFF";
        this.canvas.isFill=true;
    };

    strokeHuge = (e) => {
        this.canvas.canvasProperties.brushWidth = 20;
        this.clearAllStrokeButtons();
        this.selectedStroke.add(e.target);
        e.target.style.backgroundColor = "#DE354CFF";
    };

    strokeThin = (e) => {
        this.canvas.canvasProperties.brushWidth = 10;
        this.clearAllStrokeButtons();
        this.selectedStroke.add(e.target);
        e.target.style.backgroundColor = "#DE354CFF";
    };

    clearAllSelectedButtons() {
        this.selectedButtons.forEach((button) => {
            button.style.backgroundColor = 'transparent';
        })
        this.canvas.isFill=false;
    }

    clearAllStrokeButtons() {
        this.selectedStroke.forEach((button) => {
            button.style.backgroundColor = 'black';
        })
    }

    setTargetComponent(dom) {
        this.canvas = dom;
    }
}
