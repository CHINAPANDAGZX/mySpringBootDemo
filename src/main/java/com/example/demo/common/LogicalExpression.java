package com.example.demo.common;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**     
 * @Title: LogicalExpression.java   
 * @Package com.lottery.respository.common   
 * @Description: TODO(逻辑条件表达式 用于复杂条件时使用，如单属性多对应值的OR查询等)   
 * @author 李世康     
 * @date 2017年10月27日 上午8:53:58   
 * @version V1.0     
 */
public class LogicalExpression implements Criterion {
	private Criterion[] criterion;    // 逻辑表达式中包含的表达式
    private Operator operator;        //计算符

    public LogicalExpression(Criterion[] criterions, Operator operator) {
        this.criterion = criterions;
        this.operator = operator;
    }
    
	@Override
	public Predicate toPredicate(Root<?> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
        for (int i = 0; i < this.criterion.length; i++) {
            predicates.add(this.criterion[i].toPredicate(root, query, builder));
        }
        switch (operator) {
            case OR:
                return builder.or(predicates.toArray(new Predicate[predicates.size()]));
            default:
                return null;
        }
	}

}
