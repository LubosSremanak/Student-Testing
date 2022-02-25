import {Component} from "../../../shared/model/component/component.js";
import {testsService} from "../../../api/tests/services/tests.service.js";
import {tableService} from "../../../shared/services/table.service.js";
import {domService} from "../../../shared/services/dom.service.js";

const component = {
    selector: 'app-non-active-test-detail',
    templatePath: 'lecturer-test/non-active-test-detail/non-active-test-detail.component.html',
    stylePaths: ['lecturer-test/non-active-test-detail/non-active-test-detail.component.css'
        , 'lecturer-test/test-table/test-table.component.css'],
};

export class NonActiveTestDetailComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());

    }

    onInit() {
        this.table = this.dom.getElementById("test-table-body");
        this.setStudents();
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {

    }

    eventsInitializer() {
        const csv = this.dom.getElementById("export-csv-button");
        const pdf = this.dom.getElementById("export-pdf-button");
        csv.addEventListener("click", this.exportToCSV);
        pdf.addEventListener("click", this.exportToPDF);
    }

    setStudents() {
        const testInfo = domService.getAttribute(this, 'test');
        this.dom.getElementById("test-title").innerText = testInfo.title;
        this.dom.getElementById("test-code").innerText = "#" + testInfo.code;
        this.testCode = testInfo.code;
        testsService.readTestAnswers(testInfo.code).then(this.appendStudents);
    }

    appendStudents = (json) => {
        const students = json.response.students;

        if (students.length > 0) {
            students.forEach(this.createRow);
        } else {
            const body = this.dom.getElementById("test-table-body");
            const placeHolder = tableService.getEmptyTablePlaceholder("Nikto nepisal test");
            body.appendChild(placeHolder);
        }
    };

    createRow = (student) => {
        const name = tableService.getColumn(student.name + ' ' + student.surname);
        const id = tableService.getColumn(student.id);
        const action = tableService.getIconButton('editTest', 'fa-arrow-circle-right');
        const actionColumn = tableService.getColumn("");
        action.classList.add("edit-test");

        action.addEventListener("click", () => this.editStudentTest(student.id));
        actionColumn.appendChild(action);
        const row = tableService.getRow([name, id, actionColumn]);
        this.table.appendChild(row);
    };

    editStudentTest(studentId) {
        domService.createAndEmitEvent(document, "testEdit",
            {testCode: this.testCode, studentId: studentId});
    }

    exportToCSV = () => {
        testsService.createResultsExport(this.testCode).then((response) => {
            this.downloadCSV(response);
        });
    };

    exportToPDF = () => {
        testsService.createStudentTestAnswersExport(this.testCode).then((response) => {
            this.downloadPDF(response);
        })
    };


    downloadCSV(data) {
        const a = document.createElement('a');
        const file = new Blob([data], {type: 'text'});
        a.href = URL.createObjectURL(file);
        a.download = "export-test-" + this.testCode + ".csv";
        a.click();
    }

    downloadPDF(data) {
        const a = document.createElement('a');
        const header = "data:application/pdf;base64,";
        a.href = header + data;
        a.download = "export-test-" + this.testCode + "." + 'pdf';
        a.click();
    }
}
