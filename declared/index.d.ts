export declare type GenericObject = {
    [name: string]: any;
};
declare type EnumFieldTypes = keyof typeof DBTypes;
export declare type KnAlias = {
    [key: string]: string | DBConfig;
};
export interface DBField {
    type: DBTypes | EnumFieldTypes;
    size?: number;
    precision?: number;
    key?: boolean;
    calculated?: boolean;
    selected?: boolean;
    nullable?: boolean;
}
export interface FieldSetting {
    [name: string]: DBField;
}
export interface KnModel {
    name: string;
    alias: KnAlias;
    fields?: FieldSetting;
}
export interface KnSetting {
    rowsPerPage: number;
    maxRowsPerPage: number;
    maxLimit: number;
}
export interface HandlerSetting {
    name: string;
    options?: GenericObject;
}
export interface PageSetting extends PageOffset {
    /**
     * order by field/column name
     */
    orderBy?: string;
    /**
     * order direction ascending or descending
     */
    orderDir?: string | "ASC" | "DESC";
}
export declare const KeyPageSetting: string[];
export interface LoggerInterface {
    fatal(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
}
export interface ServiceHandler {
    handlers?: HandlerSetting[];
    init(broker?: any, service?: any): void;
    clear(context: any): Promise<any>;
    create(context: any): Promise<any>;
    list(context: any): Promise<any>;
    find(context: any): Promise<any>;
    insert(context: any): Promise<any>;
    retrieve(context: any): Promise<any>;
    update(context: any): Promise<any>;
    remove(context: any): Promise<any>;
    collect(context: any): Promise<any>;
    executeQuery(sql: string | SQLInterface): Promise<any>;
    executeUpdate(sql: string | SQLInterface): Promise<any>;
    destroy(): void;
}

export declare abstract class BaseHandler implements ServiceHandler {
    handlers?: HandlerSetting[];
    model?: KnModel;
    settings: KnSetting;
    logger: LoggerInterface;
    constructor(model?: KnModel, settings?: KnSetting);
    init(broker?: any, service?: any): void;
    clear(context: any): Promise<any>;
    create(context: any): Promise<any>;
    list(context: any): Promise<any>;
    find(context: any): Promise<any>;
    insert(context: any): Promise<any>;
    retrieve(context: any): Promise<any>;
    update(context: any): Promise<any>;
    remove(context: any): Promise<any>;
    collect(context: any): Promise<any>;
    executeQuery(sql: string | SQLInterface): Promise<any>;
    executeUpdate(sql: string | SQLInterface): Promise<any>;
    destroy(): void;
}

export declare class KnBase extends BaseHandler {
    broker?: ServiceBroker;
    service?: ServiceSchema;
    init(broker: ServiceBroker, service: ServiceSchema): void;
    destroy(): void;
    getConnector(schema: string | DBConfig): DBConnector;
    getPageSetting(params: any): PageSetting;
    calculatePageOffset(pageOffset: PageOffset, totalRows?: number): PageOffset;
    createQueryPaging(config: DBConfig, pageOffset: PageOffset): string;
    fatal(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
    clear(context: any): Promise<ResultSet>;
    create(context: any): Promise<ResultSet>;
    list(context: any): Promise<ResultSet>;
    find(context: any): Promise<ResultSet>;
    insert(context: any): Promise<ResultSet>;
    retrieve(context: any): Promise<ResultSet>;
    update(context: any): Promise<ResultSet>;
    remove(context: any): Promise<ResultSet>;
    collect(context: any): Promise<ResultSet>;
    protected doClear(context: any, model: KnModel): Promise<ResultSet>;
    protected doCreate(context: any, model: KnModel): Promise<ResultSet>;
    protected doFind(context: any, model: KnModel): Promise<ResultSet>;
    protected doUpdate(context: any, model: KnModel): Promise<ResultSet>;
    protected getPrivateConnector(model: KnModel): DBConnector;
    protected getCenterConnector(model: KnModel): DBConnector;
    protected getGlobalConnector(model: KnModel): DBConnector;
    protected isValidModelConfig(aliasName: string, model?: KnModel): boolean;
}

export declare class KnHandler extends KnBase {
    private isInPageSetting;
    protected buildInsertQuery(model: KnModel, params?: any): SQLInterface;
    protected buildUpdateQuery(model: KnModel, params?: any): SQLInterface;
    protected buildDeleteQuery(model: KnModel, params?: any): SQLInterface;
    private buildFilterQuery;
    protected buildCountQuery(model: KnModel, params?: any): SQLInterface;
    protected buildSelectQuery(config: DBConfig, pageSetting: PageSetting, model: KnModel, params?: any): SQLInterface;
    protected obtainParameters(knsql: SQLInterface, params?: any): void;
    protected doClear(context: any, model: KnModel): Promise<ResultSet>;
    protected doCreate(context: any, model: KnModel): Promise<ResultSet>;
    protected doFind(context: any, model: KnModel): Promise<ResultSet>;
    protected doUpdate(context: any, model: KnModel): Promise<ResultSet>;
    executeQuery(sql: string | SQLInterface): Promise<ResultSet>;
    executeUpdate(sql: string | SQLInterface): Promise<ResultSet>;
}

export declare class KnLogger implements LoggerInterface {
    fatal(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
}

export declare class KnSchema implements ServiceSchema {
    name: string;
    actions: ServiceActionsSchema;
    handler?: ServiceHandler;
    constructor(handler?: ServiceHandler);
    createActions(): ServiceActionsSchema;
    private defaultActions;
    merged(scheme: any): void;
    created(): void;
    started(): void;
    stopped(): void;
}

declare class KnService extends KnSchema {
}
declare const _default: KnService;
export = _default;
