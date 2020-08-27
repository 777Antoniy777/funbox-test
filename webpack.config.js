const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimizeBuild = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ];
  }

  return config;
};

const setFilename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const setHTMLFilename = () => isDev ? `./index.html` : `./index.[hash].html`;

const createCSSLoader = (addLoader) => {
  const loader = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + '/';
        },
        esModule: true,
      },
    },
    'css-loader',
  ];

  if (addLoader) loader.push(addLoader);

  return loader;
};

const createFileLoader = () => {
  const loader = [
    {
      loader: 'file-loader',
      options: {
        name: `[path]${setFilename('[ext]')}`,
      },
    }
  ];

  return loader;
};

const createJSOptions = (addPreset) => {
  const options = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };

  if (addPreset) options.presets.push(addPreset);

  return options;
};

const createJSLoader = (addPreset) => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: createJSOptions(addPreset),
    },
  ];

  if (isDev) loaders.push('eslint-loader');

  return loaders;
};

const createPlugins = () => {
  const initialPlugins = [
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: setHTMLFilename(),
      minify: {
        collapseWhitespace: isProd,
      }
    }),
    new MiniCssExtractPlugin({
      filename: `css/${setFilename('css')}`,
      chunkFilename: `css/[name]/${setFilename('css')}`,
    }),
    new CleanWebpackPlugin(),
  ];

  return initialPlugins;
};

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    'bundle': ["@babel/polyfill", './index.tsx'],
  },
  output: {
    filename: (pathData) => {
      return pathData.chunk.name === 'bundle' ? `js/${setFilename('js')}`: `js/[name]/${setFilename('js')}`;
    },
    chunkFilename: `js/[name]/${setFilename('js')}`,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [`.ts`, `.tsx`, `.js`, `json`],
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  optimization: optimizeBuild(),
  devServer: {
    port: 8080,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : '',
  plugins: createPlugins(),
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: true,
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: createJSLoader(),
      },
      {
        test: /\.(tsx|ts)?$/,
        exclude: /node_modules/,
        loader: `ts-loader`,
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: createJSLoader('@babel/preset-react'),
      },
      {
        test: /\.css$/,
        use: createCSSLoader(),
      },
      {
        test: /\.less$/,
        use: createCSSLoader('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: createCSSLoader('sass-loader'),
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: createFileLoader(),
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: createFileLoader(),
      },
    ],
  },
};
