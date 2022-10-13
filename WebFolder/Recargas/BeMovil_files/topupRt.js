// function print_receipt(transaction_id) {
//
//     var posting = $.post(urlPostReceipt, {transaction_id: transaction_id});
//
//     // Put the results in a div
//     posting.done(function (data) {
//         $.loader('close');
//         var blob = new Blob([data]);
//         var a = document.createElement('a');
//         var url = window.URL.createObjectURL(blob);
//         a.href = url;
//         a.download = transaction_id + ".pdf";
//         document.body.append(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//     });
// }

function removeTableRow(jQtable) {
    jQtable.each(function () {
        if ($('tbody', this).length > 0) {
            $('tbody tr:last', this).remove();
        } else {
            $('tr:last', this).remove();
        }
    });
}

// Clean topUp forms (default form) after canceling request.
function cleanTopup() {
    $("#id_points").attr('disabled', 'disabled');
    $("#pinSelect").hide();
    $("#id_claroCode").attr('disabled', 'disabled');
    $("#paqueclaroSelect").hide();
    $("#movistarpSelect").hide();
    $("#tuentipSelect").hide();
    $("#cntpSelect").hide();
    $("#id_amount").removeAttr('disabled', 'disabled').show();
    $("#numbers").show();
    $("#topupVal").show();
    $('#id_amount, #id_serviceNumber').val('');
    $('input:radio[name=operId]').attr('checked', false);
    $('input:radio[name=valorRecarga]').attr('checked', false);
    $('.operador').removeClass("activo");
    $('#valor-recarga li').removeClass("val-activo");
    blankPaqueVariables();
}

// Perform input validations and ajax query for topUp view.
$('#topupForm').submit(function (event) {
    console.log("submit");
    var intRegex = /^\d+$/;
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var oper = get_operador(this['operId'].value);
    if ((oper === "DirecTV" ) && (this['serviceNumber'].value.length < 12)) {
        me.data('Running', false);
        Apprise('Para el operador DirecTV el número debe ser 12 dígitos, puede anteponer "0" a la matrícula para completar');
        return false;
    }
    if ((this['serviceNumber'].value.length < 10)) {
        me.data('Running', false);
        Apprise('El número debe ser 10 dígitos, anteponer "0" para completar');
        return false;
    }
    if (oper === "Paqueclaro" || oper === "Paquemovistar" || oper === "Paquetuenti" || oper === "Paquecnt" ||
        oper === "Paquemaxi"  || oper === "Paqueaki") {
        if (!validatePaqueVariables()) {
            me.data('Running', false);
            Apprise('Debe seleccionar un paquete, primero seleccione una de las categorías y luego una opción de las desplegadas.');
            return false;
        }
    }
    if (!intRegex.test(this['amount'].value) && (oper !== "AxesoCash" ) &&
        (oper !== "Paqueclaro") && (oper !== "Paquemovistar") && (oper !== "Paquetuenti") && (oper !== "Paquecnt")
        && (oper !== "Paquemaxi") && (oper !== "Paqueaki")) {
        me.data('Running', false);
        Apprise('El valor no puede contener caracteres');
        return false;
    }
    else {
        if ((oper === "DirecTV") && (parseFloat(this['amount'].value, 10) < 3)) {
            me.data('Running', false);
            Apprise('El valor de la recarga para DirecTV debe ser mínimo de 3.00');
            return false;
        }
        else {
            if ((parseFloat(this['amount'].value) < 1)) {
                me.data('Running', false);
                Apprise('El valor de la recarga debe ser mínimo de 1.00');
                return false;
            }
            else {
                if ((oper !== "DirecTV")  &&  (parseFloat(this['amount'].value) > 100))
                    {
                        me.data('Running', false);
                        Apprise('El valor de la recarga no puede ser mayor a 100.00')
                        return false;
                    }
            }
        }
    }
    event.preventDefault();
    var options = {
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (r) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var balance = 0;
                    if (r.check)
                        balance = 1;

                    var url = '/topupRt/';
                    var serviceNumber = document.getElementById('id_serviceNumber').value;
                    var amount = document.getElementById('id_amount').value;
                    var operId = $("input:radio[name='operId']:checked").val();


                    if (oper === "AxesoCash") {
                        var e = document.getElementById('id_points');
                        var amount = e.options[e.selectedIndex].text.match(/\$([0-9]+)\.0$/)[1];
                        var points = document.getElementById('id_points').value;
                        // Send the data using post
                        var posting = $.post(url, {
                            points: points,
                            operId: operId,
                            balance: balance
                        });
                    }
                    if ((oper === "Paqueclaro") || (oper === "Paquemovistar") || (oper === "Paquetuenti") ||
                        (oper === "Paquecnt") || (oper === "Paquemaxi") || (oper === "Paqueaki")) {
                        // var amountT = replaceAll(packagePrice, '.', '');
                        // amount = replaceAll(amountT, '$', '');
                        var amount = replaceAll(packagePrice, '$', '');
                        amount = parseFloat(amount) - parseFloat(amount.split(' ')[1]);
                        // Send the data using post
                        var posting = $.post(url, {
                            serviceNumber: serviceNumber,
                            pack_id: packageId,
                            operId: operId,
                            balance: balance
                        });
                    }
                    if ((oper !== "AxesoCash") && (oper !== "Paqueclaro") && (oper !== "Paquemovistar") &&
                        (oper !== "Paquetuenti") && (oper !== "Paquecnt") && (oper !== "Paquemaxi") &&
                        (oper !== "Paqueaki")) {
                        // Send the data using post
                        var posting = $.post(url, {
                            serviceNumber: serviceNumber, amount: amount,
                            operId: operId,
                            balance: balance
                        });
                    }

                    // Put the results in a div
                    posting.always(function (data) {
                        me.data('Running', false);
                        $.loader('close');
                        if (typeof(data) == 'object')
                            if (data.responseText.startsWith('<html>\r\n<head><title>503 Service Temporarily Unavailable</title>'))
                                Apprise('Transacción limitada por exceso de peticiones');
                        if (data.startsWith('<!DOCTYPE')) {
                            var options = {
                                buttons: {
                                    confirm: {
                                        text: 'Aceptar',
                                        className: 'blue',
                                        width: 300,
                                        action: function () {
                                            validNavigation = true;
                                            window.location.href = '../login/';
                                        }
                                    }
                                },
                                override: false
                            };
                            Apprise("Su sesión ha terminado", options);
                        }
                        var res = data.split(" + ");
                        if (typeof res[2] === "undefined")
                            res[2] = '';
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Imprimir',
                                    className: 'blue',
                                    width: 200,
                                    action: function () {
                                        Apprise('close');
                                        cleanTopup();
                                        removeTableRow($('#lasttxs'));
                                        $('#lasttxs > tbody').prepend('<tr>' +
                                            '<td><strong>' + serviceNumber + '</strong></td>' +
                                            '<td><em>' + res[5] + '</em></td>' +
                                            '<td><em>' + formatNumber(parseFloat(amount)) + '</em></td>' +
                                            '<td><em>' + oper + '</em></td>' +
                                            '<td><strong>Exitosa</strong></td>' +
                                            '<td><span>' + res[1] + ' <button type="button" onclick="print_receipt(\'' + res[1]  + '\')">Recibo</button></td></span></td>' +
                                            '</tr>');
                                        validNavigation = true;
                                        mobileList.push(serviceNumber);
                                        if (operId == "11") {
                                            print_receipt(res[1]);
                                        }
                                        else {
                                            print_receipt(res[1]);
                                        }
                                    }
                                },
                                cancel: {
                                    text: 'Aceptar',
                                    action: function () {
                                        cleanTopup();
                                        Apprise('close');
                                        removeTableRow($('#lasttxs'));
                                        $('#lasttxs > tbody').prepend('<tr>' +
                                            '<td><strong>' + serviceNumber + '</strong></td>' +
                                            '<td><em>' + res[5] + '</em></td>' +
                                            '<td><em>' + formatNumber(parseFloat(amount)) + '</em></td>' +
                                            '<td><em>' + oper + '</em></td>' +
                                            '<td><strong>Exitosa</strong></td>' +
                                            '<td><span>' + res[1] + ' <button type="button" onclick="print_receipt(\'' + res[1]  + '\')">Recibo</button></td></span></td>' +
                                            '</tr>');
                                        mobileList.push(serviceNumber);
                                    }
                                }
                            },
                            override: true
                        };
                        if (res[0] === "Recarga exitosa") {
                            Apprise(res[0], options);
                            $('.temp_balance').text('Mi Caja: ' + formatNumber(parseFloat(res[4])));
                            $('.pos_balance').text('Mi Ahorro: ' + formatNumber(parseFloat(res[3])));
                        }
                        else {
                            if (res[0] === "PIN obtenido") {
                                Apprise("PIN: " + res[3] + " Serial: " + res[4], options);
                                $('.temp_balance').text(formatNumber(parseFloat(res[4])));
                            }
                            else {
                                Apprise(res[0]);
                                if ((res[0].startsWith("Recarga duplicada")) || (res[0].startsWith("Sin saldo"))) {

                                }
                                else {
                                    removeTableRow($('#lasttxs'));
                                    $('#lasttxs > tbody').prepend('<tr>' +
                                        '<td><strong>' + serviceNumber + '</strong></td>' +
                                        '<td><em>' + res[5] + '</em></td>' +
                                        '<td><em>' + formatNumber(parseFloat(amount)) + '</em></td>' +
                                        '<td><em>' + oper + '</em></td>' +
                                        '<td><strong>Rechazada</strong></td>' +
                                        '<td><span>' + res[1] + ' <button type="button" onclick="print_receipt(\'' + res[1]  + '\')">Recibo</button></td></span></td>' +
                                        '</tr>');
                                }
                            }
                        }
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                className: 'red',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        check: true,
        override: true
    };
    if (oper === "AxesoCash") {
        Apprise('Confirma realizar la compra del pin?', options);
    }
    else if ((oper === "Paqueclaro") || (oper === "Paquemovistar") || (oper === "Paquetuenti") ||
        (oper === "Paquecnt") || (oper === "Paquemaxi") || (oper === "Paqueaki")){
        var txt = 'Confirma realizar la siguiente compra:<br/>';
        txt = txt + 'Línea: ' + document.getElementById('id_serviceNumber').value + '<br/>';
        txt = txt + 'Paquete: ' + packageName + '<br/>';
        txt = txt + 'Valor: ' + packagePrice;
        Apprise(txt, options);
    }
    else if (oper === "Donacion") {
        var txt = 'Confirma realizar la donación<br/>';
        txt = txt + 'por valor de: ' + formatNumber(document.getElementById('id_amount').value) + '<br/>';
        Apprise(txt, options);
    }
    else {
        var txt = 'Confirma realizar la siguiente compra:<br/>';
        txt = txt + 'Línea: ' + document.getElementById('id_serviceNumber').value + '<br/>';
        txt = txt + 'Operador: ' + oper + '<br/>';
        txt = txt + 'Valor: $' + formatNumber(document.getElementById('id_amount').value) + '<br/>';
        Apprise(txt, options);
    }
});

function paquetes(url) {
    $(".nombre-paqueres").empty();
    $(".o-planes").empty();
    $.get(url, function (data) {
        if (data.next) {
            getPaquetes(data);
        } else {
            renderPaquetes(data.results);
        }
    });
}

function getPaquetes(data) {
    if (data.next) {
        let url = data.next;
        if (window.location.href.split('/')[0] === "https:") {
            url = url.replace("http://", "https://");
        }
        $.get(url, function (innerData) {
            if (innerData.next) {
                innerData.results = innerData.results.concat(data.results);
                getPaquetes(innerData);
            } else {
                data.results = data.results.concat(innerData.results);
                renderPaquetes(data.results);
            }
        });
    }
}

function renderPaquetes(results) {
    $.each(results, function (i, paquete) {
        var sub = paquete.paquete;
        if (!$.isEmptyObject(sub)) {
            $(".nombre-paqueres").append("<li class='serv'><a atr=" + paquete.id + ">" + paquete.name + "</a></li>");
        }
    });
    servclickeado();
    $(".serv").click(function () {
        var data = $("a", this).attr("atr");
        $(".o-planes").empty();
        $.each(results, function (i, paquetes) {
            if (paquetes.id == data) {
                var sub = paquetes.paquete;
                for (var j in sub) {
                    $(".o-planes").append("<div class='grid-100 element' atr=" + sub[j].id +
                        "><div class='grid-100 text-element' sel=" + sub[j].id + "><div class='price-element'>" +
                        sub[j].formatted_selling_price + "<br/><br/><span>Incentivo: " + sub[j].formatted_tip
                        + "</span></div><div class='text-price'><p>" +
                        sub[j].name + "<span>" + sub[j].description + "</span></p></div></div></div>");
                }
            }
        });
        clickeado();
    });
}


function servclickeado() {
    $('.serv').click(function () {
        if ($('.serv').hasClass('serv-clic')) {
            $('.serv').removeClass('serv-clic');
            $(this).addClass('serv-clic');
        } else {
            $(this).addClass('serv-clic');
        }
    });
}

function clickeado() {
    $('.text-element').click(function () {
        if ($('.text-element').hasClass('clic')) {
            $('.text-element').removeClass('clic');
            $(this).addClass('clic');
        } else {
            $(this).addClass('clic');
        }
        packageId = $(this).attr("sel");
        packagePrice = $(".price-element", this).html();
        packageName = $(".text-price", this).html().replace('<span>', ' ').replace('</span>', ' ');
    });
}

$("#id_serviceNumber").autocomplete({
    source: mobileList
});

var packageId = "";
var packagePrice = "";
var packageName = "";

function blankPaqueVariables() {
    packageId = "";
    packagePrice = "";
    packageName = "";
}

function validatePaqueVariables() {
    return (packageId !== "" && packagePrice !== "" && packageName !== "");
}

$(document).ready(function() {
    $('#valor, #celular').keyup(function () {
        this.value = (this.value + '').replace(/[^0-9]/g, '');
    });

    $(".operador").click(function () {
        console.log("operClick");
        blankPaqueVariables();

        var Operador = $(this).attr('id');

        if ((Operador === "DirecTV") || (Operador === "DirecTVm")) {
            $("#id_serviceNumber").attr('maxlength', '12').attr('placeholder', '5XXXXXXXXXXX');
        }
        else {
            $("#id_serviceNumber").attr('maxlength', '10').attr('placeholder', '09XXXXXXXX');
        }
        if ((Operador === "Paqueclaro") || (Operador === "Paqueclarom")){
            $("#id_amount").attr('disabled', 'disabled').hide();
            $("#topupVal").hide();
            $("#id_points").attr('disabled', 'disabled');
            $("#pinSelect").hide();
            $("#movistarpSelect").hide();
            $("#tuentipSelect").hide();
            $("#cntpSelect").hide();

            $("#id_serviceNumber").removeAttr('disabled', 'disabled');
            $("#id_operCode").removeAttr('disabled', 'disabled');
            $("#paqueclaroSelect").show();
            $("#numbers").show();
            paquetes(paqueClarosUrl);
            jQuery(".opciones").show();
        }
        else {
            if ((Operador === "Paquetuenti") || (Operador === "Paquetuentim")){
                $("#id_amount").attr('disabled', 'disabled').hide();
                $("#topupVal").hide();
                $("#id_points").attr('disabled', 'disabled');
                $("#pinSelect").hide();
                $("#movistarpSelect").hide();
                $("#paqueclaroSelect").hide();
                $("#cntpSelect").hide();

                $("#id_serviceNumber").removeAttr('disabled', 'disabled');
                $("#id_operCode").removeAttr('disabled', 'disabled');
                $("#tuentipSelect").show();
                $("#numbers").show();
                paquetes(tuentipUrl);
                jQuery(".opciones").show();
            }
            else {
                // if (Operador == "13"){ //Donaciones
                //     $("#paquetigoSelect").hide();
                //     $("#id_points").attr('disabled', 'disabled');
                //     $("#pinSelect").hide();
                //     $("#id_claroCode").attr('disabled', 'disabled');
                //     $("#paqueclaroSelect").hide();
                //     $("#id_virginCode").attr('disabled', 'disabled');
                //     $("#paquevirginSelect").hide();
                //     $("#id_serviceNumber").attr('disabled', 'disabled');
                //     $("#numbers").hide();
                //     $("#id_operCode").attr('disabled', 'disabled');
                //     $("#conectameSelect").hide();
                //     $("#sipmovilSelect").hide();
                //
                //     $("#id_amount").removeAttr('disabled', 'disabled').show();
                //     $("#topupVal").show();
                // }
                // else {
                if ((Operador === "Paquemovistar") || (Operador === "Paquemovistarm")){
                    $("#id_amount").attr('disabled', 'disabled').hide();
                    $("#topupVal").hide();
                    $("#id_points").attr('disabled', 'disabled');
                    $("#pinSelect").hide();
                    $("#tuentipSelect").hide();
                    $("#paqueclaroSelect").hide();
                    $("#cntpSelect").hide();

                    $("#id_serviceNumber").removeAttr('disabled', 'disabled');
                    $("#id_operCode").removeAttr('disabled', 'disabled');
                    $("#movistarpSelect").show();
                    $("#numbers").show();
                    paquetes(movistarpUrl);
                    jQuery(".opciones").show();
                }
                else {
                    if ((Operador === "Paquecnt") || (Operador === "Paquecntm")){
                        $("#id_amount").attr('disabled', 'disabled').hide();
                        $("#topupVal").hide();
                        $("#id_points").attr('disabled', 'disabled');
                        $("#pinSelect").hide();
                        $("#tuentipSelect").hide();
                        $("#paqueclaroSelect").hide();
                        $("#movistarpSelect").hide();

                        $("#id_serviceNumber").removeAttr('disabled', 'disabled');
                        $("#id_operCode").removeAttr('disabled', 'disabled');
                        $("#cntpSelect").show();
                        $("#numbers").show();
                        paquetes(cntpUrl);
                        jQuery(".opciones").show();
                    }
                    else {
                        if ((Operador === "Paquemaxi") || (Operador === "Paquemaxim")){
                            $("#id_amount").attr('disabled', 'disabled').hide();
                            $("#topupVal").hide();
                            $("#id_points").attr('disabled', 'disabled');
                            $("#pinSelect").hide();
                            $("#tuentipSelect").hide();
                            $("#paqueclaroSelect").hide();
                            $("#movistarpSelect").hide();

                            $("#id_serviceNumber").removeAttr('disabled', 'disabled');
                            $("#id_operCode").removeAttr('disabled', 'disabled');
                            $("#cntpSelect").show();
                            $("#numbers").show();
                            paquetes(maxipUrl);
                            jQuery(".opciones").show();
                        }
                        else
                        {
                            if ((Operador === "Paqueaki") || (Operador === "Paqueakim")){
                                $("#id_amount").attr('disabled', 'disabled').hide();
                                $("#topupVal").hide();
                                $("#id_points").attr('disabled', 'disabled');
                                $("#pinSelect").hide();
                                $("#tuentipSelect").hide();
                                $("#paqueclaroSelect").hide();
                                $("#movistarpSelect").hide();

                                $("#id_serviceNumber").removeAttr('disabled', 'disabled');
                                $("#id_operCode").removeAttr('disabled', 'disabled');
                                $("#cntpSelect").show();
                                $("#numbers").show();
                                paquetes(akipUrl);
                                jQuery(".opciones").show();
                            }
                            else
                            {
                                $("#id_points").attr('disabled', 'disabled');
                                $("#pinSelect").hide();
                                $("#id_operCode").attr('disabled', 'disabled');
                                $("#paqueclaroSelect").hide();
                                $("#movistarpSelect").hide();
                                $("#tuentipSelect").hide();
                                $("#cntpSelect").hide();

                                $("#id_amount").removeAttr('disabled', 'disabled').show();
                                $("#topupVal").show();
                                $("#id_serviceNumber").removeAttr('disabled', 'disabled');
                                $("#numbers").show();
                            }
                        }
                    }
                }
            }
        }
        Operador = $(this).attr('data-operador');
        $('.operador').removeClass("activo");
        $(this).addClass("activo");
        $('input:radio[name=operId]').removeAttr('checked');
        $('input:radio[name=operId][value='+Operador+']').prop('checked',true);
        $('#id_serviceNumber').focus();
    });
    $( "#valor-recarga li" ).click(function() {
        var Recarga = $(this).attr('data-recarga');
        $('#valor-recarga li').removeClass("val-activo");
        $(this).addClass("val-activo");
        $('#id_amount').val(Recarga);
    });
});