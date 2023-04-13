<script setup lang="ts">
import { reactive, ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import {v4 as uuid} from 'uuid';
import { createIndexDB, addData, getAllData,deleteData } from "../utils/DBOperate";

import { MoneyData ,MoenyTag} from '../beans/MoneyData';

let dbObject :any;
let tableData = reactive([] as any);
createIndexDB((db :any) => {
  dbObject = db;
  let request = getAllData(db);
  request.onsuccess = function (event) {
    console.log("数据库查询结果：" + request.result)
    request.result.filter( item =>{
      tableData.push(item)
    })
  }
});

const tag  = ref('')
const moneyTag = ref('')
const prices = ref('')
const mark = ref('') // 备注
const lifeEnergy = ref('')   //生命能量
const consumptionType = ['早饭', '午饭', '晚饭', '衣', '零食', '租房', '出行', '电子消费', '话费']
const moneyTpye = [MoenyTag.pay, MoenyTag.income]
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
  let data : MoneyData = new MoneyData(); 
  data.id = uuid();
  data.tag = this.tag;
  data.moneyTag = this.moneyTag;
  data.consumeDate = this.consumeDate;
  data.lifeEnergy = this.lifeEnergy;
  data.prices = this.prices;
  data.mark = this.tag;

  this.tableData.push(data);
  console.log(this.tableData)
  addData(dbObject, data);
}

function editClick() {
  console.log("123");
}
function deleteRow(index , row) {
  deleteData(dbObject, row.id);
  tableData.splice(index,1)
}


</script>
<template>
  <div>
    <div style="display: flex; flex-direction: row;">
      <el-select v-model="tag" class="m-2" placeholder="消费类别" size="large">
        <el-option v-for="item in consumptionType" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker style="width: 240px;" v-model="consumeDate" type="date" placeholder="Pick a day" size="large" format = "YYYY-MM-DD" value-format = "YYYY-MM-DD"/>
      <el-input style="width: 200px;" v-model="prices" placeholder="money"
        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" />
      <el-select v-model="moneyTag" class="m-2" placeholder="收入与开支" size="large">
        <el-option v-for="item in moneyTpye" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input style="width: 200px;" v-model="lifeEnergy" placeholder="生命能量" clearable />
      <el-input style="width: 400px;" v-model="mark" placeholder="备注" clearable />
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
