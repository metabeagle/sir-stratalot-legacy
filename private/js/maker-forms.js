$(document).ready(function(){

// makers/new view form

	$("#makerKind1").on("change", function(){
		if($(this).is(":checked") === true){
			if($("#personName").is(":hidden") === true){
				$("#personName").show();
			}
			$("#orgName").hide();
		}
	});

	$("#makerKind2").on("change", function(){
		if($(this).is(":checked") === true){
			if($("#orgName").is(":hidden") === true){
				$("#orgName").show();
			}
			$("#personName").hide();
		}
	});

// makers/new and edit forms

	$("#addChannel").click(function(){
		var $channelRow = $(".makerChannelRow:last");
		var newChannelIndex = $(".makerChannelRow").length;
		var $newChannelRow = $channelRow.clone();
		$newChannelRow.find("input").each(function(){
			$(this)
				.attr("name", $(this).attr("name")
					.replace(/\[\d+\]/, `[${ newChannelIndex }]`))
					.val("");
		});
		$newChannelRow.appendTo("#makerChannels");
	});

	$("#makerChannels").on("click", ".removeChannel", function(){
		$(this).parent().parent().remove();
		reIndex();
	});

});

function reIndex(){
	$(".makerChannelRow").each(function(index){
		$(this).find("input").each(function(){
			$(this)
				.attr("name", $(this).attr("name")
					.replace(/\[\d+\]/, `[${ index }]`));
		});
	});
}