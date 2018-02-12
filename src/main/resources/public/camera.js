$(document).ready (function () {
    const result = document.getElementById("result");
    const url = "http://localhost:8080/cameras";
    var globalLens;
    var globalMP;
    let r;
    function showAll() {
        $.getJSON(url,
            function (response, status) {
                if(status === "success") {
                    r = "";
                    $.each(response, function (i, s) {
                        r += `
                            <div class='row mt-1'>
                                <div id='lens${i}' class='col-md-2'> 
                                    ${s.lens}
                                </div>
                                <div id='mp${i}' class='col-md-2'>
                                    megapixels: ${s.aantalMP}
                                </div>
                                <div class='col-md-1'>
                                    <button type='button' id='del' data-cameraDelete='${s.id}' class='btn btn-danger'>-</button>
                                </div>
                                <div class='col-md-1'>
                                    <button type='button' id='update' data-cameraUpdate='${s.id}' class='btn btn-danger'>update</button>
                                </div>
                            </div>`;
                    });
                    $("#result").html(r);
                }
            }
        );
    }
    $("#search_all").click(function() {
        showAll();
        console.log("test search all");
    });
    $("#add").click(function() {
        console.log("test add");
        $("#result").html("");
        r = "";
        r = `
            <div class="form-group col-md-4 mt-5">
                <input type="text" class="form-control" id="lens" placeholder="lens ...">
            </div>
            <div class="form-group col-md-4">
                <input type="text" class="form-control" id="aantalMP" placeholder="amount of megapixels ...">
            </div>
            <div class="form-group col-md-1">
                <button type="button" id="addbtn" class="btn btn-primary">Submit</button>
            </div>
            `;
        $("#result").html(r);
    });
    $("#result" ).on( "click", "#addbtn", function() {
        let lens = document.getElementById("lens").value;
        let aantalMP = document.getElementById("aantalMP").value;
        let newCamera = JSON.stringify({
            "lens" : lens,
            "aantalMP" : aantalMP
        });
        console.log(newCamera);
        $.ajax({
            type: "POST",
            url: url,
            data: newCamera,
            dataType: "text",
            contentType: "application/json",
            success: function () {
                alert("Camera has been added");
                showAll();
            },
            error: function () {
                alert("Camera could not be added");
            }
        });
    });
    $("#result" ).on( "click", "#del", "cameraDelete", function(e) {
        let id = e.target.getAttribute("data-cameraDelete");
        console.log(id);
        $.ajax({
            type: "DELETE",
            url: url + "/" + id,
            success: function () {
                alert("Camera has been deleted");
                showAll();
            },
            error: function () {
                alert("Camera could not be deleted");
            }
        });
    });
    $("#delete_all").click(function() {
        $.ajax({
            type: "DELETE",
            url: url,
            success: function () {
                alert("All cameras have been deleted.");
                showAll();
            },
            error: function () {
                alert("Cameras could not be deleted.");
            }
        });
    });
    $("#result").on("click", "#update", "cameraUpdate", function(e) {
        let idn = e.target.getAttribute("data-cameraUpdate");
        console.log("btn update " + idn);
        globalLens = document.getElementById(idn);
        console.log("globalLens: " + globalLens);
        globalLens = document.getElementById(idn);
        console.log("globalMP: " + globalMP);
        r = "";
        r = `
            <div class="form-group col-md-4 mt-5">
                <input type="text" class="form-control" id="lensUpdate" placeholder="lens ...">
            </div>
            <div class="form-group col-md-4">
                <input type="text" class="form-control" id="aantalMPUpdate" placeholder="amount of megapixels ...">
            </div>
            <div class="form-group col-md-1">
                <button type="button" id="exUpdate" data-executeUpdate='${idn}' class="btn btn-primary">Submit</button>
            </div>
            `;
        $("#result").html(r);

    });
    $("#result" ).on( "click", "#exUpdate", "executeUpdate", function(e) {
        let id = e.target.getAttribute("data-executeUpdate");
        console.log("btn submit " + id);
        let lens = document.getElementById("lensUpdate").value;
        let aantalMP = document.getElementById("aantalMPUpdate").value;

        if(lens == null) {
            lens = globalLens;
        }
        if(aantalMP == null) {
            aantalMP = globalMP;
        }
        let newCamera = JSON.stringify({
            "id" : id,
            "lens" : lens,
            "aantalMP" : aantalMP
        });
        console.log(id);
        $.ajax({
            type: "POST",
            url: url,
            data: newCamera,
            dataType: "text",
            contentType: "application/json",
            success: function () {
                alert("Camera has been updated");
                showAll();
            },
            error: function () {
                alert("Camera could not be updated");
            }
        });
    });
});

