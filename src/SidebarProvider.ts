import path from "path";
import * as vscode from "vscode";
import { CodeManager } from "./coderunner";
export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  _codeManager: CodeManager;
  constructor(
    private readonly _extensionUri: vscode.Uri,
    codeManager: CodeManager
  ) {
    this._codeManager = codeManager;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        // case "report": {
        //   const message = await vscode.window.showInputBox({
        //     placeHolder: "why are you reporting this user?",
        //   });
        //   if (message) {
        //     await mutationNoErr(`/report`, { message, ...data.value });
        //     webviewView.webview.postMessage({
        //       command: "report-done",
        //       data,
        //     });
        //     vscode.window.showInformationMessage("Thank you for reporting!");
        //   }
        //   break;
        // }
        // case "unmatch": {
        //   const y = await vscode.window.showInformationMessage(
        //     `Are you sure you want to unmatch "${data.value.userName}"?`,
        //     "Yes",
        //     "No"
        //   );
        //   if (y === "Yes") {
        //     try {
        //       await mutation(`/unmatch`, { userId: data.value.userId });
        //       webviewView.webview.postMessage({
        //         command: "unmatch-done",
        //         payload: {},
        //       });
        //       vscode.window.showInformationMessage(
        //         `You unmatched "${data.value.userName}"`
        //       );
        //     } catch {}
        //   }
        //   break;
        // }
        // case "send-tokens": {
        //   webviewView.webview.postMessage({
        //     command: "init-tokens",
        //     payload: {
        //       accessToken: Util.getAccessToken(),
        //       refreshToken: Util.getRefreshToken(),
        //     },
        //   });
        //   break;
        // }
        // case "logout": {
        //   await Util.globalState.update(accessTokenKey, "");
        //   await Util.globalState.update(refreshTokenKey, "");
        //   SwiperPanel.kill();
        //   ViewCodeCardPanel.kill();
        //   break;
        // }
        // case "delete-account": {
        //   const y = await vscode.window.showInformationMessage(
        //     "Are you sure you want to delete your account?",
        //     "yes",
        //     "no"
        //   );
        //   if (y === "yes") {
        //     try {
        //       await mutation("/account/delete", {});
        //       await Util.globalState.update(accessTokenKey, "");
        //       await Util.globalState.update(refreshTokenKey, "");
        //       webviewView.webview.postMessage({
        //         command: "account-deleted",
        //         payload: {},
        //       });
        //       vscode.window.showInformationMessage("successfully deleted");
        //       SwiperPanel.kill();
        //       ViewCodeCardPanel.kill();
        //     } catch {}
        //   }
        //   break;
        // }
        // case "show-snippet-status": {
        //   SnippetStatus.show();
        //   break;
        // }
        // case "hide-snippet-status": {
        //   SnippetStatus.hide();
        //   break;
        // }
        // case "view-code-card": {
        //   ViewCodeCardPanel.createOrShow(this._extensionUri, data.value);
        //   break;
        // }
        // case "start-swiping": {
        //   SwiperPanel.createOrShow(this._extensionUri);
        //   break;
        // }
        // case "login": {
        //   authenticate((payload) => {
        //     webviewView.webview.postMessage({
        //       command: "login-complete",
        //       payload,
        //     });
        //   });
        //   break;
        // }
        case "sendCode": {
          this._codeManager.run(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();

                </script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
