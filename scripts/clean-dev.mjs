import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { platform } from "node:os";

const nextDir = join(process.cwd(), ".next");
const DEV_PORTS = [3000, 3001, 3002, 3003, 3004, 3005, 3006];

function stopLocalDevServers() {
  if (platform() === "win32") {
    const ports = DEV_PORTS.join(",");
    try {
      execSync(
        `powershell -NoProfile -Command "$ports=@(${ports}); foreach($port in $ports){ Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { $procId=$_.OwningProcess; $proc=Get-Process -Id $procId -ErrorAction SilentlyContinue; if($proc -and $proc.ProcessName -eq 'node'){ Write-Host ('Arret du serveur Node PID ' + $procId + ' sur le port ' + $port); Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue } } }"`,
        { stdio: "inherit" },
      );
    } catch {
      // Aucun serveur a arreter.
    }
    return;
  }

  for (const port of DEV_PORTS) {
    try {
      execSync(`npx --yes kill-port ${port}`, { stdio: "ignore" });
    } catch {
      // Port libre.
    }
  }
}

console.log("Arret des serveurs de dev locaux (ports 3000-3006)...");
stopLocalDevServers();

try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("Cache .next supprime.");
} catch (error) {
  console.warn("Note .next:", error?.message || error);
}

console.log("Pret. Demarrage du serveur...");
