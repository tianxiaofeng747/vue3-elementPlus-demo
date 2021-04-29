/*
 * @Author: yangjj
 * @Date: 2020-02-05 14:02:23
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-29 16:41:32
 * @Description: file content
 */
const DATABASE = 'table_set';
const VERSION = 1;
const DATABASETABLE = 'table';
interface ConfigValue {
    id: string,
    hash: string,
    config: Array<unknown>
}

class DB  {
    private db: unknown;
    private pageKey: string;
    public isGetData: boolean;
    constructor (pageKey:string) {
        this.db = {};
        this.pageKey = pageKey;
        this.isGetData = false;
    }
    // 创建数据库
    initIndexDB ():Promise<ConfigValue> {
        return new Promise((resolve) => {
            const indexedDB = window.indexedDB;
            const request = indexedDB.open(DATABASE, VERSION);
            request.onerror = (event) => {
                console.log('打开数据库失败:' + event.target);
            };
            request.onsuccess = (event) => {
                // console.log('打开数据库成功!');
                this.db = event.target.result;
                if (this.db) {
                    this.getDataDB().then(data => {
                        resolve(data);
                    });
                }
            };
            request.onupgradeneeded = (event) => {
                console.log('版本变化!');
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains(DATABASETABLE)) {
                    this.db.createObjectStore(DATABASETABLE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
            };
        });
    }
    // 创建事务
    createTransaction () {
        return this.db.transaction(DATABASETABLE, 'readwrite').objectStore(DATABASETABLE);
    }
    // 查
    getDataDB () {
        return new Promise(resolve => {
            const objectStore = this.createTransaction();
            const request = objectStore.get(this.pageKey);
            request.onsuccess = (e) => {
                const result = e.target.result;
                if (result) {
                    this.isGetData = true; // 判断是否到获取数据
                    resolve(result);
                }
            };
            request.onerror = function (e) {
                console.log('数据检索失败！');
            };
        });
    }
    // 增
    addDataDB (config) {
        const objectStore = this.createTransaction();
        const saveData = JSON.parse(JSON.stringify(config));
        console.log(saveData);
        objectStore.add(saveData);
        objectStore.onsuccess = function (event) {
            // console.log('数据写入成功');
        };
        objectStore.onerror = function (event) {
            console.log('数据写入失败');
        };
    }
    // 改
    updateDataDB (config) {
        const objectStore = this.createTransaction();
        const saveData = JSON.parse(JSON.stringify(config));
        objectStore.put(saveData);
        objectStore.onsuccess = function (event) {
            // console.log('数据更新成功');
        };
        objectStore.onerror = function (event) {
            console.log('数据更新失败');
        };
    }
    // 删
    removeDataDB () {
        const objectStore = this.createTransaction();
        objectStore.delete(this.pageKey);
        objectStore.onsuccess = function (event) {
            console.log('删除成功');
        };
    }
}
export default DB;