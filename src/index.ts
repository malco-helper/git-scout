#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { ProjectsCommand } from "./commands/projects";
import { BranchesCommand } from "./commands/branches";
import { TodayCommand } from "./commands/today";
import { StatsCommand } from "./commands/stats";
import { TableRenderer } from "./ui/table";

const program = new Command();

// CLI Metadata
program
  .name("git-scout")
  .description(
    "A CLI tool for managing and analyzing multiple Git repositories with advanced statistics"
  )
  .version("1.0.0");

// Global error handler
process.on("unhandledRejection", (error) => {
  console.error(TableRenderer.renderError(`Unhandled error: ${error}`));
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error(
    TableRenderer.renderError(`Uncaught exception: ${error.message}`)
  );
  process.exit(1);
});

// Projects command
program
  .command("projects")
  .description("List and select projects from configuration")
  .option("--json", "Output results in JSON format")
  .action(async (options) => {
    try {
      await ProjectsCommand.execute(options);
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Projects command failed: ${error}`)
      );
      process.exit(1);
    }
  });

// Branches command
program
  .command("branches")
  .description("List branches and view branch details")
  .option("-p, --project <name>", "Project name to analyze")
  .option("-r, --remote", "Include remote branches")
  .option(
    "-s, --since <date>",
    "Show commits since date (e.g., 7d, today, 2025-09-01)"
  )
  .option("--json", "Output results in JSON format")
  .action(async (options) => {
    try {
      await BranchesCommand.execute(options);
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Branches command failed: ${error}`)
      );
      process.exit(1);
    }
  });

// Today command
program
  .command("today")
  .description("Show today's activity statistics")
  .option("-p, --project <name>", "Project name to analyze")
  .option("-s, --since <date>", "Start date (default: today)")
  .option("-u, --until <date>", "End date (default: end of today)")
  .option("-a, --author <email|name>", "Filter by author")
  .option("-b, --branch <name>", "Filter by branch")
  .option("-l, --limit <number>", "Limit number of files shown", parseInt)
  .option("--json", "Output results in JSON format")
  .action(async (options) => {
    try {
      await TodayCommand.execute(options);
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Today command failed: ${error}`)
      );
      process.exit(1);
    }
  });

// Stats command
program
  .command("stats")
  .description("Generate comprehensive statistics for a project")
  .option("-p, --project <name>", "Project name to analyze")
  .option("-s, --since <date>", "Start date (e.g., 7d, today, 2025-09-01)")
  .option("-u, --until <date>", "End date (default: now)")
  .option("-a, --author <email|name>", "Filter by author")
  .option("-b, --branch <name>", "Filter by branch")
  .option("-l, --limit <number>", "Limit number of files shown", parseInt)
  .option("--json", "Output results in JSON format")
  .action(async (options) => {
    try {
      await StatsCommand.execute(options);
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Stats command failed: ${error}`)
      );
      process.exit(1);
    }
  });

// Help command enhancement
program.on("--help", () => {
  console.log("");
  console.log(chalk.bold.underline("Examples:"));
  console.log(
    "  $ git-scout projects                              # List and select projects"
  );
  console.log(
    '  $ git-scout branches --project "Backend API"     # Show branches for specific project'
  );
  console.log(
    '  $ git-scout today --project "RN Client"          # Today\'s activity'
  );
  console.log(
    "  $ git-scout stats --since 7d --author alice      # Weekly stats for alice"
  );
  console.log(
    '  $ git-scout stats --since "2025-09-01" --json    # JSON output since specific date'
  );
  console.log("");
  console.log(chalk.bold.underline("Date Formats:"));
  console.log('  today, yesterday, 7d, 30d, 2025-09-29, "today 09:00"');
  console.log("");
  console.log(chalk.bold.underline("Configuration:"));
  console.log("  ~/.git-scout/config.json or ./git-scout.config.json");
  console.log("");
  console.log(
    chalk.gray(
      "For more information, visit: https://github.com/your-repo/git-scout"
    )
  );
});

// Default action when no command is provided
program.action(() => {
  console.log(
    chalk.bold.cyan("🔍 Git Scout - Multi-Repository Analysis Tool\n")
  );

  console.log(chalk.bold("Available Commands:"));
  console.log("  projects  - List and select projects");
  console.log("  branches  - Explore branches and commits");
  console.log("  today     - Today's activity summary");
  console.log("  stats     - Comprehensive statistics");
  console.log("");

  console.log(chalk.bold("Quick Start:"));
  console.log('  1. Run "git-scout projects" to configure your repositories');
  console.log('  2. Use "git-scout today" to see today\'s activity');
  console.log('  3. Try "git-scout stats --since 7d" for weekly insights');
  console.log("");

  console.log(
    chalk.gray('Use "git-scout --help" for detailed usage information')
  );
});

// Handle unknown commands
program.on("command:*", (operands) => {
  console.error(TableRenderer.renderError(`Unknown command: ${operands[0]}`));
  console.log("");
  console.log("Available commands:");
  console.log("  projects, branches, today, stats");
  console.log("");
  console.log('Run "git-scout --help" for more information');
  process.exit(1);
});

// Parse command line arguments
program.parse();

// If no arguments provided, show default help
if (process.argv.length === 2) {
  program.help();
}
