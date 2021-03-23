// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
// let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
// let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
// let topGames_width = MAX_WIDTH / 2, topGames_height = 350;s

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    return data.sort(comparator).slice(0, numExamples);
};

function getUniques(data, attr) {
  return d3.map(data, function(d){return d[attr]}).keys().sort();
};

function filterYear(data, year, attr) {
    if (year == "All") {
      return data
    } else {
      return data.filter(function(a) { return a[attr] === (year); });
    }
};

function update_yearSelect(years, elementID) {
  let select = document.getElementById(elementID);
  // console.log(select[0].value);
  let newList = [];
  for(i = 0; i < years.length; i++) {
    let year = years[i];
    let isNew = true;
    for(j = 0; j < select.length; j++) {
      // console.log(j);
      if (select[j].value == year) {
        isNew = false;
        break;
      }
    }

    if (isNew) {
      newList.push(year);

    }
  }
  for (i = 0; i < newList.length; i++) {
    let year = newList[i];
    let newOption = new Option(year, year);
    select.add(newOption, undefined);
  }
};
