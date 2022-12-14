import { ServiceBroker, ServiceSchema } from "moleculer";
import { KnAbstract } from "./KnAbstract";
import { DBConfig, DBConnections, DBConnector, DBError, PageOffset, ResultSet } from "will-sql";
import { KnModel, PageSetting } from "./KnAlias";
import { SQLUtils } from "./SQLUtils";

export class KnBase extends KnAbstract {
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
        let settings = this.service?.schema.settings;
        if(settings) {
            this.settings = { ...this.settings, ...settings };
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
    
    public getPageSetting(params: any) : PageSetting {
        return SQLUtils.getPageSetting(this.settings, params);
    }

    public calculatePageOffset(pageOffset: PageOffset, totalRows?: number) : PageOffset {
        return SQLUtils.calculatePageOffset(pageOffset, totalRows);
    }

    public createQueryPaging(config: DBConfig, pageOffset: PageOffset) : string {
        return SQLUtils.createQueryPaging(config, pageOffset);
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
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doClear(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override create(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doCreate(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override list(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doList(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override find(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doFind(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override insert(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doInsert(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override retrieve(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doRetrieve(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override update(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doUpdate(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override remove(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doRemove(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override collect(context: any) : Promise<ResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            return this.doCollect(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doClear(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doCreate(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doList(context: any, model: KnModel) : Promise<ResultSet> {
        return this.doFind(context, model);
    }

    protected async doFind(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doInsert(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doRetrieve(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doUpdate(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doRemove(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected async doCollect(context: any, model: KnModel) : Promise<ResultSet> {
        return Promise.resolve({rows: null, columns: null});
    }

    protected getPrivateConnector(model: KnModel) : DBConnector {
        if(!model.alias.privateAlias) throw new DBError("Model setting alias.privateAlias does not defined",-30301);
        return this.getConnector(model.alias.privateAlias);
    }

    protected getCenterConnector(model: KnModel) : DBConnector {
        if(!model.alias.centerAlias) throw new DBError("Model setting alias.centerAlias does not defined",-30302);
        return this.getConnector(model.alias.centerAlias);
    }

    protected getGlobalConnector(model: KnModel) : DBConnector {
        if(!model.alias.globalAlias) throw new DBError("Model setting alias.globalAlias does not defined",-30303);
        return this.getConnector(model.alias.globalAlias);
    }

    protected isValidModelConfig(aliasName: string, model?: KnModel) : boolean {
        if(this.model) {
            if(this.model.name && this.model.alias[aliasName]) {
                return true;
            }
        }
        return false;
    }
         
}
