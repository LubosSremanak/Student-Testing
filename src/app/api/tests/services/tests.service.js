import {ApiService} from "../../../shared/model/service/api-service.js";

class TestsService extends ApiService {

    /**
     * Read all tests for logged lecturer
     *
     * @return {Promise<any>} Returns promised json
     */
    async readTests() {
        const url = this.rootURL + 'tests/';
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Read information about test
     *
     * @param {string} testKey - Test key
     * @return {Promise<any>} Returns promised json
     *
     */
    async readTest(testKey) {
        const url = this.rootURL + 'tests/' + testKey;
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Save test
     *
     * @param {string} testKey - Test key
     * @param {any} test - Test
     * @return {Promise<any>} Returns promised json
     *
     */
    async createTest(testKey, test) {
        const url = this.rootURL + 'tests/' + testKey;
        const response = await fetch(url, this.requestPOST(test)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Activate/Deactivate test
     *
     * @param {string} testKey - Test key
     * @param {any} test - Test
     * @return {Promise<any>} Returns promised json
     *
     */
    async updateTest(testKey, test) {
        const url = this.rootURL + 'tests/' + testKey;
        const response = await fetch(url, this.requestPUT(test)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Read all questions without answers (STUDENT)
     *
     * @param {string} testKey - Test key
     * @return {Promise<any>} Returns promised json
     *
     */
    async readQuestions(testKey) {
        const url = this.rootURL + 'tests/' + testKey + '/questions';
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Export test result for all students (format:CSV)
     *
     * @param {string} testKey - Test key
     * @return {Promise<any>} Returns promised json
     *
     */
    async createResultsExport(testKey) {
        const url = this.rootURL + 'tests/' + testKey + '/export';
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);

        return response ? await response.text() : this.handleErrors(new Error());
    }

    /**
     * Read all students in test
     *
     * @param {string} testKey - Test key
     * @return {Promise<any>} Returns promised json
     *
     */
    async readTestAnswers(testKey) {
        const url = this.rootURL + 'tests/' + testKey + '/students/';
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Read student answers in test
     *
     * @param {string} studentId - Student id
     * @param {string} testKey - Test key
     * @return {Promise<any>} Returns promised json
     *
     */
    async readStudentTestAnswers(studentId, testKey) {
        const url = this.rootURL + 'tests/' + testKey + '/students/' + studentId;
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Create students answers after test end
     *
     * @param {string} studentId - Student id
     * @param {string} testKey - Test key
     * @param {any} test - Test
     * @return {Promise<any>} Returns promised json
     *
     */
    async createStudentTestAnswers(studentId, testKey, test) {
        const url = this.rootURL + 'tests/' + testKey + '/students/' + studentId;
        const response = await fetch(url, this.requestPOST(test)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Lecturer changes the points of the student's test
     *
     * @param {string} studentId - Student id
     * @param {string} testKey - Test key
     * @param {any} test - Test
     * @return {Promise<any>} Returns promised json
     *
     */
    async updateStudentTestAnswers(studentId, testKey, test) {
        const url = this.rootURL + 'tests/' + testKey + '/students/' + studentId;
        const response = await fetch(url, this.requestPUT(test)).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }

    /**
     * Export student test answers (format:PDF)
     *
     * @param {string} studentId - Student id
     * @param {string} testKey - Test key
     * @param {any} test - Test
     * @return {Promise<any>} Returns promised json
     *
     */
    async createStudentTestAnswersExport(testKey) {
        const url = this.rootURL + 'tests/' + testKey + '/students/export';
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.text() : this.handleErrors(new Error());
    }
}

/**
 * Tests management service
 *
 * @example
 * testsService.readTests().then((response) => {

});
 */
export const testsService = new TestsService()
