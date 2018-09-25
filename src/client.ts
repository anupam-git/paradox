import * as HttpRequest from "request";

export class Client {
  private host: string;
  private port: number;
  private version: string;

  public constructor(host: string, port: number, version: string) {
    this.host = host;
    this.port = port;
    this.version = version;
  }

  public getScripts() {
    this.checkVersionMismatch()
      .then(() => {
        HttpRequest
          .get(`http://${this.host}:${this.port}/getScripts`, (err, res, body) => {
            try {
              const parsedResponse = JSON.parse(body);
              console.log(parsedResponse);
            } catch (e) {
              this.printInvalidResponse();
            }
          });
      })
      .catch(() => {
        this.printError("Version Mismatch. Please make sure Server and Client are having same version of Paradox CLI tool");
      });
  }

  public runScript(script: string, username: string, password: string, waitForOutput: boolean) {
    this.checkVersionMismatch()
      .then(() => {
        HttpRequest
          .post(`http://${this.host}:${this.port}/runScript/${script}?waitForOutput=${waitForOutput}&username=${username}&password=${password}`, (err, res, body) => {
            try {
              const runScriptParsedResponse = JSON.parse(body);

              if (runScriptParsedResponse.status === "success") {
                if (waitForOutput) {
                  console.log(runScriptParsedResponse.stdout);
                } else {
                  console.log("Script Executation Started Successfully");
                }
              } else if (runScriptParsedResponse.status === "error") {
                console.log(runScriptParsedResponse.message || "Error");
              } else {
                console.log("Oops. This shouldn't come up.");
              }
            } catch (e) {
              this.printInvalidResponse();
            }
          });
      })
      .catch(() => {
        this.printError("Version Mismatch. Please make sure Server and Client are having same version of Paradox CLI tool");
      });
  }

  private checkVersionMismatch(): Promise<void> {
    const version = this.version;
    const promise = new Promise<void>((resolve, reject) => {
      HttpRequest
        .get(`http://${this.host}:${this.port}/version`, (versionErr, versionRes, versionBody) => {
          try {
            const versionParsedResponse = JSON.parse(versionBody);

            version === versionParsedResponse.version ? resolve() : reject();
          } catch (e) {
            this.printInvalidResponse();
          }
        });
    });

    return promise;
  }

  private printInvalidResponse() {
    console.error(`INVALID RESPONSE: Check if Paradox Server is Running on ${this.host}:${this.port}`);
  }

  private printError(msg: string) {
    console.error("Error: %s", msg);
    process.exit(1);
  }
}