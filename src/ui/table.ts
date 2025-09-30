import Table from "cli-table3";
import chalk from "chalk";
import {
  AuthorStat,
  FileStat,
  BranchInfo,
  Project,
  StatsResult,
} from "../types";
import { DateParser } from "../utils/date";

export class TableRenderer {
  /**
   * Render projects table
   */
  public static renderProjects(projects: Project[]): string {
    const table = new Table({
      head: [
        chalk.cyan.bold("NAME"),
        chalk.cyan.bold("PATH"),
        chalk.cyan.bold("STATUS"),
      ],
      colWidths: [25, 60, 15],
    });

    for (const project of projects) {
      const status = chalk.green("✓ Valid");
      table.push([chalk.white(project.name), chalk.gray(project.path), status]);
    }

    return table.toString();
  }

  /**
   * Render branches table
   */
  public static renderBranches(
    branches: BranchInfo[],
    currentBranch?: string
  ): string {
    const table = new Table({
      head: [
        chalk.cyan.bold("BRANCH"),
        chalk.cyan.bold("LAST COMMIT"),
        chalk.cyan.bold("AUTHOR"),
        chalk.cyan.bold("DATE"),
        chalk.cyan.bold("MESSAGE"),
      ],
      colWidths: [20, 12, 20, 20, 50],
    });

    for (const branch of branches) {
      const branchName =
        branch.name === currentBranch
          ? chalk.green.bold(`* ${branch.name}`)
          : chalk.white(branch.name);

      table.push([
        branchName,
        chalk.yellow(branch.lastCommitHash),
        chalk.blue(branch.lastCommitAuthor),
        chalk.gray(DateParser.formatForDisplay(branch.lastCommitDate)),
        chalk.white(this.truncateText(branch.lastCommitMessage, 45)),
      ]);
    }

    return table.toString();
  }

  /**
   * Render author statistics table
   */
  public static renderAuthorStats(authorStats: AuthorStat[]): string {
    const table = new Table({
      head: [
        chalk.cyan.bold("AUTHOR"),
        chalk.cyan.bold("COMMITS"),
        chalk.cyan.bold("FILES"),
        chalk.cyan.bold("+LINES"),
        chalk.cyan.bold("-LINES"),
      ],
      colWidths: [25, 10, 10, 10, 10],
    });

    for (const stat of authorStats) {
      table.push([
        chalk.white(stat.author),
        chalk.yellow(stat.commits.toString()),
        chalk.blue(stat.filesChanged.toString()),
        chalk.green(`+${stat.linesAdded}`),
        chalk.red(`-${stat.linesDeleted}`),
      ]);
    }

    return table.toString();
  }

  /**
   * Render file statistics table
   */
  public static renderFileStats(fileStats: FileStat[], limit?: number): string {
    const statsToShow = limit ? fileStats.slice(0, limit) : fileStats;

    const table = new Table({
      head: [
        chalk.cyan.bold("FILE"),
        chalk.cyan.bold("COMMITS"),
        chalk.cyan.bold("+LINES"),
        chalk.cyan.bold("-LINES"),
      ],
      colWidths: [50, 10, 10, 10],
    });

    for (const stat of statsToShow) {
      table.push([
        chalk.white(this.truncateText(stat.file, 45)),
        chalk.yellow(stat.commits.toString()),
        chalk.green(`+${stat.linesAdded}`),
        chalk.red(`-${stat.linesDeleted}`),
      ]);
    }

    return table.toString();
  }

  /**
   * Render complete statistics with totals
   */
  public static renderCompleteStats(
    stats: StatsResult,
    fileLimit?: number
  ): string {
    let output = "";

    // Author statistics
    output += chalk.bold.underline("\n📊 BY AUTHOR\n");
    output += this.renderAuthorStats(stats.authorStats);

    // File statistics
    if (stats.fileStats.length > 0) {
      output += chalk.bold.underline("\n📁 BY FILE (Top Changes)\n");
      output += this.renderFileStats(stats.fileStats, fileLimit);
    }

    // Total summary
    output += this.renderTotalSummary(stats);

    return output;
  }

  /**
   * Render total summary
   */
  public static renderTotalSummary(stats: StatsResult): string {
    const table = new Table({
      head: [
        chalk.cyan.bold("TOTAL"),
        chalk.cyan.bold("COMMITS"),
        chalk.cyan.bold("FILES"),
        chalk.cyan.bold("+LINES"),
        chalk.cyan.bold("-LINES"),
      ],
    });

    table.push([
      chalk.bold("SUMMARY"),
      chalk.yellow.bold(stats.totalCommits.toString()),
      chalk.blue.bold(stats.totalFiles.toString()),
      chalk.green.bold(`+${stats.totalLinesAdded}`),
      chalk.red.bold(`-${stats.totalLinesDeleted}`),
    ]);

    return "\n" + table.toString();
  }

  /**
   * Render branch detail view
   */
  public static renderBranchDetail(
    branch: BranchInfo,
    commitCount?: number
  ): string {
    let output = "";

    output += chalk.bold.underline(`\n🌿 Branch: ${branch.name}\n`);
    output +=
      chalk.gray("Latest commit: ") +
      chalk.yellow(branch.lastCommitHash) +
      "\n";
    output +=
      chalk.gray("Author: ") + chalk.blue(branch.lastCommitAuthor) + "\n";
    output +=
      chalk.gray("Date: ") +
      chalk.white(DateParser.formatForDisplay(branch.lastCommitDate)) +
      "\n";
    output +=
      chalk.gray("Message: ") + chalk.white(branch.lastCommitMessage) + "\n";

    if (commitCount !== undefined) {
      output +=
        chalk.gray("Recent commits: ") +
        chalk.green(commitCount.toString()) +
        "\n";
    }

    return output;
  }

  /**
   * Render error message
   */
  public static renderError(message: string): string {
    return chalk.red.bold("❌ Error: ") + chalk.red(message);
  }

  /**
   * Render success message
   */
  public static renderSuccess(message: string): string {
    return chalk.green.bold("✅ ") + chalk.green(message);
  }

  /**
   * Render info message
   */
  public static renderInfo(message: string): string {
    return chalk.blue.bold("ℹ️  ") + chalk.blue(message);
  }

  /**
   * Render warning message
   */
  public static renderWarning(message: string): string {
    return chalk.yellow.bold("⚠️  ") + chalk.yellow(message);
  }

  /**
   * Render section header
   */
  public static renderHeader(title: string): string {
    return chalk.bold.underline(`\n${title}\n`);
  }

  /**
   * Truncate text to specified length
   */
  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  /**
   * Format JSON output
   */
  public static formatJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Render loading spinner message
   */
  public static renderLoading(message: string): string {
    return chalk.gray("🔄 ") + chalk.gray(message);
  }
}
