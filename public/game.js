function download(lvl){
	$.ajax({
		url: "/get_save",

		data: {
			level: lvl
		},

		type: "GET",

		dataType: "text",

		success: function(save){



			cy = cytoscape({
				container: document.getElementById('cy'),
			  
				style: cytoscape.stylesheet()
				.selector('node')
					.css({
						'content': 'data(id)'
		      		})
				.selector('edge')
					.css({
						'target-arrow-shape': 'triangle',
						'width': 4,
						'line-color': '#ddd',
						'target-arrow-color': '#ddd',
						'content': 'data(label)'
					})
				.selector('.highlighted')
					.css({
						'background-color': '#61bffc',
						'line-color': '#61bffc',
						'target-arrow-color': '#61bffc',
						'transition-property': 'background-color, line-color, target-arrow-color',
						'transition-duration': '0.5s'
					}),
			  
			  	elements: JSON.parse(save),

			  	layout: {name: "preset", fit: true}
			});
		},

		error: function(xhr,status,errorThrown){
			instantiate();
		}
	})
}

function instantiate(){
	cy = cytoscape({
		container: document.getElementById('cy'),
	  
		style: cytoscape.stylesheet()
		.selector('node')
			.css({
				'content': 'data(id)'
      		})
		.selector('edge')
			.css({
				'target-arrow-shape': 'triangle',
				'width': 4,
				'line-color': '#ddd',
				'target-arrow-color': '#ddd',
				'content': 'data(label)'
			})
		.selector('.highlighted')
			.css({
				'background-color': '#61bffc',
				'line-color': '#61bffc',
				'target-arrow-color': '#61bffc',
				'transition-property': 'background-color, line-color, target-arrow-color',
				'transition-duration': '0.5s'
			}),
	  
		layout: {
			name: 'breadthfirst',
			directed: true,
			roots: '#a',
			padding: 10
		}
	});
}

function upload(save,lvl){
	$.ajax({
		url: "/post_save",

		data: {
			save: save,
			level: lvl
		},

		type: "POST",

		dataType: "text",

		success: function(){
			// alert('success');
		}
	})
}

function evaluate(val){
	cy.$('node[id="x"]').data("label",val);
	return traverse(cy.$('node[id="out"]'));
}

function traverse(node){
	//if node has integer id, return that integer
	//otherwise, return its two children, 
	//put together with the function defined from the edges

	label = node.data('label');
	if (label==parseInt(label)){
		return parseInt(label);
	}else{
		var edges = cy.$('edge[target=\"'+label+'\"]');
		var func = edges[0].data('label');
		var arg1_id = edges[0].data('source');
		var arg2_id = edges[1].data('source');

		console.log(arg1_id);
		console.log(arg2_id);
	

		var arg1_node = cy.$('node[id=\"'+arg1_id+'\"]');
		var arg2_node = cy.$('node[id=\"'+arg2_id+'\"]');
		switch(func){
			case "%":
				return traverse(arg1_node) % traverse(arg2_node);
				break;
			case "=":
				if (traverse(arg1_node) == traverse(arg2_node))
					return 1;
				else
					return 0;
				break;
			case "-":
				return traverse(arg1_node) - traverse(arg2_node);
				break;
			case ">":
				if (traverse(arg1_node) > traverse(arg2_node))
					return 1;
				else
					return 0;
				break;
		}
	}
}



$(document).ready(function(){// on dom ready
	cur_level = parseInt($('#level').attr('title'));
	if (cur_level == 2){
		$('#level').html("<p></p><h2>Level 2: Write a function that takes an integer between 1 and 100 inclusive, and returns 1 if it is closer to 1 and 0 if it is closer to 100</h2><p></p>");
	}
	$("#f_submit").click(function(){
		// console.log("click");

		var arg1 = $('#arg1').val();
		var arg2 = $('#arg2').val();
		var f_name = $('#func_name').val();
		var out_name = $('#out').val();

		$('#arg1').val('');
		$('#arg2').val('');
		$('#func_name').val('');
		$('#out').val('');

		var pos_y = 50;
		var pos_x = 50;
		offset1 = 0;
		offset2 = 100;

		if (cy.getElementById(arg1).id()){
			pos_x = cy.getElementById(arg1).position('x');
			pos_y = cy.getElementById(arg1).position('y');
			
		}else if (cy.getElementById(arg2).id()){
			pos_x = cy.getElementById(arg2).position('x');
			pos_y = cy.getElementById(arg2).position('y');
			offset1 = -100;
			offset2 = 0;
		}

		cy.add([
			{ group: "nodes", data: { id: arg1, label: arg1, }, position: { x: pos_x+offset1, y: pos_y } },
			{ group: "nodes", data: { id: arg2, label: arg2 }, position: { x: pos_x+offset2, y: pos_y } },
			{ group: "nodes", data: { id: out_name, label: out_name }, position: { x: (pos_x+offset1+pos_x+offset2)/2, y: pos_y+50 } },
			{ group: "edges", data: { id: arg1+out_name, label: f_name, source: arg1, target: out_name } },
			{ group: "edges", data: { id: arg2+out_name, label: f_name, source: arg2, target: out_name } }
		]);

		cy = cy.fit();

		var save = cy.elements().jsons();

		upload(JSON.stringify(save),cur_level);

		// cy.remove(cy.elements());

		// console.log(JSON.stringify(save));

		// setTimeout(function(){
		// 	cy.add(JSON.parse(JSON.stringify(save)));
		// },5000)
		// cy.add(save);

		// console.log(save);



		// cy.add([
		// 	{ group: "nodes", data: { id: arg1 }, position: { x: pos_x, y: pos_y } },
		// 	{ group: "nodes", data: { id: arg2 }, position: { x: pos_x+100, y: pos_y+100 } },
		// 	{ group: "nodes", data: { id: out_name }, position: { x: pos_x+100, y: pos_y } },
		// 	{ group: "edges", data: { id: arg1+out_name, label: f_name, source: arg1, target: out_name } },
		// 	{ group: "edges", data: { id: arg2+out_name, label: f_name, source: arg2, target: out_name } }
		// ]);

	});
	
	$("#f_eval").click(function(){
		console.log(cur_level);
		if (parseInt(cur_level) == 1){
			if (evaluate(2) == 1 && evaluate(1) == 0 &&
				evaluate(0) == 1 && evaluate(-1) == 0){
					$("#response").html("SUCCESS!");
					$('#response').append("<p><button id='next_button'>Go to next level!</button></p>");
					$("#next_button").click(function(){
						cur_level = parseInt(cur_level)+1;
						$.post("/update_level", {lvl: cur_level});
						$("#response").html("");
						$("#next_button").remove();
						download(cur_level);
						$('#level').html("<p></p><h2>Level 2: Write a function that takes an integer between 1 and 100 inclusive, and returns 1 if it is closer to 1 and 0 if it is closer to 100</h2><p></p>");
					});
				}
			else
				$("#response").html("FAILURE!");
		}
		if (parseInt(cur_level) == 2){
			if (evaluate(1) == 1 && evaluate(100)==0 && evaluate(50) == 1 && evaluate(51)==0){
					$("#response").html("SUCCESS! YOU WIN!");
				}
			else
				$("#response").html("FAILURE!");
		}
	});

	

	$("#soln_delete").click(function(){
		upload("[]",cur_level);
		instantiate();
	});


	download(cur_level);

}); // on dom ready
