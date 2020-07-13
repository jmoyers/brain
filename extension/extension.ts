// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BrainTreeDataProvider } from "./tree";
import { getLinkProvider } from "./links";
import { BrainCompletionProvider } from "./completion";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const brainExplore = new BrainTreeDataProvider(vscode.workspace.rootPath);
  vscode.window.registerTreeDataProvider("brainExplore", brainExplore);

  vscode.commands.registerCommand("brainExplore.refresh", () => {
    brainExplore.refresh();
  });

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((e) => {
      vscode.commands.executeCommand("brainExplore.refresh");
    })
  );

  context.subscriptions.push(getLinkProvider());

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: "file", language: "python" },
    new BrainCompletionProvider(),
    "["
  );

  context.subscriptions.push(completionProvider);
}
