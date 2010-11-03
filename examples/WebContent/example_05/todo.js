var TaskState = {"Finished": "FINISHED", "New": "NEW"};

$(document).ready(function(){
     var tasks = [
    		    {
    		    	"Title": "Milch einkaufen",
    		    	"Date" : new Date(2010,11,28).getTime(),
    		    	"State": "NEW"
    		    },
    		    {
    		    	"Title": "Auto waschen",
    		    	"Date" : new Date(2010,10,28).getTime(),
    		    	"State": "NEW"
    		    },
    		    {
    		    	"Title": "W&aumlsche waschen",
    		    	"Date" : "",
    		    	"State": "NEW"
    		    },
    		    {
    		    	"Title": "Kurs vorbereiten",
    		    	"Date" : null,
    		    	"State": "FINISHED"
    		    },
    		    {
    		    	"Title": "Jahr 2000-Fehler (Datumsfehler) beheben",
    		    	"Date" : new Date(1999,12,31).getTime(),
    		    	"State": "FINISHED"
    		    }
    		];
    var newTasks = $.grep(tasks, function(task) {return task.State == TaskState.New;});
    var finishedTasks = $.grep(tasks, function(task) {return task.State == TaskState.Finished;});
    
    var tbody = [];
    $.each(newTasks, function() {
    	var dateString = "";
    	if (this.Date) {
    		var date = new Date(this.Date);
    		var dateString = [date.getDay(), date.getMonth() + 1, date.getFullYear()].join(".");
    	}
    	var tr = ["<tr>",
    	  		      '<td class="column0\">', this.Title, '</td>',
    	  		      '<td class="column1">', dateString, '</td>',
    	          "</tr>"
    	          ];
    	tbody = tbody.concat(tr);
	});
    $('#CurrentTasks > table > tbody').append(tbody.join(""));
 });