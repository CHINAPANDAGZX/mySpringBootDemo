/**
 * 把数组构造成树形结构，数组的对象，需要有id, parentId, text
 */
function buildTreeData(arr) {
    for (var i=0;i<arr.length;i++) {
	   if (arr[i].parentId) {
	       if (handleChildren(arr,arr[i])) {
		       arr.splice(i--,1);
	       }
	   }
    }
}

function handleChildren(arr,ele) {
    for (var i=0;i<arr.length;i++) {
	   if (arr[i].id == ele.parentId) {
	       if (!arr[i].nodes) arr[i].nodes = [];
	       arr[i].nodes.push(ele);
	       return true;	       
	   }
       if (arr[i].nodes) {
	       var result = handleChildren(arr[i].nodes,ele);
	       if (result) return true;
       }
    }
    return false;
}