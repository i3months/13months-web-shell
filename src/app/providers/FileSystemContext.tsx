import React, { createContext, useContext, useState, useCallback } from "react";
import { VirtualFileSystem } from "@/entities/file-system";
import type { FileSystemNode } from "@/entities/file-system/model/types";

/**
 * Context value interface for file system operations.
 * Provides access to the virtual file system and navigation methods.
 */
interface FileSystemContextValue {
  /** The current working directory path */
  currentPath: string;
  /** The virtual file system instance */
  fileSystem: VirtualFileSystem;
  /** Changes the current directory */
  changeDirectory: (path: string) => boolean;
  /** Lists contents of a directory */
  listDirectory: (path?: string) => FileSystemNode[];
  /** Gets a specific file system node */
  getNode: (path: string) => FileSystemNode | null;
}

const FileSystemContext = createContext<FileSystemContextValue | undefined>(
  undefined
);

/**
 * Hook to access the file system context.
 * Must be used within a FileSystemProvider.
 *
 * @returns FileSystemContextValue with file system operations
 * @throws Error if used outside of FileSystemProvider
 *
 * @example
 * ```tsx
 * const { currentPath, changeDirectory, listDirectory } = useFileSystem();
 * changeDirectory("projects");
 * const files = listDirectory();
 * ```
 */
export const useFileSystem = (): FileSystemContextValue => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error("useFileSystem must be used within FileSystemProvider");
  }
  return context;
};

/**
 * Props for FileSystemProvider component.
 */
interface FileSystemProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages the virtual file system state.
 * Wraps the application to provide file system access to all child components.
 *
 * @example
 * ```tsx
 * <FileSystemProvider>
 *   <App />
 * </FileSystemProvider>
 * ```
 */
export const FileSystemProvider: React.FC<FileSystemProviderProps> = ({
  children,
}) => {
  const [fileSystem] = useState(() => new VirtualFileSystem());
  const [currentPath, setCurrentPath] = useState(fileSystem.getCurrentPath());

  const changeDirectory = useCallback(
    (path: string): boolean => {
      const success = fileSystem.changeDirectory(path);
      if (success) {
        setCurrentPath(fileSystem.getCurrentPath());
      }
      return success;
    },
    [fileSystem]
  );

  const listDirectory = useCallback(
    (path?: string): FileSystemNode[] => {
      return fileSystem.listDirectory(path);
    },
    [fileSystem]
  );

  const getNode = useCallback(
    (path: string): FileSystemNode | null => {
      return fileSystem.getNode(path);
    },
    [fileSystem]
  );

  const value: FileSystemContextValue = {
    currentPath,
    fileSystem,
    changeDirectory,
    listDirectory,
    getNode,
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};
