"use strict";
exports.id = 357;
exports.ids = [357];
exports.modules = {

/***/ 5492:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var easing = __webpack_require__(8658);

class Animation {
    constructor(output, keyframes = [0, 1], { easing: easing$1, duration: initialDuration = utils.defaults.duration, delay = utils.defaults.delay, endDelay = utils.defaults.endDelay, repeat = utils.defaults.repeat, offset, direction = "normal", } = {}) {
        this.startTime = null;
        this.rate = 1;
        this.t = 0;
        this.cancelTimestamp = null;
        this.easing = utils.noopReturn;
        this.duration = 0;
        this.totalDuration = 0;
        this.repeat = 0;
        this.playState = "idle";
        this.finished = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        easing$1 = easing$1 || utils.defaults.easing;
        if (utils.isEasingGenerator(easing$1)) {
            const custom = easing$1.createAnimation(keyframes);
            easing$1 = custom.easing;
            keyframes = custom.keyframes || keyframes;
            initialDuration = custom.duration || initialDuration;
        }
        this.repeat = repeat;
        this.easing = utils.isEasingList(easing$1) ? utils.noopReturn : easing.getEasingFunction(easing$1);
        this.updateDuration(initialDuration);
        const interpolate = utils.interpolate(keyframes, offset, utils.isEasingList(easing$1) ? easing$1.map(easing.getEasingFunction) : utils.noopReturn);
        this.tick = (timestamp) => {
            var _a;
            // TODO: Temporary fix for OptionsResolver typing
            delay = delay;
            let t = 0;
            if (this.pauseTime !== undefined) {
                t = this.pauseTime;
            }
            else {
                t = (timestamp - this.startTime) * this.rate;
            }
            this.t = t;
            // Convert to seconds
            t /= 1000;
            // Rebase on delay
            t = Math.max(t - delay, 0);
            /**
             * If this animation has finished, set the current time
             * to the total duration.
             */
            if (this.playState === "finished" && this.pauseTime === undefined) {
                t = this.totalDuration;
            }
            /**
             * Get the current progress (0-1) of the animation. If t is >
             * than duration we'll get values like 2.5 (midway through the
             * third iteration)
             */
            const progress = t / this.duration;
            // TODO progress += iterationStart
            /**
             * Get the current iteration (0 indexed). For instance the floor of
             * 2.5 is 2.
             */
            let currentIteration = Math.floor(progress);
            /**
             * Get the current progress of the iteration by taking the remainder
             * so 2.5 is 0.5 through iteration 2
             */
            let iterationProgress = progress % 1.0;
            if (!iterationProgress && progress >= 1) {
                iterationProgress = 1;
            }
            /**
             * If iteration progress is 1 we count that as the end
             * of the previous iteration.
             */
            iterationProgress === 1 && currentIteration--;
            /**
             * Reverse progress if we're not running in "normal" direction
             */
            const iterationIsOdd = currentIteration % 2;
            if (direction === "reverse" ||
                (direction === "alternate" && iterationIsOdd) ||
                (direction === "alternate-reverse" && !iterationIsOdd)) {
                iterationProgress = 1 - iterationProgress;
            }
            const p = t >= this.totalDuration ? 1 : Math.min(iterationProgress, 1);
            const latest = interpolate(this.easing(p));
            output(latest);
            const isAnimationFinished = this.pauseTime === undefined &&
                (this.playState === "finished" || t >= this.totalDuration + endDelay);
            if (isAnimationFinished) {
                this.playState = "finished";
                (_a = this.resolve) === null || _a === void 0 ? void 0 : _a.call(this, latest);
            }
            else if (this.playState !== "idle") {
                this.frameRequestId = requestAnimationFrame(this.tick);
            }
        };
        this.play();
    }
    play() {
        const now = performance.now();
        this.playState = "running";
        if (this.pauseTime !== undefined) {
            this.startTime = now - this.pauseTime;
        }
        else if (!this.startTime) {
            this.startTime = now;
        }
        this.cancelTimestamp = this.startTime;
        this.pauseTime = undefined;
        this.frameRequestId = requestAnimationFrame(this.tick);
    }
    pause() {
        this.playState = "paused";
        this.pauseTime = this.t;
    }
    finish() {
        this.playState = "finished";
        this.tick(0);
    }
    stop() {
        var _a;
        this.playState = "idle";
        if (this.frameRequestId !== undefined) {
            cancelAnimationFrame(this.frameRequestId);
        }
        (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, false);
    }
    cancel() {
        this.stop();
        this.tick(this.cancelTimestamp);
    }
    reverse() {
        this.rate *= -1;
    }
    commitStyles() { }
    updateDuration(duration) {
        this.duration = duration;
        this.totalDuration = duration * (this.repeat + 1);
    }
    get currentTime() {
        return this.t;
    }
    set currentTime(t) {
        if (this.pauseTime !== undefined || this.rate === 0) {
            this.pauseTime = t;
        }
        else {
            this.startTime = performance.now() - t / this.rate;
        }
    }
    get playbackRate() {
        return this.rate;
    }
    set playbackRate(rate) {
        this.rate = rate;
    }
}

exports.Animation = Animation;


/***/ }),

/***/ 8355:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var Animation = __webpack_require__(5492);
var easing = __webpack_require__(8658);



exports.Animation = Animation.Animation;
exports.getEasingFunction = easing.getEasingFunction;


/***/ }),

/***/ 8658:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var easing = __webpack_require__(9976);
var utils = __webpack_require__(986);

const namedEasings = {
    ease: easing.cubicBezier(0.25, 0.1, 0.25, 1.0),
    "ease-in": easing.cubicBezier(0.42, 0.0, 1.0, 1.0),
    "ease-in-out": easing.cubicBezier(0.42, 0.0, 0.58, 1.0),
    "ease-out": easing.cubicBezier(0.0, 0.0, 0.58, 1.0),
};
const functionArgsRegex = /\((.*?)\)/;
function getEasingFunction(definition) {
    // If already an easing function, return
    if (utils.isFunction(definition))
        return definition;
    // If an easing curve definition, return bezier function
    if (utils.isCubicBezier(definition))
        return easing.cubicBezier(...definition);
    // If we have a predefined easing function, return
    if (namedEasings[definition])
        return namedEasings[definition];
    // If this is a steps function, attempt to create easing curve
    if (definition.startsWith("steps")) {
        const args = functionArgsRegex.exec(definition);
        if (args) {
            const argsArray = args[1].split(",");
            return easing.steps(parseFloat(argsArray[0]), argsArray[1].trim());
        }
    }
    return utils.noopReturn;
}

exports.getEasingFunction = getEasingFunction;


/***/ }),

/***/ 3140:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var data = __webpack_require__(5773);
var cssVar = __webpack_require__(7326);
var animation = __webpack_require__(8355);
var utils = __webpack_require__(986);
var transforms = __webpack_require__(9299);
var easing = __webpack_require__(7466);
var featureDetection = __webpack_require__(8562);
var keyframes = __webpack_require__(1334);
var style = __webpack_require__(4942);
var getStyleName = __webpack_require__(239);
var stopAnimation = __webpack_require__(3870);

function getDevToolsRecord() {
    return window.__MOTION_DEV_TOOLS_RECORD;
}
function animateStyle(element, key, keyframesDefinition, options = {}) {
    const record = getDevToolsRecord();
    const isRecording = options.record !== false && record;
    let animation$1;
    let { duration = utils.defaults.duration, delay = utils.defaults.delay, endDelay = utils.defaults.endDelay, repeat = utils.defaults.repeat, easing: easing$1 = utils.defaults.easing, direction, offset, allowWebkitAcceleration = false, } = options;
    const data$1 = data.getAnimationData(element);
    let canAnimateNatively = featureDetection.supports.waapi();
    const valueIsTransform = transforms.isTransform(key);
    /**
     * If this is an individual transform, we need to map its
     * key to a CSS variable and update the element's transform style
     */
    valueIsTransform && transforms.addTransformToElement(element, key);
    const name = getStyleName.getStyleName(key);
    const motionValue = data.getMotionValue(data$1.values, name);
    /**
     * Get definition of value, this will be used to convert numerical
     * keyframes into the default value type.
     */
    const definition = transforms.transformDefinitions.get(name);
    /**
     * Stop the current animation, if any. Because this will trigger
     * commitStyles (DOM writes) and we might later trigger DOM reads,
     * this is fired now and we return a factory function to create
     * the actual animation that can get called in batch,
     */
    stopAnimation.stopAnimation(motionValue.animation, !(utils.isEasingGenerator(easing$1) && motionValue.generator) &&
        options.record !== false);
    /**
     * Batchable factory function containing all DOM reads.
     */
    return () => {
        const readInitialValue = () => { var _a, _b; return (_b = (_a = style.style.get(element, name)) !== null && _a !== void 0 ? _a : definition === null || definition === void 0 ? void 0 : definition.initialValue) !== null && _b !== void 0 ? _b : 0; };
        /**
         * Replace null values with the previous keyframe value, or read
         * it from the DOM if it's the first keyframe.
         */
        let keyframes$1 = keyframes.hydrateKeyframes(keyframes.keyframesList(keyframesDefinition), readInitialValue);
        if (utils.isEasingGenerator(easing$1)) {
            const custom = easing$1.createAnimation(keyframes$1, readInitialValue, valueIsTransform, name, motionValue);
            easing$1 = custom.easing;
            if (custom.keyframes !== undefined)
                keyframes$1 = custom.keyframes;
            if (custom.duration !== undefined)
                duration = custom.duration;
        }
        /**
         * If this is a CSS variable we need to register it with the browser
         * before it can be animated natively. We also set it with setProperty
         * rather than directly onto the element.style object.
         */
        if (cssVar.isCssVar(name)) {
            if (featureDetection.supports.cssRegisterProperty()) {
                cssVar.registerCssVariable(name);
            }
            else {
                canAnimateNatively = false;
            }
        }
        /**
         * If we can animate this value with WAAPI, do so. Currently this only
         * feature detects CSS.registerProperty but could check WAAPI too.
         */
        if (canAnimateNatively) {
            /**
             * Convert numbers to default value types. Currently this only supports
             * transforms but it could also support other value types.
             */
            if (definition) {
                keyframes$1 = keyframes$1.map((value) => utils.isNumber(value) ? definition.toDefaultUnit(value) : value);
            }
            /**
             * If this browser doesn't support partial/implicit keyframes we need to
             * explicitly provide one.
             */
            if (keyframes$1.length === 1 &&
                (!featureDetection.supports.partialKeyframes() || isRecording)) {
                keyframes$1.unshift(readInitialValue());
            }
            const animationOptions = {
                delay: utils.time.ms(delay),
                duration: utils.time.ms(duration),
                endDelay: utils.time.ms(endDelay),
                easing: !utils.isEasingList(easing$1) ? easing.convertEasing(easing$1) : undefined,
                direction,
                iterations: repeat + 1,
                fill: "both",
            };
            animation$1 = element.animate({
                [name]: keyframes$1,
                offset,
                easing: utils.isEasingList(easing$1) ? easing$1.map(easing.convertEasing) : undefined,
            }, animationOptions);
            /**
             * Polyfill finished Promise in browsers that don't support it
             */
            if (!animation$1.finished) {
                animation$1.finished = new Promise((resolve, reject) => {
                    animation$1.onfinish = resolve;
                    animation$1.oncancel = reject;
                });
            }
            const target = keyframes$1[keyframes$1.length - 1];
            animation$1.finished
                .then(() => {
                // Apply styles to target
                style.style.set(element, name, target);
                // Ensure fill modes don't persist
                animation$1.cancel();
            })
                .catch(utils.noop);
            /**
             * This forces Webkit to run animations on the main thread by exploiting
             * this condition:
             * https://trac.webkit.org/browser/webkit/trunk/Source/WebCore/platform/graphics/ca/GraphicsLayerCA.cpp?rev=281238#L1099
             *
             * This fixes Webkit's timing bugs, like accelerated animations falling
             * out of sync with main thread animations and massive delays in starting
             * accelerated animations in WKWebView.
             */
            if (!allowWebkitAcceleration)
                animation$1.playbackRate = 1.000001;
            /**
             * If we can't animate the value natively then we can fallback to the numbers-only
             * polyfill for transforms.
             */
        }
        else if (valueIsTransform) {
            /**
             * If any keyframe is a string (because we measured it from the DOM), we need to convert
             * it into a number before passing to the Animation polyfill.
             */
            keyframes$1 = keyframes$1.map((value) => typeof value === "string" ? parseFloat(value) : value);
            /**
             * If we only have a single keyframe, we need to create an initial keyframe by reading
             * the current value from the DOM.
             */
            if (keyframes$1.length === 1) {
                keyframes$1.unshift(parseFloat(readInitialValue()));
            }
            const render = (latest) => {
                if (definition)
                    latest = definition.toDefaultUnit(latest);
                style.style.set(element, name, latest);
            };
            animation$1 = new animation.Animation(render, keyframes$1, Object.assign(Object.assign({}, options), { duration,
                easing: easing$1 }));
        }
        else {
            const target = keyframes$1[keyframes$1.length - 1];
            style.style.set(element, name, definition && utils.isNumber(target)
                ? definition.toDefaultUnit(target)
                : target);
        }
        if (isRecording) {
            record(element, key, keyframes$1, {
                duration,
                delay: delay,
                easing: easing$1,
                repeat,
                offset,
            }, "motion-one");
        }
        motionValue.setAnimation(animation$1);
        return animation$1;
    };
}

exports.animateStyle = animateStyle;


/***/ }),

/***/ 5773:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var types = __webpack_require__(9027);

const data = new WeakMap();
function getAnimationData(element) {
    if (!data.has(element)) {
        data.set(element, {
            transforms: [],
            values: new Map(),
        });
    }
    return data.get(element);
}
function getMotionValue(motionValues, name) {
    if (!motionValues.has(name)) {
        motionValues.set(name, new types.MotionValue());
    }
    return motionValues.get(name);
}

exports.getAnimationData = getAnimationData;
exports.getMotionValue = getMotionValue;


/***/ }),

/***/ 2035:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var animateStyle = __webpack_require__(3140);
var options = __webpack_require__(3760);
var resolveElements = __webpack_require__(4974);
var controls = __webpack_require__(1528);
var stagger = __webpack_require__(277);

function animate(elements, keyframes, options$1 = {}) {
    elements = resolveElements.resolveElements(elements);
    const numElements = elements.length;
    /**
     * Create and start new animations
     */
    const animationFactories = [];
    for (let i = 0; i < numElements; i++) {
        const element = elements[i];
        for (const key in keyframes) {
            const valueOptions = options.getOptions(options$1, key);
            valueOptions.delay = stagger.resolveOption(valueOptions.delay, i, numElements);
            const animation = animateStyle.animateStyle(element, key, keyframes[key], valueOptions);
            animationFactories.push(animation);
        }
    }
    return controls.withControls(animationFactories, options$1, 
    /**
     * TODO:
     * If easing is set to spring or glide, duration will be dynamically
     * generated. Ideally we would dynamically generate this from
     * animation.effect.getComputedTiming().duration but this isn't
     * supported in iOS13 or our number polyfill. Perhaps it's possible
     * to Proxy animations returned from animateStyle that has duration
     * as a getter.
     */
    options$1.duration);
}

exports.animate = animate;


/***/ }),

/***/ 4942:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var cssVar = __webpack_require__(7326);
var getStyleName = __webpack_require__(239);
var transforms = __webpack_require__(9299);

const style = {
    get: (element, name) => {
        name = getStyleName.getStyleName(name);
        let value = cssVar.isCssVar(name)
            ? element.style.getPropertyValue(name)
            : getComputedStyle(element)[name];
        if (!value && value !== 0) {
            const definition = transforms.transformDefinitions.get(name);
            if (definition)
                value = definition.initialValue;
        }
        return value;
    },
    set: (element, name, value) => {
        name = getStyleName.getStyleName(name);
        if (cssVar.isCssVar(name)) {
            element.style.setProperty(name, value);
        }
        else {
            element.style[name] = value;
        }
    },
};

exports.style = style;


/***/ }),

/***/ 1528:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var stopAnimation = __webpack_require__(3870);

const createAnimation = (factory) => factory();
const withControls = (animationFactory, options, duration = utils.defaults.duration) => {
    return new Proxy({
        animations: animationFactory.map(createAnimation).filter(Boolean),
        duration,
        options,
    }, controls);
};
/**
 * TODO:
 * Currently this returns the first animation, ideally it would return
 * the first active animation.
 */
const getActiveAnimation = (state) => state.animations[0];
const controls = {
    get: (target, key) => {
        const activeAnimation = getActiveAnimation(target);
        switch (key) {
            case "duration":
                return target.duration;
            case "currentTime":
                return utils.time.s((activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key]) || 0);
            case "playbackRate":
            case "playState":
                return activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key];
            case "finished":
                if (!target.finished) {
                    target.finished = Promise.all(target.animations.map(selectFinished)).catch(utils.noop);
                }
                return target.finished;
            case "stop":
                return () => {
                    target.animations.forEach((animation) => stopAnimation.stopAnimation(animation));
                };
            case "forEachNative":
                /**
                 * This is for internal use only, fire a callback for each
                 * underlying animation.
                 */
                return (callback) => {
                    target.animations.forEach((animation) => callback(animation, target));
                };
            default:
                return typeof (activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key]) === "undefined"
                    ? undefined
                    : () => target.animations.forEach((animation) => animation[key]());
        }
    },
    set: (target, key, value) => {
        switch (key) {
            case "currentTime":
                value = utils.time.ms(value);
            case "currentTime":
            case "playbackRate":
                for (let i = 0; i < target.animations.length; i++) {
                    target.animations[i][key] = value;
                }
                return true;
        }
        return false;
    },
};
const selectFinished = (animation) => animation.finished;

exports.controls = controls;
exports.withControls = withControls;


/***/ }),

/***/ 7326:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var transforms = __webpack_require__(9299);

const isCssVar = (name) => name.startsWith("--");
const registeredProperties = new Set();
function registerCssVariable(name) {
    if (registeredProperties.has(name))
        return;
    registeredProperties.add(name);
    try {
        const { syntax, initialValue } = transforms.transformDefinitions.has(name)
            ? transforms.transformDefinitions.get(name)
            : {};
        CSS.registerProperty({
            name,
            inherits: false,
            syntax,
            initialValue,
        });
    }
    catch (e) { }
}

exports.isCssVar = isCssVar;
exports.registerCssVariable = registerCssVariable;
exports.registeredProperties = registeredProperties;


/***/ }),

/***/ 7466:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

const convertEasing = (easing) => utils.isCubicBezier(easing) ? cubicBezierAsString(easing) : easing;
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;

exports.convertEasing = convertEasing;
exports.cubicBezierAsString = cubicBezierAsString;


/***/ }),

/***/ 8562:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const testAnimation = (keyframes) => document.createElement("div").animate(keyframes, { duration: 0.001 });
const featureTests = {
    cssRegisterProperty: () => typeof CSS !== "undefined" &&
        Object.hasOwnProperty.call(CSS, "registerProperty"),
    waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
    partialKeyframes: () => {
        try {
            testAnimation({ opacity: [1] });
        }
        catch (e) {
            return false;
        }
        return true;
    },
    finished: () => Boolean(testAnimation({ opacity: [0, 1] }).finished),
};
const results = {};
const supports = {};
for (const key in featureTests) {
    supports[key] = () => {
        if (results[key] === undefined)
            results[key] = featureTests[key]();
        return results[key];
    };
}

exports.supports = supports;


/***/ }),

/***/ 239:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var transforms = __webpack_require__(9299);

function getStyleName(key) {
    if (transforms.transformAlias[key])
        key = transforms.transformAlias[key];
    return transforms.isTransform(key) ? transforms.asTransformCssVar(key) : key;
}

exports.getStyleName = getStyleName;


/***/ }),

/***/ 1334:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function hydrateKeyframes(keyframes, readInitialValue) {
    for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i] === null) {
            keyframes[i] = i ? keyframes[i - 1] : readInitialValue();
        }
    }
    return keyframes;
}
const keyframesList = (keyframes) => Array.isArray(keyframes) ? keyframes : [keyframes];

exports.hydrateKeyframes = hydrateKeyframes;
exports.keyframesList = keyframesList;


/***/ }),

/***/ 3760:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const getOptions = (options, key) => 
/**
 * TODO: Make test for this
 * Always return a new object otherwise delay is overwritten by results of stagger
 * and this results in no stagger
 */
options[key] ? Object.assign(Object.assign({}, options), options[key]) : Object.assign({}, options);

exports.getOptions = getOptions;


/***/ }),

/***/ 3870:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function stopAnimation(animation, needsCommit = true) {
    if (!animation || animation.playState === "finished")
        return;
    // Suppress error thrown by WAAPI
    try {
        if (animation.stop) {
            animation.stop();
        }
        else {
            needsCommit && animation.commitStyles();
            animation.cancel();
        }
    }
    catch (e) { }
}

exports.stopAnimation = stopAnimation;


/***/ }),

/***/ 5235:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var transforms = __webpack_require__(9299);

function createStyles(keyframes) {
    const initialKeyframes = {};
    const transformKeys = [];
    for (let key in keyframes) {
        const value = keyframes[key];
        if (transforms.isTransform(key)) {
            if (transforms.transformAlias[key])
                key = transforms.transformAlias[key];
            transformKeys.push(key);
            key = transforms.asTransformCssVar(key);
        }
        let initialKeyframe = Array.isArray(value) ? value[0] : value;
        /**
         * If this is a number and we have a default value type, convert the number
         * to this type.
         */
        const definition = transforms.transformDefinitions.get(key);
        if (definition) {
            initialKeyframe = utils.isNumber(value)
                ? definition.toDefaultUnit(value)
                : value;
        }
        initialKeyframes[key] = initialKeyframe;
    }
    if (transformKeys.length) {
        initialKeyframes.transform = transforms.buildTransformTemplate(transformKeys);
    }
    return initialKeyframes;
}

exports.createStyles = createStyles;


/***/ }),

/***/ 7766:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var styleObject = __webpack_require__(5235);

const camelLetterToPipeLetter = (letter) => `-${letter.toLowerCase()}`;
const camelToPipeCase = (str) => str.replace(/[A-Z]/g, camelLetterToPipeLetter);
function createStyleString(target = {}) {
    const styles = styleObject.createStyles(target);
    let style = "";
    for (const key in styles) {
        style += key.startsWith("--") ? key : camelToPipeCase(key);
        style += `: ${styles[key]}; `;
    }
    return style;
}

exports.createStyleString = createStyleString;


/***/ }),

/***/ 9299:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var data = __webpack_require__(5773);

/**
 * A list of all transformable axes. We'll use this list to generated a version
 * of each axes for each transform.
 */
const axes = ["", "X", "Y", "Z"];
/**
 * An ordered array of each transformable value. By default, transform values
 * will be sorted to this order.
 */
const order = ["translate", "scale", "rotate", "skew"];
const transformAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
};
const rotation = {
    syntax: "<angle>",
    initialValue: "0deg",
    toDefaultUnit: (v) => v + "deg",
};
const baseTransformProperties = {
    translate: {
        syntax: "<length-percentage>",
        initialValue: "0px",
        toDefaultUnit: (v) => v + "px",
    },
    rotate: rotation,
    scale: {
        syntax: "<number>",
        initialValue: 1,
        toDefaultUnit: utils.noopReturn,
    },
    skew: rotation,
};
const transformDefinitions = new Map();
const asTransformCssVar = (name) => `--motion-${name}`;
/**
 * Generate a list of every possible transform key
 */
const transforms = ["x", "y", "z"];
order.forEach((name) => {
    axes.forEach((axis) => {
        transforms.push(name + axis);
        transformDefinitions.set(asTransformCssVar(name + axis), baseTransformProperties[name]);
    });
});
/**
 * A function to use with Array.sort to sort transform keys by their default order.
 */
const compareTransformOrder = (a, b) => transforms.indexOf(a) - transforms.indexOf(b);
/**
 * Provide a quick way to check if a string is the name of a transform
 */
const transformLookup = new Set(transforms);
const isTransform = (name) => transformLookup.has(name);
const addTransformToElement = (element, name) => {
    // Map x to translateX etc
    if (transformAlias[name])
        name = transformAlias[name];
    const { transforms } = data.getAnimationData(element);
    utils.addUniqueItem(transforms, name);
    /**
     * TODO: An optimisation here could be to cache the transform in element data
     * and only update if this has changed.
     */
    element.style.transform = buildTransformTemplate(transforms);
};
const buildTransformTemplate = (transforms) => transforms
    .sort(compareTransformOrder)
    .reduce(transformListToString, "")
    .trim();
const transformListToString = (template, name) => `${template} ${name}(var(${asTransformCssVar(name)}))`;

exports.addTransformToElement = addTransformToElement;
exports.asTransformCssVar = asTransformCssVar;
exports.axes = axes;
exports.buildTransformTemplate = buildTransformTemplate;
exports.compareTransformOrder = compareTransformOrder;
exports.isTransform = isTransform;
exports.transformAlias = transformAlias;
exports.transformDefinitions = transformDefinitions;


/***/ }),

/***/ 941:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var generators = __webpack_require__(7724);

function createGeneratorEasing(createGenerator) {
    const keyframesCache = new WeakMap();
    return (options = {}) => {
        const generatorCache = new Map();
        const getGenerator = (from = 0, to = 100, velocity = 0, isScale = false) => {
            const key = `${from}-${to}-${velocity}-${isScale}`;
            if (!generatorCache.has(key)) {
                generatorCache.set(key, createGenerator(Object.assign({ from,
                    to,
                    velocity, restSpeed: isScale ? 0.05 : 2, restDistance: isScale ? 0.01 : 0.5 }, options)));
            }
            return generatorCache.get(key);
        };
        const getKeyframes = (generator) => {
            if (!keyframesCache.has(generator)) {
                keyframesCache.set(generator, generators.pregenerateKeyframes(generator));
            }
            return keyframesCache.get(generator);
        };
        return {
            createAnimation: (keyframes, getOrigin, canUseGenerator, name, motionValue) => {
                var _a, _b;
                let settings;
                const numKeyframes = keyframes.length;
                let shouldUseGenerator = canUseGenerator &&
                    numKeyframes <= 2 &&
                    keyframes.every(isNumberOrNull);
                if (shouldUseGenerator) {
                    const target = keyframes[numKeyframes - 1];
                    const unresolvedOrigin = numKeyframes === 1 ? null : keyframes[0];
                    let velocity = 0;
                    let origin = 0;
                    const prevGenerator = motionValue === null || motionValue === void 0 ? void 0 : motionValue.generator;
                    if (prevGenerator) {
                        /**
                         * If we have a generator for this value we can use it to resolve
                         * the animations's current value and velocity.
                         */
                        const { animation, generatorStartTime } = motionValue;
                        const startTime = (animation === null || animation === void 0 ? void 0 : animation.startTime) || generatorStartTime || 0;
                        const currentTime = (animation === null || animation === void 0 ? void 0 : animation.currentTime) || performance.now() - startTime;
                        const prevGeneratorCurrent = prevGenerator(currentTime).current;
                        origin = (_a = unresolvedOrigin) !== null && _a !== void 0 ? _a : prevGeneratorCurrent;
                        if (numKeyframes === 1 ||
                            (numKeyframes === 2 && keyframes[0] === null)) {
                            velocity = generators.calcGeneratorVelocity((t) => prevGenerator(t).current, currentTime, prevGeneratorCurrent);
                        }
                    }
                    else {
                        origin = (_b = unresolvedOrigin) !== null && _b !== void 0 ? _b : parseFloat(getOrigin());
                    }
                    const generator = getGenerator(origin, target, velocity, name === null || name === void 0 ? void 0 : name.includes("scale"));
                    const keyframesMetadata = getKeyframes(generator);
                    settings = Object.assign(Object.assign({}, keyframesMetadata), { easing: "linear" });
                    // TODO Add test for this
                    if (motionValue) {
                        motionValue.generator = generator;
                        motionValue.generatorStartTime = performance.now();
                    }
                }
                else {
                    const keyframesMetadata = getKeyframes(getGenerator(0, 100));
                    settings = {
                        easing: "ease",
                        duration: keyframesMetadata.overshootDuration,
                    };
                }
                return settings;
            },
        };
    };
}
const isNumberOrNull = (value) => typeof value !== "string";

exports.createGeneratorEasing = createGeneratorEasing;


/***/ }),

/***/ 2842:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var generators = __webpack_require__(7724);
var createGeneratorEasing = __webpack_require__(941);

const glide = createGeneratorEasing.createGeneratorEasing(generators.glide);

exports.glide = glide;


/***/ }),

/***/ 1596:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var generators = __webpack_require__(7724);
var createGeneratorEasing = __webpack_require__(941);

const spring = createGeneratorEasing.createGeneratorEasing(generators.spring);

exports.spring = spring;


/***/ }),

/***/ 8281:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var resolveElements = __webpack_require__(4974);

const thresholds = {
    any: 0,
    all: 1,
};
function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "any" } = {}) {
    /**
     * If this browser doesn't support IntersectionObserver, return a dummy stop function.
     * Default triggering of onStart is tricky - it could be used for starting/stopping
     * videos, lazy loading content etc. We could provide an option to enable a fallback, or
     * provide a fallback callback option.
     */
    if (typeof IntersectionObserver === "undefined") {
        return () => { };
    }
    const elements = resolveElements.resolveElements(elementOrSelector);
    const activeIntersections = new WeakMap();
    const onIntersectionChange = (entries) => {
        entries.forEach((entry) => {
            const onEnd = activeIntersections.get(entry.target);
            /**
             * If there's no change to the intersection, we don't need to
             * do anything here.
             */
            if (entry.isIntersecting === Boolean(onEnd))
                return;
            if (entry.isIntersecting) {
                const newOnEnd = onStart(entry);
                if (typeof newOnEnd === "function") {
                    activeIntersections.set(entry.target, newOnEnd);
                }
                else {
                    observer.unobserve(entry.target);
                }
            }
            else if (onEnd) {
                onEnd(entry);
                activeIntersections.delete(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(onIntersectionChange, {
        root,
        rootMargin,
        threshold: typeof amount === "number" ? amount : thresholds[amount],
    });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
}

exports.inView = inView;


/***/ }),

/***/ 821:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var resolveElements = __webpack_require__(4974);

const resizeHandlers = new WeakMap();
let observer;
function getElementSize(target, borderBoxSize) {
    if (borderBoxSize) {
        const { inlineSize, blockSize } = borderBoxSize[0];
        return { width: inlineSize, height: blockSize };
    }
    else if (target instanceof SVGElement && "getBBox" in target) {
        return target.getBBox();
    }
    else {
        return {
            width: target.offsetWidth,
            height: target.offsetHeight,
        };
    }
}
function notifyTarget({ target, contentRect, borderBoxSize, }) {
    var _a;
    (_a = resizeHandlers.get(target)) === null || _a === void 0 ? void 0 : _a.forEach((handler) => {
        handler({
            target,
            contentSize: contentRect,
            get size() {
                return getElementSize(target, borderBoxSize);
            },
        });
    });
}
function notifyAll(entries) {
    entries.forEach(notifyTarget);
}
function createResizeObserver() {
    if (typeof ResizeObserver === "undefined")
        return;
    observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
    if (!observer)
        createResizeObserver();
    const elements = resolveElements.resolveElements(target);
    elements.forEach((element) => {
        let elementHandlers = resizeHandlers.get(element);
        if (!elementHandlers) {
            elementHandlers = new Set();
            resizeHandlers.set(element, elementHandlers);
        }
        elementHandlers.add(handler);
        observer === null || observer === void 0 ? void 0 : observer.observe(element);
    });
    return () => {
        elements.forEach((element) => {
            const elementHandlers = resizeHandlers.get(element);
            elementHandlers === null || elementHandlers === void 0 ? void 0 : elementHandlers.delete(handler);
            if (!(elementHandlers === null || elementHandlers === void 0 ? void 0 : elementHandlers.size)) {
                observer === null || observer === void 0 ? void 0 : observer.unobserve(element);
            }
        });
    };
}

exports.resizeElement = resizeElement;


/***/ }),

/***/ 87:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const windowCallbacks = new Set();
let windowResizeHandler;
function createWindowResizeHandler() {
    windowResizeHandler = () => {
        const size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        const info = {
            target: window,
            size,
            contentSize: size,
        };
        windowCallbacks.forEach((callback) => callback(info));
    };
    window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
    windowCallbacks.add(callback);
    if (!windowResizeHandler)
        createWindowResizeHandler();
    return () => {
        windowCallbacks.delete(callback);
        if (!windowCallbacks.size && windowResizeHandler) {
            windowResizeHandler = undefined;
        }
    };
}

exports.resizeWindow = resizeWindow;


/***/ }),

/***/ 5423:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var handleElement = __webpack_require__(821);
var handleWindow = __webpack_require__(87);

function resize(a, b) {
    return typeof a === "function" ? handleWindow.resizeWindow(a) : handleElement.resizeElement(a, b);
}

exports.resize = resize;


/***/ }),

/***/ 2143:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(655);
var index = __webpack_require__(5423);
var info = __webpack_require__(5278);
var onScrollHandler = __webpack_require__(6988);

const scrollListeners = new WeakMap();
const resizeListeners = new WeakMap();
const onScrollHandlers = new WeakMap();
const getEventTarget = (element) => element === document.documentElement ? window : element;
function scroll(onScroll, _a = {}) {
    var { container = document.documentElement } = _a, options = tslib.__rest(_a, ["container"]);
    let containerHandlers = onScrollHandlers.get(container);
    /**
     * Get the onScroll handlers for this container.
     * If one isn't found, create a new one.
     */
    if (!containerHandlers) {
        containerHandlers = new Set();
        onScrollHandlers.set(container, containerHandlers);
    }
    /**
     * Create a new onScroll handler for the provided callback.
     */
    const info$1 = info.createScrollInfo();
    const containerHandler = onScrollHandler.createOnScrollHandler(container, onScroll, info$1, options);
    containerHandlers.add(containerHandler);
    /**
     * Check if there's a scroll event listener for this container.
     * If not, create one.
     */
    if (!scrollListeners.has(container)) {
        const listener = () => {
            const time = performance.now();
            for (const handler of containerHandlers)
                handler.measure();
            for (const handler of containerHandlers)
                handler.update(time);
            for (const handler of containerHandlers)
                handler.notify();
        };
        scrollListeners.set(container, listener);
        const target = getEventTarget(container);
        window.addEventListener("resize", listener, { passive: true });
        if (container !== document.documentElement) {
            resizeListeners.set(container, index.resize(container, listener));
        }
        target.addEventListener("scroll", listener, { passive: true });
    }
    const listener = scrollListeners.get(container);
    const onLoadProcesss = requestAnimationFrame(listener);
    return () => {
        var _a;
        if (typeof onScroll !== "function")
            onScroll.stop();
        cancelAnimationFrame(onLoadProcesss);
        /**
         * Check if we even have any handlers for this container.
         */
        const containerHandlers = onScrollHandlers.get(container);
        if (!containerHandlers)
            return;
        containerHandlers.delete(containerHandler);
        if (containerHandlers.size)
            return;
        /**
         * If no more handlers, remove the scroll listener too.
         */
        const listener = scrollListeners.get(container);
        scrollListeners.delete(container);
        if (listener) {
            getEventTarget(container).removeEventListener("scroll", listener);
            (_a = resizeListeners.get(container)) === null || _a === void 0 ? void 0 : _a();
            window.removeEventListener("resize", listener);
        }
    };
}

exports.scroll = scroll;


/***/ }),

/***/ 5278:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

/**
 * A time in milliseconds, beyond which we consider the scroll velocity to be 0.
 */
const maxElapsed = 50;
const createAxisInfo = () => ({
    current: 0,
    offset: [],
    progress: 0,
    scrollLength: 0,
    targetOffset: 0,
    targetLength: 0,
    containerLength: 0,
    velocity: 0,
});
const createScrollInfo = () => ({
    time: 0,
    x: createAxisInfo(),
    y: createAxisInfo(),
});
const keys = {
    x: {
        length: "Width",
        position: "Left",
    },
    y: {
        length: "Height",
        position: "Top",
    },
};
function updateAxisInfo(element, axisName, info, time) {
    const axis = info[axisName];
    const { length, position } = keys[axisName];
    const prev = axis.current;
    const prevTime = info.time;
    axis.current = element["scroll" + position];
    axis.scrollLength = element["scroll" + length] - element["client" + length];
    axis.offset.length = 0;
    axis.offset[0] = 0;
    axis.offset[1] = axis.scrollLength;
    axis.progress = utils.progress(0, axis.scrollLength, axis.current);
    const elapsed = time - prevTime;
    axis.velocity =
        elapsed > maxElapsed ? 0 : utils.velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time) {
    updateAxisInfo(element, "x", info, time);
    updateAxisInfo(element, "y", info, time);
    info.time = time;
}

exports.createScrollInfo = createScrollInfo;
exports.updateScrollInfo = updateScrollInfo;


/***/ }),

/***/ 4593:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

const namedEdges = {
    start: 0,
    center: 0.5,
    end: 1,
};
function resolveEdge(edge, length, inset = 0) {
    let delta = 0;
    /**
     * If we have this edge defined as a preset, replace the definition
     * with the numerical value.
     */
    if (namedEdges[edge] !== undefined) {
        edge = namedEdges[edge];
    }
    /**
     * Handle unit values
     */
    if (utils.isString(edge)) {
        const asNumber = parseFloat(edge);
        if (edge.endsWith("px")) {
            delta = asNumber;
        }
        else if (edge.endsWith("%")) {
            edge = asNumber / 100;
        }
        else if (edge.endsWith("vw")) {
            delta = (asNumber / 100) * document.documentElement.clientWidth;
        }
        else if (edge.endsWith("vh")) {
            delta = (asNumber / 100) * document.documentElement.clientHeight;
        }
        else {
            edge = asNumber;
        }
    }
    /**
     * If the edge is defined as a number, handle as a progress value.
     */
    if (utils.isNumber(edge)) {
        delta = length * edge;
    }
    return inset + delta;
}

exports.namedEdges = namedEdges;
exports.resolveEdge = resolveEdge;


/***/ }),

/***/ 7534:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var inset = __webpack_require__(1781);
var presets = __webpack_require__(7671);
var offset = __webpack_require__(9011);

const point = { x: 0, y: 0 };
function resolveOffsets(container, info, options) {
    let { offset: offsetDefinition = presets.ScrollOffset.All } = options;
    const { target = container, axis = "y" } = options;
    const lengthLabel = axis === "y" ? "height" : "width";
    const inset$1 = target !== container ? inset.calcInset(target, container) : point;
    /**
     * Measure the target and container. If they're the same thing then we
     * use the container's scrollWidth/Height as the target, from there
     * all other calculations can remain the same.
     */
    const targetSize = target === container
        ? { width: container.scrollWidth, height: container.scrollHeight }
        : { width: target.clientWidth, height: target.clientHeight };
    const containerSize = {
        width: container.clientWidth,
        height: container.clientHeight,
    };
    /**
     * Reset the length of the resolved offset array rather than creating a new one.
     * TODO: More reusable data structures for targetSize/containerSize would also be good.
     */
    info[axis].offset.length = 0;
    /**
     * Populate the offset array by resolving the user's offset definition into
     * a list of pixel scroll offets.
     */
    let hasChanged = !info[axis].interpolate;
    const numOffsets = offsetDefinition.length;
    for (let i = 0; i < numOffsets; i++) {
        const offset$1 = offset.resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset$1[axis]);
        if (!hasChanged && offset$1 !== info[axis].interpolatorOffsets[i]) {
            hasChanged = true;
        }
        info[axis].offset[i] = offset$1;
    }
    /**
     * If the pixel scroll offsets have changed, create a new interpolator function
     * to map scroll value into a progress.
     */
    if (hasChanged) {
        info[axis].interpolate = utils.interpolate(utils.defaultOffset(numOffsets), info[axis].offset);
        info[axis].interpolatorOffsets = [...info[axis].offset];
    }
    info[axis].progress = info[axis].interpolate(info[axis].current);
}

exports.resolveOffsets = resolveOffsets;


/***/ }),

/***/ 1781:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function calcInset(element, container) {
    let inset = { x: 0, y: 0 };
    let current = element;
    while (current && current !== container) {
        if (current instanceof HTMLElement) {
            inset.x += current.offsetLeft;
            inset.y += current.offsetTop;
            current = current.offsetParent;
        }
        else if (current instanceof SVGGraphicsElement && "getBBox" in current) {
            const { top, left } = current.getBBox();
            inset.x += left;
            inset.y += top;
            /**
             * Assign the next parent element as the <svg /> tag.
             */
            while (current && current.tagName !== "svg") {
                current = current.parentNode;
            }
        }
    }
    return inset;
}

exports.calcInset = calcInset;


/***/ }),

/***/ 9011:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var edge = __webpack_require__(4593);

const defaultOffset = [0, 0];
function resolveOffset(offset, containerLength, targetLength, targetInset) {
    let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
    let targetPoint = 0;
    let containerPoint = 0;
    if (utils.isNumber(offset)) {
        /**
         * If we're provided offset: [0, 0.5, 1] then each number x should become
         * [x, x], so we default to the behaviour of mapping 0 => 0 of both target
         * and container etc.
         */
        offsetDefinition = [offset, offset];
    }
    else if (utils.isString(offset)) {
        offset = offset.trim();
        if (offset.includes(" ")) {
            offsetDefinition = offset.split(" ");
        }
        else {
            /**
             * If we're provided a definition like "100px" then we want to apply
             * that only to the top of the target point, leaving the container at 0.
             * Whereas a named offset like "end" should be applied to both.
             */
            offsetDefinition = [offset, edge.namedEdges[offset] ? offset : `0`];
        }
    }
    targetPoint = edge.resolveEdge(offsetDefinition[0], targetLength, targetInset);
    containerPoint = edge.resolveEdge(offsetDefinition[1], containerLength);
    return targetPoint - containerPoint;
}

exports.resolveOffset = resolveOffset;


/***/ }),

/***/ 7671:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const ScrollOffset = {
    Enter: [
        [0, 1],
        [1, 1],
    ],
    Exit: [
        [0, 0],
        [1, 0],
    ],
    Any: [
        [1, 0],
        [0, 1],
    ],
    All: [
        [0, 0],
        [1, 1],
    ],
};

exports.ScrollOffset = ScrollOffset;


/***/ }),

/***/ 6988:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var info = __webpack_require__(5278);
var index = __webpack_require__(7534);

function measure(container, target = container, info) {
    /**
     * Find inset of target within scrollable container
     */
    info.x.targetOffset = 0;
    info.y.targetOffset = 0;
    if (target !== container) {
        let node = target;
        while (node && node != container) {
            info.x.targetOffset += node.offsetLeft;
            info.y.targetOffset += node.offsetTop;
            node = node.offsetParent;
        }
    }
    info.x.targetLength =
        target === container ? target.scrollWidth : target.clientWidth;
    info.y.targetLength =
        target === container ? target.scrollHeight : target.clientHeight;
    info.x.containerLength = container.clientWidth;
    info.y.containerLength = container.clientHeight;
}
function createOnScrollHandler(element, onScroll, info$1, options = {}) {
    const axis = options.axis || "y";
    return {
        measure: () => measure(element, options.target, info$1),
        update: (time) => {
            info.updateScrollInfo(element, info$1, time);
            if (options.offset || options.target) {
                index.resolveOffsets(element, info$1, options);
            }
        },
        notify: typeof onScroll === "function"
            ? () => onScroll(info$1)
            : scrubAnimation(onScroll, info$1[axis]),
    };
}
function scrubAnimation(controls, axisInfo) {
    controls.pause();
    controls.forEachNative((animation, { easing }) => {
        var _a, _b;
        if (animation.updateDuration) {
            if (!easing)
                animation.easing = utils.noopReturn;
            animation.updateDuration(1);
        }
        else {
            const timingOptions = { duration: 1000 };
            if (!easing)
                timingOptions.easing = "linear";
            (_b = (_a = animation.effect) === null || _a === void 0 ? void 0 : _a.updateTiming) === null || _b === void 0 ? void 0 : _b.call(_a, timingOptions);
        }
    });
    return () => {
        controls.currentTime = axisInfo.progress;
    };
}

exports.createOnScrollHandler = createOnScrollHandler;


/***/ }),

/***/ 6724:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;


__webpack_unused_export__ = ({ value: true });

var index = __webpack_require__(2035);
var animateStyle = __webpack_require__(3140);
var index$1 = __webpack_require__(7140);
var stagger = __webpack_require__(277);
var index$2 = __webpack_require__(1596);
var index$3 = __webpack_require__(2842);
var style = __webpack_require__(4942);
var inView = __webpack_require__(8281);
var index$5 = __webpack_require__(5423);
var index$6 = __webpack_require__(2143);
var presets = __webpack_require__(7671);
var controls = __webpack_require__(1528);
var data = __webpack_require__(5773);
var getStyleName = __webpack_require__(239);
var index$4 = __webpack_require__(9705);
var styleObject = __webpack_require__(5235);
var styleString = __webpack_require__(7766);



__webpack_unused_export__ = index.animate;
__webpack_unused_export__ = animateStyle.animateStyle;
__webpack_unused_export__ = index$1.timeline;
__webpack_unused_export__ = stagger.stagger;
__webpack_unused_export__ = index$2.spring;
__webpack_unused_export__ = index$3.glide;
__webpack_unused_export__ = style.style;
exports.jF = inView.inView;
__webpack_unused_export__ = index$5.resize;
exports.AR = index$6.scroll;
__webpack_unused_export__ = presets.ScrollOffset;
__webpack_unused_export__ = controls.withControls;
__webpack_unused_export__ = data.getAnimationData;
__webpack_unused_export__ = getStyleName.getStyleName;
__webpack_unused_export__ = index$4.createMotionState;
__webpack_unused_export__ = index$4.mountedStates;
__webpack_unused_export__ = styleObject.createStyles;
__webpack_unused_export__ = styleString.createStyleString;


/***/ }),

/***/ 9786:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var events = __webpack_require__(1800);

const mouseEvent = (element, name, action) => (event) => {
    if (event.pointerType && event.pointerType !== "mouse")
        return;
    action();
    events.dispatchPointerEvent(element, name, event);
};
const hover = {
    isActive: (options) => Boolean(options.hover),
    subscribe: (element, { enable, disable }) => {
        const onEnter = mouseEvent(element, "hoverstart", enable);
        const onLeave = mouseEvent(element, "hoverend", disable);
        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointerleave", onLeave);
        return () => {
            element.removeEventListener("pointerenter", onEnter);
            element.removeEventListener("pointerleave", onLeave);
        };
    },
};

exports.hover = hover;


/***/ }),

/***/ 8918:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(655);
var events = __webpack_require__(1800);
var inView$1 = __webpack_require__(8281);

const inView = {
    isActive: (options) => Boolean(options.inView),
    subscribe: (element, { enable, disable }, { inViewOptions = {} }) => {
        const { once } = inViewOptions, viewOptions = tslib.__rest(inViewOptions, ["once"]);
        return inView$1.inView(element, (enterEntry) => {
            enable();
            events.dispatchViewEvent(element, "viewenter", enterEntry);
            if (!once) {
                return (leaveEntry) => {
                    disable();
                    events.dispatchViewEvent(element, "viewleave", leaveEntry);
                };
            }
        }, viewOptions);
    },
};

exports.inView = inView;


/***/ }),

/***/ 9983:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var events = __webpack_require__(1800);

const press = {
    isActive: (options) => Boolean(options.press),
    subscribe: (element, { enable, disable }) => {
        const onPointerUp = (event) => {
            disable();
            events.dispatchPointerEvent(element, "pressend", event);
            window.removeEventListener("pointerup", onPointerUp);
        };
        const onPointerDown = (event) => {
            enable();
            events.dispatchPointerEvent(element, "pressstart", event);
            window.addEventListener("pointerup", onPointerUp);
        };
        element.addEventListener("pointerdown", onPointerDown);
        return () => {
            element.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
        };
    },
};

exports.press = press;


/***/ }),

/***/ 9705:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(655);
var heyListen = __webpack_require__(1320);
var utils = __webpack_require__(986);
var animateStyle = __webpack_require__(3140);
var style = __webpack_require__(4942);
var options = __webpack_require__(3760);
var hasChanged = __webpack_require__(2822);
var resolveVariant = __webpack_require__(7813);
var schedule = __webpack_require__(8221);
var inView = __webpack_require__(8918);
var hover = __webpack_require__(9786);
var press = __webpack_require__(9983);
var events = __webpack_require__(1800);

const gestures = { inView: inView.inView, hover: hover.hover, press: press.press };
/**
 * A list of state types, in priority order. If a value is defined in
 * a righter-most type, it will override any definition in a lefter-most.
 */
const stateTypes = ["initial", "animate", ...Object.keys(gestures), "exit"];
/**
 * A global store of all generated motion states. This can be used to lookup
 * a motion state for a given Element.
 */
const mountedStates = new WeakMap();
function createMotionState(options$1 = {}, parent) {
    /**
     * The element represented by the motion state. This is an empty reference
     * when we create the state to support SSR and allow for later mounting
     * in view libraries.
     *
     * @ts-ignore
     */
    let element;
    /**
     * Calculate a depth that we can use to order motion states by tree depth.
     */
    let depth = parent ? parent.getDepth() + 1 : 0;
    /**
     * Track which states are currently active.
     */
    const activeStates = { initial: true, animate: true };
    /**
     * A map of functions that, when called, will remove event listeners for
     * a given gesture.
     */
    const gestureSubscriptions = {};
    /**
     * Initialise a context to share through motion states. This
     * will be populated by variant names (if any).
     */
    const context = {};
    for (const name of stateTypes) {
        context[name] =
            typeof options$1[name] === "string"
                ? options$1[name]
                : parent === null || parent === void 0 ? void 0 : parent.getContext()[name];
    }
    /**
     * If initial is set to false we use the animate prop as the initial
     * animation state.
     */
    const initialVariantSource = options$1.initial === false ? "animate" : "initial";
    /**
     * Destructure an initial target out from the resolved initial variant.
     */
    let _a = resolveVariant.resolveVariant(options$1[initialVariantSource] || context[initialVariantSource], options$1.variants) || {}, target = tslib.__rest(_a, ["transition"]);
    /**
     * The base target is a cached map of values that we'll use to animate
     * back to if a value is removed from all active state types. This
     * is usually the initial value as read from the DOM, for instance if
     * it hasn't been defined in initial.
     */
    const baseTarget = Object.assign({}, target);
    /**
     * A generator that will be processed by the global animation scheduler.
     * This yeilds when it switches from reading the DOM to writing to it
     * to prevent layout thrashing.
     */
    function* animateUpdates() {
        var _a, _b;
        const prevTarget = target;
        target = {};
        const animationOptions = {};
        for (const name of stateTypes) {
            if (!activeStates[name])
                continue;
            const variant = resolveVariant.resolveVariant(options$1[name]);
            if (!variant)
                continue;
            for (const key in variant) {
                if (key === "transition")
                    continue;
                target[key] = variant[key];
                animationOptions[key] = options.getOptions((_b = (_a = variant.transition) !== null && _a !== void 0 ? _a : options$1.transition) !== null && _b !== void 0 ? _b : {}, key);
            }
        }
        const allTargetKeys = new Set([
            ...Object.keys(target),
            ...Object.keys(prevTarget),
        ]);
        const animationFactories = [];
        allTargetKeys.forEach((key) => {
            var _a;
            if (target[key] === undefined) {
                target[key] = baseTarget[key];
            }
            if (hasChanged.hasChanged(prevTarget[key], target[key])) {
                (_a = baseTarget[key]) !== null && _a !== void 0 ? _a : (baseTarget[key] = style.style.get(element, key));
                animationFactories.push(animateStyle.animateStyle(element, key, target[key], animationOptions[key]));
            }
        });
        // Wait for all animation states to read from the DOM
        yield;
        const animations = animationFactories
            .map((factory) => factory())
            .filter(Boolean);
        if (!animations.length)
            return;
        const animationTarget = target;
        element.dispatchEvent(events.motionEvent("motionstart", animationTarget));
        Promise.all(animations.map((animation) => animation.finished))
            .then(() => {
            element.dispatchEvent(events.motionEvent("motioncomplete", animationTarget));
        })
            .catch(utils.noop);
    }
    const setGesture = (name, isActive) => () => {
        activeStates[name] = isActive;
        schedule.scheduleAnimation(state);
    };
    const updateGestureSubscriptions = () => {
        for (const name in gestures) {
            const isGestureActive = gestures[name].isActive(options$1);
            const remove = gestureSubscriptions[name];
            if (isGestureActive && !remove) {
                gestureSubscriptions[name] = gestures[name].subscribe(element, {
                    enable: setGesture(name, true),
                    disable: setGesture(name, false),
                }, options$1);
            }
            else if (!isGestureActive && remove) {
                remove();
                delete gestureSubscriptions[name];
            }
        }
    };
    const state = {
        update: (newOptions) => {
            if (!element)
                return;
            options$1 = newOptions;
            updateGestureSubscriptions();
            schedule.scheduleAnimation(state);
        },
        setActive: (name, isActive) => {
            if (!element)
                return;
            activeStates[name] = isActive;
            schedule.scheduleAnimation(state);
        },
        animateUpdates,
        getDepth: () => depth,
        getTarget: () => target,
        getOptions: () => options$1,
        getContext: () => context,
        mount: (newElement) => {
            heyListen.invariant(Boolean(newElement), "Animation state must be mounted with valid Element");
            element = newElement;
            mountedStates.set(element, state);
            updateGestureSubscriptions();
            return () => {
                mountedStates.delete(element);
                schedule.unscheduleAnimation(state);
                for (const key in gestureSubscriptions) {
                    gestureSubscriptions[key]();
                }
            };
        },
        isMounted: () => Boolean(element),
    };
    return state;
}

exports.createMotionState = createMotionState;
exports.mountedStates = mountedStates;


/***/ }),

/***/ 1800:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const motionEvent = (name, target) => new CustomEvent(name, { detail: { target } });
function dispatchPointerEvent(element, name, event) {
    element.dispatchEvent(new CustomEvent(name, { detail: { originalEvent: event } }));
}
function dispatchViewEvent(element, name, entry) {
    element.dispatchEvent(new CustomEvent(name, { detail: { originalEntry: entry } }));
}

exports.dispatchPointerEvent = dispatchPointerEvent;
exports.dispatchViewEvent = dispatchViewEvent;
exports.motionEvent = motionEvent;


/***/ }),

/***/ 2822:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function hasChanged(a, b) {
    if (typeof a !== typeof b)
        return true;
    if (Array.isArray(a) && Array.isArray(b))
        return !shallowCompare(a, b);
    return a !== b;
}
function shallowCompare(next, prev) {
    const prevLength = prev.length;
    if (prevLength !== next.length)
        return false;
    for (let i = 0; i < prevLength; i++) {
        if (prev[i] !== next[i])
            return false;
    }
    return true;
}

exports.hasChanged = hasChanged;
exports.shallowCompare = shallowCompare;


/***/ }),

/***/ 7102:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function isVariant(definition) {
    return typeof definition === "object";
}

exports.isVariant = isVariant;


/***/ }),

/***/ 7813:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var isVariant = __webpack_require__(7102);

function resolveVariant(definition, variants) {
    if (isVariant.isVariant(definition)) {
        return definition;
    }
    else if (definition && variants) {
        return variants[definition];
    }
}

exports.resolveVariant = resolveVariant;


/***/ }),

/***/ 8221:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

let scheduled = undefined;
function processScheduledAnimations() {
    if (!scheduled)
        return;
    const generators = scheduled.sort(compareByDepth).map(fireAnimateUpdates);
    generators.forEach(fireNext);
    generators.forEach(fireNext);
    scheduled = undefined;
}
function scheduleAnimation(state) {
    if (!scheduled) {
        scheduled = [state];
        requestAnimationFrame(processScheduledAnimations);
    }
    else {
        utils.addUniqueItem(scheduled, state);
    }
}
function unscheduleAnimation(state) {
    scheduled && utils.removeItem(scheduled, state);
}
const compareByDepth = (a, b) => a.getDepth() - b.getDepth();
const fireAnimateUpdates = (state) => state.animateUpdates();
const fireNext = (iterator) => iterator.next();

exports.scheduleAnimation = scheduleAnimation;
exports.unscheduleAnimation = unscheduleAnimation;


/***/ }),

/***/ 7140:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(655);
var heyListen = __webpack_require__(1320);
var utils = __webpack_require__(986);
var stagger = __webpack_require__(277);
var animateStyle = __webpack_require__(3140);
var controls = __webpack_require__(1528);
var keyframes = __webpack_require__(1334);
var options = __webpack_require__(3760);
var resolveElements = __webpack_require__(4974);
var transforms = __webpack_require__(9299);
var calcTime = __webpack_require__(6665);
var edit = __webpack_require__(2853);
var sort = __webpack_require__(4318);

function timeline(definition, options = {}) {
    var _a;
    const animationDefinitions = createAnimationsFromTimeline(definition, options);
    /**
     * Create and start animations
     */
    const animationFactories = animationDefinitions
        .map((definition) => animateStyle.animateStyle(...definition))
        .filter(Boolean);
    return controls.withControls(animationFactories, options, 
    // Get the duration from the first animation definition
    (_a = animationDefinitions[0]) === null || _a === void 0 ? void 0 : _a[3].duration);
}
function createAnimationsFromTimeline(definition, _a = {}) {
    var { defaultOptions = {} } = _a, timelineOptions = tslib.__rest(_a, ["defaultOptions"]);
    const animationDefinitions = [];
    const elementSequences = new Map();
    const elementCache = {};
    const timeLabels = new Map();
    let prevTime = 0;
    let currentTime = 0;
    let totalDuration = 0;
    /**
     * Build the timeline by mapping over the definition array and converting
     * the definitions into keyframes and offsets with absolute time values.
     * These will later get converted into relative offsets in a second pass.
     */
    for (let i = 0; i < definition.length; i++) {
        const segment = definition[i];
        /**
         * If this is a timeline label, mark it and skip the rest of this iteration.
         */
        if (utils.isString(segment)) {
            timeLabels.set(segment, currentTime);
            continue;
        }
        else if (!Array.isArray(segment)) {
            timeLabels.set(segment.name, calcTime.calcNextTime(currentTime, segment.at, prevTime, timeLabels));
            continue;
        }
        const [elementDefinition, keyframes$1, options$1 = {}] = segment;
        /**
         * If a relative or absolute time value has been specified we need to resolve
         * it in relation to the currentTime.
         */
        if (options$1.at !== undefined) {
            currentTime = calcTime.calcNextTime(currentTime, options$1.at, prevTime, timeLabels);
        }
        /**
         * Keep track of the maximum duration in this definition. This will be
         * applied to currentTime once the definition has been parsed.
         */
        let maxDuration = 0;
        /**
         * Find all the elements specified in the definition and parse value
         * keyframes from their timeline definitions.
         */
        const elements = resolveElements.resolveElements(elementDefinition, elementCache);
        const numElements = elements.length;
        for (let elementIndex = 0; elementIndex < numElements; elementIndex++) {
            const element = elements[elementIndex];
            const elementSequence = getElementSequence(element, elementSequences);
            for (const key in keyframes$1) {
                const valueSequence = getValueSequence(key, elementSequence);
                let valueKeyframes = keyframes.keyframesList(keyframes$1[key]);
                const valueOptions = options.getOptions(options$1, key);
                let { duration = defaultOptions.duration || utils.defaults.duration, easing = defaultOptions.easing || utils.defaults.easing, } = valueOptions;
                if (utils.isEasingGenerator(easing)) {
                    const valueIsTransform = transforms.isTransform(key);
                    heyListen.invariant(valueKeyframes.length === 2 || !valueIsTransform, "spring must be provided 2 keyframes within timeline");
                    const custom = easing.createAnimation(valueKeyframes, 
                    // TODO We currently only support explicit keyframes
                    // so this doesn't currently read from the DOM
                    () => "0", valueIsTransform);
                    easing = custom.easing;
                    if (custom.keyframes !== undefined)
                        valueKeyframes = custom.keyframes;
                    if (custom.duration !== undefined)
                        duration = custom.duration;
                }
                const delay = stagger.resolveOption(options$1.delay, elementIndex, numElements) || 0;
                const startTime = currentTime + delay;
                const targetTime = startTime + duration;
                /**
                 *
                 */
                let { offset = utils.defaultOffset(valueKeyframes.length) } = valueOptions;
                /**
                 * If there's only one offset of 0, fill in a second with length 1
                 *
                 * TODO: Ensure there's a test that covers this removal
                 */
                if (offset.length === 1 && offset[0] === 0) {
                    offset[1] = 1;
                }
                /**
                 * Fill out if offset if fewer offsets than keyframes
                 */
                const remainder = length - valueKeyframes.length;
                remainder > 0 && utils.fillOffset(offset, remainder);
                /**
                 * If only one value has been set, ie [1], push a null to the start of
                 * the keyframe array. This will let us mark a keyframe at this point
                 * that will later be hydrated with the previous value.
                 */
                valueKeyframes.length === 1 && valueKeyframes.unshift(null);
                /**
                 * Add keyframes, mapping offsets to absolute time.
                 */
                edit.addKeyframes(valueSequence, valueKeyframes, easing, offset, startTime, targetTime);
                maxDuration = Math.max(delay + duration, maxDuration);
                totalDuration = Math.max(targetTime, totalDuration);
            }
        }
        prevTime = currentTime;
        currentTime += maxDuration;
    }
    /**
     * For every element and value combination create a new animation.
     */
    elementSequences.forEach((valueSequences, element) => {
        for (const key in valueSequences) {
            const valueSequence = valueSequences[key];
            /**
             * Arrange all the keyframes in ascending time order.
             */
            valueSequence.sort(sort.compareByTime);
            const keyframes = [];
            const valueOffset = [];
            const valueEasing = [];
            /**
             * For each keyframe, translate absolute times into
             * relative offsets based on the total duration of the timeline.
             */
            for (let i = 0; i < valueSequence.length; i++) {
                const { at, value, easing } = valueSequence[i];
                keyframes.push(value);
                valueOffset.push(utils.progress(0, totalDuration, at));
                valueEasing.push(easing || utils.defaults.easing);
            }
            /**
             * If the first keyframe doesn't land on offset: 0
             * provide one by duplicating the initial keyframe. This ensures
             * it snaps to the first keyframe when the animation starts.
             */
            if (valueOffset[0] !== 0) {
                valueOffset.unshift(0);
                keyframes.unshift(keyframes[0]);
                valueEasing.unshift("linear");
            }
            /**
             * If the last keyframe doesn't land on offset: 1
             * provide one with a null wildcard value. This will ensure it
             * stays static until the end of the animation.
             */
            if (valueOffset[valueOffset.length - 1] !== 1) {
                valueOffset.push(1);
                keyframes.push(null);
            }
            animationDefinitions.push([
                element,
                key,
                keyframes,
                Object.assign(Object.assign(Object.assign({}, defaultOptions), { duration: totalDuration, easing: valueEasing, offset: valueOffset }), timelineOptions),
            ]);
        }
    });
    return animationDefinitions;
}
function getElementSequence(element, sequences) {
    !sequences.has(element) && sequences.set(element, {});
    return sequences.get(element);
}
function getValueSequence(name, sequences) {
    if (!sequences[name])
        sequences[name] = [];
    return sequences[name];
}

exports.createAnimationsFromTimeline = createAnimationsFromTimeline;
exports.timeline = timeline;


/***/ }),

/***/ 6665:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

function calcNextTime(current, next, prev, labels) {
    var _a;
    if (utils.isNumber(next)) {
        return next;
    }
    else if (next.startsWith("-") || next.startsWith("+")) {
        return Math.max(0, current + parseFloat(next));
    }
    else if (next === "<") {
        return prev;
    }
    else {
        return (_a = labels.get(next)) !== null && _a !== void 0 ? _a : current;
    }
}

exports.calcNextTime = calcNextTime;


/***/ }),

/***/ 2853:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

function eraseKeyframes(sequence, startTime, endTime) {
    for (let i = 0; i < sequence.length; i++) {
        const keyframe = sequence[i];
        if (keyframe.at > startTime && keyframe.at < endTime) {
            utils.removeItem(sequence, keyframe);
            // If we remove this item we have to push the pointer back one
            i--;
        }
    }
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
    /**
     * Erase every existing value between currentTime and targetTime,
     * this will essentially splice this timeline into any currently
     * defined ones.
     */
    eraseKeyframes(sequence, startTime, endTime);
    for (let i = 0; i < keyframes.length; i++) {
        sequence.push({
            value: keyframes[i],
            at: utils.mix(startTime, endTime, offset[i]),
            easing: utils.getEasingForSegment(easing, i),
        });
    }
}

exports.addKeyframes = addKeyframes;
exports.eraseKeyframes = eraseKeyframes;


/***/ }),

/***/ 4318:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function compareByTime(a, b) {
    if (a.at === b.at) {
        return a.value === null ? 1 : -1;
    }
    else {
        return a.at - b.at;
    }
}

exports.compareByTime = compareByTime;


/***/ }),

/***/ 4974:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function resolveElements(elements, selectorCache) {
    var _a;
    if (typeof elements === "string") {
        if (selectorCache) {
            (_a = selectorCache[elements]) !== null && _a !== void 0 ? _a : (selectorCache[elements] = document.querySelectorAll(elements));
            elements = selectorCache[elements];
        }
        else {
            elements = document.querySelectorAll(elements);
        }
    }
    else if (elements instanceof Element) {
        elements = [elements];
    }
    /**
     * Return an empty array
     */
    return Array.from(elements || []);
}

exports.resolveElements = resolveElements;


/***/ }),

/***/ 277:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var animation = __webpack_require__(8355);

function stagger(duration = 0.1, { start = 0, from = 0, easing } = {}) {
    return (i, total) => {
        const fromIndex = utils.isNumber(from) ? from : getFromIndex(from, total);
        const distance = Math.abs(fromIndex - i);
        let delay = duration * distance;
        if (easing) {
            const maxDelay = total * duration;
            const easingFunction = animation.getEasingFunction(easing);
            delay = easingFunction(delay / maxDelay) * maxDelay;
        }
        return start + delay;
    };
}
function getFromIndex(from, total) {
    if (from === "first") {
        return 0;
    }
    else {
        const lastIndex = total - 1;
        return from === "last" ? lastIndex : lastIndex / 2;
    }
}
function resolveOption(option, i, total) {
    return typeof option === "function"
        ? option(i, total)
        : option;
}

exports.getFromIndex = getFromIndex;
exports.resolveOption = resolveOption;
exports.stagger = stagger;


/***/ }),

/***/ 1732:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

/*
  Bezier function generator

  This has been modified from Gaëtan Renaudeau's BezierEasing
  https://github.com/gre/bezier-easing/blob/master/src/index.js
  https://github.com/gre/bezier-easing/blob/master/LICENSE
  
  I've removed the newtonRaphsonIterate algo because in benchmarking it
  wasn't noticiably faster than binarySubdivision, indeed removing it
  usually improved times, depending on the curve.

  I also removed the lookup table, as for the added bundle size and loop we're
  only cutting ~4 or so subdivision iterations. I bumped the max iterations up
  to 12 to compensate and this still tended to be faster for no perceivable
  loss in accuracy.

  Usage
    const easeOut = cubicBezier(.17,.67,.83,.67);
    const x = easeOut(0.5); // returns 0.627...
*/
// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
const calcBezier = (t, a1, a2) => (((1.0 - 3.0 * a2 + 3.0 * a1) * t + (3.0 * a2 - 6.0 * a1)) * t + 3.0 * a1) * t;
const subdivisionPrecision = 0.0000001;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
        currentT = lowerBound + (upperBound - lowerBound) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - x;
        if (currentX > 0.0) {
            upperBound = currentT;
        }
        else {
            lowerBound = currentT;
        }
    } while (Math.abs(currentX) > subdivisionPrecision &&
        ++i < subdivisionMaxIterations);
    return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
    // If this is a linear gradient, return linear easing
    if (mX1 === mY1 && mX2 === mY2)
        return utils.noopReturn;
    const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
    // If animation is at start/end, return t without easing
    return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}

exports.cubicBezier = cubicBezier;


/***/ }),

/***/ 9976:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var cubicBezier = __webpack_require__(1732);
var steps = __webpack_require__(2247);



exports.cubicBezier = cubicBezier.cubicBezier;
exports.steps = steps.steps;


/***/ }),

/***/ 2247:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

const steps = (steps, direction = "end") => (progress) => {
    progress =
        direction === "end"
            ? Math.min(progress, 0.999)
            : Math.max(progress, 0.001);
    const expanded = progress * steps;
    const rounded = direction === "end" ? Math.floor(expanded) : Math.ceil(expanded);
    return utils.clamp(0, 1, rounded / steps);
};

exports.steps = steps;


/***/ }),

/***/ 6471:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var velocity = __webpack_require__(4574);
var index = __webpack_require__(4636);

const glide = ({ from = 0, velocity: velocity$1 = 0.0, power = 0.8, decay = 0.325, bounceDamping, bounceStiffness, changeTarget, min, max, restDistance = 0.5, restSpeed, }) => {
    decay = utils.time.ms(decay);
    const state = {
        hasReachedTarget: false,
        done: false,
        current: from,
        target: from,
    };
    const isOutOfBounds = (v) => (min !== undefined && v < min) || (max !== undefined && v > max);
    const nearestBoundary = (v) => {
        if (min === undefined)
            return max;
        if (max === undefined)
            return min;
        return Math.abs(min - v) < Math.abs(max - v) ? min : max;
    };
    let amplitude = power * velocity$1;
    const ideal = from + amplitude;
    const target = changeTarget === undefined ? ideal : changeTarget(ideal);
    state.target = target;
    /**
     * If the target has changed we need to re-calculate the amplitude, otherwise
     * the animation will start from the wrong position.
     */
    if (target !== ideal)
        amplitude = target - from;
    const calcDelta = (t) => -amplitude * Math.exp(-t / decay);
    const calcLatest = (t) => target + calcDelta(t);
    const applyFriction = (t) => {
        const delta = calcDelta(t);
        const latest = calcLatest(t);
        state.done = Math.abs(delta) <= restDistance;
        state.current = state.done ? target : latest;
    };
    /**
     * Ideally this would resolve for t in a stateless way, we could
     * do that by always precalculating the animation but as we know
     * this will be done anyway we can assume that spring will
     * be discovered during that.
     */
    let timeReachedBoundary;
    let spring;
    const checkCatchBoundary = (t) => {
        if (!isOutOfBounds(state.current))
            return;
        timeReachedBoundary = t;
        spring = index.spring({
            from: state.current,
            to: nearestBoundary(state.current),
            velocity: velocity.calcGeneratorVelocity(calcLatest, t, state.current),
            damping: bounceDamping,
            stiffness: bounceStiffness,
            restDistance,
            restSpeed,
        });
    };
    checkCatchBoundary(0);
    return (t) => {
        /**
         * We need to resolve the friction to figure out if we need a
         * spring but we don't want to do this twice per frame. So here
         * we flag if we updated for this frame and later if we did
         * we can skip doing it again.
         */
        let hasUpdatedFrame = false;
        if (!spring && timeReachedBoundary === undefined) {
            hasUpdatedFrame = true;
            applyFriction(t);
            checkCatchBoundary(t);
        }
        /**
         * If we have a spring and the provided t is beyond the moment the friction
         * animation crossed the min/max boundary, use the spring.
         */
        if (timeReachedBoundary !== undefined && t > timeReachedBoundary) {
            state.hasReachedTarget = true;
            return spring(t - timeReachedBoundary);
        }
        else {
            state.hasReachedTarget = false;
            !hasUpdatedFrame && applyFriction(t);
            return state;
        }
    };
};

exports.glide = glide;


/***/ }),

/***/ 7724:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var index = __webpack_require__(6471);
var index$1 = __webpack_require__(4636);
var pregenerateKeyframes = __webpack_require__(9848);
var velocity = __webpack_require__(4574);



exports.glide = index.glide;
exports.spring = index$1.spring;
exports.pregenerateKeyframes = pregenerateKeyframes.pregenerateKeyframes;
exports.calcGeneratorVelocity = velocity.calcGeneratorVelocity;


/***/ }),

/***/ 5992:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const defaults = {
    stiffness: 100.0,
    damping: 10.0,
    mass: 1.0,
};

exports.defaults = defaults;


/***/ }),

/***/ 4636:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);
var defaults = __webpack_require__(5992);
var utils$1 = __webpack_require__(4360);
var hasReachedTarget = __webpack_require__(5765);
var velocity = __webpack_require__(4574);

const spring = ({ stiffness = defaults.defaults.stiffness, damping = defaults.defaults.damping, mass = defaults.defaults.mass, from = 0, to = 1, velocity: velocity$1 = 0.0, restSpeed = 2, restDistance = 0.5, } = {}) => {
    velocity$1 = velocity$1 ? utils.time.s(velocity$1) : 0.0;
    const state = {
        done: false,
        hasReachedTarget: false,
        current: from,
        target: to,
    };
    const initialDelta = to - from;
    const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1000;
    const dampingRatio = utils$1.calcDampingRatio(stiffness, damping, mass);
    let resolveSpring;
    if (dampingRatio < 1) {
        const angularFreq = undampedAngularFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
        // Underdamped spring (bouncy)
        resolveSpring = (t) => to -
            Math.exp(-dampingRatio * undampedAngularFreq * t) *
                (((-velocity$1 + dampingRatio * undampedAngularFreq * initialDelta) /
                    angularFreq) *
                    Math.sin(angularFreq * t) +
                    initialDelta * Math.cos(angularFreq * t));
    }
    else {
        // Critically damped spring
        resolveSpring = (t) => {
            return (to -
                Math.exp(-undampedAngularFreq * t) *
                    (initialDelta + (-velocity$1 + undampedAngularFreq * initialDelta) * t));
        };
    }
    return (t) => {
        state.current = resolveSpring(t);
        const currentVelocity = t === 0
            ? velocity$1
            : velocity.calcGeneratorVelocity(resolveSpring, t, state.current);
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(to - state.current) <= restDistance;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
        state.hasReachedTarget = hasReachedTarget.hasReachedTarget(from, to, state.current);
        return state;
    };
};

exports.spring = spring;


/***/ }),

/***/ 4360:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var defaults = __webpack_require__(5992);

const calcDampingRatio = (stiffness = defaults.defaults.stiffness, damping = defaults.defaults.damping, mass = defaults.defaults.mass) => damping / (2 * Math.sqrt(stiffness * mass));

exports.calcDampingRatio = calcDampingRatio;


/***/ }),

/***/ 5765:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function hasReachedTarget(origin, target, current) {
    return ((origin < target && current >= target) ||
        (origin > target && current <= target));
}

exports.hasReachedTarget = hasReachedTarget;


/***/ }),

/***/ 9848:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

const timeStep = 10;
const maxDuration = 10000;
function pregenerateKeyframes(generator, toUnit = utils.noopReturn) {
    let overshootDuration = undefined;
    let timestamp = timeStep;
    let state = generator(0);
    const keyframes = [toUnit(state.current)];
    while (!state.done && timestamp < maxDuration) {
        state = generator(timestamp);
        keyframes.push(toUnit(state.done ? state.target : state.current));
        if (overshootDuration === undefined && state.hasReachedTarget) {
            overshootDuration = timestamp;
        }
        timestamp += timeStep;
    }
    const duration = timestamp - timeStep;
    /**
     * If generating an animation that didn't actually move,
     * generate a second keyframe so we have an origin and target.
     */
    if (keyframes.length === 1)
        keyframes.push(state.current);
    return {
        keyframes,
        duration: duration / 1000,
        overshootDuration: (overshootDuration !== null && overshootDuration !== void 0 ? overshootDuration : duration) / 1000,
    };
}

exports.pregenerateKeyframes = pregenerateKeyframes;


/***/ }),

/***/ 4574:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var utils = __webpack_require__(986);

const sampleT = 5; // ms
function calcGeneratorVelocity(resolveValue, t, current) {
    const prevT = Math.max(t - sampleT, 0);
    return utils.velocityPerSecond(current - resolveValue(prevT), t - prevT);
}

exports.calcGeneratorVelocity = calcGeneratorVelocity;


/***/ }),

/***/ 5922:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

/**
 * The MotionValue tracks the state of a single animatable
 * value. Currently, updatedAt and current are unused. The
 * long term idea is to use this to minimise the number
 * of DOM reads, and to abstract the DOM interactions here.
 */
class MotionValue {
    setAnimation(animation) {
        this.animation = animation;
        animation === null || animation === void 0 ? void 0 : animation.finished.then(() => this.clearAnimation()).catch(() => { });
    }
    clearAnimation() {
        this.animation = this.generator = undefined;
    }
}

exports.MotionValue = MotionValue;


/***/ }),

/***/ 9027:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var MotionValue = __webpack_require__(5922);



exports.MotionValue = MotionValue.MotionValue;


/***/ }),

/***/ 3438:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

function addUniqueItem(array, item) {
    array.indexOf(item) === -1 && array.push(item);
}
function removeItem(arr, item) {
    const index = arr.indexOf(item);
    index > -1 && arr.splice(index, 1);
}

exports.addUniqueItem = addUniqueItem;
exports.removeItem = removeItem;


/***/ }),

/***/ 1073:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const clamp = (min, max, v) => Math.min(Math.max(v, min), max);

exports.clamp = clamp;


/***/ }),

/***/ 6648:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const defaults = {
    duration: 0.3,
    delay: 0,
    endDelay: 0,
    repeat: 0,
    easing: "ease",
};

exports.defaults = defaults;


/***/ }),

/***/ 2621:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var isEasingList = __webpack_require__(7221);
var wrap = __webpack_require__(589);

function getEasingForSegment(easing, i) {
    return isEasingList.isEasingList(easing)
        ? easing[wrap.wrap(0, easing.length, i)]
        : easing;
}

exports.getEasingForSegment = getEasingForSegment;


/***/ }),

/***/ 986:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var array = __webpack_require__(3438);
var clamp = __webpack_require__(1073);
var defaults = __webpack_require__(6648);
var easing = __webpack_require__(2621);
var interpolate = __webpack_require__(450);
var isCubicBezier = __webpack_require__(581);
var isEasingGenerator = __webpack_require__(3278);
var isEasingList = __webpack_require__(7221);
var isFunction = __webpack_require__(9684);
var isNumber = __webpack_require__(6059);
var isString = __webpack_require__(2255);
var mix = __webpack_require__(3435);
var noop = __webpack_require__(5683);
var offset = __webpack_require__(2567);
var progress = __webpack_require__(362);
var time = __webpack_require__(7924);
var velocity = __webpack_require__(9881);
var wrap = __webpack_require__(589);



exports.addUniqueItem = array.addUniqueItem;
exports.removeItem = array.removeItem;
exports.clamp = clamp.clamp;
exports.defaults = defaults.defaults;
exports.getEasingForSegment = easing.getEasingForSegment;
exports.interpolate = interpolate.interpolate;
exports.isCubicBezier = isCubicBezier.isCubicBezier;
exports.isEasingGenerator = isEasingGenerator.isEasingGenerator;
exports.isEasingList = isEasingList.isEasingList;
exports.isFunction = isFunction.isFunction;
exports.isNumber = isNumber.isNumber;
exports.isString = isString.isString;
exports.mix = mix.mix;
exports.noop = noop.noop;
exports.noopReturn = noop.noopReturn;
exports.defaultOffset = offset.defaultOffset;
exports.fillOffset = offset.fillOffset;
exports.progress = progress.progress;
exports.time = time.time;
exports.velocityPerSecond = velocity.velocityPerSecond;
exports.wrap = wrap.wrap;


/***/ }),

/***/ 450:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var mix = __webpack_require__(3435);
var noop = __webpack_require__(5683);
var offset = __webpack_require__(2567);
var progress = __webpack_require__(362);
var easing = __webpack_require__(2621);
var clamp = __webpack_require__(1073);

function interpolate(output, input = offset.defaultOffset(output.length), easing$1 = noop.noopReturn) {
    const length = output.length;
    /**
     * If the input length is lower than the output we
     * fill the input to match. This currently assumes the input
     * is an animation progress value so is a good candidate for
     * moving outside the function.
     */
    const remainder = length - input.length;
    remainder > 0 && offset.fillOffset(input, remainder);
    return (t) => {
        let i = 0;
        for (; i < length - 2; i++) {
            if (t < input[i + 1])
                break;
        }
        let progressInRange = clamp.clamp(0, 1, progress.progress(input[i], input[i + 1], t));
        const segmentEasing = easing.getEasingForSegment(easing$1, i);
        progressInRange = segmentEasing(progressInRange);
        return mix.mix(output[i], output[i + 1], progressInRange);
    };
}

exports.interpolate = interpolate;


/***/ }),

/***/ 581:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var isNumber = __webpack_require__(6059);

const isCubicBezier = (easing) => Array.isArray(easing) && isNumber.isNumber(easing[0]);

exports.isCubicBezier = isCubicBezier;


/***/ }),

/***/ 3278:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const isEasingGenerator = (easing) => typeof easing === "object" &&
    Boolean(easing.createAnimation);

exports.isEasingGenerator = isEasingGenerator;


/***/ }),

/***/ 7221:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var isNumber = __webpack_require__(6059);

const isEasingList = (easing) => Array.isArray(easing) && !isNumber.isNumber(easing[0]);

exports.isEasingList = isEasingList;


/***/ }),

/***/ 9684:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const isFunction = (value) => typeof value === "function";

exports.isFunction = isFunction;


/***/ }),

/***/ 6059:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const isNumber = (value) => typeof value === "number";

exports.isNumber = isNumber;


/***/ }),

/***/ 2255:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const isString = (value) => typeof value === "string";

exports.isString = isString;


/***/ }),

/***/ 3435:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const mix = (min, max, progress) => -progress * min + progress * max + min;

exports.mix = mix;


/***/ }),

/***/ 5683:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const noop = () => { };
const noopReturn = (v) => v;

exports.noop = noop;
exports.noopReturn = noopReturn;


/***/ }),

/***/ 2567:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var mix = __webpack_require__(3435);
var progress = __webpack_require__(362);

function fillOffset(offset, remaining) {
    const min = offset[offset.length - 1];
    for (let i = 1; i <= remaining; i++) {
        const offsetProgress = progress.progress(0, remaining, i);
        offset.push(mix.mix(min, 1, offsetProgress));
    }
}
function defaultOffset(length) {
    const offset = [0];
    fillOffset(offset, length - 1);
    return offset;
}

exports.defaultOffset = defaultOffset;
exports.fillOffset = fillOffset;


/***/ }),

/***/ 362:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const progress = (min, max, value) => max - min === 0 ? 1 : (value - min) / (max - min);

exports.progress = progress;


/***/ }),

/***/ 7924:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const time = {
    ms: (seconds) => seconds * 1000,
    s: (milliseconds) => milliseconds / 1000,
};

exports.time = time;


/***/ }),

/***/ 9881:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

/*
  Convert velocity into velocity per second

  @param [number]: Unit per frame
  @param [number]: Frame duration in ms
*/
function velocityPerSecond(velocity, frameDuration) {
    return frameDuration ? velocity * (1000 / frameDuration) : 0;
}

exports.velocityPerSecond = velocityPerSecond;


/***/ }),

/***/ 589:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

exports.wrap = wrap;


/***/ }),

/***/ 1320:
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({ value: true }));

exports.warning = function () { };
exports.invariant = function () { };
if (false) {}


/***/ }),

/***/ 655:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__assign": function() { return /* binding */ __assign; },
/* harmony export */   "__asyncDelegator": function() { return /* binding */ __asyncDelegator; },
/* harmony export */   "__asyncGenerator": function() { return /* binding */ __asyncGenerator; },
/* harmony export */   "__asyncValues": function() { return /* binding */ __asyncValues; },
/* harmony export */   "__await": function() { return /* binding */ __await; },
/* harmony export */   "__awaiter": function() { return /* binding */ __awaiter; },
/* harmony export */   "__classPrivateFieldGet": function() { return /* binding */ __classPrivateFieldGet; },
/* harmony export */   "__classPrivateFieldIn": function() { return /* binding */ __classPrivateFieldIn; },
/* harmony export */   "__classPrivateFieldSet": function() { return /* binding */ __classPrivateFieldSet; },
/* harmony export */   "__createBinding": function() { return /* binding */ __createBinding; },
/* harmony export */   "__decorate": function() { return /* binding */ __decorate; },
/* harmony export */   "__exportStar": function() { return /* binding */ __exportStar; },
/* harmony export */   "__extends": function() { return /* binding */ __extends; },
/* harmony export */   "__generator": function() { return /* binding */ __generator; },
/* harmony export */   "__importDefault": function() { return /* binding */ __importDefault; },
/* harmony export */   "__importStar": function() { return /* binding */ __importStar; },
/* harmony export */   "__makeTemplateObject": function() { return /* binding */ __makeTemplateObject; },
/* harmony export */   "__metadata": function() { return /* binding */ __metadata; },
/* harmony export */   "__param": function() { return /* binding */ __param; },
/* harmony export */   "__read": function() { return /* binding */ __read; },
/* harmony export */   "__rest": function() { return /* binding */ __rest; },
/* harmony export */   "__spread": function() { return /* binding */ __spread; },
/* harmony export */   "__spreadArray": function() { return /* binding */ __spreadArray; },
/* harmony export */   "__spreadArrays": function() { return /* binding */ __spreadArrays; },
/* harmony export */   "__values": function() { return /* binding */ __values; }
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ }),

/***/ 2064:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "j": function() { return /* binding */ animate; }
/* harmony export */ });
/* harmony import */ var _value_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3234);
/* harmony import */ var _value_utils_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(406);
/* harmony import */ var _utils_transitions_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6522);




/**
 * Animate a single value or a `MotionValue`.
 *
 * The first argument is either a `MotionValue` to animate, or an initial animation value.
 *
 * The second is either a value to animate to, or an array of keyframes to animate through.
 *
 * The third argument can be either tween or spring options, and optional lifecycle methods: `onUpdate`, `onPlay`, `onComplete`, `onRepeat` and `onStop`.
 *
 * Returns `AnimationPlaybackControls`, currently just a `stop` method.
 *
 * ```javascript
 * const x = useMotionValue(0)
 *
 * useEffect(() => {
 *   const controls = animate(x, 100, {
 *     type: "spring",
 *     stiffness: 2000,
 *     onComplete: v => {}
 *   })
 *
 *   return controls.stop
 * })
 * ```
 *
 * @public
 */
function animate(from, to, transition) {
    if (transition === void 0) { transition = {}; }
    var value = (0,_value_utils_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isMotionValue */ .i)(from) ? from : (0,_value_index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .motionValue */ .B)(from);
    (0,_utils_transitions_mjs__WEBPACK_IMPORTED_MODULE_2__/* .startAnimation */ .b8)("", value, to, transition);
    return {
        stop: function () { return value.stop(); },
        isAnimating: function () { return value.isAnimating(); },
    };
}




/***/ }),

/***/ 3077:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "H": function() { return /* binding */ isAnimationControls; }
/* harmony export */ });
function isAnimationControls(v) {
    return typeof v === "object" && typeof v.start === "function";
}




/***/ }),

/***/ 8488:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C": function() { return /* binding */ isKeyframesTarget; }
/* harmony export */ });
var isKeyframesTarget = function (v) {
    return Array.isArray(v);
};




/***/ }),

/***/ 6522:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ev": function() { return /* binding */ getValueTransition; },
  "b8": function() { return /* binding */ startAnimation; }
});

// UNUSED EXPORTS: convertTransitionToAnimationOptions, getDelayFromTransition, getPopmotionAnimationOptions, getZeroUnit, hydrateKeyframes, isTransitionDefined, isZero

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/animations/index.mjs + 6 modules
var animations = __webpack_require__(612);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/velocity-per-second.mjs
var velocity_per_second = __webpack_require__(9296);
// EXTERNAL MODULE: ./node_modules/popmotion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(2151);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/inertia.mjs




function inertia({ from = 0, velocity = 0, min, max, power = 0.8, timeConstant = 750, bounceStiffness = 500, bounceDamping = 10, restDelta = 1, modifyTarget, driver, onUpdate, onComplete, onStop, }) {
    let currentAnimation;
    function isOutOfBounds(v) {
        return (min !== undefined && v < min) || (max !== undefined && v > max);
    }
    function boundaryNearest(v) {
        if (min === undefined)
            return max;
        if (max === undefined)
            return min;
        return Math.abs(min - v) < Math.abs(max - v) ? min : max;
    }
    function startAnimation(options) {
        currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop();
        currentAnimation = (0,animations/* animate */.j)(Object.assign(Object.assign({}, options), { driver, onUpdate: (v) => {
                var _a;
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(v);
                (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, v);
            }, onComplete,
            onStop }));
    }
    function startSpring(options) {
        startAnimation(Object.assign({ type: "spring", stiffness: bounceStiffness, damping: bounceDamping, restDelta }, options));
    }
    if (isOutOfBounds(from)) {
        startSpring({ from, velocity, to: boundaryNearest(from) });
    }
    else {
        let target = power * velocity + from;
        if (typeof modifyTarget !== "undefined")
            target = modifyTarget(target);
        const boundary = boundaryNearest(target);
        const heading = boundary === min ? -1 : 1;
        let prev;
        let current;
        const checkBoundary = (v) => {
            prev = current;
            current = v;
            velocity = (0,velocity_per_second/* velocityPerSecond */.R)(v - prev, (0,es/* getFrameData */.$B)().delta);
            if ((heading === 1 && v > boundary) ||
                (heading === -1 && v < boundary)) {
                startSpring({ from: v, to: boundary, velocity });
            }
        };
        startAnimation({
            type: "decay",
            from,
            velocity,
            timeConstant,
            power,
            restDelta,
            modifyTarget,
            onUpdate: isOutOfBounds(target) ? checkBoundary : undefined,
        });
    }
    return {
        stop: () => currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop(),
    };
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/time-conversion.mjs
var time_conversion = __webpack_require__(420);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/easing/index.mjs + 1 modules
var easing = __webpack_require__(4710);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/easing/cubic-bezier.mjs


const a = (a1, a2) => 1.0 - 3.0 * a2 + 3.0 * a1;
const b = (a1, a2) => 3.0 * a2 - 6.0 * a1;
const c = (a1) => 3.0 * a1;
const calcBezier = (t, a1, a2) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
const getSlope = (t, a1, a2) => 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
const subdivisionPrecision = 0.0000001;
const subdivisionMaxIterations = 10;
function binarySubdivide(aX, aA, aB, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
            aB = currentT;
        }
        else {
            aA = currentT;
        }
    } while (Math.abs(currentX) > subdivisionPrecision &&
        ++i < subdivisionMaxIterations);
    return currentT;
}
const newtonIterations = 8;
const newtonMinSlope = 0.001;
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (let i = 0; i < newtonIterations; ++i) {
        const currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
            return aGuessT;
        }
        const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
}
const kSplineTableSize = 11;
const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
function cubicBezier(mX1, mY1, mX2, mY2) {
    if (mX1 === mY1 && mX2 === mY2)
        return easing/* linear */.GE;
    const sampleValues = new Float32Array(kSplineTableSize);
    for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
    function getTForX(aX) {
        let intervalStart = 0.0;
        let currentSample = 1;
        const lastSample = kSplineTableSize - 1;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;
        const dist = (aX - sampleValues[currentSample]) /
            (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        const guessForT = intervalStart + dist * kSampleStepSize;
        const initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= newtonMinSlope) {
            return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        }
        else if (initialSlope === 0.0) {
            return guessForT;
        }
        else {
            return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
    }
    return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/utils/easing.mjs




var easingLookup = {
    linear: easing/* linear */.GE,
    easeIn: easing/* easeIn */.YQ,
    easeInOut: easing/* easeInOut */.mZ,
    easeOut: easing/* easeOut */.Vv,
    circIn: easing/* circIn */.Z7,
    circInOut: easing/* circInOut */.X7,
    circOut: easing/* circOut */.Bn,
    backIn: easing/* backIn */.G2,
    backInOut: easing/* backInOut */.XL,
    backOut: easing/* backOut */.CG,
    anticipate: easing/* anticipate */.LU,
    bounceIn: easing/* bounceIn */.h9,
    bounceInOut: easing/* bounceInOut */.yD,
    bounceOut: easing/* bounceOut */.gJ,
};
var easingDefinitionToFunction = function (definition) {
    if (Array.isArray(definition)) {
        // If cubic bezier definition, create bezier curve
        (0,dist.invariant)(definition.length === 4, "Cubic bezier arrays must contain four numerical values.");
        var _a = (0,tslib_es6.__read)(definition, 4), x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
        return cubicBezier(x1, y1, x2, y2);
    }
    else if (typeof definition === "string") {
        // Else lookup from table
        (0,dist.invariant)(easingLookup[definition] !== undefined, "Invalid easing type '".concat(definition, "'"));
        return easingLookup[definition];
    }
    return definition;
};
var isEasingArray = function (ease) {
    return Array.isArray(ease) && typeof ease[0] !== "number";
};



// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/complex/index.mjs
var complex = __webpack_require__(8407);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/utils/is-animatable.mjs


/**
 * Check if a value is animatable. Examples:
 *
 * ✅: 100, "100px", "#fff"
 * ❌: "block", "url(2.jpg)"
 * @param value
 *
 * @internal
 */
var isAnimatable = function (key, value) {
    // If the list of keys tat might be non-animatable grows, replace with Set
    if (key === "zIndex")
        return false;
    // If it's a number or a keyframes array, we can animate it. We might at some point
    // need to do a deep isAnimatable check of keyframes, or let Popmotion handle this,
    // but for now lets leave it like this for performance reasons
    if (typeof value === "number" || Array.isArray(value))
        return true;
    if (typeof value === "string" && // It's animatable if we have a string
        complex/* complex.test */.P.test(value) && // And it contains numbers and/or colors
        !value.startsWith("url(") // Unless it starts with "url("
    ) {
        return true;
    }
    return false;
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/utils/is-keyframes-target.mjs
var is_keyframes_target = __webpack_require__(8488);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/utils/default-transitions.mjs



var underDampedSpring = function () { return ({
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10,
}); };
var criticallyDampedSpring = function (to) { return ({
    type: "spring",
    stiffness: 550,
    damping: to === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
}); };
var linearTween = function () { return ({
    type: "keyframes",
    ease: "linear",
    duration: 0.3,
}); };
var keyframes = function (values) { return ({
    type: "keyframes",
    duration: 0.8,
    values: values,
}); };
var defaultTransitions = {
    x: underDampedSpring,
    y: underDampedSpring,
    z: underDampedSpring,
    rotate: underDampedSpring,
    rotateX: underDampedSpring,
    rotateY: underDampedSpring,
    rotateZ: underDampedSpring,
    scaleX: criticallyDampedSpring,
    scaleY: criticallyDampedSpring,
    scale: criticallyDampedSpring,
    opacity: linearTween,
    backgroundColor: linearTween,
    color: linearTween,
    default: criticallyDampedSpring,
};
var getDefaultTransition = function (valueKey, to) {
    var transitionFactory;
    if ((0,is_keyframes_target/* isKeyframesTarget */.C)(to)) {
        transitionFactory = keyframes;
    }
    else {
        transitionFactory =
            defaultTransitions[valueKey] || defaultTransitions.default;
    }
    return (0,tslib_es6.__assign)({ to: to }, transitionFactory(to));
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/animatable-none.mjs
var animatable_none = __webpack_require__(9135);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-instant-transition-state.mjs
var use_instant_transition_state = __webpack_require__(8627);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/resolve-value.mjs
var resolve_value = __webpack_require__(8715);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/utils/transitions.mjs











/**
 * Decide whether a transition is defined on a given Transition.
 * This filters out orchestration options and returns true
 * if any options are left.
 */
function isTransitionDefined(_a) {
    _a.when; _a.delay; _a.delayChildren; _a.staggerChildren; _a.staggerDirection; _a.repeat; _a.repeatType; _a.repeatDelay; _a.from; var transition = (0,tslib_es6.__rest)(_a, ["when", "delay", "delayChildren", "staggerChildren", "staggerDirection", "repeat", "repeatType", "repeatDelay", "from"]);
    return !!Object.keys(transition).length;
}
var legacyRepeatWarning = false;
/**
 * Convert Framer Motion's Transition type into Popmotion-compatible options.
 */
function convertTransitionToAnimationOptions(_a) {
    var ease = _a.ease, times = _a.times, yoyo = _a.yoyo, flip = _a.flip, loop = _a.loop, transition = (0,tslib_es6.__rest)(_a, ["ease", "times", "yoyo", "flip", "loop"]);
    var options = (0,tslib_es6.__assign)({}, transition);
    if (times)
        options["offset"] = times;
    /**
     * Convert any existing durations from seconds to milliseconds
     */
    if (transition.duration)
        options["duration"] = (0,time_conversion/* secondsToMilliseconds */.w)(transition.duration);
    if (transition.repeatDelay)
        options.repeatDelay = (0,time_conversion/* secondsToMilliseconds */.w)(transition.repeatDelay);
    /**
     * Map easing names to Popmotion's easing functions
     */
    if (ease) {
        options["ease"] = isEasingArray(ease)
            ? ease.map(easingDefinitionToFunction)
            : easingDefinitionToFunction(ease);
    }
    /**
     * Support legacy transition API
     */
    if (transition.type === "tween")
        options.type = "keyframes";
    /**
     * TODO: These options are officially removed from the API.
     */
    if (yoyo || loop || flip) {
        (0,dist.warning)(!legacyRepeatWarning, "yoyo, loop and flip have been removed from the API. Replace with repeat and repeatType options.");
        legacyRepeatWarning = true;
        if (yoyo) {
            options.repeatType = "reverse";
        }
        else if (loop) {
            options.repeatType = "loop";
        }
        else if (flip) {
            options.repeatType = "mirror";
        }
        options.repeat = loop || yoyo || flip || transition.repeat;
    }
    /**
     * TODO: Popmotion 9 has the ability to automatically detect whether to use
     * a keyframes or spring animation, but does so by detecting velocity and other spring options.
     * It'd be good to introduce a similar thing here.
     */
    if (transition.type !== "spring")
        options.type = "keyframes";
    return options;
}
/**
 * Get the delay for a value by checking Transition with decreasing specificity.
 */
function getDelayFromTransition(transition, key) {
    var _a, _b;
    var valueTransition = getValueTransition(transition, key) || {};
    return (_b = (_a = valueTransition.delay) !== null && _a !== void 0 ? _a : transition.delay) !== null && _b !== void 0 ? _b : 0;
}
function hydrateKeyframes(options) {
    if (Array.isArray(options.to) && options.to[0] === null) {
        options.to = (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(options.to), false);
        options.to[0] = options.from;
    }
    return options;
}
function getPopmotionAnimationOptions(transition, options, key) {
    var _a;
    if (Array.isArray(options.to)) {
        (_a = transition.duration) !== null && _a !== void 0 ? _a : (transition.duration = 0.8);
    }
    hydrateKeyframes(options);
    /**
     * Get a default transition if none is determined to be defined.
     */
    if (!isTransitionDefined(transition)) {
        transition = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, transition), getDefaultTransition(key, options.to));
    }
    return (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, options), convertTransitionToAnimationOptions(transition));
}
/**
 *
 */
function getAnimation(key, value, target, transition, onComplete) {
    var _a;
    var valueTransition = getValueTransition(transition, key);
    var origin = (_a = valueTransition.from) !== null && _a !== void 0 ? _a : value.get();
    var isTargetAnimatable = isAnimatable(key, target);
    if (origin === "none" && isTargetAnimatable && typeof target === "string") {
        /**
         * If we're trying to animate from "none", try and get an animatable version
         * of the target. This could be improved to work both ways.
         */
        origin = (0,animatable_none/* getAnimatableNone */.T)(key, target);
    }
    else if (isZero(origin) && typeof target === "string") {
        origin = getZeroUnit(target);
    }
    else if (!Array.isArray(target) &&
        isZero(target) &&
        typeof origin === "string") {
        target = getZeroUnit(origin);
    }
    var isOriginAnimatable = isAnimatable(key, origin);
    (0,dist.warning)(isOriginAnimatable === isTargetAnimatable, "You are trying to animate ".concat(key, " from \"").concat(origin, "\" to \"").concat(target, "\". ").concat(origin, " is not an animatable value - to enable this animation set ").concat(origin, " to a value animatable to ").concat(target, " via the `style` property."));
    function start() {
        var options = {
            from: origin,
            to: target,
            velocity: value.getVelocity(),
            onComplete: onComplete,
            onUpdate: function (v) { return value.set(v); },
        };
        return valueTransition.type === "inertia" ||
            valueTransition.type === "decay"
            ? inertia((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, options), valueTransition))
            : (0,animations/* animate */.j)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, getPopmotionAnimationOptions(valueTransition, options, key)), { onUpdate: function (v) {
                    var _a;
                    options.onUpdate(v);
                    (_a = valueTransition.onUpdate) === null || _a === void 0 ? void 0 : _a.call(valueTransition, v);
                }, onComplete: function () {
                    var _a;
                    options.onComplete();
                    (_a = valueTransition.onComplete) === null || _a === void 0 ? void 0 : _a.call(valueTransition);
                } }));
    }
    function set() {
        var _a, _b;
        var finalTarget = (0,resolve_value/* resolveFinalValueInKeyframes */.Y)(target);
        value.set(finalTarget);
        onComplete();
        (_a = valueTransition === null || valueTransition === void 0 ? void 0 : valueTransition.onUpdate) === null || _a === void 0 ? void 0 : _a.call(valueTransition, finalTarget);
        (_b = valueTransition === null || valueTransition === void 0 ? void 0 : valueTransition.onComplete) === null || _b === void 0 ? void 0 : _b.call(valueTransition);
        return { stop: function () { } };
    }
    return !isOriginAnimatable ||
        !isTargetAnimatable ||
        valueTransition.type === false
        ? set
        : start;
}
function isZero(value) {
    return (value === 0 ||
        (typeof value === "string" &&
            parseFloat(value) === 0 &&
            value.indexOf(" ") === -1));
}
function getZeroUnit(potentialUnitType) {
    return typeof potentialUnitType === "number"
        ? 0
        : (0,animatable_none/* getAnimatableNone */.T)("", potentialUnitType);
}
function getValueTransition(transition, key) {
    return transition[key] || transition["default"] || transition;
}
/**
 * Start animation on a MotionValue. This function is an interface between
 * Framer Motion and Popmotion
 */
function startAnimation(key, value, target, transition) {
    if (transition === void 0) { transition = {}; }
    if (use_instant_transition_state/* instantAnimationState.current */.c.current) {
        transition = { type: false };
    }
    return value.start(function (onComplete) {
        var delayTimer;
        var controls;
        var animation = getAnimation(key, value, target, transition, onComplete);
        var delay = getDelayFromTransition(transition, key);
        var start = function () { return (controls = animation()); };
        if (delay) {
            delayTimer = window.setTimeout(start, (0,time_conversion/* secondsToMilliseconds */.w)(delay));
        }
        else {
            start();
        }
        return function () {
            clearTimeout(delayTimer);
            controls === null || controls === void 0 ? void 0 : controls.stop();
        };
    });
}




/***/ }),

/***/ 5421:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "M": function() { return /* binding */ AnimatePresence; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/process.mjs
var process = __webpack_require__(9304);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-force-update.mjs
var use_force_update = __webpack_require__(6337);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-is-mounted.mjs
var use_is_mounted = __webpack_require__(4454);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/PresenceContext.mjs
var PresenceContext = __webpack_require__(240);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-constant.mjs
var use_constant = __webpack_require__(6681);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-id.mjs
var use_id = __webpack_require__(6316);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs







var PresenceChild = function (_a) {
    var children = _a.children, initial = _a.initial, isPresent = _a.isPresent, onExitComplete = _a.onExitComplete, custom = _a.custom, presenceAffectsLayout = _a.presenceAffectsLayout;
    var presenceChildren = (0,use_constant/* useConstant */.h)(newChildrenMap);
    var id = (0,use_id/* useId */.M)();
    var context = (0,external_react_.useMemo)(function () { return ({
        id: id,
        initial: initial,
        isPresent: isPresent,
        custom: custom,
        onExitComplete: function (childId) {
            var e_1, _a;
            presenceChildren.set(childId, true);
            try {
                for (var _b = (0,tslib_es6.__values)(presenceChildren.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var isComplete = _c.value;
                    if (!isComplete)
                        return; // can stop searching when any is incomplete
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
        },
        register: function (childId) {
            presenceChildren.set(childId, false);
            return function () { return presenceChildren.delete(childId); };
        },
    }); }, 
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    presenceAffectsLayout ? undefined : [isPresent]);
    (0,external_react_.useMemo)(function () {
        presenceChildren.forEach(function (_, key) { return presenceChildren.set(key, false); });
    }, [isPresent]);
    /**
     * If there's no `motion` components to fire exit animations, we want to remove this
     * component immediately.
     */
    external_react_.useEffect(function () {
        !isPresent && !presenceChildren.size && (onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete());
    }, [isPresent]);
    return (external_react_.createElement(PresenceContext/* PresenceContext.Provider */.O.Provider, { value: context }, children));
};
function newChildrenMap() {
    return new Map();
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var LayoutGroupContext = __webpack_require__(5364);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var use_isomorphic_effect = __webpack_require__(8868);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs
var use_unmount_effect = __webpack_require__(5411);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs











var getChildKey = function (child) { return child.key || ""; };
function updateChildLookup(children, allChildren) {
    children.forEach(function (child) {
        var key = getChildKey(child);
        allChildren.set(key, child);
    });
}
function onlyElements(children) {
    var filtered = [];
    // We use forEach here instead of map as map mutates the component key by preprending `.$`
    external_react_.Children.forEach(children, function (child) {
        if ((0,external_react_.isValidElement)(child))
            filtered.push(child);
    });
    return filtered;
}
/**
 * `AnimatePresence` enables the animation of components that have been removed from the tree.
 *
 * When adding/removing more than a single child, every child **must** be given a unique `key` prop.
 *
 * Any `motion` components that have an `exit` property defined will animate out when removed from
 * the tree.
 *
 * ```jsx
 * import { motion, AnimatePresence } from 'framer-motion'
 *
 * export const Items = ({ items }) => (
 *   <AnimatePresence>
 *     {items.map(item => (
 *       <motion.div
 *         key={item.id}
 *         initial={{ opacity: 0 }}
 *         animate={{ opacity: 1 }}
 *         exit={{ opacity: 0 }}
 *       />
 *     ))}
 *   </AnimatePresence>
 * )
 * ```
 *
 * You can sequence exit animations throughout a tree using variants.
 *
 * If a child contains multiple `motion` components with `exit` props, it will only unmount the child
 * once all `motion` components have finished animating out. Likewise, any components using
 * `usePresence` all need to call `safeToRemove`.
 *
 * @public
 */
var AnimatePresence = function (_a) {
    var children = _a.children, custom = _a.custom, _b = _a.initial, initial = _b === void 0 ? true : _b, onExitComplete = _a.onExitComplete, exitBeforeEnter = _a.exitBeforeEnter, _c = _a.presenceAffectsLayout, presenceAffectsLayout = _c === void 0 ? true : _c;
    // We want to force a re-render once all exiting animations have finished. We
    // either use a local forceRender function, or one from a parent context if it exists.
    var _d = (0,tslib_es6.__read)((0,use_force_update/* useForceUpdate */.N)(), 1), forceRender = _d[0];
    var forceRenderLayoutGroup = (0,external_react_.useContext)(LayoutGroupContext/* LayoutGroupContext */.p).forceRender;
    if (forceRenderLayoutGroup)
        forceRender = forceRenderLayoutGroup;
    var isMounted = (0,use_is_mounted/* useIsMounted */.t)();
    // Filter out any children that aren't ReactElements. We can only track ReactElements with a props.key
    var filteredChildren = onlyElements(children);
    var childrenToRender = filteredChildren;
    var exiting = new Set();
    // Keep a living record of the children we're actually rendering so we
    // can diff to figure out which are entering and exiting
    var presentChildren = (0,external_react_.useRef)(childrenToRender);
    // A lookup table to quickly reference components by key
    var allChildren = (0,external_react_.useRef)(new Map()).current;
    // If this is the initial component render, just deal with logic surrounding whether
    // we play onMount animations or not.
    var isInitialRender = (0,external_react_.useRef)(true);
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        isInitialRender.current = false;
        updateChildLookup(filteredChildren, allChildren);
        presentChildren.current = childrenToRender;
    });
    (0,use_unmount_effect/* useUnmountEffect */.z)(function () {
        isInitialRender.current = true;
        allChildren.clear();
        exiting.clear();
    });
    if (isInitialRender.current) {
        return (external_react_.createElement(external_react_.Fragment, null, childrenToRender.map(function (child) { return (external_react_.createElement(PresenceChild, { key: getChildKey(child), isPresent: true, initial: initial ? undefined : false, presenceAffectsLayout: presenceAffectsLayout }, child)); })));
    }
    // If this is a subsequent render, deal with entering and exiting children
    childrenToRender = (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(childrenToRender), false);
    // Diff the keys of the currently-present and target children to update our
    // exiting list.
    var presentKeys = presentChildren.current.map(getChildKey);
    var targetKeys = filteredChildren.map(getChildKey);
    // Diff the present children with our target children and mark those that are exiting
    var numPresent = presentKeys.length;
    for (var i = 0; i < numPresent; i++) {
        var key = presentKeys[i];
        if (targetKeys.indexOf(key) === -1) {
            exiting.add(key);
        }
    }
    // If we currently have exiting children, and we're deferring rendering incoming children
    // until after all current children have exiting, empty the childrenToRender array
    if (exitBeforeEnter && exiting.size) {
        childrenToRender = [];
    }
    // Loop through all currently exiting components and clone them to overwrite `animate`
    // with any `exit` prop they might have defined.
    exiting.forEach(function (key) {
        // If this component is actually entering again, early return
        if (targetKeys.indexOf(key) !== -1)
            return;
        var child = allChildren.get(key);
        if (!child)
            return;
        var insertionIndex = presentKeys.indexOf(key);
        var onExit = function () {
            allChildren.delete(key);
            exiting.delete(key);
            // Remove this child from the present children
            var removeIndex = presentChildren.current.findIndex(function (presentChild) { return presentChild.key === key; });
            presentChildren.current.splice(removeIndex, 1);
            // Defer re-rendering until all exiting children have indeed left
            if (!exiting.size) {
                presentChildren.current = filteredChildren;
                if (isMounted.current === false)
                    return;
                forceRender();
                onExitComplete && onExitComplete();
            }
        };
        childrenToRender.splice(insertionIndex, 0, external_react_.createElement(PresenceChild, { key: getChildKey(child), isPresent: false, onExitComplete: onExit, custom: custom, presenceAffectsLayout: presenceAffectsLayout }, child));
    });
    // Add `MotionContext` even to children that don't need it to ensure we're rendering
    // the same tree between renders
    childrenToRender = childrenToRender.map(function (child) {
        var key = child.key;
        return exiting.has(key) ? (child) : (external_react_.createElement(PresenceChild, { key: getChildKey(child), isPresent: true, presenceAffectsLayout: presenceAffectsLayout }, child));
    });
    if (process/* env */.O !== "production" &&
        exitBeforeEnter &&
        childrenToRender.length > 1) {
        console.warn("You're attempting to animate multiple children within AnimatePresence, but its exitBeforeEnter prop is set to true. This will lead to odd visual behaviour.");
    }
    return (external_react_.createElement(external_react_.Fragment, null, exiting.size
        ? childrenToRender
        : childrenToRender.map(function (child) { return (0,external_react_.cloneElement)(child); })));
};




/***/ }),

/***/ 5947:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hO": function() { return /* binding */ useIsPresent; },
/* harmony export */   "oO": function() { return /* binding */ usePresence; }
/* harmony export */ });
/* unused harmony export isPresent */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(240);
/* harmony import */ var _utils_use_id_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6316);




/**
 * When a component is the child of `AnimatePresence`, it can use `usePresence`
 * to access information about whether it's still present in the React tree.
 *
 * ```jsx
 * import { usePresence } from "framer-motion"
 *
 * export const Component = () => {
 *   const [isPresent, safeToRemove] = usePresence()
 *
 *   useEffect(() => {
 *     !isPresent && setTimeout(safeToRemove, 1000)
 *   }, [isPresent])
 *
 *   return <div />
 * }
 * ```
 *
 * If `isPresent` is `false`, it means that a component has been removed the tree, but
 * `AnimatePresence` won't really remove it until `safeToRemove` has been called.
 *
 * @public
 */
function usePresence() {
    var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_1__/* .PresenceContext */ .O);
    if (context === null)
        return [true, null];
    var isPresent = context.isPresent, onExitComplete = context.onExitComplete, register = context.register;
    // It's safe to call the following hooks conditionally (after an early return) because the context will always
    // either be null or non-null for the lifespan of the component.
    // Replace with useId when released in React
    var id = (0,_utils_use_id_mjs__WEBPACK_IMPORTED_MODULE_2__/* .useId */ .M)();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () { return register(id); }, []);
    var safeToRemove = function () { return onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete(id); };
    return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 *
 * ```jsx
 * import { useIsPresent } from "framer-motion"
 *
 * export const Component = () => {
 *   const isPresent = useIsPresent()
 *
 *   useEffect(() => {
 *     !isPresent && console.log("I've been removed!")
 *   }, [isPresent])
 *
 *   return <div />
 * }
 * ```
 *
 * @public
 */
function useIsPresent() {
    return isPresent((0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_1__/* .PresenceContext */ .O));
}
function isPresent(context) {
    return context === null ? true : context.isPresent;
}




/***/ }),

/***/ 5364:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": function() { return /* binding */ LayoutGroupContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


var LayoutGroupContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});




/***/ }),

/***/ 398:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ LazyContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


var LazyContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({ strict: false });




/***/ }),

/***/ 6014:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": function() { return /* binding */ MotionConfigContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


/**
 * @public
 */
var MotionConfigContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
    transformPagePoint: function (p) { return p; },
    isStatic: false,
    reducedMotion: "never",
});




/***/ }),

/***/ 4451:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "B": function() { return /* binding */ useVisualElementContext; },
/* harmony export */   "v": function() { return /* binding */ MotionContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


var MotionContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});
function useVisualElementContext() {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(MotionContext).visualElement;
}




/***/ }),

/***/ 240:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": function() { return /* binding */ PresenceContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


/**
 * @public
 */
var PresenceContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);




/***/ }),

/***/ 1705:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "g": function() { return /* binding */ SwitchLayoutGroupContext; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


/**
 * Internal, exported only for usage in Framer
 */
var SwitchLayoutGroupContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});




/***/ }),

/***/ 8148:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q": function() { return /* binding */ extractEventInfo; },
/* harmony export */   "q": function() { return /* binding */ wrapHandler; }
/* harmony export */ });
/* harmony import */ var _gestures_utils_event_type_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(900);


/**
 * Filters out events not attached to the primary pointer (currently left mouse button)
 * @param eventHandler
 */
function filterPrimaryPointer(eventHandler) {
    return function (event) {
        var isMouseEvent = event instanceof MouseEvent;
        var isPrimaryPointer = !isMouseEvent ||
            (isMouseEvent && event.button === 0);
        if (isPrimaryPointer) {
            eventHandler(event);
        }
    };
}
var defaultPagePoint = { pageX: 0, pageY: 0 };
function pointFromTouch(e, pointType) {
    if (pointType === void 0) { pointType = "page"; }
    var primaryTouch = e.touches[0] || e.changedTouches[0];
    var point = primaryTouch || defaultPagePoint;
    return {
        x: point[pointType + "X"],
        y: point[pointType + "Y"],
    };
}
function pointFromMouse(point, pointType) {
    if (pointType === void 0) { pointType = "page"; }
    return {
        x: point[pointType + "X"],
        y: point[pointType + "Y"],
    };
}
function extractEventInfo(event, pointType) {
    if (pointType === void 0) { pointType = "page"; }
    return {
        point: (0,_gestures_utils_event_type_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isTouchEvent */ .z)(event)
            ? pointFromTouch(event, pointType)
            : pointFromMouse(event, pointType),
    };
}
var wrapHandler = function (handler, shouldFilterPrimaryPointer) {
    if (shouldFilterPrimaryPointer === void 0) { shouldFilterPrimaryPointer = false; }
    var listener = function (event) {
        return handler(event, extractEventInfo(event));
    };
    return shouldFilterPrimaryPointer
        ? filterPrimaryPointer(listener)
        : listener;
};




/***/ }),

/***/ 1756:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": function() { return /* binding */ addDomEvent; },
/* harmony export */   "p": function() { return /* binding */ useDomEvent; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


function addDomEvent(target, eventName, handler, options) {
    if (options === void 0) { options = { passive: true }; }
    target.addEventListener(eventName, handler, options);
    return function () { return target.removeEventListener(eventName, handler); };
}
/**
 * Attaches an event listener directly to the provided DOM element.
 *
 * Bypassing React's event system can be desirable, for instance when attaching non-passive
 * event handlers.
 *
 * ```jsx
 * const ref = useRef(null)
 *
 * useDomEvent(ref, 'wheel', onWheel, { passive: false })
 *
 * return <div ref={ref} />
 * ```
 *
 * @param ref - React.RefObject that's been provided to the element you want to bind the listener to.
 * @param eventName - Name of the event you want listen for.
 * @param handler - Function to fire when receiving the event.
 * @param options - Options to pass to `Event.addEventListener`.
 *
 * @public
 */
function useDomEvent(ref, eventName, handler, options) {
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var element = ref.current;
        if (handler && element) {
            return addDomEvent(element, eventName, handler, options);
        }
    }, [ref, eventName, handler, options]);
}




/***/ }),

/***/ 737:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "a": function() { return /* binding */ addPointerEvent; },
  "m": function() { return /* binding */ usePointerEvent; }
});

// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-dom-event.mjs
var use_dom_event = __webpack_require__(1756);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/event-info.mjs
var event_info = __webpack_require__(8148);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/is-browser.mjs
var is_browser = __webpack_require__(1741);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/events/utils.mjs


// We check for event support via functions in case they've been mocked by a testing suite.
var supportsPointerEvents = function () {
    return is_browser/* isBrowser */.j && window.onpointerdown === null;
};
var supportsTouchEvents = function () {
    return is_browser/* isBrowser */.j && window.ontouchstart === null;
};
var supportsMouseEvents = function () {
    return is_browser/* isBrowser */.j && window.onmousedown === null;
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/events/use-pointer-event.mjs




var mouseEventNames = {
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointercancel: "mousecancel",
    pointerover: "mouseover",
    pointerout: "mouseout",
    pointerenter: "mouseenter",
    pointerleave: "mouseleave",
};
var touchEventNames = {
    pointerdown: "touchstart",
    pointermove: "touchmove",
    pointerup: "touchend",
    pointercancel: "touchcancel",
};
function getPointerEventName(name) {
    if (supportsPointerEvents()) {
        return name;
    }
    else if (supportsTouchEvents()) {
        return touchEventNames[name];
    }
    else if (supportsMouseEvents()) {
        return mouseEventNames[name];
    }
    return name;
}
function addPointerEvent(target, eventName, handler, options) {
    return (0,use_dom_event/* addDomEvent */.E)(target, getPointerEventName(eventName), (0,event_info/* wrapHandler */.q)(handler, eventName === "pointerdown"), options);
}
function usePointerEvent(ref, eventName, handler, options) {
    return (0,use_dom_event/* useDomEvent */.p)(ref, getPointerEventName(eventName), handler && (0,event_info/* wrapHandler */.q)(handler, eventName === "pointerdown"), options);
}




/***/ }),

/***/ 7544:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fJ": function() { return /* binding */ getGlobalLock; },
/* harmony export */   "gD": function() { return /* binding */ isDragActive; }
/* harmony export */ });
/* unused harmony export createLock */
function createLock(name) {
    var lock = null;
    return function () {
        var openLock = function () {
            lock = null;
        };
        if (lock === null) {
            lock = name;
            return openLock;
        }
        return false;
    };
}
var globalHorizontalLock = createLock("dragHorizontal");
var globalVerticalLock = createLock("dragVertical");
function getGlobalLock(drag) {
    var lock = false;
    if (drag === "y") {
        lock = globalVerticalLock();
    }
    else if (drag === "x") {
        lock = globalHorizontalLock();
    }
    else {
        var openHorizontal_1 = globalHorizontalLock();
        var openVertical_1 = globalVerticalLock();
        if (openHorizontal_1 && openVertical_1) {
            lock = function () {
                openHorizontal_1();
                openVertical_1();
            };
        }
        else {
            // Release the locks because we don't use them
            if (openHorizontal_1)
                openHorizontal_1();
            if (openVertical_1)
                openVertical_1();
        }
    }
    return lock;
}
function isDragActive() {
    // Check the gesture lock - if we get it, it means no drag gesture is active
    // and we can safely fire the tap gesture.
    var openGestureLock = getGlobalLock(true);
    if (!openGestureLock)
        return true;
    openGestureLock();
    return false;
}




/***/ }),

/***/ 900:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": function() { return /* binding */ isMouseEvent; },
/* harmony export */   "z": function() { return /* binding */ isTouchEvent; }
/* harmony export */ });
function isMouseEvent(event) {
    // PointerEvent inherits from MouseEvent so we can't use a straight instanceof check.
    if (typeof PointerEvent !== "undefined" && event instanceof PointerEvent) {
        return !!(event.pointerType === "mouse");
    }
    return event instanceof MouseEvent;
}
function isTouchEvent(event) {
    var hasTouches = !!event.touches;
    return hasTouches;
}




/***/ }),

/***/ 7357:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "AnimatePresence": function() { return /* reexport */ AnimatePresence/* AnimatePresence */.M; },
  "AnimateSharedLayout": function() { return /* reexport */ AnimateSharedLayout; },
  "AnimationType": function() { return /* reexport */ types/* AnimationType */.r; },
  "DeprecatedLayoutGroupContext": function() { return /* reexport */ DeprecatedLayoutGroupContext; },
  "DragControls": function() { return /* reexport */ DragControls; },
  "FlatTree": function() { return /* reexport */ flat_tree/* FlatTree */.E; },
  "LayoutGroup": function() { return /* reexport */ LayoutGroup; },
  "LayoutGroupContext": function() { return /* reexport */ LayoutGroupContext/* LayoutGroupContext */.p; },
  "LazyMotion": function() { return /* reexport */ LazyMotion; },
  "MotionConfig": function() { return /* reexport */ MotionConfig; },
  "MotionConfigContext": function() { return /* reexport */ MotionConfigContext/* MotionConfigContext */._; },
  "MotionContext": function() { return /* reexport */ MotionContext/* MotionContext */.v; },
  "MotionValue": function() { return /* reexport */ es_value/* MotionValue */.H; },
  "PresenceContext": function() { return /* reexport */ PresenceContext/* PresenceContext */.O; },
  "Reorder": function() { return /* reexport */ Reorder; },
  "SwitchLayoutGroupContext": function() { return /* reexport */ SwitchLayoutGroupContext/* SwitchLayoutGroupContext */.g; },
  "addPointerEvent": function() { return /* reexport */ use_pointer_event/* addPointerEvent */.a; },
  "addScaleCorrector": function() { return /* reexport */ scale_correction/* addScaleCorrector */.B; },
  "animate": function() { return /* reexport */ animate/* animate */.j; },
  "animateVisualElement": function() { return /* reexport */ animation/* animateVisualElement */.d5; },
  "animationControls": function() { return /* reexport */ animationControls; },
  "animations": function() { return /* reexport */ animations/* animations */.s; },
  "calcLength": function() { return /* reexport */ delta_calc/* calcLength */.JO; },
  "checkTargetForNewValues": function() { return /* reexport */ setters/* checkTargetForNewValues */.GJ; },
  "createBox": function() { return /* reexport */ models/* createBox */.dO; },
  "createDomMotionComponent": function() { return /* reexport */ motion/* createDomMotionComponent */.F; },
  "createMotionComponent": function() { return /* reexport */ es_motion/* createMotionComponent */.F; },
  "domAnimation": function() { return /* reexport */ domAnimation; },
  "domMax": function() { return /* reexport */ domMax; },
  "filterProps": function() { return /* reexport */ filter_props/* filterProps */.L; },
  "isBrowser": function() { return /* reexport */ is_browser/* isBrowser */.j; },
  "isDragActive": function() { return /* reexport */ lock/* isDragActive */.gD; },
  "isMotionValue": function() { return /* reexport */ is_motion_value/* isMotionValue */.i; },
  "isValidMotionProp": function() { return /* reexport */ valid_prop/* isValidMotionProp */.Z; },
  "m": function() { return /* reexport */ m; },
  "makeUseVisualState": function() { return /* reexport */ use_visual_state/* makeUseVisualState */.t; },
  "motion": function() { return /* reexport */ motion/* motion */.E; },
  "motionValue": function() { return /* reexport */ es_value/* motionValue */.B; },
  "resolveMotionValue": function() { return /* reexport */ resolve_motion_value/* resolveMotionValue */.b; },
  "transform": function() { return /* reexport */ transform; },
  "useAnimation": function() { return /* reexport */ useAnimation; },
  "useAnimationControls": function() { return /* reexport */ useAnimationControls; },
  "useAnimationFrame": function() { return /* reexport */ useAnimationFrame; },
  "useCycle": function() { return /* reexport */ useCycle; },
  "useDeprecatedAnimatedState": function() { return /* reexport */ useAnimatedState; },
  "useDeprecatedInvertedScale": function() { return /* reexport */ useInvertedScale; },
  "useDomEvent": function() { return /* reexport */ use_dom_event/* useDomEvent */.p; },
  "useDragControls": function() { return /* reexport */ useDragControls; },
  "useElementScroll": function() { return /* reexport */ useElementScroll; },
  "useForceUpdate": function() { return /* reexport */ use_force_update/* useForceUpdate */.N; },
  "useInView": function() { return /* reexport */ useInView; },
  "useInstantLayoutTransition": function() { return /* reexport */ useInstantLayoutTransition; },
  "useInstantTransition": function() { return /* reexport */ useInstantTransition; },
  "useIsPresent": function() { return /* reexport */ use_presence/* useIsPresent */.hO; },
  "useIsomorphicLayoutEffect": function() { return /* reexport */ use_isomorphic_effect/* useIsomorphicLayoutEffect */.L; },
  "useMotionTemplate": function() { return /* reexport */ useMotionTemplate; },
  "useMotionValue": function() { return /* reexport */ useMotionValue; },
  "usePresence": function() { return /* reexport */ use_presence/* usePresence */.oO; },
  "useReducedMotion": function() { return /* reexport */ use_reduced_motion/* useReducedMotion */.J; },
  "useReducedMotionConfig": function() { return /* reexport */ use_reduced_motion/* useReducedMotionConfig */.h; },
  "useResetProjection": function() { return /* reexport */ useResetProjection; },
  "useScroll": function() { return /* reexport */ useScroll; },
  "useSpring": function() { return /* reexport */ useSpring; },
  "useTime": function() { return /* reexport */ useTime; },
  "useTransform": function() { return /* reexport */ useTransform; },
  "useUnmountEffect": function() { return /* reexport */ use_unmount_effect/* useUnmountEffect */.z; },
  "useVelocity": function() { return /* reexport */ useVelocity; },
  "useViewportScroll": function() { return /* reexport */ useViewportScroll; },
  "useVisualElementContext": function() { return /* reexport */ MotionContext/* useVisualElementContext */.B; },
  "visualElement": function() { return /* reexport */ render/* visualElement */.q; },
  "wrapHandler": function() { return /* reexport */ event_info/* wrapHandler */.q; }
});

// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/motion.mjs
var motion = __webpack_require__(7312);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/motion-proxy.mjs
var motion_proxy = __webpack_require__(9169);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/create-config.mjs + 7 modules
var create_config = __webpack_require__(8550);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/motion-minimal.mjs



/**
 * @public
 */
var m = (0,motion_proxy/* createMotionProxy */.D)(create_config/* createDomMotionConfig */.w);



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs + 1 modules
var AnimatePresence = __webpack_require__(5421);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-constant.mjs
var use_constant = __webpack_require__(6681);
// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var LayoutGroupContext = __webpack_require__(5364);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/context/DeprecatedLayoutGroupContext.mjs


/**
 * @deprecated
 */
var DeprecatedLayoutGroupContext = (0,external_react_.createContext)(null);



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-force-update.mjs
var use_force_update = __webpack_require__(6337);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/node/group.mjs
var notify = function (node) {
    return !node.isLayoutDirty && node.willUpdate(false);
};
function nodeGroup() {
    var nodes = new Set();
    var subscriptions = new WeakMap();
    var dirtyAll = function () { return nodes.forEach(notify); };
    return {
        add: function (node) {
            nodes.add(node);
            subscriptions.set(node, node.addEventListener("willUpdate", dirtyAll));
        },
        remove: function (node) {
            var _a;
            nodes.delete(node);
            (_a = subscriptions.get(node)) === null || _a === void 0 ? void 0 : _a();
            subscriptions.delete(node);
            dirtyAll();
        },
        dirty: dirtyAll,
    };
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/LayoutGroup/index.mjs








var shouldInheritGroup = function (inherit) { return inherit === true; };
var shouldInheritId = function (inherit) {
    return shouldInheritGroup(inherit === true) || inherit === "id";
};
var LayoutGroup = function (_a) {
    var _b, _c;
    var children = _a.children, id = _a.id, inheritId = _a.inheritId, _d = _a.inherit, inherit = _d === void 0 ? true : _d;
    // Maintain backwards-compatibility with inheritId until 7.0
    if (inheritId !== undefined)
        inherit = inheritId;
    var layoutGroupContext = (0,external_react_.useContext)(LayoutGroupContext/* LayoutGroupContext */.p);
    var deprecatedLayoutGroupContext = (0,external_react_.useContext)(DeprecatedLayoutGroupContext);
    var _e = (0,tslib_es6.__read)((0,use_force_update/* useForceUpdate */.N)(), 2), forceRender = _e[0], key = _e[1];
    var context = (0,external_react_.useRef)(null);
    var upstreamId = (_b = layoutGroupContext.id) !== null && _b !== void 0 ? _b : deprecatedLayoutGroupContext;
    if (context.current === null) {
        if (shouldInheritId(inherit) && upstreamId) {
            id = id ? upstreamId + "-" + id : upstreamId;
        }
        context.current = {
            id: id,
            group: shouldInheritGroup(inherit)
                ? (_c = layoutGroupContext === null || layoutGroupContext === void 0 ? void 0 : layoutGroupContext.group) !== null && _c !== void 0 ? _c : nodeGroup()
                : nodeGroup(),
        };
    }
    var memoizedContext = (0,external_react_.useMemo)(function () { return ((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, context.current), { forceRender: forceRender })); }, [key]);
    return (external_react_.createElement(LayoutGroupContext/* LayoutGroupContext.Provider */.p.Provider, { value: memoizedContext }, children));
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/AnimateSharedLayout.mjs





var id = 0;
var AnimateSharedLayout = function (_a) {
    var children = _a.children;
    external_react_.useEffect(function () {
        (0,dist.warning)(false, "AnimateSharedLayout is deprecated: https://www.framer.com/docs/guide-upgrade/##shared-layout-animations");
    }, []);
    return (external_react_.createElement(LayoutGroup, { id: (0,use_constant/* useConstant */.h)(function () { return "asl-".concat(id++); }) }, children));
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var MotionConfigContext = __webpack_require__(6014);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
var filter_props = __webpack_require__(8041);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs







/**
 * `MotionConfig` is used to set configuration options for all children `motion` components.
 *
 * ```jsx
 * import { motion, MotionConfig } from "framer-motion"
 *
 * export function App() {
 *   return (
 *     <MotionConfig transition={{ type: "spring" }}>
 *       <motion.div animate={{ x: 100 }} />
 *     </MotionConfig>
 *   )
 * }
 * ```
 *
 * @public
 */
function MotionConfig(_a) {
    var children = _a.children, isValidProp = _a.isValidProp, config = (0,tslib_es6.__rest)(_a, ["children", "isValidProp"]);
    isValidProp && (0,filter_props/* loadExternalIsValidProp */.K)(isValidProp);
    /**
     * Inherit props from any parent MotionConfig components
     */
    config = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, (0,external_react_.useContext)(MotionConfigContext/* MotionConfigContext */._)), config);
    /**
     * Don't allow isStatic to change between renders as it affects how many hooks
     * motion components fire.
     */
    config.isStatic = (0,use_constant/* useConstant */.h)(function () { return config.isStatic; });
    /**
     * Creating a new config context object will re-render every `motion` component
     * every time it renders. So we only want to create a new one sparingly.
     */
    var context = (0,external_react_.useMemo)(function () { return config; }, [JSON.stringify(config.transition), config.transformPagePoint, config.reducedMotion]);
    return (external_react_.createElement(MotionConfigContext/* MotionConfigContext.Provider */._.Provider, { value: context }, children));
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/LazyContext.mjs
var LazyContext = __webpack_require__(398);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/features/definitions.mjs
var definitions = __webpack_require__(9442);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/LazyMotion/index.mjs






/**
 * Used in conjunction with the `m` component to reduce bundle size.
 *
 * `m` is a version of the `motion` component that only loads functionality
 * critical for the initial render.
 *
 * `LazyMotion` can then be used to either synchronously or asynchronously
 * load animation and gesture support.
 *
 * ```jsx
 * // Synchronous loading
 * import { LazyMotion, m, domAnimations } from "framer-motion"
 *
 * function App() {
 *   return (
 *     <LazyMotion features={domAnimations}>
 *       <m.div animate={{ scale: 2 }} />
 *     </LazyMotion>
 *   )
 * }
 *
 * // Asynchronous loading
 * import { LazyMotion, m } from "framer-motion"
 *
 * function App() {
 *   return (
 *     <LazyMotion features={() => import('./path/to/domAnimations')}>
 *       <m.div animate={{ scale: 2 }} />
 *     </LazyMotion>
 *   )
 * }
 * ```
 *
 * @public
 */
function LazyMotion(_a) {
    var children = _a.children, features = _a.features, _b = _a.strict, strict = _b === void 0 ? false : _b;
    var _c = (0,tslib_es6.__read)((0,external_react_.useState)(!isLazyBundle(features)), 2), setIsLoaded = _c[1];
    var loadedRenderer = (0,external_react_.useRef)(undefined);
    /**
     * If this is a synchronous load, load features immediately
     */
    if (!isLazyBundle(features)) {
        var renderer = features.renderer, loadedFeatures = (0,tslib_es6.__rest)(features, ["renderer"]);
        loadedRenderer.current = renderer;
        (0,definitions/* loadFeatures */.K)(loadedFeatures);
    }
    (0,external_react_.useEffect)(function () {
        if (isLazyBundle(features)) {
            features().then(function (_a) {
                var renderer = _a.renderer, loadedFeatures = (0,tslib_es6.__rest)(_a, ["renderer"]);
                (0,definitions/* loadFeatures */.K)(loadedFeatures);
                loadedRenderer.current = renderer;
                setIsLoaded(true);
            });
        }
    }, []);
    return (external_react_.createElement(LazyContext/* LazyContext.Provider */.u.Provider, { value: { renderer: loadedRenderer.current, strict: strict } }, children));
}
function isLazyBundle(features) {
    return typeof features === "function";
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/context/ReorderContext.mjs


var ReorderContext = (0,external_react_.createContext)(null);



// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/mix.mjs
var mix = __webpack_require__(2453);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/array.mjs
var array = __webpack_require__(10);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/Reorder/utils/check-reorder.mjs



function checkReorder(order, value, offset, velocity) {
    if (!velocity)
        return order;
    var index = order.findIndex(function (item) { return item.value === value; });
    if (index === -1)
        return order;
    var nextOffset = velocity > 0 ? 1 : -1;
    var nextItem = order[index + nextOffset];
    if (!nextItem)
        return order;
    var item = order[index];
    var nextLayout = nextItem.layout;
    var nextItemCenter = (0,mix/* mix */.C)(nextLayout.min, nextLayout.max, 0.5);
    if ((nextOffset === 1 && item.layout.max + offset > nextItemCenter) ||
        (nextOffset === -1 && item.layout.min + offset < nextItemCenter)) {
        return (0,array/* moveItem */.uo)(order, index, index + nextOffset);
    }
    return order;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/Reorder/Group.mjs









function ReorderGroup(_a, externalRef) {
    var children = _a.children, _b = _a.as, as = _b === void 0 ? "ul" : _b, _c = _a.axis, axis = _c === void 0 ? "y" : _c, onReorder = _a.onReorder, values = _a.values, props = (0,tslib_es6.__rest)(_a, ["children", "as", "axis", "onReorder", "values"]);
    var Component = (0,use_constant/* useConstant */.h)(function () { return (0,motion/* motion */.E)(as); });
    var order = [];
    var isReordering = (0,external_react_.useRef)(false);
    (0,dist.invariant)(Boolean(values), "Reorder.Group must be provided a values prop");
    var context = {
        axis: axis,
        registerItem: function (value, layout) {
            /**
             * Ensure entries can't add themselves more than once
             */
            if (layout &&
                order.findIndex(function (entry) { return value === entry.value; }) === -1) {
                order.push({ value: value, layout: layout[axis] });
                order.sort(compareMin);
            }
        },
        updateOrder: function (id, offset, velocity) {
            if (isReordering.current)
                return;
            var newOrder = checkReorder(order, id, offset, velocity);
            if (order !== newOrder) {
                isReordering.current = true;
                onReorder(newOrder
                    .map(getValue)
                    .filter(function (value) { return values.indexOf(value) !== -1; }));
            }
        },
    };
    (0,external_react_.useEffect)(function () {
        isReordering.current = false;
    });
    return (external_react_.createElement(Component, (0,tslib_es6.__assign)({}, props, { ref: externalRef }),
        external_react_.createElement(ReorderContext.Provider, { value: context }, children)));
}
var Group = (0,external_react_.forwardRef)(ReorderGroup);
function getValue(item) {
    return item.value;
}
function compareMin(a, b) {
    return a.layout.min - b.layout.min;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/index.mjs
var es_value = __webpack_require__(3234);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-motion-value.mjs






/**
 * Creates a `MotionValue` to track the state and velocity of a value.
 *
 * Usually, these are created automatically. For advanced use-cases, like use with `useTransform`, you can create `MotionValue`s externally and pass them into the animated component via the `style` prop.
 *
 * ```jsx
 * export const MyComponent = () => {
 *   const scale = useMotionValue(1)
 *
 *   return <motion.div style={{ scale }} />
 * }
 * ```
 *
 * @param initial - The initial state.
 *
 * @public
 */
function useMotionValue(initial) {
    var value = (0,use_constant/* useConstant */.h)(function () { return (0,es_value/* motionValue */.B)(initial); });
    /**
     * If this motion value is being used in static mode, like on
     * the Framer canvas, force components to rerender when the motion
     * value is updated.
     */
    var isStatic = (0,external_react_.useContext)(MotionConfigContext/* MotionConfigContext */._).isStatic;
    if (isStatic) {
        var _a = (0,tslib_es6.__read)((0,external_react_.useState)(initial), 2), setLatest_1 = _a[1];
        (0,external_react_.useEffect)(function () { return value.onChange(setLatest_1); }, []);
    }
    return value;
}



// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/interpolate.mjs + 3 modules
var interpolate = __webpack_require__(9180);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/transform.mjs



var isCustomValueType = function (v) {
    return typeof v === "object" && v.mix;
};
var getMixer = function (v) { return (isCustomValueType(v) ? v.mix : undefined); };
function transform() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var useImmediate = !Array.isArray(args[0]);
    var argOffset = useImmediate ? 0 : -1;
    var inputValue = args[0 + argOffset];
    var inputRange = args[1 + argOffset];
    var outputRange = args[2 + argOffset];
    var options = args[3 + argOffset];
    var interpolator = (0,interpolate/* interpolate */.s)(inputRange, outputRange, (0,tslib_es6.__assign)({ mixer: getMixer(outputRange[0]) }, options));
    return useImmediate ? interpolator(inputValue) : interpolator;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/utils/is-motion-value.mjs
var is_motion_value = __webpack_require__(406);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var use_isomorphic_effect = __webpack_require__(8868);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-on-change.mjs



function useOnChange(value, callback) {
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        if ((0,is_motion_value/* isMotionValue */.i)(value))
            return value.onChange(callback);
    }, [callback]);
}
function useMultiOnChange(values, handler) {
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        var subscriptions = values.map(function (value) { return value.onChange(handler); });
        return function () { return subscriptions.forEach(function (unsubscribe) { return unsubscribe(); }); };
    });
}



// EXTERNAL MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(9073);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-combine-values.mjs




function useCombineMotionValues(values, combineValues) {
    /**
     * Initialise the returned motion value. This remains the same between renders.
     */
    var value = useMotionValue(combineValues());
    /**
     * Create a function that will update the template motion value with the latest values.
     * This is pre-bound so whenever a motion value updates it can schedule its
     * execution in Framesync. If it's already been scheduled it won't be fired twice
     * in a single frame.
     */
    var updateValue = function () { return value.set(combineValues()); };
    /**
     * Synchronously update the motion value with the latest values during the render.
     * This ensures that within a React render, the styles applied to the DOM are up-to-date.
     */
    updateValue();
    /**
     * Subscribe to all motion values found within the template. Whenever any of them change,
     * schedule an update.
     */
    useMultiOnChange(values, function () { return es/* default.update */.ZP.update(updateValue, false, true); });
    return value;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-transform.mjs





function useTransform(input, inputRangeOrTransformer, outputRange, options) {
    var transformer = typeof inputRangeOrTransformer === "function"
        ? inputRangeOrTransformer
        : transform(inputRangeOrTransformer, outputRange, options);
    return Array.isArray(input)
        ? useListTransform(input, transformer)
        : useListTransform([input], function (_a) {
            var _b = (0,tslib_es6.__read)(_a, 1), latest = _b[0];
            return transformer(latest);
        });
}
function useListTransform(values, transformer) {
    var latest = (0,use_constant/* useConstant */.h)(function () { return []; });
    return useCombineMotionValues(values, function () {
        latest.length = 0;
        var numValues = values.length;
        for (var i = 0; i < numValues; i++) {
            latest[i] = values[i].get();
        }
        return transformer(latest);
    });
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/Reorder/Item.mjs











function useDefaultMotionValue(value, defaultValue) {
    if (defaultValue === void 0) { defaultValue = 0; }
    return (0,is_motion_value/* isMotionValue */.i)(value) ? value : useMotionValue(defaultValue);
}
function ReorderItem(_a, externalRef) {
    var children = _a.children, style = _a.style, value = _a.value, _b = _a.as, as = _b === void 0 ? "li" : _b, onDrag = _a.onDrag, _c = _a.layout, layout = _c === void 0 ? true : _c, props = (0,tslib_es6.__rest)(_a, ["children", "style", "value", "as", "onDrag", "layout"]);
    var Component = (0,use_constant/* useConstant */.h)(function () { return (0,motion/* motion */.E)(as); });
    var context = (0,external_react_.useContext)(ReorderContext);
    var point = {
        x: useDefaultMotionValue(style === null || style === void 0 ? void 0 : style.x),
        y: useDefaultMotionValue(style === null || style === void 0 ? void 0 : style.y),
    };
    var zIndex = useTransform([point.x, point.y], function (_a) {
        var _b = (0,tslib_es6.__read)(_a, 2), latestX = _b[0], latestY = _b[1];
        return latestX || latestY ? 1 : "unset";
    });
    var measuredLayout = (0,external_react_.useRef)(null);
    (0,dist.invariant)(Boolean(context), "Reorder.Item must be a child of Reorder.Group");
    var _d = context, axis = _d.axis, registerItem = _d.registerItem, updateOrder = _d.updateOrder;
    (0,external_react_.useEffect)(function () {
        registerItem(value, measuredLayout.current);
    }, [context]);
    return (external_react_.createElement(Component, (0,tslib_es6.__assign)({ drag: axis }, props, { dragSnapToOrigin: true, style: (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, style), { x: point.x, y: point.y, zIndex: zIndex }), layout: layout, onDrag: function (event, gesturePoint) {
            var velocity = gesturePoint.velocity;
            velocity[axis] &&
                updateOrder(value, point[axis].get(), velocity[axis]);
            onDrag === null || onDrag === void 0 ? void 0 : onDrag(event, gesturePoint);
        }, onLayoutMeasure: function (measured) {
            measuredLayout.current = measured;
        }, ref: externalRef }), children));
}
var Item = (0,external_react_.forwardRef)(ReorderItem);



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/components/Reorder/index.mjs



var Reorder = {
    Group: Group,
    Item: Item,
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/features/animations.mjs
var animations = __webpack_require__(1903);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/features/gestures.mjs + 6 modules
var gestures = __webpack_require__(6872);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs + 4 modules
var create_visual_element = __webpack_require__(1891);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/features-animation.mjs





/**
 * @public
 */
var domAnimation = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({ renderer: create_visual_element/* createDomVisualElement */.b }, animations/* animations */.s), gestures/* gestureAnimations */.E);



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/features/drag.mjs + 5 modules
var drag = __webpack_require__(3006);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/features/layout/index.mjs + 3 modules
var layout = __webpack_require__(1283);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs + 8 modules
var HTMLProjectionNode = __webpack_require__(7046);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/features-max.mjs






/**
 * @public
 */
var domMax = (0,tslib_es6.__assign)((0,tslib_es6.__assign)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, domAnimation), drag/* drag */.o), layout/* layoutFeatures */.U), { projectionNodeConstructor: HTMLProjectionNode/* HTMLProjectionNode */.u });



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-motion-template.mjs


/**
 * Combine multiple motion values into a new one using a string template literal.
 *
 * ```jsx
 * import {
 *   motion,
 *   useSpring,
 *   useMotionValue,
 *   useMotionTemplate
 * } from "framer-motion"
 *
 * function Component() {
 *   const shadowX = useSpring(0)
 *   const shadowY = useMotionValue(0)
 *   const shadow = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3))`
 *
 *   return <motion.div style={{ filter: shadow }} />
 * }
 * ```
 *
 * @public
 */
function useMotionTemplate(fragments) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    /**
     * Create a function that will build a string from the latest motion values.
     */
    var numFragments = fragments.length;
    function buildValue() {
        var output = "";
        for (var i = 0; i < numFragments; i++) {
            output += fragments[i];
            var value = values[i];
            if (value)
                output += values[i].get();
        }
        return output;
    }
    return useCombineMotionValues(values, buildValue);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/utils/resolve-motion-value.mjs
var resolve_motion_value = __webpack_require__(6399);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/animations/index.mjs + 6 modules
var es_animations = __webpack_require__(612);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-spring.mjs








/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @remarks
 *
 * ```jsx
 * const x = useSpring(0, { stiffness: 300 })
 * const y = useSpring(x, { damping: 10 })
 * ```
 *
 * @param inputValue - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param springConfig - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
function useSpring(source, config) {
    if (config === void 0) { config = {}; }
    var isStatic = (0,external_react_.useContext)(MotionConfigContext/* MotionConfigContext */._).isStatic;
    var activeSpringAnimation = (0,external_react_.useRef)(null);
    var value = useMotionValue((0,is_motion_value/* isMotionValue */.i)(source) ? source.get() : source);
    (0,external_react_.useMemo)(function () {
        return value.attach(function (v, set) {
            /**
             * A more hollistic approach to this might be to use isStatic to fix VisualElement animations
             * at that level, but this will work for now
             */
            if (isStatic)
                return set(v);
            if (activeSpringAnimation.current) {
                activeSpringAnimation.current.stop();
            }
            activeSpringAnimation.current = (0,es_animations/* animate */.j)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({ from: value.get(), to: v, velocity: value.getVelocity() }, config), { onUpdate: set }));
            return value.get();
        });
    }, [JSON.stringify(config)]);
    useOnChange(source, function (v) { return value.set(parseFloat(v)); });
    return value;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-velocity.mjs



/**
 * Creates a `MotionValue` that updates when the velocity of the provided `MotionValue` changes.
 *
 * ```javascript
 * const x = useMotionValue(0)
 * const xVelocity = useVelocity(x)
 * const xAcceleration = useVelocity(xVelocity)
 * ```
 *
 * @public
 */
function useVelocity(value) {
    var velocity = useMotionValue(value.getVelocity());
    (0,external_react_.useEffect)(function () {
        return value.velocityUpdateSubscribers.add(function (newVelocity) {
            velocity.set(newVelocity);
        });
    }, [value]);
    return velocity;
}



// EXTERNAL MODULE: ./node_modules/@motionone/dom/dist/index.cjs.js
var index_cjs = __webpack_require__(6724);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-scroll.mjs






var createScrollMotionValues = function () { return ({
    scrollX: (0,es_value/* motionValue */.B)(0),
    scrollY: (0,es_value/* motionValue */.B)(0),
    scrollXProgress: (0,es_value/* motionValue */.B)(0),
    scrollYProgress: (0,es_value/* motionValue */.B)(0),
}); };
function useScroll(_a) {
    if (_a === void 0) { _a = {}; }
    var container = _a.container, target = _a.target, options = (0,tslib_es6.__rest)(_a, ["container", "target"]);
    var values = (0,use_constant/* useConstant */.h)(createScrollMotionValues);
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        return (0,index_cjs/* scroll */.AR)(function (_a) {
            var x = _a.x, y = _a.y;
            values.scrollX.set(x.current);
            values.scrollXProgress.set(x.progress);
            values.scrollY.set(y.current);
            values.scrollYProgress.set(y.progress);
        }, (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, options), { container: (container === null || container === void 0 ? void 0 : container.current) || undefined, target: (target === null || target === void 0 ? void 0 : target.current) || undefined }));
    }, []);
    return values;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/warn-once.mjs
var warn_once = __webpack_require__(6034);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/scroll/use-element-scroll.mjs



function useElementScroll(ref) {
    (0,warn_once/* warnOnce */.O)(false, "useElementScroll is deprecated. Convert to useScroll({ container: ref }).");
    return useScroll({ container: ref });
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/scroll/use-viewport-scroll.mjs



function useViewportScroll() {
    (0,warn_once/* warnOnce */.O)(false, "useViewportScroll is deprecated. Convert to useScroll().");
    return useScroll();
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/use-animation-frame.mjs





var getCurrentTime = typeof performance !== "undefined"
    ? function () { return performance.now(); }
    : function () { return Date.now(); };
function useAnimationFrame(callback) {
    var initialTimestamp = (0,use_constant/* useConstant */.h)(getCurrentTime);
    var isStatic = (0,external_react_.useContext)(MotionConfigContext/* MotionConfigContext */._).isStatic;
    (0,external_react_.useEffect)(function () {
        if (isStatic)
            return;
        var provideTimeSinceStart = function (_a) {
            var timestamp = _a.timestamp;
            callback(timestamp - initialTimestamp);
        };
        es/* default.update */.ZP.update(provideTimeSinceStart, true);
        return function () { return es/* cancelSync.update */.qY.update(provideTimeSinceStart); };
    }, [callback]);
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-time.mjs



function useTime() {
    var time = useMotionValue(0);
    useAnimationFrame(function (t) { return time.set(t); });
    return time;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-reduced-motion.mjs
var use_reduced_motion = __webpack_require__(6240);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/animation.mjs
var animation = __webpack_require__(7107);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/setters.mjs + 3 modules
var setters = __webpack_require__(5759);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/animation-controls.mjs





/**
 * @public
 */
function animationControls() {
    /**
     * Track whether the host component has mounted.
     */
    var hasMounted = false;
    /**
     * Pending animations that are started before a component is mounted.
     * TODO: Remove this as animations should only run in effects
     */
    var pendingAnimations = [];
    /**
     * A collection of linked component animation controls.
     */
    var subscribers = new Set();
    var controls = {
        subscribe: function (visualElement) {
            subscribers.add(visualElement);
            return function () { return void subscribers.delete(visualElement); };
        },
        start: function (definition, transitionOverride) {
            /**
             * TODO: We only perform this hasMounted check because in Framer we used to
             * encourage the ability to start an animation within the render phase. This
             * isn't behaviour concurrent-safe so when we make Framer concurrent-safe
             * we can ditch this.
             */
            if (hasMounted) {
                var animations_1 = [];
                subscribers.forEach(function (visualElement) {
                    animations_1.push((0,animation/* animateVisualElement */.d5)(visualElement, definition, {
                        transitionOverride: transitionOverride,
                    }));
                });
                return Promise.all(animations_1);
            }
            else {
                return new Promise(function (resolve) {
                    pendingAnimations.push({
                        animation: [definition, transitionOverride],
                        resolve: resolve,
                    });
                });
            }
        },
        set: function (definition) {
            (0,dist.invariant)(hasMounted, "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.");
            return subscribers.forEach(function (visualElement) {
                (0,setters/* setValues */.gg)(visualElement, definition);
            });
        },
        stop: function () {
            subscribers.forEach(function (visualElement) {
                (0,animation/* stopAnimation */.p_)(visualElement);
            });
        },
        mount: function () {
            hasMounted = true;
            pendingAnimations.forEach(function (_a) {
                var animation = _a.animation, resolve = _a.resolve;
                controls.start.apply(controls, (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(animation), false)).then(resolve);
            });
            return function () {
                hasMounted = false;
                controls.stop();
            };
        },
    };
    return controls;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/use-animation.mjs




/**
 * Creates `AnimationControls`, which can be used to manually start, stop
 * and sequence animations on one or more components.
 *
 * The returned `AnimationControls` should be passed to the `animate` property
 * of the components you want to animate.
 *
 * These components can then be animated with the `start` method.
 *
 * ```jsx
 * import * as React from 'react'
 * import { motion, useAnimation } from 'framer-motion'
 *
 * export function MyComponent(props) {
 *    const controls = useAnimation()
 *
 *    controls.start({
 *        x: 100,
 *        transition: { duration: 0.5 },
 *    })
 *
 *    return <motion.div animate={controls} />
 * }
 * ```
 *
 * @returns Animation controller with `start` and `stop` methods
 *
 * @public
 */
function useAnimationControls() {
    var controls = (0,use_constant/* useConstant */.h)(animationControls);
    (0,external_react_.useEffect)(controls.mount, []);
    return controls;
}
var useAnimation = useAnimationControls;



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/animate.mjs
var animate = __webpack_require__(2064);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/wrap.mjs
const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/use-cycle.mjs




/**
 * Cycles through a series of visual properties. Can be used to toggle between or cycle through animations. It works similar to `useState` in React. It is provided an initial array of possible states, and returns an array of two arguments.
 *
 * An index value can be passed to the returned `cycle` function to cycle to a specific index.
 *
 * ```jsx
 * import * as React from "react"
 * import { motion, useCycle } from "framer-motion"
 *
 * export const MyComponent = () => {
 *   const [x, cycleX] = useCycle(0, 50, 100)
 *
 *   return (
 *     <motion.div
 *       animate={{ x: x }}
 *       onTap={() => cycleX()}
 *      />
 *    )
 * }
 * ```
 *
 * @param items - items to cycle through
 * @returns [currentState, cycleState]
 *
 * @public
 */
function useCycle() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var index = (0,external_react_.useRef)(0);
    var _a = (0,tslib_es6.__read)((0,external_react_.useState)(items[index.current]), 2), item = _a[0], setItem = _a[1];
    var runCycle = (0,external_react_.useCallback)(function (next) {
        index.current =
            typeof next !== "number"
                ? wrap(0, items.length, index.current + 1)
                : next;
        setItem(items[index.current]);
    }, (0,tslib_es6.__spreadArray)([items.length], (0,tslib_es6.__read)(items), false));
    return [item, runCycle];
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var valid_prop = __webpack_require__(9630);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
var use_presence = __webpack_require__(5947);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/use-in-view.mjs




function useInView(ref, _a) {
    var _b = _a === void 0 ? {} : _a, root = _b.root, margin = _b.margin, amount = _b.amount, _c = _b.once, once = _c === void 0 ? false : _c;
    var _d = (0,tslib_es6.__read)((0,external_react_.useState)(false), 2), isInView = _d[0], setInView = _d[1];
    (0,external_react_.useEffect)(function () {
        var _a;
        if (!ref.current || (once && isInView))
            return;
        var onEnter = function () {
            setInView(true);
            return once ? undefined : function () { return setInView(false); };
        };
        var options = {
            root: (_a = root === null || root === void 0 ? void 0 : root.current) !== null && _a !== void 0 ? _a : undefined,
            margin: margin,
            amount: amount === "some" ? "any" : amount,
        };
        return (0,index_cjs/* inView */.jF)(ref.current, onEnter, options);
    }, [root, ref, margin, once]);
    return isInView;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/use-drag-controls.mjs


/**
 * Can manually trigger a drag gesture on one or more `drag`-enabled `motion` components.
 *
 * ```jsx
 * const dragControls = useDragControls()
 *
 * function startDrag(event) {
 *   dragControls.start(event, { snapToCursor: true })
 * }
 *
 * return (
 *   <>
 *     <div onPointerDown={startDrag} />
 *     <motion.div drag="x" dragControls={dragControls} />
 *   </>
 * )
 * ```
 *
 * @public
 */
var DragControls = /** @class */ (function () {
    function DragControls() {
        this.componentControls = new Set();
    }
    /**
     * Subscribe a component's internal `VisualElementDragControls` to the user-facing API.
     *
     * @internal
     */
    DragControls.prototype.subscribe = function (controls) {
        var _this = this;
        this.componentControls.add(controls);
        return function () { return _this.componentControls.delete(controls); };
    };
    /**
     * Start a drag gesture on every `motion` component that has this set of drag controls
     * passed into it via the `dragControls` prop.
     *
     * ```jsx
     * dragControls.start(e, {
     *   snapToCursor: true
     * })
     * ```
     *
     * @param event - PointerEvent
     * @param options - Options
     *
     * @public
     */
    DragControls.prototype.start = function (event, options) {
        this.componentControls.forEach(function (controls) {
            controls.start(event.nativeEvent || event, options);
        });
    };
    return DragControls;
}());
var createDragControls = function () { return new DragControls(); };
/**
 * Usually, dragging is initiated by pressing down on a `motion` component with a `drag` prop
 * and moving it. For some use-cases, for instance clicking at an arbitrary point on a video scrubber, we
 * might want to initiate that dragging from a different component than the draggable one.
 *
 * By creating a `dragControls` using the `useDragControls` hook, we can pass this into
 * the draggable component's `dragControls` prop. It exposes a `start` method
 * that can start dragging from pointer events on other components.
 *
 * ```jsx
 * const dragControls = useDragControls()
 *
 * function startDrag(event) {
 *   dragControls.start(event, { snapToCursor: true })
 * }
 *
 * return (
 *   <>
 *     <div onPointerDown={startDrag} />
 *     <motion.div drag="x" dragControls={dragControls} />
 *   </>
 * )
 * ```
 *
 * @public
 */
function useDragControls() {
    return (0,use_constant/* useConstant */.h)(createDragControls);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-dom-event.mjs
var use_dom_event = __webpack_require__(1756);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/index.mjs + 8 modules
var es_motion = __webpack_require__(7641);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/index.mjs + 2 modules
var render = __webpack_require__(404);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/styles/scale-correction.mjs
var scale_correction = __webpack_require__(4561);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/use-instant-layout-transition.mjs


function useInstantLayoutTransition() {
    return startTransition;
}
function startTransition(cb) {
    if (!HTMLProjectionNode/* rootProjectionNode.current */.J.current)
        return;
    HTMLProjectionNode/* rootProjectionNode.current.isUpdating */.J.current.isUpdating = false;
    HTMLProjectionNode/* rootProjectionNode.current.blockUpdate */.J.current.blockUpdate();
    cb === null || cb === void 0 ? void 0 : cb();
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-instant-transition-state.mjs
var use_instant_transition_state = __webpack_require__(8627);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/use-instant-transition.mjs







function useInstantTransition() {
    var _a = (0,tslib_es6.__read)((0,use_force_update/* useForceUpdate */.N)(), 2), forceUpdate = _a[0], forcedRenderCount = _a[1];
    var startInstantLayoutTransition = useInstantLayoutTransition();
    (0,external_react_.useEffect)(function () {
        /**
         * Unblock after two animation frames, otherwise this will unblock too soon.
         */
        es/* default.postRender */.ZP.postRender(function () {
            return es/* default.postRender */.ZP.postRender(function () { return (use_instant_transition_state/* instantAnimationState.current */.c.current = false); });
        });
    }, [forcedRenderCount]);
    return function (callback) {
        startInstantLayoutTransition(function () {
            use_instant_transition_state/* instantAnimationState.current */.c.current = true;
            forceUpdate();
            callback();
        });
    };
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/use-reset-projection.mjs



function useResetProjection() {
    var reset = external_react_.useCallback(function () {
        var root = HTMLProjectionNode/* rootProjectionNode.current */.J.current;
        if (!root)
            return;
        root.resetTree();
    }, []);
    return reset;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var MotionContext = __webpack_require__(4451);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/PresenceContext.mjs
var PresenceContext = __webpack_require__(240);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var SwitchLayoutGroupContext = __webpack_require__(1705);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/flat-tree.mjs + 1 modules
var flat_tree = __webpack_require__(1419);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
var use_visual_state = __webpack_require__(5180);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/models.mjs
var models = __webpack_require__(1512);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/animation/use-animated-state.mjs









var createObject = function () { return ({}); };
var stateVisualElement = (0,render/* visualElement */.q)({
    build: function () { },
    measureViewportBox: models/* createBox */.dO,
    resetTransform: function () { },
    restoreTransform: function () { },
    removeValueFromRenderState: function () { },
    render: function () { },
    scrapeMotionValuesFromProps: createObject,
    readValueFromInstance: function (_state, key, options) {
        return options.initialState[key] || 0;
    },
    makeTargetAnimatable: function (element, _a) {
        var transition = _a.transition, transitionEnd = _a.transitionEnd, target = (0,tslib_es6.__rest)(_a, ["transition", "transitionEnd"]);
        var origin = (0,setters/* getOrigin */.P$)(target, transition || {}, element);
        (0,setters/* checkTargetForNewValues */.GJ)(element, target, origin);
        return (0,tslib_es6.__assign)({ transition: transition, transitionEnd: transitionEnd }, target);
    },
});
var useVisualState = (0,use_visual_state/* makeUseVisualState */.t)({
    scrapeMotionValuesFromProps: createObject,
    createRenderState: createObject,
});
/**
 * This is not an officially supported API and may be removed
 * on any version.
 */
function useAnimatedState(initialState) {
    var _a = (0,tslib_es6.__read)((0,external_react_.useState)(initialState), 2), animationState = _a[0], setAnimationState = _a[1];
    var visualState = useVisualState({}, false);
    var element = (0,use_constant/* useConstant */.h)(function () {
        return stateVisualElement({ props: {}, visualState: visualState }, { initialState: initialState });
    });
    (0,external_react_.useEffect)(function () {
        element.mount({});
        return element.unmount;
    }, [element]);
    (0,external_react_.useEffect)(function () {
        element.setProps({
            onUpdate: function (v) {
                setAnimationState((0,tslib_es6.__assign)({}, v));
            },
        });
    }, [setAnimationState, element]);
    var startAnimation = (0,use_constant/* useConstant */.h)(function () { return function (animationDefinition) {
        return (0,animation/* animateVisualElement */.d5)(element, animationDefinition);
    }; });
    return [animationState, startAnimation];
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/value/use-inverted-scale.mjs





// Keep things reasonable and avoid scale: Infinity. In practise we might need
// to add another value, opacity, that could interpolate scaleX/Y [0,0.01] => [0,1]
// to simply hide content at unreasonable scales.
var maxScale = 100000;
var invertScale = function (scale) {
    return scale > 0.001 ? 1 / scale : maxScale;
};
var hasWarned = false;
/**
 * Returns a `MotionValue` each for `scaleX` and `scaleY` that update with the inverse
 * of their respective parent scales.
 *
 * This is useful for undoing the distortion of content when scaling a parent component.
 *
 * By default, `useInvertedScale` will automatically fetch `scaleX` and `scaleY` from the nearest parent.
 * By passing other `MotionValue`s in as `useInvertedScale({ scaleX, scaleY })`, it will invert the output
 * of those instead.
 *
 * ```jsx
 * const MyComponent = () => {
 *   const { scaleX, scaleY } = useInvertedScale()
 *   return <motion.div style={{ scaleX, scaleY }} />
 * }
 * ```
 *
 * @deprecated
 */
function useInvertedScale(scale) {
    var parentScaleX = useMotionValue(1);
    var parentScaleY = useMotionValue(1);
    var visualElement = (0,MotionContext/* useVisualElementContext */.B)();
    (0,dist.invariant)(!!(scale || visualElement), "If no scale values are provided, useInvertedScale must be used within a child of another motion component.");
    (0,dist.warning)(hasWarned, "useInvertedScale is deprecated and will be removed in 3.0. Use the layout prop instead.");
    hasWarned = true;
    if (scale) {
        parentScaleX = scale.scaleX || parentScaleX;
        parentScaleY = scale.scaleY || parentScaleY;
    }
    else if (visualElement) {
        parentScaleX = visualElement.getValue("scaleX", 1);
        parentScaleY = visualElement.getValue("scaleY", 1);
    }
    var scaleX = useTransform(parentScaleX, invertScale);
    var scaleY = useTransform(parentScaleY, invertScale);
    return { scaleX: scaleX, scaleY: scaleY };
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/types.mjs
var types = __webpack_require__(3233);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/delta-calc.mjs
var delta_calc = __webpack_require__(6645);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/utils/lock.mjs
var lock = __webpack_require__(7544);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-pointer-event.mjs + 1 modules
var use_pointer_event = __webpack_require__(737);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/event-info.mjs
var event_info = __webpack_require__(8148);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/is-browser.mjs
var is_browser = __webpack_require__(1741);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs
var use_unmount_effect = __webpack_require__(5411);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/index.mjs


































































/***/ }),

/***/ 1903:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": function() { return /* binding */ animations; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(655);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _animation_utils_is_animation_controls_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3077);
/* harmony import */ var _components_AnimatePresence_use_presence_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5947);
/* harmony import */ var _context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(240);
/* harmony import */ var _render_utils_animation_state_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2620);
/* harmony import */ var _render_utils_types_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3233);
/* harmony import */ var _utils_make_renderless_component_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5445);









var animations = {
    animation: (0,_utils_make_renderless_component_mjs__WEBPACK_IMPORTED_MODULE_1__/* .makeRenderlessComponent */ .x)(function (_a) {
        var visualElement = _a.visualElement, animate = _a.animate;
        /**
         * We dynamically generate the AnimationState manager as it contains a reference
         * to the underlying animation library. We only want to load that if we load this,
         * so people can optionally code split it out using the `m` component.
         */
        visualElement.animationState || (visualElement.animationState = (0,_render_utils_animation_state_mjs__WEBPACK_IMPORTED_MODULE_2__/* .createAnimationState */ .MS)(visualElement));
        /**
         * Subscribe any provided AnimationControls to the component's VisualElement
         */
        if ((0,_animation_utils_is_animation_controls_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isAnimationControls */ .H)(animate)) {
            (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () { return animate.subscribe(visualElement); }, [animate]);
        }
    }),
    exit: (0,_utils_make_renderless_component_mjs__WEBPACK_IMPORTED_MODULE_1__/* .makeRenderlessComponent */ .x)(function (props) {
        var custom = props.custom, visualElement = props.visualElement;
        var _a = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__read)((0,_components_AnimatePresence_use_presence_mjs__WEBPACK_IMPORTED_MODULE_5__/* .usePresence */ .oO)(), 2), isPresent = _a[0], safeToRemove = _a[1];
        var presenceContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_6__/* .PresenceContext */ .O);
        (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
            var _a, _b;
            visualElement.isPresent = isPresent;
            var animation = (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(_render_utils_types_mjs__WEBPACK_IMPORTED_MODULE_7__/* .AnimationType.Exit */ .r.Exit, !isPresent, { custom: (_b = presenceContext === null || presenceContext === void 0 ? void 0 : presenceContext.custom) !== null && _b !== void 0 ? _b : custom });
            !isPresent && (animation === null || animation === void 0 ? void 0 : animation.then(safeToRemove));
        }, [isPresent]);
    }),
};




/***/ }),

/***/ 9442:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": function() { return /* binding */ featureDefinitions; },
/* harmony export */   "K": function() { return /* binding */ loadFeatures; }
/* harmony export */ });
var createDefinition = function (propNames) { return ({
    isEnabled: function (props) { return propNames.some(function (name) { return !!props[name]; }); },
}); };
var featureDefinitions = {
    measureLayout: createDefinition(["layout", "layoutId", "drag"]),
    animation: createDefinition([
        "animate",
        "exit",
        "variants",
        "whileHover",
        "whileTap",
        "whileFocus",
        "whileDrag",
        "whileInView",
    ]),
    exit: createDefinition(["exit"]),
    drag: createDefinition(["drag", "dragControls"]),
    focus: createDefinition(["whileFocus"]),
    hover: createDefinition(["whileHover", "onHoverStart", "onHoverEnd"]),
    tap: createDefinition(["whileTap", "onTap", "onTapStart", "onTapCancel"]),
    pan: createDefinition([
        "onPan",
        "onPanStart",
        "onPanSessionStart",
        "onPanEnd",
    ]),
    inView: createDefinition([
        "whileInView",
        "onViewportEnter",
        "onViewportLeave",
    ]),
};
function loadFeatures(features) {
    for (var key in features) {
        if (features[key] === null)
            continue;
        if (key === "projectionNodeConstructor") {
            featureDefinitions.projectionNodeConstructor = features[key];
        }
        else {
            featureDefinitions[key].Component = features[key];
        }
    }
}




/***/ }),

/***/ 3006:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "o": function() { return /* binding */ drag; }
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/gestures/utils/event-type.mjs
var event_type = __webpack_require__(900);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/event-info.mjs
var event_info = __webpack_require__(8148);
// EXTERNAL MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(9073);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/time-conversion.mjs
var time_conversion = __webpack_require__(420);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-pointer-event.mjs + 1 modules
var use_pointer_event = __webpack_require__(737);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/distance.mjs + 2 modules
var distance = __webpack_require__(8677);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/pipe.mjs
var pipe = __webpack_require__(9897);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/PanSession.mjs








/**
 * @internal
 */
var PanSession = /** @class */ (function () {
    function PanSession(event, handlers, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, transformPagePoint = _b.transformPagePoint;
        /**
         * @internal
         */
        this.startEvent = null;
        /**
         * @internal
         */
        this.lastMoveEvent = null;
        /**
         * @internal
         */
        this.lastMoveEventInfo = null;
        /**
         * @internal
         */
        this.handlers = {};
        this.updatePoint = function () {
            if (!(_this.lastMoveEvent && _this.lastMoveEventInfo))
                return;
            var info = getPanInfo(_this.lastMoveEventInfo, _this.history);
            var isPanStarted = _this.startEvent !== null;
            // Only start panning if the offset is larger than 3 pixels. If we make it
            // any larger than this we'll want to reset the pointer history
            // on the first update to avoid visual snapping to the cursoe.
            var isDistancePastThreshold = (0,distance/* distance */.T)(info.offset, { x: 0, y: 0 }) >= 3;
            if (!isPanStarted && !isDistancePastThreshold)
                return;
            var point = info.point;
            var timestamp = (0,es/* getFrameData */.$B)().timestamp;
            _this.history.push((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, point), { timestamp: timestamp }));
            var _a = _this.handlers, onStart = _a.onStart, onMove = _a.onMove;
            if (!isPanStarted) {
                onStart && onStart(_this.lastMoveEvent, info);
                _this.startEvent = _this.lastMoveEvent;
            }
            onMove && onMove(_this.lastMoveEvent, info);
        };
        this.handlePointerMove = function (event, info) {
            _this.lastMoveEvent = event;
            _this.lastMoveEventInfo = transformPoint(info, _this.transformPagePoint);
            // Because Safari doesn't trigger mouseup events when it's above a `<select>`
            if ((0,event_type/* isMouseEvent */.N)(event) && event.buttons === 0) {
                _this.handlePointerUp(event, info);
                return;
            }
            // Throttle mouse move event to once per frame
            es/* default.update */.ZP.update(_this.updatePoint, true);
        };
        this.handlePointerUp = function (event, info) {
            _this.end();
            var _a = _this.handlers, onEnd = _a.onEnd, onSessionEnd = _a.onSessionEnd;
            var panInfo = getPanInfo(transformPoint(info, _this.transformPagePoint), _this.history);
            if (_this.startEvent && onEnd) {
                onEnd(event, panInfo);
            }
            onSessionEnd && onSessionEnd(event, panInfo);
        };
        // If we have more than one touch, don't start detecting this gesture
        if ((0,event_type/* isTouchEvent */.z)(event) && event.touches.length > 1)
            return;
        this.handlers = handlers;
        this.transformPagePoint = transformPagePoint;
        var info = (0,event_info/* extractEventInfo */.Q)(event);
        var initialInfo = transformPoint(info, this.transformPagePoint);
        var point = initialInfo.point;
        var timestamp = (0,es/* getFrameData */.$B)().timestamp;
        this.history = [(0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, point), { timestamp: timestamp })];
        var onSessionStart = handlers.onSessionStart;
        onSessionStart &&
            onSessionStart(event, getPanInfo(initialInfo, this.history));
        this.removeListeners = (0,pipe/* pipe */.z)((0,use_pointer_event/* addPointerEvent */.a)(window, "pointermove", this.handlePointerMove), (0,use_pointer_event/* addPointerEvent */.a)(window, "pointerup", this.handlePointerUp), (0,use_pointer_event/* addPointerEvent */.a)(window, "pointercancel", this.handlePointerUp));
    }
    PanSession.prototype.updateHandlers = function (handlers) {
        this.handlers = handlers;
    };
    PanSession.prototype.end = function () {
        this.removeListeners && this.removeListeners();
        es/* cancelSync.update */.qY.update(this.updatePoint);
    };
    return PanSession;
}());
function transformPoint(info, transformPagePoint) {
    return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo(_a, history) {
    var point = _a.point;
    return {
        point: point,
        delta: subtractPoint(point, lastDevicePoint(history)),
        offset: subtractPoint(point, startDevicePoint(history)),
        velocity: getVelocity(history, 0.1),
    };
}
function startDevicePoint(history) {
    return history[0];
}
function lastDevicePoint(history) {
    return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
    if (history.length < 2) {
        return { x: 0, y: 0 };
    }
    var i = history.length - 1;
    var timestampedPoint = null;
    var lastPoint = lastDevicePoint(history);
    while (i >= 0) {
        timestampedPoint = history[i];
        if (lastPoint.timestamp - timestampedPoint.timestamp >
            (0,time_conversion/* secondsToMilliseconds */.w)(timeDelta)) {
            break;
        }
        i--;
    }
    if (!timestampedPoint) {
        return { x: 0, y: 0 };
    }
    var time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1000;
    if (time === 0) {
        return { x: 0, y: 0 };
    }
    var currentVelocity = {
        x: (lastPoint.x - timestampedPoint.x) / time,
        y: (lastPoint.y - timestampedPoint.y) / time,
    };
    if (currentVelocity.x === Infinity) {
        currentVelocity.x = 0;
    }
    if (currentVelocity.y === Infinity) {
        currentVelocity.y = 0;
    }
    return currentVelocity;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/utils/lock.mjs
var lock = __webpack_require__(7544);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
var is_ref_object = __webpack_require__(1804);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/mix.mjs
var mix = __webpack_require__(2453);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/progress.mjs
var progress = __webpack_require__(9326);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/clamp.mjs
var clamp = __webpack_require__(6773);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/delta-calc.mjs
var delta_calc = __webpack_require__(6645);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs




/**
 * Apply constraints to a point. These constraints are both physical along an
 * axis, and an elastic factor that determines how much to constrain the point
 * by if it does lie outside the defined parameters.
 */
function applyConstraints(point, _a, elastic) {
    var min = _a.min, max = _a.max;
    if (min !== undefined && point < min) {
        // If we have a min point defined, and this is outside of that, constrain
        point = elastic ? (0,mix/* mix */.C)(min, point, elastic.min) : Math.max(point, min);
    }
    else if (max !== undefined && point > max) {
        // If we have a max point defined, and this is outside of that, constrain
        point = elastic ? (0,mix/* mix */.C)(max, point, elastic.max) : Math.min(point, max);
    }
    return point;
}
/**
 * Calculate constraints in terms of the viewport when defined relatively to the
 * measured axis. This is measured from the nearest edge, so a max constraint of 200
 * on an axis with a max value of 300 would return a constraint of 500 - axis length
 */
function calcRelativeAxisConstraints(axis, min, max) {
    return {
        min: min !== undefined ? axis.min + min : undefined,
        max: max !== undefined
            ? axis.max + max - (axis.max - axis.min)
            : undefined,
    };
}
/**
 * Calculate constraints in terms of the viewport when
 * defined relatively to the measured bounding box.
 */
function calcRelativeConstraints(layoutBox, _a) {
    var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
    return {
        x: calcRelativeAxisConstraints(layoutBox.x, left, right),
        y: calcRelativeAxisConstraints(layoutBox.y, top, bottom),
    };
}
/**
 * Calculate viewport constraints when defined as another viewport-relative axis
 */
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
    var _a;
    var min = constraintsAxis.min - layoutAxis.min;
    var max = constraintsAxis.max - layoutAxis.max;
    // If the constraints axis is actually smaller than the layout axis then we can
    // flip the constraints
    if (constraintsAxis.max - constraintsAxis.min <
        layoutAxis.max - layoutAxis.min) {
        _a = (0,tslib_es6.__read)([max, min], 2), min = _a[0], max = _a[1];
    }
    return { min: min, max: max };
}
/**
 * Calculate viewport constraints when defined as another viewport-relative box
 */
function calcViewportConstraints(layoutBox, constraintsBox) {
    return {
        x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
        y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y),
    };
}
/**
 * Calculate a transform origin relative to the source axis, between 0-1, that results
 * in an asthetically pleasing scale/transform needed to project from source to target.
 */
function calcOrigin(source, target) {
    var origin = 0.5;
    var sourceLength = (0,delta_calc/* calcLength */.JO)(source);
    var targetLength = (0,delta_calc/* calcLength */.JO)(target);
    if (targetLength > sourceLength) {
        origin = (0,progress/* progress */.Y)(target.min, target.max - sourceLength, source.min);
    }
    else if (sourceLength > targetLength) {
        origin = (0,progress/* progress */.Y)(source.min, source.max - targetLength, target.min);
    }
    return (0,clamp/* clamp */.u)(0, 1, origin);
}
/**
 * Rebase the calculated viewport constraints relative to the layout.min point.
 */
function rebaseAxisConstraints(layout, constraints) {
    var relativeConstraints = {};
    if (constraints.min !== undefined) {
        relativeConstraints.min = constraints.min - layout.min;
    }
    if (constraints.max !== undefined) {
        relativeConstraints.max = constraints.max - layout.min;
    }
    return relativeConstraints;
}
var defaultElastic = 0.35;
/**
 * Accepts a dragElastic prop and returns resolved elastic values for each axis.
 */
function resolveDragElastic(dragElastic) {
    if (dragElastic === void 0) { dragElastic = defaultElastic; }
    if (dragElastic === false) {
        dragElastic = 0;
    }
    else if (dragElastic === true) {
        dragElastic = defaultElastic;
    }
    return {
        x: resolveAxisElastic(dragElastic, "left", "right"),
        y: resolveAxisElastic(dragElastic, "top", "bottom"),
    };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
    return {
        min: resolvePointElastic(dragElastic, minLabel),
        max: resolvePointElastic(dragElastic, maxLabel),
    };
}
function resolvePointElastic(dragElastic, label) {
    var _a;
    return typeof dragElastic === "number"
        ? dragElastic
        : (_a = dragElastic[label]) !== null && _a !== void 0 ? _a : 0;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/types.mjs
var types = __webpack_require__(3233);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/models.mjs
var models = __webpack_require__(1512);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/utils/each-axis.mjs
var each_axis = __webpack_require__(1730);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/utils/measure.mjs
var measure = __webpack_require__(6460);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/utils/transitions.mjs + 5 modules
var transitions = __webpack_require__(6522);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/conversion.mjs
var conversion = __webpack_require__(6117);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-dom-event.mjs
var use_dom_event = __webpack_require__(1756);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs



















var elementDragControls = new WeakMap();
/**
 *
 */
// let latestPointerEvent: AnyPointerEvent
var VisualElementDragControls = /** @class */ (function () {
    function VisualElementDragControls(visualElement) {
        // This is a reference to the global drag gesture lock, ensuring only one component
        // can "capture" the drag of one or both axes.
        // TODO: Look into moving this into pansession?
        this.openGlobalLock = null;
        this.isDragging = false;
        this.currentDirection = null;
        this.originPoint = { x: 0, y: 0 };
        /**
         * The permitted boundaries of travel, in pixels.
         */
        this.constraints = false;
        this.hasMutatedConstraints = false;
        /**
         * The per-axis resolved elastic values.
         */
        this.elastic = (0,models/* createBox */.dO)();
        this.visualElement = visualElement;
    }
    VisualElementDragControls.prototype.start = function (originEvent, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.snapToCursor, snapToCursor = _c === void 0 ? false : _c;
        /**
         * Don't start dragging if this component is exiting
         */
        if (this.visualElement.isPresent === false)
            return;
        var onSessionStart = function (event) {
            // Stop any animations on both axis values immediately. This allows the user to throw and catch
            // the component.
            _this.stopAnimation();
            if (snapToCursor) {
                _this.snapToCursor((0,event_info/* extractEventInfo */.Q)(event, "page").point);
            }
        };
        var onStart = function (event, info) {
            var _a;
            // Attempt to grab the global drag gesture lock - maybe make this part of PanSession
            var _b = _this.getProps(), drag = _b.drag, dragPropagation = _b.dragPropagation, onDragStart = _b.onDragStart;
            if (drag && !dragPropagation) {
                if (_this.openGlobalLock)
                    _this.openGlobalLock();
                _this.openGlobalLock = (0,lock/* getGlobalLock */.fJ)(drag);
                // If we don 't have the lock, don't start dragging
                if (!_this.openGlobalLock)
                    return;
            }
            _this.isDragging = true;
            _this.currentDirection = null;
            _this.resolveConstraints();
            if (_this.visualElement.projection) {
                _this.visualElement.projection.isAnimationBlocked = true;
                _this.visualElement.projection.target = undefined;
            }
            /**
             * Record gesture origin
             */
            (0,each_axis/* eachAxis */.U)(function (axis) {
                var _a, _b;
                var current = _this.getAxisMotionValue(axis).get() || 0;
                /**
                 * If the MotionValue is a percentage value convert to px
                 */
                if (units/* percent.test */.aQ.test(current)) {
                    var measuredAxis = (_b = (_a = _this.visualElement.projection) === null || _a === void 0 ? void 0 : _a.layout) === null || _b === void 0 ? void 0 : _b.actual[axis];
                    if (measuredAxis) {
                        var length_1 = (0,delta_calc/* calcLength */.JO)(measuredAxis);
                        current = length_1 * (parseFloat(current) / 100);
                    }
                }
                _this.originPoint[axis] = current;
            });
            // Fire onDragStart event
            onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart(event, info);
            (_a = _this.visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.Drag */.r.Drag, true);
        };
        var onMove = function (event, info) {
            // latestPointerEvent = event
            var _a = _this.getProps(), dragPropagation = _a.dragPropagation, dragDirectionLock = _a.dragDirectionLock, onDirectionLock = _a.onDirectionLock, onDrag = _a.onDrag;
            // If we didn't successfully receive the gesture lock, early return.
            if (!dragPropagation && !_this.openGlobalLock)
                return;
            var offset = info.offset;
            // Attempt to detect drag direction if directionLock is true
            if (dragDirectionLock && _this.currentDirection === null) {
                _this.currentDirection = getCurrentDirection(offset);
                // If we've successfully set a direction, notify listener
                if (_this.currentDirection !== null) {
                    onDirectionLock === null || onDirectionLock === void 0 ? void 0 : onDirectionLock(_this.currentDirection);
                }
                return;
            }
            // Update each point with the latest position
            _this.updateAxis("x", info.point, offset);
            _this.updateAxis("y", info.point, offset);
            /**
             * Ideally we would leave the renderer to fire naturally at the end of
             * this frame but if the element is about to change layout as the result
             * of a re-render we want to ensure the browser can read the latest
             * bounding box to ensure the pointer and element don't fall out of sync.
             */
            _this.visualElement.syncRender();
            /**
             * This must fire after the syncRender call as it might trigger a state
             * change which itself might trigger a layout update.
             */
            onDrag === null || onDrag === void 0 ? void 0 : onDrag(event, info);
        };
        var onSessionEnd = function (event, info) {
            return _this.stop(event, info);
        };
        this.panSession = new PanSession(originEvent, {
            onSessionStart: onSessionStart,
            onStart: onStart,
            onMove: onMove,
            onSessionEnd: onSessionEnd,
        }, { transformPagePoint: this.visualElement.getTransformPagePoint() });
    };
    VisualElementDragControls.prototype.stop = function (event, info) {
        var isDragging = this.isDragging;
        this.cancel();
        if (!isDragging)
            return;
        var velocity = info.velocity;
        this.startAnimation(velocity);
        var onDragEnd = this.getProps().onDragEnd;
        onDragEnd === null || onDragEnd === void 0 ? void 0 : onDragEnd(event, info);
    };
    VisualElementDragControls.prototype.cancel = function () {
        var _a, _b;
        this.isDragging = false;
        if (this.visualElement.projection) {
            this.visualElement.projection.isAnimationBlocked = false;
        }
        (_a = this.panSession) === null || _a === void 0 ? void 0 : _a.end();
        this.panSession = undefined;
        var dragPropagation = this.getProps().dragPropagation;
        if (!dragPropagation && this.openGlobalLock) {
            this.openGlobalLock();
            this.openGlobalLock = null;
        }
        (_b = this.visualElement.animationState) === null || _b === void 0 ? void 0 : _b.setActive(types/* AnimationType.Drag */.r.Drag, false);
    };
    VisualElementDragControls.prototype.updateAxis = function (axis, _point, offset) {
        var drag = this.getProps().drag;
        // If we're not dragging this axis, do an early return.
        if (!offset || !shouldDrag(axis, drag, this.currentDirection))
            return;
        var axisValue = this.getAxisMotionValue(axis);
        var next = this.originPoint[axis] + offset[axis];
        // Apply constraints
        if (this.constraints && this.constraints[axis]) {
            next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
        }
        axisValue.set(next);
    };
    VisualElementDragControls.prototype.resolveConstraints = function () {
        var _this = this;
        var _a = this.getProps(), dragConstraints = _a.dragConstraints, dragElastic = _a.dragElastic;
        var layout = (this.visualElement.projection || {}).layout;
        var prevConstraints = this.constraints;
        if (dragConstraints && (0,is_ref_object/* isRefObject */.I)(dragConstraints)) {
            if (!this.constraints) {
                this.constraints = this.resolveRefConstraints();
            }
        }
        else {
            if (dragConstraints && layout) {
                this.constraints = calcRelativeConstraints(layout.actual, dragConstraints);
            }
            else {
                this.constraints = false;
            }
        }
        this.elastic = resolveDragElastic(dragElastic);
        /**
         * If we're outputting to external MotionValues, we want to rebase the measured constraints
         * from viewport-relative to component-relative.
         */
        if (prevConstraints !== this.constraints &&
            layout &&
            this.constraints &&
            !this.hasMutatedConstraints) {
            (0,each_axis/* eachAxis */.U)(function (axis) {
                if (_this.getAxisMotionValue(axis)) {
                    _this.constraints[axis] = rebaseAxisConstraints(layout.actual[axis], _this.constraints[axis]);
                }
            });
        }
    };
    VisualElementDragControls.prototype.resolveRefConstraints = function () {
        var _a = this.getProps(), constraints = _a.dragConstraints, onMeasureDragConstraints = _a.onMeasureDragConstraints;
        if (!constraints || !(0,is_ref_object/* isRefObject */.I)(constraints))
            return false;
        var constraintsElement = constraints.current;
        (0,dist.invariant)(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
        var projection = this.visualElement.projection;
        // TODO
        if (!projection || !projection.layout)
            return false;
        var constraintsBox = (0,measure/* measurePageBox */.z)(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
        var measuredConstraints = calcViewportConstraints(projection.layout.actual, constraintsBox);
        /**
         * If there's an onMeasureDragConstraints listener we call it and
         * if different constraints are returned, set constraints to that
         */
        if (onMeasureDragConstraints) {
            var userConstraints = onMeasureDragConstraints((0,conversion/* convertBoxToBoundingBox */.z2)(measuredConstraints));
            this.hasMutatedConstraints = !!userConstraints;
            if (userConstraints) {
                measuredConstraints = (0,conversion/* convertBoundingBoxToBox */.i8)(userConstraints);
            }
        }
        return measuredConstraints;
    };
    VisualElementDragControls.prototype.startAnimation = function (velocity) {
        var _this = this;
        var _a = this.getProps(), drag = _a.drag, dragMomentum = _a.dragMomentum, dragElastic = _a.dragElastic, dragTransition = _a.dragTransition, dragSnapToOrigin = _a.dragSnapToOrigin, onDragTransitionEnd = _a.onDragTransitionEnd;
        var constraints = this.constraints || {};
        var momentumAnimations = (0,each_axis/* eachAxis */.U)(function (axis) {
            var _a;
            if (!shouldDrag(axis, drag, _this.currentDirection)) {
                return;
            }
            var transition = (_a = constraints === null || constraints === void 0 ? void 0 : constraints[axis]) !== null && _a !== void 0 ? _a : {};
            if (dragSnapToOrigin)
                transition = { min: 0, max: 0 };
            /**
             * Overdamp the boundary spring if `dragElastic` is disabled. There's still a frame
             * of spring animations so we should look into adding a disable spring option to `inertia`.
             * We could do something here where we affect the `bounceStiffness` and `bounceDamping`
             * using the value of `dragElastic`.
             */
            var bounceStiffness = dragElastic ? 200 : 1000000;
            var bounceDamping = dragElastic ? 40 : 10000000;
            var inertia = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({ type: "inertia", velocity: dragMomentum ? velocity[axis] : 0, bounceStiffness: bounceStiffness, bounceDamping: bounceDamping, timeConstant: 750, restDelta: 1, restSpeed: 10 }, dragTransition), transition);
            // If we're not animating on an externally-provided `MotionValue` we can use the
            // component's animation controls which will handle interactions with whileHover (etc),
            // otherwise we just have to animate the `MotionValue` itself.
            return _this.startAxisValueAnimation(axis, inertia);
        });
        // Run all animations and then resolve the new drag constraints.
        return Promise.all(momentumAnimations).then(onDragTransitionEnd);
    };
    VisualElementDragControls.prototype.startAxisValueAnimation = function (axis, transition) {
        var axisValue = this.getAxisMotionValue(axis);
        return (0,transitions/* startAnimation */.b8)(axis, axisValue, 0, transition);
    };
    VisualElementDragControls.prototype.stopAnimation = function () {
        var _this = this;
        (0,each_axis/* eachAxis */.U)(function (axis) { return _this.getAxisMotionValue(axis).stop(); });
    };
    /**
     * Drag works differently depending on which props are provided.
     *
     * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
     * - Otherwise, we apply the delta to the x/y motion values.
     */
    VisualElementDragControls.prototype.getAxisMotionValue = function (axis) {
        var _a, _b;
        var dragKey = "_drag" + axis.toUpperCase();
        var externalMotionValue = this.visualElement.getProps()[dragKey];
        return externalMotionValue
            ? externalMotionValue
            : this.visualElement.getValue(axis, (_b = (_a = this.visualElement.getProps().initial) === null || _a === void 0 ? void 0 : _a[axis]) !== null && _b !== void 0 ? _b : 0);
    };
    VisualElementDragControls.prototype.snapToCursor = function (point) {
        var _this = this;
        (0,each_axis/* eachAxis */.U)(function (axis) {
            var drag = _this.getProps().drag;
            // If we're not dragging this axis, do an early return.
            if (!shouldDrag(axis, drag, _this.currentDirection))
                return;
            var projection = _this.visualElement.projection;
            var axisValue = _this.getAxisMotionValue(axis);
            if (projection && projection.layout) {
                var _a = projection.layout.actual[axis], min = _a.min, max = _a.max;
                axisValue.set(point[axis] - (0,mix/* mix */.C)(min, max, 0.5));
            }
        });
    };
    /**
     * When the viewport resizes we want to check if the measured constraints
     * have changed and, if so, reposition the element within those new constraints
     * relative to where it was before the resize.
     */
    VisualElementDragControls.prototype.scalePositionWithinConstraints = function () {
        var _this = this;
        var _a;
        var _b = this.getProps(), drag = _b.drag, dragConstraints = _b.dragConstraints;
        var projection = this.visualElement.projection;
        if (!(0,is_ref_object/* isRefObject */.I)(dragConstraints) || !projection || !this.constraints)
            return;
        /**
         * Stop current animations as there can be visual glitching if we try to do
         * this mid-animation
         */
        this.stopAnimation();
        /**
         * Record the relative position of the dragged element relative to the
         * constraints box and save as a progress value.
         */
        var boxProgress = { x: 0, y: 0 };
        (0,each_axis/* eachAxis */.U)(function (axis) {
            var axisValue = _this.getAxisMotionValue(axis);
            if (axisValue) {
                var latest = axisValue.get();
                boxProgress[axis] = calcOrigin({ min: latest, max: latest }, _this.constraints[axis]);
            }
        });
        /**
         * Update the layout of this element and resolve the latest drag constraints
         */
        var transformTemplate = this.visualElement.getProps().transformTemplate;
        this.visualElement.getInstance().style.transform = transformTemplate
            ? transformTemplate({}, "")
            : "none";
        (_a = projection.root) === null || _a === void 0 ? void 0 : _a.updateScroll();
        projection.updateLayout();
        this.resolveConstraints();
        /**
         * For each axis, calculate the current progress of the layout axis
         * within the new constraints.
         */
        (0,each_axis/* eachAxis */.U)(function (axis) {
            if (!shouldDrag(axis, drag, null))
                return;
            /**
             * Calculate a new transform based on the previous box progress
             */
            var axisValue = _this.getAxisMotionValue(axis);
            var _a = _this.constraints[axis], min = _a.min, max = _a.max;
            axisValue.set((0,mix/* mix */.C)(min, max, boxProgress[axis]));
        });
    };
    VisualElementDragControls.prototype.addListeners = function () {
        var _this = this;
        var _a;
        elementDragControls.set(this.visualElement, this);
        var element = this.visualElement.getInstance();
        /**
         * Attach a pointerdown event listener on this DOM element to initiate drag tracking.
         */
        var stopPointerListener = (0,use_pointer_event/* addPointerEvent */.a)(element, "pointerdown", function (event) {
            var _a = _this.getProps(), drag = _a.drag, _b = _a.dragListener, dragListener = _b === void 0 ? true : _b;
            drag && dragListener && _this.start(event);
        });
        var measureDragConstraints = function () {
            var dragConstraints = _this.getProps().dragConstraints;
            if ((0,is_ref_object/* isRefObject */.I)(dragConstraints)) {
                _this.constraints = _this.resolveRefConstraints();
            }
        };
        var projection = this.visualElement.projection;
        var stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
        if (projection && !projection.layout) {
            (_a = projection.root) === null || _a === void 0 ? void 0 : _a.updateScroll();
            projection.updateLayout();
        }
        measureDragConstraints();
        /**
         * Attach a window resize listener to scale the draggable target within its defined
         * constraints as the window resizes.
         */
        var stopResizeListener = (0,use_dom_event/* addDomEvent */.E)(window, "resize", function () {
            return _this.scalePositionWithinConstraints();
        });
        /**
         * If the element's layout changes, calculate the delta and apply that to
         * the drag gesture's origin point.
         */
        projection.addEventListener("didUpdate", (function (_a) {
            var delta = _a.delta, hasLayoutChanged = _a.hasLayoutChanged;
            if (_this.isDragging && hasLayoutChanged) {
                (0,each_axis/* eachAxis */.U)(function (axis) {
                    var motionValue = _this.getAxisMotionValue(axis);
                    if (!motionValue)
                        return;
                    _this.originPoint[axis] += delta[axis].translate;
                    motionValue.set(motionValue.get() + delta[axis].translate);
                });
                _this.visualElement.syncRender();
            }
        }));
        return function () {
            stopResizeListener();
            stopPointerListener();
            stopMeasureLayoutListener();
        };
    };
    VisualElementDragControls.prototype.getProps = function () {
        var props = this.visualElement.getProps();
        var _a = props.drag, drag = _a === void 0 ? false : _a, _b = props.dragDirectionLock, dragDirectionLock = _b === void 0 ? false : _b, _c = props.dragPropagation, dragPropagation = _c === void 0 ? false : _c, _d = props.dragConstraints, dragConstraints = _d === void 0 ? false : _d, _e = props.dragElastic, dragElastic = _e === void 0 ? defaultElastic : _e, _f = props.dragMomentum, dragMomentum = _f === void 0 ? true : _f;
        return (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, props), { drag: drag, dragDirectionLock: dragDirectionLock, dragPropagation: dragPropagation, dragConstraints: dragConstraints, dragElastic: dragElastic, dragMomentum: dragMomentum });
    };
    return VisualElementDragControls;
}());
function shouldDrag(direction, drag, currentDirection) {
    return ((drag === true || drag === direction) &&
        (currentDirection === null || currentDirection === direction));
}
/**
 * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
 * than the provided threshold, return `null`.
 *
 * @param offset - The x/y offset from origin.
 * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
 */
function getCurrentDirection(offset, lockThreshold) {
    if (lockThreshold === void 0) { lockThreshold = 10; }
    var direction = null;
    if (Math.abs(offset.y) > lockThreshold) {
        direction = "y";
    }
    else if (Math.abs(offset.x) > lockThreshold) {
        direction = "x";
    }
    return direction;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-constant.mjs
var use_constant = __webpack_require__(6681);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/use-drag.mjs




/**
 * A hook that allows an element to be dragged.
 *
 * @internal
 */
function useDrag(props) {
    var groupDragControls = props.dragControls, visualElement = props.visualElement;
    var dragControls = (0,use_constant/* useConstant */.h)(function () { return new VisualElementDragControls(visualElement); });
    // If we've been provided a DragControls for manual control over the drag gesture,
    // subscribe this component to it on mount.
    (0,external_react_.useEffect)(function () { return groupDragControls && groupDragControls.subscribe(dragControls); }, [dragControls, groupDragControls]);
    // Apply the event listeners to the element
    (0,external_react_.useEffect)(function () { return dragControls.addListeners(); }, [dragControls]);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var MotionConfigContext = __webpack_require__(6014);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs
var use_unmount_effect = __webpack_require__(5411);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/use-pan-gesture.mjs






/**
 *
 * @param handlers -
 * @param ref -
 *
 * @privateRemarks
 * Currently this sets new pan gesture functions every render. The memo route has been explored
 * in the past but ultimately we're still creating new functions every render. An optimisation
 * to explore is creating the pan gestures and loading them into a `ref`.
 *
 * @internal
 */
function usePanGesture(_a) {
    var onPan = _a.onPan, onPanStart = _a.onPanStart, onPanEnd = _a.onPanEnd, onPanSessionStart = _a.onPanSessionStart, visualElement = _a.visualElement;
    var hasPanEvents = onPan || onPanStart || onPanEnd || onPanSessionStart;
    var panSession = (0,external_react_.useRef)(null);
    var transformPagePoint = (0,external_react_.useContext)(MotionConfigContext/* MotionConfigContext */._).transformPagePoint;
    var handlers = {
        onSessionStart: onPanSessionStart,
        onStart: onPanStart,
        onMove: onPan,
        onEnd: function (event, info) {
            panSession.current = null;
            onPanEnd && onPanEnd(event, info);
        },
    };
    (0,external_react_.useEffect)(function () {
        if (panSession.current !== null) {
            panSession.current.updateHandlers(handlers);
        }
    });
    function onPointerDown(event) {
        panSession.current = new PanSession(event, handlers, {
            transformPagePoint: transformPagePoint,
        });
    }
    (0,use_pointer_event/* usePointerEvent */.m)(visualElement, "pointerdown", hasPanEvents && onPointerDown);
    (0,use_unmount_effect/* useUnmountEffect */.z)(function () { return panSession.current && panSession.current.end(); });
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/utils/make-renderless-component.mjs
var make_renderless_component = __webpack_require__(5445);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/drag.mjs




var drag = {
    pan: (0,make_renderless_component/* makeRenderlessComponent */.x)(usePanGesture),
    drag: (0,make_renderless_component/* makeRenderlessComponent */.x)(useDrag),
};




/***/ }),

/***/ 6872:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "E": function() { return /* binding */ gestureAnimations; }
});

// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/types.mjs
var types = __webpack_require__(3233);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-dom-event.mjs
var use_dom_event = __webpack_require__(1756);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/use-focus-gesture.mjs



/**
 *
 * @param props
 * @param ref
 * @internal
 */
function useFocusGesture(_a) {
    var whileFocus = _a.whileFocus, visualElement = _a.visualElement;
    var onFocus = function () {
        var _a;
        (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.Focus */.r.Focus, true);
    };
    var onBlur = function () {
        var _a;
        (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.Focus */.r.Focus, false);
    };
    (0,use_dom_event/* useDomEvent */.p)(visualElement, "focus", whileFocus ? onFocus : undefined);
    (0,use_dom_event/* useDomEvent */.p)(visualElement, "blur", whileFocus ? onBlur : undefined);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/gestures/utils/event-type.mjs
var event_type = __webpack_require__(900);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-pointer-event.mjs + 1 modules
var use_pointer_event = __webpack_require__(737);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/gestures/drag/utils/lock.mjs
var lock = __webpack_require__(7544);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/use-hover-gesture.mjs





function createHoverEvent(visualElement, isActive, callback) {
    return function (event, info) {
        var _a;
        if (!(0,event_type/* isMouseEvent */.N)(event) || (0,lock/* isDragActive */.gD)())
            return;
        /**
         * Ensure we trigger animations before firing event callback
         */
        (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.Hover */.r.Hover, isActive);
        callback === null || callback === void 0 ? void 0 : callback(event, info);
    };
}
function useHoverGesture(_a) {
    var onHoverStart = _a.onHoverStart, onHoverEnd = _a.onHoverEnd, whileHover = _a.whileHover, visualElement = _a.visualElement;
    (0,use_pointer_event/* usePointerEvent */.m)(visualElement, "pointerenter", onHoverStart || whileHover
        ? createHoverEvent(visualElement, true, onHoverStart)
        : undefined, { passive: !onHoverStart });
    (0,use_pointer_event/* usePointerEvent */.m)(visualElement, "pointerleave", onHoverEnd || whileHover
        ? createHoverEvent(visualElement, false, onHoverEnd)
        : undefined, { passive: !onHoverEnd });
}



// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/utils/is-node-or-child.mjs
/**
 * Recursively traverse up the tree to check whether the provided child node
 * is the parent or a descendant of it.
 *
 * @param parent - Element to find
 * @param child - Element to test against parent
 */
var isNodeOrChild = function (parent, child) {
    if (!child) {
        return false;
    }
    else if (parent === child) {
        return true;
    }
    else {
        return isNodeOrChild(parent, child.parentElement);
    }
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs
var use_unmount_effect = __webpack_require__(5411);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/pipe.mjs
var pipe = __webpack_require__(9897);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/gestures/use-tap-gesture.mjs








/**
 * @param handlers -
 * @internal
 */
function useTapGesture(_a) {
    var onTap = _a.onTap, onTapStart = _a.onTapStart, onTapCancel = _a.onTapCancel, whileTap = _a.whileTap, visualElement = _a.visualElement;
    var hasPressListeners = onTap || onTapStart || onTapCancel || whileTap;
    var isPressing = (0,external_react_.useRef)(false);
    var cancelPointerEndListeners = (0,external_react_.useRef)(null);
    /**
     * Only set listener to passive if there are no external listeners.
     */
    var eventOptions = {
        passive: !(onTapStart || onTap || onTapCancel || onPointerDown),
    };
    function removePointerEndListener() {
        var _a;
        (_a = cancelPointerEndListeners.current) === null || _a === void 0 ? void 0 : _a.call(cancelPointerEndListeners);
        cancelPointerEndListeners.current = null;
    }
    function checkPointerEnd() {
        var _a;
        removePointerEndListener();
        isPressing.current = false;
        (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.Tap */.r.Tap, false);
        return !(0,lock/* isDragActive */.gD)();
    }
    function onPointerUp(event, info) {
        if (!checkPointerEnd())
            return;
        /**
         * We only count this as a tap gesture if the event.target is the same
         * as, or a child of, this component's element
         */
        !isNodeOrChild(visualElement.getInstance(), event.target)
            ? onTapCancel === null || onTapCancel === void 0 ? void 0 : onTapCancel(event, info)
            : onTap === null || onTap === void 0 ? void 0 : onTap(event, info);
    }
    function onPointerCancel(event, info) {
        if (!checkPointerEnd())
            return;
        onTapCancel === null || onTapCancel === void 0 ? void 0 : onTapCancel(event, info);
    }
    function onPointerDown(event, info) {
        var _a;
        removePointerEndListener();
        if (isPressing.current)
            return;
        isPressing.current = true;
        cancelPointerEndListeners.current = (0,pipe/* pipe */.z)((0,use_pointer_event/* addPointerEvent */.a)(window, "pointerup", onPointerUp, eventOptions), (0,use_pointer_event/* addPointerEvent */.a)(window, "pointercancel", onPointerCancel, eventOptions));
        /**
         * Ensure we trigger animations before firing event callback
         */
        (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.Tap */.r.Tap, true);
        onTapStart === null || onTapStart === void 0 ? void 0 : onTapStart(event, info);
    }
    (0,use_pointer_event/* usePointerEvent */.m)(visualElement, "pointerdown", hasPressListeners ? onPointerDown : undefined, eventOptions);
    (0,use_unmount_effect/* useUnmountEffect */.z)(removePointerEndListener);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/process.mjs
var process = __webpack_require__(9304);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/warn-once.mjs
var warn_once = __webpack_require__(6034);
// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/viewport/observers.mjs


/**
 * Map an IntersectionHandler callback to an element. We only ever make one handler for one
 * element, so even though these handlers might all be triggered by different
 * observers, we can keep them in the same map.
 */
var observerCallbacks = new WeakMap();
/**
 * Multiple observers can be created for multiple element/document roots. Each with
 * different settings. So here we store dictionaries of observers to each root,
 * using serialised settings (threshold/margin) as lookup keys.
 */
var observers = new WeakMap();
var fireObserverCallback = function (entry) {
    var _a;
    (_a = observerCallbacks.get(entry.target)) === null || _a === void 0 ? void 0 : _a(entry);
};
var fireAllObserverCallbacks = function (entries) {
    entries.forEach(fireObserverCallback);
};
function initIntersectionObserver(_a) {
    var root = _a.root, options = (0,tslib_es6.__rest)(_a, ["root"]);
    var lookupRoot = root || document;
    /**
     * If we don't have an observer lookup map for this root, create one.
     */
    if (!observers.has(lookupRoot)) {
        observers.set(lookupRoot, {});
    }
    var rootObservers = observers.get(lookupRoot);
    var key = JSON.stringify(options);
    /**
     * If we don't have an observer for this combination of root and settings,
     * create one.
     */
    if (!rootObservers[key]) {
        rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, (0,tslib_es6.__assign)({ root: root }, options));
    }
    return rootObservers[key];
}
function observeIntersection(element, options, callback) {
    var rootInteresectionObserver = initIntersectionObserver(options);
    observerCallbacks.set(element, callback);
    rootInteresectionObserver.observe(element);
    return function () {
        observerCallbacks.delete(element);
        rootInteresectionObserver.unobserve(element);
    };
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/viewport/use-viewport.mjs






function useViewport(_a) {
    var visualElement = _a.visualElement, whileInView = _a.whileInView, onViewportEnter = _a.onViewportEnter, onViewportLeave = _a.onViewportLeave, _b = _a.viewport, viewport = _b === void 0 ? {} : _b;
    var state = (0,external_react_.useRef)({
        hasEnteredView: false,
        isInView: false,
    });
    var shouldObserve = Boolean(whileInView || onViewportEnter || onViewportLeave);
    if (viewport.once && state.current.hasEnteredView)
        shouldObserve = false;
    var useObserver = typeof IntersectionObserver === "undefined"
        ? useMissingIntersectionObserver
        : useIntersectionObserver;
    useObserver(shouldObserve, state.current, visualElement, viewport);
}
var thresholdNames = {
    some: 0,
    all: 1,
};
function useIntersectionObserver(shouldObserve, state, visualElement, _a) {
    var root = _a.root, rootMargin = _a.margin, _b = _a.amount, amount = _b === void 0 ? "some" : _b, once = _a.once;
    (0,external_react_.useEffect)(function () {
        if (!shouldObserve)
            return;
        var options = {
            root: root === null || root === void 0 ? void 0 : root.current,
            rootMargin: rootMargin,
            threshold: typeof amount === "number" ? amount : thresholdNames[amount],
        };
        var intersectionCallback = function (entry) {
            var _a;
            var isIntersecting = entry.isIntersecting;
            /**
             * If there's been no change in the viewport state, early return.
             */
            if (state.isInView === isIntersecting)
                return;
            state.isInView = isIntersecting;
            /**
             * Handle hasEnteredView. If this is only meant to run once, and
             * element isn't visible, early return. Otherwise set hasEnteredView to true.
             */
            if (once && !isIntersecting && state.hasEnteredView) {
                return;
            }
            else if (isIntersecting) {
                state.hasEnteredView = true;
            }
            (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.InView */.r.InView, isIntersecting);
            /**
             * Use the latest committed props rather than the ones in scope
             * when this observer is created
             */
            var props = visualElement.getProps();
            var callback = isIntersecting
                ? props.onViewportEnter
                : props.onViewportLeave;
            callback === null || callback === void 0 ? void 0 : callback(entry);
        };
        return observeIntersection(visualElement.getInstance(), options, intersectionCallback);
    }, [shouldObserve, root, rootMargin, amount]);
}
/**
 * If IntersectionObserver is missing, we activate inView and fire onViewportEnter
 * on mount. This way, the page will be in the state the author expects users
 * to see it in for everyone.
 */
function useMissingIntersectionObserver(shouldObserve, state, visualElement, _a) {
    var _b = _a.fallback, fallback = _b === void 0 ? true : _b;
    (0,external_react_.useEffect)(function () {
        if (!shouldObserve || !fallback)
            return;
        if (process/* env */.O !== "production") {
            (0,warn_once/* warnOnce */.O)(false, "IntersectionObserver not available on this device. whileInView animations will trigger on mount.");
        }
        /**
         * Fire this in an rAF because, at this point, the animation state
         * won't have flushed for the first time and there's certain logic in
         * there that behaves differently on the initial animation.
         *
         * This hook should be quite rarely called so setting this in an rAF
         * is preferred to changing the behaviour of the animation state.
         */
        requestAnimationFrame(function () {
            var _a;
            state.hasEnteredView = true;
            var onViewportEnter = visualElement.getProps().onViewportEnter;
            onViewportEnter === null || onViewportEnter === void 0 ? void 0 : onViewportEnter(null);
            (_a = visualElement.animationState) === null || _a === void 0 ? void 0 : _a.setActive(types/* AnimationType.InView */.r.InView, true);
        });
    }, [shouldObserve]);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/utils/make-renderless-component.mjs
var make_renderless_component = __webpack_require__(5445);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/gestures.mjs






var gestureAnimations = {
    inView: (0,make_renderless_component/* makeRenderlessComponent */.x)(useViewport),
    tap: (0,make_renderless_component/* makeRenderlessComponent */.x)(useTapGesture),
    focus: (0,make_renderless_component/* makeRenderlessComponent */.x)(useFocusGesture),
    hover: (0,make_renderless_component/* makeRenderlessComponent */.x)(useHoverGesture),
};




/***/ }),

/***/ 1283:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "U": function() { return /* binding */ layoutFeatures; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(9073);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
var use_presence = __webpack_require__(5947);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var LayoutGroupContext = __webpack_require__(5364);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var SwitchLayoutGroupContext = __webpack_require__(1705);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/node/state.mjs
var state = __webpack_require__(3083);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/styles/scale-border-radius.mjs


function pixelsToPercent(pixels, axis) {
    if (axis.max === axis.min)
        return 0;
    return (pixels / (axis.max - axis.min)) * 100;
}
/**
 * We always correct borderRadius as a percentage rather than pixels to reduce paints.
 * For example, if you are projecting a box that is 100px wide with a 10px borderRadius
 * into a box that is 200px wide with a 20px borderRadius, that is actually a 10%
 * borderRadius in both states. If we animate between the two in pixels that will trigger
 * a paint each time. If we animate between the two in percentage we'll avoid a paint.
 */
var correctBorderRadius = {
    correct: function (latest, node) {
        if (!node.target)
            return latest;
        /**
         * If latest is a string, if it's a percentage we can return immediately as it's
         * going to be stretched appropriately. Otherwise, if it's a pixel, convert it to a number.
         */
        if (typeof latest === "string") {
            if (units.px.test(latest)) {
                latest = parseFloat(latest);
            }
            else {
                return latest;
            }
        }
        /**
         * If latest is a number, it's a pixel value. We use the current viewportBox to calculate that
         * pixel value as a percentage of each axis
         */
        var x = pixelsToPercent(latest, node.target.x);
        var y = pixelsToPercent(latest, node.target.y);
        return "".concat(x, "% ").concat(y, "%");
    },
};



// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/mix.mjs
var mix = __webpack_require__(2453);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/complex/index.mjs
var complex = __webpack_require__(8407);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/css-variables-conversion.mjs
var css_variables_conversion = __webpack_require__(7539);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/styles/scale-box-shadow.mjs




var varToken = "_$css";
var correctBoxShadow = {
    correct: function (latest, _a) {
        var treeScale = _a.treeScale, projectionDelta = _a.projectionDelta;
        var original = latest;
        /**
         * We need to first strip and store CSS variables from the string.
         */
        var containsCSSVariables = latest.includes("var(");
        var cssVariables = [];
        if (containsCSSVariables) {
            latest = latest.replace(css_variables_conversion/* cssVariableRegex */.Xp, function (match) {
                cssVariables.push(match);
                return varToken;
            });
        }
        var shadow = complex/* complex.parse */.P.parse(latest);
        // TODO: Doesn't support multiple shadows
        if (shadow.length > 5)
            return original;
        var template = complex/* complex.createTransformer */.P.createTransformer(latest);
        var offset = typeof shadow[0] !== "number" ? 1 : 0;
        // Calculate the overall context scale
        var xScale = projectionDelta.x.scale * treeScale.x;
        var yScale = projectionDelta.y.scale * treeScale.y;
        shadow[0 + offset] /= xScale;
        shadow[1 + offset] /= yScale;
        /**
         * Ideally we'd correct x and y scales individually, but because blur and
         * spread apply to both we have to take a scale average and apply that instead.
         * We could potentially improve the outcome of this by incorporating the ratio between
         * the two scales.
         */
        var averageScale = (0,mix/* mix */.C)(xScale, yScale, 0.5);
        // Blur
        if (typeof shadow[2 + offset] === "number")
            shadow[2 + offset] /= averageScale;
        // Spread
        if (typeof shadow[3 + offset] === "number")
            shadow[3 + offset] /= averageScale;
        var output = template(shadow);
        if (containsCSSVariables) {
            var i_1 = 0;
            output = output.replace(varToken, function () {
                var cssVariable = cssVariables[i_1];
                i_1++;
                return cssVariable;
            });
        }
        return output;
    },
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/styles/scale-correction.mjs
var scale_correction = __webpack_require__(4561);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/layout/MeasureLayout.mjs











var MeasureLayoutWithContext = /** @class */ (function (_super) {
    (0,tslib_es6.__extends)(MeasureLayoutWithContext, _super);
    function MeasureLayoutWithContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * This only mounts projection nodes for components that
     * need measuring, we might want to do it for all components
     * in order to incorporate transforms
     */
    MeasureLayoutWithContext.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, visualElement = _a.visualElement, layoutGroup = _a.layoutGroup, switchLayoutGroup = _a.switchLayoutGroup, layoutId = _a.layoutId;
        var projection = visualElement.projection;
        (0,scale_correction/* addScaleCorrector */.B)(defaultScaleCorrectors);
        if (projection) {
            if (layoutGroup === null || layoutGroup === void 0 ? void 0 : layoutGroup.group)
                layoutGroup.group.add(projection);
            if ((switchLayoutGroup === null || switchLayoutGroup === void 0 ? void 0 : switchLayoutGroup.register) && layoutId) {
                switchLayoutGroup.register(projection);
            }
            projection.root.didUpdate();
            projection.addEventListener("animationComplete", function () {
                _this.safeToRemove();
            });
            projection.setOptions((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, projection.options), { onExitComplete: function () { return _this.safeToRemove(); } }));
        }
        state/* globalProjectionState.hasEverUpdated */.V.hasEverUpdated = true;
    };
    MeasureLayoutWithContext.prototype.getSnapshotBeforeUpdate = function (prevProps) {
        var _this = this;
        var _a = this.props, layoutDependency = _a.layoutDependency, visualElement = _a.visualElement, drag = _a.drag, isPresent = _a.isPresent;
        var projection = visualElement.projection;
        if (!projection)
            return null;
        /**
         * TODO: We use this data in relegate to determine whether to
         * promote a previous element. There's no guarantee its presence data
         * will have updated by this point - if a bug like this arises it will
         * have to be that we markForRelegation and then find a new lead some other way,
         * perhaps in didUpdate
         */
        projection.isPresent = isPresent;
        if (drag ||
            prevProps.layoutDependency !== layoutDependency ||
            layoutDependency === undefined) {
            projection.willUpdate();
        }
        else {
            this.safeToRemove();
        }
        if (prevProps.isPresent !== isPresent) {
            if (isPresent) {
                projection.promote();
            }
            else if (!projection.relegate()) {
                /**
                 * If there's another stack member taking over from this one,
                 * it's in charge of the exit animation and therefore should
                 * be in charge of the safe to remove. Otherwise we call it here.
                 */
                es/* default.postRender */.ZP.postRender(function () {
                    var _a;
                    if (!((_a = projection.getStack()) === null || _a === void 0 ? void 0 : _a.members.length)) {
                        _this.safeToRemove();
                    }
                });
            }
        }
        return null;
    };
    MeasureLayoutWithContext.prototype.componentDidUpdate = function () {
        var projection = this.props.visualElement.projection;
        if (projection) {
            projection.root.didUpdate();
            if (!projection.currentAnimation && projection.isLead()) {
                this.safeToRemove();
            }
        }
    };
    MeasureLayoutWithContext.prototype.componentWillUnmount = function () {
        var _a = this.props, visualElement = _a.visualElement, layoutGroup = _a.layoutGroup, promoteContext = _a.switchLayoutGroup;
        var projection = visualElement.projection;
        if (projection) {
            projection.scheduleCheckAfterUnmount();
            if (layoutGroup === null || layoutGroup === void 0 ? void 0 : layoutGroup.group)
                layoutGroup.group.remove(projection);
            if (promoteContext === null || promoteContext === void 0 ? void 0 : promoteContext.deregister)
                promoteContext.deregister(projection);
        }
    };
    MeasureLayoutWithContext.prototype.safeToRemove = function () {
        var safeToRemove = this.props.safeToRemove;
        safeToRemove === null || safeToRemove === void 0 ? void 0 : safeToRemove();
    };
    MeasureLayoutWithContext.prototype.render = function () {
        return null;
    };
    return MeasureLayoutWithContext;
}(external_react_.Component));
function MeasureLayout(props) {
    var _a = (0,tslib_es6.__read)((0,use_presence/* usePresence */.oO)(), 2), isPresent = _a[0], safeToRemove = _a[1];
    var layoutGroup = (0,external_react_.useContext)(LayoutGroupContext/* LayoutGroupContext */.p);
    return (external_react_.createElement(MeasureLayoutWithContext, (0,tslib_es6.__assign)({}, props, { layoutGroup: layoutGroup, switchLayoutGroup: (0,external_react_.useContext)(SwitchLayoutGroupContext/* SwitchLayoutGroupContext */.g), isPresent: isPresent, safeToRemove: safeToRemove })));
}
var defaultScaleCorrectors = {
    borderRadius: (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, correctBorderRadius), { applyTo: [
            "borderTopLeftRadius",
            "borderTopRightRadius",
            "borderBottomLeftRadius",
            "borderBottomRightRadius",
        ] }),
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow,
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/layout/index.mjs


var layoutFeatures = {
    measureLayout: MeasureLayout,
};




/***/ }),

/***/ 7641:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "F": function() { return /* binding */ createMotionComponent; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/process.mjs
var process = __webpack_require__(9304);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/features/definitions.mjs
var definitions = __webpack_require__(9442);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/LazyContext.mjs
var LazyContext = __webpack_require__(398);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/use-features.mjs








var featureNames = Object.keys(definitions/* featureDefinitions */.A);
var numFeatures = featureNames.length;
/**
 * Load features via renderless components based on the provided MotionProps.
 */
function useFeatures(props, visualElement, preloadedFeatures) {
    var features = [];
    var lazyContext = (0,external_react_.useContext)(LazyContext/* LazyContext */.u);
    if (!visualElement)
        return null;
    /**
     * If we're in development mode, check to make sure we're not rendering a motion component
     * as a child of LazyMotion, as this will break the file-size benefits of using it.
     */
    if (process/* env */.O !== "production" && preloadedFeatures && lazyContext.strict) {
        (0,dist.invariant)(false, "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.");
    }
    for (var i = 0; i < numFeatures; i++) {
        var name_1 = featureNames[i];
        var _a = definitions/* featureDefinitions */.A[name_1], isEnabled = _a.isEnabled, Component = _a.Component;
        /**
         * It might be possible in the future to use this moment to
         * dynamically request functionality. In initial tests this
         * was producing a lot of duplication amongst bundles.
         */
        if (isEnabled(props) && Component) {
            features.push(external_react_.createElement(Component, (0,tslib_es6.__assign)({ key: name_1 }, props, { visualElement: visualElement })));
        }
    }
    return features;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var MotionConfigContext = __webpack_require__(6014);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var MotionContext = __webpack_require__(4451);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/PresenceContext.mjs
var PresenceContext = __webpack_require__(240);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var use_isomorphic_effect = __webpack_require__(8868);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-reduced-motion.mjs
var use_reduced_motion = __webpack_require__(6240);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs







function useVisualElement(Component, visualState, props, createVisualElement) {
    var lazyContext = (0,external_react_.useContext)(LazyContext/* LazyContext */.u);
    var parent = (0,MotionContext/* useVisualElementContext */.B)();
    var presenceContext = (0,external_react_.useContext)(PresenceContext/* PresenceContext */.O);
    var shouldReduceMotion = (0,use_reduced_motion/* useReducedMotionConfig */.h)();
    var visualElementRef = (0,external_react_.useRef)(undefined);
    /**
     * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
     */
    if (!createVisualElement)
        createVisualElement = lazyContext.renderer;
    if (!visualElementRef.current && createVisualElement) {
        visualElementRef.current = createVisualElement(Component, {
            visualState: visualState,
            parent: parent,
            props: props,
            presenceId: presenceContext === null || presenceContext === void 0 ? void 0 : presenceContext.id,
            blockInitialAnimation: (presenceContext === null || presenceContext === void 0 ? void 0 : presenceContext.initial) === false,
            shouldReduceMotion: shouldReduceMotion,
        });
    }
    var visualElement = visualElementRef.current;
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () {
        visualElement === null || visualElement === void 0 ? void 0 : visualElement.syncRender();
    });
    (0,external_react_.useEffect)(function () {
        var _a;
        (_a = visualElement === null || visualElement === void 0 ? void 0 : visualElement.animationState) === null || _a === void 0 ? void 0 : _a.animateChanges();
    });
    (0,use_isomorphic_effect/* useIsomorphicLayoutEffect */.L)(function () { return function () { return visualElement === null || visualElement === void 0 ? void 0 : visualElement.notifyUnmount(); }; }, []);
    return visualElement;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
var is_ref_object = __webpack_require__(1804);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs



/**
 * Creates a ref function that, when called, hydrates the provided
 * external ref and VisualElement.
 */
function useMotionRef(visualState, visualElement, externalRef) {
    return (0,external_react_.useCallback)(function (instance) {
        var _a;
        instance && ((_a = visualState.mount) === null || _a === void 0 ? void 0 : _a.call(visualState, instance));
        if (visualElement) {
            instance
                ? visualElement.mount(instance)
                : visualElement.unmount();
        }
        if (externalRef) {
            if (typeof externalRef === "function") {
                externalRef(instance);
            }
            else if ((0,is_ref_object/* isRefObject */.I)(externalRef)) {
                externalRef.current = instance;
            }
        }
    }, 
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [visualElement]);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/variants.mjs
var variants = __webpack_require__(7909);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs


function getCurrentTreeVariants(props, context) {
    if ((0,variants/* checkIfControllingVariants */.O6)(props)) {
        var initial = props.initial, animate = props.animate;
        return {
            initial: initial === false || (0,variants/* isVariantLabel */.$L)(initial)
                ? initial
                : undefined,
            animate: (0,variants/* isVariantLabel */.$L)(animate) ? animate : undefined,
        };
    }
    return props.inherit !== false ? context : {};
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/context/MotionContext/create.mjs




function useCreateMotionContext(props) {
    var _a = getCurrentTreeVariants(props, (0,external_react_.useContext)(MotionContext/* MotionContext */.v)), initial = _a.initial, animate = _a.animate;
    return (0,external_react_.useMemo)(function () { return ({ initial: initial, animate: animate }); }, [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
    return Array.isArray(prop) ? prop.join(" ") : prop;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/is-browser.mjs
var is_browser = __webpack_require__(1741);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/use-constant.mjs
var use_constant = __webpack_require__(6681);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/node/state.mjs
var state = __webpack_require__(3083);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/node/id.mjs



var id = 1;
function useProjectionId() {
    return (0,use_constant/* useConstant */.h)(function () {
        if (state/* globalProjectionState.hasEverUpdated */.V.hasEverUpdated) {
            return id++;
        }
    });
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var LayoutGroupContext = __webpack_require__(5364);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var SwitchLayoutGroupContext = __webpack_require__(1705);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/features/use-projection.mjs




function useProjection(projectionId, _a, visualElement, ProjectionNodeConstructor) {
    var _b;
    var layoutId = _a.layoutId, layout = _a.layout, drag = _a.drag, dragConstraints = _a.dragConstraints, layoutScroll = _a.layoutScroll;
    var initialPromotionConfig = (0,external_react_.useContext)(SwitchLayoutGroupContext/* SwitchLayoutGroupContext */.g);
    if (!ProjectionNodeConstructor ||
        !visualElement ||
        (visualElement === null || visualElement === void 0 ? void 0 : visualElement.projection)) {
        return;
    }
    visualElement.projection = new ProjectionNodeConstructor(projectionId, visualElement.getLatestValues(), (_b = visualElement.parent) === null || _b === void 0 ? void 0 : _b.projection);
    visualElement.projection.setOptions({
        layoutId: layoutId,
        layout: layout,
        alwaysMeasureLayout: Boolean(drag) || (dragConstraints && (0,is_ref_object/* isRefObject */.I)(dragConstraints)),
        visualElement: visualElement,
        scheduleRender: function () { return visualElement.scheduleRender(); },
        /**
         * TODO: Update options in an effect. This could be tricky as it'll be too late
         * to update by the time layout animations run.
         * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
         * ensuring it gets called if there's no potential layout animations.
         *
         */
        animationType: typeof layout === "string" ? layout : "both",
        initialPromotionConfig: initialPromotionConfig,
        layoutScroll: layoutScroll,
    });
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/utils/VisualElementHandler.mjs



var VisualElementHandler = /** @class */ (function (_super) {
    (0,tslib_es6.__extends)(VisualElementHandler, _super);
    function VisualElementHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Update visual element props as soon as we know this update is going to be commited.
     */
    VisualElementHandler.prototype.getSnapshotBeforeUpdate = function () {
        this.updateProps();
        return null;
    };
    VisualElementHandler.prototype.componentDidUpdate = function () { };
    VisualElementHandler.prototype.updateProps = function () {
        var _a = this.props, visualElement = _a.visualElement, props = _a.props;
        if (visualElement)
            visualElement.setProps(props);
    };
    VisualElementHandler.prototype.render = function () {
        return this.props.children;
    };
    return VisualElementHandler;
}(external_react_.Component));



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/motion/index.mjs
















/**
 * Create a `motion` component.
 *
 * This function accepts a Component argument, which can be either a string (ie "div"
 * for `motion.div`), or an actual React component.
 *
 * Alongside this is a config option which provides a way of rendering the provided
 * component "offline", or outside the React render cycle.
 */
function createMotionComponent(_a) {
    var preloadedFeatures = _a.preloadedFeatures, createVisualElement = _a.createVisualElement, projectionNodeConstructor = _a.projectionNodeConstructor, useRender = _a.useRender, useVisualState = _a.useVisualState, Component = _a.Component;
    preloadedFeatures && (0,definitions/* loadFeatures */.K)(preloadedFeatures);
    function MotionComponent(props, externalRef) {
        var layoutId = useLayoutId(props);
        props = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, props), { layoutId: layoutId });
        /**
         * If we're rendering in a static environment, we only visually update the component
         * as a result of a React-rerender rather than interactions or animations. This
         * means we don't need to load additional memory structures like VisualElement,
         * or any gesture/animation features.
         */
        var config = (0,external_react_.useContext)(MotionConfigContext/* MotionConfigContext */._);
        var features = null;
        var context = useCreateMotionContext(props);
        /**
         * Create a unique projection ID for this component. If a new component is added
         * during a layout animation we'll use this to query the DOM and hydrate its ref early, allowing
         * us to measure it as soon as any layout effect flushes pending layout animations.
         *
         * Performance note: It'd be better not to have to search the DOM for these elements.
         * For newly-entering components it could be enough to only correct treeScale, in which
         * case we could mount in a scale-correction mode. This wouldn't be enough for
         * shared element transitions however. Perhaps for those we could revert to a root node
         * that gets forceRendered and layout animations are triggered on its layout effect.
         */
        var projectionId = config.isStatic ? undefined : useProjectionId();
        /**
         *
         */
        var visualState = useVisualState(props, config.isStatic);
        if (!config.isStatic && is_browser/* isBrowser */.j) {
            /**
             * Create a VisualElement for this component. A VisualElement provides a common
             * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
             * providing a way of rendering to these APIs outside of the React render loop
             * for more performant animations and interactions
             */
            context.visualElement = useVisualElement(Component, visualState, (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, config), props), createVisualElement);
            useProjection(projectionId, props, context.visualElement, projectionNodeConstructor ||
                definitions/* featureDefinitions.projectionNodeConstructor */.A.projectionNodeConstructor);
            /**
             * Load Motion gesture and animation features. These are rendered as renderless
             * components so each feature can optionally make use of React lifecycle methods.
             */
            features = useFeatures(props, context.visualElement, preloadedFeatures);
        }
        /**
         * The mount order and hierarchy is specific to ensure our element ref
         * is hydrated by the time features fire their effects.
         */
        return (external_react_.createElement(VisualElementHandler, { visualElement: context.visualElement, props: (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, config), props) },
            features,
            external_react_.createElement(MotionContext/* MotionContext.Provider */.v.Provider, { value: context }, useRender(Component, props, projectionId, useMotionRef(visualState, context.visualElement, externalRef), visualState, config.isStatic, context.visualElement))));
    }
    return (0,external_react_.forwardRef)(MotionComponent);
}
function useLayoutId(_a) {
    var _b;
    var layoutId = _a.layoutId;
    var layoutGroupId = (_b = (0,external_react_.useContext)(LayoutGroupContext/* LayoutGroupContext */.p)) === null || _b === void 0 ? void 0 : _b.id;
    return layoutGroupId && layoutId !== undefined
        ? layoutGroupId + "-" + layoutId
        : layoutId;
}




/***/ }),

/***/ 6816:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "j": function() { return /* binding */ isForcedMotionValue; }
/* harmony export */ });
/* harmony import */ var _projection_styles_scale_correction_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4561);
/* harmony import */ var _render_html_utils_transform_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4714);



function isForcedMotionValue(key, _a) {
    var layout = _a.layout, layoutId = _a.layoutId;
    return ((0,_render_html_utils_transform_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isTransformProp */ ._c)(key) ||
        (0,_render_html_utils_transform_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isTransformOriginProp */ .Ee)(key) ||
        ((layout || layoutId !== undefined) &&
            (!!_projection_styles_scale_correction_mjs__WEBPACK_IMPORTED_MODULE_1__/* .scaleCorrectors */ .P[key] || key === "opacity")));
}




/***/ }),

/***/ 5445:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": function() { return /* binding */ makeRenderlessComponent; }
/* harmony export */ });
var makeRenderlessComponent = function (hook) { return function (props) {
    hook(props);
    return null;
}; };




/***/ }),

/***/ 5180:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": function() { return /* binding */ makeUseVisualState; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(655);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _animation_utils_is_animation_controls_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3077);
/* harmony import */ var _context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(240);
/* harmony import */ var _render_utils_variants_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7909);
/* harmony import */ var _utils_use_constant_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6681);
/* harmony import */ var _value_utils_resolve_motion_value_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6399);
/* harmony import */ var _context_MotionContext_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4451);









function makeState(_a, props, context, presenceContext) {
    var scrapeMotionValuesFromProps = _a.scrapeMotionValuesFromProps, createRenderState = _a.createRenderState, onMount = _a.onMount;
    var state = {
        latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps),
        renderState: createRenderState(),
    };
    if (onMount) {
        state.mount = function (instance) { return onMount(props, instance, state); };
    }
    return state;
}
var makeUseVisualState = function (config) {
    return function (props, isStatic) {
        var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_MotionContext_index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .MotionContext */ .v);
        var presenceContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_PresenceContext_mjs__WEBPACK_IMPORTED_MODULE_2__/* .PresenceContext */ .O);
        return isStatic
            ? makeState(config, props, context, presenceContext)
            : (0,_utils_use_constant_mjs__WEBPACK_IMPORTED_MODULE_3__/* .useConstant */ .h)(function () {
                return makeState(config, props, context, presenceContext);
            });
    };
};
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
    var values = {};
    var blockInitialAnimation = (presenceContext === null || presenceContext === void 0 ? void 0 : presenceContext.initial) === false;
    var motionValues = scrapeMotionValues(props);
    for (var key in motionValues) {
        values[key] = (0,_value_utils_resolve_motion_value_mjs__WEBPACK_IMPORTED_MODULE_4__/* .resolveMotionValue */ .b)(motionValues[key]);
    }
    var initial = props.initial, animate = props.animate;
    var isControllingVariants = (0,_render_utils_variants_mjs__WEBPACK_IMPORTED_MODULE_5__/* .checkIfControllingVariants */ .O6)(props);
    var isVariantNode = (0,_render_utils_variants_mjs__WEBPACK_IMPORTED_MODULE_5__/* .checkIfVariantNode */ .e8)(props);
    if (context &&
        isVariantNode &&
        !isControllingVariants &&
        props.inherit !== false) {
        initial !== null && initial !== void 0 ? initial : (initial = context.initial);
        animate !== null && animate !== void 0 ? animate : (animate = context.animate);
    }
    var initialAnimationIsBlocked = blockInitialAnimation || initial === false;
    var variantToSet = initialAnimationIsBlocked ? animate : initial;
    if (variantToSet &&
        typeof variantToSet !== "boolean" &&
        !(0,_animation_utils_is_animation_controls_mjs__WEBPACK_IMPORTED_MODULE_6__/* .isAnimationControls */ .H)(variantToSet)) {
        var list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
        list.forEach(function (definition) {
            var resolved = (0,_render_utils_variants_mjs__WEBPACK_IMPORTED_MODULE_5__/* .resolveVariantFromProps */ .oQ)(props, definition);
            if (!resolved)
                return;
            var transitionEnd = resolved.transitionEnd; resolved.transition; var target = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__rest)(resolved, ["transitionEnd", "transition"]);
            for (var key in target) {
                var valueTarget = target[key];
                if (Array.isArray(valueTarget)) {
                    /**
                     * Take final keyframe if the initial animation is blocked because
                     * we want to initialise at the end of that blocked animation.
                     */
                    var index = initialAnimationIsBlocked
                        ? valueTarget.length - 1
                        : 0;
                    valueTarget = valueTarget[index];
                }
                if (valueTarget !== null) {
                    values[key] = valueTarget;
                }
            }
            for (var key in transitionEnd)
                values[key] = transitionEnd[key];
        });
    }
    return values;
}




/***/ }),

/***/ 9630:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ isValidMotionProp; }
/* harmony export */ });
/**
 * A list of all valid MotionProps.
 *
 * @privateRemarks
 * This doesn't throw if a `MotionProp` name is missing - it should.
 */
var validMotionProps = new Set([
    "initial",
    "animate",
    "exit",
    "style",
    "variants",
    "transition",
    "transformTemplate",
    "transformValues",
    "custom",
    "inherit",
    "layout",
    "layoutId",
    "layoutDependency",
    "onLayoutAnimationStart",
    "onLayoutAnimationComplete",
    "onLayoutMeasure",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "drag",
    "dragControls",
    "dragListener",
    "dragConstraints",
    "dragDirectionLock",
    "dragSnapToOrigin",
    "_dragX",
    "_dragY",
    "dragElastic",
    "dragMomentum",
    "dragPropagation",
    "dragTransition",
    "whileDrag",
    "onPan",
    "onPanStart",
    "onPanEnd",
    "onPanSessionStart",
    "onTap",
    "onTapStart",
    "onTapCancel",
    "onHoverStart",
    "onHoverEnd",
    "whileFocus",
    "whileTap",
    "whileHover",
    "whileInView",
    "onViewportEnter",
    "onViewportLeave",
    "viewport",
    "layoutScroll",
]);
/**
 * Check whether a prop name is a valid `MotionProp` key.
 *
 * @param key - Name of the property to check
 * @returns `true` is key is a valid `MotionProp`.
 *
 * @public
 */
function isValidMotionProp(key) {
    return validMotionProps.has(key);
}




/***/ }),

/***/ 6117:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d7": function() { return /* binding */ transformBoxPoints; },
/* harmony export */   "i8": function() { return /* binding */ convertBoundingBoxToBox; },
/* harmony export */   "z2": function() { return /* binding */ convertBoxToBoundingBox; }
/* harmony export */ });
/**
 * Bounding boxes tend to be defined as top, left, right, bottom. For various operations
 * it's easier to consider each axis individually. This function returns a bounding box
 * as a map of single-axis min/max values.
 */
function convertBoundingBoxToBox(_a) {
    var top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
    return {
        x: { min: left, max: right },
        y: { min: top, max: bottom },
    };
}
function convertBoxToBoundingBox(_a) {
    var x = _a.x, y = _a.y;
    return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
/**
 * Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
 * provided by Framer to allow measured points to be corrected for device scaling. This is used
 * when measuring DOM elements and DOM event points.
 */
function transformBoxPoints(point, transformPoint) {
    if (!transformPoint)
        return point;
    var topLeft = transformPoint({ x: point.left, y: point.top });
    var bottomRight = transformPoint({ x: point.right, y: point.bottom });
    return {
        top: topLeft.y,
        left: topLeft.x,
        bottom: bottomRight.y,
        right: bottomRight.x,
    };
}




/***/ }),

/***/ 6000:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D2": function() { return /* binding */ transformBox; },
/* harmony export */   "YY": function() { return /* binding */ applyTreeDeltas; },
/* harmony export */   "am": function() { return /* binding */ translateAxis; },
/* harmony export */   "o2": function() { return /* binding */ applyBoxDelta; },
/* harmony export */   "q2": function() { return /* binding */ scalePoint; }
/* harmony export */ });
/* unused harmony exports applyAxisDelta, applyPointDelta, transformAxis */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(655);
/* harmony import */ var popmotion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2453);
/* harmony import */ var _utils_has_transform_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9527);




/**
 * Scales a point based on a factor and an originPoint
 */
function scalePoint(point, scale, originPoint) {
    var distanceFromOrigin = point - originPoint;
    var scaled = scale * distanceFromOrigin;
    return originPoint + scaled;
}
/**
 * Applies a translate/scale delta to a point
 */
function applyPointDelta(point, translate, scale, originPoint, boxScale) {
    if (boxScale !== undefined) {
        point = scalePoint(point, boxScale, originPoint);
    }
    return scalePoint(point, scale, originPoint) + translate;
}
/**
 * Applies a translate/scale delta to an axis
 */
function applyAxisDelta(axis, translate, scale, originPoint, boxScale) {
    if (translate === void 0) { translate = 0; }
    if (scale === void 0) { scale = 1; }
    axis.min = applyPointDelta(axis.min, translate, scale, originPoint, boxScale);
    axis.max = applyPointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
 * Applies a translate/scale delta to a box
 */
function applyBoxDelta(box, _a) {
    var x = _a.x, y = _a.y;
    applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
    applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
/**
 * Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
 * in a tree upon our box before then calculating how to project it into our desired viewport-relative box
 *
 * This is the final nested loop within updateLayoutDelta for future refactoring
 */
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition) {
    var _a, _b;
    if (isSharedTransition === void 0) { isSharedTransition = false; }
    var treeLength = treePath.length;
    if (!treeLength)
        return;
    // Reset the treeScale
    treeScale.x = treeScale.y = 1;
    var node;
    var delta;
    for (var i = 0; i < treeLength; i++) {
        node = treePath[i];
        delta = node.projectionDelta;
        if (((_b = (_a = node.instance) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.display) === "contents")
            continue;
        if (isSharedTransition &&
            node.options.layoutScroll &&
            node.scroll &&
            node !== node.root) {
            transformBox(box, { x: -node.scroll.x, y: -node.scroll.y });
        }
        if (delta) {
            // Incoporate each ancestor's scale into a culmulative treeScale for this component
            treeScale.x *= delta.x.scale;
            treeScale.y *= delta.y.scale;
            // Apply each ancestor's calculated delta into this component's recorded layout box
            applyBoxDelta(box, delta);
        }
        if (isSharedTransition && (0,_utils_has_transform_mjs__WEBPACK_IMPORTED_MODULE_0__/* .hasTransform */ .u)(node.latestValues)) {
            transformBox(box, node.latestValues);
        }
    }
}
function translateAxis(axis, distance) {
    axis.min = axis.min + distance;
    axis.max = axis.max + distance;
}
/**
 * Apply a transform to an axis from the latest resolved motion values.
 * This function basically acts as a bridge between a flat motion value map
 * and applyAxisDelta
 */
function transformAxis(axis, transforms, _a) {
    var _b = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(_a, 3), key = _b[0], scaleKey = _b[1], originKey = _b[2];
    var axisOrigin = transforms[originKey] !== undefined ? transforms[originKey] : 0.5;
    var originPoint = (0,popmotion__WEBPACK_IMPORTED_MODULE_2__/* .mix */ .C)(axis.min, axis.max, axisOrigin);
    // Apply the axis delta to the final axis
    applyAxisDelta(axis, transforms[key], transforms[scaleKey], originPoint, transforms.scale);
}
/**
 * The names of the motion values we want to apply as translation, scale and origin.
 */
var xKeys = ["x", "scaleX", "originX"];
var yKeys = ["y", "scaleY", "originY"];
/**
 * Apply a transform to a box from the latest resolved motion values.
 */
function transformBox(box, transform) {
    transformAxis(box.x, transform, xKeys);
    transformAxis(box.y, transform, yKeys);
}




/***/ }),

/***/ 6645:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JO": function() { return /* binding */ calcLength; },
/* harmony export */   "b3": function() { return /* binding */ calcRelativePosition; },
/* harmony export */   "tf": function() { return /* binding */ calcRelativeBox; },
/* harmony export */   "y$": function() { return /* binding */ calcBoxDelta; }
/* harmony export */ });
/* unused harmony exports calcAxisDelta, calcRelativeAxis, calcRelativeAxisPosition, isNear */
/* harmony import */ var popmotion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8677);
/* harmony import */ var popmotion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2453);


function calcLength(axis) {
    return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
    if (target === void 0) { target = 0; }
    if (maxDistance === void 0) { maxDistance = 0.01; }
    return (0,popmotion__WEBPACK_IMPORTED_MODULE_0__/* .distance */ .T)(value, target) < maxDistance;
}
function calcAxisDelta(delta, source, target, origin) {
    if (origin === void 0) { origin = 0.5; }
    delta.origin = origin;
    delta.originPoint = (0,popmotion__WEBPACK_IMPORTED_MODULE_1__/* .mix */ .C)(source.min, source.max, delta.origin);
    delta.scale = calcLength(target) / calcLength(source);
    if (isNear(delta.scale, 1, 0.0001) || isNaN(delta.scale))
        delta.scale = 1;
    delta.translate =
        (0,popmotion__WEBPACK_IMPORTED_MODULE_1__/* .mix */ .C)(target.min, target.max, delta.origin) - delta.originPoint;
    if (isNear(delta.translate) || isNaN(delta.translate))
        delta.translate = 0;
}
function calcBoxDelta(delta, source, target, origin) {
    calcAxisDelta(delta.x, source.x, target.x, origin === null || origin === void 0 ? void 0 : origin.originX);
    calcAxisDelta(delta.y, source.y, target.y, origin === null || origin === void 0 ? void 0 : origin.originY);
}
function calcRelativeAxis(target, relative, parent) {
    target.min = parent.min + relative.min;
    target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
    calcRelativeAxis(target.x, relative.x, parent.x);
    calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout, parent) {
    target.min = layout.min - parent.min;
    target.max = target.min + calcLength(layout);
}
function calcRelativePosition(target, layout, parent) {
    calcRelativeAxisPosition(target.x, layout.x, parent.x);
    calcRelativeAxisPosition(target.y, layout.y, parent.y);
}




/***/ }),

/***/ 1512:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dO": function() { return /* binding */ createBox; },
/* harmony export */   "wc": function() { return /* binding */ createDelta; }
/* harmony export */ });
/* unused harmony exports createAxis, createAxisDelta */
var createAxisDelta = function () { return ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0,
}); };
var createDelta = function () { return ({
    x: createAxisDelta(),
    y: createAxisDelta(),
}); };
var createAxis = function () { return ({ min: 0, max: 0 }); };
var createBox = function () { return ({
    x: createAxis(),
    y: createAxis(),
}); };




/***/ }),

/***/ 7046:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "u": function() { return /* binding */ HTMLProjectionNode; },
  "J": function() { return /* binding */ rootProjectionNode; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(9073);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/mix.mjs
var mix = __webpack_require__(2453);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/animate.mjs
var animate = __webpack_require__(2064);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/subscription-manager.mjs
var subscription_manager = __webpack_require__(1560);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/easing/index.mjs + 1 modules
var easing = __webpack_require__(4710);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/progress.mjs
var progress = __webpack_require__(9326);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/animation/mix-values.mjs



var borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
var numBorders = borders.length;
var asNumber = function (value) {
    return typeof value === "string" ? parseFloat(value) : value;
};
var isPx = function (value) {
    return typeof value === "number" || units.px.test(value);
};
function mixValues(target, follow, lead, progress, shouldCrossfadeOpacity, isOnlyMember) {
    var _a, _b, _c, _d;
    if (shouldCrossfadeOpacity) {
        target.opacity = (0,mix/* mix */.C)(0, 
        // (follow?.opacity as number) ?? 0,
        // TODO Reinstate this if only child
        (_a = lead.opacity) !== null && _a !== void 0 ? _a : 1, easeCrossfadeIn(progress));
        target.opacityExit = (0,mix/* mix */.C)((_b = follow.opacity) !== null && _b !== void 0 ? _b : 1, 0, easeCrossfadeOut(progress));
    }
    else if (isOnlyMember) {
        target.opacity = (0,mix/* mix */.C)((_c = follow.opacity) !== null && _c !== void 0 ? _c : 1, (_d = lead.opacity) !== null && _d !== void 0 ? _d : 1, progress);
    }
    /**
     * Mix border radius
     */
    for (var i = 0; i < numBorders; i++) {
        var borderLabel = "border".concat(borders[i], "Radius");
        var followRadius = getRadius(follow, borderLabel);
        var leadRadius = getRadius(lead, borderLabel);
        if (followRadius === undefined && leadRadius === undefined)
            continue;
        followRadius || (followRadius = 0);
        leadRadius || (leadRadius = 0);
        var canMix = followRadius === 0 ||
            leadRadius === 0 ||
            isPx(followRadius) === isPx(leadRadius);
        if (canMix) {
            target[borderLabel] = Math.max((0,mix/* mix */.C)(asNumber(followRadius), asNumber(leadRadius), progress), 0);
            if (units/* percent.test */.aQ.test(leadRadius) || units/* percent.test */.aQ.test(followRadius)) {
                target[borderLabel] += "%";
            }
        }
        else {
            target[borderLabel] = leadRadius;
        }
    }
    /**
     * Mix rotation
     */
    if (follow.rotate || lead.rotate) {
        target.rotate = (0,mix/* mix */.C)(follow.rotate || 0, lead.rotate || 0, progress);
    }
}
function getRadius(values, radiusName) {
    var _a;
    return (_a = values[radiusName]) !== null && _a !== void 0 ? _a : values.borderRadius;
}
// /**
//  * We only want to mix the background color if there's a follow element
//  * that we're not crossfading opacity between. For instance with switch
//  * AnimateSharedLayout animations, this helps the illusion of a continuous
//  * element being animated but also cuts down on the number of paints triggered
//  * for elements where opacity is doing that work for us.
//  */
// if (
//     !hasFollowElement &&
//     latestLeadValues.backgroundColor &&
//     latestFollowValues.backgroundColor
// ) {
//     /**
//      * This isn't ideal performance-wise as mixColor is creating a new function every frame.
//      * We could probably create a mixer that runs at the start of the animation but
//      * the idea behind the crossfader is that it runs dynamically between two potentially
//      * changing targets (ie opacity or borderRadius may be animating independently via variants)
//      */
//     leadState.backgroundColor = followState.backgroundColor = mixColor(
//         latestFollowValues.backgroundColor as string,
//         latestLeadValues.backgroundColor as string
//     )(p)
// }
var easeCrossfadeIn = compress(0, 0.5, easing/* circOut */.Bn);
var easeCrossfadeOut = compress(0.5, 0.95, easing/* linear */.GE);
function compress(min, max, easing) {
    return function (p) {
        // Could replace ifs with clamp
        if (p < min)
            return 0;
        if (p > max)
            return 1;
        return easing((0,progress/* progress */.Y)(min, max, p));
    };
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/copy.mjs
/**
 * Reset an axis to the provided origin box.
 *
 * This is a mutative operation.
 */
function copyAxisInto(axis, originAxis) {
    axis.min = originAxis.min;
    axis.max = originAxis.max;
}
/**
 * Reset a box to the provided origin box.
 *
 * This is a mutative operation.
 */
function copyBoxInto(box, originBox) {
    copyAxisInto(box.x, originBox.x);
    copyAxisInto(box.y, originBox.y);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/delta-apply.mjs
var delta_apply = __webpack_require__(6000);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/delta-calc.mjs
var delta_calc = __webpack_require__(6645);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/delta-remove.mjs





/**
 * Remove a delta from a point. This is essentially the steps of applyPointDelta in reverse
 */
function removePointDelta(point, translate, scale, originPoint, boxScale) {
    point -= translate;
    point = (0,delta_apply/* scalePoint */.q2)(point, 1 / scale, originPoint);
    if (boxScale !== undefined) {
        point = (0,delta_apply/* scalePoint */.q2)(point, 1 / boxScale, originPoint);
    }
    return point;
}
/**
 * Remove a delta from an axis. This is essentially the steps of applyAxisDelta in reverse
 */
function removeAxisDelta(axis, translate, scale, origin, boxScale, originAxis, sourceAxis) {
    if (translate === void 0) { translate = 0; }
    if (scale === void 0) { scale = 1; }
    if (origin === void 0) { origin = 0.5; }
    if (originAxis === void 0) { originAxis = axis; }
    if (sourceAxis === void 0) { sourceAxis = axis; }
    if (units/* percent.test */.aQ.test(translate)) {
        translate = parseFloat(translate);
        var relativeProgress = (0,mix/* mix */.C)(sourceAxis.min, sourceAxis.max, translate / 100);
        translate = relativeProgress - sourceAxis.min;
    }
    if (typeof translate !== "number")
        return;
    var originPoint = (0,mix/* mix */.C)(originAxis.min, originAxis.max, origin);
    if (axis === originAxis)
        originPoint -= translate;
    axis.min = removePointDelta(axis.min, translate, scale, originPoint, boxScale);
    axis.max = removePointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
 * Remove a transforms from an axis. This is essentially the steps of applyAxisTransforms in reverse
 * and acts as a bridge between motion values and removeAxisDelta
 */
function removeAxisTransforms(axis, transforms, _a, origin, sourceAxis) {
    var _b = (0,tslib_es6.__read)(_a, 3), key = _b[0], scaleKey = _b[1], originKey = _b[2];
    removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
/**
 * The names of the motion values we want to apply as translation, scale and origin.
 */
var xKeys = ["x", "scaleX", "originX"];
var yKeys = ["y", "scaleY", "originY"];
/**
 * Remove a transforms from an box. This is essentially the steps of applyAxisBox in reverse
 * and acts as a bridge between motion values and removeAxisDelta
 */
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
    removeAxisTransforms(box.x, transforms, xKeys, originBox === null || originBox === void 0 ? void 0 : originBox.x, sourceBox === null || sourceBox === void 0 ? void 0 : sourceBox.x);
    removeAxisTransforms(box.y, transforms, yKeys, originBox === null || originBox === void 0 ? void 0 : originBox.y, sourceBox === null || sourceBox === void 0 ? void 0 : sourceBox.y);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/models.mjs
var models = __webpack_require__(1512);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/utils/transitions.mjs + 5 modules
var transitions = __webpack_require__(6522);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/geometry/utils.mjs
function isAxisDeltaZero(delta) {
    return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
    return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function boxEquals(a, b) {
    return (a.x.min === b.x.min &&
        a.x.max === b.x.max &&
        a.y.min === b.y.min &&
        a.y.max === b.y.max);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/array.mjs
var array = __webpack_require__(10);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/shared/stack.mjs


var NodeStack = /** @class */ (function () {
    function NodeStack() {
        this.members = [];
    }
    NodeStack.prototype.add = function (node) {
        (0,array/* addUniqueItem */.y4)(this.members, node);
        node.scheduleRender();
    };
    NodeStack.prototype.remove = function (node) {
        (0,array/* removeItem */.cl)(this.members, node);
        if (node === this.prevLead) {
            this.prevLead = undefined;
        }
        if (node === this.lead) {
            var prevLead = this.members[this.members.length - 1];
            if (prevLead) {
                this.promote(prevLead);
            }
        }
    };
    NodeStack.prototype.relegate = function (node) {
        var indexOfNode = this.members.findIndex(function (member) { return node === member; });
        if (indexOfNode === 0)
            return false;
        /**
         * Find the next projection node that is present
         */
        var prevLead;
        for (var i = indexOfNode; i >= 0; i--) {
            var member = this.members[i];
            if (member.isPresent !== false) {
                prevLead = member;
                break;
            }
        }
        if (prevLead) {
            this.promote(prevLead);
            return true;
        }
        else {
            return false;
        }
    };
    NodeStack.prototype.promote = function (node, preserveFollowOpacity) {
        var _a;
        var prevLead = this.lead;
        if (node === prevLead)
            return;
        this.prevLead = prevLead;
        this.lead = node;
        node.show();
        if (prevLead) {
            prevLead.instance && prevLead.scheduleRender();
            node.scheduleRender();
            node.resumeFrom = prevLead;
            if (preserveFollowOpacity) {
                node.resumeFrom.preserveOpacity = true;
            }
            if (prevLead.snapshot) {
                node.snapshot = prevLead.snapshot;
                node.snapshot.latestValues =
                    prevLead.animationValues || prevLead.latestValues;
                node.snapshot.isShared = true;
            }
            if ((_a = node.root) === null || _a === void 0 ? void 0 : _a.isUpdating) {
                node.isLayoutDirty = true;
            }
            var crossfade = node.options.crossfade;
            if (crossfade === false) {
                prevLead.hide();
            }
            /**
             * TODO:
             *   - Test border radius when previous node was deleted
             *   - boxShadow mixing
             *   - Shared between element A in scrolled container and element B (scroll stays the same or changes)
             *   - Shared between element A in transformed container and element B (transform stays the same or changes)
             *   - Shared between element A in scrolled page and element B (scroll stays the same or changes)
             * ---
             *   - Crossfade opacity of root nodes
             *   - layoutId changes after animation
             *   - layoutId changes mid animation
             */
        }
    };
    NodeStack.prototype.exitAnimationComplete = function () {
        this.members.forEach(function (node) {
            var _a, _b, _c, _d, _e;
            (_b = (_a = node.options).onExitComplete) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_e = (_c = node.resumingFrom) === null || _c === void 0 ? void 0 : (_d = _c.options).onExitComplete) === null || _e === void 0 ? void 0 : _e.call(_d);
        });
    };
    NodeStack.prototype.scheduleRender = function () {
        this.members.forEach(function (node) {
            node.instance && node.scheduleRender(false);
        });
    };
    /**
     * Clear any leads that have been removed this render to prevent them from being
     * used in future animations and to prevent memory leaks
     */
    NodeStack.prototype.removeLeadSnapshot = function () {
        if (this.lead && this.lead.snapshot) {
            this.lead.snapshot = undefined;
        }
    };
    return NodeStack;
}());



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/styles/scale-correction.mjs
var scale_correction = __webpack_require__(4561);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/styles/transform.mjs
var identityProjection = "translate3d(0px, 0px, 0) scale(1, 1) scale(1, 1)";
function buildProjectionTransform(delta, treeScale, latestTransform) {
    /**
     * The translations we use to calculate are always relative to the viewport coordinate space.
     * But when we apply scales, we also scale the coordinate space of an element and its children.
     * For instance if we have a treeScale (the culmination of all parent scales) of 0.5 and we need
     * to move an element 100 pixels, we actually need to move it 200 in within that scaled space.
     */
    var xTranslate = delta.x.translate / treeScale.x;
    var yTranslate = delta.y.translate / treeScale.y;
    var transform = "translate3d(".concat(xTranslate, "px, ").concat(yTranslate, "px, 0) ");
    /**
     * Apply scale correction for the tree transform.
     * This will apply scale to the screen-orientated axes.
     */
    transform += "scale(".concat(1 / treeScale.x, ", ").concat(1 / treeScale.y, ") ");
    if (latestTransform) {
        var rotate = latestTransform.rotate, rotateX = latestTransform.rotateX, rotateY = latestTransform.rotateY;
        if (rotate)
            transform += "rotate(".concat(rotate, "deg) ");
        if (rotateX)
            transform += "rotateX(".concat(rotateX, "deg) ");
        if (rotateY)
            transform += "rotateY(".concat(rotateY, "deg) ");
    }
    /**
     * Apply scale to match the size of the element to the size we want it.
     * This will apply scale to the element-orientated axes.
     */
    var elementScaleX = delta.x.scale * treeScale.x;
    var elementScaleY = delta.y.scale * treeScale.y;
    transform += "scale(".concat(elementScaleX, ", ").concat(elementScaleY, ")");
    return transform === identityProjection ? "none" : transform;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/utils/each-axis.mjs
var each_axis = __webpack_require__(1730);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/utils/has-transform.mjs
var has_transform = __webpack_require__(9527);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/transform.mjs
var transform = __webpack_require__(4714);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/flat-tree.mjs + 1 modules
var flat_tree = __webpack_require__(1419);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/utils/resolve-motion-value.mjs
var resolve_motion_value = __webpack_require__(6399);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/node/state.mjs
var state = __webpack_require__(3083);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/node/create-projection-node.mjs























/**
 * We use 1000 as the animation target as 0-1000 maps better to pixels than 0-1
 * which has a noticeable difference in spring animations
 */
var animationTarget = 1000;
function createProjectionNode(_a) {
    var attachResizeListener = _a.attachResizeListener, defaultParent = _a.defaultParent, measureScroll = _a.measureScroll, checkIsScrollRoot = _a.checkIsScrollRoot, resetTransform = _a.resetTransform;
    return /** @class */ (function () {
        function ProjectionNode(id, latestValues, parent) {
            var _this = this;
            if (latestValues === void 0) { latestValues = {}; }
            if (parent === void 0) { parent = defaultParent === null || defaultParent === void 0 ? void 0 : defaultParent(); }
            /**
             * A Set containing all this component's children. This is used to iterate
             * through the children.
             *
             * TODO: This could be faster to iterate as a flat array stored on the root node.
             */
            this.children = new Set();
            /**
             * Options for the node. We use this to configure what kind of layout animations
             * we should perform (if any).
             */
            this.options = {};
            /**
             * We use this to detect when its safe to shut down part of a projection tree.
             * We have to keep projecting children for scale correction and relative projection
             * until all their parents stop performing layout animations.
             */
            this.isTreeAnimating = false;
            this.isAnimationBlocked = false;
            /**
             * Flag to true if we think this layout has been changed. We can't always know this,
             * currently we set it to true every time a component renders, or if it has a layoutDependency
             * if that has changed between renders. Additionally, components can be grouped by LayoutGroup
             * and if one node is dirtied, they all are.
             */
            this.isLayoutDirty = false;
            /**
             * Block layout updates for instant layout transitions throughout the tree.
             */
            this.updateManuallyBlocked = false;
            this.updateBlockedByResize = false;
            /**
             * Set to true between the start of the first `willUpdate` call and the end of the `didUpdate`
             * call.
             */
            this.isUpdating = false;
            /**
             * If this is an SVG element we currently disable projection transforms
             */
            this.isSVG = false;
            /**
             * Flag to true (during promotion) if a node doing an instant layout transition needs to reset
             * its projection styles.
             */
            this.needsReset = false;
            /**
             * Flags whether this node should have its transform reset prior to measuring.
             */
            this.shouldResetTransform = false;
            /**
             * An object representing the calculated contextual/accumulated/tree scale.
             * This will be used to scale calculcated projection transforms, as these are
             * calculated in screen-space but need to be scaled for elements to actually
             * make it to their calculated destinations.
             *
             * TODO: Lazy-init
             */
            this.treeScale = { x: 1, y: 1 };
            /**
             *
             */
            this.eventHandlers = new Map();
            // Note: Currently only running on root node
            this.potentialNodes = new Map();
            this.checkUpdateFailed = function () {
                if (_this.isUpdating) {
                    _this.isUpdating = false;
                    _this.clearAllSnapshots();
                }
            };
            this.updateProjection = function () {
                _this.nodes.forEach(resolveTargetDelta);
                _this.nodes.forEach(calcProjection);
            };
            this.hasProjected = false;
            this.isVisible = true;
            this.animationProgress = 0;
            /**
             * Shared layout
             */
            // TODO Only running on root node
            this.sharedNodes = new Map();
            this.id = id;
            this.latestValues = latestValues;
            this.root = parent ? parent.root || parent : this;
            this.path = parent ? (0,tslib_es6.__spreadArray)((0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(parent.path), false), [parent], false) : [];
            this.parent = parent;
            this.depth = parent ? parent.depth + 1 : 0;
            id && this.root.registerPotentialNode(id, this);
            for (var i = 0; i < this.path.length; i++) {
                this.path[i].shouldResetTransform = true;
            }
            if (this.root === this)
                this.nodes = new flat_tree/* FlatTree */.E();
        }
        ProjectionNode.prototype.addEventListener = function (name, handler) {
            if (!this.eventHandlers.has(name)) {
                this.eventHandlers.set(name, new subscription_manager/* SubscriptionManager */.L());
            }
            return this.eventHandlers.get(name).add(handler);
        };
        ProjectionNode.prototype.notifyListeners = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var subscriptionManager = this.eventHandlers.get(name);
            subscriptionManager === null || subscriptionManager === void 0 ? void 0 : subscriptionManager.notify.apply(subscriptionManager, (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(args), false));
        };
        ProjectionNode.prototype.hasListeners = function (name) {
            return this.eventHandlers.has(name);
        };
        ProjectionNode.prototype.registerPotentialNode = function (id, node) {
            this.potentialNodes.set(id, node);
        };
        /**
         * Lifecycles
         */
        ProjectionNode.prototype.mount = function (instance, isLayoutDirty) {
            var _this = this;
            var _a;
            if (isLayoutDirty === void 0) { isLayoutDirty = false; }
            if (this.instance)
                return;
            this.isSVG =
                instance instanceof SVGElement && instance.tagName !== "svg";
            this.instance = instance;
            var _b = this.options, layoutId = _b.layoutId, layout = _b.layout, visualElement = _b.visualElement;
            if (visualElement && !visualElement.getInstance()) {
                visualElement.mount(instance);
            }
            this.root.nodes.add(this);
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.children.add(this);
            this.id && this.root.potentialNodes.delete(this.id);
            if (isLayoutDirty && (layout || layoutId)) {
                this.isLayoutDirty = true;
            }
            if (attachResizeListener) {
                var unblockTimeout_1;
                var resizeUnblockUpdate_1 = function () {
                    return (_this.root.updateBlockedByResize = false);
                };
                attachResizeListener(instance, function () {
                    _this.root.updateBlockedByResize = true;
                    clearTimeout(unblockTimeout_1);
                    unblockTimeout_1 = window.setTimeout(resizeUnblockUpdate_1, 250);
                    if (state/* globalProjectionState.hasAnimatedSinceResize */.V.hasAnimatedSinceResize) {
                        state/* globalProjectionState.hasAnimatedSinceResize */.V.hasAnimatedSinceResize = false;
                        _this.nodes.forEach(finishAnimation);
                    }
                });
            }
            if (layoutId) {
                this.root.registerSharedNode(layoutId, this);
            }
            // Only register the handler if it requires layout animation
            if (this.options.animate !== false &&
                visualElement &&
                (layoutId || layout)) {
                this.addEventListener("didUpdate", function (_a) {
                    var _b, _c, _d, _e, _f;
                    var delta = _a.delta, hasLayoutChanged = _a.hasLayoutChanged, hasRelativeTargetChanged = _a.hasRelativeTargetChanged, newLayout = _a.layout;
                    if (_this.isTreeAnimationBlocked()) {
                        _this.target = undefined;
                        _this.relativeTarget = undefined;
                        return;
                    }
                    // TODO: Check here if an animation exists
                    var layoutTransition = (_c = (_b = _this.options.transition) !== null && _b !== void 0 ? _b : visualElement.getDefaultTransition()) !== null && _c !== void 0 ? _c : defaultLayoutTransition;
                    var _g = visualElement.getProps(), onLayoutAnimationStart = _g.onLayoutAnimationStart, onLayoutAnimationComplete = _g.onLayoutAnimationComplete;
                    /**
                     * The target layout of the element might stay the same,
                     * but its position relative to its parent has changed.
                     */
                    var targetChanged = !_this.targetLayout ||
                        !boxEquals(_this.targetLayout, newLayout) ||
                        hasRelativeTargetChanged;
                    /**
                     * If the layout hasn't seemed to have changed, it might be that the
                     * element is visually in the same place in the document but its position
                     * relative to its parent has indeed changed. So here we check for that.
                     */
                    var hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeTargetChanged;
                    if (((_d = _this.resumeFrom) === null || _d === void 0 ? void 0 : _d.instance) ||
                        hasOnlyRelativeTargetChanged ||
                        (hasLayoutChanged &&
                            (targetChanged || !_this.currentAnimation))) {
                        if (_this.resumeFrom) {
                            _this.resumingFrom = _this.resumeFrom;
                            _this.resumingFrom.resumingFrom = undefined;
                        }
                        _this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
                        var animationOptions = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, (0,transitions/* getValueTransition */.ev)(layoutTransition, "layout")), { onPlay: onLayoutAnimationStart, onComplete: onLayoutAnimationComplete });
                        if (visualElement.shouldReduceMotion) {
                            animationOptions.delay = 0;
                            animationOptions.type = false;
                        }
                        _this.startAnimation(animationOptions);
                    }
                    else {
                        /**
                         * If the layout hasn't changed and we have an animation that hasn't started yet,
                         * finish it immediately. Otherwise it will be animating from a location
                         * that was probably never commited to screen and look like a jumpy box.
                         */
                        if (!hasLayoutChanged &&
                            _this.animationProgress === 0) {
                            _this.finishAnimation();
                        }
                        _this.isLead() && ((_f = (_e = _this.options).onExitComplete) === null || _f === void 0 ? void 0 : _f.call(_e));
                    }
                    _this.targetLayout = newLayout;
                });
            }
        };
        ProjectionNode.prototype.unmount = function () {
            var _a, _b;
            this.options.layoutId && this.willUpdate();
            this.root.nodes.remove(this);
            (_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.remove(this);
            (_b = this.parent) === null || _b === void 0 ? void 0 : _b.children.delete(this);
            this.instance = undefined;
            es/* cancelSync.preRender */.qY.preRender(this.updateProjection);
        };
        // only on the root
        ProjectionNode.prototype.blockUpdate = function () {
            this.updateManuallyBlocked = true;
        };
        ProjectionNode.prototype.unblockUpdate = function () {
            this.updateManuallyBlocked = false;
        };
        ProjectionNode.prototype.isUpdateBlocked = function () {
            return this.updateManuallyBlocked || this.updateBlockedByResize;
        };
        ProjectionNode.prototype.isTreeAnimationBlocked = function () {
            var _a;
            return (this.isAnimationBlocked ||
                ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isTreeAnimationBlocked()) ||
                false);
        };
        // Note: currently only running on root node
        ProjectionNode.prototype.startUpdate = function () {
            var _a;
            if (this.isUpdateBlocked())
                return;
            this.isUpdating = true;
            (_a = this.nodes) === null || _a === void 0 ? void 0 : _a.forEach(resetRotation);
        };
        ProjectionNode.prototype.willUpdate = function (shouldNotifyListeners) {
            var _a, _b, _c;
            if (shouldNotifyListeners === void 0) { shouldNotifyListeners = true; }
            if (this.root.isUpdateBlocked()) {
                (_b = (_a = this.options).onExitComplete) === null || _b === void 0 ? void 0 : _b.call(_a);
                return;
            }
            !this.root.isUpdating && this.root.startUpdate();
            if (this.isLayoutDirty)
                return;
            this.isLayoutDirty = true;
            for (var i = 0; i < this.path.length; i++) {
                var node = this.path[i];
                node.shouldResetTransform = true;
                /**
                 * TODO: Check we haven't updated the scroll
                 * since the last didUpdate
                 */
                node.updateScroll();
            }
            var _d = this.options, layoutId = _d.layoutId, layout = _d.layout;
            if (layoutId === undefined && !layout)
                return;
            var transformTemplate = (_c = this.options.visualElement) === null || _c === void 0 ? void 0 : _c.getProps().transformTemplate;
            this.prevTransformTemplateValue = transformTemplate === null || transformTemplate === void 0 ? void 0 : transformTemplate(this.latestValues, "");
            this.updateSnapshot();
            shouldNotifyListeners && this.notifyListeners("willUpdate");
        };
        // Note: Currently only running on root node
        ProjectionNode.prototype.didUpdate = function () {
            var updateWasBlocked = this.isUpdateBlocked();
            // When doing an instant transition, we skip the layout update,
            // but should still clean up the measurements so that the next
            // snapshot could be taken correctly.
            if (updateWasBlocked) {
                this.unblockUpdate();
                this.clearAllSnapshots();
                this.nodes.forEach(clearMeasurements);
                return;
            }
            if (!this.isUpdating)
                return;
            this.isUpdating = false;
            /**
             * Search for and mount newly-added projection elements.
             *
             * TODO: Every time a new component is rendered we could search up the tree for
             * the closest mounted node and query from there rather than document.
             */
            if (this.potentialNodes.size) {
                this.potentialNodes.forEach(mountNodeEarly);
                this.potentialNodes.clear();
            }
            /**
             * Write
             */
            this.nodes.forEach(resetTransformStyle);
            /**
             * Read ==================
             */
            // Update layout measurements of updated children
            this.nodes.forEach(updateLayout);
            /**
             * Write
             */
            // Notify listeners that the layout is updated
            this.nodes.forEach(notifyLayoutUpdate);
            this.clearAllSnapshots();
            // Flush any scheduled updates
            es/* flushSync.update */.iW.update();
            es/* flushSync.preRender */.iW.preRender();
            es/* flushSync.render */.iW.render();
        };
        ProjectionNode.prototype.clearAllSnapshots = function () {
            this.nodes.forEach(clearSnapshot);
            this.sharedNodes.forEach(removeLeadSnapshots);
        };
        ProjectionNode.prototype.scheduleUpdateProjection = function () {
            es/* default.preRender */.ZP.preRender(this.updateProjection, false, true);
        };
        ProjectionNode.prototype.scheduleCheckAfterUnmount = function () {
            var _this = this;
            /**
             * If the unmounting node is in a layoutGroup and did trigger a willUpdate,
             * we manually call didUpdate to give a chance to the siblings to animate.
             * Otherwise, cleanup all snapshots to prevents future nodes from reusing them.
             */
            es/* default.postRender */.ZP.postRender(function () {
                if (_this.isLayoutDirty) {
                    _this.root.didUpdate();
                }
                else {
                    _this.root.checkUpdateFailed();
                }
            });
        };
        /**
         * Update measurements
         */
        ProjectionNode.prototype.updateSnapshot = function () {
            if (this.snapshot || !this.instance)
                return;
            var measured = this.measure();
            var layout = this.removeTransform(this.removeElementScroll(measured));
            roundBox(layout);
            this.snapshot = {
                measured: measured,
                layout: layout,
                latestValues: {},
            };
        };
        ProjectionNode.prototype.updateLayout = function () {
            var _a;
            if (!this.instance)
                return;
            // TODO: Incorporate into a forwarded scroll offset
            this.updateScroll();
            if (!(this.options.alwaysMeasureLayout && this.isLead()) &&
                !this.isLayoutDirty) {
                return;
            }
            /**
             * When a node is mounted, it simply resumes from the prevLead's
             * snapshot instead of taking a new one, but the ancestors scroll
             * might have updated while the prevLead is unmounted. We need to
             * update the scroll again to make sure the layout we measure is
             * up to date.
             */
            if (this.resumeFrom && !this.resumeFrom.instance) {
                for (var i = 0; i < this.path.length; i++) {
                    var node = this.path[i];
                    node.updateScroll();
                }
            }
            var measured = this.measure();
            roundBox(measured);
            var prevLayout = this.layout;
            this.layout = {
                measured: measured,
                actual: this.removeElementScroll(measured),
            };
            this.layoutCorrected = (0,models/* createBox */.dO)();
            this.isLayoutDirty = false;
            this.projectionDelta = undefined;
            this.notifyListeners("measure", this.layout.actual);
            (_a = this.options.visualElement) === null || _a === void 0 ? void 0 : _a.notifyLayoutMeasure(this.layout.actual, prevLayout === null || prevLayout === void 0 ? void 0 : prevLayout.actual);
        };
        ProjectionNode.prototype.updateScroll = function () {
            if (this.options.layoutScroll && this.instance) {
                this.isScrollRoot = checkIsScrollRoot(this.instance);
                this.scroll = measureScroll(this.instance);
            }
        };
        ProjectionNode.prototype.resetTransform = function () {
            var _a;
            if (!resetTransform)
                return;
            var isResetRequested = this.isLayoutDirty || this.shouldResetTransform;
            var hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
            var transformTemplate = (_a = this.options.visualElement) === null || _a === void 0 ? void 0 : _a.getProps().transformTemplate;
            var transformTemplateValue = transformTemplate === null || transformTemplate === void 0 ? void 0 : transformTemplate(this.latestValues, "");
            var transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
            if (isResetRequested &&
                (hasProjection ||
                    (0,has_transform/* hasTransform */.u)(this.latestValues) ||
                    transformTemplateHasChanged)) {
                resetTransform(this.instance, transformTemplateValue);
                this.shouldResetTransform = false;
                this.scheduleRender();
            }
        };
        ProjectionNode.prototype.measure = function () {
            var visualElement = this.options.visualElement;
            if (!visualElement)
                return (0,models/* createBox */.dO)();
            var box = visualElement.measureViewportBox();
            // Remove viewport scroll to give page-relative coordinates
            var scroll = this.root.scroll;
            if (scroll) {
                (0,delta_apply/* translateAxis */.am)(box.x, scroll.x);
                (0,delta_apply/* translateAxis */.am)(box.y, scroll.y);
            }
            return box;
        };
        ProjectionNode.prototype.removeElementScroll = function (box) {
            var boxWithoutScroll = (0,models/* createBox */.dO)();
            copyBoxInto(boxWithoutScroll, box);
            /**
             * Performance TODO: Keep a cumulative scroll offset down the tree
             * rather than loop back up the path.
             */
            for (var i = 0; i < this.path.length; i++) {
                var node = this.path[i];
                var scroll_1 = node.scroll, options = node.options, isScrollRoot = node.isScrollRoot;
                if (node !== this.root && scroll_1 && options.layoutScroll) {
                    /**
                     * If this is a new scroll root, we want to remove all previous scrolls
                     * from the viewport box.
                     */
                    if (isScrollRoot) {
                        copyBoxInto(boxWithoutScroll, box);
                        var rootScroll = this.root.scroll;
                        /**
                         * Undo the application of page scroll that was originally added
                         * to the measured bounding box.
                         */
                        if (rootScroll) {
                            (0,delta_apply/* translateAxis */.am)(boxWithoutScroll.x, -rootScroll.x);
                            (0,delta_apply/* translateAxis */.am)(boxWithoutScroll.y, -rootScroll.y);
                        }
                    }
                    (0,delta_apply/* translateAxis */.am)(boxWithoutScroll.x, scroll_1.x);
                    (0,delta_apply/* translateAxis */.am)(boxWithoutScroll.y, scroll_1.y);
                }
            }
            return boxWithoutScroll;
        };
        ProjectionNode.prototype.applyTransform = function (box, transformOnly) {
            if (transformOnly === void 0) { transformOnly = false; }
            var withTransforms = (0,models/* createBox */.dO)();
            copyBoxInto(withTransforms, box);
            for (var i = 0; i < this.path.length; i++) {
                var node = this.path[i];
                if (!transformOnly &&
                    node.options.layoutScroll &&
                    node.scroll &&
                    node !== node.root) {
                    (0,delta_apply/* transformBox */.D2)(withTransforms, {
                        x: -node.scroll.x,
                        y: -node.scroll.y,
                    });
                }
                if (!(0,has_transform/* hasTransform */.u)(node.latestValues))
                    continue;
                (0,delta_apply/* transformBox */.D2)(withTransforms, node.latestValues);
            }
            if ((0,has_transform/* hasTransform */.u)(this.latestValues)) {
                (0,delta_apply/* transformBox */.D2)(withTransforms, this.latestValues);
            }
            return withTransforms;
        };
        ProjectionNode.prototype.removeTransform = function (box) {
            var _a;
            var boxWithoutTransform = (0,models/* createBox */.dO)();
            copyBoxInto(boxWithoutTransform, box);
            for (var i = 0; i < this.path.length; i++) {
                var node = this.path[i];
                if (!node.instance)
                    continue;
                if (!(0,has_transform/* hasTransform */.u)(node.latestValues))
                    continue;
                (0,has_transform/* hasScale */.L)(node.latestValues) && node.updateSnapshot();
                var sourceBox = (0,models/* createBox */.dO)();
                var nodeBox = node.measure();
                copyBoxInto(sourceBox, nodeBox);
                removeBoxTransforms(boxWithoutTransform, node.latestValues, (_a = node.snapshot) === null || _a === void 0 ? void 0 : _a.layout, sourceBox);
            }
            if ((0,has_transform/* hasTransform */.u)(this.latestValues)) {
                removeBoxTransforms(boxWithoutTransform, this.latestValues);
            }
            return boxWithoutTransform;
        };
        /**
         *
         */
        ProjectionNode.prototype.setTargetDelta = function (delta) {
            this.targetDelta = delta;
            this.root.scheduleUpdateProjection();
        };
        ProjectionNode.prototype.setOptions = function (options) {
            var _a;
            this.options = (0,tslib_es6.__assign)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, this.options), options), { crossfade: (_a = options.crossfade) !== null && _a !== void 0 ? _a : true });
        };
        ProjectionNode.prototype.clearMeasurements = function () {
            this.scroll = undefined;
            this.layout = undefined;
            this.snapshot = undefined;
            this.prevTransformTemplateValue = undefined;
            this.targetDelta = undefined;
            this.target = undefined;
            this.isLayoutDirty = false;
        };
        /**
         * Frame calculations
         */
        ProjectionNode.prototype.resolveTargetDelta = function () {
            var _a;
            var _b = this.options, layout = _b.layout, layoutId = _b.layoutId;
            /**
             * If we have no layout, we can't perform projection, so early return
             */
            if (!this.layout || !(layout || layoutId))
                return;
            /**
             * If we don't have a targetDelta but do have a layout, we can attempt to resolve
             * a relativeParent. This will allow a component to perform scale correction
             * even if no animation has started.
             */
            // TODO If this is unsuccessful this currently happens every frame
            if (!this.targetDelta && !this.relativeTarget) {
                // TODO: This is a semi-repetition of further down this function, make DRY
                this.relativeParent = this.getClosestProjectingParent();
                if (this.relativeParent && this.relativeParent.layout) {
                    this.relativeTarget = (0,models/* createBox */.dO)();
                    this.relativeTargetOrigin = (0,models/* createBox */.dO)();
                    (0,delta_calc/* calcRelativePosition */.b3)(this.relativeTargetOrigin, this.layout.actual, this.relativeParent.layout.actual);
                    copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
                }
            }
            /**
             * If we have no relative target or no target delta our target isn't valid
             * for this frame.
             */
            if (!this.relativeTarget && !this.targetDelta)
                return;
            /**
             * Lazy-init target data structure
             */
            if (!this.target) {
                this.target = (0,models/* createBox */.dO)();
                this.targetWithTransforms = (0,models/* createBox */.dO)();
            }
            /**
             * If we've got a relative box for this component, resolve it into a target relative to the parent.
             */
            if (this.relativeTarget &&
                this.relativeTargetOrigin &&
                ((_a = this.relativeParent) === null || _a === void 0 ? void 0 : _a.target)) {
                (0,delta_calc/* calcRelativeBox */.tf)(this.target, this.relativeTarget, this.relativeParent.target);
                /**
                 * If we've only got a targetDelta, resolve it into a target
                 */
            }
            else if (this.targetDelta) {
                if (Boolean(this.resumingFrom)) {
                    // TODO: This is creating a new object every frame
                    this.target = this.applyTransform(this.layout.actual);
                }
                else {
                    copyBoxInto(this.target, this.layout.actual);
                }
                (0,delta_apply/* applyBoxDelta */.o2)(this.target, this.targetDelta);
            }
            else {
                /**
                 * If no target, use own layout as target
                 */
                copyBoxInto(this.target, this.layout.actual);
            }
            /**
             * If we've been told to attempt to resolve a relative target, do so.
             */
            if (this.attemptToResolveRelativeTarget) {
                this.attemptToResolveRelativeTarget = false;
                this.relativeParent = this.getClosestProjectingParent();
                if (this.relativeParent &&
                    Boolean(this.relativeParent.resumingFrom) ===
                        Boolean(this.resumingFrom) &&
                    !this.relativeParent.options.layoutScroll &&
                    this.relativeParent.target) {
                    this.relativeTarget = (0,models/* createBox */.dO)();
                    this.relativeTargetOrigin = (0,models/* createBox */.dO)();
                    (0,delta_calc/* calcRelativePosition */.b3)(this.relativeTargetOrigin, this.target, this.relativeParent.target);
                    copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
                }
            }
        };
        ProjectionNode.prototype.getClosestProjectingParent = function () {
            if (!this.parent || (0,has_transform/* hasTransform */.u)(this.parent.latestValues))
                return undefined;
            if ((this.parent.relativeTarget || this.parent.targetDelta) &&
                this.parent.layout) {
                return this.parent;
            }
            else {
                return this.parent.getClosestProjectingParent();
            }
        };
        ProjectionNode.prototype.calcProjection = function () {
            var _a;
            var _b = this.options, layout = _b.layout, layoutId = _b.layoutId;
            /**
             * If this section of the tree isn't animating we can
             * delete our target sources for the following frame.
             */
            this.isTreeAnimating = Boolean(((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isTreeAnimating) ||
                this.currentAnimation ||
                this.pendingAnimation);
            if (!this.isTreeAnimating) {
                this.targetDelta = this.relativeTarget = undefined;
            }
            if (!this.layout || !(layout || layoutId))
                return;
            var lead = this.getLead();
            /**
             * Reset the corrected box with the latest values from box, as we're then going
             * to perform mutative operations on it.
             */
            copyBoxInto(this.layoutCorrected, this.layout.actual);
            /**
             * Apply all the parent deltas to this box to produce the corrected box. This
             * is the layout box, as it will appear on screen as a result of the transforms of its parents.
             */
            (0,delta_apply/* applyTreeDeltas */.YY)(this.layoutCorrected, this.treeScale, this.path, Boolean(this.resumingFrom) || this !== lead);
            var target = lead.target;
            if (!target)
                return;
            if (!this.projectionDelta) {
                this.projectionDelta = (0,models/* createDelta */.wc)();
                this.projectionDeltaWithTransform = (0,models/* createDelta */.wc)();
            }
            var prevTreeScaleX = this.treeScale.x;
            var prevTreeScaleY = this.treeScale.y;
            var prevProjectionTransform = this.projectionTransform;
            /**
             * Update the delta between the corrected box and the target box before user-set transforms were applied.
             * This will allow us to calculate the corrected borderRadius and boxShadow to compensate
             * for our layout reprojection, but still allow them to be scaled correctly by the user.
             * It might be that to simplify this we may want to accept that user-set scale is also corrected
             * and we wouldn't have to keep and calc both deltas, OR we could support a user setting
             * to allow people to choose whether these styles are corrected based on just the
             * layout reprojection or the final bounding box.
             */
            (0,delta_calc/* calcBoxDelta */.y$)(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
            this.projectionTransform = buildProjectionTransform(this.projectionDelta, this.treeScale);
            if (this.projectionTransform !== prevProjectionTransform ||
                this.treeScale.x !== prevTreeScaleX ||
                this.treeScale.y !== prevTreeScaleY) {
                this.hasProjected = true;
                this.scheduleRender();
                this.notifyListeners("projectionUpdate", target);
            }
        };
        ProjectionNode.prototype.hide = function () {
            this.isVisible = false;
            // TODO: Schedule render
        };
        ProjectionNode.prototype.show = function () {
            this.isVisible = true;
            // TODO: Schedule render
        };
        ProjectionNode.prototype.scheduleRender = function (notifyAll) {
            var _a, _b, _c;
            if (notifyAll === void 0) { notifyAll = true; }
            (_b = (_a = this.options).scheduleRender) === null || _b === void 0 ? void 0 : _b.call(_a);
            notifyAll && ((_c = this.getStack()) === null || _c === void 0 ? void 0 : _c.scheduleRender());
            if (this.resumingFrom && !this.resumingFrom.instance) {
                this.resumingFrom = undefined;
            }
        };
        ProjectionNode.prototype.setAnimationOrigin = function (delta, hasOnlyRelativeTargetChanged) {
            var _this = this;
            var _a;
            if (hasOnlyRelativeTargetChanged === void 0) { hasOnlyRelativeTargetChanged = false; }
            var snapshot = this.snapshot;
            var snapshotLatestValues = (snapshot === null || snapshot === void 0 ? void 0 : snapshot.latestValues) || {};
            var mixedValues = (0,tslib_es6.__assign)({}, this.latestValues);
            var targetDelta = (0,models/* createDelta */.wc)();
            this.relativeTarget = this.relativeTargetOrigin = undefined;
            this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
            var relativeLayout = (0,models/* createBox */.dO)();
            var isSharedLayoutAnimation = snapshot === null || snapshot === void 0 ? void 0 : snapshot.isShared;
            var isOnlyMember = (((_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.members.length) || 0) <= 1;
            var shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation &&
                !isOnlyMember &&
                this.options.crossfade === true &&
                !this.path.some(hasOpacityCrossfade));
            this.animationProgress = 0;
            this.mixTargetDelta = function (latest) {
                var _a;
                var progress = latest / 1000;
                mixAxisDelta(targetDelta.x, delta.x, progress);
                mixAxisDelta(targetDelta.y, delta.y, progress);
                _this.setTargetDelta(targetDelta);
                if (_this.relativeTarget &&
                    _this.relativeTargetOrigin &&
                    _this.layout &&
                    ((_a = _this.relativeParent) === null || _a === void 0 ? void 0 : _a.layout)) {
                    (0,delta_calc/* calcRelativePosition */.b3)(relativeLayout, _this.layout.actual, _this.relativeParent.layout.actual);
                    mixBox(_this.relativeTarget, _this.relativeTargetOrigin, relativeLayout, progress);
                }
                if (isSharedLayoutAnimation) {
                    _this.animationValues = mixedValues;
                    mixValues(mixedValues, snapshotLatestValues, _this.latestValues, progress, shouldCrossfadeOpacity, isOnlyMember);
                }
                _this.root.scheduleUpdateProjection();
                _this.scheduleRender();
                _this.animationProgress = progress;
            };
            this.mixTargetDelta(0);
        };
        ProjectionNode.prototype.startAnimation = function (options) {
            var _this = this;
            var _a, _b;
            this.notifyListeners("animationStart");
            (_a = this.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop();
            if (this.resumingFrom) {
                (_b = this.resumingFrom.currentAnimation) === null || _b === void 0 ? void 0 : _b.stop();
            }
            if (this.pendingAnimation) {
                es/* cancelSync.update */.qY.update(this.pendingAnimation);
                this.pendingAnimation = undefined;
            }
            /**
             * Start the animation in the next frame to have a frame with progress 0,
             * where the target is the same as when the animation started, so we can
             * calculate the relative positions correctly for instant transitions.
             */
            this.pendingAnimation = es/* default.update */.ZP.update(function () {
                state/* globalProjectionState.hasAnimatedSinceResize */.V.hasAnimatedSinceResize = true;
                _this.currentAnimation = (0,animate/* animate */.j)(0, animationTarget, (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, options), { onUpdate: function (latest) {
                        var _a;
                        _this.mixTargetDelta(latest);
                        (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, latest);
                    }, onComplete: function () {
                        var _a;
                        (_a = options.onComplete) === null || _a === void 0 ? void 0 : _a.call(options);
                        _this.completeAnimation();
                    } }));
                if (_this.resumingFrom) {
                    _this.resumingFrom.currentAnimation = _this.currentAnimation;
                }
                _this.pendingAnimation = undefined;
            });
        };
        ProjectionNode.prototype.completeAnimation = function () {
            var _a;
            if (this.resumingFrom) {
                this.resumingFrom.currentAnimation = undefined;
                this.resumingFrom.preserveOpacity = undefined;
            }
            (_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.exitAnimationComplete();
            this.resumingFrom =
                this.currentAnimation =
                    this.animationValues =
                        undefined;
            this.notifyListeners("animationComplete");
        };
        ProjectionNode.prototype.finishAnimation = function () {
            var _a;
            if (this.currentAnimation) {
                (_a = this.mixTargetDelta) === null || _a === void 0 ? void 0 : _a.call(this, animationTarget);
                this.currentAnimation.stop();
            }
            this.completeAnimation();
        };
        ProjectionNode.prototype.applyTransformsToTarget = function () {
            var _a = this.getLead(), targetWithTransforms = _a.targetWithTransforms, target = _a.target, layout = _a.layout, latestValues = _a.latestValues;
            if (!targetWithTransforms || !target || !layout)
                return;
            copyBoxInto(targetWithTransforms, target);
            /**
             * Apply the latest user-set transforms to the targetBox to produce the targetBoxFinal.
             * This is the final box that we will then project into by calculating a transform delta and
             * applying it to the corrected box.
             */
            (0,delta_apply/* transformBox */.D2)(targetWithTransforms, latestValues);
            /**
             * Update the delta between the corrected box and the final target box, after
             * user-set transforms are applied to it. This will be used by the renderer to
             * create a transform style that will reproject the element from its actual layout
             * into the desired bounding box.
             */
            (0,delta_calc/* calcBoxDelta */.y$)(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
        };
        ProjectionNode.prototype.registerSharedNode = function (layoutId, node) {
            var _a, _b, _c;
            if (!this.sharedNodes.has(layoutId)) {
                this.sharedNodes.set(layoutId, new NodeStack());
            }
            var stack = this.sharedNodes.get(layoutId);
            stack.add(node);
            node.promote({
                transition: (_a = node.options.initialPromotionConfig) === null || _a === void 0 ? void 0 : _a.transition,
                preserveFollowOpacity: (_c = (_b = node.options.initialPromotionConfig) === null || _b === void 0 ? void 0 : _b.shouldPreserveFollowOpacity) === null || _c === void 0 ? void 0 : _c.call(_b, node),
            });
        };
        ProjectionNode.prototype.isLead = function () {
            var stack = this.getStack();
            return stack ? stack.lead === this : true;
        };
        ProjectionNode.prototype.getLead = function () {
            var _a;
            var layoutId = this.options.layoutId;
            return layoutId ? ((_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.lead) || this : this;
        };
        ProjectionNode.prototype.getPrevLead = function () {
            var _a;
            var layoutId = this.options.layoutId;
            return layoutId ? (_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.prevLead : undefined;
        };
        ProjectionNode.prototype.getStack = function () {
            var layoutId = this.options.layoutId;
            if (layoutId)
                return this.root.sharedNodes.get(layoutId);
        };
        ProjectionNode.prototype.promote = function (_a) {
            var _b = _a === void 0 ? {} : _a, needsReset = _b.needsReset, transition = _b.transition, preserveFollowOpacity = _b.preserveFollowOpacity;
            var stack = this.getStack();
            if (stack)
                stack.promote(this, preserveFollowOpacity);
            if (needsReset) {
                this.projectionDelta = undefined;
                this.needsReset = true;
            }
            if (transition)
                this.setOptions({ transition: transition });
        };
        ProjectionNode.prototype.relegate = function () {
            var stack = this.getStack();
            if (stack) {
                return stack.relegate(this);
            }
            else {
                return false;
            }
        };
        ProjectionNode.prototype.resetRotation = function () {
            var visualElement = this.options.visualElement;
            if (!visualElement)
                return;
            // If there's no detected rotation values, we can early return without a forced render.
            var hasRotate = false;
            // Keep a record of all the values we've reset
            var resetValues = {};
            // Check the rotate value of all axes and reset to 0
            for (var i = 0; i < transform/* transformAxes.length */.r$.length; i++) {
                var axis = transform/* transformAxes */.r$[i];
                var key = "rotate" + axis;
                // If this rotation doesn't exist as a motion value, then we don't
                // need to reset it
                if (!visualElement.getStaticValue(key)) {
                    continue;
                }
                hasRotate = true;
                // Record the rotation and then temporarily set it to 0
                resetValues[key] = visualElement.getStaticValue(key);
                visualElement.setStaticValue(key, 0);
            }
            // If there's no rotation values, we don't need to do any more.
            if (!hasRotate)
                return;
            // Force a render of this element to apply the transform with all rotations
            // set to 0.
            visualElement === null || visualElement === void 0 ? void 0 : visualElement.syncRender();
            // Put back all the values we reset
            for (var key in resetValues) {
                visualElement.setStaticValue(key, resetValues[key]);
            }
            // Schedule a render for the next frame. This ensures we won't visually
            // see the element with the reset rotate value applied.
            visualElement.scheduleRender();
        };
        ProjectionNode.prototype.getProjectionStyles = function (styleProp) {
            var _a, _b, _c, _d, _e, _f;
            if (styleProp === void 0) { styleProp = {}; }
            // TODO: Return lifecycle-persistent object
            var styles = {};
            if (!this.instance || this.isSVG)
                return styles;
            if (!this.isVisible) {
                return { visibility: "hidden" };
            }
            else {
                styles.visibility = "";
            }
            var transformTemplate = (_a = this.options.visualElement) === null || _a === void 0 ? void 0 : _a.getProps().transformTemplate;
            if (this.needsReset) {
                this.needsReset = false;
                styles.opacity = "";
                styles.pointerEvents =
                    (0,resolve_motion_value/* resolveMotionValue */.b)(styleProp.pointerEvents) || "";
                styles.transform = transformTemplate
                    ? transformTemplate(this.latestValues, "")
                    : "none";
                return styles;
            }
            var lead = this.getLead();
            if (!this.projectionDelta || !this.layout || !lead.target) {
                var emptyStyles = {};
                if (this.options.layoutId) {
                    emptyStyles.opacity = (_b = this.latestValues.opacity) !== null && _b !== void 0 ? _b : 1;
                    emptyStyles.pointerEvents =
                        (0,resolve_motion_value/* resolveMotionValue */.b)(styleProp.pointerEvents) || "";
                }
                if (this.hasProjected && !(0,has_transform/* hasTransform */.u)(this.latestValues)) {
                    emptyStyles.transform = transformTemplate
                        ? transformTemplate({}, "")
                        : "none";
                    this.hasProjected = false;
                }
                return emptyStyles;
            }
            var valuesToRender = lead.animationValues || lead.latestValues;
            this.applyTransformsToTarget();
            styles.transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
            if (transformTemplate) {
                styles.transform = transformTemplate(valuesToRender, styles.transform);
            }
            var _g = this.projectionDelta, x = _g.x, y = _g.y;
            styles.transformOrigin = "".concat(x.origin * 100, "% ").concat(y.origin * 100, "% 0");
            if (lead.animationValues) {
                /**
                 * If the lead component is animating, assign this either the entering/leaving
                 * opacity
                 */
                styles.opacity =
                    lead === this
                        ? (_d = (_c = valuesToRender.opacity) !== null && _c !== void 0 ? _c : this.latestValues.opacity) !== null && _d !== void 0 ? _d : 1
                        : this.preserveOpacity
                            ? this.latestValues.opacity
                            : valuesToRender.opacityExit;
            }
            else {
                /**
                 * Or we're not animating at all, set the lead component to its actual
                 * opacity and other components to hidden.
                 */
                styles.opacity =
                    lead === this
                        ? (_e = valuesToRender.opacity) !== null && _e !== void 0 ? _e : ""
                        : (_f = valuesToRender.opacityExit) !== null && _f !== void 0 ? _f : 0;
            }
            /**
             * Apply scale correction
             */
            for (var key in scale_correction/* scaleCorrectors */.P) {
                if (valuesToRender[key] === undefined)
                    continue;
                var _h = scale_correction/* scaleCorrectors */.P[key], correct = _h.correct, applyTo = _h.applyTo;
                var corrected = correct(valuesToRender[key], lead);
                if (applyTo) {
                    var num = applyTo.length;
                    for (var i = 0; i < num; i++) {
                        styles[applyTo[i]] = corrected;
                    }
                }
                else {
                    styles[key] = corrected;
                }
            }
            /**
             * Disable pointer events on follow components. This is to ensure
             * that if a follow component covers a lead component it doesn't block
             * pointer events on the lead.
             */
            if (this.options.layoutId) {
                styles.pointerEvents =
                    lead === this
                        ? (0,resolve_motion_value/* resolveMotionValue */.b)(styleProp.pointerEvents) || ""
                        : "none";
            }
            return styles;
        };
        ProjectionNode.prototype.clearSnapshot = function () {
            this.resumeFrom = this.snapshot = undefined;
        };
        // Only run on root
        ProjectionNode.prototype.resetTree = function () {
            this.root.nodes.forEach(function (node) { var _a; return (_a = node.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop(); });
            this.root.nodes.forEach(clearMeasurements);
            this.root.sharedNodes.clear();
        };
        return ProjectionNode;
    }());
}
function updateLayout(node) {
    node.updateLayout();
}
function notifyLayoutUpdate(node) {
    var _a, _b, _c, _d;
    var snapshot = (_b = (_a = node.resumeFrom) === null || _a === void 0 ? void 0 : _a.snapshot) !== null && _b !== void 0 ? _b : node.snapshot;
    if (node.isLead() &&
        node.layout &&
        snapshot &&
        node.hasListeners("didUpdate")) {
        var _e = node.layout, layout_1 = _e.actual, measuredLayout = _e.measured;
        // TODO Maybe we want to also resize the layout snapshot so we don't trigger
        // animations for instance if layout="size" and an element has only changed position
        if (node.options.animationType === "size") {
            (0,each_axis/* eachAxis */.U)(function (axis) {
                var axisSnapshot = snapshot.isShared
                    ? snapshot.measured[axis]
                    : snapshot.layout[axis];
                var length = (0,delta_calc/* calcLength */.JO)(axisSnapshot);
                axisSnapshot.min = layout_1[axis].min;
                axisSnapshot.max = axisSnapshot.min + length;
            });
        }
        else if (node.options.animationType === "position") {
            (0,each_axis/* eachAxis */.U)(function (axis) {
                var axisSnapshot = snapshot.isShared
                    ? snapshot.measured[axis]
                    : snapshot.layout[axis];
                var length = (0,delta_calc/* calcLength */.JO)(layout_1[axis]);
                axisSnapshot.max = axisSnapshot.min + length;
            });
        }
        var layoutDelta = (0,models/* createDelta */.wc)();
        (0,delta_calc/* calcBoxDelta */.y$)(layoutDelta, layout_1, snapshot.layout);
        var visualDelta = (0,models/* createDelta */.wc)();
        if (snapshot.isShared) {
            (0,delta_calc/* calcBoxDelta */.y$)(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measured);
        }
        else {
            (0,delta_calc/* calcBoxDelta */.y$)(visualDelta, layout_1, snapshot.layout);
        }
        var hasLayoutChanged = !isDeltaZero(layoutDelta);
        var hasRelativeTargetChanged = false;
        if (!node.resumeFrom) {
            node.relativeParent = node.getClosestProjectingParent();
            /**
             * If the relativeParent is itself resuming from a different element then
             * the relative snapshot is not relavent
             */
            if (node.relativeParent && !node.relativeParent.resumeFrom) {
                var _f = node.relativeParent, parentSnapshot = _f.snapshot, parentLayout = _f.layout;
                if (parentSnapshot && parentLayout) {
                    var relativeSnapshot = (0,models/* createBox */.dO)();
                    (0,delta_calc/* calcRelativePosition */.b3)(relativeSnapshot, snapshot.layout, parentSnapshot.layout);
                    var relativeLayout = (0,models/* createBox */.dO)();
                    (0,delta_calc/* calcRelativePosition */.b3)(relativeLayout, layout_1, parentLayout.actual);
                    if (!boxEquals(relativeSnapshot, relativeLayout)) {
                        hasRelativeTargetChanged = true;
                    }
                }
            }
        }
        node.notifyListeners("didUpdate", {
            layout: layout_1,
            snapshot: snapshot,
            delta: visualDelta,
            layoutDelta: layoutDelta,
            hasLayoutChanged: hasLayoutChanged,
            hasRelativeTargetChanged: hasRelativeTargetChanged,
        });
    }
    else if (node.isLead()) {
        (_d = (_c = node.options).onExitComplete) === null || _d === void 0 ? void 0 : _d.call(_c);
    }
    /**
     * Clearing transition
     * TODO: Investigate why this transition is being passed in as {type: false } from Framer
     * and why we need it at all
     */
    node.options.transition = undefined;
}
function clearSnapshot(node) {
    node.clearSnapshot();
}
function clearMeasurements(node) {
    node.clearMeasurements();
}
function resetTransformStyle(node) {
    var visualElement = node.options.visualElement;
    if (visualElement === null || visualElement === void 0 ? void 0 : visualElement.getProps().onBeforeLayoutMeasure) {
        visualElement.notifyBeforeLayoutMeasure();
    }
    node.resetTransform();
}
function finishAnimation(node) {
    node.finishAnimation();
    node.targetDelta = node.relativeTarget = node.target = undefined;
}
function resolveTargetDelta(node) {
    node.resolveTargetDelta();
}
function calcProjection(node) {
    node.calcProjection();
}
function resetRotation(node) {
    node.resetRotation();
}
function removeLeadSnapshots(stack) {
    stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
    output.translate = (0,mix/* mix */.C)(delta.translate, 0, p);
    output.scale = (0,mix/* mix */.C)(delta.scale, 1, p);
    output.origin = delta.origin;
    output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
    output.min = (0,mix/* mix */.C)(from.min, to.min, p);
    output.max = (0,mix/* mix */.C)(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
    mixAxis(output.x, from.x, to.x, p);
    mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
    return (node.animationValues && node.animationValues.opacityExit !== undefined);
}
var defaultLayoutTransition = {
    duration: 0.45,
    ease: [0.4, 0, 0.1, 1],
};
function mountNodeEarly(node, id) {
    /**
     * Rather than searching the DOM from document we can search the
     * path for the deepest mounted ancestor and search from there
     */
    var searchNode = node.root;
    for (var i = node.path.length - 1; i >= 0; i--) {
        if (Boolean(node.path[i].instance)) {
            searchNode = node.path[i];
            break;
        }
    }
    var searchElement = searchNode && searchNode !== node.root ? searchNode.instance : document;
    var element = searchElement.querySelector("[data-projection-id=\"".concat(id, "\"]"));
    if (element)
        node.mount(element, true);
}
function roundAxis(axis) {
    axis.min = Math.round(axis.min);
    axis.max = Math.round(axis.max);
}
function roundBox(box) {
    roundAxis(box.x);
    roundAxis(box.y);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/events/use-dom-event.mjs
var use_dom_event = __webpack_require__(1756);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/node/DocumentProjectionNode.mjs



var DocumentProjectionNode = createProjectionNode({
    attachResizeListener: function (ref, notify) { return (0,use_dom_event/* addDomEvent */.E)(ref, "resize", notify); },
    measureScroll: function () { return ({
        x: document.documentElement.scrollLeft || document.body.scrollLeft,
        y: document.documentElement.scrollTop || document.body.scrollTop,
    }); },
    checkIsScrollRoot: function () { return true; },
});



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs



var rootProjectionNode = {
    current: undefined,
};
var HTMLProjectionNode = createProjectionNode({
    measureScroll: function (instance) { return ({
        x: instance.scrollLeft,
        y: instance.scrollTop,
    }); },
    defaultParent: function () {
        if (!rootProjectionNode.current) {
            var documentNode = new DocumentProjectionNode(0, {});
            documentNode.mount(window);
            documentNode.setOptions({ layoutScroll: true });
            rootProjectionNode.current = documentNode;
        }
        return rootProjectionNode.current;
    },
    resetTransform: function (instance, value) {
        instance.style.transform = value !== null && value !== void 0 ? value : "none";
    },
    checkIsScrollRoot: function (instance) {
        return Boolean(window.getComputedStyle(instance).position === "fixed");
    },
});




/***/ }),

/***/ 3083:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "V": function() { return /* binding */ globalProjectionState; }
/* harmony export */ });
/**
 * This should only ever be modified on the client otherwise it'll
 * persist through server requests. If we need instanced states we
 * could lazy-init via root.
 */
var globalProjectionState = {
    /**
     * Global flag as to whether the tree has animated since the last time
     * we resized the window
     */
    hasAnimatedSinceResize: true,
    /**
     * We set this to true once, on the first update. Any nodes added to the tree beyond that
     * update will be given a `data-projection-id` attribute.
     */
    hasEverUpdated: false,
};




/***/ }),

/***/ 4561:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "B": function() { return /* binding */ addScaleCorrector; },
/* harmony export */   "P": function() { return /* binding */ scaleCorrectors; }
/* harmony export */ });
var scaleCorrectors = {};
function addScaleCorrector(correctors) {
    Object.assign(scaleCorrectors, correctors);
}




/***/ }),

/***/ 1730:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "U": function() { return /* binding */ eachAxis; }
/* harmony export */ });
function eachAxis(callback) {
    return [callback("x"), callback("y")];
}




/***/ }),

/***/ 9527:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ hasScale; },
/* harmony export */   "u": function() { return /* binding */ hasTransform; }
/* harmony export */ });
function isIdentityScale(scale) {
    return scale === undefined || scale === 1;
}
function hasScale(_a) {
    var scale = _a.scale, scaleX = _a.scaleX, scaleY = _a.scaleY;
    return (!isIdentityScale(scale) ||
        !isIdentityScale(scaleX) ||
        !isIdentityScale(scaleY));
}
function hasTransform(values) {
    return (hasScale(values) ||
        hasTranslate(values.x) ||
        hasTranslate(values.y) ||
        values.z ||
        values.rotate ||
        values.rotateX ||
        values.rotateY);
}
function hasTranslate(value) {
    return value && value !== "0%";
}




/***/ }),

/***/ 6460:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": function() { return /* binding */ measureViewportBox; },
/* harmony export */   "z": function() { return /* binding */ measurePageBox; }
/* harmony export */ });
/* harmony import */ var _geometry_conversion_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6117);
/* harmony import */ var _geometry_delta_apply_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6000);



function measureViewportBox(instance, transformPoint) {
    return (0,_geometry_conversion_mjs__WEBPACK_IMPORTED_MODULE_0__/* .convertBoundingBoxToBox */ .i8)((0,_geometry_conversion_mjs__WEBPACK_IMPORTED_MODULE_0__/* .transformBoxPoints */ .d7)(instance.getBoundingClientRect(), transformPoint));
}
function measurePageBox(element, rootProjectionNode, transformPagePoint) {
    var viewportBox = measureViewportBox(element, transformPagePoint);
    var scroll = rootProjectionNode.scroll;
    if (scroll) {
        (0,_geometry_delta_apply_mjs__WEBPACK_IMPORTED_MODULE_1__/* .translateAxis */ .am)(viewportBox.x, scroll.x);
        (0,_geometry_delta_apply_mjs__WEBPACK_IMPORTED_MODULE_1__/* .translateAxis */ .am)(viewportBox.y, scroll.y);
    }
    return viewportBox;
}




/***/ }),

/***/ 1891:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "b": function() { return /* binding */ createDomVisualElement; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/index.mjs + 2 modules
var render = __webpack_require__(404);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/setters.mjs + 3 modules
var setters = __webpack_require__(5759);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/build-styles.mjs + 2 modules
var build_styles = __webpack_require__(8057);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/is-css-variable.mjs
var is_css_variable = __webpack_require__(7630);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/css-variables-conversion.mjs
var css_variables_conversion = __webpack_require__(7539);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/index.mjs
var numbers = __webpack_require__(1248);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/utils/is-keyframes-target.mjs
var is_keyframes_target = __webpack_require__(8488);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/transform.mjs
var transform = __webpack_require__(4714);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/dimensions.mjs + 1 modules
var dimensions = __webpack_require__(6440);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/unit-conversion.mjs







var positionalKeys = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "x",
    "y",
]);
var isPositionalKey = function (key) { return positionalKeys.has(key); };
var hasPositionalKey = function (target) {
    return Object.keys(target).some(isPositionalKey);
};
var setAndResetVelocity = function (value, to) {
    // Looks odd but setting it twice doesn't render, it'll just
    // set both prev and current to the latest value
    value.set(to, false);
    value.set(to);
};
var isNumOrPxType = function (v) {
    return v === numbers/* number */.Rx || v === units.px;
};
var BoundingBoxDimension;
(function (BoundingBoxDimension) {
    BoundingBoxDimension["width"] = "width";
    BoundingBoxDimension["height"] = "height";
    BoundingBoxDimension["left"] = "left";
    BoundingBoxDimension["right"] = "right";
    BoundingBoxDimension["top"] = "top";
    BoundingBoxDimension["bottom"] = "bottom";
})(BoundingBoxDimension || (BoundingBoxDimension = {}));
var getPosFromMatrix = function (matrix, pos) {
    return parseFloat(matrix.split(", ")[pos]);
};
var getTranslateFromMatrix = function (pos2, pos3) {
    return function (_bbox, _a) {
        var transform = _a.transform;
        if (transform === "none" || !transform)
            return 0;
        var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
        if (matrix3d) {
            return getPosFromMatrix(matrix3d[1], pos3);
        }
        else {
            var matrix = transform.match(/^matrix\((.+)\)$/);
            if (matrix) {
                return getPosFromMatrix(matrix[1], pos2);
            }
            else {
                return 0;
            }
        }
    };
};
var transformKeys = new Set(["x", "y", "z"]);
var nonTranslationalTransformKeys = transform/* transformProps.filter */.Gl.filter(function (key) { return !transformKeys.has(key); });
function removeNonTranslationalTransform(visualElement) {
    var removedTransforms = [];
    nonTranslationalTransformKeys.forEach(function (key) {
        var value = visualElement.getValue(key);
        if (value !== undefined) {
            removedTransforms.push([key, value.get()]);
            value.set(key.startsWith("scale") ? 1 : 0);
        }
    });
    // Apply changes to element before measurement
    if (removedTransforms.length)
        visualElement.syncRender();
    return removedTransforms;
}
var positionalValues = {
    // Dimensions
    width: function (_a, _b) {
        var x = _a.x;
        var _c = _b.paddingLeft, paddingLeft = _c === void 0 ? "0" : _c, _d = _b.paddingRight, paddingRight = _d === void 0 ? "0" : _d;
        return x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight);
    },
    height: function (_a, _b) {
        var y = _a.y;
        var _c = _b.paddingTop, paddingTop = _c === void 0 ? "0" : _c, _d = _b.paddingBottom, paddingBottom = _d === void 0 ? "0" : _d;
        return y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom);
    },
    top: function (_bbox, _a) {
        var top = _a.top;
        return parseFloat(top);
    },
    left: function (_bbox, _a) {
        var left = _a.left;
        return parseFloat(left);
    },
    bottom: function (_a, _b) {
        var y = _a.y;
        var top = _b.top;
        return parseFloat(top) + (y.max - y.min);
    },
    right: function (_a, _b) {
        var x = _a.x;
        var left = _b.left;
        return parseFloat(left) + (x.max - x.min);
    },
    // Transform
    x: getTranslateFromMatrix(4, 13),
    y: getTranslateFromMatrix(5, 14),
};
var convertChangedValueTypes = function (target, visualElement, changedKeys) {
    var originBbox = visualElement.measureViewportBox();
    var element = visualElement.getInstance();
    var elementComputedStyle = getComputedStyle(element);
    var display = elementComputedStyle.display;
    var origin = {};
    // If the element is currently set to display: "none", make it visible before
    // measuring the target bounding box
    if (display === "none") {
        visualElement.setStaticValue("display", target.display || "block");
    }
    /**
     * Record origins before we render and update styles
     */
    changedKeys.forEach(function (key) {
        origin[key] = positionalValues[key](originBbox, elementComputedStyle);
    });
    // Apply the latest values (as set in checkAndConvertChangedValueTypes)
    visualElement.syncRender();
    var targetBbox = visualElement.measureViewportBox();
    changedKeys.forEach(function (key) {
        // Restore styles to their **calculated computed style**, not their actual
        // originally set style. This allows us to animate between equivalent pixel units.
        var value = visualElement.getValue(key);
        setAndResetVelocity(value, origin[key]);
        target[key] = positionalValues[key](targetBbox, elementComputedStyle);
    });
    return target;
};
var checkAndConvertChangedValueTypes = function (visualElement, target, origin, transitionEnd) {
    if (origin === void 0) { origin = {}; }
    if (transitionEnd === void 0) { transitionEnd = {}; }
    target = (0,tslib_es6.__assign)({}, target);
    transitionEnd = (0,tslib_es6.__assign)({}, transitionEnd);
    var targetPositionalKeys = Object.keys(target).filter(isPositionalKey);
    // We want to remove any transform values that could affect the element's bounding box before
    // it's measured. We'll reapply these later.
    var removedTransformValues = [];
    var hasAttemptedToRemoveTransformValues = false;
    var changedValueTypeKeys = [];
    targetPositionalKeys.forEach(function (key) {
        var value = visualElement.getValue(key);
        if (!visualElement.hasValue(key))
            return;
        var from = origin[key];
        var fromType = (0,dimensions/* findDimensionValueType */.C)(from);
        var to = target[key];
        var toType;
        // TODO: The current implementation of this basically throws an error
        // if you try and do value conversion via keyframes. There's probably
        // a way of doing this but the performance implications would need greater scrutiny,
        // as it'd be doing multiple resize-remeasure operations.
        if ((0,is_keyframes_target/* isKeyframesTarget */.C)(to)) {
            var numKeyframes = to.length;
            var fromIndex = to[0] === null ? 1 : 0;
            from = to[fromIndex];
            fromType = (0,dimensions/* findDimensionValueType */.C)(from);
            for (var i = fromIndex; i < numKeyframes; i++) {
                if (!toType) {
                    toType = (0,dimensions/* findDimensionValueType */.C)(to[i]);
                    (0,dist.invariant)(toType === fromType ||
                        (isNumOrPxType(fromType) && isNumOrPxType(toType)), "Keyframes must be of the same dimension as the current value");
                }
                else {
                    (0,dist.invariant)((0,dimensions/* findDimensionValueType */.C)(to[i]) === toType, "All keyframes must be of the same type");
                }
            }
        }
        else {
            toType = (0,dimensions/* findDimensionValueType */.C)(to);
        }
        if (fromType !== toType) {
            // If they're both just number or px, convert them both to numbers rather than
            // relying on resize/remeasure to convert (which is wasteful in this situation)
            if (isNumOrPxType(fromType) && isNumOrPxType(toType)) {
                var current = value.get();
                if (typeof current === "string") {
                    value.set(parseFloat(current));
                }
                if (typeof to === "string") {
                    target[key] = parseFloat(to);
                }
                else if (Array.isArray(to) && toType === units.px) {
                    target[key] = to.map(parseFloat);
                }
            }
            else if ((fromType === null || fromType === void 0 ? void 0 : fromType.transform) &&
                (toType === null || toType === void 0 ? void 0 : toType.transform) &&
                (from === 0 || to === 0)) {
                // If one or the other value is 0, it's safe to coerce it to the
                // type of the other without measurement
                if (from === 0) {
                    value.set(toType.transform(from));
                }
                else {
                    target[key] = fromType.transform(to);
                }
            }
            else {
                // If we're going to do value conversion via DOM measurements, we first
                // need to remove non-positional transform values that could affect the bbox measurements.
                if (!hasAttemptedToRemoveTransformValues) {
                    removedTransformValues =
                        removeNonTranslationalTransform(visualElement);
                    hasAttemptedToRemoveTransformValues = true;
                }
                changedValueTypeKeys.push(key);
                transitionEnd[key] =
                    transitionEnd[key] !== undefined
                        ? transitionEnd[key]
                        : target[key];
                setAndResetVelocity(value, to);
            }
        }
    });
    if (changedValueTypeKeys.length) {
        var scrollY_1 = changedValueTypeKeys.indexOf("height") >= 0
            ? window.pageYOffset
            : null;
        var convertedTarget = convertChangedValueTypes(target, visualElement, changedValueTypeKeys);
        // If we removed transform values, reapply them before the next render
        if (removedTransformValues.length) {
            removedTransformValues.forEach(function (_a) {
                var _b = (0,tslib_es6.__read)(_a, 2), key = _b[0], value = _b[1];
                visualElement.getValue(key).set(value);
            });
        }
        // Reapply original values
        visualElement.syncRender();
        // Restore scroll position
        if (scrollY_1 !== null)
            window.scrollTo({ top: scrollY_1 });
        return { target: convertedTarget, transitionEnd: transitionEnd };
    }
    else {
        return { target: target, transitionEnd: transitionEnd };
    }
};
/**
 * Convert value types for x/y/width/height/top/left/bottom/right
 *
 * Allows animation between `'auto'` -> `'100%'` or `0` -> `'calc(50% - 10vw)'`
 *
 * @internal
 */
function unitConversion(visualElement, target, origin, transitionEnd) {
    return hasPositionalKey(target)
        ? checkAndConvertChangedValueTypes(visualElement, target, origin, transitionEnd)
        : { target: target, transitionEnd: transitionEnd };
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/parse-dom-variant.mjs



/**
 * Parse a DOM variant to make it animatable. This involves resolving CSS variables
 * and ensuring animations like "20%" => "calc(50vw)" are performed in pixels.
 */
var parseDomVariant = function (visualElement, target, origin, transitionEnd) {
    var resolved = (0,css_variables_conversion/* resolveCSSVariables */.mH)(visualElement, target, transitionEnd);
    target = resolved.target;
    transitionEnd = resolved.transitionEnd;
    return unitConversion(visualElement, target, origin, transitionEnd);
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/scrape-motion-values.mjs
var scrape_motion_values = __webpack_require__(189);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/render.mjs
var utils_render = __webpack_require__(4242);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/defaults.mjs
var defaults = __webpack_require__(2728);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/projection/utils/measure.mjs
var measure = __webpack_require__(6460);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/html/visual-element.mjs












function visual_element_getComputedStyle(element) {
    return window.getComputedStyle(element);
}
var htmlConfig = {
    treeType: "dom",
    readValueFromInstance: function (domElement, key) {
        if ((0,transform/* isTransformProp */._c)(key)) {
            var defaultType = (0,defaults/* getDefaultValueType */.A)(key);
            return defaultType ? defaultType.default || 0 : 0;
        }
        else {
            var computedStyle = visual_element_getComputedStyle(domElement);
            return (((0,is_css_variable/* isCSSVariable */.o)(key)
                ? computedStyle.getPropertyValue(key)
                : computedStyle[key]) || 0);
        }
    },
    sortNodePosition: function (a, b) {
        /**
         * compareDocumentPosition returns a bitmask, by using the bitwise &
         * we're returning true if 2 in that bitmask is set to true. 2 is set
         * to true if b preceeds a.
         */
        return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    },
    getBaseTarget: function (props, key) {
        var _a;
        return (_a = props.style) === null || _a === void 0 ? void 0 : _a[key];
    },
    measureViewportBox: function (element, _a) {
        var transformPagePoint = _a.transformPagePoint;
        return (0,measure/* measureViewportBox */.J)(element, transformPagePoint);
    },
    /**
     * Reset the transform on the current Element. This is called as part
     * of a batched process across the entire layout tree. To remove this write
     * cycle it'd be interesting to see if it's possible to "undo" all the current
     * layout transforms up the tree in the same way this.getBoundingBoxWithoutTransforms
     * works
     */
    resetTransform: function (element, domElement, props) {
        var transformTemplate = props.transformTemplate;
        domElement.style.transform = transformTemplate
            ? transformTemplate({}, "")
            : "none";
        // Ensure that whatever happens next, we restore our transform on the next frame
        element.scheduleRender();
    },
    restoreTransform: function (instance, mutableState) {
        instance.style.transform = mutableState.style.transform;
    },
    removeValueFromRenderState: function (key, _a) {
        var vars = _a.vars, style = _a.style;
        delete vars[key];
        delete style[key];
    },
    /**
     * Ensure that HTML and Framer-specific value types like `px`->`%` and `Color`
     * can be animated by Motion.
     */
    makeTargetAnimatable: function (element, _a, _b, isMounted) {
        var transformValues = _b.transformValues;
        if (isMounted === void 0) { isMounted = true; }
        var transition = _a.transition, transitionEnd = _a.transitionEnd, target = (0,tslib_es6.__rest)(_a, ["transition", "transitionEnd"]);
        var origin = (0,setters/* getOrigin */.P$)(target, transition || {}, element);
        /**
         * If Framer has provided a function to convert `Color` etc value types, convert them
         */
        if (transformValues) {
            if (transitionEnd)
                transitionEnd = transformValues(transitionEnd);
            if (target)
                target = transformValues(target);
            if (origin)
                origin = transformValues(origin);
        }
        if (isMounted) {
            (0,setters/* checkTargetForNewValues */.GJ)(element, target, origin);
            var parsed = parseDomVariant(element, target, origin, transitionEnd);
            transitionEnd = parsed.transitionEnd;
            target = parsed.target;
        }
        return (0,tslib_es6.__assign)({ transition: transition, transitionEnd: transitionEnd }, target);
    },
    scrapeMotionValuesFromProps: scrape_motion_values/* scrapeMotionValuesFromProps */.U,
    build: function (element, renderState, latestValues, options, props) {
        if (element.isVisible !== undefined) {
            renderState.style.visibility = element.isVisible
                ? "visible"
                : "hidden";
        }
        (0,build_styles/* buildHTMLStyles */.r)(renderState, latestValues, options, props.transformTemplate);
    },
    render: utils_render/* renderHTML */.N,
};
var htmlVisualElement = (0,render/* visualElement */.q)(htmlConfig);



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/scrape-motion-values.mjs
var utils_scrape_motion_values = __webpack_require__(6832);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/build-attrs.mjs + 2 modules
var build_attrs = __webpack_require__(5415);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/camel-to-dash.mjs
var camel_to_dash = __webpack_require__(1219);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/camel-case-attrs.mjs
var camel_case_attrs = __webpack_require__(7302);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/render.mjs
var svg_utils_render = __webpack_require__(8504);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/visual-element.mjs











var svgVisualElement = (0,render/* visualElement */.q)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, htmlConfig), { getBaseTarget: function (props, key) {
        return props[key];
    }, readValueFromInstance: function (domElement, key) {
        var _a;
        if ((0,transform/* isTransformProp */._c)(key)) {
            return ((_a = (0,defaults/* getDefaultValueType */.A)(key)) === null || _a === void 0 ? void 0 : _a.default) || 0;
        }
        key = !camel_case_attrs/* camelCaseAttributes.has */.s.has(key) ? (0,camel_to_dash/* camelToDash */.D)(key) : key;
        return domElement.getAttribute(key);
    }, scrapeMotionValuesFromProps: utils_scrape_motion_values/* scrapeMotionValuesFromProps */.U, build: function (_element, renderState, latestValues, options, props) {
        (0,build_attrs/* buildSVGAttrs */.i)(renderState, latestValues, options, props.transformTemplate);
    }, render: svg_utils_render/* renderSVG */.K }));



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs + 1 modules
var is_svg_component = __webpack_require__(2627);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs




var createDomVisualElement = function (Component, options) {
    return (0,is_svg_component/* isSVGComponent */.q)(Component)
        ? svgVisualElement(options, { enableHardwareAcceleration: false })
        : htmlVisualElement(options, { enableHardwareAcceleration: true });
};




/***/ }),

/***/ 9169:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": function() { return /* binding */ createMotionProxy; }
/* harmony export */ });
/* harmony import */ var _motion_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7641);


/**
 * Convert any React component into a `motion` component. The provided component
 * **must** use `React.forwardRef` to the underlying DOM component you want to animate.
 *
 * ```jsx
 * const Component = React.forwardRef((props, ref) => {
 *   return <div ref={ref} />
 * })
 *
 * const MotionComponent = motion(Component)
 * ```
 *
 * @public
 */
function createMotionProxy(createConfig) {
    function custom(Component, customMotionComponentConfig) {
        if (customMotionComponentConfig === void 0) { customMotionComponentConfig = {}; }
        return (0,_motion_index_mjs__WEBPACK_IMPORTED_MODULE_0__/* .createMotionComponent */ .F)(createConfig(Component, customMotionComponentConfig));
    }
    if (typeof Proxy === "undefined") {
        return custom;
    }
    /**
     * A cache of generated `motion` components, e.g `motion.div`, `motion.input` etc.
     * Rather than generating them anew every render.
     */
    var componentCache = new Map();
    return new Proxy(custom, {
        /**
         * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
         * The prop name is passed through as `key` and we can use that to generate a `motion`
         * DOM component with that name.
         */
        get: function (_target, key) {
            /**
             * If this element doesn't exist in the component cache, create it and cache.
             */
            if (!componentCache.has(key)) {
                componentCache.set(key, custom(key));
            }
            return componentCache.get(key);
        },
    });
}




/***/ }),

/***/ 7312:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": function() { return /* binding */ motion; },
/* harmony export */   "F": function() { return /* binding */ createDomMotionComponent; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(655);
/* harmony import */ var _motion_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7641);
/* harmony import */ var _motion_proxy_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9169);
/* harmony import */ var _utils_create_config_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8550);
/* harmony import */ var _motion_features_gestures_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6872);
/* harmony import */ var _motion_features_animations_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1903);
/* harmony import */ var _motion_features_drag_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3006);
/* harmony import */ var _create_visual_element_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1891);
/* harmony import */ var _motion_features_layout_index_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1283);
/* harmony import */ var _projection_node_HTMLProjectionNode_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7046);











var featureBundle = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, _motion_features_animations_mjs__WEBPACK_IMPORTED_MODULE_1__/* .animations */ .s), _motion_features_gestures_mjs__WEBPACK_IMPORTED_MODULE_2__/* .gestureAnimations */ .E), _motion_features_drag_mjs__WEBPACK_IMPORTED_MODULE_3__/* .drag */ .o), _motion_features_layout_index_mjs__WEBPACK_IMPORTED_MODULE_4__/* .layoutFeatures */ .U);
/**
 * HTML & SVG components, optimised for use with gestures and animation. These can be used as
 * drop-in replacements for any HTML & SVG component, all CSS & SVG properties are supported.
 *
 * @public
 */
var motion = /*@__PURE__*/ (0,_motion_proxy_mjs__WEBPACK_IMPORTED_MODULE_5__/* .createMotionProxy */ .D)(function (Component, config) {
    return (0,_utils_create_config_mjs__WEBPACK_IMPORTED_MODULE_6__/* .createDomMotionConfig */ .w)(Component, config, featureBundle, _create_visual_element_mjs__WEBPACK_IMPORTED_MODULE_7__/* .createDomVisualElement */ .b, _projection_node_HTMLProjectionNode_mjs__WEBPACK_IMPORTED_MODULE_8__/* .HTMLProjectionNode */ .u);
});
/**
 * Create a DOM `motion` component with the provided string. This is primarily intended
 * as a full alternative to `motion` for consumers who have to support environments that don't
 * support `Proxy`.
 *
 * ```javascript
 * import { createDomMotionComponent } from "framer-motion"
 *
 * const motion = {
 *   div: createDomMotionComponent('div')
 * }
 * ```
 *
 * @public
 */
function createDomMotionComponent(key) {
    return (0,_motion_index_mjs__WEBPACK_IMPORTED_MODULE_9__/* .createMotionComponent */ .F)((0,_utils_create_config_mjs__WEBPACK_IMPORTED_MODULE_6__/* .createDomMotionConfig */ .w)(key, { forwardMotionProps: false }, featureBundle, _create_visual_element_mjs__WEBPACK_IMPORTED_MODULE_7__/* .createDomVisualElement */ .b, _projection_node_HTMLProjectionNode_mjs__WEBPACK_IMPORTED_MODULE_8__/* .HTMLProjectionNode */ .u));
}




/***/ }),

/***/ 1219:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": function() { return /* binding */ camelToDash; }
/* harmony export */ });
var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
var REPLACE_TEMPLATE = "$1-$2";
/**
 * Convert camelCase to dash-case properties.
 */
var camelToDash = function (str) {
    return str.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
};




/***/ }),

/***/ 8550:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "w": function() { return /* binding */ createDomMotionConfig; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs + 1 modules
var is_svg_component = __webpack_require__(2627);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9497);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/utils/is-forced-motion-value.mjs
var is_forced_motion_value = __webpack_require__(6816);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/utils/is-motion-value.mjs
var is_motion_value = __webpack_require__(406);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/build-styles.mjs + 2 modules
var build_styles = __webpack_require__(8057);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var createHtmlRenderState = function () { return ({
    style: {},
    transform: {},
    transformKeys: [],
    transformOrigin: {},
    vars: {},
}); };



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/html/use-props.mjs







function copyRawValuesOnly(target, source, props) {
    for (var key in source) {
        if (!(0,is_motion_value/* isMotionValue */.i)(source[key]) && !(0,is_forced_motion_value/* isForcedMotionValue */.j)(key, props)) {
            target[key] = source[key];
        }
    }
}
function useInitialMotionValues(_a, visualState, isStatic) {
    var transformTemplate = _a.transformTemplate;
    return (0,external_react_.useMemo)(function () {
        var state = createHtmlRenderState();
        (0,build_styles/* buildHTMLStyles */.r)(state, visualState, { enableHardwareAcceleration: !isStatic }, transformTemplate);
        var vars = state.vars, style = state.style;
        return (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, vars), style);
    }, [visualState]);
}
function useStyle(props, visualState, isStatic) {
    var styleProp = props.style || {};
    var style = {};
    /**
     * Copy non-Motion Values straight into style
     */
    copyRawValuesOnly(style, styleProp, props);
    Object.assign(style, useInitialMotionValues(props, visualState, isStatic));
    if (props.transformValues) {
        style = props.transformValues(style);
    }
    return style;
}
function useHTMLProps(props, visualState, isStatic) {
    // The `any` isn't ideal but it is the type of createElement props argument
    var htmlProps = {};
    var style = useStyle(props, visualState, isStatic);
    if (Boolean(props.drag) && props.dragListener !== false) {
        // Disable the ghost element when a user drags
        htmlProps.draggable = false;
        // Disable text selection
        style.userSelect =
            style.WebkitUserSelect =
                style.WebkitTouchCallout =
                    "none";
        // Disable scrolling on the draggable direction
        style.touchAction =
            props.drag === true
                ? "none"
                : "pan-".concat(props.drag === "x" ? "y" : "x");
    }
    htmlProps.style = style;
    return htmlProps;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
var filter_props = __webpack_require__(8041);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/build-attrs.mjs + 2 modules
var build_attrs = __webpack_require__(5415);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs



var createSvgRenderState = function () { return ((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, createHtmlRenderState()), { attrs: {} })); };



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/use-props.mjs






function useSVGProps(props, visualState) {
    var visualProps = (0,external_react_.useMemo)(function () {
        var state = createSvgRenderState();
        (0,build_attrs/* buildSVGAttrs */.i)(state, visualState, { enableHardwareAcceleration: false }, props.transformTemplate);
        return (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, state.attrs), { style: (0,tslib_es6.__assign)({}, state.style) });
    }, [visualState]);
    if (props.style) {
        var rawStyles = {};
        copyRawValuesOnly(rawStyles, props.style, props);
        visualProps.style = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, rawStyles), visualProps.style);
    }
    return visualProps;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/use-render.mjs







function createUseRender(forwardMotionProps) {
    if (forwardMotionProps === void 0) { forwardMotionProps = false; }
    var useRender = function (Component, props, projectionId, ref, _a, isStatic) {
        var latestValues = _a.latestValues;
        var useVisualProps = (0,is_svg_component/* isSVGComponent */.q)(Component)
            ? useSVGProps
            : useHTMLProps;
        var visualProps = useVisualProps(props, latestValues, isStatic);
        var filteredProps = (0,filter_props/* filterProps */.L)(props, typeof Component === "string", forwardMotionProps);
        var elementProps = (0,tslib_es6.__assign)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, filteredProps), visualProps), { ref: ref });
        if (projectionId) {
            elementProps["data-projection-id"] = projectionId;
        }
        return (0,external_react_.createElement)(Component, elementProps);
    };
    return useRender;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/render.mjs
var render = __webpack_require__(8504);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/scrape-motion-values.mjs
var scrape_motion_values = __webpack_require__(6832);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
var use_visual_state = __webpack_require__(5180);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/config-motion.mjs






var svgMotionConfig = {
    useVisualState: (0,use_visual_state/* makeUseVisualState */.t)({
        scrapeMotionValuesFromProps: scrape_motion_values/* scrapeMotionValuesFromProps */.U,
        createRenderState: createSvgRenderState,
        onMount: function (props, instance, _a) {
            var renderState = _a.renderState, latestValues = _a.latestValues;
            try {
                renderState.dimensions =
                    typeof instance.getBBox ===
                        "function"
                        ? instance.getBBox()
                        : instance.getBoundingClientRect();
            }
            catch (e) {
                // Most likely trying to measure an unrendered element under Firefox
                renderState.dimensions = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                };
            }
            (0,build_attrs/* buildSVGAttrs */.i)(renderState, latestValues, { enableHardwareAcceleration: false }, props.transformTemplate);
            (0,render/* renderSVG */.K)(instance, renderState);
        },
    }),
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/scrape-motion-values.mjs
var utils_scrape_motion_values = __webpack_require__(189);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/html/config-motion.mjs




var htmlMotionConfig = {
    useVisualState: (0,use_visual_state/* makeUseVisualState */.t)({
        scrapeMotionValuesFromProps: utils_scrape_motion_values/* scrapeMotionValuesFromProps */.U,
        createRenderState: createHtmlRenderState,
    }),
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/create-config.mjs






function createDomMotionConfig(Component, _a, preloadedFeatures, createVisualElement, projectionNodeConstructor) {
    var _b = _a.forwardMotionProps, forwardMotionProps = _b === void 0 ? false : _b;
    var baseConfig = (0,is_svg_component/* isSVGComponent */.q)(Component)
        ? svgMotionConfig
        : htmlMotionConfig;
    return (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, baseConfig), { preloadedFeatures: preloadedFeatures, useRender: createUseRender(forwardMotionProps), createVisualElement: createVisualElement, projectionNodeConstructor: projectionNodeConstructor, Component: Component });
}




/***/ }),

/***/ 7539:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Xp": function() { return /* binding */ cssVariableRegex; },
/* harmony export */   "mH": function() { return /* binding */ resolveCSSVariables; }
/* harmony export */ });
/* unused harmony export parseCSSVariable */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(655);
/* harmony import */ var hey_listen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1320);



function isCSSVariable(value) {
    return typeof value === "string" && value.startsWith("var(--");
}
/**
 * Parse Framer's special CSS variable format into a CSS token and a fallback.
 *
 * ```
 * `var(--foo, #fff)` => [`--foo`, '#fff']
 * ```
 *
 * @param current
 */
var cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
function parseCSSVariable(current) {
    var match = cssVariableRegex.exec(current);
    if (!match)
        return [,];
    var _a = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(match, 3), token = _a[1], fallback = _a[2];
    return [token, fallback];
}
var maxDepth = 4;
function getVariableValue(current, element, depth) {
    if (depth === void 0) { depth = 1; }
    (0,hey_listen__WEBPACK_IMPORTED_MODULE_0__.invariant)(depth <= maxDepth, "Max CSS variable fallback depth detected in property \"".concat(current, "\". This may indicate a circular fallback dependency."));
    var _a = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(parseCSSVariable(current), 2), token = _a[0], fallback = _a[1];
    // No CSS variable detected
    if (!token)
        return;
    // Attempt to read this CSS variable off the element
    var resolved = window.getComputedStyle(element).getPropertyValue(token);
    if (resolved) {
        return resolved.trim();
    }
    else if (isCSSVariable(fallback)) {
        // The fallback might itself be a CSS variable, in which case we attempt to resolve it too.
        return getVariableValue(fallback, element, depth + 1);
    }
    else {
        return fallback;
    }
}
/**
 * Resolve CSS variables from
 *
 * @internal
 */
function resolveCSSVariables(visualElement, _a, transitionEnd) {
    var _b;
    var target = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(_a, []);
    var element = visualElement.getInstance();
    if (!(element instanceof Element))
        return { target: target, transitionEnd: transitionEnd };
    // If `transitionEnd` isn't `undefined`, clone it. We could clone `target` and `transitionEnd`
    // only if they change but I think this reads clearer and this isn't a performance-critical path.
    if (transitionEnd) {
        transitionEnd = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, transitionEnd);
    }
    // Go through existing `MotionValue`s and ensure any existing CSS variables are resolved
    visualElement.forEachValue(function (value) {
        var current = value.get();
        if (!isCSSVariable(current))
            return;
        var resolved = getVariableValue(current, element);
        if (resolved)
            value.set(resolved);
    });
    // Cycle through every target property and resolve CSS variables. Currently
    // we only read single-var properties like `var(--foo)`, not `calc(var(--foo) + 20px)`
    for (var key in target) {
        var current = target[key];
        if (!isCSSVariable(current))
            continue;
        var resolved = getVariableValue(current, element);
        if (!resolved)
            continue;
        // Clone target if it hasn't already been
        target[key] = resolved;
        // If the user hasn't already set this key on `transitionEnd`, set it to the unresolved
        // CSS variable. This will ensure that after the animation the component will reflect
        // changes in the value of the CSS variable.
        if (transitionEnd)
            (_b = transitionEnd[key]) !== null && _b !== void 0 ? _b : (transitionEnd[key] = current);
    }
    return { target: target, transitionEnd: transitionEnd };
}




/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": function() { return /* binding */ loadExternalIsValidProp; },
/* harmony export */   "L": function() { return /* binding */ filterProps; }
/* harmony export */ });
/* harmony import */ var _motion_utils_valid_prop_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9630);


var shouldForward = function (key) { return !(0,_motion_utils_valid_prop_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isValidMotionProp */ .Z)(key); };
function loadExternalIsValidProp(isValidProp) {
    if (!isValidProp)
        return;
    // Explicitly filter our events
    shouldForward = function (key) {
        return key.startsWith("on") ? !(0,_motion_utils_valid_prop_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isValidMotionProp */ .Z)(key) : isValidProp(key);
    };
}
/**
 * Emotion and Styled Components both allow users to pass through arbitrary props to their components
 * to dynamically generate CSS. They both use the `@emotion/is-prop-valid` package to determine which
 * of these should be passed to the underlying DOM node.
 *
 * However, when styling a Motion component `styled(motion.div)`, both packages pass through *all* props
 * as it's seen as an arbitrary component rather than a DOM node. Motion only allows arbitrary props
 * passed through the `custom` prop so it doesn't *need* the payload or computational overhead of
 * `@emotion/is-prop-valid`, however to fix this problem we need to use it.
 *
 * By making it an optionalDependency we can offer this functionality only in the situations where it's
 * actually required.
 */
try {
    /**
     * We attempt to import this package but require won't be defined in esm environments, in that case
     * isPropValid will have to be provided via `MotionContext`. In a 6.0.0 this should probably be removed
     * in favour of explicit injection.
     */
    loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
}
catch (_a) {
    // We don't need to actually do anything here - the fallback is the existing `isPropValid`.
}
function filterProps(props, isDom, forwardMotionProps) {
    var filteredProps = {};
    for (var key in props) {
        if (shouldForward(key) ||
            (forwardMotionProps === true && (0,_motion_utils_valid_prop_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isValidMotionProp */ .Z)(key)) ||
            (!isDom && !(0,_motion_utils_valid_prop_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isValidMotionProp */ .Z)(key)) ||
            // If trying to use native HTML drag events, forward drag listeners
            (props["draggable"] && key.startsWith("onDrag"))) {
            filteredProps[key] = props[key];
        }
    }
    return filteredProps;
}




/***/ }),

/***/ 7630:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "o": function() { return /* binding */ isCSSVariable; }
/* harmony export */ });
/**
 * Returns true if the provided key is a CSS variable
 */
function isCSSVariable(key) {
    return key.startsWith("--");
}




/***/ }),

/***/ 2627:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "q": function() { return /* binding */ isSVGComponent; }
});

;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
/**
 * We keep these listed seperately as we use the lowercase tag names as part
 * of the runtime bundle to detect SVG components
 */
var lowercaseSVGElements = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "tspan",
    "use",
    "view",
];



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs


function isSVGComponent(Component) {
    if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component !== "string" ||
        /**
         * If it contains a dash, the element is a custom HTML webcomponent.
         */
        Component.includes("-")) {
        return false;
    }
    else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component) > -1 ||
        /**
         * If it contains a capital letter, it's an SVG component
         */
        /[A-Z]/.test(Component)) {
        return true;
    }
    return false;
}




/***/ }),

/***/ 9135:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": function() { return /* binding */ getAnimatableNone; }
/* harmony export */ });
/* harmony import */ var style_value_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5738);
/* harmony import */ var style_value_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8407);
/* harmony import */ var _defaults_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2728);



function getAnimatableNone(key, value) {
    var _a;
    var defaultValueType = (0,_defaults_mjs__WEBPACK_IMPORTED_MODULE_0__/* .getDefaultValueType */ .A)(key);
    if (defaultValueType !== style_value_types__WEBPACK_IMPORTED_MODULE_1__/* .filter */ .h)
        defaultValueType = style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .complex */ .P;
    // If value is not recognised as animatable, ie "none", create an animatable version origin based on the target
    return (_a = defaultValueType.getAnimatableNone) === null || _a === void 0 ? void 0 : _a.call(defaultValueType, value);
}




/***/ }),

/***/ 2728:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": function() { return /* binding */ getDefaultValueType; }
/* harmony export */ });
/* unused harmony export defaultValueTypes */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(655);
/* harmony import */ var style_value_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7405);
/* harmony import */ var style_value_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5738);
/* harmony import */ var _number_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6173);




/**
 * A map of default value types for common values
 */
var defaultValueTypes = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, _number_mjs__WEBPACK_IMPORTED_MODULE_1__/* .numberValueTypes */ .j), { 
    // Color props
    color: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, backgroundColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, outlineColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, fill: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, stroke: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, 
    // Border props
    borderColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, borderTopColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, borderRightColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, borderBottomColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, borderLeftColor: style_value_types__WEBPACK_IMPORTED_MODULE_2__/* .color */ .$, filter: style_value_types__WEBPACK_IMPORTED_MODULE_3__/* .filter */ .h, WebkitFilter: style_value_types__WEBPACK_IMPORTED_MODULE_3__/* .filter */ .h });
/**
 * Gets the default ValueType for the provided value key
 */
var getDefaultValueType = function (key) { return defaultValueTypes[key]; };




/***/ }),

/***/ 6440:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "$": function() { return /* binding */ dimensionValueTypes; },
  "C": function() { return /* binding */ findDimensionValueType; }
});

// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/index.mjs
var numbers = __webpack_require__(1248);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/test.mjs
var test = __webpack_require__(8340);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/type-auto.mjs
/**
 * ValueType for "auto"
 */
var auto = {
    test: function (v) { return v === "auto"; },
    parse: function (v) { return v; },
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/dimensions.mjs




/**
 * A list of value types commonly used for dimensions
 */
var dimensionValueTypes = [numbers/* number */.Rx, units.px, units/* percent */.aQ, units/* degrees */.RW, units.vw, units.vh, auto];
/**
 * Tests a dimensional value against the list of dimension ValueTypes
 */
var findDimensionValueType = function (v) {
    return dimensionValueTypes.find((0,test/* testValueType */.l)(v));
};




/***/ }),

/***/ 6173:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "j": function() { return /* binding */ numberValueTypes; }
});

// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/index.mjs
var numbers = __webpack_require__(1248);
// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/type-int.mjs



var type_int_int = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, numbers/* number */.Rx), { transform: Math.round });



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/number.mjs



var numberValueTypes = {
    // Border props
    borderWidth: units.px,
    borderTopWidth: units.px,
    borderRightWidth: units.px,
    borderBottomWidth: units.px,
    borderLeftWidth: units.px,
    borderRadius: units.px,
    radius: units.px,
    borderTopLeftRadius: units.px,
    borderTopRightRadius: units.px,
    borderBottomRightRadius: units.px,
    borderBottomLeftRadius: units.px,
    // Positioning props
    width: units.px,
    maxWidth: units.px,
    height: units.px,
    maxHeight: units.px,
    size: units.px,
    top: units.px,
    right: units.px,
    bottom: units.px,
    left: units.px,
    // Spacing props
    padding: units.px,
    paddingTop: units.px,
    paddingRight: units.px,
    paddingBottom: units.px,
    paddingLeft: units.px,
    margin: units.px,
    marginTop: units.px,
    marginRight: units.px,
    marginBottom: units.px,
    marginLeft: units.px,
    // Transform props
    rotate: units/* degrees */.RW,
    rotateX: units/* degrees */.RW,
    rotateY: units/* degrees */.RW,
    rotateZ: units/* degrees */.RW,
    scale: numbers/* scale */.bA,
    scaleX: numbers/* scale */.bA,
    scaleY: numbers/* scale */.bA,
    scaleZ: numbers/* scale */.bA,
    skew: units/* degrees */.RW,
    skewX: units/* degrees */.RW,
    skewY: units/* degrees */.RW,
    distance: units.px,
    translateX: units.px,
    translateY: units.px,
    translateZ: units.px,
    x: units.px,
    y: units.px,
    z: units.px,
    perspective: units.px,
    transformPerspective: units.px,
    opacity: numbers/* alpha */.Fq,
    originX: units/* progressPercentage */.$C,
    originY: units/* progressPercentage */.$C,
    originZ: units.px,
    // Misc
    zIndex: type_int_int,
    // SVG
    fillOpacity: numbers/* alpha */.Fq,
    strokeOpacity: numbers/* alpha */.Fq,
    numOctaves: type_int_int,
};




/***/ }),

/***/ 8340:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": function() { return /* binding */ testValueType; }
/* harmony export */ });
/**
 * Tests a provided value against a ValueType
 */
var testValueType = function (v) { return function (type) { return type.test(v); }; };




/***/ }),

/***/ 8057:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "r": function() { return /* binding */ buildHTMLStyles; }
});

// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/transform.mjs
var utils_transform = __webpack_require__(4714);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/build-transform.mjs


var translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
};
/**
 * Build a CSS transform style from individual x/y/scale etc properties.
 *
 * This outputs with a default order of transforms/scales/rotations, this can be customised by
 * providing a transformTemplate function.
 */
function buildTransform(_a, _b, transformIsDefault, transformTemplate) {
    var transform = _a.transform, transformKeys = _a.transformKeys;
    var _c = _b.enableHardwareAcceleration, enableHardwareAcceleration = _c === void 0 ? true : _c, _d = _b.allowTransformNone, allowTransformNone = _d === void 0 ? true : _d;
    // The transform string we're going to build into.
    var transformString = "";
    // Transform keys into their default order - this will determine the output order.
    transformKeys.sort(utils_transform/* sortTransformProps */.s3);
    // Track whether the defined transform has a defined z so we don't add a
    // second to enable hardware acceleration
    var transformHasZ = false;
    // Loop over each transform and build them into transformString
    var numTransformKeys = transformKeys.length;
    for (var i = 0; i < numTransformKeys; i++) {
        var key = transformKeys[i];
        transformString += "".concat(translateAlias[key] || key, "(").concat(transform[key], ") ");
        if (key === "z")
            transformHasZ = true;
    }
    if (!transformHasZ && enableHardwareAcceleration) {
        transformString += "translateZ(0)";
    }
    else {
        transformString = transformString.trim();
    }
    // If we have a custom `transform` template, pass our transform values and
    // generated transformString to that before returning
    if (transformTemplate) {
        transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
    }
    else if (allowTransformNone && transformIsDefault) {
        transformString = "none";
    }
    return transformString;
}
/**
 * Build a transformOrigin style. Uses the same defaults as the browser for
 * undefined origins.
 */
function buildTransformOrigin(_a) {
    var _b = _a.originX, originX = _b === void 0 ? "50%" : _b, _c = _a.originY, originY = _c === void 0 ? "50%" : _c, _d = _a.originZ, originZ = _d === void 0 ? 0 : _d;
    return "".concat(originX, " ").concat(originY, " ").concat(originZ);
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/utils/is-css-variable.mjs
var is_css_variable = __webpack_require__(7630);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/get-as-type.mjs
/**
 * Provided a value and a ValueType, returns the value as that value type.
 */
var getValueAsType = function (value, type) {
    return type && typeof value === "number"
        ? type.transform(value)
        : value;
};



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/number.mjs + 1 modules
var number = __webpack_require__(6173);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/build-styles.mjs






function buildHTMLStyles(state, latestValues, options, transformTemplate) {
    var _a;
    var style = state.style, vars = state.vars, transform = state.transform, transformKeys = state.transformKeys, transformOrigin = state.transformOrigin;
    // Empty the transformKeys array. As we're throwing out refs to its items
    // this might not be as cheap as suspected. Maybe using the array as a buffer
    // with a manual incrementation would be better.
    transformKeys.length = 0;
    // Track whether we encounter any transform or transformOrigin values.
    var hasTransform = false;
    var hasTransformOrigin = false;
    // Does the calculated transform essentially equal "none"?
    var transformIsNone = true;
    /**
     * Loop over all our latest animated values and decide whether to handle them
     * as a style or CSS variable.
     *
     * Transforms and transform origins are kept seperately for further processing.
     */
    for (var key in latestValues) {
        var value = latestValues[key];
        /**
         * If this is a CSS variable we don't do any further processing.
         */
        if ((0,is_css_variable/* isCSSVariable */.o)(key)) {
            vars[key] = value;
            continue;
        }
        // Convert the value to its default value type, ie 0 -> "0px"
        var valueType = number/* numberValueTypes */.j[key];
        var valueAsType = getValueAsType(value, valueType);
        if ((0,utils_transform/* isTransformProp */._c)(key)) {
            // If this is a transform, flag to enable further transform processing
            hasTransform = true;
            transform[key] = valueAsType;
            transformKeys.push(key);
            // If we already know we have a non-default transform, early return
            if (!transformIsNone)
                continue;
            // Otherwise check to see if this is a default transform
            if (value !== ((_a = valueType.default) !== null && _a !== void 0 ? _a : 0))
                transformIsNone = false;
        }
        else if ((0,utils_transform/* isTransformOriginProp */.Ee)(key)) {
            transformOrigin[key] = valueAsType;
            // If this is a transform origin, flag and enable further transform-origin processing
            hasTransformOrigin = true;
        }
        else {
            style[key] = valueAsType;
        }
    }
    if (hasTransform) {
        style.transform = buildTransform(state, options, transformIsNone, transformTemplate);
    }
    else if (transformTemplate) {
        style.transform = transformTemplate({}, "");
    }
    else if (!latestValues.transform && style.transform) {
        style.transform = "none";
    }
    if (hasTransformOrigin) {
        style.transformOrigin = buildTransformOrigin(transformOrigin);
    }
}




/***/ }),

/***/ 4242:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": function() { return /* binding */ renderHTML; }
/* harmony export */ });
function renderHTML(element, _a, styleProp, projection) {
    var style = _a.style, vars = _a.vars;
    Object.assign(element.style, style, projection && projection.getProjectionStyles(styleProp));
    // Loop over any CSS variables and assign those.
    for (var key in vars) {
        element.style.setProperty(key, vars[key]);
    }
}




/***/ }),

/***/ 189:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "U": function() { return /* binding */ scrapeMotionValuesFromProps; }
/* harmony export */ });
/* harmony import */ var _motion_utils_is_forced_motion_value_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6816);
/* harmony import */ var _value_utils_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(406);



function scrapeMotionValuesFromProps(props) {
    var style = props.style;
    var newValues = {};
    for (var key in style) {
        if ((0,_value_utils_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isMotionValue */ .i)(style[key]) || (0,_motion_utils_is_forced_motion_value_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isForcedMotionValue */ .j)(key, props)) {
            newValues[key] = style[key];
        }
    }
    return newValues;
}




/***/ }),

/***/ 4714:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ee": function() { return /* binding */ isTransformOriginProp; },
/* harmony export */   "Gl": function() { return /* binding */ transformProps; },
/* harmony export */   "_c": function() { return /* binding */ isTransformProp; },
/* harmony export */   "r$": function() { return /* binding */ transformAxes; },
/* harmony export */   "s3": function() { return /* binding */ sortTransformProps; }
/* harmony export */ });
/**
 * A list of all transformable axes. We'll use this list to generated a version
 * of each axes for each transform.
 */
var transformAxes = ["", "X", "Y", "Z"];
/**
 * An ordered array of each transformable value. By default, transform values
 * will be sorted to this order.
 */
var order = ["translate", "scale", "rotate", "skew"];
/**
 * Generate a list of every possible transform key.
 */
var transformProps = ["transformPerspective", "x", "y", "z"];
order.forEach(function (operationKey) {
    return transformAxes.forEach(function (axesKey) {
        return transformProps.push(operationKey + axesKey);
    });
});
/**
 * A function to use with Array.sort to sort transform keys by their default order.
 */
function sortTransformProps(a, b) {
    return transformProps.indexOf(a) - transformProps.indexOf(b);
}
/**
 * A quick lookup for transform props.
 */
var transformPropSet = new Set(transformProps);
function isTransformProp(key) {
    return transformPropSet.has(key);
}
/**
 * A quick lookup for transform origin props
 */
var transformOriginProps = new Set(["originX", "originY", "originZ"]);
function isTransformOriginProp(key) {
    return transformOriginProps.has(key);
}




/***/ }),

/***/ 404:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "q": function() { return /* binding */ visualElement; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(9073);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/index.mjs
var es_value = __webpack_require__(3234);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/utils/is-motion-value.mjs
var is_motion_value = __webpack_require__(406);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/animation-state.mjs + 1 modules
var animation_state = __webpack_require__(2620);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/subscription-manager.mjs
var subscription_manager = __webpack_require__(1560);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/utils/lifecycles.mjs



var names = [
    "LayoutMeasure",
    "BeforeLayoutMeasure",
    "LayoutUpdate",
    "ViewportBoxUpdate",
    "Update",
    "Render",
    "AnimationComplete",
    "LayoutAnimationComplete",
    "AnimationStart",
    "LayoutAnimationStart",
    "SetAxisTarget",
    "Unmount",
];
function createLifecycles() {
    var managers = names.map(function () { return new subscription_manager/* SubscriptionManager */.L(); });
    var propSubscriptions = {};
    var lifecycles = {
        clearAllListeners: function () { return managers.forEach(function (manager) { return manager.clear(); }); },
        updatePropListeners: function (props) {
            names.forEach(function (name) {
                var _a;
                var on = "on" + name;
                var propListener = props[on];
                // Unsubscribe existing subscription
                (_a = propSubscriptions[name]) === null || _a === void 0 ? void 0 : _a.call(propSubscriptions);
                // Add new subscription
                if (propListener) {
                    propSubscriptions[name] = lifecycles[on](propListener);
                }
            });
        },
    };
    managers.forEach(function (manager, i) {
        lifecycles["on" + names[i]] = function (handler) { return manager.add(handler); };
        lifecycles["notify" + names[i]] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return manager.notify.apply(manager, (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(args), false));
        };
    });
    return lifecycles;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/utils/motion-values.mjs




function updateMotionValuesFromProps(element, next, prev) {
    var _a;
    for (var key in next) {
        var nextValue = next[key];
        var prevValue = prev[key];
        if ((0,is_motion_value/* isMotionValue */.i)(nextValue)) {
            /**
             * If this is a motion value found in props or style, we want to add it
             * to our visual element's motion value map.
             */
            element.addValue(key, nextValue);
            /**
             * Check the version of the incoming motion value with this version
             * and warn against mismatches.
             */
            if (false) {}
        }
        else if ((0,is_motion_value/* isMotionValue */.i)(prevValue)) {
            /**
             * If we're swapping to a new motion value, create a new motion value
             * from that
             */
            element.addValue(key, (0,es_value/* motionValue */.B)(nextValue));
        }
        else if (prevValue !== nextValue) {
            /**
             * If this is a flat value that has changed, update the motion value
             * or create one if it doesn't exist. We only want to do this if we're
             * not handling the value with our animation state.
             */
            if (element.hasValue(key)) {
                var existingValue = element.getValue(key);
                // TODO: Only update values that aren't being animated or even looked at
                !existingValue.hasAnimated && existingValue.set(nextValue);
            }
            else {
                element.addValue(key, (0,es_value/* motionValue */.B)((_a = element.getStaticValue(key)) !== null && _a !== void 0 ? _a : nextValue));
            }
        }
    }
    // Handle removed values
    for (var key in prev) {
        if (next[key] === undefined)
            element.removeValue(key);
    }
    return next;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/variants.mjs
var variants = __webpack_require__(7909);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/index.mjs









var visualElement = function (_a) {
    var _b = _a.treeType, treeType = _b === void 0 ? "" : _b, build = _a.build, getBaseTarget = _a.getBaseTarget, makeTargetAnimatable = _a.makeTargetAnimatable, measureViewportBox = _a.measureViewportBox, renderInstance = _a.render, readValueFromInstance = _a.readValueFromInstance, removeValueFromRenderState = _a.removeValueFromRenderState, sortNodePosition = _a.sortNodePosition, scrapeMotionValuesFromProps = _a.scrapeMotionValuesFromProps;
    return function (_a, options) {
        var parent = _a.parent, props = _a.props, presenceId = _a.presenceId, blockInitialAnimation = _a.blockInitialAnimation, visualState = _a.visualState, shouldReduceMotion = _a.shouldReduceMotion;
        if (options === void 0) { options = {}; }
        var isMounted = false;
        var latestValues = visualState.latestValues, renderState = visualState.renderState;
        /**
         * The instance of the render-specific node that will be hydrated by the
         * exposed React ref. So for example, this visual element can host a
         * HTMLElement, plain object, or Three.js object. The functions provided
         * in VisualElementConfig allow us to interface with this instance.
         */
        var instance;
        /**
         * Manages the subscriptions for a visual element's lifecycle, for instance
         * onRender
         */
        var lifecycles = createLifecycles();
        /**
         * A map of all motion values attached to this visual element. Motion
         * values are source of truth for any given animated value. A motion
         * value might be provided externally by the component via props.
         */
        var values = new Map();
        /**
         * A map of every subscription that binds the provided or generated
         * motion values onChange listeners to this visual element.
         */
        var valueSubscriptions = new Map();
        /**
         * A reference to the previously-provided motion values as returned
         * from scrapeMotionValuesFromProps. We use the keys in here to determine
         * if any motion values need to be removed after props are updated.
         */
        var prevMotionValues = {};
        /**
         * When values are removed from all animation props we need to search
         * for a fallback value to animate to. These values are tracked in baseTarget.
         */
        var baseTarget = (0,tslib_es6.__assign)({}, latestValues);
        // Internal methods ========================
        /**
         * On mount, this will be hydrated with a callback to disconnect
         * this visual element from its parent on unmount.
         */
        var removeFromVariantTree;
        /**
         * Render the element with the latest styles outside of the React
         * render lifecycle
         */
        function render() {
            if (!instance || !isMounted)
                return;
            triggerBuild();
            renderInstance(instance, renderState, props.style, element.projection);
        }
        function triggerBuild() {
            build(element, renderState, latestValues, options, props);
        }
        function update() {
            lifecycles.notifyUpdate(latestValues);
        }
        /**
         *
         */
        function bindToMotionValue(key, value) {
            var removeOnChange = value.onChange(function (latestValue) {
                latestValues[key] = latestValue;
                props.onUpdate && es/* default.update */.ZP.update(update, false, true);
            });
            var removeOnRenderRequest = value.onRenderRequest(element.scheduleRender);
            valueSubscriptions.set(key, function () {
                removeOnChange();
                removeOnRenderRequest();
            });
        }
        /**
         * Any motion values that are provided to the element when created
         * aren't yet bound to the element, as this would technically be impure.
         * However, we iterate through the motion values and set them to the
         * initial values for this component.
         *
         * TODO: This is impure and we should look at changing this to run on mount.
         * Doing so will break some tests but this isn't neccessarily a breaking change,
         * more a reflection of the test.
         */
        var initialMotionValues = scrapeMotionValuesFromProps(props);
        for (var key in initialMotionValues) {
            var value = initialMotionValues[key];
            if (latestValues[key] !== undefined && (0,is_motion_value/* isMotionValue */.i)(value)) {
                value.set(latestValues[key], false);
            }
        }
        /**
         * Determine what role this visual element should take in the variant tree.
         */
        var isControllingVariants = (0,variants/* checkIfControllingVariants */.O6)(props);
        var isVariantNode = (0,variants/* checkIfVariantNode */.e8)(props);
        var element = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({ treeType: treeType, 
            /**
             * This is a mirror of the internal instance prop, which keeps
             * VisualElement type-compatible with React's RefObject.
             */
            current: null, 
            /**
             * The depth of this visual element within the visual element tree.
             */
            depth: parent ? parent.depth + 1 : 0, parent: parent, children: new Set(), 
            /**
             *
             */
            presenceId: presenceId, shouldReduceMotion: shouldReduceMotion, 
            /**
             * If this component is part of the variant tree, it should track
             * any children that are also part of the tree. This is essentially
             * a shadow tree to simplify logic around how to stagger over children.
             */
            variantChildren: isVariantNode ? new Set() : undefined, 
            /**
             * Whether this instance is visible. This can be changed imperatively
             * by the projection tree, is analogous to CSS's visibility in that
             * hidden elements should take up layout, and needs enacting by the configured
             * render function.
             */
            isVisible: undefined, 
            /**
             * Normally, if a component is controlled by a parent's variants, it can
             * rely on that ancestor to trigger animations further down the tree.
             * However, if a component is created after its parent is mounted, the parent
             * won't trigger that mount animation so the child needs to.
             *
             * TODO: This might be better replaced with a method isParentMounted
             */
            manuallyAnimateOnMount: Boolean(parent === null || parent === void 0 ? void 0 : parent.isMounted()), 
            /**
             * This can be set by AnimatePresence to force components that mount
             * at the same time as it to mount as if they have initial={false} set.
             */
            blockInitialAnimation: blockInitialAnimation, 
            /**
             * Determine whether this component has mounted yet. This is mostly used
             * by variant children to determine whether they need to trigger their
             * own animations on mount.
             */
            isMounted: function () { return Boolean(instance); }, mount: function (newInstance) {
                isMounted = true;
                instance = element.current = newInstance;
                if (element.projection) {
                    element.projection.mount(newInstance);
                }
                if (isVariantNode && parent && !isControllingVariants) {
                    removeFromVariantTree = parent === null || parent === void 0 ? void 0 : parent.addVariantChild(element);
                }
                values.forEach(function (value, key) { return bindToMotionValue(key, value); });
                parent === null || parent === void 0 ? void 0 : parent.children.add(element);
                element.setProps(props);
            }, 
            /**
             *
             */
            unmount: function () {
                var _a;
                (_a = element.projection) === null || _a === void 0 ? void 0 : _a.unmount();
                es/* cancelSync.update */.qY.update(update);
                es/* cancelSync.render */.qY.render(render);
                valueSubscriptions.forEach(function (remove) { return remove(); });
                removeFromVariantTree === null || removeFromVariantTree === void 0 ? void 0 : removeFromVariantTree();
                parent === null || parent === void 0 ? void 0 : parent.children.delete(element);
                lifecycles.clearAllListeners();
                instance = undefined;
                isMounted = false;
            }, 
            /**
             * Add a child visual element to our set of children.
             */
            addVariantChild: function (child) {
                var _a;
                var closestVariantNode = element.getClosestVariantNode();
                if (closestVariantNode) {
                    (_a = closestVariantNode.variantChildren) === null || _a === void 0 ? void 0 : _a.add(child);
                    return function () {
                        return closestVariantNode.variantChildren.delete(child);
                    };
                }
            }, sortNodePosition: function (other) {
                /**
                 * If these nodes aren't even of the same type we can't compare their depth.
                 */
                if (!sortNodePosition || treeType !== other.treeType)
                    return 0;
                return sortNodePosition(element.getInstance(), other.getInstance());
            }, 
            /**
             * Returns the closest variant node in the tree starting from
             * this visual element.
             */
            getClosestVariantNode: function () {
                return isVariantNode ? element : parent === null || parent === void 0 ? void 0 : parent.getClosestVariantNode();
            }, 
            /**
             * Expose the latest layoutId prop.
             */
            getLayoutId: function () { return props.layoutId; }, 
            /**
             * Returns the current instance.
             */
            getInstance: function () { return instance; }, 
            /**
             * Get/set the latest static values.
             */
            getStaticValue: function (key) { return latestValues[key]; }, setStaticValue: function (key, value) { return (latestValues[key] = value); }, 
            /**
             * Returns the latest motion value state. Currently only used to take
             * a snapshot of the visual element - perhaps this can return the whole
             * visual state
             */
            getLatestValues: function () { return latestValues; }, 
            /**
             * Set the visiblity of the visual element. If it's changed, schedule
             * a render to reflect these changes.
             */
            setVisibility: function (visibility) {
                if (element.isVisible === visibility)
                    return;
                element.isVisible = visibility;
                element.scheduleRender();
            }, 
            /**
             * Make a target animatable by Popmotion. For instance, if we're
             * trying to animate width from 100px to 100vw we need to measure 100vw
             * in pixels to determine what we really need to animate to. This is also
             * pluggable to support Framer's custom value types like Color,
             * and CSS variables.
             */
            makeTargetAnimatable: function (target, canMutate) {
                if (canMutate === void 0) { canMutate = true; }
                return makeTargetAnimatable(element, target, props, canMutate);
            }, 
            /**
             * Measure the current viewport box with or without transforms.
             * Only measures axis-aligned boxes, rotate and skew must be manually
             * removed with a re-render to work.
             */
            measureViewportBox: function () {
                return measureViewportBox(instance, props);
            }, 
            // Motion values ========================
            /**
             * Add a motion value and bind it to this visual element.
             */
            addValue: function (key, value) {
                // Remove existing value if it exists
                if (element.hasValue(key))
                    element.removeValue(key);
                values.set(key, value);
                latestValues[key] = value.get();
                bindToMotionValue(key, value);
            }, 
            /**
             * Remove a motion value and unbind any active subscriptions.
             */
            removeValue: function (key) {
                var _a;
                values.delete(key);
                (_a = valueSubscriptions.get(key)) === null || _a === void 0 ? void 0 : _a();
                valueSubscriptions.delete(key);
                delete latestValues[key];
                removeValueFromRenderState(key, renderState);
            }, 
            /**
             * Check whether we have a motion value for this key
             */
            hasValue: function (key) { return values.has(key); }, 
            /**
             * Get a motion value for this key. If called with a default
             * value, we'll create one if none exists.
             */
            getValue: function (key, defaultValue) {
                var value = values.get(key);
                if (value === undefined && defaultValue !== undefined) {
                    value = (0,es_value/* motionValue */.B)(defaultValue);
                    element.addValue(key, value);
                }
                return value;
            }, 
            /**
             * Iterate over our motion values.
             */
            forEachValue: function (callback) { return values.forEach(callback); }, 
            /**
             * If we're trying to animate to a previously unencountered value,
             * we need to check for it in our state and as a last resort read it
             * directly from the instance (which might have performance implications).
             */
            readValue: function (key) {
                var _a;
                return (_a = latestValues[key]) !== null && _a !== void 0 ? _a : readValueFromInstance(instance, key, options);
            }, 
            /**
             * Set the base target to later animate back to. This is currently
             * only hydrated on creation and when we first read a value.
             */
            setBaseTarget: function (key, value) {
                baseTarget[key] = value;
            }, 
            /**
             * Find the base target for a value thats been removed from all animation
             * props.
             */
            getBaseTarget: function (key) {
                if (getBaseTarget) {
                    var target = getBaseTarget(props, key);
                    if (target !== undefined && !(0,is_motion_value/* isMotionValue */.i)(target))
                        return target;
                }
                return baseTarget[key];
            } }, lifecycles), { 
            /**
             * Build the renderer state based on the latest visual state.
             */
            build: function () {
                triggerBuild();
                return renderState;
            }, 
            /**
             * Schedule a render on the next animation frame.
             */
            scheduleRender: function () {
                es/* default.render */.ZP.render(render, false, true);
            }, 
            /**
             * Synchronously fire render. It's prefered that we batch renders but
             * in many circumstances, like layout measurement, we need to run this
             * synchronously. However in those instances other measures should be taken
             * to batch reads/writes.
             */
            syncRender: render, 
            /**
             * Update the provided props. Ensure any newly-added motion values are
             * added to our map, old ones removed, and listeners updated.
             */
            setProps: function (newProps) {
                if (newProps.transformTemplate || props.transformTemplate) {
                    element.scheduleRender();
                }
                props = newProps;
                lifecycles.updatePropListeners(newProps);
                prevMotionValues = updateMotionValuesFromProps(element, scrapeMotionValuesFromProps(props), prevMotionValues);
            }, getProps: function () { return props; }, 
            // Variants ==============================
            /**
             * Returns the variant definition with a given name.
             */
            getVariant: function (name) { var _a; return (_a = props.variants) === null || _a === void 0 ? void 0 : _a[name]; }, 
            /**
             * Returns the defined default transition on this component.
             */
            getDefaultTransition: function () { return props.transition; }, getTransformPagePoint: function () {
                return props.transformPagePoint;
            }, 
            /**
             * Used by child variant nodes to get the closest ancestor variant props.
             */
            getVariantContext: function (startAtParent) {
                if (startAtParent === void 0) { startAtParent = false; }
                if (startAtParent)
                    return parent === null || parent === void 0 ? void 0 : parent.getVariantContext();
                if (!isControllingVariants) {
                    var context_1 = (parent === null || parent === void 0 ? void 0 : parent.getVariantContext()) || {};
                    if (props.initial !== undefined) {
                        context_1.initial = props.initial;
                    }
                    return context_1;
                }
                var context = {};
                for (var i = 0; i < numVariantProps; i++) {
                    var name_1 = variantProps[i];
                    var prop = props[name_1];
                    if ((0,variants/* isVariantLabel */.$L)(prop) || prop === false) {
                        context[name_1] = prop;
                    }
                }
                return context;
            } });
        return element;
    };
};
var variantProps = (0,tslib_es6.__spreadArray)(["initial"], (0,tslib_es6.__read)(animation_state/* variantPriorityOrder */.eF), false);
var numVariantProps = variantProps.length;




/***/ }),

/***/ 5415:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "i": function() { return /* binding */ buildSVGAttrs; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/html/utils/build-styles.mjs + 2 modules
var build_styles = __webpack_require__(8057);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/numbers/units.mjs
var units = __webpack_require__(2969);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/transform-origin.mjs


function calcOrigin(origin, offset, size) {
    return typeof origin === "string"
        ? origin
        : units.px.transform(offset + size * origin);
}
/**
 * The SVG transform origin defaults are different to CSS and is less intuitive,
 * so we use the measured dimensions of the SVG to reconcile these.
 */
function calcSVGTransformOrigin(dimensions, originX, originY) {
    var pxOriginX = calcOrigin(originX, dimensions.x, dimensions.width);
    var pxOriginY = calcOrigin(originY, dimensions.y, dimensions.height);
    return "".concat(pxOriginX, " ").concat(pxOriginY);
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/path.mjs


var dashKeys = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray",
};
var camelKeys = {
    offset: "strokeDashoffset",
    array: "strokeDasharray",
};
/**
 * Build SVG path properties. Uses the path's measured length to convert
 * our custom pathLength, pathSpacing and pathOffset into stroke-dashoffset
 * and stroke-dasharray attributes.
 *
 * This function is mutative to reduce per-frame GC.
 */
function buildSVGPath(attrs, length, spacing, offset, useDashCase) {
    if (spacing === void 0) { spacing = 1; }
    if (offset === void 0) { offset = 0; }
    if (useDashCase === void 0) { useDashCase = true; }
    // Normalise path length by setting SVG attribute pathLength to 1
    attrs.pathLength = 1;
    // We use dash case when setting attributes directly to the DOM node and camel case
    // when defining props on a React component.
    var keys = useDashCase ? dashKeys : camelKeys;
    // Build the dash offset
    attrs[keys.offset] = units.px.transform(-offset);
    // Build the dash array
    var pathLength = units.px.transform(length);
    var pathSpacing = units.px.transform(spacing);
    attrs[keys.array] = "".concat(pathLength, " ").concat(pathSpacing);
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/svg/utils/build-attrs.mjs





/**
 * Build SVG visual attrbutes, like cx and style.transform
 */
function buildSVGAttrs(state, _a, options, transformTemplate) {
    var attrX = _a.attrX, attrY = _a.attrY, originX = _a.originX, originY = _a.originY, pathLength = _a.pathLength, _b = _a.pathSpacing, pathSpacing = _b === void 0 ? 1 : _b, _c = _a.pathOffset, pathOffset = _c === void 0 ? 0 : _c, 
    // This is object creation, which we try to avoid per-frame.
    latest = (0,tslib_es6.__rest)(_a, ["attrX", "attrY", "originX", "originY", "pathLength", "pathSpacing", "pathOffset"]);
    (0,build_styles/* buildHTMLStyles */.r)(state, latest, options, transformTemplate);
    state.attrs = state.style;
    state.style = {};
    var attrs = state.attrs, style = state.style, dimensions = state.dimensions;
    /**
     * However, we apply transforms as CSS transforms. So if we detect a transform we take it from attrs
     * and copy it into style.
     */
    if (attrs.transform) {
        if (dimensions)
            style.transform = attrs.transform;
        delete attrs.transform;
    }
    // Parse transformOrigin
    if (dimensions &&
        (originX !== undefined || originY !== undefined || style.transform)) {
        style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== undefined ? originX : 0.5, originY !== undefined ? originY : 0.5);
    }
    // Treat x/y not as shortcuts but as actual attributes
    if (attrX !== undefined)
        attrs.x = attrX;
    if (attrY !== undefined)
        attrs.y = attrY;
    // Build SVG path if one has been defined
    if (pathLength !== undefined) {
        buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
    }
}




/***/ }),

/***/ 7302:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": function() { return /* binding */ camelCaseAttributes; }
/* harmony export */ });
/**
 * A set of attribute names that are always read/written as camel case.
 */
var camelCaseAttributes = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
]);




/***/ }),

/***/ 8504:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": function() { return /* binding */ renderSVG; }
/* harmony export */ });
/* harmony import */ var _dom_utils_camel_to_dash_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1219);
/* harmony import */ var _html_utils_render_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4242);
/* harmony import */ var _camel_case_attrs_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7302);




function renderSVG(element, renderState, _styleProp, projection) {
    (0,_html_utils_render_mjs__WEBPACK_IMPORTED_MODULE_0__/* .renderHTML */ .N)(element, renderState, undefined, projection);
    for (var key in renderState.attrs) {
        element.setAttribute(!_camel_case_attrs_mjs__WEBPACK_IMPORTED_MODULE_1__/* .camelCaseAttributes.has */ .s.has(key) ? (0,_dom_utils_camel_to_dash_mjs__WEBPACK_IMPORTED_MODULE_2__/* .camelToDash */ .D)(key) : key, renderState.attrs[key]);
    }
}




/***/ }),

/***/ 6832:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "U": function() { return /* binding */ scrapeMotionValuesFromProps; }
/* harmony export */ });
/* harmony import */ var _value_utils_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(406);
/* harmony import */ var _html_utils_scrape_motion_values_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(189);



function scrapeMotionValuesFromProps(props) {
    var newValues = (0,_html_utils_scrape_motion_values_mjs__WEBPACK_IMPORTED_MODULE_0__/* .scrapeMotionValuesFromProps */ .U)(props);
    for (var key in props) {
        if ((0,_value_utils_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isMotionValue */ .i)(props[key])) {
            var targetKey = key === "x" || key === "y" ? "attr" + key.toUpperCase() : key;
            newValues[targetKey] = props[key];
        }
    }
    return newValues;
}




/***/ }),

/***/ 2620:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "MS": function() { return /* binding */ createAnimationState; },
  "eF": function() { return /* binding */ variantPriorityOrder; }
});

// UNUSED EXPORTS: checkVariantsDidChange

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/utils/is-animation-controls.mjs
var is_animation_controls = __webpack_require__(3077);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/animation/utils/is-keyframes-target.mjs
var is_keyframes_target = __webpack_require__(8488);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/shallow-compare.mjs
function shallowCompare(next, prev) {
    if (!Array.isArray(prev))
        return false;
    var prevLength = prev.length;
    if (prevLength !== next.length)
        return false;
    for (var i = 0; i < prevLength; i++) {
        if (prev[i] !== next[i])
            return false;
    }
    return true;
}



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/animation.mjs
var utils_animation = __webpack_require__(7107);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/types.mjs
var types = __webpack_require__(3233);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/variants.mjs
var variants = __webpack_require__(7909);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/utils/animation-state.mjs








var variantPriorityOrder = [
    types/* AnimationType.Animate */.r.Animate,
    types/* AnimationType.InView */.r.InView,
    types/* AnimationType.Focus */.r.Focus,
    types/* AnimationType.Hover */.r.Hover,
    types/* AnimationType.Tap */.r.Tap,
    types/* AnimationType.Drag */.r.Drag,
    types/* AnimationType.Exit */.r.Exit,
];
var reversePriorityOrder = (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(variantPriorityOrder), false).reverse();
var numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement) {
    return function (animations) {
        return Promise.all(animations.map(function (_a) {
            var animation = _a.animation, options = _a.options;
            return (0,utils_animation/* animateVisualElement */.d5)(visualElement, animation, options);
        }));
    };
}
function createAnimationState(visualElement) {
    var animate = animateList(visualElement);
    var state = createState();
    var allAnimatedKeys = {};
    var isInitialRender = true;
    /**
     * This function will be used to reduce the animation definitions for
     * each active animation type into an object of resolved values for it.
     */
    var buildResolvedTypeValues = function (acc, definition) {
        var resolved = (0,variants/* resolveVariant */.x5)(visualElement, definition);
        if (resolved) {
            resolved.transition; var transitionEnd = resolved.transitionEnd, target = (0,tslib_es6.__rest)(resolved, ["transition", "transitionEnd"]);
            acc = (0,tslib_es6.__assign)((0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, acc), target), transitionEnd);
        }
        return acc;
    };
    function isAnimated(key) {
        return allAnimatedKeys[key] !== undefined;
    }
    /**
     * This just allows us to inject mocked animation functions
     * @internal
     */
    function setAnimateFunction(makeAnimator) {
        animate = makeAnimator(visualElement);
    }
    /**
     * When we receive new props, we need to:
     * 1. Create a list of protected keys for each type. This is a directory of
     *    value keys that are currently being "handled" by types of a higher priority
     *    so that whenever an animation is played of a given type, these values are
     *    protected from being animated.
     * 2. Determine if an animation type needs animating.
     * 3. Determine if any values have been removed from a type and figure out
     *    what to animate those to.
     */
    function animateChanges(options, changedActiveType) {
        var _a;
        var props = visualElement.getProps();
        var context = visualElement.getVariantContext(true) || {};
        /**
         * A list of animations that we'll build into as we iterate through the animation
         * types. This will get executed at the end of the function.
         */
        var animations = [];
        /**
         * Keep track of which values have been removed. Then, as we hit lower priority
         * animation types, we can check if they contain removed values and animate to that.
         */
        var removedKeys = new Set();
        /**
         * A dictionary of all encountered keys. This is an object to let us build into and
         * copy it without iteration. Each time we hit an animation type we set its protected
         * keys - the keys its not allowed to animate - to the latest version of this object.
         */
        var encounteredKeys = {};
        /**
         * If a variant has been removed at a given index, and this component is controlling
         * variant animations, we want to ensure lower-priority variants are forced to animate.
         */
        var removedVariantIndex = Infinity;
        var _loop_1 = function (i) {
            var type = reversePriorityOrder[i];
            var typeState = state[type];
            var prop = (_a = props[type]) !== null && _a !== void 0 ? _a : context[type];
            var propIsVariant = (0,variants/* isVariantLabel */.$L)(prop);
            /**
             * If this type has *just* changed isActive status, set activeDelta
             * to that status. Otherwise set to null.
             */
            var activeDelta = type === changedActiveType ? typeState.isActive : null;
            if (activeDelta === false)
                removedVariantIndex = i;
            /**
             * If this prop is an inherited variant, rather than been set directly on the
             * component itself, we want to make sure we allow the parent to trigger animations.
             *
             * TODO: Can probably change this to a !isControllingVariants check
             */
            var isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
            /**
             *
             */
            if (isInherited &&
                isInitialRender &&
                visualElement.manuallyAnimateOnMount) {
                isInherited = false;
            }
            /**
             * Set all encountered keys so far as the protected keys for this type. This will
             * be any key that has been animated or otherwise handled by active, higher-priortiy types.
             */
            typeState.protectedKeys = (0,tslib_es6.__assign)({}, encounteredKeys);
            // Check if we can skip analysing this prop early
            if (
            // If it isn't active and hasn't *just* been set as inactive
            (!typeState.isActive && activeDelta === null) ||
                // If we didn't and don't have any defined prop for this animation type
                (!prop && !typeState.prevProp) ||
                // Or if the prop doesn't define an animation
                (0,is_animation_controls/* isAnimationControls */.H)(prop) ||
                typeof prop === "boolean") {
                return "continue";
            }
            /**
             * As we go look through the values defined on this type, if we detect
             * a changed value or a value that was removed in a higher priority, we set
             * this to true and add this prop to the animation list.
             */
            var variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
            var shouldAnimateType = variantDidChange ||
                // If we're making this variant active, we want to always make it active
                (type === changedActiveType &&
                    typeState.isActive &&
                    !isInherited &&
                    propIsVariant) ||
                // If we removed a higher-priority variant (i is in reverse order)
                (i > removedVariantIndex && propIsVariant);
            /**
             * As animations can be set as variant lists, variants or target objects, we
             * coerce everything to an array if it isn't one already
             */
            var definitionList = Array.isArray(prop) ? prop : [prop];
            /**
             * Build an object of all the resolved values. We'll use this in the subsequent
             * animateChanges calls to determine whether a value has changed.
             */
            var resolvedValues = definitionList.reduce(buildResolvedTypeValues, {});
            if (activeDelta === false)
                resolvedValues = {};
            /**
             * Now we need to loop through all the keys in the prev prop and this prop,
             * and decide:
             * 1. If the value has changed, and needs animating
             * 2. If it has been removed, and needs adding to the removedKeys set
             * 3. If it has been removed in a higher priority type and needs animating
             * 4. If it hasn't been removed in a higher priority but hasn't changed, and
             *    needs adding to the type's protectedKeys list.
             */
            var _b = typeState.prevResolvedValues, prevResolvedValues = _b === void 0 ? {} : _b;
            var allKeys = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, prevResolvedValues), resolvedValues);
            var markToAnimate = function (key) {
                shouldAnimateType = true;
                removedKeys.delete(key);
                typeState.needsAnimating[key] = true;
            };
            for (var key in allKeys) {
                var next = resolvedValues[key];
                var prev = prevResolvedValues[key];
                // If we've already handled this we can just skip ahead
                if (encounteredKeys.hasOwnProperty(key))
                    continue;
                /**
                 * If the value has changed, we probably want to animate it.
                 */
                if (next !== prev) {
                    /**
                     * If both values are keyframes, we need to shallow compare them to
                     * detect whether any value has changed. If it has, we animate it.
                     */
                    if ((0,is_keyframes_target/* isKeyframesTarget */.C)(next) && (0,is_keyframes_target/* isKeyframesTarget */.C)(prev)) {
                        if (!shallowCompare(next, prev) || variantDidChange) {
                            markToAnimate(key);
                        }
                        else {
                            /**
                             * If it hasn't changed, we want to ensure it doesn't animate by
                             * adding it to the list of protected keys.
                             */
                            typeState.protectedKeys[key] = true;
                        }
                    }
                    else if (next !== undefined) {
                        // If next is defined and doesn't equal prev, it needs animating
                        markToAnimate(key);
                    }
                    else {
                        // If it's undefined, it's been removed.
                        removedKeys.add(key);
                    }
                }
                else if (next !== undefined && removedKeys.has(key)) {
                    /**
                     * If next hasn't changed and it isn't undefined, we want to check if it's
                     * been removed by a higher priority
                     */
                    markToAnimate(key);
                }
                else {
                    /**
                     * If it hasn't changed, we add it to the list of protected values
                     * to ensure it doesn't get animated.
                     */
                    typeState.protectedKeys[key] = true;
                }
            }
            /**
             * Update the typeState so next time animateChanges is called we can compare the
             * latest prop and resolvedValues to these.
             */
            typeState.prevProp = prop;
            typeState.prevResolvedValues = resolvedValues;
            /**
             *
             */
            if (typeState.isActive) {
                encounteredKeys = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, encounteredKeys), resolvedValues);
            }
            if (isInitialRender && visualElement.blockInitialAnimation) {
                shouldAnimateType = false;
            }
            /**
             * If this is an inherited prop we want to hard-block animations
             * TODO: Test as this should probably still handle animations triggered
             * by removed values?
             */
            if (shouldAnimateType && !isInherited) {
                animations.push.apply(animations, (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(definitionList.map(function (animation) { return ({
                    animation: animation,
                    options: (0,tslib_es6.__assign)({ type: type }, options),
                }); })), false));
            }
        };
        /**
         * Iterate through all animation types in reverse priority order. For each, we want to
         * detect which values it's handling and whether or not they've changed (and therefore
         * need to be animated). If any values have been removed, we want to detect those in
         * lower priority props and flag for animation.
         */
        for (var i = 0; i < numAnimationTypes; i++) {
            _loop_1(i);
        }
        allAnimatedKeys = (0,tslib_es6.__assign)({}, encounteredKeys);
        /**
         * If there are some removed value that haven't been dealt with,
         * we need to create a new animation that falls back either to the value
         * defined in the style prop, or the last read value.
         */
        if (removedKeys.size) {
            var fallbackAnimation_1 = {};
            removedKeys.forEach(function (key) {
                var fallbackTarget = visualElement.getBaseTarget(key);
                if (fallbackTarget !== undefined) {
                    fallbackAnimation_1[key] = fallbackTarget;
                }
            });
            animations.push({ animation: fallbackAnimation_1 });
        }
        var shouldAnimate = Boolean(animations.length);
        if (isInitialRender &&
            props.initial === false &&
            !visualElement.manuallyAnimateOnMount) {
            shouldAnimate = false;
        }
        isInitialRender = false;
        return shouldAnimate ? animate(animations) : Promise.resolve();
    }
    /**
     * Change whether a certain animation type is active.
     */
    function setActive(type, isActive, options) {
        var _a;
        // If the active state hasn't changed, we can safely do nothing here
        if (state[type].isActive === isActive)
            return Promise.resolve();
        // Propagate active change to children
        (_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) { var _a; return (_a = child.animationState) === null || _a === void 0 ? void 0 : _a.setActive(type, isActive); });
        state[type].isActive = isActive;
        var animations = animateChanges(options, type);
        for (var key in state) {
            state[key].protectedKeys = {};
        }
        return animations;
    }
    return {
        isAnimated: isAnimated,
        animateChanges: animateChanges,
        setActive: setActive,
        setAnimateFunction: setAnimateFunction,
        getState: function () { return state; },
    };
}
function checkVariantsDidChange(prev, next) {
    if (typeof next === "string") {
        return next !== prev;
    }
    else if ((0,variants/* isVariantLabels */.A0)(next)) {
        return !shallowCompare(next, prev);
    }
    return false;
}
function createTypeState(isActive) {
    if (isActive === void 0) { isActive = false; }
    return {
        isActive: isActive,
        protectedKeys: {},
        needsAnimating: {},
        prevResolvedValues: {},
    };
}
function createState() {
    var _a;
    return _a = {},
        _a[types/* AnimationType.Animate */.r.Animate] = createTypeState(true),
        _a[types/* AnimationType.InView */.r.InView] = createTypeState(),
        _a[types/* AnimationType.Hover */.r.Hover] = createTypeState(),
        _a[types/* AnimationType.Tap */.r.Tap] = createTypeState(),
        _a[types/* AnimationType.Drag */.r.Drag] = createTypeState(),
        _a[types/* AnimationType.Focus */.r.Focus] = createTypeState(),
        _a[types/* AnimationType.Exit */.r.Exit] = createTypeState(),
        _a;
}




/***/ }),

/***/ 7107:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d5": function() { return /* binding */ animateVisualElement; },
/* harmony export */   "p_": function() { return /* binding */ stopAnimation; }
/* harmony export */ });
/* unused harmony export sortByTreeOrder */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(655);
/* harmony import */ var _animation_utils_transitions_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6522);
/* harmony import */ var _setters_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5759);
/* harmony import */ var _variants_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7909);
/* harmony import */ var _html_utils_transform_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4714);






function animateVisualElement(visualElement, definition, options) {
    if (options === void 0) { options = {}; }
    visualElement.notifyAnimationStart(definition);
    var animation;
    if (Array.isArray(definition)) {
        var animations = definition.map(function (variant) {
            return animateVariant(visualElement, variant, options);
        });
        animation = Promise.all(animations);
    }
    else if (typeof definition === "string") {
        animation = animateVariant(visualElement, definition, options);
    }
    else {
        var resolvedDefinition = typeof definition === "function"
            ? (0,_variants_mjs__WEBPACK_IMPORTED_MODULE_0__/* .resolveVariant */ .x5)(visualElement, definition, options.custom)
            : definition;
        animation = animateTarget(visualElement, resolvedDefinition, options);
    }
    return animation.then(function () {
        return visualElement.notifyAnimationComplete(definition);
    });
}
function animateVariant(visualElement, variant, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var resolved = (0,_variants_mjs__WEBPACK_IMPORTED_MODULE_0__/* .resolveVariant */ .x5)(visualElement, variant, options.custom);
    var _b = (resolved || {}).transition, transition = _b === void 0 ? visualElement.getDefaultTransition() || {} : _b;
    if (options.transitionOverride) {
        transition = options.transitionOverride;
    }
    /**
     * If we have a variant, create a callback that runs it as an animation.
     * Otherwise, we resolve a Promise immediately for a composable no-op.
     */
    var getAnimation = resolved
        ? function () { return animateTarget(visualElement, resolved, options); }
        : function () { return Promise.resolve(); };
    /**
     * If we have children, create a callback that runs all their animations.
     * Otherwise, we resolve a Promise immediately for a composable no-op.
     */
    var getChildAnimations = ((_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.size)
        ? function (forwardDelay) {
            if (forwardDelay === void 0) { forwardDelay = 0; }
            var _a = transition.delayChildren, delayChildren = _a === void 0 ? 0 : _a, staggerChildren = transition.staggerChildren, staggerDirection = transition.staggerDirection;
            return animateChildren(visualElement, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options);
        }
        : function () { return Promise.resolve(); };
    /**
     * If the transition explicitly defines a "when" option, we need to resolve either
     * this animation or all children animations before playing the other.
     */
    var when = transition.when;
    if (when) {
        var _c = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(when === "beforeChildren"
            ? [getAnimation, getChildAnimations]
            : [getChildAnimations, getAnimation], 2), first = _c[0], last = _c[1];
        return first().then(last);
    }
    else {
        return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
    }
}
/**
 * @internal
 */
function animateTarget(visualElement, definition, _a) {
    var _b;
    var _c = _a === void 0 ? {} : _a, _d = _c.delay, delay = _d === void 0 ? 0 : _d, transitionOverride = _c.transitionOverride, type = _c.type;
    var _e = visualElement.makeTargetAnimatable(definition), _f = _e.transition, transition = _f === void 0 ? visualElement.getDefaultTransition() : _f, transitionEnd = _e.transitionEnd, target = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(_e, ["transition", "transitionEnd"]);
    if (transitionOverride)
        transition = transitionOverride;
    var animations = [];
    var animationTypeState = type && ((_b = visualElement.animationState) === null || _b === void 0 ? void 0 : _b.getState()[type]);
    for (var key in target) {
        var value = visualElement.getValue(key);
        var valueTarget = target[key];
        if (!value ||
            valueTarget === undefined ||
            (animationTypeState &&
                shouldBlockAnimation(animationTypeState, key))) {
            continue;
        }
        var valueTransition = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({ delay: delay }, transition);
        /**
         * Make animation instant if this is a transform prop and we should reduce motion.
         */
        if (visualElement.shouldReduceMotion && (0,_html_utils_transform_mjs__WEBPACK_IMPORTED_MODULE_2__/* .isTransformProp */ ._c)(key)) {
            valueTransition = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, valueTransition), { type: false, delay: 0 });
        }
        var animation = (0,_animation_utils_transitions_mjs__WEBPACK_IMPORTED_MODULE_3__/* .startAnimation */ .b8)(key, value, valueTarget, valueTransition);
        animations.push(animation);
    }
    return Promise.all(animations).then(function () {
        transitionEnd && (0,_setters_mjs__WEBPACK_IMPORTED_MODULE_4__/* .setTarget */ .CD)(visualElement, transitionEnd);
    });
}
function animateChildren(visualElement, variant, delayChildren, staggerChildren, staggerDirection, options) {
    if (delayChildren === void 0) { delayChildren = 0; }
    if (staggerChildren === void 0) { staggerChildren = 0; }
    if (staggerDirection === void 0) { staggerDirection = 1; }
    var animations = [];
    var maxStaggerDuration = (visualElement.variantChildren.size - 1) * staggerChildren;
    var generateStaggerDuration = staggerDirection === 1
        ? function (i) {
            if (i === void 0) { i = 0; }
            return i * staggerChildren;
        }
        : function (i) {
            if (i === void 0) { i = 0; }
            return maxStaggerDuration - i * staggerChildren;
        };
    Array.from(visualElement.variantChildren)
        .sort(sortByTreeOrder)
        .forEach(function (child, i) {
        animations.push(animateVariant(child, variant, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, options), { delay: delayChildren + generateStaggerDuration(i) })).then(function () { return child.notifyAnimationComplete(variant); }));
    });
    return Promise.all(animations);
}
function stopAnimation(visualElement) {
    visualElement.forEachValue(function (value) { return value.stop(); });
}
function sortByTreeOrder(a, b) {
    return a.sortNodePosition(b);
}
/**
 * Decide whether we should block this animation. Previously, we achieved this
 * just by checking whether the key was listed in protectedKeys, but this
 * posed problems if an animation was triggered by afterChildren and protectedKeys
 * had been set to true in the meantime.
 */
function shouldBlockAnimation(_a, key) {
    var protectedKeys = _a.protectedKeys, needsAnimating = _a.needsAnimating;
    var shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
    needsAnimating[key] = false;
    return shouldBlock;
}




/***/ }),

/***/ 1419:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "E": function() { return /* binding */ FlatTree; }
});

// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/array.mjs
var array = __webpack_require__(10);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/utils/compare-by-depth.mjs
var compareByDepth = function (a, b) {
    return a.depth - b.depth;
};



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/utils/flat-tree.mjs



var FlatTree = /** @class */ (function () {
    function FlatTree() {
        this.children = [];
        this.isDirty = false;
    }
    FlatTree.prototype.add = function (child) {
        (0,array/* addUniqueItem */.y4)(this.children, child);
        this.isDirty = true;
    };
    FlatTree.prototype.remove = function (child) {
        (0,array/* removeItem */.cl)(this.children, child);
        this.isDirty = true;
    };
    FlatTree.prototype.forEach = function (callback) {
        this.isDirty && this.children.sort(compareByDepth);
        this.isDirty = false;
        this.children.forEach(callback);
    };
    return FlatTree;
}());




/***/ }),

/***/ 5759:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "GJ": function() { return /* binding */ checkTargetForNewValues; },
  "P$": function() { return /* binding */ getOrigin; },
  "CD": function() { return /* binding */ setTarget; },
  "gg": function() { return /* binding */ setValues; }
});

// UNUSED EXPORTS: getOriginFromTransition

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/complex/index.mjs
var complex = __webpack_require__(8407);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/is-numerical-string.mjs
/**
 * Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
 */
var isNumericalString = function (v) { return /^\-?\d*\.?\d+$/.test(v); };



;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/utils/is-zero-value-string.mjs
/**
 * Check if the value is a zero value string like "0px" or "0%"
 */
var isZeroValueString = function (v) { return /^0[^.\s]+$/.test(v); };



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/utils/resolve-value.mjs
var resolve_value = __webpack_require__(8715);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/value/index.mjs
var es_value = __webpack_require__(3234);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/animatable-none.mjs
var animatable_none = __webpack_require__(9135);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/color/index.mjs
var color = __webpack_require__(7405);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/dimensions.mjs + 1 modules
var dimensions = __webpack_require__(6440);
// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/test.mjs
var test = __webpack_require__(8340);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/dom/value-types/find.mjs





/**
 * A list of all ValueTypes
 */
var valueTypes = (0,tslib_es6.__spreadArray)((0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(dimensions/* dimensionValueTypes */.$), false), [color/* color */.$, complex/* complex */.P], false);
/**
 * Tests a value against the list of ValueTypes
 */
var findValueType = function (v) { return valueTypes.find((0,test/* testValueType */.l)(v)); };



// EXTERNAL MODULE: ./node_modules/framer-motion/dist/es/render/utils/variants.mjs
var variants = __webpack_require__(7909);
;// CONCATENATED MODULE: ./node_modules/framer-motion/dist/es/render/utils/setters.mjs










/**
 * Set VisualElement's MotionValue, creating a new MotionValue for it if
 * it doesn't exist.
 */
function setMotionValue(visualElement, key, value) {
    if (visualElement.hasValue(key)) {
        visualElement.getValue(key).set(value);
    }
    else {
        visualElement.addValue(key, (0,es_value/* motionValue */.B)(value));
    }
}
function setTarget(visualElement, definition) {
    var resolved = (0,variants/* resolveVariant */.x5)(visualElement, definition);
    var _a = resolved ? visualElement.makeTargetAnimatable(resolved, false) : {}, _b = _a.transitionEnd, transitionEnd = _b === void 0 ? {} : _b; _a.transition; var target = (0,tslib_es6.__rest)(_a, ["transitionEnd", "transition"]);
    target = (0,tslib_es6.__assign)((0,tslib_es6.__assign)({}, target), transitionEnd);
    for (var key in target) {
        var value = (0,resolve_value/* resolveFinalValueInKeyframes */.Y)(target[key]);
        setMotionValue(visualElement, key, value);
    }
}
function setVariants(visualElement, variantLabels) {
    var reversedLabels = (0,tslib_es6.__spreadArray)([], (0,tslib_es6.__read)(variantLabels), false).reverse();
    reversedLabels.forEach(function (key) {
        var _a;
        var variant = visualElement.getVariant(key);
        variant && setTarget(visualElement, variant);
        (_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            setVariants(child, variantLabels);
        });
    });
}
function setValues(visualElement, definition) {
    if (Array.isArray(definition)) {
        return setVariants(visualElement, definition);
    }
    else if (typeof definition === "string") {
        return setVariants(visualElement, [definition]);
    }
    else {
        setTarget(visualElement, definition);
    }
}
function checkTargetForNewValues(visualElement, target, origin) {
    var _a, _b, _c;
    var _d;
    var newValueKeys = Object.keys(target).filter(function (key) { return !visualElement.hasValue(key); });
    var numNewValues = newValueKeys.length;
    if (!numNewValues)
        return;
    for (var i = 0; i < numNewValues; i++) {
        var key = newValueKeys[i];
        var targetValue = target[key];
        var value = null;
        /**
         * If the target is a series of keyframes, we can use the first value
         * in the array. If this first value is null, we'll still need to read from the DOM.
         */
        if (Array.isArray(targetValue)) {
            value = targetValue[0];
        }
        /**
         * If the target isn't keyframes, or the first keyframe was null, we need to
         * first check if an origin value was explicitly defined in the transition as "from",
         * if not read the value from the DOM. As an absolute fallback, take the defined target value.
         */
        if (value === null) {
            value = (_b = (_a = origin[key]) !== null && _a !== void 0 ? _a : visualElement.readValue(key)) !== null && _b !== void 0 ? _b : target[key];
        }
        /**
         * If value is still undefined or null, ignore it. Preferably this would throw,
         * but this was causing issues in Framer.
         */
        if (value === undefined || value === null)
            continue;
        if (typeof value === "string" &&
            (isNumericalString(value) || isZeroValueString(value))) {
            // If this is a number read as a string, ie "0" or "200", convert it to a number
            value = parseFloat(value);
        }
        else if (!findValueType(value) && complex/* complex.test */.P.test(targetValue)) {
            value = (0,animatable_none/* getAnimatableNone */.T)(key, targetValue);
        }
        visualElement.addValue(key, (0,es_value/* motionValue */.B)(value));
        (_c = (_d = origin)[key]) !== null && _c !== void 0 ? _c : (_d[key] = value);
        visualElement.setBaseTarget(key, value);
    }
}
function getOriginFromTransition(key, transition) {
    if (!transition)
        return;
    var valueTransition = transition[key] || transition["default"] || transition;
    return valueTransition.from;
}
function getOrigin(target, transition, visualElement) {
    var _a, _b;
    var origin = {};
    for (var key in target) {
        origin[key] =
            (_a = getOriginFromTransition(key, transition)) !== null && _a !== void 0 ? _a : (_b = visualElement.getValue(key)) === null || _b === void 0 ? void 0 : _b.get();
    }
    return origin;
}




/***/ }),

/***/ 3233:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": function() { return /* binding */ AnimationType; }
/* harmony export */ });
var AnimationType;
(function (AnimationType) {
    AnimationType["Animate"] = "animate";
    AnimationType["Hover"] = "whileHover";
    AnimationType["Tap"] = "whileTap";
    AnimationType["Drag"] = "whileDrag";
    AnimationType["Focus"] = "whileFocus";
    AnimationType["InView"] = "whileInView";
    AnimationType["Exit"] = "exit";
})(AnimationType || (AnimationType = {}));




/***/ }),

/***/ 7909:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$L": function() { return /* binding */ isVariantLabel; },
/* harmony export */   "A0": function() { return /* binding */ isVariantLabels; },
/* harmony export */   "O6": function() { return /* binding */ checkIfControllingVariants; },
/* harmony export */   "e8": function() { return /* binding */ checkIfVariantNode; },
/* harmony export */   "oQ": function() { return /* binding */ resolveVariantFromProps; },
/* harmony export */   "x5": function() { return /* binding */ resolveVariant; }
/* harmony export */ });
/**
 * Decides if the supplied variable is an array of variant labels
 */
function isVariantLabels(v) {
    return Array.isArray(v);
}
/**
 * Decides if the supplied variable is variant label
 */
function isVariantLabel(v) {
    return typeof v === "string" || isVariantLabels(v);
}
/**
 * Creates an object containing the latest state of every MotionValue on a VisualElement
 */
function getCurrent(visualElement) {
    var current = {};
    visualElement.forEachValue(function (value, key) { return (current[key] = value.get()); });
    return current;
}
/**
 * Creates an object containing the latest velocity of every MotionValue on a VisualElement
 */
function getVelocity(visualElement) {
    var velocity = {};
    visualElement.forEachValue(function (value, key) { return (velocity[key] = value.getVelocity()); });
    return velocity;
}
function resolveVariantFromProps(props, definition, custom, currentValues, currentVelocity) {
    var _a;
    if (currentValues === void 0) { currentValues = {}; }
    if (currentVelocity === void 0) { currentVelocity = {}; }
    /**
     * If the variant definition is a function, resolve.
     */
    if (typeof definition === "function") {
        definition = definition(custom !== null && custom !== void 0 ? custom : props.custom, currentValues, currentVelocity);
    }
    /**
     * If the variant definition is a variant label, or
     * the function returned a variant label, resolve.
     */
    if (typeof definition === "string") {
        definition = (_a = props.variants) === null || _a === void 0 ? void 0 : _a[definition];
    }
    /**
     * At this point we've resolved both functions and variant labels,
     * but the resolved variant label might itself have been a function.
     * If so, resolve. This can only have returned a valid target object.
     */
    if (typeof definition === "function") {
        definition = definition(custom !== null && custom !== void 0 ? custom : props.custom, currentValues, currentVelocity);
    }
    return definition;
}
function resolveVariant(visualElement, definition, custom) {
    var props = visualElement.getProps();
    return resolveVariantFromProps(props, definition, custom !== null && custom !== void 0 ? custom : props.custom, getCurrent(visualElement), getVelocity(visualElement));
}
function checkIfControllingVariants(props) {
    var _a;
    return (typeof ((_a = props.animate) === null || _a === void 0 ? void 0 : _a.start) === "function" ||
        isVariantLabel(props.initial) ||
        isVariantLabel(props.animate) ||
        isVariantLabel(props.whileHover) ||
        isVariantLabel(props.whileDrag) ||
        isVariantLabel(props.whileTap) ||
        isVariantLabel(props.whileFocus) ||
        isVariantLabel(props.exit));
}
function checkIfVariantNode(props) {
    return Boolean(checkIfControllingVariants(props) || props.variants);
}




/***/ }),

/***/ 10:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cl": function() { return /* binding */ removeItem; },
/* harmony export */   "uo": function() { return /* binding */ moveItem; },
/* harmony export */   "y4": function() { return /* binding */ addUniqueItem; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(655);


function addUniqueItem(arr, item) {
    arr.indexOf(item) === -1 && arr.push(item);
}
function removeItem(arr, item) {
    var index = arr.indexOf(item);
    index > -1 && arr.splice(index, 1);
}
// Adapted from array-move
function moveItem(_a, fromIndex, toIndex) {
    var _b = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(_a), arr = _b.slice(0);
    var startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
    if (startIndex >= 0 && startIndex < arr.length) {
        var endIndex = toIndex < 0 ? arr.length + toIndex : toIndex;
        var _c = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(arr.splice(fromIndex, 1), 1), item = _c[0];
        arr.splice(endIndex, 0, item);
    }
    return arr;
}




/***/ }),

/***/ 1741:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "j": function() { return /* binding */ isBrowser; }
/* harmony export */ });
var isBrowser = typeof document !== "undefined";




/***/ }),

/***/ 1804:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": function() { return /* binding */ isRefObject; }
/* harmony export */ });
function isRefObject(ref) {
    return (typeof ref === "object" &&
        Object.prototype.hasOwnProperty.call(ref, "current"));
}




/***/ }),

/***/ 9304:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": function() { return /* binding */ env; }
/* harmony export */ });
/**
 * Browser-safe usage of process
 */
var defaultEnvironment = "production";
var env = typeof process === "undefined" || process.env === undefined
    ? defaultEnvironment
    : "production" || 0;




/***/ }),

/***/ 8715:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Y": function() { return /* binding */ resolveFinalValueInKeyframes; },
/* harmony export */   "p": function() { return /* binding */ isCustomValue; }
/* harmony export */ });
/* harmony import */ var _animation_utils_is_keyframes_target_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8488);


var isCustomValue = function (v) {
    return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
var resolveFinalValueInKeyframes = function (v) {
    // TODO maybe throw if v.length - 1 is placeholder token?
    return (0,_animation_utils_is_keyframes_target_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isKeyframesTarget */ .C)(v) ? v[v.length - 1] || 0 : v;
};




/***/ }),

/***/ 1560:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ SubscriptionManager; }
/* harmony export */ });
/* harmony import */ var _array_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);


var SubscriptionManager = /** @class */ (function () {
    function SubscriptionManager() {
        this.subscriptions = [];
    }
    SubscriptionManager.prototype.add = function (handler) {
        var _this = this;
        (0,_array_mjs__WEBPACK_IMPORTED_MODULE_0__/* .addUniqueItem */ .y4)(this.subscriptions, handler);
        return function () { return (0,_array_mjs__WEBPACK_IMPORTED_MODULE_0__/* .removeItem */ .cl)(_this.subscriptions, handler); };
    };
    SubscriptionManager.prototype.notify = function (a, b, c) {
        var numSubscriptions = this.subscriptions.length;
        if (!numSubscriptions)
            return;
        if (numSubscriptions === 1) {
            /**
             * If there's only a single handler we can just call it without invoking a loop.
             */
            this.subscriptions[0](a, b, c);
        }
        else {
            for (var i = 0; i < numSubscriptions; i++) {
                /**
                 * Check whether the handler exists before firing as it's possible
                 * the subscriptions were modified during this loop running.
                 */
                var handler = this.subscriptions[i];
                handler && handler(a, b, c);
            }
        }
    };
    SubscriptionManager.prototype.getSize = function () {
        return this.subscriptions.length;
    };
    SubscriptionManager.prototype.clear = function () {
        this.subscriptions.length = 0;
    };
    return SubscriptionManager;
}());




/***/ }),

/***/ 420:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "w": function() { return /* binding */ secondsToMilliseconds; }
/* harmony export */ });
/**
 * Converts seconds to milliseconds
 *
 * @param seconds - Time in seconds.
 * @return milliseconds - Converted time in milliseconds.
 */
var secondsToMilliseconds = function (seconds) { return seconds * 1000; };




/***/ }),

/***/ 6681:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": function() { return /* binding */ useConstant; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


/**
 * Creates a constant value over the lifecycle of a component.
 *
 * Even if `useMemo` is provided an empty array as its final argument, it doesn't offer
 * a guarantee that it won't re-run for performance reasons later on. By using `useConstant`
 * you can ensure that initialisers don't execute twice or more.
 */
function useConstant(init) {
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    if (ref.current === null) {
        ref.current = init();
    }
    return ref.current;
}




/***/ }),

/***/ 6337:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": function() { return /* binding */ useForceUpdate; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(655);
/* harmony import */ var framesync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9073);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9497);
/* harmony import */ var _use_is_mounted_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4454);





function useForceUpdate() {
    var isMounted = (0,_use_is_mounted_mjs__WEBPACK_IMPORTED_MODULE_2__/* .useIsMounted */ .t)();
    var _a = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__read)((0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), 2), forcedRenderCount = _a[0], setForcedRenderCount = _a[1];
    var forceRender = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function () {
        isMounted.current && setForcedRenderCount(forcedRenderCount + 1);
    }, [forcedRenderCount]);
    /**
     * Defer this to the end of the next animation frame in case there are multiple
     * synchronous calls.
     */
    var deferredForceRender = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function () { return framesync__WEBPACK_IMPORTED_MODULE_0__/* ["default"].postRender */ .ZP.postRender(forceRender); }, [forceRender]);
    return [deferredForceRender, forcedRenderCount];
}




/***/ }),

/***/ 6316:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "M": function() { return /* binding */ useId; }
/* harmony export */ });
/* harmony import */ var _use_constant_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6681);


var counter = 0;
var incrementId = function () { return counter++; };
var useId = function () { return (0,_use_constant_mjs__WEBPACK_IMPORTED_MODULE_0__/* .useConstant */ .h)(incrementId); };
/**
 * Ideally we'd use the following code to support React 18 optionally.
 * But this fairly fails in Webpack (otherwise treeshaking wouldn't work at all).
 * Need to come up with a different way of figuring this out.
 */
// export const useId = (React as any).useId
//     ? (React as any).useId
//     : () => useConstant(incrementId)




/***/ }),

/***/ 8627:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": function() { return /* binding */ instantAnimationState; }
/* harmony export */ });
var instantAnimationState = {
    current: false,
};




/***/ }),

/***/ 4454:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": function() { return /* binding */ useIsMounted; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _use_isomorphic_effect_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8868);



function useIsMounted() {
    var isMounted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    (0,_use_isomorphic_effect_mjs__WEBPACK_IMPORTED_MODULE_1__/* .useIsomorphicLayoutEffect */ .L)(function () {
        isMounted.current = true;
        return function () {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
}




/***/ }),

/***/ 8868:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ useIsomorphicLayoutEffect; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _is_browser_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1741);



var useIsomorphicLayoutEffect = _is_browser_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isBrowser */ .j ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;




/***/ }),

/***/ 6240:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": function() { return /* binding */ useReducedMotion; },
/* harmony export */   "h": function() { return /* binding */ useReducedMotionConfig; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(655);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);
/* harmony import */ var _context_MotionConfigContext_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6014);
/* harmony import */ var _is_browser_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1741);





// Does this device prefer reduced motion? Returns `null` server-side.
var prefersReducedMotion = { current: null };
var hasDetected = false;
function initPrefersReducedMotion() {
    hasDetected = true;
    if (!_is_browser_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isBrowser */ .j)
        return;
    if (window.matchMedia) {
        var motionMediaQuery_1 = window.matchMedia("(prefers-reduced-motion)");
        var setReducedMotionPreferences = function () {
            return (prefersReducedMotion.current = motionMediaQuery_1.matches);
        };
        motionMediaQuery_1.addListener(setReducedMotionPreferences);
        setReducedMotionPreferences();
    }
    else {
        prefersReducedMotion.current = false;
    }
}
/**
 * A hook that returns `true` if we should be using reduced motion based on the current device's Reduced Motion setting.
 *
 * This can be used to implement changes to your UI based on Reduced Motion. For instance, replacing motion-sickness inducing
 * `x`/`y` animations with `opacity`, disabling the autoplay of background videos, or turning off parallax motion.
 *
 * It will actively respond to changes and re-render your components with the latest setting.
 *
 * ```jsx
 * export function Sidebar({ isOpen }) {
 *   const shouldReduceMotion = useReducedMotion()
 *   const closedX = shouldReduceMotion ? 0 : "-100%"
 *
 *   return (
 *     <motion.div animate={{
 *       opacity: isOpen ? 1 : 0,
 *       x: isOpen ? 0 : closedX
 *     }} />
 *   )
 * }
 * ```
 *
 * @return boolean
 *
 * @public
 */
function useReducedMotion() {
    /**
     * Lazy initialisation of prefersReducedMotion
     */
    !hasDetected && initPrefersReducedMotion();
    var _a = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__read)((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(prefersReducedMotion.current), 1), shouldReduceMotion = _a[0];
    /**
     * TODO See if people miss automatically updating shouldReduceMotion setting
     */
    return shouldReduceMotion;
}
function useReducedMotionConfig() {
    var reducedMotionPreference = useReducedMotion();
    var reducedMotion = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_MotionConfigContext_mjs__WEBPACK_IMPORTED_MODULE_3__/* .MotionConfigContext */ ._).reducedMotion;
    if (reducedMotion === "never") {
        return false;
    }
    else if (reducedMotion === "always") {
        return true;
    }
    else {
        return reducedMotionPreference;
    }
}




/***/ }),

/***/ 5411:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": function() { return /* binding */ useUnmountEffect; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9497);


function useUnmountEffect(callback) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () { return function () { return callback(); }; }, []);
}




/***/ }),

/***/ 6034:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": function() { return /* binding */ warnOnce; }
/* harmony export */ });
var warned = new Set();
function warnOnce(condition, message, element) {
    if (condition || warned.has(message))
        return;
    console.warn(message);
    if (element)
        console.warn(element);
    warned.add(message);
}




/***/ }),

/***/ 3234:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "B": function() { return /* binding */ motionValue; },
/* harmony export */   "H": function() { return /* binding */ MotionValue; }
/* harmony export */ });
/* harmony import */ var framesync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9073);
/* harmony import */ var popmotion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9296);
/* harmony import */ var _utils_subscription_manager_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1560);




var isFloat = function (value) {
    return !isNaN(parseFloat(value));
};
/**
 * `MotionValue` is used to track the state and velocity of motion values.
 *
 * @public
 */
var MotionValue = /** @class */ (function () {
    /**
     * @param init - The initiating value
     * @param config - Optional configuration options
     *
     * -  `transformer`: A function to transform incoming values with.
     *
     * @internal
     */
    function MotionValue(init) {
        var _this = this;
        /**
         * This will be replaced by the build step with the latest version number.
         * When MotionValues are provided to motion components, warn if versions are mixed.
         */
        this.version = "6.5.1";
        /**
         * Duration, in milliseconds, since last updating frame.
         *
         * @internal
         */
        this.timeDelta = 0;
        /**
         * Timestamp of the last time this `MotionValue` was updated.
         *
         * @internal
         */
        this.lastUpdated = 0;
        /**
         * Functions to notify when the `MotionValue` updates.
         *
         * @internal
         */
        this.updateSubscribers = new _utils_subscription_manager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .SubscriptionManager */ .L();
        /**
         * Functions to notify when the velocity updates.
         *
         * @internal
         */
        this.velocityUpdateSubscribers = new _utils_subscription_manager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .SubscriptionManager */ .L();
        /**
         * Functions to notify when the `MotionValue` updates and `render` is set to `true`.
         *
         * @internal
         */
        this.renderSubscribers = new _utils_subscription_manager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .SubscriptionManager */ .L();
        /**
         * Tracks whether this value can output a velocity. Currently this is only true
         * if the value is numerical, but we might be able to widen the scope here and support
         * other value types.
         *
         * @internal
         */
        this.canTrackVelocity = false;
        this.updateAndNotify = function (v, render) {
            if (render === void 0) { render = true; }
            _this.prev = _this.current;
            _this.current = v;
            // Update timestamp
            var _a = (0,framesync__WEBPACK_IMPORTED_MODULE_0__/* .getFrameData */ .$B)(), delta = _a.delta, timestamp = _a.timestamp;
            if (_this.lastUpdated !== timestamp) {
                _this.timeDelta = delta;
                _this.lastUpdated = timestamp;
                framesync__WEBPACK_IMPORTED_MODULE_0__/* ["default"].postRender */ .ZP.postRender(_this.scheduleVelocityCheck);
            }
            // Update update subscribers
            if (_this.prev !== _this.current) {
                _this.updateSubscribers.notify(_this.current);
            }
            // Update velocity subscribers
            if (_this.velocityUpdateSubscribers.getSize()) {
                _this.velocityUpdateSubscribers.notify(_this.getVelocity());
            }
            // Update render subscribers
            if (render) {
                _this.renderSubscribers.notify(_this.current);
            }
        };
        /**
         * Schedule a velocity check for the next frame.
         *
         * This is an instanced and bound function to prevent generating a new
         * function once per frame.
         *
         * @internal
         */
        this.scheduleVelocityCheck = function () { return framesync__WEBPACK_IMPORTED_MODULE_0__/* ["default"].postRender */ .ZP.postRender(_this.velocityCheck); };
        /**
         * Updates `prev` with `current` if the value hasn't been updated this frame.
         * This ensures velocity calculations return `0`.
         *
         * This is an instanced and bound function to prevent generating a new
         * function once per frame.
         *
         * @internal
         */
        this.velocityCheck = function (_a) {
            var timestamp = _a.timestamp;
            if (timestamp !== _this.lastUpdated) {
                _this.prev = _this.current;
                _this.velocityUpdateSubscribers.notify(_this.getVelocity());
            }
        };
        this.hasAnimated = false;
        this.prev = this.current = init;
        this.canTrackVelocity = isFloat(this.current);
    }
    /**
     * Adds a function that will be notified when the `MotionValue` is updated.
     *
     * It returns a function that, when called, will cancel the subscription.
     *
     * When calling `onChange` inside a React component, it should be wrapped with the
     * `useEffect` hook. As it returns an unsubscribe function, this should be returned
     * from the `useEffect` function to ensure you don't add duplicate subscribers..
     *
     * ```jsx
     * export const MyComponent = () => {
     *   const x = useMotionValue(0)
     *   const y = useMotionValue(0)
     *   const opacity = useMotionValue(1)
     *
     *   useEffect(() => {
     *     function updateOpacity() {
     *       const maxXY = Math.max(x.get(), y.get())
     *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
     *       opacity.set(newOpacity)
     *     }
     *
     *     const unsubscribeX = x.onChange(updateOpacity)
     *     const unsubscribeY = y.onChange(updateOpacity)
     *
     *     return () => {
     *       unsubscribeX()
     *       unsubscribeY()
     *     }
     *   }, [])
     *
     *   return <motion.div style={{ x }} />
     * }
     * ```
     *
     * @privateRemarks
     *
     * We could look into a `useOnChange` hook if the above lifecycle management proves confusing.
     *
     * ```jsx
     * useOnChange(x, () => {})
     * ```
     *
     * @param subscriber - A function that receives the latest value.
     * @returns A function that, when called, will cancel this subscription.
     *
     * @public
     */
    MotionValue.prototype.onChange = function (subscription) {
        return this.updateSubscribers.add(subscription);
    };
    MotionValue.prototype.clearListeners = function () {
        this.updateSubscribers.clear();
    };
    /**
     * Adds a function that will be notified when the `MotionValue` requests a render.
     *
     * @param subscriber - A function that's provided the latest value.
     * @returns A function that, when called, will cancel this subscription.
     *
     * @internal
     */
    MotionValue.prototype.onRenderRequest = function (subscription) {
        // Render immediately
        subscription(this.get());
        return this.renderSubscribers.add(subscription);
    };
    /**
     * Attaches a passive effect to the `MotionValue`.
     *
     * @internal
     */
    MotionValue.prototype.attach = function (passiveEffect) {
        this.passiveEffect = passiveEffect;
    };
    /**
     * Sets the state of the `MotionValue`.
     *
     * @remarks
     *
     * ```jsx
     * const x = useMotionValue(0)
     * x.set(10)
     * ```
     *
     * @param latest - Latest value to set.
     * @param render - Whether to notify render subscribers. Defaults to `true`
     *
     * @public
     */
    MotionValue.prototype.set = function (v, render) {
        if (render === void 0) { render = true; }
        if (!render || !this.passiveEffect) {
            this.updateAndNotify(v, render);
        }
        else {
            this.passiveEffect(v, this.updateAndNotify);
        }
    };
    /**
     * Returns the latest state of `MotionValue`
     *
     * @returns - The latest state of `MotionValue`
     *
     * @public
     */
    MotionValue.prototype.get = function () {
        return this.current;
    };
    /**
     * @public
     */
    MotionValue.prototype.getPrevious = function () {
        return this.prev;
    };
    /**
     * Returns the latest velocity of `MotionValue`
     *
     * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
     *
     * @public
     */
    MotionValue.prototype.getVelocity = function () {
        // This could be isFloat(this.prev) && isFloat(this.current), but that would be wasteful
        return this.canTrackVelocity
            ? // These casts could be avoided if parseFloat would be typed better
                (0,popmotion__WEBPACK_IMPORTED_MODULE_2__/* .velocityPerSecond */ .R)(parseFloat(this.current) -
                    parseFloat(this.prev), this.timeDelta)
            : 0;
    };
    /**
     * Registers a new animation to control this `MotionValue`. Only one
     * animation can drive a `MotionValue` at one time.
     *
     * ```jsx
     * value.start()
     * ```
     *
     * @param animation - A function that starts the provided animation
     *
     * @internal
     */
    MotionValue.prototype.start = function (animation) {
        var _this = this;
        this.stop();
        return new Promise(function (resolve) {
            _this.hasAnimated = true;
            _this.stopAnimation = animation(resolve);
        }).then(function () { return _this.clearAnimation(); });
    };
    /**
     * Stop the currently active animation.
     *
     * @public
     */
    MotionValue.prototype.stop = function () {
        if (this.stopAnimation)
            this.stopAnimation();
        this.clearAnimation();
    };
    /**
     * Returns `true` if this value is currently animating.
     *
     * @public
     */
    MotionValue.prototype.isAnimating = function () {
        return !!this.stopAnimation;
    };
    MotionValue.prototype.clearAnimation = function () {
        this.stopAnimation = null;
    };
    /**
     * Destroy and clean up subscribers to this `MotionValue`.
     *
     * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
     * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
     * created a `MotionValue` via the `motionValue` function.
     *
     * @public
     */
    MotionValue.prototype.destroy = function () {
        this.updateSubscribers.clear();
        this.renderSubscribers.clear();
        this.stop();
    };
    return MotionValue;
}());
function motionValue(init) {
    return new MotionValue(init);
}




/***/ }),

/***/ 406:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "i": function() { return /* binding */ isMotionValue; }
/* harmony export */ });
var isMotionValue = function (value) {
    return Boolean(value !== null && typeof value === "object" && value.getVelocity);
};




/***/ }),

/***/ 6399:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": function() { return /* binding */ resolveMotionValue; }
/* harmony export */ });
/* harmony import */ var _utils_resolve_value_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8715);
/* harmony import */ var _is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(406);



/**
 * If the provided value is a MotionValue, this returns the actual value, otherwise just the value itself
 *
 * TODO: Remove and move to library
 */
function resolveMotionValue(value) {
    var unwrappedValue = (0,_is_motion_value_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isMotionValue */ .i)(value) ? value.get() : value;
    return (0,_utils_resolve_value_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isCustomValue */ .p)(unwrappedValue)
        ? unwrappedValue.toValue()
        : unwrappedValue;
}




/***/ }),

/***/ 9073:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "qY": function() { return /* binding */ cancelSync; },
  "ZP": function() { return /* binding */ es; },
  "iW": function() { return /* binding */ flushSync; },
  "$B": function() { return /* binding */ getFrameData; }
});

;// CONCATENATED MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/on-next-frame.mjs
const defaultTimestep = (1 / 60) * 1000;
const getCurrentTime = typeof performance !== "undefined"
    ? () => performance.now()
    : () => Date.now();
const onNextFrame = typeof window !== "undefined"
    ? (callback) => window.requestAnimationFrame(callback)
    : (callback) => setTimeout(() => callback(getCurrentTime()), defaultTimestep);



;// CONCATENATED MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/create-render-step.mjs
function createRenderStep(runNextFrame) {
    let toRun = [];
    let toRunNextFrame = [];
    let numToRun = 0;
    let isProcessing = false;
    let flushNextFrame = false;
    const toKeepAlive = new WeakSet();
    const step = {
        schedule: (callback, keepAlive = false, immediate = false) => {
            const addToCurrentFrame = immediate && isProcessing;
            const buffer = addToCurrentFrame ? toRun : toRunNextFrame;
            if (keepAlive)
                toKeepAlive.add(callback);
            if (buffer.indexOf(callback) === -1) {
                buffer.push(callback);
                if (addToCurrentFrame && isProcessing)
                    numToRun = toRun.length;
            }
            return callback;
        },
        cancel: (callback) => {
            const index = toRunNextFrame.indexOf(callback);
            if (index !== -1)
                toRunNextFrame.splice(index, 1);
            toKeepAlive.delete(callback);
        },
        process: (frameData) => {
            if (isProcessing) {
                flushNextFrame = true;
                return;
            }
            isProcessing = true;
            [toRun, toRunNextFrame] = [toRunNextFrame, toRun];
            toRunNextFrame.length = 0;
            numToRun = toRun.length;
            if (numToRun) {
                for (let i = 0; i < numToRun; i++) {
                    const callback = toRun[i];
                    callback(frameData);
                    if (toKeepAlive.has(callback)) {
                        step.schedule(callback);
                        runNextFrame();
                    }
                }
            }
            isProcessing = false;
            if (flushNextFrame) {
                flushNextFrame = false;
                step.process(frameData);
            }
        },
    };
    return step;
}



;// CONCATENATED MODULE: ./node_modules/framer-motion/node_modules/framesync/dist/es/index.mjs



const maxElapsed = 40;
let useDefaultElapsed = true;
let runNextFrame = false;
let isProcessing = false;
const es_frame = {
    delta: 0,
    timestamp: 0,
};
const stepsOrder = [
    "read",
    "update",
    "preRender",
    "render",
    "postRender",
];
const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(() => (runNextFrame = true));
    return acc;
}, {});
const sync = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
            startLoop();
        return step.schedule(process, keepAlive, immediate);
    };
    return acc;
}, {});
const cancelSync = stepsOrder.reduce((acc, key) => {
    acc[key] = steps[key].cancel;
    return acc;
}, {});
const flushSync = stepsOrder.reduce((acc, key) => {
    acc[key] = () => steps[key].process(es_frame);
    return acc;
}, {});
const processStep = (stepId) => steps[stepId].process(es_frame);
const processFrame = (timestamp) => {
    runNextFrame = false;
    es_frame.delta = useDefaultElapsed
        ? defaultTimestep
        : Math.max(Math.min(timestamp - es_frame.timestamp, maxElapsed), 1);
    es_frame.timestamp = timestamp;
    isProcessing = true;
    stepsOrder.forEach(processStep);
    isProcessing = false;
    if (runNextFrame) {
        useDefaultElapsed = false;
        onNextFrame(processFrame);
    }
};
const startLoop = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!isProcessing)
        onNextFrame(processFrame);
};
const getFrameData = () => es_frame;

/* harmony default export */ var es = (sync);



/***/ }),

/***/ 612:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "j": function() { return /* binding */ animate; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(655);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/clamp.mjs
var clamp = __webpack_require__(6773);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/utils/find-spring.mjs



const safeMin = 0.001;
const minDuration = 0.01;
const maxDuration = 10.0;
const minDamping = 0.05;
const maxDamping = 1;
function findSpring({ duration = 800, bounce = 0.25, velocity = 0, mass = 1, }) {
    let envelope;
    let derivative;
    (0,dist.warning)(duration <= maxDuration * 1000, "Spring duration must be 10 seconds or less");
    let dampingRatio = 1 - bounce;
    dampingRatio = (0,clamp/* clamp */.u)(minDamping, maxDamping, dampingRatio);
    duration = (0,clamp/* clamp */.u)(minDuration, maxDuration, duration / 1000);
    if (dampingRatio < 1) {
        envelope = (undampedFreq) => {
            const exponentialDecay = undampedFreq * dampingRatio;
            const delta = exponentialDecay * duration;
            const a = exponentialDecay - velocity;
            const b = calcAngularFreq(undampedFreq, dampingRatio);
            const c = Math.exp(-delta);
            return safeMin - (a / b) * c;
        };
        derivative = (undampedFreq) => {
            const exponentialDecay = undampedFreq * dampingRatio;
            const delta = exponentialDecay * duration;
            const d = delta * velocity + velocity;
            const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq, 2) * duration;
            const f = Math.exp(-delta);
            const g = calcAngularFreq(Math.pow(undampedFreq, 2), dampingRatio);
            const factor = -envelope(undampedFreq) + safeMin > 0 ? -1 : 1;
            return (factor * ((d - e) * f)) / g;
        };
    }
    else {
        envelope = (undampedFreq) => {
            const a = Math.exp(-undampedFreq * duration);
            const b = (undampedFreq - velocity) * duration + 1;
            return -safeMin + a * b;
        };
        derivative = (undampedFreq) => {
            const a = Math.exp(-undampedFreq * duration);
            const b = (velocity - undampedFreq) * (duration * duration);
            return a * b;
        };
    }
    const initialGuess = 5 / duration;
    const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
    duration = duration * 1000;
    if (isNaN(undampedFreq)) {
        return {
            stiffness: 100,
            damping: 10,
            duration,
        };
    }
    else {
        const stiffness = Math.pow(undampedFreq, 2) * mass;
        return {
            stiffness,
            damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
            duration,
        };
    }
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
    let result = initialGuess;
    for (let i = 1; i < rootIterations; i++) {
        result = result - envelope(result) / derivative(result);
    }
    return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
    return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/generators/spring.mjs



const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
    return keys.some((key) => options[key] !== undefined);
}
function getSpringOptions(options) {
    let springOptions = Object.assign({ velocity: 0.0, stiffness: 100, damping: 10, mass: 1.0, isResolvedFromDuration: false }, options);
    if (!isSpringType(options, physicsKeys) &&
        isSpringType(options, durationKeys)) {
        const derived = findSpring(options);
        springOptions = Object.assign(Object.assign(Object.assign({}, springOptions), derived), { velocity: 0.0, mass: 1.0 });
        springOptions.isResolvedFromDuration = true;
    }
    return springOptions;
}
function spring(_a) {
    var { from = 0.0, to = 1.0, restSpeed = 2, restDelta } = _a, options = (0,tslib_es6.__rest)(_a, ["from", "to", "restSpeed", "restDelta"]);
    const state = { done: false, value: from };
    let { stiffness, damping, mass, velocity, duration, isResolvedFromDuration, } = getSpringOptions(options);
    let resolveSpring = zero;
    let resolveVelocity = zero;
    function createSpring() {
        const initialVelocity = velocity ? -(velocity / 1000) : 0.0;
        const initialDelta = to - from;
        const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
        const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1000;
        if (restDelta === undefined) {
            restDelta = Math.min(Math.abs(to - from) / 100, 0.4);
        }
        if (dampingRatio < 1) {
            const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
            resolveSpring = (t) => {
                const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                return (to -
                    envelope *
                        (((initialVelocity +
                            dampingRatio * undampedAngularFreq * initialDelta) /
                            angularFreq) *
                            Math.sin(angularFreq * t) +
                            initialDelta * Math.cos(angularFreq * t)));
            };
            resolveVelocity = (t) => {
                const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                return (dampingRatio *
                    undampedAngularFreq *
                    envelope *
                    ((Math.sin(angularFreq * t) *
                        (initialVelocity +
                            dampingRatio *
                                undampedAngularFreq *
                                initialDelta)) /
                        angularFreq +
                        initialDelta * Math.cos(angularFreq * t)) -
                    envelope *
                        (Math.cos(angularFreq * t) *
                            (initialVelocity +
                                dampingRatio *
                                    undampedAngularFreq *
                                    initialDelta) -
                            angularFreq *
                                initialDelta *
                                Math.sin(angularFreq * t)));
            };
        }
        else if (dampingRatio === 1) {
            resolveSpring = (t) => to -
                Math.exp(-undampedAngularFreq * t) *
                    (initialDelta +
                        (initialVelocity + undampedAngularFreq * initialDelta) *
                            t);
        }
        else {
            const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
            resolveSpring = (t) => {
                const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                const freqForT = Math.min(dampedAngularFreq * t, 300);
                return (to -
                    (envelope *
                        ((initialVelocity +
                            dampingRatio * undampedAngularFreq * initialDelta) *
                            Math.sinh(freqForT) +
                            dampedAngularFreq *
                                initialDelta *
                                Math.cosh(freqForT))) /
                        dampedAngularFreq);
            };
        }
    }
    createSpring();
    return {
        next: (t) => {
            const current = resolveSpring(t);
            if (!isResolvedFromDuration) {
                const currentVelocity = resolveVelocity(t) * 1000;
                const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
                const isBelowDisplacementThreshold = Math.abs(to - current) <= restDelta;
                state.done =
                    isBelowVelocityThreshold && isBelowDisplacementThreshold;
            }
            else {
                state.done = t >= duration;
            }
            state.value = state.done ? to : current;
            return state;
        },
        flipTarget: () => {
            velocity = -velocity;
            [from, to] = [to, from];
            createSpring();
        },
    };
}
spring.needsInterpolation = (a, b) => typeof a === "string" || typeof b === "string";
const zero = (_t) => 0;



// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/interpolate.mjs + 3 modules
var interpolate = __webpack_require__(9180);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/easing/index.mjs + 1 modules
var es_easing = __webpack_require__(4710);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/generators/keyframes.mjs



function defaultEasing(values, easing) {
    return values.map(() => easing || es_easing/* easeInOut */.mZ).splice(0, values.length - 1);
}
function defaultOffset(values) {
    const numValues = values.length;
    return values.map((_value, i) => i !== 0 ? i / (numValues - 1) : 0);
}
function convertOffsetToTimes(offset, duration) {
    return offset.map((o) => o * duration);
}
function keyframes({ from = 0, to = 1, ease, offset, duration = 300, }) {
    const state = { done: false, value: from };
    const values = Array.isArray(to) ? to : [from, to];
    const times = convertOffsetToTimes(offset && offset.length === values.length
        ? offset
        : defaultOffset(values), duration);
    function createInterpolator() {
        return (0,interpolate/* interpolate */.s)(times, values, {
            ease: Array.isArray(ease) ? ease : defaultEasing(values, ease),
        });
    }
    let interpolator = createInterpolator();
    return {
        next: (t) => {
            state.value = interpolator(t);
            state.done = t >= duration;
            return state;
        },
        flipTarget: () => {
            values.reverse();
            interpolator = createInterpolator();
        },
    };
}



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/generators/decay.mjs
function decay({ velocity = 0, from = 0, power = 0.8, timeConstant = 350, restDelta = 0.5, modifyTarget, }) {
    const state = { done: false, value: from };
    let amplitude = power * velocity;
    const ideal = from + amplitude;
    const target = modifyTarget === undefined ? ideal : modifyTarget(ideal);
    if (target !== ideal)
        amplitude = target - from;
    return {
        next: (t) => {
            const delta = -amplitude * Math.exp(-t / timeConstant);
            state.done = !(delta > restDelta || delta < -restDelta);
            state.value = state.done ? target : target + delta;
            return state;
        },
        flipTarget: () => { },
    };
}



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/utils/detect-animation-from-options.mjs




const types = { keyframes: keyframes, spring: spring, decay: decay };
function detectAnimationFromOptions(config) {
    if (Array.isArray(config.to)) {
        return keyframes;
    }
    else if (types[config.type]) {
        return types[config.type];
    }
    const keys = new Set(Object.keys(config));
    if (keys.has("ease") ||
        (keys.has("duration") && !keys.has("dampingRatio"))) {
        return keyframes;
    }
    else if (keys.has("dampingRatio") ||
        keys.has("stiffness") ||
        keys.has("mass") ||
        keys.has("damping") ||
        keys.has("restSpeed") ||
        keys.has("restDelta")) {
        return spring;
    }
    return keyframes;
}



// EXTERNAL MODULE: ./node_modules/popmotion/node_modules/framesync/dist/es/index.mjs + 2 modules
var es = __webpack_require__(2151);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/utils/elapsed.mjs
function loopElapsed(elapsed, duration, delay = 0) {
    return elapsed - duration - delay;
}
function reverseElapsed(elapsed, duration, delay = 0, isForwardPlayback = true) {
    return isForwardPlayback
        ? loopElapsed(duration + -elapsed, duration, delay)
        : duration - (elapsed - duration) + delay;
}
function hasRepeatDelayElapsed(elapsed, duration, delay, isForwardPlayback) {
    return isForwardPlayback ? elapsed >= duration + delay : elapsed <= -delay;
}



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/animations/index.mjs






const framesync = (update) => {
    const passTimestamp = ({ delta }) => update(delta);
    return {
        start: () => es/* default.update */.ZP.update(passTimestamp, true),
        stop: () => es/* cancelSync.update */.qY.update(passTimestamp),
    };
};
function animate(_a) {
    var _b, _c;
    var { from, autoplay = true, driver = framesync, elapsed = 0, repeat: repeatMax = 0, repeatType = "loop", repeatDelay = 0, onPlay, onStop, onComplete, onRepeat, onUpdate } = _a, options = (0,tslib_es6.__rest)(_a, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
    let { to } = options;
    let driverControls;
    let repeatCount = 0;
    let computedDuration = options.duration;
    let latest;
    let isComplete = false;
    let isForwardPlayback = true;
    let interpolateFromNumber;
    const animator = detectAnimationFromOptions(options);
    if ((_c = (_b = animator).needsInterpolation) === null || _c === void 0 ? void 0 : _c.call(_b, from, to)) {
        interpolateFromNumber = (0,interpolate/* interpolate */.s)([0, 100], [from, to], {
            clamp: false,
        });
        from = 0;
        to = 100;
    }
    const animation = animator(Object.assign(Object.assign({}, options), { from, to }));
    function repeat() {
        repeatCount++;
        if (repeatType === "reverse") {
            isForwardPlayback = repeatCount % 2 === 0;
            elapsed = reverseElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback);
        }
        else {
            elapsed = loopElapsed(elapsed, computedDuration, repeatDelay);
            if (repeatType === "mirror")
                animation.flipTarget();
        }
        isComplete = false;
        onRepeat && onRepeat();
    }
    function complete() {
        driverControls.stop();
        onComplete && onComplete();
    }
    function update(delta) {
        if (!isForwardPlayback)
            delta = -delta;
        elapsed += delta;
        if (!isComplete) {
            const state = animation.next(Math.max(0, elapsed));
            latest = state.value;
            if (interpolateFromNumber)
                latest = interpolateFromNumber(latest);
            isComplete = isForwardPlayback ? state.done : elapsed <= 0;
        }
        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(latest);
        if (isComplete) {
            if (repeatCount === 0)
                computedDuration !== null && computedDuration !== void 0 ? computedDuration : (computedDuration = elapsed);
            if (repeatCount < repeatMax) {
                hasRepeatDelayElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback) && repeat();
            }
            else {
                complete();
            }
        }
    }
    function play() {
        onPlay === null || onPlay === void 0 ? void 0 : onPlay();
        driverControls = driver(update);
        driverControls.start();
    }
    autoplay && play();
    return {
        stop: () => {
            onStop === null || onStop === void 0 ? void 0 : onStop();
            driverControls.stop();
        },
    };
}




/***/ }),

/***/ 4710:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "LU": function() { return /* binding */ anticipate; },
  "G2": function() { return /* binding */ backIn; },
  "XL": function() { return /* binding */ backInOut; },
  "CG": function() { return /* binding */ backOut; },
  "h9": function() { return /* binding */ bounceIn; },
  "yD": function() { return /* binding */ bounceInOut; },
  "gJ": function() { return /* binding */ bounceOut; },
  "Z7": function() { return /* binding */ circIn; },
  "X7": function() { return /* binding */ circInOut; },
  "Bn": function() { return /* binding */ circOut; },
  "YQ": function() { return /* binding */ easeIn; },
  "mZ": function() { return /* binding */ easeInOut; },
  "Vv": function() { return /* binding */ easeOut; },
  "GE": function() { return /* binding */ linear; }
});

;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/easing/utils.mjs
const reverseEasing = easing => p => 1 - easing(1 - p);
const mirrorEasing = easing => p => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
const createExpoIn = (power) => p => Math.pow(p, power);
const createBackIn = (power) => p => p * p * ((power + 1) * p - power);
const createAnticipate = (power) => {
    const backEasing = createBackIn(power);
    return p => (p *= 2) < 1
        ? 0.5 * backEasing(p)
        : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
};



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/easing/index.mjs


const DEFAULT_OVERSHOOT_STRENGTH = 1.525;
const BOUNCE_FIRST_THRESHOLD = 4.0 / 11.0;
const BOUNCE_SECOND_THRESHOLD = 8.0 / 11.0;
const BOUNCE_THIRD_THRESHOLD = 9.0 / 10.0;
const linear = p => p;
const easeIn = createExpoIn(2);
const easeOut = reverseEasing(easeIn);
const easeInOut = mirrorEasing(easeIn);
const circIn = p => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circOut);
const backIn = createBackIn(DEFAULT_OVERSHOOT_STRENGTH);
const backOut = reverseEasing(backIn);
const backInOut = mirrorEasing(backIn);
const anticipate = createAnticipate(DEFAULT_OVERSHOOT_STRENGTH);
const ca = 4356.0 / 361.0;
const cb = 35442.0 / 1805.0;
const cc = 16061.0 / 1805.0;
const bounceOut = (p) => {
    if (p === 1 || p === 0)
        return p;
    const p2 = p * p;
    return p < BOUNCE_FIRST_THRESHOLD
        ? 7.5625 * p2
        : p < BOUNCE_SECOND_THRESHOLD
            ? 9.075 * p2 - 9.9 * p + 3.4
            : p < BOUNCE_THIRD_THRESHOLD
                ? ca * p2 - cb * p + cc
                : 10.8 * p * p - 20.52 * p + 10.72;
};
const bounceIn = reverseEasing(bounceOut);
const bounceInOut = (p) => p < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - p * 2.0))
    : 0.5 * bounceOut(p * 2.0 - 1.0) + 0.5;




/***/ }),

/***/ 6773:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ clamp; }
/* harmony export */ });
const clamp = (min, max, v) => Math.min(Math.max(v, min), max);




/***/ }),

/***/ 8677:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "T": function() { return /* binding */ distance; }
});

;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/is-point.mjs
const isPoint = (point) => point.hasOwnProperty('x') && point.hasOwnProperty('y');



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/is-point-3d.mjs


const isPoint3D = (point) => isPoint(point) && point.hasOwnProperty('z');



// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/inc.mjs
var inc = __webpack_require__(734);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/distance.mjs




const distance1D = (a, b) => Math.abs(a - b);
function distance(a, b) {
    if ((0,inc/* isNum */.e)(a) && (0,inc/* isNum */.e)(b)) {
        return distance1D(a, b);
    }
    else if (isPoint(a) && isPoint(b)) {
        const xDelta = distance1D(a.x, b.x);
        const yDelta = distance1D(a.y, b.y);
        const zDelta = isPoint3D(a) && isPoint3D(b) ? distance1D(a.z, b.z) : 0;
        return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
    }
}




/***/ }),

/***/ 734:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "e": function() { return /* binding */ isNum; }
/* harmony export */ });
/* unused harmony export zeroPoint */
const zeroPoint = {
    x: 0,
    y: 0,
    z: 0
};
const isNum = (v) => typeof v === 'number';




/***/ }),

/***/ 9180:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "s": function() { return /* binding */ interpolate; }
});

// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/progress.mjs
var progress = __webpack_require__(9326);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/mix.mjs
var mix = __webpack_require__(2453);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/color/hex.mjs
var hex = __webpack_require__(2960);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/color/rgba.mjs
var rgba = __webpack_require__(8059);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/color/hsla.mjs
var hsla = __webpack_require__(4582);
// EXTERNAL MODULE: ./node_modules/hey-listen/dist/index.js
var dist = __webpack_require__(1320);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/hsla-to-rgba.mjs
function hueToRgb(p, q, t) {
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1 / 6)
        return p + (q - p) * 6 * t;
    if (t < 1 / 2)
        return q;
    if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha }) {
    hue /= 360;
    saturation /= 100;
    lightness /= 100;
    let red = 0;
    let green = 0;
    let blue = 0;
    if (!saturation) {
        red = green = blue = lightness;
    }
    else {
        const q = lightness < 0.5
            ? lightness * (1 + saturation)
            : lightness + saturation - lightness * saturation;
        const p = 2 * lightness - q;
        red = hueToRgb(p, q, hue + 1 / 3);
        green = hueToRgb(p, q, hue);
        blue = hueToRgb(p, q, hue - 1 / 3);
    }
    return {
        red: Math.round(red * 255),
        green: Math.round(green * 255),
        blue: Math.round(blue * 255),
        alpha,
    };
}



;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/mix-color.mjs





const mixLinearColor = (from, to, v) => {
    const fromExpo = from * from;
    const toExpo = to * to;
    return Math.sqrt(Math.max(0, v * (toExpo - fromExpo) + fromExpo));
};
const colorTypes = [hex/* hex */.$, rgba/* rgba */.m, hsla/* hsla */.J];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
const notAnimatable = (color) => `'${color}' is not an animatable color. Use the equivalent color code instead.`;
const mixColor = (from, to) => {
    let fromColorType = getColorType(from);
    let toColorType = getColorType(to);
    (0,dist.invariant)(!!fromColorType, notAnimatable(from));
    (0,dist.invariant)(!!toColorType, notAnimatable(to));
    let fromColor = fromColorType.parse(from);
    let toColor = toColorType.parse(to);
    if (fromColorType === hsla/* hsla */.J) {
        fromColor = hslaToRgba(fromColor);
        fromColorType = rgba/* rgba */.m;
    }
    if (toColorType === hsla/* hsla */.J) {
        toColor = hslaToRgba(toColor);
        toColorType = rgba/* rgba */.m;
    }
    const blended = Object.assign({}, fromColor);
    return (v) => {
        for (const key in blended) {
            if (key !== "alpha") {
                blended[key] = mixLinearColor(fromColor[key], toColor[key], v);
            }
        }
        blended.alpha = (0,mix/* mix */.C)(fromColor.alpha, toColor.alpha, v);
        return fromColorType.transform(blended);
    };
};



// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/color/index.mjs
var color = __webpack_require__(7405);
// EXTERNAL MODULE: ./node_modules/style-value-types/dist/es/complex/index.mjs
var complex = __webpack_require__(8407);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/inc.mjs
var inc = __webpack_require__(734);
// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/pipe.mjs
var pipe = __webpack_require__(9897);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/mix-complex.mjs







function getMixer(origin, target) {
    if ((0,inc/* isNum */.e)(origin)) {
        return (v) => (0,mix/* mix */.C)(origin, target, v);
    }
    else if (color/* color.test */.$.test(origin)) {
        return mixColor(origin, target);
    }
    else {
        return mixComplex(origin, target);
    }
}
const mixArray = (from, to) => {
    const output = [...from];
    const numValues = output.length;
    const blendValue = from.map((fromThis, i) => getMixer(fromThis, to[i]));
    return (v) => {
        for (let i = 0; i < numValues; i++) {
            output[i] = blendValue[i](v);
        }
        return output;
    };
};
const mixObject = (origin, target) => {
    const output = Object.assign(Object.assign({}, origin), target);
    const blendValue = {};
    for (const key in output) {
        if (origin[key] !== undefined && target[key] !== undefined) {
            blendValue[key] = getMixer(origin[key], target[key]);
        }
    }
    return (v) => {
        for (const key in blendValue) {
            output[key] = blendValue[key](v);
        }
        return output;
    };
};
function analyse(value) {
    const parsed = complex/* complex.parse */.P.parse(value);
    const numValues = parsed.length;
    let numNumbers = 0;
    let numRGB = 0;
    let numHSL = 0;
    for (let i = 0; i < numValues; i++) {
        if (numNumbers || typeof parsed[i] === "number") {
            numNumbers++;
        }
        else {
            if (parsed[i].hue !== undefined) {
                numHSL++;
            }
            else {
                numRGB++;
            }
        }
    }
    return { parsed, numNumbers, numRGB, numHSL };
}
const mixComplex = (origin, target) => {
    const template = complex/* complex.createTransformer */.P.createTransformer(target);
    const originStats = analyse(origin);
    const targetStats = analyse(target);
    const canInterpolate = originStats.numHSL === targetStats.numHSL &&
        originStats.numRGB === targetStats.numRGB &&
        originStats.numNumbers >= targetStats.numNumbers;
    if (canInterpolate) {
        return (0,pipe/* pipe */.z)(mixArray(originStats.parsed, targetStats.parsed), template);
    }
    else {
        (0,dist.warning)(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`);
        return (p) => `${p > 0 ? target : origin}`;
    }
};



// EXTERNAL MODULE: ./node_modules/popmotion/dist/es/utils/clamp.mjs
var clamp = __webpack_require__(6773);
;// CONCATENATED MODULE: ./node_modules/popmotion/dist/es/utils/interpolate.mjs









const mixNumber = (from, to) => (p) => (0,mix/* mix */.C)(from, to, p);
function detectMixerFactory(v) {
    if (typeof v === 'number') {
        return mixNumber;
    }
    else if (typeof v === 'string') {
        if (color/* color.test */.$.test(v)) {
            return mixColor;
        }
        else {
            return mixComplex;
        }
    }
    else if (Array.isArray(v)) {
        return mixArray;
    }
    else if (typeof v === 'object') {
        return mixObject;
    }
}
function createMixers(output, ease, customMixer) {
    const mixers = [];
    const mixerFactory = customMixer || detectMixerFactory(output[0]);
    const numMixers = output.length - 1;
    for (let i = 0; i < numMixers; i++) {
        let mixer = mixerFactory(output[i], output[i + 1]);
        if (ease) {
            const easingFunction = Array.isArray(ease) ? ease[i] : ease;
            mixer = (0,pipe/* pipe */.z)(easingFunction, mixer);
        }
        mixers.push(mixer);
    }
    return mixers;
}
function fastInterpolate([from, to], [mixer]) {
    return (v) => mixer((0,progress/* progress */.Y)(from, to, v));
}
function slowInterpolate(input, mixers) {
    const inputLength = input.length;
    const lastInputIndex = inputLength - 1;
    return (v) => {
        let mixerIndex = 0;
        let foundMixerIndex = false;
        if (v <= input[0]) {
            foundMixerIndex = true;
        }
        else if (v >= input[lastInputIndex]) {
            mixerIndex = lastInputIndex - 1;
            foundMixerIndex = true;
        }
        if (!foundMixerIndex) {
            let i = 1;
            for (; i < inputLength; i++) {
                if (input[i] > v || i === lastInputIndex) {
                    break;
                }
            }
            mixerIndex = i - 1;
        }
        const progressInRange = (0,progress/* progress */.Y)(input[mixerIndex], input[mixerIndex + 1], v);
        return mixers[mixerIndex](progressInRange);
    };
}
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
    const inputLength = input.length;
    (0,dist.invariant)(inputLength === output.length, 'Both input and output ranges must be the same length');
    (0,dist.invariant)(!ease || !Array.isArray(ease) || ease.length === inputLength - 1, 'Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values.');
    if (input[0] > input[inputLength - 1]) {
        input = [].concat(input);
        output = [].concat(output);
        input.reverse();
        output.reverse();
    }
    const mixers = createMixers(output, ease, mixer);
    const interpolator = inputLength === 2
        ? fastInterpolate(input, mixers)
        : slowInterpolate(input, mixers);
    return isClamp
        ? (v) => interpolator((0,clamp/* clamp */.u)(input[0], input[inputLength - 1], v))
        : interpolator;
}




/***/ }),

/***/ 2453:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C": function() { return /* binding */ mix; }
/* harmony export */ });
const mix = (from, to, progress) => -progress * from + progress * to + from;




/***/ }),

/***/ 9897:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": function() { return /* binding */ pipe; }
/* harmony export */ });
const combineFunctions = (a, b) => (v) => b(a(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);




/***/ }),

/***/ 9326:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Y": function() { return /* binding */ progress; }
/* harmony export */ });
const progress = (from, to, value) => {
    const toFromDifference = to - from;
    return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};




/***/ }),

/***/ 9296:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": function() { return /* binding */ velocityPerSecond; }
/* harmony export */ });
function velocityPerSecond(velocity, frameDuration) {
    return frameDuration ? velocity * (1000 / frameDuration) : 0;
}




/***/ }),

/***/ 2151:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "qY": function() { return /* binding */ cancelSync; },
  "ZP": function() { return /* binding */ es; },
  "$B": function() { return /* binding */ getFrameData; }
});

// UNUSED EXPORTS: flushSync

;// CONCATENATED MODULE: ./node_modules/popmotion/node_modules/framesync/dist/es/on-next-frame.mjs
const defaultTimestep = (1 / 60) * 1000;
const getCurrentTime = typeof performance !== "undefined"
    ? () => performance.now()
    : () => Date.now();
const onNextFrame = typeof window !== "undefined"
    ? (callback) => window.requestAnimationFrame(callback)
    : (callback) => setTimeout(() => callback(getCurrentTime()), defaultTimestep);



;// CONCATENATED MODULE: ./node_modules/popmotion/node_modules/framesync/dist/es/create-render-step.mjs
function createRenderStep(runNextFrame) {
    let toRun = [];
    let toRunNextFrame = [];
    let numToRun = 0;
    let isProcessing = false;
    let flushNextFrame = false;
    const toKeepAlive = new WeakSet();
    const step = {
        schedule: (callback, keepAlive = false, immediate = false) => {
            const addToCurrentFrame = immediate && isProcessing;
            const buffer = addToCurrentFrame ? toRun : toRunNextFrame;
            if (keepAlive)
                toKeepAlive.add(callback);
            if (buffer.indexOf(callback) === -1) {
                buffer.push(callback);
                if (addToCurrentFrame && isProcessing)
                    numToRun = toRun.length;
            }
            return callback;
        },
        cancel: (callback) => {
            const index = toRunNextFrame.indexOf(callback);
            if (index !== -1)
                toRunNextFrame.splice(index, 1);
            toKeepAlive.delete(callback);
        },
        process: (frameData) => {
            if (isProcessing) {
                flushNextFrame = true;
                return;
            }
            isProcessing = true;
            [toRun, toRunNextFrame] = [toRunNextFrame, toRun];
            toRunNextFrame.length = 0;
            numToRun = toRun.length;
            if (numToRun) {
                for (let i = 0; i < numToRun; i++) {
                    const callback = toRun[i];
                    callback(frameData);
                    if (toKeepAlive.has(callback)) {
                        step.schedule(callback);
                        runNextFrame();
                    }
                }
            }
            isProcessing = false;
            if (flushNextFrame) {
                flushNextFrame = false;
                step.process(frameData);
            }
        },
    };
    return step;
}



;// CONCATENATED MODULE: ./node_modules/popmotion/node_modules/framesync/dist/es/index.mjs



const maxElapsed = 40;
let useDefaultElapsed = true;
let runNextFrame = false;
let isProcessing = false;
const es_frame = {
    delta: 0,
    timestamp: 0,
};
const stepsOrder = [
    "read",
    "update",
    "preRender",
    "render",
    "postRender",
];
const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(() => (runNextFrame = true));
    return acc;
}, {});
const sync = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
            startLoop();
        return step.schedule(process, keepAlive, immediate);
    };
    return acc;
}, {});
const cancelSync = stepsOrder.reduce((acc, key) => {
    acc[key] = steps[key].cancel;
    return acc;
}, {});
const flushSync = stepsOrder.reduce((acc, key) => {
    acc[key] = () => steps[key].process(es_frame);
    return acc;
}, {});
const processStep = (stepId) => steps[stepId].process(es_frame);
const processFrame = (timestamp) => {
    runNextFrame = false;
    es_frame.delta = useDefaultElapsed
        ? defaultTimestep
        : Math.max(Math.min(timestamp - es_frame.timestamp, maxElapsed), 1);
    es_frame.timestamp = timestamp;
    isProcessing = true;
    stepsOrder.forEach(processStep);
    isProcessing = false;
    if (runNextFrame) {
        useDefaultElapsed = false;
        onNextFrame(processFrame);
    }
};
const startLoop = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!isProcessing)
        onNextFrame(processFrame);
};
const getFrameData = () => es_frame;

/* harmony default export */ var es = (sync);



/***/ }),

/***/ 2960:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": function() { return /* binding */ hex; }
/* harmony export */ });
/* harmony import */ var _rgba_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8059);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3953);



function parseHex(v) {
    let r = '';
    let g = '';
    let b = '';
    let a = '';
    if (v.length > 5) {
        r = v.substr(1, 2);
        g = v.substr(3, 2);
        b = v.substr(5, 2);
        a = v.substr(7, 2);
    }
    else {
        r = v.substr(1, 1);
        g = v.substr(2, 1);
        b = v.substr(3, 1);
        a = v.substr(4, 1);
        r += r;
        g += g;
        b += b;
        a += a;
    }
    return {
        red: parseInt(r, 16),
        green: parseInt(g, 16),
        blue: parseInt(b, 16),
        alpha: a ? parseInt(a, 16) / 255 : 1,
    };
}
const hex = {
    test: (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isColorString */ .i)('#'),
    parse: parseHex,
    transform: _rgba_mjs__WEBPACK_IMPORTED_MODULE_1__/* .rgba.transform */ .m.transform,
};




/***/ }),

/***/ 4582:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": function() { return /* binding */ hsla; }
/* harmony export */ });
/* harmony import */ var _numbers_index_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1248);
/* harmony import */ var _numbers_units_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2969);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6777);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3953);





const hsla = {
    test: (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isColorString */ .i)('hsl', 'hue'),
    parse: (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .splitColor */ .d)('hue', 'saturation', 'lightness'),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
        return ('hsla(' +
            Math.round(hue) +
            ', ' +
            _numbers_units_mjs__WEBPACK_IMPORTED_MODULE_1__/* .percent.transform */ .aQ.transform((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .sanitize */ .Nw)(saturation)) +
            ', ' +
            _numbers_units_mjs__WEBPACK_IMPORTED_MODULE_1__/* .percent.transform */ .aQ.transform((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .sanitize */ .Nw)(lightness)) +
            ', ' +
            (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .sanitize */ .Nw)(_numbers_index_mjs__WEBPACK_IMPORTED_MODULE_3__/* .alpha.transform */ .Fq.transform(alpha$1)) +
            ')');
    },
};




/***/ }),

/***/ 7405:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": function() { return /* binding */ color; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6777);
/* harmony import */ var _hex_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2960);
/* harmony import */ var _hsla_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4582);
/* harmony import */ var _rgba_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8059);





const color = {
    test: (v) => _rgba_mjs__WEBPACK_IMPORTED_MODULE_0__/* .rgba.test */ .m.test(v) || _hex_mjs__WEBPACK_IMPORTED_MODULE_1__/* .hex.test */ .$.test(v) || _hsla_mjs__WEBPACK_IMPORTED_MODULE_2__/* .hsla.test */ .J.test(v),
    parse: (v) => {
        if (_rgba_mjs__WEBPACK_IMPORTED_MODULE_0__/* .rgba.test */ .m.test(v)) {
            return _rgba_mjs__WEBPACK_IMPORTED_MODULE_0__/* .rgba.parse */ .m.parse(v);
        }
        else if (_hsla_mjs__WEBPACK_IMPORTED_MODULE_2__/* .hsla.test */ .J.test(v)) {
            return _hsla_mjs__WEBPACK_IMPORTED_MODULE_2__/* .hsla.parse */ .J.parse(v);
        }
        else {
            return _hex_mjs__WEBPACK_IMPORTED_MODULE_1__/* .hex.parse */ .$.parse(v);
        }
    },
    transform: (v) => {
        return (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isString */ .HD)(v)
            ? v
            : v.hasOwnProperty('red')
                ? _rgba_mjs__WEBPACK_IMPORTED_MODULE_0__/* .rgba.transform */ .m.transform(v)
                : _hsla_mjs__WEBPACK_IMPORTED_MODULE_2__/* .hsla.transform */ .J.transform(v);
    },
};




/***/ }),

/***/ 8059:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "m": function() { return /* binding */ rgba; }
/* harmony export */ });
/* unused harmony export rgbUnit */
/* harmony import */ var _numbers_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1248);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6777);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3953);




const clampRgbUnit = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clamp */ .uZ)(0, 255);
const rgbUnit = Object.assign(Object.assign({}, _numbers_index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .number */ .Rx), { transform: (v) => Math.round(clampRgbUnit(v)) });
const rgba = {
    test: (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .isColorString */ .i)('rgb', 'red'),
    parse: (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .splitColor */ .d)('red', 'green', 'blue'),
    transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => 'rgba(' +
        rgbUnit.transform(red) +
        ', ' +
        rgbUnit.transform(green) +
        ', ' +
        rgbUnit.transform(blue) +
        ', ' +
        (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .sanitize */ .Nw)(_numbers_index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .alpha.transform */ .Fq.transform(alpha$1)) +
        ')',
};




/***/ }),

/***/ 3953:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d": function() { return /* binding */ splitColor; },
/* harmony export */   "i": function() { return /* binding */ isColorString; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6777);


const isColorString = (type, testProp) => (v) => {
    return Boolean(((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(v) && _utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .singleColorRegex.test */ .mj.test(v) && v.startsWith(type)) ||
        (testProp && Object.prototype.hasOwnProperty.call(v, testProp)));
};
const splitColor = (aName, bName, cName) => (v) => {
    if (!(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(v))
        return v;
    const [a, b, c, alpha] = v.match(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .floatRegex */ .KP);
    return {
        [aName]: parseFloat(a),
        [bName]: parseFloat(b),
        [cName]: parseFloat(c),
        alpha: alpha !== undefined ? parseFloat(alpha) : 1,
    };
};




/***/ }),

/***/ 5738:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": function() { return /* binding */ filter; }
/* harmony export */ });
/* harmony import */ var _index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8407);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6777);



const maxDefaults = new Set(['brightness', 'contrast', 'saturate', 'opacity']);
function applyDefaultFilter(v) {
    let [name, value] = v.slice(0, -1).split('(');
    if (name === 'drop-shadow')
        return v;
    const [number] = value.match(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .floatRegex */ .KP) || [];
    if (!number)
        return v;
    const unit = value.replace(number, '');
    let defaultValue = maxDefaults.has(name) ? 1 : 0;
    if (number !== value)
        defaultValue *= 100;
    return name + '(' + defaultValue + unit + ')';
}
const functionRegex = /([a-z-]*)\(.*?\)/g;
const filter = Object.assign(Object.assign({}, _index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .complex */ .P), { getAnimatableNone: (v) => {
        const functions = v.match(functionRegex);
        return functions ? functions.map(applyDefaultFilter).join(' ') : v;
    } });




/***/ }),

/***/ 8407:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": function() { return /* binding */ complex; }
/* harmony export */ });
/* harmony import */ var _color_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7405);
/* harmony import */ var _numbers_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1248);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6777);




const colorToken = '${c}';
const numberToken = '${n}';
function test(v) {
    var _a, _b, _c, _d;
    return (isNaN(v) &&
        (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(v) &&
        ((_b = (_a = v.match(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .floatRegex */ .KP)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + ((_d = (_c = v.match(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .colorRegex */ .dA)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0);
}
function analyse(v) {
    if (typeof v === 'number')
        v = `${v}`;
    const values = [];
    let numColors = 0;
    const colors = v.match(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .colorRegex */ .dA);
    if (colors) {
        numColors = colors.length;
        v = v.replace(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .colorRegex */ .dA, colorToken);
        values.push(...colors.map(_color_index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .color.parse */ .$.parse));
    }
    const numbers = v.match(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .floatRegex */ .KP);
    if (numbers) {
        v = v.replace(_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .floatRegex */ .KP, numberToken);
        values.push(...numbers.map(_numbers_index_mjs__WEBPACK_IMPORTED_MODULE_2__/* .number.parse */ .Rx.parse));
    }
    return { values, numColors, tokenised: v };
}
function parse(v) {
    return analyse(v).values;
}
function createTransformer(v) {
    const { values, numColors, tokenised } = analyse(v);
    const numValues = values.length;
    return (v) => {
        let output = tokenised;
        for (let i = 0; i < numValues; i++) {
            output = output.replace(i < numColors ? colorToken : numberToken, i < numColors ? _color_index_mjs__WEBPACK_IMPORTED_MODULE_1__/* .color.transform */ .$.transform(v[i]) : (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .sanitize */ .Nw)(v[i]));
        }
        return output;
    };
}
const convertNumbersToZero = (v) => typeof v === 'number' ? 0 : v;
function getAnimatableNone(v) {
    const parsed = parse(v);
    const transformer = createTransformer(v);
    return transformer(parsed.map(convertNumbersToZero));
}
const complex = { test, parse, createTransformer, getAnimatableNone };




/***/ }),

/***/ 1248:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fq": function() { return /* binding */ alpha; },
/* harmony export */   "Rx": function() { return /* binding */ number; },
/* harmony export */   "bA": function() { return /* binding */ scale; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6777);


const number = {
    test: (v) => typeof v === 'number',
    parse: parseFloat,
    transform: (v) => v,
};
const alpha = Object.assign(Object.assign({}, number), { transform: (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .clamp */ .uZ)(0, 1) });
const scale = Object.assign(Object.assign({}, number), { default: 1 });




/***/ }),

/***/ 2969:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$C": function() { return /* binding */ progressPercentage; },
/* harmony export */   "RW": function() { return /* binding */ degrees; },
/* harmony export */   "aQ": function() { return /* binding */ percent; },
/* harmony export */   "px": function() { return /* binding */ px; },
/* harmony export */   "vh": function() { return /* binding */ vh; },
/* harmony export */   "vw": function() { return /* binding */ vw; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6777);


const createUnitType = (unit) => ({
    test: (v) => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(v) && v.endsWith(unit) && v.split(' ').length === 1,
    parse: parseFloat,
    transform: (v) => `${v}${unit}`,
});
const degrees = createUnitType('deg');
const percent = createUnitType('%');
const px = createUnitType('px');
const vh = createUnitType('vh');
const vw = createUnitType('vw');
const progressPercentage = Object.assign(Object.assign({}, percent), { parse: (v) => percent.parse(v) / 100, transform: (v) => percent.transform(v * 100) });




/***/ }),

/***/ 6777:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HD": function() { return /* binding */ isString; },
/* harmony export */   "KP": function() { return /* binding */ floatRegex; },
/* harmony export */   "Nw": function() { return /* binding */ sanitize; },
/* harmony export */   "dA": function() { return /* binding */ colorRegex; },
/* harmony export */   "mj": function() { return /* binding */ singleColorRegex; },
/* harmony export */   "uZ": function() { return /* binding */ clamp; }
/* harmony export */ });
const clamp = (min, max) => (v) => Math.max(Math.min(v, max), min);
const sanitize = (v) => (v % 1 ? Number(v.toFixed(5)) : v);
const floatRegex = /(-)?([\d]*\.?[\d])+/g;
const colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))/gi;
const singleColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))$/i;
function isString(v) {
    return typeof v === 'string';
}




/***/ })

};
;