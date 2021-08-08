const d = document,
  $main = d.querySelector("main"),
  $dropZone = d.querySelector(".drop-zone");

const uploader = (file) => {
  const xhr = new XMLHttpRequest(),
    formData = new FormData();

  formData.append("file", file); //Sirve para crear un formulario de manera dinamica

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
    } else {
      let message = xhr.statusText || "Ocurrio un error";
      console.error(`Error ${xhr.status}: ${message}`);
    }
  });

  xhr.open("POST", "PHP/uploader.php");
  xhr.setRequestHeader("enc-type", "multipart/form.data"); //Cabecera para el envio
  xhr.send(formData);
};

const progressUpload = (file) => {
  const $progress = d.createElement("progress"),
    $span = d.createElement("span");

  $progress.value = 0;
  $progress.max = 100;

  $main.insertAdjacentElement("beforeend", $progress);
  $main.insertAdjacentElement("beforeend", $span);

  const fileRedaer = new FileReader(); //Permite detectar los bits que se han cargado
  fileRedaer.readAsDataURL(file);

  fileRedaer.addEventListener("progress", (e) => {
    let progress = parseInt((e.loaded * 100) / e.total);
    $progress.value = progress;
    $span.innerHTML = `<b> ${file.name} - ${progress}%</b>`;
  });

  fileRedaer.addEventListener("loadend", (e) => {
    uploader(file);
    setTimeout(() => {
      $main.removeChild($progress);
      $main.removeChild($span);
    }, 3000);
  });
};

$dropZone.addEventListener("dragover", (e) => {
  e.preventDefault(); //Previene la propagacion del evento
  e.stopPropagation();
  e.target.classList.add("is-active");
});

$dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault(); //Previene la propagacion del evento
  e.stopPropagation();
  e.target.classList.remove("is-active");
});

$dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const files = Array.from(e.dataTransfer.files);
  files.forEach((el) => progressUpload(el));
  e.target.classList.remove("is-active");
});
