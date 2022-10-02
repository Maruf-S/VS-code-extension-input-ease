// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CodeManager } from "./coderunner";
import { Panel } from "./Panel";
import { SidebarProvider } from "./SidebarProvider";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const codeManager = new CodeManager();

  const sidebarProvider = new SidebarProvider(
    context.extensionUri,
    codeManager
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("input-sidebar", sidebarProvider)
  );
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-run-with-custom-input.run code with custom inputs",
      () => {}
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
