/*
 *  jQuery Boilerplate - v3.3.4
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = "maskedInput",
        defaults = {
            mask: "*",
            maskRegexDefinitions: {
                "9": /\d/
            }
        };

    // The actual plugin constructor
    function MaskedInput(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid MaskedInput.prototype conflicts
    $.extend(MaskedInput.prototype, {
        init: function () {
            var self = this,
                mask = self.settings.mask || $.data(self.element, "mask");

            if (mask) {
                self.settings.priorities = self.createMaskPriorities(mask);
            }

            $(self.element)
                .on("keypress paste dragdrop drop", self.add.bind(self))
                .on("keydown", self.remove.bind(self));
        },
        createMaskPriorities: function(mask) {
            var self = this,
                priorityRegexMatch = /\[(.*)\]/.exec(mask),
                list = [];

            if (priorityRegexMatch && priorityRegexMatch.length > 1) {
                list = self.createMaskPriorities(priorityRegexMatch[1]);

                list.push(priorityRegexMatch[1].replace(/\[|\]/g, ""));
            }

            return list;
        },
        add: function(e) {
            var self = this,
                val = $(self.element).val(),
                start = self.element.selectionStart,
                end = self.element.selectionEnd,
                eventType = e.type,
                data;

            if (eventType === "keypress" && e.which !== 0 && !e.ctrlKey && !e.altKey) {
                // Handle normal keyboard event
                data = String.fromCharCode(e.which);
            } else if (eventType === "paste" || eventType === "dragdrop" || eventType === "drop") {
                // Handle copy / paste
                var originalEvent = e.originalEvent;
                    dataTransfer = originalEvent.clipboardData || originalEvent.dataTransfer;

                if (dataTransfer) {
                    data = dataTransfer.getData("text/plain");
                } else if (window.clipboardData) {
                    data = window.clipboardData.getData("text");
                }
            }

            if (data) {
                var formatedMask = self.format(val, data, start, end);

                if (formatedMask !== undefined) {
                    $(self.element).val(formatedMask.val);
                    self.element.setSelectionRange(formatedMask.start, formatedMask.end);
                }

                e.preventDefault();
            }
        },
        remove: function(e) {
            var self = this,
                val = $(self.element).val(),
                start = self.element.selectionStart,
                end = self.element.selectionEnd,
                offset = 0;

            if (e.which !== 8 && e.which !== 46 && !e.ctrlKey && e.which !== 88) {
                return;
            }

            if (start === end) {
                if (e.which === 8) {
                    offset--;
                } else if (e.which === 46) {
                    offset++;
                }
            }

            var formatedMask = self.format(val, "", start, end, offset);

            if (formatedMask !== undefined) {
                $(self.element).val(formatedMask.val);
                self.element.setSelectionRange(formatedMask.start, formatedMask.end);
            }

            e.preventDefault();
        },
        format: function(currentVal, newVal, start, end, offset) {
            var self = this,
                preStrippedMask = self.strip(currentVal, start, end),
                val, newend, newstart, strippedMask;

            if (preStrippedMask) {
                if (offset > 0) {
                    preStrippedMask.end = preStrippedMask.end + offset;
                } else if (offset < 0) {
                    preStrippedMask.start = preStrippedMask.start + offset;
                }

                val = preStrippedMask.val.substring(0, preStrippedMask.start) +
                          newVal +
                          preStrippedMask.val.substring(preStrippedMask.end, preStrippedMask.val.length);
                newend = newstart = (preStrippedMask.start + newVal.length);

                strippedMask = self.strip(val, newstart, newend);

                if (strippedMask) {
                    return self.formatAsMask(strippedMask.val, strippedMask.mask,
                                             strippedMask.start, strippedMask.end);
                }
            }

            return {
                "val": currentval,
                "start": start,
                "end": end
            };
        },
        formatAsMask: function(val, maskvalue, start, end) {
            var self = this,
                maskRegexDefinitions = self.settings.maskRegexDefinitions,
                newstring = "",
                valcount = 0,
                valcountlength = val.length;

            for (var i = 0; i < maskvalue.length; i++) {
                var maskChar = maskvalue[i];
                var maskRegex = maskRegexDefinitions[maskChar];

                if (valcount < valcountlength) {
                    var valChar = val[valcount];

                    if (maskRegex && maskRegex.test(valChar)) {
                        newstring = newstring + valChar;
                        valcount++;
                    } else {
                        newstring = newstring + maskChar;

                        if (i <= start) {
                            start++;
                            end++;
                        } else if (i > start && i <= end) {
                            end++;
                        }
                    }
                } else {
                    break;
                }
            }

            return {
                "val": newstring,
                "start": start,
                "end": end
            };
        },
        strip: function(val, start, end) {
            var self = this,
                priorityMasks = self.settings.priorities,
                maskRegexDefinitions = self.settings.maskRegexDefinitions,
                maskIndex = 0, maskCharIndex = 0,
                newString = "",
                newStart = start,
                newEnd = end;

            // Go through each character in 'val'
            for (var valCharIndex = 0, len = val.length; valCharIndex < len; valCharIndex++) {
                var valChar = val[valCharIndex];

                // Go through our list of priority masks
                while (maskIndex < priorityMasks.length) {
                    var mask = priorityMasks[maskIndex],
                        maskChar = mask[maskCharIndex],
                        maskRegex = maskRegexDefinitions[maskChar];

                    if (maskIndex === (priorityMasks.length - 1) && !maskChar) {
                        return undefined;
                    } else if (maskRegex) {
                        // This mask character matches one of our regex definitions
                        if(maskRegex.test(valChar)) {
                            newString = newString + valChar;
                            maskCharIndex++;
                            break;
                        } else {
                            if (valCharIndex <= start) {
                                newStart--;
                                newEnd--;
                            } else if (valCharIndex > start && valCharIndex < end) {
                                newEnd--;
                            }

                            break;
                        }
                    } else {
                        // This mask character does not match one of our regex definitions
                        if(valChar === maskChar) {
                            // The given character is the same as our mask character
                            maskCharIndex++;

                            if (valCharIndex <= start) {
                                newStart--;
                                newEnd--;
                            } else if (valCharIndex > start && valCharIndex < end) {
                                newEnd--;
                            }

                            break;
                        } else if (maskCharIndex < mask.length) {
                            maskCharIndex++;
                        } else {
                            maskIndex++;
                            valCharIndex = 0;
                            maskCharIndex = 0;
                            newString = "";
                            newStart = start;
                            newEnd = end;
                            break;
                        }
                    }
                }
            }

            return {
                "val": newString,
                "mask": priorityMasks[(maskIndex >= priorityMasks.length) ? priorityMasks.length - 1 : maskIndex],
                "start": newStart,
                "end": newEnd
            };
        }
    });

    var valueSet = $.valHooks.text && $.valHooks.text.set ? $.valHooks.text.set : function (elem, value) {
        elem.value = value;
        return elem;
    };
    
    $.valHooks.text = $.valHooks.text || {};

    $.valHooks.text.set = function (elem, value) {
        var $elem = $(elem),
            inputMask = $elem.data("simpli_" + pluginName);

        if (inputMask) {
            var formatedMask = inputMask.format("", value, 0, 0);
            value = formatedMask.val;
        }

        return valueSet(elem, value);
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "simpli_" + pluginName)) {
                $.data(this, "simpli_" + pluginName, new MaskedInput(this, options));
            }
        });

        // chain jQuery functions
        return this;
    };

})(jQuery, window, document);
