//----------------------GZX用到的全局变量开始-------------------------------//
var sendRuleType; //用于标记需要查询的下发规则类型
var sendRulePersonID; //用于标记按照下发规则下发的人员ID
//----------------------GZX用到的全局变量结束-------------------------------//
var BACK_DEAL_INFO = {};
var websocket = null;
//判断当前浏览器是否支持WebSocket
if('WebSocket' in window){
	var host = window.location.host;
    websocket = new WebSocket("ws://"+host+CTX+"websocket");
}
else{
	flavrAlert('浏览器不支持websocket,请更换IE10+, 火狐34+, Chrome 31+',true);
}
//发送消息
function send(message){
    websocket.send(message);
}
//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function(){
    websocket.close();
}
//接收到消息的回调方法
websocket.onmessage = function(event){
    operMessage(event.data);
}
//连接发生错误的回调方法
websocket.onerror = function(){
	console.log('发生错误');
	websocket.close();
	//var host = window.location.host;
    //websocket = new WebSocket("ws://"+host+CTX+"websocket");
};
//消息处理
function operMessage(data){
	var json = eval('(' + data + ')');
	//如果是下发回调消息
	if(json.infoType=='downUserInfoResult' && BACK_DEAL_INFO.sessionId == json.sessionId){
		//去除超时等待定时器
		window.clearInterval(TimeoutObj);
		//下发IC卡到门禁回调处理
		if(BACK_DEAL_INFO.operObj == 'download_ICInfo'){
			loaded();
			BACK_DEAL_INFO = {};
			$('#IssuedIC_Modal').modal('hide');
			queryInfo();
		}
		//下发人员到考勤机回调处理
		if(BACK_DEAL_INFO.operObj == 'download_PersonnelInfo'){
			loaded();
			BACK_DEAL_INFO = {};
			fnUpdatePersonnelDownInfo();
		}
		//批量下发到考勤机回调处理
		if(BACK_DEAL_INFO.operObj == 'download_PersonnelInfos'){
			loaded();
			BACK_DEAL_INFO = {};
			fnUpdatePersonnelDownInfos();
		}
	}
	//如果是提取回调信息
	if(json.infoType=='uploadUserInfoResult' && BACK_DEAL_INFO.sessionId == json.sessionId){
		//去除超时等待定时器
		window.clearInterval(TimeoutObj);
		//提取人员回调处理
		if(BACK_DEAL_INFO.operObj == 'upload_PersonnelInfo'){
			loaded();
			BACK_DEAL_INFO = {};
			$("span[field='default_hasfingerprint']").html('已提取');
			$("span[field='default_hasfingerprint']").attr('class','badge bg-green');
			if(json.hasFinger){
				$("span[field='personnel_fingerprint']").html('是');
			}else{
				$("span[field='personnel_fingerprint']").html('否');
			}
			if(json.hasFace){
				$("span[field='personnel_facephoto']").html('是');
			}else{
				$("span[field='personnel_facephoto']").html('否');
			}
			if(json.attePhotoStr!=null){
				$("img[field='personnel_attephoto']").attr('src','data:image/jpeg;base64,'+json.attePhotoStr);
			}
		}
	}
}

$(window).resize(function(){
	$('#dataList').bootstrapTable('refreshOptions',{
		height:$(window).height()-80
	});
	$('.search input').attr('placeholder','人员姓名');
});
function fnResetTable(){
	window.setTimeout(function(){
		$('#dataList').bootstrapTable('resetView');
	},500);
}
$(function () {
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
	//编辑表单窗口关闭事件
    $('#addModal').on('hidden.bs.modal',function(){
    	//重置表单
    	fnResetaddForm();
    	//删除无效的证书信息
    	fnDelInvalidCert();
    });
	//入场表单窗口关闭重置
    $('#admissionModal').on('hidden.bs.modal',function(){
    	fnResetAdmissionForm();
    });
    //离场表单窗口关闭重置
    $('#leaveModal').on('hidden.bs.modal',function(){
    	fnResetLeaveForm();
    });
    //导出IC卡到设备窗口关闭事件
//    $('#IssuedIC_Modal').on('hidden.bs.modal',function(){
//    	$('#issuedIC_tbody').empty();
//    	$("#IssuedIC_form input[name='personnelId']").val('');
//    	$("#IssuedIC_form input[type='checkbox']").prop("checked",false);
//    });
    //导出人脸信息到设备窗口关闭事件
    $('#IssuedAtt_Modal').on('hidden.bs.modal',function(){
    	$('#issuedAtt_tbody').empty();
    	$("#IssuedAtt_form input[name='personnelId']").val('');
    	$("#IssuedAtt_form input[name='defaultDeviceId']").val('');
    	$("#IssuedAtt_form input[name='defaultDeviceType']").val('');
    	$("#IssuedAtt_form input[type='checkbox']").prop("checked",false);
    	$('#IssuedAtt_form img').attr('src',CTX+'static/images/default_avatar_male.jpg');
    	$('#IssuedAtt_form h5 span').html('');
    });
    
  //初始化时间控件
    $('.mydatepicker').datepicker({
    	format:'yyyy-mm-dd',
    	todayHighlight: true,
    	language:'zh-CN',
      	autoclose: true,
      	clearBtn: true
    }).on('hide',function(){
		if($(this).val()!=''){
			var bootstrapValidator = null;
			if($(this).attr('name')=='leaveTime'){
				bootstrapValidator = $("#leave_form").data('bootstrapValidator');  
			}
			if($(this).attr('name')=='admissionTime'){
				bootstrapValidator = $("#admission_form").data('bootstrapValidator');  
			}
		    bootstrapValidator.updateStatus($(this).attr('name'), 'NOT_VALIDATED').validateField($(this).attr('name'));
		}
	});
    
    //初始化上传控件
    $("input[name='photoFile']").fileinput({
	    overwriteInitial: true,
	    maxFileSize: 100,
	    showClose: false,
	    showCaption: false,
	    browseLabel: '',
	    removeLabel: '',
	    browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
	    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
	    removeTitle: 'Cancel or reset changes',
	    elErrorContainer: '#kv-avatar-errors-1',
	    msgErrorClass: 'alert alert-block alert-danger',
	    defaultPreviewContent: '<img src="'+CTX+'static/images/default_avatar_male.jpg" alt="Your Avatar"/>',
	    layoutTemplates: {main2: '{preview} {remove} {browse}'},
	    allowedFileExtensions: ["jpg", "png", "gif"]
	}).on('filecleared', function(event) {
		$('#myform').find("input[name='photoStr']").val('');
	});
    $('#kvFileinputModal').on('hidden.bs.modal', function() {
        $('#addModal').css({'overflow-y':'scroll'});
    });
    
    $('#myform').bootstrapValidator({
    	message: '此处输入有误',
        excluded: [':disabled'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
        	'companyName':{
        		message: '单位名称输入不合法',
                validators: {
                    notEmpty: {
                        message: '单位名称不可为空'
                    }
                }
        	},
        	'socialCreditCode':{
        		message: '统一社会信用代码输入不合法',
                validators: {
                    notEmpty: {
                        message: '统一社会信用代码不可为空'
                    }
                }
        	},
        	'useunitType.id':{
        		message: '单位类型输入不合法',
                validators: {
                    notEmpty: {
                        message: '单位类型不可为空'
                    }
                }
        	},
        	'name':{
        		message: '姓名输入不合法',
                validators: {
                    notEmpty: {
                        message: '姓名不可为空'
                    }
                }
        	},
        	'idNumber':{
        		message: '身份证号输入不合法',
                validators: {
                    notEmpty: {
                        message: '身份证号不可为空'
                    },
                    stringLength: {
                        min: 15,
                        max: 18,
                        message: '身份证不少于15位,不高于18位'
                    }
                }
        	},
        	'issueOffice':{
        		message: '签发机关输入不合法',
                validators: {
                    notEmpty: {
                        message: '签发机关不可为空'
                    },
                    stringLength: {
                        max: 100,
                        message: '签发机关长度过长'
                    }
                }
        	},
        	'expirationStartDate':{
        		message: '有效开始时间输入不合法',
                validators: {
                    notEmpty: {
                        message: '开始时间不可为空'
                    }
                }
        	},
        	'expirationEndDate':{
        		message: '有效结束时间输入不合法',
                validators: {
                    notEmpty: {
                        message: '结束时间不可为空'
                    }
                }
        	},
        	'liveNumber':{
        		message: '居住证号输入不合法',
                validators: {
                    notEmpty: {
                        message: '居住证号不可为空'
                    }
                }
        	},
        	'ethnic':{
        		message: '民族输入不合法',
                validators: {
                    notEmpty: {
                        message: '民族不可为空'
                    }
                }
        	},
        	'telphone':{
        		message: '联系电话输入不合法',
                validators: {
                    notEmpty: {
                        message: '联系电话不可为空'
                    },
                    regexp:{
                    	regexp: /(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|7|8|9][0-9]{9})$/,
                    	message: '号码格式错误(如:0000-0000000 或 13800000000)'
                    },
                }
        	},
        	'resAddress':{
        		message: '户籍地址输入不合法',
                validators: {
                    notEmpty: {
                        message: '户籍地址不可为空'
                    }
                }
        	},
        	'workNo':{
        		message: '工号输入不合法',
                validators: {
                    notEmpty: {
                        message: '工号不可为空'
                    },
                    regexp:{
                    	regexp: /^\d+(\.\d+)?$/,// /^[-+]?\d+(\.\d+)?$/,
                    	message: '非法数值'
                    },
                    stringLength: {
                    	max: 5,
                        message: '工号少于5位'
                    },
                    remote: {
                        type: 'GET',
                        //以get方式调用接口根据接口返回的valid,true为通过false为未通过
                        url: CTX+'personnel/validate-workno',
                        data: function(validator){
                        	return {
                        		personnelId: $('#myform').find("input[name='id']").val(),
                        		projectInfoId: $('#myform').find("input[name='projectInfo.id']").val()
                        	};
                        },
                        message: '工号不合法或该工号已注册',
                        delay: 500
                    }
                }
        	},
        	'icNumber':{
        		message: 'IC卡号输入不合法',
                validators: {
                    notEmpty: {
                        message: 'IC卡号不可为空'
                    }
                }
        	},
        	'adminType.id':{
        		message: '管理人员类型输入不合法',
                validators: {
                    notEmpty: {
                        message: '管理人员类型不可为空'
                    }
                }
        	}
        }
    }).on('success.form.bv',function(e){
    	//异步验证的需要此处提交表单
		$.ajax({
			url: CTX+'personnel/save-personnel',
			method:'post',
			processData: false,
	        contentType: false,
	        cache: false,
			dataType:'json',
			data: new FormData($('#myform')[0]),//带附件异步提交
			timeout: 15000,
			success: function(json){
				flavrAlert(json.msg,false);
				if(json.success){
					queryInfo();
					if(cur_save_type=='next'){
						fnResetaddForm();
					}else{
						$("#addModal").modal('toggle');
					}
				}
				$('#'+cur_save_type+'_submit_btn').html(cur_save_type=='next'?'添加并继续':'保存');
				$('#'+cur_save_type+'_submit_btn').removeAttr('disabled');
			},
			error: function(){
				flavrAlert('请求超时或系统出错!',false);
				$('#'+cur_save_type+'_submit_btn').html(cur_save_type=='next'?'添加并继续':'保存');
				$('#'+cur_save_type+'_submit_btn').removeAttr('disabled');
			}
		});
    }).on('error.validator.bv',function(e){
		//表单验证失败处理
    	$('#'+cur_save_type+'_submit_btn').html(cur_save_type=='next'?'添加并继续':'保存');
		$('#'+cur_save_type+'_submit_btn').removeAttr('disabled');
	});
    
    
    $('#admission_form').bootstrapValidator({
    	message: '此处输入有误',
        excluded: [':disabled'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
        	'admissionTime':{
        		message: '入场时间输入不合法',
                validators: {
                    notEmpty: {
                        message: '入场时间不可为空'
                    }
                }
        	}
        }
    });
    $('#leave_form').bootstrapValidator({
    	message: '此处输入有误',
        excluded: [':disabled'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
        	'leaveTime':{
        		message: '离场时间输入不合法',
                validators: {
                    notEmpty: {
                        message: '离场时间不可为空'
                    }
                }
        	}
        }
    });
    /* 初始化隐藏select的div层 */
 	$('.my-select').hide();
});
//初始化列表
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#dataList').bootstrapTable({
        	url: CTX + 'personnel/query-personnel-page',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            queryParamsType: "a",
            search: true,                       //是否显示表格搜索
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: $(window).height()-80,      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            showExport: true,                     //是否显示导出
            exportDataType: "basic",              //basic', 'all', 'selected'.
            exportTypes:[ 'excel','doc', 'xml','csv','json'],  //导出文件类型
            exportOptions:{  
                ignoreColumn: [0],  //忽略某一列的索引 ,如 [0,1]
                fileName: '现场人员信息导出',  //文件名称设置  
                worksheetName: '信息',  //表格工作区名称  
                tableName: '现场人员信息导出文件'
            },
            columns: [
			{
            	checkbox:true,
            	align : 'center',
				valign : 'middle'
	        },{
			    field: 'companyName',
			    title:'单位名称',
			    align : 'center',
				valign : 'middle'
			},{
			    field: 'useunitType',
			    title:'单位类型',
			    align : 'center',
				valign : 'middle'
			},{
			    field: 'name',
			    title:'姓名',
			    align : 'center',
				valign : 'middle'
			},{
			    field: 'workNo',
			    title:'工号',
			    align : 'center',
				valign : 'middle'
			},{
			    field: 'adminType',
			    title:'管理人员类型',
			    align : 'center',
				valign : 'middle',
			    formatter:function(v,r,i){
			    	if(r.adminType==null){return null;}
			    	else{return r.adminType;}
			    }
			},{
			    field: 'admissionTime',
			    title:'创建时间',
			    align : 'center',
				valign : 'middle',
			    formatter:function(value){
			    	if(value==null){
			    		return "";
			    	}
			    	return new Date(value).Format('yyyy-MM-dd');
			    }
			},{
			    field: 'leaveTime',
			    title:'修改时间',
			    align : 'center',
				valign : 'middle',
			    formatter:function(value){
			    	if(value==null){
			    		return "";
			    	}
			    	return new Date(value).Format('yyyy-MM-dd');
			    }
			},{
			    field: 'status',
			    title:'人员状态',
			    align : 'center',
				valign : 'middle',
			    formatter:function(v,r,i){
			    	if(v==null){
			    		return null;
			    	}else if(v==1){
			    		return "入场";
			    	}else{
			    		return "离场";
			    	}
			    }
			},{
			    field: 'personelAdmission',
			    title:'人员入场',
			    align : 'center',
				valign : 'middle',
			    clickToSelect : false,
			    formatter: function (value, row, index) {
                	var operateHtml = '<button class="btn btn-box-tool" type="button" onclick="doAdmission(\''+row.id+'\')" style=" background: none; border:none;"><i class="glyphicon glyphicon-edit icon-edit " ></i></button>';
                    return operateHtml;
                }
			},{
			    field: 'personelLeave',
			    title:'人员离场',
			    align : 'center',
				valign : 'middle',
			    clickToSelect : false,
			    formatter: function (value, row, index) {
                	var operateHtml = '<button class="btn btn-box-tool" type="button" onclick="doLeave(\''+row.id+'\','+row.status+')" style=" background: none; border:none;"><i class="glyphicon glyphicon-edit icon-edit " ></i></button>';
                    return operateHtml;
                }
			},{
				field:'isDownload',
				title:'下发设备情况',
				align : 'center',
				valign:'middle',
				clickToSelect : false,
				formatter:function(v,r,i){
					if(v==0){
						return '<button class="btn btn-box-tool" type="button" style=" background: none; border:none;" onclick="fnIssuedAttDevice(\''+r.id+'\')"><i class="fa fa-sign-out"></i></button>';
					}
					if(v>=1){
						return '<button class="btn btn-box-tool" type="button" style=" background: none; border:none;" onclick="fnIssuedAttDevice(\''+r.id+'\')"><i class="fa fa-check text-green"></i></button>';
					}
				}
			},
//			{
//			    field: 'icDownload',
//			    title:'IC卡采集',
//			    align : 'center',
//				valign : 'middle',
//			    clickToSelect : false,
//			    formatter: function (v, r, i) {
//                	var htmlStr = '<button class="btn btn-box-tool" type="button" style=" background: none; border:none;" onclick="fnIssuedAccDevice(\''+r.id+'\')"><i class="fa fa-sign-out"></i></button>';
//                	if(v){
//                		htmlStr = '<button class="btn btn-box-tool" type="button" style=" background: none; border:none;" onclick="fnIssuedAccDevice(\''+r.id+'\')"><i class="fa fa-check text-green"></i></button>';
//                	}
//                	return htmlStr;
//                }
//			},{
//			    field: 'faceDownload',
//			    title:'人脸采集',
//			    align : 'center',
//				valign : 'middle',
//			    clickToSelect : false,
//			    formatter: function (v, r, i) {
//			    	var htmlStr = '<button class="btn btn-box-tool" type="button" style=" background: none; border:none;" onclick="fnIssuedAttDevice(\''+r.id+'\')"><i class="fa fa-sign-out"></i></button>';
//			    	if(v){
//			    		htmlStr = '<button class="btn btn-box-tool" type="button" style=" background: none; border:none;" onclick="fnIssuedAttDevice(\''+r.id+'\')"><i class="fa fa-check text-green"></i></button>';
//			    	}
//                	return htmlStr;
//                }
//			},
			{
			    field: 'operate',
			    title:'操作',
			    align : 'center',
				valign : 'middle',
				width:  '150px',
			    clickToSelect : false,
			    formatter: function (value, row, index) {
                	var operateHtml = '<button class="btn btn-box-tool" type="button" onclick="doShowDetail(\''+row.id+'\')" style=" background: none; border:none;"><i class="glyphicon glyphicon-search icon-search"></i></button>';
                	operateHtml = operateHtml + '<button class="btn btn-box-tool" type="button" onclick="doEdit(\''+row.id+'\')" style=" background: none; border:none;"><i class="glyphicon glyphicon-edit icon-edit " ></i></button>';
                	operateHtml = operateHtml + '<button class="btn btn-box-tool" type="button" onclick="doDelete(\''+row.id+'\')" style=" background: none; border:none;"><i class="glyphicon glyphicon-remove icon-remove" style="color:red;"></i></button>';
                    return operateHtml;
                }
			}
			]
        });
        $('.search input').attr('placeholder','人员姓名');
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
    	var data = JSON.stringify($('#formSearch').serializeJSON());
        var temp = {   //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
    		pageNum: params.pageNumber,//页码params.offset
            size: params.pageSize,//页面大小params.limit
            order: params.sortOrder,//排序 params.order
            ordername: params.sortName,//排序字段 params.sort
            userType: '01',
            form:data,
            search:params.searchText
        };
        return temp;
    };
    return oTableInit;
};

//查询-刷新
var queryInfo = function(){
	var data = JSON.stringify($('#formSearch').serializeJSON());
	var queryData = {form: data};
	$('#dataList').bootstrapTable('refresh',{pageNumber:1,pageSize:10,query:queryData});
}
//------------------------------------------//
//时间：2018年9月27日09:02:39
//作者：GZX
//函数：新增人员表单校验
//------------------------------------------//
$('#addPersonFrom').bootstrapValidator({
    message: '此处输入有误',
    excluded: [':disabled'],
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
    	// -------------------------单位验证部分开始------------------- //
        // 'companyName':{
         //    message: '单位名称输入不合法',
         //    validators: {
         //        notEmpty: {
         //            message: '单位名称不可为空'
         //        }
         //    }
        // },
        // 'socialCreditCode':{
         //    message: '统一社会信用代码输入不合法',
         //    validators: {
         //        notEmpty: {
         //            message: '统一社会信用代码不可为空'
         //        }
         //    }
        // },
        // 'useunitType.id':{
         //    message: '单位类型输入不合法',
         //    validators: {
         //        notEmpty: {
         //            message: '单位类型不可为空'
         //        }
         //    }
        // },
        // -------------------------单位验证部分结束------------------- //
        // -------------------------人员验证部分开始------------------- //

        'name':{
            message: '姓名输入不合法',
            validators: {
                notEmpty: {
                    message: '姓名不可为空'
                }
            }
        },
        'idNumber':{
            message: '身份证号输入不合法',
            validators: {
                notEmpty: {
                    message: '身份证号不可为空'
                },
                stringLength: {
                    min: 15,
                    max: 18,
                    message: '身份证不少于15位,不高于18位'
                }
            }
        },
        'workNo':{
            message: '工号输入不合法',
            validators: {
                notEmpty: {
                    message: '工号不可为空'
                },
                regexp:{
                    regexp: /^\d+(\.\d+)?$/,// /^[-+]?\d+(\.\d+)?$/,
                    message: '非法数值'
                },
                stringLength: {
                    max: 5,
                    message: '工号少于5位'
                },
                remote: {
                    type: 'GET',
                    //以get方式调用接口根据接口返回的valid,true为通过false为未通过
                    url: CTX+'personnel/validate-workno',
                    data: function(validator){
                        return {
                            personnelId: $('#myform').find("input[name='id']").val(),
                            projectInfoId: $('#myform').find("input[name='projectInfo.id']").val()
                        };
                    },
                    message: '工号不合法或该工号已注册',
                    delay: 500
                }
            }
        },
        'telphone':{
            message: '联系电话输入不合法',
            validators: {
                notEmpty: {
                    message: '联系电话不可为空'
                },
                regexp:{
                    regexp: /(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|7|8|9][0-9]{9})$/,
                    message: '号码格式错误(如:0000-0000000 或 13800000000)'
                },
            }
        },'email':{
            message: '邮箱输入不合法',
            validators: {
                notEmpty: {
                    message: '邮箱不可为空'
                }
            }
        },'loginName':{
            message: '登录账号输入不合法',
            validators: {
                notEmpty: {
                    message: '登录账号不可为空'
                }
            }
        },'remark':{
            message: '备注输入不合法',
            validators: {
                notEmpty: {
                    message: '备注不可为空'
                }
            }
        }

        // , 'issueOffice':{
        //     message: '签发机关输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '签发机关不可为空'
        //         },
        //         stringLength: {
        //             max: 100,
        //             message: '签发机关长度过长'
        //         }
        //     }
        // },
        // 'expirationStartDate':{
        //     message: '有效开始时间输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '开始时间不可为空'
        //         }
        //     }
        // },
        // 'expirationEndDate':{
        //     message: '有效结束时间输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '结束时间不可为空'
        //         }
        //     }
        // },
        // 'liveNumber':{
        //     message: '居住证号输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '居住证号不可为空'
        //         }
        //     }
        // },
        // 'ethnic':{
        //     message: '民族输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '民族不可为空'
        //         }
        //     }
        // },
        // 'resAddress':{
        //     message: '户籍地址输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '户籍地址不可为空'
        //         }
        //     }
        // },
        // 'icNumber':{
        //     message: 'IC卡号输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: 'IC卡号不可为空'
        //         }
        //     }
        // },
        // 'adminType.id':{
        //     message: '管理人员类型输入不合法',
        //     validators: {
        //         notEmpty: {
        //             message: '管理人员类型不可为空'
        //         }
        //     }
        // }
        // -------------------------人员验证部分结束------------------- //
    }
}).on('success.form.bv',function(e){
    //异步验证的需要此处提交表单
    $.ajax({
        url: CTX+'personnel/save-personnel',
        method:'post',
        processData: false,
        contentType: false,
        cache: false,
        dataType:'json',
        data: new FormData($('#addPersonFrom')[0]),//带附件异步提交
        timeout: 15000,
        success: function(json){
            flavrAlert(json.msg,false);
            if(json.success){
                queryInfo();
                // $("#addPersonFrom").modal('hide');
                $('#addPersonModal').modal('toggle');
            }
        },
        error: function(){
            flavrAlert('请求超时或系统出错!',false);
            $('#'+cur_save_type+'_submit_btn').html(cur_save_type=='next'?'添加并继续':'保存');
            $('#'+cur_save_type+'_submit_btn').removeAttr('disabled');
        }
    });
}).on('error.validator.bv',function(e){
    //表单验证失败处理
    $('#'+cur_save_type+'_submit_btn').html(cur_save_type=='next'?'添加并继续':'保存');
    $('#'+cur_save_type+'_submit_btn').removeAttr('disabled');
});
//------------------------------------------//
//时间：2018年9月27日08:30:56
//作者：GZX
//函数：工具栏按键监控
//------------------------------------------//
$('#toolbar button').on('click',function(){
	//新增
	if($(this).attr('id')=='btn_add'){
		/* $('#myform')[0].reset();//清空表单 */
		// $('#addModal').find('.modal-title').html('新增人员信息');
		// $('#addModal').modal('toggle');
        $('#addPersonModal').find('.modal-title').html('新增人员信息');
        $('#addPersonModal').modal('toggle');
	}
	//删除
	if($(this).attr('id')=='btn_delete'){
		doDelete();
	}
    //手动同步人员
    if($(this).attr('id')=='btn_manualUpdate'){
        // alert('手动同步人员！');
        fnQueryPersonUpdateRecord();
        // manualUpdatePersonInfo();
    }
    //批量下发人员
    if($(this).attr('id')=='btn_batchSendPerson'){
        // alert('批量下发人员！');
        sendPersonsToDevices();
    }
    //批量提取人脸和指纹
    if($(this).attr('id')=='btn_batGetFaceAndFinger') {
        // alert('批量提取人脸和指纹');
        fnIssuedAttBatDevice();
    }
    //按照考勤机下发规则下发人员信息
    if($(this).attr('id')=='btn_sendByRule') {
        // alert('按照考勤机下发规则下发人员信息！');
        sendPersonsToDevicesByRule();
    }
});
//------------------------------------------//
//时间：2018年9月27日14:57:06
//作者：GZX
//函数：多选人员按照考勤机下发规则下发
//------------------------------------------//
var sendPersonsToDevicesByRule =function(id){
    // alert('进入多选人员下发多选设备函数！');
    //-----------------------选择人员部分开始--------------------------------------//
    var delIds = '';
    if(id){
        delIds = id;
    }else{
        var seldatas = $('#dataList').bootstrapTable('getSelections');
        if(seldatas.length>0){
            $.each(seldatas,function(i,seldata){
                delIds += ','+seldata.id;
            });
            delIds = delIds.substring(1);
        }
    }
    if(delIds==''){
        flavrAlert('未选择发送的人员!',true);
        return;
    }
    //-----------------------选择人员部分结束--------------------------------------//

    flavrConfirm('确定要发送选定人员吗?',function(result){
        if(result){
            sendRulePersonID = delIds;
            //-----------------------选择设备部分开始--------------------------------------//
            querySendRuleInfo();
            //-----------------------选择设备部分结束--------------------------------------//
        }
    });
}
//------------------------------------------//
//时间：2018年9月14日15:13:49
//作者：GZX
//函数：分页查询当前符合要求的考勤机下发规则
//------------------------------------------//
function querySendRuleInfo(){
    sendRuleType = "";
    var SendPersonInfoToAttByRule_Table = new SendPersonInfoToAttByRule_TableInit(sendRuleType);
    SendPersonInfoToAttByRule_Table.Init();
    $('#SendPersonInfoToAttByRule_Table').bootstrapTable('refreshOptions', {pageNumber: 1, pageSize: 10});
    $('#SendPersonInfoToAttByRule_Modal').modal('toggle');
    // $('#SendPersonInfoToAttByRule_Modal_load').show();

}
//------------------------------------------//
//时间：2018年9月14日15:15:26
//作者：GZX
//函数：根据指定的考勤机下发规则展示分页表格
//------------------------------------------//
//初始化列表
var SendPersonInfoToAttByRule_TableInit = function (sendRuleType) {
    var SendPersonInfoToAttByRule_TableInit = new Object();
    //初始化Table
    SendPersonInfoToAttByRule_TableInit.Init = function () {
        $('#SendPersonInfoToAttByRule_Table').bootstrapTable({
            url: CTX + 'attendance-device/query-send-rule-by-type-page',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbarX',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "desc",                   //排序方式
            sortName: 'swipeTime',
            queryParams: SendPersonInfoToAttByRule_TableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 20],        //可供选择的每页的行数（*）
            queryParamsType: "a",
            search: false,                       //是否显示表格搜索
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: $(window).height()-80,      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            columns: [
                {
                    checkbox: true ,
                },
                {
                    field: 'sendRuleDescri',
                    title: '规则描述',
                    align: 'center',
                    sortable: true

                }, {
                    field: 'sendRuleID',
                    title: '规则ID',
                    align: 'center',
                    sortable: true
                }, {
                    field: 'sendTime',
                    title: '下发时间',
                    align: 'center',
                    sortable: true,
                    formatter: function (v) {
                        return new Date(v).Format('yyyy-MM-dd hh:mm:ss');

                    }
                }, {
                    field: 'sendRuleType',
                    title: '规则类型',
                    align: 'center',
                    sortable: true,
                    formatter: function (value) {
                        if (value == 0) {
                            return '<span class="label label-warning">人员</span>';
                        }
                        else if (value == 1) {
                            return '<span class="label label-success">部门</span>';
                        }
                        else if (value == 2) {
                            return '<span class="label label-danger">公司</span>';
                        }
                    }

                }
                // ,{
                //     field: 'cz',
                //     title:'操作',
                //     align : 'center',
                //     valign : 'middle',
                //     clickToSelect : false,
                //     formatter: function (v, r, i) {
                //         var operateHtml = '<button type="button" onclick="doShowDetail(\''+r.id+'\')" style="background: none; border:none;"><i class="fa fa-search"></i></button>';
                //         return operateHtml;
                //     }
                // }
            ]
        });
        // $('.search input').attr('placeholder','人员姓名');
    };

    //得到查询的参数
    SendPersonInfoToAttByRule_TableInit.queryParams = function (params) {
        var data = JSON.stringify($('#formSearch').serializeJSON());
        var temp = {   //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
            pageNum: params.pageNumber,//页码params.offset
            size: params.pageSize,//页面大小params.limit
            order: params.sortOrder,//排序 params.order
            ordername: params.sortName,//排序字段 params.sort
            sendRuleType: sendRuleType,
            form: data,
            //content:$("#formSearch input[id=query_content_like]").val(),
            search:params.searchText
        };
        return temp;
    };
    return SendPersonInfoToAttByRule_TableInit;
};
//------------------------------------------//
//时间：2018年9月14日15:50:41
//作者：GZX
//函数：单选考勤机下发规则下发人员信息
//------------------------------------------//
function sendPersonsWithSendRule1(){
    // alert('进入多选人员下发多选设备函数！');
    //-----------------------选择规则部分开始--------------------------------------//
    var delIds = '';
	var seldatas = $('#SendPersonInfoToAttByRule_Table').bootstrapTable('getSelections');
	if(seldatas.length<1){
		flavrAlert('未选择规则!',true);
		return;
	}
	if(seldatas.length>1){
		flavrAlert('只能选择一个规则!',true);
		return;
	}
	if(seldatas.length==1){
		$.each(seldatas,function(i,seldata){
			delIds += ','+seldata.id;
		});
		delIds = delIds.substring(1);
	}
    if(delIds==''){
        flavrAlert('未选择发送的人员!',true);
        return;
    }
    //-----------------------选择规则部分结束--------------------------------------//
    flavrConfirm('确定要按照规则发送选定人员吗?',function(result){
        if(result){
            //-----------------------选择设备部分开始--------------------------------------//
            sendPersonsWithSendRule2(delIds);
            //-----------------------选择设备部分结束--------------------------------------//
        }
    });
}
//------------------------------------------//
//时间：2018年9月14日15:55:50
//作者：GZX
//函数：将选中的规则提交到服务器进行下发
//------------------------------------------//
function sendPersonsWithSendRule2(delIds){
    loading('提交请求中,请稍后...');
    $.ajax({
        // url: CTX+'personnel/bat-upload-fp-template-info',
        url: CTX+'attendance-device/send-person-with-rule',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        data: {
            sendRuleID: delIds,
            personID: sendRulePersonID,
            // defaultDeviceId: $("#IssuedICBatGet_form input[name='defaultDeviceId']").val(),
            // defaultDeviceType: $("#IssuedICBatGet_form input[name='defaultDeviceType']").val()
        },
        success: function(json){
            if(json.success){
                BACK_DEAL_INFO = {};
                BACK_DEAL_INFO.sessionId = json.sessionId;
                BACK_DEAL_INFO.operObj = 'upload_PersonnelInfo';
                sendRulePersonID = '';
                loaded();
                flavrConfirm('按规则下发成功！',function(result){
                    if(result){
                        $("#SendPersonInfoToAttByRule_Modal").modal('hide');
                    }
                });
            }else{
                flavrAlert(json.msg,false);
                loaded();
            }
        },
        error: function(){
            flavrAlert('系统错误或请求超时!',false);
            loaded();
        }
    });
}
//------------------------------------------//
//时间：2018年8月16日09:55:21
//作者：GZX
//函数：查询手动人员更新的记录
//------------------------------------------//
function fnQueryPersonUpdateRecord(){
    $('#ManualUpdatePersonInfo_Modal').modal('toggle');
    $('#ManualUpdatePersonInfo_load').show();
    // $("#IssuedIC_form input[name='personnelId']").val(delIds);
    $.ajax({
        url: CTX+'personnel/query-person-update-record',
        type: 'GET',
        dataType: 'json',
        data: {},
        success:function(json){
            $('#ManualUpdatePersonInfo_load').hide();
            if(json){
                var htmlStr = '';
                $.each(json,function(i,data){
                    htmlStr +=
                        '<tr>'+
                        '	<td>'+data.updateTime+'</td>'+
                        '	<td>'+data.updateRecordNum+'</td>'+
                        '	<td>'+(data.updateRecordSuccessNum==null?'<span class="badge bg-red">无</span>':data.updateRecordSuccessNum)+'</td>'+
                        '	<td>'+(data.updateRecordFailNum==null?'<span class="badge bg-red">无</span>':data.updateRecordFailNum)+'</td>'+
                        // '	<td>'+data.updateRecordSuccessNum==null?'<span class="badge bg-red">无</span>':data.updateRecordSuccessNum+'</td>'+
                        // '	<td>'+data.updateRecordFailNum+'</td>'+
                        // '	<td>'+data.updateRecordWay+'</td>'+
                        '	<td>'+(data.updateRecordWay=='manual'?'<span class="badge bg-red">手动</span>':'<span class="badge bg-green">自动</span>')+'</td>'+
                        '	<td>'+(data.updateRecordResult=='false'||data.updateRecordResult==false?'<span class="badge bg-red">失败</span>':'<span class="badge bg-green">成功</span>')+'</td>'+
                        '</tr>';
                });
                $('#ManualUpdatePersonInfo_tbody').html(htmlStr);
            }
        },
        error:function(){
            $('#ManualUpdatePersonInfo_load').hide();
            alert('请求超时或系统出错!');
        }
    });
}
//------------------------------------------//
//时间：2018年8月13日09:58:29
//作者：GZX
//函数：手动同步函数
//------------------------------------------//
function manualUpdatePersonInfo(){
    // alert('进入手动同步人员信息函数！');
    // $('#IssuedIC_Modal').modal('toggle');
    $('#IssuedIC_Modal_load').show();
    // $("#IssuedIC_form input[name='personnelId']").val(delIds);
    $.ajax({
        url: CTX+'personnel/getUser',
        type: 'GET',
        dataType: 'json',
        data: {},
        success:function(json){
            $('#IssuedIC_Modal_load').hide();
            if(json){
            	if(json.updateFlag){
					alert("提示：当前人员数据已经是最新，0条数据需要更新！");
				}else{
                    alert("提示:"+json.msg+
                        "新增："+json.personnelListNum+"条，更新："+
                        json.personnelUpdateListNum+"条,失败："+
                        json.personnelFailListNum+"条");
				}
                $('#ManualUpdatePersonInfo_Modal').modal('hide');//关闭手动更新记录模态框
            }
        },
        error:function(){
            $('#IssuedIC_Modal_load').hide();
            alert('请求超时或系统出错!');
        }
    });

}

//------------------------------------------//
//时间：2018年8月13日09:51:17
//作者：GZX
//函数：多选人员下发多选设备函数
//------------------------------------------//
var sendPersonsToDevices =function(id){
    // alert('进入多选人员下发多选设备函数！');
    //-----------------------选择人员部分开始--------------------------------------//
    var delIds = '';
    if(id){
        delIds = id;
    }else{
        var seldatas = $('#dataList').bootstrapTable('getSelections');
        if(seldatas.length>0){
            $.each(seldatas,function(i,seldata){
                delIds += ','+seldata.id;
            });
            delIds = delIds.substring(1);
        }
    }
    if(delIds==''){
        flavrAlert('未选择发送的人员!',true);
        return;
    }
    //-----------------------选择人员部分结束--------------------------------------//

    flavrConfirm('确定要发送选定人员吗?',function(result){
        if(result){
            //-----------------------选择设备部分开始--------------------------------------//
            fnIssuedAccDevice(delIds);
            //-----------------------选择设备部分结束--------------------------------------//
        }
    });
}
//------------------------------------------//
//时间：2018年8月16日16:27:21
//作者：GZX
//函数：多选人员提取人脸和指纹
//状态：未完成
//------------------------------------------//
var fnIssuedAttBatDevice =function(id){
    var delIds = '';//用于存储人员ID
    flavrConfirm('注意：只能提取标记为采集设备的考勤机，且是已经下发过的人员的指纹和人脸，是否继续？',function(result){
        if(result){
			//-----------------------选择人员部分开始--------------------------------------//
            if(id){
                delIds = id;
            }else{
                var seldatas = $('#dataList').bootstrapTable('getSelections');
                if(seldatas.length>0){
                    $.each(seldatas,function(i,seldata){
                        delIds += ','+seldata.id;
                    });
                    delIds = delIds.substring(1);
                }
            }
            if(delIds==''){
                flavrAlert('未选择准备提取的人员!',true);
                return;
            }
            //-----------------------选择人员部分结束--------------------------------------//
            //查询当前可以提取的设备
            fnIssuedAccDeviceForGet(delIds);
            // flavrConfirm('注意：只能提取，是否继续？',function(result){
            //     if(result){
            //
            //     }
            // });

        }
    });

}

//------------------------------------------//
//时间：2018年8月17日08:44:40
//作者：GZX
//函数：查询可以提取的设备
//状态：未完成
//------------------------------------------//
function fnIssuedAccDeviceForGet(delIds){
    $('#IssuedICBatGet_Modal').modal('toggle');
    $('#IssuedIC_Modal_BatGet_load').show();
    $("#IssuedICBatGet_form input[name='personnelId']").val(delIds);
    $.ajax({
        url: CTX+'personnel/query-issued-att-info',
        type: 'GET',
        dataType: 'json',
        data: {},
        success:function(json){
            $('#IssuedIC_Modal_BatGet_load').hide();
            if(json){
                var htmlStr = '';
                $.each(json,function(i,data){
                    htmlStr +=
                        '<tr>'+
                        '	<td><input type="checkbox" name="accIds" value="'+data.id+'" onchange="fnIssuedCheckAll(this,\'IssuedICBatGet_form\')"/></td>'+
                        '	<td><input type="hidden" name="defaultDeviceId" value="'+data.id+'" /></td>'+
                        '	<td><input type="hidden" name="defaultDeviceType" value="'+data.defaultDeviceType+'" /></td>'+
                        '	<td>'+data.accNo+'</td>'+
                        '	<td>'+data.accName+'</td>'+
                        '	<td>'+(data.status=='0'||data.status==null?'<span class="badge bg-red">离线</span>':'<span class="badge bg-green">在线</span>')+'</td>'+
                        '	<td>'+(data.personnelCapacity==null?'-':data.personnelCapacity)+'</td>'+
                        '	<td>'+(data.storageState==null?'-':data.storageState)+'</td>'+
                        // '	<td>'+(data.issuedStatus==null||data.issuedStatus==0?'<span class="badge bg-gray">未导入</span>':(data.issuedStatus==1?'<span class="badge bg-green">成功</span>':'<span class="badge bg-red">失败</span>'))+'</td>'+
                        '</tr>';
                });
                $('#issuedICBatGet_tbody').html(htmlStr);
            }
        },
        error:function(){
            $('#IssuedIC_Modal_BatGet_load').hide();
            alert('请求超时或系统出错!');
        }
    });
}

//------------------------------------------//
//时间：2018年8月17日09:23:03
//作者：GZX
//函数：从设备中批量提取人脸和指纹
//------------------------------------------//
function fnBatGetFaceAndFingerprint(_this){
    loading('提取请求中,请稍后...');
    $.ajax({
        url: CTX+'personnel/bat-upload-fp-template-info',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        data: {
            personnelId: $("#IssuedICBatGet_form input[name='personnelId']").val(),
            defaultDeviceId: $("#IssuedICBatGet_form input[name='defaultDeviceId']").val(),
            defaultDeviceType: $("#IssuedICBatGet_form input[name='defaultDeviceType']").val()
        },
        success: function(json){
            if(json.success){
                BACK_DEAL_INFO = {};
                BACK_DEAL_INFO.sessionId = json.sessionId;
                BACK_DEAL_INFO.operObj = 'upload_PersonnelInfo';
                loaded();
                flavrConfirm('提取成功！',function(result){
                    if(result){
                        $("#IssuedICBatGet_Modal").modal('hide');
                    }
                });
            }else{
                flavrAlert(json.msg,false);
                loaded();
            }
        },
        error: function(){
            flavrAlert('系统错误或请求超时!',false);
            loaded();
        }
    });
}

//重置人员表单数据
function fnResetaddForm(){
	$('#myform').bootstrapValidator('resetForm', true);
	$('#myform').find("input[name='id']").val('');
	$('#myform').find("input[name='annexIds']").val('');
	$('#myform').find("input[name='userType']").val('01');
	$('#myform').find("input[name='photoStr']").val('');
	$('#myform').find("input[name='sex'][value='0']").prop("checked", "checked");
	$('#myform').find("input[name='isPartyMember'][value='false']").prop("checked", "checked");
	$('#myform').find("select[name='marriage']").val('已婚');
	$('#myform').find("select[name='eduLevel']").val('初中');
	$('#myform').find("input[name='familyAddress']").val('');
	$('#myform').find("input[name='outRfid']").val('');
	$('#myform').find("input[name='inRfid']").val('');
	$('#myform').find("input[name='remark']").val('');
	$('#myform').find("td[name='pt_annexes_td']").html('无');
	//清空证书信息
	$("#personnel_cert_tbody").empty();
	//身份证头像重置
	 $("input[name='photoFile']").fileinput('clear');
}
//重置入场表单数据
function fnResetAdmissionForm(){
	$('#admission_form').bootstrapValidator('resetForm', true);
	$('#admission_form').find("input[name='id']").val('');
	$('#admission_form').find("input[name='admissionAnnexIds']").val('');
	$('#admission_form').find("td[name='pa_annexes_td']").html('无');
}
//重置离场表单数据
function fnResetLeaveForm(){
	$('#leave_form').bootstrapValidator('resetForm', true);
	$('#leave_form').find("input[name='id']").val('');
	$('#leave_form').find("input[name='leaveAnnexIds']").val('');
	$('#leave_form').find("td[name='pl_annexes_td']").html('无');
}

$('#addModal .modal-content').on('click',function(e){
	if($(e.target).closest("#my_select_group").length == 0 && $(e.target).closest("#my_select_group").length == 0){
    //点击id为menu之外且id不是不是open，则触发
        $(".my-select").slideUp("fast");
    }
});

//选择
var btnSelect = function(){
   //展开和收起div层
   $(".my-select").slideToggle();
}
var Selected = function(that){
	  //展开和收起div层
    $(".my-select").slideToggle();
   	var companyName=that.getAttribute("data-name");
	var socialCreditCode=that.getAttribute("data-socialCreditCode");
	var companyTypeId=that.getAttribute("data-type");
	$('#myform').find("input[name='companyName']").val(companyName);
	$('#myform').find("input[name='socialCreditCode']").val(socialCreditCode);
	$('#myform').find("select[name='useunitType.id']").val(companyTypeId);
    $("#social_creditcode").attr("readonly",true); 
    //$("#useunitType").attr("readonly",true);
    //手动验证
    var bootstrapValidator = $("#myform").data('bootstrapValidator');  
    bootstrapValidator.updateStatus('companyName', 'NOT_VALIDATED').validateField('companyName');
    bootstrapValidator.updateStatus('socialCreditCode', 'NOT_VALIDATED').validateField('socialCreditCode');
}

//删除
var doDelete = function(id){
	var delIds = '';
	if(id){
		delIds = id;
	}else{
		var seldatas = $('#dataList').bootstrapTable('getSelections');
		if(seldatas.length>0){
			$.each(seldatas,function(i,seldata){
				delIds += ','+seldata.id;
			});
			delIds = delIds.substring(1);
		}
	}
	if(delIds==''){
		flavrAlert('未选择删除项!',true);
		return;
	}
	flavrConfirm('确定要删除所选项吗?',function(result){
		if(result){
			loading('正在删除,请稍后...');
			$.ajax({
				url:CTX+'personnel/delete-personnel',
				type:'POST',
				data:{ids:delIds},
				dataType:'json',
				success:function(json){
					loaded();
					if(json.success){
						queryInfo();
					}else{
						flavrAlert(json.msg,false);
					}
				},
				error:function(){
					flavrAlert('请求超时或系统出错!',false);
					loaded();
				}
			});
		}
	});
}

function fnCloseDialog(_this){
	$(_this).parent().parent().parent().parent().fadeOut('fast');
}

//新增管理人员证书信息
var fnEditPersonnelCert=function(){
	$('#edit_personnel_cert_modal').fadeIn('fast');
	$('#edit_personnel_cert_modal').find('.modal-title').html('新增证书信息');
	$('#edit_cert_form')[0].reset();
	$('#edit_cert_form').find("input[name='id']").val('');
	$('#edit_cert_form').find("input[name='personnel.id']").val($('#myform').find("input[name='id']").val());
}

//保存管理人员证书信息
function fnSaveManagerCert(_this,type){
	if($('#edit_cert_form').find("input[name='profession']").val()==''){
		flavrAlert('请输入专业!',true);
		return;
	}
	if($('#edit_cert_form').find("input[name='certificate']").val()==''){
		flavrAlert('请输入证书号!',true);
		return;
	}
	var oldbtnTxt = $(_this).html();
	$(_this).attr('disabled','disabled');
	$(_this).html('保存中...');
	$.ajax({
		url: CTX+'personnel/save-personnel-cert',
		type: 'post',
		dataType: 'json',
		data: $("#edit_cert_form").serialize(),
		timeout: 10000,
		success: function(json){
			if(json){
				var hasRow = false,trEl = null;
				$('#personnel_cert_tbody tr').find("input").each(function(){
					if($(this).val()==json.id){
						hasRow = true;
						trEl = $(this).parent().parent();
					}
				});
				if(!hasRow){
					var num = $('#personnel_cert_tbody tr').length;
					var htmlStr = 
		                '<tr>'+
		                '	<td>'+(num+1)+'<input type="hidden" name="managerCertIds" value="'+json.id+'"/></td>'+
		                '	<td>'+json.profession+'</td>'+
		                '	<td>'+json.certificate+'</td>'+
		                '	<td>'+json.job+'</td>'+
		                '	<td>'+
		                '		<a href="javascript:" onclick="fnEditManagerCert(\''+json.id+'\')">修改</a>&nbsp;'+
		                '		<a href="javascript:" onclick="fnViewManagerCert(\''+json.id+'\')">查看</a>&nbsp;'+
		                '		<a href="javascript:" onclick="fnDelManagerCert(\''+json.id+'\',this)">删除</a>'+
		                '	</td>'+
		                '</tr>';
	                $('#personnel_cert_tbody').append(htmlStr);
				}else{
					trEl.find('td').eq(1).html(json.profession);
					trEl.find('td').eq(2).html(json.certificate);
					trEl.find('td').eq(3).html(json.job);
				}
			}
			$(_this).removeAttr('disabled');
			$(_this).html(oldbtnTxt);
			if(type=='next'){
				$('#edit_cert_form')[0].reset();
				$('#edit_cert_form').find("input[name='id']").val('');
			}else{
				$('#edit_personnel_cert_modal').fadeOut('fast');
			}
		},
		error: function(){
			flavrAlert('请求超时或系统出错!',false);
			$(_this).removeAttr('disabled');
			$(_this).html(oldbtnTxt);
		}
	});
}


//编辑管理员证书信息
function fnEditManagerCert(id){
	$('#edit_cert_form')[0].reset();//清空表单
	$('#edit_cert_form').find("input[name='id']").val('');
	$('#edit_cert_form').find("input[name='personnel.id']").val('');
	$('#edit_personnel_cert_modal').fadeIn('fast');
	$('#edit_personnel_cert_modal').find('.modal-title').html('编辑证书信息');
	if(id){
		$.ajax({
			url: CTX+'personnel/find-personnel-cert',
			type: 'get',
			data:{id:id},
			dataType: 'json',
			timeout: 10000,
			success: function(json){
				if(json){
					$('#edit_cert_form').find("input[name='id']").val(json.id);
					$('#edit_cert_form').find("input[name='personnel.id']").val(json.personnelId);
					$('#edit_cert_form').find("input[name='profession']").val(json.profession);
					$('#edit_cert_form').find("input[name='certificate']").val(json.certificate);
					$('#edit_cert_form').find("input[name='job']").val(json.job);
				}
			},
			error: function(){
				flavrAlert('请求超时或系统出错!',false);
				$('#edit_personnel_cert_modal').fadeOut('fast');
			}
		});
	}
}

//删除管理人员证书信息
function fnDelManagerCert(id,_this){
	flavrConfirm('确定要删除该项吗?',function(result){
		if(result){
			$.ajax({
				url: CTX+'personnel/del-personnel-cert',
				type: 'post',
				data:{id:id},
				dataType: 'json',
				timeout: 10000,
				success: function(json){
					if(json.success){
						$(_this).parent().parent().remove();
					}
				},
				error: function(){
					flavrAlert('请求超时或系统出错!',false);
				}
			});
		}
	});
}

//查看管理人员证书信息
function fnViewManagerCert(id){
	$('#profession_view').html('');
	$('#certificate_view').html('');
	$('#job_view').html('');
	$('#view_personnel_cert_modal').fadeIn('fast');
	if(id){
		$.ajax({
			url: CTX+'personnel/find-personnel-cert',
			type: 'get',
			data:{id:id},
			dataType: 'json',
			timeout: 10000,
			success: function(json){
				if(json){
					$('#profession_view').html(json.profession);
					$('#certificate_view').html(json.certificate);
					$('#job_view').html(json.job);
				}
			},
			error: function(){
				flavrAlert('请求超时或系统出错!',false);
				$('#view_personnel_cert_modal').fadeOut('fast');
			}
		});
	}
}

/* 入场  star*/
var doAdmission = function(id){
	$('#admission_form')[0].reset();//清空表单
	$('#admissionModal').find('.modal-title').html('人员入场');
	$('#admissionModal').modal('toggle');
	$.ajax({
		url:CTX+'personnel/get-personnel-in-out',
		type:'GET',
		data:{id:id,type:'admission'},
		dataType:'json',
		timeout: 10000,
		success:function(json){
			if(json){
				var ps = json.personnel;
				$('#admission_form').find("input[name='id']").val(ps.id);
				$('#admission_form').find("input[name='admissionAnnexIds']").val(ps.admissionAnnexIds!=null?ps.admissionAnnexIds:'');
				$('#admission_form').find("input[name='admissionTime']").val(ps.admissionTime!=null?new Date(ps.admissionTime).Format('yyyy-MM-dd hh:mm:ss'):'');
				if(json.annexes!=null){
					//遍历班组电子文件每一行tr，再一一写入
					$("tr[name='admission_folder_trs']").each(function(){
						var htmlStr = '';
						var trEl = $(this);
						$.each(json.annexes,function(i,annex){
							if(trEl.attr('field')==annex.annexFolder.id){
								htmlStr +=
									'<p>'+
					              	'	<input type="hidden" name="admission_fieldIds" value="'+annex.id+'"/>'+
					              	'	<a href="javascript:" onclick="window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
					              	'</p>';
							}
						});
						trEl.find("td[name='pa_annexes_td']").html(htmlStr);
					});
				}else{
					$('#admission_form').find("td[name='pa_annexes_td']").html('无');
				}

			}
		},
		error:function(){
			flavrAlert('请求超时或系统出错!',false);
		}
	});
}

//管理人员入场信息-扫描件管理
function fnEditAnnexIn(tdEl,folderId,folderName){
	var annexIdStr = '';
	var fields_tdEl = $(tdEl).parent().prev().prev();
	if(fields_tdEl.find("input[name='admission_fieldIds']").length>0){
		fields_tdEl.find("input[name='admission_fieldIds']").each(function(){
			annexIdStr += ','+$(this).val();
		});
		annexIdStr = annexIdStr.substring(1);
	}
	//调用统一附件管理页面
	window.top.openUploadAnnexWin({
		folderId: folderId,
		folderName: folderName,
		annexIds: annexIdStr
	},function(data){
		//附件管理回调
		if(data.length>0){
			var htmlStr = '';
			$.each(data,function(i,annex){
				htmlStr += 
					'<p>'+
	              	'	<input type="hidden" name="admission_fieldIds" value="'+annex.id+'"/>'+
	              	'	<a href="javascript:" onclick="window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
	              	'</p>';
			});
			fields_tdEl.html(htmlStr);
		}else{
			fields_tdEl.html('无');
		}
		if($("input[name='admission_fieldIds']").length>0){
			var annexIdStr = '';
			$("input[name='admission_fieldIds']").each(function(){
				annexIdStr += ','+$(this).val();
			});
			$('#admission_form').find("input[name='admissionAnnexIds']").val(annexIdStr.substring(1));
		}else{
			$('#admission_form').find("input[name='admissionAnnexIds']").val('');
		}
		//单独保存附件字段(可选，也可提交整个表单保存)
		fnSaveAdmissionAnnexes();
	});
}

function fnSaveAdmissionAnnexes(){
	var personnelId = $('#admission_form').find("input[name='id']").val();
	if(personnelId!=''){
		var annexIds = $('#admission_form').find("input[name='admissionAnnexIds']").val();
		$.ajax({
			url: CTX+'personnel/save-personnel-admission-annexes',
			type: 'post',
			dataType: 'json',
			data: {personnelId:personnelId,annexIds:annexIds},
			timeout: 10000,
			success: function(json){
				if(json.success){}
			},
			error: function(){
				flavrAlert('请求超时或系统出错!',false);
			}
		});
	}
}

//保存入场信息
function doSaveAdmission(_this){
	var result = $('#admission_form').data('bootstrapValidator');
	result.validate();
	if(result.isValid()){
		$(_this).attr('disabled','disabled');
		$(_this).html('保存中...');
		$.ajax({  
			url: CTX+'personnel/save-personnel-in-out',
	        type: 'POST',  
	        data:$('#admission_form').serialize(),// 序列化表单值  
	        dataType: 'json',//服务端接收的数据类型
	        success:function(json) {  
	        	flavrAlert(json.msg,false);
				if(json.success){
					queryInfo();
					$("#admissionModal").modal('toggle');
				}
				$(_this).removeAttr('disabled');
				$(_this).html('保存');
	        },  
	        error:function(json) {  
	        	flavrAlert('请求超时或系统出错!',false);
	        	$(_this).removeAttr('disabled');
				$(_this).html('保存');
	        }  
	    }); 
	}
}
/* 入场 end */

/* 离场  star*/
var doLeave = function(id,status){
	if(status==null){
		alert('人员未入场!');
		return;
	}
	$('#leaveModal').find('.modal-title').html('人员入场');
	$('#leaveModal').modal('toggle');
	$.ajax({
		url:CTX+'personnel/get-personnel-in-out',
		type:'GET',
		data:{id:id,type:'leave'},
		dataType:'json',
		timeout: 10000,
		success:function(json){
			if(json){
				var ps = json.personnel;
				$('#leave_form').find("input[name='id']").val(ps.id);
				$('#leave_form').find("input[name='leaveAnnexIds']").val(ps.leaveAnnexIds!=null?ps.leaveAnnexIds:'');
				$('#admission_time_label').html(ps.admissionTime!=null?new Date(ps.admissionTime).Format('yyyy-MM-dd hh:mm:ss'):'');
				$('#leave_form').find("input[name='leaveTime']").val(ps.leaveTime!=null?new Date(ps.leaveTime).Format('yyyy-MM-dd hh:mm:ss'):'');
				if(json.annexes!=null){
					//遍历班组电子文件每一行tr，再一一写入
					$("tr[name='leave_folder_trs']").each(function(){
						var htmlStr = '';
						var trEl = $(this);
						$.each(json.annexes,function(i,annex){
							if(trEl.attr('field')==annex.annexFolder.id){
								htmlStr +=
									'<p>'+
					              	'	<input type="hidden" name="leave_fieldIds" value="'+annex.id+'"/>'+
					              	'	<a href="javascript:window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
					              	'</p>';
							}
						});
						trEl.find("td[name='pl_annexes_td']").html(htmlStr);
					});
				}else{
					$('#leave_form').find("td[name='pl_annexes_td']").html('无');
				}

			}
		},
		error:function(){
			flavrAlert('请求超时或系统出错!',false);
		}
	});
}

//管理人员离场信息-扫描件管理
function fnEditAnnexOut(tdEl,folderId,folderName){
	var annexIdStr = '';
	var fields_tdEl = $(tdEl).parent().prev().prev();
	if(fields_tdEl.find("input[name='leave_fieldIds']").length>0){
		fields_tdEl.find("input[name='leave_fieldIds']").each(function(){
			annexIdStr += ','+$(this).val();
		});
		annexIdStr = annexIdStr.substring(1);
	}
	//调用统一附件管理页面
	window.top.openUploadAnnexWin({
		folderId:folderId,
		folderName:folderName,
		annexIds:annexIdStr
	},function(data){
		//附件管理回调
		if(data.length>0){
			var htmlStr = '';
			$.each(data,function(i,annex){
				htmlStr += 
					'<p>'+
	              	'	<input type="hidden" name="leave_fieldIds" value="'+annex.id+'"/>'+
	              	'	<a href="javascript:window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
	              	'</p>';
			});
			fields_tdEl.html(htmlStr);
		}else{
			fields_tdEl.html('无');
		}
		
		if($("input[name='leave_fieldIds']").length>0){
			var annexIdStr = '';
			$("input[name='leave_fieldIds']").each(function(){
				annexIdStr += ','+$(this).val();
			});
			$('#leave_form').find("input[name='leaveAnnexIds']").val(annexIdStr.substring(1));
		}else{
			$('#leave_form').find("input[name='leaveAnnexIds']").val('');
		}
		//单独保存附件字段(可选，也可提交整个表单保存)
		fnSaveLeaveAnnexes();
	});
}

function fnSaveLeaveAnnexes(){
	var personnelId = $('#leave_form').find("input[name='id']").val();
	if(personnelId!=''){
		var annexIds = $('#leave_form').find("input[name='leaveAnnexIds']").val();
		$.ajax({
			url: CTX+'personnel/save-personnel-leave-annexes',
			type: 'post',
			dataType: 'json',
			data: {personnelId:personnelId,annexIds:annexIds},
			timeout: 10000,
			success: function(json){
				if(json.success){}
			},
			error: function(){
				flavrAlert('请求超时或系统出错!',false);
			}
		});
	}
}

//保存离场信息
function doSaveLeave(_this){
	var result = $('#leave_form').data('bootstrapValidator');
	result.validate();
	if(result.isValid()){
		var admissionTime = $('#admission_time_label').html();
		var leaveTime = $('#leave_form').find("input[name='leaveTime']").val();
		admissionTime = admissionTime.replace(new RegExp("-","gm"),"/");
		leaveTime = leaveTime.replace(new RegExp("-","gm"),"/");
		var adTimes = (new Date(admissionTime)).getTime();
		var leTimes = (new Date(leaveTime)).getTime();
		if(leTimes<=adTimes){
			flavrAlert('离场时间必须大于进场时间!',true);
			return;
		}
		$(_this).attr('disabled','disabled');
		$(_this).html('保存中...');
		$.ajax({  
			url: CTX+'personnel/save-personnel-in-out',
	        type: 'POST',  
	        data:$('#leave_form').serialize(),// 序列化表单值  
	        dataType: 'json',//服务端接收的数据类型
	        success:function(json) {  
	        	flavrAlert(json.msg,false);
				if(json.success){
					queryInfo();
					$("#leaveModal").modal('hide');
				}
				$(_this).removeAttr('disabled');
				$(_this).html('保存');
	        },  
	        error:function(json) {  
	        	flavrAlert('请求超时或系统出错!',false);
	        	$(_this).removeAttr('disabled');
				$(_this).html('保存');
	        }  
	    });
	}
}
/* 离场end */
	
	
	
   //管理人员信息-扫描件管理
function fnEditAnnex(tdEl,folderId,folderName){
	var annexIdStr = '';
	var fields_tdEl = $(tdEl).parent().prev().prev();
	if(fields_tdEl.find("input[name='pt_fieldIds']").length>0){
		fields_tdEl.find("input[name='pt_fieldIds']").each(function(){
			annexIdStr += ','+$(this).val();
		});
		annexIdStr = annexIdStr.substring(1);
	}
	//调用统一附件管理页面
	window.top.openUploadAnnexWin({
		folderId:folderId,
		folderName:folderName,
		annexIds:annexIdStr
	},function(data){
		//附件管理回调
		if(data.length>0){
			var htmlStr = '';
			$.each(data,function(i,annex){
				htmlStr += 
					'<p>'+
	              	'	<input type="hidden" name="pt_fieldIds" value="'+annex.id+'"/>'+
	              	'	<a href="javascript:window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
	              	'</p>';
			});
			fields_tdEl.html(htmlStr);
		}else{
			fields_tdEl.html('无');
		}
		
		if($("input[name='pt_fieldIds']").length>0){
			var annexIdStr = '';
			$("input[name='pt_fieldIds']").each(function(){
				annexIdStr += ','+$(this).val();
			});
			$('#myform').find("input[name='annexIds']").val(annexIdStr.substring(1));
		}else{
			$('#myform').find("input[name='annexIds']").val('');
		}
		//单独保存附件字段(可选，也可提交整个表单保存)
		fnSavePersonnelAnnexes();
	});
}

function fnSavePersonnelAnnexes(){
	var personnelId = $('#myform').find("input[name='id']").val();
	if(personnelId!=''){
		var annexIds = $('#myform').find("input[name='annexIds']").val();
		$.ajax({
			url: CTX+'personnel/save-personnel-annexes',
			type: 'post',
			dataType: 'json',
			data: {personnelId:personnelId,annexIds:annexIds},
			timeout: 10000,
			success: function(json){
				if(json.success){}
			},
			error: function(){
				flavrAlert('请求超时或系统出错!',false);
			}
		});
	}
}
var cur_save_type = null;
//保存人员信息
function doSave(saveType){
	cur_save_type = saveType;
	$('#'+cur_save_type+'_submit_btn').html('保存中...');
	$('#'+cur_save_type+'_submit_btn').attr('disabled','disabled');
	$('#myform').bootstrapValidator('validate');
}
//------------------------------------------//
//时间：2018年9月27日09:06:10
//作者：GZX
//函数：保存新增人员信息
//------------------------------------------//
function doSave2(saveType){
    cur_save_type = saveType;
    $('#'+cur_save_type+'_submit_btn').html('保存中...');
    $('#'+cur_save_type+'_submit_btn').attr('disabled','disabled');
    $('#addPersonFrom').bootstrapValidator('validate');//提交表单验证
}
//编辑
var doEdit = function(id){
	fnResetaddForm();
	$('#addModal').find('.modal-title').html('编辑管理员信息');
	$('#addModal').modal('toggle');
	$.ajax({
		url:CTX+'personnel/get-personnel',
		type:'GET',
		data:{id:id},
		dataType:'json',
		timeout: 10000,
		success:function(json){
			if(json){
				var personnel = json.personnel;
			    $('#myform').find("input[name='id']").val(personnel.id);
			    $('#myform').find("input[name='companyName']").val(personnel.companyName);
				$('#myform').find("input[name='socialCreditCode']").val(personnel.socialCreditCode);
				$('#myform').find("input[name='userType']").val(personnel.userType);
				$('#myform').find("input[name='name']").val(personnel.name);
				$('#myform').find("input[name='idNumber']").val(personnel.idNumber);
				$('#myform').find("input[name='issueOffice']").val(personnel.issueOffice);
				$('#myform').find("input[name='expirationStartDate']").val(personnel.expirationStartDate);
				$('#myform').find("input[name='expirationEndDate']").val(personnel.expirationEndDate);
				$('#myform').find("input[name='sex'][value='"+personnel.sex+"']").prop("checked", "checked");
				$('#myform').find("input[name='isPartyMember'][value='"+personnel.isPartyMember+"']").prop("checked", "checked");
				$('#myform').find("input[name='liveNumber']").val(personnel.liveNumber);
				$('#myform').find("input[name='ethnic']").val(personnel.ethnic);
				$('#myform').find("input[name='telphone']").val(personnel.telphone);
				$('#myform').find("select[name='marriage']").val(personnel.marriage);
				$('#myform').find("select[name='eduLevel']").val(personnel.eduLevel);
				$('#myform').find("input[name='resAddress']").val(personnel.resAddress);
				$('#myform').find("input[name='familyAddress']").val(personnel.familyAddress);
				$('#myform').find("input[name='outRfid']").val(personnel.outRfid);
				$('#myform').find("input[name='inRfid']").val(personnel.inRfid);
				$('#myform').find("select[name='adminType.id']").val(personnel.adminType!=null?personnel.adminType.id:'');
				$('#myform').find("input[name='remark']").val(personnel.remark);
				$('#myform').find("select[name='useunitType.id']").val(personnel.useunitType.id);
				$('#myform').find("input[name='workNo']").val(personnel.workNo);
				$('#myform').find("input[name='icNumber']").val(personnel.icNumber);
				$('#myform').find("input[name='annexIds']").val(personnel.annexIds);
				if(personnel.photoStr!=null&&personnel.photoStr!=''){
					$('.file-default-preview img').attr('src','data:image/jpeg;base64,'+personnel.photoStr+'');
				}
				if(json.managerCerts!=null){
					var htmlStr = '';
					$.each(json.managerCerts,function(i,pc){
						htmlStr += 
			                '<tr>'+
			                '	<td>'+(i+1)+'<input type="hidden" name="managerCertIds" value="'+pc.id+'"/></td>'+
			                '	<td>'+pc.profession+'</td>'+
			                '	<td>'+pc.certificate+'</td>'+
			                '	<td>'+pc.job+'</td>'+
			                '	<td>'+
			                '		<a href="javascript:" onclick="fnEditManagerCert(\''+pc.id+'\')">修改</a>&nbsp;'+
			                '		<a href="javascript:" onclick="fnViewManagerCert(\''+pc.id+'\')">查看</a>&nbsp;'+
			                '		<a href="javascript:" onclick="fnDelManagerCert(\''+pc.id+'\',this)">删除</a>'+
			                '	</td>'+
			                '</tr>'
					});
					$('#personnel_cert_tbody').html(htmlStr);
				}
				
				if(json.annexes!=null){
					//遍历班组电子文件每一行tr，再一一写入
					$("tr[name='folder_trs']").each(function(){
						var htmlStr = '';
						var trEl = $(this);
						$.each(json.annexes,function(i,annex){
							if(trEl.attr('field')==annex.annexFolder.id){
								htmlStr +=
									'<p>'+
					              	'	<input type="hidden" name="pt_fieldIds" value="'+annex.id+'"/>'+
					              	'	<a href="javascript:" onclick="window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
					              	'</p>';
							}
						});
						trEl.find("td[name='pt_annexes_td']").html(htmlStr==''?'无':htmlStr);
					});
				}else{
					$('#myform').find("td[name='pt_annexes_td']").html('无');
				} 

			}
		},
		error:function(){
			flavrAlert('请求超时或系统出错!',false);
		}
	});
}

function doShowDetail(id){
	$('#viewModal').modal('toggle');
	$.ajax({
		url:CTX+'personnel/get-personnel',
		type:'GET',
		data:{id:id},
		dataType:'json',
		timeout: 10000,
		success:function(json){
			if(json){
				var personnel = json.personnel;
			    $('#companyName_div').html(personnel.companyName);
				$('#socialCreditCode_div').html(personnel.socialCreditCode);
				$('#name_div').html(personnel.name);
				$('#idNumber_div').html(personnel.idNumber);
				$('#issueOffice_div').html(personnel.issueOffice);
				$('#expirationDate_div').html(personnel.expirationStartDate+' 至 '+personnel.expirationEndDate);
				$('#sex_div').html(personnel.sex==0?'男':'女');
				$('#isPartyMember_div').html(personnel.isPartyMember?'是':'否');
				$('#liveNumber_div').html(personnel.liveNumber);
				$('#ethnic_div').html(personnel.ethnic);
				$('#telphone_div').html(personnel.telphone);
				$('#marriage_div').html(personnel.marriage);
				$('#eduLevel_div').html(personnel.eduLevel);
				$('#resAddress_div').html(personnel.resAddress);
				$('#familyAddress_div').html(personnel.familyAddress);
				$('#outRfid_div').html(personnel.outRfid);
				$('#inRfid_div').html(personnel.inRfid);
				$('#adminType_div').html(personnel.adminType!=null?personnel.adminType.name:'');
				$('#remark_div').html(personnel.remark);
				$('#useunitType_div').html(personnel.useunitType!=null?personnel.useunitType.typeName:'');
				$('#workNo_div').html(personnel.workNo);
				$('#icNumber_div').html(personnel.icNumber);
				if(personnel.photoStr!=null&&personnel.photoStr!=''){
					$('#photo_img_view').attr('src','data:image/jpeg;base64,'+personnel.photoStr+'');
				}else{
					$('#photo_img_view').attr('src',CTX+'static/images/default_avatar_male.jpg');
				}
				if(json.managerCerts!=null){
					var htmlStr = '';
					$.each(json.managerCerts,function(i,pc){
						htmlStr += 
			                '<tr>'+
			                '	<td>'+(i+1)+'</td>'+
			                '	<td>'+pc.profession+'</td>'+
			                '	<td>'+pc.certificate+'</td>'+
			                '	<td>'+pc.job+'</td>'+
			                '</tr>'
					});
					$('#view_personnel_cert_tbody').html(htmlStr);
				}
				
				if(json.annexes!=null){
					//遍历班组电子文件每一行tr，再一一写入
					$("tr[name='view_folder_trs']").each(function(){
						var htmlStr = '';
						var trEl = $(this);
						$.each(json.annexes,function(i,annex){
							if(trEl.attr('field')==annex.annexFolder.id){
								htmlStr +=
									'<p>'+
					              	'	<a href="javascript:" onclick="window.top.openCommonViewImgWin(\''+annex.id+'\')">'+annex.name+'.'+annex.extendName+'</a>'+
					              	'</p>';
							}
						});
						trEl.find("td[name='view_pt_annexes_td']").html(htmlStr);
					});
				}else{
					$("td[name='view_pt_annexes_td']").html('无');
				} 
			}
		},
		error:function(){
			alert('请求超时或系统出错!');
		}
	});
}

/**
 * 删除未关联人员无效的证书信息
 * @returns
 */
function fnDelInvalidCert(){
	$.ajax({
		url: CTX+'personnel/del-invalid-cert',
		dataType:'json',
		success:function(json){}
	});
}


/**
 * 读取身份证信息
 * @returns
 */
function fnReadInfo(){
	loading("正在读取身份证...");
	$.ajax({
		url:'http://localhost:8790/icreader/entrance/idcard/readIdInfo',
		type:'get',
		dataType:'jsonp',
		timeout:10000,
		success:function(json){
			loaded();
			if(json&&typeof json.Result == "object"){
				var userInfo = json.Result[0];
				$('#myform').find("input[name='name']").val(userInfo.Name);
				$('#myform').find("input[name='idNumber']").val(userInfo.CitizenIdNumber);
				$('#myform').find("input[name='issueOffice']").val(userInfo.Authority);
				$('#myform').find("input[name='expirationStartDate']").val(userInfo.ValidFrom);
				$('#myform').find("input[name='expirationEndDate']").val(userInfo.ValidUntil);
				var isex = userInfo.Sex=='男'?0:1;
				$('#myform').find("input[name='sex'][value='"+isex+"']").prop("checked", "checked");
				$('#myform').find("input[name='ethnic']").val(userInfo.Ethnicity);
				$('#myform').find("input[name='resAddress']").val(userInfo.ResidentialAddress);
				if(userInfo.PhotoBase64!=''){
					$('.file-default-preview img').attr('src','data:image/jpeg;base64,'+userInfo.PhotoBase64+'');
					$('#myform').find("input[name='photoStr']").val(userInfo.PhotoBase64);
				}
			}else{
				flavrAlert(json.Result,false);
			}
		},
		error:function(){
			loaded();
			flavrConfirm("请求超时或读卡服务未安装<br/>是否现在下载安装？",function(result){
				if(result){
					window.open(CTX+'static/annex/xmrbi-icreader-install.exe');
				}
			});
		}
	});
}

/**
 * 读取IC卡信息信息
 * @returns
 */
function fnReadIC(){
	loading("正在读取IC卡...");
	$.ajax({
		url:'http://localhost:8790/icreader/entrance/idcard/readIcInfo',
		type:'get',
		dataType:'jsonp',
		timeout:10000,
		success:function(json){
			loaded();
			if(json && typeof json.Result == "object"){
				var icInfo = json.Result[0];
				$('#myform').find("input[name='icNumber']").val(icInfo.CardNumber);
				var bootstrapValidator = $("#myform").data('bootstrapValidator');  
				bootstrapValidator.updateStatus('icNumber', 'NOT_VALIDATED').validateField('icNumber');
			}else{
				flavrAlert(json.Result,false);
			}
		},
		error:function(){
			loaded();
			flavrConfirm("请求超时或读卡服务未安装<br/>是否现在下载安装？",function(result){
				if(result){
					window.open(CTX+'static/annex/xmrbi-icreader-install.exe');
				}
			});
		}
	});
}

/**
 * 读取RFID卡
 * @returns
 */
function fnReadMark(num){
	loading("正在读取RFID卡...");
	$.ajax({
		url:'http://localhost:8790/icreader/entrance/rfid/readEpcTag',
		type:'get',
		dataType:'jsonp',
		timeout:10000,
		success:function(json){
			loaded();
			if(json && typeof json.Result == "object"){
				var rfidInfo = json.Result[0];
				if(num==1){
					$('#myform').find("input[name='outRfid']").val(rfidInfo.tag);
				}else{
					$('#myform').find("input[name='inRfid']").val(rfidInfo.tag);
				}
			}else{
				flavrAlert(json.Result,false);
			}
		},
		error:function(){
			loaded();
			flavrConfirm("请求超时或读卡服务未安装<br/>是否现在下载安装？",function(result){
				if(result){
					window.open(CTX+'static/annex/xmrbi-icreader-install.exe');
				}
			});
		}
	});
}

/**
 * 查询可以下发的考勤机设备
 * @param
 * @returns
 */
function fnIssuedAccDevice(delIds){
	$('#IssuedIC_Modal').modal('toggle');
	$('#IssuedIC_Modal_load').show();
	$("#IssuedIC_form input[name='personnelId']").val(delIds);
	$.ajax({
		url: CTX+'personnel/query-issued-att-info',
		type: 'GET',
		dataType: 'json',
		data: {},
		success:function(json){
			$('#IssuedIC_Modal_load').hide();
			if(json){
				var htmlStr = '';
				$.each(json,function(i,data){
					htmlStr += 
						'<tr>'+
						'	<td><input type="checkbox" name="accIds" value="'+data.id+'"/></td>'+
						'	<td>'+data.accNo+'</td>'+
						'	<td>'+data.accName+'</td>'+
						'	<td>'+(data.status=='0'||data.status==null?'<span class="badge bg-red">离线</span>':'<span class="badge bg-green">在线</span>')+'</td>'+
						'	<td>'+(data.personnelCapacity==null?'-':data.personnelCapacity)+'</td>'+
						'	<td>'+(data.storageState==null?'-':data.storageState)+'</td>'+
						// '	<td>'+(data.issuedStatus==null||data.issuedStatus==0?'<span class="badge bg-gray">未导入</span>':(data.issuedStatus==1?'<span class="badge bg-green">成功</span>':'<span class="badge bg-red">失败</span>'))+'</td>'+
						'</tr>';
				});
				$('#issuedIC_tbody').html(htmlStr);
			}
		},
		error:function(){
			$('#IssuedIC_Modal_load').hide();
			alert('请求超时或系统出错!');
		}
	});
}
/**
 * IC卡下发全选
 * @param _this
 * @returns
 */
function fnIssuedCheckAll(_this,formId){
	if($(_this).is(':checked')){
		if(formId=='IssuedIC_form'){
			$('#IssuedIC_form').find("input[name='accIds']").prop('checked',true);
		}
		if(formId=='IssuedAtt_form'){
			$('#IssuedAtt_form').find("input[name='deviceIdInfos']").prop('checked',true);
		}
		if(formId=='IssuedICBatGet_form'){
            $('#IssuedICBatGet_form').find("input[name='accIds']").prop('checked',false);
            $(_this).prop('checked',true);
		}
	}else{
		if(formId=='IssuedIC_form'){
			$('#IssuedIC_form').find("input[name='accIds']").prop('checked',false);
		}
		if(formId=='IssuedAtt_form'){
			$('#IssuedAtt_form').find("input[name='deviceIdInfos']").prop('checked',false);
		}
        if(formId=='IssuedICBatGet_form'){
            // $('#IssuedICBatGet_form').find("input[name='accIds']").prop('checked',true);
            $(_this).prop('checked',false);
        }
	}
}
/**
 * 保存IC卡下发信息
 * @param _this
 * @returns
 */
function fnSaveIssuedICInfo(_this,options){
	var hasRow = false;
	var options = options;
    $("#IssuedIC_form input[name='options']").val(options);
	$('#IssuedIC_form').find("input[name='accIds']").each(function(){
		if($(this).is(':checked')){
			hasRow = true;
		}
	});
	if(!hasRow){
		alert('请至少选择一项');
		return;
	}
	loading('下发请求中,请稍后...');
	$.ajax({
		url:CTX+'personnel/save-personnels-issued-att-info',
		type: 'POST',
		dataType: 'json',
		data:$('#IssuedIC_form').serialize(),// 序列化表单值  
		timeout: 10000,
		success: function(json){
			if(json.success){
				BACK_DEAL_INFO = {};
				BACK_DEAL_INFO.sessionId = json.sessionId;
				BACK_DEAL_INFO.operObj = 'download_ICInfo';
                loaded();
                // alert("发送成功！");
                flavrConfirm('发送成功！',function(result){
                    if(result){
                        $('#IssuedIC_Modal').modal('hide');
                    }
                });

				fnSetWaitTimeout();
			}else{
				alert(json.msg);
                alert('发送失败！');
				loaded();
			}
		},
		error: function(json){
			alert('请求超时或系统错误');
			loaded();
		}
	});
}

/**
 * 下发人员到考勤机
 * @param personnelId
 * @returns
 */
function fnIssuedAttDevice(personnelId){
	$('#IssuedAtt_Modal').modal('toggle');
	$('#IssuedAtt_Modal_load').show();
	$("#IssuedAtt_form input[name='personnelId']").val(personnelId);
	$.ajax({
		url: CTX+'personnel/query-personnel-issued-att-info',
		type: 'GET',
		dataType: 'json',
		data: {personnelId:personnelId},
		timeout: 10000,
		success:function(json){
			$('#IssuedAtt_Modal_load').hide();
			if(json){
				//考勤机列表
				var htmlStr = '';
				$.each(json.otherAttes,function(i,data){
					htmlStr +=
						'<tr field="other_atte_tr_'+data.id+'">'+
						'	<td style="vertical-align: middle;"><input type="checkbox" name="deviceIdInfos" value="'+data.id+'_'+data.type+'"/></td>'+
						'	<td style="vertical-align: middle;">'+(data.type=='acc'?'<img src="'+STATIC+'/images/acc-device.png" style="height:32px;width:32px;" title="门禁设备"/>':'<img src="'+STATIC+'/images/att-device.png" style="height:32px;width:32px;" title="考勤机"/>')+'</td>'+
						'	<td style="vertical-align: middle;">'+data.no+'</td>'+
						'	<td style="vertical-align: middle;">'+data.name+'</td>'+
						'	<td style="vertical-align: middle;">'+(data.status=='1'?'<span class="badge bg-green">在线</span>':'<span class="badge bg-red">离线</span>')+'</td>'+
						'	<td style="vertical-align: middle;">'+(data.personnelCapacity==null?'-':data.personnelCapacity)+'</td>'+
						'	<td style="vertical-align: middle;">'+(data.storageState==null?'-':data.storageState)+'</td>'+
						'	<td style="vertical-align: middle;">'+(data.issuedStatus==null||data.issuedStatus==0?'<span class="badge bg-gray">未导入</span>':(data.issuedStatus==1?'<span class="badge bg-green">成功</span>':'<span class="badge bg-red">失败</span>'))+'</td>'+
						'</tr>';
				});
				$('#issuedAtt_tbody').html(htmlStr);
				//人员信息
				if(json.personnel.photoStr!=null&&json.personnel.photoStr!=''){
					$("img[field='personnel_photo']").attr('src','data:image/jpeg;base64,'+json.personnel.photoStr);
				}
				$("span[field='personnel_name']").html(json.personnel.name);
				$("span[field='personnel_workno']").html(json.personnel.workNo);
				$("span[field='atten_name']").html(json.defaultDevice!=null?json.defaultDevice.name:'未选择');
				$("span[field='atten_type']").html(json.defaultDevice!=null?(json.defaultDevice.type=='acc'?'门禁设备':'考勤机'):'未选择');
				$("span[field='atten_personnelCapacity']").html(json.defaultDevice!=null?(json.defaultDevice.personnelCapacity!=null?json.defaultDevice.personnelCapacity:'-'):'未选择');
				$("#IssuedAtt_form input[name='defaultDeviceId']").val(json.defaultDevice!=null?json.defaultDevice.id:'');
				$("#IssuedAtt_form input[name='defaultDeviceType']").val(json.defaultDevice!=null?json.defaultDevice.type:'');
				if(json.defaultDevice!=null&&json.defaultDevice.issuedStatus!=null){
					if(json.defaultDevice.issuedStatus==0){
						$("span[field='default_issuedStatus']").html('未导出');
						$("span[field='default_issuedStatus']").attr('class','badge bg-gray');
					}
					if(json.defaultDevice.issuedStatus==1){
						$("span[field='default_issuedStatus']").html('已导出');
						$("span[field='default_issuedStatus']").attr('class','badge bg-green');
					}
					if(json.defaultDevice.issuedStatus==2){
						$("span[field='default_issuedStatus']").html('导出失败');
						$("span[field='default_issuedStatus']").attr('class','badge bg-red');
					}
				}else{
					$("span[field='default_issuedStatus']").html('未导出');
					$("span[field='default_issuedStatus']").attr('class','badge bg-gray');
				}
				//是否有提取
				if(json.personnel.fingerprintStr==null&&json.personnel.facePhotoStr == null){
					$("span[field='default_hasfingerprint']").html('未提取');
					$("span[field='default_hasfingerprint']").attr('class','badge bg-gray');
				}else{
					$("span[field='default_hasfingerprint']").html('已提取');
					$("span[field='default_hasfingerprint']").attr('class','badge bg-green');
				}
				//指纹模板
				if(json.personnel.fingerprintStr==null){
					$("span[field='personnel_fingerprint']").html('否');
				}else{
					$("span[field='personnel_fingerprint']").html('是');
				}
				//人脸模板
				if(json.personnel.facePhotoStr == null){
					$("span[field='personnel_facephoto']").html('否');
				}else{
					$("span[field='personnel_facephoto']").html('是');
				}
				//用户采集人脸照
				if(json.personnel.attePhotoStr!=null){
					$("img[field='personnel_attephoto']").attr('src','data:image/jpeg;base64,'+json.personnel.attePhotoStr);
				}
			}
		},
		error:function(){
			$('#IssuedAtt_Modal_load').hide();
			flavrAlert('请求超时或系统错误!',false);
		}
	});
}

/**
 * 选择默认下发设备
 * @param deviceId
 * @param deviceType
 * @returns
 */
function fnSelDefaultDevice(deviceId,deviceType){
	$.ajax({
		url: CTX+'personnel/find-default-issued-info',
		type: 'GET',
		dataType: 'json',
		data: {
			personnelId:$("#IssuedAtt_form input[name='personnelId']").val(),
			defaultDeviceId: deviceId,
			defaultDeviceType: deviceType
		},
		timeout: 10000,
		success:function(json){
			if(json){
				$("#IssuedAtt_form input[name='defaultDeviceId']").val(json.id);
				$("#IssuedAtt_form input[name='defaultDeviceType']").val(json.type);
				$("span[field='atten_name']").html(json.name);
				$("span[field='atten_type']").html(json.type=='acc'?'门禁设备':'考勤机');
				$("span[field='atten_personnelCapacity']").html(json.personnelCapacity!=null?json.personnelCapacity:'-');
				if(json.issuedStatus!=null){
					if(json.issuedStatus==0){
						$("span[field='default_issuedStatus']").html('未导出');
						$("span[field='default_issuedStatus']").attr('class','badge bg-gray');
					}
					if(json.issuedStatus==1){
						$("span[field='default_issuedStatus']").html('已导出');
						$("span[field='default_issuedStatus']").attr('class','badge bg-green');
					}
					if(json.issuedStatus==2){
						$("span[field='default_issuedStatus']").html('导出失败');
						$("span[field='default_issuedStatus']").attr('class','badge bg-red');
					}
				}else{
					$("span[field='default_issuedStatus']").html('未导出');
					$("span[field='default_issuedStatus']").attr('class','badge bg-gray');
				}
			}
		},
		error:function(){
			flavrAlert('请求超时或系统错误!',false);
		}
	});
}

/**
 * 下发人员到设备
 * @param _this
 * @returns
 */
function fnDownloadPersonnelInfo(_this){
	if($("#IssuedAtt_form input[name='defaultDeviceId']").val()==''){
		flavrAlert('暂无设备可导出,请添加默认的采集设备!',true);
		return;
	}
	loading('下发请求中,请稍后...');
	$.ajax({
		url: CTX+'personnel/personnel-issued-att-info',
		type: 'GET',
		dataType: 'json',
		timeout: 15000,
		data: {
			personnelId: $("#IssuedAtt_form input[name='personnelId']").val(),
			defaultDeviceId: $("#IssuedAtt_form input[name='defaultDeviceId']").val(),
			defaultDeviceType: $("#IssuedAtt_form input[name='defaultDeviceType']").val()
		},
		success: function(json){
			if(json.success){
				BACK_DEAL_INFO = {};
				BACK_DEAL_INFO.sessionId = json.sessionId;
				BACK_DEAL_INFO.operObj = 'download_PersonnelInfo';
				fnSetWaitTimeout();
			}else{
				flavrAlert(json.msg,false);
				loaded();
			}
		},
		error: function(){
			flavrAlert('请求超时或系统错误!',false);
			loaded();
		}
	});
}
/**
 * 更新下发人员到设备回调
 * @returns
 */
function fnUpdatePersonnelDownInfo(){
	$.ajax({
		url: CTX+'personnel/find-issued-atte-info',
		type: 'GET',
		dataType: 'json',
		timeout:5000,
		data: {
			personnelId: $("#IssuedAtt_form input[name='personnelId']").val(),
			defaultDeviceId: $("#IssuedAtt_form input[name='defaultDeviceId']").val(),
			defaultDeviceType: $("#IssuedAtt_form input[name='defaultDeviceType']").val()
		},
		success: function(json){
			if(json){
				if(json.issuedStatus==0){
					$("span[field='default_issuedStatus']").html('未导出');
					$("span[field='default_issuedStatus']").attr('class','badge bg-gray');
				}
				if(json.issuedStatus==1){
					$("span[field='default_issuedStatus']").html('已导出');
					$("span[field='default_issuedStatus']").attr('class','badge bg-green');
				}
				if(json.issuedStatus==2){
					$("span[field='default_issuedStatus']").html('导出失败');
					$("span[field='default_issuedStatus']").attr('class','badge bg-red');
				}
			}
		}
	});
}

/**
 * 提取人员指纹与图片
 * @param _this
 * @return
 */
function fnGetFaceAndFingerprint(_this){
	if($("#IssuedAtt_form input[name='defaultDeviceId']").val()==''){
		flavrAlert('未选择采集设备!',true);
		return;
	}
	if($("span[field='default_issuedStatus']").html()=='未导出'||$("span[field='default_issuedStatus']").html()=='导出失败'){
		flavrAlert('人员信息还未下发采集设备，无法提取!',true);
		return;
	}
	loading('提取请求中,请稍后...');
	$.ajax({
		url: CTX+'personnel/upload-fp-template-info',
		type: 'GET',
		dataType: 'json',
		timeout: 15000,
		data: {
			personnelId: $("#IssuedAtt_form input[name='personnelId']").val(),
			defaultDeviceId: $("#IssuedAtt_form input[name='defaultDeviceId']").val(),
			defaultDeviceType: $("#IssuedAtt_form input[name='defaultDeviceType']").val()
		},
		success: function(json){
			if(json.success){
				BACK_DEAL_INFO = {};
				BACK_DEAL_INFO.sessionId = json.sessionId;
				BACK_DEAL_INFO.operObj = 'upload_PersonnelInfo';
				fnSetWaitTimeout();
			}else{
				flavrAlert(json.msg,false);
				loaded();
			}
		},
		error: function(){
			flavrAlert('系统错误或请求超时!',false);
			loaded();
		}
	});
}

/**
 * 下发人员信息到其他设备
 * @param _this
 * @returns
 */
function fnDownloadPersonnelToOther(_this){
	var hasRow = false;
	$('#IssuedAtt_form').find("input[name='deviceIdInfos']").each(function(){
		if($(this).is(':checked')){
			hasRow = true;
			return false;//跳出循环
		}
	});
	if(!hasRow){
		flavrAlert('请至少选择一台设备!',true);
		return;
	}
	var hasfingerprint = true;
	if($("span[field='default_hasfingerprint']").html()=='未提取'||$("span[field='default_hasfingerprint']").html()=='提取失败'){
		hasfingerprint = false;
	}
	if(!hasfingerprint){
		flavrConfirm('人员指纹或人脸图片还未提取<br/>是否继续下发到其他设备？',function(result){
			if(result){
				downloadToOther(_this);
			}
		});
	}else{
		downloadToOther(_this);
	}
}

function downloadToOther(_this){
	loading('正在下发中,请稍后...');
	$(_this).attr('disabled',true);
	$.ajax({
		url:CTX+'personnel/save-personnel-issued-att-info',
		type: 'POST',
		dataType: 'json',
		data:$('#IssuedAtt_form').serialize(),// 序列化表单值  
		timeout: 10000,
		success: function(json){
			if(json.success){
				BACK_DEAL_INFO = {};
				BACK_DEAL_INFO.sessionId = json.sessionId;
				BACK_DEAL_INFO.operObj = 'download_PersonnelInfos';
				fnSetWaitTimeout();
			}else{
				flavrAlert(json.msg,false);
				loaded();
			}
			$(_this).removeAttr('disabled');
		},
		error: function(){
			$(_this).removeAttr('disabled');
			flavrAlert('请求超时或系统错误!',false);
			loaded();
		}
	});
}

function fnUpdatePersonnelDownInfos(){
	var attIds = '';
	$('#IssuedAtt_form').find("input[name='deviceIdInfos']").each(function(){
		if($(this).is(':checked')){
			var attId = $(this).val().split('_')[0];
			attIds += ','+$(this).val();
		}
	});
	if(attIds!=''){
		$.ajax({
			url: CTX+'personnel/query-issued-atte-info',
			type: 'GET',
			dataType: 'json',
			timeout:5000,
			data: {
				personnelId: $("#IssuedAtt_form input[name='personnelId']").val(),
				attIds: attIds.substring(1)
			},
			success: function(jsonList){
				if(jsonList){
					$.each(jsonList,function(i,issuedInfo){
						var htmlStr = '';
						if(issuedInfo.issuedStatus==0){
							htmlStr = '<span class="badge bg-gray">未导入</span>';
						}
						if(issuedInfo.issuedStatus==1){
							htmlStr = '<span class="badge bg-green">成功</span>';
						}
						if(issuedInfo.issuedStatus==2){
							htmlStr = '<span class="badge bg-red">失败</span>';
						}
						$('#other_atte_tr_'+issuedInfo.id).find("td:last").html(htmlStr);
					});
				}
			}
		});
	}
}

var TimeoutNum = 30;
var TimeoutObj = null;
function fnSetWaitTimeout(){
	var i = 0;
	TimeoutObj = window.setInterval(function(){
		i++;
		if(i>=TimeoutNum){
			loaded();
			BACK_DEAL_INFO = {};
			window.clearInterval(TimeoutObj);
			alert('操作结果响应超时,请稍后再试');
		}
	},1000);
}