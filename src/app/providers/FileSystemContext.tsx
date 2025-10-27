import React, { createContext, useContext, useState, useCallback } from "react";
import { VirtualFileSystem } from "@/entities/file-system";
import type { FileSystemNode } from "@/entities/file-system/model/types";

interface FileSystemContextValue {
  currentPath: string;
  fileSystem: VirtualFileSystem;
  changeDirectory: (path: string) => boolean;
  listDirectory: (path?: string) => FileSystemNode[];
  getNode: (path: string) => FileSystemNode | null;
}

const FileSystemContext = createContext<FileSystemContextValue | undefined>(
  undefined
);

export const useFileSystem = (): FileSystemContextValue => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error("useFileSystem must be used within FileSystemProvider");
  }
  return context;
};

interface FileSystemProviderProps {
  children: React.ReactNode;
}

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
