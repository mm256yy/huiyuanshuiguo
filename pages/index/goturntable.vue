<template>
	<view class="bg" :style="{backgroundColor:template.color.temp_color}">
		<view class="container">

			<!-- <view class="limitbean">
				<view class="" style="display: flex;justify-content: center;align-items: center;padding: 0 100rpx;">
					<u-input color='#fff' @confirm=exchange() placeholder="请输入兑换口令" v-model="name" placeholderStyle="color:#fff"
						style="background-color: #fff;color: #fff;" ></u-input>
					<button class="btn" type="default" @tap="exchange()">兑换 </button>
				</view>
			</view> -->
			<view class="frame_view" v-if="contentobj.style==1">
				<view class="frame_row" style="margin-top: 48rpx;">
					<view class="frame_item" :class="'item' + color[0]">
						<image :src="award[0].pic"></image>
						<text>{{ award[0].title }}</text>
					</view>
					<view class="frame_item" :class="'item' + color[1]">
						<image :src="award[1].pic"></image>
						<text>{{ award[1].title }}</text>
					</view>
					<view class="frame_item" :class="'item' + color[2]">
						<image :src="award[2].pic"></image>
						<text>{{ award[2].title }}</text>
					</view>
				</view>


				<view class="frame_row">
					<view class="frame_item" :class="'item' + color[7]">
						<image :src="award[7].pic"></image>
						<text>{{ award[7].title }}</text>
					</view>
					<view style="text-align: center;color: #fff;">
						<!-- <view style="font-size: 36rpx;">{{ free }}次</view>
						<view style="font-size: 28rpx;">剩余次数</view> -->
						<view style="font-size: 26rpx;">{{ contentobj.score }}积分/次</view>
						<view style="font-size: 26rpx;padding-top: 10rpx;">可用{{userInfoData.score||0}}积分</view>
					</view>
					<view class="frame_item" :class="'item' + color[3]">
						<image :src="award[3].pic"></image>
						<text>{{ award[3].title }}</text>
					</view>
				</view>

				<view class="frame_row">
					<view class="frame_item" :class="'item' + color[6]">
						<image :src="award[6].pic"></image>
						<text>{{ award[6].title }}</text>
					</view>
					<view class="frame_item" :class="'item' + color[5]">
						<image :src="award[5].pic"></image>
						<text>{{ award[5].title }}</text>
					</view>
					<view class="frame_item" :class="'item' + color[4]">

						<image :src="award[4].pic"></image>
						<text>{{ award[4].title }}</text>
					</view>
				</view>
			</view>
			<view class="luckbtulist" v-if="contentobj.style==1">
				<view class="luckone" @click="clickLuckTap()">
					<p style="margin-top: 30upx;">{{ contentobj.score||0 }}积分抽一次</p>
				</view>
			</view>


			<!-- 大转盘 -->
			<view class="lucky-draw" :style="scale" v-if="contentobj.style==2">

				<image class="lucky-draw__bg" src="http://cdn.sncat.ddyy.top/ece3f08cadefa73af31bcf04a503e6fe.png"
					mode="widthFix" style="width: 750rpx;"></image>

				<view class="lucky-draw__objects" :style="rotateStyle">
					<image src="http://cdn.sncat.ddyy.top/a231e3f694f0d423607325bda01de841.png"
						class="lucky-draw__objects__bg"></image>
					<view class="lucky-draw__objects__object" v-for="(item, index) in award" :key="index" :style="{
			      transform: `translate(-50%) rotate(${(360 / 8) * index}deg)`,
			    }">
						<view class="lucky-draw__objects__object__title">{{ item.title }}</view>
						<image class="lucky-draw__objects__object__icon" :src="item.pic" style=""></image>
					</view>
				</view>
				<image class="lucky-draw__start" src="http://cdn.sncat.ddyy.top/0dd505a71bce00baf6f952cbfa50deab.png"
					mode="widthFix" @click="startaTap()"></image>
				<view class=""
					style="color: #fff;display: flex;justify-content: center;align-items: center;font-size: 32rpx;">
					<!-- 您还有 <text style="color: gold;padding: 0 10rpx;">{{free}}</text> 次抽奖机会 -->
					<text style="color: gold;padding: 0 10rpx;">{{ contentobj.score }}</text>积分/次，可用<text
						style="color: gold;padding: 0 10rpx;">{{userInfoData.score||0}}</text>积分
				</view>
			</view>

			<view class="lucktips">
				<view class="lucktab">
					<view class="luckrule" @click="toggleTabs(0)" :class="nowIndex == 0 ? 'action' : ''">活动规则</view>
					<view class="record" @click="toggleTabs(1)" :class="nowIndex == 1 ? 'action' : ''">获奖记录</view>
				</view>
				<view v-show="nowIndex == 0" class="ruleinof">
					<view class="ruleconten" style="width: 100%;height: 100%;  margin-top: 40rpx;overflow-y:auto;">
						<!-- <img :src="images" alt=""> -->
						<rich-text :nodes="content"></rich-text>
					</view>
				</view>
				<view class="ruleinof" v-show="nowIndex == 1">
					<view class="none_list_box" v-if="userlist.length === 0" style="height: 45vh;">
						<image src="../../static/images/none_data_icon_01.png"></image>
						<span>暂无获奖记录</span>
					</view>
					<view style="width: 100%;height: 496rpx;  margin-top: 40rpx;overflow-y:auto;" v-else>
						<view class="recordlist" v-for="(item, index) in userlist" :key="index">
							<view>时间:{{ item.uptime }}</view>
							<view>奖品:{{ item.win_prize_title }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出窗口 -->
		<view :class="{ 'share-box': shareState }" @click="handleHiddenShare">
			<view v-if="lucktype == 0" class="nopop" :class="{ 'share-show': shareState }">
				<view style="margin-top: 60rpx;margin-left: 180rpx;margin-bottom: 30rpx;">
					<image src="https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_36_52_5.png" mode=""
						style="width: 124rpx;height: 144rpx;"></image>
				</view>
				<view class="poptitle">{{shareTitle||'您已经没有抽奖机会了'}}</view>
				<view class="popbtn">确定</view>
			</view>
			<!-- 单抽 -->
			<view v-else-if="lucktype == 1" class="onepop" :class="{ 'share-show': shareState }">
				<view class="popconten">
					<image :src="prizeimg" mode="" style="width: 190rpx;height: 190rpx;"></image>
					<view style="margin-top: 20rpx;color: #4A4A4A;font-size: 28rpx;">{{ prize }}</view>
				</view>
				<view class="popbtn" style="margin-top: -90rpx;">确定</view>
			</view>

		</view>
	</view>
</template>

<script>
	//计数器
	var interval = null;
	//值越大旋转时间越长  即旋转速度
	var intime = 100;
	export default {
		data() {
			return {
				// 九宫格
				shareShow: false,
				shareCoverShow: false,
				name: '',
				//抽奖记录的显示
				isif: false,
				cjtime: "",
				images: '', //活动规则
				userlist: [], //抽奖记录列表
				// nowIndex为0的时候显示抽奖规则，nowIndex为1的时候显示抽奖记录
				nowIndex: 0,
				// 九宫格初始化的位置
				color: [0, 0, 0, 0, 0, 0, 0, 0],
				//ctype中奖率   
				award: [{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_34_47_2.png',
						name: '电冰箱',
						ctype: 2,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_35_36_10.png',
						name: '洗衣机',
						ctype: 20,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_35_36_10.png',
						name: '手机',
						ctype: 0,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_34_47_2.png',
						name: '笔记本',
						ctype: 0,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_35_36_10.png',
						name: '空调',
						ctype: 0,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_34_47_2.png',
						name: '电脑',
						ctype: 0,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_35_36_10.png',
						name: '谢谢参与',
						ctype: 0,

					},
					{
						img: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_35_36_10.png',
						name: '冰箱',
						ctype: 0,

					}
				], //接收数组
				Luck: true, //防置重复点击
				lucktype: 2, //判断奖品类型
				luckPosition: '', //停止位置
				prize: '', //奖品，
				prizeimg: 'https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_35_36_10.png', //奖品图片
				// 弹窗按钮
				shareState: false,
				shareTitle: '您已经没有抽奖机会了',
				// tab切换
				styleObject: {
					'border-bottom': '3px solid #A24A1E',
				},
				styleObject1: '',
				//免费抽奖次数
				free: 0,
				// 判断类型
				payout: 0,
				content: '',
				contentobj: {},

				// 大转盘
				isStart: true, //为了不连续点击
				rotateAngle: 0, // 旋转角度
				cycle: 1, // 第几次抽奖
				duration: 5000, //旋转时间
				circle: 5, //旋转圈数
				mode: 'cubic-bezier(0.2, 0, 0, 1)', //效果
				size: 686,
				template: uni.getStorageSync('__ddminiTemplateConfig'),

				userInfoData: ''
			};
		},
		computed: {
			rotateStyle() {
				return `
			transition: transform ${this.duration}ms ${this.mode};
			transform: rotate(${this.rotateAngle}deg);`;
			},
			scale() {
				return `transform: scale(${this.size / 686})`;
			},
		},
		created() {
			//获取当前时间戳
			var date = new Date().getTime();
			// 把当前的时间戳转换成yyy-MM-dd HH:mm:ss
			function timestampToTime(timestamp) {
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;
			}
			var hour = timestampToTime(date)
			this.cjtime = hour;
		},
		onShow() {
			this.getRotarylotteryInfo()
			this.getrotarylotteryNumber()
			this.getrotarylotteryList()
			this.getUserInfo();
		},
		onShareAppMessage() {
			let self = this;
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title,
				imageUrl: shop.shop_share_pic,
				path: 'pages/index/index'
			}
		},
		methods: {
			getUserInfo() {
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if (res.code === 0) {
						self.userInfoData = res.data;
					}
				})
			},
			// 获取配置
			getRotarylotteryInfo() {
				let self = this;
				self.Get(self.Url.rotarylotteryInfo).then(res => {
					if (res.code === 0) {

						self.award = res.data.prize_list;
						self.images = res.data.pic;
						self.contentobj = res.data
					}
				})
				self.Get(self.Url.noticeDetail, {
					id: 123
				}).then(res => {
					if (res.code === 0) {
						self.content = res.data.contents;
						// self.images=res.data.pic
					}
				})

			},
			// 兑换
			exchange() {
				let self = this;

				if (this.name == '') {
					uni.showToast({
						title: '请输入口令',
						icon: 'none'
					})
					return
				} else {
					let data = {
						code: this.name
					}
					uni.showModal({
						title: '提示',
						content: '确定兑换？',
						cancelText: "取消", // 取消按钮的文字  
						confirmText: "确认", // 确认按钮的文字  
						showCancel: true, // 是否显示取消按钮，默认为 true
						success: (res) => {
							if (res.confirm) {
								//点击确定之后执行的代码
								self.Get(self.Url.rotarylotteryNumber, data).then(res => {
									if (res.code === 0) {
										this.name = ''
										uni.showToast({
											title: '兑换成功',
											icon: 'none'
										})
										self.getrotarylotteryNumber()
									} else {
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									}
								})
							} else {
								//点击取消之后执行的代码
							}
						}

					})
				}

			},

			// 获取次数,验证口令
			getrotarylotteryNumber() {
				let self = this;
				self.Get(self.Url.rotarylotteryNumber).then(res => {
					if (res.code === 0) {
						this.free = res.data.number

					}
				})
			},
			// 抽奖记录
			getrotarylotteryList() {
				let self = this;
				self.Get(self.Url.rotarylotteryList).then(res => {
					if (res.code === 0) {
						self.userlist = res.data.list
					}
				})
			},
			// 记录切换nowIndex(0)的时候显示活动规则nowIndex(1)的时候显示奖品记录
			toggleTabs(index) {
				this.nowIndex = index;
				if (index == 0) {
					this.getRotarylotteryInfo()
				} else {
					this.getrotarylotteryList()
				}
			},
			// 关闭中奖弹窗
			handleHiddenShare() {
				this.shareState = false;
				this.shareTitle = '您已经没有抽奖机会了';
			},
			clickLuckTap() {
				let self = this;
				//判断积分是否充足
				if (self.userInfoData.score < self.contentobj.score) {
					self.shareTitle = '可用积分不足';
					self.shareState = true;
					self.lucktype = 0;
					self.Luck = true;
					return
				}
				self.Get(self.Url.rotarylotteryNumber, {
					type: 1
				}).then(res => {
					if (res.code === 0) {
						self.getUserInfo();
						self.clickLuck();
					} else {
						uni.showModal({
							content: res.msg,
							showCancel: false
						});
					}
				})
			},
			// 点击抽奖
			clickLuck() {
				let self = this;
				if (self.Luck == false) { //防止过度点击
					return;
				}
				self.Luck = false;
				// }
				//判断免费次数		
				// if (this.free == 0) {
				// 	this.shareState = true
				// 	this.lucktype = 0
				// 	this.Luck = true;
				// 	return;
				// }
				if (this.free != 0) {
					this.free = this.free - 1 //抽奖次数减1
				}
				if (this.free == 0) {
					this.payout = 1
				}
				//清空计时器
				clearInterval(interval);
				var index = 0;
				//循环设置每一项的背景图
				interval = setInterval(function() {
					var c = [0, 0, 0, 0, 0, 0, 0, 0];
					if (index > 7) {
						index = 0;
					}
					c[index] = 1;
					self.color = c;
					index++;
				}, intime);
				self.Get(self.Url.rotarylotteryLucky).then(res => {
					if (res.code === 0) {
						self.prize = res.data.win_prize_title //奖品名字
						self.prizeimg = res.data.win_prize_pic //奖品图片
						self.stop(res.data.zzflag);
						self.getUserInfo();
					}
				})
			},

			// 停止
			stop(which) {
				var e = this;
				//清空计数器
				clearInterval(interval);
				//初始化当前位置
				var current = -1;
				var color = e.color;
				for (var i = 0; i < color.length; i++) {
					if (color[i] == 1) {
						current = i;
					}
				}
				//下标从1开始
				var index = current + 1;
				e.stopLuck(which, index, intime, 10);
			},
			/**
			 * which:中奖位置
			 * index:当前位置
			 * time：时间标记
			 * splittime：每次增加的时间 值越大减速越快
			 */
			stopLuck(which, index, time, splittime) {
				var e = this;
				//值越大出现中奖结果后减速时间越长
				var color = e.color;
				setTimeout(function() {
					//重置前一个位置
					var c = [0, 0, 0, 0, 0, 0, 0, 0];
					if (index > 7) {
						index = 0;
					}
					//当前位置为选中状态
					c[index] = 1;
					e.color = c;
					//如果旋转时间过短或者当前位置不等于中奖位置则递归执行
					//直到旋转至中奖位置
					if (time < 400 || index != which) {
						//越来越慢
						splittime++;
						time += splittime;
						//当前位置+1
						index++;
						e.stopLuck(which, index, time, splittime);
					} else {
						//中奖
						e.shareState = true
						e.Luck = true;
						e.lucktype = 1
						if (e.payout == 1) {
							e.limitnum = e.limitnum - 3
						}
					}
				}, time);
			},
			// 大转盘
			startaTap() {
				let self = this;
				//判断积分是否充足
				if (self.userInfoData.score < self.contentobj.score) {
					self.shareTitle = '可用积分不足';
					self.shareState = true;
					self.lucktype = 0;
					self.Luck = true;
					return
				}
				self.Get(self.Url.rotarylotteryNumber, {
					type: 1
				}).then(res => {
					if (res.code === 0) {
						self.getUserInfo();
						self.starta();
					} else {
						uni.showModal({
							content: res.msg,
							showCancel: false
						});
					}
				})
			},
			starta() {

				if (this.isStart == false) { //防止过度点击
					return;
				}
				this.isStart = false;
				//这里我是写的一个随机数。
				//当后台返回我所获得的奖项id，根据id和数组里的比较，相等则旋转到奖品角度
				if (this.free == 0) {
					this.shareState = true
					this.lucktype = 0
					this.isStart = true;
					return;
				}
				if (this.free != 0) {
					this.free = this.free - 1 //抽奖次数减1
				}
				if (this.free == 0) {
					this.payout = 1
				}
				this.Get(this.Url.rotarylotteryLucky).then(res => {
					if (res.code === 0) {
						this.rotateAngle =
							this.circle * 360 * this.cycle - (360 / 8 + (res.data.zzflag - 1) * (360 / 8));
						this.cycle++;
						this.prize = res.data.win_prize_title //奖品名字
						this.prizeimg = res.data.win_prize_pic

						setTimeout(() => {
							this.shareState = true
							this.lucktype = 1
						}, 6000)
						this.isStart = true;
						this.getUserInfo();
					}
				})
			}
		},

	};
</script>

<style lang="scss">
	page {
		width: 750rpx;
		overflow-x: hidden;
	}

	.lucky-draw {
		position: relative;
		width: fit-content;

		&__bg {
			width: 686rpx;
			display: block;
		}

		&__lights {
			position: absolute !important;
			width: 676rpx;
			left: 6rpx;
			top: 10rpx;
			display: block;
			animation: infinite 1s alternate lights steps(1, end);
		}

		&__objects {
			position: absolute;
			top: 100rpx;
			left: 135rpx;
			right: 63rpx;
			bottom: 78rpx;
			width: 500rpx;
			height: 500rpx;

			&__bg {
				position: absolute;
				width: 500rpx;
				height: 500rpx;
			}

			&__object {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 0;
				transform-origin: 50% 250rpx;

				&__title {
					margin-top: 60rpx;
					color: #F54319;
					font-size: 30rpx;
					-webkit-transform: scale(0.7);
				}

				&__icon {
					width: 52rpx;
					height: 52rpx;
					display: block;
					margin: 0 auto 0;
				}
			}
		}

		&__start {
			width: 150rpx;
			height: 170rpx;
			display: block;
			position: absolute;
			left: 310rpx;
			top: 242rpx;
		}
	}

	@keyframes lights {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(15deg);
		}

		100% {
			transform: rotate(0deg);
		}
	}

	.btn {
		height: 36px;
		width: 70px;
		margin-left: 10px;
		font-size: 16px;
		line-height: 38px;
		font-family: "Microsoft YaHei",
	}

	.bg {
		width: 100%;
		background-color: #136eb7;
		background-size: 100% 100%;
		padding-bottom: 40rpx;
		padding-top: 80rpx;
	}

	.active {
		border-bottom: 3px solid #A24A1E,
	}

	.container {
		overflow: hidden;
	}

	.limitbean {
		width: 100%;
		color: #fff;
		text-align: center;
		margin-top: 80rpx;
		font-size: 30rpx;
		margin-bottom: 24rpx;
	}

	.u-input .data-v-fdbb9fe6 .u-border .u-radius .u-square {
		border: 1rpx solid #fff;
	}

	.frame_view {
		width: 648rpx;
		height: 688rpx;
		margin: 0 auto;
		border-radius: 30rpx;
		background: url("https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_37_50_4.png") no-repeat;
		background-size: 100% 100%;
		overflow: hidden;
	}

	.frame_row {
		width: 520rpx;
		height: 168rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 64rpx;
		margin-bottom: 20rpx;

	}

	.frame_item {
		width: 168rpx;
		height: 168rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		font-size: 20px;
		/* box-sizing:border-box; */
		background: #FFFFFF;
		/* 	border-radius: 17px; */
		/* 	box-shadow: 0px 6px 0px 0px rgba(236,231,228,1); */
		background: url("https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_41_5_0.png") no-repeat;
		background-size: 100% 100%;


	}

	.frame_item image {
		width: 80rpx;
		height: 80rpx;
		display: block;

	}

	.frame_item text {
		font-size: 26rpx;
		display: block;
		width: 100%;
		text-align: center;
		color: #818181;
		margin-top: -40rpx;
	}

	.item1 {
		background: url("https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_42_16_6.png") no-repeat;
		background-size: 100% 100%;
		// box-shadow: 0px 10px 20px 0px rgba(170,56,0,1), 0px 0px 20px 0px rgba(196,58,215,1), 0px 4px 0px 0px rgba(255,255,255,0.29);

	}

	.luckbtulist {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.luckone {
		width: 380rpx;
		height: 100rpx;
		background: linear-gradient(360deg, #E4392C 0%, #F6A261 100%);
		box-shadow: 0px 10px 20px 0px rgba(153, 0, 0, 0.81), 0px 5px 0px 0px #c33007, 0px 4px 0px 0px rgba(255, 255, 255, 0.23);
		border-radius: 50rpx;
		text-align: center;
		font-size: 38rpx;
		line-height: 38rpx;
		font-weight: bold;
		margin-top: 20rpx;
	}

	.luckfive {
		width: 310upx;
		height: 100upx;
		background: linear-gradient(180deg, #FFC3AC 0%, #D43EDC 100%);
		box-shadow: 0px 10px 20px 0px rgba(170, 56, 0, 1), 0px 5px 0px 0px rgba(196, 58, 215, 1), 0px 4px 0px 0px rgba(255, 255, 255, 0.29);
		border-radius: 50px;
		text-align: center;
	}

	.lucktips {
		width: 686rpx;
		// height: 800rpx;
		background: #fff;
		border-radius: 20rpx;
		margin: 0 auto;
		margin-top: 70rpx;
		padding-bottom: 50rpx;
	}

	.lucktab {
		width: 580rpx;
		height: 104rpx;
		border-bottom: 1rpx solid #efefef;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 28rpx;
		color: #999;
	}

	.lucktab view {
		height: 100%;
		line-height: 104rpx;
	}

	.action {
		color: #F54319;
		border-bottom: 3px solid #F54319;

	}

	.ruleinof {
		width: 584rpx;
		// height: 496rpx;
		margin: 0 auto;
		font-size: 28rpx;
		font-weight: 400;
		color: #1f1f1f;
		max-height: 584rpx;
		overflow-y: scroll;

	}

	.ruleinof .ruleconten {
		margin-top: 40rpx;
		line-height: 40rpx;
	}

	.recordlist {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}



	.share-box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		bottom: 0rpx;
		right: 0rpx;
		background-color: rgba(0, 0, 0, 0.4);
		transition: .3s;
		z-index: 999;
	}

	.nopop {
		display: none;
		width: 470rpx;
		height: 455rpx;
		background: #FFFFFF;
		border-radius: 30px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -228rpx;
		/* 高度的一半 */
		margin-left: -235rpx;
		/* 宽度的一半 */
	}

	.share-show {
		display: block !important;
	}

	.poptitle {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #4A4A4A;
		text-align: center;

	}

	.popbtn {
		width: 310upx;
		height: 100upx;
		background: linear-gradient(360deg, #E4392C 0%, #F6A261 100%);
		box-shadow: 0px 10px 10px 0px rgba(153, 0, 0, 0.81), 0px 5px 0px 0px rgba(195, 48, 7, 1), 0px 4px 0px 0px rgba(255, 255, 255, 0.23);
		border-radius: 50upx;
		margin-right: 28rpx;
		text-align: center;
		line-height: 100upx;
		font-size: 32upx;
		color: #fff;
		margin: 0 auto;
		margin-top: 36upx;
	}

	.onepop {
		display: none;
		width: 696rpx;
		height: 872rpx;
		background: url("https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_41_31_5.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -438rpx;
		/* 高度的一半 */
		margin-left: -350rpx;
		/* 宽度的一半 */
		overflow: hidden;
	}

	.popconten {
		width: 470rpx;
		height: 472rpx;
		background: url("https://cdnapp.jixianzhilu.cn/circle_image/2021_06_8_14_39_28_5.png") no-repeat;
		background-size: 100% 100%;
		margin: 0 auto;
		margin-top: 340rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.popcontenlist {
		width: 470rpx;
		height: 300rpx;
		margin: 0 auto;
		margin-top: 370rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;

	}

	.poplucklist {
		width: 88rpx;
		height: 180rpx;
		margin-left: 56rpx;
	}

	.share_box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 400rpx;

		.label {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;
			padding: 30rpx 0 0;
			position: relative;

			span {
				color: #1c1c1c;
				font-size: 28rpx;
				padding-top: 6rpx;
			}

			button {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}
	}
</style>
