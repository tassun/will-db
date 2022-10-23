import { KnBase } from "./KnBase";
import { KnModel } from "./KnAlias";
import { DBError, KnSQL, ResultSet, SQLInterface } from "will-sql";

export class KnHandler extends KnBase {

    protected buildInsertQuery(model: KnModel, params?: any) : SQLInterface {
        let cols = "";
        let vals = "";
        let found = false;
        let knsql = new KnSQL("insert into ");
        knsql.append(model.name).append("(");
        //if defined fields then using it
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
            //if do not defined fields then using from parameters setting
            let first = true;
            for(let p in params) {
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
        knsql.append(cols).append(") values(").append(vals).append(")");
        return knsql;
    }

    protected buildUpdateQuery(model: KnModel, params?: any) : SQLInterface {
        let criteria = "";
        let found = false;
        let knsql = new KnSQL("update ");
        knsql.append(model.name).append(" set ");
        if(model.fields) {
            for(let fname in model.fields) {
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
        if(!found) throw new DBError("Invalid update statement",-30001);
        if(criteria.length>0) {
            knsql.append(" where ").append(criteria);
        }
        this.obtainParameters(knsql, params);
        return knsql;
    }

    protected buildDeleteQuery(model: KnModel, params?: any) : SQLInterface {
        let found = false;
        let knsql = new KnSQL("delete from ");
        knsql.append(model.name);
        if(model.fields) {
            let filter = " where ";
            for(let fname in model.fields) {
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
        if(found) this.obtainParameters(knsql, params);
        return knsql;
    }

    protected buildSelectQuery(model: KnModel, params?: any) : SQLInterface {
        let criteria = "";
        let selstr = "";
        let foundselected = false;
        let knsql = new KnSQL("select ");
        if(model.fields) {
            for(let fname in model.fields) {
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
                    let selected = typeof dbf.selected === "undefined" || dbf.selected;
                    if(selected) {
                        if(foundselected) selstr += ",";
                        selstr += fname;
                        foundselected = true;
                    }           
                }                   
            }
        }
        if(selstr.length>0) {
            knsql.append(selstr);
        } else {
            knsql.append("*");
        }
        knsql.append(" from ");
        knsql.append(model.name);
        if(criteria.length>0) {
            knsql.append(" where ").append(criteria);
            this.obtainParameters(knsql, params);
        } else {
            if(params) {
                let filter = " where ";
                for(let p in params) {
                    let pv = params[p];
                    knsql.append(filter).append(p).append(" = ?").append(p);
                    knsql.set(p,pv);
                    filter = " and ";
                }
            }
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
            let knsql = this.buildSelectQuery(model, context.params);
            this.debug(knsql);
            return await knsql.executeQuery(db);
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
