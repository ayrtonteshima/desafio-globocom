export function delegate(el, classSelector, evtType, cb) {
  el.addEventListener(evtType, (event) => {
    let { target } = event;
    if (target.nodeType !== 1 ||
      !target.classList.contains(classSelector)) {
      return false;
    }

    while (target.parentNode &&
            target.parentNode.nodeType === 1 &&
            !target.classList.contains(classSelector)
          ) {
      target = target.parentNode;
    }

    cb(target, event);

  });
}