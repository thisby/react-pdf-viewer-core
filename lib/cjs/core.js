'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);
var ReactDOM__namespace = /*#__PURE__*/_interopNamespaceDefault(ReactDOM);

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var AnnotationType = /* @__PURE__ */ ((AnnotationType2) => {
  AnnotationType2[AnnotationType2["Text"] = 1] = "Text";
  AnnotationType2[AnnotationType2["Link"] = 2] = "Link";
  AnnotationType2[AnnotationType2["FreeText"] = 3] = "FreeText";
  AnnotationType2[AnnotationType2["Line"] = 4] = "Line";
  AnnotationType2[AnnotationType2["Square"] = 5] = "Square";
  AnnotationType2[AnnotationType2["Circle"] = 6] = "Circle";
  AnnotationType2[AnnotationType2["Polygon"] = 7] = "Polygon";
  AnnotationType2[AnnotationType2["Polyline"] = 8] = "Polyline";
  AnnotationType2[AnnotationType2["Highlight"] = 9] = "Highlight";
  AnnotationType2[AnnotationType2["Underline"] = 10] = "Underline";
  AnnotationType2[AnnotationType2["Squiggly"] = 11] = "Squiggly";
  AnnotationType2[AnnotationType2["StrikeOut"] = 12] = "StrikeOut";
  AnnotationType2[AnnotationType2["Stamp"] = 13] = "Stamp";
  AnnotationType2[AnnotationType2["Caret"] = 14] = "Caret";
  AnnotationType2[AnnotationType2["Ink"] = 15] = "Ink";
  AnnotationType2[AnnotationType2["Popup"] = 16] = "Popup";
  AnnotationType2[AnnotationType2["FileAttachment"] = 17] = "FileAttachment";
  return AnnotationType2;
})(AnnotationType || {});

var styles$s = {"button":"rpv_62094e2d","buttonRtl":"rpv_98e1a8fd"};

var TextDirection = /* @__PURE__ */ ((TextDirection2) => {
  TextDirection2["RightToLeft"] = "RTL";
  TextDirection2["LeftToRight"] = "LTR";
  return TextDirection2;
})(TextDirection || {});
const ThemeContext = React__namespace.createContext({
  currentTheme: "light",
  direction: "LTR" /* LeftToRight */,
  setCurrentTheme: () => {
  }
});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const classNames = (classes) => {
  const result = [];
  Object.keys(classes).forEach((clazz) => {
    if (clazz && classes[clazz]) {
      result.push(clazz);
    }
  });
  return result.join(" ");
};

const Button = ({ children, testId, onClick }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const attrs = testId ? { "data-testid": testId } : {};
  return /* @__PURE__ */ React__namespace.createElement(
    "button",
    {
      className: classNames({
        [styles$s.button]: true,
        [styles$s.buttonRtl]: isRtl
      }),
      type: "button",
      onClick,
      ...attrs
    },
    children
  );
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React__namespace.useLayoutEffect : React__namespace.useEffect;

const useIntersectionObserver = (props) => {
  const containerRef = React__namespace.useRef(null);
  const { once, threshold, onVisibilityChanged } = props;
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const intersectionTracker = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          const ratio = entry.intersectionRatio;
          onVisibilityChanged({ isVisible, ratio });
          if (isVisible && once) {
            intersectionTracker.unobserve(container);
            intersectionTracker.disconnect();
          }
        });
      },
      {
        threshold: threshold || 0
      }
    );
    intersectionTracker.observe(container);
    return () => {
      intersectionTracker.unobserve(container);
      intersectionTracker.disconnect();
    };
  }, []);
  return containerRef;
};

const LazyRender = ({ attrs, children, testId }) => {
  const [visible, setVisible] = React__namespace.useState(false);
  const containerAttrs = testId ? { ...attrs, "data-testid": testId } : attrs;
  const handleVisibilityChanged = (params) => {
    if (params.isVisible) {
      setVisible(true);
    }
  };
  const containerRef = useIntersectionObserver({
    once: true,
    onVisibilityChanged: handleVisibilityChanged
  });
  return /* @__PURE__ */ React__namespace.createElement("div", { ref: containerRef, ...containerAttrs }, visible && children);
};

var styles$r = {"menu":"rpv_223ba50d","menuRtl":"rpv_baed661d"};

const Menu = ({ children }) => {
  const containerRef = React__namespace.useRef(null);
  const visibleMenuItemsRef = React__namespace.useRef([]);
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const handleKeyDown = (e) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    switch (e.key) {
      case "Tab":
        e.preventDefault();
        break;
      case "ArrowDown":
        e.preventDefault();
        moveToItem((_, currentIndex) => currentIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveToItem((_, currentIndex) => currentIndex - 1);
        break;
      case "End":
        e.preventDefault();
        moveToItem((items, _) => items.length - 1);
        break;
      case "Home":
        e.preventDefault();
        moveToItem((_, __) => 0);
        break;
    }
  };
  const moveToItem = (getNextItem) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const items = visibleMenuItemsRef.current;
    const currentIndex = items.findIndex((item) => item.getAttribute("tabindex") === "0");
    const targetIndex = Math.min(items.length - 1, Math.max(0, getNextItem(items, currentIndex)));
    if (currentIndex >= 0 && currentIndex <= items.length - 1) {
      items[currentIndex].setAttribute("tabindex", "-1");
    }
    items[targetIndex].setAttribute("tabindex", "0");
    items[targetIndex].focus();
  };
  const findVisibleItems = (container) => {
    const visibleItems = [];
    container.querySelectorAll('.rpv-core__menu-item[role="menuitem"]').forEach((item) => {
      if (item instanceof HTMLElement) {
        const parent = item.parentElement;
        if (parent === container) {
          visibleItems.push(item);
        } else {
          if (window.getComputedStyle(parent).display !== "none") {
            visibleItems.push(item);
          }
        }
      }
    });
    return visibleItems;
  };
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const visibleItems = findVisibleItems(container);
    visibleMenuItemsRef.current = visibleItems;
  }, []);
  useIsomorphicLayoutEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      ref: containerRef,
      "aria-orientation": "vertical",
      className: classNames({
        [styles$r.menu]: true,
        [styles$r.menuRtl]: isRtl
      }),
      role: "menu",
      tabIndex: 0
    },
    children
  );
};

var styles$q = {"divider":"rpv_316d3906"};

const MenuDivider = () => /* @__PURE__ */ React__namespace.createElement("div", { "aria-orientation": "horizontal", className: styles$q.divider, role: "separator" });

var styles$p = {"icon":"rpv_2a5a054d","iconRtl":"rpv_81d01ddd"};

const Icon = ({ children, ignoreDirection = false, size = 24 }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = !ignoreDirection && direction === TextDirection.RightToLeft;
  const width = `${size || 24}px`;
  return /* @__PURE__ */ React__namespace.createElement(
    "svg",
    {
      "aria-hidden": "true",
      className: classNames({
        [styles$p.icon]: true,
        [styles$p.iconRtl]: isRtl
      }),
      focusable: "false",
      height: width,
      viewBox: "0 0 24 24",
      width
    },
    children
  );
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const CheckIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: `M23.5,0.499l-16.5,23l-6.5-6.5` }));

var styles$o = {"item":"rpv_abc2baee","itemDisabled":"rpv_6e088b8a","itemLtr":"rpv_f9f8621c","itemRtl":"rpv_f9f8789c","icon":"rpv_abc27c54","iconLtr":"rpv_dd835ef6","iconRtl":"rpv_dd837576","label":"rpv_ccb63a79","labelLtr":"rpv_8a1fb2b1","labelRtl":"rpv_8a1fc931","checkLtr":"rpv_5a82a41d","checkRtl":"rpv_5a82ba9d"};

const MenuItem = ({ checked = false, children, icon = null, isDisabled = false, testId, onClick }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const attrs = testId ? { "data-testid": testId } : {};
  return /* @__PURE__ */ React__namespace.createElement(
    "button",
    {
      className: classNames({
        [styles$o.item]: true,
        [styles$o.itemDisabled]: isDisabled,
        [styles$o.itemLtr]: !isRtl,
        [styles$o.itemRtl]: isRtl
      }),
      role: "menuitem",
      tabIndex: -1,
      type: "button",
      onClick,
      ...attrs
    },
    /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        className: classNames({
          [styles$o.icon]: true,
          [styles$o.iconLtr]: !isRtl,
          [styles$o.iconRtl]: isRtl
        })
      },
      icon
    ),
    /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        className: classNames({
          [styles$o.label]: true,
          [styles$o.labelLtr]: !isRtl,
          [styles$o.labelRtl]: isRtl
        })
      },
      children
    ),
    /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        className: classNames({
          [styles$o.checkLtr]: !isRtl,
          [styles$o.checkRtl]: isRtl
        })
      },
      checked && /* @__PURE__ */ React__namespace.createElement(CheckIcon, null)
    )
  );
};

var styles$n = {"button":"rpv_799dde0c","buttonDisabled":"rpv_ec15b0a8","buttonRtl":"rpv_aa3418be","buttonSelected":"rpv_22f568c7"};

const MinimalButton = ({ ariaLabel = "", ariaKeyShortcuts = "", children, isDisabled = false, isSelected = false, testId, onClick }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const attrs = testId ? { "data-testid": testId } : {};
  return /* @__PURE__ */ React__namespace.createElement(
    "button",
    {
      "aria-label": ariaLabel,
      ...ariaKeyShortcuts && { "aria-keyshortcuts": ariaKeyShortcuts },
      ...isDisabled && { "aria-disabled": true },
      className: classNames({
        [styles$n.button]: true,
        [styles$n.buttonDisabled]: isDisabled,
        [styles$n.buttonRtl]: isRtl,
        [styles$n.buttonSelected]: isSelected
      }),
      type: "button",
      onClick,
      ...attrs
    },
    children
  );
};

var styles$m = {"button":"rpv_b44dc34b","buttonRtl":"rpv_255ab71f"};

const PrimaryButton = ({ children, testId, onClick }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const attrs = testId ? { "data-testid": testId } : {};
  return /* @__PURE__ */ React__namespace.createElement(
    "button",
    {
      className: classNames({
        [styles$m.button]: true,
        [styles$m.buttonRtl]: isRtl
      }),
      type: "button",
      onClick,
      ...attrs
    },
    children
  );
};

var styles$l = {"bar":"rpv_2affa46c","barRtl":"rpv_cb60365e","progress":"rpv_a1cee974"};

const ProgressBar = ({ progress }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      className: classNames({
        [styles$l.bar]: true,
        [styles$l.barRtl]: isRtl
      })
    },
    /* @__PURE__ */ React__namespace.createElement("div", { className: styles$l.progress, style: { width: `${progress}%` } }, progress, "%")
  );
};

var styles$k = {"separator":"rpv_dbdc0dfd"};

const Separator = () => /* @__PURE__ */ React__namespace.createElement("div", { className: styles$k.separator });

var styles$j = {"skeleton":"rpv_673589cd"};

const Skeleton = ({ children }) => {
  const [node, setNode] = React__namespace.useState(null);
  const ref = React__namespace.useCallback((nodeEle) => {
    setNode(nodeEle);
  }, []);
  React__namespace.useEffect(() => {
    if (!node) {
      return;
    }
    const animation = node.animate(
      [
        {
          offset: 0,
          opacity: 1
        },
        {
          offset: 0.5,
          opacity: 0.5
        },
        {
          offset: 1,
          opacity: 1
        }
      ],
      {
        duration: 2 * 1e3,
        easing: "ease-in-out",
        iterations: Number.MAX_VALUE
      }
    );
    return () => {
      animation.cancel();
    };
  }, [node]);
  return children({
    attributes: {
      className: styles$j.skeleton
    },
    ref
  });
};

var styles$i = {"spinner":"rpv_fd7f1e65","spinnerAnimation":"rpv_77b97e9f"};

const Spinner = ({ size = "4rem", testId }) => {
  const [visible, setVisible] = React__namespace.useState(false);
  const attrs = testId ? { "data-testid": testId } : {};
  const handleVisibilityChanged = (params) => {
    setVisible(params.isVisible);
  };
  const containerRef = useIntersectionObserver({
    onVisibilityChanged: handleVisibilityChanged
  });
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      ...attrs,
      className: classNames({
        [styles$i.spinner]: true,
        [styles$i.spinnerAnimation]: visible
      }),
      ref: containerRef,
      style: { height: size, width: size }
    }
  );
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const ResizeIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, null, /* @__PURE__ */ React__namespace.createElement("circle", { cx: 9, cy: 12, r: 1 }), /* @__PURE__ */ React__namespace.createElement("circle", { cx: 9, cy: 5, r: 1 }), /* @__PURE__ */ React__namespace.createElement("circle", { cx: 9, cy: 19, r: 1 }), /* @__PURE__ */ React__namespace.createElement("circle", { cx: 15, cy: 12, r: 1 }), /* @__PURE__ */ React__namespace.createElement("circle", { cx: 15, cy: 5, r: 1 }), /* @__PURE__ */ React__namespace.createElement("circle", { cx: 15, cy: 19, r: 1 }));

var styles$h = {"splitter":"rpv_aca7330d","splitterResizing":"rpv_2e71969e","bodyResizing":"rpv_8d104179","handle":"rpv_636563ee","siblingResizing":"rpv_8aa92e4d"};

const Splitter = ({ constrain }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const resizerRef = React__namespace.useRef(null);
  const leftSideRef = React__namespace.useRef(null);
  const rightSideRef = React__namespace.useRef(null);
  const xRef = React__namespace.useRef(0);
  const yRef = React__namespace.useRef(0);
  const leftWidthRef = React__namespace.useRef(0);
  const resizerWidthRef = React__namespace.useRef(0);
  const eventOptions = {
    capture: true
  };
  const handleMouseMove = (e) => {
    const resizerEle = resizerRef.current;
    const leftSide = leftSideRef.current;
    const rightSide = rightSideRef.current;
    if (!resizerEle || !leftSide || !rightSide) {
      return;
    }
    const resizerWidth = resizerWidthRef.current;
    const dx = e.clientX - xRef.current;
    const firstHalfSize = leftWidthRef.current + (isRtl ? -dx : dx);
    const containerWidth = resizerEle.parentElement.getBoundingClientRect().width;
    const firstHalfPercentage = firstHalfSize * 100 / containerWidth;
    resizerEle.classList.add(styles$h.splitterResizing);
    if (constrain) {
      const secondHalfSize = containerWidth - firstHalfSize - resizerWidth;
      const secondHalfPercentage = secondHalfSize * 100 / containerWidth;
      if (!constrain({ firstHalfPercentage, firstHalfSize, secondHalfPercentage, secondHalfSize })) {
        return;
      }
    }
    leftSide.style.width = `${firstHalfPercentage}%`;
    document.body.classList.add(styles$h.bodyResizing);
    leftSide.classList.add(styles$h.siblingResizing);
    rightSide.classList.add(styles$h.siblingResizing);
  };
  const handleMouseUp = (e) => {
    const resizerEle = resizerRef.current;
    const leftSide = leftSideRef.current;
    const rightSide = rightSideRef.current;
    if (!resizerEle || !leftSide || !rightSide) {
      return;
    }
    document.body.classList.remove(styles$h.bodyResizing);
    resizerEle.classList.remove(styles$h.splitterResizing);
    leftSide.classList.remove(styles$h.siblingResizing);
    rightSide.classList.remove(styles$h.siblingResizing);
    document.removeEventListener("mousemove", handleMouseMove, eventOptions);
    document.removeEventListener("mouseup", handleMouseUp, eventOptions);
  };
  const handleMouseDown = (e) => {
    const leftSide = leftSideRef.current;
    if (!leftSide) {
      return;
    }
    xRef.current = e.clientX;
    yRef.current = e.clientY;
    leftWidthRef.current = leftSide.getBoundingClientRect().width;
    document.addEventListener("mousemove", handleMouseMove, eventOptions);
    document.addEventListener("mouseup", handleMouseUp, eventOptions);
  };
  React__namespace.useEffect(() => {
    const resizerEle = resizerRef.current;
    if (!resizerEle) {
      return;
    }
    resizerWidthRef.current = resizerEle.getBoundingClientRect().width;
    leftSideRef.current = resizerEle.previousElementSibling;
    rightSideRef.current = resizerEle.nextElementSibling;
  }, []);
  return /* @__PURE__ */ React__namespace.createElement("div", { ref: resizerRef, className: styles$h.splitter, onMouseDown: handleMouseDown }, /* @__PURE__ */ React__namespace.createElement("div", { className: styles$h.handle }, /* @__PURE__ */ React__namespace.createElement(ResizeIcon, null)));
};

var styles$g = {"textbox":"rpv_5acb480f","textboxRtl":"rpv_ce17cbdb"};

const TextBox = ({
  ariaLabel = "",
  autoFocus = false,
  placeholder = "",
  testId,
  type = "text",
  value = "",
  onChange,
  onKeyDown = () => {
  }
}) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const textboxRef = React__namespace.useRef(null);
  const isRtl = direction === TextDirection.RightToLeft;
  const attrs = {
    ref: textboxRef,
    "data-testid": "",
    "aria-label": ariaLabel,
    className: classNames({
      [styles$g.textbox]: true,
      [styles$g.textboxRtl]: isRtl
    }),
    placeholder,
    value,
    onChange: (e) => onChange(e.target.value),
    onKeyDown
  };
  if (testId) {
    attrs["data-testid"] = testId;
  }
  useIsomorphicLayoutEffect(() => {
    if (autoFocus) {
      const textboxEle = textboxRef.current;
      if (textboxEle) {
        const x = window.scrollX;
        const y = window.scrollY;
        textboxEle.focus();
        window.scrollTo(x, y);
      }
    }
  }, []);
  return type === "text" ? /* @__PURE__ */ React__namespace.createElement("input", { type: "text", ...attrs }) : /* @__PURE__ */ React__namespace.createElement("input", { type: "password", ...attrs });
};

const defaultVendor = {
  ExitFullScreen: "exitFullscreen",
  FullScreenChange: "fullscreenchange",
  FullScreenElement: "fullscreenElement",
  FullScreenEnabled: "fullscreenEnabled",
  RequestFullScreen: "requestFullscreen"
};
const webkitVendor = {
  ExitFullScreen: "webkitExitFullscreen",
  FullScreenChange: "webkitfullscreenchange",
  FullScreenElement: "webkitFullscreenElement",
  FullScreenEnabled: "webkitFullscreenEnabled",
  RequestFullScreen: "webkitRequestFullscreen"
};
const msVendor = {
  ExitFullScreen: "msExitFullscreen",
  FullScreenChange: "msFullscreenChange",
  FullScreenElement: "msFullscreenElement",
  FullScreenEnabled: "msFullscreenEnabled",
  RequestFullScreen: "msRequestFullscreen"
};
const isBrowser = typeof window !== "undefined";
const vendor = isBrowser ? 3 /* FullScreenEnabled */ in document && defaultVendor || webkitVendor.FullScreenEnabled in document && webkitVendor || msVendor.FullScreenEnabled in document && msVendor || defaultVendor : defaultVendor;
const isFullScreenEnabled = () => isBrowser && vendor.FullScreenEnabled in document && document[vendor.FullScreenEnabled] === true;
const addFullScreenChangeListener = (handler) => {
  if (isBrowser) {
    document.addEventListener(vendor.FullScreenChange, handler);
  }
};
const removeFullScreenChangeListener = (handler) => {
  if (isBrowser) {
    document.removeEventListener(vendor.FullScreenChange, handler);
  }
};
const exitFullScreen = (element) => {
  return isBrowser ? (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element[vendor.ExitFullScreen]()
  ) : Promise.resolve({});
};
const getFullScreenElement = () => {
  return isBrowser ? document[vendor.FullScreenElement] : null;
};
const requestFullScreen = (element) => {
  if (isBrowser) {
    element[vendor.RequestFullScreen]();
  }
};

const useDebounceCallback = (callback, wait) => {
  const timeout = React__namespace.useRef();
  const cleanup = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };
  React__namespace.useEffect(() => {
    return () => cleanup();
  }, []);
  return React__namespace.useCallback(
    (...args) => {
      cleanup();
      timeout.current = setTimeout(() => {
        callback(...args);
      }, wait);
    },
    [callback, wait]
  );
};

const useIsMounted = () => {
  const isMountedRef = React__namespace.useRef(false);
  React__namespace.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef;
};

const usePrevious = (value) => {
  const ref = React__namespace.useRef(value);
  React__namespace.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const OUT_OF_RANGE_VISIBILITY = -9999;
const useRenderQueue = ({ doc }) => {
  const { numPages } = doc;
  const docId = doc.loadingTask.docId;
  const initialPageVisibilities = React__namespace.useMemo(
    () => Array(numPages).fill(null).map((_, pageIndex) => ({
      pageIndex,
      renderStatus: "NotRenderedYet" /* NotRenderedYet */,
      visibility: OUT_OF_RANGE_VISIBILITY
    })),
    [docId]
  );
  const latestRef = React__namespace.useRef({
    currentRenderingPage: -1,
    startRange: 0,
    endRange: numPages - 1,
    visibilities: initialPageVisibilities
  });
  const markNotRendered = () => {
    for (let i = 0; i < numPages; i++) {
      latestRef.current.visibilities[i].renderStatus = "NotRenderedYet" /* NotRenderedYet */;
    }
  };
  const markRendered = (pageIndex) => {
    latestRef.current.visibilities[pageIndex].renderStatus = "Rendered" /* Rendered */;
  };
  const markRendering = (pageIndex) => {
    if (latestRef.current.currentRenderingPage !== -1 && latestRef.current.currentRenderingPage !== pageIndex && latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus === "Rendering" /* Rendering */) {
      latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus = "NotRenderedYet" /* NotRenderedYet */;
    }
    latestRef.current.visibilities[pageIndex].renderStatus = "Rendering" /* Rendering */;
    latestRef.current.currentRenderingPage = pageIndex;
  };
  const setRange = (startIndex, endIndex) => {
    latestRef.current.startRange = startIndex;
    latestRef.current.endRange = endIndex;
    for (let i = 0; i < numPages; i++) {
      if (i < startIndex || i > endIndex) {
        latestRef.current.visibilities[i].visibility = OUT_OF_RANGE_VISIBILITY;
        latestRef.current.visibilities[i].renderStatus = "NotRenderedYet" /* NotRenderedYet */;
      } else if (latestRef.current.visibilities[i].visibility === OUT_OF_RANGE_VISIBILITY) {
        latestRef.current.visibilities[i].visibility = -1;
      }
    }
  };
  const setOutOfRange = (pageIndex) => {
    setVisibility(pageIndex, OUT_OF_RANGE_VISIBILITY);
  };
  const setVisibility = (pageIndex, visibility) => {
    latestRef.current.visibilities[pageIndex].visibility = visibility;
  };
  const getHighestPriorityPage = () => {
    const visiblePages = latestRef.current.visibilities.slice(latestRef.current.startRange, latestRef.current.endRange + 1).filter((item) => item.visibility > OUT_OF_RANGE_VISIBILITY);
    if (!visiblePages.length) {
      return -1;
    }
    const firstVisiblePage = visiblePages[0].pageIndex;
    const lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;
    const numVisiblePages = visiblePages.length;
    let maxVisibilityPageIndex = -1;
    let maxVisibility = -1;
    for (let i = 0; i < numVisiblePages; i++) {
      if (visiblePages[i].renderStatus === "Rendering" /* Rendering */) {
        return -1;
      }
      if (visiblePages[i].renderStatus === "NotRenderedYet" /* NotRenderedYet */) {
        if (maxVisibilityPageIndex === -1 || visiblePages[i].visibility > maxVisibility) {
          maxVisibilityPageIndex = visiblePages[i].pageIndex;
          maxVisibility = visiblePages[i].visibility;
        }
      }
    }
    if (maxVisibilityPageIndex > -1) {
      return maxVisibilityPageIndex;
    }
    if (lastVisiblePage + 1 < numPages && latestRef.current.visibilities[lastVisiblePage + 1].renderStatus !== "Rendered" /* Rendered */) {
      return lastVisiblePage + 1;
    } else if (firstVisiblePage - 1 >= 0 && latestRef.current.visibilities[firstVisiblePage - 1].renderStatus !== "Rendered" /* Rendered */) {
      return firstVisiblePage - 1;
    }
    return -1;
  };
  const isInRange = (pageIndex) => pageIndex >= latestRef.current.startRange && pageIndex <= latestRef.current.endRange;
  return {
    getHighestPriorityPage,
    isInRange,
    markNotRendered,
    markRendered,
    markRendering,
    setOutOfRange,
    setRange,
    setVisibility
  };
};

const useSafeState = (initialState) => {
  const [state, setState] = React__namespace.useState(initialState);
  const useIsMountedRef = useIsMounted();
  const setSafeState = React__namespace.useCallback(
    (newState) => {
      if (useIsMountedRef.current) {
        setState(newState);
      }
    },
    [useIsMountedRef.current]
  );
  return [state, setSafeState];
};

var core = {
	askingPassword: {
		requirePasswordToOpen: "This document requires a password to open",
		submit: "Submit"
	},
	wrongPassword: {
		tryAgain: "The password is wrong. Please try again"
	},
	pageLabel: "Page {{pageIndex}}"
};
var enUs = {
	core: core
};

const DefaultLocalization = enUs;
const LocalizationContext = React__namespace.createContext({
  l10n: DefaultLocalization,
  setL10n: () => {
  }
});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var ToggleStatus = /* @__PURE__ */ ((ToggleStatus2) => {
  ToggleStatus2["Close"] = "Close";
  ToggleStatus2["Open"] = "Open";
  ToggleStatus2["Toggle"] = "Toggle";
  return ToggleStatus2;
})(ToggleStatus || {});

const useToggle = (isOpened) => {
  const [opened, setOpened] = React__namespace.useState(isOpened);
  const toggle = (status) => {
    switch (status) {
      case ToggleStatus.Close:
        setOpened(false);
        break;
      case ToggleStatus.Open:
        setOpened(true);
        break;
      case ToggleStatus.Toggle:
      default:
        setOpened((isOpened2) => !isOpened2);
        break;
    }
  };
  return { opened, toggle };
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
let id = 0;
const uniqueId = () => id++;

const useLockScroll = () => {
  React__namespace.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};

var styles$f = {"overlay":"rpv_2205272","body":"rpv_509faec0","bodyRtl":"rpv_46721b8a"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const mergeRefs = (refs) => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};

const StackContext = React__namespace.createContext({
  currentIndex: 0,
  decreaseNumStacks: () => {
  },
  increaseNumStacks: () => {
  },
  numStacks: 0
});

const useClickOutsideStack = (closeOnClickOutside, onClickOutside) => {
  const stackContext = React__namespace.useContext(StackContext);
  const [ele, setEle] = React__namespace.useState();
  const ref = React__namespace.useCallback((ele2) => {
    setEle(ele2);
  }, []);
  const handleClickDocument = React__namespace.useCallback(
    (e) => {
      if (!ele || stackContext.currentIndex !== stackContext.numStacks) {
        return;
      }
      const clickedTarget = e.target;
      if (clickedTarget instanceof Element && clickedTarget.shadowRoot) {
        const paths = e.composedPath();
        if (paths.length > 0 && !ele.contains(paths[0])) {
          onClickOutside();
        }
      } else if (!ele.contains(clickedTarget)) {
        onClickOutside();
      }
    },
    [ele, stackContext.currentIndex, stackContext.numStacks]
  );
  React__namespace.useEffect(() => {
    if (!closeOnClickOutside || !ele) {
      return;
    }
    const eventOptions = {
      capture: true
    };
    document.addEventListener("click", handleClickDocument, eventOptions);
    return () => {
      document.removeEventListener("click", handleClickDocument, eventOptions);
    };
  }, [ele, stackContext.currentIndex, stackContext.numStacks]);
  return [ref];
};

const useEscapeStack = (handler) => {
  const stackContext = React__namespace.useContext(StackContext);
  const keyUpHandler = React__namespace.useCallback(
    (e) => {
      if (e.key === "Escape" && stackContext.currentIndex === stackContext.numStacks) {
        handler();
      }
    },
    [stackContext.currentIndex, stackContext.numStacks]
  );
  React__namespace.useEffect(() => {
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [stackContext.currentIndex, stackContext.numStacks]);
};

const ModalBody = ({ ariaControlsSuffix, children, closeOnClickOutside, closeOnEscape, onClose }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const overlayRef = React__namespace.useRef(null);
  const contentRef = React__namespace.useRef();
  const animationOptions = {
    duration: 150,
    fill: "forwards"
  };
  const handleClose = () => {
    const overlayEle = overlayRef.current;
    const contentEle = contentRef.current;
    if (!overlayEle || !contentEle) {
      return;
    }
    contentEle.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)"
        },
        {
          opacity: 0,
          transform: "scale(0.9)"
        }
      ],
      animationOptions
    );
    const overlayAnimation = overlayEle.animate(
      [
        {
          background: "rgba(0, 0, 0, 0.8)",
          opacity: 1
        },
        {
          background: "rgba(0, 0, 0, 1)",
          opacity: 0
        }
      ],
      animationOptions
    );
    overlayAnimation.finished.then(() => {
      onClose();
    });
  };
  const [contentCallbackRef] = useClickOutsideStack(closeOnClickOutside, handleClose);
  const mergedContentRef = mergeRefs([contentRef, contentCallbackRef]);
  useLockScroll();
  useEscapeStack(() => {
    if (closeOnEscape) {
      handleClose();
    }
  });
  React__namespace.useEffect(() => {
    const overlayEle = overlayRef.current;
    const contentEle = contentRef.current;
    if (!overlayEle || !contentEle) {
      return;
    }
    const overlayAnimation = overlayEle.animate(
      [
        {
          background: "rgba(0, 0, 0, 1)",
          opacity: 0
        },
        {
          background: "rgba(0, 0, 0, 0.8)",
          opacity: 1
        }
      ],
      animationOptions
    );
    const contentAnimation = contentEle.animate(
      [
        {
          opacity: 0,
          transform: "scale(0.9)"
        },
        {
          opacity: 1,
          transform: "scale(1)"
        }
      ],
      animationOptions
    );
    return () => {
      overlayAnimation.cancel();
      contentAnimation.cancel();
    };
  }, []);
  React__namespace.useEffect(() => {
    const contentEle = contentRef.current;
    if (!contentEle) {
      return;
    }
    const maxHeight = document.body.clientHeight * 0.75;
    if (contentEle.getBoundingClientRect().height >= maxHeight) {
      contentEle.style.overflow = "auto";
      contentEle.style.maxHeight = `${maxHeight}px`;
    }
  }, []);
  return /* @__PURE__ */ React__namespace.createElement("div", { className: styles$f.overlay, ref: overlayRef }, /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      "aria-modal": "true",
      className: classNames({
        [styles$f.body]: true,
        [styles$f.bodyRtl]: isRtl
      }),
      id: `rpv-core__modal-body-${ariaControlsSuffix}`,
      ref: mergedContentRef,
      role: "dialog",
      tabIndex: -1
    },
    children({ onClose: handleClose })
  ));
};

const Stack = ({ children }) => {
  const { currentIndex, increaseNumStacks, decreaseNumStacks, numStacks } = React__namespace.useContext(StackContext);
  React__namespace.useEffect(() => {
    increaseNumStacks();
    return () => {
      decreaseNumStacks();
    };
  }, []);
  return ReactDOM__namespace.createPortal(
    /* @__PURE__ */ React__namespace.createElement(
      StackContext.Provider,
      {
        value: {
          currentIndex: currentIndex + 1,
          decreaseNumStacks,
          increaseNumStacks,
          numStacks
        }
      },
      children
    ),
    document.body
  );
};

const Modal = ({ ariaControlsSuffix, closeOnClickOutside, closeOnEscape, content, isOpened = false, target }) => {
  const controlsSuffix = ariaControlsSuffix || `${uniqueId()}`;
  const { opened, toggle } = useToggle(isOpened);
  const renderTarget = (toggle2, opened2) => {
    return target ? /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        "aria-expanded": opened2 ? "true" : "false",
        "aria-haspopup": "dialog",
        "aria-controls": `rpv-core__modal-body-${controlsSuffix}`
      },
      target(toggle2, opened2)
    ) : /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null);
  };
  const renderContent = (toggle2) => /* @__PURE__ */ React__namespace.createElement(
    ModalBody,
    {
      ariaControlsSuffix: controlsSuffix,
      closeOnClickOutside,
      closeOnEscape,
      onClose: toggle2
    },
    ({ onClose }) => content(onClose)
  );
  return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, renderTarget(toggle, opened), opened && /* @__PURE__ */ React__namespace.createElement(Stack, null, renderContent(toggle)));
};

var styles$e = {"body":"rpv_33f641c8","bodyArrow":"rpv_19dd1f21","bodyRtl":"rpv_de324b82"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var Position = /* @__PURE__ */ ((Position2) => {
  Position2["TopLeft"] = "TOP_LEFT";
  Position2["TopCenter"] = "TOP_CENTER";
  Position2["TopRight"] = "TOP_RIGHT";
  Position2["RightTop"] = "RIGHT_TOP";
  Position2["RightCenter"] = "RIGHT_CENTER";
  Position2["RightBottom"] = "RIGHT_BOTTOM";
  Position2["BottomLeft"] = "BOTTOM_LEFT";
  Position2["BottomCenter"] = "BOTTOM_CENTER";
  Position2["BottomRight"] = "BOTTOM_RIGHT";
  Position2["LeftTop"] = "LEFT_TOP";
  Position2["LeftCenter"] = "LEFT_CENTER";
  Position2["LeftBottom"] = "LEFT_BOTTOM";
  return Position2;
})(Position || {});

var styles$d = {"arrow":"rpv_add41145","arrowTopLeft":"rpv_ee9ba1f7","arrowTopCenter":"rpv_a6e31245","arrowTopRight":"rpv_e52efe2c","arrowRightTop":"rpv_c9e661fe","arrowRightCenter":"rpv_3356ff0c","arrowRightBottom":"rpv_3231cce2","arrowBottomLeft":"rpv_d8db7bf7","arrowBottomCenter":"rpv_946c45","arrowBottomRight":"rpv_42ea642c","arrowLeftTop":"rpv_35de56c9","arrowLeftCenter":"rpv_9f46d261","arrowLeftBottom":"rpv_9e21a037"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const Arrow = ({ customClassName, position }) => /* @__PURE__ */ React__namespace.createElement(
  "div",
  {
    className: classNames({
      [styles$d.arrow]: true,
      [styles$d.arrowTopLeft]: position === Position.TopLeft,
      [styles$d.arrowTopCenter]: position === Position.TopCenter,
      [styles$d.arrowTopRight]: position === Position.TopRight,
      [styles$d.arrowRightTop]: position === Position.RightTop,
      [styles$d.arrowRightCenter]: position === Position.RightCenter,
      [styles$d.arrowRightBottom]: position === Position.RightBottom,
      [styles$d.arrowBottomLeft]: position === Position.BottomLeft,
      [styles$d.arrowBottomCenter]: position === Position.BottomCenter,
      [styles$d.arrowBottomRight]: position === Position.BottomRight,
      [styles$d.arrowLeftTop]: position === Position.LeftTop,
      [styles$d.arrowLeftCenter]: position === Position.LeftCenter,
      [styles$d.arrowLeftBottom]: position === Position.LeftBottom,
      [`${customClassName}`]: customClassName !== ""
    })
  }
);

const PopoverBody = React__namespace.forwardRef((props, ref) => {
  const { ariaControlsSuffix, children, closeOnClickOutside, position, onClose } = props;
  const innerRef = React__namespace.useRef(null);
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const [contentRef] = useClickOutsideStack(closeOnClickOutside, onClose);
  const mergedContentRef = mergeRefs([ref, contentRef]);
  useIsomorphicLayoutEffect(() => {
    const innerContentEle = innerRef.current;
    if (!innerContentEle) {
      return;
    }
    const maxHeight = document.body.clientHeight * 0.75;
    if (innerContentEle.getBoundingClientRect().height >= maxHeight) {
      innerContentEle.style.overflow = "auto";
      innerContentEle.style.maxHeight = `${maxHeight}px`;
    }
  }, []);
  const innerId = `rpv-core__popover-body-inner-${ariaControlsSuffix}`;
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      "aria-describedby": innerId,
      className: classNames({
        [styles$e.body]: true,
        [styles$e.bodyRtl]: isRtl
      }),
      id: `rpv-core__popover-body-${ariaControlsSuffix}`,
      ref: mergedContentRef,
      role: "dialog",
      tabIndex: -1
    },
    /* @__PURE__ */ React__namespace.createElement(Arrow, { customClassName: styles$e.bodyArrow, position }),
    /* @__PURE__ */ React__namespace.createElement("div", { id: innerId, ref: innerRef }, children)
  );
});
PopoverBody.displayName = "PopoverBody";

var styles$c = {"overlay":"rpv_9a8b66e"};

const PopoverOverlay = ({ children, closeOnEscape, onClose }) => {
  const containerRef = React__namespace.useRef(null);
  useEscapeStack(() => {
    if (closeOnEscape) {
      onClose();
    }
  });
  return /* @__PURE__ */ React__namespace.createElement("div", { className: styles$c.overlay, ref: containerRef }, children);
};

const useAnimationFrame = (callback, recurring = false, deps) => {
  const callbackRef = React__namespace.useRef(callback);
  const idRef = React__namespace.useRef(-1);
  callbackRef.current = callback;
  const start = React__namespace.useCallback(
    (...args) => {
      cancelAnimationFrame(idRef.current);
      idRef.current = requestAnimationFrame(() => {
        callback(...args);
        if (recurring) {
          start(...args);
        }
      });
    },
    [...deps, recurring]
  );
  const stop = React__namespace.useCallback(() => {
    cancelAnimationFrame(idRef.current);
  }, []);
  React__namespace.useEffect(() => () => stop(), []);
  return [start];
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const clamp = (min, max, value) => Math.max(min, Math.min(value, max));

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const AVAILABLE_POSITIONS = [
  // Top side
  Position.TopLeft,
  Position.TopCenter,
  Position.TopRight,
  // Right side
  Position.RightTop,
  Position.RightCenter,
  Position.RightBottom,
  // Bottom side
  Position.BottomLeft,
  Position.BottomCenter,
  Position.BottomRight,
  // Left side
  Position.LeftTop,
  Position.LeftCenter,
  Position.LeftBottom
];
const isIntersection = (a, b) => b.right >= a.left && b.left <= a.right && b.top <= a.bottom && b.bottom >= a.top;
const union = (a, b) => {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  return new DOMRect(left, top, right - left, bottom - top);
};
const calculateArea = (rect) => rect.width * rect.height;
const distance = (a, b) => Math.abs(a.left - b.left) + Math.abs(a.top - b.top);
const calculateOffset = (referenceRect, targetRect, position, offset) => {
  let top = 0;
  let left = 0;
  switch (position) {
    case Position.TopLeft:
      top = referenceRect.top - targetRect.height - offset;
      left = referenceRect.left;
      break;
    case Position.TopCenter:
      top = referenceRect.top - targetRect.height - offset;
      left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
      break;
    case Position.TopRight:
      top = referenceRect.top - targetRect.height - offset;
      left = referenceRect.left + referenceRect.width - targetRect.width;
      break;
    case Position.RightTop:
      top = referenceRect.top;
      left = referenceRect.left + referenceRect.width + offset;
      break;
    case Position.RightCenter:
      top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
      left = referenceRect.left + referenceRect.width + offset;
      break;
    case Position.RightBottom:
      top = referenceRect.top + referenceRect.height - targetRect.height;
      left = referenceRect.left + referenceRect.width + offset;
      break;
    case Position.BottomLeft:
      top = referenceRect.top + referenceRect.height + offset;
      left = referenceRect.left;
      break;
    case Position.BottomCenter:
      top = referenceRect.top + referenceRect.height + offset;
      left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
      break;
    case Position.BottomRight:
      top = referenceRect.top + referenceRect.height + offset;
      left = referenceRect.left + referenceRect.width - targetRect.width;
      break;
    case Position.LeftTop:
      top = referenceRect.top;
      left = referenceRect.left - targetRect.width - offset;
      break;
    case Position.LeftCenter:
      top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
      left = referenceRect.left - targetRect.width - offset;
      break;
    case Position.LeftBottom:
      top = referenceRect.top + referenceRect.height - targetRect.height;
      left = referenceRect.left - targetRect.width - offset;
      break;
  }
  return { top, left };
};
const determineBestPosition = (referenceRect, targetRect, containerRect, position, offset) => {
  if (!isIntersection(referenceRect, containerRect)) {
    return {
      position
    };
  }
  const desiredOffset = calculateOffset(referenceRect, targetRect, position, offset);
  const availableOffsets = AVAILABLE_POSITIONS.map((pos) => ({
    offset: calculateOffset(referenceRect, targetRect, pos, offset),
    position: pos
  }));
  const notOverflowOffsets = availableOffsets.filter(({ offset: offset2 }) => {
    const rect2 = new DOMRect(offset2.left, offset2.top, targetRect.width, targetRect.height);
    return isIntersection(rect2, containerRect);
  });
  const sortedDistances = notOverflowOffsets.sort((a, b) => {
    const x = new DOMRect(b.offset.left, b.offset.top, targetRect.width, targetRect.height);
    const y = new DOMRect(a.offset.left, a.offset.top, targetRect.width, targetRect.height);
    return calculateArea(union(x, containerRect)) - calculateArea(union(y, containerRect)) || distance(a.offset, desiredOffset) - distance(b.offset, desiredOffset);
  });
  if (sortedDistances.length === 0) {
    return {
      position
    };
  }
  const bestPlacement = sortedDistances[0];
  const shortestDistanceRect = new DOMRect(
    bestPlacement.offset.left,
    bestPlacement.offset.top,
    targetRect.width,
    targetRect.height
  );
  const rect = new DOMRect(
    Math.round(
      clamp(shortestDistanceRect.left, containerRect.left, containerRect.right - shortestDistanceRect.width)
    ),
    Math.round(
      clamp(shortestDistanceRect.top, containerRect.top, containerRect.bottom - shortestDistanceRect.height)
    ),
    shortestDistanceRect.width,
    shortestDistanceRect.height
  );
  return {
    position: bestPlacement.position,
    rect
  };
};

const areRectsEqual = (a, b) => ["top", "left", "width", "height"].every((key) => a[key] === b[key]);
const Portal = ({ children, offset = 0, position, referenceRef }) => {
  const EMPTY_DOM_RECT = new DOMRect();
  const [ele, setEle] = React__namespace.useState();
  const [updatedPosition, setUpdatedPosition] = React__namespace.useState(position);
  const targetRef = React__namespace.useCallback((ele2) => {
    setEle(ele2);
  }, []);
  const prevBoundingRectsRef = React__namespace.useRef([]);
  const [start] = useAnimationFrame(
    () => {
      if (!ele || !referenceRef.current) {
        return;
      }
      const referenceRect = referenceRef.current.getBoundingClientRect();
      const targetRect = ele.getBoundingClientRect();
      const containerRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
      const rects = [referenceRect, targetRect, containerRect];
      if (rects.some((rect, i) => !areRectsEqual(rect, prevBoundingRectsRef.current[i] || EMPTY_DOM_RECT))) {
        prevBoundingRectsRef.current = rects;
        const updatedPlacement = determineBestPosition(
          referenceRect,
          targetRect,
          containerRect,
          position,
          offset
        );
        if (updatedPlacement.rect) {
          ele.style.transform = `translate(${updatedPlacement.rect.left}px, ${updatedPlacement.rect.top}px)`;
          setUpdatedPosition(updatedPlacement.position);
        }
      }
    },
    true,
    [ele]
  );
  React__namespace.useEffect(() => {
    if (ele) {
      start();
    }
  }, [ele]);
  return /* @__PURE__ */ React__namespace.createElement(Stack, null, children({ position: updatedPosition, ref: targetRef }));
};

const Popover = ({
  ariaHasPopup = "dialog",
  ariaControlsSuffix,
  closeOnClickOutside,
  closeOnEscape,
  content,
  lockScroll = true,
  position,
  target
}) => {
  const { opened, toggle } = useToggle(false);
  const targetRef = React__namespace.useRef(null);
  const controlsSuffix = React__namespace.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);
  return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      ref: targetRef,
      "aria-expanded": opened ? "true" : "false",
      "aria-haspopup": ariaHasPopup,
      "aria-controls": `rpv-core__popver-body-${controlsSuffix}`
    },
    target(toggle, opened)
  ), opened && /* @__PURE__ */ React__namespace.createElement(Portal, { offset: 8, position, referenceRef: targetRef }, ({ position: updatedPosition, ref }) => {
    const popoverBody = /* @__PURE__ */ React__namespace.createElement(
      PopoverBody,
      {
        ariaControlsSuffix: controlsSuffix,
        closeOnClickOutside,
        position: updatedPosition,
        ref,
        onClose: toggle
      },
      content(toggle)
    );
    return lockScroll ? /* @__PURE__ */ React__namespace.createElement(PopoverOverlay, { closeOnEscape, onClose: toggle }, popoverBody) : popoverBody;
  }));
};

var styles$b = {"body":"rpv_68737a2a","bodyRtl":"rpv_16369fe0","arrow":"rpv_a5ef4481","content":"rpv_4ba7c6f1"};

const TooltipBody = React__namespace.forwardRef((props, ref) => {
  const { ariaControlsSuffix, children, closeOnEscape, position, onClose } = props;
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  useEscapeStack(() => {
    if (closeOnEscape) {
      onClose();
    }
  });
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      className: classNames({
        [styles$b.body]: true,
        [styles$b.bodyRtl]: isRtl
      }),
      id: `rpv-core__tooltip-body-${ariaControlsSuffix}`,
      ref,
      role: "tooltip"
    },
    /* @__PURE__ */ React__namespace.createElement(Arrow, { customClassName: styles$b.arrow, position }),
    /* @__PURE__ */ React__namespace.createElement("div", { className: styles$b.content }, children)
  );
});
TooltipBody.displayName = "TooltipBody";

const Tooltip = ({ ariaControlsSuffix, content, position, target }) => {
  const { opened, toggle } = useToggle(false);
  const targetRef = React__namespace.useRef(null);
  const contentRef = React__namespace.useRef();
  const controlsSuffix = React__namespace.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);
  const open = () => {
    toggle(ToggleStatus.Open);
  };
  const close = () => {
    toggle(ToggleStatus.Close);
  };
  const onBlur = (e) => {
    const shouldHideTooltip = e.relatedTarget instanceof HTMLElement && e.currentTarget.parentElement && e.currentTarget.parentElement.contains(e.relatedTarget);
    if (shouldHideTooltip) {
      if (contentRef.current) {
        contentRef.current.style.display = "none";
      }
    } else {
      close();
    }
  };
  return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      ref: targetRef,
      "aria-describedby": `rpv-core__tooltip-body-${controlsSuffix}`,
      onBlur,
      onFocus: open,
      onMouseEnter: open,
      onMouseLeave: close
    },
    target
  ), opened && /* @__PURE__ */ React__namespace.createElement(Portal, { offset: 8, position, referenceRef: targetRef }, ({ position: updatedPosition, ref }) => /* @__PURE__ */ React__namespace.createElement(
    TooltipBody,
    {
      ariaControlsSuffix: controlsSuffix,
      closeOnEscape: true,
      position: updatedPosition,
      ref,
      onClose: close
    },
    content()
  )));
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const isDarkMode = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const DARK_THEME = {
  name: "dark",
  variables: {
    border: "240 3.7% 15.9%",
    radius: "0.5rem",
    ring: "240 4.9% 83.9%",
    background: "240 10% 3.9%",
    foreground: "0 0% 98%",
    muted: "240 3.7% 15.9%",
    mutedForeground: "240 5% 64.9%",
    primary: "0 0% 98%",
    primaryForeground: "240 5.9% 10%",
    secondary: "240 3.7% 15.9%",
    secondaryForeground: "0 0% 98%",
    accent: "240 3.7% 15.9%",
    accentForeground: "0 0% 98%",
    destructive: "0 62.8% 30.6%",
    destructiveForeground: "0 85.7% 97.3%",
    highlight: "80.9 95.67% 54.71%"
  }
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const LIGHT_THEME = {
  name: "light",
  variables: {
    border: "240 5.9% 90%",
    radius: "0.5rem",
    ring: "240 5% 64.9%",
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    muted: "240 4.8% 95.9%",
    mutedForeground: "240 3.8% 46.1%",
    primary: "240 5.9% 10%",
    primaryForeground: "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    secondaryForeground: "240 5.9% 10%",
    accent: "240 4.8% 95.9%",
    accentForeground: "240 5.9% 10%",
    destructive: "0 72.22% 50.59%",
    destructiveForeground: "0 0% 98%",
    highlight: "80.9 95.67% 54.71%"
  }
};

const THEME_ATTR = "data-rpv-theme";
const useTheme = (theme) => {
  const addStyles = React__namespace.useCallback(() => {
    const root = document.documentElement;
    root.setAttribute(THEME_ATTR, theme.name);
    if (document.head.querySelector(`style[${THEME_ATTR}="${theme.name}"]`)) {
      return;
    }
    const styleEle = document.createElement("style");
    styleEle.setAttribute(THEME_ATTR, theme.name);
    document.head.appendChild(styleEle);
    styleEle.textContent = `
:root[${THEME_ATTR}="${theme.name}"] {
    --rpv-border: ${theme.variables.border};
    --rpv-radius: ${theme.variables.radius};
    --rpv-ring: ${theme.variables.ring};
    --rpv-background: ${theme.variables.background};
    --rpv-foreground: ${theme.variables.foreground};
    --rpv-muted: ${theme.variables.muted};
    --rpv-muted-foreground: ${theme.variables.mutedForeground};
    --rpv-primary: ${theme.variables.primary};
    --rpv-primary-foreground: ${theme.variables.primaryForeground};
    --rpv-secondary: ${theme.variables.secondary};
    --rpv-secondary-foreground: ${theme.variables.secondaryForeground};
    --rpv-accent: ${theme.variables.accent};
    --rpv-accent-foreground: ${theme.variables.accentForeground};
    --rpv-destructive: ${theme.variables.destructive};
    --rpv-destructive-foreground: ${theme.variables.destructiveForeground};
    --rpv-highlight: ${theme.variables.highlight};
}`;
  }, [theme]);
  const removeStyles = React__namespace.useCallback(() => {
    const styleEle = document.head.querySelector(`style[${THEME_ATTR}="${theme.name}"]`);
    if (styleEle) {
      document.head.removeChild(styleEle);
    }
  }, [theme]);
  React__namespace.useEffect(() => {
    addStyles();
    return () => {
      removeStyles();
    };
  }, [theme]);
};

const withTheme = (theme) => {
  const initialTheme = React__namespace.useMemo(() => theme === "auto" ? isDarkMode() ? "dark" : "light" : theme, []);
  const [currentTheme, setCurrentTheme] = React__namespace.useState(initialTheme);
  useTheme(currentTheme === "light" ? LIGHT_THEME : DARK_THEME);
  React__namespace.useEffect(() => {
    if (theme !== "auto") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setCurrentTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);
  return [currentTheme, setCurrentTheme];
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const PdfJsApiContext = React__namespace.createContext({});

const STYLE_ID = "___rpv-styles___";
const Provider = ({
  children,
  localization,
  pdfApiProvider,
  theme = {
    direction: TextDirection.LeftToRight,
    theme: "light"
  },
  workerUrl
}) => {
  pdfApiProvider.GlobalWorkerOptions.workerSrc = workerUrl;
  const [l10n, setL10n] = React__namespace.useState(localization || DefaultLocalization);
  const localizationContext = { l10n, setL10n };
  React__namespace.useEffect(() => {
    if (localization) {
      setL10n(localization);
    }
  }, [localization]);
  const themeProps = typeof theme === "string" ? { direction: TextDirection.LeftToRight, theme } : theme;
  const themeStr = themeProps.theme || "light";
  const [currentTheme, setCurrentTheme] = withTheme(themeStr);
  const themeContext = Object.assign(
    {},
    {
      currentTheme,
      direction: themeProps.direction,
      setCurrentTheme
    }
  );
  React__namespace.useInsertionEffect(() => {
    let styleEle = document.head.querySelector(`style[id=${STYLE_ID}]`);
    if (!styleEle) {
      styleEle = document.createElement("style");
      styleEle.setAttribute("id", STYLE_ID);
      document.head.appendChild(styleEle);
      styleEle.textContent = `
.hiddenCanvasElement {
    display: none;
    opacity: 0;
}`;
    }
    return () => {
      document.head.removeChild(styleEle);
    };
  }, []);
  return /* @__PURE__ */ React__namespace.createElement(PdfJsApiContext.Provider, { value: { pdfJsApiProvider: pdfApiProvider } }, /* @__PURE__ */ React__namespace.createElement(LocalizationContext.Provider, { value: localizationContext }, /* @__PURE__ */ React__namespace.createElement(ThemeContext.Provider, { value: themeContext }, children)));
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var Breakpoint = /* @__PURE__ */ ((Breakpoint2) => {
  Breakpoint2["ExtraSmall"] = "ExtraSmall";
  Breakpoint2["Small"] = "Small";
  Breakpoint2["Medium"] = "Medium";
  Breakpoint2["Large"] = "Large";
  Breakpoint2["ExtraLarge"] = "ExtraLarge";
  return Breakpoint2;
})(Breakpoint || {});

const BreakpointContext = React__namespace.createContext(Breakpoint.ExtraSmall);

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
function createStore(initialState) {
  let state = initialState || {};
  const listeners = {};
  const update = (key, data) => {
    state = {
      ...state,
      [key]: data
    };
    (listeners[key] || []).forEach((handler) => handler(state[key]));
  };
  const get = (key) => state[key];
  return {
    subscribe(key, handler) {
      listeners[key] = (listeners[key] || []).concat(handler);
    },
    unsubscribe(key, handler) {
      listeners[key] = (listeners[key] || []).filter((f) => f !== handler);
    },
    update(key, data) {
      update(key, data);
    },
    updateCurrentValue(key, updater) {
      const currentValue = get(key);
      if (currentValue !== void 0) {
        update(key, updater(currentValue));
      }
    },
    get(key) {
      return get(key);
    }
  };
}

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var FullScreenMode = /* @__PURE__ */ ((FullScreenMode2) => {
  FullScreenMode2["Normal"] = "Normal";
  FullScreenMode2["Entering"] = "Entering";
  FullScreenMode2["Entered"] = "Entered";
  FullScreenMode2["Exitting"] = "Exitting";
  FullScreenMode2["Exited"] = "Exited";
  return FullScreenMode2;
})(FullScreenMode || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var LayerRenderStatus = /* @__PURE__ */ ((LayerRenderStatus2) => {
  LayerRenderStatus2[LayerRenderStatus2["PreRender"] = 0] = "PreRender";
  LayerRenderStatus2[LayerRenderStatus2["DidRender"] = 1] = "DidRender";
  return LayerRenderStatus2;
})(LayerRenderStatus || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var PageMode = /* @__PURE__ */ ((PageMode2) => {
  PageMode2["Attachments"] = "UseAttachments";
  PageMode2["Bookmarks"] = "UseOutlines";
  PageMode2["ContentGroup"] = "UseOC";
  PageMode2["Default"] = "UserNone";
  PageMode2["FullScreen"] = "FullScreen";
  PageMode2["Thumbnails"] = "UseThumbs";
  return PageMode2;
})(PageMode || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var PasswordStatus = /* @__PURE__ */ ((PasswordStatus2) => {
  PasswordStatus2["RequiredPassword"] = "RequiredPassword";
  PasswordStatus2["WrongPassword"] = "WrongPassword";
  return PasswordStatus2;
})(PasswordStatus || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var RotateDirection = /* @__PURE__ */ ((RotateDirection2) => {
  RotateDirection2["Backward"] = "Backward";
  RotateDirection2["Forward"] = "Forward";
  return RotateDirection2;
})(RotateDirection || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var ScrollMode = /* @__PURE__ */ ((ScrollMode2) => {
  ScrollMode2["Page"] = "Page";
  ScrollMode2["Horizontal"] = "Horizontal";
  ScrollMode2["Vertical"] = "Vertical";
  ScrollMode2["Wrapped"] = "Wrapped";
  return ScrollMode2;
})(ScrollMode || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var SpecialZoomLevel = /* @__PURE__ */ ((SpecialZoomLevel2) => {
  SpecialZoomLevel2["ActualSize"] = "ActualSize";
  SpecialZoomLevel2["PageFit"] = "PageFit";
  SpecialZoomLevel2["PageWidth"] = "PageWidth";
  return SpecialZoomLevel2;
})(SpecialZoomLevel || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var ViewMode = /* @__PURE__ */ ((ViewMode2) => {
  ViewMode2["DualPage"] = "DualPage";
  ViewMode2["DualPageWithCover"] = "DualPageWithCover";
  ViewMode2["SinglePage"] = "SinglePage";
  return ViewMode2;
})(ViewMode || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const isMac = () => typeof window !== "undefined" ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) : false;

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const normalizeDestination = (pageIndex, destArray) => {
  switch (destArray[1].name) {
    case "XYZ":
      return {
        bottomOffset: (_, viewportHeight) => destArray[3] === null ? viewportHeight : destArray[3],
        leftOffset: (_, __) => destArray[2] === null ? 0 : destArray[2],
        pageIndex,
        scaleTo: destArray[4]
      };
    case "Fit":
    case "FitB":
      return {
        bottomOffset: 0,
        leftOffset: 0,
        pageIndex,
        scaleTo: SpecialZoomLevel.PageFit
      };
    case "FitH":
    case "FitBH":
      return {
        bottomOffset: destArray[2],
        leftOffset: 0,
        pageIndex,
        scaleTo: SpecialZoomLevel.PageWidth
      };
    default:
      return {
        bottomOffset: 0,
        leftOffset: 0,
        pageIndex,
        scaleTo: 1
      };
  }
};
const pageOutlinesMap = /* @__PURE__ */ new Map();
const pagesMap = /* @__PURE__ */ new Map();
const generateRefKey = (doc, outline) => `${doc.loadingTask.docId}___${outline.num}R${outline.gen === 0 ? "" : outline.gen}`;
const getPageIndex = (doc, outline) => {
  const key = generateRefKey(doc, outline);
  return pageOutlinesMap.has(key) ? pageOutlinesMap.get(key) : null;
};
const cacheOutlineRef = (doc, outline, pageIndex) => {
  pageOutlinesMap.set(generateRefKey(doc, outline), pageIndex);
};
const clearPagesCache = () => {
  pageOutlinesMap.clear();
  pagesMap.clear();
};
const getPage = (doc, pageIndex) => {
  if (!doc) {
    return Promise.reject("The document is not loaded yet");
  }
  const pageKey = `${doc.loadingTask.docId}___${pageIndex}`;
  const page = pagesMap.get(pageKey);
  if (page) {
    return Promise.resolve(page);
  }
  return new Promise((resolve, _) => {
    doc.getPage(pageIndex + 1).then((page2) => {
      pagesMap.set(pageKey, page2);
      if (page2.ref) {
        cacheOutlineRef(doc, page2.ref, pageIndex);
      }
      resolve(page2);
    });
  });
};
const getDestination = (doc, dest) => {
  return new Promise((res) => {
    new Promise((resolve) => {
      if (typeof dest === "string") {
        doc.getDestination(dest).then((destArray) => {
          resolve(destArray);
        });
      } else {
        resolve(dest);
      }
    }).then((destArray) => {
      if ("object" === typeof destArray[0] && destArray[0] !== null) {
        const outlineRef = destArray[0];
        const pageIndex = getPageIndex(doc, outlineRef);
        if (pageIndex === null) {
          doc.getPageIndex(outlineRef).then((pageIndex2) => {
            cacheOutlineRef(doc, outlineRef, pageIndex2);
            getDestination(doc, dest).then((result) => res(result));
          });
        } else {
          res(normalizeDestination(pageIndex, destArray));
        }
      } else {
        const target = normalizeDestination(destArray[0], destArray);
        res(target);
      }
    });
  });
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const RESIZE_EVENT_OPTIONS = {
  capture: false,
  passive: true
};
const ZERO_RECT$2 = {
  height: 0,
  width: 0
};
const useWindowResize = () => {
  const [windowRect, setWindowRect] = React__namespace.useState(ZERO_RECT$2);
  const handleResize = useDebounceCallback(() => {
    setWindowRect({
      height: window.innerHeight,
      width: window.innerWidth
    });
  }, 100);
  useIsomorphicLayoutEffect(() => {
    window.addEventListener("resize", handleResize, RESIZE_EVENT_OPTIONS);
    return () => {
      window.removeEventListener("resize", handleResize, RESIZE_EVENT_OPTIONS);
    };
  }, []);
  return windowRect;
};

const ZERO_RECT$1 = {
  height: 0,
  width: 0
};
const EPSILON = 2;
const equal = (a, b) => Math.abs(a - b) <= EPSILON;
const useFullScreen = ({ targetRef }) => {
  const [fullScreenMode, setFullScreenMode] = React__namespace.useState(FullScreenMode.Normal);
  const windowRect = useWindowResize();
  const [targetRect, setTargetRect] = React__namespace.useState(ZERO_RECT$1);
  const windowSizeBeforeFullScreenRef = React__namespace.useRef(ZERO_RECT$1);
  const fullScreenSizeRef = React__namespace.useRef(ZERO_RECT$1);
  const [element, setElement] = React__namespace.useState(targetRef.current);
  const fullScreenElementRef = React__namespace.useRef(null);
  useIsomorphicLayoutEffect(() => {
    if (targetRef.current !== element) {
      setElement(targetRef.current);
    }
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (!element) {
      return;
    }
    const io = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setTargetRect({
          height: entry.target.clientHeight,
          width: entry.target.clientWidth
        });
      });
    });
    io.observe(element);
    return () => {
      io.unobserve(element);
      io.disconnect();
    };
  }, [element]);
  const closeOtherFullScreen = React__namespace.useCallback((target) => {
    const currentFullScreenEle = getFullScreenElement();
    if (currentFullScreenEle && currentFullScreenEle !== target) {
      setFullScreenMode(FullScreenMode.Normal);
      return exitFullScreen(currentFullScreenEle);
    }
    return Promise.resolve();
  }, []);
  const enterFullScreenMode = React__namespace.useCallback((target) => {
    if (!target || !isFullScreenEnabled()) {
      return;
    }
    setElement(target);
    closeOtherFullScreen(target).then(() => {
      fullScreenElementRef.current = target;
      setFullScreenMode(FullScreenMode.Entering);
      requestFullScreen(target);
    });
  }, []);
  const exitFullScreenMode = React__namespace.useCallback(() => {
    const currentFullScreenEle = getFullScreenElement();
    if (currentFullScreenEle) {
      setFullScreenMode(FullScreenMode.Exitting);
      exitFullScreen(document);
    }
  }, []);
  const handleFullScreenChange = React__namespace.useCallback(() => {
    if (!element) {
      return;
    }
    const currentFullScreenEle = getFullScreenElement();
    if (currentFullScreenEle !== element) {
      setFullScreenMode(FullScreenMode.Exitting);
    }
  }, [element]);
  React__namespace.useEffect(() => {
    switch (fullScreenMode) {
      case FullScreenMode.Entering:
        if (fullScreenElementRef.current) {
          fullScreenElementRef.current.style.backgroundColor = "hsl(var(--rpv-background))";
        }
        windowSizeBeforeFullScreenRef.current = {
          height: window.innerHeight,
          width: window.innerWidth
        };
        break;
      // Entering the full screen mode completes
      case FullScreenMode.Entered:
        break;
      case FullScreenMode.Exitting:
        if (fullScreenElementRef.current) {
          fullScreenElementRef.current.style.backgroundColor = "";
          fullScreenElementRef.current = null;
        }
        break;
      // Exitting the full screen mode completes
      case FullScreenMode.Exited:
        setFullScreenMode(FullScreenMode.Normal);
        break;
    }
  }, [fullScreenMode]);
  React__namespace.useEffect(() => {
    if (fullScreenMode === FullScreenMode.Normal) {
      return;
    }
    if (fullScreenMode === FullScreenMode.Entering && equal(windowRect.height, targetRect.height) && equal(windowRect.width, targetRect.width) && windowRect.height > 0 && windowRect.width > 0 && (fullScreenSizeRef.current.height === 0 || equal(windowRect.height, fullScreenSizeRef.current.height))) {
      fullScreenSizeRef.current = {
        height: window.innerHeight,
        width: window.innerWidth
      };
      setFullScreenMode(FullScreenMode.Entered);
      return;
    }
    if (fullScreenMode === FullScreenMode.Exitting && equal(windowSizeBeforeFullScreenRef.current.height, windowRect.height) && equal(windowSizeBeforeFullScreenRef.current.width, windowRect.width) && windowRect.height > 0 && windowRect.width > 0) {
      setFullScreenMode(FullScreenMode.Exited);
    }
  }, [fullScreenMode, windowRect, targetRect]);
  React__namespace.useEffect(() => {
    addFullScreenChangeListener(handleFullScreenChange);
    return () => {
      removeFullScreenChangeListener(handleFullScreenChange);
    };
  }, [element]);
  return {
    enterFullScreenMode,
    exitFullScreenMode,
    fullScreenMode
  };
};

const useTrackResize = ({ targetRef, onResize }) => {
  useIsomorphicLayoutEffect(() => {
    const io = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        onResize(entry.target);
      });
    });
    const container = targetRef.current;
    if (!container) {
      return;
    }
    io.observe(container);
    return () => {
      io.unobserve(container);
    };
  }, []);
};

var styles$a = {"layer":"rpv_3714f726"};

var styles$9 = {"annotation":"rpv_513fe88d","link":"rpv_ebcb8bd8"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var AnnotationBorderStyleType = /* @__PURE__ */ ((AnnotationBorderStyleType2) => {
  AnnotationBorderStyleType2[AnnotationBorderStyleType2["Solid"] = 1] = "Solid";
  AnnotationBorderStyleType2[AnnotationBorderStyleType2["Dashed"] = 2] = "Dashed";
  AnnotationBorderStyleType2[AnnotationBorderStyleType2["Beveled"] = 3] = "Beveled";
  AnnotationBorderStyleType2[AnnotationBorderStyleType2["Inset"] = 4] = "Inset";
  AnnotationBorderStyleType2[AnnotationBorderStyleType2["Underline"] = 5] = "Underline";
  return AnnotationBorderStyleType2;
})(AnnotationBorderStyleType || {});

var styles$8 = {"wrapper":"rpv_2d149583","wrapperRtl":"rpv_e6419e7","title":"rpv_c4feaf48","date":"rpv_d4c704be","content":"rpv_6b24569"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const dateRegex = new RegExp(
  "^D:(\\d{4})(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?([Z|+|-])?(\\d{2})?'?(\\d{2})?'?"
);
const parse = (value, min, max, defaultValue) => {
  const parsed = parseInt(value, 10);
  return parsed >= min && parsed <= max ? parsed : defaultValue;
};
const convertDate = (input) => {
  const matches = dateRegex.exec(input);
  if (!matches) {
    return null;
  }
  const year = parseInt(matches[1], 10);
  const month = parse(matches[2], 1, 12, 1) - 1;
  const day = parse(matches[3], 1, 31, 1);
  let hour = parse(matches[4], 0, 23, 0);
  let minute = parse(matches[5], 0, 59, 0);
  const second = parse(matches[6], 0, 59, 0);
  const universalTimeRelation = matches[7] || "Z";
  const offsetHour = parse(matches[8], 0, 23, 0);
  const offsetMinute = parse(matches[9], 0, 59, 0);
  switch (universalTimeRelation) {
    case "-":
      hour += offsetHour;
      minute += offsetMinute;
      break;
    case "+":
      hour -= offsetHour;
      minute -= offsetMinute;
      break;
  }
  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const getContents = (annotation) => {
  return annotation.contentsObj ? annotation.contentsObj.str : annotation.contents || "";
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const getTitle = (annotation) => {
  return annotation.titleObj ? annotation.titleObj.str : annotation.title || "";
};

const PopupWrapper = ({ annotation }) => {
  const { direction } = React__namespace.useContext(ThemeContext);
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRtl = direction === TextDirection.RightToLeft;
  const containerRef = React__namespace.useRef(null);
  let dateStr = "";
  if (annotation.modificationDate) {
    const date = convertDate(annotation.modificationDate);
    dateStr = date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : "";
  }
  React__namespace.useLayoutEffect(() => {
    const containerEle = containerRef.current;
    if (!containerEle) {
      return;
    }
    const annotationEle = document.querySelector(`[data-annotation-id="${annotation.id}"]`);
    if (!annotationEle) {
      return;
    }
    const ele = annotationEle;
    ele.style.zIndex += 1;
    return () => {
      ele.style.zIndex = `${parseInt(ele.style.zIndex, 10) - 1}`;
    };
  }, []);
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      ref: containerRef,
      className: classNames({
        [styles$8.wrapper]: true,
        [styles$8.wrapperRtl]: isRtl
      }),
      style: {
        top: annotation.annotationType === AnnotationType.Popup ? "" : "100%"
      }
    },
    title && /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        className: classNames({
          [styles$8.title]: true
        })
      },
      title
    ), /* @__PURE__ */ React__namespace.createElement("div", { className: styles$8.date }, dateStr)),
    contents && /* @__PURE__ */ React__namespace.createElement("div", { className: styles$8.content }, contents.split("\n").map((item, index) => /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, { key: index }, item, /* @__PURE__ */ React__namespace.createElement("br", null))))
  );
};

const useTogglePopup = () => {
  const { opened, toggle } = useToggle(false);
  const [togglePopupBy, setTooglePopupBy] = React__namespace.useState("Hover" /* Hover */);
  const toggleOnClick = () => {
    switch (togglePopupBy) {
      case "Click" /* Click */:
        opened && setTooglePopupBy("Hover" /* Hover */);
        toggle(ToggleStatus.Toggle);
        break;
      case "Hover" /* Hover */:
        setTooglePopupBy("Click" /* Click */);
        toggle(ToggleStatus.Open);
        break;
    }
  };
  const openOnHover = () => {
    togglePopupBy === "Hover" /* Hover */ && toggle(ToggleStatus.Open);
  };
  const closeOnHover = () => {
    togglePopupBy === "Hover" /* Hover */ && toggle(ToggleStatus.Close);
  };
  return {
    opened,
    closeOnHover,
    openOnHover,
    toggleOnClick
  };
};

const Annotation = ({ annotation, children, ignoreBorder, hasPopup, isRenderable, page, viewport }) => {
  const { rect } = annotation;
  const { closeOnHover, opened, openOnHover, toggleOnClick } = useTogglePopup();
  const normalizeRect = (r) => [
    Math.min(r[0], r[2]),
    Math.min(r[1], r[3]),
    Math.max(r[0], r[2]),
    Math.max(r[1], r[3])
  ];
  const bound = normalizeRect([
    rect[0],
    page.view[3] + page.view[1] - rect[1],
    rect[2],
    page.view[3] + page.view[1] - rect[3]
  ]);
  let width = rect[2] - rect[0];
  let height = rect[3] - rect[1];
  let styles = {
    borderColor: "",
    borderRadius: "",
    borderStyle: "",
    borderWidth: ""
  };
  if (!ignoreBorder && annotation.borderStyle.width > 0) {
    switch (annotation.borderStyle.style) {
      case AnnotationBorderStyleType.Dashed:
        styles.borderStyle = "dashed";
        break;
      case AnnotationBorderStyleType.Solid:
        styles.borderStyle = "solid";
        break;
      case AnnotationBorderStyleType.Underline:
        styles = Object.assign(
          {
            borderBottomStyle: "solid"
          },
          styles
        );
        break;
      case AnnotationBorderStyleType.Beveled:
      case AnnotationBorderStyleType.Inset:
    }
    const borderWidth = annotation.borderStyle.width;
    styles.borderWidth = `${borderWidth}px`;
    if (annotation.borderStyle.style !== AnnotationBorderStyleType.Underline) {
      width = width - 2 * borderWidth;
      height = height - 2 * borderWidth;
    }
    const { horizontalCornerRadius, verticalCornerRadius } = annotation.borderStyle;
    if (horizontalCornerRadius > 0 || verticalCornerRadius > 0) {
      styles.borderRadius = `${horizontalCornerRadius}px / ${verticalCornerRadius}px`;
    }
    annotation.color ? styles.borderColor = `rgb(${annotation.color[0] | 0}, ${annotation.color[1] | 0}, ${annotation.color[2] | 0})` : (
      // Reset the border width
      styles.borderWidth = "0"
    );
  }
  return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, isRenderable && children({
    popup: {
      opened,
      closeOnHover,
      openOnHover,
      toggleOnClick
    },
    slot: {
      attrs: {
        style: Object.assign(
          {
            height: `${height}px`,
            left: `${bound[0]}px`,
            top: `${bound[1]}px`,
            transform: `matrix(${viewport.transform.join(",")})`,
            transformOrigin: `-${bound[0]}px -${bound[1]}px`,
            width: `${width}px`
          },
          styles
        )
      },
      children: /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, hasPopup && opened && /* @__PURE__ */ React__namespace.createElement(PopupWrapper, { annotation }))
    }
  }));
};

const Caret = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "caret",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

const Circle = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const rect = annotation.rect;
  const width = rect[2] - rect[0];
  const height = rect[3] - rect[1];
  const borderWidth = annotation.borderStyle.width;
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "circle",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      /* @__PURE__ */ React__namespace.createElement(
        "svg",
        {
          height: `${height}px`,
          preserveAspectRatio: "none",
          version: "1.1",
          viewBox: `0 0 ${width} ${height}`,
          width: `${width}px`
        },
        /* @__PURE__ */ React__namespace.createElement(
          "circle",
          {
            cy: height / 2,
            fill: "none",
            rx: width / 2 - borderWidth / 2,
            ry: height / 2 - borderWidth / 2,
            stroke: "transparent",
            strokeWidth: borderWidth || 1
          }
        )
      ),
      props.slot.children
    )
  );
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const getFileName = (url) => {
  const str = url.split("/").pop();
  return str ? str.split("#")[0].split("?")[0] : url;
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const downloadFile = (url, data) => {
  const blobUrl = typeof data === "string" ? "" : URL.createObjectURL(new Blob([data], { type: "" }));
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = blobUrl || url;
  link.setAttribute("download", getFileName(url));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
  }
};

const FileAttachment = ({ annotation, page, viewport }) => {
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const hasPopup = annotation.hasPopup === false && (!!title || !!contents);
  const doubleClick = () => {
    const file = annotation.file;
    file && downloadFile(file.filename, file.content);
  };
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable: true,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "attachment",
        onClick: props.popup.toggleOnClick,
        onDoubleClick: doubleClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

const FreeText = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "free-text",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

const Popup = ({ annotation, page, viewport }) => {
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(title || contents);
  const ignoredParents = ["Circle", "Ink", "Line", "Polygon", "PolyLine", "Square"];
  const hasPopup = !annotation.parentType || ignoredParents.indexOf(annotation.parentType) !== -1;
  useIsomorphicLayoutEffect(() => {
    if (!annotation.parentId) {
      return;
    }
    const parent = document.querySelector(`[data-annotation-id="${annotation.parentId}"]`);
    const container = document.querySelector(`[data-annotation-id="${annotation.id}"]`);
    if (!parent || !container) {
      return;
    }
    const left = parseFloat(parent.style.left);
    const top = parseFloat(parent.style.top) + parseFloat(parent.style.height);
    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.style.transformOrigin = `-${left}px -${top}px`;
  }, []);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: false,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "popup"
      },
      /* @__PURE__ */ React__namespace.createElement(PopupWrapper, { annotation })
    )
  );
};

const Highlight = ({ annotation, childAnnotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  if (annotation.quadPoints && annotation.quadPoints.length > 0) {
    const annotations = annotation.quadPoints.map(
      (quadPoint) => Object.assign({}, annotation, {
        rect: [quadPoint[2].x, quadPoint[2].y, quadPoint[1].x, quadPoint[1].y],
        // Reset the `quadPoints` property to avoid the infinitive loop
        quadPoints: []
      })
    );
    return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, annotations.map((ann, index) => /* @__PURE__ */ React__namespace.createElement(
      Highlight,
      {
        key: index,
        annotation: ann,
        childAnnotation,
        page,
        viewport
      }
    )));
  }
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "highlight",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    ), childAnnotation && childAnnotation.annotationType === AnnotationType.Popup && props.popup.opened && /* @__PURE__ */ React__namespace.createElement(Popup, { annotation: childAnnotation, page, viewport }))
  );
};

const Ink = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const rect = annotation.rect;
  const width = rect[2] - rect[0];
  const height = rect[3] - rect[1];
  const borderWidth = annotation.borderStyle.width;
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "ink",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      annotation.inkLists && annotation.inkLists.length && /* @__PURE__ */ React__namespace.createElement(
        "svg",
        {
          height: `${height}px`,
          preserveAspectRatio: "none",
          version: "1.1",
          viewBox: `0 0 ${width} ${height}`,
          width: `${width}px`
        },
        annotation.inkLists.map((inkList, index) => /* @__PURE__ */ React__namespace.createElement(
          "polyline",
          {
            key: index,
            fill: "none",
            stroke: "transparent",
            strokeWidth: borderWidth || 1,
            points: inkList.map((item) => `${item.x - rect[0]},${rect[3] - item.y}`).join(" ")
          }
        ))
      ),
      props.slot.children
    )
  );
};

const Line = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const rect = annotation.rect;
  const width = rect[2] - rect[0];
  const height = rect[3] - rect[1];
  const borderWidth = annotation.borderStyle.width;
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "line",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      /* @__PURE__ */ React__namespace.createElement(
        "svg",
        {
          height: `${height}px`,
          preserveAspectRatio: "none",
          version: "1.1",
          viewBox: `0 0 ${width} ${height}`,
          width: `${width}px`
        },
        /* @__PURE__ */ React__namespace.createElement(
          "line",
          {
            stroke: "transparent",
            strokeWidth: borderWidth || 1,
            x1: rect[2] - annotation.lineCoordinates[0],
            x2: rect[2] - annotation.lineCoordinates[2],
            y1: rect[3] - annotation.lineCoordinates[1],
            y2: rect[3] - annotation.lineCoordinates[3]
          }
        )
      ),
      props.slot.children
    )
  );
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const INVALID_PROTOCOL = /^([^\w]*)(javascript|data|vbscript)/im;
const HTML_ENTITIES = /&#(\w+)(^\w|;)?/g;
const CTRL_CHARS = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
const URL_SCHEME = /^([^:]+):/gm;
const decodeHtmlEntities = (str) => str.replace(HTML_ENTITIES, (_, dec) => String.fromCharCode(dec));
const sanitizeUrl = (url, defaultUrl = "about:blank") => {
  const result = decodeHtmlEntities(url || "").replace(CTRL_CHARS, "").trim();
  if (!result) {
    return defaultUrl;
  }
  const firstChar = result[0];
  if (firstChar === "." || firstChar === "/") {
    return result;
  }
  const parsedUrlScheme = result.match(URL_SCHEME);
  if (!parsedUrlScheme) {
    return result;
  }
  const scheme = parsedUrlScheme[0];
  return INVALID_PROTOCOL.test(scheme) ? defaultUrl : result;
};

const Link = ({
  annotation,
  annotationContainerRef,
  doc,
  outlines,
  page,
  pageIndex,
  scale,
  viewport,
  onExecuteNamedAction,
  onJumpFromLinkAnnotation,
  onJumpToDest
}) => {
  const elementRef = React__namespace.useRef(null);
  const title = outlines && outlines.length && annotation.dest && typeof annotation.dest === "string" ? outlines.find((item) => item.dest === annotation.dest)?.title : "";
  const link = (e) => {
    e.preventDefault();
    annotation.action ? onExecuteNamedAction(annotation.action) : getDestination(doc, annotation.dest).then((target) => {
      const element = elementRef.current;
      const annotationContainer = annotationContainerRef.current;
      if (element && annotationContainer) {
        const linkRect = element.getBoundingClientRect();
        annotationContainer.style.setProperty("height", "100%");
        annotationContainer.style.setProperty("width", "100%");
        const annotationLayerRect = annotationContainer.getBoundingClientRect();
        annotationContainer.style.removeProperty("height");
        annotationContainer.style.removeProperty("width");
        const leftOffset = (linkRect.left - annotationLayerRect.left) / scale;
        const bottomOffset = (annotationLayerRect.bottom - linkRect.bottom + linkRect.height) / scale;
        onJumpFromLinkAnnotation({
          bottomOffset,
          label: title,
          leftOffset,
          pageIndex
        });
      }
      onJumpToDest(target);
    });
  };
  let isRenderable = !!(annotation.url || annotation.dest || annotation.action || annotation.unsafeUrl);
  let attrs = {};
  if (annotation.url || annotation.unsafeUrl) {
    const targetUrl = sanitizeUrl(annotation.url || annotation.unsafeUrl || "", "");
    if (targetUrl) {
      attrs = {
        "data-target": "external",
        href: targetUrl,
        rel: "noopener noreferrer nofollow",
        target: annotation.newWindow ? "_blank" : "",
        title: targetUrl
      };
    } else {
      isRenderable = false;
    }
  } else {
    attrs = {
      href: "",
      "data-annotation-link": annotation.id,
      onClick: link
    };
  }
  if (title) {
    attrs = Object.assign({}, attrs, {
      title,
      "aria-label": title
    });
  }
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup: false,
      ignoreBorder: false,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "link",
        "data-testid": `core__annotation--link-${annotation.id}`
      },
      /* @__PURE__ */ React__namespace.createElement("a", { className: styles$9.link, ref: elementRef, ...attrs })
    )
  );
};

const Polygon = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const rect = annotation.rect;
  const width = rect[2] - rect[0];
  const height = rect[3] - rect[1];
  const borderWidth = annotation.borderStyle.width;
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "polygon",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      annotation.vertices && annotation.vertices.length && /* @__PURE__ */ React__namespace.createElement(
        "svg",
        {
          height: `${height}px`,
          preserveAspectRatio: "none",
          version: "1.1",
          viewBox: `0 0 ${width} ${height}`,
          width: `${width}px`
        },
        /* @__PURE__ */ React__namespace.createElement(
          "polygon",
          {
            fill: "none",
            stroke: "transparent",
            strokeWidth: borderWidth || 1,
            points: annotation.vertices.map((item) => `${item.x - rect[0]},${rect[3] - item.y}`).join(" ")
          }
        )
      ),
      props.slot.children
    )
  );
};

const Polyline = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const rect = annotation.rect;
  const width = rect[2] - rect[0];
  const height = rect[3] - rect[1];
  const borderWidth = annotation.borderStyle.width;
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "polyline",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      annotation.vertices && annotation.vertices.length && /* @__PURE__ */ React__namespace.createElement(
        "svg",
        {
          height: `${height}px`,
          preserveAspectRatio: "none",
          version: "1.1",
          viewBox: `0 0 ${width} ${height}`,
          width: `${width}px`
        },
        /* @__PURE__ */ React__namespace.createElement(
          "polyline",
          {
            fill: "none",
            stroke: "transparent",
            strokeWidth: borderWidth || 1,
            points: annotation.vertices.map((item) => `${item.x - rect[0]},${rect[3] - item.y}`).join(" ")
          }
        )
      ),
      props.slot.children
    )
  );
};

const Square = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const rect = annotation.rect;
  const width = rect[2] - rect[0];
  const height = rect[3] - rect[1];
  const borderWidth = annotation.borderStyle.width;
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "square",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      /* @__PURE__ */ React__namespace.createElement(
        "svg",
        {
          height: `${height}px`,
          preserveAspectRatio: "none",
          version: "1.1",
          viewBox: `0 0 ${width} ${height}`,
          width: `${width}px`
        },
        /* @__PURE__ */ React__namespace.createElement(
          "rect",
          {
            height: height - borderWidth,
            fill: "none",
            stroke: "transparent",
            strokeWidth: borderWidth || 1,
            x: borderWidth / 2,
            y: borderWidth / 2,
            width: width - borderWidth
          }
        )
      ),
      props.slot.children
    )
  );
};

const Squiggly = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "squiggly",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

const Stamp = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "stamp",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

const StrikeOut = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "strike-out",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const CommentIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: "M.5,16.5a1,1,0,0,0,1,1h2v4l4-4h15a1,1,0,0,0,1-1V3.5a1,1,0,0,0-1-1H1.5a1,1,0,0,0-1,1Z" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M7.25,9.75A.25.25,0,1,1,7,10a.25.25,0,0,1,.25-.25" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M12,9.75a.25.25,0,1,1-.25.25A.25.25,0,0,1,12,9.75" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M16.75,9.75a.25.25,0,1,1-.25.25.25.25,0,0,1,.25-.25" }));

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const HelpIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: "M0.500 12.001 A11.500 11.500 0 1 0 23.500 12.001 A11.500 11.500 0 1 0 0.500 12.001 Z" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M6.000 12.001 A6.000 6.000 0 1 0 18.000 12.001 A6.000 6.000 0 1 0 6.000 12.001 Z" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M21.423 5.406L17.415 9.414" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M14.587 6.585L18.607 2.565" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M5.405 21.424L9.413 17.416" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M6.585 14.588L2.577 18.596" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M18.602 21.419L14.595 17.412" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M17.419 14.58L21.428 18.589" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M2.582 5.399L6.588 9.406" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M9.421 6.581L5.412 2.572" }));

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const KeyIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: "M4.000 18.500 A1.500 1.500 0 1 0 7.000 18.500 A1.500 1.500 0 1 0 4.000 18.500 Z" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M20.5.5l-9.782,9.783a7,7,0,1,0,3,3L17,10h1.5V8.5L19,8h1.5V6.5L21,6h1.5V4.5l1-1V.5Z" }));

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const NoteIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: "M2.000 2.500 L22.000 2.500 L22.000 23.500 L2.000 23.500 Z" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M6 4.5L6 0.5" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M18 4.5L18 0.5" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M10 4.5L10 0.5" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M14 4.5L14 0.5" }));

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const ParagraphIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: "M17.5 0.498L17.5 23.498" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M10.5 0.498L10.5 23.498" }), /* @__PURE__ */ React__namespace.createElement("path", { d: "M23.5.5H6.5a6,6,0,0,0,0,12h4" }));

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const TriangleIcon = () => /* @__PURE__ */ React__namespace.createElement(Icon, { size: 16 }, /* @__PURE__ */ React__namespace.createElement("path", { d: "M2.5 22.995L12 6.005 21.5 22.995 2.5 22.995z" }));

const Text = ({ annotation, childAnnotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  const name = annotation.name ? annotation.name.toLowerCase() : "";
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: false,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "text",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      name && /* @__PURE__ */ React__namespace.createElement("div", { className: "rpv-core__annotation-text-icon" }, name === "check" && /* @__PURE__ */ React__namespace.createElement(CheckIcon, null), name === "comment" && /* @__PURE__ */ React__namespace.createElement(CommentIcon, null), name === "help" && /* @__PURE__ */ React__namespace.createElement(HelpIcon, null), name === "insert" && /* @__PURE__ */ React__namespace.createElement(TriangleIcon, null), name === "key" && /* @__PURE__ */ React__namespace.createElement(KeyIcon, null), name === "note" && /* @__PURE__ */ React__namespace.createElement(NoteIcon, null), (name === "newparagraph" || name === "paragraph") && /* @__PURE__ */ React__namespace.createElement(ParagraphIcon, null)),
      props.slot.children
    ), childAnnotation && childAnnotation.annotationType === AnnotationType.Popup && props.popup.opened && /* @__PURE__ */ React__namespace.createElement(Popup, { annotation: childAnnotation, page, viewport }))
  );
};

const Underline = ({ annotation, page, viewport }) => {
  const hasPopup = annotation.hasPopup === false;
  const title = getTitle(annotation);
  const contents = getContents(annotation);
  const isRenderable = !!(annotation.hasPopup || title || contents);
  return /* @__PURE__ */ React__namespace.createElement(
    Annotation,
    {
      annotation,
      hasPopup,
      ignoreBorder: true,
      isRenderable,
      page,
      viewport
    },
    (props) => /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        ...props.slot.attrs,
        className: styles$9.annotation,
        "data-annotation-id": annotation.id,
        "data-annotation-type": "underline",
        onClick: props.popup.toggleOnClick,
        onMouseEnter: props.popup.openOnHover,
        onMouseLeave: props.popup.closeOnHover
      },
      props.slot.children
    )
  );
};

const AnnotationLayerBody = ({
  annotations,
  doc,
  outlines,
  page,
  pageIndex,
  plugins,
  rotation,
  scale,
  onExecuteNamedAction,
  onJumpFromLinkAnnotation,
  onJumpToDest
}) => {
  const containerRef = React__namespace.useRef(null);
  const viewport = page.getViewport({ rotation, scale });
  const clonedViewPort = viewport.clone({ dontFlip: true });
  const filterAnnotations = annotations.filter((annotation) => !annotation.parentId);
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const renderProps = {
      annotations: filterAnnotations,
      container,
      pageIndex,
      rotation,
      scale
    };
    const handleRenderAnnotationLayer = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => {
          handleRenderAnnotationLayer(dep);
        });
      }
      if (plugin.onAnnotationLayerRender) {
        plugin.onAnnotationLayerRender(renderProps);
      }
    };
    plugins.forEach((plugin) => {
      handleRenderAnnotationLayer(plugin);
    });
  }, []);
  return /* @__PURE__ */ React__namespace.createElement("div", { ref: containerRef, className: styles$a.layer, "data-testid": `core__annotation-layer-${pageIndex}` }, filterAnnotations.map((annotation) => {
    const childAnnotation = annotations.find((item) => item.parentId === annotation.id);
    switch (annotation.annotationType) {
      case AnnotationType.Caret:
        return /* @__PURE__ */ React__namespace.createElement(Caret, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.Circle:
        return /* @__PURE__ */ React__namespace.createElement(Circle, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.FileAttachment:
        return /* @__PURE__ */ React__namespace.createElement(
          FileAttachment,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.FreeText:
        return /* @__PURE__ */ React__namespace.createElement(
          FreeText,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Highlight:
        return /* @__PURE__ */ React__namespace.createElement(
          Highlight,
          {
            key: annotation.id,
            annotation,
            childAnnotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Ink:
        return /* @__PURE__ */ React__namespace.createElement(Ink, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.Line:
        return /* @__PURE__ */ React__namespace.createElement(Line, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.Link:
        return /* @__PURE__ */ React__namespace.createElement(
          Link,
          {
            key: annotation.id,
            annotation,
            annotationContainerRef: containerRef,
            doc,
            outlines,
            page,
            pageIndex,
            scale,
            viewport: clonedViewPort,
            onExecuteNamedAction,
            onJumpFromLinkAnnotation,
            onJumpToDest
          }
        );
      case AnnotationType.Polygon:
        return /* @__PURE__ */ React__namespace.createElement(
          Polygon,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Polyline:
        return /* @__PURE__ */ React__namespace.createElement(
          Polyline,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Popup:
        return /* @__PURE__ */ React__namespace.createElement(Popup, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.Square:
        return /* @__PURE__ */ React__namespace.createElement(Square, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.Squiggly:
        return /* @__PURE__ */ React__namespace.createElement(
          Squiggly,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Stamp:
        return /* @__PURE__ */ React__namespace.createElement(Stamp, { key: annotation.id, annotation, page, viewport: clonedViewPort });
      case AnnotationType.StrikeOut:
        return /* @__PURE__ */ React__namespace.createElement(
          StrikeOut,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Text:
        return /* @__PURE__ */ React__namespace.createElement(
          Text,
          {
            key: annotation.id,
            annotation,
            childAnnotation,
            page,
            viewport: clonedViewPort
          }
        );
      case AnnotationType.Underline:
        return /* @__PURE__ */ React__namespace.createElement(
          Underline,
          {
            key: annotation.id,
            annotation,
            page,
            viewport: clonedViewPort
          }
        );
      default:
        return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, { key: annotation.id });
    }
  }));
};

const AnnotationLoader = ({ page, renderAnnotations }) => {
  const [status, setStatus] = useSafeState({
    loading: true,
    annotations: []
  });
  React__namespace.useEffect(() => {
    page.getAnnotations({ intent: "display" }).then((result) => {
      setStatus({
        loading: false,
        annotations: result
      });
    });
  }, []);
  return status.loading ? /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null) : renderAnnotations(status.annotations);
};

const AnnotationLayer = ({
  doc,
  outlines,
  page,
  pageIndex,
  plugins,
  rotation,
  scale,
  onExecuteNamedAction,
  onJumpFromLinkAnnotation,
  onJumpToDest
}) => {
  const renderAnnotations = (annotations) => /* @__PURE__ */ React__namespace.createElement(
    AnnotationLayerBody,
    {
      annotations,
      doc,
      outlines,
      page,
      pageIndex,
      plugins,
      rotation,
      scale,
      onExecuteNamedAction,
      onJumpFromLinkAnnotation,
      onJumpToDest
    }
  );
  return /* @__PURE__ */ React__namespace.createElement(AnnotationLoader, { page, renderAnnotations });
};

var styles$7 = {"layer":"rpv_1a2e23c6","layerSingle":"rpv_377727ae"};

var styles$6 = {"layer":"rpv_6c43a95d"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const floatToRatio = (x, limit) => {
  if (Math.floor(x) === x) {
    return [x, 1];
  }
  const y = 1 / x;
  if (y > limit) {
    return [1, limit];
  }
  if (Math.floor(y) === y) {
    return [1, y];
  }
  const value = x > 1 ? y : x;
  let a = 0;
  let b = 1;
  let c = 1;
  let d = 1;
  while (true) {
    let numerator = a + c;
    let denominator = b + d;
    if (denominator > limit) {
      break;
    }
    value <= numerator / denominator ? [c, d] = [numerator, denominator] : [a, b] = [numerator, denominator];
  }
  const middle = (a / b + c / d) / 2;
  return value < middle ? value === x ? [a, b] : [b, a] : value === x ? [c, d] : [d, c];
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const roundToDivide = (a, b) => {
  const remainder = a % b;
  return remainder === 0 ? a : Math.floor(a - remainder);
};

const MAX_CANVAS_SIZE = 4096 * 4096;
const CanvasLayer = ({ canvasLayerRef, height, page, pageIndex, plugins, rotation, scale, width, onRenderCanvasCompleted }) => {
  const renderTask = React__namespace.useRef();
  useIsomorphicLayoutEffect(() => {
    const task = renderTask.current;
    if (task) {
      task.cancel();
    }
    const canvasEle = canvasLayerRef.current;
    if (!canvasEle) {
      return;
    }
    canvasEle.removeAttribute("data-testid");
    const preRenderProps = {
      ele: canvasEle,
      pageIndex,
      rotation,
      scale,
      status: LayerRenderStatus.PreRender
    };
    const handlePreRenderCanvasLayer = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => handlePreRenderCanvasLayer(dep));
      }
      if (plugin.onCanvasLayerRender) {
        plugin.onCanvasLayerRender(preRenderProps);
      }
    };
    plugins.forEach((plugin) => handlePreRenderCanvasLayer(plugin));
    const viewport = page.getViewport({
      rotation,
      scale
    });
    const outputScale = window.devicePixelRatio || 1;
    const maxScale = Math.sqrt(MAX_CANVAS_SIZE / (viewport.width * viewport.height));
    const shouldScaleByCSS = outputScale > maxScale;
    shouldScaleByCSS ? canvasEle.style.transform = `scale(1, 1)` : canvasEle.style.removeProperty("transform");
    const possibleScale = Math.min(maxScale, outputScale);
    const [x, y] = floatToRatio(possibleScale, 8);
    canvasEle.width = roundToDivide(viewport.width * possibleScale, x);
    canvasEle.height = roundToDivide(viewport.height * possibleScale, x);
    canvasEle.style.width = `${roundToDivide(viewport.width, y)}px`;
    canvasEle.style.height = `${roundToDivide(viewport.height, y)}px`;
    canvasEle.hidden = true;
    const canvasContext = canvasEle.getContext("2d", { alpha: false });
    if (!canvasContext) {
      return;
    }
    const transform = shouldScaleByCSS || outputScale !== 1 ? [possibleScale, 0, 0, possibleScale, 0, 0] : void 0;
    renderTask.current = page.render({ canvasContext, transform, viewport });
    renderTask.current.promise.then(
      () => {
        canvasEle.hidden = false;
        canvasEle.setAttribute("data-testid", `core__canvas-layer-${pageIndex}`);
        const didRenderProps = {
          ele: canvasEle,
          pageIndex,
          rotation,
          scale,
          status: LayerRenderStatus.DidRender
        };
        const handleDidRenderCanvasLayer = (plugin) => {
          if (plugin.dependencies) {
            plugin.dependencies.forEach((dep) => handleDidRenderCanvasLayer(dep));
          }
          if (plugin.onCanvasLayerRender) {
            plugin.onCanvasLayerRender(didRenderProps);
          }
        };
        plugins.forEach((plugin) => handleDidRenderCanvasLayer(plugin));
        onRenderCanvasCompleted();
      },
      () => {
        onRenderCanvasCompleted();
      }
    );
    return () => {
      if (canvasEle) {
        canvasEle.width = 0;
        canvasEle.height = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      className: styles$6.layer,
      style: {
        height: `${height}px`,
        width: `${width}px`
      }
    },
    /* @__PURE__ */ React__namespace.createElement("canvas", { ref: canvasLayerRef })
  );
};

const SvgLayer = ({ height, page, rotation, scale, width }) => {
  const { pdfJsApiProvider } = React__namespace.useContext(PdfJsApiContext);
  const containerRef = React__namespace.useRef(null);
  const empty = () => {
    const containerEle = containerRef.current;
    if (!containerEle) {
      return;
    }
    containerEle.innerHTML = "";
  };
  useIsomorphicLayoutEffect(() => {
    const containerEle = containerRef.current;
    if (!pdfJsApiProvider || !containerEle) {
      return;
    }
    const viewport = page.getViewport({ rotation, scale });
    page.getOperatorList().then((operatorList) => {
      empty();
      const graphic = new pdfJsApiProvider.SVGGraphics(page.commonObjs, page.objs);
      graphic.getSVG(operatorList, viewport).then((svg) => {
        svg.style.height = `${height}px`;
        svg.style.width = `${width}px`;
        containerEle.appendChild(svg);
      });
    });
  }, []);
  return /* @__PURE__ */ React__namespace.createElement("div", { className: "rpv-core__svg-layer", ref: containerRef });
};

var styles$5 = {"layer":"rpv_532f1268","text":"rpv_764f8936"};

const TextLayer = ({ containerRef, page, pageIndex, plugins, rotation, scale, onRenderTextCompleted }) => {
  const { pdfJsApiProvider } = React__namespace.useContext(PdfJsApiContext);
  const renderTaskRef = React__namespace.useRef();
  const empty = () => {
    const containerEle = containerRef.current;
    if (!containerEle) {
      return;
    }
    const spans = [].slice.call(containerEle.querySelectorAll(`.${styles$5.text}`));
    spans.forEach((span) => containerEle.removeChild(span));
    const breaks = [].slice.call(containerEle.querySelectorAll('br[role="presentation"]'));
    breaks.forEach((br) => containerEle.removeChild(br));
  };
  useIsomorphicLayoutEffect(() => {
    const task = renderTaskRef.current;
    if (task) {
      task.cancel();
    }
    const containerEle = containerRef.current;
    if (!containerEle || !pdfJsApiProvider) {
      return;
    }
    containerEle.removeAttribute("data-testid");
    const viewport = page.getViewport({ rotation, scale });
    const preRenderProps = {
      ele: containerEle,
      pageIndex,
      scale,
      status: LayerRenderStatus.PreRender
    };
    const handlePreRenderTextLayer = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => handlePreRenderTextLayer(dep));
      }
      if (plugin.onTextLayerRender) {
        plugin.onTextLayerRender(preRenderProps);
      }
    };
    plugins.forEach((plugin) => handlePreRenderTextLayer(plugin));
    page.getTextContent().then((textContent) => {
      empty();
      containerEle.style.setProperty("--scale-factor", `${scale}`);
      renderTaskRef.current = new pdfJsApiProvider.TextLayer({
        container: containerEle,
        textContentSource: textContent,
        viewport
      });
      renderTaskRef.current.render().then(
        () => {
          containerEle.setAttribute("data-testid", `core__text-layer-${pageIndex}`);
          containerEle.removeAttribute("data-main-rotation");
          const spans = [].slice.call(containerEle.children);
          spans.forEach((span) => {
            if (span.getAttribute("data-text") !== "true") {
              span.classList.add(styles$5.text);
              span.setAttribute("data-text", "true");
            }
          });
          const didRenderProps = {
            ele: containerEle,
            pageIndex,
            scale,
            status: LayerRenderStatus.DidRender
          };
          const handleDidRenderTextLayer = (plugin) => {
            if (plugin.dependencies) {
              plugin.dependencies.forEach((dep) => handleDidRenderTextLayer(dep));
            }
            if (plugin.onTextLayerRender) {
              plugin.onTextLayerRender(didRenderProps);
            }
          };
          plugins.forEach((plugin) => handleDidRenderTextLayer(plugin));
          onRenderTextCompleted();
        },
        () => {
          containerEle.removeAttribute("data-testid");
          onRenderTextCompleted();
        }
      );
    });
    return () => {
      empty();
      const task2 = renderTaskRef.current;
      if (task2 && typeof task2.cancel === "function") {
        task2.cancel();
      }
    };
  }, []);
  let transform = "";
  switch (Math.abs(rotation)) {
    case 90:
      transform = "rotate(90deg) translateY(-100%)";
      break;
    case 180:
      transform = "rotate(180deg) translate(-100%, -100%)";
      break;
    case 270:
      transform = "rotate(270deg) translateX(-100%)";
      break;
    default:
      transform = "";
      break;
  }
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      className: styles$5.layer,
      ref: containerRef,
      style: {
        transform
      }
    }
  );
};

const PageLayer = ({
  doc,
  measureRef,
  outlines,
  pageIndex,
  pageRotation,
  pageSize,
  plugins,
  renderPage,
  renderQueueKey,
  rotation,
  scale,
  shouldRender,
  viewMode,
  onExecuteNamedAction,
  onJumpFromLinkAnnotation,
  onJumpToDest,
  onRenderCompleted,
  onRotatePage
}) => {
  const isMountedRef = useIsMounted();
  const [page, setPage] = useSafeState(null);
  const [canvasLayerRendered, setCanvasLayerRendered] = useSafeState(false);
  const [textLayerRendered, setTextLayerRendered] = useSafeState(false);
  const canvasLayerRef = React__namespace.useRef(null);
  const textLayerRef = React__namespace.useRef(null);
  const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
  const scaledWidth = pageSize.pageWidth * scale;
  const scaledHeight = pageSize.pageHeight * scale;
  const w = isVertical ? scaledWidth : scaledHeight;
  const h = isVertical ? scaledHeight : scaledWidth;
  const rotationValue = (pageSize.rotation + rotation + pageRotation) % 360;
  const renderQueueKeyRef = React__namespace.useRef(0);
  const determinePageInstance = () => {
    getPage(doc, pageIndex).then((pdfPage) => {
      renderQueueKeyRef.current = renderQueueKey;
      setPage(pdfPage);
    });
  };
  const defaultPageRenderer = (props) => /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, props.canvasLayer.children, props.textLayer.children, props.annotationLayer.children);
  const renderPageLayer = renderPage || defaultPageRenderer;
  const handleRenderCanvasCompleted = () => {
    setCanvasLayerRendered(true);
  };
  const handleRenderTextCompleted = () => {
    setTextLayerRendered(true);
  };
  const renderPluginsLayer = (plugins2) => plugins2.map((plugin, idx) => /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, { key: idx }, plugin.dependencies && renderPluginsLayer(plugin.dependencies), plugin.renderPageLayer && plugin.renderPageLayer({
    canvasLayerRef,
    canvasLayerRendered,
    doc,
    height: h,
    pageIndex,
    rotation: rotationValue,
    scale,
    textLayerRef,
    textLayerRendered,
    width: w
  })));
  React__namespace.useEffect(() => {
    setPage(null);
    setCanvasLayerRendered(false);
    setTextLayerRendered(false);
  }, [pageRotation, rotation, scale]);
  React__namespace.useEffect(() => {
    if (shouldRender && isMountedRef.current && !page) {
      determinePageInstance();
    }
  }, [shouldRender, page]);
  React__namespace.useEffect(() => {
    if (canvasLayerRendered && textLayerRendered) {
      if (renderQueueKey !== renderQueueKeyRef.current) {
        setPage(null);
        setCanvasLayerRendered(false);
        setTextLayerRendered(false);
      } else {
        onRenderCompleted(pageIndex);
      }
    }
  }, [canvasLayerRendered, textLayerRendered]);
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      className: classNames({
        [styles$7.layer]: true,
        [styles$7.layerSingle]: viewMode === ViewMode.SinglePage
      }),
      "data-testid": `core__page-layer-${pageIndex}`,
      ref: measureRef,
      style: {
        height: `${h}px`,
        width: `${w}px`
      }
    },
    !page ? /* @__PURE__ */ React__namespace.createElement(Spinner, { testId: `core__page-layer-loading-${pageIndex}` }) : /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, renderPageLayer({
      annotationLayer: {
        attrs: {},
        children: /* @__PURE__ */ React__namespace.createElement(
          AnnotationLayer,
          {
            doc,
            outlines,
            page,
            pageIndex,
            plugins,
            rotation: rotationValue,
            scale,
            onExecuteNamedAction,
            onJumpFromLinkAnnotation,
            onJumpToDest
          }
        )
      },
      canvasLayer: {
        attrs: {},
        children: /* @__PURE__ */ React__namespace.createElement(
          CanvasLayer,
          {
            canvasLayerRef,
            height: h,
            page,
            pageIndex,
            plugins,
            rotation: rotationValue,
            scale,
            width: w,
            onRenderCanvasCompleted: handleRenderCanvasCompleted
          }
        )
      },
      canvasLayerRendered,
      doc,
      height: h,
      pageIndex,
      rotation: rotationValue,
      scale,
      svgLayer: {
        attrs: {},
        children: /* @__PURE__ */ React__namespace.createElement(SvgLayer, { height: h, page, rotation: rotationValue, scale, width: w })
      },
      textLayer: {
        attrs: {},
        children: /* @__PURE__ */ React__namespace.createElement(
          TextLayer,
          {
            containerRef: textLayerRef,
            page,
            pageIndex,
            plugins,
            rotation: rotationValue,
            scale,
            onRenderTextCompleted: handleRenderTextCompleted
          }
        )
      },
      textLayerRendered,
      width: w,
      markRendered: onRenderCompleted,
      onRotatePage: (direction) => onRotatePage(pageIndex, direction)
    }), renderPluginsLayer(plugins))
  );
};

var styles$4 = {"container":"rpv_13f009ca","pages":"rpv_1c42b98d","pagesRtl":"rpv_b8d8019d","pagesSingle":"rpv_7a000c35","pageContainerSingle":"rpv_d6013a3","pageSingle":"rpv_ad84578e","pageDualEven":"rpv_ac6bd97c","pageDualOdd":"rpv_fd4df08d","pageDualCover":"rpv_e0f03795","pageDualCoverOdd":"rpv_5255595a","pageDualCoverEven":"rpv_f8518a4f"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const getFileExt = (url) => {
  const str = url.split(/\./).pop();
  return str ? str.toLowerCase() : "";
};

const rectReducer = (state, action) => {
  const rect = action.rect;
  return state.height !== rect.height || state.width !== rect.width ? rect : state;
};
const useMeasureRect = ({ elementRef }) => {
  const [element, setElement] = React__namespace.useState(elementRef.current);
  const initializedRectRef = React__namespace.useRef(false);
  const [rect, dispatch] = React__namespace.useReducer(rectReducer, { height: 0, width: 0 });
  useIsomorphicLayoutEffect(() => {
    if (elementRef.current !== element) {
      setElement(elementRef.current);
    }
  });
  useIsomorphicLayoutEffect(() => {
    if (element && !initializedRectRef.current) {
      initializedRectRef.current = true;
      const { height, width } = element.getBoundingClientRect();
      dispatch({
        rect: { height, width }
      });
    }
  }, [element]);
  React__namespace.useEffect(() => {
    if (!element) {
      return;
    }
    const tracker = new ResizeObserver((entries, __) => {
      entries.forEach((entry) => {
        if (entry.target === element) {
          const { height, width } = entry.contentRect;
          dispatch({
            rect: { height, width }
          });
        }
      });
    });
    tracker.observe(element);
    return () => {
      tracker.unobserve(element);
    };
  }, [element]);
  return rect;
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
var ScrollDirection = /* @__PURE__ */ ((ScrollDirection2) => {
  ScrollDirection2["Horizontal"] = "Horizontal";
  ScrollDirection2["Vertical"] = "Vertical";
  ScrollDirection2["Both"] = "Both";
  return ScrollDirection2;
})(ScrollDirection || {});

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const EPS = 1e-4;
const smoothScroll = (ele, scrollDirection, targetPosition, duration, easing = (t) => t, onReachTarget = () => {
}) => {
  let top = 0;
  let left = 0;
  let reachTarget = false;
  switch (scrollDirection) {
    case ScrollDirection.Horizontal:
      left = ele.scrollLeft;
      top = 0;
      break;
    case ScrollDirection.Both:
      left = ele.scrollLeft;
      top = ele.scrollTop;
      break;
    case ScrollDirection.Vertical:
    default:
      left = 0;
      top = ele.scrollTop;
      break;
  }
  const markTargetReached = () => {
    if (!reachTarget) {
      reachTarget = true;
      ele.scrollLeft = targetPosition.left;
      ele.scrollTop = targetPosition.top;
      onReachTarget();
    }
  };
  if (Math.abs(top - targetPosition.top) <= EPS && scrollDirection === ScrollDirection.Vertical) {
    markTargetReached();
    return;
  }
  if (Math.abs(left - targetPosition.left) <= EPS && scrollDirection === ScrollDirection.Horizontal) {
    markTargetReached();
    return;
  }
  let startTime = -1;
  let requestId;
  const offset = {
    left: left - targetPosition.left,
    top: top - targetPosition.top
  };
  const loop = (currentTime) => {
    if (startTime === -1) {
      startTime = currentTime;
    }
    const time = currentTime - startTime;
    const percent = Math.min(time / duration, 1);
    const easedPercent = easing(percent);
    const updatePosition = {
      left: left - offset.left * easedPercent,
      top: top - offset.top * easedPercent
    };
    switch (scrollDirection) {
      case ScrollDirection.Horizontal:
        ele.scrollLeft = updatePosition.left;
        break;
      case ScrollDirection.Both:
        ele.scrollLeft = updatePosition.left;
        ele.scrollTop = updatePosition.top;
        break;
      case ScrollDirection.Vertical:
      default:
        ele.scrollTop = updatePosition.top;
        break;
    }
    if (Math.abs(updatePosition.top - targetPosition.top) <= EPS && Math.abs(updatePosition.left - targetPosition.left) <= EPS && !reachTarget) {
      window.cancelAnimationFrame(requestId);
      markTargetReached();
    }
    if (time < duration) {
      requestId = window.requestAnimationFrame(loop);
    } else {
      window.cancelAnimationFrame(requestId);
    }
  };
  requestId = window.requestAnimationFrame(loop);
};

const ZERO_OFFSET$6 = {
  left: 0,
  top: 0
};
const SCROLL_EVENT_OPTIONS = {
  capture: false,
  passive: true
};
const SCROLL_DURATION = 400;
const useScroll = ({
  elementRef,
  enableSmoothScroll,
  isRtl,
  scrollDirection,
  onSmoothScroll
}) => {
  const [scrollOffset, setScrollOffset] = React__namespace.useState(ZERO_OFFSET$6);
  const [element, setElement] = React__namespace.useState(elementRef.current);
  const factor = isRtl ? -1 : 1;
  const latestRef = React__namespace.useRef(scrollDirection);
  latestRef.current = scrollDirection;
  const latestOffsetRef = React__namespace.useRef(ZERO_OFFSET$6);
  const isSmoothScrollingDoneRef = React__namespace.useRef(true);
  const handleSmoothScrollingComplete = React__namespace.useCallback(() => {
    isSmoothScrollingDoneRef.current = true;
    if (enableSmoothScroll) {
      setScrollOffset(latestOffsetRef.current);
    }
    onSmoothScroll(false);
  }, []);
  const handleScroll = React__namespace.useCallback(() => {
    if (!element) {
      return;
    }
    switch (latestRef.current) {
      case ScrollDirection.Horizontal:
        latestOffsetRef.current = {
          left: factor * element.scrollLeft,
          top: 0
        };
        break;
      case ScrollDirection.Both:
        latestOffsetRef.current = {
          left: factor * element.scrollLeft,
          top: element.scrollTop
        };
        break;
      case ScrollDirection.Vertical:
      default:
        latestOffsetRef.current = {
          left: 0,
          top: element.scrollTop
        };
        break;
    }
    if (!enableSmoothScroll || isSmoothScrollingDoneRef.current) {
      setScrollOffset(latestOffsetRef.current);
    }
  }, [element]);
  useIsomorphicLayoutEffect(() => {
    setElement(elementRef.current);
  });
  useIsomorphicLayoutEffect(() => {
    if (!element) {
      return;
    }
    element.addEventListener("scroll", handleScroll, SCROLL_EVENT_OPTIONS);
    return () => {
      element.removeEventListener("scroll", handleScroll, SCROLL_EVENT_OPTIONS);
    };
  }, [element]);
  const scrollTo = React__namespace.useCallback(
    (targetPosition, withSmoothScroll) => {
      const ele = elementRef.current;
      if (!ele) {
        return Promise.resolve();
      }
      const updatePosition = {
        left: 0,
        top: 0
      };
      switch (latestRef.current) {
        case ScrollDirection.Horizontal:
          updatePosition.left = factor * targetPosition.left;
          break;
        case ScrollDirection.Both:
          updatePosition.left = factor * targetPosition.left;
          updatePosition.top = targetPosition.top;
          break;
        case ScrollDirection.Vertical:
        default:
          updatePosition.top = targetPosition.top;
          break;
      }
      if (withSmoothScroll) {
        isSmoothScrollingDoneRef.current = false;
        onSmoothScroll(true);
        return new Promise((resolve, _) => {
          smoothScroll(ele, latestRef.current, updatePosition, SCROLL_DURATION, easeOutQuart, () => {
            handleSmoothScrollingComplete();
            resolve();
          });
        });
      }
      return new Promise((resolve, _) => {
        switch (latestRef.current) {
          case ScrollDirection.Horizontal:
            ele.scrollLeft = updatePosition.left;
            break;
          case ScrollDirection.Both:
            ele.scrollLeft = updatePosition.left;
            ele.scrollTop = updatePosition.top;
            break;
          case ScrollDirection.Vertical:
          default:
            ele.scrollTop = updatePosition.top;
            break;
        }
        resolve();
      });
    },
    [elementRef.current]
  );
  return {
    scrollOffset,
    scrollTo
  };
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const indexOfMax = (arr) => arr.reduce((prev, curr, i, a) => curr > a[prev] ? i : prev, 0);

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const buildContainerStyles = (totalSize, scrollMode) => {
  switch (scrollMode) {
    case ScrollMode.Horizontal:
      return {
        position: "relative",
        height: "100%",
        width: `${totalSize.width}px`
      };
    case ScrollMode.Vertical:
    default:
      return {
        position: "relative",
        height: `${totalSize.height}px`,
        width: "100%"
      };
  }
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const buildItemContainerStyles = (item, parentRect, scrollMode) => scrollMode !== ScrollMode.Page ? {} : {
  // Size
  height: `${parentRect.height}px`,
  width: "100%",
  // Absolute position
  position: "absolute",
  top: 0,
  transform: `translateY(${item.start.top}px)`
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const hasDifferentSizes = (sizes) => {
  const numberOfItems = sizes.length;
  if (numberOfItems === 1) {
    return false;
  }
  for (let i = 1; i < numberOfItems; i++) {
    if (sizes[i].height !== sizes[0].height || sizes[i].width !== sizes[0].width) {
      return true;
    }
  }
  return false;
};
const getMinWidthOfCover = (sizes, viewMode) => {
  if (viewMode !== ViewMode.DualPageWithCover) {
    return 0;
  }
  if (!hasDifferentSizes(sizes)) {
    return 2 * sizes[0].width;
  }
  const chunkWidths = chunk(sizes.slice(1), 2).map(
    (eachChunk) => eachChunk.length === 2 ? eachChunk[0].width + eachChunk[1].width : eachChunk[0].width
  );
  const widths = [sizes[0].width].concat(chunkWidths);
  return Math.max(...widths);
};
const buildItemStyles = (item, isRtl, sizes, viewMode, scrollMode) => {
  const sideProperty = isRtl ? "right" : "left";
  const factor = isRtl ? -1 : 1;
  const numberOfItems = sizes.length;
  const left = item.start.left * factor;
  const { height, width } = item.size;
  if (viewMode === ViewMode.DualPageWithCover) {
    const transformTop = scrollMode === ScrollMode.Page ? 0 : item.start.top;
    if (item.index === 0 || numberOfItems % 2 === 0 && item.index === numberOfItems - 1) {
      return {
        // Size
        height: `${height}px`,
        minWidth: `${getMinWidthOfCover(sizes, viewMode)}px`,
        width: "100%",
        // Absolute position
        [sideProperty]: 0,
        position: "absolute",
        top: 0,
        transform: `translate(${left}px, ${transformTop}px)`
      };
    }
    return {
      // Size
      height: `${height}px`,
      width: `${width}px`,
      // Absolute position
      [sideProperty]: 0,
      position: "absolute",
      top: 0,
      transform: `translate(${left}px, ${transformTop}px)`
    };
  }
  if (viewMode === ViewMode.DualPage) {
    return {
      // Size
      height: `${height}px`,
      width: `${width}px`,
      // Absolute position
      [sideProperty]: 0,
      position: "absolute",
      top: 0,
      transform: `translate(${left}px, ${scrollMode === ScrollMode.Page ? 0 : item.start.top}px)`
    };
  }
  switch (scrollMode) {
    case ScrollMode.Horizontal:
      return {
        // Size
        height: "100%",
        width: `${width}px`,
        // Absolute position
        [sideProperty]: 0,
        position: "absolute",
        top: 0,
        transform: `translateX(${left}px)`
      };
    case ScrollMode.Page:
      return {
        // Size
        height: `${height}px`,
        width: `${width}px`,
        // Absolute position
        [sideProperty]: 0,
        position: "absolute",
        top: 0
      };
    case ScrollMode.Wrapped:
      return {
        // Size
        height: `${height}px`,
        width: `${width}px`,
        // Absolute position
        [sideProperty]: 0,
        position: "absolute",
        top: 0,
        transform: `translate(${left}px, ${item.start.top}px)`
      };
    case ScrollMode.Vertical:
    default:
      return {
        // Size
        height: `${height}px`,
        width: "100%",
        // Absolute position
        [sideProperty]: 0,
        position: "absolute",
        top: 0,
        transform: `translateY(${item.start.top}px)`
      };
  }
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const findNearest = (low, high, value, getItemValue) => {
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = getItemValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  return low > 0 ? low - 1 : 0;
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const calculateRange = (scrollDirection, measurements, outerSize, scrollOffset) => {
  let currentOffset = 0;
  switch (scrollDirection) {
    case ScrollDirection.Horizontal:
      currentOffset = scrollOffset.left;
      break;
    case ScrollDirection.Vertical:
    default:
      currentOffset = scrollOffset.top;
      break;
  }
  const size = measurements.length - 1;
  const getOffset = (index) => {
    switch (scrollDirection) {
      case ScrollDirection.Horizontal:
        return measurements[index].start.left;
      case ScrollDirection.Both:
      case ScrollDirection.Vertical:
      default:
        return measurements[index].start.top;
    }
  };
  let start = findNearest(0, size, currentOffset, getOffset);
  if (scrollDirection === ScrollDirection.Both) {
    const startTop = measurements[start].start.top;
    while (start - 1 >= 0 && measurements[start - 1].start.top === startTop && measurements[start - 1].start.left >= scrollOffset.left) {
      start--;
    }
  }
  let end = start;
  while (end <= size) {
    const topLeftCorner = {
      top: measurements[end].start.top - scrollOffset.top,
      left: measurements[end].start.left - scrollOffset.left
    };
    const visibleSize = {
      height: outerSize.height - topLeftCorner.top,
      width: outerSize.width - topLeftCorner.left
    };
    if (scrollDirection === ScrollDirection.Horizontal && visibleSize.width < 0) {
      break;
    }
    if (scrollDirection === ScrollDirection.Vertical && visibleSize.height < 0) {
      break;
    }
    if (scrollDirection === ScrollDirection.Both && (visibleSize.width < 0 || visibleSize.height < 0)) {
      break;
    }
    end++;
  }
  return {
    start,
    end
  };
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const ZERO_OFFSET$5 = {
  left: 0,
  top: 0
};
const measure = (numberOfItems, parentRect, sizes, scrollMode) => {
  const measurements = [];
  let totalWidth = 0;
  let firstOfRow = {
    left: 0,
    top: 0
  };
  let maxHeight = 0;
  let start = ZERO_OFFSET$5;
  for (let i = 0; i < numberOfItems; i++) {
    const size = sizes[i];
    if (i === 0) {
      totalWidth = size.width;
      firstOfRow = {
        left: 0,
        top: 0
      };
      maxHeight = size.height;
    } else {
      switch (scrollMode) {
        case ScrollMode.Wrapped:
          totalWidth += size.width;
          if (totalWidth < parentRect.width) {
            start = {
              left: measurements[i - 1].end.left,
              top: firstOfRow.top
            };
            maxHeight = Math.max(maxHeight, size.height);
          } else {
            totalWidth = size.width;
            start = {
              left: firstOfRow.left,
              top: firstOfRow.top + maxHeight
            };
            firstOfRow = {
              left: start.left,
              top: start.top
            };
            maxHeight = size.height;
          }
          break;
        case ScrollMode.Horizontal:
        case ScrollMode.Vertical:
        default:
          start = measurements[i - 1].end;
          break;
      }
    }
    const end = {
      left: start.left + size.width,
      top: start.top + size.height
    };
    measurements[i] = {
      index: i,
      start,
      size,
      end,
      visibility: -1
    };
  }
  return measurements;
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const ZERO_OFFSET$4 = {
  left: 0,
  top: 0
};
const measureDualPage = (numberOfItems, parentRect, sizes, scrollMode) => {
  const measurements = [];
  let top = 0;
  let maxHeight = 0;
  let start = ZERO_OFFSET$4;
  for (let i = 0; i < numberOfItems; i++) {
    const size = {
      height: scrollMode === ScrollMode.Page ? Math.max(parentRect.height, sizes[i].height) : sizes[i].height,
      width: Math.max(parentRect.width / 2, sizes[i].width)
    };
    if (scrollMode === ScrollMode.Page) {
      start = {
        left: i % 2 === 0 ? 0 : size.width,
        top: Math.floor(i / 2) * size.height
      };
    } else {
      if (i % 2 === 0) {
        top = top + maxHeight;
        start = {
          left: 0,
          top
        };
        maxHeight = i === numberOfItems - 1 ? sizes[i].height : Math.max(sizes[i].height, sizes[i + 1].height);
      } else {
        start = {
          left: measurements[i - 1].end.left,
          top
        };
      }
    }
    const end = {
      left: start.left + size.width,
      top: start.top + size.height
    };
    measurements[i] = {
      index: i,
      start,
      size,
      end,
      visibility: -1
    };
  }
  return measurements;
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const ZERO_OFFSET$3 = {
  left: 0,
  top: 0
};
const measureDualPageWithCover = (numberOfItems, parentRect, sizes, scrollMode) => {
  const measurements = [];
  let top = 0;
  let maxHeight = 0;
  let start = ZERO_OFFSET$3;
  for (let i = 0; i < numberOfItems; i++) {
    const size = i === 0 ? {
      height: scrollMode === ScrollMode.Page ? Math.max(parentRect.height, sizes[i].height) : sizes[i].height,
      width: scrollMode === ScrollMode.Page ? Math.max(parentRect.width, sizes[i].width) : sizes[i].width
    } : {
      height: scrollMode === ScrollMode.Page ? Math.max(parentRect.height, sizes[i].height) : sizes[i].height,
      width: Math.max(parentRect.width / 2, sizes[i].width)
    };
    if (scrollMode === ScrollMode.Page) {
      start = i === 0 ? ZERO_OFFSET$3 : {
        left: i % 2 === 0 ? size.width : 0,
        top: Math.floor((i - 1) / 2) * size.height + measurements[0].end.top
      };
    } else {
      if (i === 0) {
        start = ZERO_OFFSET$3;
        top = sizes[0].height;
        maxHeight = 0;
      } else if (i % 2 === 1) {
        top = top + maxHeight;
        start = {
          left: 0,
          top
        };
        maxHeight = i === numberOfItems - 1 ? sizes[i].height : Math.max(sizes[i].height, sizes[i + 1].height);
      } else {
        start = {
          left: measurements[i - 1].end.left,
          top
        };
      }
    }
    const end = {
      left: start.left + size.width,
      top: start.top + size.height
    };
    measurements[i] = {
      index: i,
      start,
      size,
      end,
      visibility: -1
    };
  }
  return measurements;
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const ZERO_OFFSET$2 = {
  left: 0,
  top: 0
};
const measureSinglePage = (numberOfItems, parentRect, sizes) => {
  const measurements = [];
  for (let i = 0; i < numberOfItems; i++) {
    const size = {
      height: Math.max(parentRect.height, sizes[i].height),
      width: Math.max(parentRect.width, sizes[i].width)
    };
    const start = i === 0 ? ZERO_OFFSET$2 : measurements[i - 1].end;
    const end = {
      left: start.left + size.width,
      top: start.top + size.height
    };
    measurements[i] = {
      index: i,
      start,
      size,
      end,
      visibility: -1
    };
  }
  return measurements;
};

const ZERO_RECT = {
  height: 0,
  width: 0
};
const ZERO_OFFSET$1 = {
  left: 0,
  top: 0
};
const COMPARE_EPSILON = 1e-12;
const VIRTUAL_INDEX_ATTR = "data-virtual-index";
const IO_THRESHOLD = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const useVirtual = ({
  enableSmoothScroll,
  isRtl,
  numberOfItems,
  parentRef,
  setRenderRange,
  sizes,
  scrollMode,
  viewMode,
  onVisibilityChanged
}) => {
  const [isSmoothScrolling, setSmoothScrolling] = React__namespace.useState(false);
  const onSmoothScroll = React__namespace.useCallback((isSmoothScrolling2) => setSmoothScrolling(isSmoothScrolling2), []);
  const scrollModeRef = React__namespace.useRef(scrollMode);
  scrollModeRef.current = scrollMode;
  const viewModeRef = React__namespace.useRef(viewMode);
  viewModeRef.current = viewMode;
  const scrollDirection = scrollMode === ScrollMode.Wrapped || viewMode === ViewMode.DualPageWithCover || viewMode === ViewMode.DualPage ? ScrollDirection.Both : scrollMode === ScrollMode.Horizontal ? ScrollDirection.Horizontal : ScrollDirection.Vertical;
  const { scrollOffset, scrollTo } = useScroll({
    elementRef: parentRef,
    enableSmoothScroll,
    isRtl,
    scrollDirection,
    onSmoothScroll
  });
  const parentRect = useMeasureRect({
    elementRef: parentRef
  });
  const latestRef = React__namespace.useRef({
    scrollOffset: ZERO_OFFSET$1,
    measurements: []
  });
  latestRef.current.scrollOffset = scrollOffset;
  const defaultVisibilities = React__namespace.useMemo(() => Array(numberOfItems).fill(-1), []);
  const [visibilities, setVisibilities] = React__namespace.useState(defaultVisibilities);
  const intersectionTracker = React__namespace.useMemo(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.isIntersecting ? entry.intersectionRatio : -1;
          const target = entry.target;
          const indexAttribute = target.getAttribute(VIRTUAL_INDEX_ATTR);
          if (!indexAttribute) {
            return;
          }
          const index = parseInt(indexAttribute, 10);
          if (0 <= index && index < numberOfItems) {
            onVisibilityChanged(index, ratio);
            setVisibilities((old) => {
              old[index] = ratio;
              return [...old];
            });
          }
        });
      },
      {
        threshold: IO_THRESHOLD
      }
    );
    return io;
  }, []);
  const measurements = React__namespace.useMemo(() => {
    if (scrollMode === ScrollMode.Page && viewMode === ViewMode.SinglePage) {
      return measureSinglePage(numberOfItems, parentRect, sizes);
    }
    if (viewMode === ViewMode.DualPageWithCover) {
      return measureDualPageWithCover(numberOfItems, parentRect, sizes, scrollMode);
    }
    if (viewMode === ViewMode.DualPage) {
      return measureDualPage(numberOfItems, parentRect, sizes, scrollMode);
    }
    return measure(numberOfItems, parentRect, sizes, scrollMode);
  }, [scrollMode, sizes, viewMode, parentRect]);
  const totalSize = measurements[numberOfItems - 1] ? {
    height: measurements[numberOfItems - 1].end.top,
    width: measurements[numberOfItems - 1].end.left
  } : ZERO_RECT;
  latestRef.current.measurements = measurements;
  const { startPage, endPage, maxVisbilityIndex } = React__namespace.useMemo(() => {
    const { start, end } = calculateRange(scrollDirection, measurements, parentRect, scrollOffset);
    const visiblePageVisibilities = visibilities.slice(
      clamp(0, numberOfItems, start),
      clamp(0, numberOfItems, end)
    );
    let maxVisbilityItem = start + indexOfMax(visiblePageVisibilities);
    maxVisbilityItem = clamp(0, numberOfItems - 1, maxVisbilityItem);
    let maxVisbilityIndex2 = maxVisbilityItem;
    let { startPage: startPage2, endPage: endPage2 } = setRenderRange({
      endPage: end,
      numPages: numberOfItems,
      startPage: start
    });
    startPage2 = Math.max(startPage2, 0);
    endPage2 = Math.min(endPage2, numberOfItems - 1);
    switch (viewMode) {
      case ViewMode.DualPageWithCover:
        if (maxVisbilityItem > 0) {
          maxVisbilityIndex2 = maxVisbilityItem % 2 === 1 ? maxVisbilityItem : maxVisbilityItem - 1;
        }
        startPage2 = startPage2 === 0 ? 0 : startPage2 % 2 === 1 ? startPage2 : startPage2 - 1;
        endPage2 = endPage2 % 2 === 1 ? endPage2 - 1 : endPage2;
        if (numberOfItems - endPage2 <= 2) {
          endPage2 = numberOfItems - 1;
        }
        break;
      case ViewMode.DualPage:
        maxVisbilityIndex2 = maxVisbilityItem % 2 === 0 ? maxVisbilityItem : maxVisbilityItem - 1;
        startPage2 = startPage2 % 2 === 0 ? startPage2 : startPage2 - 1;
        endPage2 = endPage2 % 2 === 1 ? endPage2 : endPage2 - 1;
        break;
      case ViewMode.SinglePage:
      default:
        maxVisbilityIndex2 = maxVisbilityItem;
        break;
    }
    return {
      startPage: startPage2,
      endPage: endPage2,
      maxVisbilityIndex: maxVisbilityIndex2
    };
  }, [measurements, parentRect, scrollOffset, viewMode, visibilities]);
  const virtualItems = React__namespace.useMemo(() => {
    const virtualItems2 = [];
    for (let i = startPage; i <= endPage; i++) {
      const item = measurements[i];
      const virtualItem = {
        ...item,
        visibility: visibilities[i] !== void 0 ? visibilities[i] : -1,
        measureRef: (ele) => {
          if (!ele) {
            return;
          }
          ele.setAttribute(VIRTUAL_INDEX_ATTR, `${i}`);
          intersectionTracker.observe(ele);
        }
      };
      virtualItems2.push(virtualItem);
    }
    return virtualItems2;
  }, [startPage, endPage, visibilities, measurements]);
  const scrollToItem = React__namespace.useCallback(
    (index, offset) => {
      const { measurements: measurements2 } = latestRef.current;
      const normalizedIndex = clamp(0, numberOfItems - 1, index);
      const measurement = measurements2[normalizedIndex];
      const withOffset = scrollModeRef.current === ScrollMode.Page ? ZERO_OFFSET$1 : offset;
      return measurement ? scrollTo(
        {
          left: withOffset.left + measurement.start.left,
          top: withOffset.top + measurement.start.top
        },
        enableSmoothScroll
      ) : Promise.resolve();
    },
    [scrollTo, enableSmoothScroll]
  );
  const scrollToSmallestItemAbove = React__namespace.useCallback((index, offset) => {
    const { measurements: measurements2 } = latestRef.current;
    const start = measurements2[index].start;
    const nextItem = measurements2.find((item) => item.start.top - start.top > COMPARE_EPSILON);
    if (!nextItem) {
      return Promise.resolve();
    }
    let nextIndex = nextItem.index;
    switch (viewModeRef.current) {
      case ViewMode.DualPage:
        nextIndex = nextIndex % 2 === 0 ? nextIndex : nextIndex + 1;
        break;
      case ViewMode.DualPageWithCover:
        nextIndex = nextIndex % 2 === 1 ? nextIndex : nextIndex + 1;
        break;
    }
    return scrollToItem(nextIndex, offset);
  }, []);
  const scrollToBiggestItemBelow = React__namespace.useCallback((index, offset) => {
    const { measurements: measurements2 } = latestRef.current;
    const start = measurements2[index].start;
    let prevIndex = index;
    let found = false;
    for (let i = numberOfItems - 1; i >= 0; i--) {
      if (start.top - measurements2[i].start.top > COMPARE_EPSILON) {
        found = true;
        prevIndex = measurements2[i].index;
        break;
      }
    }
    if (!found) {
      return Promise.resolve();
    }
    switch (viewModeRef.current) {
      case ViewMode.DualPage:
        prevIndex = prevIndex % 2 === 0 ? prevIndex : prevIndex - 1;
        break;
      case ViewMode.DualPageWithCover:
        prevIndex = prevIndex % 2 === 0 ? prevIndex - 1 : prevIndex;
        break;
    }
    if (prevIndex === index) {
      prevIndex = index - 1;
    }
    return scrollToItem(prevIndex, offset);
  }, []);
  const scrollToNextItem = React__namespace.useCallback((index, offset) => {
    if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
      return scrollToSmallestItemAbove(index, offset);
    }
    switch (scrollModeRef.current) {
      case ScrollMode.Wrapped:
        return scrollToSmallestItemAbove(index, offset);
      case ScrollMode.Horizontal:
      case ScrollMode.Vertical:
      default:
        return scrollToItem(index + 1, offset);
    }
  }, []);
  const scrollToPreviousItem = React__namespace.useCallback((index, offset) => {
    if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
      return scrollToBiggestItemBelow(index, offset);
    }
    switch (scrollModeRef.current) {
      case ScrollMode.Wrapped:
        return scrollToBiggestItemBelow(index, offset);
      case ScrollMode.Horizontal:
      case ScrollMode.Vertical:
      default:
        return scrollToItem(index - 1, offset);
    }
  }, []);
  const getContainerStyles = React__namespace.useCallback(
    () => buildContainerStyles(totalSize, scrollModeRef.current),
    [totalSize]
  );
  const getItemContainerStyles = React__namespace.useCallback(
    (item) => buildItemContainerStyles(item, parentRect, scrollModeRef.current),
    [parentRect]
  );
  const getItemStyles = React__namespace.useCallback(
    (item) => buildItemStyles(item, isRtl, sizes, viewModeRef.current, scrollModeRef.current),
    [isRtl, sizes]
  );
  const zoom = React__namespace.useCallback((scale, index) => {
    const { measurements: measurements2, scrollOffset: scrollOffset2 } = latestRef.current;
    const normalizedIndex = clamp(0, numberOfItems - 1, index);
    const measurement = measurements2[normalizedIndex];
    if (measurement) {
      const updateOffset = scrollModeRef.current === ScrollMode.Page ? {
        left: measurement.start.left,
        top: measurement.start.top
      } : {
        left: scrollOffset2.left * scale,
        top: scrollOffset2.top * scale
      };
      return scrollTo(updateOffset, false);
    }
    return Promise.resolve();
  }, []);
  React__namespace.useEffect(() => {
    return () => {
      intersectionTracker.disconnect();
    };
  }, []);
  return {
    boundingClientRect: parentRect,
    isSmoothScrolling,
    startPage,
    endPage,
    maxVisbilityIndex,
    virtualItems,
    getContainerStyles,
    getItemContainerStyles,
    getItemStyles,
    scrollToItem,
    scrollToNextItem,
    scrollToPreviousItem,
    zoom
  };
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const SCROLL_BAR_WIDTH = 17;
const PAGE_PADDING = 8;
const calculateScale = (container, pageHeight, pageWidth, scale, viewMode, numPages) => {
  let w = pageWidth;
  switch (true) {
    case (viewMode === ViewMode.DualPageWithCover && numPages >= 3):
    case (viewMode === ViewMode.DualPage && numPages >= 3):
      w = 2 * pageWidth;
      break;
    default:
      w = pageWidth;
      break;
  }
  switch (scale) {
    case SpecialZoomLevel.ActualSize:
      return 1;
    case SpecialZoomLevel.PageFit:
      return Math.min(
        (container.clientWidth - SCROLL_BAR_WIDTH) / w,
        (container.clientHeight - 2 * PAGE_PADDING) / pageHeight
      );
    case SpecialZoomLevel.PageWidth:
      return (container.clientWidth - SCROLL_BAR_WIDTH) / w;
  }
};

const useQueue = (maxLength) => {
  const queueRef = React__namespace.useRef([]);
  const dequeue = () => {
    const queue = queueRef.current;
    const size = queue.length;
    if (size === 0) {
      return null;
    }
    const firstItem = queue.shift();
    queueRef.current = queue;
    return firstItem || null;
  };
  const enqueue = (item) => {
    const queue = queueRef.current;
    if (queue.length + 1 > maxLength) {
      queue.pop();
    }
    queueRef.current = [item].concat(queue);
  };
  const map = (transformer) => {
    return queueRef.current.map((item) => transformer(item));
  };
  React__namespace.useEffect(() => {
    return () => {
      queueRef.current = [];
    };
  }, []);
  return {
    dequeue,
    enqueue,
    map
  };
};

const useStack = (maxLength) => {
  const stackRef = React__namespace.useRef([]);
  const map = (transformer) => {
    return stackRef.current.map((item) => transformer(item));
  };
  const pop = () => {
    const stack = stackRef.current;
    const size = stack.length;
    if (size === 0) {
      return null;
    }
    const lastItem = stack.pop();
    stackRef.current = stack;
    return lastItem;
  };
  const push = (item) => {
    const stack = stackRef.current;
    if (stack.length + 1 > maxLength) {
      stack.shift();
    }
    stack.push(item);
    stackRef.current = stack;
  };
  React__namespace.useEffect(() => {
    return () => {
      stackRef.current = [];
    };
  }, []);
  return {
    push,
    map,
    pop
  };
};

const MAX_QUEUE_LENGTH = 50;
const useDestination = ({ getCurrentPage }) => {
  const previousDestinations = useStack(MAX_QUEUE_LENGTH);
  const nextDestinations = useQueue(MAX_QUEUE_LENGTH);
  const getNextDestination = () => {
    const nextDest = nextDestinations.dequeue();
    if (nextDest) {
      previousDestinations.push(nextDest);
    }
    if (nextDest && nextDest.pageIndex === getCurrentPage()) {
      return getNextDestination();
    }
    return nextDest;
  };
  const getPreviousDestination = () => {
    const prevDest = previousDestinations.pop();
    if (prevDest) {
      nextDestinations.enqueue(prevDest);
    }
    if (prevDest && prevDest.pageIndex === getCurrentPage()) {
      return getPreviousDestination();
    }
    return prevDest;
  };
  const markVisitedDestination = React__namespace.useCallback((destination) => {
    previousDestinations.push(destination);
  }, []);
  return {
    getNextDestination,
    getPreviousDestination,
    markVisitedDestination
  };
};

const flaternSingleOutline = (outline) => {
  let result = [];
  if (outline.items && outline.items.length > 0) {
    result = result.concat(flaternOutlines(outline.items));
  }
  return result;
};
const flaternOutlines = (outlines) => {
  let result = [];
  outlines.map((outline) => {
    result = result.concat(outline).concat(flaternSingleOutline(outline));
  });
  return result;
};
const useOutlines = (doc) => {
  const [outlines, setOutlines] = useSafeState([]);
  React__namespace.useEffect(() => {
    doc.getOutline().then((result) => {
      if (result !== null) {
        const items = flaternOutlines(result);
        setOutlines(items);
      }
    });
  }, []);
  return outlines;
};

const DEFAULT_PAGE_LAYOUT = {
  buildPageStyles: () => ({}),
  transformSize: ({ size }) => size
};
const ZERO_OFFSET = {
  left: 0,
  top: 0
};
const Inner = ({
  currentFile,
  defaultScale,
  doc,
  enableSmoothScroll,
  estimatedPageSizes,
  initialPage,
  initialRotation,
  initialScale,
  initialScrollMode,
  initialViewMode,
  pageLayout,
  plugins,
  renderPage,
  setRenderRange,
  viewerState,
  onDocumentLoad,
  onOpenFile,
  onPageChange,
  onRotate,
  onRotatePage,
  onZoom
}) => {
  const { numPages } = doc;
  const docId = doc.loadingTask.docId;
  const { l10n } = React__namespace.useContext(LocalizationContext);
  const themeContext = React__namespace.useContext(ThemeContext);
  const isRtl = themeContext.direction === TextDirection.RightToLeft;
  const containerRef = React__namespace.useRef(null);
  const pagesRef = React__namespace.useRef(null);
  const destinationManager = useDestination({
    getCurrentPage: () => stateRef.current.pageIndex
  });
  const [pagesRotationChanged, setPagesRotationChanged] = React__namespace.useState(false);
  const outlines = useOutlines(doc);
  const stateRef = React__namespace.useRef(viewerState);
  const keepSpecialZoomLevelRef = React__namespace.useRef(
    typeof defaultScale === "string" ? defaultScale : null
  );
  const forceTargetPageRef = React__namespace.useRef({
    targetPage: -1,
    zoomRatio: 1
  });
  const forceTargetZoomRef = React__namespace.useRef(-1);
  const forceTargetInitialPageRef = React__namespace.useRef(initialPage);
  const fullScreen = useFullScreen({
    targetRef: pagesRef
  });
  const [renderPageIndex, setRenderPageIndex] = React__namespace.useState(-1);
  const [renderQueueKey, setRenderQueueKey] = React__namespace.useState(0);
  const renderQueue = useRenderQueue({ doc });
  React__namespace.useEffect(() => {
    return () => {
      clearPagesCache();
    };
  }, [docId]);
  const layoutBuilder = React__namespace.useMemo(() => Object.assign({}, DEFAULT_PAGE_LAYOUT, pageLayout), []);
  const [areSizesCalculated, setSizesCalculated] = React__namespace.useState(false);
  const [pageSizes, setPageSizes] = React__namespace.useState(estimatedPageSizes);
  const [currentPage, setCurrentPage] = React__namespace.useState(0);
  const [pagesRotation, setPagesRotation] = React__namespace.useState(/* @__PURE__ */ new Map());
  const [rotation, setRotation] = React__namespace.useState(initialRotation);
  const [scale, setScale] = React__namespace.useState(initialScale);
  const [scrollMode, setScrollMode] = React__namespace.useState(initialScrollMode);
  const [viewMode, setViewMode] = React__namespace.useState(initialViewMode);
  const sizes = React__namespace.useMemo(
    () => Array(numPages).fill(0).map((_, pageIndex) => {
      const pageHeight = pageSizes[pageIndex].pageHeight;
      const pageWidth = pageSizes[pageIndex].pageWidth;
      const rect = Math.abs(rotation) % 180 === 0 ? {
        height: pageHeight,
        width: pageWidth
      } : {
        height: pageWidth,
        width: pageHeight
      };
      const pageRect = {
        height: rect.height * scale,
        width: rect.width * scale
      };
      return layoutBuilder.transformSize ? layoutBuilder.transformSize({ numPages, pageIndex, size: pageRect }) : pageRect;
    }),
    [rotation, scale, pageSizes]
  );
  const handleVisibilityChanged = React__namespace.useCallback((pageIndex, visibility) => {
    renderQueue.setVisibility(pageIndex, visibility);
  }, []);
  const virtualizer = useVirtual({
    enableSmoothScroll,
    isRtl,
    numberOfItems: numPages,
    parentRef: pagesRef,
    scrollMode,
    setRenderRange,
    sizes,
    viewMode,
    onVisibilityChanged: handleVisibilityChanged
  });
  const handlePagesResize = useDebounceCallback(() => {
    if (!keepSpecialZoomLevelRef.current || stateRef.current.fullScreenMode !== FullScreenMode.Normal || initialPage > 0 && forceTargetInitialPageRef.current === initialPage) {
      return;
    }
    zoom(keepSpecialZoomLevelRef.current);
  }, 200);
  useTrackResize({
    targetRef: pagesRef,
    onResize: handlePagesResize
  });
  const setViewerState = (viewerState2) => {
    let newState = viewerState2;
    const transformState = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => transformState(dep));
      }
      if (plugin.onViewerStateChange) {
        newState = plugin.onViewerStateChange(newState);
      }
    };
    plugins.forEach((plugin) => transformState(plugin));
    stateRef.current = newState;
  };
  const getPagesContainer = () => pagesRef.current;
  const getViewerState = () => stateRef.current;
  const jumpToDestination = React__namespace.useCallback((destination) => {
    destinationManager.markVisitedDestination(destination);
    return handleJumpToDestination(destination);
  }, []);
  const jumpToNextDestination = React__namespace.useCallback(() => {
    const nextDestination = destinationManager.getNextDestination();
    return nextDestination ? handleJumpToDestination(nextDestination) : Promise.resolve();
  }, []);
  const jumpToPreviousDestination = React__namespace.useCallback(() => {
    const lastDestination = destinationManager.getPreviousDestination();
    return lastDestination ? handleJumpToDestination(lastDestination) : Promise.resolve();
  }, []);
  const jumpToNextPage = React__namespace.useCallback(
    () => virtualizer.scrollToNextItem(stateRef.current.pageIndex, ZERO_OFFSET),
    []
  );
  const jumpToPage = React__namespace.useCallback(
    (pageIndex) => 0 <= pageIndex && pageIndex < numPages ? new Promise((resolve) => {
      virtualizer.scrollToItem(pageIndex, ZERO_OFFSET).then(() => {
        setRenderPageIndex(pageIndex);
        resolve();
      });
    }) : Promise.resolve(),
    []
  );
  const jumpToPreviousPage = React__namespace.useCallback(
    () => virtualizer.scrollToPreviousItem(stateRef.current.pageIndex, ZERO_OFFSET),
    []
  );
  const openFile = React__namespace.useCallback(
    (file) => {
      if (getFileExt(file.name).toLowerCase() !== "pdf") {
        return;
      }
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          const bytes = new Uint8Array(reader.result);
          resolve(bytes);
        };
      }).then((data) => {
        onOpenFile(file.name, data);
      });
    },
    [onOpenFile]
  );
  const normalizeRotation = (rotation2) => {
    return rotation2 < 0 ? 360 + rotation2 : rotation2 >= 360 ? rotation2 - 360 : rotation2;
  };
  const rotate = React__namespace.useCallback((direction) => {
    const rotation2 = stateRef.current.rotation;
    const degrees = direction === RotateDirection.Backward ? -90 : 90;
    const finalRotation = normalizeRotation(rotation2 + degrees);
    renderQueue.markNotRendered();
    setRotation(finalRotation);
    setViewerState({
      ...stateRef.current,
      rotation: finalRotation
    });
    onRotate({ direction, doc, rotation: finalRotation });
    forceTargetPageRef.current = {
      targetPage: stateRef.current.pageIndex,
      zoomRatio: 1
    };
  }, []);
  const rotatePage = React__namespace.useCallback((pageIndex, direction) => {
    const degrees = direction === RotateDirection.Backward ? -90 : 90;
    const rotations = stateRef.current.pagesRotation;
    const currentPageRotation = rotations.has(pageIndex) ? rotations.get(pageIndex) : initialRotation;
    const finalRotation = normalizeRotation(currentPageRotation + degrees);
    const updateRotations = rotations.set(pageIndex, finalRotation);
    setPagesRotationChanged((value) => !value);
    setPagesRotation(updateRotations);
    setViewerState({
      ...stateRef.current,
      pagesRotation: updateRotations,
      rotatedPage: pageIndex
    });
    onRotatePage({
      direction,
      doc,
      pageIndex,
      rotation: finalRotation
    });
    renderQueue.markRendering(pageIndex);
    setRenderPageIndex(pageIndex);
  }, []);
  const switchScrollMode = React__namespace.useCallback((newScrollMode) => {
    renderQueue.markNotRendered();
    setScrollMode(newScrollMode);
    setViewerState({
      ...stateRef.current,
      scrollMode: newScrollMode
    });
    forceTargetPageRef.current = {
      targetPage: stateRef.current.pageIndex,
      zoomRatio: 1
    };
  }, []);
  const switchViewMode = React__namespace.useCallback((newViewMode) => {
    renderQueue.markNotRendered();
    setViewMode(newViewMode);
    setViewerState({
      ...stateRef.current,
      viewMode: newViewMode
    });
    forceTargetPageRef.current = {
      targetPage: stateRef.current.pageIndex,
      zoomRatio: 1
    };
  }, []);
  const zoom = React__namespace.useCallback((newScale) => {
    const pagesEle = pagesRef.current;
    const currentPage2 = stateRef.current.pageIndex;
    if (currentPage2 < 0 || currentPage2 >= numPages) {
      return;
    }
    const currentPageHeight = pageSizes[currentPage2].pageHeight;
    const currentPageWidth = pageSizes[currentPage2].pageWidth;
    const updateScale = pagesEle ? typeof newScale === "string" ? calculateScale(
      pagesEle,
      currentPageHeight,
      currentPageWidth,
      newScale,
      stateRef.current.viewMode,
      numPages
    ) : newScale : 1;
    keepSpecialZoomLevelRef.current = typeof newScale === "string" ? newScale : null;
    if (updateScale === stateRef.current.scale) {
      return;
    }
    setRenderQueueKey((key) => key + 1);
    renderQueue.markNotRendered();
    const previousScale = stateRef.current.scale;
    setViewerState({
      ...stateRef.current,
      scale: updateScale
    });
    setScale(updateScale);
    onZoom({ doc, scale: updateScale });
    forceTargetPageRef.current = {
      targetPage: currentPage2,
      zoomRatio: updateScale / previousScale
    };
  }, []);
  const enterFullScreenMode = React__namespace.useCallback((target) => {
    forceTargetPageRef.current = {
      targetPage: stateRef.current.pageIndex,
      zoomRatio: 1
    };
    fullScreen.enterFullScreenMode(target);
  }, []);
  const exitFullScreenMode = React__namespace.useCallback(() => {
    forceTargetPageRef.current = {
      targetPage: stateRef.current.pageIndex,
      zoomRatio: 1
    };
    fullScreen.exitFullScreenMode();
  }, []);
  React__namespace.useEffect(() => {
    setViewerState({
      ...stateRef.current,
      fullScreenMode: fullScreen.fullScreenMode
    });
  }, [fullScreen.fullScreenMode]);
  const handlePageRenderCompleted = React__namespace.useCallback(
    (pageIndex) => {
      renderQueue.markRendered(pageIndex);
      if (areSizesCalculated) {
        return;
      }
      const queryPageSizes = Array(doc.numPages).fill(0).map(
        (_, i) => new Promise((resolvePageSize) => {
          getPage(doc, i).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });
            resolvePageSize({
              pageHeight: viewport.height,
              pageWidth: viewport.width,
              rotation: viewport.rotation
            });
          });
        })
      );
      Promise.all(queryPageSizes).then((pageSizes2) => {
        setSizesCalculated(true);
        setPageSizes(pageSizes2);
        if (initialPage !== 0) {
          jumpToPage(initialPage);
        }
      });
    },
    [areSizesCalculated]
  );
  const handleJumpFromLinkAnnotation = React__namespace.useCallback((destination) => {
    destinationManager.markVisitedDestination(destination);
  }, []);
  const handleJumpToDestination = React__namespace.useCallback(
    (destination) => {
      const { pageIndex, bottomOffset, leftOffset, scaleTo } = destination;
      const pagesContainer = pagesRef.current;
      const currentState = stateRef.current;
      if (!pagesContainer || !currentState) {
        return Promise.resolve();
      }
      return new Promise((resolve, _) => {
        getPage(doc, pageIndex).then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          let top = 0;
          const bottom = (typeof bottomOffset === "function" ? bottomOffset(viewport.width, viewport.height) : bottomOffset) || 0;
          let left = (typeof leftOffset === "function" ? leftOffset(viewport.width, viewport.height) : leftOffset) || 0;
          let updateScale = currentState.scale;
          switch (scaleTo) {
            case SpecialZoomLevel.PageFit:
              top = 0;
              left = 0;
              zoom(SpecialZoomLevel.PageFit);
              break;
            case SpecialZoomLevel.PageWidth:
              updateScale = calculateScale(
                pagesContainer,
                pageSizes[pageIndex].pageHeight,
                pageSizes[pageIndex].pageWidth,
                SpecialZoomLevel.PageWidth,
                viewMode,
                numPages
              );
              top = (viewport.height - bottom) * updateScale;
              left = left * updateScale;
              zoom(updateScale);
              break;
            default:
              top = (viewport.height - bottom) * updateScale;
              left = left * updateScale;
              break;
          }
          switch (currentState.scrollMode) {
            case ScrollMode.Horizontal:
              virtualizer.scrollToItem(pageIndex, { left, top: 0 }).then(() => {
                resolve();
              });
              break;
            case ScrollMode.Vertical:
            default:
              virtualizer.scrollToItem(pageIndex, { left: 0, top }).then(() => {
                resolve();
              });
              break;
          }
        });
      });
    },
    [pageSizes]
  );
  React__namespace.useEffect(() => {
    const pluginMethods = {
      enterFullScreenMode,
      exitFullScreenMode,
      getPagesContainer,
      getViewerState,
      jumpToDestination,
      jumpToNextDestination,
      jumpToPreviousDestination,
      jumpToNextPage,
      jumpToPreviousPage,
      jumpToPage,
      openFile,
      rotate,
      rotatePage,
      setViewerState,
      switchScrollMode,
      switchViewMode,
      zoom
    };
    const installPlugin = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => installPlugin(dep));
      }
      if (plugin.install) {
        plugin.install(pluginMethods);
      }
    };
    const uninstallPlugin = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => uninstallPlugin(dep));
      }
      if (plugin.uninstall) {
        plugin.uninstall(pluginMethods);
      }
    };
    plugins.forEach((plugin) => installPlugin(plugin));
    return () => {
      plugins.forEach((plugin) => uninstallPlugin(plugin));
    };
  }, [docId]);
  React__namespace.useEffect(() => {
    const documentLoadProps = { doc, file: currentFile };
    onDocumentLoad(documentLoadProps);
    const handleDocumentLoad = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => handleDocumentLoad(dep));
      }
      if (plugin.onDocumentLoad) {
        plugin.onDocumentLoad(documentLoadProps);
      }
    };
    plugins.forEach((plugin) => handleDocumentLoad(plugin));
  }, [docId]);
  React__namespace.useEffect(() => {
    if (fullScreen.fullScreenMode === FullScreenMode.Entered && keepSpecialZoomLevelRef.current) {
      forceTargetZoomRef.current = stateRef.current.pageIndex;
      zoom(keepSpecialZoomLevelRef.current);
    }
  }, [fullScreen.fullScreenMode]);
  const executeNamedAction = (action) => {
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;
    switch (action) {
      case "FirstPage":
        jumpToPage(0);
        break;
      case "LastPage":
        jumpToPage(numPages - 1);
        break;
      case "NextPage":
        nextPage < numPages && jumpToPage(nextPage);
        break;
      case "PrevPage":
        previousPage >= 0 && jumpToPage(previousPage);
        break;
    }
  };
  React__namespace.useEffect(() => {
    if (
      // Don't do anything if users start going to or exitting the full-screen mode
      fullScreen.fullScreenMode === FullScreenMode.Entering || fullScreen.fullScreenMode === FullScreenMode.Exitting || // Or smooth scrolling isn't completed yet
      virtualizer.isSmoothScrolling
    ) {
      return;
    }
    const { startPage, endPage, maxVisbilityIndex } = virtualizer;
    const updateCurrentPage = maxVisbilityIndex;
    const isFullScreen = fullScreen.fullScreenMode === FullScreenMode.Entered;
    if (isFullScreen && updateCurrentPage !== forceTargetPageRef.current.targetPage && forceTargetPageRef.current.targetPage > -1) {
      return;
    }
    if (isFullScreen && updateCurrentPage !== forceTargetZoomRef.current && forceTargetZoomRef.current > -1) {
      return;
    }
    const previousCurrentPage = stateRef.current.pageIndex;
    setCurrentPage(updateCurrentPage);
    setViewerState({
      ...stateRef.current,
      pageIndex: updateCurrentPage
    });
    if (updateCurrentPage !== previousCurrentPage && !virtualizer.isSmoothScrolling) {
      onPageChange({ currentPage: updateCurrentPage, doc });
    }
    renderQueue.setRange(startPage, endPage);
  }, [
    virtualizer.startPage,
    virtualizer.endPage,
    virtualizer.isSmoothScrolling,
    virtualizer.maxVisbilityIndex,
    fullScreen.fullScreenMode,
    pagesRotationChanged,
    rotation,
    scale
  ]);
  const [renderNextPageInQueue] = useAnimationFrame(
    () => {
      if (stateRef.current.fullScreenMode === FullScreenMode.Entering || stateRef.current.fullScreenMode === FullScreenMode.Exitting) {
        return;
      }
      const { targetPage, zoomRatio } = forceTargetPageRef.current;
      if (targetPage !== -1) {
        const promise = zoomRatio === 1 ? (
          // Users switch scroll mode, view mode, or rotate pages
          jumpToPage(targetPage)
        ) : (
          // Users zoom the document
          virtualizer.zoom(zoomRatio, targetPage)
        );
        promise.then(() => {
          forceTargetPageRef.current = {
            targetPage: -1,
            zoomRatio: 1
          };
        });
        return;
      }
      const nextPage = renderQueue.getHighestPriorityPage();
      if (nextPage > -1 && renderQueue.isInRange(nextPage)) {
        renderQueue.markRendering(nextPage);
        setRenderPageIndex(nextPage);
      }
    },
    true,
    []
  );
  React__namespace.useEffect(() => {
    renderNextPageInQueue();
  }, []);
  const renderViewer = () => {
    const { virtualItems } = virtualizer;
    let chunks = [];
    switch (viewMode) {
      case ViewMode.DualPage:
        chunks = chunk(virtualItems, 2);
        break;
      case ViewMode.DualPageWithCover:
        if (virtualItems.length) {
          chunks = virtualItems[0].index === 0 ? [[virtualItems[0]]].concat(chunk(virtualItems.slice(1), 2)) : chunk(virtualItems, 2);
        }
        break;
      case ViewMode.SinglePage:
      default:
        chunks = chunk(virtualItems, 1);
        break;
    }
    const pageLabel = l10n && l10n.core ? l10n.core.pageLabel : "Page {{pageIndex}}";
    let slot = {
      attrs: {
        className: styles$4.container,
        "data-testid": "core__inner-container",
        ref: containerRef,
        style: {
          height: "100%"
        }
      },
      children: /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null),
      subSlot: {
        attrs: {
          "data-testid": "core__inner-pages",
          className: classNames({
            [styles$4.pages]: true,
            "rpv-core__inner-pages--horizontal": scrollMode === ScrollMode.Horizontal,
            [styles$4.pagesRtl]: isRtl,
            [styles$4.pagesSingle]: scrollMode === ScrollMode.Page,
            "rpv-core__inner-pages--vertical": scrollMode === ScrollMode.Vertical,
            "rpv-core__inner-pages--wrapped": scrollMode === ScrollMode.Wrapped
          }),
          ref: pagesRef,
          style: {
            height: "100%",
            // We need this to jump between destinations or searching results
            position: "relative"
          }
        },
        children: /* @__PURE__ */ React__namespace.createElement(
          "div",
          {
            "data-testid": `core__inner-current-page-${currentPage}`,
            style: Object.assign(
              {
                // From pdf-js 3.2.146, the text layer renders text items depending on the `--scale-factor` property
                "--scale-factor": scale
              },
              virtualizer.getContainerStyles()
            )
          },
          chunks.map((items) => /* @__PURE__ */ React__namespace.createElement(
            "div",
            {
              className: classNames({
                [styles$4.pageContainerSingle]: scrollMode === ScrollMode.Page
              }),
              style: virtualizer.getItemContainerStyles(items[0]),
              key: `${items[0].index}-${viewMode}-${scrollMode}`
            },
            items.map((item) => {
              const isCover = viewMode === ViewMode.DualPageWithCover && (item.index === 0 || numPages % 2 === 0 && item.index === numPages - 1);
              return /* @__PURE__ */ React__namespace.createElement(
                "div",
                {
                  "aria-label": pageLabel.replace("{{pageIndex}}", `${item.index + 1}`),
                  className: classNames({
                    [styles$4.pageDualEven]: viewMode === ViewMode.DualPage && item.index % 2 === 0,
                    [styles$4.pageDualOdd]: viewMode === ViewMode.DualPage && item.index % 2 === 1,
                    [styles$4.pageDualCover]: isCover,
                    [styles$4.pageDualCoverEven]: viewMode === ViewMode.DualPageWithCover && !isCover && item.index % 2 === 0,
                    [styles$4.pageDualCoverOdd]: viewMode === ViewMode.DualPageWithCover && !isCover && item.index % 2 === 1,
                    [styles$4.pageSingle]: viewMode === ViewMode.SinglePage && scrollMode === ScrollMode.Page
                  }),
                  role: "region",
                  key: `${item.index}-${viewMode}`,
                  style: Object.assign(
                    {},
                    virtualizer.getItemStyles(item),
                    layoutBuilder.buildPageStyles ? layoutBuilder.buildPageStyles({
                      numPages,
                      pageIndex: item.index,
                      scrollMode,
                      viewMode
                    }) : {}
                  )
                },
                /* @__PURE__ */ React__namespace.createElement(
                  PageLayer,
                  {
                    doc,
                    measureRef: item.measureRef,
                    outlines,
                    pageIndex: item.index,
                    pageRotation: pagesRotation.has(item.index) ? pagesRotation.get(item.index) : 0,
                    pageSize: pageSizes[item.index],
                    plugins,
                    renderPage,
                    renderQueueKey,
                    rotation,
                    scale,
                    shouldRender: renderPageIndex === item.index,
                    viewMode,
                    onExecuteNamedAction: executeNamedAction,
                    onJumpFromLinkAnnotation: handleJumpFromLinkAnnotation,
                    onJumpToDest: jumpToDestination,
                    onRenderCompleted: handlePageRenderCompleted,
                    onRotatePage: rotatePage
                  }
                )
              );
            })
          ))
        )
      }
    };
    const renderViewerProps = {
      containerRef,
      doc,
      pagesContainerRef: pagesRef,
      pagesRotation,
      pageSizes,
      rotation,
      slot,
      themeContext,
      jumpToPage,
      openFile,
      rotate,
      rotatePage,
      switchScrollMode,
      switchViewMode,
      zoom
    };
    const transformSlot = (plugin) => {
      if (plugin.dependencies) {
        plugin.dependencies.forEach((dep) => transformSlot(dep));
      }
      if (plugin.renderViewer) {
        slot = plugin.renderViewer({ ...renderViewerProps, slot });
      }
    };
    plugins.forEach((plugin) => transformSlot(plugin));
    return slot;
  };
  const renderSlot = React__namespace.useCallback(
    (slot) => /* @__PURE__ */ React__namespace.createElement("div", { ...slot.attrs, style: slot.attrs && slot.attrs.style ? slot.attrs.style : {} }, slot.children, slot.subSlot && renderSlot(slot.subSlot)),
    []
  );
  return renderSlot(renderViewer());
};

var styles$3 = {"container":"rpv_80a8d2c6"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const LEVELS = [
  0.1,
  0.2,
  0.3,
  0.4,
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1,
  1.1,
  1.3,
  1.5,
  1.7,
  1.9,
  2.1,
  2.4,
  2.7,
  3,
  3.3,
  3.7,
  4.1,
  4.6,
  5.1,
  5.7,
  6.3,
  7,
  7.7,
  8.5,
  9.4,
  10
];
const decrease = (currentLevel) => {
  const found = LEVELS.findIndex((item) => item >= currentLevel);
  return found === -1 || found === 0 ? currentLevel : LEVELS[found - 1];
};

const RESERVE_HEIGHT = 45;
const RESERVE_WIDTH = 45;
const PageSizeCalculator = ({ defaultScale, doc, render, scrollMode, viewMode }) => {
  const pagesRef = React__namespace.useRef(null);
  const [state, setState] = React__namespace.useState({
    estimatedPageSizes: [],
    scale: 0
  });
  React__namespace.useLayoutEffect(() => {
    getPage(doc, 0).then((pdfPage) => {
      const viewport = pdfPage.getViewport({ scale: 1 });
      const pagesEle = pagesRef.current;
      if (!pagesEle) {
        return;
      }
      const w = viewport.width;
      const h = viewport.height;
      const parentEle = pagesEle.parentElement;
      if (!parentEle) {
        return;
      }
      const scaleWidth = (parentEle.clientWidth - RESERVE_WIDTH) / w;
      const scaleHeight = (parentEle.clientHeight - RESERVE_HEIGHT) / h;
      let scaled = scaleWidth;
      switch (scrollMode) {
        case ScrollMode.Horizontal:
          scaled = Math.min(scaleWidth, scaleHeight);
          break;
        case ScrollMode.Vertical:
        default:
          scaled = scaleWidth;
          break;
      }
      const scale = defaultScale ? typeof defaultScale === "string" ? calculateScale(parentEle, h, w, defaultScale, viewMode, doc.numPages) : defaultScale : decrease(scaled);
      const estimatedPageSizes = Array(doc.numPages).fill(0).map((_) => ({
        pageHeight: viewport.height,
        pageWidth: viewport.width,
        rotation: viewport.rotation
      }));
      setState({ estimatedPageSizes, scale });
    });
  }, [doc.loadingTask.docId]);
  return state.estimatedPageSizes.length === 0 || state.scale === 0 ? /* @__PURE__ */ React__namespace.createElement("div", { className: styles$3.container, "data-testid": "core__page-size-calculating", ref: pagesRef }, /* @__PURE__ */ React__namespace.createElement(Spinner, null)) : render(state.estimatedPageSizes, state.scale);
};

var styles$2 = {"error":"rpv_d8ded089","errorRtl":"rpv_712eb921","errorText":"rpv_b4a91d56","loading":"rpv_88a5437d","loadingRtl":"rpv_97e9f1ad"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
class LoadingStatus {
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class AskForPasswordState extends LoadingStatus {
  constructor(verifyPassword, passwordStatus) {
    super();
    __publicField$3(this, "verifyPassword");
    __publicField$3(this, "passwordStatus");
    this.verifyPassword = verifyPassword;
    this.passwordStatus = passwordStatus;
  }
}

var styles$1 = {"container":"rpv_84677e78","inner":"rpv_5dbf13cd","innerRtl":"rpv_5ee27f5d","message":"rpv_aed343be","body":"rpv_b8b0694b","input":"rpv_5dbf1d41","inputLtr":"rpv_632e7ae9","inputRtl":"rpv_632e9169"};

const AskingPassword = ({ passwordStatus, renderProtectedView, verifyPassword, onDocumentAskPassword }) => {
  const { l10n } = React__namespace.useContext(LocalizationContext);
  const [password, setPassword] = React__namespace.useState("");
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const submit = () => verifyPassword(password);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };
  React__namespace.useEffect(() => {
    if (onDocumentAskPassword) {
      onDocumentAskPassword({
        verifyPassword
      });
    }
  }, []);
  if (renderProtectedView) {
    return renderProtectedView({
      passwordStatus,
      verifyPassword
    });
  }
  return /* @__PURE__ */ React__namespace.createElement("div", { className: styles$1.container }, /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      className: classNames({
        [styles$1.inner]: true,
        [styles$1.innerRtl]: isRtl
      })
    },
    /* @__PURE__ */ React__namespace.createElement("div", { className: styles$1.message }, passwordStatus === PasswordStatus.RequiredPassword && l10n.core.askingPassword.requirePasswordToOpen, passwordStatus === PasswordStatus.WrongPassword && l10n.core.wrongPassword.tryAgain),
    /* @__PURE__ */ React__namespace.createElement("div", { className: styles$1.body }, /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        className: classNames({
          [styles$1.input]: true,
          [styles$1.inputLtr]: !isRtl,
          [styles$1.inputRtl]: isRtl
        })
      },
      /* @__PURE__ */ React__namespace.createElement(
        TextBox,
        {
          testId: "core__asking-password-input",
          type: "password",
          value: password,
          onChange: setPassword,
          onKeyDown: handleKeyDown
        }
      )
    ), /* @__PURE__ */ React__namespace.createElement(PrimaryButton, { onClick: submit }, l10n.core.askingPassword.submit))
  ));
};

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
class CompletedState extends LoadingStatus {
  constructor(doc) {
    super();
    __publicField$2(this, "doc");
    this.doc = doc;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
class FailureState extends LoadingStatus {
  constructor(error) {
    super();
    __publicField$1(this, "error");
    this.error = error;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class LoadingState extends LoadingStatus {
  constructor(percentages) {
    super();
    __publicField(this, "percentages");
    this.percentages = percentages;
  }
}

const DocumentLoader = ({
  characterMap,
  file,
  httpHeaders,
  render,
  renderError,
  renderLoader,
  renderProtectedView,
  transformGetDocumentParams,
  withCredentials,
  onDocumentAskPassword
}) => {
  const { pdfJsApiProvider } = React__namespace.useContext(PdfJsApiContext);
  const { direction } = React__namespace.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;
  const [status, setStatus] = useSafeState(new LoadingState(0));
  const docRef = React__namespace.useRef("");
  React__namespace.useEffect(() => {
    if (!pdfJsApiProvider) {
      return;
    }
    docRef.current = "";
    setStatus(new LoadingState(0));
    const worker = new pdfJsApiProvider.PDFWorker({ name: `PDFWorker_${Date.now()}` });
    const params = Object.assign(
      {
        httpHeaders,
        withCredentials,
        worker
      },
      "string" === typeof file ? { url: file } : { data: file },
      characterMap ? {
        cMapUrl: characterMap.url,
        cMapPacked: characterMap.isCompressed
      } : {}
    );
    const transformParams = transformGetDocumentParams ? transformGetDocumentParams(params) : params;
    const loadingTask = pdfJsApiProvider.getDocument(transformParams);
    loadingTask.onPassword = (verifyPassword, reason) => {
      switch (reason) {
        case pdfJsApiProvider.PasswordResponses.NEED_PASSWORD:
          setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.RequiredPassword));
          break;
        case pdfJsApiProvider.PasswordResponses.INCORRECT_PASSWORD:
          setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.WrongPassword));
          break;
      }
    };
    loadingTask.onProgress = (progress) => {
      const loaded = progress.total > 0 ? (
        // It seems weird but there is a case that `loaded` is greater than `total`
        Math.min(100, 100 * progress.loaded / progress.total)
      ) : 100;
      if (docRef.current === "") {
        setStatus(new LoadingState(loaded));
      }
    };
    loadingTask.promise.then(
      (doc) => {
        docRef.current = doc.loadingTask.docId;
        setStatus(new CompletedState(doc));
      },
      (err) => !worker.destroyed && setStatus(
        new FailureState({
          message: err.message || "Cannot load document",
          name: err.name
        })
      )
    );
    return () => {
      loadingTask.destroy();
      worker.destroy();
    };
  }, [file]);
  if (status instanceof AskForPasswordState) {
    return /* @__PURE__ */ React__namespace.createElement(
      AskingPassword,
      {
        passwordStatus: status.passwordStatus,
        renderProtectedView,
        verifyPassword: status.verifyPassword,
        onDocumentAskPassword
      }
    );
  }
  if (status instanceof CompletedState) {
    return render(status.doc);
  }
  if (status instanceof FailureState) {
    return renderError ? renderError(status.error) : /* @__PURE__ */ React__namespace.createElement(
      "div",
      {
        className: classNames({
          [styles$2.error]: true,
          [styles$2.errorRtl]: isRtl
        })
      },
      /* @__PURE__ */ React__namespace.createElement("div", { className: styles$2.errorText }, status.error.message)
    );
  }
  return /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      "data-testid": "core__doc-loading",
      className: classNames({
        [styles$2.loading]: true,
        [styles$2.loadingRtl]: isRtl
      })
    },
    renderLoader ? renderLoader(status.percentages) : /* @__PURE__ */ React__namespace.createElement(Spinner, null)
  );
};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const determineBreakpoint = (width) => {
  switch (true) {
    case width <= 36 * 16:
      return Breakpoint.ExtraSmall;
    case width <= 48 * 16:
      return Breakpoint.Small;
    case width <= 62 * 16:
      return Breakpoint.Medium;
    case width <= 75 * 16:
      return Breakpoint.Large;
    default:
      return Breakpoint.ExtraLarge;
  }
};

const useBreakpoint = () => {
  const [node, setNode] = React__namespace.useState(null);
  const [breakpoint, setBreakpoint] = React__namespace.useState(Breakpoint.ExtraSmall);
  const resizeCallback = React__namespace.useCallback((entries) => {
    entries.forEach((entry) => {
      const rect = entry.target.getBoundingClientRect();
      const breakpoint2 = determineBreakpoint(rect.width);
      setBreakpoint(breakpoint2);
    });
  }, []);
  const ref = React__namespace.useCallback((nodeEle) => {
    setNode(nodeEle);
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (!node) {
      return;
    }
    const resizeObserver = new ResizeObserver(resizeCallback);
    resizeObserver.observe(node);
    return () => {
      resizeObserver.disconnect();
    };
  }, [node]);
  return [ref, breakpoint];
};

var styles = {"viewer":"rpv_c1b1522d"};

/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */
const isSameUrl = (a, b) => {
  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA === "string" && typeB === "string" && a === b) {
    return true;
  }
  if (typeA === "object" && typeB === "object") {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return false;
};

const NUM_OVERSCAN_PAGES = 3;
const DEFAULT_RENDER_RANGE = (visiblePagesRange) => {
  return {
    startPage: visiblePagesRange.startPage - NUM_OVERSCAN_PAGES,
    endPage: visiblePagesRange.endPage + NUM_OVERSCAN_PAGES
  };
};
const Viewer = ({
  characterMap,
  defaultScale,
  enableSmoothScroll = true,
  fileUrl,
  httpHeaders = {},
  initialPage = 0,
  pageLayout,
  initialRotation = 0,
  plugins = [],
  renderError,
  renderLoader,
  renderPage,
  renderProtectedView,
  scrollMode = ScrollMode.Vertical,
  setRenderRange = DEFAULT_RENDER_RANGE,
  transformGetDocumentParams,
  viewMode = ViewMode.SinglePage,
  withCredentials = false,
  onDocumentAskPassword,
  onDocumentLoad = () => {
  },
  onPageChange = () => {
  },
  onRotate = () => {
  },
  onRotatePage = () => {
  },
  onSwitchTheme = () => {
  },
  onZoom = () => {
  }
}) => {
  const [file, setFile] = React__namespace.useState({
    data: fileUrl,
    name: typeof fileUrl === "string" ? fileUrl : "",
    shouldLoad: false
  });
  const openFile = (fileName, data) => {
    setFile({
      data,
      name: fileName,
      shouldLoad: true
    });
  };
  const [visible, setVisible] = React__namespace.useState(false);
  const prevFile = usePrevious(file);
  React__namespace.useEffect(() => {
    if (!isSameUrl(prevFile.data, fileUrl)) {
      setFile({
        data: fileUrl,
        name: typeof fileUrl === "string" ? fileUrl : "",
        shouldLoad: visible
      });
    }
  }, [fileUrl, visible]);
  const visibilityChanged = (params) => {
    setVisible(params.isVisible);
    if (params.isVisible) {
      setFile((currentFile) => Object.assign({}, currentFile, { shouldLoad: true }));
    }
  };
  const trackIntersectionRef = useIntersectionObserver({
    onVisibilityChanged: visibilityChanged
  });
  const [trackBreakpointRef, breakpoint] = useBreakpoint();
  const containerRef = mergeRefs([trackIntersectionRef, trackBreakpointRef]);
  const { currentTheme } = React__namespace.useContext(ThemeContext);
  const prevTheme = usePrevious(currentTheme);
  const [numStacks, setNumStacks] = React__namespace.useState(0);
  const increaseNumStacks = () => setNumStacks((v) => v + 1);
  const decreaseNumStacks = () => setNumStacks((v) => v - 1);
  React__namespace.useEffect(() => {
    if (currentTheme !== prevTheme && onSwitchTheme) {
      onSwitchTheme(currentTheme);
    }
  }, [currentTheme]);
  return /* @__PURE__ */ React__namespace.createElement(StackContext.Provider, { value: { currentIndex: 0, increaseNumStacks, decreaseNumStacks, numStacks } }, /* @__PURE__ */ React__namespace.createElement(BreakpointContext.Provider, { value: breakpoint }, /* @__PURE__ */ React__namespace.createElement(
    "div",
    {
      ref: containerRef,
      className: styles.viewer,
      "data-testid": "core__viewer",
      style: {
        height: "100%",
        width: "100%"
      }
    },
    file.shouldLoad && /* @__PURE__ */ React__namespace.createElement(
      DocumentLoader,
      {
        characterMap,
        file: file.data,
        httpHeaders,
        render: (doc) => /* @__PURE__ */ React__namespace.createElement(
          PageSizeCalculator,
          {
            defaultScale,
            doc,
            render: (estimatedPageSizes, initialScale) => /* @__PURE__ */ React__namespace.createElement(
              Inner,
              {
                currentFile: {
                  data: file.data,
                  name: file.name
                },
                defaultScale,
                doc,
                enableSmoothScroll,
                estimatedPageSizes,
                initialPage,
                initialRotation,
                initialScale,
                initialScrollMode: scrollMode,
                initialViewMode: viewMode,
                pageLayout,
                plugins,
                renderPage,
                setRenderRange,
                viewerState: {
                  file,
                  fullScreenMode: FullScreenMode.Normal,
                  pageIndex: -1,
                  pageHeight: estimatedPageSizes[0].pageHeight,
                  pageWidth: estimatedPageSizes[0].pageWidth,
                  pagesRotation: /* @__PURE__ */ new Map(),
                  rotation: initialRotation,
                  scale: initialScale,
                  scrollMode,
                  viewMode
                },
                onDocumentLoad,
                onOpenFile: openFile,
                onPageChange,
                onRotate,
                onRotatePage,
                onZoom
              }
            ),
            scrollMode,
            viewMode
          }
        ),
        renderError,
        renderLoader,
        renderProtectedView,
        transformGetDocumentParams,
        withCredentials,
        onDocumentAskPassword
      }
    )
  )));
};

exports.AnnotationType = AnnotationType;
exports.Breakpoint = Breakpoint;
exports.BreakpointContext = BreakpointContext;
exports.Button = Button;
exports.DARK_THEME = DARK_THEME;
exports.FullScreenMode = FullScreenMode;
exports.Icon = Icon;
exports.LIGHT_THEME = LIGHT_THEME;
exports.LayerRenderStatus = LayerRenderStatus;
exports.LazyRender = LazyRender;
exports.LocalizationContext = LocalizationContext;
exports.Menu = Menu;
exports.MenuDivider = MenuDivider;
exports.MenuItem = MenuItem;
exports.MinimalButton = MinimalButton;
exports.Modal = Modal;
exports.PageMode = PageMode;
exports.PasswordStatus = PasswordStatus;
exports.PdfJsApiContext = PdfJsApiContext;
exports.Popover = Popover;
exports.Position = Position;
exports.PrimaryButton = PrimaryButton;
exports.ProgressBar = ProgressBar;
exports.Provider = Provider;
exports.RotateDirection = RotateDirection;
exports.ScrollMode = ScrollMode;
exports.Separator = Separator;
exports.Skeleton = Skeleton;
exports.SpecialZoomLevel = SpecialZoomLevel;
exports.Spinner = Spinner;
exports.Splitter = Splitter;
exports.TextBox = TextBox;
exports.TextDirection = TextDirection;
exports.ThemeContext = ThemeContext;
exports.ToggleStatus = ToggleStatus;
exports.Tooltip = Tooltip;
exports.ViewMode = ViewMode;
exports.Viewer = Viewer;
exports.chunk = chunk;
exports.classNames = classNames;
exports.createStore = createStore;
exports.getDestination = getDestination;
exports.getPage = getPage;
exports.isFullScreenEnabled = isFullScreenEnabled;
exports.isMac = isMac;
exports.mergeRefs = mergeRefs;
exports.randomNumber = randomNumber;
exports.useDebounceCallback = useDebounceCallback;
exports.useIntersectionObserver = useIntersectionObserver;
exports.useIsMounted = useIsMounted;
exports.useIsomorphicLayoutEffect = useIsomorphicLayoutEffect;
exports.usePrevious = usePrevious;
exports.useRenderQueue = useRenderQueue;
exports.useSafeState = useSafeState;
