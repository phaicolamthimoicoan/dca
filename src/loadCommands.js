'use strict';
import commandsCtx from "./struc/command.js";
/**
 * 
 * @param {Array<{config:commandsCtx, execute(data: import("discord.js").Interaction)=>void}>} commands 
 * @returns {(that: import("./models/client.js"))=>void}
 */
export default function (commands) {
  return (that) => {
    /**
     * @type {Array<commandsCtx>}
     */
    let commandsLoaded = [];
    /**
     * @type {Array<(data: import("discord.js").Interaction)=>void>}
     */
    let executeLoaded = [];
    let err = {
      execute: [],
      name: 0,
      des: []
    };
    for (const once of commands) {
      if (!once.config.name) {
        err.name++;
        continue
      };
      if (!once.execute) {
        err.execute.push(once.config.name);
        continue
      };
      if ((!once.config.type || once.config.type == 1) && !once.config.description) {
        err.des.push(once.config.config.name);
        continue
      };
      commandsLoaded.push(Object.assign(JSON.parse(JSON.stringify(commandsCtx)), once.config));
      executeLoaded.push(once.execute)
    };
    that.application.commands.set(commandsLoaded);
    for (let index = 0; index < commandsLoaded.length; index++) {
      that.commands.set(commandsLoaded[index].name, executeLoaded[index])
    };
    err.execute.length != 0 ? err.execute.forEach((e) => console.log(` \x1b[31m[error]\x1b[0m command ${e} missing execute function`)) : "";
    err.name != 0 ? console.log(` \x1b[31m[error]\x1b[0m ${err.name} command(s) missing name`) : "";
    err.des.length != 0 ? err.des.forEach((e) => console.log(` \x1b[31m[error]\x1b[0m command ${e} missing description`)) : "";
    console.log(` \x1b[32m[Citnut]\x1b[0m loaded ${commandsLoaded.length}/${commands.length} command(s)`)
  }
}