Ext.define('CustomApp',
		{
			extend : 'Rally.app.App',
			componentCls : 'app',
			launch : function() {
				this._loadData();
			},

			_loadData : function() {
				console.log("Inside dataload");
				var myStore = Ext.create("Rally.data.wsapi.Store", {
					model : 'User Story',
					autoLoad : true,
					listeners : {
						load : function(myStore, myData, success) {
							console.log("my store is ", myStore);
							console.log("my data is ", myData);
							this._loadDataGrid(myStore);
						},
						scope : this
					},
					fetch : [ 'FormattedID', 'Name', 'Parent', 'Owner',
							'InProgressDate', 'ScheduleState', 'Project',
							'c_KanbanState' ],
					context : {
						project : Rally.environment.getContext().getProject()
					},
					filters : [ {
						property : 'c_KanbanState',
						operator : '=',
						value : 'Backlog'
					} ],
					sorters : [ {
						property : 'InProgressDate',
						direction : 'ASC'
					} ]
				});
			},

			_loadDataGrid : function(myDataStore) {
				var myGrid = Ext.create('Rally.ui.grid.Grid', {
					store : myDataStore,
					columnCfgs : [ 'FormattedID', 'Name', 'Parent', 'Owner',
							'ScheduleState', 'Project', 'InProgressDate',
							'c_KanbanState' ]
				});
				this.add(myGrid);
			}
		});
