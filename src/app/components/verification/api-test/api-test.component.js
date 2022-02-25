import {Component} from "../../../shared/model/component/component.js";
import {keyGeneratorService} from "../../../api/key-generator/services/key-generator.service.js";
import {testsService} from "../../../api/tests/services/tests.service.js";
import {lecturerService} from "../../../api/lecturer/services/lecturer.service.js";

const component = {
    selector: 'app-api-test',
    templatePath: 'verification/api-test/api-test.component.html',
    stylePaths: ['verification/api-test/api-test.component.css'],

};

export class ApiTestComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.countErrors = 0;
        this.countResponse = 0;
        this.load().then(() => this.onInit());
    }

    async onInit() {
        await this.testTestsService();
        await this.testKeyGeneratorService();
        await this.testLecturerService();

        if (this.countErrors === 0) {
            this.createReport("API works, all tests passed", "success");
        } else {
            const message = this.countErrors + " errors from " + this.countResponse + " response";
            this.createReport(message, "danger");
        }
    }

    createReport(response, type) {
        const report = document.createElement("span");
        report.innerText = response;
        if (type === 'success') {
            report.style.color = '#14a916';
        }
        if (type === 'danger') {
            report.style.color = '#a91414';
        }
        this.dom.getElementById("api-test").append(report);
    }

    printResponse(response, dom) {
        if (response.error) {
            dom.createReport(response.message);
            this.countErrors++;
        }
        this.countResponse++;
    }

    async testKeyGeneratorService() {
        await keyGeneratorService.readGeneratedKey().then((response) => this.printResponse(response, this));
    }

    async testLecturerService() {
        await lecturerService.createLecturerLogin(null).then((response) => this.printResponse(response, this));
        await lecturerService.createLecturerRegistration(null).then((response) => this.printResponse(response, this));
    }

    async testTestsService() {
        await testsService.readTests().then((response) => this.printResponse(response, this));
        await testsService.readTest("7855").then((response) => this.printResponse(response, this));
        await testsService.readQuestions("8978").then((response) => this.printResponse(response, this));
        await testsService.readTestAnswers("5465465").then((response) => this.printResponse(response, this));
        await testsService.readStudentTestAnswers("97979", "5465465").then((response) => this.printResponse(response, this));
        await testsService.createResultsExport("5465465", null).then((response) => this.printResponse(response, this));
        await testsService.createTest("5465465", null).then((response) => this.printResponse(response, this));
        await testsService.createStudentTestAnswers("65465", "65465adas", null).then((response) => this.printResponse(response, this));
        await testsService.createStudentTestAnswersExport("d4asd", "das", null).then((response) => this.printResponse(response, this));
        await testsService.updateTest("sda46546", null).then((response) => this.printResponse(response, this));
        await testsService.updateStudentTestAnswers("sda46546", "adsdas", null).then((response) => this.printResponse(response, this));

    }
}
