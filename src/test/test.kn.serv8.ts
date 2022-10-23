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
        fields: {
            //this field make as key field
            share: { type: "STRING", key: true },
            mktid: { type: "STRING" },
            yield: { type: "DECIMAL" },
            percent: { type: "DECIMAL" },
            //this field does not in select clause
            remark: { type: "STRING", selected: false },
            //this field does not exist in table, it is user defined field  
            amount: { type: "DECIMAL", calculated: true }, 
        },
    },
});

broker.start()

.then(() => broker.call("service.create",{share: "CIMB", yield: 45, percent: 35, mktid: "TST", remark: "Testing"}).then((result) => { 
    console.log("service.create",result);
}))

.then(() => broker.call("service.update",{share: "CIMB", yield: 55, remark: "Update Testing"}).then((result) => { 
    console.log("service.update",result);
}))

