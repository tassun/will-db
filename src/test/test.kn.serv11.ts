import { ServiceBroker } from "moleculer";
import KnService from "../handler/KnService";

let dbschema = "MYSQL";
let args = process.argv.splice(2);
if(args.length>0) dbschema = args[0];
console.log("db schema",dbschema);

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: dbschema },
    },
    settings: {
        disableColumnSchema: true,
        //disablePageOffset: true,
    }
});

broker.start()

.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))

