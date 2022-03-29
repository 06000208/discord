/* eslint-disable no-empty-function */
import { EventEmitterConstruct } from "@a06000208/handler";
import Collection from "@discordjs/collection";
import { Client } from "discord.js";
import { Wrapper } from "./Wrapper.js";

class DiscordClient extends Wrapper {
    constructor(clientOptions, eventOptions = {}) {
        super();

        /**
         * @type {Client}
         */
        this.client = new Client(clientOptions);

        /**
         * @type {EventEmitterConstruct}
         */
        this.events = new EventEmitterConstruct(eventOptions, this.client);

        /**
         * @type {Collection<*,*>}
         */
        this.cookies = new Collection();
    }

    // login() {}
    // destroy() {}
}

export { DiscordClient };
