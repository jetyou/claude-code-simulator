class FileTree {
  constructor(projectType = 'react') {
    this.type = projectType;
    this.files = this.generateFiles();
  }

  generateFiles() {
    const templates = {
      react: [
        'src/components/App.tsx',
        'src/components/Header.tsx',
        'src/components/Footer.tsx',
        'src/components/Navbar/Navbar.tsx',
        'src/components/Navbar/NavItem.tsx',
        'src/components/Dashboard/Dashboard.tsx',
        'src/components/Dashboard/StatsCard.tsx',
        'src/components/UserProfile.tsx',
        'src/components/Button.tsx',
        'src/components/Input.tsx',
        'src/components/Modal.tsx',
        'src/hooks/useAuth.ts',
        'src/hooks/useFetch.ts',
        'src/hooks/useForm.ts',
        'src/hooks/useLocalStorage.ts',
        'src/utils/api.ts',
        'src/utils/helpers.ts',
        'src/utils/constants.ts',
        'src/utils/validation.ts',
        'src/services/userService.ts',
        'src/services/authService.ts',
        'src/services/apiService.ts',
        'src/types/index.ts',
        'src/types/user.ts',
        'src/types/api.ts',
        'src/context/AuthContext.tsx',
        'src/context/AppContext.tsx',
        'src/pages/Home.tsx',
        'src/pages/Login.tsx',
        'src/pages/Dashboard.tsx',
        'lib/config.js',
        'lib/constants.js',
        'tests/unit/Header.test.tsx',
        'package.json',
        'tsconfig.json',
      ],
    };

    return templates[this.type] || templates.react;
  }

  getRandomFile() {
    return this.files[Math.floor(Math.random() * this.files.length)];
  }

  getRecentFiles() {
    return this.files.slice(0, 5);
  }
}

export { FileTree };