/**
 * Represents a directory node in the virtual file system.
 * Contains a map of child nodes (files and subdirectories).
 */
export interface DirectoryNode {
  /** The directory name */
  name: string;
  /** Node type discriminator */
  type: "directory";
  /** Map of child nodes, keyed by their names */
  children: Map<string, FileSystemNode>;
}

/**
 * Represents a file node in the virtual file system.
 * Contains text content that can be displayed.
 */
export interface FileNode {
  /** The file name */
  name: string;
  /** Node type discriminator */
  type: "file";
  /** The text content of the file */
  content: string;
}

/**
 * Union type representing any node in the file system.
 * Can be either a directory or a file.
 */
export type FileSystemNode = DirectoryNode | FileNode;

/**
 * Type guard to check if a node is a directory.
 *
 * @param node - The file system node to check
 * @returns true if the node is a DirectoryNode
 */
export const isDirectory = (node: FileSystemNode): node is DirectoryNode => {
  return node.type === "directory";
};

/**
 * Type guard to check if a node is a file.
 *
 * @param node - The file system node to check
 * @returns true if the node is a FileNode
 */
export const isFile = (node: FileSystemNode): node is FileNode => {
  return node.type === "file";
};
