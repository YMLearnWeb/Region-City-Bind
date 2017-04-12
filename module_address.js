define(["module_region"], function (module_region) {
  "use strict";
    /*
    @module address
    */
    var Address = {
        region: module_region.region(),
        defaults: {
                needShippingFeeCall: true,
                orderitemAmount: null,
                baseValue: null,
                rule: "none"
        },
        init: function (pcode_) {
            var that = this;
            that.region.pCode = pcode_;
            //put region and city into region-select
            that.region.init();
            that.region.provinceChange(pcode_);
            var plist = that.region.pList;
            var tmpl = that.element(plist);
            $('.province-dropdown ul').html(tmpl);
            that.getCityGroup(that.region.pCode);
            var pname = that.region.getProvinceName(pcode_);
            $('.province-dropdown').find('.value').html(that.region.pName);
            $('.city-dropdown').find('.value').html(that.region.cName);
            $("#RegionCode").val(that.region.pCode);
            $("#City").val(that.region.cName);//init regionCode, initcityname
            //shippingfee
            that.getShippingFee(that.region.pCode); //init shippingfee per regionCode
        },
        modify: function () {
            var that = this;
            //action
            $('.province-dropdown ul').on('click', 'a', function () {
                var pCode_ = $(this).attr('data-code');
                that.region.provinceChange(pCode_);
                $('.province-dropdown').find('.value').html(that.region.pName);
                that.getCityGroup();
                $('.city-dropdown').find('.value').html(that.region.cName);
                $('input[name="Region"]').val(that.region.pName);
                $('input[name="RegionCode"]').val(that.region.pCode);
                that.getShippingFee(that.region.pCode);
            });
            $('.city-dropdown ul').on('click', 'a', function () {
                var cCode = $(this).attr('data-code');
                that.region.cityChange(cCode);
                $('.city-dropdown').find('.value').html(that.region.cName);
            });
            $('#modifyPanel .btn-cci-primary').on('click', function (e) {
                e.preventDefault();
                that.submit();
            });
        },
        getCityGroup: function () {
            var that = this;
            that.region.provinceChange(that.region.pCode);
            var clist = that.region.cList;
            var tmpl = that.element(clist);
            $('.city-dropdown ul').html(tmpl);
        },
        submit: function () {
            var that = this;
            that.validate();
            $('form').submit();
        },
        validate: function () {
            var that = this;
            $('input[name="Name"]').val($('input.name').val());
            $('input[name="Region"]').val(that.region.pName);
            $('input[name="RegionCode"]').val(that.region.pCode);
            $('input[name="Zipcode"]').val($('input.zip').val());
            $('input[name="Email"]').val($('input.email').val());
            $('input[name="Phone"]').val($('input.mobile').val());
            $('input[name="City"]').val(that.region.cName);
            $('input[name="Address"]').val($('input.detail').val());
        },
        element: function (list) {
            var tmpl = '';
            for (var i in list) {
                tmpl = tmpl + '<li role="presentation">' +
                      '<a role="menuitem" tabindex="-1" data-code="' +
                      list[i].code + '">' +
                      list[i].name + '</a>' +
                      '</li>';
            }
            return tmpl;
        },

        ruleShippingfee: function () {
            var that = this;
            var rules = {
                "none": function () {
                    return true;
                },
                "one": function () { //compare item value against value
                    if (parseFloat(that.defaults.orderitemAmount) < parseFloat(that.defaults.baseValue)) {
                        return true;
                    } else {
                        return false;// free shipping
                    }
                }
            };
            return rules[that.defaults.rule]();
        },
        getShippingFee: function (code) {
            var that = this;
            if (that.defaults.needShippingFeeCall) {
                var trigger = that.ruleShippingfee(that.defaults.rule);
                if (trigger) { //if need getshippingfee
                        $.ajax({
                            url: "/api/v1/GetShippingFee",
                            data: {
                                "__RequestVerificationToken": $("input[name=__RequestVerificationToken]").val(),
                                "type": "",
                                "from": "",
                                "to": code,
                                "weight": $("#weight").val()
                            },
                        }).done(function (data) {
                            $("#shippingFee").val(data);
                            $("#shippingFee").trigger('change');
                        }).fail(function () {
                            return null;
                        });
                    }
                 }
        },
        load: function (settings) {
            var that = this;
            $.extend(that.defaults, settings);

            if ($("#hasDefaultAddress").length === 0) {
                Address.init("310000");
                $("#modifyPanel").show();
                $("#defaultPanel").hide();
                Address.modify();
            } else {
                $("#modifyPanel").hide();
                $("#defaultPanel").show();
                var pcode = $('#defaultPanel').find('.regioncode').html();
                Address.init(pcode);
                $("#defaultPanel").find('input.edit').on('click', function () {
                    $('#defaultPanel').hide();
                    $("#modifyPanel").show();
                    Address.modify();
                });
            }
        }
    };

    //$(document).ready(function () {
    //    if ($("#hasDefaultAddress").length == 0) {
    //        Address.init("110000")
    //        $("#modifyPanel").show();
    //        $("#defaultPanel").hide();
    //        Address.modify();
    //    } else {
    //        $("#modifyPanel").hide();
    //        $("#defaultPanel").show();
    //        var pcode = $('#defaultPanel').find('.regioncode').html();
    //        Address.init(pcode)

    //        $("#defaultPanel").find('input.edit').on('click', function () {
    //            $('#defaultPanel').hide();
    //            $("#modifyPanel").show();
    //            Address.modify();
    //        })
    //    }
    //})
    return {
        _address: Address
    };
});
