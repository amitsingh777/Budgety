//Data module

var budgetController=(function() {
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    }
    Expense.prototype.calcPercentage=function(totalIncome){
       if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
       }
       else{
           this.percentage=-1;
       }
        
    }
    Expense.prototype.getPercent=function(){
        return this.percentage;
    }
    var total=function(type){
        var sum=0;
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;

        });
        data.total[type]=sum;
        
    };
    var data={
        total:{
            inc:0,
            exp:0
        },
        allItems:{
            inc:[],
            exp:[]
        },
        budget:0,
        percentage:-1
    };
    return{
        addItem:function(type,desc,val){
           var ID,newItem,letSee;
           if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
          
           }
           else {
               ID=0;
           }
           
            
            if(type === "inc"){
                newItem=new Income(ID,desc,val);
            }
            else if(type === "exp"){
                newItem=new Expense(ID,desc,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget:function(){
            //calculate total inc and expense
            total("inc");
            total("exp");


            //calculate the budget
            data.budget=data.total.inc-data.total.exp;

            if(data.total["inc"]>0){
          //calculate the percentage
          data.percentage=Math.round((data.total.exp/data.total.inc)*100);

            }
            else{
            data.percentage=-1;

            }
  
        },
        calculatePercentage:function(){
         data.allItems.exp.forEach(function(current){
          current.calcPercentage(data.total.inc);

        });



        // data.allItems.exp.forEach(function(current){
        //     current.calcPercentage(data.total.inc);

        // });
            

        },
        getPercentage:function(){
            var percentage= data.allItems.exp.map(function(current){
                   return current.getPercent();
        
        
            });




        //    var percentage= data.allItems.exp.map(function(current){
        //         return current.getPercent();


        //     });
         return percentage;

        },
        returnBudget:function(){
            return{
                budget:data.budget,
                totalIncome:data.total.inc,
                totalExpense:data.total.exp,
                percentage:data.percentage
            }

        },
        delete:function(type,id){
            var ids,index;
            ids=data.allItems[type].map(function(current){
                 return current.id;

            });
            
            index=ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index,1);
                
            }
            

            
        },
        testing:function(){
            console.log(data);
        }
    };

})();

// user interface
var UIController=(function() {
    var DOMStrings={
        inputType:".add__type",
        inputDescription:".add__description",
        inputValue:".add__value",
        inputAddBtn:".add__btn",
        incomeList:".income__list",
        expensesList:".expenses__list",
        label:".budget__value",
        uiIncome:".budget__income--value",
        uiExpense:".budget__expenses--value",
        uiPrecentage:".budget__expenses--percentage",
        container:".container",
        uiListPercentage:".item__percentage",
    
        dateDom:".budget__title--month"
    };
    var formatNumber=function(num,type){
        var numSplit,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);    //2340 =2340.00

        numSplit=num.split(".");
        int=numSplit[0];        //int =2340

        dec=numSplit[1];        //dec=00   5000 = this[0](5) to 
        if(int.length>3){
            int=int.substring(0,int.length-3)+","+int.substring(int.length-3,int.length);
        }

        return (type === "exp" ? "- " : "+ " )+int+"."+dec;


    };
    var nodeListforEach=function(list,callback){
        for(i=0;i<list.length;i++){
            callback(list[i],i);
        }

    };
    return{
        getInput:function(){
            return{
                type:document.querySelector(DOMStrings.inputType).value,//value would be inc or exp
                description:document.querySelector(DOMStrings.inputDescription).value,
                value:parseFloat( document.querySelector(DOMStrings.inputValue).value )
            };
         },
         addListItem:function(obj,type){
             var element;
             if(type==="inc"){
                 element=DOMStrings.incomeList;
                 html='<div class="item clearfix" id="inc-%id%">'+ 
                 '<div class="item__description">%description%</div>'+
                 '<div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
             }
             else if (type==="exp"){
                 element=DOMStrings.expensesList;
                 html=' <div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

             }
        

            newHtml=html.replace("%id%",obj.id);
            newHtml=newHtml.replace("%description%",obj.description);
            newHtml=newHtml.replace("%value%",formatNumber( obj.value,type));


        document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
         },
         deleteListItem:function(selectorId){
             var el=document.getElementById(selectorId);
             el.parentNode.removeChild(el);

         },
         clearInputFields:function(){
             var Fields,arrFields;
            Fields= document.querySelectorAll(DOMStrings.inputDescription+","+DOMStrings.inputValue);
            arrFields=Array.prototype.slice.call(Fields);
            arrFields.forEach(function(curr,arr,ind){
                          curr.value="";
                          
            });
            arrFields[0].focus();
         },
         updateUI:function(obj){
             var type;
             obj.budget >0 ? type="inc" : type="exp";
             document.querySelector(DOMStrings.label).textContent=formatNumber(obj.budget,type) ;
             document.querySelector(DOMStrings.uiIncome).textContent=formatNumber(obj.totalIncome,"inc") ;
             document.querySelector(DOMStrings.uiExpense).textContent=formatNumber(obj.totalExpense,"exp");
           if(obj.percentage>0){
            document.querySelector(DOMStrings.uiPrecentage).textContent=obj.percentage+"%";
  
           }
           else{
            document.querySelector(DOMStrings.uiPrecentage).textContent="-----";

           }
         },
         displayPercentage:function(percentages){
             var field=document.querySelectorAll(DOMStrings.uiListPercentage);

             
         nodeListforEach(field,function(current,index){
             if(percentages[index]>0){
                 current.textContent=percentages[index] +"%"
             }
             else{
                  current.textContent="----"
                 }

                    });

         },
         changeType:function(){
             var field=document.querySelectorAll(DOMStrings.inputValue +","+DOMStrings.inputType+","+DOMStrings.inputDescription);
             nodeListforEach(field,function(current){
                 current.classList.toggle("red-focus");
             });
             document.querySelector(DOMStrings.inputAddBtn).classList.toggle("red");

         },
         updateDate:function(){
             var now,year,month,months;
             now=new Date();
             year=now.getFullYear();
             month=now.getMonth();
             months=["January","February","March","April","May","June","July","August","September","October","November","December"];
             document.querySelector(DOMStrings.dateDom).textContent=months[month]+" "+year;

         },
        getDomStrings:function(){
            return DOMStrings;

        }
    };
    

})();

//Global app controller 
/* 
//function definiton

1 function testing(){

}
2 var testing=function(){

};
3//iife imediately invoked function expression 
(function(){

})
var person={
    name:"amit",

}
var person=function(name,dob,age){
    this.name=name;
    this.dob=dob;
    this.age=age;
};
var amit=new person(amit,1998,2019);
var suraj=new person(suraj)


*/
var controller=(function(budgetCtrl,UICtrl) {
  //Dry principle's implementaton
    var settingUpEventListeners=function(){
        var DOM=UICtrl.getDomStrings();
        document.querySelector(DOM.inputAddBtn).addEventListener("click",ctrlAddItem);
        document.addEventListener("keypress",function(event){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
            }
            
      });
      document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener("change",UICtrl.changeType) ;
    };
    var updateBudget=function(){
        //1. calculate the budget
        budgetCtrl.calculateBudget();
        //2. ureturn the budget
        var budget=budgetCtrl.returnBudget();
        //3.update the user interface
        UICtrl.updateUI(budget);
    };
    var updatePercentages=function(){
        //1.caluclate the percentages
        budgetCtrl.calculatePercentage();

        //2.read the percentage from the budget controller
        var percentages=budgetCtrl.getPercentage();
        
        
        //3.update the user interface
        UICtrl.displayPercentage(percentages);
    };
    
    var ctrlAddItem=function(){
        //1.Get the Input
        var input=UICtrl.getInput();
        
        if(input.description !== "" && input.value !==0 && !isNaN(input.value)){
            
        //2.add the new item in budget controller
        var newItem=budgetController.addItem(input.type,input.description,input.value);
        
        //3.add the new item in user interface module
        UICtrl.addListItem(newItem,input.type);
        //4.clear input fields
        UICtrl.clearInputFields();
        //5.update the budget
        updateBudget();
        //6.update the percentage
        updatePercentages();


        }
    };
    var ctrlDeleteItem=function(event){
        var item,splitID;
        
        item=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        
       if(item){
            splitID=item.split("-");
            type=splitID[0];
        
            id=parseInt(splitID[1]);
            
            //1.deleting from data structure
            budgetCtrl.delete(type,id);
            //2.deleting from user interface
            UICtrl.deleteListItem(item);
            //3.updating the budget
            updateBudget();
            //4.update the percentages
            updatePercentages();

        }
        

    };

    return{
        init:function(){
            UICtrl.updateDate();
            UICtrl.updateUI({
                budget:0,
                totalIncome:0,
                totalExpense:0,
                percentage:0
            });
            settingUpEventListeners();
        }
    };
    

})(budgetController,UIController);
controller.init();
 
