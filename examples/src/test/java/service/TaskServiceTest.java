package service;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.FileRequestEntity;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import server.MyServer;

public class TaskServiceTest {
	private MyServer server;
	private HttpClient client;
	private String url = "http://localhost:8080/service/tasks/";

	@Before
	public void startServer() throws Exception {
		server = new MyServer();
		server.start();
		client = new HttpClient();
		TaskService.resetTasks();
	}

	@After
	public void stopServer() throws Exception {
		server.stop();
	}

	@Test
	public void getEmptyTaskList() throws IOException {
		GetMethod get = new GetMethod(url);
		assertEquals(HttpStatus.SC_OK, client.executeMethod(get));
		assertEquals("[]", get.getResponseBodyAsString());
		get.releaseConnection();
	}
	
	@Test
	public void createTask() throws IOException {
		PutMethod put= new PutMethod(url);
		put.setRequestEntity(new FileRequestEntity(new File(getClass().getResource("task_01.json").getFile()), "application/json"));
		assertEquals(HttpStatus.SC_NO_CONTENT, client.executeMethod(put));
		put.releaseConnection();
		
		GetMethod get = new GetMethod(url);
		assertEquals(HttpStatus.SC_OK, client.executeMethod(get));
		assertEquals("[{\"id\":1,\"state\":\"Current\",\"date\":\"1293490800000\",\"title\":\"Den REST-Service testen\"}]", get.getResponseBodyAsString());
		
	}
	
	@Test
	public void updateTask() throws IOException {
		PutMethod put= new PutMethod(url);
		put.setRequestEntity(new FileRequestEntity(new File(getClass().getResource("task_01.json").getFile()), "application/json"));
		assertEquals(HttpStatus.SC_NO_CONTENT, client.executeMethod(put));
		put.releaseConnection();
		
		PostMethod post= new PostMethod(url + "1");
		post.setRequestEntity(new FileRequestEntity(new File(getClass().getResource("task_02.json").getFile()), "application/json"));
		assertEquals(HttpStatus.SC_NO_CONTENT, client.executeMethod(post));
		post.releaseConnection();
		
		GetMethod get = new GetMethod(url);
		assertEquals(HttpStatus.SC_OK, client.executeMethod(get));
		assertEquals("[{\"id\":1,\"state\":\"Finished\",\"date\":\"1293490800000\",\"title\":\"Den REST-Service erneut testen\"}]", get.getResponseBodyAsString());
		get.releaseConnection();
		
	}

	public static void main(String args[]) {
		org.junit.runner.JUnitCore.main(TaskServiceTest.class.getName());
	}
}
