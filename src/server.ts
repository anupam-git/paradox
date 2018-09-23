export class Server {
  private host: string;
  private port: number;

  public constructor(host: string, port: number) {
    this.host = host;
    this.port = port;

    console.log(this.host, this.port);
  }
}