import { DBUtils, DBConfig, PageOffset } from "will-sql";
import { KnSetting, PageSetting } from "./KnAlias";

export class SQLUtils {
    
    public static createQueryPaging(config: DBConfig, pageOffset: PageOffset) : string {
        let sql = "";
        if(DBUtils.isMYSQL(config) || DBUtils.isDB2(config)) {
            sql += " LIMIT "+pageOffset.offset+", "+pageOffset.rowsPerPage+" ";
        } else if(DBUtils.isMSSQL(config) || DBUtils.isORACLE(config)) {
            sql += " OFFSET "+pageOffset.offset+" ROWS ";
            sql += " FETCH NEXT "+pageOffset.rowsPerPage+" ROWS ONLY ";
        } else if(DBUtils.isINFORMIX(config)) {
            sql += " SKIP "+pageOffset.offset+" FIRST "+pageOffset.rowsPerPage+" ";
        } else if(DBUtils.isPOSTGRES(config)) {
            sql += " LIMIT "+pageOffset.rowsPerPage+" OFFSET "+pageOffset.offset+" "; 
        }
        return sql;
    }

    public static calculatePageOffset(pageOffset: PageOffset, totalRows?: number) : PageOffset {
        if(totalRows) pageOffset.totalRows = totalRows;
        let page = pageOffset.page;
        let chapter = pageOffset.rowsPerPage;
        let total = pageOffset.totalRows;
        let offset = 0;
        if(page>0) offset = (page-1)*chapter;
        let totalPages = 0;
        if(total > 0 && chapter > 0) {
            for(let i=0; i<total; i+=chapter) {
                totalPages++;
            }
            if(page > totalPages) {
                page = totalPages;
            }
        }
        pageOffset.offset = offset;
        pageOffset.page = page;
        pageOffset.totalPages = totalPages;
        return pageOffset;
    }
    
    public static getPageSetting(settings: KnSetting, params: any) : PageSetting {
        let result : PageSetting = { totalRows: 0, limit: 10, page: 1, offset: 10, rowsPerPage: settings.rowsPerPage, totalPages: 1 };
        if(params) {
            if(params.limit) {
                if(typeof(params.limit) === "string") {
                    result.limit = Number(params.limit);
                } else {
                    result.limit = params.limit;
                }    
            }
            if(params.page) {
                if(typeof(params.page) === "string") {
                    result.page = Number(params.page);
                } else {
                    result.page = params.page;
                }
            }
            if(params.offset) {
                if(typeof(params.offset) === "string") {
                    result.offset = Number(params.offset);
                } else {
                    result.offset = params.offset;
                }
            }
            if(params.rowsPerPage) {
                if(typeof(params.rowsPerPage) === "string") {
                    result.rowsPerPage = Number(params.rowsPerPage);
                } else {
                    result.rowsPerPage = params.rowsPerPage;
                }
            }
            if(params.sorter) result.sorter = params.sorter;
            if(params.orderby) result.orderby = params.orderby;
        }
        if(settings.maxRowsPerPage > 0 && result.rowsPerPage > settings.maxRowsPerPage) {
            result.rowsPerPage = settings.maxRowsPerPage;
        }
        if(settings.maxLimit > 0 && result.limit > settings.maxLimit) {
            result.limit = settings.maxLimit;
        }
        if(result.page <= 0) result.page = 1;
        if(result.rowsPerPage <= 0) result.rowsPerPage = settings.rowsPerPage;
        return result;
    }

}
