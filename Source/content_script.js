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
   
    v = v.replace(/\bimo\b/ig, 'in my opinion');
    v = v.replace(/\bimho\b/ig, 'in my humble opinion');
    v = v.replace(/\b2moro\b/ig, 'tomorrow');
    v = v.replace(/\b2night\b/ig, 'tonight');
    v = v.replace(/\bbrb\b/ig, 'be right back');
    v = v.replace(/\bbtw\b/ig, 'by the way');
    v = v.replace(/\bb4n\b/ig, 'bye for now');
    v = v.replace(/\bbcnu\b/ig, 'be seeing you');
    v = v.replace(/\blol\b/ig, 'haha');
    v = v.replace(/\bdbeyr\b/ig, "don't believe everything you read");
    v = v.replace(/\bdilligas\b/ig, 'do I look like I give a shit');
    v = v.replace(/\bfud\b/ig, 'fear, uncertainty, and disinformation');
    v = v.replace(/\bfwif\b/ig, "for what it's worth");
    v = v.replace(/\birl\b/ig, 'in real life');
    v = v.replace(/\blmao\b/ig, 'laughing my ass off');
    v = v.replace(/\bmhoty\b/ig, 'my hats off to you');
    v = v.replace(/\bnimby\b/ig, 'not in my back yard');
    v = v.replace(/\bfomo\b/ig, 'fear of missing out');
    v = v.replace(/\bomg\b/ig, 'oh my god');
    v = v.replace(/\brotflmao\b/ig, 'rolling on the floor laughing my ass off');
    v = v.replace(/\bstby\b/ig, 'sucks to be you');
    v = v.replace(/\baoe\b/ig, 'area of effect');
    v = v.replace(/\brtm\b/ig, 'read the manual');
    v = v.replace(/\brtfm\b/ig, 'read the fucking manual');
    v = v.replace(/\bwtf\b/ig, 'what the fuck');
    v = v.replace(/\bafaik\b/ig, 'as far as I know');
    v = v.replace(/\bdyor\b/ig, 'do your own research');
    v = v.replace(/\bgtfo\b/ig, 'get the fuck out');
    v = v.replace(/\biirc\b/ig, 'if I remember correctly');
    v = v.replace(/\blmao\b/ig, 'lauging my ass off');
    v = v.replace(/\bdae\b/ig, 'does anyone else');
    v = v.replace(/\bfwiw\b/ig, "for what it's worth");
    v = v.replace(/\bICYFTAPOFS\b/ig, "in case you forgot this after passing out from surprise");
    v = v.replace(/\bftfy\b/ig, "fixed that for you");
    v = v.replace(/\bomg\b/ig, "oh my god");
    v = v.replace(/\bfml\b/ig, "fuck my life");
    v = v.replace(/\bnp\b/ig, "no problem");
    v = v.replace(/\bsmh\b/ig, "shake my head");
    
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
