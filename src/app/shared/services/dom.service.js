class DomService {
    constructor() {

    }

    /**
     * Change content of DOM/Element to Component
     *
     * @param {any} dom - Dom or Element
     * @param {any} component - Component
     * @return {void}
     *
     * @example
     *
     *    changeDom(domElement,UserComponent);
     */
    changeDom(dom, component) {
        dom.innerHTML = "";
        const dynamicComponent = document.createElement(component.selector);
        dom.append(dynamicComponent);
    }

    /**
     * Change content of DOM/Element to Component and set attribute
     *
     * @param {any} dom - Dom or Element
     * @param {any} component - Component
     * @param {any} attribute - Component
     * @return {void}
     *
     * @example
     *
     *    changeDom(domElement,UserComponent);
     */
    changeDomAndSetAttribute(dom, component, attribute) {
        dom.innerHTML = "";
        const dynamicComponent = document.createElement(component.selector);
        this.setAttribute(dynamicComponent, attribute.name, attribute.data);
        dom.append(dynamicComponent);
    }


    /**
     * Append content of DOM/Element to Component
     *
     * @param {any} dom - Dom or Element
     * @param {any} component - Component
     * @return {void}
     *
     * @example
     *
     *    append(domElement,UserComponent);
     */
    appendDom(dom, component) {
        const dynamicComponent = document.createElement(component.selector);
        dom.append(dynamicComponent);
    }


    /**
     * Append content of DOM/Element to Component and set attribute
     *
     * @param {any} dom - Dom or Element
     * @param {any} component - Component
     * @param {any} attribute - Component
     * @return {void}
     *
     * @example
     *
     *    changeDom(domElement,UserComponent);
     */
    appendDomAndSetAttribute(dom, component, attribute) {
        const dynamicComponent = document.createElement(component.selector);
        this.setAttribute(dynamicComponent, attribute.name, attribute.data);
        dom.append(dynamicComponent);
    }


    /**
     * Get object/variable passed from parent by setAttribute()
     *
     * @param {any} component - Component
     * @param {string} name - Variable name
     * @return {any} Returns object/variable passed from parent by setAttribute()
     *
     * @example
     *
     *      const object=getAttribute(this, 'name');
     */
    getAttribute(component, name) {
        try {
            return JSON.parse(component.attributes.getNamedItem(name).value);
        } catch (e) {
            const componentName = component.config.selector;
            console.warn("\'" + name + "\' is not set in \'" + componentName + "\'");
        }

    }

    /**
     * Get attribute passed in HTML
     *
     * @param {any} component - Component
     * @param {string} name - Variable name
     * @return {any} Returns variable passed from parent as html attribute
     *
     * @example
     *      //parent
     *      <app-element someVariable="Lubos"></app-element>
     *      // app-element component
     *      const object=getInlineAttribute(this, 'someVariable');
     */
    getInlineAttribute(component, name) {
        return component.attributes.getNamedItem(name).value;
    }

    /**
     * Set dom/element attribute
     *
     * @param {any} component - Component
     * @param {string} variableName -Variable name
     * @param {any} variable -Any variable/object
     * @return {void}
     *
     * @example
     *     const myComponent=this.dom.getElementById("id");
     *     setAttribute(myComponent, 'king', 'Lubos');
     */
    setAttribute(component, variableName, variable) {
        component.setAttribute(variableName, JSON.stringify(variable));
    }

    /**
     * Create event and pass data through detail variable
     *
     * @param {string} name - A string param
     * @param {any} data - Data in event
     * @return {Event} - Returns event with data in detail
     *
     */
    createEvent(name, data) {
        return new CustomEvent(name, {
            detail: data
        });
    }

    /**
     * Emit external event (created by createEvent())
     *
     * @param {any} component - Component (this)
     * @param {Event} event - Data in event
     *
     */
    emitEvent(component, event) {
        component.dispatchEvent(event);
    }

    /**
     * Create event, pass data through detail variable and emit created event
     *
     * @param {any} component - Component (this)
     * @param {string} name - A string param
     * @param {any} data - Data in event
     *
     */
    createAndEmitEvent(component, name, data) {
        const event = this.createEvent(name, data);
        this.emitEvent(component, event);
    }

    /**
     * Get color by type from inline attribute
     *
     * @param {string}type
     * @return {color} -Returns color
     */
    getColorByType(type) {
        if (type === "student") {
            return '#DE354C'
        }
        if (type === "lecturer") {
            return '#3C1874'
        }
    }

    /**
     * Remove all elements in this.dom by class name
     *
     * @param {any} dom
     * @param {string} type
     */
    removeAllElementsByClass(dom, type) {
        const content = dom.querySelectorAll("*");
        for (let studentContentElement of content) {
            if (studentContentElement.classList.contains(type)) {
                studentContentElement.remove();
            }
        }
    }
}

/**
 * Service for work with component DOM
 *
 * @example
 *     RendererService.someFunction();
 */
export const domService = new DomService();
