Ext.define('App.store.Activities', {
    extend: 'Ext.data.Store',
    alias: "widget.store",
    config: {
        model: 'App.model.Activity',
        autoload: true,
        storeId: "store1",
        sorters: [{ property: 'cr_date', direction: 'DESC'}],
        grouper: {
            sortProperty: "cr_date",
            direction: "DESC",
            groupFn: function (record) {

                if (record && record.data.cr_date) {
                   
                    return record.data.cr_date.toDateString();
                 
                } else {
                    return '';
                }
            }
        }
    }
});