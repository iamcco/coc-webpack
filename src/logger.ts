import { OutputChannel } from 'coc.nvim';

let output: OutputChannel
let queue: string[] = []

export const logger = {
  init (param: OutputChannel) {
    output = param
    if (queue.length) {
      queue.forEach(message => {
        logger.log(message)
      })
      queue = undefined
    }
  },

  log(message: string) {
    if (output) {
      output.appendLine(`[coc-webpack]: ${message}`)
    } else {
      queue.push(message)
    }
  }
}
