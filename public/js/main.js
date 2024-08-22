const socket = io();

$(document).ready(function () {
  if ($(".infoMessage").is(":empty")) {
    $(".infoMessage").html(
      '<img src="img/loading.gif" style="width: 30px;" />',
    );
  }
});

socket.on("currentAppointment", function (message) {
  $(".infoMessage").text(message.result);
  if (message.isAppointment) {
    $(".subline").show();
  } else {
    $(".subline").hide();
  }
});
