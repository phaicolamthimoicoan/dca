'use strict';

import { Client, Events } from "discord.js";
import DefaultClientOptions from "../default/clientOptions.js";

export default class extends Client {
  /**
   * 
   * @param {DefaultClientOptions} options 
   */
  constructor(options = {}) {
    super(Object.assign(DefaultClientOptions, options));
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

