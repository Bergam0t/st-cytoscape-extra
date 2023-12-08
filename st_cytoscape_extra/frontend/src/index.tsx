import {
  Streamlit,
  RenderData
} from "streamlit-component-lib"
// @ts-ignore
import cytoscape from 'cytoscape';
// @ts-ignore
import fcose from 'cytoscape-fcose';
// @ts-ignore
import klay from 'cytoscape-klay';
// @ts-ignore
import avsdf from 'cytoscape-avsdf';
// @ts-ignore
import elk from 'cytoscape-elk';
// @ts-ignore
import dagre from 'cytoscape-dagre';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import cise from 'cytoscape-cise';
// // @ts-ignore
// import euler from 'cytoscape-euler';
// @ts-ignore
import spread from 'cytoscape-spread';
// @ts-ignore
import popper from 'cytoscape-popper';
import tippy from "tippy.js";
import {hideAll} from 'tippy.js';


import 'cytoscape-navigator/cytoscape.js-navigator.css'
import 'cytoscape-panzoom/cytoscape.js-panzoom.css'
import "tippy.js/dist/tippy.css";

var navigator = require('cytoscape-navigator');
var panzoom = require('cytoscape-panzoom');

var defaults = {
  container: false // string | false | undefined. Supported strings: an element id selector (like "#someId"), or a className selector (like ".someClassName"). Otherwise an element will be created by the library.
, viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
, thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
, thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
, dblClickDelay: 200 // milliseconds
, removeCustomContainer: true // destroy the container specified by user on plugin destroy
, rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
};

var defaultsPanZoom = {
  zoomFactor: 0.05, // zoom factor per zoom tick
  zoomDelay: 45, // how many ms between zoom ticks
  minZoom: 0.1, // min zoom level
  maxZoom: 10, // max zoom level
  fitPadding: 50, // padding when fitting
  panSpeed: 10, // how many ms in between pan ticks
  panDistance: 10, // max pan distance per tick
  panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
  panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
  panInactiveArea: 8, // radius of inactive area in pan drag box
  panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
  zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
  fitSelector: undefined, // selector of elements to fit
  animateOnFit: function(){ // whether to animate on fit
    return false;
  },
  fitAnimationDuration: 1000, // duration of animation on fit

  // icon class names
  sliderHandleIcon: 'fa fa-minus',
  zoomInIcon: 'fa fa-plus',
  zoomOutIcon: 'fa fa-minus',
  resetIcon: 'fa fa-expand'
};

// Register navigation extensions
navigator(cytoscape); // register extension
panzoom(cytoscape); // register extension

// Register layout extensions
cytoscape.use(fcose);
cytoscape.use(klay);
cytoscape.use(avsdf);
cytoscape.use(elk);
cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(cise);
// cytoscape.use(euler);
cytoscape.use(spread);

// Register tooltip extensions
cytoscape.use( popper );

const div = document.body.appendChild(document.createElement("div"));
let args = '';

function updateComponent(cy: any) {
  Streamlit.setComponentValue({
    'nodes': cy.$('node:selected').map((x: any) => x['_private']['data']['id']),
    'edges': cy.$('edge:selected').map((x: any) => x['_private']['data']['id'])
  })
}

function makeHoverNodeTippy(node:any) {
  // let node = cy.nodes();
  let ref = node.popperRef(); // used only for positioning

  // A dummy element must be passed as tippy only accepts dom element(s) as the target
  // https://atomiks.github.io/tippyjs/v6/constructor/#target-types
  let dummyDomEle = document.createElement("div");

  let tip = tippy(dummyDomEle, {
    // tippy props:
    getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
    trigger: "manual", // mandatory, we cause the tippy to show programmatically.

    // your own custom props
    // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
    content: () => {
      let content = document.createElement("div");

      content.innerHTML = "Character: ".concat(node.map((x: any) => x['_private']['data']['Label'])).concat("<br/>Total Interactions: ").concat(node.map((x: any) => x['_private']['data']['TotalInteractions']));

      return content;
    }
  });

  tip.show();
}

function makeHoverEdgeTippy(edge:any) {
  // let node = cy.nodes();
  let ref = edge.popperRef(); // used only for positioning

  // A dummy element must be passed as tippy only accepts dom element(s) as the target
  // https://atomiks.github.io/tippyjs/v6/constructor/#target-types
  let dummyDomEle = document.createElement("div");

  let tip = tippy(dummyDomEle, {
    // tippy props:
    getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
    trigger: "manual", // mandatory, we cause the tippy to show programmatically.

    // your own custom props
    // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
    content: () => {
      let content = document.createElement("div");

      content.innerHTML = "Interactions between ".concat(edge.map((x: any) => x['_private']['data']['source'])).concat(" and ").concat(edge.map((x: any) => x['_private']['data']['target'])).concat(": ").concat(edge.map((x: any) => x['_private']['data']['Weight']));

      return content;
    }
  });

  tip.show();
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail
  let newArgs = JSON.stringify(data.args);
  if (!data.args["key"] || args !== newArgs) {
    args = newArgs;

    // Update the dimension of the graph's container
    div.style.width = data.args["width"];
    div.style.height = data.args["height"];

    // Take into account the Streamlit theme
    let nodeColor: any[] = [];
    if (data.theme) {
      if (data.theme?.backgroundColor) {
        div.style.background = data.theme.backgroundColor;
      }
      nodeColor = [{
        selector: "node:selected",
        style: {
          backgroundColor: data.theme?.primaryColor
        }
      }, {
        selector: "node",
        style: {
          color: data.theme?.textColor,
          fontFamily: data.theme?.font
        }
      }, {
        selector: "edge:selected",
        style: {
          targetArrowColor: data.theme?.primaryColor,
          lineColor: data.theme?.primaryColor
        }
      }]
    }

    //Create the Cytoscape Graph
    let cy = cytoscape({
      container: div,
      elements: data.args["elements"],
      style: data.args["stylesheet"].concat(nodeColor),
      layout: data.args["layout"],
      selectionType: data.args["selectionType"],
      userZoomingEnabled: data.args["userZoomingEnabled"],
      userPanningEnabled: data.args["userPanningEnabled"],
      minZoom: data.args["minZoom"],
      maxZoom: data.args["maxZoom"],
    }).on('select unselect', function () {
      updateComponent(cy);
    }).on('mouseover', 'node', function(e:any) {
      var hoverNode = e.target;
      makeHoverNodeTippy(hoverNode)
    }).on('mouseover', 'edge', function(e:any) {
      var hoverEdge = e.target;
      makeHoverEdgeTippy(hoverEdge)
    }).on('mouseout', function(e:any) {
      // Workaround - hide all tippy (as haven't yet worked
      // out how to destroy individual)
      hideAll({duration: 0});
    });

    if (data.args["showBirdseye"] ){
      var nav = cy.navigator( defaults );
    }

    // add the panzoom control
    cy.panzoom( defaultsPanZoom );

    // cy.ready(function() {
    //   cy.elements().forEach(function(ele:any) {
    //     //console.log(ele);
    //     makePopperWithTippy(ele);
    //   });
    // });

    // cy.nodes().unbind("mouseover");
    // cy.nodes().bind("mouseover", (event:any) => {
    //   console.log("id = ", event.target.id());
    //   // event.target.id().show();
    // });

    // cy.nodes().unbind("mouseout");
    // cy.nodes().bind("mouseout", (event:any) => {
    //   console.log("id = ", event.target.id());
    // //  event.target.id().hide();
    // });

    updateComponent(cy);
  }

  Streamlit.setFrameHeight()
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady()

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
Streamlit.setFrameHeight()
