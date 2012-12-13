/*
Copyright(c) 2012 Company Name
*/
Ext.Loader.setConfig({disableCaching:false});Ext.application({name:"App",models:["Activity","LocalStorageUser","Antwoorden","PushActivity"],controllers:["Main"],views:["Login","List","Detail","Antwoorden_view"],stores:["Activities","LocalStorageUserStore","Antwoorden_store"],username:"",pwd:"",launch:function(){var b=Ext.Viewport.add(Ext.create("App.view.Login"));var a=Ext.create("App.store.Activities");Ext.create("App.view.List",{store:a});console.log("1");Ext.Viewport.setActiveItem(b);console.log("2")}});
