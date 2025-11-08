let deferredPrompt: any = null;

export function setupPWAInstall() {
  const btn = document.getElementById("pwaInstallBtn");

  window.addEventListener("beforeinstallprompt", (e: any) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btn) btn.style.display = "inline-flex";
  });

  btn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    btn.style.display = "none";
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } finally {
      deferredPrompt = null;
    }
  });
}
