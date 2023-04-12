<script  setup>
import { reactive, ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import {v4 as uuid} from 'uuid';
import { createIndexDB, addData, getAllData,deleteData } from "../utils/DBOperate";

let dbObject;
let tableData = reactive([]);
createIndexDB((db) => {
  dbObject = db;
  let request = getAllData(db);
  request.onsuccess = function (event) {
    console.log("数据库查询结果：" + request.result)
    request.result.filter(item => tableData.push(item))
  }
});

const value = ref('')
const value2 = ref('')
const prices = ref('')
const tag = ref('') // 备注
const lifeEnergy = ref('')   //生命能量
const consumptionType = ['早饭', '午饭', '晚饭', '衣', '零食', '租房', '出行', '电子消费', '话费']
const moneyTpye = ['收入', '开支']
const consumeDate = ref("")
const tableType = [
  {
    name: '消费类型',
    value: 'value'
  },
  {
    name: '消费时间',
    value: 'consumeDate'
  },
  {
    name: '消费金额',
    value: 'prices'
  },
  {
    name: '收入与开支',
    value: 'value2'
  },
  {
    name: '生命能量',
    value: 'lifeEnergy'
  },
  {
    name: '备注',
    value: 'tag'
  }
]

function greet() {
  //1、新增数据到数据库
  let data = {
    id: uuid(),
    value: this.value,
    value2: this.value2,
    prices: this.prices,
    tag: this.tag,
    lifeEnergy: this.lifeEnergy,
    consumeDate: this.consumeDate,
  };
  this.tableData.push(data);
  console.log(this.tableData)
  addData(dbObject, data);
}

function editClick() {
  console.log("123");
}
function deleteRow(index , row) {
  //this.tableData
  deleteData(dbObject, row.id);
  tableData.splice(index,1)
  //SetTabData();
}

function SetTabData(){
  let request = getAllData(dbObject);
  tableData = reactive([]);
  request.onsuccess = function (event) {
    console.log("数据库查询结果：" + request.result)
    request.result.filter(item => tableData.push(item))
  }
}

</script>
<template>
  <div>
    <div style="display: flex; flex-direction: row;">
      <el-select v-model="value" class="m-2" placeholder="消费类别" size="large">
        <el-option v-for="item in consumptionType" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker style="width: 240px;" v-model="consumeDate" type="date" placeholder="Pick a day" size="large" format = "YYYY-MM-DD" value-format = "YYYY-MM-DD"/>
      <el-input style="width: 200px;" v-model="prices" placeholder="money"
        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" />
      <el-select v-model="value2" class="m-2" placeholder="收入与开支" size="large">
        <el-option v-for="item in moneyTpye" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input style="width: 200px;" v-model="lifeEnergy" placeholder="生命能量" clearable />
      <el-input style="width: 400px;" v-model="tag" placeholder="备注" clearable />
    </div>
    <!-- <input id="greet-input" v-model="name" placeholder="Enter a name..." /> -->
    <el-button type="button" @click="greet()" style="width: 100%">添加</el-button>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column v-for="item in tableType" :prop="item.value" :label="item.name" :width="110" />
        <el-table-column fixed="right" label="操作" width="130">
          <template #default = "scope">
            <el-button link type="primary" size="small" @click="editClick()">编辑</el-button>
            <el-button link type="primary" size="small" @click="deleteRow(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>

  <!-- <p>{{ greetMsg }}</p> -->
</template>

<style >
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
