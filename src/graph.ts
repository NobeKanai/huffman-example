import * as d3 from 'd3'
import { TreeNode } from './huffman';


export const drawGraph = (root: TreeNode | undefined, tableSize: number, huffmanTable: Map<string, string>) => {
    // Draw graph 
    let margin = {
        top: 25,
        right: 5,
        bottom: 5,
        left: 5
    },
        width = (70 * tableSize) - margin.right - margin.left,
        height = (70 * tableSize) - margin.top - margin.bottom;

    d3.select(".graph").selectChildren().remove()
    if (!root || root.weight === undefined) return



    let hierarchyData = d3.hierarchy(root, d => d!.leafs)
    let tree = d3.tree().size([height, width]);

    let svg = d3.select(".graph").append("svg")
        .attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    const nodes = tree(hierarchyData) as d3.HierarchyPointNode<TreeNode>,
        links = nodes.links();


    nodes.descendants().forEach(
        d => {
            d.y = d.depth * 70
        }
    )

    let gNode = svg.selectAll("g.node")
        .data(nodes.descendants())

    let nodeEnter = gNode.enter()
        .append("g")
        .attr("class", "node")
        .attr(
            "transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }
        )

    let circle = nodeEnter.append("circle")
        .attr("r", 0);

    circle.transition()
        .delay(function (d, i) {
            return i * 80;
        })
        .attr("r", 20)
        .style("fill", function (d) {
            return d.children ? '#ddd' : '#FFE066';
        })
        .duration(1000)
        .ease();


    //Enter the char 
    let charText = nodeEnter.append('text')
        .attr('y', 5)
        .attr("text-anchor", "middle")
        .style('font-size', 12);

    charText.transition()
        .delay(function (d, i) {
            return i * 90;
        })
        .text(function (d) {
            return (d.data.symbol || "").replace('\n', '\\n').replace(' ', "' '").replace('\t', '\\t');
        });


    //Enter the path code  0/1
    let pathText = nodeEnter.append('text')
        .attr("y", -30)
        .style('font-size', '10px');

    pathText.transition()
        .delay(function (d, i) {
            return i * 85;
        })
        .text(function (d) {
            return huffmanTable.get(d.data.symbol || "") || ""
        });


    //PATH 
    let path = svg.selectAll("path.link")
        .data(links);

    let pathT = path.enter().insert("path", "g")
        .attr("class", "link");


    pathT.transition()
        .delay(function (d, i) {
            return i * 85;
        })
        .attr("d", function (d) { // 贝塞尔曲线
            return "M" + d.target.x + "," + d.target.y
                + "C" + d.target.x + "," + (d.target.y + d.source.y) / 2
                + " " + d.source.x + "," + (d.target.y + d.source.y) / 2
                + " " + d.source.x + "," + d.source.y;
        });
}