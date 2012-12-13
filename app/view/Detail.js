Ext.define('App.view.Detail', {
    alias: "widget.detail",
    extend: 'Ext.Panel',
     models: ['Activity'],
    controllers: ["Main"],
    views: ['Login', 'List', 'Detail'],
    stores: ['Activities'],
    id: "details",
    autoDestroy: true,
    fullscreen: true,
    layout: "fit",
    initialize: function () {
        
        var bbutton = {
            xtype: "button",
            text: 'Back',
            ui: 'back',
            id: 'toList',
            scope: this
        };

        this.callParent(arguments);
        var titlebar = {
            xtype: 'titlebar',
            docked: 'top',
            id: 'titleBar',
            ui: 'light',
            title: 'WorklistApp',
            items: [
                bbutton
            ]
        };

        var wl_id = {
            requires: "App.view.list",
            xtype: "label",
            html: "<br /><div><b>ID:</b> " + rec.get("w_id") + "</div><br />"
        };
        var wl_title = {
            requires: "App.view.list",
            xtype: "label",
            html: "<div><b>Title:</b> " + rec.get("title") + "</div><br />"
        };
        var wl_date = {
            requires: "App.view.list",
            xtype: "label",
            html: "<div><b>Date:</b> " + rec.get("cr_date") + "</div><br />"
        };
        var wl_text = {
            requires: "App.view.list",

            xtype: "label",
            html: "<div><b>Text:</b>" + rec.get("text") + "</div><br />"
        };

       

        var choice = {
            xtype: "antwoorden_view",
            id: "choices",
            config: [{
                layout: {
                    type: "fit"
                },
            }],
            width: "100%",
            height: "30%",
            margin: "50 50 50 60"
        
        };

        var container1 = {
            xtype: "panel",
            margin: "0 50 50 50",
           
            items: [
                 wl_id, wl_title, wl_date, wl_text
            ]
        };
        this.add(titlebar, container1, choice);
    },

});