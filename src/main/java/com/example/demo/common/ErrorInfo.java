package com.example.demo.common;
/**     
 * @Title: ErrorInfo.java   
 * @Package com.sailboat.config   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月10日 下午6:11:48   
 * @version V1.0     
 */
public class ErrorInfo<T> {
	public static final Integer OK = 0;
	public static final Integer ERROR = -1;
	private Integer code;
	private String msg;
	private String url;
	private T data;
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
}
