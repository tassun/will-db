import { ServiceBroker } from "moleculer";
import KnService from "../handler/KnService";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    },
});

broker.start()

.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))

.then(() => broker.call("service.find",{share: "BBL"}).then((result) => { 
    console.log("service.find",result);
}))

/*
.then(() => broker.call("service.create",{share: "UOB", yield: 45, percent: 35, mktid: "TSO", remark: "Testing"}).then((result) => { 
    console.log("service.create",result);
}))
*/
