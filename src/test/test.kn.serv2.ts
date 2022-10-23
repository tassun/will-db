import { ServiceBroker } from "moleculer";
import KnService from "../handler/KnService";
import MyHandler from "./MyHandler";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    handler: new MyHandler(), 
    /* can defined model overwrite MyHandler  
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    }
    */
});

broker.start()

.then(() => broker.call("service.retrieve").then((result) => { 
    console.log("service.retrieve",result);
}))

.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))
