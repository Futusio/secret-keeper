class Validator {

    pipeline(method, data) {
        // Method recived a method and data and calls validation for data
        NaN
    }

    group(data){
        Nan
    }

    account(data){
        Nan
    }

    masterKey(data){
        Nan
    }
}

function showMessage(text){
    $('#message_text').text(text)
    $('#popup_z').fadeIn(300).delay(600).fadeOut(300)
    $('#popup-message').fadeIn(300).delay(500).fadeOut(300)
}

function cleanUp(){
    // Function close all popUps and clear their fields
    $('input').val('')
    $('textare').val('')
    $('.popup').fadeOut(200).after(function(e){
        $('#popup').fadeOut(300)
    })
}

// AJAX
function getGroups() {
    // Functions returns list of groups 

}

function addGroup() {
    // Functions to create a new group
    var val = $('#new_group').val()
    $.ajax({
        method: 'POST',
        url: '/api/new-group',
        data: {name: val},
        success: function (response) {
            if(response['status'] == 'success') {
                showMessage('Новая группа успешно создана')
                cleanUp()
                $('#group-list').append(`
                    <li class="group" id=${response.id}>${val}</li>
                `)
            } else {
                showMessage('Неизвестная ошибка')
                $('#new_group').val('')
                $('button').blur() // TODO почему не сбрасывается фокус
            }
        },
        error: function (e) {
            showMessage('Неизвестная ошибка')
        }
    })
}

function delGroup(e) {
    // function to del group by name 
    var id = $(e.target).parent().parent().attr('id')
    $.ajax({
        method: 'POST',
        url: '/api/del-group',
        data: {id: id},
        success: function (response) {
            if(response['status'] == 'success') {
                showMessage('Группа успешно удалена')
                $(e.target).parent().parent().remove()
            } else {
                showMessage('Неизвестная ошибка')
            }
        },
        error: function (e) {
            showMessage('Неизвестная ошибка')
        }
    })
}

function getAccounts(id) {
    // 
    $.ajax({
        method: 'POST',
        url: '/api/get-accounts',
        data: data,
        success: function (response) {
            if(response['status'] == 'success') {
                showMessage('Аккаунт успешно создан')
                cleanUp()
            } else {
                showMessage('Ошибка получения аккаунтов группы')
            }
        },
        error: function (e) {
            showMessage('Ошибка получения аккаунтов группы')
        }
    })
}

function addAccount() {
    // Functions make a request to get all accounts of some group
    // var id = $(e.target).parent().parent().attr('id')

    var data = {
        'group_id': group_id,
        'name': $('#account_name').val(),
        'login': $('#account_login').val(),
        'password': $('#account_password').val(),
        'url': $('#account_url').val(),
        'description': $('#account_description').val(),
    }

    $.ajax({
        method: 'POST',
        url: '/api/add-account',
        data: data,
        success: function (response) {
            if(response['status'] == 'success') {
                showMessage('Аккаунт успешно создан')
                cleanUp()
            } else {
                showMessage('Неизвестная ошибка')
            }
        },
        error: function (e) {
            showMessage('Неизвестная ошибка')
        }
    })

}

function getAccount() {
    // Functions make a request to get all accounts of some group

}

function delAccount() {
    // Functions make a request to get all accounts of some group

}

function updateAccount() {
    // Functions make a request to get all accounts of some group

}

function setMasterKey() {
    // Functions make a request to get all accounts of some group

}

function checkMasterKey() {
    // Functions make a request to get all accounts of some group

}

