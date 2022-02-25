import {ApiService} from "../../../shared/model/service/api-service.js";

class LecturerService extends ApiService {

    /**
     * Register lecturer
     *
     * @param {any} lecturer - Lecturer
     * @return {Promise<any>} Returns promised json
     *
     */
    async createLecturerRegistration(lecturer) {
        const url = this.rootURL + 'lecturer-registration/';
        const response = await fetch(url, this.requestPOST(lecturer)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Login Lecturer
     *
     * @param {any} lecturer - Lecturer
     * @return {Promise<any>} Returns promised json
     *
     */
    async createLecturerLogin(lecturer) {
        const url = this.rootURL + 'lecturer-login/';
        const response = await fetch(url, this.requestPOST(lecturer)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    async getLecturerInfo()
    {
        const url = this.rootURL + 'lecturer-login/';
        const response = await fetch(url,this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    async lecturerLogout(lecturer)
    {
        const url = this.rootURL + 'lecturer-logout/';
        const response = await fetch(url,this.requestPOST(lecturer)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }
}

export const lecturerService = new LecturerService();
