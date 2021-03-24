// const WithoutWatchers = {
//   methods: {
//     $withoutWatchers (cb) {
//       const watchers = this._watchers.map((watcher) => ({ cb: watcher.cb, sync: watcher.sync }))

//       for (let index in this._watchers) {
//         this._watchers[index] = Object.assign(this._watchers[index], { cb: () => null, sync: true })
//       }

//       cb()

//       for (let index in this._watchers) {
//         this._watchers[index] = Object.assign(this._watchers[index], watchers[index])
//       }
//     }
//   }
// }

import Vue from "vue";
import Component from "vue-class-component";

@Component
export class WithoutWatchers extends Vue {
  private _watchers: any;
  $withoutWatchers(cb?: any): void {
    const watchers = this._watchers.map((watcher: any) => ({
      cb: watcher.cb,
      sync: watcher.sync,
    }));

    for (const index in this._watchers) {
      this._watchers[index] = Object.assign(this._watchers[index], {
        cb: () => null,
        sync: true,
      });
    }

    cb();

    for (const index in this._watchers) {
      this._watchers[index] = Object.assign(
        this._watchers[index],
        watchers[index]
      );
    }
  }
}
