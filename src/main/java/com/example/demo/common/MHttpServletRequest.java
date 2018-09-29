package com.example.demo.common;


import com.example.demo.config.XssShieldUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

/**     
 * @Title: MHttpServletRequest.java   
 * @Package com.lottery.config   
 * @Description: TODO(参数特殊字符过滤)   
 * @author 李世康     
 * @date 2017年10月24日 下午5:13:11   
 * @version V1.0     
 */
public class MHttpServletRequest extends HttpServletRequestWrapper{

	public MHttpServletRequest(HttpServletRequest request) {
		super(request);
		// TODO Auto-generated constructor stub
	}
	@Override
    public String getParameter(String name) {
        // 返回值之前 先进行过滤
        return XssShieldUtil.stripXss(super.getParameter(XssShieldUtil.stripXss(name)));
    }

    @Override
    public String[] getParameterValues(String name) {
        // 返回值之前 先进行过滤
        String[] values = super.getParameterValues(XssShieldUtil.stripXss(name));
        if(values != null){
            for (int i = 0; i < values.length; i++) {
                values[i] = XssShieldUtil.stripXss(values[i]);
            }
        }
        return values;
    }
}
