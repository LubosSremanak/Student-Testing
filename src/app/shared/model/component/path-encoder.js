export class PathEncoder {

    constructor() {
    }

    getComponentPath(componentPath) {
        return this.getComponentsRootPath() + componentPath;
    }

    getComponentsRootPath() {
        const componentPrefix = 'app/components/'
        return this.getRootPath() + componentPrefix;
    }

    getRootPath() {
        const root = this.getRoot();
        return location.protocol + '//' + location.host + '/' + root + '/';
    }

    getRoot() {
        if (this.isLocalhost()) {
            return 'bwte2-frontend/src';
        } else {
            return location.href.split('/')[3];
        }

    }

    isLocalhost() {
        const host = location.host;
        const keyword = host.split(':')[0];
        return keyword === 'localhost';
    }
}
