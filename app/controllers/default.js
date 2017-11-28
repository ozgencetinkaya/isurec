
module.exports = {
    index : function (){
        console.log('index');
        this.view();
    },
    show : function (){
        console.log('show');
        this.json();
    },
    view : function (){
        console.log('view');
        this.json();
    },
    test : function (){
        console.log('test');
        this.json();
    }

};
