import inquirer from "inquirer";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { homedir } from "os";
import { execSync } from "child_process";
import { ConfigManager } from "../config";
import { TableRenderer } from "../ui/table";
import { GitService } from "../git/gitService";

export interface InitOptions {
  scanPath?: string;
  global?: boolean;
}

interface FoundRepository {
  name: string;
  path: string;
  description?: string;
  lastActivity?: Date;
}

export class InitCommand {
  public static async execute(options: InitOptions = {}): Promise<void> {
    try {
      console.log(
        TableRenderer.renderHeader("🚀 Git Scout Initialization Wizard")
      );

      // Check if config already exists
      const configExists = await this.checkExistingConfig();
      if (configExists) {
        const { overwrite } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwrite",
            message:
              "Configuration already exists. Do you want to overwrite it?",
            default: false,
          },
        ]);

        if (!overwrite) {
          console.log(TableRenderer.renderInfo("Initialization cancelled."));
          return;
        }
      }

      // Step 1: Choose scan method
      const { scanMethod } = await inquirer.prompt([
        {
          type: "list",
          name: "scanMethod",
          message: "How would you like to find your Git repositories?",
          choices: [
            {
              name: "🔍 Safe auto-scan (recommended for macOS)",
              value: "auto",
            },
            {
              name: "📁 Scan a specific directory",
              value: "custom",
            },
            {
              name: "✋ Manual setup (create empty config)",
              value: "manual",
            },
          ],
        },
      ]);

      let repositories: FoundRepository[] = [];

      if (scanMethod === "auto") {
        repositories = await this.autoScanRepositories();
      } else if (scanMethod === "custom") {
        const { customPath } = await inquirer.prompt([
          {
            type: "input",
            name: "customPath",
            message: "Enter the directory path to scan:",
            default: process.cwd(),
            validate: (input) => {
              if (!existsSync(input)) {
                return "Directory does not exist";
              }
              return true;
            },
          },
        ]);
        repositories = await this.scanDirectory(customPath);
      }

      // Step 2: Select repositories (if found any)
      if (repositories.length > 0) {
        console.log(
          TableRenderer.renderSuccess(
            `Found ${repositories.length} Git repositories:`
          )
        );

        // Show found repositories
        this.displayFoundRepositories(repositories);

        const { selectedRepos } = await inquirer.prompt([
          {
            type: "checkbox",
            name: "selectedRepos",
            message: "Select repositories to track:",
            choices: repositories.map((repo) => ({
              name: `${repo.name} (${repo.path})`,
              value: repo,
              checked: true, // Pre-select all by default
            })),
            validate: (input) => {
              if (input.length === 0) {
                return "Please select at least one repository";
              }
              return true;
            },
          },
        ]);

        repositories = selectedRepos;
      } else if (scanMethod !== "manual") {
        console.log(TableRenderer.renderWarning("No Git repositories found."));
        const { createManual } = await inquirer.prompt([
          {
            type: "confirm",
            name: "createManual",
            message:
              "Would you like to create an empty config for manual setup?",
            default: true,
          },
        ]);

        if (!createManual) {
          console.log(TableRenderer.renderInfo("Initialization cancelled."));
          return;
        }
      }

      // Step 3: Configure settings
      const { defaultSinceDays, configLocation } = await inquirer.prompt([
        {
          type: "number",
          name: "defaultSinceDays",
          message: "Default number of days to look back for statistics:",
          default: 1,
          validate: (input) => {
            if (input < 1) {
              return "Must be at least 1 day";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "configLocation",
          message: "Where would you like to save the configuration?",
          choices: [
            {
              name: `🌍 Global (~/.git-scout/config.json)`,
              value: "global",
            },
            {
              name: `📁 Local (./git-scout.config.json)`,
              value: "local",
            },
          ],
          default: "global",
        },
      ]);

      // Step 4: Create configuration
      const config = {
        projects: repositories.map((repo) => ({
          name: repo.name,
          path: repo.path,
          ...(repo.description && { description: repo.description }),
        })),
        defaultSinceDays,
        createdAt: new Date().toISOString(),
        version: "1.0.0",
      };

      await this.saveConfig(config, configLocation === "global");

      // Step 5: Success message and next steps
      console.log(
        TableRenderer.renderSuccess("🎉 Configuration created successfully!")
      );

      if (repositories.length > 0) {
        console.log(
          TableRenderer.renderInfo(
            `Configured ${repositories.length} repositories for tracking.`
          )
        );
      }

      console.log(TableRenderer.renderHeader("🚀 Next Steps:"));
      console.log(
        "  1. Run 'git-scout projects' to view your configured projects"
      );
      console.log("  2. Try 'git-scout today' to see today's activity");
      console.log("  3. Use 'git-scout stats --since 7d' for weekly insights");

      if (repositories.length === 0) {
        console.log(
          TableRenderer.renderInfo(
            "\n💡 You can add repositories manually by editing the config file:"
          )
        );
        const configPath = this.getConfigPath(configLocation === "global");
        console.log(`   ${configPath}`);
      }
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Initialization failed: ${error}`)
      );
      process.exit(1);
    }
  }

  private static async checkExistingConfig(): Promise<boolean> {
    try {
      ConfigManager.getInstance().getConfig();
      return true;
    } catch {
      return false;
    }
  }

  private static async autoScanRepositories(): Promise<FoundRepository[]> {
    console.log(
      TableRenderer.renderLoading("Scanning for Git repositories...")
    );

    // Safe directories that won't trigger macOS permission requests
    const safePaths = [
      join(homedir(), "Projects"),
      join(homedir(), "Development"),
      join(homedir(), "Dev"),
      join(homedir(), "Code"),
      join(homedir(), "Workspace"),
      join(homedir(), "src"),
      join(homedir(), "git"),
      join(homedir(), "GitHub"),
      join(homedir(), "gitlab"),
      join(homedir(), "repos"),
      join(homedir(), "work"),
      process.cwd(),
    ];

    // Only scan Documents subdirectories that are likely to contain code
    const documentsCodeDirs = [
      join(homedir(), "Documents", "Projects"),
      join(homedir(), "Documents", "Development"),
      join(homedir(), "Documents", "Dev"),
      join(homedir(), "Documents", "Code"),
      join(homedir(), "Documents", "GitHub"),
      join(homedir(), "Documents", "Workspace"),
      join(homedir(), "Documents", "git"),
    ];

    const allPaths = [...safePaths, ...documentsCodeDirs];
    const repositories: FoundRepository[] = [];
    const maxDepth = 3; // Limit scan depth to avoid performance issues

    for (const basePath of allPaths) {
      if (existsSync(basePath)) {
        try {
          const found = await this.scanDirectory(basePath, maxDepth);
          repositories.push(...found);
        } catch (error) {
          // Skip directories that cause permission issues
          console.log(
            TableRenderer.renderWarning(
              `Skipping ${basePath}: Permission denied`
            )
          );
        }
      }
    }

    // Remove duplicates based on path
    const uniqueRepos = repositories.filter(
      (repo, index, self) =>
        index === self.findIndex((r) => r.path === repo.path)
    );

    return uniqueRepos;
  }

  private static async scanDirectory(
    dirPath: string,
    maxDepth: number = 2,
    currentDepth: number = 0
  ): Promise<FoundRepository[]> {
    const repositories: FoundRepository[] = [];

    if (currentDepth >= maxDepth) {
      return repositories;
    }

    try {
      // Check if current directory is a git repository
      if (await GitService.isGitRepository(dirPath)) {
        const repo = await this.analyzeRepository(dirPath);
        if (repo) {
          repositories.push(repo);
        }
        return repositories; // Don't scan subdirectories of git repos
      }

      // Scan subdirectories
      const { readdirSync, statSync } = await import("fs");
      const entries = readdirSync(dirPath);

      for (const entry of entries) {
        // Skip hidden directories, common non-project directories, and macOS sensitive directories
        if (
          entry.startsWith(".") ||
          [
            "node_modules",
            "vendor",
            "build",
            "dist",
            "target",
            "Applications",
            "Library",
            "System",
            "Users",
            "Desktop",
            "Downloads",
            "Movies",
            "Music",
            "Pictures",
            "Public",
            "Creative Cloud Files",
            "Adobe",
            "Dropbox",
            "Google Drive",
            "OneDrive",
            "iCloud Drive",
            "Box Sync",
          ].includes(entry)
        ) {
          continue;
        }

        const fullPath = join(dirPath, entry);

        try {
          if (statSync(fullPath).isDirectory()) {
            const subRepos = await this.scanDirectory(
              fullPath,
              maxDepth,
              currentDepth + 1
            );
            repositories.push(...subRepos);
          }
        } catch {
          // Skip directories we can't access
          continue;
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return repositories;
  }

  private static async analyzeRepository(
    repoPath: string
  ): Promise<FoundRepository | null> {
    try {
      const name = basename(repoPath);

      // Get last activity date
      let lastActivity: Date | undefined;
      try {
        const commits = await GitService.getCommits({
          projectPath: repoPath,
          since: "30d", // Look back 30 days for recent activity
        });
        if (commits.length > 0) {
          lastActivity = commits[0].date;
        }
      } catch {
        // If we can't get commits, still include the repo
      }

      // Try to get repository description from README or package.json
      let description: string | undefined;
      try {
        const { readFileSync } = await import("fs");

        // Try package.json first
        const packageJsonPath = join(repoPath, "package.json");
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(
            readFileSync(packageJsonPath, "utf-8")
          );
          description = packageJson.description;
        }

        // If no description from package.json, try README
        if (!description) {
          const readmePaths = [
            join(repoPath, "README.md"),
            join(repoPath, "readme.md"),
            join(repoPath, "README.txt"),
          ];

          for (const readmePath of readmePaths) {
            if (existsSync(readmePath)) {
              const readme = readFileSync(readmePath, "utf-8");
              const firstLine = readme.split("\n")[0];
              if (firstLine && firstLine.length < 100) {
                description = firstLine.replace(/^#\s*/, ""); // Remove markdown header
                break;
              }
            }
          }
        }
      } catch {
        // Ignore errors when reading description
      }

      return {
        name,
        path: repoPath,
        description,
        lastActivity,
      };
    } catch (error) {
      return null;
    }
  }

  private static displayFoundRepositories(
    repositories: FoundRepository[]
  ): void {
    console.log("");
    for (const repo of repositories) {
      console.log(`📁 ${repo.name}`);
      console.log(`   Path: ${repo.path}`);
      if (repo.description) {
        console.log(`   Description: ${repo.description}`);
      }
      if (repo.lastActivity) {
        console.log(
          `   Last activity: ${repo.lastActivity.toLocaleDateString()}`
        );
      }
      console.log("");
    }
  }

  private static getConfigPath(isGlobal: boolean): string {
    if (isGlobal) {
      const globalConfigDir = join(homedir(), ".git-scout");
      return join(globalConfigDir, "config.json");
    } else {
      return join(process.cwd(), "git-scout.config.json");
    }
  }

  private static async saveConfig(
    config: any,
    isGlobal: boolean
  ): Promise<void> {
    const configPath = this.getConfigPath(isGlobal);

    if (isGlobal) {
      const configDir = join(homedir(), ".git-scout");
      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
      }
    }

    writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

    console.log(
      TableRenderer.renderSuccess(`Configuration saved to: ${configPath}`)
    );
  }
}
