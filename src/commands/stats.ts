import inquirer from "inquirer";
import { ConfigManager } from "../config";
import { TableRenderer } from "../ui/table";
import { GitService } from "../git/gitService";
import { ProjectsCommand } from "./projects";
import { DateParser } from "../utils/date";

export interface StatsOptions {
  project?: string;
  since?: string;
  until?: string;
  author?: string;
  branch?: string;
  limit?: number;
  json?: boolean;
}

export class StatsCommand {
  public static async execute(options: StatsOptions = {}): Promise<void> {
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
              message: "Select a project for statistics:",
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
              message: "Select a project for statistics:",
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

      // Set default since if not provided
      const config = configManager.getConfig();
      const since = options.since || `${config.defaultSinceDays}d`;

      console.log(
        TableRenderer.renderInfo(`Generating statistics for: ${project.name}`)
      );

      if (since) {
        const sinceDate = DateParser.parseDate(since);
        console.log(
          TableRenderer.renderInfo(
            `Time range: Since ${DateParser.formatForDisplay(sinceDate)}`
          )
        );
      }

      if (options.until) {
        const untilDate = DateParser.parseDate(options.until);
        console.log(
          TableRenderer.renderInfo(
            `Until: ${DateParser.formatForDisplay(untilDate)}`
          )
        );
      }

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
        TableRenderer.renderLoading("Analyzing repository history...")
      );

      // Get commits with detailed statistics
      const commits = await GitService.getCommitsWithStats({
        projectPath: project.path,
        since,
        until: options.until,
        author: options.author,
        branch: options.branch,
      });

      if (commits.length === 0) {
        console.log(
          TableRenderer.renderWarning(
            "No commits found for the specified criteria"
          )
        );

        // Suggest alternative approaches
        console.log(TableRenderer.renderInfo("Try:"));
        console.log("  • Expanding the time range (e.g., --since 30d)");
        console.log("  • Removing author or branch filters");
        console.log("  • Checking if the project has recent activity");
        return;
      }

      // Generate statistics
      const stats = GitService.generateStats(commits);

      if (options.json) {
        const result = {
          project: project.name,
          timeRange: { since, until: options.until },
          filters: {
            author: options.author,
            branch: options.branch,
          },
          summary: {
            totalCommits: stats.totalCommits,
            totalFiles: stats.totalFiles,
            totalLinesAdded: stats.totalLinesAdded,
            totalLinesDeleted: stats.totalLinesDeleted,
            uniqueAuthors: stats.authorStats.length,
            dateRange: {
              earliest: commits[commits.length - 1]?.date,
              latest: commits[0]?.date,
            },
          },
          authorStats: stats.authorStats,
          fileStats: stats.fileStats.slice(0, options.limit || 50),
        };
        console.log(TableRenderer.formatJSON(result));
        return;
      }

      // Display results
      const timeRangeText = since ? `Since ${since}` : "All time";
      console.log(
        TableRenderer.renderHeader(
          `📈 Statistics - ${project.name} (${timeRangeText})`
        )
      );

      // Show date range of actual commits
      if (commits.length > 0) {
        const earliest = commits[commits.length - 1].date;
        const latest = commits[0].date;
        console.log(
          TableRenderer.renderInfo(
            `Actual range: ${DateParser.formatForDisplay(
              earliest
            )} to ${DateParser.formatForDisplay(latest)}`
          )
        );
        console.log(
          TableRenderer.renderInfo(
            `Found ${commits.length} commits from ${stats.authorStats.length} author(s)`
          )
        );
      }

      // Render complete statistics
      console.log(
        TableRenderer.renderCompleteStats(stats, options.limit || 25)
      );

      // Show detailed insights
      this.showDetailedInsights(stats, commits);

      // Offer to show more details
      const { showMore } = await inquirer.prompt([
        {
          type: "confirm",
          name: "showMore",
          message: "Would you like to see additional analysis?",
          default: false,
        },
      ]);

      if (showMore) {
        await this.showAdditionalAnalysis(stats, commits, project.path);
      }
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Failed to generate statistics: ${error}`)
      );
      process.exit(1);
    }
  }

  private static showDetailedInsights(stats: any, commits: any[]): void {
    console.log(TableRenderer.renderHeader("📊 Detailed Insights"));

    // Author insights
    if (stats.authorStats.length > 1) {
      const topAuthor = stats.authorStats[0];
      const totalCommits = stats.totalCommits;
      const percentage = Math.round((topAuthor.commits / totalCommits) * 100);
      console.log(
        TableRenderer.renderInfo(
          `Most active contributor: ${topAuthor.author} (${percentage}% of commits)`
        )
      );

      const avgCommitsPerAuthor = Math.round(
        totalCommits / stats.authorStats.length
      );
      console.log(
        TableRenderer.renderInfo(
          `Average commits per author: ${avgCommitsPerAuthor}`
        )
      );
    }

    // File insights
    if (stats.fileStats.length > 0) {
      const topFile = stats.fileStats[0];
      const totalChanges = topFile.linesAdded + topFile.linesDeleted;
      console.log(
        TableRenderer.renderInfo(
          `Most modified file: ${topFile.file} (${totalChanges} lines changed)`
        )
      );

      const filesWithMultipleCommits = stats.fileStats.filter(
        (f: any) => f.commits > 1
      ).length;
      console.log(
        TableRenderer.renderInfo(
          `Files modified multiple times: ${filesWithMultipleCommits}/${stats.totalFiles}`
        )
      );
    }

    // Code change insights
    const netChanges = stats.totalLinesAdded - stats.totalLinesDeleted;
    const changeType = netChanges > 0 ? "growth" : "reduction";
    console.log(
      TableRenderer.renderInfo(
        `Net code ${changeType}: ${Math.abs(netChanges)} lines`
      )
    );

    if (stats.totalLinesAdded > 0) {
      const deletionRatio = Math.round(
        (stats.totalLinesDeleted / stats.totalLinesAdded) * 100
      );
      console.log(
        TableRenderer.renderInfo(
          `Deletion ratio: ${deletionRatio}% (${stats.totalLinesDeleted}/${stats.totalLinesAdded})`
        )
      );
    }

    // Commit frequency
    if (commits.length > 1) {
      const timeSpan =
        commits[0].date.getTime() - commits[commits.length - 1].date.getTime();
      const days = Math.max(1, Math.round(timeSpan / (1000 * 60 * 60 * 24)));
      const avgCommitsPerDay = Math.round((commits.length / days) * 10) / 10;
      console.log(
        TableRenderer.renderInfo(
          `Average commits per day: ${avgCommitsPerDay} over ${days} days`
        )
      );
    }
  }

  private static async showAdditionalAnalysis(
    stats: any,
    commits: any[],
    projectPath: string
  ): Promise<void> {
    const { analysisType } = await inquirer.prompt([
      {
        type: "list",
        name: "analysisType",
        message: "What additional analysis would you like to see?",
        choices: [
          {
            name: "Top 10 largest commits by lines changed",
            value: "largest_commits",
          },
          { name: "File type analysis", value: "file_types" },
          { name: "Recent activity timeline", value: "timeline" },
          {
            name: "Author collaboration (shared files)",
            value: "collaboration",
          },
          { name: "← Back to main menu", value: "back" },
        ],
      },
    ]);

    switch (analysisType) {
      case "largest_commits":
        this.showLargestCommits(commits);
        break;
      case "file_types":
        this.showFileTypeAnalysis(stats.fileStats);
        break;
      case "timeline":
        this.showActivityTimeline(commits);
        break;
      case "collaboration":
        this.showCollaborationAnalysis(stats.authorStats, stats.fileStats);
        break;
      case "back":
        return;
    }
  }

  private static showLargestCommits(commits: any[]): void {
    console.log(
      TableRenderer.renderHeader("🔍 Largest Commits by Lines Changed")
    );

    const commitsWithSize = commits
      .filter((c) => c.filesChanged && c.filesChanged.length > 0)
      .map((c) => ({
        ...c,
        totalChanges: c.filesChanged.reduce(
          (sum: number, f: any) => sum + f.added + f.deleted,
          0
        ),
      }))
      .sort((a, b) => b.totalChanges - a.totalChanges)
      .slice(0, 10);

    for (const commit of commitsWithSize) {
      console.log(
        `  ${commit.shortHash} - ${commit.author} - ${commit.totalChanges} lines`
      );
      console.log(
        `    ${DateParser.formatForDisplay(commit.date)}: ${commit.message}`
      );
      console.log("");
    }
  }

  private static showFileTypeAnalysis(fileStats: any[]): void {
    console.log(TableRenderer.renderHeader("📁 File Type Analysis"));

    const typeStats = new Map<string, { files: number; lines: number }>();

    for (const file of fileStats) {
      const ext = file.file.split(".").pop()?.toLowerCase() || "no-extension";
      const existing = typeStats.get(ext) || { files: 0, lines: 0 };
      existing.files++;
      existing.lines += file.linesAdded + file.linesDeleted;
      typeStats.set(ext, existing);
    }

    const sortedTypes = Array.from(typeStats.entries())
      .sort((a, b) => b[1].lines - a[1].lines)
      .slice(0, 10);

    for (const [ext, stats] of sortedTypes) {
      console.log(
        `  .${ext}: ${stats.files} files, ${stats.lines} lines changed`
      );
    }
  }

  private static showActivityTimeline(commits: any[]): void {
    console.log(
      TableRenderer.renderHeader("📅 Activity Timeline (Last 10 Days)")
    );

    const dayStats = new Map<string, number>();
    const now = new Date();

    // Initialize last 10 days
    for (let i = 9; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dayStats.set(key, 0);
    }

    // Count commits per day
    for (const commit of commits) {
      const key = commit.date.toISOString().split("T")[0];
      if (dayStats.has(key)) {
        dayStats.set(key, dayStats.get(key)! + 1);
      }
    }

    // Display timeline
    for (const [date, count] of dayStats.entries()) {
      const bars = "█".repeat(count);
      const formattedDate = new Date(date).toLocaleDateString();
      console.log(`  ${formattedDate}: ${bars} (${count} commits)`);
    }
  }

  private static showCollaborationAnalysis(
    authorStats: any[],
    fileStats: any[]
  ): void {
    console.log(TableRenderer.renderHeader("🤝 Collaboration Analysis"));

    // Find files modified by multiple authors (this is simplified)
    const multiAuthorFiles = fileStats.filter((f) => f.commits > 1).length;
    const totalFiles = fileStats.length;
    const collaborationRate = Math.round((multiAuthorFiles / totalFiles) * 100);

    console.log(
      `  Files with multiple commits: ${multiAuthorFiles}/${totalFiles} (${collaborationRate}%)`
    );
    console.log(`  Total contributors: ${authorStats.length}`);

    if (authorStats.length > 1) {
      const topCollaborators = authorStats.slice(0, 3);
      console.log(`  Top contributors:`);
      for (const author of topCollaborators) {
        console.log(
          `    • ${author.author}: ${author.commits} commits, ${author.filesChanged} files`
        );
      }
    }
  }
}
