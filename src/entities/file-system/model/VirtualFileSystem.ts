import type { DirectoryNode, FileSystemNode, FileNode } from "./types";
import { isDirectory } from "./types";

/**
 * Virtual File System implementation for simulating a directory structure in memory.
 * Provides methods for navigation, listing directories, and accessing files.
 *
 * @example
 * ```typescript
 * const vfs = new VirtualFileSystem();
 * vfs.changeDirectory("projects");
 * const files = vfs.listDirectory();
 * ```
 */
export class VirtualFileSystem {
  private root: DirectoryNode;
  private currentPath: string[];

  /**
   * Creates a new VirtualFileSystem instance with an initial directory structure.
   * Starts at /home/user directory by default.
   */
  constructor() {
    this.root = this.createInitialStructure();
    this.currentPath = ["home", "user"];
  }

  /**
   * Creates the initial directory structure with sample files and folders.
   * Structure includes:
   * - /home/user/about.txt
   * - /home/user/contact.txt
   * - /home/user/projects/README.md
   *
   * @returns The root directory node
   */
  private createInitialStructure(): DirectoryNode {
    // Create root directory
    const root: DirectoryNode = {
      name: "",
      type: "directory",
      children: new Map(),
    };

    // Create /home directory
    const home: DirectoryNode = {
      name: "home",
      type: "directory",
      children: new Map(),
    };

    // Create /home/user directory
    const user: DirectoryNode = {
      name: "user",
      type: "directory",
      children: new Map(),
    };

    // Create files in /home/user
    const aboutFile: FileNode = {
      name: "about.txt",
      type: "file",
      content: `Welcome to 13months' portfolio!

I'm a Frontend Engineer passionate about creating beautiful and functional web experiences.

Type 'help' to see available commands.
Type 'ls' to see what's here.`,
    };

    const contactFile: FileNode = {
      name: "contact.txt",
      type: "file",
      content: `Contact Information:

LinkedIn: linkedin
Blog: blog
GitHub: (coming soon)

Type the command name to open the link!`,
    };

    // Create /home/user/projects directory
    const projects: DirectoryNode = {
      name: "projects",
      type: "directory",
      children: new Map(),
    };

    const projectFile: FileNode = {
      name: "README.md",
      type: "file",
      content: `# My Projects

Check out my work and contributions!

More projects coming soon...`,
    };

    projects.children.set("README.md", projectFile);

    // Build the tree structure
    user.children.set("about.txt", aboutFile);
    user.children.set("contact.txt", contactFile);
    user.children.set("projects", projects);

    home.children.set("user", user);
    root.children.set("home", home);

    return root;
  }

  /**
   * Gets the current working directory path as a string.
   *
   * @returns The current path (e.g., "/home/user" or "/" for root)
   */
  getCurrentPath(): string {
    if (this.currentPath.length === 0) {
      return "/";
    }
    return "/" + this.currentPath.join("/");
  }

  /**
   * Changes the current working directory to the specified path.
   * Supports absolute paths (/home/user), relative paths (projects, ../),
   * and special paths (~, /, ., ..).
   *
   * @param path - The target directory path
   * @returns true if the directory change was successful, false if the path doesn't exist or is not a directory
   *
   * @example
   * ```typescript
   * vfs.changeDirectory("projects");     // Relative path
   * vfs.changeDirectory("/home/user");   // Absolute path
   * vfs.changeDirectory("..");           // Parent directory
   * vfs.changeDirectory("~");            // Home directory
   * ```
   */
  changeDirectory(path: string): boolean {
    // Handle special cases
    if (path === "" || path === "~") {
      // Go to home directory
      this.currentPath = ["home", "user"];
      return true;
    }

    if (path === "/") {
      // Go to root
      this.currentPath = [];
      return true;
    }

    // Determine if path is absolute or relative
    const isAbsolute = path.startsWith("/");
    const segments = path.split("/").filter((seg) => seg !== "");

    // Start from appropriate location
    let targetPath: string[];
    if (isAbsolute) {
      targetPath = [];
    } else {
      targetPath = [...this.currentPath];
    }

    // Process each segment
    for (const segment of segments) {
      if (segment === ".") {
        // Current directory - do nothing
        continue;
      } else if (segment === "..") {
        // Parent directory
        if (targetPath.length > 0) {
          targetPath.pop();
        }
      } else {
        // Regular directory name
        targetPath.push(segment);
      }
    }

    // Verify the target path exists and is a directory
    const node = this.getNodeByPath(targetPath);
    if (!node) {
      return false;
    }

    if (!isDirectory(node)) {
      return false;
    }

    // Update current path
    this.currentPath = targetPath;
    return true;
  }

  /**
   * Retrieves a file system node by its path segments.
   * Internal helper method for path resolution.
   *
   * @param pathSegments - Array of path segments (e.g., ["home", "user", "projects"])
   * @returns The file system node at the path, or null if not found
   */
  private getNodeByPath(pathSegments: string[]): FileSystemNode | null {
    let current: FileSystemNode = this.root;

    for (const segment of pathSegments) {
      if (!isDirectory(current)) {
        return null;
      }

      const next = current.children.get(segment);
      if (!next) {
        return null;
      }

      current = next;
    }

    return current;
  }

  /**
   * Lists the contents of a directory.
   *
   * @param path - Optional path to list. If not provided, lists current directory.
   *               Supports absolute and relative paths.
   * @returns Array of file system nodes (files and directories) in the specified directory.
   *          Returns empty array if path doesn't exist or is not a directory.
   *
   * @example
   * ```typescript
   * vfs.listDirectory();           // List current directory
   * vfs.listDirectory("/home");    // List /home directory
   * vfs.listDirectory("projects"); // List projects subdirectory
   * ```
   */
  listDirectory(path?: string): FileSystemNode[] {
    let targetPath: string[];

    if (!path || path === ".") {
      // Use current directory
      targetPath = this.currentPath;
    } else if (path === "/") {
      // Root directory
      targetPath = [];
    } else if (path.startsWith("/")) {
      // Absolute path
      targetPath = path.split("/").filter((seg) => seg !== "");
    } else {
      // Relative path
      const segments = path.split("/").filter((seg) => seg !== "");
      targetPath = [...this.currentPath];

      for (const segment of segments) {
        if (segment === ".") {
          continue;
        } else if (segment === "..") {
          if (targetPath.length > 0) {
            targetPath.pop();
          }
        } else {
          targetPath.push(segment);
        }
      }
    }

    const node = this.getNodeByPath(targetPath);
    if (!node || !isDirectory(node)) {
      return [];
    }

    return Array.from(node.children.values());
  }

  /**
   * Retrieves a specific file system node by its path.
   *
   * @param path - The path to the node (absolute or relative)
   * @returns The file system node at the path, or null if not found
   *
   * @example
   * ```typescript
   * const node = vfs.getNode("/home/user/about.txt");
   * if (node && node.type === "file") {
   *   console.log(node.content);
   * }
   * ```
   */
  getNode(path: string): FileSystemNode | null {
    if (path === "/" || path === "") {
      return this.root;
    }

    const isAbsolute = path.startsWith("/");
    const segments = path.split("/").filter((seg) => seg !== "");

    let targetPath: string[];
    if (isAbsolute) {
      targetPath = segments;
    } else {
      // Relative path
      targetPath = [...this.currentPath];

      for (const segment of segments) {
        if (segment === ".") {
          continue;
        } else if (segment === "..") {
          if (targetPath.length > 0) {
            targetPath.pop();
          }
        } else {
          targetPath.push(segment);
        }
      }
    }

    return this.getNodeByPath(targetPath);
  }
}
