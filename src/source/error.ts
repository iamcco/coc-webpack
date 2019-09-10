import {
  ListContext,
  ListItem,
  Uri,
  BasicList,
  Neovim
} from 'coc.nvim'
import colors from 'colors/safe';

import { errorList } from '../command/watch'

export default class WebpackErrorList extends BasicList {
  public readonly name = 'webpackErrors'
  public readonly description = 'webpack build error list'
  public readonly defaultAction = 'open'

  constructor(nvim: Neovim) {
    super(nvim)
    this.addLocationActions()
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    return errorList.map<ListItem>(item => ({
      label: `${colors.yellow(item.name)}${colors.gray(`[${item.lnum - 1}-${item.col - 1}]: `)}${colors.red(item.text)}`,
      location: {
        uri: Uri.file(item.filename).toString(),
        range: {
          start: {
            line: item.lnum - 1,
            character: item.col - 1
          },
          end: {
            line: parseInt(item.lnum, 10),
            character: parseInt(item.col, 10)
          }
        }
      }
    }))
  }
}
