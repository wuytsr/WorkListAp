Ext.define('App.view.Antwoorden_view', {
    alias: "widget.antwoorden_view",
    id: "antwoordenview",
    extend: 'Ext.List',
    requires: ['Ext.TitleBar', 'App.store.Antwoorden_store'],
    models: ['Activity'],
    controllers: ["Main"],
    views: ['Login', 'List', 'Detail'],

    config: {
        fullscreen: true,
        layout: "fit",
        scroll: true,

        loadingText: "Loading answers...",
        emptyText: "<div class=\"notes-list-empty-text\">No answers.</div>",

        itemTpl: "<button style='height: 50px; width: 80%'; 'margin: 50 50 50 50'; bold: 'true'> {dec_text}</button>",
    },
    

   


});