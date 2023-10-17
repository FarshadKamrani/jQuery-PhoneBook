$(document).ready(function () {

    $(".addcontact > button").click(function () {
        $(".addcontact").next().toggle();
    });

    $(".myform > form").submit(function (event) {
        event.preventDefault();
        let nameVal = $("#name").val();
        let numberVal = $("#phoneNumber").val();
        if (nameVal === "") {
            return errorResult("Please Fill the name field!");
        }
        if (numberVal === "") {
            return errorResult("Please Fill the number field!")
        }
        if (localStorage.getItem('phonebook')) {
            let data = localStorage.getItem('phonebook');
            data = JSON.parse(data);
            if (data[numberVal]) {
                return errorResult("number exist!")
            }
        }
        createContactList(nameVal, numberVal);
        appendToLocalStorage('phonebook', numberVal, nameVal, numberVal)
    });


    function createContactList(name, number) {
        let el = `
        <div class="col-12 col-md-6 offset-md-3">
                    <div class="contact-body bg-body-tertiary">
                        <div class="contact-info">
                            <span class="contact-name">${name}</span>
                            <div class="contact-number">${number}</div>
                        </div>
                        <div class="contact-icon" data-name="${number}">
                            <a href="tel:${number}" class="text-decoration-none text-success-emphasis">
                                <i class="fas fa-phone fa-lg"></i>
                            </a>
                            <i class="fas fa-edit fa-lg text-secondary-emphasis"></i>
                            <i class="fas fa-trash fa-lg text-danger" ></i>
                        </div>
                    </div>
                </div>
                `;
        $(".contact-list").append(el);

    };

    $(document).on("click", ".fa-trash", function () {
        $(this).parentsUntil(`div.contact-list`).remove();
        let removekey = $(this).parent().data("name");
        popFromLocalStorage('phonebook', removekey)
    });

    $(document).on("click", ".fa-edit", function () {
        let contactInfoDiv = $(this).parent().siblings();
        let nameElement = $(this).parent().siblings().children(".contact-name");
        let numberElement = $(this).parent().siblings().children(".contact-number");
        let nameElementValue = $(nameElement).text();
        let numberElementValue = $(numberElement).text();
        $(contactInfoDiv).html(
            `<form class="edit-contact">
                <input type="text" name="name" id="name" value="${nameElementValue}" class="form-control form-control-lg mb-2"
                    placeholder="Name">
                <input type="text" name="phoneNumber" id="phoneNumber" value="${numberElementValue}" class="form-control form-control-lg"
                    placeholder="Phone Number">
                <input type="hidden" name="oldNumber" id="oldNumber" value="${numberElementValue}">
                    <button type="submit" class="btn btn-success d-none"> Add Contact </button>
            </form>`);
    });
    $(document).on("submit", ".edit-contact", function (e) {
        e.preventDefault();
        let newNameVal = $(this).children("#name").val();
        let newNumberVal = $(this).children("#phoneNumber").val();
        let oldNumberVal = $(this).children("#oldNumber").val();
        console.log(newNumberVal);
        console.log(oldNumberVal);
        $(this).parent().html(
            `<span class="contact-name">${newNameVal}</span>
            <div class="contact-number">${newNumberVal}</div>
            `);

        if (localStorage.getItem('phonebook')) {
            let data = localStorage.getItem('phonebook');
            data = JSON.parse(data);
            if (data[oldNumberVal]) {
                delete data[oldNumberVal]
            }
            data[newNumberVal] = {
                name: newNameVal,
                phoneNumber: newNumberVal,
            };
            data = JSON.stringify(data);
            localStorage.setItem('phonebook', data);
        }
    });

    function errorResult(text) {
        $(".alert").removeClass("d-none");
        $(".alert").text(text);
        setTimeout(function () {
            $(".alert").addClass("d-none");
        }, 5000)

    };

    function appendToLocalStorage(itemName, newKey, name, number) {
        let data
        if (localStorage.getItem(itemName)) {
            data = localStorage.getItem(itemName);
            data = JSON.parse(data);
        } else {
            data = {};
        }
        data[newKey] = {
            name: name,
            phoneNumber: number,
        };
        data = JSON.stringify(data);
        localStorage.setItem(itemName, data);
    };

    function popFromLocalStorage(itemName, keyToRemove) {
        let data
        if (localStorage.getItem(itemName)) {
            data = localStorage.getItem(itemName);
            data = JSON.parse(data);
            delete data[keyToRemove]
            data = JSON.stringify(data);
            localStorage.setItem(itemName, data);
        }
    };

    if (localStorage.getItem('phonebook')) {
        let data = localStorage.getItem('phonebook');
        data = JSON.parse(data);
        Object.keys(data).forEach(key => {
            createContactList(data[key]["name"], data[key]["phoneNumber"])
        });
    };
});