import { ServiceBroker } from "moleculer";
import KnService from "../handler/KnService";
import MyHandler from "./MyHandler";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    //mixins: [new KnSchema(new MyHandler())], //build-in handler    
    mixins: [KnService],
    handler: new MyHandler(),    
});

broker.start()

// support dynamic handler, findby service actions not in base handler
.then(() => broker.call("service.findby",{sharecode:"BBL"}).then((result) => { 
    console.log("service.findby",result);
}))
