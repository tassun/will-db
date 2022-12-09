import { KnLogger } from "../handler/KnLogger";

let logger = new KnLogger();
logger.debug("debug","hello world");
logger.info("info","hello world");
logger.warn("warn","hello world");
logger.error("error","hello","world");
logger.fatal("fatal","hello","world");
logger.trace("trace","hello","world");
