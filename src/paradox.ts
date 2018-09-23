import * as Commander from "commander";
import { isIP } from "net";

export class Paradox {
  public static getInstance() {
    if (Paradox.instance === undefined) {
      Paradox.instance = new Paradox("0.1.0");
    }

    return Paradox.instance;
  }
  private static instance: Paradox;

  private commander: Commander.Command;

  private constructor(version: string) {
    this.startServerActionHandler = this.startServerActionHandler.bind(this);
    this.runScriptActionHandler = this.runScriptActionHandler.bind(this);

    this.commander = Commander
      .name("paradox")
      .version(version, "-v, --version");

    this.commander
      .command("start-server <host> <port>")
      .description("Start Paradox Server")
      .action(this.startServerActionHandler);

    this.commander
      .command("run-script <host> <port> <script-name>")
      .description("Run Script on Remote Paradox Server")
      .action(this.runScriptActionHandler);

    this.commander
      .parse(process.argv);
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

  private startServerActionHandler(host: string, port: number) {
    this.checkHost(host);
    this.checkPort(port);

    console.log("Start Server Action Handler :", host, port);
  }

  private runScriptActionHandler(host: string, port: number, script: string) {
    this.checkHost(host);
    this.checkPort(port);

    console.log("Run Script Action Handler :", host, port, script);
  }
}

if (require.main === module) {
  Paradox.getInstance();
}