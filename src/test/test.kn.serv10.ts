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
    },
    //as default rowsPerPage = 20 and maxRowsPerPage = 100
    //this setting will override default value
    settings: {
        rowsPerPage: 10,
        maxRowsPerPage: 100,
    }
});

broker.start()
//default page number = 1
.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))
//specified sorter field and order direction
.then(() => broker.call("service.list",{page: 2, sorter: "field1", orderby: "ASC"}).then((result) => { 
    console.log("service.list",result);
}))

.then(() => broker.call("service.list",{page: 3, sorter: "field1", orderby: "DESC"}).then((result) => { 
    console.log("service.list",result);
}))

//defined paging: rowsPerPage = 10 as parameter
.then(() => broker.call("service.list",{page: 1, rowsPerPage: 10 }).then((result) => { 
    console.log("service.list",result);
}))
