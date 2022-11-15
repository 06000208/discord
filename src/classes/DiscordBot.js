/* eslint-disable no-empty-function */
import { EventEmitterConstruct } from "@a06000208/handler";
import { Client } from "discord.js";
import { TokenRegex } from "@sapphire/discord-utilities";
import EventEmitter from "node:events";

/**
 * @typedef {Object} DiscordBotOptions
 * @property {ClientOptions} [clientOptions] Options for
 * the discord.js client, unused when a pre-existing client is wrapped.
 * @property {EmitterConstructData} [botEventOptions] Options for the bot's
 * event emitter construct
 * @property {EmitterConstructData} [clientEventOptions] Options for the client's
 * event emitter construct
 * @property {EmitterConstructData} [restEventOptions] Options for the REST
 * manager's event emitter construct
 * @property {?Client} [client] A pre-existing Client instance to wrap
 */

/**
 * Wrapper for the discord.js Client class
 *
 * Note that constructs (events, clientEvents, restEvents, etc) won't be instantiated
 * until they are looked up once, and afterwards will be defined on the instance. This
 * decreases overhead from what you're not using.
 */
export class DiscordBot extends EventEmitter {
    /**
     * @param {?Client|DiscordBotOptions} [input] Either an options object
     * for the wrapper, or a pre-existing Client instance to wrap.
     */
    constructor(input) {
        super();

        /**
         * @type {DiscordBotOptions}
         */
        this.options = input ? (input instanceof Client ? {} : input) : {};

        /**
         * @type {?Client}
         */
        this.client = input instanceof Client ? input : (input.client || new Client(this.options.clientOptions || {}));
    }

    /**
     * Custom events for the bot
     * @returns {EventEmitterConstruct}
     * @readonly
     */
    get events() {
        Object.defineProperty(this, "events", {
            value: new EventEmitterConstruct(this.options.botEventOptions || null, this),
            enumerable: true,
        });
        return this.events;
    }

    /**
     * Events for the client
     * @returns {EventEmitterConstruct}
     * @readonly
     */
    get clientEvents() {
        Object.defineProperty(this, "clientEvents", {
            value: new EventEmitterConstruct(this.options.clientEventOptions || null, this.client),
            enumerable: true,
        });
        return this.clientEvents;
    }

    /**
     * Events for the client's REST manager
     * @returns {EventEmitterConstruct}
     * @readonly
     */
    get restEvents() {
        Object.defineProperty(this, "restEvents", {
            value: new EventEmitterConstruct(this.options.restEventOptions || null, this.client.rest),
            enumerable: true,
        });
        return this.restEvents;
    }

    /**
     * Method wrapping the discord.js Client#login() method
     * @param {string} token
     * @return {Promise<string>}
     */
    async login(token) {
        if (!token) throw new TypeError("TOKEN_MISSING");
        if (typeof token != "string") throw new Error("TOKEN_INVALID");
        if (!TokenRegex.exec(token).groups.basicToken) throw new Error("TOKEN_INVALID_REGEX");
        return await this.client.login(token);
    }
}
