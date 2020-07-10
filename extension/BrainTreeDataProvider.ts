import * as vscode from "vscode";
const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState;
import getAllFiles from "../files";
import getMetaData from "../parse";
import groupBy from "../group";

export class BrainTreeDataProvider
  implements vscode.TreeDataProvider<Dependency> {
  files: Array<string>;
  meta: Object;
  groups: Object;

  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: Dependency): Promise<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("Empty workspace");
      return [];
    }

    if (!element) {
      this.files = await getAllFiles(this.workspaceRoot);
      this.meta = await getMetaData(this.files);
      this.groups = groupBy(this.meta);

      const deps: Dependency[] = [];

      for (const p in this.groups) {
        deps.push(new Dependency(p, Collapsed));
      }

      return deps;
    } else {
      const deps: Dependency[] = [];
      for (const e in this.groups[element.label]) {
        const isLink = this.groups[element.label][e].length === 1;
        const treeItem = new Dependency(e, isLink ? None : Collapsed);

        if (isLink) {
          treeItem.command = {
            command: "vscode.open",
            title: "Open File",
            arguments: [
              vscode.Uri.parse("file://" + this.groups[element.label][e]),
            ],
          };
          treeItem.contextValue = "file";
        }

        deps.push(treeItem);
      }
      return deps;
    }
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return `${this.label}`;
  }

  get description(): string {
    return "";
  }
}
