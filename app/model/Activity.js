Ext.define('App.model.Activity', {
    extend: 'Ext.data.Model',
    alias: "widget.activity",
    requires: ['App.proxy.sap_gateway'],
    config: {
        idProperty: 'w_id',
        autoload: true,
        fields: [
            { name: 'w_id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'text', type: 'string' },
            { name: 'cr_date', type: "date" },
            { name: 'dec_text', type: 'string' }
        ],
        proxy: {
            type: 'sap_gateway',
        }
    }
});
