import * as vscode from "vscode";
export class CodeManager implements vscode.Disposable {
  private _terminal: vscode.Terminal | null;
  constructor() {
    this._terminal = null;
  }

  public dispose() {
    if (this._terminal) {
      this._terminal.dispose();
    }
  }
  public onDidCloseTerminal(): void {
    this._terminal = null;
  }
  private halalify = function (cmd: string) {
    return '"' + cmd.replace(/(["'$`\\])/g, "\\$1") + '"';
  };
  public run(args: string) {
    if (this._terminal) {
      this._terminal.dispose();
    }
    this._terminal = vscode.window.createTerminal("Code",process.env.COMSPEC);
    this._terminal.show(true);
    let texteditor = vscode.window.activeTextEditor;
    if (texteditor == null) {
      return vscode.window.showInformationMessage(
        "There isn't an active tab open"
      );
    }
    var currentlyOpenTabfilePath = texteditor.document.fileName;
    this._terminal.sendText(
      "python " + this.halalify(currentlyOpenTabfilePath) + "\n" + args
    );
    return;
  }
}
