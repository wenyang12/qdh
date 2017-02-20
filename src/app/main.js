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
                result = [];
            for (var i = 0; i < nameLen; i++) {
                if ((i + 1) > numberLen) {
                    tempItem = (i + 1) % numberLen;
                    tempItem = (tempItem - 1 < 0) ? numberLen - 1 : tempItem - 1;
                } else {
                    tempItem = i;
                }
                result.push(numberArr[tempItem]);
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

        initElement: function () {
            this.ele.randomNode = this.getEle("js_qdh_btn_random");
            this.ele.clearNode = this.getEle("js_qdh_btn_clear");
            this.ele.outputNode = this.getEle("js_qdh_output");
            this.ele.numberNode = this.getEle("js_qdh_number");
            this.ele.nameNode = this.getEle("js_qdh_name");
            this.ele.nameClearNode = this.getEle("js_name_clear");
            this.ele.numberClearNode = this.getEle("js_number_clear");
            this.ele.titleNode = this.getEle("js_qdh_title");
        },

        initEvent: function () {
            var me = this,
                ele = this.ele;
            ele.randomNode.addEventListener("click", me.randomHandler.bind(me));
            ele.clearNode.addEventListener("click", me.clearHandler.bind(me));
            ele.nameClearNode.addEventListener("click", me.clearNameHandler.bind(me));
            ele.numberClearNode.addEventListener("click", me.clearNumberHandler.bind(me));
        },

        randomHandler: function (evt) {
            var me = this;
            me.validate(function () {
                me.renderData();
            });
            evt.preventDefault();
        },

        clearHandler: function (evt) {
            this.ele.outputNode.innerHTML = "";
            this.ele.numberNode.value = "";
            this.ele.nameNode.value = "";
        },

        clearNameHandler: function () {
            this.ele.nameNode.value = "";
        },

        clearNumberHandler: function () {
            this.ele.numberNode.value = "";
        },

        renderData: function () {
            var number = this.getQdhNumber(),
                name = this.getName(),
                reg = /[^\,\，\s]+/g,
                numberArr = number.match(reg),
                nameArr = name.match(reg);
            console.log(number, "number");
            console.log(nameArr, "name");
            nameArr = this.starRandom(nameArr);
            numberArr = this.buildNumber(numberArr, nameArr);
            console.log(numberArr, "构建后的球道号");
            console.log(nameArr, "随机后的");
            var trNode = nameArr.map(function (item, index) {
                if ((numberArr[index].match(/\d+/)[0]) % 2 === 0) {
                    className = "even";
                } else {
                    className = "odd";
                }
                return "<tr class=" + className + "><td>" + (index + 1) + "</td><td>" + numberArr[index] + "</td><td>" + item + "</td></tr>";
            });
            this.ele.outputNode.innerHTML = trNode.join("");
        }

    };
    qdh.init();
})();