var get_helper = function(url){
	var content_el = $('#api-results-content');
	var url_el = $('#api-results-url');
 	$.get(url, function(data) {
		$(url_el).html(url);
		$(content_el).html(JSON.stringify(data));
	});
 }

 var post_helper = function(url, body){
	var content_el = $('#api-results-content');
	var url_el = $('#api-results-url');
 	$.post(url, body, function(data) {
		$(url_el).html(url);
		$(content_el).html(JSON.stringify(data));
	});
 }

 var put_helper = function(url, body){
	var content_el = $('#api-results-content');
	var url_el = $('#api-results-url');
	$.ajax({url: url, data: body, type: 'PUT', success: function(data) {
        $(url_el).html(url);
		$(content_el).html(JSON.stringify(data));
        }
	});
 }


$(function() {
	$('#get_users').click(function() {
		var url = '/users/'
		get_helper(url);
	});

	$('#get_user').click(function() {
		var user_id = $('#get_user_id').val();
		var url = '/users/' + user_id;
		get_helper(url);
	});

	$('#get_user_pickmeups').click(function() {
		var user_id = $('#get_user_id').val();
		var url = '/users/' + user_id + '/pickmeups/';
		get_helper(url);
	});

	$('#get_pickmeup').click(function() {
		var user_id = $('#get_user_id').val();
		var pickmeup_id = $('#get_pickmeup_id').val();
		var url = '/users/' + user_id + '/pickmeups/' + pickmeup_id;
		get_helper(url);
	});

	$('#post_create_user').click(function() {
		var username = $('#post_username').val();
		var password = $('#post_password').val();
		var url = '/users/';
		var body = {username: username,	password: password};
		post_helper(url,body);
	});

	$('#post_create_pickmeup').click(function() {
		var receiver_id = $('#post_receiver_id').val();
		var text = $('#post_text').val();
		var url = '/users/' + receiver_id + '/pickmeups/';
		var body = {text:text}
		post_helper(url,body);
	});

	$('#post_login_user').click(function() {
		var username = $('#post_username').val();
		var password = $('#post_password').val();
		var url = '/users/login';
		var body = {username: username, password: password};
		post_helper(url,body);
	});

	$('#post_logout_user').click(function() {
		var url = '/users/logout';
		post_helper(url,{});
	});

	$('#put_unlock_pickmeup').click(function() {
		var receiver_id = $('#put_receiver_id').val();
		var pickmeup_id = $('#put_pickmeup_id').val();
		var url = '/users/' + receiver_id + '/pickmeups/' + pickmeup_id + '/unlock';
		put_helper(url,{});
	});

	$('#put_vote_on_pickmeup').click(function() {
		var receiver_id = $('#put_receiver_id').val();
		var pickmeup_id = $('#put_pickmeup_id').val();
		var voting_direction = $('#put_voting_direction').val();
		var url = '/users/' + receiver_id + '/pickmeups/' + pickmeup_id + '/vote';
		var body = {voting_direction: voting_direction}
		put_helper(url,body);
	});
})