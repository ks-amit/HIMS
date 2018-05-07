var SearchExampleComponent = React.createClass({displayName: "SearchExample",

    getInitialState: function(){
        return { searchString: '' };
    },

    handleChange: function(e){

        this.setState({searchString:e.target.value});
    },

    render: function() {

        var libraries = this.props.items,
            searchString = this.state.searchString.trim().toLowerCase();


        if(searchString.length > 0){

            // We are searching. Filter the results.

            libraries = libraries.filter(function(l){
                return l.name.toLowerCase().match( searchString );
            });

        }

        libraries = libraries.map(function(l){
            return React.createElement("li", {key:  l.name}, l.name, " ", React.createElement("a", {href: l.url}, l.url));
        });

        return React.createElement("div", null,
                    React.createElement("input", {type: "text", value: this.state.searchString, onChange: this.handleChange, placeholder: "Type here"}),

                    React.createElement("ul", null,

                         libraries

                    )

                );

    }
});
var SearchExample = React.createFactory(SearchExampleComponent);


var libraries = [
    { name: 'Backbone.js', url: 'http://documentcloud.github.io/backbone/'},
    { name: 'AngularJS', url: 'https://angularjs.org/'},
    { name: 'jQuery', url: 'http://jquery.com/'},
    { name: 'Prototype', url: 'http://www.prototypejs.org/'},
    { name: 'React', url: 'http://facebook.github.io/react/'},
    { name: 'Ember', url: 'http://emberjs.com/'},
    { name: 'Knockout.js', url: 'http://knockoutjs.com/'},
    { name: 'Dojo', url: 'http://dojotoolkit.org/'},
    { name: 'Mootools', url: 'http://mootools.net/'},
    { name: 'Underscore', url: 'http://documentcloud.github.io/underscore/'},
    { name: 'Lodash', url: 'http://lodash.com/'},
    { name: 'Moment', url: 'http://momentjs.com/'},
    { name: 'Express', url: 'http://expressjs.com/'},
    { name: 'Koa', url: 'http://koajs.com/'},
];
