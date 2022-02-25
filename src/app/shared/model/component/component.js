import {PathEncoder} from './path-encoder.js';

export class Component extends HTMLElement {
    constructor(config) {
        super();
        this.config = config;
        this.dom = this.attachShadow({mode: 'open'});

    }

    async load(inline, html) {
        if (this.config.stylePaths) {
            this.config.stylePaths.forEach((stylePath) => this.setCss(stylePath));
        }
        const pathEncoder = new PathEncoder();
        this.loadCss(pathEncoder.getRootPath() + 'style.css');
        this.loadCss(pathEncoder.getRootPath() + 'app/shared/library/font-awesome/css/all.min.css')
        if (inline) {
            this.dom.innerHTML += html;
        } else {
            await this.loadHtml().then((html) => this.setHTML(html));
        }

    }


    async loadHtml() {
        const pathEncoder = new PathEncoder();
        const path = pathEncoder.getComponentPath(this.config.templatePath)
        const response = await fetch(path)
        return await response.text();
    }

    setHTML(html) {
        this.dom.innerHTML += html;
    }

    loadCss(path) {
        this.createCssLink(path);
        this.createPreloadCssLink(path);
    }

    setCss(stylePath) {
        const pathEncoder = new PathEncoder();
        this.loadCss(pathEncoder.getComponentPath(stylePath));
    }

    createCssLink(path) {
        let link = document.createElement("link");
        link.setAttribute("href", path);
        link.setAttribute("rel", "stylesheet");
        this.dom.prepend(link);
    }

    createPreloadCssLink(path) {
        let linkPreload = document.createElement("link");
        linkPreload.setAttribute("rel", "preload");
        linkPreload.setAttribute("href", path);
        linkPreload.setAttribute("as", "style");
        this.dom.prepend(linkPreload);
    }
}


