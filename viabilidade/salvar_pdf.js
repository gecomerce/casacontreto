document.addEventListener("DOMContentLoaded", function () {
    const btnPDF = document.getElementById("btn_enviar");


    btnPDF.addEventListener("click", function () {
        const elementoParaPDF = document.getElementById("loginForm");

        const opcoes = {
            margin: 0.5,
            filename: 'calculo_viabilidade.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opcoes).from(elementoParaPDF).save();
    });
});
