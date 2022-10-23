import { ServiceBroker, ServiceSchema } from "moleculer";
import { BaseHandler } from "./BaseHandler";
import { DBConfig, DBConnections, DBConnector, ResultSet } from "will-sql";
import { KnModel } from "./KnAlias";

export class KnBase extends BaseHandler {
    public broker? : ServiceBroker;
    public service? : ServiceSchema;

    public override init(broker: ServiceBroker, service: ServiceSchema) {
        this.broker = broker;
        this.service = service;
        this.logger = service.logger;
        let model = this.service?.schema.model;
        if(model) {
            this.model = model;
        }
    }

    public override destroy() : void {
        if(this.model?.alias) {
            for(let p in this.model.alias) {
                this.logger.debug("destroy",p+"="+this.model.alias[p]);
                DBConnections.getDBConnector(this.model.alias[p]).end();
            };
        }
    }
    
    public getConnector(schema: string | DBConfig) : DBConnector {
        return DBConnections.getDBConnector(schema);
    }
    
    public fatal(...args: any[]): void {
        this.logger.fatal(...args);
    }
    public error(...args: any[]): void {
        this.logger.error(...args);
    }
    public warn(...args: any[]): void {
        this.logger.warn(...args);
    }
    public info(...args: any[]): void {
        this.logger.info(...args);
    }
    public debug(...args: any[]): void {
        this.logger.debug(...args);
    }
    public trace(...args: any[]): void {
        this.logger.trace(...args);
    }

    public override clear(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidConfigure(this.model)) {
            return this.doClear(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override create(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidConfigure(this.model)) {
            return this.doCreate(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override list(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidConfigure(this.model)) {
            return this.doFind(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override find(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidConfigure(this.model)) {
            return this.doFind(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override insert(context: any) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    public override retrieve(context: any) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    public override update(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidConfigure(this.model)) {
            return this.doUpdate(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override remove(context: any) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    public override collect(context: any) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doClear(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doCreate(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doFind(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doUpdate(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected getPrivateConnector(model: KnModel) : DBConnector {
        return this.getConnector(model.alias.privateAlias);
    }

    protected isValidConfigure(model?: KnModel) : boolean {
        if(this.model) {
            if(this.model.name && this.model.alias.privateAlias) {
                return true;
            }
        }
        return false;
    }

}
