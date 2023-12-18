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

## Standard layout options

`st-cytoscape` supports the following built-in layout options that are bundled in cytoscape.js.

### Circle
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/6e53622d-54b1-4b68-b3d0-5ebc955d465a)

```Python
layout = {"name": "circle"}
```

### Random
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/45660f57-c880-447f-a22e-18080c891016)

```Python
layout = {"name": "random"}
```

### Grid

![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/e8fe9aa5-c70c-42fe-935d-9523592414da)

```Python
layout = {"name": "grid"}
```

### Concentric

![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/c23ca258-c537-4eb1-b702-995311e77528)

```Python
layout = {"name": "concentric"}
```

### Breadthfirst
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/03608008-6f93-46e4-ba5d-f628ef9156f5)

```Python
layout = {"name": "breadthfirst"}
```

### cose

![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/3a2f83fc-0dbb-40c5-aac1-efe8cd466a15)

```Python
layout = {"name": "cose"}
```

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

![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/c2237cc7-aa85-4015-b828-c0ab51979091)

### klay
You can now similarly use the `klay` layout, using the `cytoscape-klay` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-klay).  

To use it simply name it in the layout:

```Python
layout = {"name": "klay"}
```
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/353840d6-48e3-4711-8854-c9a951dcff65)


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
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/b0815935-d1da-417c-b88c-7e12df4ab7db)


### avsdf

You can now also use the `avsdf` layout, using the `cytoscape-avsdf` add-on for Cytoscape.js - [extension](https://github.com/iVis-at-Bilkent/cytoscape.js-avsdf).  

To use it simply name it in the layout:

```Python
layout = {"name": "avsdf"}
```
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/19fd1778-c606-4d8a-b0cb-df5e496088f1)


### elk

You can now also use the `elk` layout, using the `cytoscape-elk` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-elk).  

To use it simply name it in the layout:

```Python
layout = {"name": "elk"}
```
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/790bbdfd-bc6a-4b07-aff9-1848e1cef6b6)


### cola

The `cola` layout is also included using the `cytoscape-cola` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-cola).  

To use it simply name it in the layout:

```Python
layout = {"name": "cola"}
```

![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/f493cefc-396e-4323-b303-cde23a4bf4f8)


### dagre

You can now also use the `dagre` layout, using the `cytoscape-dagre` add-on for Cytoscape.js - [extension](https://github.com/cytoscape/cytoscape.js-dagre).  To use it simply name it in the layout:

```Python
layout = {"name": "dagre"}
```
![image](https://github.com/Bergam0t/st-cytoscape-extra/assets/29951987/0d67c9e2-3f22-4b5b-a446-6dddc143198d)

