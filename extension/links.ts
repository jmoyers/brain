import * as vscode from "vscode";
import { join, normalize, resolve } from "path";
import { promises } from "fs";
const { stat } = promises;

const linkPattern = /\[\[(.*)\]\]/g;

class BrainLinkProvider implements vscode.DocumentLinkProvider {
  // required by vscode
  async provideDocumentLinks(document: vscode.TextDocument) {
    const results = [];

    const matches = Array.from(document.getText().matchAll(linkPattern));

    for (const match of matches) {
      if (match.length < 2 || match[1].length <= 0) continue;

      const linkPath = match[1];

      // + 2 due to [[
      const linkStart = document.positionAt(match.index + 2);

      const linkEnd = document.positionAt(match.index + 2 + linkPath.length);

      const uriPath = resolve(
        join(vscode.workspace.rootPath, normalize(linkPath))
      );

      try {
        const s = await stat(uriPath);

        if (s.isDirectory()) {
          continue;
        }
      } catch (e) {
        // if we encounter an invalid path, get ye gone
        continue;
      }

      const link = new vscode.DocumentLink(
        new vscode.Range(linkStart, linkEnd),
        vscode.Uri.file(`${uriPath}`)
      );

      results.push(link);
    }

    return results;
  }

  // required vscode
  resolveDocumentLink(
    link: vscode.DocumentLink
  ): vscode.ProviderResult<vscode.DocumentLink> {
    return link;
  }
}

const linkProvider = new BrainLinkProvider();

export function getLinkProvider() {
  return vscode.languages.registerDocumentLinkProvider(
    { scheme: "file" },
    linkProvider
  );
}
