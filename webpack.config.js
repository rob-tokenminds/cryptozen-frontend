// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VuetifyLoaderPlugin } = require("vuetify-loader");

exports.plugins.push(new VuetifyLoaderPlugin());

// exports = {
//   output: {
//     path: path.join(__dirname, "dist"),
//     filename: path.join("[name]", "index.js"),
//     library: "Eth",
//     libraryTarget: "umd", // exposes and know when to use module.exports or exports.
//   },
//   plugins: [new VuetifyLoaderPlugin()],
// };
