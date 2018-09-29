/**
* Description: 考勤设备表管理
* Copyright: Copyright (c) 2018
* Company: 厦门路桥信息股份有限公司
* @author :Administrator
* 创建日期 2018-3-9 16:54:20
* @version V1.0
*/

package com.example.demo.repository;

import com.example.demo.entity.AttendanceDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * 考勤设备表
 */
@Repository
public interface AttendanceDeviceRespository extends JpaRepository<AttendanceDevice,String>, JpaSpecificationExecutor<AttendanceDevice> {
	
}
