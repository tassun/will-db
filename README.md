# will-db

Relational Database service for moleculer

## Installation

    npm install will-db

## Examples

### Configuration

This module require configuration ([config](https://www.npmjs.com/package/config)) setting by config/default.json under project and [will-sql](https://www.npmjs.com/package/will-sql)

    npm install config

```json
{
    "MYSQL" : { "alias": "mysql", "dialect": "mysql", "url": "mysql://user:password@localhost:3306/testdb?charset=utf8&connectionLimit=10", "user": "user", "password": "password" },
    "ODBC" : { "alias": "odbc", "dialect": "mysql", "url": "DRIVER={MySQL ODBC 5.3 Unicode Driver};SERVER=localhost;DATABASE=testdb;HOST=localhost;PORT=3306;UID=user;PWD=password;", "user": "user", "password": "password" },
    "MSSQL": { "alias": "mssql", "dialect": "mssql", "url": "Server=localhost,1433;Database=testdb;User Id=user;Password=password;Encrypt=false;Trusted_Connection=Yes;", "user": "user", "password": "password" },
    "ORACLE": { "alias": "oracle", "dialect": "oracle", "url": "localhost:1521/ORCLCDB.localdomain", "user": "user", "password": "password" },
    "POSTGRES": { "alias": "postgres", "dialect": "postgres", "url": "postgresql://user:password@localhost:5432/testdb", "user": "user", "password": "password" },
    "INFORMIX": { "alias": "odbc", "dialect": "informix", "url": "DRIVER={IBM INFORMIX ODBC DRIVER (64-bit)};SERVER=online_localhost;DATABASE=refdb;HOST=localhost;SERVICE=9088;UID=user;PWD=password;CLIENT_LOCALE=th_th.thai620;DB_LOCALE=th_th.thai620;", "user": "user", "password":"password" }
}
```

    npm install will-sql


#### KnService
KnService provide handler for CRUD in database table

#### Usage

```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    }
});
broker.start()
.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))
```

#### CRUD Support

##### Create
```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    }
});
broker.start()
.then(() => broker.call("service.create",{share: "XXX", yield: 45, percent: 35, mktid: "TST", remark: "Testing"}).then((result) => { 
    console.log("service.create",result);
}))
```

##### Retrieve
```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    }
});
broker.start()
.then(() => broker.call("service.find",{share: "XXX"}).then((result) => { 
    console.log("service.find",result);
}))
```

##### Update
```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    }
});
broker.start()
.then(() => broker.call("service.update",{yield: 55, remark: "Update Testing"}).then((result) => { 
    console.log("service.update",result);
}))
```

##### Delete
```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
    }
});
broker.start()
.then(() => broker.call("service.clear",{share: "XXX"}).then((result) => { 
    console.log("service.clear",result);
}))
```

#### Model Setting

```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    model: {
        name: "testdbx",
        alias: { privateAlias: "MYSQL" },
        fields: {
            //this field make as key field
            share: { type: "STRING", key: true },
            mktid: { type: "STRING" },
            yield: { type: "DECIMAL" },
            percent: { type: "DECIMAL" },
            //this field does not in select clause
            remark: { type: "STRING", selected: false },
            //this field does not exist in table, it is user defined field  
            amount: { type: "DECIMAL", calculated: true }, 
        },
    },
});

broker.start()
.then(() => broker.call("service.find",{share: "XXX"}).then((result) => { 
    console.log("service.find",result);
}))
```

#### model
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| name | string | **required** | Name of table. |
| alias | Object | **required** | The object must have key `privateAlias`. |
| fields | [FieldSetting](#field-setting) | `undefined` | Schema for table name. |

#### Field Setting
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| name | string | **required** | Name of table column. |
| type | string | **required** | Data type of table column ex. `STRING`, `INTEGER`, `DECIMAL`, `BOOLEAN`, `BIGINT`, `TEXT`, `DATE`, `TIME`, `DATETIME`, `CLOB`, `BLOB`. |
| size | number | `undefined` | Length of table column. |
| precision | number | `undefined` | Precision of table column. |
| key | boolean | false | This column is key field. |
| calculated | boolean | false | This column is calculated field. |
| selected | boolean | true | This column should select or not. |
| nullable | boolean | true | This column can be null. |


### Actions

| Name | Description |
| -------- | ----------- |
| create | To create new record. |
| find | To find out data records. |
| list | To list out data records (as same as find). |
| update | To update data record. |
| clear | To delete data record. |
| insert | For override. |
| retrieve | For override. |
| collect | For override. |
| remove | For override. |

### Results

**Type:** `ResultSet` {rows: Object, columns: Object}

### Raw Query

The handler provide two methods (executeQuery & executeUpdate) to execute query statement by `this.handler`

```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

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
            let sql = "select * from testdbx where share = 'XXX'";
            return this.handler.executeQuery(sql);    
        },
        updatePercent() {
            let sql = "update testdbx set percent = 55 where share = 'XXX'";
            return this.handler.executeUpdate(sql);
        }
    }
});

broker.start()
.then(() => broker.call("service.getShare").then((result) => { 
    console.log("service.getShare",result);
}))
.then(() => broker.call("service.updatePercent").then((result) => { 
    console.log("service.getupdatePercentYield",result);
}))
```

### Handler

In order to make your own handler it can be extend from `KnHandler`.

#### MyHandler
```typescript
import { KnHandler, KnModel } from "will-db";
import { KnSQL, ResultSet } from "will-sql";

class MyHandler extends KnHandler {
    //this is an addon action
    public findby(context: any) : Promise<string> {
        console.debug("findby",context);
        return Promise.resolve("MyHandler.findby");
    }
    //must declared handlers in order to merge addon action to service 
    //ex. name: "findby" is the handler naming function from public findby(context) method
    public handlers = [ {name: "findby"} ];

    //have to defined model to connect db
    public model : KnModel = { name: "testdbx", alias: { privateAlias: "MYSQL" } };
    public override async collect(context: any) : Promise<ResultSet> {
        let db = this.getPrivateConnector(this.model);
        try {
            let knsql = new KnSQL("select * from testdbx");
            if(context.params.sharecode) {
                knsql.append(" where share = ?sharecode ");
                knsql.set("sharecode",context.params.sharecode);
            }
            let rs = await knsql.executeQuery(db);
            return Promise.resolve(rs);
        } finally {
            db.close();
        }
    }
}
```

#### MyHandler Usage

```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";
import MyHandler from "./MyHandler";

const broker = new ServiceBroker({
    logLevel: "debug"
});
broker.createService({
    name: "service",
    mixins: [KnService],
    handler: new MyHandler(),    
});

broker.start()
.then(() => broker.call("service.collect",{sharecode: "XXX"}).then((result) => { 
    console.log("service.collect",result);
}))
```

### Pagination

In order to reduce large result set from query. Action `find` and `list` support paging as default.

```typescript
import { ServiceBroker } from "moleculer";
import KnService from "will-db";

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
        //this is minimum number of records return
        rowsPerPage: 10,
        //this is maximum number of records return, 
        //so it can reach when defined rowsPerPage over as parameter
        maxRowsPerPage: 200,
    }
});

broker.start()
//default page number = 1
.then(() => broker.call("service.list").then((result) => { 
    console.log("service.list",result);
}))
//specified order by field and order direction
.then(() => broker.call("service.list",{page: 2, orderBy: "field1", orderDir: "ASC"}).then((result) => { 
    console.log("service.list",result);
}))

.then(() => broker.call("service.list",{page: 3, orderBy: "field1", orderDir: "DESC"}).then((result) => { 
    console.log("service.list",result);
}))

//defined paging: rowsPerPage = 10 as parameter
.then(() => broker.call("service.list",{page: 1, rowsPerPage: 10 }).then((result) => { 
    console.log("service.list",result);
}))
```

#### Paging Result

Result set of paging include attribute

    offsets: {
        //current page
        page: 1,
        //number of rows per page
        rowsPerPage: 10,
        //total rows from query
        totalRows: 27,
        //total pages
        totalPages: 3,
        //limit of result set
        limit: 10,
        //offset query depending on current page
        offset: 0,
        //order by field name
        orderBy: 'field1',
        //order direction (ASC/DESC)
        orderDir: 'ASC'
    }

