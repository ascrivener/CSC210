// function getImage(lvl){
// 	$("#header").replaceWith("<h1 id='header'>Level "+lvl+": Draw your sketch below. (Allow up to 5 seconds for drawing to finish uploading to server)</h1>");

// 	var str = "<canvas id='"+lvl+"' width='400' height='400' style='border:1px solid #000000;'></canvas>";

// 	$("canvas").replaceWith(str);

	
// 	$.ajax({
// 			url: "/get_image",

// 			data: {
// 				// name: "<%= name %>",
// 				level: lvl
// 			},

// 			type: "GET",

// 			dataType: "text",

// 			success: function(dataURL){
// 				// console.log(dataURL);
// 				// $("canvas").attr("id","canvas"+lvl);
// 				var canvas = $("canvas").get(0);

// 				var context = canvas.getContext('2d');

// 				var imageObj = new Image();

// 				imageObj.onload = function(){
// 					context.drawImage(this,0,0);
// 				};

// 				imageObj.scy.rc = dataURL;

				
// 				// var str = "background: url("+dataURL+")";


// 				// $("canvas").attr("style",str);
// 			},

// 			error: function(xhr,status,errorThrown){
// 				// $("canvas").sketch();
// 				// $("#header").replaceWith(errorThrown);
// 			}
// 	})

// 	$("canvas").click(function(){
// 		console.log(this.toDataURL());
// 		postImage(this.id,this.toDataURL());
// 		// console.log($("canvas").get(0).toDataURL());
// 	})

// 	$("canvas").sketch();
// }

// function postImage(lvl,dataURL){
// 	$.ajax({
// 			url: "/post_image",

// 			data: {
// 				// name: "<%= name %>",
// 				level: lvl,
// 				data: dataURL
// 			},

// 			type: "POST",

// 			dataType: "text",

// 			success: function(){
// 				alert('success');
// 			}
// 	})
// }

function download(){
	$.ajax({
		url: "/get_save",

		type: "GET",

		dataType: "text",

		success: function(save){
			// cy = cytoscape({
			// 	elements: JSON.parse(save)
			// })

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

			  // 	elements: {
			  // 		nodes: [
					// 	{ data: { id: 'x' } },
					// 	{ data: { id: '2' } },
					// 	{ data: { id: 'a' } },
					// 	{ data: { id: '0' } },
					// 	{ data: { id: 'out' } }
					// ], 
			      
					// edges: [
					// 	{ data: { id: 'xa', source: 'x', target: 'a' } },
					// 	{ data: { id: '2a', source: '2', target: 'a' } },
					// 	{ data: { id: 'aout', source: 'a', target: 'out' } },
					// 	{ data: { id: '0out', source: '0', target: 'out' } }
					// ]
			  //   },

			  	layout: {name: "preset", fit: true}
			  
				// layout: {
				// 	name: 'breadthfirst',
				// 	directed: true,
				// 	roots: '#a',
				// 	padding: 10
				// }
			});
		},

		error: function(xhr,status,errorThrown){
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
			  

			  // 	elements: {
			  // 		nodes: [
					// 	{ data: { id: 'x' } },
					// 	{ data: { id: '2' } },
					// 	{ data: { id: 'a' } },
					// 	{ data: { id: '0' } },
					// 	{ data: { id: 'out' } }
					// ], 
			      
					// edges: [
					// 	{ data: { id: 'xa', source: 'x', target: 'a' } },
					// 	{ data: { id: '2a', source: '2', target: 'a' } },
					// 	{ data: { id: 'aout', source: 'a', target: 'out' } },
					// 	{ data: { id: '0out', source: '0', target: 'out' } }
					// ]
			  //   },
			  
				layout: {
					name: 'breadthfirst',
					directed: true,
					roots: '#a',
					padding: 10
				}
			});
		}
	})
}

function upload(save){
	$.ajax({
		url: "/post_save",

		data: {
			save: save
		},

		type: "POST",

		dataType: "text",

		success: function(){
			// alert('success');
		}
	})
}

$(document).ready(function(){// on dom ready

	$("#f_submit").click(function(){

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

		if (cy.getElementById(arg1).id()){
			// console.log(cy.getElementById(arg1).position('x'));
			pos_x = cy.getElementById(arg1).position('x');
			pos_y = cy.getElementById(arg1).position('y');
			cy.add([
				{ group: "nodes", data: { id: arg1 }, position: { x: pos_x, y: pos_y } },
				{ group: "nodes", data: { id: arg2 }, position: { x: pos_x+100, y: pos_y+100 } },
				{ group: "nodes", data: { id: out_name }, position: { x: pos_x+100, y: pos_y } },
				{ group: "edges", data: { id: arg1+out_name, label: f_name, source: arg1, target: out_name } },
				{ group: "edges", data: { id: arg2+out_name, label: f_name, source: arg2, target: out_name } }
			]);
		}

		else if (cy.getElementById(arg2).id()){
			// console.log(cy.getElementById(arg1).position('x'));
			pos_x = cy.getElementById(arg2).position('x');
			pos_y = cy.getElementById(arg2).position('y');
			cy.add([
				{ group: "nodes", data: { id: arg1 }, position: { x: pos_x+100, y: pos_y+100 } },
				{ group: "nodes", data: { id: arg2 }, position: { x: pos_x, y: pos_y } },
				{ group: "nodes", data: { id: out_name }, position: { x: pos_x+100, y: pos_y } },
				{ group: "edges", data: { id: arg1+out_name, label: f_name, source: arg1, target: out_name } },
				{ group: "edges", data: { id: arg2+out_name, label: f_name, source: arg2, target: out_name } }
			]);
		}else {
			cy.add([
				{ group: "nodes", data: { id: arg1 }, position: { x: pos_x, y: pos_y } },
				{ group: "nodes", data: { id: arg2 }, position: { x: pos_x+100, y: pos_y+100 } },
				{ group: "nodes", data: { id: out_name }, position: { x: pos_x+100, y: pos_y } },
				{ group: "edges", data: { id: arg1+out_name, label: f_name, source: arg1, target: out_name } },
				{ group: "edges", data: { id: arg2+out_name, label: f_name, source: arg2, target: out_name } }
			]);
		}

		var save = cy.elements().jsons();

		upload(JSON.stringify(save));

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

	

	download();
	// console.log(save);

	// if (save){
	// 	cy.add(JSON.parse(save));
	// }
	  
	// var bfs = cy.elements().bfs('#a', function(){}, true);

	// var i = 0;
	// var highlightNextEle = function(){
	//   bfs.path[i].addClass('highlighted');
	  
	//   if( i < bfs.path.length ){
	//     i++;
	//     setTimeout(highlightNextEle, 1000);
	//   }
	// };

	// // kick off first highlight
	// highlightNextEle();

}); // on dom ready


	// plumb();
	// getImage(1);
	
	// $("canvas").sketch();
	// $("canvas").click(function(){
	// 	postImage(this.id,$("canvas").get(0).toDataURL());
	// })
	// $("button").click(function(){
		// getImage(this.id);

		// switch (this.id){
		// 	case "l1":
		// 		console.log("test");
		// 		break;
		// 	case "l2":
		// 		console.log("test2");
		// 		break;
		// 	case "l3":
		// 		console.log("test3");
		// 		break;
		// 	case "l4":
		// 		console.log("test4");
		// 		break;
		// 	case "l5":
		// 		console.log("test5");
		// 		break;
		// }
	// })