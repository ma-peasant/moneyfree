import { createApp} from "vue";
//import "./style.css";

//import Vue from 'vue';
import ElementUI from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';

import {  } from "./utils/DBOperate";



const app = createApp(App);
app.use(ElementUI);

app.mount("#app");



function justifyIndexDEB(){
    if("indexedDB" in window) {
        // 支持
        console.log(" 支持indexedDB...");
        createIndexDB();    //创建数据库，下面有定义
    } else {
        // 不支持
        console.log("不支持indexedDB...");
        window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
    }
}





