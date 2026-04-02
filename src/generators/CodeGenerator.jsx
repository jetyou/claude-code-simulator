class CodeGenerator {
  constructor() {
    this.editDescriptions = [
      'Added useMemo for performance optimization',
      'Removed unnecessary useEffect',
      'Added error handling',
      'Refactored for better readability',
      'Added type definitions',
      'Simplified logic',
      'Fixed potential bug',
      'Added null checks',
      'Optimized imports',
      'Added validation',
    ];

    this.bashOutputs = {
      test: [
        '47 tests passed, 0 failed',
        'All tests passed successfully',
      ],
      build: [
        'Build completed successfully',
        'Compiled successfully',
      ],
      lint: [
        'No linting errors found',
        'All files passed lint check',
      ],
    };

    // Code change templates for diff display
    this.codeChanges = [
      {
        oldLines: [
          'const [state, setState] = useState(null);',
          'return <div>Loading...</div>;',
        ],
        newLines: [
          'const [data, setData] = useState(null);',
          'const [loading, setLoading] = useState(false);',
          'return <div>{loading ? "Loading..." : data}</div>;',
        ],
      },
      {
        oldLines: [
          'import React from "react";',
        ],
        newLines: [
          'import React, { useState, useEffect } from "react";',
          'import { Box, Text } from "ink";',
        ],
      },
      {
        oldLines: [
          'function handleSubmit() {',
          '  console.log(value);',
          '}',
        ],
        newLines: [
          'async function handleSubmit() {',
          '  setLoading(true);',
          '  await submitData(value);',
          '  setLoading(false);',
          '}',
        ],
      },
      {
        oldLines: [
          'useEffect(() => {',
          '  fetchData();',
          '});',
        ],
        newLines: [
          'useEffect(() => {',
          '  fetchData().then(setData);',
          '}, [dependency]);',
        ],
      },
      {
        oldLines: [
          'if (error) {',
          '  return null;',
          '}',
        ],
        newLines: [
          'if (error) {',
          '  return <ErrorBoundary error={error} />;',
          '}',
        ],
      },
    ];
  }

  getFileDescription(filePath) {
    if (filePath.includes('component') || filePath.endsWith('.tsx')) {
      return 'React component';
    }
    if (filePath.includes('hook')) {
      return 'Custom hook';
    }
    if (filePath.includes('util') || filePath.includes('helper')) {
      return 'Utility functions';
    }
    if (filePath.includes('service')) {
      return 'Service module';
    }
    if (filePath.includes('test')) {
      return 'Unit tests';
    }
    if (filePath.includes('context')) {
      return 'Context provider';
    }
    return 'Module';
  }

  getEditDescription() {
    return this.editDescriptions[
      Math.floor(Math.random() * this.editDescriptions.length)
    ];
  }

  getBashOutput(command) {
    if (command.includes('test')) {
      return this.bashOutputs.test[
        Math.floor(Math.random() * this.bashOutputs.test.length)
      ];
    }
    if (command.includes('build')) {
      return this.bashOutputs.build[
        Math.floor(Math.random() * this.bashOutputs.build.length)
      ];
    }
    if (command.includes('lint')) {
      return this.bashOutputs.lint[
        Math.floor(Math.random() * this.bashOutputs.lint.length)
      ];
    }
    return 'Command executed successfully';
  }

  generateCodeDiff() {
    const change = this.codeChanges[Math.floor(Math.random() * this.codeChanges.length)];
    const startLine = Math.floor(Math.random() * 30) + 10;
    const addedLines = change.newLines.length;
    const removedLines = change.oldLines.length;

    return {
      oldLines: change.oldLines,
      newLines: change.newLines,
      startLine,
      addedLines,
      removedLines,
    };
  }
}

export { CodeGenerator };