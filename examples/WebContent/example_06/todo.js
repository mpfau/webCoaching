var TaskState = {"Finished": "Finished", "Current": "Current"};

function TaskDao() {
    var tasks = [
     		    {
     		    	"id"   : 1,
     		    	"Title": "Milch einkaufen",
     		    	"Date" : new Date(2010,11,28).getTime(),
     		    	"State": "Current"
     		    },
     		    {
     		    	"id"   : 2,
     		    	"Title": "Auto waschen",
     		    	"Date" : new Date(2010,10,28).getTime(),
     		    	"State": "Current"
     		    },
     		    {
     		    	"id"   : 3,
     		    	"Title": "Wäsche waschen",
     		    	"Date" : "",
     		    	"State": "Current"
     		    },
     		    {
     		    	"id"   : 4,
     		    	"Title": "Kurs vorbereiten",
     		    	"Date" : null,
     		    	"State": "Finished"
     		    },
     		    {
     		    	"id"   : 5,
     		    	"Title": "Jahr 2000-Fehler (Datumsfehler) beheben",
     		    	"Date" : new Date(1999,11,30).getTime(),
     		    	"State": "Finished"
     		    }
     		];
    return {
    	getTasks: function() {
    		return tasks;
    	},
    	addTask: function(task) {
    		tasks.push(task);
    	},
    	updateTask: function(task) {
    		// TODO not yet implemented
    	}
    };
};

var taskDao = new TaskDao();

function Controller() {
	var selectedRow;
	var controller = this;
	
	this.updateTable = function() {
	    var newTasks = $.grep(taskDao.getTasks(), function(task) {return task.State == TaskState.Current;});
	    var finishedTasks = $.grep(taskDao.getTasks(), function(task) {return task.State == TaskState.Finished;});
	    
	    var newTasksMarkup = controller.generateTasksMarkup(newTasks);
	    var finishedTasksMarkup = controller.generateTasksMarkup(finishedTasks);
	    $('#CurrentTasks > table > tbody').empty().append(newTasksMarkup);
	    $('#FinishedTasks > table > tbody').empty().append(finishedTasksMarkup);
	    selectedRow = $('table.tasks > tbody > tr.selected');
	};
	
	this.generateTasksMarkup = function(tasks) {
	    var tbody = [];
	    $.each(tasks, function() {
	    	var classes = '';
	    	if (selectedRow && this.id == $(selectedRow).attr('taskid')) {
	    		classes = 'selected';
	    	}
	    	var tr = ['<tr ', 'taskId="', this.id, '" class="' , classes , '">',
	    	  		      '<td class="column0">', this.Title, '</td>',
	    	  		      '<td class="column1">', controller.formatDate(this.Date), '</td>',
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
     		    	"Title": value,
     		    	"State": TaskState.Current
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
	    		task.State = $(this).text()
	    		controller.updateTable();
	    	}
	    });
	}
	
	this.updateTask = function(input) {
		var attribute = input.attr('name');
		var value = input.val();
		var task = controller.getCurrentTask();
		if (attribute === 'Date') {
			value = $.datepicker.parseDate('dd.mm.yy', value);
		}
		task[attribute] = value;
		input.parent().parent().find('div').toggle();
		controller.updateDetailsView();
		controller.updateTable();
	}
	
	this.updateDetailsView = function() {
		var task = controller.getCurrentTask();
		if (!task) {
			return;
		}
		$('#details > div.headline > div.view').empty().text('Titel: ' + task.Title);
		$('#details > div.headline > div.edit > input#taskTitle').val(task.Title);
		$('#details > div.date > div.view').empty().text('Datum: ' + controller.formatDate(task.Date));
		$('#details > div.date > div.edit > input#taskDate').val(controller.formatDate(task.Date));
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


$(document).ready(function(){
	var controller = new Controller();
    controller.updateTable();
    controller.addActions();
});