import * as path from "path";

export default function getConfigDir(appName: string, appVersion: string) {
  const configDir = process.env.APPDATA || (process.platform === "darwin" ? path.join(process.env.HOME as string, "Library", "Preferences") : path.join(process.env.HOME as string, ".config"));

  return path.join(configDir, appName, appVersion);
}