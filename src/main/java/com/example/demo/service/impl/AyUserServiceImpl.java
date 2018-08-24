package com.example.demo.service.impl;


import com.example.demo.dao.AyUserDao;
import com.example.demo.entity.AyUser;
import com.example.demo.repository.AyUserRepository;
import com.example.demo.service.AyUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.List;

/**
 * 描述：用户服务层实现类
 * 作者：gzx
 * 时间：2018年8月24日14:47:51
 */
//@Transactional
@Service
public class AyUserServiceImpl implements AyUserService {

    @Resource(name = "ayUserRepository")
    private AyUserRepository ayUserRepository;

    @Resource
    private AyUserDao ayUserDao;


//    @Override
//    public AyUser findById(String id){
//        return this.ayUserRepository.findOne(id);
//    }

    @Override
    public AyUser findById(String id) {
        return this.ayUserRepository.findOne(id);
    }

    @Override
    public List<AyUser> findAll() {
        return ayUserRepository.findAll();
    }

    //@Transactional
    @Override
    public AyUser save(AyUser ayUser) {
        return ayUserRepository.save(ayUser);
    }

    @Override
    public void delete(String id) {
        ayUserRepository.delete(id);
    }

    @Override
    public Page<AyUser> findAll(Pageable pageable) {
        return ayUserRepository.findAll(pageable);
    }

    @Override
    public List<AyUser> findByName(String name) {
        return this.ayUserRepository.findByName(name);
    }

    @Override
    public List<AyUser> findByNameLike(String name) {
        return this.ayUserRepository.findByNameLike(name);
    }

    @Override
    public List<AyUser> findByIdIn(Collection<String> ids) {
        return this.ayUserRepository.findByIdIn(ids);
    }

    @Override
    public AyUser findByNameAndPassword(String name, String password) {
        return this.ayUserDao.findByNameAndPassword(name,password);
    }


}
