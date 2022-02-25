import {domService} from "./dom.service.js";
import {SnackbarComponent} from "../../components/snackbar/snackbar.component.js";

class SnackbarService {

    constructor() {
    }

    open(dom, data) {
        // const data = {message, type,duration};
        const attribute = {name: "snackbar", data};
        const actualSnackbar = dom.querySelector("APP-SNACKBAR");

        if (actualSnackbar) {
            actualSnackbar.parentNode.removeChild(actualSnackbar);
        }
        domService.appendDomAndSetAttribute(dom, SnackbarComponent, attribute);
    }
}

export const snackbarService = new SnackbarService();
