const { build } = require('esbuild')

const options = {
  stdio: 'inherit',
  entryPoints: ['./src/index.ts'],
  outfile: './esdist/game.js',
  minify: true,
  bundle: true,
//   sourcemap: true
}

build(options).catch(() => process.exit(1))
