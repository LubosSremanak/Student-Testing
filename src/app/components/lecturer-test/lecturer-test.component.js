import {Component} from "../../shared/model/component/component.js";
import {domService} from "../../shared/services/dom.service.js";
import {TestMakerComponent} from "./test-maker/test-maker.component.js";
import {TestTableComponent} from "./test-table/test-table.component.js";
import {ActiveTestDetailComponent} from "./active-test-detail/active-test-detail.component.js";
import {NonActiveTestDetailComponent} from "./non-active-test-detail/non-active-test-detail.component.js";
import {EditTestComponent} from "./edit-test/edit-test.component.js";
import {lecturerService} from "../../api/lecturer/services/lecturer.service.js";


const component = {
    selector: 'app-lecturer-test',
    templatePath: 'lecturer-test/lecturer-test.component.html',
    stylePaths: ['lecturer-test/lecturer-test.component.css'],
};

export class LecturerTestComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.setName().then(() => this.load().then(() => this.onInit()));

    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {

        const sideMenu = this.dom.getElementById("side-menu");
        domService.setAttribute(sideMenu, "headerName", this.fullName);
    }

    eventsInitializer() {
        const sideMenu = this.dom.getElementById("side-menu");
        const allTests = this.dom.querySelector("APP-TEST-TABLE");
        sideMenu.addEventListener("menuSwap", this.menuSwapped);
        sideMenu.addEventListener("openCreateTest", this.openTestBuilder);
        sideMenu.addEventListener("showAllTests", this.openAllTests);
        allTests.addEventListener("testDetail", this.openTestDetail)
        document.addEventListener("updateAllTests", this.openAllTests);
        document.addEventListener("testEdit", this.testEdit);
        document.addEventListener("logout", this.logoutLecturer);
    }

    logoutLecturer = () => {
        lecturerService.lecturerLogout(null).then(this.redirectToLoginPage);
    }

    redirectToLoginPage = () => {
        location.replace("../../../index.html");
    }

    menuSwapped = (e) => {

    }

    openTestBuilder = () => {
        this.changePage(TestMakerComponent);
    };

    openAllTests = () => {
        this.changePage(TestTableComponent);
        this.eventsInitializer();
    };

    openTestDetail = (response) => {
        const test = response.detail;
        if (test.is_active === '1') {
            this.activeTestDetail(test);
        } else {
            this.nonActiveTestDetail(test);
        }
        domService.createAndEmitEvent(document, "testDetail", true);
    };

    testEdit = (testEvent) => {
        const attribute = {name: 'studentTestId', data: testEvent.detail}
        this.changePageAndSendAttribute(EditTestComponent, attribute);
    };


    activeTestDetail(test) {
        const attribute = {name: 'test', data: test}
        this.changePageAndSendAttribute(ActiveTestDetailComponent, attribute);
    }

    nonActiveTestDetail(test) {
        const attribute = {name: 'test', data: test}
        this.changePageAndSendAttribute(NonActiveTestDetailComponent, attribute);
    }

    changePageAndSendAttribute(component, attribute) {
        const container = this.dom.getElementById("dynamic-test-form");
        domService.changeDomAndSetAttribute(container, component, attribute);
    }

    changePage(component) {
        const container = this.dom.getElementById("dynamic-test-form");
        domService.changeDom(container, component);
    }

    async setName() {
        return await lecturerService.getLecturerInfo().then((response) => {
            if(!response.response.isLogged){
                this.redirectToLoginPage();
            }
            else {
                const info = response.response.info;
                this.fullName = info.name + ' ' + info.surname;
            }
        });
    }


}
