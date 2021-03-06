import { createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'
import { CompletionItemProvider, workspace } from 'coc.nvim'
import { CompletionItem } from 'vscode-languageserver-types'

import { getNode, getNodeLevel } from '../util'
import { getConfigKey, getConfigValue } from '../webpack-config';

export const getCompleteProvider = (isDisableWhenUseTypeCheck: boolean): CompletionItemProvider => {
  return {
    provideCompletionItems(document, position): CompletionItem[] {
      if (
        document.languageId !== 'javascript' ||
        !/webpack\.config\.js$/.test(document.uri)
      ) {
        return []
      }

      const text = document.getText()
      const offset = document.offsetAt(position)
      const sourceFile = createSourceFile('webpack.config.js', text, ScriptTarget.ES5, true)

      if (sourceFile) {
        const node = getNode(sourceFile, offset)
        if (node && node.kind === SyntaxKind.Identifier) {
          if (node === node.parent.getChildAt(0)) {
            const [name, level] = getNodeLevel(node, isDisableWhenUseTypeCheck)
            if (level) {
              return getConfigKey(name)
            }
          } else if (node === node.parent.getChildAt(2)) {
            const [name, level] = getNodeLevel(node, isDisableWhenUseTypeCheck)
            if (level) {
              return getConfigValue(name)
            }
          }
        } else if (node && node.kind === SyntaxKind.ObjectLiteralExpression) {
            const [name, level] = getNodeLevel(node, isDisableWhenUseTypeCheck)
            if (level) {
              return getConfigKey(name)
            }
        }
      }

      return []
    }
  }
}
