import { ExtensionContext, workspace, OutputChannel, languages } from 'coc.nvim'

import { completeProvider } from './completion';
import { logger } from './logger';
import { hoverProvider } from './hover'

const pluginName = 'coc-webpack'

let output: OutputChannel

const documentSelector = ['javascript']

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
      documentSelector,
      completeProvider,
      [],
      99
    )
  )

  context.subscriptions.push(
    languages.registerHoverProvider(
      documentSelector,
      hoverProvider
    )
  )
}
