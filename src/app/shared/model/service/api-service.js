import {PathEncoder} from "../component/path-encoder.js";
import {serverHostNumber} from "./config.js";

export class ApiService {

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    constructor() {
        const pathEncoder = new PathEncoder();
        if (pathEncoder.isLocalhost()) {
            this.rootURL = 'https://wt' + serverHostNumber + '.fei.stuba.sk/bwte2/bwte2-api/';
        } else {
            this.rootURL = '/bwte2/bwte2-api/';
        }
    }

    /**
     * Prepare GET request
     *
     * @return {Response} Returns GET request
     */
    requestGET() {
        return {
            method: 'GET',
            headers: this.headers
        }
    }

    /**
     * Prepare POST request
     *
     * @return {Response}Returns POST request
     */
    requestPOST(body) {
        return {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }

    /**
     * Prepare PUT request
     *
     * @return {Response} Returns PUT request
     */
    requestPUT(body) {
        return {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }

    /**
     * Returns null on error
     *
     * @return {null} Returns null
     */
    catchErrors() {
        return null;
    }

    /**
     * Return function name if error happened
     *
     * @return {message,error} Throws error status
     */
    handleErrors(error) {
        const message = "Error in " + error.stack.match(/at (.*?) /)[1];
        return {message, error: true};
    }

}
