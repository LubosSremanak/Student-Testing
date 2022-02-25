import {ApiService} from "../../../shared/model/service/api-service.js";
import {domService} from "../../../shared/services/dom.service.js";

class ServerSentEventsService extends ApiService {

    async readTestTimer(testKey, studentId) {
        const url = this.rootURL + 'tests/' + testKey + '/timer/' + studentId;
        const source = new EventSource(url);

        source.addEventListener("timer", (event) => {
            domService.createAndEmitEvent(document, "changeTime", event.data);
            if(event.data === "0" || event.data === "-1" || event.data === "inactive-test" || event.data === "invalid-key"){
                source.close();
            }
        })

        return source;
    }


    async readTestActivities(testKey) {
        const url = this.rootURL + 'tests/' + testKey + '/activities';
        const source = new EventSource(url);

        source.addEventListener("activities", (event) => {
            const response = JSON.parse(event.data).response;
            domService.createAndEmitEvent(document, "changeActivities", response);
            /*if(event.data === "0" || event.data === "inactive-test" || event.data === "invalid-key"){
                source.close();
            }*/
        })
        document.addEventListener("closeActivities", (event) =>{
            source.close();
        })



        return source;
    }
}

export const serverSentEventsService = new ServerSentEventsService();
