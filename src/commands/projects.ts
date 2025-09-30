import inquirer from "inquirer";
import { ConfigManager } from "../config";
import { TableRenderer } from "../ui/table";
import { GitService } from "../git/gitService";

export interface ProjectsOptions {
  json?: boolean;
}

export class ProjectsCommand {
  public static async execute(options: ProjectsOptions = {}): Promise<void> {
    try {
      const configManager = ConfigManager.getInstance();
      const projects = configManager.getAllProjects();

      if (options.json) {
        console.log(TableRenderer.formatJSON(projects));
        return;
      }

      console.log(TableRenderer.renderHeader("📁 Configured Projects"));

      // Validate all projects
      const validatedProjects = [];
      for (const project of projects) {
        try {
          const isValid = await GitService.isGitRepository(project.path);
          if (isValid) {
            validatedProjects.push(project);
          } else {
            console.log(
              TableRenderer.renderWarning(
                `Project "${project.name}" is not a valid Git repository`
              )
            );
          }
        } catch (error) {
          console.log(
            TableRenderer.renderError(
              `Cannot access project "${project.name}": ${error}`
            )
          );
        }
      }

      if (validatedProjects.length === 0) {
        console.log(
          TableRenderer.renderError(
            "No valid Git projects found in configuration"
          )
        );
        return;
      }

      console.log(TableRenderer.renderProjects(validatedProjects));

      // Interactive project selection
      const { selectedProjects } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedProjects",
          message: "Select projects to work with:",
          choices: validatedProjects.map((project) => ({
            name: `${project.name} (${project.path})`,
            value: project.name,
            checked: false,
          })),
          validate: (input) => {
            if (input.length === 0) {
              return "Please select at least one project";
            }
            return true;
          },
        },
      ]);

      if (selectedProjects.length > 0) {
        console.log(
          TableRenderer.renderSuccess(
            `Selected ${selectedProjects.length} project(s):`
          )
        );
        selectedProjects.forEach((projectName: string) => {
          console.log(`  • ${projectName}`);
        });

        // Store selected projects in a temporary way (could be enhanced with a state manager)
        process.env.GIT_SCOUT_SELECTED_PROJECTS =
          JSON.stringify(selectedProjects);
      }
    } catch (error) {
      console.error(
        TableRenderer.renderError(`Failed to load projects: ${error}`)
      );
      process.exit(1);
    }
  }

  public static getSelectedProjects(): string[] {
    const selected = process.env.GIT_SCOUT_SELECTED_PROJECTS;
    return selected ? JSON.parse(selected) : [];
  }
}
