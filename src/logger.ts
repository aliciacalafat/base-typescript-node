import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
    level: process.env.LOGGER_LEVEL ?? "info",
    transport: {
        target: isProduction ? "pino" : "pino-pretty",
    }
});

export default logger;