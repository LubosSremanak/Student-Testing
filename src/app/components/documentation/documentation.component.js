import {Component} from "../../shared/model/component/component.js";

const component = {
    selector: 'app-documentation',
    templatePath: 'documentation/documentation.component.html',
    stylePaths: ['documentation/documentation.component.css'],
};

export class DocumentationComponent extends Component {
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

    }

    eventsInitializer() {
}
    }
