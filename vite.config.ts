/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:41:01
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-28 14:58:35
 * @Description: file content
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vueJsx({}), vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
        }
    },
    server: {
        port: 4000, // 设置服务启动端口号
        open: true, // 设置服务启动时是否自动打开浏览器
        cors: true, // 允许跨域
        // 设置代理，根据我们项目实际情况配置
        proxy: {
            '/gateway': {
                target: 'http://srp.dev.cloudyigou.com',
                changeOrigin: true
            }
        }
    }
});
