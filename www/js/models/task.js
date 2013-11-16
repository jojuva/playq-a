define(['underscore', 'backbone', 'sync/dao/TaskDAO'], function(_, Backbone, TaskDAO){
	var Task = Backbone.Model.extend({

		dao: TaskDAO,
		idAttribute: 'taskid',

		defaults: {
			taskid : null,
			taskseqid : null,
			taskdescription : null,
			status : null,
			synchrostatus : null,
			tmstatus: null,
			tmid: null,
			originid : null,
			priority : null,
			requestdate : null,
			predicteddate : null,
			initialdateplanned : null,
			finaldateplanned : null,
			initialdatereal : null,
			finaldatereal : null,
			customername : null,
			completeaddress : null,
			location : null,
			geographicalcriterion : null,
			contacttelephone1 : null,
			contacttelephone2 : null,
			emplacement : null,
			addresscomplement : null,
			statusorigin : null,
			incidencetype : null,
			installation : null,
			taskduration : null,
			elementcomment : null,
			sort : null,
			timeslotdescription : null,
			gauge : null,
			startdatereplytask : null,
			finaldatereplytask : null,
			creationuser : null,
			existatachmentfromtm : null,
			leaktypeid : null,
			failuretypeid : null,
			isintm : null,
			meterserialnumber : null,
			meterreading : null,
			chlorinereading : null,
			isusedbasicresources : null,
			nonexecutivemotiveid : null,
			operationalsite: null,
			tasktypeid : null,
			tasktypedesc : null,
			ottypeid : null,
			ottypedesc : null,
			classcode: null,
			isfailure: null,
			systemorigin : null,
			commentstechnicaloperator : null,
			operatorid : null


		},

		validation: {
			failuretypeid: { required: true, msg: 'error.validation.failuretype.required' },
			chlorinereading: { required: true, msg: 'error.validation.chlorinereading.required' }
		}
	});
	return Task;
});