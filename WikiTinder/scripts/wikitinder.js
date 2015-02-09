
var ArticleContent = React.createClass({
    displayName: 'ArticleContent',
    render: function () {
    	var rawMarkup = this.props.children;
        return (
            <div>
            	<span dangerouslySetInnerHTML={{__html:rawMarkup}} />
            </div>
        );
    }
});

var Article  = React.createClass({
	displayName: 'Article',
	getInitialState: function (){
		return {
			data: {
				"title":"Loading...", 
				"url": ".",
				"content": "..."}
			};
	},
	handleArticleLoad: function (){
		this.clearVoteStatus();
		this.setState(this.getInitialState());
	},
	loadArticleFromServer: function(){
		this.handleArticleLoad();
		$.ajax({
			url: "article",
			dataType: "json",
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error("article GET failed", status, err.toString());
			}.bind(this)
		});
	},
	clearVoteStatus: function () {
		this.setState({voteStatus:""})
	},
	handleDownVote: function (){
		this.setState({voteStatus:"downvoted"});
	},
	handleUpVote: function (){
		this.setState({voteStatus:"upvoted"});
	},
	componentDidMount: function() {
		this.loadArticleFromServer();
	},
    render: function () {
    	var classString = "col-md-6 article " + this.state.voteStatus;
        return (
        	<div className={classString}>
            	<h1> {this.state.data.title} </h1>
            	<ArticleContent>{this.state.data.content}</ArticleContent>
            </div>
        );
    }
});

var Container = React.createClass({
    displayName: 'Container',
    handleVote: function(downvoted, upvoted) {
    	$.post("/vote",{ downvoted:downvoted, upvoted:upvoted })
    },
    componentDidMount: function(){
    	document.onkeyup = this.handleKeyPress;
    },
    refreshArticlesWithDelay: function(){
		window.setTimeout(this.refs.right.loadArticleFromServer,1000);
  		window.setTimeout(this.refs.left.loadArticleFromServer,1000);
    },
    handleKeyPress: function(e){
    	var keyval = e.which;
    	left_url = this.refs.left.state.data.url
    	right_url = this.refs.right.state.data.url
    	if (keyval === 37) {
    		this.handleVote(left_url,right_url);
    		this.refs.left.handleUpVote();
    		this.refs.right.handleDownVote();
  			this.refreshArticlesWithDelay()
    	};
    	if (keyval === 39) {
    		this.handleVote(right_url,left_url)
    		this.refs.left.handleDownVote();
    		this.refs.right.handleUpVote();
    		this.refreshArticlesWithDelay()
    		
    	};
    	if (keyval === 82) {
    		this.refreshArticlesWithDelay()
    	};
    },
    render: function () {
        return (
        	<div className="row">
	            <Article ref='left'> </Article>
	            <Article ref='right'> </Article>
            </div>
        );
    }
});

React.render(
	<Container onKeyDown={this.handleKeyPress} />,
	document.getElementById('content')
);