import { Node, ObjectLiteralExpression, SourceFile, forEachChild, SyntaxKind, PropertyAssignment, ExpressionStatement, BinaryExpression, JSDoc } from 'typescript'
import { MarkupContent, MarkupKind } from 'vscode-languageserver-types';

export function findNode(sourceFile: SourceFile, position: number): Node | undefined {
  function find(node: Node): Node | undefined {
    if (position >= node.getStart() && position <= node.getEnd()) {
      const res = forEachChild(node, find) || node;
      return res
    }
  }
  return find(sourceFile);
}

export function getDeep(node: ObjectLiteralExpression, cur: Node): [string, number] {
  let n = cur
  let count = 1
  let name = ''
  while(n.parent && n.parent !== node) {
    n = n.parent
    if (n && n.kind === SyntaxKind.PropertyAssignment) {
      name = name === '' ? (n as PropertyAssignment).name.getText() : `${(n as PropertyAssignment).name.getText()}.${name}`
      count += 1
    }
  }
  return [name, count]
}

export function getIdentifierNode(sourceFile: SourceFile, position: number): Node | undefined {
  const node = findNode(sourceFile, position)
  if (
    node && node.kind === SyntaxKind.Identifier &&
    node.parent &&
    (
      node.parent.kind === SyntaxKind.ShorthandPropertyAssignment ||
      node.parent.kind === SyntaxKind.PropertyAssignment
    )
  ) {
    return node
  }
  return
}

export function getNodeLevel(node: Node, isDisableWhenUseTypeCheck: boolean): [string, number] {
  let n = node
  let deep = 0
  let name = ''
  while(n && n.parent) {
    if (n.kind === SyntaxKind.ExpressionStatement && n.parent.kind === SyntaxKind.SourceFile) {
      const rootNode = <ExpressionStatement>n
      const be = rootNode.expression as BinaryExpression
      const jsDoc = (rootNode as any).jsDoc as JSDoc[]
      if (isDisableWhenUseTypeCheck && jsDoc && jsDoc.length) {
        if (jsDoc.some(jsDoc => /import\s*\(('|")webpack\1\)/.test(jsDoc.getText()))) {
          deep = 0
          break
        }
      }
      if (
        be.left &&
        be.left.kind === SyntaxKind.PropertyAccessExpression &&
        be.left.getText() === 'module.exports'
      ) {
        [name, deep] = getDeep(be.right as ObjectLiteralExpression, node)
        if (deep && node && node.parent && node.parent.kind === SyntaxKind.PropertyAssignment) {
          deep -= 1
        }
      }
      break
    }
    n = n.parent
  }
  return [name, deep]
}

export function marketUp (content: string | string[], code?: string | string[]): MarkupContent {
  let res: string[] = []
  if (code) {
    res = [
      '``` javascript',
      ...[].concat(code),
      '```',
      ''
    ]
  }
  res = res.concat(content)
  return {
    kind: MarkupKind.Markdown,
    value: res.join('\n')
  }
}

export function serializeLabel (label: string): string {
  return label.replace(/[^0-9a-zA-Z_-]/g, '')
}
