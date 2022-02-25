import {Component} from "../../../shared/model/component/component.js";
import {lecturerService} from "../../../api/lecturer/services/lecturer.service.js";
import {snackbarService} from "../../../shared/services/snackbar.service.js";

const component = {
    selector: 'app-lecturer-register-form',
    templatePath: 'home/lecturer-register-form/lecturer-register-form.component.html',
    stylePaths: ['home/lecturer-login-form/lecturer-login-form.component.css'],
};

export class LecturerRegisterFormComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
    }

    onInit() {
        this.attributesInitializer();
        this.eventsInitializer();
    }

    attributesInitializer() {

    }

    eventsInitializer()
    {
        let registerButton = this.dom.getElementById("lecturer-register-button");

        registerButton.addEventListener("click", () => {
            this.validateAndRegisterLecturer();
        })
    }

    validateAndRegisterLecturer()
    {
        if(this.isFilledInput() && this.isCorrectInput())
        {
            this.registerLecturer();
        }
    }

    registerLecturer()
    {
        lecturerService.createLecturerRegistration(this.createRegistrationData()).then(this.verifyRegistrationDataAndLoginLecturer);
    }

    createRegistrationData()
    {
        let lecturerName = this.getLecturerName();
        let lecturerSurname = this.getLecturerSurname();
        let lecturerEmail = this.getLecturerEmail();
        let lecturerPassword = this.getLecturerPassword();

        return {
            lecturerName: lecturerName,
            lecturerSurname: lecturerSurname,
            lecturerEmail:lecturerEmail,
            lecturerPassword: lecturerPassword
        }
    }

    verifyRegistrationDataAndLoginLecturer = (json) => {
        let data = json.response;

        let isAbleToLogin = this.isAbleToLogin(data);

        if(isAbleToLogin)
        {
            this.loginLecturer(data.lecturer);
        }
    }

    loginLecturer(lecturer)
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

    isAbleToLogin(data)
    {
        if(data.lecturerAlreadyExists)
        {
            this.showWarningMessage("Užívateľ s daným emailom už existuje",3);
            return false;
        }

        if(!data.correctRegistration)
        {
            this.showDangerMessage("Registrácia neprebehla úspešne", 3);
            return false;
        }

        return true;
    }


    isFilledInput()
    {
        if(this.isFilledLecturerName() && this.isFilledLecturerSurname() && this.isFilledLecturerEmail() && this.isFilledLecturerPassword())
        {
            return true;
        }

        this.showDangerMessage("Nesprávne prihlasovacie údaje",3);

        return false;
    }

    isCorrectInput()
    {
        if(this.getLecturerName().length > 128)
        {
            this.showWarningMessage("Meno učiteľa presahuje maximálny počet znakov", 3);
            return false;
        }

        if(this.getLecturerSurname().length > 128)
        {
            this.showWarningMessage("Priezvisko učiteľa presahuje maximálny počet znakov", 3);
            return false;
        }

        if(!this.isCorrectFormatEmail())
        {
            return false;
        }

        if(this.getLecturerPassword().length > 20)
        {
            this.showWarningMessage("Heslo učiteľa presahuje maximálny počet znakov", 3);
            return false;
        }

        return true;
    }

    isFilledLecturerName()
    {
        let name = this.getLecturerName();

        return !(name === "" || name === null);
    }

    isFilledLecturerSurname()
    {
        let surname = this.getLecturerSurname();

        return !(surname === "" || surname === null);
    }

    isFilledLecturerEmail()
    {
        let email = this.getLecturerEmail();

        return !(email === "" || email === null);
    }

    isFilledLecturerPassword()
    {
        let password = this.getLecturerPassword();

        return !(password === "" || password === null);
    }

    getLecturerName()
    {
        return this.dom.getElementById("name-lecturer").value.trim();
    }

    getLecturerSurname()
    {
        return this.dom.getElementById("surname-lecturer").value.trim();
    }

    getLecturerEmail()
    {
        return this.dom.getElementById("email-lecturer").value.trim();
    }

    getLecturerPassword()
    {
        return this.dom.getElementById("password-lecturer").value.trim();
    }


    isCorrectFormatEmail()
    {
        const regex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm);

        let isCorrect = regex.test(this.getLecturerEmail());

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
