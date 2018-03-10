function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
   
    //v = v.replace(
    //    /\b(?:precarious generation)|(?:generation precarious)\b/g,
    //    "gargouille"
    //);

    v = v.replace(/imo/ig, 'in my opinion');
    v = v.replace(/imho/ig, 'in my humble opinion');
    v = v.replace(/2moro/ig, 'tomorrow');
    v = v.replace(/2night/ig, 'tonight');
    v = v.replace(/brb/ig, 'be right back');
    v = v.replace(/btw/ig, 'by the way');
    v = v.replace(/b4n/ig, 'bye for now');
    v = v.replace(/bcnu/ig, 'be seeing you');
    v = v.replace(/lol/ig, 'haha');
    v = v.replace(/dbeyr/ig, "don't believe everything you read");
    v = v.replace(/dilligas/ig, 'do I look like I give a shit');
    v = v.replace(/fud/ig, 'Fear, Uncertainty, and Disinformation');
    v = v.replace(/fwif/ig, "for what it's worth");
    v = v.replace(/irl/ig, 'in real life');
    v = v.replace(/lmao/ig, 'laughing my ass off');
    v = v.replace(/mhoty/ig, 'my hats off to you');
    v = v.replace(/nimby/ig, 'not in my back yard');
    v = v.replace(/fomo/ig, 'fear of missing out');
    v = v.replace(/omg/ig, 'oh my god');
    v = v.replace(/ROTFLMAO/ig, 'Rolling On The Floor Laughing My Ass Off');
    v = v.replace(/stby/ig, 'sucks to be you');
    v = v.replace(/aoe/ig, 'area of effect');
    v = v.replace(/rtm/ig, 'read the manual');
    v = v.replace(/rtfm/ig, 'read the fucking manual');
    v = v.replace(/wtf/ig, 'what the fuck');
    v = v.replace(/afaik/ig, 'as far as I know');
    v = v.replace(/kys/ig, 'kill yourself');

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
