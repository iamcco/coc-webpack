import { ExtensionContext, extensions, workspace, WorkspaceConfiguration, OutputChannel } from 'coc.nvim'

const typeScriptExtensionId = 'coc-tsserver'
const pluginId = 'webpack-ts-plugin'
const configurationSection = 'coc-webpack'

interface SynchronizedConfiguration {
  name?: string
}

let output: OutputChannel

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context
  const config = workspace.getConfiguration(configurationSection)
  output = workspace.createOutputChannel('coc-webpack')

  extensions.onDidActiveExtension(extension => {
    output.appendLine(`extension id: ${extension.id}`)
    if (extension.id == typeScriptExtensionId) {
      synchronizeConfiguration(extension.exports)
    }
  }, null, subscriptions)

}

function getApi(): any {
  const extension = extensions.all.find(o => o.id == typeScriptExtensionId)
  if (!extensions) return
  return extension!.exports
}

function synchronizeConfiguration(api: any): void {
  if (!api) return
  api.configurePlugin(pluginId, getConfiguration())
  output.appendLine(`pluginId: ${pluginId}`)
}

function getConfiguration(): SynchronizedConfiguration {
  const config = workspace.getConfiguration(configurationSection)
  const outConfig: SynchronizedConfiguration = {}
  withConfigValue(config, outConfig, 'name')
  return outConfig
}

function withConfigValue<C, K extends Extract<keyof C, string>>(
  config: WorkspaceConfiguration,
  outConfig: C,
  key: K,
): void {
  const configSetting = config.inspect<C[K]>(key)
  if (!configSetting) {
    return
  }
  const value = config.get<any>(key, undefined)
  if (typeof value !== 'undefined') {
    outConfig[key] = value
  }
}
