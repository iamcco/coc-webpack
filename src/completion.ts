import * as ts from 'typescript/lib/tsserverlibrary'
import { CompletionItemProvider } from 'coc.nvim'
import { CompletionItem } from 'vscode-languageserver-protocol'

import { getIdentifierNode, getNodeLevel } from './util'
import { getConfigKey } from './webpack-config';

export const completeProvider: CompletionItemProvider = {
  provideCompletionItems(document, position): CompletionItem[] {
    if (document.languageId !== 'javascript') {
      return []
    }

    const text = document.getText()
    const offset = document.offsetAt(position)
    const sourceFile = ts.createSourceFile('webpack.config.js', text, ts.ScriptTarget.ES5, true)

    if (sourceFile) {
      const node = getIdentifierNode(sourceFile, offset)
      if (node && node.kind === ts.SyntaxKind.Identifier) {
        const [name, level] = getNodeLevel(node)
        if (level) {
          return getConfigKey(name)
        }
      }
    }

    return []
  }
}
