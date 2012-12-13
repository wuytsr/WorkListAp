Ext.define('App.proxy.sap_gateway', {

    // The SAP Gateway proxy extends the built-in Ajax proxy
    extend: 'Ext.data.proxy.Ajax',

    // It requires an XML reader class to parse the response
    requires: 'Ext.data.reader.Xml',

    // Set an alias, so we can use { type : 'sap_gateway' }
    alias: 'proxy.sap_gateway',

    config: {
        // Disable use of paging params (limit, page, start)
        enablePagingParams: false,

        // Disable cache busting
        noCache: false,

        // Configure a XML reader to process the server response.
        // Each activity is contained in an 'entry' element.
        reader: {
            type: 'xml',
            record: 'entry'
        }
    }
});
