class MoneyData {
    public id : any;
    public prices : number ;
    //备注 
    public mark :  string ;  
    //消费类型
    public tag : string;
    public lifeEnergy : number;
    public consumeDate : string;
    //开支类型
    public moneyTag : MoenyTag ;
}

class  MoenyTag {
    public static pay:string  = "支出";
    public static income :string  = "收入"
}

export{MoneyData ,MoenyTag}