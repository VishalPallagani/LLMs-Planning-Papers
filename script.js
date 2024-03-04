var treeData = [
    {
      "name": "LLMs in APS",
      "children": [
        {
          "name": "Language Translation",
          "description": "Involves converting natural language into structured planning languages or formats like PDDL and vice-versa, enhancing the interface between human linguistic input and machine-understandable planning directives.",
        },
        {
          "name": "Plan Generation",
          "description": "Entails the creation of plans or strategies directly by LLMs, focussing on generating actionable sequences or decision-making processes.",
        },
        {
          "name": "Model Construction",
          "description": "Utilizes LLMs to construct or refine world and domain models essential for accurate and effective planning.",
        },
        {
          "name": "Multi-agent Planning",
          "description": "Focusses on scenarios involving multiple agents, where LLMs contribute to coordination and cooperative strategy development.",
        },
        {
          "name": "Interactive Planning",
          "description": "Centers on scenarios requiring iterative feedback or interactive planning with users, external verifiers, or environment, emphasizing the adaptability of LLMs to dynamic inputs.",
        },
        {
          "name": "Heuristics Optimization",
          "description": "Applies LLMs in optimizing planning processes through refining existing plans or providing heuristic assistance to symbolic planners.",
        },
        {
          "name": "Tool Integration",
          "description": "Encompasses studies where LLMs act as central orchestrators or coordinators in a tool ecosystem, interfacing with planners, theorem provers, and other systems.",
        },
        {
          "name": "Brain-inspired Planning",
          "description": "Covers research focussing on LLM architectures inspired by neurological or cognitive processes, particularly to enhance planning capabilities.",
        }
      ]
    }
  ];
  
  
  
  // ************** Generate the tree diagram	 *****************
  var margin = {top: 100, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left;

    var baseHeight = 500; 

    function calculateMaxDepth(data, depth = 0) {
        if (!data.children || data.children.length === 0) return depth;
        return Math.max(...data.children.map(child => calculateMaxDepth(child, depth + 1)));
    }
    
    // Use this function to find maxDepth from the root of your tree data
    var maxDepth = calculateMaxDepth(treeData[0]);
    

    var totalHeight = baseHeight + (maxDepth * 180); 

        
  var i = 0,
      duration = 750,
      root;
  
  var tree = d3.layout.tree()
      .size([totalHeight, width]);
  
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
  
  var svg = d3.select(".visualization-container").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", totalHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  root = treeData[0];
  root.x0 = totalHeight / 2;
  root.y0 = 0;
    
  update(root);
  
//   d3.select(self.frameElement).style("height", "500px");
  
  function update(source) {
  
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });
  
    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);
  
    
    nodeEnter.each(function(d) {
        var node = d3.select(this);
    
        // Append text first to measure it
        var text = node.append("text")
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) { return d.parent ? "start" : "end"; })
                        .text(function(d) { return d.name; })
                        .style("font-size", "15px");
    
        // Measure text to determine rect size
        var bbox = text.node().getBBox();
        var rectWidth = bbox.width + 20; // Assuming 20px total horizontal padding for the rect
        var rectHeight = bbox.height + 10; // Assuming 10px total vertical padding for the rect
    
        // Store the computed width in the node data for later use in link positioning
        d.rectWidth = rectWidth;
    
        // Adjust text position based on whether it has children or not
        // Note: You might need to adjust these values based on the actual rectWidth and desired appearance
        text.attr("x", function(d) { return d.parent ? 35 : -25; });
    
        // Append rect for background, now using measured dimensions
        var rect = node.insert("rect", "text") // Insert rect behind the text
                        .attr("x", function(d) { return d.parent ?  bbox.x +25: bbox.x-35; })
                        .attr("y", bbox.y - 5) // 5px padding on the top
                        .attr("width", rectWidth)
                        .attr("height", rectHeight)
                        .style("fill", function(d) { 
                            if (d.name === "LLMs in APS") {
                                return "lightsteelblue";
                            } else {
                                return "lightgreen";
                            }
                         })
                        .style("stroke", "black")
                        .style("stroke-width", "1px")
                        .style("rx", "5px") // Rounded corners
                        .style("ry", "5px");
    });
        
  
    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
  
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
  
    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
  
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .style("stroke-width", "2px")
        .style("stroke", "black")
        .style("fill", "black")
        .style("fill-opacity", 0)
        .attr("d", function(d) {
            if (d === root) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            }
            else {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            }
            // var o = {x: source.x0, y: source.y0};
            // return diagonal({source: o, target: o});
        });
      
  
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);
  
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            if (d === root) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            }
            else {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            }
        })
        .remove();
  
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
    console.log(d);
    console.log(d.name);
}

// for each children in the tree do click
treeData[0].children.forEach(click);
