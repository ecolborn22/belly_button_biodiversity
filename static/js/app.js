function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  var metadata = d3.select("#sample-metadata");
  var url = `/metadata/${sample}`;
  console.log(`Building metadata for sample ${sample}.`);

  // Inner function that builds metadata panel
  d3.json(url).then(function(response) {
    console.log(response);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
      .html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => metadata.append("p").text(`${key}: ${value}`));
  });
}

function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    // Build a Pie Chart
    console.log(`Building pie chart for sample ${sample}.`);

    // function taking the first 10 items in each array
    function slicendice (array) {
      return array.slice(0,10);
    }

    // sample_values as values for the pie chart
    // otu_ids as the labels for the pie chart
    // otu_labels as the hovertext for the chart

    var pieData = [{
      values: slicendice(data.sample_values),
      labels: slicendice(data.otu_ids),
      hovertext: slicendice(data.otu_labels),
      type: 'pie'
    }];

    var pieLayout = {
      title: 'Belly Button Pie Chart',
      height: 500,
      width: 500,
      showlegend: false
    };

    Plotly.newPlot('pie', pieData, pieLayout);

    // Build a Bubble Chart using the sample data -- display all data 
    console.log(`Building bubble chart for sample ${sample}.`);
    
    // otu_ids for x values
    // sample_values for y values
    // sample_values for marker size
    // otu_ids for marker colors
    // otu_labels for text values
    console.log(data.otu_ids)
    var bubbleData = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    }];

    var bubbleLayout = {
      title: 'Belly Button Bubble Chart',
      height: 500,
      width: 500,
      showlegend: false,
      xaxis: {
        title: "OTU IDs"
      },
      yaxis: {
        title: "Sample Values"
      } 
    }

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
