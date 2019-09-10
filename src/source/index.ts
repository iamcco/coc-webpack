import {
  IList,
  ListAction,
  ListContext,
  ListItem,
} from 'coc.nvim'
import colors from 'colors/safe';
import { config } from '../webpack-config'

export default class WebpackList implements IList {
  public readonly name = 'webpack'
  public readonly description = 'webpack config options'
  public readonly defaultAction = 'default'
  public actions: ListAction[] = []

  constructor() {
    this.actions.push({
      name: 'default',
      execute: () => {}
    })
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    return Object.keys(config).map(key => {
      return {
        label: `${colors.yellow(key)} - ${[].concat(config[key].doc).join('\n')}`,
        filterText: key
      }
    })
  }
}
