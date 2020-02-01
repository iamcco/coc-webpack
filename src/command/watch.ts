import { commands, workspace, Disposable, ExtensionContext, Uri } from 'coc.nvim'
import path from 'path'
import { existsSync } from 'fs'

const patternWebpack = /ERROR\sin\s(?<filename>\S+)\s(?<line>\d+):(?<col>\d+)/
const errorPattern = /ERROR\sin\s(?<filename>[^(]+)\((?<line>\d+),(?<col>\d+)\)/

export const errorList: any[] = []

export function watchCommand(context: ExtensionContext) {
  let statusItem = workspace.createStatusBarItem(1, { progress: true })
  let task = workspace.createTask('WEBPACK')
  let cwd: string

  task.onExit(code => {
    if (code !== 0) {
      workspace.showMessage(`Webpack exit with code ${code}`, 'warning')
    }
    statusItem.hide()
  })

  task.onStdout(lines => {
    let i = 0
    let items = []
    for (let line of lines) {
      if (line.indexOf('ERROR') !== -1) {
        let res = patternWebpack.exec(line)
        if (res == null) {
          res = errorPattern.exec(line)
        }
        if (res != null) {
          let { filename } = res.groups!
          if (!path.isAbsolute(filename)) {
            filename = path.join(cwd, filename)
          }
          items.push({
            name: path.relative(cwd, filename),
            filename,
            lnum: parseInt(res.groups!.line),
            col: parseInt(res.groups!.col),
            text: lines[i + 1].trim(),
            type: 'E'
          })
        }
      }
      i++
    }
    errorList.splice(0, errorList.length)
    errorList.push(...items)
    statusItem.text = items.length === 0 ? '✓ webpack' : '✗ webpack'
    statusItem.isProgress = false
  })

  task.onStderr(lines => {
    for (let line of lines) {
      if (line.match(/webpack\sis\swatching/)) {
        statusItem.isProgress = true
        statusItem.text = 'webpack watching'
      }
    }
  })

  context.subscriptions.push(Disposable.create(() => {
    task.dispose()
  }))

  context.subscriptions.push(commands.registerCommand('webpack.watch', async () => {
    const running = await task.running
    if (running) {
      workspace.showMessage(`Webpack is already running`, 'warning')
      return
    }
    const cmd = path.join('./', 'node_modules', '.bin', 'webpack')
    const doc = await workspace.document
    const currentFiePath = Uri.parse(doc.textDocument.uri).fsPath
    const workspaceFolder = workspace.workspaceFolders.reduce((pre, cur) => {
      const folder = Uri.parse(cur.uri).fsPath
      if (currentFiePath.startsWith(folder) && folder.length > pre.length) {
        return folder
      }
      return pre
    }, workspace.cwd)
    const absCmdPath = path.join(workspaceFolder, cmd)
    workspace.showMessage(`${absCmdPath}-${cmd}`)
    if (existsSync(absCmdPath)) {
      cwd = workspaceFolder
      task.start({
        cmd: absCmdPath,
        args: ['--watch', '--no-color'],
        cwd: workspaceFolder
      })
      statusItem.text = 'webpack'
      statusItem.isProgress = true
      statusItem.show()
    } else {
      workspace.showMessage(`Webpack does not found in node_modules!`, 'warning')
    }
  }))
}
