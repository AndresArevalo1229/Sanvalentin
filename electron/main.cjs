const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const runtimeLogFileName = "runtime-diagnostics.log";
const isWindows = process.platform === "win32";
const safeRenderRequested =
  process.argv.includes("--safe-render") || process.env.SVA_SAFE_RENDER === "1";
const useSoftwareRendering = isWindows && safeRenderRequested;

const appendRuntimeLog = (message) => {
  try {
    const logPath = path.join(app.getPath("userData"), runtimeLogFileName);
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`, "utf8");
  } catch {
    // Ignore logging errors: diagnostics should never crash the app.
  }
};

if (useSoftwareRendering) {
  // Optional software rendering fallback for problematic Windows setups.
  app.disableHardwareAcceleration();
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    backgroundColor: "#f7dbe4",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.on("render-process-gone", (_, details) => {
    appendRuntimeLog(
      `render-process-gone reason=${details.reason} exitCode=${details.exitCode}`
    );
  });

  win.webContents.on("did-fail-load", (_, errorCode, errorDescription, validatedURL, isMainFrame) => {
    appendRuntimeLog(
      `did-fail-load code=${errorCode} desc=${errorDescription} url=${validatedURL} mainFrame=${isMainFrame}`
    );
  });

  win.on("unresponsive", () => {
    appendRuntimeLog("window-unresponsive");
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

app.whenReady().then(() => {
  appendRuntimeLog(
    `startup platform=${process.platform} renderMode=${
      useSoftwareRendering ? "software-safe" : "hardware-default"
    } safeRenderRequested=${safeRenderRequested}`
  );
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
