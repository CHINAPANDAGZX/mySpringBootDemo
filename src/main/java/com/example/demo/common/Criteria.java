package com.example.demo.common;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**     
 * @Title: Criteria.java   
 * @Package com.lottery.respository.common   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月27日 上午8:37:43   
 * @version V1.0     
 */
public class Criteria<T> implements Specification<T> {
	private List<Criterion> criterions = new ArrayList<>();

	@Override
	public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		if (!criterions.isEmpty()) {
            List<Predicate> predicates = new ArrayList<>();
            for (Criterion c : criterions) {
                predicates.add(c.toPredicate(root, query, builder));
            }
            // 将所有条件用 and 联合起来
            if (predicates.size() > 0) {
                return builder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        }
        return builder.conjunction();
	}
	/**
	 * 增加简单条件表达式
	 * @param criterion
	 */
    public void add(Criterion criterion) {
        if (criterion != null) {
            criterions.add(criterion);
        }
    }
}
