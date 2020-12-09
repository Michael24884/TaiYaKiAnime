import React from 'react'; // CONTEXT

function createValue() {
  var _isReset = false;
  return {
    clearReset: function clearReset() {
      _isReset = false;
    },
    reset: function reset() {
      _isReset = true;
    },
    isReset: function isReset() {
      return _isReset;
    }
  };
}

var context = /*#__PURE__*/React.createContext(createValue()); // HOOK

export var useErrorResetBoundary = function useErrorResetBoundary() {
  return React.useContext(context);
}; // COMPONENT

export var ReactQueryErrorResetBoundary = function ReactQueryErrorResetBoundary(_ref) {
  var children = _ref.children;
  var value = React.useMemo(function () {
    return createValue();
  }, []);
  return /*#__PURE__*/React.createElement(context.Provider, {
    value: value
  }, typeof children === 'function' ? children(value) : children);
};