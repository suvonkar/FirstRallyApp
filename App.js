Ext.define('CustomApp', {
	extend : 'Rally.app.App',
	componentCls : 'app',
	launch : function() {
		this._createKanbanStateDropDown();
	},

	_createKanbanStateDropDown : function() {
		this.myKanbanStateDropdown = Ext.create(
				'Rally.ui.combobox.FieldValueComboBox', {
					model : 'UserStory',
					field : 'c_KanbanState',
					fieldLabel : 'Kanban State: ',
					listeners : {
						ready : function(fieldValueComboBox) {
							this._loadData();
						},
						select : function(combo) {
							this._loadData();
						},
						scope : this
					}
				});
		this.add(this.myKanbanStateDropdown);
	},

	_loadData : function() {
		var selectedKanbanState = this.myKanbanStateDropdown.getRecord().get(
				'value');
		console.log('selectedKanbanState ' + selectedKanbanState);
		var filter = [ {
			property : 'c_KanbanState',
			operator : '=',
			value : selectedKanbanState
		} ];
		if (this.myStore) {
			this.myStore.setFilter(filter);
			this.myStore.load();
		} else {
			this.myStore = Ext.create("Rally.data.wsapi.Store", {
				model : 'User Story',
				autoLoad : true,
				listeners : {
					load : function(myStore, myData, success) {
						console.log("my data is ", myData);
						if (!this.myGrid) {
							this._createDataGrid(this.myStore);
						}
					},
					scope : this
				},
				fetch : [ 'FormattedID', 'Name', 'Parent', 'Owner',
						'InProgressDate', 'ScheduleState', 'Project',
						'c_KanbanState' ],
				context : {
					project : Rally.environment.getContext().getProject()
				},
				filters : filter
			});
		}
	},

	_createDataGrid : function(myDataStore) {
		this.myGrid = Ext.create('Rally.ui.grid.Grid', {
			store : myDataStore,
			columnCfgs : [ {
				text : 'Formated ID',
				dataIndex : 'FormattedID'
			}, {
				text : 'Name',
				dataIndex : 'Name'
			}, {
				text : 'Parent Feature',
				dataIndex : 'Parent'
			}, {
				text : 'Owner',
				dataIndex : 'Owner'
			}, {
				text : 'In Progress Date',
				dataIndex : 'InProgressDate'
			}, {
				text : 'Delay in Acceptance',
				dataIndex : 'InProgressDate',
				renderer : function(value) {
					if (value !== null) {
						var today = new Date();
						var one_day = 1000 * 60 * 60 * 24;

						var date1_ms = value.getTime();
						var today_ms = today.getTime();

						var difference_ms = today_ms - date1_ms;

						return Math.round(difference_ms / one_day);
					} else {
						return 0;
					}
				}
			} ]
		});

		this.add(this.myGrid);
	}
});
