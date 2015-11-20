(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['compose'] = template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "							<option value=\""
    + escapeExpression(lambda((depth0 != null ? depth0._id : depth0), depth0))
    + "\">"
    + escapeExpression(lambda((depth0 != null ? depth0.username : depth0), depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"modal fade\" id=\"compose-modal\" tabIndex=\"-1\" role=\"dialog\" aria-hidden=\"true\" aria-labelledby=\"compose-label\">\n	<div class=\"modal-dialog\">\n		<div class=\"modal-content\">\n			<div class=\"modal-header text-center\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">x</button>\n				<h4 class=\"modal-title\">Compose PickMeUp</h4>\n			</div>\n			<div class=\"modal-body text-center\">\n				<div class=\"row\">\n					<label for=\"compose-user\" class=\"control-label\">To: </label>\n					<select class=\"form-control-static\" id=\"compose-user\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.users : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</select>\n				</div>\n				<div class=\"row\">\n					<textarea rows=\"8\" cols=\"30\" resize:placeholder=\"Type PickMeUp here\" id=\"compose-text\"></textarea>\n				</div>\n			</div>\n			<div class=\"modal-footer text-center\">\n				<div class=\"row\">\n					<div class=\"col-md-6 col-md-offset-3 text-center\">\n          				<button type=\"button\" class=\"btn btn-info\" id=\"compose-send\">Send PickMeUp!</button>\n          			</div>\n          		</div>\n          	</div>\n		</div>\n	</div>\n</div>\n";
},"useData":true});
templates['index'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials.pickmeup, '			', 'pickmeup', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<div class=\"container\">\n	<div class=\"row\" id=\"header\">\n		<span class=\"left\">\n			<h2>PickMeUp</h2>\n		</span>\n		<span id=\"karma\">\n			You have <span id=\"user-karma\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.karma : stack1), depth0))
    + "</span> karma\n		</span>\n		<span class=\"right\">\n			Signed in as <strong>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.username : stack1), depth0))
    + "</strong> | <a id=\"logout\" href=\"#\">Logout</a>\n		</span>\n	</div>\n\n	<div class=\"row\" id=\"compose-button-row\">\n		<div class=\"col-md-6 col-md-offset-3\">\n			<button class=\"btn btn-info\" id=\"compose-button\">\n				Compose Pickmeup\n			</button>\n		</div>\n	</div>\n\n	<div id=\"modal-container\"></div>\n\n	<div id=\"pickmeups-container\">\n		<h2>Your Pickmeups</h2>\n\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.pickmeups_received : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</div>\n</div>";
},"usePartial":true,"useData":true});
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"container\" id=\"login_container\">\n	<div class=\"row\">\n		<h1>PickMeUp</h1>\n	</div>\n\n	<div class=\"row\">\n		<input placeholder=\"Username\" id=\"username\" type=\"text\" />\n	</div>\n\n	<div class=\"row\">\n		<input placeholder=\"Password\" id=\"password\" type=\"password\" />\n	</div>\n\n	<div class=\"row\" id=\"pw_confirm\">\n		<input placeholder=\"Password Confirm\" id=\"confirm_password\" type=\"password\" />\n	</div>\n\n	<div class=\"row\" id=\"signup_div\">\n		<div>\n			<button class=\"btn btn-info\" id=\"signin\">Sign In</button>\n		</div>\n		<div>\n			New User? <a href=\"#\" id=\"new_user\">Register</a>\n		</div>\n	</div>\n\n	<div class=\"row\" id=\"signin_div\">\n		<div>\n			<button class=\"btn btn-info\" id=\"signup\">Sign Up</button>\n		</div>\n		<div>\n			Returning User? <a href=\"#\" id=\"returning_user\">Sign In</a>\n		</div>\n	</div>\n</div>\n";
  },"useData":true});
templates['pickmeup'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<i class=\"fa fa-unlock\"></i> "
    + escapeExpression(((helper = (helper = helpers.timestamp || (depth0 != null ? depth0.timestamp : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"timestamp","hash":{},"data":data}) : helper)))
    + "\n";
},"3":function(depth0,helpers,partials,data) {
  return "				<i class=\"fa fa-lock\"></i> Locked\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"row pickmeup unlocked-"
    + escapeExpression(((helper = (helper = helpers.unlocked || (depth0 != null ? depth0.unlocked : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"unlocked","hash":{},"data":data}) : helper)))
    + "\" data-pickmeup-id="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n	<div class=\"col-md-6 col-md-offset-3\">\n		<div class = \"pickmeup-bar\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.unlocked : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\n		<div class = \"pickmeup-content\">\n\n		</div>\n	</div>\n</div>";
},"useData":true});
templates['pickmeup_content'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<span class=\"pickmeup-text\">\n	"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "\n</span>\n\n<span class=\"pickmeup-vote right\">\n	Score: "
    + escapeExpression(((helper = (helper = helpers.score || (depth0 != null ? depth0.score : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"score","hash":{},"data":data}) : helper)))
    + "\n\n	<i class=\"fa fa-arrow-up vote-button\" data-vote-direction=\"up\"></i>\n	<i class=\"fa fa-arrow-down vote-button\" data-vote-direction=\"down\"></i>\n</span>";
},"useData":true});
})();
