import inquirer from "inquirer";
import { ConfigManager } from "../config";
import { TableRenderer } from "../ui/table";
import { GitService } from "../git/gitService";
import { ProjectsCommand } from "./projects";
import { DateParser } from "../utils/date";

export interface TodayOptions {
  project?: string;
  since?: string;
  until?: string;
  author?: string;
  branch?: string;
  limit?: number;
  json?: boolean;
}

export class TodayCommand {
  public static async execute(options: TodayOptions = {}): Promise<void> {
    try {
      // Check if we're in a non-interactive environment (CI/GitHub Actions)
      const isNonInteractive = !process.stdin.isTTY;

      let project: { name: string; path: string };
      let configManager: ConfigManager | null = null;

      // Try to load config, but don't fail if it doesn't exist
      try {
        configManager = ConfigManager.getInstance();
      } catch (error) {
        // Config doesn't exist, we'll handle this below
      }

      // If no project specified, try multiple strategies
      if (!options.project) {
        // Strategy 1: If config exists, use it
        if (configManager) {
          try {
            const selectedProjects = ProjectsCommand.getSelectedProjects();

            if (selectedProjects.length === 1) {
              const projectName = selectedProjects[0];
              project = configManager.getProjectByName(projectName)!;
            } else if (selectedProjects.length > 1 && !isNonInteractive) {
              const { selectedProject } = await inquirer.prompt([
                {
                  type: "list",
                  name: "selectedProject",
                  message: "Select a project for today's analysis:",
                  choices: selectedProjects.map((name) => ({
                    name,
                    value: name,
                  })),
                },
              ]);
              project = configManager.getProjectByName(selectedProject)!;
            } else {
              const projects = configManager.getAllProjects();
              if (!isNonInteractive) {
                const { selectedProject } = await inquirer.prompt([
                  {
                    type: "list",
                    name: "selectedProject",
                    message: "Select a project for today's analysis:",
                    choices: projects.map((p) => ({
                      name: `${p.name} (${p.path})`,
                      value: p.name,
                    })),
                  },
                ]);
                project = configManager.getProjectByName(selectedProject)!;
              } else {
                // In non-interactive mode with multiple projects, use first one
                project = projects[0];
              }
            }
          } catch (error) {
            // Fall through to strategy 2
            project = await this.detectCurrentRepository(options.json);
          }
        } else {
          // Strategy 2: No config exists, try to use current directory as git repo
          project = await this.detectCurrentRepository(options.json);
        }
      } else {
        // Project name was specified via --project flag
        if (!configManager) {
          throw new Error(
            `Project "${options.project}" specified but no configuration found. Run "git-scout init" first.`
          );
        }
        const foundProject = configManager.getProjectByName(options.project);
        if (!foundProject) {
          throw new Error(
            `Project "${options.project}" not found in configuration`
          );
        }
        project = foundProject;
      }

      // Determine time range - default to today
      let since = options.since || "today";
      let until = options.until;

      // If no specific since provided, use today's start
      if (since === "today" && !options.since) {
        const today = DateParser.getToday();
        since = DateParser.formatForGit(today);

        if (!until) {
          until = DateParser.formatForGit(DateParser.getEndOfToday());
        }
      }

      // Only show info messages if not in JSON mode
      if (!options.json) {
        console.log(
          TableRenderer.renderInfo(
            `Analyzing today's activity in: ${project.name}`
          )
        );

        if (options.author) {
          console.log(
            TableRenderer.renderInfo(`Filtering by author: ${options.author}`)
          );
        }

        if (options.branch) {
          console.log(
            TableRenderer.renderInfo(`Filtering by branch: ${options.branch}`)
          );
        }

        console.log(
          TableRenderer.renderLoading("Fetching commits and statistics...")
        );
      }

      // Get commits with detailed statistics
      const commits = await GitService.getCommitsWithStats({
        projectPath: project.path,
        since,
        until,
        author: options.author,
        branch: options.branch,
      });

      if (commits.length === 0) {
        console.log(
          TableRenderer.renderWarning(
            "No commits found for the specified criteria"
          )
        );
        return;
      }

      // Generate statistics
      const stats = GitService.generateStats(commits);

      if (options.json) {
        const result = {
          project: project.name,
          timeRange: { since, until },
          filters: {
            author: options.author,
            branch: options.branch,
          },
          stats: {
            totalCommits: stats.totalCommits,
            totalFiles: stats.totalFiles,
            totalLinesAdded: stats.totalLinesAdded,
            totalLinesDeleted: stats.totalLinesDeleted,
            authors: stats.authorStats,
            files: stats.fileStats.slice(0, options.limit || 20),
          },
        };
        console.log(TableRenderer.formatJSON(result));
        return;
      }

      // Display results
      const timeRangeText = since === "today" ? "Today" : `Since ${since}`;
      console.log(
        TableRenderer.renderHeader(
          `📊 ${timeRangeText}'s Activity - ${project.name}`
        )
      );

      // Show timezone info
      console.log(
        TableRenderer.renderInfo(`Timezone: ${DateParser.getTimezone()}`)
      );

      if (commits.length > 0) {
        const latestCommit = commits[0];
        console.log(
          TableRenderer.renderInfo(
            `Latest activity: ${DateParser.formatForDisplay(latestCommit.date)}`
          )
        );
      }

      // Render complete statistics
      console.log(
        TableRenderer.renderCompleteStats(stats, options.limit || 20)
      );

      // Show some interesting insights
      this.showInsights(stats);
    } catch (error) {
      console.error(
        TableRenderer.renderError(
          `Failed to analyze today's activity: ${error}`
        )
      );
      process.exit(1);
    }
  }

  private static async detectCurrentRepository(
    jsonMode: boolean = false
  ): Promise<{
    name: string;
    path: string;
  }> {
    const currentDir = process.cwd();

    // Check if current directory is a git repository
    if (await GitService.isGitRepository(currentDir)) {
      const { basename } = await import("path");
      const name = basename(currentDir);

      // Only show info message in non-interactive mode if NOT in JSON mode
      if (!process.stdin.isTTY && !jsonMode) {
        console.log(
          TableRenderer.renderInfo(
            `No configuration found. Using current repository: ${name}`
          )
        );
      }

      return {
        name,
        path: currentDir,
      };
    }

    throw new Error(
      `No git-scout configuration found and current directory is not a git repository.\n` +
        `Please run "git-scout init" to set up configuration, or run this command from within a git repository.`
    );
  }

  private static showInsights(stats: any): void {
    console.log(TableRenderer.renderHeader("💡 Insights"));

    if (stats.authorStats.length > 1) {
      const topAuthor = stats.authorStats[0];
      const totalCommits = stats.totalCommits;
      const percentage = Math.round((topAuthor.commits / totalCommits) * 100);
      console.log(
        TableRenderer.renderInfo(
          `Most active: ${topAuthor.author} (${percentage}% of commits)`
        )
      );
    }

    if (stats.fileStats.length > 0) {
      const topFile = stats.fileStats[0];
      const totalChanges = topFile.linesAdded + topFile.linesDeleted;
      console.log(
        TableRenderer.renderInfo(
          `Most changed file: ${topFile.file} (${totalChanges} lines)`
        )
      );
    }

    const netChanges = stats.totalLinesAdded - stats.totalLinesDeleted;
    const changeType = netChanges > 0 ? "additions" : "deletions";
    const changeColor = netChanges > 0 ? "green" : "red";
    console.log(
      TableRenderer.renderInfo(
        `Net changes: ${Math.abs(netChanges)} lines ${changeType}`
      )
    );
  }
}
