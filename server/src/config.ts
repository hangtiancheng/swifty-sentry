import { existsSync, readFileSync } from "node:fs";
import yaml from "yaml";

export interface ServerConfig {
  port: number; // Default: 8088
  body_limit: number; // Default: 1048576 (1MB)
  allowed_origins: string[];
}

export interface LogConfig {
  dir: string; // Default: ./logs
  max_size: number; // Default: 104857600 (100MB)
  file_prefix: string; // Default: sdk
  rotate_daily: boolean; // Default: true
}

export interface Config {
  server: ServerConfig;
  log: LogConfig;
}

const defaultConfig: Config = {
  server: {
    port: 8088,
    body_limit: 1048576, // 1MB
    allowed_origins: ["*"],
  },
  log: {
    dir: "./logs",
    max_size: 104857600, // 100MB
    file_prefix: "sdk",
    rotate_daily: true,
  },
};

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    this.config = defaultConfig;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public load(configPath: string): void {
    if (!existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    const data = yaml.parse(readFileSync(configPath, "utf-8"));
    const serverData = data.server ?? {};
    const logData = data.log ?? {};
    this.config = {
      server: {
        port: serverData.port ?? defaultConfig.server.port,
        body_limit: serverData.body_limit ?? defaultConfig.server.body_limit,
        allowed_origins: serverData.allowed_origins ?? defaultConfig.server.allowed_origins,
      },
      log: {
        dir: logData.dir ?? defaultConfig.log.dir,
        max_size: logData.max_size ?? defaultConfig.log.max_size,
        file_prefix: logData.file_prefix ?? defaultConfig.log.file_prefix,
        rotate_daily: logData.rotate_daily ?? defaultConfig.log.rotate_daily,
      },
    };
  }

  public getConfig(): Config {
    return this.config;
  }
}

export const cfg = ConfigManager.getInstance();
