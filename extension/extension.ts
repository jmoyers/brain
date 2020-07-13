// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BrainTreeDataProvider } from "./tree";
import { getLinkProvider } from "./links";
import { BrainCompletionProvider } from "./completion";
import { brainExists, resolveBrain } from "../brain";

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("brain.create", async () => {
    await resolveBrain(vscode.workspace.rootPath);
    vscode.commands.executeCommand("brain.explore.refresh");
  });

  const explore = new BrainTreeDataProvider();

  vscode.window.registerTreeDataProvider("brain.explore", explore);

  vscode.commands.registerCommand("brain.explore.refresh", () => {
    explore.refresh();
  });

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((e) => {
      vscode.commands.executeCommand("brain.explore.refresh");
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidDeleteFiles((e) => {
      vscode.commands.executeCommand("brain.explore.refresh");
    })
  );

  context.subscriptions.push(getLinkProvider());

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: "file" },
    new BrainCompletionProvider(),
    "["
  );

  context.subscriptions.push(completionProvider);
}
