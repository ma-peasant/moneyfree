<script setup lang="ts">
import { reactive, ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { v4 as uuid } from 'uuid';
import { createIndexDB, addData, getAllData, deleteData, consumeTypeTable, storeName } from "../utils/DBOperate";

import { MoneyData, MoenyTag } from '../beans/MoneyData';
import { ConsumeData } from '../beans/ConsumeData';
import * as echarts from 'echarts';
import {onMounted} from 'vue';

onMounted(()=>{
  getEchartData();
});
   
defineProps({
  ConsumeType: []
})

let dbObject: any;
let tableData = reactive([] as any);

const consumeBaseData = ['早饭', '午饭', '晚饭', '衣', '零食', '租房', '出行', '电子消费', '话费']
const consumeTypeBase = reactive([] as any);

createIndexDB((db: any) => {
  dbObject = db;
  let request = getAllData(db, storeName);
  request.onsuccess = function (event) {
    console.log("storeName + 数据库查询结果：" + request.result)
    request.result.filter(item => {
      tableData.push(item)
    })
  }
  let request2 = getAllData(db, consumeTypeTable);
  request2.onsuccess = function (event) {
    console.log(consumeTypeTable + "数据库查询结果：" + request2.result)
    if (request2.result.length > 0) {
      request2.result.filter(item => {
        consumeTypeBase.push(item)
      })
    } else {
      consumeBaseData.forEach(element => {
        console.log(element);
        let data = new ConsumeData();
        data.id = uuid();
        data.content = element;
        consumeTypeBase.push(data)
      })
      consumeTypeBase.forEach(element => {
        console.log('data.name = ' + element.content)
        let data: ConsumeData = element;
        addData(db, consumeTypeTable, data);
      })
    }
  }
});

const tag = ref('')
const moneyTag = ref('')
const prices = ref('')
const mark = ref('') // 备注
const lifeEnergy = ref('')   //生命能量

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
  let data: MoneyData = new MoneyData();
  data.id = uuid();
  data.tag = this.tag;
  data.moneyTag = this.moneyTag;
  data.consumeDate = this.consumeDate;
  data.lifeEnergy = this.lifeEnergy;
  data.prices = this.prices;
  data.mark = this.tag;

  this.tableData.push(data);
  console.log(this.tableData)
  addData(dbObject, storeName, data);
}

function editClick() {
  console.log("123");
}
function deleteRow(index, row) {
  deleteData(dbObject, storeName, row.id);
  tableData.splice(index, 1)
}



function getEchartData() {
  const chart = document.getElementById("chart")
  if (chart) {
    console.log('加载数据列表');
    const myChart = echarts.init(chart)
    const option = {
      xAxis: {
        type: 'category',
        data: ['A', 'B', 'C']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150],
          type: 'line'
        }
      ]
    };
    myChart.setOption(option)
    window.addEventListener("resize", function () {
      myChart.resize()
    })
  }
  // this.$on('hook:destroyed', () => {
  //   window.removeEventListener("resize", function () {
  //     myChart.resize();
  //   });
  // })
}

</script>
<template>
  <div>
  
    <div style="display: flex; flex-direction: row;">
      <el-select v-model="tag" class="m-2" placeholder="消费类别" size="large">
        <el-option v-for="item in consumeTypeBase" :key="item.content" :label="item.content" :value="item.content" />
      </el-select>
      <el-date-picker style="width: 240px;" v-model="consumeDate" type="date" placeholder="Pick a day" size="large"
        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
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
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editClick()">编辑</el-button>
            <el-button link type="primary" size="small" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="chart" style="width: 100%;height: 300px;margin-top: 30px;"></div>
  </div>

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
