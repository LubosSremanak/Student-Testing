import {ApiService} from "../../../shared/model/service/api-service.js";

class StudentService extends ApiService {

    /**
     * Add student to database if not exists
     *
     * @param {any} student - Student
     * @return {Promise<any>} Returns promised json
     *
     */
    async createLecturerLogin(student) {
        const url = this.rootURL + 'student-creator/' ;
        const response = await fetch(url, this.requestPOST(student)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    async updateInTestStatus($key, $studentId) {
        const url = this.rootURL + 'tests/' + $key + "/activities-updator/" + $studentId;
        const inputJson = {
            wasIn: true
        }
        const response = await fetch(url, this.requestPUT(inputJson)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    async updateOutTestStatus($key, $studentId) {
        const url = this.rootURL + 'tests/' + $key + "/activities-updator/" + $studentId;
        const inputJson = {
            wasIn: false
        }
        const response = await fetch(url, this.requestPUT(inputJson)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }
}

export const studentService = new StudentService();
