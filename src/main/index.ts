import { app } from "electron";
import createWindow from "./createWindow";

// Electronが起動し、初期化処理が完了したとき
app.on("ready", () => {
});

// すべてのウィンドウが閉じられたとき
app.on("window-all-closed", () => {

});

// macOS限定のアクティブ処理
app.on("activate", (_e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow();
  }
});
