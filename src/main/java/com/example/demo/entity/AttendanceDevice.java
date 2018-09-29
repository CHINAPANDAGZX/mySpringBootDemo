/**
* Description: SEGS SEGS
*
* Copyright: Copyright (c) 2018
*
* Company: 厦门路桥信息股份有限公司
*
* @author :Administrator
* @version 1.0
*/

package com.example.demo.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * 考勤设备表 
 * 创建日期 2018-4-1 15:38:04
 */
@Entity
@Table(name="DV_attendance_device")
@Inheritance(strategy = InheritanceType.JOINED)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AttendanceDevice implements Serializable{

    private static final long serialVersionUID = 167806838301729L;

    public AttendanceDevice(){
    }
    public AttendanceDevice(String id){
      this.id = id;
    }

    /**
     * id
     */
    private String id;

    /**
     * 考勤机编号
     */
    private String attenNo;

    /**
     * 考勤机名称
     */
    private String attenName;

    /**
     * IP地址
     */
    private String ipAddr;

    /**
     * 安装时间
     */
    private java.util.Date installTime;

    /**
     * 安装地址
     */
    private String installAddr;

    /**
     * 设备状态(0:离线,1:在线)
     */
    private String status;

    /**
     * 人员容量
     */
    private String personnelCapacity;

    /**
     * 存储状态
     */
    private String storageState;

    /**
     * 是否默认采集设备
     */
    private Boolean isDefault;

    /**
     * 考勤类型(1:进入工地,2:离开工地)
     */
    private Short swipeStatus;

    /**
     * 是否删除
     */
    private Boolean isDelete = false;


    @Id
    @GenericGenerator(name="idGenerator", strategy="uuid")
    @GeneratedValue(generator="idGenerator")
    /**
     *@return:java.lang.String id
     */
    public String getId(){
      return this.id;
    }
    /**
     *@param:java.lang.String id
     */
    public void setId(String id){
      this.id=id;
    }

    /**
     *@return:java.lang.String 考勤机编号
     */
    public String getAttenNo(){
      return this.attenNo;
    }
    /**
     *@param:java.lang.String 考勤机编号
     */
    public void setAttenNo(String attenNo){
      this.attenNo=attenNo;
    }

    /**
     *@return:java.lang.String 考勤机名称
     */
    public String getAttenName(){
      return this.attenName;
    }
    /**
     *@param:java.lang.String 考勤机名称
     */
    public void setAttenName(String attenName){
      this.attenName=attenName;
    }

    /**
     *@return:java.lang.String IP地址
     */
    public String getIpAddr(){
      return this.ipAddr;
    }
    /**
     *@param:java.lang.String IP地址
     */
    public void setIpAddr(String ipAddr){
      this.ipAddr=ipAddr;
    }

    /**
     *@return:java.util.Date 安装时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date getInstallTime(){
      return this.installTime;
    }
    /**
     *@param:java.util.Date 安装时间
     */
    public void setInstallTime(java.util.Date installTime){
      this.installTime=installTime;
    }

    /**
     *@return:java.lang.String 安装地址
     */
    public String getInstallAddr(){
      return this.installAddr;
    }
    /**
     *@param:java.lang.String 安装地址
     */
    public void setInstallAddr(String installAddr){
      this.installAddr=installAddr;
    }

    /**
     *@return:java.lang.String 设备状态
     */
    public String getStatus(){
      return this.status;
    }
    /**
     *@param:java.lang.String 设备状态
     */
    public void setStatus(String status){
      this.status=status;
    }

    /**
     *@return:java.lang.String 人员容量
     */
    public String getPersonnelCapacity(){
      return this.personnelCapacity;
    }
    /**
     *@param:java.lang.String 人员容量
     */
    public void setPersonnelCapacity(String personnelCapacity){
      this.personnelCapacity=personnelCapacity;
    }

    /**
     *@return:java.lang.String 存储状态
     */
    public String getStorageState(){
      return this.storageState;
    }
    /**
     *@param:java.lang.String 存储状态
     */
    public void setStorageState(String storageState){
      this.storageState=storageState;
    }

    /**
     *@return:java.lang.Boolean 是否默认采集设备
     */
    public Boolean getIsDefault(){
      return this.isDefault;
    }
    /**
     *@param:java.lang.Boolean 是否默认采集设备
     */
    public void setIsDefault(Boolean isDefault){
      this.isDefault=isDefault;
    }

    public Short getSwipeStatus() {
		return swipeStatus;
	}
	public void setSwipeStatus(Short swipeStatus) {
		this.swipeStatus = swipeStatus;
	}
	/**
     *@param:java.lang.Boolean 是否删除
     */
	public Boolean getIsDelete() {
		return isDelete;
	}
	public void setIsDelete(Boolean isDelete) {
		this.isDelete = isDelete;
	}
    
    public AttendanceDevice poToVo() {
    	AttendanceDevice vo = new AttendanceDevice();
       vo.setId(this.id);
       vo.setAttenNo(this.attenNo);
       vo.setAttenName(this.attenName);
       vo.setIpAddr(this.ipAddr);
       vo.setInstallTime(this.installTime);
       vo.setInstallAddr(this.installAddr);
       vo.setStatus(this.status);
       vo.setPersonnelCapacity(this.personnelCapacity);
       vo.setStorageState(this.storageState);
       vo.setIsDefault(this.isDefault);
       vo.setSwipeStatus(this.swipeStatus);
       vo.setIsDelete(this.isDelete);
       return vo;
    }
    
    public static List<AttendanceDevice> poToVos(List<AttendanceDevice> list){
    	if(list==null) {return null;}
    	List<AttendanceDevice> vos = new ArrayList<AttendanceDevice>();
    	for(AttendanceDevice att : list) {
    		vos.add(att.poToVo());
    	}
    	return vos;
    }

}
