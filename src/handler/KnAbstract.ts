import { SQLInterface } from "will-sql";
import { ServiceHandler, HandlerSetting, KnModel, LoggerInterface, KnSetting } from "./KnAlias";
import { KnLogger } from "./KnLogger";

export abstract class KnAbstract implements ServiceHandler {
    public handlers? : HandlerSetting[];
    public model? : KnModel;
    public settings : KnSetting = { rowsPerPage: 20, maxRowsPerPage: 100, maxLimit: -1 };
    public logger: LoggerInterface = new KnLogger(); 
    
    constructor(model?: KnModel, settings?: KnSetting) {
        this.model = model;
        this.settings = { ...this.settings, ...settings };
    }

    public init(broker?: any, service?: any) : void {
        //do notthing
    }

    public clear(context: any) : Promise<any> {
        return Promise.reject();
    }

    public create(context: any) : Promise<any> {
        return Promise.reject();
    }

    public list(context: any) : Promise<any> {
        return Promise.reject();
    }

    public find(context: any) : Promise<any> {
        return Promise.reject();
    }

    public insert(context: any) : Promise<any> {
        return Promise.reject();
    }

    public retrieve(context: any) : Promise<any> {
        return Promise.reject();
    }

    public update(context: any) : Promise<any> {
        return Promise.reject();
    }

    public remove(context: any) : Promise<any> {
        return Promise.reject();
    }

    public collect(context: any) : Promise<any> {
        return Promise.reject();
    }

    public executeQuery(sql: string | SQLInterface) : Promise<any> {
        return Promise.reject();
    }
    
    public executeUpdate(sql: string | SQLInterface) : Promise<any> {
        return Promise.reject();
    }

    public destroy() : void {
        //do nothing
    }
        
}
