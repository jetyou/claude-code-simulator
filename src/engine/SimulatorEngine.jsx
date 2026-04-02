import { FileTree } from '../models/FileTree.jsx';
import { ToolGenerator } from '../generators/ToolGenerator.jsx';
import { CodeGenerator } from '../generators/CodeGenerator.jsx';
import { CommentGenerator } from '../generators/CommentGenerator.jsx';

export class SimulatorEngine {
  constructor(options = {}) {
    this.onOutput = options.onOutput || (() => {});
    this.onStatsUpdate = options.onStatsUpdate || (() => {});
    this.onBuddyComment = options.onBuddyComment || (() => {});

    this.fileTree = new FileTree('react');
    this.toolGenerator = new ToolGenerator();
    this.codeGenerator = new CodeGenerator();
    this.commentGenerator = new CommentGenerator();

    this.stats = {
      filesRead: 0,
      filesModified: 0,
      commandsRun: 0,
      totalOps: 0,
    };

    this.started = false;
    this.initialPromptShown = false;
  }

  start() {
    this.started = true;
    this.showInitialPrompt();
  }

  stop() {
    this.started = false;
  }

  showInitialPrompt() {
    if (this.initialPromptShown) return;
    this.initialPromptShown = true;

    const prompt = this.commentGenerator.getRandomPrompt();
    this.onOutput({
      type: 'prompt',
      content: prompt,
    });

    this.onOutput({
      type: 'comment',
      content: 'Let me analyze the codebase...',
    });
  }

  async tick() {
    if (!this.started) return;

    // Generate a tool call
    const toolCall = this.toolGenerator.generate(this.fileTree);

    // Show the tool call
    this.showToolCall(toolCall);

    // Update stats
    this.updateStats(toolCall);

    // Occasionally show a comment
    if (Math.random() < 0.15) {
      const comment = this.commentGenerator.next();
      this.onOutput({
        type: 'comment',
        content: comment,
      });
    }

    // Show progress every 10 ops
    if (this.stats.totalOps % 10 === 0 && this.stats.totalOps > 0) {
      this.onOutput({
        type: 'progress',
        content: `[Progress: Read ${this.stats.filesRead} files | Modified ${this.stats.filesModified} files | Ran ${this.stats.commandsRun} commands]`,
      });
    }
  }

  showToolCall(toolCall) {
    // For Edit operations, generate diff data
    let diff = null;
    if (toolCall.type === 'Edit') {
      diff = this.codeGenerator.generateCodeDiff();
    }

    const result = this.generateResult(toolCall, diff);

    this.onOutput({
      type: 'tool_call',
      tool: toolCall.type,
      params: this.formatParams(toolCall),
      result: result,
      success: true,
      diff: diff,
    });
  }

  formatParams(toolCall) {
    switch (toolCall.type) {
      case 'Read':
        return toolCall.params.file_path;
      case 'Edit':
        return toolCall.params.file_path;
      case 'Bash':
        return toolCall.params.command;
      case 'Grep':
        return `pattern: "${toolCall.params.pattern}"`;
      case 'Glob':
        return `pattern: "${toolCall.params.pattern}"`;
      case 'Write':
        return toolCall.params.file_path;
      default:
        return '';
    }
  }

  generateResult(toolCall, diff = null) {
    switch (toolCall.type) {
      case 'Read':
        const lines = Math.floor(Math.random() * 200) + 20;
        const desc = this.codeGenerator.getFileDescription(toolCall.params.file_path);
        return `${lines} lines, ${desc}`;
      case 'Edit':
        if (diff) {
          return `Added ${diff.addedLines} line${diff.addedLines > 1 ? 's' : ''}, removed ${diff.removedLines} line${diff.removedLines > 1 ? 's' : ''}`;
        }
        return this.codeGenerator.getEditDescription();
      case 'Bash':
        return this.codeGenerator.getBashOutput(toolCall.params.command);
      case 'Grep':
        const matches = Math.floor(Math.random() * 50) + 1;
        const files = Math.floor(Math.random() * 10) + 1;
        return `Found ${matches} matches in ${files} files`;
      case 'Glob':
        const foundFiles = Math.floor(Math.random() * 20) + 5;
        return `Found ${foundFiles} files`;
      case 'Write':
        const writtenLines = Math.floor(Math.random() * 100) + 10;
        return `Wrote ${writtenLines} lines`;
      default:
        return '';
    }
  }

  updateStats(toolCall) {
    this.stats.totalOps++;

    switch (toolCall.type) {
      case 'Read':
        this.stats.filesRead++;
        break;
      case 'Edit':
      case 'Write':
        this.stats.filesModified++;
        break;
      case 'Bash':
        this.stats.commandsRun++;
        break;
    }

    this.onStatsUpdate(this.stats);
  }

  clearOutputs() {
    this.stats = {
      filesRead: 0,
      filesModified: 0,
      commandsRun: 0,
      totalOps: 0,
    };
    this.initialPromptShown = false;
    this.onStatsUpdate(this.stats);
  }
}