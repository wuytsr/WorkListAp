Ext.define('App.model.PushActivity', {

    extend: 'Ext.data.Model',
    alias: "widget.pushactivity",
    requires: ['Ext.data.proxy.OData'],
    config: {
        fields: [
            { name: 'dec_text', type: 'string' },
            { name: 'w_id', type: 'string' }
        ],
        proxy: {
            type: 'odata',
            url: "http://scvwis0046.dcsc.be:8010/sap/opu/sdata/sap/Z_GW_WORKITEMS_CM_WR/z_gw_workitems_wrCollection/",
            withCredentials: true,
            username: 'wuytsr',
            password: 'SSudqG0101',
            useHeaderAuthentication: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/atom+xml;type=entry",
                "DataServiceVersion": "2.0",
                //'X-CSRF-Token': "6EwxPdjd2LLUkPiCK530rA==" //hoeft niet indien er gebruik wordt gemaakt van oData
            }

        }
    }
});

