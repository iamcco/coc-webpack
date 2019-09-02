import { createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'
import { CompletionItemProvider } from 'coc.nvim'
import { CompletionItem } from 'vscode-languageserver-types'

import { getIdentifierNode, getNodeLevel } from './util'
import { getConfigKey, getConfigValue } from './webpack-config';

export const completeProvider: CompletionItemProvider = {
  provideCompletionItems(document, position): CompletionItem[] {
    if (document.languageId !== 'javascript') {
      return []
    }

    const text = document.getText()
    const offset = document.offsetAt(position)
    const sourceFile = createSourceFile('webpack.config.js', text, ScriptTarget.ES5, true)

    if (sourceFile) {
      const node = getIdentifierNode(sourceFile, offset)
      if (node && node.kind === SyntaxKind.Identifier) {
        if (node === node.parent.getChildAt(0)) {
          const [name, level] = getNodeLevel(node)
          if (level) {
            return getConfigKey(name)
          }
        } else if (node === node.parent.getChildAt(2)) {
          const [name, level] = getNodeLevel(node)
          if (level) {
            return getConfigValue(name)
          }
        }
      }
    }

    return []
  }
}
