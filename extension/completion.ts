import * as vscode from "vscode";
import { findInWorkspace } from "../fuzzy";
import { getAllFiles } from "../files";

export class BrainCompletionProvider
  implements vscode.CompletionItemProvider<vscode.CompletionItem> {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    const linePrefix = document
      .lineAt(position)
      .text.substr(0, position.character);

    if (!linePrefix.endsWith("[[")) {
      return [];
    }

    const prefix = linePrefix.slice(linePrefix.lastIndexOf("[") + 1);

    const files = await getAllFiles(vscode.workspace.rootPath);

    let matchedFiles = [];

    if (prefix.length > 0) {
      matchedFiles = findInWorkspace(prefix, files);
    } else {
      matchedFiles = files;
    }

    const completionFiles = [];

    for (const f of matchedFiles) {
      completionFiles.push(new vscode.CompletionItem(f));
    }

    return completionFiles;
  }
}
