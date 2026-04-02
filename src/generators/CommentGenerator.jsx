class CommentGenerator {
  constructor() {
    this.comments = {
      analysis: [
        'Analyzing the codebase structure...',
        'Looking for optimization opportunities...',
        'Reviewing the implementation...',
        'Checking for potential issues...',
      ],

      suggestions: [
        'This function could be optimized...',
        'I suggest adding error handling here...',
        'The code structure looks good',
        'This can be refactored for clarity...',
      ],

      prompts: [
        'Please help optimize this React component',
        'I need to refactor this module',
        'Can you review this code?',
        'There are some issues to fix',
      ],

      buddy: [
        'Hmm, interesting...',
        'Looks busy!',
        'Vibe coding mode activated',
        'This is... complex',
        'Keep going!',
        'Nice progress',
        'Wonder what this does...',
        'So many files!',
        'Coding vibes~',
      ],
    };
  }

  next() {
    const categories = ['analysis', 'suggestions'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const comments = this.comments[category];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  getRandomPrompt() {
    return this.comments.prompts[
      Math.floor(Math.random() * this.comments.prompts.length)
    ];
  }

  getBuddyComment() {
    return this.comments.buddy[
      Math.floor(Math.random() * this.comments.buddy.length)
    ];
  }
}

export { CommentGenerator };