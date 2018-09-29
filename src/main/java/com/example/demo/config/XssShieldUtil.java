package com.example.demo.config;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**     
 * @Title: XssShieldUtil.java   
 * @Package com.lottery.config   
 * @Description: TODO(过滤特殊符号)   
 * @author 李世康     
 * @date 2017年10月24日 下午5:13:52   
 * @version V1.0     
 */
public class XssShieldUtil {
	private static List<Pattern> patterns = null;

    private static List<Object[]> getXssPatternList() {
        List<Object[]> ret = new ArrayList<Object[]>();
        ret.add(new Object[]{"<(no)?script[^>]*>.*?</(no)?script>", Pattern.CASE_INSENSITIVE});
        ret.add(new Object[]{"eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL});
        ret.add(new Object[]{"expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL});
        ret.add(new Object[]{"(javascript:|vbscript:|view-source:)*", Pattern.CASE_INSENSITIVE});
//        ret.add(new Object[]{"<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL});
        ret.add(new Object[]{"(window\\.location|window\\.|\\.location|document\\.cookie|document\\.|alert\\(.*?\\)|window\\.open\\()*", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL});
        ret.add(new Object[]{"<+\\s*\\w*\\s*(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)+\\s*=+", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL});
        return ret;
    }

    private static List<Pattern> getPatterns() {
        if (patterns == null) {
            List<Pattern> list = new ArrayList<Pattern>();
            String regex = null;
            Integer flag = null;
            int arrLength = 0;
            for(Object[] arr : getXssPatternList()) {
                arrLength = arr.length;
                for(int i = 0; i < arrLength; i++) {
                    regex = (String)arr[0];
                    flag = (Integer)arr[1];
                    list.add(Pattern.compile(regex, flag));
                }
            }
            patterns = list;
        }
        return patterns;
    }

    public static String stripXss(String value) {
        if(StringUtils.isNotBlank(value)) {
            Matcher matcher = null;
            for(Pattern pattern : getPatterns()) {
                matcher = pattern.matcher(value);
                // 匹配
                if(matcher.find()) {
                    // 删除相关字符串
                    value = matcher.replaceAll("");
                }
            }
//            value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        }
        return value;
    }
    
//    public static void main(String[] args) {
//    	String ss = "<script>alert('cc');</script><h1><u>Heading Of Message</u></h1>"
//    			+ "<h4>Subheading</h4>"
//    			+ "<p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain"
//    			+ "was born and I will give you a complete account of the system, and expound the actual teachings"
//    			+ "of the great explorer of the truth, the master-builder of human happiness. No one rejects,"
//    			+ "dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know"
//    			+ "how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again"
//    			+ "is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain,"
//    			+ "but because occasionally circumstances occur in which toil and pain can procure him some great"
//    			+ "pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise,"
//    			+ "except to obtain some advantage from it? But who has any right to find fault with a man who"
//    			+ "chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that"
//    			+ "produces no resultant pleasure? On the other hand, we denounce with righteous indignation and"
//    			+ "dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so"
//    			+ "blinded by desire, that they cannot foresee</p>"
//    			+ "<ul>"
//    			+ "<li>List item one</li>"
//    			+ "<li>List item two</li>"
//    			+ "<li>List item three</li>"
//    			+ "<li>List item four</li>"
//    			+ "</ul>"
//    			+ "<p>Thank you,</p>"
//    			+ "<p>John Doe</p>";
//    	System.out.println(XssShieldUtil.stripXss(ss));
//        String value = null;
//        value = XssShieldUtil.stripXss("<script language=text/javascript>alert(document.cookie);</script>");
//        System.out.println("type-1: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<script src='' onerror='alert(document.cookie)'></script>");
//        System.out.println("type-2: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("</script>");
//        System.out.println("type-3: '" + value + "'");
//
//        value = XssShieldUtil.stripXss(" eval(abc);");
//        System.out.println("type-4: '" + value + "'");
//
//        value = XssShieldUtil.stripXss(" expression(abc);");
//        System.out.println("type-5: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<img src='' onerror='alert(document.cookie);'></img>");
//        System.out.println("type-6: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<img src='' onerror='alert(document.cookie);'/>");
//        System.out.println("type-7: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<img src='' onerror='alert(document.cookie);'>");
//        System.out.println("type-8: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<script language=text/javascript>alert(document.cookie);");
//        System.out.println("type-9: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<script>window.location='url'");
//        System.out.println("type-10: '" + value + "'");
//
//        value = XssShieldUtil.stripXss(" onload='alert(\"abc\");");
//        System.out.println("type-11: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<img src=x<!--'<\"-->>");
//        System.out.println("type-12: '" + value + "'");
//
//        value = XssShieldUtil.stripXss("<=img onstop=");
//        System.out.println("type-13: '" + value + "'");
//    }
}
