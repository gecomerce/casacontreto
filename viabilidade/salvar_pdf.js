document.addEventListener("DOMContentLoaded", function () {
    const btnPDF = document.getElementById("btn_enviar");

    btnPDF.addEventListener("click", function () {
        const elementoParaPDF = document.getElementById("pdf_content");

        const opcoes = {
            margin: 10,
            filename: 'calculo_viabilidade.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        html2pdf().set(opcoes).from(elementoParaPDF).save();
    });
});
