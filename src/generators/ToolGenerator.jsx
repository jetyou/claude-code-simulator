class ToolGenerator {
  constructor() {
    this.history = [];
    this.patterns = [
      ['Read', 'Read', 'Edit'],
      ['Grep', 'Read', 'Edit'],
      ['Read', 'Edit', 'Bash'],
      ['Glob', 'Read', 'Read', 'Edit'],
      ['Bash', 'Read', 'Edit', 'Edit'],
      ['Read', 'Read', 'Write'],
    ];
  }

  generate(fileTree) {
    const type = this.selectToolType();
    const params = this.generateParams(type, fileTree);

    const toolCall = {
      type,
      params,
      timestamp: Date.now(),
    };

    this.history.push(toolCall);
    return toolCall;
  }

  selectToolType() {
    const patternIndex = Math.floor(this.history.length / 3) % this.patterns.length;
    const pattern = this.patterns[patternIndex];
    const positionInPattern = this.history.length % pattern.length;
    return pattern[positionInPattern];
  }

  generateParams(type, fileTree) {
    switch (type) {
      case 'Read':
        return { file_path: fileTree.getRandomFile() };
      case 'Edit':
        const recentPath = this.getLastReadPath(fileTree);
        return { file_path: recentPath || fileTree.getRandomFile() };
      case 'Bash':
        return { command: this.getRandomBashCommand() };
      case 'Grep':
        return {
          pattern: this.getRandomGrepPattern(),
          path: 'src/',
        };
      case 'Glob':
        return { pattern: this.getRandomGlobPattern() };
      case 'Write':
        return { file_path: fileTree.getRandomFile() };
      default:
        return {};
    }
  }

  getLastReadPath(fileTree) {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].type === 'Read') {
        return this.history[i].params.file_path;
      }
    }
    return null;
  }

  getRandomBashCommand() {
    const commands = [
      'npm run test',
      'npm run build',
      'npm run lint',
      'npm run dev',
      'yarn test',
      'tsc --noEmit',
      'eslint src/',
      'prettier --check src/',
    ];
    return commands[Math.floor(Math.random() * commands.length)];
  }

  getRandomGrepPattern() {
    const patterns = [
      'useState',
      'useEffect',
      'async',
      'interface',
      'export',
      'import.*from',
      'className',
      'TODO',
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  getRandomGlobPattern() {
    const patterns = [
      '*.tsx',
      '*.ts',
      '*.test.tsx',
      '*.json',
      'src/**/*.tsx',
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
}

export { ToolGenerator };