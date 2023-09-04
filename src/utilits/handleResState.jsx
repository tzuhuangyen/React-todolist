import Swal from "sweetalert2";

function handleResState(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
}

export default handleResState;
