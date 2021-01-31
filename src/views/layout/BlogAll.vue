<template>
    <div>
        <div>
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>博客</el-breadcrumb-item>
                    <el-breadcrumb-item>所有博客列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="container">
                <div>
                    <div class="handle-box" style="min-width: 762px;">
                        <!--                        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">-->
                        <!--                            批量删除-->
                        <!--                        </el-button>-->
                        <!--                        <el-input v-model="searchInfo" placeholder="请输入用户名" class="handle-input mr10" clearable></el-input>-->
                        <el-input placeholder="请输入内容" v-model="search.searchInfo"
                                  class="input-with-select handle-input mr10">
                            <el-select v-model="search.select" slot="prepend" placeholder="搜索类别">
                                <el-option label="博客名称" value="title"></el-option>
                                <el-option label="博客类别" value="category"></el-option>
                                <el-option label="博客作者" value="author"></el-option>
                            </el-select>
                        </el-input>
                        <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="addBlog">编写博客</el-button>
                    </div>
                    <!-- 文章内容块 -->
                    <div class="table">
                        <el-table :data="blogTableData" border class="table"
                                  ref="multipleTable" header-cell-class-name="table-header">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column prop="id" label="序号" align="center" width="55">
                                <template scope="scope">
                                    <span>{{(query.pageIndex - 1) * 7 + (scope.$index + 1)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="title" label="博客名称" align="center"></el-table-column>
                            <el-table-column label="博客" align="center">
                                <template slot-scope="scope">
                                    <el-tag>{{scope.row.category}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="发布时间" align="center">
                                <template slot-scope="scope">
                                    {{$moment(scope.row.datetime).format('YYYY-MM-DD')}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="author" label="作者" align="center"></el-table-column>
                            <el-table-column label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit"
                                               @click="moreBlogDetails(scope.row.id)">详情
                                    </el-button>
                                    <el-button type="text" icon="el-icon-delete" style="color: red"
                                               @click="openDeleteBlog(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="pagination1">
                    <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query.pageIndex"
                            :page-size="query.pageSize"
                            :total="query.pageTotal"
                            @current-change="handlePageChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        queryBlogAllList, removeMongoDbById, queryFuzzyBlog
    } from '../../service/api';

    export default {
        name: 'blogall',
        data() {
            return {
                //搜索
                search: {
                    //搜索类别
                    select: '',
                    //搜索信息
                    searchInfo: ''
                },
                blogList: [],
                blog: {
                    attention: 1,
                    author: '',
                    browse: 0,
                    category: '',
                    collection: 0,
                    content: '',
                    datetime: '',
                    id: 0,
                    thumb_up: 0,
                    title: ''
                },
                //分页 blog
                blogTableData: [],
                //分页 query
                query: {
                    //当前页 index
                    pageIndex: 1,
                    //每页的数量
                    pageSize: 7,
                    //总记录数
                    pageTotal: 0
                }
            };
        },
        async created() {
            await this.getBlogAllList(this.query.pageIndex);
        },
        methods: {
            //搜索
            async doSearch() {
                let searchInfo = this.search.searchInfo;
                let select = this.search.select;
                let keywords = {
                    title: '',
                    category: '',
                    author: ''
                };
                if (select === 'title') {
                    keywords = {
                        title: searchInfo,
                        pageNum: this.query.pageIndex,
                        pageSize: this.query.pageSize
                    };
                }
                if (select === 'category') {
                    keywords = {
                        category: searchInfo,
                        pageNum: this.query.pageIndex,
                        pageSize: this.query.pageSize
                    };
                }
                if (select === 'author') {
                    keywords = {
                        author: searchInfo,
                        pageNum: this.query.pageIndex,
                        pageSize: this.query.pageSize
                    };
                }
                let res = await queryFuzzyBlog(keywords);
                this.blogTableData = res.data.list;
                this.query.pageTotal = res.data.total;
                this.query.pageSize = res.data.pageSize;
            },
            //获取所有Blog
            async getBlogAllList(pageIndex) {
                const loading = this.$loading({
                    lock: true,//lock的修改符--默认是false
                    text: 'Loading',//显示在加载图标下方的加载文案
                    spinner: 'el-icon-loading',//自定义加载图标类名
                    background: 'rgba(0, 0, 0, 0.7)'//遮罩层颜色
                    // target: document.querySelector('#table')//loadin覆盖的dom元素节点
                });
                let res = await queryBlogAllList({
                    pageNum: pageIndex,
                    pageSize: 7
                });
                //成功回调函数停止加载
                loading.close();
                this.blogTableData = res.data.list;
                this.query.pageTotal = res.data.total;
                this.query.pageSize = res.data.pageSize;
            },
            //博客详情
            moreBlogDetails(id) {
                this.$router.push({
                    path: '/blog/markdownecho',
                    query: {
                        blogId: id
                    }
                });
            },
            // 分页导航
            handlePageChange(val) {
                // this.$set(this.query, 'pageIndex', val);
                this.query.pageIndex = val;
                this.getBlogAllList(val);
            },
            //open 删除博客 Model
            openDeleteBlog(id) {
                // 二次确认删除
                this.$confirm('确定要删除此条吗? 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 确定删除博客
                    this.deleteBlog(id);
                }).catch(() => {
                    //取消删除博客
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1500
                    });
                });
            },
            //确定删除博客
            async deleteBlog(id) {
                let res = await removeMongoDbById({
                    id: id
                });
                console.log(res);
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除博客成功',
                        duration: 1500
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除博客失败',
                        duration: 1500
                    });
                }
                this.getBlogAllList(this.query.pageIndex);
            },
            //编写博客
            addBlog() {
                this.$router.push('/blog/markdown');
            }
        }
    };
</script>

<style scoped>
    .pagination1 {
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .table {
        width: 100%;
        font-size: 14px;
        height: calc(100vh - 300px);
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 390px;
    }

    .mr10 {
        margin-right: 10px;
    }

    .el-select {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .container {
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        height: calc(100vh - 220px);
    }

</style>