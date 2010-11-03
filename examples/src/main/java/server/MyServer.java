package server;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher;

public class MyServer {
	private Server server;

	public static void main(String[] args) throws Exception {
		MyServer pfsServer = new MyServer();
		pfsServer.start();
	}
	
	public void start() throws Exception {
		server = new Server(8080);

		ServletContextHandler context = new ServletContextHandler(
				ServletContextHandler.SESSIONS);
		context.setContextPath("/");
		server.setHandler(context);
		
		// context.addServlet(new ServletHolder(new HelloServlet()),"/*");
		context.addServlet(new ServletHolder(new HttpServletDispatcher()), "/*");
		Map<String, String> params = new HashMap<String, String>();
//		params.put("resteasy.scan", "true");
		params.put("resteasy.resources", "service.TaskService");
		context.setInitParams(params);
		context.setResourceBase("src/main/resources");
		context.addEventListener(new org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap());

		server.start();
	}
	
	public void stop() throws Exception {
		server.stop();
	}
	
	public void join() throws InterruptedException {
		server.join();
	}

}