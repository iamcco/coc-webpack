import { ExtensionContext, workspace, OutputChannel, languages, listManager } from 'coc.nvim'

import { getCompleteProvider } from './provider/completion';
import { logger } from './logger';
import { getHoverProvider } from './provider/hover'
import WebpackList from './source'
import { pluginName } from './constant'
import { watchCommand } from './command/watch';
import WebpackErrorList from './source/error'

let output: OutputChannel
let isDisableWhenUseTypeCheck = true

const documentSelector = ['javascript']

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration(pluginName)

  if (!config.get('enable')) {
    return
  }

  isDisableWhenUseTypeCheck = config.get('disableWhenUseTypeCheck')

  if (config.get<string>('trace.server', '') !== 'off') {
    output = workspace.createOutputChannel(pluginName)
    logger.init(output)
  }

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      'coc-webpack',
      'wp',
      documentSelector,
      getCompleteProvider(isDisableWhenUseTypeCheck),
      [],
      99
    )
  )

  context.subscriptions.push(
    languages.registerHoverProvider(
      documentSelector,
      getHoverProvider(isDisableWhenUseTypeCheck)
    )
  )

  context.subscriptions.push(
    listManager.registerList(new WebpackList())
  )

  context.subscriptions.push(
    listManager.registerList(new WebpackErrorList(workspace.nvim))
  )

  // add webpack watch command
  watchCommand(context)
}
