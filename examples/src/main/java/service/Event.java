package service;

public class Event {
	private String type;
	private Integer taskid;
	
	public Event() {
	}
	
	public Event(String type, Integer taskid) {
		this.type = type;
		this.taskid = taskid;
	}

	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Integer getTaskid() {
		return taskid;
	}
	public void setTaskid(Integer taskid) {
		this.taskid = taskid;
	}

}
