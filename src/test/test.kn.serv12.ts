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
});

broker.start()

.then(() => broker.call("service.update",{yield: 55, remark: "Update Testing"}).then((result) => { 
    console.log("service.update",result);
}))

/*
.then(() => broker.call("service.update").then((result) => {  //error coz no update fields
    console.log("service.update",result);
}))
*/
