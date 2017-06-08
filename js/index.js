$(document).ready(function() {
    $(document).on('input', 'input', function() {
        getTotal();
        console.log('a');
    });
    $('#dauca').on('input', function() {
        $(this).next('small').text(DocTienBangChu(parseInt($(this).val()) * 1000));
    });
    $('#cuoica').on('input', function() {
        $(this).next('small').text(DocTienBangChu(parseInt($(this).val()) * 1000));
    });

    $('.tienmat input').on('input', function() {
        var tienmat = getTienmat();
        $('#tienmat-str').text(moneyStr(tienmat));
        getTotal();
    });

    $('.repeater').repeater({
        isFirstItemUndeletable: true,
        hide: function(deleteElement) {
            $(this).slideUp(deleteElement);
            setTimeout(function() {
                getTotal();
                var chira = getChira();
                $('#chira-str').text(moneyStr(chira));
                var themvao = getThemvao();
                $('#themvao-str').text(moneyStr(themvao));
            }, 500);
        },
        show: function(showElement) {
            $(this).slideDown(showElement);
        }
    });

    $('.chira-lst').on('input', 'input', function() {
        var chira = getChira();
        $('#chira-str').text(moneyStr(chira));
    });
    $('.themvao-lst').on('input', 'input', function() {
        var themvao = getThemvao();
        $('#themvao-str').text(moneyStr(themvao));
    });

    function getChira() {
        var chira = 0;
        var arrChira = $('.repeater').repeaterVal().chira;
        $.each(arrChira, function(index, val) {
            if (val.sotien) {
                chira += parseInt(val.sotien) * 1000;
            }
        });
        return chira;
    }

    function getThemvao() {
        var themvao = 0;
        var arrThem = $('.repeater').repeaterVal().themvao;
        $.each(arrThem, function(index, val) {
            if (val.sotien) {
                themvao += parseInt(val.sotien) * 1000;
            }
        });
        return themvao;
    }

    function getTienmat() {
        var tienmat = 0;
        $('.tienmat').find('input').each(function() {
            if ($(this).val()) {
                var number = parseInt($(this).val());
                var heso = parseInt($(this).attr('id')) * 1000;
                tienmat += number * heso;
            }
        });
        return tienmat;
    }

    function getTotal() {
        var tienmat = getTienmat();
        var chira = getChira();
        var themvao = getThemvao();
        var dauca = $('#dauca').val() ? parseInt($('#dauca').val()) * 1000 : 0;
        var cuoica = $('#cuoica').val() ? parseInt($('#cuoica').val()) * 1000 : 0;
        chira = chira >= 0 ? chira : 0;
        tienmat = tienmat >= 0 ? tienmat : 0;
        themvao = themvao >= 0 ? themvao : 0;
        var cangiao = cuoica + dauca - chira + themvao;
        $('#cangiao').text(moneyStr(cangiao));
        $('#thucgiao').text(moneyStr(tienmat));
        var tong = tienmat - cangiao;
        var prefix = tong >= 0 ? 'Dư' : '';
        $('#tong').text(prefix + ' ' + moneyStr(tong))
    }
});

Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

//1. Hàm đọc số có ba chữ số;
function DocSo3ChuSo(baso) {
    var tram;
    var chuc;
    var donvi;
    var KetQua = "";
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if (tram == 0 && chuc == 0 && donvi == 0) return "";
    if (tram != 0) {
        KetQua += ChuSo[tram] + " trăm ";
        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
    }
    if ((chuc != 0) && (chuc != 1)) {
        KetQua += ChuSo[chuc] + " mươi";
        if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
    }
    if (chuc == 1) KetQua += " mười ";
    switch (donvi) {
        case 1:
            if ((chuc != 0) && (chuc != 1)) {
                KetQua += " mốt ";
            } else {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += ChuSo[donvi];
            } else {
                KetQua += " lăm ";
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += ChuSo[donvi];
            }
            break;
    }
    return KetQua;
}

//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

function DocTienBangChu(SoTien) {
    var lan = 0;
    var i = 0;
    var so = 0;
    var KetQua = "";
    var tmp = "";
    var ViTri = new Array();
    if (SoTien == 0) return "Không đồng !";
    if (SoTien > 0) {
        so = SoTien;
    } else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        //SoTien = 0;
        return "Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5]))
        ViTri[5] = "0";
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4]))
        ViTri[4] = "0";
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3]))
        ViTri[3] = "0";
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
    if (isNaN(ViTri[2]))
        ViTri[2] = "0";
    ViTri[1] = parseInt((so % 1000000) / 1000);
    if (isNaN(ViTri[1]))
        ViTri[1] = "0";
    ViTri[0] = parseInt(so % 1000);
    if (isNaN(ViTri[0]))
        ViTri[0] = "0";
    if (ViTri[5] > 0) {
        lan = 5;
    } else if (ViTri[4] > 0) {
        lan = 4;
    } else if (ViTri[3] > 0) {
        lan = 3;
    } else if (ViTri[2] > 0) {
        lan = 2;
    } else if (ViTri[1] > 0) {
        lan = 1;
    } else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = DocSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += Tien[i];
        if ((i > 0) && (tmp.length > 0)) KetQua += ','; //&& (!string.IsNullOrEmpty(tmp))
    }
    if (KetQua.substring(KetQua.length - 1) == ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
    if (SoTien < 0) {
        return 'Âm ' + KetQua + ' đồng';
    }
    return KetQua + ' đồng'; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
}


function moneyStr(money) {
    return DocTienBangChu(money) + ' (' + money.formatMoney(0, '.', '.') + 'đ)';
}
