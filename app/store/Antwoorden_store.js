Ext.define('App.store.Antwoorden_store', {
    extend: 'Ext.data.Store',
    alias: "widget.antwoorden_store",
    config: {
        
        model: 'App.model.Antwoorden',
        autoload: true,
        storeId: "ant_store",
        proxy: {
            type: 'sap_gateway',


        }
       
    },

    }

);