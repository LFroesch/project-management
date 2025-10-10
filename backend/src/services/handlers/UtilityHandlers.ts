import { BaseCommandHandler } from './BaseCommandHandler';
import { CommandResponse, ResponseType } from '../commandExecutor';
import { ParsedCommand, CommandParser, COMMAND_METADATA } from '../commandParser';
import { User } from '../../models/User';
import { Project } from '../../models/Project';
import { logError } from '../../config/logger';

/**
 * Handlers for utility commands (help, themes, swap, export, news, wizards)
 */
export class UtilityHandlers extends BaseCommandHandler {
  /**
   * Handle /help command
   */
  handleHelp(parsed: ParsedCommand): CommandResponse {
    if (parsed.args.length > 0) {
      const commandName = parsed.args.join(' ').toLowerCase();
      const metadata = Object.values(COMMAND_METADATA).find(
        cmd => cmd.syntax.toLowerCase().includes(commandName)
      );

      if (metadata) {
        return {
          type: ResponseType.INFO,
          message: `📖 Help for ${commandName}`,
          data: {
            syntax: metadata.syntax,
            description: metadata.description,
            examples: metadata.examples
          }
        };
      }

      return {
        type: ResponseType.ERROR,
        message: `Command "${commandName}" not found`,
        suggestions: ['/help']
      };
    }

    // General help
    const commands = CommandParser.getAllCommands();
    const grouped: Record<string, any[]> = {
      'Add Items': [],
      'Remove Items': [],
      'View Items': [],
      'Project Management': [],
      'Other': []
    };

    commands.forEach(cmd => {
      const cmdType = cmd.type.toString();

      if (cmdType.startsWith('add_')) {
        grouped['Add Items'].push(cmd);
      } else if (cmdType.startsWith('remove_') && cmdType !== 'remove_member') {
        grouped['Remove Items'].push(cmd);
      } else if (cmdType.startsWith('view_')) {
        grouped['View Items'].push(cmd);
      } else if ([
        'swap_project',
        'export',
        'set_name',
        'set_description',
        'set_deployment',
        'set_public',
        'invite_member',
        'remove_member'
      ].includes(cmdType)) {
        grouped['Project Management'].push(cmd);
      } else {
        grouped['Other'].push(cmd);
      }
    });

    return {
      type: ResponseType.INFO,
      message: '📚 Available Commands',
      data: { grouped }
    };
  }

  /**
   * Handle /swap command
   */
  async handleSwapProject(parsed: ParsedCommand): Promise<CommandResponse> {
    if (!parsed.projectMention) {
      const projects = await this.getUserProjects();
      return {
        type: ResponseType.PROMPT,
        message: 'Select a project to switch to:',
        data: {
          projects: projects.map(p => ({
            id: p._id.toString(),
            name: p.name,
            description: p.description,
            category: p.category
          }))
        }
      };
    }

    const project = await Project.findOne({
      $or: [
        { userId: this.userId },
        { ownerId: this.userId }
      ],
      name: new RegExp(`^${parsed.projectMention}$`, 'i')
    });

    if (!project) {
      const allProjects = await this.getUserProjects();
      const suggestions = allProjects
        .filter(p => p.name.toLowerCase().includes(parsed.projectMention!.toLowerCase()))
        .map(p => `/swap @${p.name}`);

      return {
        type: ResponseType.ERROR,
        message: `Project "@${parsed.projectMention}" not found`,
        suggestions: suggestions.length > 0 ? suggestions : ['/swap']
      };
    }

    return {
      type: ResponseType.SUCCESS,
      message: `🔄 Switched to ${project.name}`,
      data: {
        project: {
          id: project._id.toString(),
          name: project.name,
          description: project.description,
          color: project.color
        }
      },
      metadata: {
        projectId: project._id.toString(),
        projectName: project.name,
        action: 'swap_project'
      }
    };
  }

  /**
   * Handle /export command
   */
  async handleExport(parsed: ParsedCommand, currentProjectId?: string): Promise<CommandResponse> {
    const resolution = await this.resolveProject(parsed.projectMention, currentProjectId);
    if (!resolution.project) {
      return this.buildProjectErrorResponse(resolution);
    }

    return {
      type: ResponseType.SUCCESS,
      message: `📦 Preparing export for ${resolution.project.name}`,
      data: {
        exportUrl: `/api/projects/${resolution.project._id}/export`,
        projectName: resolution.project.name
      },
      metadata: {
        projectId: resolution.project._id.toString(),
        projectName: resolution.project.name,
        action: 'export'
      }
    };
  }

  /**
   * Handle /summary command - Generate downloadable project summary
   */
  async handleSummary(parsed: ParsedCommand, currentProjectId?: string): Promise<CommandResponse> {
    const resolution = await this.resolveProject(parsed.projectMention, currentProjectId);
    if (!resolution.project) {
      return this.buildProjectErrorResponse(resolution);
    }

    const project = resolution.project;
    const format = parsed.args[0]?.toLowerCase() || 'markdown';

    // Validate format
    const validFormats = ['markdown', 'json', 'prompt', 'text'];
    if (!validFormats.includes(format)) {
      return {
        type: ResponseType.ERROR,
        message: `Invalid format "${format}". Available formats: markdown, json, prompt, text`,
        suggestions: ['/help summary']
      };
    }

    // Build summary content
    const summary = this.generateProjectSummary(project, format);

    // Determine file extension
    const extensions: Record<string, string> = {
      markdown: 'md',
      json: 'json',
      prompt: 'txt',
      text: 'txt'
    };

    const fileExtension = extensions[format];
    const fileName = `${project.name.replace(/\s+/g, '-')}-summary.${fileExtension}`;

    return {
      type: ResponseType.DATA,
      message: `📄 Generated ${format} summary for ${project.name}`,
      data: {
        summary,
        format,
        fileName,
        projectName: project.name,
        downloadable: true
      },
      metadata: {
        projectId: project._id.toString(),
        projectName: project.name,
        action: 'summary'
      }
    };
  }

  /**
   * Generate project summary in different formats (with all data included)
   */
  private generateProjectSummary(project: any, format: string): string {
    const todos = project.todos || [];
    const notes = project.notes || [];
    const devLog = project.devLog || [];
    const docs = project.docs || [];
    const tech = project.selectedTechnologies || [];
    const packages = project.selectedPackages || [];

    // Count stats
    const completedTodos = todos.filter((t: any) => t.completed).length;
    const highPriorityTodos = todos.filter((t: any) => t.priority === 'high' && !t.completed).length;
    const activeTodos = todos.filter((t: any) => !t.completed);

    switch (format) {
      case 'json':
        return JSON.stringify({
          basicInfo: {
            name: project.name,
            category: project.category,
            stagingEnvironment: project.stagingEnvironment,
            color: project.color,
          },
          description: project.description,
          tags: project.tags || [],
          stats: {
            todos: {
              total: todos.length,
              completed: completedTodos,
              active: activeTodos.length,
              highPriority: highPriorityTodos
            },
            notes: notes.length,
            devLog: devLog.length,
            docs: docs.length
          },
          notes: notes,
          todos: todos,
          devLog: devLog,
          docs: docs,
          techStack: {
            technologies: tech,
            packages: packages
          },
          deploymentData: project.deploymentData || null,
          publicPageData: project.publicPageData || null,
          timestamps: {
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
          }
        }, null, 2);

      case 'prompt':
        let prompt = `# Project Context for AI Assistant for "${project.name}"\n\n`;
        if (project.description) prompt += `**Description:** ${project.description}\n\n`;
        prompt += `## 🤖 MY REQUEST:\n[Please replace this text with what you need help with regarding this project]\n\n`;
        prompt += `## 📋 PROJECT OVERVIEW\n\n`;
        prompt += `**Project Name:** ${project.name}\n`;
        if (project.category) prompt += `**Category:** ${project.category}\n`;
        if (project.stagingEnvironment) prompt += `**Current Environment:** ${project.stagingEnvironment}\n`;
        if (project.color) prompt += `**Theme Color:** ${project.color}\n`;
        if (project.tags && project.tags.length > 0) {
          prompt += `\n**Tags/Keywords:** ${project.tags.join(' • ')}\n`;
        }

        // Tech Stack
        if (tech.length > 0 || packages.length > 0) {
          prompt += `\n## ⚡ TECH STACK\n\n`;
          if (tech.length > 0) {
            prompt += `**Technologies:** ${tech.map((t: any) => t.name).join(' • ')}\n`;
          }
          if (packages.length > 0) {
            prompt += `**Packages/Dependencies:** ${packages.map((p: any) => p.name).join(' • ')}\n`;
          }
        }

        // Tasks
        if (todos.length > 0) {
          prompt += `\n## ✅ CURRENT TASKS (${completedTodos} completed, ${activeTodos.length} pending)\n\n`;
          if (activeTodos.length > 0) {
            prompt += `**🚧 Pending Tasks:**\n`;
            activeTodos.forEach((todo: any) => {
              if (todo?.text) {
                prompt += `• ${todo.text}`;
                if (todo.description) prompt += ` - ${todo.description}`;
                if (todo.priority) prompt += ` [${todo.priority.toUpperCase()} PRIORITY]`;
                if (todo.dueDate) prompt += ` (Due: ${new Date(todo.dueDate).toLocaleDateString()})`;
                prompt += `\n`;
              }
            });
          }
          if (completedTodos > 0) {
            prompt += `\n**✅ Completed Tasks:**\n`;
            todos.filter((t: any) => t.completed).forEach((todo: any) => {
              if (todo?.text) {
                prompt += `• ${todo.text}`;
                if (todo.description) prompt += ` - ${todo.description}`;
                prompt += `\n`;
              }
            });
          }
        }

        // Recent Development Log
        if (devLog.length > 0) {
          const recentEntries = devLog.slice(-5);
          prompt += `\n## 📝 RECENT DEVELOPMENT LOG\n`;
          recentEntries.forEach((entry: any) => {
            const entryContent = entry.entry?.length > 500 ?
              entry.entry.substring(0, 500) + '...' :
              entry.entry || '';
            prompt += `\n**${entry.date}${entry.title ? ' - ' + entry.title : ''}**\n`;
            prompt += `${entryContent}\n`;
          });
          if (devLog.length > 5) {
            prompt += `\n*(Showing ${recentEntries.length} most recent entries out of ${devLog.length} total)*\n`;
          }
        }

        // Notes
        if (notes.length > 0) {
          prompt += `\n## 📋 PROJECT NOTES\n`;
          notes.forEach((note: any) => {
            const noteContent = note.content?.length > 1000 ?
              note.content.substring(0, 1000) + '...' :
              note.content || '';
            prompt += `\n**${note.title || 'Untitled Note'}**\n`;
            prompt += `${noteContent}\n`;
          });
        }

        // Documentation
        if (docs.length > 0) {
          prompt += `\n## 📚 DOCUMENTATION\n`;
          const docsByType = docs.reduce((acc: any, doc: any) => {
            if (!acc[doc.type]) acc[doc.type] = [];
            acc[doc.type].push(doc);
            return acc;
          }, {});

          Object.entries(docsByType).forEach(([type, docList]: [string, any]) => {
            prompt += `\n**${type} Documentation:**\n`;
            docList.forEach((doc: any) => {
              const docContent = doc.content?.length > 800 ?
                doc.content.substring(0, 800) + '...' :
                doc.content || '';
              prompt += `• **${doc.title || 'Untitled'}:** ${docContent}\n`;
            });
          });
        }

        // Deployment
        if (project.deploymentData) {
          prompt += `\n## 🚀 DEPLOYMENT INFO\n`;
          if (project.deploymentData.liveUrl) prompt += `**Live URL:** ${project.deploymentData.liveUrl}\n`;
          if (project.deploymentData.githubUrl) prompt += `**GitHub Repository:** ${project.deploymentData.githubUrl}\n`;
          if (project.deploymentData.deploymentPlatform) prompt += `**Hosting Platform:** ${project.deploymentData.deploymentPlatform}\n`;
          if (project.deploymentData.environment) prompt += `**Environment:** ${project.deploymentData.environment}\n`;
        }

        // Public Page Data
        if (project.publicPageData?.isPublic) {
          prompt += `\n## 🌐 PUBLIC PAGE INFO\n`;
          if (project.publicPageData.publicTitle) prompt += `**Public Title:** ${project.publicPageData.publicTitle}\n`;
          if (project.publicPageData.publicDescription) prompt += `**Public Description:** ${project.publicPageData.publicDescription}\n`;
          if (project.publicPageData.publicTags?.length) prompt += `**Public Tags:** ${project.publicPageData.publicTags.join(' • ')}\n`;
        }

        // Timestamps
        if (project.createdAt || project.updatedAt) {
          const created = new Date(project.createdAt);
          const updated = new Date(project.updatedAt);
          const daysSinceCreated = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
          const daysSinceUpdated = Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24));

          prompt += `\n## ⏱️ PROJECT TIMELINE\n`;
          prompt += `**Created:** ${created.toLocaleDateString()} (${daysSinceCreated} days ago)\n`;
          prompt += `**Last Updated:** ${updated.toLocaleDateString()} (${daysSinceUpdated} days ago)\n`;
        }

        prompt += `\n---\n`;
        return prompt;

      case 'markdown':
        let md = `# ${project.name}\n\n`;

        // Basic Info
        md += `## Basic Information\n\n`;
        md += `- **Name:** ${project.name}\n`;
        if (project.category) md += `- **Category:** ${project.category}\n`;
        if (project.stagingEnvironment) md += `- **Environment:** ${project.stagingEnvironment}\n`;
        md += `\n`;

        // Description
        if (project.description) {
          md += `## Description\n\n${project.description}\n\n`;
        }

        // Tags
        if (project.tags?.length) {
          md += `## Tags\n\n${project.tags.map((tag: string) => `\`${tag}\``).join(', ')}\n\n`;
        }

        // Notes
        if (notes.length > 0) {
          md += `## Notes\n\n`;
          notes.forEach((note: any) => {
            const noteContent = note.content?.length > 2000 ?
              note.content.substring(0, 2000) + '...' :
              note.content || '';
            md += `### ${note.title || 'Untitled Note'}\n${noteContent}\n\n`;
          });
        }

        // Todo Items
        if (todos.length > 0) {
          md += `## Todo Items\n\n`;
          todos.forEach((todo: any) => {
            const todoDesc = todo.description?.length > 200 ?
              todo.description.substring(0, 200) + '...' :
              todo.description;
            md += `- [${todo.completed ? 'x' : ' '}] **${todo.text || 'Untitled Task'}**${todoDesc ? `: ${todoDesc}` : ''}`;
            if (todo.priority) md += ` [${todo.priority.toUpperCase()}]`;
            md += `\n`;
          });
          md += `\n`;
        }

        // Development Log
        if (devLog.length > 0) {
          md += `## Development Log\n\n`;
          devLog.forEach((entry: any) => {
            const entryContent = entry.entry?.length > 1500 ?
              entry.entry.substring(0, 1500) + '...' :
              entry.entry || '';
            md += `### ${entry.date} - ${entry.title || 'Development Entry'}\n${entryContent}\n\n`;
          });
        }

        // Documentation
        if (docs.length > 0) {
          md += `## Documentation\n\n`;
          docs.forEach((doc: any) => {
            const docContent = doc.content?.length > 2000 ?
              doc.content.substring(0, 2000) + '...' :
              doc.content || '';
            md += `### ${doc.title || 'Untitled'} (${doc.type})\n${docContent}\n\n`;
          });
        }

        // Tech Stack
        if (tech.length > 0 || packages.length > 0) {
          md += `## Tech Stack\n\n`;
          if (tech.length > 0) {
            md += `### Technologies\n${tech.map((t: any) => `- ${t.name}`).join('\n')}\n\n`;
          }
          if (packages.length > 0) {
            md += `### Packages\n${packages.map((p: any) => `- ${p.name}`).join('\n')}\n\n`;
          }
        }

        // Deployment
        if (project.deploymentData) {
          md += `## Deployment\n\n`;
          if (project.deploymentData.liveUrl) md += `- **Live URL:** ${project.deploymentData.liveUrl}\n`;
          if (project.deploymentData.githubUrl) md += `- **GitHub:** ${project.deploymentData.githubUrl}\n`;
          if (project.deploymentData.deploymentPlatform) md += `- **Platform:** ${project.deploymentData.deploymentPlatform}\n`;
          md += `\n`;
        }

        // Public Page Data
        if (project.publicPageData?.isPublic) {
          md += `## Public Page Info\n\n`;
          if (project.publicPageData.publicTitle) md += `- **Title:** ${project.publicPageData.publicTitle}\n`;
          if (project.publicPageData.publicDescription) md += `- **Description:** ${project.publicPageData.publicDescription}\n`;
          if (project.publicPageData.publicTags?.length) md += `- **Tags:** ${project.publicPageData.publicTags.join(', ')}\n`;
          md += `\n`;
        }

        // Timestamps
        if (project.createdAt || project.updatedAt) {
          md += `## Timestamps\n\n`;
          md += `- **Created:** ${new Date(project.createdAt).toLocaleDateString()}\n`;
          md += `- **Updated:** ${new Date(project.updatedAt).toLocaleDateString()}\n`;
        }

        return md;

      case 'text':
      default:
        let text = `${project.name}\n${'='.repeat(project.name.length)}\n\n`;

        // Basic Info
        text += `BASIC INFORMATION\n`;
        text += `-----------------\n`;
        text += `Name: ${project.name}\n`;
        if (project.category) text += `Category: ${project.category}\n`;
        if (project.stagingEnvironment) text += `Environment: ${project.stagingEnvironment}\n`;
        text += `\n`;

        // Description
        if (project.description) {
          text += `DESCRIPTION\n`;
          text += `-----------\n`;
          text += `${project.description}\n\n`;
        }

        // Tags
        if (project.tags?.length) {
          text += `TAGS\n`;
          text += `----\n`;
          text += `${project.tags.join(', ')}\n\n`;
        }

        // Statistics
        text += `STATISTICS\n`;
        text += `----------\n`;
        text += `Todos: ${completedTodos}/${todos.length} completed\n`;
        text += `High Priority: ${highPriorityTodos} remaining\n`;
        text += `Notes: ${notes.length}\n`;
        text += `Dev Log Entries: ${devLog.length}\n`;
        text += `Docs: ${docs.length}\n\n`;

        // Notes
        if (notes.length > 0) {
          text += `NOTES\n`;
          text += `-----\n`;
          notes.forEach((note: any) => {
            text += `${note.title || 'Untitled'}: ${note.content?.substring(0, 200) || ''}${note.content?.length > 200 ? '...' : ''}\n`;
          });
          text += `\n`;
        }

        // Todos
        if (todos.length > 0) {
          text += `TODO ITEMS\n`;
          text += `----------\n`;
          todos.forEach((todo: any) => {
            text += `[${todo.completed ? 'X' : ' '}] [${todo.priority?.toUpperCase() || 'MED'}] ${todo.text}\n`;
          });
          text += `\n`;
        }

        // Dev Log
        if (devLog.length > 0) {
          text += `DEVELOPMENT LOG\n`;
          text += `---------------\n`;
          devLog.forEach((entry: any) => {
            text += `${entry.date} - ${entry.title || 'Entry'}: ${entry.entry?.substring(0, 150) || ''}${entry.entry?.length > 150 ? '...' : ''}\n`;
          });
          text += `\n`;
        }

        // Documentation
        if (docs.length > 0) {
          text += `DOCUMENTATION\n`;
          text += `-------------\n`;
          docs.forEach((doc: any) => {
            text += `${doc.title || 'Untitled'} (${doc.type}): ${doc.content?.substring(0, 150) || ''}${doc.content?.length > 150 ? '...' : ''}\n`;
          });
          text += `\n`;
        }

        // Tech Stack
        if (tech.length > 0 || packages.length > 0) {
          text += `TECH STACK\n`;
          text += `----------\n`;
          if (tech.length > 0) {
            text += `Technologies:\n`;
            tech.forEach((t: any) => {
              text += `- ${t.name}\n`;
            });
          }
          if (packages.length > 0) {
            text += `Packages:\n`;
            packages.forEach((p: any) => {
              text += `- ${p.name}\n`;
            });
          }
          text += `\n`;
        }

        // Deployment
        if (project.deploymentData) {
          text += `DEPLOYMENT\n`;
          text += `----------\n`;
          if (project.deploymentData.liveUrl) text += `Live URL: ${project.deploymentData.liveUrl}\n`;
          if (project.deploymentData.githubUrl) text += `GitHub: ${project.deploymentData.githubUrl}\n`;
          if (project.deploymentData.deploymentPlatform) text += `Platform: ${project.deploymentData.deploymentPlatform}\n`;
          text += `\n`;
        }

        // Public Page Data
        if (project.publicPageData?.isPublic) {
          text += `PUBLIC PAGE INFO\n`;
          text += `----------------\n`;
          if (project.publicPageData.publicTitle) text += `Title: ${project.publicPageData.publicTitle}\n`;
          if (project.publicPageData.publicDescription) text += `Description: ${project.publicPageData.publicDescription}\n`;
          text += `\n`;
        }

        // Timestamps
        if (project.createdAt || project.updatedAt) {
          text += `TIMESTAMPS\n`;
          text += `----------\n`;
          text += `Created: ${new Date(project.createdAt).toLocaleDateString()}\n`;
          text += `Updated: ${new Date(project.updatedAt).toLocaleDateString()}\n`;
        }

        return text;
    }
  }

  /**
   * Handle /view news command
   */
  async handleViewNews(): Promise<CommandResponse> {
    try {
      const News = require('../../models/News').default;

      const newsPosts = await News.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select('title type summary publishedAt')
        .lean();

      if (newsPosts.length === 0) {
        return {
          type: ResponseType.INFO,
          message: '📰 No news available at the moment'
        };
      }

      return {
        type: ResponseType.DATA,
        message: `📰 Latest news (${newsPosts.length})`,
        data: {
          news: newsPosts.map((post: any) => ({
            title: post.title,
            type: post.type,
            summary: post.summary,
            date: post.publishedAt
          }))
        }
      };
    } catch (error) {
      logError('Error fetching news', error as Error);
      return {
        type: ResponseType.ERROR,
        message: 'Unable to fetch news at this time'
      };
    }
  }

  /**
   * Handle /set theme command
   */
  async handleSetTheme(parsed: ParsedCommand): Promise<CommandResponse> {
    const themeName = parsed.args[0];

    if (!themeName) {
      return {
        type: ResponseType.ERROR,
        message: 'Theme name is required',
        suggestions: ['/set theme dark', '/view themes']
      };
    }

    const validThemes = [
      'dim', 'light', 'dark', 'cupcake', 'bumblebee', 'emerald',
      'retro', 'cyberpunk', 'synthwave', 'forest', 'aqua', 'lofi',
      'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula',
      'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night',
      'coffee', 'winter', 'nord', 'sunset'
    ];

    const isCustomTheme = themeName.startsWith('custom-');

    if (!validThemes.includes(themeName.toLowerCase()) && !isCustomTheme) {
      return {
        type: ResponseType.ERROR,
        message: `Theme "${themeName}" not found`,
        suggestions: ['/view themes', '/set theme dark']
      };
    }

    try {
      const user = await User.findById(this.userId);
      if (!user) {
        return {
          type: ResponseType.ERROR,
          message: 'User not found'
        };
      }

      if (isCustomTheme) {
        const customThemeId = themeName.replace('custom-', '');
        const customThemeExists = user.customThemes?.some((ct: any) => ct.id === customThemeId);

        if (!customThemeExists) {
          return {
            type: ResponseType.ERROR,
            message: `Custom theme "${themeName}" not found`,
            suggestions: ['/view themes']
          };
        }
      }

      user.theme = themeName.toLowerCase() as any;
      await user.save();

      return {
        type: ResponseType.SUCCESS,
        message: `🎨 Theme changed to ${themeName}`,
        data: {
          theme: themeName.toLowerCase()
        }
      };
    } catch (error) {
      logError('Error setting theme', error as Error);
      return {
        type: ResponseType.ERROR,
        message: 'Unable to set theme at this time'
      };
    }
  }

  /**
   * Handle /view themes command
   */
  async handleViewThemes(): Promise<CommandResponse> {
    const themes = [
      { name: 'dim', description: 'Dim gray theme' },
      { name: 'light', description: 'Light theme' },
      { name: 'dark', description: 'Dark theme' },
      { name: 'cupcake', description: 'Sweet pink theme' },
      { name: 'bumblebee', description: 'Yellow and black' },
      { name: 'emerald', description: 'Green theme' },
      { name: 'retro', description: 'Vintage style' },
      { name: 'cyberpunk', description: 'Futuristic neon' },
      { name: 'synthwave', description: 'Retrowave style' },
      { name: 'forest', description: 'Nature green' },
      { name: 'aqua', description: 'Ocean blue' },
      { name: 'lofi', description: 'Calm and minimal' },
      { name: 'pastel', description: 'Soft colors' },
      { name: 'fantasy', description: 'Purple fantasy' },
      { name: 'wireframe', description: 'Minimal lines' },
      { name: 'black', description: 'Pure black' },
      { name: 'luxury', description: 'Gold and black' },
      { name: 'dracula', description: 'Dracula purple' },
      { name: 'cmyk', description: 'Print colors' },
      { name: 'autumn', description: 'Fall colors' },
      { name: 'business', description: 'Professional blue' },
      { name: 'acid', description: 'Bright lime' },
      { name: 'lemonade', description: 'Lemon yellow' },
      { name: 'night', description: 'Deep night blue' },
      { name: 'coffee', description: 'Brown coffee' },
      { name: 'winter', description: 'Cool winter' },
      { name: 'nord', description: 'Nordic theme' },
      { name: 'sunset', description: 'Sunset orange' }
    ];

    try {
      const user = await User.findById(this.userId).select('customThemes');
      const customThemes = user?.customThemes || [];

      return {
        type: ResponseType.DATA,
        message: '🎨 Available themes',
        data: {
          themes: themes.map(t => ({
            name: t.name,
            description: t.description,
            type: 'preset'
          })),
          customThemes: customThemes.map((ct: any) => ({
            name: `custom-${ct.id}`,
            displayName: ct.name,
            description: 'Custom theme',
            type: 'custom',
            colors: ct.colors
          }))
        },
        suggestions: ['/set theme dark', '/set theme light']
      };
    } catch (error) {
      logError('Error fetching custom themes', error as Error);
      return {
        type: ResponseType.DATA,
        message: '🎨 Available themes',
        data: {
          themes: themes.map(t => ({
            name: t.name,
            description: t.description,
            type: 'preset'
          })),
          customThemes: []
        },
        suggestions: ['/set theme dark', '/set theme light']
      };
    }
  }

  /**
   * Handle wizard commands
   */
  handleWizard(parsed: ParsedCommand): CommandResponse {
    return {
      type: ResponseType.INFO,
      message: `🧙 ${parsed.command} wizard coming soon!`,
      suggestions: ['/help']
    };
  }
}
