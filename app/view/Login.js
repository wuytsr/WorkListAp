Ext.define('App.view.Login', {
    extend: 'Ext.Panel',

    alias: "widget.start",
    requires: ["Ext.field.Password", "Ext.field.Checkbox", "Ext.field.Text", "Ext.Label", 'Ext.data.writer.Xml'],
    config: {
        fullscreen: true,
        layout: "fit",
        list: "list",
        autoDestroy: true
    },



    initialize: function () {

        console.log("Initialisatie Login");

        this.callParent(arguments);
        var titlebar = {
            xtype: 'titlebar',
            docked: 'top',
            ui: 'light',
            title: 'WorklistApp'

        };

        var title = {
            xtype: 'label',

            docked: 'top',
            ui: "none",
            height: 98,
            html: 'Login',
            style: {
                'text-align': 'center',
                'font-family': "Tahoma",
                'font-size': '48px',
                'color': "rgb(255,199,0)"
            },
            margin: "25 0 0 0"
        };

        //Localstorage
        userstore = Ext.getStore('LocalStorageUserStore');

        userstore.load();

        user = userstore.getById(1);

        try {
            var user = userstore.getAt(0).data.user;
            console.log("stored username: " + user);
            var pwd = userstore.getAt(0).data.pwd;
            console.log("stored pwd: " + pwd);

        } catch (err) {
            var user = "";
            var pwd = "";
        };


        var text1 = {
            xtype: 'label',
            html: 'Please enter your SAP user and password'
        };

        var txtuser = {
            xtype: 'textfield',
            label: 'User:',
            id: "usertxt",
            value: user,
            style: {
                'font-family': "Tahoma",
                "font-size": "24px"
            },
            name: 'field',
            width: "80%",
            margin: "0 0 0 40",
        };

        var txtpassword = {
            xtype: 'passwordfield',
            label: 'Password:',
            id: "pwdtxt",
            value: pwd,
            style: {
                'font-family': "Tahoma",
                "font-size": "24px"
            },
            name: 'password-',
            width: "80%",
            margin: "20 20 20 40",

        };


        var log = false;

        if (user.toString() != "" && pwd.toString() != "") {
            log = true;
        };

        var credentials = {
            xtype: 'checkboxfield',
            height: 70,
            checked: log,
            width: 184,
            label: 'Save credentials',
            labelWidth: '60%',
            labelWrap: true,
            id: "cred",
            name: 'save-credentials',
            margin: "20 20 20 20",
        };



        var submit = {
            xtype: 'button',
            centered: true,
            docked: 'bottom',
            height: 114,
            ui: 'action-round',
            width: 508,
            text: 'Login',
            id: "login",
            style: {
                'font-family': "Tahoma",
                "font-size": "32px"

            }
        };


        var container1 = {
            xtype: "container",

            items: [
                txtuser,
                txtpassword,
                credentials
            ]
        };

        this.add(titlebar);
        this.add(title);
        this.add(container1);
        this.add(submit);





    },




});