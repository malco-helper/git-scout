import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { Config } from "./types";

const ProjectSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty"),
  path: z.string().min(1, "Project path cannot be empty"),
});

const ConfigSchema = z.object({
  projects: z
    .array(ProjectSchema)
    .min(1, "At least one project must be configured"),
  defaultSinceDays: z.number().min(1).default(1),
});

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config | null = null;

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): Config {
    if (!this.config) {
      this.config = this.loadConfig();
    }
    return this.config;
  }

  public reloadConfig(): Config {
    this.config = this.loadConfig();
    return this.config;
  }

  private loadConfig(): Config {
    const configPaths = this.getConfigPaths();

    for (const configPath of configPaths) {
      if (existsSync(configPath)) {
        try {
          const configContent = readFileSync(configPath, "utf-8");
          const rawConfig = JSON.parse(configContent);
          const validatedConfig = ConfigSchema.parse(rawConfig);

          // Validate that all project paths exist and are git repositories
          this.validateProjectPaths(validatedConfig.projects);

          return validatedConfig;
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Invalid config file at ${configPath}:\n${this.formatZodError(
                error
              )}`
            );
          } else if (error instanceof SyntaxError) {
            throw new Error(
              `Invalid JSON in config file at ${configPath}: ${error.message}`
            );
          } else {
            throw new Error(
              `Error reading config file at ${configPath}: ${error}`
            );
          }
        }
      }
    }

    // If no config file found, create a sample one
    throw new Error(
      `No config file found. Please create one at:\n` +
        `  ${configPaths[0]} (global)\n` +
        `  ${configPaths[1]} (local)\n\n` +
        `Sample config:\n${this.getSampleConfig()}`
    );
  }

  private getConfigPaths(): string[] {
    const globalConfigDir = join(homedir(), ".git-scout");
    const globalConfigPath = join(globalConfigDir, "config.json");
    const localConfigPath = join(process.cwd(), "git-scout.config.json");

    return [globalConfigPath, localConfigPath];
  }

  private validateProjectPaths(
    projects: { name: string; path: string }[]
  ): void {
    const fs = require("fs");
    const path = require("path");

    for (const project of projects) {
      if (!existsSync(project.path)) {
        throw new Error(`Project path does not exist: ${project.path}`);
      }

      const gitPath = path.join(project.path, ".git");
      if (!existsSync(gitPath)) {
        throw new Error(
          `Project path is not a Git repository: ${project.path}`
        );
      }
    }
  }

  private formatZodError(error: z.ZodError): string {
    return error.errors
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");
  }

  private getSampleConfig(): string {
    const sampleConfig = {
      projects: [
        {
          name: "App iOS",
          path: "/Users/<user>/Dev/app-ios",
        },
        {
          name: "Backend API",
          path: "/Users/<user>/Dev/backend-api",
        },
        {
          name: "RN Client",
          path: "/Users/<user>/Dev/rn-client",
        },
      ],
      defaultSinceDays: 1,
    };

    return JSON.stringify(sampleConfig, null, 2);
  }

  public getProjectByName(
    name: string
  ): { name: string; path: string } | undefined {
    const config = this.getConfig();
    return config.projects.find((project) => project.name === name);
  }

  public getAllProjects(): { name: string; path: string }[] {
    const config = this.getConfig();
    return config.projects;
  }
}
