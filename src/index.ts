import dotenv from "dotenv";

dotenv.config();

import logger from "./logger";
async function bootstrap(){
    logger.debug("kaizoku oni ore wa naru");
}

bootstrap();