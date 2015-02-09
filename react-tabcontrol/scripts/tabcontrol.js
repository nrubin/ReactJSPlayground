var TabControl = React.createClass({
    displayName: 'TabControl',
    getInitialState: function (){
        return {tabs: []};
    },
    createTabs: function (){
        var dummyTabs = [
        {
            title: 'Tab 1',
            content: 'This is the first tab'
        },
        {
            title: 'Tab 2',
            content: 'This is the second tab'
        },
        {
            title: 'Tab 3',
            content: 'This is the third tab'
        }];
        this.setState({tabs:dummyTabs})
    },
    componentDidMount: function() {
        this.createTabs();
    },
    render: function () {
        var tabs = this.state.tabs.map(function(tab){
            return (
                <Tab title={tab.title} content={tab.content}> </Tab>
            );
        });
        return (
            <div className="tabControl">
                {tabs}
            </div>
        );
    }
});

var Tab = React.createClass({
    displayName: 'Tab',
    render: function () {
        return (
            <div>
                <TabHeader title={this.props.title}> </TabHeader>
                <TabContent content={this.props.content}> </TabContent>
            </div>
        );
    }
});

var TabHeader = React.createClass({
    displayName: 'TabHeader',
    render: function () {
        return (
            <div>{this.props.title}</div>
        );
    }
});

var TabContent = React.createClass({
    displayName: 'TabContent',
    render: function () {
        return (
            <div>{this.props.content}</div>
        );
    }
});

React.render(
	<TabControl />,
	document.getElementById('content')
);