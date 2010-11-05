package service;

import javax.servlet.http.HttpServletRequest;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;

public class WebSocketEventBusServlet extends WebSocketServlet {
	private static final long serialVersionUID = -3513621341837663186L;

	private WebSocketEventBus bus = WebSocketEventBus.getInstance();


	protected WebSocket doWebSocketConnect(HttpServletRequest request,
			String protocol) {
		return bus.createWebSocket();
	}

}
