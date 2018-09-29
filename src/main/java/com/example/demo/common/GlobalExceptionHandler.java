package com.example.demo.common;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**     
 * @Title: GlobalExceptionHandler.java   
 * @Package com.sailboat.config   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月10日 下午6:06:15   
 * @version V1.0     
 */
@ControllerAdvice
public class GlobalExceptionHandler {
	public static final String DEFAULT_ERROR_VIEW = "error";
	 
	@ExceptionHandler(value = Exception.class)
	public ModelAndView defaultErrorHandler(HttpServletRequest req, Exception e) throws Exception {
		ModelAndView mav = new ModelAndView();
		mav.addObject("message",e.getMessage());
		mav.addObject("url", req.getRequestURL());
		mav.setViewName(DEFAULT_ERROR_VIEW);
		return mav;
	}
	
	@ExceptionHandler(value = JsonException.class)
	@ResponseBody
	public ErrorInfo<String> jsonErrorHandler(HttpServletRequest req, JsonException e) throws Exception {
		ErrorInfo<String> r = new ErrorInfo<>();
		r.setMsg(e.getMessage());
		r.setCode(ErrorInfo.ERROR);
		r.setData("Some Data");
		r.setUrl(req.getRequestURL().toString());
		return r;
	}
}
