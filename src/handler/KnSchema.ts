import { Service, ServiceSchema, ServiceActionsSchema } from "moleculer";
import { ServiceHandler, HandlerSetting } from "./KnAlias";
import { KnHandler } from "./KnHandler";
 
export class KnSchema implements ServiceSchema {
    public name : string = "";
    public actions : ServiceActionsSchema;
    public handler?: ServiceHandler; 

    constructor(handler?: ServiceHandler) {
        this.handler = handler;
        this.actions = this.createActions();
    }

    public createActions() : ServiceActionsSchema {
        let result = this.defaultActions;
        if(this.handler?.handlers) {
            this.handler?.handlers.forEach((element: HandlerSetting) => {
                result[element.name] = {
                    ...element.options,
                    handler(ctx: any) {
                        return this.handler?.[element.name](ctx);
                    }
                }
            });
        }
        return result;
    }
    
    private defaultActions : ServiceActionsSchema = {
        clear: {
            handler(ctx: any) {
                return this.handler?.clear(ctx);
            }
        },
        create: {
            handler(ctx: any) {
                return this.handler?.create(ctx);
            }
        },
        list: {
            handler(ctx: any) {
                return this.handler?.list(ctx);
            }
        },
        find: {
            handler(ctx: any) {
                return this.handler?.find(ctx);
            }
        },
        insert: {
            handler(ctx: any) {
                return this.handler?.insert(ctx);
            }
        },
        retrieve : {
            handler(ctx: any) {
                return this.handler?.retrieve(ctx);
            }
        },
        update : {
            handler(ctx: any) {
                return this.handler?.update(ctx);
            }
        },
        remove : {
            handler(ctx: any) {
                return this.handler?.remove(ctx);
            }
        },
        collect: {
            handler(ctx: any) {
                return this.handler?.collect(ctx);
            }
        },
    }

    // Fired after the service schemas merged and before the service instance created
    public merged(scheme:any) {
        this.actions = scheme.createActions();
    }

	// Service created lifecycle event handler
    public created() : void {
        let svc = (this as unknown) as Service;
        if(svc.schema.handler) {
            this.handler = svc.schema.handler;
        } else {
            this.handler = new KnHandler();
        }
        if(this.handler) {
            this.handler.init(svc.broker,this);
        }
    }

	// Service started lifecycle event handler
    public started() : void {
        //do nothing
    }

	// Service stopped lifecycle event handler
    public stopped() : void {
        if (this.handler) {
			return this.handler.destroy();
        }
    }

}

