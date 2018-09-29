/**
* Description: 3.设备管理 DV
* Copyright: Copyright (c) 2018
* Company: 厦门路桥信息股份有限公司
*
* @author :Administrator
* @version 1.0
*/

package com.example.demo.service.impl;


import com.example.demo.common.Criteria;
import com.example.demo.common.Restrictions;
import com.example.demo.entity.AttendanceDevice;
import com.example.demo.repository.AttendanceDeviceRespository;
import com.example.demo.service.AttendanceDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * 考勤设备表管理服务实现类
 */
@Service
@Transactional
public class AttendanceDeviceServiceImpl implements AttendanceDeviceService {
    @Autowired
    private AttendanceDeviceRespository attendanceDeviceRespository;

	/**
	 * 查询所有考勤设备表
	 * @return List
	 */
	@Override
    public List<AttendanceDevice> queryAllAttendanceDevice(){
        return this.attendanceDeviceRespository.findAll();
    }

	/**
	 * 保存考勤设备表
	 * @param attendanceDevice
	 * @return AttendanceDevice
	 */
	@Override
    public AttendanceDevice saveAttendanceDevice(AttendanceDevice attendanceDevice){
	    return this.attendanceDeviceRespository.saveAndFlush(attendanceDevice);
	}

	/**
	 * 根据ID获取考勤设备表
	 * @param id
	 * @return AttendanceDevice
	 */
	@Override
    public AttendanceDevice findAttendanceDeviceById(String id){
	    return this.attendanceDeviceRespository.findOne(id);
	}

	/**
	 * 根据ids删除考勤设备表（假删）
	 * @param  ids
	 */
	@Override
    public void  deleteAttendanceDeviceByIds(String ids){
		String[] idsArr = ids.split(",");
	    for(int i = 0; i < idsArr.length; i++) {
	    	AttendanceDevice attendanceDevice=new AttendanceDevice();
	    	attendanceDevice=this.attendanceDeviceRespository .findOne(idsArr[i]);
	    	attendanceDevice.setIsDelete(true);
	        this.attendanceDeviceRespository.saveAndFlush(attendanceDevice);
//	        this.attendanceDeviceRespository.delete(idsArr[i]);
	    }
	}

	/**
	 * 根据条件查询考勤设备表
	 * @param criteria
	 * @param sort
	 * @return List
	 */
	@Override
    public List<AttendanceDevice> queryAttendanceDeviceByCondition(Criteria<AttendanceDevice> criteria, Sort sort){
		return this.attendanceDeviceRespository.findAll(criteria, sort);
	}
	
	/**
	 * 根据条件分页查询考勤设备表
	 * @param criteria
	 * @param sort
	 * @param pageNo
	 * @param pageSize
	 * @return Page
	 */
	@Override
    public Page<AttendanceDevice> queryAttendanceDeviceByPage(Criteria<AttendanceDevice> criteria,Sort sort, Integer pageNo, Integer pageSize){
		Pageable pageable = new PageRequest(pageNo-1, pageSize, sort);
		return this.attendanceDeviceRespository.findAll(criteria, pageable);
	}

	@Override
	public AttendanceDevice findAttendanceDeviceByNo(String attenNo) {
		Criteria<AttendanceDevice> criteria = new Criteria<AttendanceDevice>();
		criteria.add(Restrictions.eq("attenNo", attenNo, false));
		return this.attendanceDeviceRespository.findOne(criteria);
	}

	@Override
	public List<AttendanceDevice> queryByDefault(boolean isDefault) {
		Criteria<AttendanceDevice> criteria = new Criteria<AttendanceDevice>();
		criteria.add(Restrictions.eq("isDefault", isDefault, true));
		criteria.add(Restrictions.ne("isDelete", true, false));
		return this.attendanceDeviceRespository.findAll(criteria);
	}

	@Override
	public List<AttendanceDevice> queryByAttIds(String[] attIds) {
		if(attIds==null||attIds.length<=0) {return null;}
		List<String> idArr = new ArrayList<String>();
		for(String id : attIds) {
			idArr.add(id);
		}
		return this.attendanceDeviceRespository.findAll(idArr);
	}

}
