Ext.define('App.model.LocalStorageUser', {
    extend: 'Ext.data.Model',
    alias: 'widget.LocalStorageUser',
    config: {
        idProperty: 'id',
        fields: [
            { name: "id", type: "auto" },
            { name: "user", type: "string" },
            {name: "pwd", type:"string"}
        ],



        proxy: {
            type: 'localstorage',
            id: 'users'
        }
    }
});