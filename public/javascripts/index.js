var currentUser;

Handlebars.registerPartial('pickmeup', Handlebars.templates['pickmeup']);
Handlebars.registerPartial('pickmeup_content', Handlebars.templates['pickmeup_content']);

$(document).ready(function() {
	loadMainPage();
});

// Format a pickmeup such that its timestamp is user friendly
function formatPickmeup(pickmeup){
	var m = moment(pickmeup.timestamp);
	pickmeup.timestamp = m.format("MM-DD-YYYY h:mm a");
	return pickmeup
}

// Formats the pickmeups dates also sorts them by the date descending
function formatPickmeups(pickmeups){
	pickmeups.sort().reverse();
	pickmeups.forEach(function(pickmeup){
		formatPickmeup(pickmeup);
	})
}

var loadPage = function(template, data) {
  data = data || {};
  $('#main-container').html(Handlebars.templates[template](data));
};

var loadMainPage = function(user) {
	var user_id = $.cookie('user_id');

	if (!user_id) {
		loadPage('login');
	}
	else {
		if (user) {
			formatPickmeups(user.pickmeups_received);
			loadPage('index', {user: user});
		}
		else {
			$.get(
				'/users/' + user_id
			).done(function(response) {
				loadMainPage(response.content);
			}).fail(function(e) {
				alert('An unknown error occured');
				$.removeCookie('user_id');
				loadMainPage();
			});
		}
	}
}

$(document).on('click', '#signin', function(evt) {
	var username = $('#username').val();
	var password = $('#password').val();
	var url = '/users/login/';
	var body = {username: username, password: password};
	sendAjax(url, 'POST', body, function(response) {
		var data = response.content;
		$.cookie('user_id', data._id);
		loadMainPage(data)
	});
});

$(document).on('click', '#signup', function(evt) {
	var username = $('#username').val();
	var password = $('#password').val();
	var confirm_password = $('#confirm_password').val();
	if(username == ""){
		alertify.alert('You need a username!');
	}
	else if(password == ""){
		alertify.alert('You need a password!');
	}
	else if(password != confirm_password){
		alertify.alert('Your passwords must match!');
	}
	else{
		var url = '/users/';
		var body = {username: username, password: password};
		sendAjax(url, 'POST', body, function(response) {
			var data = response.content;
			$.cookie('user_id', data._id);
			loadMainPage(data)
		});
	}
});

$(document).on('click', '#logout', function(evt) {
	$.removeCookie('user_id');
	loadMainPage();
});

// When a user clicks on a pickmeup, we want to unlock it if its not unlocked, then display the information
$(document).on('click', '.pickmeup .pickmeup-bar', function(evt) {
	var user_id = $.cookie('user_id');
	var parent = $(this).parents('.pickmeup');
	var pickmeup_id = parent.data('pickmeup-id');
	var content_el = parent.find('.pickmeup-content');

	// If the content is already visible, we hide it.
	if(content_el.is(':visible')){
		content_el.slideUp();
	} else {
		// Unlock if the pickmeup is not locked
		if(parent.hasClass('unlocked-false')){
			var url = '/users/' + user_id + '/pickmeups/' + pickmeup_id + '/unlock';
			sendAjax(url, 'PUT', {} ,function(data){
				parent.replaceWith(Handlebars.templates['pickmeup'](formatPickmeup(data.content)));
				showPickmeupContent(data.content);
				decKarma(1);
			});
		} else {
			var url = '/users/' + user_id + '/pickmeups/' + pickmeup_id;
			sendAjax(url, 'GET', {}, function(data){
				showPickmeupContent(data.content);
			})
		}
	}
});

// Upvoting or downvoting a pickmeup
$(document).on('click', '.pickmeup .vote-button', function(evt){
	var parent = $(this).parents('.pickmeup');
	var pickmeup_id = parent.data('pickmeup-id');
	var user_id = $.cookie('user_id');
	var voting_direction = $(this).data('vote-direction');
	var pickmeup_content_el = parent.find('.pickmeup-content');
	var url = '/users/' + user_id + '/pickmeups/' + pickmeup_id + '/vote';

	sendAjax(url, 'PUT', {voting_direction: voting_direction}, function(data){
		pickmeup_content_el.html(Handlebars.templates['pickmeup_content'](data.content));
	});
});

// Shows the content of the pickmeup where data should contain _id and text
function showPickmeupContent(data){
	var id = data._id;
	var pickmeup_el = $('.pickmeup[data-pickmeup-id="' + id + '"]');
	var pickmeup_content_el = pickmeup_el.find('.pickmeup-content');

	pickmeup_content_el.html(Handlebars.templates['pickmeup_content'](data));
	pickmeup_content_el.slideDown();
}

// Sets the user's karma to a certain number
function setKarma(score){
	$('#user-karma').text(score);
}

// Decrements te user's karma by the amount
function decKarma(dec){
	var current_score = $('#user-karma').text();
	setKarma(current_score - dec);
}

// Error handler from ajax requests
function handleAJAXError(jqXHR, textStatus, errorThrown){
	var data = $.parseJSON(jqXHR.responseText);
	alertify.alert(data.err);
}

// Ajax helper function
function sendAjax(url, type, data, success){
	$.ajax({
		url: url,
		data: data,
		type: type,
		success: success,
		error: handleAJAXError
	});
}

// login page ajax
$(document).on('click', '#new_user', function(evt){
	$('#pw_confirm').slideDown();
	$('#signin_div').show();
	$('#signup_div').hide();
});

$(document).on('click', '#returning_user', function(evt){
	$('#pw_confirm').slideUp();
	$('#signin_div').hide();
	$('#signup_div').show();
});

$(document).on('click', '#compose-button', function(evt) {
	sendAjax('/users/', 'GET', {}, function(res) {
		var users = res.content.filter(function(user) {
			return user._id !== $.cookie('user_id');
		});
		$('#modal-container').html(Handlebars.templates['compose']({users: users}));
		$('#compose-modal').modal('show');
	});
});

$(document).on('click', '#compose-send', function(evt) {
	var user = $('#compose-user').val();
	var text = $('#compose-text').val();
	sendAjax('/users/' + user + '/pickmeups', 'POST', {text: text}, function(res) {
		$('#compose-modal').modal('hide');
		decKarma(-1);
		//$('#modal-container').html("");
	});
})
