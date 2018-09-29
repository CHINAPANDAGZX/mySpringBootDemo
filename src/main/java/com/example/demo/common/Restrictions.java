package com.example.demo.common;

import com.example.demo.common.Criterion.Operator;
import org.springframework.util.StringUtils;

import java.util.Collection;

/**     
 * @Title: Restrictions.java   
 * @Package com.lottery.respository.common   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月27日 下午9:06:18   
 * @version V1.0     
 */
public class Restrictions {
	/**
     * 等于
     */
    public static SimpleExpression eq(String fieldName, Object value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.EQ);
    }

    /**
     * 不等于
     */
    public static SimpleExpression ne(String fieldName, Object value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.NE);
    }

    /**
     * 模糊匹配
     */
    public static SimpleExpression like(String fieldName, String value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.LIKE);
    }

    /**
     */
//    public static SimpleExpression like(String fieldName, String value,
//                                        MatchMode matchMode, boolean ignoreNull) {
//        if (StringUtils.isEmpty(value)) return null;
//        return null;
//    }

    /**
     * 大于
     */
    public static SimpleExpression gt(String fieldName, Object value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.GT);
    }

    /**
     * 小于
     */
    public static SimpleExpression lt(String fieldName, Object value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.LT);
    }

    /**
     * 小于等于
     */
    public static SimpleExpression lte(String fieldName, Object value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.LTE);
    }

    /**
     * 大于等于
     */
    public static SimpleExpression gte(String fieldName, Object value, boolean ignoreNull) {
        if (ignoreNull && StringUtils.isEmpty(value)) return null;
        return new SimpleExpression(fieldName, value, Operator.GTE);
    }
    
    /**
     * 是NULL
     */
    public static SimpleExpression isnull(String filedName){
    	return new SimpleExpression(filedName, null, Operator.ISNULL);
    }
    
    /**
     * 不是NULL
     */
    public static SimpleExpression isnotnull(String filedName){
    	return new SimpleExpression(filedName, null, Operator.ISNOTNULL);
    }

    /**
     * 并且
     */
    public static LogicalExpression and(Criterion... criterions) {
        return new LogicalExpression(criterions, Operator.AND);
    }

    /**
     * 或者
     */
    public static LogicalExpression or(Criterion... criterions) {
        return new LogicalExpression(criterions, Operator.OR);
    }

    /**
     * 包含于
     */
    @SuppressWarnings("rawtypes")
    public static LogicalExpression in(String fieldName, Collection value, boolean ignoreNull) {
        if (ignoreNull && (value == null || value.isEmpty())) {
            return null;
        }
        SimpleExpression[] ses = new SimpleExpression[value.size()];
        int i = 0;
        for (Object obj : value) {
            ses[i] = new SimpleExpression(fieldName, obj, Operator.EQ);
            i++;
        }
        return new LogicalExpression(ses, Operator.OR);
    }
    
    
}
