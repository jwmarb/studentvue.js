module.exports = (api) => {
  api.cache(true);
  return {
    ignore: ['./src/__tests__', '**/*.tests.ts', '/**/*.d.ts'],
    presets: [['@babel/preset-env', { modules: 'umd', targets: { node: 'current' } }], '@babel/preset-typescript'],
    plugins: ['babel-plugin-loop-optimizer'],
  };
};
