export interface IConfig {
  users: {
    [username: string]: string
  };
  scripts: {
    [name: string]: string
  };
}