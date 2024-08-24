<template>
	<view class="mdEditor">
		<view class="toolbar">
			<view class="iconfont icon-bold" @click="toolBarClick('bold')" />
			<view class="iconfont icon-italic" @click="toolBarClick('italic')" />
			<view class="iconfont icon-title" @click="toolBarClick('header')" />
			<view class="iconfont icon-underline" @click="toolBarClick('underline')" />
			<view class="iconfont icon-strikeThrough" @click="toolBarClick('strike')" />
			<view class="iconfont icon-inIndentation" @click="toolBarClick('inIndentation')" />
			<view class="iconfont icon-reIndentation" @click="toolBarClick('reIndentation')" />
			<view class="iconfont icon-superscript" @click="toolBarClick('sup')" />
			<view class="iconfont icon-subscript" @click="toolBarClick('sub')" />
			<view class="iconfont icon-ul" @click="toolBarClick('ul')" />
			<view class="iconfont icon-ol" @click="toolBarClick('ol')" />
			<view class="iconfont icon-dividingLine" @click="toolBarClick('dividingLine')" />
			<view class="iconfont icon-hyperlinke" @click="toolBarClick('link')" />
			<view class="iconfont icon-image" @click="toolBarClick('img')" />
			<view class="iconfont icon-inlineCode" @click="toolBarClick('inlineCode')" />
			<view class="iconfont icon-codeBlock" @click="toolBarClick('code')" />
			<view class="iconfont icon-table" @click="toolBarClick('table')" />
			<view class="iconfont icon-quote" @click="toolBarClick('quote')" />
			<view class="iconfont icon-taskList" @click="toolBarClick('taskList')" />
			<view class="iconfont icon-empty" @click="toolBarClick('clear')" />
			<view class="iconfont icon-toggle" @click="toolBarClick('toggle')" />
			<view class="submit">
				<button type="primary" size="mini" @click="submit">保存</button>
			</view>
		</view>
		<view class="input-content">
			<textarea v-if="status" maxlength="-1" v-model="textareaData"></textarea>
			<towxml v-if="!status" :nodes="textareaHtml" />
		</view>
	</view>
</template>

<script>
	export default {
		name: "mdEditor",
		data() {
			return {
				textareaData: "",
				textareaHtml: "",
				status: true,
			};
		},
		props: {
			textareaDataProp: {
				type: String,
				default: "",
			},
		},
		created() {
			this.textareaData = this.textareaDataProp;
		},
		methods: {
			submit() {
				this.$emit("submit", {
					textareaData: this.textareaData,
					textareaHtml: this.textareaHtml,
				});
			},
			toolBarClick(type) {
				const adjustIndentation = (increase) => {
					const lines = this.textareaData.split("\n");
					if (lines.length > 0) {
						const lastLineIndex = lines.length - 1;
						if (increase) {
							lines[lastLineIndex] = "  " + lines[lastLineIndex]; // 增加两个空格缩进
						} else {
							lines[lastLineIndex] = lines[lastLineIndex].replace(/^ {2}/, ""); // 减少两个空格缩进
						}
						this.textareaData = lines.join("\n");
					}
				};
				const appendText = (text) => {
					this.textareaData += text;
				};

				const headers = ["#", "##", "###", "####", "#####", "######"];

				switch (type) {
					case "bold":
						appendText("**粗体文字** ");
						break;
					case "italic":
						appendText("*斜体* ");
						break;
					case "header":
						uni.showActionSheet({
							itemList: ["标题1", "标题2", "标题3", "标题4", "标题5", "标题6"],
							success: (res) =>
								appendText(
									`\n${headers[res.tapIndex]} 标题${res.tapIndex + 1}\r`
								),
						});
						break;
					case "underline":
						appendText("++下划线++ ");
						break;
					case "strike":
						appendText("~~删除线~~ ");
						break;
					case "sup":
						appendText("^上角标^ ");
						break;
					case "sub":
						appendText("~下角标~ ");
						break;
					case "link":
						appendText("[在此输入网址描述](在此输入网址) ");
						break;
					case "img":
						uni.chooseImage({
							count: 1,
							success: (res) => {
								appendText(
									`<img src="${res.tempFilePaths[0]}" style="zoom:100%;" />`
								);
								// appendText(`![](${res.tempFilePaths[0]}) `);
							},
						});

						break;
					case "code":
						appendText("\n``` 代码块 \n\n```\n");
						break;
					case "table":
						appendText("\n|列1|列2|列3|\n|-|-|-|\n|单元格1|单元格2|单元格3|\n");
						break;
					case "inlineCode":
						appendText("`行内代码块`");
						break;
					case "taskList":
						appendText("\n- [ ] 任务列表");
						break;
					case "quote":
						appendText("\n> 引用内容");
						break;
					case "inIndentation":
						adjustIndentation(true);
						break;
					case "reIndentation":
						adjustIndentation(false);
						break;
					case "dividingLine":
						appendText("\n------");
						break;
					case "ul":
						appendText("\n- 无序列表1");
						break;
					case "ol":
						appendText("\n1. 有序列表");
						break;
					case "clear":
						uni.showModal({
							title: "提示",
							content: "确定清空?",
							success: (res) => {
								if (res.confirm) {
									this.textareaData = "";
								}
							},
						});
						break;
					case "toggle":
						this.status = !this.status;
						break;
				}
			},
		},
		watch: {
			textareaData: function(newValue, oldValue) {
				console.log("111", newValue);
				this.textareaHtml = this.towxml(newValue, "markdown", {
					// theme: "dark",
					events: {
						tap: (e) => {
							console.log("tap", e);
						},
					},
				});
			},
		},
	};
</script>

<style>
	@import "../static/markdown.css";

	.mdEditor {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.toolbar {
		width: 100%;
		border: none;
		box-shadow: 0 0px 4px rgba(0, 0, 0, 0.157), 0 0px 4px rgba(0, 0, 0, 0.227);
		position: relative;
	}

	.toolbar .iconfont {
		display: inline-block;
		cursor: pointer;
		width: calc(100% / 9);
		/* 固定宽度 */
		aspect-ratio: 1;
		/* 高度与宽度相等 */
		font-size: 33px;
		padding: 10rpx;
		color: #757575;
		text-align: center;
		background: none;
		border: none;
		outline: none;
		line-height: 2.2;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.toolbar .submit {
		height: calc(100% / 3);
		position: absolute;
		bottom: 0;
		right: 30rpx;
		display: flex;
		align-items: center;
	}

	.input-content {
		width: 100%;
		flex: 1;
		/* 占据剩余空间 */
		overflow: auto;
	}

	.input-content textarea {
		font-family: PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB,
			Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
		height: 100%;
		width: 100%;
		padding: 16rpx 25rpx;
		box-sizing: border-box;
		font-size: 30px;
		line-height: 1.5;
	}
</style>