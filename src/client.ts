import * as HttpRequest from "request";

export class Client {
  private host: string;
  private port: number;

  public constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public runScript(script: string) {
    HttpRequest
      .post(`http://${this.host}:${this.port}/runScript/${script}`, (err, res, body) => {
        try {
          const parsedResponse = JSON.parse(body);
          console.log(parsedResponse);
        } catch (e) {
          console.error(`Invalid Response. Check if Paradox Server is Running on ${this.host}:${this.port}`);
        }
      });
  }
}