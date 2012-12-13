Ext.define('App.model.Antwoorden', {
    extend: 'Ext.data.Model',
    alias: "widget.antwoorden",
    requires: ['App.proxy.sap_gateway'],
    config: {

        fields: [
            { name: 'w_id', type: 'string' },
            { name: 'dec_text', type: 'string' }
        ]

    }
});
