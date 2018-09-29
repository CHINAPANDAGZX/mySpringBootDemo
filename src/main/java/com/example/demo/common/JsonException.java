package com.example.demo.common;
/**     
 * @Title: MyException.java   
 * @Package com.sailboat.config   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月10日 下午6:12:33   
 * @version V1.0     
 */
public class JsonException extends Exception{
	private static final long serialVersionUID = 1L;
	public JsonException(String message) {
		super(message);
	}
}
