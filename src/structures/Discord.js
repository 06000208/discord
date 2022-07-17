/* eslint-disable no-empty-function */
import { EventEmitterConstruct } from "@a06000208/handler";
import { Client } from "discord.js";
import { TokenRegex } from "@sapphire/discord-utilities";

/**
 * @typedef {Object} DiscordClientOptions
 * @property {ClientOptions} [clientOptions] Options for
 * the discord.js client. Unused when a pre-existing client is wrapped.
 * @property {EventEmitterData} [eventOptions]
 * @property {?Client} [client] A pre-existing Client instance to wrap
 */

/**
 * Wrapper for the discord.js Client class
 */
class Discord {
    /**
     * @param {?Client|DiscordClientOptions} [input] Either an options object
     * for the wrapper, or a pre-existing Client instance to wrap.
     */
    constructor(input) {
        const options = input instanceof Client ? { client: input } : input || {};

        /**
         * @type {?Client}
         */
        this.client = options.client || new Client(options.clientOptions || {});

        /**
         * @type {EventEmitterConstruct}
         */
        this.events = new EventEmitterConstruct(options.eventOptions || null, this.client);
    }

    /**
     * Method wrapping the discord.js Client#login() method
     * @param {string} token
     * @return {Promise<string>}
     */
    async login(token) {
        if (!token) throw new Error("TOKEN_MISSING");
        if (typeof token != "string") throw new Error("TOKEN_INVALID");
        if (!TokenRegex.exec(token).groups.basicToken) throw new Error("TOKEN_INVALID_REGEX");
        return await this.client.login(token);
    }

    /**
     * Method wrapping the discord.js Client#destroy() method
     */
    destroy() {
        this.client.destroy();
        this.events.cache.clear();
    }
}

export { Discord };

