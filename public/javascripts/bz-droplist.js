;(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(window, document)
    } else {
        root.Droplist = factory(window, document)
    }
})(this, function(w, d) {
    'use strict';
    // droplist prototype
    var Dl = function (options) {
        options = options || {};
        this.o = {};
        this.o = bz.help.mergeOptions(Dl.defaultOptions, options);
        this.droplist = bzDom(this.o.selector).parent('.bz-droplist');
        this.inpt = this.droplist.find('[type="hidden"]');
        this.data = [];
        this.datanames = [];
        this.addactions();
    };
    Dl.prototype = {
        // main methods
        addactions: function() {
            var Dl = this;
            var $ddlWrap = Dl.droplist;
            var $trig = $ddlWrap.find('.bz-trigg'),
                $inpt = $trig.prev('input'),
                $chks = $ddlWrap.find('[type="checkbox"]'),
                $ddl = $ddlWrap.find('.bz-ddl'),
                $itms = $ddlWrap.find('.bz-ddl-item');
            var dVal = $inpt.ondata('val') || '';
            var displayVal = $inpt.val() ? $inpt.val() : dVal;
            var prop_title = $inpt.ondata('title') ? $inpt.ondata('title')+': ' : $inpt.onattr('name');
            if ($inpt.ondata('noselect'))
                $trig.find('.text').inhtml($inpt.ondata('noselect') + displayVal);
            else $trig.find('.text').inhtml(prop_title + displayVal);
            $trig.on('click', function() {
                var $th = bzDom(this),
                    _$ddl = $th.parent('.bz-droplist').find('.bz-ddl');
                if (_$ddl.ondata('key') == '1') Dl.closeDdl(_$ddl);
                else Dl.openDdl(_$ddl);
            });
            $chks.each(function(i, item) {
                var chk = bzDom(item);
                if (chk.el.checked == true) {
                    Dl.checkBox(chk);
                }
            });
            $chks.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $itms.each(function(i, item) {
                var itm = bzDom(item);
                itm.on('click', function() {
                    var $self = bzDom(this),
                        $chk = $self.find('input');
                    if ($chk.el.checked == false || $chk.onattr('checked') != 'checked') {
                        if (!$ddlWrap.onattr('multiple') == true)
                            Dl.uncheckAll($chks);
                        Dl.checkBox($chk);
                        $inpt.ondata('val', Dl.datanames);
                        Dl.triggName($inpt, $trig);
                        if ($inpt.ondata('action'))
                            Dl.makeRequest($self, Dl.data, $trig, $inpt, true);
                        if (Dl.o.calloncheck && Blues.check.ifFunction(Dl.o.calloncheck))
                            Dl.o.calloncheck($self, Dl.data, $trig, $inpt);
                    } else {
                        Dl.uncheckBox($chk);
                        $inpt.ondata('val', Dl.datanames);
                        Dl.triggName($inpt, $trig);
                        if ($inpt.ondata('action'))
                            Dl.makeRequest($self, Dl.data, $trig, $inpt, false);
                        if (Dl.o.calluncheck && Blues.check.ifFunction(Dl.o.calluncheck))
                            Dl.o.calluncheck($self, Dl.data, $trig, $inpt);
                    }
                    if (!$ddlWrap.onattr('multiple') === true) {
                        var _$ddl = $self.parent();
                        if (_$ddl.ondata('key') === '1')
                            Dl.closeDdl(_$ddl);
                    }
                });
            });
            // switch on searching option
            if ($ddlWrap.ondata('search') == 'true')
                Dl.initsearch($itms);
        },
        triggName: function(inpt, trigger) {
            var prop_name = '' + inpt.onattr('name'),
                prop = inpt.val();
            var displayVal = inpt.ondata('val') ? inpt.ondata('val') : prop;
            var prop_title = inpt.ondata('title') ? inpt.ondata('title')+': ' : prop_name + ': ';
            var t = trigger.find('.text');
            t.inhtml(prop_title + displayVal);
        },
        makeRequest: function(selector, data, trigger, inpt, chk) {
            var prop_name = '' + inpt.onattr('name');
            var act = inpt.ondata('action'),
                obj_id;
            var makeReq = false;
            if (inpt.ondata('id')) {
                obj_id = inpt.ondata('id');
                makeReq = true;
            } else if (document.getElementById('objectId')) {
                obj_id = document.getElementById('objectId').value;
                makeReq = true;
            } else return;
            if (makeReq) {
                var dataObj = {};
                dataObj['id'] = obj_id;
                var _$ddlWrap = inpt.parent('.bz-droplist');
                if (_$ddlWrap.onattr('multiple') === true)
                    dataObj[prop_name] = data;
                else dataObj[prop_name] = data[0];
                dataObj['checked'] = chk;
                // if (inpt.onattr('data-val'))
                //     dataObj['propval'] = inpt.onattr('data-val');
                bz.ajax({
                    url: act,
                    type: 'post',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: dataObj,
                    success: function(data) {
                        bz.Toast('Has been saved!', { tclass: 'positive' });
                    },
                    error: function(e) {
                        bz.Toast('Error: ' + e, { tclass: 'negative' });
                    }
                });
            }
        },
        closeDdl: function (ddl) {
            ddl.ondata('key', '0');
            ddl.toggleclass('bz-on');
            //$flag.toggleclass('bz-rotate180');
        },
        openDdl: function(ddl) {
            var Dl = this;
            setTimeout(function() {
                ddl.ondata('key', '1');
                ddl.toggleclass('bz-on');
            }, 300);
            // ddl.on('mouseenter', function(e) {
            //     var $self = bzDom(this);
            //     $self.on('mouseleave', function() {
            //         $self.ondata('hold', '0');
            //         if ($self.ondata('key') == '1') {
            //             setTimeout(function() {
            //                 if ($self.ondata('key') == '1')
            //                     Dl.closeDdl($self);
            //             }, 1500)
            //         }
            //     });
            // });
            //$flag.toggleclass('bz-rotate180');
        },
        checkBox: function (chk) {
            var $dlItem = chk.parent('.bz-ddl-item'),
                _t = $dlItem.find('.text').inhtml();
            chk.el.setAttribute('checked', 'checked');
            chk.el.checked = true;
            if (!$dlItem.ifclass('selected'))
                $dlItem.onclass('selected');
            var Dl = this;
            Dl.data.push(chk.onattr('name'));
            Dl.datanames.push(_t);
            Dl.inpt.val(Dl.data);
            Dl.inpt.ondata('val', Dl.datanames);
        },
        uncheckBox: function (chk) {
            var $dlItem = chk.parent('.bz-ddl-item'),
                _t = $dlItem.find('.text').inhtml();
            chk.el.removeAttribute('checked');
            chk.el.checked = false;
            if ($dlItem.ifclass('selected'))
                $dlItem.offclass('selected');
            var Dl = this;
            if (Dl.data.indexOf(chk.onattr('val')) > -1 ) {
                Dl.data.splice(Dl.data.indexOf(chk.onattr('name')) , 1);
            }
            if (Dl.datanames.indexOf(_t) > -1) {
                Dl.datanames.splice(Dl.datanames.indexOf(_t), 1);
            }
            Dl.inpt.val(Dl.data);
            Dl.inpt.ondata('val', Dl.datanames);
        },
        uncheckAll: function(chks) {
            var Dl = this;
            chks.each(function(i, item) {
                Dl.uncheckBox(bzDom(item));
            });
        },
        initsearch: function(items) {
            var $ddl = bzDom(items.el[0]).parent('.bz-ddl');
            var input = bzDom('<input type="text">');
            input.onclass('searchfield');
            input.onattr('placeholder', 'Search..');
            function filterFunction(filter, itms) {
                itms.each(function(i, item) {
                    var a = bzDom(item).find('.text');
                    if (a.inhtml().toUpperCase().indexOf(filter) > -1)
                        a.parent('.bz-ddl-item').show();
                    else
                        a.parent('.bz-ddl-item').hide();
                });
            }
            input.on('keyup', function() {
                var $self = bzDom(this),
                    filter = $self.val().toUpperCase();
                var itms = $self.parent().find('.bz-ddl-item');
                filterFunction(filter, itms);
            });
            $ddl.prepend(input);
        }
    };
    Dl.defaultOptions = {
        selector: '.bz-droplist',
        calloncheck: null,
        calluncheck:  null
    };
    function init(options) {
        if (!bzDom(options.selector).exist()) return;
        //if (Object.prototype.hasOwnProperty.call(options, 'data-droplist')) return;
        //Object.defineProperty(options, 'data-droplist', { value: new Droplist(options) });
        new Droplist(options);
    }
    function all(selector) {
        selector = selector || '.bz-droplist';
        var ddls = bzDom(selector);
        ddls.each(function(i, item) {
            var options = {};
            options.selector = bzDom(item);
            init(options);
        });
    }
    function getdata(selector) {
        var elem = bzDom(selector),
            chks = elem.find('[type="checkbox"]');
        var arr = [];
        chks.each(function(i, item) {
            var chk = bzDom(item);
            if (chk.el.checked == true) {
                arr.push(chk.onattr('name'));
            }
        });
        return arr;
    }
    Dl.data = getdata;
    Dl.init = init;
    Dl.all = all;
    var Droplist = Dl;
    return Droplist;
});

