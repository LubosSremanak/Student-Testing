import {Component} from "../../../shared/model/component/component.js";
import {testsService} from "../../../api/tests/services/tests.service.js";
import {domService} from "../../../shared/services/dom.service.js";
import {tableService} from "../../../shared/services/table.service.js";


const component = {
    selector: 'app-test-table',
    templatePath: 'lecturer-test/test-table/test-table.component.html',
    stylePaths: ['lecturer-test/test-table/test-table.component.css',
        'lecturer-test/test-table/table.css'],
};

export class TestTableComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.checkUnauthorized().then(() =>{
            // this.isSetParam();
            this.load().then(() => this.onInit());
        })

    }

    async checkUnauthorized()
    {
        this.preResponse = await testsService.readTests();

        if(this.preResponse.responseErrorMessage)
        {
            this.handleErrorResponseMessage(this.preResponse.responseErrorMessage);
        }
    }


    onInit() {
        this.setAllTests();
    }

    setAllTests() {
        testsService.readTests()
            .then(this.writeAllTestsToTable)
    }

    writeAllTestsToTable = (json) => {
        for (let test of json.response.tests) {
            this.writeTestToTable(test);
        }
    }

    writeTestToTable(test) {
        const row = this.getTestRow(test);
        this.dom.getElementById("test-table-body").appendChild(row);
    }

    getTestRow(test) {
        const row = document.createElement("TR");

        const titleColumn = this.getLinkColumn(test);
        const keyColumn = tableService.getColumn(test.code);
        const activityColumn = this.getActivityColumn(test.is_active);
        const dateColumn = tableService.getColumn(test.test_created);
        const actionColumn = this.getAction(test);
        row.appendChild(titleColumn);
        row.appendChild(keyColumn);
        row.appendChild(dateColumn);
        row.appendChild(activityColumn);
        row.appendChild(actionColumn);
        return row;
    }

    getAction(test) {
        const column = document.createElement("TD");
        const activate = tableService.getIconButton("activateButton", "fa-play-circle");
        const deactivate = tableService.getIconButton("deactivateButton", "fa-stop-circle");
        const isActive = JSON.parse(test.is_active);
        activate.addEventListener("click", () => this.activateTest(test));
        deactivate.addEventListener("click", () => this.deactivateTest(test));
        activate.disabled = isActive;
        deactivate.disabled = !isActive;
        column.append(activate);
        column.append(deactivate);
        return column;
    }


    getLinkColumn(test) {
        const column = document.createElement("TD");
        const link = document.createElement("a");
        link.setAttribute("class", "link");
        link.classList.add("link");
        link.classList.add("semi-bold");
        link.addEventListener("click", () => this.openDetail(test));
        link.innerText = test.title;
        column.append(link);
        return column;
    }

    activateTest = (test) => {
        const activation = {wantActivate: true};

        testsService.updateTest(test.code, activation).then(this.updateAllTests);
    };

    deactivateTest = (test) => {
        const activation = {wantActivate: false};

        testsService.updateTest(test.code, activation).then(this.updateAllTests);
    };

    updateAllTests() {
        domService.createAndEmitEvent(document, "updateAllTests", true);
    }

    openDetail = (test) => {
        domService.createAndEmitEvent(this, "testDetail", test);
    };


    getActivityColumn(activity) {
        const isActive = JSON.parse(activity);
        if (isActive === 1) {
            return tableService.getColumn("Aktívny");
        } else {
            return tableService.getColumn("Neaktívny");
        }
    }

    getLecturerId() {

        let queryParams = window.location.search;
        let params = new URLSearchParams(queryParams);

        return params.get("lecturerId");
    }

    redirectToLoginPage = () => {
        location.replace("../../../index.html");
    }

    isSetParam() {
        if (this.getLecturerId() === null) {
            this.redirectToLoginPage();
        }
    }

    handleErrorResponseMessage(errorMessage) {
        if (errorMessage.responseCode === 401) {
            this.redirectToLoginPage();
        }
    }

}
