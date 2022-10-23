import { ServiceBroker } from "moleculer";
import KnService from "../handler/KnService";
import MyHandler from "./MyHandler";
import ApiGatewayService from 'moleculer-web';

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [ApiGatewayService, KnService],
    handler: new MyHandler(), 
    settings: {
        port: 4000,
        cors: true,
        path: "/", 
    },   
});

broker.start()

//test db connector
.then(() => broker.call("service.collect",{sharecode: "BBL"}).then((result) => { 
    console.log("service.collect",result);
}))

//curl http://localhost:4000/service/collect
//curl http://localhost:4000/service/collect?sharecode=BBL
