import axios from "axios";

/**
 * Envía el texto al endpoint externo para generar un PDF.
 * @param texto El texto a convertir en PDF.
 * @returns La respuesta del servidor (el PDF generado).
 */
export async function generarPDF(texto: string): Promise<any> {
    try {
        const data = JSON.stringify({ texto: texto });

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://54.189.63.53:9100/generar_pdf",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        const response = await axios.request(config);

        return response.data;
    } catch (error) {
        // Verificar si el error es una instancia de Error
        if (error instanceof Error) {
            // Manejar errores de Axios
            if (axios.isAxiosError(error)) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                if (error.response) {
                    throw new Error(`Error al generar el PDF: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                }
                // La solicitud fue hecha pero no se recibió respuesta
                else if (error.request) {
                    throw new Error(`Error al generar el PDF: No se recibió respuesta del servidor.`);
                }
                // Ocurrió un error al configurar la solicitud
                else {
                    throw new Error(`Error al generar el PDF: ${error.message}`);
                }
            }
            // Manejar otros errores
            else {
                throw new Error(`Error al generar el PDF: ${error.message}`);
            }
        }
        // Si el error no es una instancia de Error, lanzar un mensaje genérico
        else {
            throw new Error(`Error al generar el PDF: Error desconocido.`);
        }
    }
}
