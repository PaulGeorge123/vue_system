<template>
    <div>
        <div>
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>博客</el-breadcrumb-item>
                    <el-breadcrumb-item>博客编辑器</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div class="plugins-tips title">
                    YG博客 markdown编辑器
                    <el-link type="warning" @click="returnBlogList"><i class="el-icon-back"></i>返回博客列表 </el-link>
                    <!--                    访问地址：<a href="https://github.com/hinesboy/mavonEditor" target="_blank">mavonEditor</a>-->
                </div>
                <mavon-editor :ishljs="true" v-model="content" ref=md
                              @imgAdd="$imgAdd" @imgDel="$imgDel" @change="change"
                              @save="openAddMarkdownModel"
                              style="min-height: 600px"/>
            </div>
        </div>
        <!-- 添加Markdown弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addMarkdownModel" width="40%" :show-close="false"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" :ref="form" label-width="80px">
                <el-form-item label="博客标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入博客标题"></el-input>
                </el-form-item>
                <el-form-item label="博客类别" prop="category">
                    <el-input v-model="form.category" placeholder="请输入博客类别"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddMarkdownModel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor';
    import 'mavon-editor/dist/css/index.css';
    import 'mavon-editor/dist/highlightjs/highlight.min.js';
    import 'mavon-editor/dist/katex/katex';
    import {
        uploadPhotoFile, uploadMarkdownFile
    } from '../../service/api';

    export default {
        name: 'markdown',
        data: function() {
            return {
                //验证
                rules: {
                    title: [{ required: true, message: '请输入博客标题', trigger: 'blur' }],
                    category: [{ required: true, message: '请输入博客类别', trigger: 'blur' }],
                },
                //昵称
                nickname: '',
                //用户名
                username: '',
                // blog内容
                content: '',
                // 转化html
                html: '',
                configs: {},
                //照片(组)
                img_file: {},
                // 添加Markdown Model
                addMarkdownModel: false,
                //title
                form: {
                    title: '',
                    category: ''
                },
                //是否添加图片
                isAddPhotos: false,
                //是否成功
                isSuccess:false,
        }
            ;
        },
        components: {
            mavonEditor
        },
        created() {
            this.username = this.$cookieStore.getCookie('username');
            this.nickname = this.$cookieStore.getCookie('nickname');
        },
        methods: {
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file) {
                if (pos !== 0) {
                    // 缓存图片信息
                    this.img_file[pos] = $file;
                    this.isAddPhotos = true;
                }
            },
            $imgDel(pos) {
                delete this.img_file[pos];
            },
            // 第一步.将图片上传到服务器.
            async upLoadImg() {
                // 第一步.将图片上传到服务器.
                let formData = new FormData();
                for (let _img in this.img_file) {
                    formData.append(_img, this.img_file[_img]);
                }
                // 上传图片
                let res = await uploadPhotoFile({
                    file: this.img_file[0],
                    username: this.username
                });
                this.isSuccess = res.code === 1000;
            },
            // 上传Markdown文件
            async postMd() {
                let authorId = Number(this.nickname);
                let res = await uploadMarkdownFile({
                    username: this.username,
                    content: this.html,
                    title: this.form.title,
                    category: this.form.category,
                    authorId: authorId
                });
                this.isSuccess = res.code === 200;
            },
            //open 添加Markdown文件title
            openAddMarkdownModel() {
                this.addMarkdownModel = true;
            },
            closeAddMarkdownModel() {
                this.addMarkdownModel = false;
                this.isAddPhotos = false;
                this.form.title = '';
            },
            change(value, render) {
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            async submit() {
                if (this.isAddPhotos){
                    this.upLoadImg()
                }
                await this.postMd();
                this.content = '';
                this.form.title = '';
                this.addMarkdownModel = false;
                this.isAddPhotos = false;
                if (this.isSuccess){
                    this.$message({
                        message: '恭喜你，添加博客成功',
                        type: 'success',
                        duration: 1500
                    });
                }else {
                    this.$message({
                        type: 'error',
                        message: '不好意思，添加博客失败',
                        duration: 1500
                    });
                }
                // if (promise===1){
                //     this.$message.success('提交成功！');
                // }
                // console.log(this.content);//内容
                // console.log(this.html);

            },
            //返回博客列表
            returnBlogList(){
                this.$router.push({ path: '/blog/blogall' });
            }
        }
    };
</script>
<style scoped>
    .editor-btn {
        margin-top: 20px;
    }
    .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

</style>