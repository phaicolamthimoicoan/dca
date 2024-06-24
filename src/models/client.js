'use strict';

import { Client as DefaultClient, Events } from "discord.js";
import DefaultClientOptions from "../default/clientOptions.js";

export default class Client extends DefaultClient {
  constructor(options = {}) {
    super(Object.assign(DefaultClientOptions, options));
    this.commands = new Map()
  };

  listenMsg(listener) {
    return this.on(Events.MessageCreate, listener)
  };

  listenCmd(listener) {
    return this.on(Events.InteractionCreate, listener)
  };
}

