(function () {
    // add klick hander for every <li> test element to hide/show details
    var parent = document.getElementById('dalekjs-tests');
    var childNodes = parent.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        childNodes[i].addEventListener('click', function (event) {
            var parentLi = event.currentTarget;
            var children = parentLi.childNodes;
            for (var j = 0; j < children.length; j++) {
                if (children[j].tagName && children[j].tagName.toLowerCase() === 'ol') {
                    children[j].style.display = children[j].style.display === '' ? 'none' : '';
                }
            }

            if (event.target.tagName.toLowerCase() !== 'a') {
                event.preventDefault();
            }
        });
    }

    // add change handler for 'hide passed tests checkbox'
    var testVisibilityStatus = false;
    var checkbox = document.getElementById('dalekjs-filter-pass');
    var elements = [];
    for (var k = 0; k < childNodes.length; k++) {
        if (childNodes[k].tagName && childNodes[k].tagName.toLowerCase() === 'li' && childNodes[k].className === 'pass') {
            elements.push(childNodes[k]);
        }
    }
    checkbox.addEventListener('change', function (event) {
        for (var x = 0; x < elements.length; x++) {
            elements[x].style.display = (testVisibilityStatus ? '' : 'none');
        }
        testVisibilityStatus = !testVisibilityStatus;
        event.preventDefault();
    });
}).call(this);
