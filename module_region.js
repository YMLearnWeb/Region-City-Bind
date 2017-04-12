define(["address_chn"], function (address_chn) {
  'use strict';
    /**
    @class Region
   */
    var Region = function (regionList) {
        this.regionList = regionList;
        this.pCode = '';
        this.cCode = '';
        this.pName = '';
        this.cName = '';
        this.pList = [];
        this.cList = [];
        this.shippingfee = '';
    };
    Region.prototype.init = function () {
        for(var i in this.regionList) {
            this.pList.push({
                code: i,
                name: this.regionList[i].n
            });
        }
    };
    Region.prototype.getProvinceName = function (pcode) {
        for (var i in this.pList) {
            if (this.pList[i].code === pcode) {
                return this.pList[i].name;
            }
        }
    };
    Region.prototype.clearList = function () {
        this.cList = [];
    };

    Region.prototype.provinceChange = function (pCode) {
        this.cList = [];
        var pLine = this.regionList[pCode];
        this.pName = pLine.n || '';
        this.pCode = pCode;
        if (pLine.c) {
            for (var i in pLine.c) {
                var cCode = i;
                var cityName = pLine.c[i].n || '';
                this.cList.push({
                    code: cCode,
                    name: cityName
                });
            }
        }
        this.cCode = this.cList[0].code;
        this.cName = this.cList[0].name;
        if (this.shippingfee.required) {
            this.shippingfee.value = this.shippingFee(this.pCode);
        }
    };
    Region.prototype.cityChange = function (cCode) {
        this.cCode = cCode;
        for (var i in this.cList) {
            if (this.cList[i].code === cCode) {
                this.cName = this.cList[i].name;
                break;
            }
        }
    };
    Region.prototype.validate = function () {
        if (this.pCode === '' || this.cCode === '') {
            return false;
        }
    };
    Region.prototype.shippingFee = function (fee) {
        this.shippingfee = fee;
    };

    return {
        region: function(){
          return new Region(address_chn.address_data());
        }
    };
});
