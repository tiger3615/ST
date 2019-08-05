var G = {
	R_en: {
		days: "day(s)",
		test:"test",
		others:"others",
		noPlantKeeperMsg: "Cannot detect Plant Keeper; Please make sure host and phone bluetooth are open, host code is correct.",
		msgOfBindHost: "Host code is xxxx from bluetooth name \"Plant Keeper xxxx\". <b>restart app</b> after <b>save</b>.",
		bindHost: "bind host",
		hostCode: "host code:",
		hostVersion: "host version:",
		settingMl: "current set ml:",
		actualMl: "actual ml:",
		calibrate: "calibrate water",
		calibrating: "calibrating...",
		close: "close",
		reading: "reading configuration...",
		saving: "saving...",
		reading: "reading...",
		save: "save",
		read: "read",
		collapse: "collapse",
		pipe1: "pipe1",
		pipe2: "pipe2",
		pipe3: "pipe3",
		pipe4: "pipe4"
	},
	R_ch: {
		days: "天",
		test:"测试",
		others:"其他",
		noPlantKeeperMsg: "未找到植物看护者；请检查主机是否打开；手机蓝牙是否打开；主机代码是否正确。",
		msgOfBindHost: "主机代码xxxx来自蓝牙名\"Plant Keeper xxxx\"。<b>保存</b>后<b>重启应用</b>。",
		bindHost: "绑定主机",
		hostCode: "主机代码:",
		hostVersion: "主机版本：",
		settingMl: "当前设置 ml:",
		actualMl: "实际 ml:",
		close: "关闭",
		calibrate: "校准水量",
		calibrating: "校准中...",
		reading: "读取设备信息中...",
		saving: "保存中...",
		reading: "读取中...",
		save: "保存",
		read: "读取",
		collapse: "收起",
		pipe1: "管道1",
		pipe2: "管道2",
		pipe3: "管道3",
		pipe4: "管道4"
	},
	lang: "en",
	getText: function (k) {
		return this["R_" + this.lang][k];
	}
};
var Util = {
	copy: function (s, d) {
		for (var key in s) {
			d[key] = s[key];
		}
	},
	degreeTable: function () {
		var degreeTable = [];
		for (var i = 0; i < 90; i++) {
			degreeTable[i] = Math.tan((i / 180) * Math.PI);
		}
		return degreeTable;
	}(),
	deTag: function (num) {
		var retrunV = 90;
		for (var i = 0; i < 89; i++) {
			if (num >= this.degreeTable[i] && num < this.degreeTable[i + 1]) {
				retrunV = i;
				break;
			}
		}
		return retrunV;
	},
	time2minute: function (time) {
		var hm = time.split(":");
		var hour = parseInt(hm[0]);
		var minute = parseInt(hm[1]);
		var timeseed = hour * 60 + minute;
		return timeseed;
	},
	minute2time: function (minute) {
		var houres = Math.floor(minute / 60);
		var mins = Math.ceil(minute % 60);
		if (houres < 10) {
			houres = "0" + houres;
		}
		if (mins < 10) {
			mins = "0" + mins;
		}
		return houres + ":" + mins;
	},
	isExist:function(o){
	    return !(typeof o== "undefined" || o==null || o=="");
	}
};
var DD = function (configure) {
	var self = this;
	Util.copy(configure, this);
	self.params = {
		left: 0,
		top: 0,
		currentX: 0,
		currentY: 0,
		flag: false
	};
	this.initUI();

	this.initEvent();

	//this.refreshUI();
	this.initDrag();
}.body({
	callback: null,
	draggable: null,
	initialTop: null,
	draggableHeight: null,
	initialWaterBodyHeigh: null,
	initDrag: function () {
		this.params.left = this.draggable.position().left;
		this.params.top = this.draggable.position().top;
	},
	initEvent: function () {
		var self = this;
		this.draggable.on("vmousedown", function () {
			self.onmousedown.apply(self, arguments);
		});
		$(document).on("vmouseup", function () {
			self.onmouseup.apply(self, arguments);
		});
		$(document).on("vmousemove", function () {
			self.onmousemove.apply(self, arguments);
		});
	},
	onmousemove: function (e) {
		if (this.params.flag) {
			var nowY = e.clientY;
			var disY = nowY - this.params.currentY;

			var nowX = e.clientX;
			var disX = nowX - this.params.currentX;
			var finalTop = parseInt(this.params.top) + disY;
			var finalLeft = parseInt(this.params.left) + disX;
			this.refreshUI(finalLeft, finalTop);
		}
	},
	onmouseup: function () {
		this.params.flag = false;
		this.initDrag();
	},
	onmousedown: function (event) {
		this.params.flag = true;
		event.stopImmediatePropagation();
		event.preventDefault();
		this.params.currentX = event.clientX;
		this.params.currentY = event.clientY;
	},
	initUI: function () {
		this.draggable = $(this.draggable);
	},
	refreshUI: function (finalLeft, finalTop) {
		this.draggable.css("left", finalLeft + "px");
		this.draggable.css("top", finalTop + "px");
	},
	initKeyParameter: function () {}
});
var VDD = function (configure) {
	this.super.constructor.call(this, configure);

}.body({
	container: null,
	maxY: 400,
	rollpadSum: 0,
	value: 0,
	initKeyParameter: function () {
		this.initialTop = this.draggable.position().top;
		this.draggableHeight = this.draggable.height();
		this.initialWaterBodyHeigh = this.waterBody.height();
	},
	setValue: function (value) {
		if (value > 1900) {
			value = 1900;
		}
		this.value = value;
		var top = value * 0.2;
		var finalTop = this.maxY - top;
		this.refreshUI(finalTop);
		this.initDrag();
	},
	getValue: function () {
		return parseInt(this.value);
	},
	calculateValue: function (finalTop) {
		this.value = 1900 - Math.round((finalTop - this.initialTop) / 2.0) * 10;
	},
	onmousemove: function (e) {
		if (this.params.flag) {
			var nowY = e.clientY;
			var disY = nowY - this.params.currentY;
			var finalTop = parseInt(this.params.top) + disY;
			if (finalTop < this.initialTop) {
				finalTop = this.initialTop;
			} else if (finalTop > this.maxY) {
				finalTop = this.maxY;
			}
			this.calculateValue(finalTop);
			this.refreshUI(finalTop);
		}
	},
	refreshUI: function (finalTop) {
		this.draggable.css("top", finalTop + "px")
		this.waterBody.css("top", (this.draggableHeight + finalTop - 2) + "px");
		this.waterBody.css("height", (this.initialWaterBodyHeigh + this.initialTop - finalTop) + "px");

		if (finalTop == this.maxY) {
			this.dropIndicator.css("background", "url()");
		} else {
			this.dropIndicator.css("background", "");
		}
		this.showValume.html(this.getValue() + "ml");
		if (typeof this.callback == "function") {
			this.callback(finalTop);
		}
	},
	getTargetOfVolume: function () {
		var self = this;
		return {
			rollpadHandler: function (degreeOffset) {
				degreeOffset = -degreeOffset;
				self.rollpadSum += degreeOffset;
				if (Math.abs(self.rollpadSum) > 20) {
					var value = self.getValue();
					if (self.rollpadSum > 0) {
						value += 1;
					} else {
						value -= 1;
					}
					if (value < 0) {
						value = 0;
					} else if (value > 1900) {
						value = 1900;
					}
					self.setValue(value);
					self.rollpadSum = 0;
				}
			},
			finishModify: function () {
				self.showValume.css("background-color", "#ffffff");
			},
			startModify: function () {
				self.showValume.css("background-color", "#7dc28b");
			}
		};
	},
	getTargetOfDays: function () {
		var self = this;
		return {
			rollpadHandler: function (degreeOffset) {
				degreeOffset = -degreeOffset;
				self.rollpadSum += degreeOffset;
				if (Math.abs(self.rollpadSum) > 20) {
					var value = self.getDaysValue();
					value = parseInt(value);
					if (self.rollpadSum > 0) {
						value += 1;
					} else {
						value -= 1;
					}
					if (value < 1) {
						value = 1;
					} else if (value > 255) {
						value = 255;
					}
					self.setDaysValue(value);
					self.rollpadSum = 0;
				}
			},
			finishModify: function () {
				self.days.css("background-color", "#ffffff");
			},
			startModify: function () {
				self.days.css("background-color", "#7dc28b");
			}
		};
	},
	getDaysValue: function () {
		return this.days.find("span").html();
	},
	setDaysValue: function (v) {
		this.days.find("span").html(v);
	},
	initUI: function () {
		var self = this;
		this.container = $(this.renderTo);
		this.container.addClass("box");
		this.showValume = $('<div class="showValume"> </div>');
		this.container.append(this.showValume);
		this.container.append($('<div class="shiguanTop"></div>'));
		this.draggable = $('<div class="draggable" ></div>');
		this.container.append(this.draggable);
		this.waterBody = $('<div  class="waterBody"></div>');
		this.container.append(this.waterBody);
		this.waterBottom = $('<div class="waterBottom"></div>');
		this.showTime = $('<div class="showTime"></div>');
		this.waterBottom.append(this.showTime);
		if (G.lang == "en") {
			this.days = $('<div class="days"><span>255</span> day</div>');
		} else {
			this.days = $('<div class="days">每<span>255</span>天</div>');
		}

		this.waterBottom.append(this.days);
		this.container.append(this.waterBottom);
		this.dropIndicator = $('<div class="waterDrop"></div>');
		this.container.append(this.dropIndicator);
		this.showValume.html(this.getValue() + "ml");
		this.showValume.on("vclick", function () {
			self.rollpad.releaseOther();
			self.rollpad.setTargetDD(self.getTargetOfVolume());
			self.getTargetOfVolume().startModify();
			$("#bottomPannel").css("top", "1px");
		});
		this.days.on("vclick", function () {
			self.rollpad.releaseOther();
			self.rollpad.setTargetDD(self.getTargetOfDays());
			self.getTargetOfDays().startModify();
			$("#bottomPannel").css("top", "1px");
		});
		this.initKeyParameter();
		var finalTop = this.draggable.position().top;
		this.calculateValue(finalTop);
		this.refreshUI(finalTop);
	}
}).extend(DD);

var HDD = function (configure) {
	this.super.constructor.call(this, configure);

}.body({
	container: null,
	maxX: 864,
	rollpadSum: 0,
	initKeyParameter: function () {},
	setTime: function (time) {
		if (time > 1440) {
			time = 1440;
		}
		this.minutesTime = time;
		finalLeft = Math.round(time / 5.0 * 3);
		this.refreshUI(finalLeft);
		this.initDrag();
	},
	getTime: function () {
		return parseInt(this.minutesTime);
	},
	getFormattedTime: function () {
		return Util.minute2time(this.minutesTime);
	},
	calculateTime: function (left) {
		this.minutesTime = Math.round(left / 3.0) * 5;
	},
	onmousemove: function (e) {
		if (this.params.flag) {
			var nowX = e.clientX;
			var disX = nowX - this.params.currentX;
			var finalLeft = parseInt(this.params.left) + disX;
			if (finalLeft < 0) {
				finalLeft = 0;
			} else if (finalLeft > this.maxX) {
				finalLeft = this.maxX;
			}
			this.calculateTime(finalLeft);
			this.refreshUI(finalLeft);
		}
	},
	startModify: function () {
		this.timeIndicator.css("background-color", "#7dc28b");
	},
	rollpadHandler: function (degreeOffset) {
		degreeOffset = -degreeOffset;
		this.rollpadSum += degreeOffset;
		if (Math.abs(this.rollpadSum) > 20) {
			var minute = this.getTime();
			if (this.rollpadSum > 0) {
				minute += 1;
			} else {
				minute -= 1;
			}
			if (minute < 0) {
				minute = 0;
			} else if (minute > 1440) {
				minute = 1440;
			}
			this.setTime(minute);
			this.rollpadSum = 0;
		}
	},
	finishModify: function () {
		this.timeIndicator.css("background-color", "#ffffff");
	},
	refreshUI: function (finalLeft) {
		this.draggable.css("left", finalLeft + "px");
		this.timeIndicator.html(this.getFormattedTime());
		if (typeof this.callback == "function") {
			this.callback(finalLeft);
		}
	},
	initUI: function () {
		var self = this;
		this.draggable = this.vdd.container;
		this.timeIndicator = this.vdd.showTime;
		this.container = $(this.container);
		this.timeIndicator.on("vclick", function () {
			self.rollpad.releaseOther();
			self.rollpad.setTargetDD(self);
			self.startModify();
			$("#bottomPannel").css("top", "1px");
		});
		var left = this.draggable.position().left;
		this.calculateTime(left);
		this.refreshUI(left);
	}
}).extend(DD);

var ODD = function (configure) {
	this.super.constructor.call(this, configure);
	$("#collapse").on("vclick", function () {
		$("#bottomPannel").css("top", "-410px");
	});
}.body({
	centerX: null,
	centerY: null,
	previousDegree: 0,
	targetDD: null,
	degreeOfAngleDistance: null,
	setTargetDD: function (targetDD) {
		this.targetDD = targetDD;
		this.callback = targetDD.rollpadHandler;
	},
	releaseOther: function () {
		if (this.targetDD) {
			this.targetDD.finishModify();
			this.targetDD = null;
		}
	},
	initDrag1: function () {
		if (this.centerX == null) {
			this.centerX = this.draggable.offset().left + this.draggable.width() / 2;
			this.centerY = this.draggable.offset().top + this.draggable.height() / 2;
		}
	},
	onmouseup: function () {
		this.params.flag = false;
	},
	onmousedown: function (event) {
		this.params.flag = true;
		event.stopImmediatePropagation();
		event.preventDefault();
		this.initDrag1();
		this.degreeOfAngleDistance = this.calculateDegree(event.clientX, event.clientY) - this.previousDegree;
	},
	onmousemove: function (e) {
		if (this.params.flag) {
			var nowY = e.clientY;
			var nowX = e.clientX;
			this.refreshUI(nowX, nowY);
		}
	},
	calculateDegree: function (px, py) {
		var y = this.centerY - py;
		var x = px - this.centerX;
		var degree = 0;
		if (x == 0) {
			if (y > 0) {
				degree = 90;
			} else {
				degree = 270;
			}
		} else if (x > 0) {
			if (y >= 0) {
				degree = Util.deTag(y / x);
			} else {
				degree = 360 - Util.deTag(-y / x);
			}
		} else {
			if (y >= 0) {
				degree = 180 - Util.deTag(y / -x);
			} else {
				degree = 180 + Util.deTag(-y / -x);
			}
		}
		return degree;
	},
	refreshUI: function (px, py) {
		if (px == undefined) {
			return;
		}
		var currentDegree = this.calculateDegree(px, py);
		degree = currentDegree - this.degreeOfAngleDistance;
		$("#pad").css("transform", "rotate(" + (-degree) + "deg)");
		if (this.callback) {
			if (this.previousDegree != degree) {
				var gap = 0;
				if (Math.abs(degree - this.previousDegree) > 270) {
					if (degree > this.previousDegree) {
						gap = degree - this.previousDegree - 360;
					} else {
						gap = degree - this.previousDegree + 360;
					}
				} else {
					gap = degree - this.previousDegree;
				}
				this.callback.call(this.targetDD, gap);
				this.previousDegree = degree;
			}
		}

	}
}).extend(DD);

var HDDBtns = function (configure) {
	this.super.constructor.call(this, configure);
}.body({
	container: null,
	maxX: 375,
	keyPosition: [],
	judgePosition: [],
	initKeyParameter: function () {
		this.judgePosition = [0, 62.5, 187.5, 312.5];
		this.keyPosition = [0, 125, 250, 375];
	},
	getKeyPosition: function (currentPosition) {
		var index = 3;
		for (var i = 0; i < 3; i++) {
			if (currentPosition >= this.judgePosition[i] && currentPosition < this.judgePosition[i + 1]) {
				index = i;
				break;
			}
		}
		return this.keyPosition[index];
	},
	setButton: function (btnNum) {
		var finalLeft = this.keyPosition[btnNum];
		this.draggable.css("left", finalLeft + "px");
		if (typeof this.callback == "function") {
			this.callback(finalLeft);
		}
		this.initDrag();
	},
	onmousemove: function (e) {
		if (this.params.flag) {
			var nowX = e.clientX;
			var disX = nowX - this.params.currentX;
			var finalLeft = parseInt(this.params.left) + disX;
			this.refreshUI(finalLeft);
		}
	},
	onmouseup: function () {
		if (this.params.flag) {
			this.params.flag = false;
			var finalLeft = this.getKeyPosition(this.draggable.position().left);
			this.draggable.css("left", finalLeft + "px");
			if (typeof this.callback == "function") {
				this.callback(finalLeft);
			}
			this.initDrag();
		}
	},
	refreshUI: function (finalLeft) {
		if (finalLeft == undefined) {
			finalLeft = 0;
		}
		if (finalLeft < 0) {
			finalLeft = 0;
		} else if (finalLeft > this.maxX) {
			finalLeft = this.maxX;
		}
		this.draggable.css("left", finalLeft + "px");
		if (typeof this.callback == "function") {
			this.callback(finalLeft);
		}
	},
	initUI: function () {
		var self = this;
		this.draggable = $(this.draggable);
		$("#btn1").on("vclick", function () {
			self.setButton(0);
		});
		$("#btn2").on("vclick", function () {
			self.setButton(1);
		});
		$("#btn3").on("vclick", function () {
			self.setButton(2);
		});
		$("#btn4").on("vclick", function () {
			self.setButton(3);
		});
		this.initKeyParameter();
		this.refreshUI();

	}
}).extend(DD);

var Battery = function (configure) {
	Util.copy(configure, this);
	this.init();
}.body({
	target: null,
	setBettery: function (v) {
		this.batteryVolumeNum.html(v);
		if (v < 10) {
			this.batteryVolume.css("background-color", "#ff0000");
		} else {
			this.batteryVolume.css("background-color", "#11cc11");
		}
		this.batteryVolume.css("width", v + "px");
	},
	init: function () {
		this.target = $(this.target);
		this.target.addClass("batteryContainer");
		this.batteryVolume = $('<div class="batteryVolume"></div>');
		this.target.append(this.batteryVolume);
		this.batteryVolumeNum = $('<div class="batteryVolumeNum"></div>');
		this.target.append(this.batteryVolumeNum);
	}
});

var WaterAlarm = function (configure) {
	Util.copy(configure, this);
	this.init();
}.body({
	target: null,
	show: function (show) {
		if (show) {
			this.target.css("visibility", "visible");
		} else {
			this.target.css("visibility", "hidden");
		}
	},
	init: function () {
		this.target = $(this.target);
		this.target.addClass("waterAlarm")
	}
});

var HoldBtn=function(configure){
    Util.copy(configure, this);
    this.init();
    this.initEvent();
}.body({
    name:"",
    target:"",
    targetDom:null,
    upHandler:null,
    downHandler:null,
    init:function(){
        this.targetDom=$(this.target);
    },
    initEvent:function(){
        var self=this;
        this.targetDom.on("vmousedown",function(){
            window.setTimeout(function(){
                self.targetDom.addClass("moveBG");
            },1);
            if(Util.isExist(self.downHandler)){
                self.downHandler();
            }
        });
        this.targetDom.on("vmouseup",function(){
            window.setTimeout(function(){
                self.targetDom.removeClass("moveBG");
            },10);
            if(Util.isExist(self.upHandler)){
                self.upHandler();
            }
        });
    }
});