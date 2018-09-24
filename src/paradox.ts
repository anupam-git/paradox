#!/usr/bin/env node

import * as Commander from "commander";
import { isIP } from "net";
import { Client } from "./client";
import { Server } from "./server/server";

export class Paradox {
  public static getInstance() {
    if (Paradox.instance === undefined) {
      Paradox.instance = new Paradox("0.1.0");
    }

    return Paradox.instance;
  }
  private static instance: Paradox;

  private commander: Commander.Command;
  private version: string;

  private constructor(version: string) {
    this.version = version;

    this.startServerActionHandler = this.startServerActionHandler.bind(this);
    this.runScriptActionHandler = this.runScriptActionHandler.bind(this);

    this.commander = Commander.name("paradox");
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
      .version(this.version, "-v, --version");

    this.commander
      .command("start-server <host> <port>")
      .description("Start Paradox Server")
      .action(this.startServerActionHandler);

    this.commander
      .command("list-scripts <host> <port>")
      .description("Show List of Available Scripts")
      .action(this.startServerActionHandler);

    this.commander
      .command("run-script <host> <port> <script-name>")
      .description("Run Script on Remote Paradox Server")
      .action(this.runScriptActionHandler);

    this.commander
      .on("command:*", () => {
        this.printInvalid(this.commander.args);
      });
  }

  private parseCommands() {
    if (process.argv.length === 2) {
      this.printInvalid([]);
    }

    this.commander.parse(process.argv);
  }

  private startServerActionHandler(host: string, port: number) {
    this.checkHost(host);
    this.checkPort(port);

    new Server(host, port).start();
  }

  private runScriptActionHandler(host: string, port: number, script: string) {
    this.checkHost(host);
    this.checkPort(port);

    new Client(host, port).runScript(script);
  }

  private printInvalid(args: string[]) {
    console.error("Invalid command: %s\nSee --help for a list of available commands.", args.join(" "));
    process.exit(1);
  }
}

if (require.main === module) {
  Paradox.getInstance();
}