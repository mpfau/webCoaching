package service;

import java.util.LinkedList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.jboss.resteasy.annotations.providers.jaxb.Wrapped;

@Path("/tasks")
public class TaskService {
	private List<String> products = new LinkedList<String>();
	
	@GET
	@Produces("application/json")
	public List<String> getAllProducts() {
		return products;
	}
}
