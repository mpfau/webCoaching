package service;

public class Task {
	private Integer id;
	private String Title;
	private String Date;
	private TaskState State;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTitle() {
		return Title;
	}
	public void setTitle(String title) {
		Title = title;
	}
	public String getDate() {
		return Date;
	}
	public void setDate(String date) {
		Date = date;
	}
	public TaskState getState() {
		return State;
	}
	public void setState(TaskState state) {
		State = state;
	}
	public void updateFrom(Task task) {
		this.Title = task.getTitle();
		this.Date = task.getDate();
		this.State = task.getState();
	}

}
