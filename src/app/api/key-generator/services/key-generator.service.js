import {ApiService} from "../../../shared/model/service/api-service.js";

class KeyGeneratorService extends ApiService {

    /**
     * Generate key
     *
     * @return {Promise<any>} Returns promised json
     *
     */
    async readGeneratedKey() {
        const url = this.rootURL + 'key-generator/';
        const response = await fetch(url, this.requestGET()).catch(this.catchErrors);
        return response ? await response.json() : this.handleErrors(new Error());
    }
}

export const keyGeneratorService = new KeyGeneratorService()
