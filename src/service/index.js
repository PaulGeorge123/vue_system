import Axios from './request';
import qs from 'qs';

export default {

    /**
     * 用户 User API
     * @param reqData
     * @returns {AxiosPromise<any>}
     */

    //登录验证
    login(reqData) {
        return Axios.post('/api/login', qs.stringify(reqData));
    },
    //与原始密码比较
    oldPasswordToCompare(reqData) {
        return Axios.post('/api/oldPasswordToCompare', qs.stringify(reqData));
    },
    //修改密码
    modifyPassword(reqData) {
        return Axios.post('/api/modifyPassword', qs.stringify(reqData));
    },
    // 获取用户信息List
    queryUserAllList() {
        return Axios.get('/api/user/queryUserAllList');
    },
    //确定添加用户
    saveUser(reqData) {
        return Axios.post('/api/user/saveUser', qs.stringify(reqData));
    },
    //根据id查询用户
    queryUserById(reqData) {
        return Axios.get('/api/user/queryUserById', { params: reqData });
    },
    //修改用户
    modifyUser(reqData) {
        return Axios.put('/api/user/modifyUser', qs.stringify(reqData));
    },
    //查询用户 (分页)
    queryUserPaging(reqData) {
        return Axios.get('/api/user/queryUserPaging', { params: reqData });
    },
    // 删除用户
    removeUser(reqData) {
        return Axios.delete('/api/user/removeUser', { params: reqData });
    },
    //批量删除
    removeUserList(reqData) {
        return Axios.post('/api/user/removeUserList', reqData);
    },
    //模糊查询用户
    queryUserByFuzzy(reqData) {
        return Axios.get('/api/user/queryUserByFuzzy', { params: reqData });
    },
    //条件查询用户
    queryUserByConditions(reqData) {
        return Axios.post('/api/user/queryUserByConditions', qs.stringify(reqData));
    },
    //查询用户数count
    queryUserCount() {
        return Axios.get('/api/user/queryUserCount');
    },
    //下载Excel模板
    easyExcelTemplate() {
        return Axios.get('/api/easyExcel/template'
            ,{
            headers:{
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            },
            responseType: 'blob',
            }
        );
    },
    //下载Excel文件
    easyExcelDownload() {
        return Axios.get('/api/easyExcel/download',{
            responseType: "blob"
        });
    },
    //上传Excel文件
    easyExcelUpload(reqData) {
        return  Axios.post( '/api/easyExcel/upload',reqData, {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        });
    },

    /**
     * 博客 Blog API
     * @param reqData
     * @returns {AxiosPromise<any>}
     */

    //上传md文件
    postMd(reqData) {
        return Axios.post(`/api/upload/saveMd`, reqData);
    },

    //上传图片
    uploadFile(reqData) {
        return Axios.post(`/api/upload/setFileUpload`, reqData);
    },

    //MongoDB 查询ID
    queryBlogById(reqData) {
        return Axios.get(`/api/mongodb/queryBlogById`, { params: reqData });
    },

    //MongoDB 查询所有blog
    queryBlogAllList(reqData) {
        return Axios.get(`/api/mongodb/queryBlogAllList`, { params: reqData });
    },

    //MongoDB 删除
    removeMongoDbById(reqData) {
        return Axios.delete(`/api/mongodb/removeBlog`, { params: reqData });
    },

    //MongoDB 模糊查询博客
    queryFuzzyBlog(reqData) {
        return Axios.post(`/api/mongodb/queryFuzzyBlogList`, reqData);
    },


    //MongoDB 查询博客数count
    queryBlogCount() {
        return Axios.get(`/api/mongodb/queryBlogCount`);
    },

    /**
     * 待办事项 Todo API
     * @param reqData
     * @returns {AxiosPromise<any>}
     */
    //MySQL 增加待办事项
    saveTodo(reqData) {
        return Axios.post(`/api/todo/saveTodo`, reqData);
    },

    //MySQL 删除待办事项
    removeTodoById(reqData) {
        return Axios.delete(`/api/todo/removeTodo`, { params: reqData });
    },

    //MySQL 查询待办事项(分页)
    queryTodoPaging(reqData) {
        return Axios.get(`/api/todo/queryTodoPaging`, { params: reqData });
    },

    //MySQL 查询待办事项(分页)
    modifyTodo(reqData) {
        return Axios.put(`/api/todo/modifyTodo`, qs.stringify(reqData));
    }

};