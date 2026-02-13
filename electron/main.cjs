const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const runtimeLogFileName = "runtime-diagnostics.log";
const isWindows = process.platform === "win32";
const diagnosticsRequested =
  process.argv.includes("--diagnostics") || process.argv.includes("--diag");
const openDevToolsRequested =
  diagnosticsRequested || process.argv.includes("--open-devtools");
const safeRenderRequested =
  process.argv.includes("--safe-render") || process.env.SVA_SAFE_RENDER === "1";
// Keep hardware acceleration on by default for all OS.
// Only force software rendering when explicitly requested in Windows.
const useSoftwareRendering = isWindows && safeRenderRequested;

if (diagnosticsRequested) {
  // Chromium/Electron logs in terminal while diagnosing runtime issues.
  app.commandLine.appendSwitch("enable-logging");
  app.commandLine.appendSwitch("log-level", "0");
}

const getRuntimeLogPath = () => path.join(app.getPath("userData"), runtimeLogFileName);

const appendRuntimeLog = (message, options = {}) => {
  const { printToConsole = diagnosticsRequested, consoleLevel = "log" } = options;
  try {
    const logPath = getRuntimeLogPath();
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`, "utf8");
  } catch {
    // Ignore logging errors: diagnostics should never crash the app.
  }

  if (printToConsole) {
    const output = `[runtime-diag] ${message}`;
    if (consoleLevel === "error") {
      console.error(output);
    } else if (consoleLevel === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
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

  win.webContents.on("preload-error", (_, preloadPath, error) => {
    appendRuntimeLog(
      `preload-error path=${preloadPath} message=${error?.message || "unknown"}`,
      { consoleLevel: "error" }
    );
  });

  win.webContents.on("console-message", (_, level, message, line, sourceId) => {
    const compactMessage = String(message || "").replace(/\s+/g, " ").trim().slice(0, 500);
    appendRuntimeLog(
      `renderer-console level=${level} source=${sourceId || "unknown"} line=${line} message=${compactMessage}`,
      { consoleLevel: level >= 2 ? "warn" : "log" }
    );
  });

  win.on("unresponsive", () => {
    appendRuntimeLog("window-unresponsive");
  });

  // In development, fall back to local Vite URL so scripts work on macOS/Windows shells.
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || (!app.isPackaged ? "http://localhost:5173" : "");
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  if (openDevToolsRequested) {
    win.webContents.openDevTools({ mode: "detach" });
  }
};

process.on("uncaughtException", (error) => {
  appendRuntimeLog(`uncaught-exception message=${error?.message || "unknown"}`, {
    consoleLevel: "error"
  });
});

process.on("unhandledRejection", (reason) => {
  const reasonText = reason instanceof Error ? reason.message : String(reason);
  appendRuntimeLog(`unhandled-rejection reason=${reasonText}`, {
    consoleLevel: "error"
  });
});

app.on("child-process-gone", (_, details) => {
  appendRuntimeLog(
    `child-process-gone type=${details.type} reason=${details.reason} exitCode=${details.exitCode}`,
    { consoleLevel: "error" }
  );
});

app.whenReady().then(() => {
  // Same diagnostics file on both macOS and Windows under each OS userData folder.
  appendRuntimeLog(
    `startup platform=${process.platform} renderMode=${
      useSoftwareRendering ? "software-safe" : "hardware-default"
    } safeRenderRequested=${safeRenderRequested} diagnosticsRequested=${diagnosticsRequested} logPath=${getRuntimeLogPath()}`
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
