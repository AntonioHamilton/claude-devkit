import { Plugin } from "@opencode/plugin"
import { execFile } from "node:child_process"

// RTK OpenCode V2 plugin: rewrites shell commands through `rtk rewrite` to
// filter noisy output before it reaches the model.
//
// Requirements:
// - rtk >= 0.23.0 available in PATH (resolved without an intermediate shell).
// - OpenCode V2 plugin contract (`Plugin.define` + `ctx.shell.hook`).
//
// The plugin is fail-open: if rtk is missing, the command is unsupported, the
// rewrite times out, or the rewrite fails, the original command runs unchanged.

type Rewrite = { ok: boolean; command?: string }

function runRtk(args: string[], timeout = 5000): Promise<{ status: number; stdout: string }> {
  return new Promise((resolve) => {
    execFile(
      "rtk",
      args,
      { encoding: "utf8", timeout, windowsHide: true, shell: false, maxBuffer: 1024 * 1024 },
      (error, stdout) => {
        const status = error && typeof (error as { code?: unknown }).code === "number" ? (error as { code: number }).code : error ? 1 : 0
        resolve({ status, stdout: String(stdout ?? "") })
      },
    )
  })
}

async function rewrite(command: string): Promise<Rewrite> {
  try {
    // rtk rewrite exits 0 or 3 when it produced a rewrite, 1 when unsupported.
    const result = await runRtk(["rewrite", command])
    const rewritten = result.stdout.trim()
    if (!rewritten || rewritten === command) return { ok: false }
    return { ok: true, command: rewritten }
  } catch {
    return { ok: false }
  }
}

export default Plugin.define({
  id: "rtk",
  async setup(ctx) {
    const probe = await runRtk(["--version"])
    if (probe.status !== 0) {
      console.warn("[rtk] rtk binary not found in PATH: plugin disabled")
      return
    }

    await ctx.shell.hook("create.before", async (event) => {
      if (!event.command) return
      const result = await rewrite(event.command)
      if (result.ok && result.command) {
        event.command = result.command
      }
    })

    console.log("[rtk] plugin loaded")
  },
})
