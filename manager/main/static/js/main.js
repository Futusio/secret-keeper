class Validator {

    pipeline(method, data) {
        // Method recived a method and data and calls validation for data
    }

    group(data){
        var name = data['name']
        if(name.length < 3){
            showMessage("Минимальная длина названия - 3 символа")
        } else if(name.length > 20) {
            showMessage("Максимальная длина названия - 20 символов")
        } else if(!/^[a-zа-яА-ЯA-Z0-9\s]+$/.test(name)) {
            showMessage("Название должно состоять только из букв, цифр и пробела")
        } else {
            return true
        }
        return false
    }

    account(data){
        // Name
        var name = data['name']
        if(name.length < 3){
            showMessage("Минимальная длина названия - 3 символа")
            return false
        } else if(name.length > 16){
            showMessage("Максимальная длина названия - 16 символов")
            return false
        } else if(!/^[a-zа-яА-ЯA-Z0-9\s]+$/.test(name)){
            showMessage("Строка должна состоять только из букв, цифр и пробела")
            return false
        }
        // Login not check
        // Password
        // Policy
        // Url
        var url = data['url']
        if(url.length > 0 && !/^((ftp|http|https):\/\/)|^(www\.)([A-z]+)\.([A-z]{2,})/.test(url)){
            showMessage("Введите корректный URL")
            return false
        }
        // Description


        return true
    }

    masterKey(data){
        Nan
    }
}

const validator = new Validator()


function showMessage(text){
    $('#message_text').text(text)
    if($('#popup_z').is(":visible")){
        console.log(("I m here"))
        $('#popup-message').fadeIn(300).delay(500).fadeOut(300)
        $('#popup_z').delay(600).fadeOut(400)
    } else {
        $('#popup_z').fadeIn(300).delay(600).fadeOut(300)
        $('#popup-message').fadeIn(300).delay(500).fadeOut(300)
    }

}


function cleanUp(){
    // Function close all popUps and clear their fields
    $('.popup').fadeOut(200).after(function(e){
        $('#popup').fadeOut(300).after(function(e){
            $('input').not("input[name=csrfmiddlewaretoken]").val('')
            $('textarea').val('')
        })
    })
}

// AJAX

function getOldAccounts() {
    $.ajax({
        method: 'POST',
        url: '/api/old-accounts',
        success: function (response) {
            if(response['status'] == 'success') {
                $('#nots').html('')
                for(account of response['accounts']){
                    $('#nots').append(`
                    <li>Истекает срок действия пароля от аккаунта 
                    <span class='left_time' attempt-id='${account['id']}'>${account['name']}</span><br> 
                    Дней осталось: ${account['days']}</li>
                    `)
                }
            } else {
                showMessage('Неизвестная ошибка')
            }
        },
        error: function (e) {
            showMessage('Неизвестная ошибка')
        }
    })
}

function addGroup() {
    // Functions to create a new group
    var val = $('#new_group').val()
    if(!validator.group({'name': val})){
        return NaN
    }
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


function delGroup(id) {
    // function to del group by name 
    $.ajax({
        method: 'POST',
        url: '/api/del-group',
        data: {id: id},
        success: function (response) {
            if(response['status'] == 'success') {
                showMessage('Группа успешно удалена')
                $('#screen').html('')
                $(`[group-id=${id}]`).remove()
                getOldAccounts()
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
        'login': CryptoJS.AES.encrypt($('#account_login').val(), master_key).toString(),
        'password': CryptoJS.AES.encrypt($('#account_password').val(), master_key).toString(),
        'url': $('#account_url').val(),
        'description': $('#account_description').val(),
    }

    if(!validator.account(data)){
        return NaN
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
                if(account.description == "") {
                    var description = 'Для данного аккаунта описание отсутствует'
                } else {
                    var description = account['description']
                }
                $('#screen').append(`
                <div class='min-account' account-id=${account.id}>
                    <div class='name'>${account.name}</div>
                    <div class='description' align='center'>${description}</div>
                    <div class='click'>открыть</div>
                </div>   
                `)
                getOldAccounts()
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
                var account = response['account']
                $('#popup').fadeIn(300)
                $('#popup_account_show').fadeIn(300)
                $('#account_name_show').val(account.name)
                $('#account_login_show').val(CryptoJS.AES.decrypt(account.login, master_key).toString(CryptoJS.enc.Utf8)),
                $('#account_password_show').val(CryptoJS.AES.decrypt(account.password, master_key).toString(CryptoJS.enc.Utf8))
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


function delAccount(id) {
    // Functions make a request to get all accounts of some group
    $.ajax({
        method: 'POST',
        url: '/api/del-account',
        data: {'account_id': id},
        success: function (response) {
            if(response['status'] == 'success') {
                cleanUp()
                showMessage('Аккаунт успешно удален')
                $(`[account-id=${id}]`).remove()
                getOldAccounts()
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


function updAccount(accountId) {
    var status = $('#account_password_show').val() == $('#account_password_upd').val()
    var data = {
        'account_id': accountId,
        'name': $('#account_name_upd').val(),
        'login': CryptoJS.AES.encrypt($('#account_login_upd').val(), master_key).toString(),
        'password': CryptoJS.AES.encrypt($('#account_password_upd').val(), master_key).toString(),
        'url': $('#account_url_upd').val(),
        'description': $('#account_description_upd').val(),
        'status': status,
    }
    console.log('status is, ', status)

    $.ajax({
        method: 'POST',
        url: '/api/upd-account',
        data: data,
        success: function (response) {
            if(response['status'] == 'success') {
                showMessage('Аккаунт успешно обновлен')
                cleanUp()
                var account = response['account']
                if(account.description == "") {
                    var description = 'Для данного аккаунта описание отсутствует'
                } else {
                    var description = account['description']
                }
                $(`[account-id=${account.id}]`).html(`
                    <div class='name'>${account.name}</div>
                    <div class='description' align='center'>${description}</div>
                    <div class='click'>открыть</div>
                `)
                getOldAccounts()
            } else {
                showMessage('Неизвестная ошибка')
            }
        },
        error: function (e) {
            showMessage('Неизвестная ошибка')
        }
    })
}


function setMasterKey() {
    // Functions make a request to get all accounts of some group
    master_key = CryptoJS.SHA256($('#master_key').val()).toString()
    $.ajax({
        method: 'POST',
        url: '/api/set-master',
        data: {'key': master_key},
        success: function (response) {
            if(response['status'] == 'success') {
                cleanUp()
                showMessage('Мастер-ключ успешно установлен')
            } else {
                showMessage('Какая-то хуйня на сервере произошла')
            }
        },
        error: function (e) {
            showMessage('Сервер не смог вернуть ответ')
        }
    })

}


function checkMasterKey() {
    // Functions make a request to get all accounts of some group
    master_key = CryptoJS.SHA256($('#master_key').val()).toString()
    $.ajax({
        method: 'POST',
        url: '/api/check-master',
        data: {'key': master_key},
        success: function (response) {
            if(response['status'] == 'success') {
                cleanUp()
                showMessage('Проверка успешно пройдена')
            } else {
                masterKeyAttempt += 1
                if(masterKeyAttempt < 3){
                    showMessage(`Неправильный мастер-ключ. Попыток: ${masterKeyAttempt}/3`)
                } else {
                    document.location.href = `http://${window.location.hostname}:8000/logout`
                }
            }
        },
        error: function (e) {
            showMessage('Сервер не смог вернуть ответ')
        }
    })
}

