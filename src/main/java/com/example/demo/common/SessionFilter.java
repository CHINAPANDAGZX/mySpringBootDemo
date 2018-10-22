package com.example.demo.common;

import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @Title: SessionFilter.java   
 * @Package com.sailboat.config   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月11日 上午8:57:02   
 * @version V1.0     
 */
//@WebFilter(urlPatterns="/*",asyncSupported=true)
public class SessionFilter implements Filter {
	
//	@Autowired
//    private Audience audienceEntity;
//	@Autowired
//	private SystemUserService systemUserService;
	//标示符：表示当前用户未登录(可根据自己项目需要改为json样式)
	String NO_LOGIN = "您还未登录";
	//不需要登录就可以访问的路径(比如:注册登录等)
	String[] includeUrls = new String[]{"/login","register"};
	/**
     * 封装，不需要过滤的list列表
     */
    protected static List<String> patterns = new ArrayList<String>();
    
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		HttpSession session = request.getSession(false);
		String uri = request.getRequestURI();

		System.out.println("过滤URI:"+uri);
		//是否需要过滤
		boolean needFilter = isNeedFilter(uri);

		if(!needFilter){
			filterChain.doFilter(servletRequest,servletResponse);//不需要过滤，直接传递给下一个过滤器
		}else{
			if(session!=null&&session.getAttribute("user") != null){
				// System.out.println("user:"+session.getAttribute("user"));
				filterChain.doFilter(request, response);
			}else{
				String requestType = request.getHeader("X-Requested-With");
				//判断是否是ajax请求
				if(requestType!=null && "XMLHttpRequest".equals(requestType)){
					response.getWriter().write(this.NO_LOGIN);
				}else{
					//跳转到登录页
					response.sendRedirect(request.getContextPath()+"/login.html");
				}
			}

		}

	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		System.out.println("======过滤器初始化======");
		patterns.add("/");
		patterns.add("/login.html");
		patterns.add("/login");//登录页面的地址
		patterns.add("/layui/*");//样式的地址
		patterns.add("/static/*");
		patterns.add("/login/validate");
		patterns.add("/login/validate.html");
		patterns.add("/login/loginout");
		patterns.add("/login/loginout.html");
		patterns.add("/custom/*");
		patterns.add("/essi/*");
		patterns.add("/annex/get-file-stream");
		patterns.add("/mobile/login/*");
//		SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, filterConfig.getServletContext());
	}

	
	/**
     * 是否需要过滤
     * @param url
     * @return
     */
    private boolean isNeedFilter(String url) {
    	if (patterns == null || patterns.size() <= 0) {
            return true;
        }
        for (String ex : patterns) {
        	url = url.trim();
            ex = ex.trim();
            if (url.toLowerCase().matches(ex.toLowerCase().replace("*",".*")))
                return false;
        }
        return true;
    }
}
