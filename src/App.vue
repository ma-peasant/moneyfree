<script lang="ts" setup >
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";
import {v4 as uuid} from 'uuid';
import { createSettingWindow } from "./utils/windowsUtils"
import { ref ,reactive} from 'vue'
import { ElMessageBox } from 'element-plus'
import { createIndexDB, addData, getAllData,deleteData,consumeTypeTable } from "./utils/DBOperate";
import {ConsumeData} from "./beans/ConsumeData"

const drawer = ref(false);
const direction = ref('rtl');
const radio1 = ref('Option 1');

let input_consumeType = ref('');

let dbObject : any ;
let tableData = reactive([] as any);

createIndexDB((db :any) => {
  dbObject = db;
  let request = getAllData(db,consumeTypeTable);
  request.onsuccess = function (event) {
    console.log("数据库查询结果：" + request.result)
    request.result.filter( item =>{
      tableData.push(item)
    })
  }

  let request2 = getAllData(db,consumeTypeTable);
  request2.onsuccess = function (event) {
    console.log(consumeTypeTable + "数据库查询结果：" + request2.result)
    
  }
});


const handleClose = (done: () => void) => {
  // ElMessageBox.confirm('Are you sure you want to close this?')
  //   .then(() => {
  //     location.reload()
  //   })
  //   .catch(() => {
  //     // catch error
  //   })
   location.reload();
}


function openSetting() {
  // console.log("打开设置窗口");
  // createSettingWindow();
  this.drawer = true
}

function addConsumeType(){
  let data = new ConsumeData();
  data.id = uuid();
  data.content = input_consumeType.value;
  addData(dbObject,consumeTypeTable,data);
  tableData.push(data);
  this.$refs.greet.consumeTypeBase.push(data)
}

function deleteConsumeType(index,row){
  deleteData(dbObject, consumeTypeTable ,row.id);
  tableData.splice(index,1)
}

function cancelClick() {
  this.drawer.value = false
}
function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
    .then(() => {
      this.drawer.value = false
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <div>
    <div style="display: flex; flex-direction: row; justify-content: center;">
      <h1>Welcome to MoneyFree!</h1>
      <el-icon style="height: 80px; margin-left: 40px;" :size=25 @click="openSetting()">
        <Tools />
      </el-icon>
    </div>
    <Greet ref="greet" />
  </div>
  <el-drawer v-model="drawer" :direction="direction" :before-close = "handleClose">
    <template #header>
      <h4>添加消费类型</h4>
    </template>
    <template #default>
      <div>
        <el-input v-model="input_consumeType" placeholder="Please input" clearable />
        <el-button type="primary" round @click= "addConsumeType()">Primary</el-button>
        
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="content" label="消费类型" width="150" />
          <el-table-column fixed="right" label="Operations" width="120">
          <template #default= "scope">
            <el-button link type="primary" size="small" @click="deleteConsumeType(scope.$index,scope.row)">删除</el-button>
            <el-button link type="primary" size="small">修改</el-button>
          </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

h1 {
  text-align: center;
}
</style>
