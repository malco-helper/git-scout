import inquirer from "inquirer";
import { ConfigManager } from "../config";
import { TableRenderer } from "../ui/table";
import { GitService } from "../git/gitService";
import { ProjectsCommand } from "./projects";
import { DateParser } from "../utils/date";

export interface BranchesOptions {
  project?: string;
  remote?: boolean;
  since?: string;
  json?: boolean;
}

export class BranchesCommand {
  public static async execute(options: BranchesOptions = {}): Promise<void> {
    try {
      const configManager = ConfigManager.getInstance();
      let projectName = options.project;

      // If no project specified, try to get from selected projects or prompt
      if (!projectName) {
        const selectedProjects = ProjectsCommand.getSelectedProjects();

        if (selectedProjects.length === 1) {
          projectName = selectedProjects[0];
        } else {
          const projects = configManager.getAllProjects();
          const { selectedProject } = await inquirer.prompt([
            {
              type: "list",
              name: "selectedProject",
              message: "Select a project:",
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

      console.log(
        TableRenderer.renderInfo(`Analyzing project: ${project.name}`)
      );
      console.log(TableRenderer.renderLoading("Fetching branches..."));

      // Get branch information
      const branchesInfo = await GitService.getBranchInfo(project.path);
      const currentBranch = await GitService.getCurrentBranch(project.path);

      if (options.json) {
        console.log(
          TableRenderer.formatJSON({
            project: project.name,
            currentBranch,
            branches: branchesInfo,
          })
        );
        return;
      }

      console.log(TableRenderer.renderHeader(`🌿 Branches in ${project.name}`));
      console.log(TableRenderer.renderBranches(branchesInfo, currentBranch));

      // Interactive branch selection for details
      const { selectedBranch } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedBranch",
          message: "Select a branch to view details:",
          choices: [
            { name: "← Back to main menu", value: null },
            ...branchesInfo.map((branch) => ({
              name:
                branch.name === currentBranch
                  ? `* ${branch.name} (current)`
                  : branch.name,
              value: branch.name,
            })),
          ],
        },
      ]);

      if (selectedBranch) {
        await this.showBranchDetails(
          project.path,
          selectedBranch,
          options.since
        );
      }
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Failed to get branches: ${error}`)
      );
      process.exit(1);
    }
  }

  private static async showBranchDetails(
    projectPath: string,
    branchName: string,
    sinceOption?: string
  ): Promise<void> {
    try {
      console.log(
        TableRenderer.renderLoading(`Analyzing branch ${branchName}...`)
      );

      // Get branch info
      const branchInfo = await GitService.getBranchInfo(
        projectPath,
        branchName
      );
      if (branchInfo.length === 0) {
        throw new Error(`Branch "${branchName}" not found`);
      }

      const branch = branchInfo[0];

      // Determine since date
      const configManager = ConfigManager.getInstance();
      const config = configManager.getConfig();
      const since = sinceOption || `${config.defaultSinceDays}d`;

      // Get commits count for the specified period
      const commits = await GitService.getCommits({
        projectPath,
        branch: branchName,
        since,
      });

      // Display branch details
      console.log(TableRenderer.renderBranchDetail(branch, commits.length));

      if (commits.length > 0) {
        console.log(
          TableRenderer.renderInfo(
            `Found ${commits.length} commits since ${since}`
          )
        );

        // Show recent commits
        const recentCommits = commits.slice(0, 5);
        console.log(TableRenderer.renderHeader("Recent Commits"));

        for (const commit of recentCommits) {
          console.log(
            `  ${commit.shortHash} - ${
              commit.author
            } - ${DateParser.formatForDisplay(commit.date)}`
          );
          console.log(`    ${commit.message}`);
          console.log("");
        }
      } else {
        console.log(
          TableRenderer.renderWarning(`No commits found since ${since}`)
        );
      }

      // Ask if user wants to see more details
      const { showStats } = await inquirer.prompt([
        {
          type: "confirm",
          name: "showStats",
          message: "Would you like to see detailed statistics for this branch?",
          default: false,
        },
      ]);

      if (showStats) {
        const commitsWithStats = await GitService.getCommitsWithStats({
          projectPath,
          branch: branchName,
          since,
        });

        if (commitsWithStats.length > 0) {
          const stats = GitService.generateStats(commitsWithStats);
          console.log(TableRenderer.renderCompleteStats(stats, 10));
        }
      }
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Failed to get branch details: ${error}`)
      );
    }
  }
}
