var TaskState = {"Finished": "Finished", "Current": "Current"};

function TaskDao() {
	var taskList = [];
	
    return {
    	getTasks: function() {
    		return taskList;
    	},
    	addTask: function(task) {
	    	$.ajax({ type: 'PUT', url: "/service/tasks", dataType: 'json', contentType: 'application/json',
	    		processData: false, data: JSON.stringify(task), success: function() {
	    		taskDao.loadTasks();
			}});
    	},
    	updateTask: function(task) {
	    	$.ajax({ type: 'POST', url: "/service/tasks/" + task.id, dataType: 'json', contentType: 'application/json',
	    		processData: false, data: JSON.stringify(task), success: function() {
	    		taskDao.loadTasks();
			}});
    	},
    	loadTasks: function() {
			$.ajax({ type: 'GET', url: "/service/tasks", dataType: 'json',success: function(json) {
				taskList = json;
				$(document).trigger('TASKS_UPDATED');
			}});
		}
    };
};

var taskDao = new TaskDao();

function Controller() {
	var selectedRow;
	var controller = this;
	
	this.updateTable = function() {
	    var newTasks = $.grep(taskDao.getTasks(), function(task) {return task.state == TaskState.Current;});
	    var finishedTasks = $.grep(taskDao.getTasks(), function(task) {return task.state == TaskState.Finished;});
	    
	    var newTasksMarkup = controller.generateTasksMarkup(newTasks);
	    var finishedTasksMarkup = controller.generateTasksMarkup(finishedTasks);
	    $('#CurrentTasks > table > tbody').empty().append(newTasksMarkup);
	    $('#FinishedTasks > table > tbody').empty().append(finishedTasksMarkup);
	    selectedRow = $('table.tasks > tbody > tr.selected');
	};
	
	this.generateTasksMarkup = function(taskList) {
	    var tbody = [];
	    $.each(taskList, function() {
	    	var classes = '';
	    	if (selectedRow && this.id == $(selectedRow).attr('taskid')) {
	    		classes = 'selected';
	    	}
	    	var tr = ['<tr ', 'taskId="', this.id, '" class="' , classes , '">',
	    	  		      '<td class="column0">', this.title, '</td>',
	    	  		      '<td class="column1">', controller.formatDate(this.date), '</td>',
	    	          "</tr>"
	    	          ];
	    	tbody = tbody.concat(tr);
		});
	    return tbody.join('');
	};
	
	this.addActions = function () {
		$('table.tasks > tbody > tr').live('click', function() {
			if (selectedRow) {
				$(selectedRow).removeClass('selected');
			}
			if (selectedRow !== this) {
				selectedRow = this;
				$(selectedRow).addClass('selected');
				controller.updateDetailsView();
			} else {
				selectedRow = null;
				controller.resetDetailsView();
			}
		});
		controller.enableDragAndDrop();
		$('#tasks > div.tabs > div.tab').click(function(event) {
			var selectedTab = $('#tasks > div.tabs > div.tab.selected');
			selectedTab.removeClass('selected');
			$(event.target).addClass('selected');
			var newTabTitle = $(event.target).text();
			$('#' + selectedTab.text() + 'Tasks').slideUp();
			$('#' + newTabTitle + 'Tasks').slideDown();
		});
		$('#newTask').keyup(function(event) {
			var value = $(event.target).val();
			if (value) {
				value = $.trim(value);
			} else {
				value ='';
			}
			if (event.which == 13 && value.length > 0) {
				taskDao.addTask({
     		    	"id"   : taskDao.getTasks().length + 1,
     		    	"title": value,
     		    	"state": TaskState.Current
     		    });
				controller.updateTable();
			} 
		});
		$('#details > div.headline > div.view, #details > div.date > div.view').click(function(event) {
			$(this).parent().find('div').toggle();
		});
		$('#details > div.headline > div.edit, #details > div.date > div.edit').keyup(function(event) {
			var input = $(this).find('input');
			if (event.which != 13 || input.val().length == 0) {
				return;
			}
			controller.updateTask(input);
		});
		$('#taskDate').datepicker({ dateFormat: 'dd.mm.yy', onClose: function() {
			controller.updateTask($('#details > div.date > div.edit > input'));
		}});
		$(document).bind('TASKS_UPDATED', function() {
			controller.updateTable();
			$(document).trigger('TABLE_UPDATED');
		});
	};
	
	this.enableDragAndDrop = function() {
	    $('table.tasks > tbody > tr').live('mouseover', function() {
	         if (!$(this).data("init")) {
		            $(this).data("init", true).draggable({ 
		            	helper: function() {
							return '<div>' + $(this).find('td.column0').text() + '</div>';
						},
						cursorAt: { left: 20 }
		            });
		     }
		});
	    $('#tasks > div.tabs > div.tab').droppable({
	    	hoverClass: "dropHover",
	    	drop: function( event, ui ) {
	    		var taskid = ui.draggable.attr('taskid');
	    		var task = controller.getTaskForId(taskid);
	    		task.state = $(this).text();
	    		taskDao.updateTask(task);
	    	}
	    });
	}
	
	this.updateTask = function(input) {
		var attribute = input.attr('name');
		var value = input.val();
		var task = controller.getCurrentTask();
		if (attribute === 'date') {
			value = $.datepicker.parseDate('dd.mm.yy', value);
		}
		task[attribute] = value;
		input.parent().parent().find('div').toggle();
		taskDao.updateTask(task);
	}
	
	this.updateDetailsView = function() {
		var task = controller.getCurrentTask();
		if (!task) {
			return;
		}
		$('#details > div.headline > div.view').empty().text('Titel: ' + task.title);
		$('#details > div.headline > div.edit > input#taskTitle').val(task.title);
		$('#details > div.date > div.view').empty().text('Datum: ' + controller.formatDate(task.date));
		$('#details > div.date > div.edit > input#taskDate').val(controller.formatDate(task.date));
	};
	
	this.getCurrentTask = function() {
		return controller.getTaskForId($(selectedRow).attr('taskId'));
	}
	
	this.getTaskForId = function(id) {
		return $.grep(taskDao.getTasks(), function(task) {
			return task.id == id;
		})[0];
	}
	
	this.resetDetailsView = function() {
		$('#details > div > div.view').empty();
		$('#details > div > div.edit > input').val('');
	};
	
	this.formatDate = function(date) {
    	var dateString = "";
    	if (date) {
    		dateString = $.datepicker.formatDate("dd.mm.yy", new Date(date));
    	}
    	return dateString;
	};
}


$(document).ready(function() {
	taskDao.loadTasks();
	var controller = new Controller();
    controller.updateTable();
    controller.addActions();
    connect();
});

function connect() {
	if (!window.WebSocket)
	    alert("WebSocket not supported by this browser");
	eventBus.connect();
}

  
var eventBus = {
	connect : function() {
		// var location =
		// document.location.toString().replace('http://','ws://').replace('https://','wss://');
		var target = 'ws://' + document.location.host + '/event/';
		this._ws = new WebSocket(target);
		this._ws.onopen = this._onopen;
		this._ws.onmessage = this._onmessage;
		this._ws.onclose = this._onclose;
	},

	_onopen : function() {
		$('#header').empty().append('Status: Connected');
	},

	_send : function(message) {
		if (this._ws)
			this._ws.send(message);
	},

	_onmessage : function(m) {
		if (m.data) {
			var busEvent = JSON.parse(m.data);
			$(document).bind('TABLE_UPDATED', function() {
				$(document).unbind('TABLE_UPDATED');
				var tr = $('table.tasks > tbody > tr[taskid=' + busEvent.taskid + ']');
				tr.addClass(busEvent.type, 1000, function() {
						tr.delay(2000).removeClass(busEvent.type,1000);
				})
			});
			taskDao.loadTasks();
		}
	},

	_onclose : function(m) {
		this._ws = null;
		$('#header').empty().append('Status: Not Connected');
		alert('lost the connection');
	}
}