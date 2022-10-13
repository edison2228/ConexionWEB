String.prototype.replaceAll = function (searchStr, replaceStr) {
    var str = this;

    // escape regexp special characters in search string
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

function formatNumber(val)
{
    const options = {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    };
    const formatted = Number(val).toLocaleString('de', options);
    return formatted;
}


$('#massive_post_approve').submit(function (event) {

    // Stop form from submitting normally
    event.preventDefault();
    var intVal = function (i) {
        if (typeof i === 'number')
            return i;
        i = replaceAll(i, ',', ';');
        i = replaceAll(i, '.', '');
        i = replaceAll(i, ';', '.');
        if (!isNaN(i) && i.length != 0)
            return parseFloat(i);
    };
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);

    var url = $(this).attr("action");
    var selections = document.getElementsByName('click');
    var ids = document.getElementsByName('id_client');
    var amounts = document.getElementsByName('amount_trans');
    var observations = document.getElementsByName('observation');
    var send_ids = [];
    var send_amounts = [];
    var send_observations = [];
    var names = [];
    var percents = [];
    var empty = false;
    var leastone = 0;
    for (var i = 0; i < selections.length; i++) {
        if (selections[i].checked == 1) {
            send_ids.push(ids[i].value);
            if (amounts[i].value < 1)
                empty = true;
            send_amounts.push(amounts[i].value);
            send_observations.push(observations[i].value);
            leastone += 1;
            if (amounts[i].value == "")
                empty = true;
            names.push($('#name' + ids[i].value).text());
            percents.push(intVal($('#id_percent' + ids[i].value).val()));
        }
    }
    if (empty) {
        me.data('Running', false);
        Apprise("No pueden existir valores vacíos o negativos");
    }
    else if (leastone == 0) {
        me.data('Running', false);
        Apprise("Debe seleccionar al menos un cliente para hacer el reparto");
    }
    else {
        var options = {
            buttons: {
                confirm: {
                    text: 'Aceptar',
                    className: 'blue',
                    width: 200,
                    action: function () {
                        Apprise('close');
                        $.loader({
                            className: "imgloader",
                            content: '<br/>Procesando'
                        });

                        // Send the data using post
                        var posting = $.post(url, {
                            ids: send_ids, amounts: send_amounts,
                            observations: send_observations
                        });

                        // Put the results in a div
                        posting.done(function (data) {
                            me.data('Running', false);
                            $.loader('close');
                            var options = {
                                buttons: {
                                    confirm: {
                                        text: 'Aceptar',
                                        className: 'blue',
                                        width: 300,
                                        action: function () {
                                            validNavigation = true;
                                            window.location.href = '../listMassivePostApprove/';
                                        }
                                    }
                                },
                                override: false
                            };
                            Apprise(data, options);
                        });
                    }
                },
                cancel: {
                    text: 'Cancelar',
                    action: function () {
                        me.data('Running', false);
                        Apprise('close');
                    }
                }
            },
            override: true
        };
        msj = "¿Está seguro de repartir saldo a los siguientes clientes?<br/><br/>";
        for (var i = 0; i < send_ids.length; i++) {
            msj += "Cliente: " + names[i] + "<br/>";
            msj += "Valor acreditado: <b>$ " + formatNumber(parseInt(send_amounts[i])) + "</b><br/><br/>";
        }
        Apprise(msj, options);
    }
});


$('#reversePost').submit(function (event) {

    // Stop form from submitting normally
    event.preventDefault();
    var intVal = function (i) {
        if (typeof i === 'number')
            return i;
        i = replaceAll(i, ',', ';');
        i = replaceAll(i, '.', '');
        i = replaceAll(i, ';', '.');
        if (!isNaN(i) && i.length != 0)
            return parseFloat(i);
    };
    var me = $(this);

    if (me.data('Running'))
        return;
    me.data('Running', true);

    var url = $(this).attr("action");
    var selections = document.getElementsByName('click');
    var ids = document.getElementsByName('id_client');
    var amounts = document.getElementsByName('amount_trans');
    var observations = document.getElementsByName('observation');
    var send_ids = [];
    var send_amounts = [];
    var send_comisions = [];
    var send_observations = [];
    var names = [];
    var percents = [];
    var empty = false;
    var leastone = 0;
    for (var i = 0; i < selections.length; i++) {
        if (selections[i].checked == 1) {
            send_ids.push(ids[i].value);
            send_amounts.push(amounts[i].value);
            if (amounts[i].value < 1)
                empty = true;
            send_observations.push(observations[i].value);
            leastone += 1;
            if (amounts[i].value == "")
                empty = true;
            names.push($('#name' + ids[i].value).text());
            percents.push(intVal($('#id_percent' + ids[i].value).val()));
        }
    }
    if (empty) {
        me.data('Running', false);
        Apprise("No pueden existir valores vacíos o negativos");
    }
    else if (leastone == 0) {
        me.data('Running', false);
        Apprise("Debe seleccionar al menos un cliente para hacer la reversión");
    }
    else {
        var options = {
            buttons: {
                confirm: {
                    text: 'Aceptar',
                    className: 'blue',
                    width: 200,
                    action: function () {
                        Apprise('close');
                        $.loader({
                            className: "imgloader",
                            content: '<br/>Procesando'
                        });

                        // Send the data using post
                        var posting = $.post(url, {
                            ids: send_ids, amounts: send_amounts,
                            observations: send_observations
                        });

                        // Put the results in a div
                        posting.done(function (data) {
                            me.data('Running', false);
                            $.loader('close');
                            var options = {
                                buttons: {
                                    confirm: {
                                        text: 'Aceptar',
                                        className: 'blue',
                                        width: 300,
                                        action: function () {
                                            validNavigation = true;
                                            window.location.href = '../listReversePost/';
                                        }
                                    }
                                },
                                override: false
                            };
                            Apprise(data, options);
                        });
                    }
                },
                cancel: {
                    text: 'Cancelar',
                    action: function () {
                        me.data('Running', false);
                        Apprise('close');
                    }
                }
            },
            override: true
        };
        msj = "¿Está seguro de reversar saldo a los siguientes clientes?<br/><br/>";
        for (var i = 0; i < send_ids.length; i++) {
            msj += "Cliente: " + names[i] + "<br/>";
            msj += "Valor reversado: $ " + formatNumber(parseInt(send_amounts[i])) + "<br/>";
        }
        Apprise(msj, options);
    }
});


$('#id_has_ussd1').click(function () {
    if (this.checked) {
        $('#ussd1').fadeIn(500);
        $('#id_ussd1').focus();

    }
    else {
        $('#id_ussd1').val("");
        setTimeout(function () {
            $('#ussd1').fadeOut(300);
        }, 300);
    }
});

$('#id_has_ussd2').click(function () {
    if (this.checked) {
        $('#ussd2').fadeIn(500);
        $('#id_ussd2').focus();

    }
    else {
        $('#id_ussd2').val("");
        setTimeout(function () {
            $('#ussd2').fadeOut(300);
        }, 300);
    }
});

$('#id_has_data').click(function () {
    if (this.checked) {
        $('#datafono').fadeIn(500);
        $('#id_datafono').focus();

    }
    else {
        $('#id_datafono').val("");
        $('#id_data_ss').val("");
        setTimeout(function () {
            $('#datafono').fadeOut(300);
        }, 300);
    }
});

$(document).ready(function () {
    $("input:radio[name=operId]").click(function () {
        if (this.value == 3) {
            $("#id_serviceNumber").attr('maxlength', '12');
            $("#id_serviceNumber").attr('placeholder', '5XXXXXXXXXXX');
        }
        else {
            $("#id_serviceNumber").attr('maxlength', '10');
            $("#id_serviceNumber").attr('placeholder', '3XXXXXXXXX');
        }
    });
});

$.extend($.fn.dataTable.defaults, {
    "responsive": true,
    columnDefs: [
        {type: 'natural', targets: 0}
    ],
    "language": {
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "search": "Buscar:",
        "lengthMenu": "Mostrar _MENU_ filas",
        "zeroRecords": "No se encontraron resultados.",
        "info": "Mostrando página _PAGE_ de _PAGES_.",
        "infoEmpty": "",
        "emptyTable": "No se encontraron resultados.",
        "infoFiltered": "(Filtrando resultados de los _MAX_ que se tienen.)",
        "columns": {
            "defaultContent": ""
        }
    }
});

// This function gets cookie with a given name
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

//The functions below will create a header with csrftoken
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader("csrfmiddlewaretoken", csrftoken);
        }
    }
});

function enable_recaudo_id_tarjeta_recaudo() {
    $(".recaudoId").removeAttr('disabled').show();
}

function disable_recaudo_id_tarjeta_recaudo() {
    $(".recaudoId").attr('disabled', 'disabled').hide();
}

function enable_baloto_term_id_terminal_baloto_agt() {
    $(".balotoTerminalId").removeAttr('disabled').show();
}

function disable_baloto_term_id_terminal_baloto_agt() {
    $(".balotoTerminalId").attr('disabled', 'disabled').hide();
}

$('select[name="bank"]').change(function () {
    // Agrario
    if ($(this).val() == "3") {
        disable_recaudo_id_tarjeta_recaudo();
    } else {
        enable_recaudo_id_tarjeta_recaudo();
    }

    // Bogota, Citi
    if (($(this).val() == "6") || ($(this).val() == "2")) {
        enable_baloto_term_id_terminal_baloto_agt();
    } else {
        disable_baloto_term_id_terminal_baloto_agt();
    }

}).ready(function () {
    var select = $('select[name="bank"]');

    // Agrario
    if (select.val() == "3") {
        disable_recaudo_id_tarjeta_recaudo();
    } else {
        enable_recaudo_id_tarjeta_recaudo();
    }

    // Bogota, Citi
    if ((select.val() == "6") || (select.val() == "2")) {
        enable_baloto_term_id_terminal_baloto_agt();
    } else {
        disable_baloto_term_id_terminal_baloto_agt();
    }
});

// Enforce nip digit filling in form at user creation time.
function validate_user(form) {
    if ((form['nip_type'].value == 2) && (form['nip_digit'].value == "")) {
        alert('Debe ingresar el dígito de verificación');
        $('#id_nip_digit').focus();
        return false;
    }
    return true;
}

function managerApproveBankStatement(id, reqType) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var msj;
    if (reqType == "Approve")
        msj = "¿Confirma aprobar esta solicitud?";
    else if (reqType == "Reject")
        msj = "¿Confirma rechazar esta solicitud? <br/> Indique el motivo por el cuál se rechaza:";
    else if (reqType == "Undo")
        msj = "¿Confirma reversar esta solicitud? <br/> Indique el motivo por el cuál se reversa:";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    Apprise('close');
                    var url = "/statements/updateManagerBankStatement/" + id + "/";
                    if (reqType == "Undo") {
                        var posting = $.post(url, {reqType: reqType, reversalMotive: e.input});
                    }
                    else if (reqType == "Reject") {
                        var posting = $.post(url, {reqType: reqType, reversalMotive: e.input});
                    }
                    else
                        var posting = $.post(url, {reqType: reqType});
                    posting.done(function (data) {
                        $.loader('close');
                        me.data('Running', false);
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Aceptar',
                                    className: 'blue',
                                    width: 300,
                                    action: function () {
                                        validNavigation = true;
                                        window.location.href = '../statements/listManagerBankStatement/';
                                    }
                                }
                            },
                            override: false,
                        };
                        console.log(data);

                        if (data == "Error") {
                            //Apprise(data, options);
                            $("#id_bStat" + id).replaceWith('<p id="id_bStat' + id + '" style="color:red;font-size:small">Error</p>');
                            $("#id_bAction" + id).replaceWith('<img alt="Error" src="/static/logos/error.svg" width="20" height="20"/>');
                        }
                        else {
                            if (data == "Reversa exitosa") {
                                $("#id_bStat" + id).replaceWith('<p id="id_bStat' + id + '" style="color:blue;font-size:small">Reversado</p>');
                                $("#id_bAction" + id).replaceWith('<div id="id_bAction' + id + '"></div>');
                            }
                            else if (data == "Aprobación exitosa" || data == "Abono exitoso") {
                                $("#id_bStat" + id).replaceWith('<p id="id_bStat' + id + '" style="color:green;font-size:small">Aceptado</p>');
                                $("#id_bAction" + id).replaceWith('<div id="id_bAction' + id + '"><input type="image" alt="Reversar" onclick="managerApproveBankStatement(' +
                                    id + ',\'Undo\')" src="/static/logos/undo.svg" width="20" height="20"/></div>');
                            }
                            else if (data == "Rechazo exitoso") {
                                $("#id_bStat" + id).replaceWith('<p id="id_bStat' + id + '" style="color:red;font-size:small">Rechazado</p>');
                                $("#id_bAction" + id).replaceWith('<div id="id_bAction' + id + '"></div>');
                            }
                        }
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    if ((reqType == "Undo") || (reqType == "Reject"))
        options.input = true;
    Apprise(msj, options);
}

function removeDeviceClient(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                action: function (e) {
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    Apprise('close');
                    var url = "/inventory/removeDeviceClient/" + id + "/";
                    var posting = $.post(url);
                    posting.done(function (data) {
                        me.data('Running', false);
                        $.loader('close');
                        if (data == "Asociación eliminada") {
                            $("#loaned" + id).replaceWith("No");
                            $("#loanaction" + id).replaceWith("--");
                        }
                        Apprise(data);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise('¿Confirma desasociar este dispositivo?', options);
}

function removeLoan(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                action: function (e) {
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    Apprise('close');
                    var url = "/inventory/removeLoan/" + id + "/";
                    var posting = $.post(url);
                    posting.done(function (data) {
                        me.data('Running', false);
                        $.loader('close');
                        if (data == "Comodato eliminado") {
                            $("#com_" + id).fadeOut(200);
                        }
                        Apprise(data);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise('¿Confirma eliminar este comodato?', options);
}

function removeSim(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                action: function (e) {
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    Apprise('close');
                    var url = "/inventory/removeSimCard/" + id + "/";
                    var posting = $.post(url);
                    posting.done(function (data) {
                        me.data('Running', false);
                        $.loader('close');
                        if (data == "Sim eliminada") {
                            $("#sim_" + id).fadeOut(200);
                        }
                        Apprise(data);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise('¿Confirma eliminar esta SimCard?', options);
}

function removeDevice(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                action: function (e) {
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    Apprise('close');
                    var url = "/inventory/removeDevice/" + id + "/";
                    var posting = $.post(url);
                    posting.done(function (data) {
                        me.data('Running', false);
                        $.loader('close');
                        if (data == "Dispositivo eliminado") {
                            $("#dev_" + id).fadeOut(200);
                        }
                        Apprise(data);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise('¿Confirma eliminar este Dispositivo?', options);
}

function dropAutoLoan(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                action: function (e) {
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    Apprise('close');
                    var url = "/dropAutoLoan/" + id + "/";
                    var posting = $.post(url);
                    posting.done(function (data) {
                        me.data('Running', false);
                        $.loader('close');
                        if (data == "Configuración Eliminada") {
                            $("#autoloan" + id).fadeOut(2);
                        }
                        Apprise(data);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise('¿Confirma eliminar esta configuración?', options);
}

function showBankStatementImg(id) {
    $("#id_bZoomImg" + id).dialog(
        {
            width: "auto",
            height: "auto",
            closeText: "",
            create: function (event, ui) {
                // Set maxHeight
                $(this).css("maxHeight", "600px");
            }
        }
    )
}

function showObservations(id) {
    $("#id_bZoomImg" + id).dialog(
        {
            width: "25em",
            height: "auto",
            closeText: ""
        }
    );
}

function showObservationsR(id) {
    $("#id_bZoomImgR" + id).dialog(
        {
            width: "25em",
            height: "auto",
            closeText: ""
        }
    );
}

$("#id_amount").focusout(function () {
    if (this.value <= 0) {
        Apprise("Valor no permitido");
    }
});

// Redirect user to main frontend view after choosing coordinates as second auth method.
$('#coords').click(function (e) {
    e.preventDefault();
    window.open('/coordinates/genCoordinates/');
    setTimeout(function () {
        window.location.href = window.location.href.replace('coordinates/setTwoFactorAuth/', '');
    }, 1500);
});

$('#tree').on('acitree', function (event, api, item, eventName, options) {
    if (eventName == 'checked') {
        $('#tree').before('<input id="id_permissions_' + api.getId(item) + '" name="permissions" type="hidden" value="' + api.getId(item) + '"/>');
        if (api.hasChildren(item, true)) {
            var children = api.children(item, true, true);
            children.each(function () {
                $('#tree').before("<input id=id_permissions_" + api.getId($(this)) + " name='permissions' type='hidden' value='" + api.getId($(this)) + "'/>");
            });
        }
        if (api.hasParent(item)) {
            var parent = api.parent(item);
            var addparent = 0;
            var siblings = api.siblings(item);
            siblings.each(function () {
                if (api.isChecked($(this)))
                    addparent = 1;
            });
            if (api.hasParent(parent)) {
                var granp = api.parent(parent);
                var addgranp = 0;
                siblings = api.siblings(parent);
                siblings.each(function () {
                    if (api.isChecked($(this)))
                        addgranp = 1;
                });
                if (addgranp == 0 && !$('#id_permissions_' + api.getId(granp)).val())
                    $('#tree').before("<input id=id_permissions_" + api.getId(granp) + " name='permissions' type='hidden' value='" + api.getId(granp) + "'/>");
            }
            if (addparent == 0)
                $('#tree').before("<input id=id_permissions_" + api.getId(parent) + " name='permissions' type='hidden' value='" + api.getId(parent) + "'/>");
        }
    }
    if (eventName == 'unchecked') {
        $('#id_permissions_' + api.getId(item)).remove();
        if (api.hasChildren(item, true)) {
            var children = api.children(item, true, true);
            children.each(function (index) {
                $('#id_permissions_' + api.getId($(this))).remove();
            });
        }
        if (api.hasParent(item)) {
            var parent = api.parent(item);
            var siblings = api.siblings(item);
            var delparent = 0;
            siblings.each(function () {
                if (api.isChecked($(this)))
                    delparent = 1;
            });
            if (api.hasParent(parent)) {
                var granp = api.parent(parent);
                var delgranp = 0;
                siblings = api.siblings(parent);
                siblings.each(function () {
                    if (api.isChecked($(this))) {
                        delgranp = 1;
                    }
                });
                if (delgranp == 0 && delparent == 0)
                    $('#id_permissions_' + api.getId(granp)).remove();
            }
            if (delparent == 0)
                $('#id_permissions_' + api.getId(parent)).remove();
        }
    }
});

jQuery.fn.dataTable.Api.register('sum()', function () {
    return this.flatten().reduce(function (a, b) {
        if (typeof a === 'string') {
            a = a.replace(/[^\d.-]/g, '') * 1;
        }
        if (typeof b === 'string') {
            b = b.replace(/[^\d.-]/g, '') * 1;
        }

        return a + b;
    }, 0);
});

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

$('#id_type').change(function () {
    if (this.value == 2) {
        $('#id_fechaIn').val('');
        $('#id_fechaIn').prop('disabled', true);
    }
    else {
        $('#id_fechaIn').prop('disabled', false);
    }
});

function blockuser(id, cascade) {
    var msj;
    if (cascade)
        msj = "¿Confirma bloquear esta jerarquía?";
    else
        msj = "¿Confirma bloquear este cliente?";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var url = "/blockUser/" + id + "/";
                    // Send the data using post
                    var posting = $.post(url, {cascade: cascade});

                    // Put the results in a div
                    posting.done(function (data) {
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Aceptar',
                                    className: 'blue',
                                    width: 300,
                                    action: function () {
                                        validNavigation = true;
                                        window.location.href = '../listUser/';
                                    }
                                }
                            },
                            override: false
                        };
                        $.loader('close');
                        Apprise(data, options);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise(msj, options);
}

function unblockuser(id, cascade) {
    var msj;
    if (cascade)
        msj = "¿Confirma desbloquear esta jerarquía?";
    else
        msj = "¿Confirma desbloquear este cliente?";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var url = "/unblockUser/" + id + "/";
                    // Send the data using post
                    var posting = $.post(url, {cascade: cascade});

                    // Put the results in a div
                    posting.done(function (data) {
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Aceptar',
                                    className: 'blue',
                                    width: 300,
                                    action: function () {
                                        validNavigation = true;
                                        window.location.href = '../listUser/';
                                    }
                                }
                            },
                            override: false
                        };
                        $.loader('close');
                        Apprise(data, options);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise(msj, options);
}

function resetp(id) {
    var msj;
    msj = "¿Confirma re-asignar constraseña a este cliente?";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var url = "/hash_renew_req/" + id + "/";
                    // Send the data using post
                    var posting = $.post(url, {pk: id});

                    // Put the results in a div
                    posting.done(function (data) {
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Aceptar',
                                    className: 'blue',
                                    width: 300,
                                    action: function () {
                                        validNavigation = true;
                                        window.location.href = '../listUser/';
                                    }
                                }
                            },
                            override: false
                        };
                        $.loader('close');
                        Apprise(data, options);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise(msj, options);
}

function axcPointPriceEnableToggled(id) {
    var url = "/axesoCashPriceEnableToggled/" + id + "/";
    // Send the data using post
    var posting = $.post(url, {pk: id});

    // Put the results in a div
    posting.done(function (data) {
        if (data == 0) {
            if ($('#id_pointPrice' + id).attr('checked')) {
                $('#id_pointPrice' + id).removeAttr('checked');
            }
            else {
                $('#id_pointPrice' + id).attr('checked', true)
            }
        }
        else {
            if ($('#id_pointPrice' + id).attr('checked')) {
                $('#id_pointPrice' + id).attr('checked', true)
            }
            else {
                $('#id_pointPrice' + id).removeAttr('checked');
            }
        }
    });
}

function queryTopup(id) {
    $.loader({
        className: "imgloader",
        content: '<br/>Procesando'
    });

    var url = "/queryTopup/" + id + "/";
    // Send the data using post
    var posting = $.post(url, {pk: id});

    // Put the results in a div
    posting.done(function (data) {
        var res = data.split(" + ");
        $.loader('close');
        Apprise(res[0] + " " + res[1] + " " + res[2]);
    });
}

function topupLayout() {
    $("#paquetigoSelect").hide();
    $("#id_points").attr('disabled', 'disabled');
    $("#pinSelect").hide();
    $("#id_claroCode").attr('disabled', 'disabled');
    $("#paqueclaroSelect").hide();
    $("#id_virginCode").attr('disabled', 'disabled');
    $("#paquevirginSelect").hide();
    $("#sipmovilSelect").hide();
    $("#conectameSelect").hide();
    $("#conectameSelect").hide();
    $("#avantelpSelect").hide();
    $("#etbpSelect").hide();
    $("#movistarpSelect").hide();

    $("#id_amount").removeAttr('disabled', 'disabled');
    $("#id_amount").show();
    $("#topupVal").show();
    $("#id_serviceNumber").removeAttr('disabled', 'disabled');
    $("#numbers").show();
    $("#id_serviceNumber").attr('maxlength', '10');
}

function markAllNotificationsAsRead() {
    var url = "/notifications/archive/";
    var posting = $.post(url, {});

    // Put the results in a div
    posting.done(function (data) {
        if (data == 0) {
            $('#unread-notifications-list').find('tbody > tr').fadeOut("fast");
            $('#notifications-button').removeClass('olink menu-button-new hide-on-mobile').addClass('olink menu-button hide-on-mobile');
        }
    });
}

function markNotificationAsRead(id) {
    var url = "/notifications/mark-as-read/";
    var posting = $.post(url, {id: id});
}

$('#overlay').click(function () {
    $.sidr('close', 'sidr');
});

function print_receipt(transaction_id) {

    // var posting = $.post('/api/pos-receipt2/', {transaction_id: transaction_id});
    //
    // // Put the results in a div
    // posting.done(function (data) {
    //     $.loader('close');
    //     var blob = new Blob([data]);
    //     var a = document.createElement('a');
    //     var url = window.URL.createObjectURL(blob);
    //     a.href = url;
    //     a.download = transaction_id + ".pdf";
    //     document.body.append(a);
    //     a.click();
    //     a.remove();
    //     window.URL.revokeObjectURL(url);
    // });
    validNavigation = true;
    location.href = '/api/pos-receipt/' + transaction_id
}



function createMatchBrequest(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var msj;
    msj = "¿Confirma pagar este préstamo con reversión de saldo?";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var url = "/reverseMatchBrequest/" + id + "/";
                    // Send the data using post
                    var posting = $.post(url, {id: id});

                    // Put the results in a div
                    posting.done(function (data) {
                        $.loader('close');
                        me.data('Running', false);
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Aceptar',
                                    className: 'blue',
                                    width: 300,
                                    action: function () {
                                        validNavigation = true;
                                        window.location.href = '../listMatchBrequest/';
                                    }
                                }
                            },
                            override: false
                        };
                        Apprise(data, options);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise(msj, options);
}

function createMatchBrequestPost(id) {
    var me = $(this);
    if (me.data('Running'))
        return;
    me.data('Running', true);
    var msj;
    msj = "¿Confirma pagar este préstamo con reversión de saldo?";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var url = "/reverseMatchBrequestPost/" + id + "/";
                    // Send the data using post
                    var posting = $.post(url, {id: id});

                    // Put the results in a div
                    posting.done(function (data) {
                        $.loader('close');
                        me.data('Running', false);
                        var options = {
                            buttons: {
                                confirm: {
                                    text: 'Aceptar',
                                    className: 'blue',
                                    width: 300,
                                    action: function () {
                                        validNavigation = true;
                                        window.location.href = '../listMatchBrequestPost/';
                                    }
                                }
                            },
                            override: false
                        };
                        Apprise(data, options);
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    me.data('Running', false);
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise(msj, options);
}


function matchConciliations(ufs_id, ubs_id) {
    $.post("/conciliations/manualConciliation/", {
        ufs_id: ufs_id,
        ubs_id: ubs_id,
        operation: 'conciliar'
    }).done(
        function (data) {
            if (data == 0) {
                var ufs_id_selector = 'ufs_' + ufs_id;
                var ubs_id_selector = 'ubs_' + ubs_id;

                $('tr[name=' + ubs_id_selector + ']').fadeOut("fast");
                $('tr[name=' + ufs_id_selector + ']').fadeOut("fast");
            }
            else {
                Apprise('Error al conciliar');
            }
        });
}


function desconciliar(mbs_pk) {
    $.ajax({
        type: 'DELETE',
        url: '/conciliations/listConciliations/',
        data: {pk: mbs_pk},
        success: function (result) {
            if (result == 0) {
                Apprise('Desconciliado exitosamente!');
            }
            else {
                Apprise('No se pudo desconciliar.');
            }
        }
    });
}

function desetiquetar(fs_id, type) {
    $.ajax({
        type: 'DELETE',
        url: '/conciliations/listLabeled/',
        data: {pk: fs_id, type: type},
        success: function (result) {
            if (result == 0) {
                Apprise('Etiqueta liberada. Ya puede recargar la página.');
            }
            else {
                Apprise('No se pudo des-etiquetar.');
            }
        }
    });
}

function setConciliationLabel(ufs_id, ubs_id, label_id) {
    $.post("/conciliations/manualConciliation/", {
        ufs_id: ufs_id,
        ubs_id: ubs_id,
        label_id: label_id,
        operation: 'etiquetar'
    }).done(
        function (data) {
            if (data == 0) {
                var ufs_id_selector = 'ufs_' + ufs_id;
                var ubs_id_selector = 'ubs_' + ubs_id;

                $('tr[name=' + ufs_id_selector + ']').fadeOut("fast");
                $('tr[name=' + ubs_id_selector + ']').fadeOut("fast");

                Apprise('Etiqueta aplicada!');
            }
            else if (data == 1) {
                Apprise('Error al etiquetar.');
            }
            else if (data == 2) {
                Apprise('Etiqueta mal configurada');
            }
        });
}

function conciliationLabelToggle(id) {
    var url = "/conciliations/conciliationLabelToggle/" + id + "/";
    // Send the data using post
    var posting = $.post(url, {pk: id});

    // Put the results in a div
    posting.done(function (data) {
        if (data == 0) {
            if ($('#id_bankAccount' + id).attr('checked')) {
                $('#id_bankAccount' + id).removeAttr('checked');
            }
            else {
                $('#id_bankAccount' + id).attr('checked', true)
            }
        }
        else {
            if ($('#id_bankAccount' + id).attr('checked')) {
                $('#id_bankAccount' + id).attr('checked', true)
            }
            else {
                $('#id_bankAccount' + id).removeAttr('checked');
            }
        }
    });
}

function deleteConciliationGroup(group_hex) {
    var msj;
    msj = "¿Confirma el borrado de todas las conciliaciones asociadas a este grupo?";

    var options = {
        input: false,
        buttons: {
            confirm: {
                text: 'Aceptar',
                className: 'blue',
                width: 200,
                action: function (e) {
                    Apprise('close');
                    $.loader({
                        className: "imgloader",
                        content: '<br/>Procesando'
                    });
                    var url = "/conciliations/deleteConciliationGroup/";
                    // Send the data using post
                    var posting = $.post(url, {group_hex: group_hex});

                    // Put the results in a div
                    posting.done(function (data) {
                        $.loader('close');

                        if (data == 0) {
                            Apprise('Grupo eliminado. Puede recargar la página.');
                        }
                        else {
                            Apprise('Error al eliminar el grupo.');
                        }
                    });
                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    Apprise('close');
                }
            }
        },
        override: true
    };
    Apprise(msj, options);
}

$('.datepicker').on('click', function (e) {
    e.preventDefault();
    $(this).attr("autocomplete", "off");
});