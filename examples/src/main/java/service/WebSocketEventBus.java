package service;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.util.log.Log;
import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;


public class WebSocketEventBus extends WebSocketServlet {
	private static final long serialVersionUID = -3513621341837663186L;
	
	private final Set<EventWebSocket> _members = new CopyOnWriteArraySet<EventWebSocket>();
    
    
    protected WebSocket doWebSocketConnect(HttpServletRequest request, String protocol)
    {
        return new EventWebSocket();
    }
    
    class EventWebSocket implements WebSocket
    {
        Outbound _outbound;

        public void onConnect(Outbound outbound)
        {
            _outbound=outbound;
            _members.add(this);
        }
        
        public void onMessage(byte frame, byte[] data,int offset, int length)
        {}

        public void onMessage(byte frame, String data)
        {
            for (EventWebSocket member : _members)
            {
                try
                {
                    member._outbound.sendMessage(frame,data);
                }
                catch(IOException e) {Log.warn(e);}
            }
        }

        public void onDisconnect()
        {
            _members.remove(this);
        }

		@Override
		public void onFragment(boolean more, byte opcode, byte[] data,
				int offset, int length) {
		}
    }
}
