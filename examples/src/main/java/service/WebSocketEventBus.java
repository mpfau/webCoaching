package service;

import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.eclipse.jetty.websocket.WebSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSocketEventBus {
	private static final Logger log = LoggerFactory.getLogger(WebSocketEventBus.class);

	private final Collection<EventWebSocket> clients = new LinkedList<EventWebSocket>();
	private final ReadWriteLock clientLock = new ReentrantReadWriteLock();
	private static final WebSocketEventBus INSTANCE = new WebSocketEventBus();
	
	private WebSocketEventBus() {
	}
	
	public static WebSocketEventBus getInstance() {
		return INSTANCE;
	}

	class EventWebSocket implements WebSocket {
		Outbound outbound;

		public void onConnect(Outbound outbound) {
			this.outbound = outbound;
			clientLock.writeLock().lock();
			try {
				clients.add(this);
			} finally {
				clientLock.writeLock().unlock();
			}
		}

		public void onMessage(byte frame, byte[] data, int offset, int length) {
		}

		public void onMessage(byte frame, String data) {
			log.info("received a text message: {}", data);
		}

		public void onDisconnect() {
			clientLock.writeLock().lock();
			try {
				clients.remove(this);
			} finally {
				clientLock.writeLock().unlock();
			}
		}

		@Override
		public void onFragment(boolean more, byte opcode, byte[] data,
				int offset, int length) {
		}
		
		public void sendMessage(String msg) {
			try {
				outbound.sendMessage(msg);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}
	}

	public WebSocket createWebSocket() {
		return new EventWebSocket();
	}

	public void notifyClients(String msg) {
		for (EventWebSocket client : clients) {
			client.sendMessage(msg);
		}
	}
	
}
