'use strict';
import commandsCtx from "./strurc/command.js";
/**
 * 
 * @param {Array<{config:commandsCtx, execute(data: import("discord.js").Interaction, args?: any)=>void}>} commands 
 * @param {{
 * onLoad?: {funcName: string|"onLoad", extraArgs?: any},
 * onInteraction?: {funcName: string|"onInteraction"}
 * }} options
 * @returns {(that: import("./models/client.js"))=>void}
 */
export default function (commands, options = {}) {
  if (options.onLoad && !options.onLoad.funcName) options.onLoad = { funcName: "onLoad" };
  if (options.onInteraction && !options.onInteraction.funcName) options.onInteraction = { funcName: "onInteraction" };
  return (that) => {
    that.commands = new Map();
    if (options.onInteraction) that.onInteraction = new Map();
    /** @type {Array<commandsCtx>}*/
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
      if (options.onLoad && once[options.onLoad.funcName]) {
        if (typeof once[options.onLoad.funcName] == "function") {
          try {
            options.onLoad.extraArgs ? once[options.onLoad.funcName](options.onLoad.extraArgs) : once[options.onLoad.funcName]()
          } catch { console.log }
        } else {
          console.log(` \x1b[33m[warn]\x1b[0m [command: ${once.config.name}] typeof ${options.onLoad.funcName} is not a function!`)
        }
      };
      commandsLoaded.push(Object.assign(JSON.parse(JSON.stringify(commandsCtx)), once.config));
      that.commands.set(once.config.name, once.execute);
      if (options.onInteraction && once[options.onInteraction.funcName]) {
        (typeof once[options.onInteraction.funcName] == "function")
          ? that.onInteraction.set(once.config.name, once[options.onInteraction.funcName])
          : console.log(` \x1b[33m[warn]\x1b[0m [command: ${once.config.name}] typeof ${options.onInteraction.funcName} is not a function!`);
      };
    };
    missingName != 0 ? console.log(` \x1b[31m[error]\x1b[0m ${missingName} command(s) missing name`) : "";
    that.application.commands.set(commandsLoaded);
    console.log(` \x1b[32m[Citnut]\x1b[0m loaded ${commandsLoaded.length}/${commands.length} command(s)`)
  }
}