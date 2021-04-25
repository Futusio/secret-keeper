function validation() {
    return true
}

function showMessage(text){
    $('#message_text').text(text)
    $('#popup_z').fadeIn(300).delay(600).fadeOut(300)
    $('#popup-message').fadeIn(300).delay(500).fadeOut(300)
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
                $('#popup').fadeOut(300)
                $('#new_group').val('')
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

function getAccounts() {
    // 

}

function addAccount() {
    // Functions make a request to get all accounts of some group

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

