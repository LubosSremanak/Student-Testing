import {Component} from "../../../shared/model/component/component.js";
import {LecturerRegisterFormComponent} from "../lecturer-register-form/lecturer-register-form.component.js";
import {domService} from "../../../shared/services/dom.service.js";
import {lecturerService} from "../../../api/lecturer/services/lecturer.service.js";
import {snackbarService} from "../../../shared/services/snackbar.service.js";

const component = {
    selector: 'app-lecturer-login-form',
    templatePath: 'home/lecturer-login-form/lecturer-login-form.component.html',
    stylePaths: ['home/lecturer-login-form/lecturer-login-form.component.css'],
};

export class LecturerLoginFormComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
        const lecturerRegisterButton = this.dom.getElementById("register-link");
        lecturerRegisterButton.addEventListener("click", () => this.lecturerRegisterButtonClick(this.dom));
    }

    attributesInitializer() {

    }

    eventsInitializer()
    {
        let loginButton = this.dom.getElementById("lecturer-login-button");

        loginButton.addEventListener("click", () => {
            this.validateAndLoginLecturer();
        })

    }

    lecturerRegisterButtonClick(dom) {
        const form = dom.getElementById("home-form");
        domService.changeDom(form, LecturerRegisterFormComponent);
        form.scrollIntoView();
    }


    validateAndLoginLecturer()
    {

        if(this.isFilledInput() && this.isCorrectFormatEmail())
        {
            this.loginLecturer();
        }
    }

    loginLecturer()
    {
        lecturerService.createLecturerLogin(this.createLoginData()).then(this.verifyLoginDataAndLoginLecturer);
    }

    createLoginData()
    {
        let email = this.getEmail();
        let password = this.getPassword();

        return {
            email: email,
            password: password
        }
    }

    verifyLoginDataAndLoginLecturer = (json) => {
        let data = json.response;



        let isAbleToLogin = this.isAbleToLogin(data);

        if(isAbleToLogin)
        {
            this.login(data.lecturer);
        }

    }

    isAbleToLogin(data)
    {
        if(!data.accountExists)
        {
            this.showDangerMessage("Účet s daným emailom neexistuje",3);
            return false;
        }

        if(!data.correctPassword)
        {
            this.showDangerMessage("Nesprávne heslo", 3);
            return false;
        }

        return true;
    }


    login(lecturer)
    {
        location.replace(this.getLecturerUrl(lecturer.lecturerId));
    }

    getLecturerUrl(lerturerId)
    {
        let baseUrl = "app/views/lecturer-test/index.html";

        // let params = "?lecturerId=" + lerturerId;
        //
        // return baseUrl + params;
        return baseUrl;
    }

    isFilledInput()
    {
        if(this.isFilledEmail() && this.isFilledPassword())
        {
            return true;
        }

        this.showDangerMessage("Nesprávne prihlasovacie údaje",3);

        return false;
    }

    isFilledEmail()
    {
        let email = this.getEmail();

        return !(email === "" || email === null);
    }

    isFilledPassword()
    {
        let password = this.getPassword();

        return !(password === "" || password === null);
    }


    getEmail()
    {
        return this.dom.getElementById("email").value.trim();
    }

    getPassword()
    {
        return this.dom.getElementById("password").value.trim();
    }


    isCorrectFormatEmail()
    {
        const regex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm);

        let isCorrect = regex.test(this.getEmail());

        if(!isCorrect)
        {
            this.showDangerMessage("Nesprávny format emailu",3);
            return false;
        }

        return true;
    }





    showDangerMessage(message, duration)
    {
        snackbarService.open(this.dom,{type: "danger", message: message, duration: duration});
    }

    showWarningMessage(message, duration)
    {
        snackbarService.open(this.dom,{type: "warning", message: message, duration: duration});
    }

    showSuccessMessage(message, duration)
    {
        snackbarService.open(this.dom,{type: "success", message: message, duration: duration});
    }

}
