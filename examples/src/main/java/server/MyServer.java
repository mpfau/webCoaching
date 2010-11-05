package server;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher;

public class MyServer {
	private Server server;

	public static void main(String[] args) throws Exception {
		MyServer server = new MyServer();
		server.start();
	}
	
	public void start() throws Exception {
		server = new Server(8080);

		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] {createServletHandler(), createResourceHandler()});
		server.setHandler(handlers);

		server.start();
	}

	private Handler createResourceHandler() {
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirectoriesListed(true);
        resourceHandler.setWelcomeFiles(new String[]{ "index.html" });
        resourceHandler.setResourceBase("WebContent");
        return resourceHandler;
	}

	private Handler createServletHandler() {
		ServletContextHandler servletHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
		servletHandler.setContextPath("/service");
		
		// context.addServlet(new ServletHolder(new HelloServlet()),"/*");
		servletHandler.addServlet(new ServletHolder(new HttpServletDispatcher()), "/*");
		Map<String, String> params = new HashMap<String, String>();
		params.put("resteasy.resources", "service.TaskService");
		servletHandler.setInitParams(params);
		servletHandler.setResourceBase("WebContent");
		servletHandler.addEventListener(new org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap());
		return servletHandler;
	}
	
	public void stop() throws Exception {
		server.stop();
	}
	
	public void join() throws InterruptedException {
		server.join();
	}

}