        // Set CSRF Token
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        
        $(document).ready(function () {
            // CSRF Token
            csrftoken = $("input[name=csrfmiddlewaretoken]").attr("value")
            policy = $('#policy').text()
            min_p = $('#policy').attr('min-length')
            max_p = $('#policy').attr('max-length')

            $.ajaxSetup({
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
            // Master Key logic
            var condition = ($("#master_key_status").attr('status') == 'True' ? false : true)
            if(condition){
                showAlert(`
                <p style="margin: 0; margin-bottom: 7px;">Необходимо установить мастер-ключ</p>
                <small style="font-size: 8pt; color:gray;"'>Его нельзя будет изменить или восстановить</small>`)
            } else {
                masterKeyAttempt = 0
                showAlert(`
                <p style="margin: 0; margin-bottom: 7px;">Необходимо подтвердить мастер-ключ</p>
                <small style="font-size: 8pt; color:gray;"'>У вас будет три попытки</small>`)
            }


        });

        function showMasterKey() {
            $('#popup_z').fadeOut(300)
            $('#popup-alert').fadeOut(200)
            var condition = ($("#master_key_status").attr('status') == 'True' ? false : true)
            if(condition) {
                $('#master_key_button').html('Создать')
                $('#master_key_button').bind('click', setMasterKey)
                $('#popup').fadeIn(300)
                $('#popup_key').fadeIn(300)
            } else {
                $('#master_key_button').html('Подтвердить')
                $('#master_key_button').bind('click', checkMasterKey)
                $('#popup').fadeIn(300)
                $('#popup_key').fadeIn(300)
            }
        }

        // Next part
        // Close popul if click ovveride
        $(document).on('click', '#popup', function (e) {
            if($('#popup_key').is(":visible")) return NaN;
            if (!$(e.target).closest(".popup").length) {
                cleanUp()
            }
        })
        // Or if click Escape
        $(document).keyup(function (e) {
            if($('#popup_key').is(":visible")) return NaN;
            if (e.keyCode == 27 && $('.popup').is(":visible") && !$('#popup_z').is(":visible")) {
                cleanUp()
            }
        })

        function copytext(el) {
            var $tmp = $("<textarea>");
            $("body").append($tmp);
            $tmp.val($(el).val()).select();
            document.execCommand("copy");
            $tmp.remove();
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
          }

        function generate() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()№;%:?*.,";
            while(text.length < getRandomInt(min_p, max_p)){
                var chr = possible.charAt(Math.floor(Math.random() * possible.length))
                text += chr
            }
            return text;
        }

        $(document).on('dblclick', '#account_password_show', function(e){
            copytext('#account_password_show')
            showMessage('Пароль скопирован в буфер обмена')
        })

        $(document).on('dblclick', '#account_password', function(e){
            $('#account_password').val(generate())
        })

        $(document).on('dblclick', '#account_password_upd', function(e){
            $('#account_password_upd').val(generate())
        })
        

        $(document).on('click', '#end', function (e) {
            $('#popup').fadeIn(300)
            $('#popup_group').fadeIn(300)
        })

        $(document).on('click', '.add-account', function (e) {
            group_id = $(e.target).parent().parent().attr('group-id')
            $('#popup').fadeIn(300)
            $('#popup_account').fadeIn(300)
        })

        $(document).on('click', '.group', function (e) {
            if (!$(e.target).hasClass('group')) return NaN
            $('div').removeClass('selected-group')
            $('.actions').remove()
            $(e.target).addClass('selected-group')
            $(e.target).append(`
                <div class='actions'>
                    <span class='sidebar-action add-account'>+</span>
                    <span class='sidebar-action del-group'>х</span>
                </div>
            `)
            // Get Accounts to the group
            var id = $(e.target).attr('group-id')
            accounts = getAccounts(id)
        })

        $(document).on('click', '.click', function (e) {
            // Show the account 
            var accountId = $(e.target).parent().attr('account-id')
            $('#popup_account_show').attr('account-id-show', accountId)
            getAccount(accountId)
        })

        $(document).on('click', '.left_time', function (e) {
            // Show the account 
            var accountId = $(e.target).attr('attempt-id')
            console.log(accountId)
            $('#popup_account_show').attr('account-id-show', accountId)
            getAccount(accountId)
        })
        // Hello
        $(document).on('click', '.del-group', function (e) {
            var groupId = $(e.target).parent().parent().attr('group-id')
            $('#confirm_yes').attr('data-target', 'group')
            $('#confirm_yes').attr('data-id', groupId)
            showConfirm(`<p style="margin: 0; margin-bottom: 7px;">Вы уверены, что хотите удалить группу?</p><small style="font-size: 8pt; color:gray;"'>Все аккаунты группы так же будут удалены</small>`)
        })

        function deleteAccount(e) {
            var accountId = $('#del-account').parent().parent().attr('account-id-show')
            $('#confirm_yes').attr('data-target', 'account')
            $('#confirm_yes').attr('data-id', accountId)
            showConfirm(`<p style="margin: 0; margin-bottom: 7px;">Вы уверены, что хотите удалить аккаунт?</p><small style="font-size: 8pt; color:gray;"'>Данные невозможно будет восстановит</small>`)
        }

        function updateAccount(e) {
            var accountId = $('#update_account').parent().parent().attr('account-id-show')
            console.log("Account id is: ", accountId)
            $('#popup_account_show').hide()
            $('#popup_account_update').show()
            // Nex
            $('#account_name_upd').val($('#account_name_show').val())
            $('#account_login_upd').val( $('#account_login_show').val())
            $('#account_password_upd').val($('#account_password_show').val())
            $('#account_url_upd').val($('#account_url_show').val())
            $('#account_description_upd').val($('#account_description_show').val())
            $('#popup_account_update').attr('account-id-upd', accountId)
        }

        $(document).on('click', '#upd_account', function(e){
            var accountId = $('#upd_account').parent().parent().attr('account-id-upd')
            updAccount(accountId)
        })

        function showConfirm(text, $true, e) {
            $('#confirm_text').html(text)
            $('#popup_z').fadeIn(300)
            $('#popup-confirm').fadeIn(400)
        }

        function showAlert(text, $true, e) {
            $('#alert_text').html(text)
            $('#popup_z').fadeIn(300)
            $('#popup-alert').fadeIn(400)
        }
        
        $(document).on('click', '#confirm_no', function () {
                $('#popup_z').fadeOut(300)
                $('#popup-confirm').fadeOut(200)
        })

        $(document).on('click', '#confirm_yes', function() {
            if($('#confirm_yes').attr('data-target') == 'group'){
                // Delete Group
                var id = $('#confirm_yes').attr('data-id')
                delGroup(id)
                $('#popup-confirm').fadeOut(200)
            } else if($('#confirm_yes').attr('data-target') == 'account') {
                // Delete Account
                var id = $('#confirm_yes').attr('data-id')
                delAccount(id)
                $('#popup-confirm').fadeOut(200)
            } else {
                console.log('No choosen')
            }
        })