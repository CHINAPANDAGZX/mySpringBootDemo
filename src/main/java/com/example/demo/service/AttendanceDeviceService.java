/**
* Description: 3.设备管理 DV
* Copyright: Copyright (c) 2018
* Company: 厦门路桥信息股份有限公司
*
* @author :Administrator
* @version 1.0
*/

package com.example.demo.service;


import com.example.demo.common.Criteria;
import com.example.demo.entity.AttendanceDevice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * 考勤设备表管理服务接口类
 */
public interface AttendanceDeviceService {
	/**
	 * 查询所有考勤设备表
	 * @return List
	 */
    public List<AttendanceDevice> queryAllAttendanceDevice();

	/**
	 * 保存考勤设备表
	 * @param attendanceDevice
	 * @return AttendanceDevice
	 */
    public AttendanceDevice saveAttendanceDevice(AttendanceDevice attendanceDevice);

	/**
	 * 根据ID获取考勤设备表
	 * @param id
	 * @return AttendanceDevice
	 */
    public AttendanceDevice findAttendanceDeviceById(String id);

	/**
	 * 根据ids删除考勤设备表
	 * @param  ids
	 */
    public void deleteAttendanceDeviceByIds(String ids);

	/**
	 * 根据条件查询考勤设备表
	 * @param criteria
	 * @param sort
	 * @return List
	 */
    public List<AttendanceDevice> queryAttendanceDeviceByCondition(Criteria<AttendanceDevice> criteria, Sort sort);

	/**
	 * 根据条件分页查询考勤设备表
	 * @param criteria
	 * @param sort
	 * @param pageNo
	 * @param pageSize
	 * @return Page
	 */
    public Page<AttendanceDevice> queryAttendanceDeviceByPage(Criteria<AttendanceDevice> criteria, Sort sort, Integer pageNo, Integer pageSize);

    /**
     * 根据设备编号获取考勤设备信息
     * @param attenNo
     * @return
     */
    public AttendanceDevice findAttendanceDeviceByNo(String attenNo);
    
    /**
     * 查询是否默认的设备列表
     * @param isDefault
     * @return
     */
    public List<AttendanceDevice> queryByDefault(boolean isDefault);
    
    /**
     * 根据IDS获取考勤设备信息
     * @param attIds
     * @return
     */
    public List<AttendanceDevice> queryByAttIds(String[] attIds);
}
