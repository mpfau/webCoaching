var TaskState = {"Finished": "FINISHED", "New": "NEW"};

function TaskDao() {
    var tasks = [
     		    {
     		    	"id"   : 1,
     		    	"Title": "Milch einkaufen",
     		    	"Date" : new Date(2010,11,28).getTime(),
     		    	"State": "NEW"
     		    },
     		    {
     		    	"id"   : 2,
     		    	"Title": "Auto waschen",
     		    	"Date" : new Date(2010,10,28).getTime(),
     		    	"State": "NEW"
     		    },
     		    {
     		    	"id"   : 3,
     		    	"Title": "Wäsche waschen",
     		    	"Date" : "",
     		    	"State": "NEW"
     		    },
     		    {
     		    	"id"   : 4,
     		    	"Title": "Kurs vorbereiten",
     		    	"Date" : null,
     		    	"State": "FINISHED"
     		    },
     		    {
     		    	"id"   : 5,
     		    	"Title": "Jahr 2000-Fehler (Datumsfehler) beheben",
     		    	"Date" : new Date(1999,11,30).getTime(),
     		    	"State": "FINISHED"
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
	    var newTasks = $.grep(taskDao.getTasks(), function(task) {return task.State == TaskState.New;});
	    var finishedTasks = $.grep(taskDao.getTasks(), function(task) {return task.State == TaskState.Finished;});
	    
	    $('#CurrentTasks > table > tbody').append(controller.generateTasksMarkup(newTasks));
	    $('#FinishedTasks > table > tbody').append(controller.generateTasksMarkup(finishedTasks));
	};
	
	this.generateTasksMarkup = function(tasks) {
	    var tbody = [];
	    $.each(tasks, function() {
	    	var tr = ['<tr ', 'taskId="', this.id, '">',
	    	  		      '<td class="column0">', this.Title, '</td>',
	    	  		      '<td class="column1">', controller.formatDate(this.Date), '</td>',
	    	          "</tr>"
	    	          ];
	    	tbody = tbody.concat(tr);
		});
	    return tbody.join('');
	};
	
	this.addActions = function () {
		$('table.tasks > tbody > tr').click(function() {
			if (selectedRow) {
				$(selectedRow).removeClass('selected');
			}
			if (selectedRow !== this) {
				selectedRow = this;
				$(selectedRow).addClass('selected');
				controller.updateDetailsView($(selectedRow).attr('taskId'));
			} else {
				selectedRow = null;
				controller.resetDetailsView();
			}
		});
		$('#tasks > div.tabs > div.tab').click(function(event) {
			var selectedTab = $('#tasks > div.tabs > div.tab.selected');
			selectedTab.removeClass('selected');
			$(event.target).addClass('selected');
			var newTabTitle = $(event.target).text();
			$('#' + selectedTab.text() + 'Tasks').slideUp();
			$('#' + newTabTitle + 'Tasks').slideDown();
		});
	};
	
	this.updateDetailsView = function(id) {
		var task = $.grep(taskDao.getTasks(), function(task) {
			return task.id == id;
		});
		if (!task) {
			return;
		}
		$('#details > div.headline').empty().text(task[0].Title);
		$('#details > div.date').empty().text(controller.formatDate(task[0].Date));
	};
	
	this.resetDetailsView = function() {
		$('#details > div.headline, #details > div.date').empty();
	};
	
	this.formatDate = function(date) {
    	var dateString = "";
    	if (date) {
    		var d = new Date(date);
    		var t = d.getDay();
    		dateString = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join(".");
    	}
    	return dateString;
	};
}


$(document).ready(function(){
	var controller = new Controller();
    controller.updateTable();
    controller.addActions();
});