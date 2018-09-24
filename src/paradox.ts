#!/usr/bin/env node

import * as AppDirectory from "appdirectory";
import * as Commander from "commander";
import { existsSync, mkdirpSync, readFileSync, writeJSONSync } from "fs-extra";
import { isIP } from "net";
import * as Path from "path";

import { IConfig } from "./_shared/IConfig";
import { Client } from "./client";
import { Server } from "./server/server";

export class Paradox {
  public static getInstance() {
    if (Paradox.instance === undefined) {
      Paradox.instance = new Paradox();
    }

    return Paradox.instance;
  }
  private static instance: Paradox;

  private commander: Commander.Command;
  private appName = "paradox";
  private appVersion = "0.1.0";
  private appDirs: any;
  private configFilename = "config.json";
  private config: IConfig;
  private defaultConfig = {
    scripts: {}
  };

  private constructor() {
    this.startServerActionHandler = this.startServerActionHandler.bind(this);
    this.listScriptsActionHandler = this.listScriptsActionHandler.bind(this);
    this.runScriptActionHandler = this.runScriptActionHandler.bind(this);
    this.addScriptActionHandler = this.addScriptActionHandler.bind(this);
    this.removeScriptActionHandler = this.removeScriptActionHandler.bind(this);
    this.resetConfigActionHandler = this.resetConfigActionHandler.bind(this);

    this.appDirs = new AppDirectory({
      appName: this.appName,
      appVersion: this.appVersion
    });

    this.config = this.getConfig();

    this.commander = Commander.name(this.appName);
    this.setupCommands();
    this.parseCommands();
  }

  public getParser() {
    return this.commander;
  }

  private checkHost(host: string) {
    if (!isIP(host)) {
      console.error("ERROR : Invalid IP");
      process.exit(1);
    }
  }

  private checkPort(port: number) {
    if (isNaN(port)) {
      console.error("ERROR : Invalid Port");
      process.exit(1);
    }
  }

  private setupCommands() {
    this.commander
      .version(this.appVersion, "-v, --version");

    this.commander
      .command("start-server <host> <port>")
      .description("Start Paradox Server")
      .action(this.startServerActionHandler);

    this.commander
      .command("list-scripts <host> <port>")
      .description("Show List of Available Remote Scripts")
      .action(this.listScriptsActionHandler);

    this.commander
      .command("run-script <host> <port> <script-name>")
      .option("-w, --wait-for-response")
      .description("Run Script on Remote Paradox Server")
      .action(this.runScriptActionHandler);

    this.commander
      .command("add-script <name> <script>")
      .description("Register a Script for Paradox Server [Requires Restart]")
      .action(this.addScriptActionHandler);

    this.commander
      .command("remove-script <name>")
      .description("Removes a Registered Script from Paradox Server [Requires Restart]")
      .action(this.removeScriptActionHandler);

    this.commander
      .command("reset-config")
      .description("Resets the Paradox Server to initial state [Requires Restart]")
      .action(this.resetConfigActionHandler);

    this.commander
      .on("command:*", () => {
        this.printInvalidCommand(this.commander.args);
      });
  }

  private parseCommands() {
    if (process.argv.length === 2) {
      this.printInvalidCommand([]);
    }

    this.commander.parse(process.argv);
  }

  private startServerActionHandler(host: string, port: number, options: any) {
    this.checkHost(host);
    this.checkPort(port);


    try {
      this.validateConfig(this.config);

      new Server(host, port, this.config).start();
    } catch (e) {
      this.printError("Make sure config file is valid and readable.");
    }
  }

  private listScriptsActionHandler(host: string, port: number) {
    this.checkHost(host);
    this.checkPort(port);

    new Client(host, port).getScripts();
  }

  private runScriptActionHandler(host: string, port: number, script: string, options: any) {
    this.checkHost(host);
    this.checkPort(port);

    new Client(host, port).runScript(script, options.waitForResponse || false);
  }

  private addScriptActionHandler(name: string, script: string) {
    this.config.scripts[name] = script;

    this.writeConfig(this.config, "Script Registered Successfully");
  }

  private removeScriptActionHandler(name: string) {
    if (this.config.scripts[name]) {
      delete this.config.scripts[name];

      this.writeConfig(this.config, "Script Unregistered Successfully");
    } else {
      console.error(`Script '${name}' not found`);
    }
  }

  private resetConfigActionHandler() {
    this.writeConfig(this.defaultConfig, "Configuration Restored to Initial State");
  }

  private getConfig(): IConfig {
    const configFilePath = Path.join(this.appDirs.userConfig(), this.configFilename);
    let fileData = this.defaultConfig;

    if (existsSync(configFilePath)) {
      fileData = JSON.parse(readFileSync(configFilePath, { encoding: "utf8" }));
    } else {
      mkdirpSync(this.appDirs.userConfig());
      this.writeConfig(fileData);
    }

    return fileData;
  }

  private validateConfig(config: IConfig) {
    if (
      !config ||
      !config.scripts ||
      !(config.scripts instanceof Object)
    ) {
      this.printError("Invalid config format\nPlease reset config if manually edited.");
    }
  }

  private writeConfig(config: IConfig, successMsg?: string) {
    const configFilePath = Path.join(this.appDirs.userConfig(), this.configFilename);

    try {
      writeJSONSync(configFilePath, config, { spaces: 2 });

      if (successMsg) {
        console.log(successMsg);
      }
    } catch (e) {
      console.error("Unknown error occured", e);
    }
  }

  private printInvalidCommand(args: string[]) {
    console.error("Invalid command: %s\nSee --help for a list of available commands.", args.join(" "));
    process.exit(1);
  }

  private printError(msg: string) {
    console.error("Error: %s", msg);
    process.exit(1);
  }
}

if (require.main === module) {
  Paradox.getInstance();
}