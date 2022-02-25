import {Component} from "../../shared/model/component/component.js";
import {domService} from "../../shared/services/dom.service.js";
import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const component = {
    selector: 'app-side-menu',
    templatePath: 'side-menu/side-menu.component.html',
    stylePaths: ['side-menu/side-menu.component.css'],
};

export class SideMenuComponent extends Component {
    static selector = component.selector;

    constructor() {
        super(component);
        this.load().then(() => this.onInit());
        this.animation = null;
    }

    onInit() {
        this.loadLottieAnimation();
        this.attributesInitializer();
        this.menuTypeHandler();
        this.eventsInitializer();
    }

    attributesInitializer() {
        this.setHeaderName();

    }

    eventsInitializer() {
        try {
            this.dom.getElementById("side-menu-swap-button").addEventListener("click", this.swapMenu);
            this.dom.getElementById("send-test-button").addEventListener('click', this.sendTest);
            document.addEventListener("changeTime",this.readTime);
        } catch (e) {
            document.addEventListener("testDetail", this.showDetailMenu);
            this.dom.getElementById("create-test-button").addEventListener('click', this.openCreateTest);
            this.dom.getElementById("show-all-tests").addEventListener('click', this.openShowAll);
            this.dom.getElementById("logout-button").addEventListener('click', this.logout);
            document.addEventListener("updateAllTests", this.openShowAll);
        }
    }

    readTime = (event) =>{
        const data = event.detail;
        if(data === "inactive-test" || data === "invalid-key"){
            window.location.replace("/bwte2/");
        }

        if(data === "0"){
            this.sendTest();
        }

        if(data === "-1"){
            this.redirectToLoginPage();
        }

        const time = this.secondsToTime(data);
        this.dom.getElementById("timer").innerText = time + "";
    }

    secondsToTime(seconds){
        const date = new Date(0);
        date.setSeconds(seconds);
        return  date.toISOString().substr(11, 8);
    }

    menuTypeHandler() {
        this.setHeaderColor();
        const type = this.getAttribute('type');
        if (type === "student") {
            domService.removeAllElementsByClass(this.dom, 'lecturer');
        }
        if (type === "lecturer") {
            domService.removeAllElementsByClass(this.dom, 'student');
        }

    }

    swapMenu = () => {
        const menu = this.dom.getElementById("side-menu");
        const width = menu.style.width;
        domService.createAndEmitEvent(this, "menuSwap", width);
        if (width === '400px' || width === '') {
            this.hideMenu();
        } else {
            this.showMenu();

        }
    };


    sendTest = () => {
        domService.createAndEmitEvent(document, "sendTest", true);
    };

    redirectToLoginPage = () => {
        location.replace("../../../index.html");
    }

    openCreateTest = () => {
        this.swapCreateButton();
        domService.createAndEmitEvent(document, "closeActivities", true);
        domService.createAndEmitEvent(this, "openCreateTest", true);
    };

    openShowAll = () => {
        this.swapShowAllButton()
        domService.createAndEmitEvent(document, "closeActivities", true);
        domService.createAndEmitEvent(this, "showAllTests", true);
    };

    showDetailMenu = () => {
        const all = this.dom.getElementById("show-all-tests");
        const create = this.dom.getElementById("create-test-button");
        all.style.display = "flex";
        create.style.display = "flex";
    };

    swapShowAllButton() {
        const all = this.dom.getElementById("show-all-tests");
        const create = this.dom.getElementById("create-test-button");
        all.style.display = "none";
        create.style.display = "flex";
    }

    swapCreateButton() {
        const all = this.dom.getElementById("show-all-tests");
        const create = this.dom.getElementById("create-test-button");
        create.style.display = "none";
        all.style.display = "flex";
    }

    logout = () => {
        domService.createAndEmitEvent(document, "logout", true);
    };

    showMenu() {
        const menu = this.createMenuElements();
        menu.header.style.borderBottomRightRadius = '0px';
        menu.sideMenu.style.width = "400px";
        menu.menuHeader.style.width = '400px';
        menu.menuHeaderName.style.display = "flex";
        this.animation.setSpeed(1.8);
        this.animation.playSegments([30, 60], true);
    }

    hideMenu() {
        const menu = this.createMenuElements();
        menu.header.style.borderBottomRightRadius = '20px';
        menu.sideMenu.style.width = "0px";
        menu.menuHeader.style.width = '100px';
        menu.menuHeaderName.style.display = "none";
        this.animation.setSpeed(1.8);
        this.animation.playSegments([50, 30], true);

    }

    createMenuElements() {
        const sideMenu = this.dom.getElementById("side-menu");
        const header = this.dom.getElementById("side-menu-header");
        const menuHeader = this.dom.getElementById("side-menu-header");
        const menuHeaderName = this.dom.getElementById("side-menu-header-name");
        return {sideMenu, header, menuHeader, menuHeaderName};
    }

    loadLottieAnimation() {
        this.animation = lottieWeb.loadAnimation({
            container: this.dom.getElementById('side-menu-swap-button'),
            path: '../../../assets/animations/menuAnimation.json',
            renderer: 'svg',
            loop: false,
            autoplay: false,
        });
        this.animation.goToAndStop(50, true);
    }


    setHeaderName() {
        const headerName = domService.getAttribute(this, "headerName");
        this.dom.getElementById("side-menu-header-name").innerText = headerName + "";
    }

    setHeaderColor() {
        const type = domService.getInlineAttribute(this, 'type');
        const header = this.dom.getElementById("side-menu-header");
        header.style.backgroundColor = domService.getColorByType(type);
    }
}
