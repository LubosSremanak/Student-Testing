import {Component} from "../../shared/model/component/component.js";
import {domService} from "../../shared/services/dom.service.js";

const component = {
    selector: 'app-snackbar',
    templatePath: 'snackbar/snackbar.component.html',
    stylePaths: ['snackbar/snackbar.component.css'],
};

export class SnackbarComponent extends Component {
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
        const data = domService.getAttribute(this, "snackbar");
        this.setColorByType(data.type);
        this.setMessage(data.message);
        this.autoHide(data.duration).then(() => {
                this.timeout(1).then(r => {
                    this.dom.innerHTML = "";
                });
            }
        );
    }

    eventsInitializer() {
    }

    setColorByType(type) {
        const snackbar = this.dom.getElementById("snackbar");
        snackbar.style.backgroundColor = this.getColorByType(type);
    }

    setMessage(message) {
        const snackbarMessage = this.dom.getElementById("snackbar-message");
        snackbarMessage.innerText = message;
    }

    async autoHide(duration) {
        const snackbar = this.dom.getElementById("snackbar");
        snackbar.classList.remove("hide");
        snackbar.classList.add("show");
        const timeout = await this.timeout(duration);
        snackbar.classList.remove("show");
        snackbar.classList.add("hide");
        clearTimeout(timeout);
    }

    timeout(s) {
        return new Promise(resolve => setTimeout(resolve, 1000 * s));
    }

    getColorByType(type) {
        if (type === "success") {
            return '#55AB5D'
        } else if (type === "danger") {
            return '#DE354C'
        } else if (type === "warning") {
            return '#E8B125'
        } else {
            console.warn("Bad snackbar type {success,danger,warning}")
        }
    }
}
