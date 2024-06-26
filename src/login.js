'use strict';
import { Events } from "discord.js";
import DefaultLoginConfig from "./default/loginConfig.js";
import Client from "./models/client.js";
/**
 * 
 * @param {{token: string, client: any}} config 
 * @returns void | Client
 */
export default function (config) {
  const _config = Object.assign(DefaultLoginConfig, config);
  if (!_config.token) {
    return console.error("token not found!")
  }
  let client = new Client(_config.client);
  client.login(_config.token);
  client.once(Events.Error, console.error);
  client.once(Events.Warn, console.warn);
  client.once(Events.ClientReady, () => {
    console.log(" \x1b[32m[Citnut]\x1b[0m DCA is ready!");
    client.load()
  });
  return client
}