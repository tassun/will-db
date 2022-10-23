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
    actions: {
        getShare() {
            let sql = "select * from testdbx where share = 'BBL'";
            return this.handler.executeQuery(sql);    
        },
        getYield(ctx: any) {            
            let sql = "select * from testdbx where yield >= "+ctx.params.yield;
            return this.handler.executeQuery(sql);
        },
        updatePercent() {
            let sql = "update testdbx set percent = 55 where share = 'SCB'";
            return this.handler.executeUpdate(sql);
        }
    }
});

broker.start()

.then(() => broker.call("service.getShare").then((result) => { 
    console.log("service.getShare",result);
}))

.then(() => broker.call("service.getYield",{yield: 60}).then((result) => { 
    console.log("service.getYield",result);
}))

.then(() => broker.call("service.updatePercent").then((result) => { 
    console.log("service.getupdatePercentYield",result);
}))
