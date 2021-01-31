<template>
    <div class="text-tooltip">
        <el-tooltip class="item" effect="dark" :disabled="isShowTooltip" :content="content" placement="bottom">
            <p class="over-flow" :class="className" @mouseover="onMouseOver(refName)">
                <span :ref="refName">{{content||'-'}}</span>
            </p>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: 'Tooltip',
        props: {
            // 显示的文字内容
            content: {
                type: String,
                default: () => {
                    return '';
                }
            },
            // 外层框的样式，在传入的这个类名中设置文字显示的宽度
            className: {
                type: String,
                default: () => {
                    return '';
                }
            },
            // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
            refName: {
                type: String,
                default: () => {
                    return '';
                }
            }
        },
        data() {
            return {
                isShowTooltip: true
            };
        },
        methods: {
            onMouseOver(str) {
                let parentWidth = this.$refs[str].parentNode.offsetWidth;
                let contentWidth = this.$refs[str].offsetWidth;
                // 判断是否开启tooltip功能
                this.isShowTooltip = contentWidth <= parentWidth;
            }
        }
    };
</script>

<style scoped>
    .over-flow {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
