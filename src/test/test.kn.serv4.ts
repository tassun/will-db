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
});

broker.start()

//test db connector
.then(() => broker.call("service.collect",{sharecode: "BBL"}).then((result) => { 
    console.log("service.collect",result);
}))
