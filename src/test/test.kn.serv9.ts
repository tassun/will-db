import { ServiceBroker } from "moleculer";
import KnService from "../handler/KnService";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "test1",
        alias: { privateAlias: "MYSQL" },
        fields: {
            field1: { type: "STRING", key: true },
            field2: { type: "STRING" },
            field3: { type: "DATE" },
            field4: { type: "TIME" },
        },
    },
});

broker.start()

.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))

.then(() => broker.call("service.clear",{field1: "A"}).then((result) => { 
    console.log("service.clear",result);
}))
/*
//delete all records
.then(() => broker.call("service.clear").then((result) => { 
    console.log("service.clear",result);
}))
*/
