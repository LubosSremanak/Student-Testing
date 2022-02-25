import {Component} from "../../../../shared/model/component/component.js";
import * as KonvaJS from "https://unpkg.com/konva@7.0.3/konva.min.js";
import {canvasEngineService} from "../../../../shared/services/canvas-engine.service.js";
import {domService} from "../../../../shared/services/dom.service.js";

const component = {
    selector: 'app-canvas',
    templatePath: '/student-test/draw-question/canvas/canvas.component.html',
    stylePaths: ['/student-test/draw-question/canvas/canvas.component.css'],
};

export class CanvasComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);

        this.canvasProperties = this.createCanvasProperties();
        this.load().then(() => this.onInit());
    }

    onInit() {
        this.dom.getElementById("canvas-panel").setTargetComponent(this);
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {
        this.createCanvas();
        const questionWording = domService.getAttribute(this, "question-wording")
        const question = this.dom.getElementById("question");
        domService.setAttribute(question, "questionWording", questionWording);
    }

    createCanvasProperties() {
        return {
            mode: 'brush',
            backgroundColor: 'white',
            actualColor: 'black',
            brushWidth: 10
        }
    }

    createCanvas() {
        const canvas = this.dom.getElementById("canvas");
        const dimension = this.getCanvasDimension(canvas);
        this.stage = canvasEngineService.createStage(canvas, dimension);
        this.layer = canvasEngineService.createLayer();
        this.circle = canvasEngineService.createRubber(this.canvasProperties);
        this.layer.add(this.circle);
        this.isFill = false;
        this.isPaint = false;
    }

    getCanvasDimension(canvas) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {width, height}
    }


    eventsInitializer() {
        this.dom.getElementById("close").addEventListener("click", this.saveImage);
        this.stage.on('mousedown touchstart', this.onMouseDown);
        this.stage.on('mouseup touchend', this.onMouseUp);
        this.stage.on('mousemove touchmove', this.onMove);
        this.stage.add(this.layer);
    }

    lineOnMouseDown = (line) => {
        if (this.isFill) {
            this.fillLine(line.target, this.canvasProperties.actualColor);
        }
    }

    onMouseDown = async line => {
        this.isPaint = true;
        const position = this.stage.getPointerPosition();
        this.lastLine = this.createLine(position);
        this.lastLine.on('mousedown touchstart', this.lineOnMouseDown);
        this.layer.add(this.lastLine);
        this.layer.batchDraw();
    }

    onMouseUp = async e => {
        this.isPaint = false;
        this.circle.visible(false);
    }

    onMove = async e => {
        if (!this.isPaint || this.isFill) {
            return;
        }
        const position = this.stage.getPointerPosition();
        if (this.canvasProperties.mode !== 'brush') {
            this.circle.visible(true);
            this.circle.setX(position.x);
            this.circle.setY(position.y);
            this.circle.radius(this.canvasProperties.brushWidth);
            this.circle.moveToTop();
            this.lastLine.strokeWidth(this.lastLine.strokeWidth() + 0.3);
        }
        const newPoints = this.lastLine.points().concat([position.x, position.y]);
        this.lastLine.points(newPoints);
        this.layer.batchDraw();
    };

    saveImage = () => {
        let url;
        try {
            url = this.stage.toDataURL();
        } catch (e) {
            url = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA\n" +
                "    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO\n" +
                "        9TXL0Y4OHwAAAABJRU5ErkJggg==";
        }
        domService.createAndEmitEvent(document, "saveCanvasImage", url);
        this.dom.innerHTML = "";

    };

    setMode(event) {
        this.canvasProperties.mode = 'brush';
        if (event) {
            this.canvasProperties.mode = 'rubber';
        }
    }

    deleteCanvas() {
        const layers = this.stage.find('Line');
        layers.forEach((line) => {
            line.destroy();
        });
        this.stage.batchDraw();
    };

    fillLine(line, color) {
        if (!line) {
            return;
        }
        const len = line.attrs.points.length - 1;
        line.closed(true);
        line.fillLinearGradientStartPoint({x: line.attrs.points[0], y: line.attrs.points[1]});
        line.fillLinearGradientEndPoint({x: line.attrs.points[len - 2], y: line.attrs.points[len - 1]});
        line.fillLinearGradientColorStops([0, color, 1, color]);
    }

    createLine(position) {
        return canvasEngineService.createLine(this.canvasProperties, position);
    }
}
