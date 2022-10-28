import { DBConfig, DBTypes, PageOffset, SQLInterface } from "will-sql";

export type GenericObject = { [name: string]: any };

type EnumFieldTypes = keyof typeof DBTypes;

export type KnAlias = {
    [key : string]: string | DBConfig;
}

export interface DBField {
    type: DBTypes | EnumFieldTypes;
    size?: number;
    precision?: number,
    key? : boolean;
    calculated?: boolean;
    selected? : boolean;
    nullable? : boolean;
}

export interface FieldSetting {
    [name: string] : DBField;
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
    disableColumnSchema?: boolean;
    disablePageOffset?: boolean;
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

export const KeyPageSetting : string[] = [ "page", "rowsPerPage", "orderBy", "orderDir", "offset", "limit", "totalRows", "totalPages" ];

export interface LoggerInterface {
    fatal(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
}

export interface ServiceHandler {
    handlers? : HandlerSetting[];    
    init(broker?: any, service?: any) : void;    
    
    clear(context: any) : Promise<any>;    
    create(context: any) : Promise<any>;
    list(context: any) : Promise<any>;
    find(context: any) : Promise<any>;

    insert(context: any) : Promise<any>;
    retrieve(context: any) : Promise<any>;
    update(context: any) : Promise<any>;
    remove(context: any) : Promise<any>;   
    collect(context: any) : Promise<any>;

    executeQuery(sql: string | SQLInterface) : Promise<any>;
    executeUpdate(sql: string | SQLInterface) : Promise<any>;

    destroy() : void;
}
