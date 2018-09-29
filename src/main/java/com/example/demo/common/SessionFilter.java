package com.example.demo.common;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.xmrbi.segs.entity.security.SystemUser;
//import com.xmrbi.segs.jwt.Audience;
//import com.xmrbi.segs.jwt.JwtHelper;
//import com.xmrbi.segs.service.security.SystemUserService;
//import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;
import org.thymeleaf.util.StringUtils;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title: SessionFilter.java   
 * @Package com.sailboat.config   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月11日 上午8:57:02   
 * @version V1.0     
 */
@WebFilter(urlPatterns="/*",asyncSupported=true)
public class SessionFilter implements Filter{
	
//	@Autowired
//    private Audience audienceEntity;
//	@Autowired
//	private SystemUserService systemUserService;
	/**
     * 封装，不需要过滤的list列表
     */
    protected static List<String> patterns = new ArrayList<String>();
    
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        //非法字符过滤器
        httpRequest = new MHttpServletRequest(httpRequest);
        String url = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());
        if (isInclude(url)){
            chain.doFilter(httpRequest, httpResponse);
            return;
        }
//        else {
//        	//如果是移动端请求，则验证token
//    		String auth = httpRequest.getHeader("Authorization");
//    		if(!StringUtils.isEmpty(auth)) {
//        		if (JwtHelper.parseJWT(auth, audienceEntity.getBase64Secret()) != null) {
//        			Claims claim = JwtHelper.parseJWT(auth, this.audienceEntity.getBase64Secret());
//        			String userId = (String)claim.get("userId");
//        			SystemUser u = this.systemUserService.findUserById(userId);
//        			if(u!=null&&u.getIsValid()){
//	                    chain.doFilter(httpRequest, httpResponse);
//	                    return;
//        			}else{
//        				httpResponse.setCharacterEncoding("UTF-8");
//    	                httpResponse.setContentType("application/json; charset=utf-8");
//    	                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//    	                ObjectMapper mapper = new ObjectMapper();
//    	                Map<String, Object> resultMap = new LinkedHashMap<String,Object>();
//    	                resultMap.put("code", -2);
//    	                resultMap.put("msg", u==null?"用户不存在":"用户已失效");
//    	                resultMap.put("data", null);
//    	                httpResponse.getWriter().write(mapper.writeValueAsString(resultMap));
//        			}
//        		}else{
//	                httpResponse.setCharacterEncoding("UTF-8");
//	                httpResponse.setContentType("application/json; charset=utf-8");
//	                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//	                ObjectMapper mapper = new ObjectMapper();
//	                Map<String, Object> resultMap = new LinkedHashMap<String,Object>();
//	                resultMap.put("code", -1);
//	                resultMap.put("msg", "Token 无效");
//	                resultMap.put("data", null);
//	                httpResponse.getWriter().write(mapper.writeValueAsString(resultMap));
//                }
//    		}else {
//	        	//否则web端验证session
//	            HttpSession session = httpRequest.getSession();
//	            if (session.getAttribute("SYS_USER") != null){
//	        		chain.doFilter(httpRequest, httpResponse);
//	                return;
//	            } else {
//	            	if(url.indexOf("/main")>-1) {
//	            		//跳转至登录页面
//	            		httpResponse.sendRedirect(httpRequest.getContextPath()+"/login.html");
//	            	}else {
//	            		// session不存在 准备跳转失败
//	            		throw new ServletException("会话不存在或已经过期");
//	            	}
//	            }
//    		}
//        }
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		System.out.println("======过滤器初始化======");
		patterns.add("/");
		patterns.add("/login.html");
		patterns.add("/login");
		patterns.add("/static/*");
		patterns.add("/login/validate");
		patterns.add("/login/validate.html");
		patterns.add("/login/loginout");
		patterns.add("/login/loginout.html");
		patterns.add("/custom/*");
		patterns.add("/essi/*");
		patterns.add("/annex/get-file-stream");
		patterns.add("/mobile/login/*");
		SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, filterConfig.getServletContext());  
	}

	
	/**
     * 是否需要过滤
     * @param url
     * @return
     */
    private boolean isInclude(String url) {
    	if (patterns == null || patterns.size() <= 0) {  
            return false;  
        }  
        for (String ex : patterns) {  
        	url = url.trim();  
            ex = ex.trim();  
            if (url.toLowerCase().matches(ex.toLowerCase().replace("*",".*")))  
                return true;  
        }  
        return false;
    }
}
