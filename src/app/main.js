/**
 * Created by weny on 2017/2/20.
 */
(function () {
    var qdh = {
        ele: {}, //元素dom对象
        word: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        init: function () {
            this.initElement();
            this.initEvent();
            this.setTitle();
        },

        getEle: function (id) {
            return document.getElementById(id);
        },

        /**
         * 获取输入的球道号
         */
        getQdhNumber: function () {
            return this.ele.numberNode.value;
        },

        /**
         * 获取输入的姓名
         */
        getName: function () {
            return this.ele.nameNode.value;
        },

        /**
         * 实时计算人数，或球道
         * @arr Array 人数或球道数组
         */
        calcNumber: function (arr) {
            return arr.length;
        },

        /**
         * 获取分配后剩余的人数
         * @param numberArr  球道数组
         * @param nameArr    人员数组
         */
        surplusPerson: function (numberArr, nameArr) {
            var numberLen = numberArr.length,
                nameLen = nameArr.length;
            return nameLen - (nameLen % numberLen);
        },

        /**
         * 获取单数或双数
         * @param arr
         * @return Array  单数数组
         */
        getOddAndEven: function (arr) {
           var odd = [],
               even = [];
            arr.forEach(function (item) {
                if((item & 1) === 1){
                    //单数
                    odd.push(item);
                }else{
                    even.push(item);
                }
            });
            return {
                odd: odd,
                even: even
            };
        },

        /**
         * todo:剩余人数的分配
         * @surplusPerson 剩余人数
         * @return  用于分配剩余人数的球道数组
         */
        surplusPersonAllot : function (numberArr ,nameArr) {
            var result = [],
                getOddAndEven = this.getOddAndEven(numberArr),
                surplusPerson = this.surplusPerson(numberArr, nameArr),
                oddNumber = getOddAndEven.odd,
                evenNumber = getOddAndEven.even,
                oddNumberLen = oddNumber.length,
                tempNumber = 0, //分配给单数球道后，剩余的人数
                tempEvenNumber = []; //分配给单数球道后，剩余的人数分配到的双道上

            if(surplusPerson > oddNumberLen){ //剩余的人数大于单数球道时
                tempNumber = surplusPerson - oddNumberLen;
                tempEvenNumber =evenNumber.reverse().slice(0, tempNumber);
            }
            result = oddNumber.concat(tempEvenNumber);
            return result;
        },

        /**
         * 随机捣乱姓名
         * @nameArr 姓名数组
         */
        starRandom: function (nameArr) {
            var tempArr = [],
                len = nameArr.length;
            for (var i = 0; i < len; i++) {
                tempArr.push({
                    item: Math.floor(Math.random() * len),
                    value: nameArr[i]
                })
            }
//               console.log(tempArr,"排序前");
            tempArr.sort(function (a, b) {
                return a.item - b.item;
            });
//               console.log(tempArr,"排序后");
            return tempArr.map(function (item) {
                return item.value;
            });
        },

        /**
         * todo:构建球道号number
         * @numberArr Array  球道号数组
         * @nameArr   Array   名字数组
         */
        buildNumber: function (numberArr, nameArr) {
            var me = this,
                nameLen = nameArr.length,
                numberLen = numberArr.length,
                tempItem = 0,
                wordItem = 0,
                a = 0,
                result = [],
                surplusPerson = me.surplusPerson(numberArr, nameArr), //剩余的人数
                surplusPersonAllot = me.surplusPersonAllot(numberArr, nameArr);
            for (var i = 0; i < nameLen; i++) {
                if ((i + 1) > numberLen) {
                    tempItem = (i + 1) % numberLen;
                    tempItem = (tempItem - 1 < 0) ? numberLen - 1 : tempItem - 1;
                } else {
                    tempItem = i;
                }
                if( i >= surplusPerson ){ //剩余的人数分配
                    // console.log("人数序号："+i,tempItem, "剩余的人数");
                    result.push(surplusPersonAllot[tempItem]);
                }else{
                    result.push(numberArr[tempItem]);
                }
            }
            result.sort(function (a, b) {
                return a - b;
            });

            return result.map(function (item, index) {
                if (item == numberArr[a]) {
                    return (item + me.word[wordItem++]);
                } else {
                    wordItem = 0;
                    a++;
                    return (item + me.word[wordItem++]);
                }
            });
        },

        /**
         * 构建其他表格
         * @param obj Object  表格数组对象
         */
        buildOtherTable: function (obj) {
            var tableNode = null,
                tableNodes = null;
            for( var key in obj){
                if(key != 0){
                    tableNode =document.createElement("table");
                    tableNode.className = "qdh-table";
                    tableNode.innerHTML = "<thead> <tr> <th>序</th> <th>球道号</th> <th>姓名</th> </tr> </thead> " +
                        "<tbody>"+obj[key].join('')+"</tbody>";

                    this.ele.otherTableNode.appendChild(tableNode);
                    tableNodes = this.ele.tableContainerNode.getElementsByTagName('table');
                    Array.prototype.slice.call(tableNodes).forEach(function(item) {
                        item.style.width = Math.floor(100 / (+key + 1)) - 2 + "%";
                    })
                }
            }
        },

        setTitle: function (title) {
            this.ele.titleNode.innerHTML = "\u4e50\u6cf0\u90fd\u4fdd\u9f84\u7403\u9986\uff08\u62bd\u7b7e\u7403\u9053\u5b89\u6392\uff09";
        },

        /**
         * 验证输入的球道或姓名是否为空
         */
        validate: function (success) {
            if (this.ele.numberNode.value && this.ele.nameNode.value) {
                success && success();
            } else {
                alert("输入的球道号或姓名不能为空!");
            }
        },

        /**
         * 分表格
         * @param arr  表格填充的数组
         * @param number 需要多少个人数划分为一个表格
         */
        tableColumn: function (arr,number) {
            var newArr = arr.slice(),
                result = {},
                i = 0;
            function main(newArr) {
                if(newArr.length <= number){
                    result[i++] = newArr;
                }else{
                    result[i++] = newArr.splice(0, number);
                    main(newArr);
                }
            }

            main(newArr);
            // console.log(result);
            return result;
        },

        initElement: function () {
            this.ele.randomNode = this.getEle("js_qdh_btn_random");
            this.ele.clearNode = this.getEle("js_qdh_btn_clear");
            this.ele.outputNode = this.getEle("js_qdh_output");
            this.ele.numberNode = this.getEle("js_qdh_number");
            this.ele.nameNode = this.getEle("js_qdh_name");
            this.ele.nameClearNode = this.getEle("js_name_clear");
            this.ele.numberClearNode = this.getEle("js_number_clear");
            this.ele.titleNode = this.getEle("js_qdh_title");
            this.ele.numberCalcNode = this.getEle("js_number_calc");
            this.ele.nameCalcNode = this.getEle("js_name_calc");
            this.ele.tableContainerNode = this.getEle("js_table_container");
            this.ele.otherTableNode = this.getEle("js_table_other");
            this.ele.operationNode = this.getEle("js_operation");
        },

        initEvent: function () {
            var me = this,
                ele = this.ele;
            ele.randomNode.addEventListener("click", me.randomHandler.bind(me));
            ele.clearNode.addEventListener("click", me.clearHandler.bind(me));
            ele.nameClearNode.addEventListener("click", me.clearNameHandler.bind(me));
            ele.numberClearNode.addEventListener("click", me.clearNumberHandler.bind(me));
            ele.numberNode.addEventListener("input", me.calcHandler.bind(me));
            ele.nameNode.addEventListener("input", me.calcHandler.bind(me));
            ele.operationNode.addEventListener("click", me.operationHandler.bind(me));
        },

        randomHandler: function (evt) {
            var me = this;
            me.validate(function () {
                me.renderData();
            });
            evt.preventDefault();
        },

        clearHandler: function (evt) {
            var ele = this.ele;
            ele.outputNode.innerHTML = "";
            ele.numberNode.value = "";
            ele.nameNode.value = "";
            ele.otherTableNode.innerHTML = "";
            ele.tableContainerNode.getElementsByTagName('table')[0].style.width = "98%";
        },

        clearNameHandler: function () {
            this.ele.nameNode.value = "";
        },

        clearNumberHandler: function () {
            this.ele.numberNode.value = "";
        },

        /**
         * 放大缩小回调
         * @param evt
         */
        operationHandler: function (evt) {
            var target = evt.target,
                maskNode = this.getEle("js_mask");
            switch(target.className){
                case "a_1":
                    //放大
                    this.ele.tableContainerNode.classList.add("zoomout");
                    maskNode.style.display = "block";
                    this.ele.randomNode.classList.add("buttonfix");
                    break;
                case "a_2":
                    //缩小
                    this.ele.tableContainerNode.classList.remove("zoomout");
                    maskNode.style.display = "none";
                    this.ele.randomNode.classList.remove("buttonfix");
                    break;
            }
            evt.preventDefault();
        },

        /**
         * 清空其他表格
         */
        clearOtherTable: function () {
            this.ele.otherTableNode.innerHTML = "";
        },

        calcHandler: function(evt) {
            var me = this,
                target = evt.target,
                number = this.getQdhNumber(),
                name = this.getName(),
                reg = /[^\,\，\s]+/g,
                numberArr = number.match(reg) || [],
                nameArr = name.match(reg) || [],
                text = "";
            switch(target.id){
                case "js_qdh_name" :
                    text = nameArr.length+ "人";
                    me.ele.nameCalcNode.innerHTML = text;
                    break;
                case "js_qdh_number" :
                    text = numberArr.length + "道";
                    me.ele.numberCalcNode.innerHTML = text;
                    break;
            }
        },

        renderData: function () {
            var number = this.getQdhNumber(),
                name = this.getName(),
                reg = /[^\,\，\s]+/g,
                numberArr = number.match(reg),
                nameArr = name.match(reg),
                tempArr = {},
                tableNode = [],
                tableNodes = null;
            // console.log(number, "number");
            // console.log(nameArr, "name");
            nameArr = this.starRandom(nameArr);
            numberArr = this.buildNumber(numberArr, nameArr);
            // console.log(numberArr, "构建后的球道号");
            // console.log(nameArr, "随机后的");
            var trNode = nameArr.map(function (item, index) {
                if ((numberArr[index].match(/\d+/)[0]) % 2 === 0) {
                    className = "even";
                } else {
                    className = "odd";
                }
                return "<tr class=" + className + "><td>" + (index + 1) + "</td><td>" + numberArr[index] + "</td><td>" + item + "</td></tr>";
            });
            tempArr = this.tableColumn(trNode, 25);
            this.ele.outputNode.innerHTML = tempArr[0].join("");
            this.clearOtherTable();
            this.buildOtherTable(tempArr);
        }

    };
    qdh.init();
})();