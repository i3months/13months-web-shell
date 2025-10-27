# 🧠 13months-web-shell

> A personal Web Shell CLI portfolio that runs in the browser  
> An interactive terminal interface to explore my profile using Linux-style commands

![Terminal Demo](./docs/demo.png)

## 🚀 Overview

**13months-web-shell** is an interactive web-based terminal portfolio that provides:

- Basic Linux commands (`ls`, `cd`, `pwd`, `echo`, `clear`, `help`)
- Custom personal commands (`linkedin`, `blog`, `hobby`, `career`)
- A unique way to present your portfolio in a terminal-style interface

## ✨ Features

- **Built-in Commands**: Standard Linux commands for navigation and interaction
- **Custom Commands**: Easily extensible personal commands for links and information
- **Command History**: Navigate through previous commands with arrow keys (↑/↓)
- **Auto-completion**: Tab key completion for commands
- **Virtual File System**: Navigate through a simulated directory structure
- **Responsive Design**: Works on desktop and mobile devices (320px - 2560px)
- **Modern Stack**: Built with React, TypeScript, and Vite

## 🛠 Tech Stack

| Category             | Technology                     |
| -------------------- | ------------------------------ |
| **Frontend**         | React 18.3+                    |
| **Language**         | TypeScript 5.5+                |
| **Build Tool**       | Vite 5.4+                      |
| **Package Manager**  | pnpm 9.x                       |
| **Styling**          | TailwindCSS 3.4+               |
| **Router**           | React Router DOM 6.26+         |
| **State Management** | React Context API              |
| **Icons**            | lucide-react                   |
| **Testing**          | Vitest + React Testing Library |

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm 9+ (or npm/yarn)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/13months/web-shell.git
   cd web-shell
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:5173
   ```

## 🎮 Available Commands

### Built-in Commands

| Command       | Description             | Example                        |
| ------------- | ----------------------- | ------------------------------ |
| `ls`          | List directory contents | `ls`                           |
| `cd <path>`   | Change directory        | `cd projects`, `cd ..`, `cd ~` |
| `pwd`         | Print working directory | `pwd`                          |
| `echo <text>` | Display text            | `echo Hello World`             |
| `clear`       | Clear terminal output   | `clear`                        |
| `help`        | Show available commands | `help`                         |

### Custom Commands

| Command    | Type | Description                      |
| ---------- | ---- | -------------------------------- |
| `linkedin` | link | Open LinkedIn profile in new tab |
| `blog`     | link | Open personal blog in new tab    |
| `hobby`    | text | Display hobbies and interests    |
| `career`   | text | Display career information       |

### Keyboard Shortcuts

| Key              | Action                                  |
| ---------------- | --------------------------------------- |
| `↑` (Up Arrow)   | Navigate to previous command in history |
| `↓` (Down Arrow) | Navigate to next command in history     |
| `Tab`            | Auto-complete command                   |
| `Enter`          | Execute command                         |

## 🔧 Adding Custom Commands

Custom commands are defined in `src/entities/command/model/custom-commands.ts`. You can easily add your own commands without modifying core code.

### Command Structure

```typescript
interface CustomCommand {
  name: string; // Command name (e.g., "linkedin")
  type: "link" | "text"; // Command type
  value: string; // URL for links, text content for text
  description?: string; // Optional description for help
}
```

### Example: Adding a New Link Command

```typescript
// src/entities/command/model/custom-commands.ts
export const customCommands: CustomCommand[] = [
  // ... existing commands
  {
    name: "github",
    type: "link",
    value: "https://github.com/yourusername",
    description: "Open GitHub profile",
  },
];
```

### Example: Adding a New Text Command

```typescript
export const customCommands: CustomCommand[] = [
  // ... existing commands
  {
    name: "skills",
    type: "text",
    value: "React, TypeScript, Node.js, Python, Docker",
    description: "Display technical skills",
  },
];
```

### Multi-line Text Commands

For multi-line output, use `\n` in the value:

```typescript
{
  name: "about",
  type: "text",
  value: "Hi! I'm a Frontend Developer\nPassionate about web technologies\nLove building interactive experiences",
  description: "About me",
}
```

## 🏗 Project Structure (FSD Architecture)

This project follows **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/                    # Application layer
│   ├── providers/          # Context providers
│   ├── router/             # Routing configuration
│   └── App.tsx             # App entry point
│
├── pages/                  # Page layer
│   └── terminal/           # Terminal page
│
├── widgets/                # Widget layer
│   └── shell/              # Shell widget (CommandLine, OutputArea)
│
├── features/               # Feature layer
│   ├── execute-command/    # Command execution logic
│   ├── command-history/    # Command history management
│   └── auto-complete/      # Auto-completion logic
│
├── entities/               # Entity layer
│   ├── command/            # Command entity & registry
│   └── file-system/        # Virtual file system
│
└── shared/                 # Shared layer
    ├── ui/                 # Reusable UI components
    └── lib/                # Utility functions
```

### Layer Dependencies

```
app → pages → widgets → features → entities → shared
```

Each layer can only depend on layers below it (unidirectional dependency).

## 🧪 Testing

### Run all tests

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test
```

### Run tests once (CI mode)

```bash
pnpm test:run
```

### Run tests with UI

```bash
pnpm test:ui
```

## 🚀 Building for Production

### Build the project

```bash
pnpm build
```

### Preview production build

```bash
pnpm preview
```

The build output will be in the `dist/` directory, ready for deployment.

## 📱 Responsive Design

The terminal interface is fully responsive and works on:

- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

On mobile devices:

- Virtual keyboard appears when input is focused
- Touch interactions are supported
- Scrollable output area for limited screen height

## 🎨 Customization

### Changing Terminal Colors

Edit `tailwind.config.js` to customize the terminal theme:

```javascript
theme: {
  extend: {
    colors: {
      terminal: {
        bg: '#1e1e1e',      // Background color
        text: '#d4d4d4',    // Text color
        prompt: '#4ec9b0',  // Prompt color
        error: '#f48771',   // Error color
        success: '#89d185', // Success color
      }
    }
  }
}
```

### Changing Prompt Format

Edit `src/shared/ui/Prompt.tsx` to customize the prompt display.

### Modifying Virtual File System

Edit `src/entities/file-system/model/VirtualFileSystem.ts` to add or modify directories and files.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**13months**

- LinkedIn: [linkedin.com/in/13months](https://linkedin.com/in/13months)
- Blog: [13months.tistory.com](https://13months.tistory.com)

## 🙏 Acknowledgments

- Inspired by classic Unix/Linux terminals
- Built with modern web technologies
- Follows Feature-Sliced Design architecture

---

**Try it out:** Type `help` to see all available commands!
