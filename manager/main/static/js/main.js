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

function showConfirm(text) {
    $('#confirm_text').text(text)
    $('#popup_z').fadeIn(300)
    $('#popup-confirm').fadeIn(400)
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
                    <div class="group" group-id=${response.id}>${val}</div>
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
    var id = $(e.target).parent().parent().attr('group-id')
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
    // Function built all accounts of the group by id
    $.ajax({
        method: 'POST',
        url: '/api/get-accounts',
        data: {'group_id': id},
        success: function (response) {
            if(response['status'] == 'success') {
                $('#screen').html('')
                for(id of Object.keys(response['accounts'])){
                    var account = response.accounts[id]
                    if (account.description == ''){
                        var text = "Для данного аккаунта описание отсутствует"
                    } else {
                        var text = account.description
                    }
                    $('#screen').append(`
                    <div class='min-account' account-id=${id}>
                        <div class='name'>${account.name}</div>
                        <div class='description' align='center'>${text}</div>
                        <div class='click'>открыть</div>
                    </div>   
                    `)
                }
            } else {
                showMessage('Ошибка получения аккаунтов группы')
            }
        },
        error: function (e) {
            showMessage('Сервер не смог вернуть ответ')
        }
    })
}


function addAccount() {
    // Functions make a request to get all accounts of some group
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
                var account = response['account']
                $('#screen').append(`
                <div class='min-account' account-id=${account.id}>
                    <div class='name'>${account.name}</div>
                    <div class='description' align='center'>${account.description}</div>
                    <div class='click'>открыть</div>
                </div>   
                `)
            } else {
                showMessage('Неизвестная ошибка')
            }
        },
        error: function (e) {
            showMessage('Неизвестная ошибка')
        }
    })
}


function getAccount(id) {
    // Functions make a request to get all accounts of some group
    $.ajax({
        method: 'POST',
        url: '/api/get-account',
        data: {'account_id': id},
        success: function (response) {
            if(response['status'] == 'success') {
                console.log("A ME HRER")
                var account = response['account']
                console.log(account.name)
                $('#account_name_show').val(account.name)
                $('#account_login_show').val(account.login)
                $('#account_password_show').val(account.password)
                $('#account_url_show').val(account.url)
                $('#account_description_show').val(account.description)

            } else {
                showMessage('Ошибка получения информации об аккаунте')
                cleanUp()
            }
        },
        error: function (e) {
            showMessage('Сервер не смог вернуть ответ')
            cleanUp()
        }
    })
}


function delAccount(e) {
    // Functions make a request to get all accounts of some group

    // After okno
    $.ajax({
        method: 'POST',
        url: '/api/del-account',
        data: {'account_id': accountId},
        success: function (response) {
            if(response['status'] == 'success') {
                var account = response['account']
                console.log(account.name)
                $('#account_name_show').val(account.name)
                $('#account_login_show').val(account.login)
                $('#account_password_show').val(account.password)
                $('#account_url_show').val(account.url)
                $('#account_description_show').val(account.description)

            } else {
                showMessage('Ошибка получения информации об аккаунте')
                cleanUp()
            }
        },
        error: function (e) {
            showMessage('Сервер не смог вернуть ответ')
            cleanUp()
        }
    })
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

