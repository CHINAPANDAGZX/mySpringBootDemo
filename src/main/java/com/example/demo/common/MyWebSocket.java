package com.example.demo.common;

import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

/**     
 * @Title: MyWebSocket.java   
 * @Package com.socketTest.config   
 * @Description: TODO(用一句话描述该文件做什么)   
 * @author 李世康     
 * @date 2017年10月16日 下午4:06:00   
 * @version V1.0     
 */
@ServerEndpoint(value = "/websocket")
@Component
public class MyWebSocket {
	//静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;

    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArraySet<MyWebSocket> webSocketSet = new CopyOnWriteArraySet<MyWebSocket>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    /**
     * 连接建立成功调用的方法*/
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        this.session.setMaxIdleTimeout(0);
        webSocketSet.add(this);     //加入set中
        addOnlineCount();           //在线数加1
        System.out.println("有新连接加入！当前在线人数为" + getOnlineCount());
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  //从set中删除
        subOnlineCount();           //在线数减1
        System.out.println("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("来自客户端的消息:" + message);
    }

    /**
     * 发生错误时调用
     */
    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("发生错误");
        error.printStackTrace();
    }


    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }
    
    /**
     * 单发消息
     * @param message
     * @param userId
     * @throws IOException
     */
//    public static void sendOne(String message,Integer userId){
//    	for (MyWebSocket item : webSocketSet) {
//    		if(item.userId == userId){
//    			try {
//                    item.sendMessage(message);
//                } catch (IOException e) {
//                	e.printStackTrace();
//                }
//    			break;
//    		}
//    	}
//    }

    /**
     * 群发自定义消息
     * */
    public static void sendInfo(String message) throws IOException {
        for (MyWebSocket item : webSocketSet) {
            try {
                item.sendMessage(message);
            } catch (IOException e) {
                continue;
            }
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        MyWebSocket.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        MyWebSocket.onlineCount--;
    }
}
