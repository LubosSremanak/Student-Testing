import {Component} from "../../../../shared/model/component/component.js";
import {domService} from "../../../../shared/services/dom.service.js";


const component = {
    selector: 'app-points-edit',
    templatePath: 'lecturer-test/edit-test/points-edit/points-edit.component.html',
    stylePaths: ['lecturer-test/edit-test/points-edit/points-edit.component.css'],
};

export class PointsEditComponent extends Component {
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
        const pointsField = this.dom.getElementById("points-field");
        const points = domService.getAttribute(this, "points");
        if (points) {
            pointsField.value = points;
        } else {
            pointsField.setAttribute("placeholder",'?');
        }

        const disabled = domService.getAttribute(this, "disabled");
        if(disabled) {
            pointsField.setAttribute("disabled", disabled);
        }
    }

    getPoints() {
        return this.dom.getElementById("points-field").value;
    }

    eventsInitializer() {
    }

}
