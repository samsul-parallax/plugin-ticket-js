const RUTA_API = "http://localhost:8000"
const $estado = document.querySelector("#estado"),
    $listaDeImpresoras = document.querySelector("#listaDeImpresoras"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnRefrescarLista = document.querySelector("#btnRefrescarLista"),
    $btnEstablecerImpresora = document.querySelector("#btnEstablecerImpresora"),
    $texto = document.querySelector("#texto"),
    $impresoraSeleccionada = document.querySelector("#impresoraSeleccionada"),
    $btnImprimir = document.querySelector("#btnImprimir");



const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";

$btnLimpiarLog.addEventListener("click", limpiarLog);

const limpiarLista = () => {
    for (let i = $listaDeImpresoras.options.length; i >= 0; i--) {
        $listaDeImpresoras.remove(i);
    }
};

const obtenerListaDeImpresoras = () => {
    loguear("Cargando lista...")
    fetch(RUTA_API + "/impresoras")
        .then(r => r.json())
        .then(listaDeImpresoras => {
            refrescarNombreDeImpresoraSeleccionada();
            loguear("Lista cargada");
            limpiarLista();
            listaDeImpresoras.forEach(nombreImpresora => {
                const option = document.createElement('option');
                option.value = option.text = nombreImpresora;
                $listaDeImpresoras.appendChild(option);
            })
        });
}

const establecerImpresoraComoPredeterminada = nombreImpresora => {
    loguear("Estableciendo impresora...");
    fetch(RUTA_API + "/impresora", {
            method: "PUT",
            body: JSON.stringify(nombreImpresora)
        })
        .then(r => r.json())
        .then(respuesta => {
            refrescarNombreDeImpresoraSeleccionada();
            if (respuesta != nombreImpresora) {
                loguear(`No se pudo establecer la impresora con el nombre ${nombreImpresora}`);
            } else {
                loguear(`Impresora ${nombreImpresora} establecida correctamente`);
            }
        });
};

const refrescarNombreDeImpresoraSeleccionada = () => {
    fetch(RUTA_API + "/impresora")
        .then(r => r.json())
        .then(nombreImpresora => {
            $impresoraSeleccionada.textContent = nombreImpresora;
        });
}


$btnRefrescarLista.addEventListener("click", obtenerListaDeImpresoras);
$btnEstablecerImpresora.addEventListener("click", () => {
    const indice = $listaDeImpresoras.selectedIndex;
    if (indice === -1) return loguear("No hay ninguna impresora seleccionada")
    const opcionSeleccionada = $listaDeImpresoras.options[indice];
    establecerImpresoraComoPredeterminada(opcionSeleccionada.value);
});

$btnImprimir.addEventListener("click", () => {
    let impresora = new Impresora(RUTA_API);
    impresora.setFontSize(1, 1);
    impresora.setEmphasize(0);
    impresora.setAlign("center");
    impresora.write("Parzibyte's blog\n");
    impresora.write("Blog de un programador\n");
    impresora.write("Telefono: 123456789\n");
    impresora.write("Fecha/Hora: 2019-08-01 13:21:22\n");
    impresora.write("--------------------------------\n");
    impresora.write("Venta de plugin para impresora\n");
    impresora.setAlign("right");
    impresora.write("25 USD\n");
    impresora.write("--------------------------------\n");
    impresora.write("TOTAL: 25 USD\n");
    impresora.write("--------------------------------\n");
    impresora.setAlign("center");
    impresora.write("***Gracias por su compra***");
    impresora.end()
        .then(valor => {
            loguear("Al imprimir: " + valor);
        })
});

// En el init, obtenemos la lista
obtenerListaDeImpresoras();
// Y también la impresora seleccionada
refrescarNombreDeImpresoraSeleccionada();