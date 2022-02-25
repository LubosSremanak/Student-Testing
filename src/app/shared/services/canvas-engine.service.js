class CanvasEngineService {

    constructor() {
    }

    createLine(canvasProperties, position) {
        return new Konva.Line({
            stroke: canvasProperties.actualColor,
            strokeWidth: canvasProperties.brushWidth,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation:
                canvasProperties.mode === 'brush' ? 'source-over' : 'destination-out',
            points: [position.x, position.y],
            name: 'line',
            perfectDrawEnabled: false,
            transformsEnabled: 'position'
        });
    }

    createStage(dom, dimension) {
        return new Konva.Stage({
            container: dom,
            width: dimension.width,
            height: dimension.height,
        });
    }

    createLayer() {
        return new Konva.Layer();
    }

    createRubber(canvasProperties) {
       return  new Konva.Circle({
            stroke: 'grey',
            strokeWidth: canvasProperties.brushWidth,
            visible: false,
            listening: false
        });

    }
}


export const canvasEngineService = new CanvasEngineService();
