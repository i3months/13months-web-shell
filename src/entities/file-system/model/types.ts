export interface DirectoryNode {
  name: string;
  type: "directory";
  children: Map<string, FileSystemNode>;
}

export interface FileNode {
  name: string;
  type: "file";
  content: string;
}

export type FileSystemNode = DirectoryNode | FileNode;

export const isDirectory = (node: FileSystemNode): node is DirectoryNode => {
  return node.type === "directory";
};

export const isFile = (node: FileSystemNode): node is FileNode => {
  return node.type === "file";
};
