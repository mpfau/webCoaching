package server;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher;

import service.WebSocketEventBusServlet;

public class MyServer {
	private Server server;

	public static void main(String[] args) throws Exception {
		MyServer server = new MyServer();
		server.start();
	}
	
	public MyServer start() throws Exception {
		server = new Server(8080);

		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] {createServletHandler(), createEventBusServletHandler(), createResourceHandler()});
		server.setHandler(handlers);

		server.start();
		return this;
	}

	private Handler createEventBusServletHandler() {
		ServletContextHandler servletHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
		servletHandler.setContextPath("/event");
		servletHandler.addServlet(new ServletHolder(new WebSocketEventBusServlet()), "/*");
		return servletHandler;
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

		servletHandler.addServlet(new ServletHolder(new HttpServletDispatcher()), "/*");
		servletHandler.getInitParams().put("resteasy.resources", "service.TaskService");
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