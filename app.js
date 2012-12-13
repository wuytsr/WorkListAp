Ext.Loader.setConfig({
    disableCaching: false
});


Ext.application({
    name: 'App',
    models: ['Activity', 'LocalStorageUser', 'Antwoorden', 'PushActivity'],
    controllers: ["Main"],
    views: ['Login', 'List', 'Detail', 'Antwoorden_view'],
    stores: ['Activities', 'LocalStorageUserStore', 'Antwoorden_store'],
    username: "",
    pwd: "",


    launch: function () {
       window.onerror = function (error) { alert("app.js" + error); };


       var item = Ext.Viewport.add({
           xclass: "App.view.Login"
       });

        var activityStore = Ext.create('App.store.Activities');
        
        Ext.create('App.view.List', {
            store: activityStore
        });

        

        //var antwoordenstore = Ext.create('App.store.Antwoorden_store');
     
        console.log("1");
        Ext.Viewport.setActiveItem(item);
        console.log("2");
    }
});
