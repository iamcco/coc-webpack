import { CompletionItem, InsertTextFormat, CompletionItemKind } from 'vscode-languageserver-types';

import { marketUp, serializeLabel } from './util';

// webpack config version: v4.39.2
type Node = Record<string, {
  value: string | string[] | Array<{ value: string, doc: string | string[]}>,
  doc: string | string[]
}>

const config: Node = {
  mode: {
    value: [
      {
        value: "'production'",
        doc: 'enable many optimizations for production builds'
      }, {
        value: "'development'",
        doc: 'enabled useful tools for development'
      }, {
        value: "'none'",
        doc: 'no defaults'
      }
    ],
    doc: 'Chosen mode tells webpack to use its built-in optimizations accordingly.'
  },
  entry: {
    value: [
      {
        value: "'./app/entry'",
        doc: 'string'
      },
      {
        value: "['./app/entry1', './app/entry2']",
        doc: 'array'
      },
      {
        value: "{ a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2'] }",
        doc: 'object'
      }
    ],
    doc: 'defaults to ./src Here the application starts executing and webpack starts bundling'
  },
  output: {
    value: '{}',
    doc: 'options related to how webpack emits results'
  },
  'output.path': {
    value: [
      {
        value: "path.resolve(__dirname, 'dist')",
        doc: 'string'
      },
    ],
    doc: 'the target directory for all output files must be an absolute path (use the Node.js path module)'
  },
  'output.filename': {
    value: [
      {
        value: "'bundle.js'",
        doc: 'string'
      },
      {
        value: "'[name].js'",
        doc: 'for multiple entry points'
      },
      {
        value: "'[chunkhash].js'",
        doc: 'for long term caching'
      }
    ],
    doc: 'the filename template for entry chunks'
  },
  'output.publicPath': {
    value: [
      {
        value: "'/assets/'",
        doc: 'string'
      },
      {
        value: "'https://cdn.example.com/'",
        doc: 'url'
      }
    ],
    doc: 'the url to the output directory resolved relative to the HTML page'
  },
  'output.library': {
    value: [
      {
        value: "'MyLibrary'",
        doc: 'string'
      }
    ],
    doc: 'the name of the exported library'
  },
  'output.libraryTarget': {
    value: [
      {
        value: "'umd'",
        doc: 'universal module definition'
      },
      {
        value: "'umd2'",
        doc: 'universal module definition'
      },
      {
        value: "'commonjs2'",
        doc: 'exported with module.exports'
      },
      {
        value: "'commonjs'",
        doc: 'exported as properties to exports'
      },
      {
        value: "'amd'",
        doc: 'defined with AMD defined method'
      },
      {
        value: "'this'",
        doc: 'property set on this'
      },
      {
        value: "'var'",
        doc: 'variable defined in root scope'
      },
      {
        value: "'assign'",
        doc: 'blind assignment'
      },
      {
        value: "'window'",
        doc: 'property set to window object'
      },
      {
        value: "'global'",
        doc: 'property set to global object'
      },
      {
        value: "'jsonp'",
        doc: 'jsonp wrapper'
      },
    ],
    doc: 'the type of the exported library'
  },
  'output.pathinfo': {
    value: [
      {
        value: "true",
        doc: 'boolean'
      }
    ],
    doc: 'include useful path info about modules, exports, requests, etc. into the generated cod'
  },
  'output.chunkFilename': {
    value: [
      {
        value: "'[id].js'",
        doc: ''
      },
      {
        value: "'[chunkhash].js'",
        doc: 'for long term caching'
      }
    ],
    doc: 'the filename template for additional chunks'
  },
  'output.jsonpFunction': {
    value: [
      {
        value: "'myWebpackJsonp'",
        doc: 'string'
      }
    ],
    doc: 'name of the JSONP function used to load chunks'
  },
  'output.sourceMapFilename': {
    value: [
      {
        value: "'[file].map'",
        doc: 'string'
      },
      {
        value: "'sourcemaps/[file].map'",
        doc: 'string'
      }
    ],
    doc: 'the filename template of the source map location'
  },
  'output.devtoolModuleFilenameTemplate': {
    value: [
      {
        value: "'webpack:///[resource-path]'",
        doc: 'string'
      }
    ],
    doc: 'the name template for modules in a devtool'
  },
  'output.devtoolFallbackModuleFilenameTemplate': {
    value: [
      {
        value: "'webpack:///[resource-path]?[hash]'",
        doc: 'string'
      }
    ],
    doc: 'the name template for modules in a devtool (used for conflicts)'
  },
  'output.umdNamedDefine': {
    value: [
      {
        value: "true",
        doc: 'boolean'
      }
    ],
    doc: 'use a named AMD module in UMD library'
  },
  'output.crossOriginLoading': {
    value: [
      {
        value: "'use-credentials'",
        doc: 'enum'
      },
      {
        value: "'anonymous'",
        doc: 'enum'
      },
      {
        value: "false",
        doc: 'enum'
      }
    ],
    doc: 'specifies how cross origin request are issued by the runtime'
  },
  'output.devtoolLineToLine.test': {
    value: [
      {
        value: "/\\.jsx$/",
        doc: 'regex'
      },
    ],
    doc: 'use a simple 1:1 mapped SourceMaps for these modules (faster)'
  },
  'output.hotUpdateMainFilename': {
    value: [
      {
        value: "'[hash].hot-update.json'",
        doc: 'string'
      },
    ],
    doc: 'filename template for HMR manifest'
  },
  'output.hotUpdateChunkFilename': {
    value: [
      {
        value: "'[id].[hash].hot-update.js'",
        doc: 'string'
      },
    ],
    doc: 'filename template for HMR chunks'
  },
  'output.sourcePrefix': {
    value: [
      {
        value: "'\\t'",
        doc: 'string'
      },
    ],
    doc: 'prefix module sources in bundle for better readablitity'
  },
  module: {
    value: '{}',
    doc: 'configuration regarding modules'
  },
  'module.rules': {
    value: [
      {
        value: "[{}]",
        doc: ''
      }
    ],
    doc: 'rules for modules (configure loaders, parser options, etc.)'
  },
  'module.rules.test': {
    value: [
      {
        value: "/\\.jsx?$/",
        doc: 'regex'
      }
    ],
    doc: [
      'these are matching conditions, each accepting a regular expression or string',
      'test and include have the same behavior, both must be matched',
      'exclude must not be matched (takes preferrence over test and include)',
      'Best practices:',
      '- Use RegExp only in test and for filename matching',
      '- Use arrays of absolute paths in include and exclude',
      '- Try to avoid exclude and prefer include'
    ]
  },
  'module.rules.include': {
    value: [
      {
        value: "[\n\tpath.resolve(__dirname, 'app')\n]"
        ,
        doc: 'regex'
      }
    ],
    doc: [
      'these are matching conditions, each accepting a regular expression or string',
      'test and include have the same behavior, both must be matched',
      'exclude must not be matched (takes preferrence over test and include)',
      'Best practices:',
      '- Use RegExp only in test and for filename matching',
      '- Use arrays of absolute paths in include and exclude',
      '- Try to avoid exclude and prefer include'
    ]
  },
  'module.rules.exclude': {
    value: [
      {
        value: "[\n\tpath.resolve(__dirname, 'app/demo-files')\n]",
        doc: 'regex'
      }
    ],
    doc: [
      'these are matching conditions, each accepting a regular expression or string',
      'test and include have the same behavior, both must be matched',
      'exclude must not be matched (takes preferrence over test and include)',
      'Best practices:',
      '- Use RegExp only in test and for filename matching',
      '- Use arrays of absolute paths in include and exclude',
      '- Try to avoid exclude and prefer include'
    ]
  },
  'module.rules.issuer': {
    value: [
      {
        value: '{}',
        doc: 'object'
      }
    ],
    doc: 'conditions for the issuer (the origin of the import)'
  },
  'module.rules.issuer.test': {
    value: [
      {
        value: "/\\.jsx?$/",
        doc: 'regex'
      }
    ],
    doc: [
      'these are matching conditions, each accepting a regular expression or string',
      'test and include have the same behavior, both must be matched',
      'exclude must not be matched (takes preferrence over test and include)',
      'Best practices:',
      '- Use RegExp only in test and for filename matching',
      '- Use arrays of absolute paths in include and exclude',
      '- Try to avoid exclude and prefer include'
    ]
  },
  'module.rules.issuer.include': {
    value: [
      {
        value: "[\n\tpath.resolve(__dirname, 'app')\n]",
        doc: 'regex'
      }
    ],
    doc: [
      'these are matching conditions, each accepting a regular expression or string',
      'test and include have the same behavior, both must be matched',
      'exclude must not be matched (takes preferrence over test and include)',
      'Best practices:',
      '- Use RegExp only in test and for filename matching',
      '- Use arrays of absolute paths in include and exclude',
      '- Try to avoid exclude and prefer include'
    ]
  },
  'module.rules.issuer.exclude': {
    value: [
      {
        value: "[\n\tpath.resolve(__dirname, 'app/demo-files')\n]",
        doc: 'regex'
      }
    ],
    doc: [
      'these are matching conditions, each accepting a regular expression or string',
      'test and include have the same behavior, both must be matched',
      'exclude must not be matched (takes preferrence over test and include)',
      'Best practices:',
      '- Use RegExp only in test and for filename matching',
      '- Use arrays of absolute paths in include and exclude',
      '- Try to avoid exclude and prefer include'
    ]
  },
  'module.rules.enforce': {
    value: [
      "'pre'",
      "'post'"
    ],
    doc: 'flags to apply these rules, even if they are overridden (advanced option)'
  },
  'module.rules.loader': {
    value: [
      "'babel-loader'"
    ],
    doc: [
      'the loader which should be applied, it\'ll be resolved relative to the context',
      '-loader suffix is no longer optional in webpack2 for clarity reasons',
      'see webpack 1 upgrade guide'
    ]
  },
  'module.rules.options': {
    value: [
      "{}"
    ],
    doc: 'options for the loader'
  },
  'module.rules.use': {
    value: [
      "[]"
    ],
    doc: 'apply multiple loaders and options'
  },
  'module.rules.oneOf': {
    value: [
      "[]"
    ],
    doc: 'only use one of these nested rules'
  },
  'module.rules.rules': {
    value: [
      "[]"
    ],
    doc: 'use all of these nested rules (combine with conditions to be useful)'
  },
  'module.rules.resource': {
    value: [
      {
        value: "[]",
        doc: 'matches if any condition is matched (default for arrays)'
      },
      {
        value: "{}",
        doc: ''
      }
    ],
    doc: 'matches conditions'
  },
  'module.rules.resource.and': {
    value: '[]',
    doc: 'matches only if all conditions are matched'
  },
  'module.rules.resource.or': {
    value: '[]',
    doc: 'matches if any condition is matched (default for arrays)'
  },
  'module.rules.resource.not': {
    value: '',
    doc: 'matches if the condition is not matched'
  },
  'module.noParse': {
    value: '[/special-library\\.js$/]',
    doc: 'do not parse this module'
  },
  'module.unknownContextRequest': {
    value: "'.'",
    doc: ''
  },
  'module.unknownContextRecursive': {
    value: 'true',
    doc: ''
  },
  'module.unknownContextRegExp': {
    value: '/^\\.\\/.*$/',
    doc: ''
  },
  'module.unknownContextCritical': {
    value: 'true',
    doc: ''
  },
  'module.exprContextRequest': {
    value: "'.'",
    doc: ''
  },
  'module.exprContextRegExp': {
    value: '/^\\.\\/.*$/',
    doc: ''
  },
  'module.exprContextRecursive': {
    value: 'true',
    doc: ''
  },
  'module.exprContextCritical': {
    value: 'true',
    doc: ''
  },
  'module.wrappedContextRegExp': {
    value: '/.*/',
    doc: ''
  },
  'module.wrappedContextRecursive': {
    value: 'true',
    doc: ''
  },
  'module.wrappedContextCritical': {
    value: 'false',
    doc: 'specifies default behavior for dynamic requests'
  },
  resolve: {
    value: '{}',
    doc: [
      'options for resolving module requests',
      '(does not apply to resolving to loaders)'
    ]
  },
  'resolve.modules': {
    value: "[]",
    doc: 'directories where to look for modules'
  },
  'resolve.extensions': {
    value: "['.js', '.json', '.jsx', '.css']",
    doc: 'extensions that are used'
  },
  'resolve.alias': {
    value: '{}',
    doc: 'a list of module name aliases'
  },
  'resolve.alias.module': {
    value: [
      {
        value: "'new-module'",
        doc: 'alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"'
      },
      {
        value: "path.resolve(__dirname, 'app/third/module.js')",
        doc: [
          "alias 'module' -> './app/third/module.js' and 'module/file' results in error",
          "modules aliases are imported relative to the current context"
        ]
      }
    ],
    doc: 'alias "module" -> "new-module"'
  },
  'resolve.alias.only-module$': {
    value: "'new-module'",
    doc: 'alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"'
  },
  'resolve.symlinks': {
    value: 'true',
    doc: 'follow symlinks to new location'
  },
  'resolve.descriptionFiles': {
    value: "['package.json']",
    doc: 'files that are read for package description'
  },
  'resolve.mainFields': {
    value: "['main']",
    doc: [
      'properties that are read from description file',
      'when a folder is requested'
    ]
  },
  'resolve.aliasFields': {
    value: "['browser']",
    doc: [
      'properites that are read from description file',
      'to alias requests in this package'
    ]
  },
  'resolve.enforceExtension': {
    value: 'false',
    doc: [
      'if true request must not include an extension',
      'if false request may already include an extension'
    ]
  },
  'resolve.moduleExtensions': {
    value: "['-module']",
    doc: ''
  },
  'resolve.enforceModuleExtension': {
    value: 'false',
    doc: 'like extensions/enforceExtension but for module names instead of files'
  },
  'resolve.unsafeCache': {
    value: [
      {
        value: 'true',
        doc: ''
      },
      {
        value: '{}',
        doc: [
          'enables caching for resolved requests',
          'this is unsafe as folder structure may change',
          'but performance improvement is really big'
        ]
      }
    ],
    doc: ''
  },
  'resolve.cachePredicate': {
    value: '(path, request) => true',
    doc: 'predicate function which selects requests for caching'
  },
  'resolve.plugins': {
    value: '[]',
    doc: 'additional plugins applied to the resolver'
  },
  performance: {
    value: '{}',
    doc: ''
  },
  'performance.hints': {
    value: [
      {
        value: "'warning'",
        doc: 'enum'
      },
      {
        value: "'error'",
        doc: 'emit errors for perf hints'
      },
      {
        value: 'false',
        doc: 'turn off perf hints'
      }
    ],
    doc: ''
  },
  'performance.maxAssetSize': {
    value: '200000',
    doc: 'int (in bytes)'
  },
  'performance.maxEntrypointSize': {
    value: '400000',
    doc: 'int (in bytes)'
  },
  'performance.assetFilter': {
    value: "function(assetFilename) {\n\treturn assetFilename.endsWith('.css') || assetFilename.endsWith('.js');\n\t}",
    doc: 'Function predicate that provides asset filenames'
  },
  devtool: {
    value: [
      {
        value: "'source-map'",
        doc: 'enum'
      },
      {
        value: "'inline-source-map'",
        doc: 'inlines SourceMap into original file'
      },
      {
        value: "'eval-source-map'",
        doc: 'inlines SourceMap per module'
      },
      {
        value: "'hidden-source-map'",
        doc: 'SourceMap without reference in original file'
      },
      {
        value: "'cheap-source-map'",
        doc: 'cheap-variant of SourceMap without module mappings'
      },
      {
        value: "'cheap-module-source-map'",
        doc: 'cheap-variant of SourceMap with module mappings'
      },
      {
        value: "'eval'",
        doc: 'no SourceMap, but named modules. Fastest at the expense of detail.'
      },
    ],
    doc: [
      'enhance debugging by adding meta info for the browser devtools',
      'source-map most detailed at the expense of build speed.'
    ]
  },
  context: {
    value: '__dirname',
    doc: [
      'string (absolute path!)',
      'the home directory for webpack',
      'the entry and module.rules.loader option',
      '  is resolved relative to this directory'
    ]
  },
  target: {
    value: [
      {
        value: "'web'",
        doc: 'enum'
      },
      {
        value: "'webworker'",
        doc: 'WebWorker'
      },
      {
        value: "'node'",
        doc: 'Node.js via require'
      },
      {
        value: "'async-node'",
        doc: 'Node.js via fs and vm'
      },
      {
        value: "'node-webkit'",
        doc: 'nw.js'
      },
      {
        value: "'electron-main'",
        doc: 'electron, main process'
      },
      {
        value: "'electron-renderer'",
        doc: 'electron, renderer process'
      },
      {
        value: "(compiler) => { /* ... */ }",
        doc: 'custom'
      },
    ],
    doc: [
      'the environment in which the bundle should run',
      'changes chunk loading behavior and available modules'
    ]
  },
  externals: {
    value: [
      {
        value: "['react', /^@angular/]",
        doc: ''
      },
      {
        value: "'react'",
        doc: 'string (exact match)'
      },
      {
        value: "/^[a-z\\-]+($|\\/)/",
        doc: 'Regex'
      },
      {
        value: "{ \tangular: 'this angular', // this['angular']\n \treact: { // UMD\n \t\tcommonjs: 'react',\n \t\tcommonjs2: 'react',\n \t\tamd: 'react',\n \t\troot: 'React'\n \t}\n }",
        doc: 'object'
      },
      {
        value: "(request) => { /* ... */ return 'commonjs ' + request }",
        doc: 'Function'
      },
    ],
    doc: 'Don\'t follow/bundle these modules, but request them at runtime from the environment'
  },
  serve: {
    value: '{}',
    doc: 'lets you provide options for webpack-serve'
  },
  'serve.port': {
    value: '1337',
    doc: ''
  },
  'serve.content': {
    value: "'./dist'",
    doc: ''
  },
  stats: {
    value: [
      {
        value: "'errors-only'",
        doc: ''
      },
      {
        value: '{ //object\n \tassets: true,\n \tcolors: true,\n \terrors: true,\n \terrorDetails: true,\n \thash: true,\n }',
        doc: 'object'
      }
    ],
    doc: 'lets you precisely control what bundle information gets displayed'
  },
  devServer: {
    value: '{}',
    doc: ''
  },
  'devServer.proxy': {
    value: '{}',
    doc: 'proxy URLs to backend development server'
  },
  'devServer.contentBase': {
    value: "path.join(__dirname, 'public')",
    doc: 'boolean | string | array, static file location'
  },
  'devServer.compress': {
    value: 'true',
    doc: 'enable gzip compression'
  },
  'devServer.historyApiFallback': {
    value: 'true',
    doc: 'true for index.html upon 404, object for multiple paths'
  },
  'devServer.hot': {
    value: 'true',
    doc: 'hot module replacement. Depends on HotModuleReplacementPlugin'
  },
  'devServer.https': {
    value: 'false',
    doc: 'true for self-signed, object for cert authority'
  },
  'devServer.noInfo': {
    value: 'true',
    doc: 'only errors & warns on hot reload'
  },
  plugins: {
    value: '[]',
    doc: 'list of additional plugins'
  },
  resolveLoader: {
    value: '{ /* same as resolve */ }',
    doc: 'separate resolve options for loaders'
  },
  parallelism: {
    value: '1',
    doc: 'limit the number of parallel processed modules'
  },
  profile: {
    value: 'true',
    doc: 'capture timing information'
  },
  bail: {
    value: 'true',
    doc: 'fail out on the first error instead of tolerating it.'
  },
  cache: {
    value: 'false',
    doc: 'disable/enable caching'
  },
  watch: {
    value: 'true',
    doc: 'enables watching'
  },
  watchOptions: {
    value: '{}',
    doc: 'object'
  },
  'watchOptions.aggregateTimeout': {
    value: '1000',
    doc: 'in ms, aggregates multiple changes to a single rebuild'
  },
  'watchOptions.poll': {
    value: [
      {
        value: 'true',
        doc: ''
      },
      {
        value: '500',
        doc: 'intervall in ms'
      }
    ],
    doc: [
      'enables polling mode for watching',
      'must be used on filesystems that doesn\'t notify on change',
      'i. e. nfs shares'
    ]
  },
  node: {
    value: '{}',
    doc: [
      'Polyfills and mocks to run Node.js',
      'environment code in non-Node environments.'
    ]
  },
  'node.console': {
    value: 'false',
    doc: 'boolean | "mock"'
  },
  'node.global': {
    value: 'true',
    doc: 'boolean | "mock"'
  },
  'node.process': {
    value: 'true',
    doc: 'boolean'
  },
  'node.__filename': {
    value: "'mock'",
    doc: 'boolean | "mock"'
  },
  'node.__dirname': {
    value: "'mock'",
    doc: 'boolean | "mock"'
  },
  'node.Buffer': {
    value: 'true',
    doc: 'boolean | "mock"'
  },
  'node.setImmediate': {
    value: 'true',
    doc: 'boolean | "mock" | "empty"'
  },
  recordsPath: {
    value: "path.resolve(__dirname, 'build/records.json'),",
    doc: ''
  },
  recordsInputPath: {
    value: "path.resolve(__dirname, 'build/records.json'),",
    doc: ''
  },
  recordsOutputPath: {
    value: "path.resolve(__dirname, 'build/records.json'),",
    doc: ''
  }
}

const getDefaultValue = (key: string): string => {
  let insertText = ''
  let value = config[key].value
  if (typeof value === 'string') {
    insertText = value
  } else if (Array.isArray(value) && value.length > 0) {
    if (typeof value[0] === 'string') {
      insertText = value[0] as string
    } else {
      const v = (value[0] as any).value
      if (typeof v === 'string'){
        insertText = v
      }
    }
  }
  if (insertText === '{}') {
    return '{\n\t${1}\n}'
  } else if (insertText === '[]') {
    return '[\n\t${1}\n]'
  } else if (insertText === '[{}]') {
    return '[\n\t{\n\t\t${1}\n\t}\n]'
  }
  return `\${1:${insertText}}`
}

export function getConfigValue(name: string): CompletionItem[] {
  const res: CompletionItem[] = []
  if (config[name]) {
    const item = config[name]
    if (typeof item.value === 'string') {
      res.push({
        label: item.value,
        kind: CompletionItemKind.Value,
        documentation: marketUp(item.doc, item.value),
        insertText: item.value,
        insertTextFormat: InsertTextFormat.PlainText
      })
    } else if (Array.isArray(item.value)) {
      (item.value as any[]).forEach(v => {
        if (typeof v === 'string') {
          res.push({
            label: serializeLabel(v),
            kind: CompletionItemKind.Value,
            documentation: marketUp(item.doc, v),
            sortText: '0',
            insertText: v,
            insertTextFormat: InsertTextFormat.PlainText
          })
        }
        res.push({
          label: serializeLabel(v.value),
          kind: CompletionItemKind.Value,
          documentation: marketUp(
            [].concat(v.doc).concat('').concat(item.doc),
            v.value
          ),
          sortText: '0',
          insertText: v.value,
          insertTextFormat: InsertTextFormat.PlainText
        })
      })
    }
  }
  return res
}

export function getConfigKey(name: string): CompletionItem[] {
  const regex = new RegExp(`^${name}\\.(\\w+)`)
  const res: CompletionItem[] = []
  const tmp: Record<string, boolean> = {}
  Object.keys(config).forEach(key => {
    if (name === '') {
      const label = key.split('.')
      if (label.length !== 1) {
        return
      }
      const insertText = getDefaultValue(key)
      return res.push({
        label: key,
        kind: CompletionItemKind.EnumMember,
        documentation: [].concat(config[key].doc).join('\n'),
        sortText: '0',
        insertText: `${key}: ${insertText},\${0}`,
        insertTextFormat: InsertTextFormat.Snippet,
      })
    }
    const m = key.match(regex)
    if (m) {
      if (tmp[m[1]]) {
        return
      }
      tmp[m[1]] = true
      const insertText = getDefaultValue(key)
      res.push({
        label: m[1],
        kind: CompletionItemKind.EnumMember,
        documentation: [].concat(config[key].doc).join('\n'),
        sortText: '0',
        insertText: `${m[1]}: ${insertText},\${0}`,
        insertTextFormat: InsertTextFormat.Snippet,
      })
    }
  })
  return res
}
