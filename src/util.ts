import * as ts from 'typescript/lib/tsserverlibrary'

export function findNode(sourceFile: ts.SourceFile, position: number): ts.Node | undefined {
  function find(node: ts.Node): ts.Node | undefined {
    if (position >= node.getStart() && position <= node.getEnd()) {
      const res = ts.forEachChild(node, find) || node;
      return res
    }
  }
  return find(sourceFile);
}

export function getDeep(node: ts.ObjectLiteralExpression, cur: ts.Node): [string, number] {
  let n = cur
  let count = 1
  let name = ''
  while(n.parent && n.parent !== node) {
    n = n.parent
    if (n && n.kind === ts.SyntaxKind.PropertyAssignment) {
      name = name === '' ? (n as ts.PropertyAssignment).name.getText() : `${(n as ts.PropertyAssignment).name.getText()}.${name}`
      count += 1
    }
  }
  return [name, count]
}

export function getIdentifierNode(sourceFile: ts.SourceFile, position: number): ts.Node | undefined {
  const node = findNode(sourceFile, position)
  if (
    node && node.kind === ts.SyntaxKind.Identifier &&
    node.parent &&
    (
      node.parent.kind === ts.SyntaxKind.ShorthandPropertyAssignment ||
      node.parent.kind === ts.SyntaxKind.PropertyAssignment
    )
  ) {
    return node
  }
  return
}

export function getNodeLevel(node: ts.Node): [string, number] {
  let n = node
  let deep = 0
  let name = ''
  while(n && n.parent) {
    if (n.kind === ts.SyntaxKind.ExpressionStatement && n.parent.kind === ts.SyntaxKind.SourceFile) {
      const be = (<ts.ExpressionStatement>n).expression as ts.BinaryExpression
      if (
        be.left &&
        be.left.kind === ts.SyntaxKind.PropertyAccessExpression &&
        be.left.getText() === 'module.exports'
      ) {
        [name, deep] = getDeep(be.right as ts.ObjectLiteralExpression, node)
        if (deep && node && node.parent && node.parent.kind === ts.SyntaxKind.PropertyAssignment) {
          deep -= 1
        }
      }
      break
    }
    n = n.parent
  }
  return [name, deep]
}
