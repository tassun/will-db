import { KnBase } from "./KnBase";
import { KeyPageSetting, KnModel, PageSetting } from "./KnAlias";
import { DBConfig, DBError, DBUtils, KnSQL, ResultSet, SQLInterface } from "will-sql";

export class KnHandler extends KnBase {

    private isInPageSetting(key: string) : boolean {
        return KeyPageSetting.includes(key);
    }

    private buildInsertQuery(model: KnModel, params?: any) : SQLInterface {
        let cols = "";
        let vals = "";
        let found = false;
        let knsql = new KnSQL("insert into ");
        knsql.append(model.name).append("(");
        //if defined fields then use it
        if(model.fields) {
            for(let fname in model.fields) {
                let dbf = model.fields[fname];
                let fcalc = dbf.calculated !== undefined && dbf.calculated;
                if(!fcalc) {
                    if(found) {
                        cols += ",";
                        vals += ",";
                    }
                    cols += fname;
                    vals += "?"+fname;
                    found = true;
                }                
            }
        }
        if(params) {
            //if do not defined fields then use from parameters setting
            let first = true;
            for(let p in params) {
                if(!this.isInPageSetting(p)) {
                    let pv = params[p];
                    knsql.set(p,pv);
                    if(!found) {
                        if(!first) {
                            cols += ",";
                            vals += ",";
                        }
                        cols += p;
                        vals += "?"+p;
                        first = false;
                    }
                }
            }
        }
        knsql.append(cols).append(") values(").append(vals).append(")");
        return knsql;
    }

    private buildUpdateQuery(model: KnModel, params?: any) : SQLInterface {
        let criteria = "";
        let found = false;
        let knsql = new KnSQL("update ");
        knsql.append(model.name).append(" set ");
        if(model.fields) {
            for(let fname in model.fields) {
                if(!this.isInPageSetting(fname)) {
                    let dbf = model.fields[fname];
                    let fcalc = dbf.calculated !== undefined && dbf.calculated;
                    let fkey = dbf.key !== undefined && dbf.key;
                    if(!fcalc && !fkey) {
                        if(params && params[fname]) {
                            if(found) {
                                knsql.append(", ");
                            }
                            knsql.append(fname).append(" = ?").append(fname);
                            found = true;
                        }
                    } 
                    if(fkey) {
                        if(criteria.length>0) criteria += " and ";
                        criteria += fname+" = ?"+fname;
                    } 
                }              
            }
        }
        if(!found) {
            if(params) {
                let filter = "";
                for(let p in params) {
                    if(!this.isInPageSetting(p)) {                    
                        let pv = params[p];
                        knsql.append(filter).append(p).append(" = ?").append(p);
                        knsql.set(p,pv);
                        filter = ", ";
                        found = true;
                    }
                }
            }        
        }
        if(!found) throw new DBError("Invalid update statement",-30001);
        if(criteria.length>0) {
            knsql.append(" where ").append(criteria);
        }
        this.obtainParameters(knsql, params);
        return knsql;
    }

    private buildDeleteQuery(model: KnModel, params?: any) : SQLInterface {
        let found = false;
        let knsql = new KnSQL("delete from ");
        knsql.append(model.name);
        if(model.fields) {
            let filter = " where ";
            for(let fname in model.fields) {
                if(!this.isInPageSetting(fname)) {
                    let dbf = model.fields[fname];
                    let fkey = dbf.key !== undefined && dbf.key;
                    if(fkey) {
                        if(params && params[fname]) {
                            knsql.append(filter);
                            knsql.append(fname).append(" = ?").append(fname);
                            filter = " and ";
                            found = true;
                        }
                    } 
                }              
            }
        }
        if(!found) {
            this.buildCriteriaQuery(knsql, params);
        }
        if(found) this.obtainParameters(knsql, params);
        return knsql;
    }

    private buildFilterQuery(knsql: SQLInterface, model: KnModel, params?: any) : SQLInterface {
        let criteria = "";
        if(model.fields) {
            for(let fname in model.fields) {
                if(!this.isInPageSetting(fname)) {
                    let dbf = model.fields[fname];
                    let fcalc = dbf.calculated !== undefined && dbf.calculated;
                    if(!fcalc) {
                        let fkey = dbf.key !== undefined && dbf.key;
                        if(fkey) {
                            if(params && params[fname]) {
                                if(criteria.length>0) criteria += " and ";
                                criteria += fname+" = ?"+fname;
                            }
                        } 
                    }                   
                }
            }
        }
        knsql.append(" from ");
        knsql.append(model.name);
        if(criteria.length>0) {
            knsql.append(" where ").append(criteria);
            this.obtainParameters(knsql, params);
        } else {
            this.buildCriteriaQuery(knsql, params);
        }
        return knsql;
    }

    private buildCriteriaQuery(knsql: SQLInterface, params?: any) : boolean {
        let result = false;
        if(params) {
            let filter = " where ";
            for(let p in params) {
                if(!this.isInPageSetting(p)) {                    
                    let pv = params[p];
                    knsql.append(filter).append(p).append(" = ?").append(p);
                    knsql.set(p,pv);
                    filter = " and ";
                    result = true;
                }
            }
        }
        return result;
    }

    private buildCountQuery(model: KnModel, params?: any) : SQLInterface {
        let knsql = new KnSQL("select count(*) as counter");
        this.buildFilterQuery(knsql, model, params);
        return knsql;
    }

    private buildSelectQuery(config: DBConfig, pageSetting: PageSetting, model: KnModel, params?: any) : SQLInterface {
        let selstr = "";
        let foundselected = false;
        let knsql = new KnSQL("select ");
        if(model.fields) {
            for(let fname in model.fields) {
                if(!this.isInPageSetting(fname)) {
                    let dbf = model.fields[fname];
                    let fcalc = dbf.calculated !== undefined && dbf.calculated;
                    if(!fcalc) {
                        let selected = typeof dbf.selected === "undefined" || dbf.selected;
                        if(selected) {
                            if(foundselected) selstr += ",";
                            selstr += fname;
                            foundselected = true;
                        }           
                    } 
                }                  
            }
        }
        let isInformix = DBUtils.isINFORMIX(config);
        let offsetQuery = this.createQueryPaging(config, pageSetting);
        if(isInformix) {
            knsql.append(offsetQuery);
        }
        if(selstr.length>0) {
            knsql.append(selstr);
        } else {
            knsql.append("*");
        }
        this.buildFilterQuery(knsql, model, params);
        if(pageSetting.orderBy && pageSetting.orderBy!="") {
            knsql.append(" ORDER BY ").append(pageSetting.orderBy);
            if(pageSetting.orderDir && pageSetting.orderDir!="") {
                knsql.append(" ").append(pageSetting.orderDir);
            }
            knsql.append(" ");
        } else {
            knsql.append(" ORDER BY 1 ");
        }
        if(!isInformix) {
            knsql.append(offsetQuery);
        }
        return knsql;
    }
    
    protected obtainParameters(knsql: SQLInterface, params?: any) {
        if(params) {
            for(let p in params) {
                let pv = params[p];
                knsql.set(p,pv);
            }
        }
    }
        
    protected override async doClear(context: any, model: KnModel) : Promise<ResultSet> {
        let db = this.getPrivateConnector(model);
        try {
            let knsql = this.buildDeleteQuery(model, context.params);
            this.debug(knsql);
            return await knsql.executeUpdate(db);
        } finally {
            db.close();
        }
    }

    protected override async doCreate(context: any, model: KnModel) : Promise<ResultSet> {
        let db = this.getPrivateConnector(model);
        try {
            let knsql = this.buildInsertQuery(model, context.params);
            this.debug(knsql);
            return await knsql.executeUpdate(db);
        } finally {
            db.close();
        }
    }

    protected override async doFind(context: any, model: KnModel) : Promise<ResultSet> {
        let db = this.getPrivateConnector(model);
        try {
            let pageSetting = this.getPageSetting(context.params);
            let knsql = this.buildCountQuery(model, context.params);
            this.debug(knsql);
            let rs = await knsql.executeQuery(db);
            this.debug(rs);
            if(rs.rows && rs.rows.length>0) {
                let row = rs.rows[0];
                pageSetting.totalRows = row.counter | row.COUNTER;
            }
            this.calculatePageOffset(pageSetting);
            this.debug("PageSetting",pageSetting);
            knsql = this.buildSelectQuery(db.config, pageSetting, model, context.params);
            this.debug(knsql);
            rs = await knsql.executeQuery(db);
            rs.offsets = pageSetting;
            return rs;
        } finally {
            db.close();
        }
    }

    protected override async doUpdate(context: any, model: KnModel) : Promise<ResultSet> {
        let db = this.getPrivateConnector(model);
        try {
            let knsql = this.buildUpdateQuery(model, context.params);
            this.debug(knsql);
            return await knsql.executeUpdate(db);
        } finally {
            db.close();
        }
    }

    public override async executeQuery(sql: string | SQLInterface) : Promise<ResultSet> {
        if(this.model) {
            let db = this.getPrivateConnector(this.model);
            try {
                let knsql : SQLInterface;
                if(typeof sql === "string") {
                    knsql = new KnSQL(sql);
                } else {
                    knsql = sql;
                }
                return await knsql.executeQuery(db);
            } finally {
                db.close();
            }
        }
        return Promise.resolve({rows: null, columns: null});
    }

    public override async executeUpdate(sql: string | SQLInterface) : Promise<ResultSet> {
        if(this.model) {
            let db = this.getPrivateConnector(this.model);
            try {
                let knsql : SQLInterface;
                if(typeof sql === "string") {
                    knsql = new KnSQL(sql);
                } else {
                    knsql = sql;
                }
                return await knsql.executeUpdate(db);
            } finally {
                db.close();
            }
        }
        return Promise.resolve({rows: { affectedRows: 0}, columns: null});
    }

}
