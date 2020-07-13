import * as vscode from "vscode";
const { Collapsed, None } = vscode.TreeItemCollapsibleState;
import groupBy from "../group";
import { resolveBrain, brainExists } from "../brain";
import { parse } from "path";

function makeTreeLink(
  link: string,
  title?: string,
  description?: string
): BrainTreeItem {
  title = title || parse(link).base;
  description = description || "";

  const treeItem = new BrainTreeItem(title, None);

  treeItem.description = description;

  // special case where if there is one element, we'll link directly
  const uri = vscode.Uri.parse(`file://${link}`);

  // gives it an icon i guess, doesn't open when clicked though
  treeItem.resourceUri = uri;

  // doesn't support double click to pin the tab
  treeItem.command = {
    command: "vscode.open",
    title: "Open File",
    arguments: [uri],
  };

  treeItem.contextValue = "file";
  return treeItem;
}
export class BrainTreeDataProvider
  implements vscode.TreeDataProvider<BrainTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    BrainTreeItem | undefined | void
  > = new vscode.EventEmitter<BrainTreeItem | undefined | void>();

  private brain: Object;

  readonly onDidChangeTreeData: vscode.Event<
    BrainTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    // passing no item signifies root changed
    if (await brainExists(vscode.workspace.rootPath)) {
      this.brain = await resolveBrain(vscode.workspace.rootPath);
    } else {
      this.brain = undefined;
    }
    this._onDidChangeTreeData.fire();
  }

  // vscode required
  getTreeItem(element: BrainTreeItem): vscode.TreeItem {
    return element;
  }

  // vscode required
  async getChildren(element?: BrainTreeItem): Promise<BrainTreeItem[]> {
    if (!this.brain && (await brainExists(vscode.workspace.rootPath))) {
      this.brain = await resolveBrain(vscode.workspace.rootPath);
    } else if (!this.brain) {
      return [];
    }

    if (!element) {
      const groups = groupBy(this.brain);

      // data will be structured like
      // {
      //    "tags": {
      //       "easy": ["path1", "path2"]
      //    }
      // }

      const children: BrainTreeItem[] = [];

      for (const p in groups) {
        const item = new BrainTreeItem(p, Collapsed);

        // an object always at the start
        item.children = groups[p];

        children.push(item);
      }

      return children;
    } else if (element.children && element.children.constructor === Object) {
      const keys = Object.keys(element.children);

      const children: BrainTreeItem[] = [];

      for (const k of keys) {
        const count = element.children[k].length;

        let item: BrainTreeItem;

        if (count === 1) {
          const path = element.children[k][0];
          item = makeTreeLink(path, k, parse(path).base);
        } else {
          item = new BrainTreeItem(k, Collapsed);
          item.children = element.children[k];
        }

        children.push(item);
      }

      return children;
    } else if (Array.isArray(element.children)) {
      // build a list of this items children
      const data = element.children;

      const children: BrainTreeItem[] = [];

      for (const link of data) {
        const treeItem = makeTreeLink(link);
        children.push(treeItem);
      }

      return children;
    }
  }
}

class BrainTreeItem extends vscode.TreeItem {
  public path: string[];
  public children: Object;

  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return `${this.label}`;
  }
}
