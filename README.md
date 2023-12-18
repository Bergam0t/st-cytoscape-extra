# st-cytoscape-extra

`st-cytoscape-extra` is a [Streamlit](https://streamlit.io) component to embed a [Cytoscape.js](https://js.cytoscape.org/) graph and get the selected nodes and edges in return.

THIS WILL NOT YET WORK WITHOUT ADDITIONAL SETUP AS IT HAS NOT BEEN FINALISED AND UPLOADED TO PYPI. 
It can be installed, but the repo will also need to be cloned and a development server run. 
Initial release is likely to be in late December 2023, or merged with the original st-cytoscape package as a pull request. 
Alongside this, a sample app using all features will be released.

## Additions from st-cytoscape

This is based on the st-cytoscape package. However, several additional cytoscape.js extensions have been incorporated into this version.

- Tooltips for nodes or edges on mouseover using popper.js and tippy.js
- Toolbar for zooming
- Navigator window (optional) for birds-eye overview of network
- Additional layouts (avsdf, elk, cola, dagre, cise)

## Installation

```bash
# pip install st-cytoscape
pip install git+https://github.com/Bergam0t/st-cytoscape-extra#egg=st-cytoscape-extra
```

## Quickstart

```python
import streamlit as st
from st_cytoscape_extra import cytoscape

elements = [
    {"data": {"id": "X"}, "selected": True, "selectable": False},
    {"data": {"id": "Y"}},
    {"data": {"id": "Z"}},
    {"data": {"source": "X", "target": "Y", "id": "X➞Y"}},
    {"data": {"source": "Z", "target": "Y", "id": "Z➞Y"}},
    {"data": {"source": "Z", "target": "X", "id": "Z➞X"}},
]

stylesheet = [
    {"selector": "node", "style": {"label": "data(id)", "width": 20, "height": 20}},
    {
        "selector": "edge",
        "style": {
            "width": 3,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
        },
    },
]

selected = cytoscape(elements, stylesheet, key="graph")

st.markdown("**Selected nodes**: %s" % (", ".join(selected["nodes"])))
st.markdown("**Selected edges**: %s" % (", ".join(selected["edges"])))
```

## Usage

**cytoscape (elements,
    stylesheet,
    width="100%",
    height="300px",
    layout={"name": "fcose", "animationDuration": 0},
    selection_type="additive",
    user_zooming_enabled=True,
    user_panning_enabled=True,
    min_zoom=1e-50,
    max_zoom=1e50,
    key=None
)**

Embeds a Cytoscape.js graph and returns a dictionary containing the list of the ids of selected nodes ("nodes" key) and the list of the ids of the selected edges ("edges" key)

### Parameters

- `elements` (list): the list of nodes and edges of the graph
    (cf. https://js.cytoscape.org/#notation/elements-json)
- `stylesheet` (list): the style used for the graph (cf. https://js.cytoscape.org/#style)
- `width` (string): the CSS width attribute of the graph's container
- `height` (string): the CSS height attribute of the graph's container
- `layout` (dict): the layout options for the graph (cf. https://js.cytoscape.org/#layouts)
- `seletion_type` (string: "single" or "additive"): cf. https://js.cytoscape.org/#core/initialisation
- `user_zooming_enabled` (boolean): cf. https://js.cytoscape.org/#core/initialisation
- `user_panning_enabled` (boolean): cf. https://js.cytoscape.org/#core/initialisation
- `min_zoom` (float): cf. https://js.cytoscape.org/#core/initialisation
- `max_zoom` (float): cf. https://js.cytoscape.org/#core/initialisation
- `key` (str or None): an optional key that uniquely identifies this component. If this is None, and the component's arguments are changed, the component will be re-mounted in the Streamlit frontend and lose its current state

## Tooltips
Instructions to follow

## Zoom Bar
Instructions to follow

## Navigator window 
Instructions to follow

## Advanced layout options

### fCoSE

`st-cytoscape` includes `fCoSE`, a Cytoscape.js [extension](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose) offering an elegant force-directed layout. You can then use `{"name": "fcose", ...}` as an argument for `layout`, instead of Cytoscape.js' [native layout options](https://js.cytoscape.org/#layouts).

A nice feature of `fcose` is that it can enforce [placement constraints](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose#documentation), such as:

```python
layout = {"name": "fcose", "animationDuration": 0}
layout["alignmentConstraint"] = {"horizontal": [["X", "Y"]]}
layout["relativePlacementConstraint"] = [{"top": "Z", "bottom": "X"}]
layout["relativePlacementConstraint"] = [{"left": "X", "right": "Y"}]
```

### klay
You can now similarly use the `klay` layout, using the `cytoscape-klay` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-klay).  

To use it simply name it in the layout:

```Python
layout = {"name": "klay"}
```

### cise

You can now also use the `cise` layout, using the `cytoscape-cise` add-on for Cytoscape.js - [extension](https://github.com/iVis-at-Bilkent/cytoscape.js-cise).  

The `cise` layout requires some extra parameters to be passed - it is not enough to just pass the name of the layout as a parameter.
Specifically, the other mandatory parameter is clusters, which must be passed as a list of lists, where each sublist contains the nodes that should belong to each cluster.

```Python
layout = {
"name": "cise",
"clusters": [
    ["node1", "node4"],
    ["node2", "node6", "node7"],
    ["node3", "node5"],
    ["node8"]
    ]
}
```

### avsdf

You can now also use the `avsdf` layout, using the `cytoscape-avsdf` add-on for Cytoscape.js - [extension](https://github.com/iVis-at-Bilkent/cytoscape.js-avsdf).  

To use it simply name it in the layout:

```Python
layout = {"name": "avsdf"}
```

### elk

You can now also use the `elk` layout, using the `cytoscape-elk` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-elk).  

To use it simply name it in the layout:

```Python
layout = {"name": "elk"}
```

### cola

The `cola` layout is also included using the `cytoscape-cola` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-cola).  

To use it simply name it in the layout:

```Python
layout = {"name": "cola"}
```

### dagre

You can now also use the `dagre` layout, using the `cytoscape-dagre` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-dagre).  To use it simply name it in the layout:

```Python
layout = {"name": "dagre"}
```

