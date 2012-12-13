Ext.define('App.view.List', {
    alias: "widget.list",
    extend: 'Ext.List',
    requires: ['Ext.TitleBar', 'App.store.Activities'],
    id: "lijst",
  
    config: {
        // make sure this view uses the full viewport
        fullscreen: true,
        layout: "fit",
        scroll: true,
  
        loadingText: "Loading workitems...",
        emptyText: "<div class=\"notes-list-empty-text\"><h1><br /><br />There are currently no workitems <br /><br />or <br /><br />your login credentials are wrong</h1> </div>",
        onItemDisclosure: true,
        grouped: true,
        itemTpl: "<div class=\"list-item-narrative\">{w_id}</div><div class=\"list-item-title\">{title}</div>",
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            ui: "light",
            title: 'WorklistApp',
            items:[{
                xtype: 'button',
                id: 'logout',
                itemId: "logout",
                ui: 'action',
                text: 'Logout',
            }],
        }
        ]
    },

    scroll: true,
    LoadingText : 'Retrieving data'
    
    
});