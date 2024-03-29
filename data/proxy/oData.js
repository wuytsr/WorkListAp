/*

Copyright (c) 2012 Sencha Inc
Contact:  http://www.sencha.com/contact
License: http://market.sencha.com/licenses/77 

*/

Ext.define('Ext.data.proxy.OData', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.odata',

    requires: ['Ext.XTemplate'],

    config: {
        /**
         * @cfg {String} startParam
         * @hide
         */
        startParam: '$skip',

        /**
         * @cfg {String} limitParam
         * @hide
         */
        limitParam: '$top',

        /**
         * @cfg {String} groupParam
         * @hide
         */
        groupParam: null,

        /**
         * @cfg {String} pageParam
         * @hide
         */
        pageParam: null,

        /**
         * @cfg {String} format The format in which the connected gateway encodes the data. Currently only 'xml'
         * is supported.
         */
        format: 'xml',

        /**
         * @cfg {Boolean} useHeaderAuthentication If you package your app in a native shell and you want to do authentication
         * on the request, you have to set this to true. This is because of a bug in the XHR implementation
         * that doesn't allow you to do authentication when the app is being served from the filesystem.
         */
        useHeaderAuthentication: false,

        xmlDocumentTpl: [
            '<?xml version="1.0" encoding="utf-8"?>\n',
            '<atom:entry xml:base="HTTP://p326.coil.sap.com:80/sap/opu/sdata/sap/MMSC13/"\n',
            '            xmlns:atom="http://www.w3.org/2005/Atom"\n',
            '            xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n',
            '            xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n',
            '            xmlns:sap="http://www.sap.com/Protocols/SAPData">\n',
            '    <atom:content type="application/xml">\n',
            '        <m:properties><tpl for=".">\n            <d:{key}>{value}</d:{key}></tpl>\n        </m:properties>\n',
            '    </atom:content>\n',
            '</atom:entry>\n'
        ],

        /**
         * @cfg {Boolean} enablePagingParams This can be set to false if you want to prevent the paging params to be
         * sent along with the requests made by this proxy.
         */
        enablePagingParams: true,

        /**
         * @cfg {Number} timeout
         * The number of milliseconds to wait for a response. Defaults to 30000 milliseconds (30 seconds).
         */
        timeout: 30000,

        /**
         * @cfg {Object} extraParams
         * Extra parameters that will be included on every request. Individual requests with params of the same name
         * will override these params when they are in conflict.
         */
        extraParams: {},

        /**
         * @cfg {Object} headers
         * Any headers to add to the Ajax request. Defaults to undefined.
         */
        headers: {},

        /**
         * @cfg {Object} actionMethods
         * @hide
         */
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PUT',
            destroy: 'DELETE'
        },

        reader: {
            type: 'xml',
            implicitIncludes: false,
            record: 'entry'
        },
        writer: {
            type: 'xml'
        },
        noCache: false,
        appendId: false
    },

    applyXmlDocumentTpl: function(documentTpl) {
        if (documentTpl && !documentTpl.isTemplate) {
            return Ext.create('Ext.XTemplate', documentTpl);
        }
        return documentTpl;
    },

    prepareXmlData: function(request) {
        var writer    = this.getWriter(),
            operation = request.getOperation(),
            records   = operation.getRecords() || [],
            documentTpl = this.getXmlDocumentTpl(),
            model = operation.getModel(),
            idProperty = model.getIdProperty(),
            properties = [],
            data, xml, key;

        // In an oData proxy there can only be one record sent to the server
        if (records.length) {
            data = writer.getRecordData(records[0]);
        }

        if (data) {
            for (key in data) {
                if (key !== idProperty && data.hasOwnProperty(key)) {
                    properties.push({
                        key: key,
                        value: data[key]
                    });
                }
            }
            xml = documentTpl.apply(properties);
        }

        return xml;
    },

    /**
     * Performs Ajax request.
     * @protected
     */
    doRequest: function(operation, callback, scope) {
        var me = this,
            username = me.getUsername(),
            password = me.getPassword(),
            request = me.buildRequest(operation);

        request.setConfig({
            headers  : me.getHeaders(),
            timeout  : me.getTimeout(),
            method   : me.getMethod(request),
            callback : me.createRequestCallback(request, operation, callback, scope),
            scope    : me,
            proxy    : me
        });

        if ((operation.getWithCredentials() || me.getWithCredentials()) && !Ext.isEmpty(username)) {
            if (this.getUseHeaderAuthentication()) {
                request.getHeaders()['Authorization'] = 'Basic ' + btoa(username + ':' + password);
            } else {
                request.setWithCredentials(true);
                request.setUsername(username);
                request.setPassword(password);
            }
        }

        // We now always have the writer prepare the request
        //request = writer.write(request);
        request.setXmlData(this.prepareXmlData(request));

        Ext.Ajax.request(request.getCurrentConfig());

        return request;
    },

    buildUrl: function(request) {
        var me        = this,
            records   = request.getOperation().getRecords() || [],
            record    = records[0],
            idProperty= me.getModel().getIdProperty(),
            url       = me.getUrl(request),
            params    = request.getParams() || {},
            id        = (record && !record.phantom) ? record.getId() : params[idProperty];

        if (record && !record.phantom) {
            url += '(' + record.getId() + ')';
        } else {
            if (params[idProperty]) {
                url += '(' + params[idProperty] + ')';
                delete params[idProperty];
            }
        }

        request.setUrl(url);
        return url;
    },

    processResponse: function(success, operation, request, response, callback, scope) {
        var me = this,
            action = operation.getAction();

        // For read and create operations we let the default Server proxy take care of the response
        if (action === 'read') {
            this.callParent(arguments);
        }
        // For create operations we have to check the status code and if it shows that the
        // request was succesful we merge the returned data with the currently existing
        // instances
        else if (action === 'create') {
            // For now we just call parent
            this.callParent(arguments);
        }
        // Update and destroy operations don't return any content. We just make sure that the
        // status code on the request object is 204 and fire an exception otherwise.
        else {
            operation.setCompleted(true);
            if (response.status !== 204) {
                operation.setSuccessful(false);
                operation.setException(response.statusText);
                me.fireEvent('exception', this, response, operation);
            }

            //this callback is the one that was passed to the 'read' or 'write' function above
            if (typeof callback == 'function') {
                callback.call(scope || me, operation);
            }
        }
    }
});