import * as HttpRequest from "request";

export class Client {
  private host: string;
  private port: number;

  public constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public getScripts() {
    HttpRequest
      .get(`http://${this.host}:${this.port}/getScripts`, (err, res, body) => {
        try {
          const parsedResponse = JSON.parse(body);
          console.log(parsedResponse);
        } catch (e) {
          this.printInvalidResponse();
        }
      });
  }

  public runScript(script: string, username: string, password: string, waitForOutput: boolean) {
    HttpRequest
      .post(`http://${this.host}:${this.port}/runScript/${script}?waitForOutput=${waitForOutput}&username=${username}&password=${password}`, (err, res, body) => {
        try {
          const parsedResponse = JSON.parse(body);
          console.log(parsedResponse, parsedResponse.status === "error", parsedResponse.message);

          if (parsedResponse.status === "success") {
            if (waitForOutput) {
              console.log(parsedResponse.stdout);
            } else {
              console.log("Script Executation Started Successfully");
            }
          } else if (parsedResponse.status === "error") {
            console.log(parsedResponse.message || "Error");
          } else {
            console.log("Oops. This shouldn't come up.");
          }
        } catch (e) {
          this.printInvalidResponse();
        }
      });
  }

  private printInvalidResponse() {
    console.error(`INVALID RESPONSE: Check if Paradox Server is Running on ${this.host}:${this.port}`);
  }
}