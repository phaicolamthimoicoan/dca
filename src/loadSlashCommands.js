'use strict';
import commandsCtx from "./struc/command.js";
/**
 * 
 * @param {Array<{config:commandsCtx, execute(data: import("discord.js").Interaction, args?: any)=>void}>} commands 
 * @param {{onLoadFunc?: boolean, onLoadFuncName: string|"onLoad", onLoadFuncArgs?:any}} options
 * @returns {(that: import("./models/client.js"))=>void}
 */
export default function (commands, options = {}) {
  if (options.onLoadFunc && !options.onLoadFuncName) options.onLoadFuncName = "onLoad";
  return (that) => {
    /**
     * @type {Array<commandsCtx>}
     */
    let commandsLoaded = [];
    let missingName = 0;
    for (const once of commands) {
      if (!once.config.name) {
        missingName++;
        continue
      };
      if (!once.execute) {
        console.log(` \x1b[31m[error]\x1b[0m command ${once.config.name} missing execute function`);
        continue
      };
      if ((!once.config.type || once.config.type == 1) && !once.config.description) {
        console.log(` \x1b[31m[error]\x1b[0m command ${once.config.name} missing description`);
        continue
      };
      if (options.onLoadFunc && once[options.onLoadFuncName]) {
        if (typeof once[options.onLoadFuncName] == "function") {
          try {
            options.onLoadFuncArgs ? once[options.onLoadFuncName](options.onLoadFuncArgs) : once[options.onLoadFuncName]()
          } catch { console.log }
        } else {
          console.log(` \x1b[33m[warn]\x1b[0m [command: ${once.config.name}] typeof ${options.onLoadFuncName} is not a function!`)
        }
      };
      commandsLoaded.push(Object.assign(JSON.parse(JSON.stringify(commandsCtx)), once.config));
      that.commands.set(once.config.name, once.execute);
    };
    missingName != 0 ? console.log(` \x1b[31m[error]\x1b[0m ${missingName} command(s) missing name`) : "";
    that.application.commands.set(commandsLoaded);
    console.log(` \x1b[32m[Citnut]\x1b[0m loaded ${commandsLoaded.length}/${commands.length} command(s)`)
  }
}