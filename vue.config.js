const packageJSON = require("./package.json");
const files = {
  renderer: {
    entry: "./src/rendererProcess/index.ts",
    template: "./src/rendererProcess/index.html"
  },
  main: {
    preload: "./src/mainProcess/preload.ts",
    entry: "./src/mainProcess/index.ts"
  },
  appxConfig: "./electron.config.appx.js"
}
let appxConfig = null;
try {
  appxConfig = require(files.appxConfig);
} catch (err) {
  console.error(`Cannot build appx. '${files.appxConfig}' is not found.`);
}
module.exports = {
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      preload: files.main.preload,
      mainProcessFile: files.main.entry,
      chainWebpackMainProcess: (config) => {
        config.module
          .rule('images')
          .test(/\.(png)(\?.*)?$/)
          .use('url-loader')
          .loader('url-loader')
      },
      chainWebpackRendererProcess: (config) => {
        config
          .entry("app")
          .clear();
        config
          .entry("app")
          .add(files.renderer.entry);
        config.plugin('html')
          .tap((args) => {
            args[0].template = files.renderer.template
            return args;
          })
        config.module
          .rule("vue")
          .use("vue-loader")
          .tap(options => {
            options.hotReload = false
            return options
          });
        config.module
          .rule("images")
          .test(/\.(png)(\?.*)?$/)
          .use("url-loader")
          .loader('url-loader')
          // .options({
          //   limit: 8192,
          //   name: `assets/[name].[hash].[ext]`
          // });
      },
      builderOptions: {
        appId: "io.takumus." + packageJSON.name,
        productName: packageJSON.productName,
        asar: true,
        directories: {
          buildResources: "build",
          output: "dist_electron"
        },
        win: {
          icon: "build/icon.ico",
          target: ["nsis", ...(appxConfig ? ["appx"] : [])]
        },
        mac: {
           icon: "build/MacIcon.png"
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          deleteAppDataOnUninstall: true
        },
        ...appxConfig
      }
    }
  }
}