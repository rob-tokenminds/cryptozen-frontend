declare module "vuetify/lib" {
  import "vuetify/types/lib.d";
  import "vue/types/options.d";
}

declare module "console-subscriber";

declare module "abi-decoder";
declare module "vue-native-notification";
declare module "human-readable-numbers" {
  function toHumanString(number: number): string;
}

declare module "from-exponential" {
  function fromExponential(string: string): string;
  export = fromExponential;
}

declare module "vue-native-websocket";

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
}
declare const window: Window;
