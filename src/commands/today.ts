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
      const configManager = ConfigManager.getInstance();
      let projectName = options.project;

      // If no project specified, try to get from selected projects or prompt
      if (!projectName) {
        const selectedProjects = ProjectsCommand.getSelectedProjects();

        if (selectedProjects.length === 1) {
          projectName = selectedProjects[0];
        } else if (selectedProjects.length > 1) {
          const { selectedProject } = await inquirer.prompt([
            {
              type: "list",
              name: "selectedProject",
              message: "Select a project for today's analysis:",
              choices: selectedProjects.map((name) => ({ name, value: name })),
            },
          ]);
          projectName = selectedProject;
        } else {
          const projects = configManager.getAllProjects();
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
          projectName = selectedProject;
        }
      }

      const project = configManager.getProjectByName(projectName!);
      if (!project) {
        throw new Error(`Project "${projectName}" not found in configuration`);
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
