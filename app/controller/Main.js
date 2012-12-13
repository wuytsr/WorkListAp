var rec;
Ext.define('App.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        
        refs: {
            List: "list",
            Login: "start",
            Detail: "detail",
            Antwoorden_view: "antwoorden_view"
        },
        control: {

            "List": {
                activate: 'onActivate',
                disclose: 'onDisclose'
            },
            "Antwoorden_view": {
                itemsingletap: "submitchoice"
            },
            '#login': {
                tap: 'LoginTap'
            },
            '#logout': {
                tap: 'onBackTap'
            },
            '#options': {
                tap: 'onBackTap'
            },
            '#toList': {
                tap: 'toListTap'
            }
        },
    },

    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },


    onActivate: function () {
        console.log('Main container is active');
    },


    //////////////////////////////////
    ///////////   LOGIN    ///////////
    //////////////////////////////////

    ///////       Login       ///////
    LoginTap: function () {
       
        console.log("1");
        //Get credentials
        var usertxt = Ext.getCmp("usertxt").getValue();
        var pwdtxt = Ext.getCmp("pwdtxt").getValue();
        var cred = Ext.getCmp("cred").getChecked();

        //LocalStorage
        console.log("Try to login");

        userstore = Ext.getStore('LocalStorageUserStore');
        user = userstore.getById(1);

        if (cred == true) {
            var model = new App.model.LocalStorageUser({
                id: '1',
                user: usertxt,
                pwd: pwdtxt
            });
            var records = userstore.add(model);
            records[0].save();

            userstore.sync();
        } else {
            var model = new App.model.LocalStorageUser({
                id: '1',
                user: "",
                pwd: ""
            });
            var records = userstore.add(model);
            records[0].save();
        };


        // Lijst ophalen

        //List view aan ActivityStore binden
        var lijstview = Ext.getCmp("lijst");
        var activityStore = lijstview.getStore();

        if (usertxt != "" && pwdtxt != "") {
            var mod = activityStore.getModel();
            mod.getProxy().setUrl("http://scvwis0046.dcsc.be:8010/sap/opu/odata/sap/Z_GW_WORKITEMS_CM_WR/z_gw_workitems_wrCollection?sap-user=" + usertxt + "&sap-password=" + pwdtxt);
            console.log(mod.getProxy().getUrl());
            activityStore.load();

            console.log("Login succeeded");

            var to_list = this.getList();
            Ext.Viewport.animateActiveItem(to_list, this.slideLeftTransition);

        } else {
            alert("Please fill in your credentials!");
        };
    },

    //////////////////////////////////
    ///////////    LIST    ///////////
    //////////////////////////////////

    ///////      DISCLOSE      ///////

    onDisclose: function (view, record, target, index, event) {
        console.log('Disclosure icon was tapped on the List');
        console.log(view, record, target, index, event);
        console.log('Clicked on the disclosure icon',
          'The id selected is: ' + record.get('w_id'));
        rec = record;

        

        console.log(record.get("w_id"));
       
        var list_to_detail = Ext.create("App.view.Detail");
        var choicelist = Ext.getCmp("choices");
        choicelist.setStore(Ext.create("App.store.Antwoorden_store"));
        ///////////////////////
        //Get user and password
        userstore = Ext.getStore('LocalStorageUserStore');
        user = userstore.getById(1);
      
        var usertxt = Ext.getCmp("usertxt").getValue();
        var pwdtxt = Ext.getCmp("pwdtxt").getValue();
      

        var mod = choicelist.getStore();
        mod.getProxy().setUrl("http://scvwis0046.dcsc.be:8010/sap/opu/odata/sap/Z_GW_WORKITEMS_CM_WR/z_gw_workitems_wrCollection?sap-user=" + usertxt + "&sap-password=" + pwdtxt);
        console.log(mod.getProxy().getUrl());

        /////////
        /////////


        choicelist.getStore().load();
        
        choicelist.getStore().filter("w_id", record.get("w_id"));
        Ext.Viewport.add(list_to_detail);

        list_to_detail.onAfter('erased', function () {
            Ext.getCmp("details").destroy();
        });
        Ext.Viewport.add(list_to_detail);
        
        Ext.Viewport.animateActiveItem(list_to_detail, this.slideLeftTransition);

    },

    ///////      LOGOUT      ///////

    onBackTap: function () {

        var list_to_login = this.getLogin();
        alert("Logged out");
        Ext.Viewport.animateActiveItem(list_to_login, this.slideRightTransition);
    },

    //////////////////////////////////
    ///////////   DETAIL   ///////////
    //////////////////////////////////

    ///////       CHOICE       ///////

    submitchoice: function (view, c, target, record, event) {
       console.log("Try to post data: id: " + record.get("w_id") + ", dec_text: " + record.get("dec_text"));
       var push = Ext.create('App.model.PushActivity', {
            w_id: record.get("w_id"), dec_text: record.get("dec_text")
        });

        push.save(function(record) {
            console.log('Record saved');
        });

        alert("Decision successfully submitted");
        var lijstview = Ext.getCmp("lijst");
        var activityStore = lijstview.getStore();
        activityStore.load();

        var detail_to_list = this.getList();
        Ext.Viewport.animateActiveItem(detail_to_list, this.slideRightTransition);
    },

    ///////     BACK TO LIST     ///////

    toListTap: function () {
       
        
        var detail_to_list = this.getList();
        Ext.Viewport.animateActiveItem(detail_to_list, this.slideRightTransition);
        //Ext.Viewport.setActiveItem('App.view.List');

    }
});