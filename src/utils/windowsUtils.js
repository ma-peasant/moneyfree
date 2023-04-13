import { WebviewWindow } from '@tauri-apps/api/window'

export function createSettingWindow(){
    const webview = new WebviewWindow('设置', {
        url: `./src/windows/Setting.html`
      })
      // since the webview window is created asynchronously,
      // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
      webview.once('tauri://created', function () {
        // webview window successfully created
        console.log('窗口创建成功');
        webview.show();
      })
      webview.once('tauri://error', function (e) {
        // an error occurred during webview window creation
        console.log('窗口创建失败' + e.payload);
      })
}
