import { HoverProvider } from 'coc.nvim'
import { createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'
import { Hover } from 'vscode-languageserver-types'

import { getIdentifierNode, getNodeLevel } from '../util'
import { getConfigDoc } from '../webpack-config'

export const getHoverProvider = (isDisableWhenUseTypeCheck: boolean): HoverProvider => {
  return {
    provideHover(document, position): Hover | null {
      if (
        document.languageId !== 'javascript' ||
        !/webpack\.config\.js$/.test(document.uri)
      ) {
        return null
      }

      const text = document.getText()
      const offset = document.offsetAt(position)
      const sourceFile = createSourceFile('webpack.config.js', text, ScriptTarget.ES5, true)

      if (sourceFile) {
        const node = getIdentifierNode(sourceFile, offset)
        if (node && node.kind === SyntaxKind.Identifier) {
          if (node === node.parent.getChildAt(0)) {
            const [name, level] = getNodeLevel(node, isDisableWhenUseTypeCheck)
            if (level) {
              return getConfigDoc(name)
            }
          }
        }
      }

      return null
    }
  }
}
