Ext.define('App.store.LocalStorageUserStore', {
    extend: 'Ext.data.Store',

    config: {
        model: 'App.model.LocalStorageUser',
        syncRemovedRecords: false,
        autoload: true,
        proxy: {
            type: 'localstorage',
            id: 'users'
        },
    }

});