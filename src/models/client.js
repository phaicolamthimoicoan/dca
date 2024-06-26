'use strict';

import { Client as DefaultClient, Events } from "discord.js";
import DefaultClientOptions from "../default/clientOptions.js";

export default class Client extends DefaultClient {
  /**
   * 
   * @param {DefaultClientOptions} options 
   */
  constructor(options = {}) {
    super(Object.assign(DefaultClientOptions, options));
    /**
     * @type {Map<string, execute(import("discord.js").Interaction) =>void>}
     */
    this.commands = new Map()
  };
  /**
   * 
   * @param {(data: import("discord.js").Message)=>void} listener 
   * @returns {this}
   */
  listenMsg(listener) {
    return this.on(Events.MessageCreate, listener)
  };
  /**
   * 
   * @param {(data: import("discord.js").Interaction)=>void} listener 
   * @returns {this}
   */
  listenCmd(listener) {
    return this.on(Events.InteractionCreate, listener)
  };
  /**
   * @type {Array<(that: this)=>void>}
   */
  #onLoad = [];
  /**
   * 
   * @param {(that: this)=>void} func 
   */
  use(func) {
    this.#onLoad.push(func)
  };
  load() {
    for (const once of this.#onLoad) {
      try {
        once(this)
      } catch { console.error }
    }
  }
}

