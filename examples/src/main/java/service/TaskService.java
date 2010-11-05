package service;

import java.util.LinkedList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.codehaus.jackson.map.ObjectMapper;


@Path("/tasks")
public class TaskService {
	private static List<Task> tasks = new LinkedList<Task>();
	private WebSocketEventBus bus = WebSocketEventBus.getInstance();
	private ObjectMapper mapper = new ObjectMapper();

	@GET
	@Produces("application/json")
	public List<Task> getAllTasks() {
		return tasks;
	}
	
	@POST
	@Path("{id}")
	public void updateTask(@PathParam("id") String id, Task task) {
		Task t = getTaskForId(task.getId());
		t.updateFrom(task);
		try {
			bus.notifyClients(mapper.writeValueAsString(new Event("updatedTask", task.getId())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	@PUT
	public void addTask(Task task) {
		tasks.add(task);
		try {
			bus.notifyClients(mapper.writeValueAsString(new Event("addedTask", task.getId())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	private Task getTaskForId(Integer id) {
		for (Task t : tasks) {
			if (t.getId().equals(id)) {
				return t;
			}
		}
		throw new RuntimeException("Task does not exist");
	}
	
	public static void resetTasks() {
		tasks.clear();
	}

	
}
