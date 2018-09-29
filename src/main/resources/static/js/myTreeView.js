function MyTreeview(){
 	this.init.apply(this,arguments);
}
MyTreeview.prototype={
	init:function(params,callback){
		var self = this;
 		self.body = document.getElementById(params.id);
 		$(self.body).addClass('sidebar-menu');
 		$(self.body).append('<li class="header">'+params.title+'</li>');
 		self.params = params;
		self._setTreeData(callback);
		if(typeof params.nodeClick == 'function'){
			var aele = self.body.getElementsByTagName("a");
			for(var i=0;i<aele.length;i++){
				aele[i].addEventListener('click',function(e){
					var url = this.getAttribute('url');
					if(url!=undefined&&url!=''){
						var node = {};
						node.id = this.getAttribute("fieldId");
						node.name = this.getAttribute("fieldName");
						node.icon = this.getAttribute("fieldIcon");
						node.url = url;
						params.nodeClick(node);
					}
					$('.sidebar-menu li').removeClass('active');
					if(url!=undefined && url!=null){
						$(this).parent().addClass('active');
					}
				});
			}
		}
	},
	//设置数据
	_setTreeData:function(callback){
		var self = this;
		if(self.params.data!=null&&self.params.data.length>0){
			var htmlStr = '';
			$.each(self.params.data,function(i,menu){
				var childHtmlStr = self._getChild(menu);
				if(childHtmlStr==''){
					htmlStr += '<li><a href="javascript:" url="'+menu.url+'" fieldId="'+menu.id+'" fieldName="'+menu.text+'" fieldIcon="'+menu.icon+'"><i class="'+(menu.icon!=null?menu.icon:'fa fa-circle-o')+'"></i> '+menu.text+'</a></li>';
				}else{
					htmlStr += 
						'<li class="treeview">'+
						'	<a href="javascript:"><i class="'+(menu.icon!=null?menu.icon:'fa fa-th')+'"></i> <span>'+menu.text+'</span>'+
						'	<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>'+
						'	</a>'+
						'	<ul class="treeview-menu">'+
							childHtmlStr+
						'	</ul>'+
						'</li>';
				}
			});
			$(self.body).append(htmlStr);
		}
		if(typeof callback == 'function'){
			callback();
	 	}
	},
	_getChild:function(menu){
		var self = this;
		var childStr = '';
		if(menu.nodes!=null&&menu.nodes!=''&&menu.nodes.length>0){
			$.each(menu.nodes,function(i,child){
				if(child.nodes!=null&&child.nodes.length>0){
					childStr += 
							'<li>'+
							'	<a href="javascript:">'+
							'		<i class="'+(child.icon!=null?child.icon:'fa fa-th')+'"></i><span>'+child.text+'</span>'+
							'		<span class="pull-right-container">'+
							'    		<i class="fa fa-angle-left pull-right"></i>'+
							'  		</span>'+
							'	</a>'+
							'	<ul class="treeview-menu">'+
									self._getChild(child)+
							'	</ul>'+
							'</li>';
				}else{
					childStr += '<li><a href="javascript:" url="'+child.url+'" fieldId="'+child.id+'" fieldName="'+child.text+'" fieldIcon="'+child.icon+'"><i class="'+(child.icon!=null?child.icon:'fa fa-circle-o')+'"></i> '+child.text+'</a></li>';
				}
			});
		}
		return childStr;
	}
};