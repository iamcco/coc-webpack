import { ExtensionContext, workspace, OutputChannel, languages } from 'coc.nvim'
import { completeProvider } from './completion';
import { logger } from './logger';

const pluginName = 'coc-webpack'

let output: OutputChannel

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration(pluginName)

  if (!config.get('enable')) {
    return
  }

  if (config.get<string>('trace.server', '') !== 'off') {
    output = workspace.createOutputChannel(pluginName)
    logger.init(output)
  }

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      'coc-webpack',
      'wp',
      ['javascript'],
      completeProvider,
      [],
      99
    )
  )
}
